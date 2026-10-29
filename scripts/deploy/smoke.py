"""HTTP sem autenticação: prova a versão servida, não apenas arquivos no disco."""
import json
import time
from html.parser import HTMLParser
from urllib.error import HTTPError
from urllib.request import Request, build_opener, HTTPSHandler, HTTPRedirectHandler
import ssl
from common import DeployError, digest, public_url, require


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def request(url, data=None):
    public_url(url)
    headers = {'User-Agent': 'Blooikos-Deploy-Smoke/1', 'Cache-Control': 'no-cache'}
    if data is not None:
        headers['Content-Type'] = 'application/json'
    opener = build_opener(HTTPSHandler(context=ssl.create_default_context()), NoRedirect())
    try:
        response = opener.open(Request(url, data=data, headers=headers), timeout=10)
    except HTTPError as error:
        response = error
    with response:
        content = response.read(5242881)
        require(len(content) <= 5242880, 'HTTP_BODY_LIMIT')
        return response.status, dict((k.lower(), v) for k, v in response.headers.items()), content


class Shell(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids, self.images, self.robots = [], [], ''

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.append(attrs['id'])
        if tag == 'img':
            self.images.append(attrs)
        if tag == 'meta' and attrs.get('name') == 'robots':
            self.robots = attrs.get('content', '')


def cms_probe(endpoint):
    status, _, body = request(endpoint, b'{"query":"query BlooikosDeployHealth { __typename }"}')
    require(status == 200 and json.loads(body).get('data', {}).get('__typename') == 'RootQuery',
            'CMS_HEALTH_FAILED')
    return {'status': status, 'type': 'RootQuery'}


def smoke(origin, manifest, files, media=True):
    started = time.monotonic()
    status, headers, body = request(origin + '/')
    require(status == 200 and digest(body) == digest(files['index.html']), 'ROOT_RELEASE_MISMATCH')
    require('no-store' in headers.get('cache-control', ''), 'HTML_CACHE_MISMATCH')
    shell = Shell()
    shell.feed(body.decode())
    require({'conteudo', 'quem-somos', 'empresas', 'servicos', 'indicadores', 'contato'} <= set(shell.ids)
            and len(shell.ids) == len(set(shell.ids)) and 'noindex' in shell.robots and
            'nofollow' in shell.robots and len(shell.images) == (3 if manifest.get('content', {}).get('profile') == 'home-hero' else 2), 'SHELL_SMOKE_FAILED')
    status, headers, body = request(origin + '/blooikos-release.json')
    require('no-store' in headers.get('cache-control', '') and (manifest['schemaVersion'] == 1 or 'noindex' in headers.get('x-robots-tag', '')), 'MARKER_CACHE_MISMATCH')
    require(status == 200 and body == files['blooikos-release.json'], 'PUBLIC_RELEASE_MISMATCH')
    status, _, body = request(origin + '/blooikos-route-that-does-not-exist/')
    require(status == 404 and body == files['404.html'], 'HTTP_404_FAILED')
    status, _, _ = request(origin + '/_next/static/blooikos-absent.js')
    require(status == 404, 'ASSET_404_FAILED')
    status, _, _ = request(origin + '/blooikos-static/')
    require(status in (403, 404), 'NAMESPACE_EXPOSED')
    checked = 0
    for name, expected in files.items():
        if not name.startswith('_next/static/'):
            continue
        require(time.monotonic() - started < 90, 'SMOKE_TIMEOUT')
        status, headers, body = request(origin + '/' + name)
        require(status == 200 and digest(body) == digest(expected), 'ASSET_INTEGRITY_FAILED')
        mime = headers.get('content-type', '')
        wanted = {'js': 'javascript', 'css': 'text/css', 'woff2': 'font/woff2', 'woff': 'font/woff'}
        require(wanted.get(name.rsplit('.', 1)[-1], '') in mime, 'ASSET_MIME_FAILED')
        require('immutable' in headers.get('cache-control', '') and
                'max-age=31536000' in headers.get('cache-control', ''), 'ASSET_CACHE_FAILED')
        checked += 1
    images = []
    for src in sorted({img.get('src', '') for img in shell.images}):
        public_url(src)
        try:
            status, headers, body = request(src)
            require(status == 200 and headers.get('content-type', '').split(';')[0] in
                    ('image/png', 'image/jpeg', 'image/webp') and len(body) > 0, 'MEDIA_UNAVAILABLE')
            images.append({'url': src, 'bytes': len(body), 'available': True})
        except Exception:
            if media:
                raise DeployError('MEDIA_UNAVAILABLE') from None
            images.append({'url': src, 'available': False})
    return {'healthy': True, 'assets': checked, 'images': images, 'seconds': round(time.monotonic() - started, 3)}

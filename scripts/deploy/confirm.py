"""Bind fresh public bytes to the verified artifact, without changing marker schema."""
import argparse
import json
import os
import sys
import time
from pathlib import Path
from urllib.error import URLError
from urllib.request import HTTPRedirectHandler, Request, build_opener

from common import DeployError, context, digest, encoded, public_url, require
from package import verify


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def fresh(headers, marker):
    directives = {part.strip().lower() for part in headers.get('Cache-Control', '').split(',')}
    if marker:
        return 'no-store' in directives and 'noindex' in headers.get('X-Robots-Tag', '').lower()
    return 'no-store' in directives or ('no-cache' in directives and 'must-revalidate' in directives)


def fetch(url, limit):
    request = Request(url, headers={'Cache-Control': 'no-cache', 'Accept-Encoding': 'identity',
                                    'User-Agent': 'Blooikos-Publication/1'})
    with build_opener(NoRedirect()).open(request, timeout=10) as response:
        require(response.status == 200, 'PUBLICATION_HTTP_STATUS')
        body = response.read(limit + 1)
        require(len(body) <= limit, 'PUBLICATION_RESPONSE_TOO_LARGE')
        return body, response.headers


def confirm(site, origin, attempts=3):
    """At most 6 requests / 64 seconds; no random cache-busting or redirects."""
    origin = public_url(origin, True)
    for attempt in range(attempts):
        try:
            for name, route in (('blooikos-release.json', '/blooikos-release.json'), ('index.html', '/')):
                body, headers = fetch(origin + route, len(site[name]))
                require(fresh(headers, name.endswith('.json')), 'PUBLICATION_CACHE_POLICY')
                require(body == site[name], 'PUBLICATION_BYTES_MISMATCH')
            return
        except (DeployError, URLError, TimeoutError, OSError):
            if attempt + 1 == attempts:
                raise DeployError('PUBLICATION_UNVERIFIED') from None
            time.sleep(2)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('action', choices=('prepare', 'confirm'))
    action = parser.parse_args().action
    identity = context(os.environ)
    require(identity['operation'] in ('deploy', 'bootstrap'), 'INVALID_OPERATION')
    expected = os.environ.get('EXPECTED_DIGEST', '')
    require(len(expected) == 64 and all(c in '0123456789abcdef' for c in expected), 'INVALID_DIGEST')
    require(Path('.deploy/release.sha256').read_text().strip() == expected, 'PACKAGE_DIGEST_MISMATCH')
    manifest, site = verify(Path('.deploy/release.zip').read_bytes(), expected, identity)
    origin = public_url(os.environ['SITE_ORIGIN'], True)
    require(manifest['siteOrigin'] == origin and manifest['schemaVersion'] == 2, 'PUBLICATION_ORIGIN_MISMATCH')
    if action == 'prepare':
        # Only paths and bytes checked by package.verify reach the transfer directory.
        target = Path('.deploy/extracted')
        require(not target.exists(), 'EXTRACTION_ALREADY_EXISTS')
        target.mkdir(parents=True)
        (target / 'manifest.json').write_bytes(encoded(manifest))
        for name, data in site.items():
            path = target / 'site' / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(data)
            os.chmod(path, 0o644)
            os.utime(path, (315532800, 315532800))
        with open(os.environ['GITHUB_OUTPUT'], 'a') as output:
            output.write(f"index_sha256={digest(site['index.html'])}\nmarker_sha256={digest(site['blooikos-release.json'])}\n")
    else:
        confirm(site, origin)
        print(json.dumps({'code': 'PUBLICATION_CONFIRMED', 'releaseId': manifest['releaseId']}))


if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        print(str(error) if isinstance(error, DeployError) else 'PUBLICATION_UNVERIFIED', file=sys.stderr)
        sys.exit(1)

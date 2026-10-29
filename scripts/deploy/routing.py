"""Única estratégia: releases sob namespace próprio + bloco inicial atômico."""
import re
from common import require

BEGIN = '# BEGIN BLOOIKOS STATIC V1\n'
END = '# END BLOOIKOS STATIC V1\n'
STATIC_POLICY = b'''Options -Indexes -MultiViews
Header always set Cache-Control "no-store, max-age=0"
Header always set X-Robots-Tag "noindex"
Header always set X-Content-Type-Options "nosniff"
AddType text/javascript .js
AddType text/css .css
AddType font/woff2 .woff2
AddType font/woff .woff
'''
LEGACY_STATIC_POLICY = STATIC_POLICY.replace(b'Header always set X-Robots-Tag "noindex"\n', b'')
ASSET_POLICY = LEGACY_STATIC_POLICY.replace(b'no-store, max-age=0', b'public, max-age=31536000, immutable')


def compose(original, release, files, origin):
    require(BEGIN.encode() not in original and END.encode() not in original, 'UNMANAGED_ROUTING_CONFLICT')
    target = f'blooikos-static/releases/{release}'
    public_paths = ['', *[n for n in files if not n.startswith('_next/static/')]]
    public_paths += [n[:-len('index.html')] for n in files if n.endswith('/index.html')]
    public_pattern = '^(?:' + '|'.join(re.escape(n) for n in public_paths) + '|_next/static/.*)$'
    lines = [BEGIN.rstrip(), '<Files "blooikos-release.json">',
             'Header always set X-Robots-Tag "noindex"', '</Files>', 'RewriteEngine On',
             'RewriteRule ^(?:cms|wp-content|\\.well-known)(?:/|$) - [L]',
             'RewriteCond %{HTTPS} !=on',
             f'RewriteRule {public_pattern} {origin}%{{REQUEST_URI}} [R=308,L]',
             'RewriteCond %{ENV:REDIRECT_STATUS} ^$',
             'RewriteRule ^blooikos-static(?:/|$) - [F,L]',
             'RewriteRule ^_next/static/(.*)$ blooikos-static/assets/$1 [END]',
             f'ErrorDocument 404 /{target}/404.html',
             f'RewriteRule ^$ {target}/index.html [END]']
    for name in sorted(files):
        if name.startswith('_next/static/'):
            continue
        lines.append(f'RewriteRule ^{re.escape(name)}$ {target}/{name} [END]')
        if name.endswith('/index.html'):
            path = name[:-len('/index.html')]
            lines.extend([f'RewriteRule ^{re.escape(path)}$ /{path}/ [R=308,L]',
                          f'RewriteRule ^{re.escape(path)}/$ {target}/{name} [END]'])
    # Arquivos existentes fora do frontend conservam o handler/regras anteriores.
    lines.extend(['RewriteCond %{REQUEST_FILENAME} -f [OR]',
                  'RewriteCond %{REQUEST_FILENAME} -d', 'RewriteRule ^ - [L]',
                  'RewriteCond %{DOCUMENT_ROOT}/$1 -d',
                  'RewriteRule ^([^/]+)/ - [L]',
                  'RewriteCond %{HTTPS} !=on',
                  f'RewriteRule ^ {origin}%{{REQUEST_URI}} [R=308,L]',
                  'RewriteRule ^ - [R=404,L]', END.rstrip()])
    return ('\n'.join(lines) + '\n').encode() + original

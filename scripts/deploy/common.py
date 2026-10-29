"""Contrato operacional compartilhado; somente biblioteca padrão Python 3.9+."""
import hashlib
import ipaddress
import json
import os
import re
import stat
import uuid
from pathlib import Path
from urllib.parse import urlsplit

REPOSITORY = 'thaisantos-l/blooikos-frontend'
RELEASE = re.compile(r'[0-9a-f]{40}-[1-9][0-9]*-[1-9][0-9]*\Z')
MAX_BYTES = 5242880
MAX_FILES = 512


class DeployError(Exception):
    """Códigos fechados, sem credenciais ou payload editorial em logs."""


def require(condition, code):
    if not condition:
        raise DeployError(code)


def digest(data):
    return hashlib.sha256(data).hexdigest()


def encoded(value):
    return (json.dumps(value, sort_keys=True, separators=(',', ':'), ensure_ascii=True) + '\n').encode()


def public_url(value, origin=False):
    parsed = urlsplit(value)
    try:
        port = parsed.port
    except ValueError:
        raise DeployError('INVALID_PUBLIC_URL') from None
    require(port is None or 1 <= port <= 65535, 'INVALID_PUBLIC_URL')
    require(parsed.scheme == 'https' and parsed.hostname and not parsed.username and
            not parsed.password and not parsed.fragment, 'INVALID_PUBLIC_URL')
    require(parsed.hostname not in ('localhost',) and not parsed.hostname.endswith(('.localhost', '.local')),
            'INVALID_PUBLIC_HOST')
    try:
        require(ipaddress.ip_address(parsed.hostname).is_global, 'INVALID_PUBLIC_HOST')
    except ValueError:
        pass
    if origin:
        require(parsed.path in ('', '/') and not parsed.query, 'INVALID_SITE_ORIGIN')
    return value.rstrip('/') if origin else value


def context(env):
    require(env.get('GITHUB_REPOSITORY') == REPOSITORY and env.get('GITHUB_REF') == 'refs/heads/main',
            'UNTRUSTED_REF')
    event = env.get('GITHUB_EVENT_NAME')
    require(event in ('push', 'workflow_dispatch'), 'UNTRUSTED_EVENT')
    operation = env.get('DEPLOY_OPERATION') or 'deploy'
    require(operation in ('deploy', 'bootstrap', 'rollback', 'recover', 'resume'), 'INVALID_OPERATION')
    require(event == 'workflow_dispatch' or operation == 'deploy', 'INVALID_EVENT_OPERATION')
    target = env.get('DEPLOY_RELEASE_ID', '')
    if operation == 'rollback':
        require(target == 'initial' or RELEASE.fullmatch(target), 'INVALID_RELEASE_ID')
    else:
        require(not target, 'UNEXPECTED_RELEASE_ID')
    sha = env.get('GITHUB_SHA', '')
    run, attempt = env.get('GITHUB_RUN_ID', ''), env.get('GITHUB_RUN_ATTEMPT', '')
    require(re.fullmatch(r'[0-9a-f]{40}', sha) and re.fullmatch(r'[1-9][0-9]*', run) and
            re.fullmatch(r'[1-9][0-9]*', attempt), 'INVALID_PROVENANCE')
    request = content_request(env, event, operation)
    return dict(contentRequest=request, event=event, operation=operation, target=target, sha=sha, run=run, attempt=attempt,
                releaseId=f'{sha}-{run}-{attempt}', repository=REPOSITORY)


def content_request(env, event, operation):
    values = [env.get(name, '') for name in ('CONTENT_EPOCH', 'CONTENT_VERSION', 'CONTENT_DIGEST', 'CONTENT_REQUEST_ID')]
    if not any(values):
        return None
    require(all(values) and event == 'workflow_dispatch' and operation == 'deploy', 'INVALID_CONTENT_REQUEST')
    uuid_pattern = r'[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}'
    require(re.fullmatch(uuid_pattern, values[0]) and re.fullmatch(r'[1-9][0-9]{0,29}', values[1]) and re.fullmatch(r'[a-f0-9]{64}', values[2]) and re.fullmatch(uuid_pattern, values[3]), 'INVALID_CONTENT_REQUEST')
    return dict(epoch=values[0], contentVersion=values[1], contentDigest=values[2], requestId=values[3])


def safe_path(value):
    require(isinstance(value, str) and re.fullmatch(r'[A-Za-z0-9_./-]+', value) and
            value.startswith('/') and '//' not in value, 'UNSAFE_PATH')
    p = Path(value)
    require(p not in (Path('/'), Path.home()) and len(p.parts) >= 4 and
            all(x not in ('.', '..') for x in value.split('/')[1:]) and
            p.resolve() == p, 'UNSAFE_PATH')
    for item in (p, *p.parents):
        require(not item.is_symlink(), 'SYMLINK_PATH')
    return p


def paths(config):
    root, releases, state, cms = [safe_path(config[k]) for k in ('root', 'releases', 'state', 'cms')]
    require(root.is_dir() and cms.is_dir() and root != cms and cms not in root.parents, 'INVALID_ROOTS')
    require(releases == root / 'blooikos-static' / 'releases', 'INVALID_RELEASES_NAMESPACE')
    require(state not in root.parents and root not in state.parents and
            state not in cms.parents and cms not in state.parents and state != cms and state != root,
            'STATE_NOT_PRIVATE')
    require(cms not in releases.parents and releases not in cms.parents and cms != releases,
            'CMS_PATH_COLLISION')
    require(state.parent.is_dir() and os.access(root, os.W_OK) and os.access(state.parent, os.W_OK),
            'PATH_NOT_WRITABLE')
    return root, releases, state, cms


def file_path(name):
    require(isinstance(name, str) and len(name) <= 240 and
            re.fullmatch(r'[A-Za-z0-9_./-]+', name) and not name.startswith('/') and
            all(s not in ('', '.', '..') and not s.startswith('.') for s in name.split('/')),
            'UNSAFE_MEMBER')
    parts = name.split('/')
    require(not set(parts).intersection({'docs', 'tools', 'src', 'tests', 'contracts', 'node_modules',
                                        'cms', 'wp-content', 'fixtures', 'backups'}), 'FORBIDDEN_MEMBER')
    require(Path(name).suffix in ('.html', '.txt', '.js', '.css', '.woff', '.woff2', '.ico',
                                  '.png', '.jpg', '.jpeg', '.webp', '.svg', '.json'), 'FORBIDDEN_MEMBER')
    return name


def atomic(path, data, mode=0o600):
    """Fsync + rename no mesmo diretório; nunca segue links no destino."""
    path = Path(path)
    require(not any(p.is_symlink() for p in (path, *path.parents)), 'SYMLINK_PATH')
    temp = path.with_name(path.name + '.blooikos-' + uuid.uuid4().hex + '.tmp')
    fd = os.open(temp, os.O_WRONLY | os.O_CREAT | os.O_EXCL, mode)
    try:
        with os.fdopen(fd, 'wb') as handle:
            handle.write(data)
            handle.flush()
            os.fsync(handle.fileno())
        os.chmod(temp, mode)
        os.replace(temp, path)
        directory = os.open(path.parent, os.O_RDONLY)
        try:
            os.fsync(directory)
        finally:
            os.close(directory)
    finally:
        if temp.exists():
            temp.unlink()


def ordinary_file(path):
    require(not any(p.is_symlink() for p in (path, *path.parents)) and stat.S_ISREG(path.lstat().st_mode) and
            path.stat().st_nlink == 1, 'UNSAFE_FILE')

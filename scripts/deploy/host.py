"""Motor remoto. Sem Node, sem build, sem escrita no CMS ou remoção de releases."""
import base64
import fcntl
import json
import os
import shutil
import stat
import time
import uuid
from pathlib import Path
from urllib.request import Request, urlopen
from common import (MAX_BYTES, MAX_FILES, REPOSITORY, DeployError, atomic, digest, encoded, file_path, ordinary_file,
                    paths, public_url, require)
from package import verify
from content import guard as content_guard, current as current_content
from routing import ASSET_POLICY, BEGIN, LEGACY_STATIC_POLICY, STATIC_POLICY, compose
from smoke import cms_probe, request as http_request, smoke


PAUSE_HEADER = b'# BLOOIKOS AUTOMATION PAUSED\nHeader always set X-Blooikos-Automation "paused"\n'


def current_main(token):
    headers = {'Accept': 'application/vnd.github+json', 'User-Agent': 'Blooikos-Deploy/1'}
    if token:
        headers['Authorization'] = 'Bearer ' + token
    url = f'https://api.github.com/repos/{REPOSITORY}/git/ref/heads/main'
    with urlopen(Request(url, headers=headers), timeout=15) as response:
        return json.load(response)['object']['sha']


def read_json(path):
    ordinary_file(path)
    return json.loads(path.read_bytes())


def snapshot(root):
    file = root / '.htaccess'
    if file.exists():
        ordinary_file(file)
        return file.read_bytes(), stat.S_IMODE(file.stat().st_mode), True
    return b'', 0o644, False


def check_root(root, expected):
    body, _, _ = snapshot(root)
    require(digest(body) == expected, 'ROUTING_CHANGED_EXTERNALLY')


def restore(root, data, mode, existed):
    if existed:
        atomic(root / '.htaccess', data, mode)
    elif (root / '.htaccess').exists():
        ordinary_file(root / '.htaccess')
        (root / '.htaccess').unlink()


def lock(state, owner=None):
    path = state / 'publish.lock'
    require(not path.is_symlink(), 'SYMLINK_LOCK')
    handle = open(path, 'a+')
    try:
        fcntl.flock(handle, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except BlockingIOError:
        handle.close()
        raise DeployError('DEPLOY_LOCKED') from None
    handle.seek(0)
    handle.truncate()
    handle.write(json.dumps({'pid': os.getpid(), 'owner': owner, 'acquiredUTC': time.time()}))
    handle.flush()
    os.fsync(handle.fileno())
    # Flock é liberado pelo kernel inclusive após SIGKILL. O diário continua.
    return handle


def save(state, marker, journal=None):
    atomic(state / 'installation.json', encoded(marker))
    if journal is not None:
        atomic(state / 'journal.json', encoded(journal))


def release_files(releases, state, release):
    record = read_json(state / 'versions' / (release + '.json'))
    manifest, files = verify((state / 'packages' / (release + '.zip')).read_bytes(), record['digest'])
    path = releases / release
    require(path.is_dir() and not path.is_symlink(), 'RELEASE_UNAVAILABLE')
    expected = set(files) | {'.htaccess'}
    actual = set()
    for item in path.rglob('*'):
        require(not item.is_symlink(), 'SYMLINK_RELEASE')
        if item.is_file():
            ordinary_file(item)
            actual.add(item.relative_to(path).as_posix())
    policies = (STATIC_POLICY, LEGACY_STATIC_POLICY) if manifest['schemaVersion'] == 1 else (STATIC_POLICY,)
    require(actual == expected and (path / '.htaccess').read_bytes() in policies, 'RELEASE_CHANGED')
    for name, content in files.items():
        require((path / name).read_bytes() == content, 'RELEASE_CHANGED')
    return manifest, files


def preflight(config):
    root, releases, state, cms = paths(config)
    public_url(config['origin'], True)
    public_url(config['endpoint'])
    require(not (root / 'wp-config.php').exists(), 'CMS_ROOT_NOT_ALLOWED')
    require(not (root / '.htaccess').is_symlink(), 'SYMLINK_ROUTING')
    namespace = releases.parent
    if namespace.exists():
        require(state.is_dir() and (state / 'installation.json').is_file(), 'UNOWNED_NAMESPACE')
    if state.exists():
        require(state.is_dir() and stat.S_IMODE(state.stat().st_mode) & 0o077 == 0,
                'STATE_PERMISSIONS')
    return root, releases, state, cms


def stage(releases, state, manifest, files, archive):
    release = manifest['releaseId']
    final = releases / release
    if final.exists():
        existing = read_json(state / 'versions' / (release + '.json'))
        require(existing['digest'] == digest(archive), 'IMMUTABLE_RELEASE_COLLISION')
        release_files(releases, state, release)
        return
    require(shutil.disk_usage(releases).free > len(archive) * 4 + 16777216, 'INSUFFICIENT_SPACE')
    candidate = releases / ('.candidate-' + release + '-' + uuid.uuid4().hex)
    candidate.mkdir(mode=0o755)
    assets = releases.parent / 'assets'
    # Primeiro confere TODAS as colisões, antes de adicionar qualquer asset.
    for name, content in files.items():
        if name.startswith('_next/static/'):
            dest = assets / name[len('_next/static/'):]
            require(not dest.is_symlink(), 'SYMLINK_ASSET')
            if dest.exists():
                ordinary_file(dest)
                require(dest.read_bytes() == content, 'IMMUTABLE_ASSET_COLLISION')
    for name, content in files.items():
        dest = candidate / name
        dest.parent.mkdir(parents=True, exist_ok=True)
        atomic(dest, content, 0o644)
        if name.startswith('_next/static/'):
            asset = assets / name[len('_next/static/'):]
            for parent in (asset.parent, *asset.parent.parents):
                require(not parent.is_symlink(), 'SYMLINK_ASSET')
                if parent == assets:
                    break
            asset.parent.mkdir(parents=True, exist_ok=True)
            if not asset.exists():
                atomic(asset, content, 0o644)
    atomic(candidate / '.htaccess', STATIC_POLICY, 0o644)
    atomic(state / 'packages' / (release + '.zip'), archive)
    atomic(state / 'versions' / (release + '.json'), encoded({'digest': digest(archive), 'healthy': False}))
    os.rename(candidate, final)


def retain_initial_assets(root, assets):
    """Mantém chunks da exportação direta anterior sem alterar sua origem."""
    source = root / '_next' / 'static'
    if not source.exists():
        return
    require(not any(p.is_symlink() for p in (source, source.parent)), 'SYMLINK_INITIAL_ASSET')
    rows, total = [], 0
    for item in sorted(source.rglob('*')):
        require(not item.is_symlink(), 'SYMLINK_INITIAL_ASSET')
        if item.is_dir():
            continue
        ordinary_file(item)
        relative = item.relative_to(source).as_posix()
        file_path('_next/static/' + relative)
        total += item.stat().st_size
        require(total <= MAX_BYTES and len(rows) < MAX_FILES, 'INITIAL_ASSET_LIMIT')
        data = item.read_bytes()
        destination = assets / relative
        require(not any(p.is_symlink() for p in (destination, *destination.parents)), 'SYMLINK_ASSET')
        if destination.exists():
            ordinary_file(destination)
            require(destination.read_bytes() == data, 'IMMUTABLE_ASSET_COLLISION')
        rows.append((destination, data))
    for destination, data in rows:
        destination.parent.mkdir(parents=True, exist_ok=True)
        if not destination.exists():
            atomic(destination, data, 0o644)


def initial_health(config, marker):
    status, _, body = http_request(config['origin'] + '/')
    require(status == marker['initialHTTP']['status'] and digest(body) == marker['initialHTTP']['sha256'],
            'INITIAL_RECOVERY_HTTP_UNCERTAIN')
    return {'initialRestored': True, 'status': status}


def recover(config, root, releases, state, marker):
    journal_path = state / 'journal.json'
    if not journal_path.exists():
        return marker
    journal = read_json(journal_path)
    if journal['status'] not in ('prepared', 'verified', 'promoting', 'recovery_required'):
        return marker
    current, _, _ = snapshot(root)
    require(digest(current) in (journal['beforeHash'], journal.get('afterHash'), journal.get('recoveryHash')), 'RECOVERY_ROUTING_CONFLICT')
    if journal.get('operation') == 'resume':
        marker['automaticPaused'] = journal['previousPause']
    old = base64.b64decode(journal['before'])
    if marker.get('automaticPaused') and not old.startswith(PAUSE_HEADER):
        old = PAUSE_HEADER + old
    journal['recoveryHash'] = digest(old)
    save(state, marker, journal)
    restore(root, old, journal['beforeMode'], journal['beforeExisted'] or bool(marker.get('automaticPaused')))
    marker['active'] = journal['previous']
    marker['routeHash'] = digest(old)
    journal['status'] = 'recovery_required'
    save(state, marker, journal)
    if marker['active']:
        manifest, files = release_files(releases, state, marker['active'])
        journal['recoverySmoke'] = smoke(config['origin'], manifest, files, media=False)
    else:
        journal['recoverySmoke'] = initial_health(config, marker)
    journal['status'] = 'rolled_back'
    save(state, marker, journal)
    return marker


def run(config, identity, archive=None, expected_digest=None, token='', main_reader=current_main):
    root, releases, state, _ = preflight(config)
    operation = identity['operation']
    marker_path = state / 'installation.json'
    # Falha de pacote/proveniência/configuração precede a primeira escrita remota.
    manifest = files = None
    if operation in ('deploy', 'bootstrap'):
        manifest, files = verify(archive, expected_digest, identity)
        require(manifest['siteOrigin'] == config['origin'] and manifest['graphqlEndpoint'] == config['endpoint'],
                'CONFIG_PROVENANCE_MISMATCH')
    if operation in ('deploy', 'bootstrap'):
        require(manifest['schemaVersion'] == 2, 'CONTENT_PROTOCOL_REQUIRED')
    if operation != 'bootstrap':
        require(marker_path.is_file(), 'BOOTSTRAP_REQUIRED')
    elif not marker_path.exists():
        require(not state.exists() and not releases.parent.exists() ,
                'BOOTSTRAP_NAMESPACE_EXISTS')
        current, _, _ = snapshot(root)
        require(digest(current) == config.get('bootstrapHash'), 'BOOTSTRAP_REVIEW_REQUIRED')
        require(BEGIN.encode() not in current, 'UNOWNED_ROUTING_BLOCK')
    # Provisiona o estado completo por rename; queda na inicialização não deixa
    # um diretório final sem marcador que impeça a próxima tentativa.
    if not marker_path.exists():
        before, mode, existed = snapshot(root)
        require(digest(before) == config.get('bootstrapHash'), 'BOOTSTRAP_REVIEW_REQUIRED')
        require(main_reader(token) == identity['sha'], 'STALE_MAIN')
        status, _, body = http_request(config['origin'] + '/')
        require(status == 200, 'INITIAL_SITE_UNAVAILABLE')
        marker = dict(layout=1, config=config, original=base64.b64encode(before).decode(),
                      originalMode=mode, originalExisted=existed, active=None, previous=None,
                      routeHash=digest(before), highWater=0, highAttempt=0,
                      initialHTTP={'status': status, 'sha256': digest(body)}, healthy=[],
                      initialInventory=[{'name': p.name, 'mode': stat.S_IMODE(p.lstat().st_mode),
                                         'directory': p.is_dir(), 'symlink': p.is_symlink()}
                                        for p in sorted(root.iterdir())])
        pending = state.with_name(state.name + '.init-' + uuid.uuid4().hex)
        pending.mkdir(mode=0o700)
        save(pending, marker)
        os.rename(pending, state)
    with lock(state, identity):
        marker = read_json(marker_path)
        require(marker['layout'] == 1 and {**marker['config'], 'versionUrl': config['versionUrl']} == config, 'INSTALLATION_CONFIG_MISMATCH')
        marker['config'] = config
        require(main_reader(token) == identity['sha'], 'STALE_MAIN')
        marker = recover(config, root, releases, state, marker)
        if operation == 'recover':
            return {'status': 'recovered', 'active': marker['active']}
        check_root(root, marker['routeHash'])
        require((int(identity['run']), int(identity['attempt'])) >=
                (marker['highWater'], marker.get('highAttempt', 0)), 'STALE_RUN')
        if operation == 'resume':
            require(identity.get('event') == 'workflow_dispatch' and not identity.get('contentRequest'), 'MANUAL_RESUME_REQUIRED')
            current_version = current_content(config['versionUrl'])
            before, mode, existed = snapshot(root)
            after = before.replace(PAUSE_HEADER, b'')
            journal = dict(status='promoting', operation='resume', owner=identity,
                           previous=marker['active'], candidate=marker['active'],
                           previousPause=bool(marker.get('automaticPaused')), before=base64.b64encode(before).decode(),
                           beforeHash=digest(before), afterHash=digest(after), beforeMode=mode, beforeExisted=existed)
            save(state, marker, journal)
            try:
                restore(root, after, mode, existed)
                marker['acceptedEpoch'] = current_version['epoch']
                marker['automaticPaused'] = False
                marker['highWater'] = int(identity['run'])
                marker['highAttempt'] = int(identity['attempt'])
                marker['routeHash'] = digest(after)
                journal['status'] = 'healthy'
                save(state, marker, journal)
            except Exception:
                recover(config, root, releases, state, marker)
                raise DeployError('RESUME_FAILED_RECOVERED') from None
            return {'status': 'automation-resumed', 'active': marker['active']}
        if operation in ('deploy', 'bootstrap'):
            if marker['active'] is None:
                initial_health(config, marker)
            duplicate = content_guard(config, manifest, marker, identity)
            if duplicate:
                old_manifest, old_files = release_files(releases, state, duplicate)
                result = smoke(config['origin'], old_manifest, old_files)
                return {'status': 'already-published', 'active': duplicate, 'smoke': result}
        if operation == 'rollback':
            marker['automaticPaused'] = True
            save(state, marker)
        require((int(identity['run']), int(identity['attempt'])) >=
                (marker['highWater'], marker.get('highAttempt', 0)), 'STALE_RUN')
        require(main_reader(token) == identity['sha'], 'STALE_MAIN')
        if operation == 'bootstrap' and marker['active']:
            require(marker['active'] == identity['releaseId'], 'ALREADY_BOOTSTRAPPED')
        releases.mkdir(parents=True, exist_ok=True)
        assets = releases.parent / 'assets'
        assets.mkdir(exist_ok=True)
        for name in ('versions', 'packages'):
            (state / name).mkdir(mode=0o700, exist_ok=True)
        if not (assets / '.htaccess').exists():
            atomic(assets / '.htaccess', ASSET_POLICY, 0o644)
        require((assets / '.htaccess').read_bytes() == ASSET_POLICY, 'ASSET_POLICY_CHANGED')
        previous = marker['active']
        target = identity['target'] if operation == 'rollback' else identity['releaseId']
        if operation == 'rollback' and target != 'initial':
            record = read_json(state / 'versions' / (target + '.json'))
            require(record['healthy'], 'ROLLBACK_NOT_HEALTHY')
            manifest, files = release_files(releases, state, target)
        before, mode, existed = snapshot(root)
        journal = dict(status='prepared', owner=identity, previous=previous, candidate=target,
                       before=base64.b64encode(before).decode(), beforeHash=digest(before),
                       beforeMode=mode, beforeExisted=existed, time=time.time())
        marker['highWater'] = int(identity['run'])
        marker['highAttempt'] = int(identity['attempt'])
        save(state, marker, journal)
        cms_before = None
        try:
            if operation != 'rollback':
                cms_before = cms_probe(config['endpoint'])
                if marker['active'] is None:
                    retain_initial_assets(root, assets)
                stage(releases, state, manifest, files, archive)
            original = base64.b64decode(marker['original'])
            after = original if target == 'initial' else compose(original, target, files, config['origin'])
            if marker.get('automaticPaused'):
                after = PAUSE_HEADER + after
            journal.update(status='verified', afterHash=digest(after))
            save(state, marker, journal)
            # Último gate sob lock, após upload e imediatamente antes do rename.
            require(main_reader(token) == identity['sha'], 'STALE_MAIN')
            check_root(root, marker['routeHash'])
            if operation in ('deploy', 'bootstrap'):
                content_guard(config, manifest, marker, identity)
            journal['status'] = 'promoting'
            save(state, marker, journal)
            restore(root, after, marker['originalMode'], target != 'initial' or marker['originalExisted'])
            result = (initial_health(config, marker) if target == 'initial' else
                      smoke(config['origin'], manifest, files, media=operation != 'rollback'))
            if cms_before:
                require(cms_probe(config['endpoint']) == cms_before, 'CMS_CHANGED')
            if target != 'initial':
                record = read_json(state / 'versions' / (target + '.json'))
                record['healthy'] = True
                atomic(state / 'versions' / (target + '.json'), encoded(record))
            marker.update(active=None if target == 'initial' else target, previous=previous, routeHash=digest(after))
            if target != 'initial' and target not in marker['healthy']:
                marker['healthy'].append(target)
            if operation in ('deploy', 'bootstrap'):
                marker['highestContent'] = manifest['content']
                marker['acceptedEpoch'] = manifest['content']['epoch']
                if manifest.get('requestId'):
                    marker.setdefault('publishedRequests', {})[manifest['requestId']] = target
            journal.update(status='healthy', smoke=result)
            save(state, marker, journal)
            return {'status': 'healthy', 'active': marker['active'], 'smoke': result,
                    'retained': len(marker['healthy']), 'freeBytes': shutil.disk_usage(releases).free}
        except Exception as error:
            journal['failure'] = str(error) if isinstance(error, DeployError) else 'OPERATION_FAILED'
            save(state, marker, journal)
            # Nunca mascara o erro inicial; rollback pode falhar e deixar diário recuperável.
            try:
                marker = recover(config, root, releases, state, marker)
            except Exception:
                journal['status'] = 'recovery_required'
                save(state, marker, journal)
                raise DeployError('RECOVERY_REQUIRED') from None
            raise DeployError('PUBLICATION_FAILED_RECOVERED') from None


def plan(config, archive=None, expected_digest=None, identity=None):
    root, releases, state, cms = preflight(config)
    body, mode, existed = snapshot(root)
    result = {'strategy': 'htaccess-v1', 'paths': config, 'routingHash': digest(body),
            'routingMode': mode, 'routingExisted': existed, 'bootstrapRequired': not (state / 'installation.json').exists(),
            'freeBytes': shutil.disk_usage(root).free, 'cmsRootConfirmed': str(cms),
            'routingBefore': body.decode('utf-8'), 'python': list(__import__('sys').version_info[:3])}
    original = body
    if (state / 'installation.json').exists():
        installation = read_json(state / 'installation.json')
        original = base64.b64decode(installation['original'])
        result['active'] = installation['active']
        if installation['active'] is None:
            status, _, response = http_request(config['origin'] + '/')
            result['observedInitialHTTP'] = {'status': status, 'sha256': digest(response)}
            result['storedInitialHTTP'] = installation['initialHTTP']
            result['initialBaselineMatches'] = result['observedInitialHTTP'] == result['storedInitialHTTP']
    result['legacyStaticFiles'] = sum(1 for p in (root / '_next' / 'static').rglob('*') if p.is_file())
    if archive:
        manifest, files = verify(archive, expected_digest, identity)
        after = compose(original, manifest['releaseId'], files, config['origin'])
        import difflib
        result['routingDiff'] = ''.join(difflib.unified_diff(body.decode().splitlines(True), after.decode().splitlines(True), fromfile='.htaccess-before', tofile='.htaccess-after'))
        result['releaseId'] = manifest['releaseId']
    return result

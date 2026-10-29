"""Pacote determinístico de um export previamente verificado; sem extrair ZIP arbitrário."""
import io
import json
import os
import re
import stat
import sys
import zipfile
from datetime import datetime, timezone
from pathlib import Path
from content import metadata
from common import (MAX_BYTES, MAX_FILES, RELEASE, DeployError, context, digest, encoded,
                    file_path, ordinary_file, public_url, require)


def verify(data, expected_digest=None, expected=None):
    require(len(data) <= MAX_BYTES * 2, 'PACKAGE_TOO_LARGE')
    if expected_digest:
        require(digest(data) == expected_digest, 'PACKAGE_DIGEST_MISMATCH')
    files = {}
    with zipfile.ZipFile(io.BytesIO(data)) as archive:
        infos = archive.infolist()
        require(0 < len(infos) <= MAX_FILES + 1, 'PACKAGE_FILE_LIMIT')
        require(sum(x.file_size for x in infos) <= MAX_BYTES + 250000, 'PACKAGE_SIZE_LIMIT')
        for entry in infos:
            name = entry.filename
            require(name not in files and not entry.is_dir() and
                    stat.S_ISREG(entry.external_attr >> 16), 'INVALID_ZIP_ENTRY')
            require(name == 'manifest.json' or name.startswith('site/'), 'INVALID_ZIP_ENTRY')
            if name.startswith('site/'):
                file_path(name[5:])
            require(entry.compress_type == zipfile.ZIP_STORED and not entry.flag_bits & 1,
                    'INVALID_ZIP_ENCODING')
            files[name] = archive.read(entry)
    manifest = json.loads(files.pop('manifest.json'))
    require(manifest['schemaVersion'] in (1, 2) and manifest['contractVersion'] == '1.0.0' and
            manifest['repository'] == 'thaisantos-l/blooikos-frontend' and
            RELEASE.fullmatch(manifest['releaseId']), 'INVALID_MANIFEST')
    require(manifest['releaseId'] == f"{manifest['commitSHA']}-{manifest['runId']}-{manifest['attempt']}",
            'INVALID_PROVENANCE')
    if expected:
        for k, m in [('sha', 'commitSHA'), ('run', 'runId'), ('attempt', 'attempt'), ('releaseId', 'releaseId')]:
            require(expected[k] == manifest[m], 'ARTIFACT_PROVENANCE_MISMATCH')
    if manifest['schemaVersion'] == 2:
        metadata(manifest['content'])
        from content import UUID
        require(manifest['requestId'] is None or (isinstance(manifest['requestId'], str) and UUID.fullmatch(manifest['requestId'])), 'INVALID_REQUEST_ID')
        require(manifest['protocolVersion'] == '1', 'INVALID_PROTOCOL')
        if expected:
            require(manifest['requestId'] == (expected.get('contentRequest') or {}).get('requestId'), 'CONTENT_REQUEST_MISMATCH')
        if expected and expected.get('contentRequest'):
            requested = expected['contentRequest']
            require(manifest['requestId'] == requested['requestId'] and all(manifest['content'][k] == requested[k] for k in ('epoch','contentVersion','contentDigest')), 'CONTENT_REQUEST_MISMATCH')
    rows = manifest['files']
    require(len(rows) == len(files) and len({x['path'] for x in rows}) == len(rows), 'MANIFEST_MISMATCH')
    for row in rows:
        name = file_path(row['path'])
        content = files.get('site/' + name)
        require(content is not None and len(content) == row['bytes'] and digest(content) == row['sha256'],
                'FILE_DIGEST_MISMATCH')
    require(sum(x['bytes'] for x in rows) == manifest['totalBytes'] <= MAX_BYTES, 'PACKAGE_SIZE_LIMIT')
    site = {k[5:]: v for k, v in files.items()}
    require({'index.html', '404.html', 'blooikos-release.json'} <= site.keys(), 'INCOMPLETE_EXPORT')
    require(json.loads(site['blooikos-release.json']) == {
        k: manifest[k] for k in marker_fields(manifest)}, 'RELEASE_MARKER_MISMATCH')
    return manifest, site


def marker_fields(manifest):
    return ('releaseId', 'commitSHA', 'buildUTC') + (('schemaVersion', 'protocolVersion', 'content', 'requestId', 'runId', 'attempt') if manifest['schemaVersion'] == 2 else ())


def package(root, identity, build_utc, origin, endpoint, snapshot=None):
    datetime.strptime(build_utc, '%Y-%m-%dT%H:%M:%SZ')
    files = {}
    require(not root.is_symlink(), 'UNSAFE_OUTPUT')
    for path in sorted(root.rglob('*')):
        require(not path.is_symlink(), 'SYMLINK_EXPORT')
        if path.is_dir():
            continue
        ordinary_file(path)
        name = file_path(path.relative_to(root).as_posix())
        content = path.read_bytes()
        require(not re.search(rb'PRIVATE KEY|HOSTINGER_SSH_KEY|SECRET_SENTINEL|/Applications/XAMPP', content),
                'PRIVATE_CONTENT')
        files[name] = content
    require('blooikos-release.json' not in files, 'STALE_RELEASE_MARKER')
    manifest = dict(schemaVersion=1, contractVersion='1.0.0', repository=identity['repository'],
                    releaseId=identity['releaseId'], commitSHA=identity['sha'], runId=identity['run'],
                    attempt=identity['attempt'], buildUTC=build_utc,
                    siteOrigin=public_url(origin, True), graphqlEndpoint=public_url(endpoint))
    if snapshot is not None:
        require(snapshot['endpoint'] == endpoint and snapshot['siteOrigin'] == origin and all(snapshot[k] == identity[k] for k in ('sha','run','attempt')), 'SNAPSHOT_PROVENANCE_MISMATCH')
        manifest.update(schemaVersion=2, protocolVersion='1', content=metadata(snapshot['content']), requestId=snapshot['requestId'])
    files['blooikos-release.json'] = encoded({k: manifest[k] for k in marker_fields(manifest)})
    manifest['files'] = [dict(path=k, bytes=len(v), sha256=digest(v)) for k, v in sorted(files.items())]
    manifest['totalBytes'] = sum(len(v) for v in files.values())
    output = io.BytesIO()
    with zipfile.ZipFile(output, 'w', compression=zipfile.ZIP_STORED) as archive:
        for name, data in [('manifest.json', encoded(manifest)), *[('site/' + k, v) for k, v in sorted(files.items())]]:
            entry = zipfile.ZipInfo(name, (1980, 1, 1, 0, 0, 0))
            entry.create_system = 3
            entry.external_attr = (stat.S_IFREG | 0o644) << 16
            archive.writestr(entry, data)
    data = output.getvalue()
    verify(data, expected=identity)
    return data


def main():
    identity = context(os.environ)
    require(identity['operation'] in ('deploy', 'bootstrap'), 'PACKAGE_NOT_NEEDED')
    snapshot_path = Path('.build-snapshot/poc.json')
    ordinary_file(snapshot_path)
    require(snapshot_path.stat().st_size <= 2097152 and snapshot_path.stat().st_mode & 0o077 == 0, 'UNSAFE_SNAPSHOT')
    snapshot = json.loads(snapshot_path.read_bytes())
    from content import canonical
    require(digest(canonical(snapshot['data']).encode()) == metadata(snapshot['content'])['dataDigest'], 'SNAPSHOT_DIGEST_MISMATCH')
    data = package(Path('out'), identity, os.environ['DEPLOY_BUILD_UTC'],
                   os.environ['SITE_ORIGIN'], os.environ['WORDPRESS_GRAPHQL_URL'], snapshot)
    output = Path('.deploy')
    output.mkdir(exist_ok=True)
    require(not output.is_symlink(), 'UNSAFE_OUTPUT')
    (output / 'release.zip').write_bytes(data)
    (output / 'release.sha256').write_text(digest(data) + '\n')
    if os.environ.get('GITHUB_OUTPUT'):
        with open(os.environ['GITHUB_OUTPUT'], 'a') as handle:
            handle.write(f"digest={digest(data)}\nrelease={identity['releaseId']}\n")
    print(json.dumps(dict(release=identity['releaseId'], bytes=len(data), sha256=digest(data))))


if __name__ == '__main__':
    try:
        main()
    except (DeployError, KeyError, ValueError, OSError, zipfile.BadZipFile) as error:
        print(str(error) if isinstance(error, DeployError) else 'PACKAGE_FAILED', file=sys.stderr)
        sys.exit(1)

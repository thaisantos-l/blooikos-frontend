"""Select an immutable, trusted build artifact. Never build or connect to SSH."""
import io
import json
import os
import re
import sys
import zipfile
from datetime import datetime, timezone
from pathlib import Path
from urllib.error import HTTPError
from urllib.parse import urlsplit
from urllib.request import Request, build_opener

from common import REPOSITORY, DeployError, context, digest, require
from confirm import NoRedirect
from package import verify

WORKFLOW = '.github/workflows/build-production.yml'


def selection(run, artifact, main, deployment, workflow_id, operation):
    require(operation in ('deploy', 'rollback'), 'INVALID_OPERATION')
    require(run['repository']['full_name'] == REPOSITORY and run['head_repository']['full_name'] == REPOSITORY,
            'UNTRUSTED_REPOSITORY')
    require(run['path'] == WORKFLOW and run['workflow_id'] == workflow_id and run['head_branch'] == 'main' and
            run['event'] in ('push', 'workflow_dispatch'), 'UNTRUSTED_BUILD')
    require(run['status'] == 'completed' and run['conclusion'] == 'success', 'BUILD_NOT_SUCCESSFUL')
    require(deployment['sha'] == main, 'STALE_DEPLOYMENT')
    require(operation == 'rollback' or run['head_sha'] == main, 'STALE_BUILD')
    sha, run_id, attempt = run['head_sha'], str(run['id']), str(run['run_attempt'])
    require(re.fullmatch(r'[a-f0-9]{40}', sha) and re.fullmatch(r'[1-9][0-9]*', attempt), 'INVALID_BUILD_IDENTITY')
    require(artifact['workflow_run']['id'] == run['id'] and artifact['workflow_run']['head_sha'] == sha and
            artifact['workflow_run']['head_branch'] == 'main' and artifact['name'] == f'blooikos-{sha}-{run_id}-{attempt}',
            'ARTIFACT_BUILD_MISMATCH')
    require(not artifact['expired'] and datetime.fromisoformat(artifact['expires_at'].replace('Z', '+00:00')) > datetime.now(timezone.utc), 'ARTIFACT_EXPIRED')
    require(re.fullmatch(r'sha256:[a-f0-9]{64}', artifact.get('digest', '')) and 0 < artifact['size_in_bytes'] <= 12000000, 'ARTIFACT_DIGEST_REQUIRED')
    return dict(sha=sha, run=run_id, attempt=attempt, releaseId=f'{sha}-{run_id}-{attempt}', contentRequest=None,
                operation='deploy', repository=REPOSITORY, event=run['event'], target='')


def api(path):
    require(path.startswith('/') and '?' not in path, 'INVALID_API_PATH')
    request = Request(f'https://api.github.com/repos/{REPOSITORY}{path}', headers={
        'Authorization': 'Bearer ' + os.environ['GH_TOKEN'], 'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2026-03-10', 'User-Agent': 'Blooikos-Code-Deploy/2'})
    with build_opener(NoRedirect()).open(request, timeout=15) as response:
        require(response.status == 200, 'BUILD_METADATA_UNAVAILABLE')
        body = response.read(2097153)
        require(len(body) <= 2097152, 'BUILD_METADATA_TOO_LARGE')
        return json.loads(body)


def download(artifact_id):
    request = Request(f'https://api.github.com/repos/{REPOSITORY}/actions/artifacts/{artifact_id}/zip', headers={
        'Authorization': 'Bearer ' + os.environ['GH_TOKEN'], 'Accept': 'application/vnd.github+json'})
    try:
        build_opener(NoRedirect()).open(request, timeout=15)
        raise DeployError('ARTIFACT_REDIRECT_REQUIRED')
    except HTTPError as response:
        require(response.code == 302, 'ARTIFACT_DOWNLOAD_FAILED')
        target = response.headers['Location']
    url = urlsplit(target)
    require(url.scheme == 'https' and not url.username and not url.password and not url.fragment and
            (url.hostname.endswith('.blob.core.windows.net') or url.hostname.endswith('.actions.githubusercontent.com')),
            'UNTRUSTED_ARTIFACT_DOWNLOAD')
    # The GitHub credential never accompanies the signed storage URL.
    with build_opener(NoRedirect()).open(Request(target), timeout=30) as response:
        require(response.status == 200, 'ARTIFACT_DOWNLOAD_FAILED')
        body = response.read(12000001)
        require(len(body) <= 12000000, 'ARTIFACT_TOO_LARGE')
        return body


def main():
    deployment = context({**os.environ, 'DEPLOY_OPERATION': 'deploy', 'DEPLOY_RELEASE_ID': ''})
    require(deployment['event'] == 'workflow_dispatch' and deployment['contentRequest'] is None, 'EXPLICIT_CODE_DEPLOY_REQUIRED')
    run_id, artifact_id = os.environ['BUILD_RUN_ID'], os.environ['BUILD_ARTIFACT_ID']
    require(all(re.fullmatch(r'[1-9][0-9]{0,19}', value) for value in (run_id, artifact_id)), 'INVALID_ARTIFACT_SELECTION')
    run = api('/actions/runs/' + run_id)
    artifact = api('/actions/artifacts/' + artifact_id)
    require(str(run['id']) == run_id and str(artifact['id']) == artifact_id, 'ARTIFACT_SELECTION_MISMATCH')
    main_sha = api('/git/ref/heads/main')['object']['sha']
    workflow_id = api('/actions/workflows/build-production.yml')['id']
    operation = os.environ.get('CODE_OPERATION', 'deploy')
    identity = selection(run, artifact, main_sha, deployment, workflow_id, operation)
    if operation == 'rollback':
        require(api('/compare/' + identity['sha'] + '...' + main_sha)['status'] in ('ahead', 'identical'), 'BUILD_NOT_IN_MAIN')
    outer = download(artifact_id)
    require('sha256:' + digest(outer) == artifact['digest'], 'ARTIFACT_DIGEST_MISMATCH')
    with zipfile.ZipFile(io.BytesIO(outer)) as archive:
        entries = archive.infolist()
        require(len(entries) == 2 and {item.filename for item in entries} == {'release.zip', 'release.sha256'} and
                all(not item.is_dir() and not item.flag_bits & 1 for item in entries) and
                sum(item.file_size for item in entries) <= 10500000, 'INVALID_ARTIFACT_FILES')
        package = archive.read('release.zip')
        package_hash = archive.read('release.sha256').decode('ascii').strip()
    require(re.fullmatch(r'[a-f0-9]{64}', package_hash), 'INVALID_PACKAGE_DIGEST')
    manifest, _ = verify(package, package_hash, identity)
    require(manifest['schemaVersion'] == 2 and manifest['requestId'] is None, 'EDITORIAL_ARTIFACT_REJECTED')
    # Recheck latest run attempt and main after download, before exposing files to SSH.
    require(api('/actions/runs/' + run_id) == run, 'BUILD_CHANGED_DURING_SELECTION')
    require(api('/git/ref/heads/main')['object']['sha'] == main_sha, 'MAIN_CHANGED_DURING_SELECTION')
    output = Path('.deploy')
    require(not output.exists(), 'DEPLOY_DIRECTORY_EXISTS')
    output.mkdir(mode=0o700)
    (output / 'release.zip').write_bytes(package)
    (output / 'release.sha256').write_text(package_hash + '\n')
    proof = dict(identity=identity, digest=package_hash, artifactId=artifact_id, artifactDigest=artifact['digest'],
                 deploymentRunId=deployment['run'], deploymentAttempt=deployment['attempt'], deploymentSHA=deployment['sha'])
    (output / 'selected-build.json').write_text(json.dumps(proof))
    print(json.dumps({**{k: proof[k] for k in ('artifactId', 'artifactDigest', 'deploymentRunId', 'deploymentAttempt')},
                      'buildRunId': identity['run'], 'buildAttempt': identity['attempt'], 'commit': identity['sha'], 'packageDigest': package_hash}))


if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        print(str(error) if isinstance(error, DeployError) else 'ARTIFACT_SELECTION_FAILED', file=sys.stderr)
        sys.exit(1)

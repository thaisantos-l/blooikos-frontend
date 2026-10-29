"""Entradas do workflow e transporte SSH estrito; nunca imprime configuração secreta."""
import base64
import json
import os
import re
import subprocess
import sys
import tempfile
from pathlib import Path
from common import DeployError, context, public_url, require
from package import verify

MODULES = ('common', 'package', 'routing', 'smoke', 'host')
# Código fixo; módulos operacionais do checkout confiável carregados somente em memória.
LAUNCHER = '''import sys,json,types,base64
p=json.load(sys.stdin)
try:
 for name in ('common','package','routing','smoke','host'):
  m=types.ModuleType(name);sys.modules[name]=m;exec(compile(p['modules'][name],name+'.py','exec'),m.__dict__)
 if p['action']=='plan':
  result=sys.modules['host'].plan(p['config'],base64.b64decode(p['archive']) if p['archive'] else None,p['digest'],p['identity'])
 else:
  result=sys.modules['host'].run(p['config'],p['identity'],base64.b64decode(p['archive']) if p['archive'] else None,p['digest'],p['token'])
 print(json.dumps(result))
except Exception as e:
 print(str(e) if type(e).__name__=='DeployError' else 'REMOTE_OPERATION_FAILED',file=sys.stderr)
 sys.exit(1)
'''


def configuration(env, planning=False):
    require(re.fullmatch(r'[a-zA-Z0-9][a-zA-Z0-9.-]{0,252}', env.get('HOSTINGER_HOST', '')), 'INVALID_SSH_HOST')
    require(re.fullmatch(r'[a-zA-Z0-9_][a-zA-Z0-9_-]{0,63}', env.get('HOSTINGER_USER', '')), 'INVALID_SSH_USER')
    port = env.get('HOSTINGER_PORT', '')
    require(port.isdecimal() and 1 <= int(port) <= 65535, 'INVALID_SSH_PORT')
    require(env.get('HOSTINGER_SSH_KEY') and env.get('HOSTINGER_KNOWN_HOSTS'), 'SSH_CREDENTIALS_MISSING')
    names = dict(root='HOSTINGER_PATH', releases='HOSTINGER_RELEASES_PATH', state='HOSTINGER_STATE_PATH',
                 cms='HOSTINGER_CMS_PATH', bootstrapHash='HOSTINGER_BOOTSTRAP_SHA256')
    config = {k: env.get(v, '') for k, v in names.items()}
    require(all(config[k] for k in ('root', 'releases', 'state', 'cms')) and
            (planning or re.fullmatch(r'[0-9a-f]{64}', config['bootstrapHash'])), 'DESTINATION_CONFIG_MISSING')
    config.update(origin=public_url(env.get('SITE_ORIGIN', ''), True),
                  endpoint=public_url(env.get('WORDPRESS_GRAPHQL_URL', '')))
    # Sintaxe antes de qualquer conexão; canonicidade é conferida no host.
    for k in ('root', 'releases', 'state', 'cms'):
        require(re.fullmatch(r'/[A-Za-z0-9_./-]+', config[k]) and
                not any(x in ('', '.', '..') for x in config[k].split('/')[1:]), 'UNSAFE_PATH')
    return config


def ssh(env, payload):
    import shlex
    with tempfile.TemporaryDirectory(prefix='blooikos-ssh-') as directory:
        folder = Path(directory)
        for name, value in [('key', env['HOSTINGER_SSH_KEY']), ('known_hosts', env['HOSTINGER_KNOWN_HOSTS'])]:
            path = folder / name
            path.write_text(value.rstrip() + '\n')
            path.chmod(0o600)
        args = ['ssh', '-F', '/dev/null', '-p', env['HOSTINGER_PORT'], '-i', str(folder / 'key'),
                '-o', 'BatchMode=yes', '-o', 'IdentitiesOnly=yes', '-o', 'StrictHostKeyChecking=yes',
                '-o', 'UserKnownHostsFile=' + str(folder / 'known_hosts'), '-o', 'ConnectTimeout=15',
                '-o', 'ServerAliveInterval=15', '-o', 'ServerAliveCountMax=2',
                env['HOSTINGER_USER'] + '@' + env['HOSTINGER_HOST'],
                'python3 -c ' + shlex.quote(LAUNCHER)]
        try:
            result = subprocess.run(args, input=json.dumps(payload).encode(), capture_output=True, timeout=480)
        except subprocess.TimeoutExpired:
            raise DeployError('REMOTE_STATE_UNCERTAIN') from None
        if result.returncode:
            # Mensagens SSH podem conter endereço/usuário. Propaga só códigos fechados.
            code = result.stderr.decode(errors='replace').strip()
            if 'Host key verification failed' in code or 'REMOTE HOST IDENTIFICATION HAS CHANGED' in code:
                raise DeployError('SSH_HOST_KEY_REJECTED')
            if 'Permission denied' in code:
                raise DeployError('SSH_AUTHENTICATION_REJECTED')
            raise DeployError(code if re.fullmatch(r'[A-Z][A-Z_]{2,80}', code) else 'REMOTE_STATE_UNCERTAIN')
        return json.loads(result.stdout)


def main():
    action = sys.argv[1] if len(sys.argv) == 2 else ''
    require(action in ('gate', 'plan', 'run'), 'INVALID_CLI_ACTION')
    identity = context(os.environ)
    if action == 'gate':
        require(identity['operation'] != 'recover', 'RECOVER_REQUIRES_LOCAL_CLI')
        if os.environ.get('GITHUB_OUTPUT'):
            with open(os.environ['GITHUB_OUTPUT'], 'a') as handle:
                handle.write(f"operation={identity['operation']}\n")
        print(json.dumps({'operation': identity['operation'], 'trustedRef': True}))
        return
    config = configuration(os.environ, action == 'plan')
    archive, expected = None, os.environ.get('DEPLOY_PACKAGE_SHA256')
    if identity['operation'] in ('deploy', 'bootstrap') and (action == 'run' or Path('.deploy/release.zip').exists()):
        require(expected and re.fullmatch(r'[0-9a-f]{64}', expected), 'EXPECTED_DIGEST_MISSING')
        archive = Path('.deploy/release.zip').read_bytes()
        verify(archive, expected, identity)
    payload = dict(action=action, config=config, identity=identity, digest=expected,
                   archive=base64.b64encode(archive).decode() if archive else None,
                   modules={name: Path(__file__).with_name(name + '.py').read_text() for name in MODULES},
                   token=os.environ.get('GH_TOKEN', ''))
    result = ssh(os.environ, payload)
    if action == 'plan':
        # Plano contém caminhos/roteamento: arquivo local privado, nunca log público.
        file = Path('.deploy-plan.json')
        fd = os.open(file, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
        with os.fdopen(fd, 'w') as handle:
            json.dump(result, handle, indent=2)
        print('PREFLIGHT_PLAN_SAVED')
    else:
        print(json.dumps(result))


if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        print(str(error) if isinstance(error, DeployError) else 'DEPLOY_COMMAND_FAILED', file=sys.stderr)
        sys.exit(1)

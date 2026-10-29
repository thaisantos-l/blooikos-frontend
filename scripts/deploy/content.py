"""Protocolo v1 de snapshot; números seguros e UTF-8 iguais a PHP/TypeScript."""
import json
import re
from common import digest, require
from smoke import request

UUID = re.compile(r'[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}\Z')
DECIMAL = re.compile(r'[1-9][0-9]{0,29}\Z')
HASH = re.compile(r'[a-f0-9]{64}\Z')

def canonical(value):
    if isinstance(value, dict):
        require(all(isinstance(k, str) and re.fullmatch(r'[A-Za-z_][A-Za-z_0-9]*', k) for k in value), 'INVALID_CANONICAL_KEY')
        return '{' + ','.join(json.dumps(k) + ':' + canonical(v) for k, v in sorted(value.items())) + '}'
    if isinstance(value, list):
        return '[' + ','.join(canonical(v) for v in value) + ']'
    require(value is None or isinstance(value, (str, bool)) or (type(value) is int and abs(value) <= 9007199254740991), 'INVALID_CANONICAL_VALUE')
    return json.dumps(value, ensure_ascii=False, separators=(',', ':'))

def metadata(value):
    require(isinstance(value, dict) and set(value) == {'protocolVersion','profile','epoch','contentVersion','contentDigest','dataDigest','operationDigest','mediaRevision'}, 'INVALID_CONTENT_VERSION')
    require(value['protocolVersion'] == '1' and value['profile'] == 'poc', 'INVALID_CONTENT_VERSION')
    for key, pattern in [('epoch', UUID), ('contentVersion', DECIMAL), ('contentDigest', HASH), ('dataDigest', HASH), ('operationDigest', HASH), ('mediaRevision', re.compile(r'(0|[1-9][0-9]{0,29})\Z'))]:
        require(isinstance(value[key], str) and pattern.fullmatch(value[key]), 'INVALID_CONTENT_VERSION')
    require(digest(canonical({k: value[k] for k in ('protocolVersion','profile','dataDigest','operationDigest','mediaRevision')}).encode()) == value['contentDigest'], 'CONTENT_DIGEST_MISMATCH')
    return value

def current(url):
    status, headers, body = request(url)
    require(status == 200 and len(body) <= 4096 and 'no-store' in headers.get('cache-control', '') and 'noindex' in headers.get('x-robots-tag', ''), 'CONTENT_NOT_READY')
    return metadata(json.loads(body))

def guard(config, manifest, marker, identity):
    require(not marker.get('automaticPaused'), 'PUBLISHER_PAUSED')
    expected = metadata(manifest['content'])
    require(current(config['versionUrl']) == expected, 'STALE_CONTENT')
    high = marker.get('highestContent')
    if high:
        require(expected['epoch'] == marker.get('acceptedEpoch', high['epoch']), 'CONTENT_EPOCH_MISMATCH')
        if high['epoch'] == expected['epoch']:
            require(int(expected['contentVersion']) >= int(high['contentVersion']), 'CONTENT_REGRESSION')
            if expected['contentVersion'] == high['contentVersion']:
                require(expected['contentDigest'] == high['contentDigest'], 'CONTENT_VERSION_COLLISION')
    if identity.get('contentRequest'):
        target = marker.get('publishedRequests', {}).get(identity['contentRequest']['requestId'])
        if target:
            require(marker['active'] == target, 'REQUEST_ALREADY_PUBLISHED')
            return target
    return None

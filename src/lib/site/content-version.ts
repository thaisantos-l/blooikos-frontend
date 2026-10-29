import { createHash } from 'node:crypto';

export function canonical(value: unknown): string {
  if (value === null || typeof value === 'boolean' || typeof value === 'string')
    return JSON.stringify(value);
  if (typeof value === 'number' && Number.isSafeInteger(value))
    return JSON.stringify(value);
  if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
  if (typeof value === 'object' && value !== null) {
    const object = value as Record<string, unknown>;
    const keys = Object.keys(object).sort();
    if (keys.some((key) => !/^[A-Za-z_][A-Za-z_0-9]*$/.test(key)))
      throw new Error('INVALID_CANONICAL_KEY');
    return (
      '{' +
      keys
        .map((key) => JSON.stringify(key) + ':' + canonical(object[key]))
        .join(',') +
      '}'
    );
  }
  throw new Error('INVALID_CANONICAL_VALUE');
}
export const sha256 = (value: string) =>
  createHash('sha256').update(value, 'utf8').digest('hex');
export const uuid =
  /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/;
export const decimal = /^[1-9][0-9]{0,29}$/;
const hash = /^[a-f0-9]{64}$/;
export interface ContentVersion {
  protocolVersion: '1';
  profile: 'poc';
  epoch: string;
  contentVersion: string;
  contentDigest: string;
  dataDigest: string;
  operationDigest: string;
  mediaRevision: string;
}
export function contentVersion(value: unknown): ContentVersion {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error('INVALID_CONTENT_VERSION');
  const row = value as Record<string, unknown>;
  const matches = (key: string, expression: RegExp) =>
    typeof row[key] === 'string' && expression.test(row[key]);
  if (
    row.protocolVersion !== '1' ||
    row.profile !== 'poc' ||
    !matches('epoch', uuid) ||
    !matches('contentVersion', decimal) ||
    !matches('mediaRevision', /^(0|[1-9][0-9]{0,29})$/) ||
    !['contentDigest', 'dataDigest', 'operationDigest'].every((key) =>
      matches(key, hash),
    ) ||
    Object.keys(row).length !== 8
  )
    throw new Error('INVALID_CONTENT_VERSION');
  const result = row as unknown as ContentVersion;
  if (
    sha256(
      canonical({
        protocolVersion: '1',
        profile: 'poc',
        dataDigest: result.dataDigest,
        operationDigest: result.operationDigest,
        mediaRevision: result.mediaRevision,
      }),
    ) !== result.contentDigest
  )
    throw new Error('CONTENT_DIGEST_MISMATCH');
  return result;
}
export function editorialRequest(env: NodeJS.ProcessEnv) {
  const values = [
    env.CONTENT_EPOCH,
    env.CONTENT_VERSION,
    env.CONTENT_DIGEST,
    env.CONTENT_REQUEST_ID,
  ];
  if (values.every((value) => !value)) return null;
  if (
    !values.every(Boolean) ||
    !uuid.test(values[0]!) ||
    !decimal.test(values[1]!) ||
    !hash.test(values[2]!) ||
    !uuid.test(values[3]!) ||
    env.GITHUB_REPOSITORY !== 'thaisantos-l/blooikos-frontend' ||
    env.GITHUB_REF !== 'refs/heads/main' ||
    env.GITHUB_EVENT_NAME !== 'workflow_dispatch' ||
    (env.DEPLOY_OPERATION || 'deploy') !== 'deploy'
  )
    throw new Error('INVALID_CONTENT_REQUEST');
  return {
    epoch: values[0]!,
    contentVersion: values[1]!,
    contentDigest: values[2]!,
    requestId: values[3]!,
  };
}

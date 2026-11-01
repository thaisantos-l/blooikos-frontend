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
export const uuid =
  /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/;
export const decimal = /^[1-9][0-9]{0,29}$/;
const hash = /^[a-f0-9]{64}$/;
export type ContentProfile = 'poc' | 'home-hero';
export interface ContentVersion {
  protocolVersion: '1';
  profile: ContentProfile;
  epoch: string;
  contentVersion: string;
  contentDigest: string;
  dataDigest: string;
  operationDigest: string;
  mediaRevision: string;
}
export function parseContentVersion(value: unknown): ContentVersion {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error('INVALID_CONTENT_VERSION');
  const row = value as Record<string, unknown>;
  const matches = (key: string, expression: RegExp) =>
    typeof row[key] === 'string' && expression.test(row[key]);
  if (
    row.protocolVersion !== '1' ||
    !['poc', 'home-hero'].includes(String(row.profile)) ||
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
  return result;
}

export function contentDigestInput(version: ContentVersion) {
  return canonical({
    protocolVersion: '1',
    profile: version.profile,
    dataDigest: version.dataDigest,
    operationDigest: version.operationDigest,
    mediaRevision: version.mediaRevision,
  });
}

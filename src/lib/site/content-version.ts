import { createHash } from 'node:crypto';
import {
  parseContentVersion,
  contentDigestInput,
  uuid,
  decimal,
} from './content-version.shared';
export * from './content-version.shared';
export const sha256 = (value: string) =>
  createHash('sha256').update(value, 'utf8').digest('hex');
const hash = /^[a-f0-9]{64}$/;
export function contentVersion(value: unknown) {
  const result = parseContentVersion(value);
  if (sha256(contentDigestInput(result)) !== result.contentDigest)
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

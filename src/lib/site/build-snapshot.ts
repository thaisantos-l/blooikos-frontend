import { lstat, mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parseGraphQLConfig } from '../env';
import { requestGraphQL } from '../graphql/transport';
import {
  canonical,
  contentVersion,
  editorialRequest,
  sha256,
} from './content-version';
import { validatePoc } from './validate-poc';

const directory = resolve('.build-snapshot');
const filename = resolve(directory, 'poc.json');
async function safeDirectory() {
  const stat = await lstat(directory).catch(() => null);
  if (
    stat &&
    (!stat.isDirectory() || stat.isSymbolicLink() || stat.mode & 0o077)
  )
    throw new Error('UNSAFE_SNAPSHOT');
}
async function version(url: string) {
  const response = await fetch(url, {
    cache: 'no-store',
    credentials: 'omit',
    redirect: 'error',
    signal: AbortSignal.timeout(10000),
    headers: { 'Cache-Control': 'no-cache' },
  });
  if (response.status === 409) throw new Error('CONTENT_NOT_READY');
  if (
    !response.ok ||
    !response.headers.get('cache-control')?.includes('no-store') ||
    !response.headers.get('x-robots-tag')?.includes('noindex')
  )
    throw new Error('VERSION_UNAVAILABLE');
  const reader = response.body?.getReader();
  if (!reader) throw new Error('VERSION_UNAVAILABLE');
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      size += chunk.value.length;
      if (size > 4096) throw new Error('VERSION_TOO_LARGE');
      chunks.push(chunk.value);
    }
  } finally {
    await reader.cancel();
  }
  return contentVersion(JSON.parse(Buffer.concat(chunks).toString('utf8')));
}
export async function captureSnapshot(nonce: string) {
  const config = parseGraphQLConfig(process.env, 'production');
  const endpoint = new URL(process.env.CMS_REBUILD_VERSION_URL || '');
  if (
    endpoint.protocol !== 'https:' ||
    endpoint.origin !== new URL(config.endpoint).origin ||
    endpoint.username ||
    endpoint.password ||
    endpoint.search ||
    endpoint.hash ||
    !endpoint.pathname.endsWith('/wp-json/blooikos/v1/content-version')
  )
    throw new Error('INVALID_VERSION_ENDPOINT');
  const request = editorialRequest(process.env);
  const before = await version(endpoint.href);
  if (
    request &&
    (request.epoch !== before.epoch ||
      request.contentVersion !== before.contentVersion ||
      request.contentDigest !== before.contentDigest)
  )
    throw new Error('STALE_CONTENT_REQUEST');
  const data = await requestGraphQL('BlooikosHeaderFooter', config);
  const after = await version(endpoint.href);
  if (canonical(before) !== canonical(after))
    throw new Error('CONTENT_CHANGED_DURING_CAPTURE');
  const operation = await readFile(
    resolve('contracts/cms/v1/operations.graphql'),
    'utf8',
  );
  if (
    sha256(operation) !== before.operationDigest ||
    sha256(canonical(data)) !== before.dataDigest
  )
    throw new Error('SNAPSHOT_DIGEST_MISMATCH');
  validatePoc(data, { production: true, siteOrigin: process.env.SITE_ORIGIN });
  await safeDirectory();
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const stat = await lstat(filename).catch(() => null);
  if (
    stat?.isSymbolicLink() ||
    (stat && (!stat.isFile() || stat.nlink !== 1 || stat.mode & 0o077))
  )
    throw new Error('UNSAFE_SNAPSHOT');
  const snapshot = {
    nonce,
    content: before,
    requestId: request?.requestId ?? null,
    data,
    endpoint: config.endpoint,
    versionUrl: endpoint.href,
    siteOrigin: process.env.SITE_ORIGIN,
    sha: process.env.GITHUB_SHA ?? '',
    run: process.env.GITHUB_RUN_ID ?? '',
    attempt: process.env.GITHUB_RUN_ATTEMPT ?? '',
  };
  await writeFile(filename, JSON.stringify(snapshot), {
    mode: 0o600,
    flag: 'w',
  });
}
export async function readBuildSnapshot() {
  await safeDirectory();
  const stat = await lstat(filename);
  if (
    !stat.isFile() ||
    stat.isSymbolicLink() ||
    stat.nlink !== 1 ||
    stat.size > 2 * 1024 * 1024 ||
    stat.mode & 0o077
  )
    throw new Error('UNSAFE_SNAPSHOT');
  const snapshot = JSON.parse(await readFile(filename, 'utf8'));
  const metadata = contentVersion(snapshot.content);
  if (
    !process.env.BLOOIKOS_SNAPSHOT_NONCE ||
    snapshot.nonce !== process.env.BLOOIKOS_SNAPSHOT_NONCE ||
    snapshot.endpoint !== process.env.WORDPRESS_GRAPHQL_URL ||
    snapshot.siteOrigin !== process.env.SITE_ORIGIN ||
    snapshot.sha !== (process.env.GITHUB_SHA ?? '') ||
    snapshot.run !== (process.env.GITHUB_RUN_ID ?? '') ||
    snapshot.attempt !== (process.env.GITHUB_RUN_ATTEMPT ?? '') ||
    sha256(canonical(snapshot.data)) !== metadata.dataDigest
  )
    throw new Error('SNAPSHOT_PROVENANCE_MISMATCH');
  return validatePoc(snapshot.data, {
    production: true,
    siteOrigin: process.env.SITE_ORIGIN,
  });
}

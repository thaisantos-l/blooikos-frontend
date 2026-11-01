import {
  canonical,
  contentDigestInput,
  parseContentVersion,
  type ContentVersion,
} from './content-version.shared';
import { validateContent, type SiteContent } from './validate-content';
import { browserText } from './visible-text';
import { versionMedia } from './version-media';

export interface RuntimeConfig {
  endpoint: string;
  contactEndpoint: string;
  siteOrigin?: string;
  production: boolean;
}
export class ContentReadError extends Error {
  constructor(
    public readonly kind: 'pending' | 'network' | 'contract',
    public readonly retryAfter = 5,
  ) {
    super(kind);
  }
}
export async function webHash(value: string): Promise<string> {
  const bytes = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(value),
  );
  return Array.from(new Uint8Array(bytes), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
}
export async function validateRuntimeEnvelope(
  value: unknown,
  current: ContentVersion,
  config: RuntimeConfig,
): Promise<{ content: SiteContent; metadata: ContentVersion }> {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new ContentReadError('contract');
  const envelope = value as Record<string, unknown>;
  if (
    envelope.schemaVersion !== 1 ||
    Object.keys(envelope).sort().join(',') !== 'data,schemaVersion,version' ||
    !envelope.data ||
    typeof envelope.data !== 'object' ||
    Array.isArray(envelope.data)
  )
    throw new ContentReadError('contract');
  const metadata = parseContentVersion(envelope.version);
  if (
    metadata.profile !== current.profile ||
    metadata.operationDigest !== current.operationDigest ||
    (metadata.epoch === current.epoch &&
      (BigInt(metadata.contentVersion) < BigInt(current.contentVersion) ||
        (metadata.contentVersion === current.contentVersion &&
          metadata.contentDigest !== current.contentDigest)))
  )
    throw new ContentReadError('contract');
  const [dataHash, versionHash] = await Promise.all([
    webHash(canonical(envelope.data)),
    webHash(contentDigestInput(metadata)),
  ]);
  if (
    dataHash !== metadata.dataDigest ||
    versionHash !== metadata.contentDigest
  )
    throw new ContentReadError('contract');
  return {
    metadata,
    content: versionMedia(
      validateContent(envelope.data, {
        production: config.production,
        siteOrigin: config.siteOrigin,
        readText: browserText,
      }),
      metadata,
    ),
  };
}

export async function readRuntimeContent(
  config: RuntimeConfig,
  current: ContentVersion,
  signal: AbortSignal,
  etag?: string,
) {
  const response = await fetch(config.endpoint, {
    credentials: 'omit',
    cache: 'no-cache',
    redirect: 'error',
    signal,
    headers: {
      Accept: 'application/json',
      ...(etag ? { 'If-None-Match': etag } : {}),
    },
  });
  if (response.status === 304 && etag) return null;
  if (response.status === 409) {
    const retry = response.headers.get('retry-after') ?? '';
    void response.body?.cancel();
    throw new ContentReadError(
      'pending',
      /^\d+$/.test(retry) ? Math.max(5, Math.min(120, Number(retry))) : 5,
    );
  }
  if (
    !response.ok ||
    !response.headers.get('content-type')?.includes('application/json') ||
    !response.body
  ) {
    void response.body?.cancel();
    throw new ContentReadError(response.status >= 500 ? 'network' : 'contract');
  }
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      size += chunk.value.byteLength;
      if (size > 2097152) throw new ContentReadError('contract');
      chunks.push(chunk.value);
    }
  } finally {
    void reader.cancel().catch(() => undefined);
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  const decoded: unknown = JSON.parse(
    new TextDecoder('utf-8', { fatal: true }).decode(bytes),
  );
  return {
    ...(await validateRuntimeEnvelope(decoded, current, config)),
    etag: response.headers.get('etag') ?? undefined,
  };
}

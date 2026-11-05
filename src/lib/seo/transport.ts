// Derive from the already validated GraphQL URL, preserving a WP subdirectory.
export function seoEndpoint(graphql: string) {
  const url = new URL(graphql);
  if (!url.pathname.endsWith('/graphql') && !url.pathname.endsWith('/graphql/'))
    throw new Error('INVALID_SEO_ENDPOINT');
  url.pathname = url.pathname.replace(
    /graphql\/?$/,
    'wp-json/blooikos/v1/site-seo',
  );
  url.search = '';
  url.hash = '';
  return url.href;
}

export async function requestSeo(
  endpoint: string,
  signal?: AbortSignal,
): Promise<unknown> {
  try {
    const response = await fetch(endpoint, {
      credentials: 'omit',
      cache: 'no-store',
      redirect: 'error',
      signal: signal
        ? AbortSignal.any([signal, AbortSignal.timeout(4000)])
        : AbortSignal.timeout(4000),
    });
    if (
      !response.ok ||
      !response.headers.get('content-type')?.includes('application/json')
    )
      throw new Error('SEO_SOURCE_UNAVAILABLE');
    const reader = response.body?.getReader();
    if (!reader) throw new Error('SEO_SOURCE_UNAVAILABLE');
    const chunks: Uint8Array[] = [];
    let size = 0;
    try {
      while (true) {
        const chunk = await reader.read();
        if (chunk.done) break;
        size += chunk.value.byteLength;
        if (size > 65536) throw new Error('SEO_RESPONSE_TOO_LARGE');
        chunks.push(chunk.value);
      }
    } finally {
      await reader.cancel();
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
  } catch {
    throw new Error('SEO_SOURCE_UNAVAILABLE');
  }
}

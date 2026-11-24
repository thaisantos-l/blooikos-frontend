export interface CompanySocial {
  id: string;
  name: string;
  instagramUrl: string;
}

export interface InstagramLink {
  label: string;
  href: string;
}

export interface ContactInstagram extends InstagramLink {
  companyId: string;
}

export interface FooterSocial {
  companies: CompanySocial[];
  contactInstagram: ContactInstagram | null;
  sharedInstagram: InstagramLink | null;
}

function instagramDestination(value: unknown): string | null {
  if (
    typeof value !== 'string' ||
    value.length > 2048 ||
    /[\s\\\x00-\x1f\x7f]/.test(value)
  )
    return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' &&
      !url.username &&
      !url.password &&
      !url.port &&
      ['instagram.com', 'www.instagram.com'].includes(url.hostname)
      ? url.href
      : null;
  } catch {
    return null;
  }
}

function readInstagramLink(value: unknown): InstagramLink | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const { label, href } = value as Record<string, unknown>;
  const destination = instagramDestination(href);
  if (
    typeof label !== 'string' ||
    label.trim() !== label ||
    !/^@[a-zA-Z0-9._]{1,30}$/.test(label) ||
    !destination
  )
    return null;
  return { label, href: destination };
}

function readContactInstagram(value: unknown): ContactInstagram | null {
  const link = readInstagramLink(value);
  if (!link) return null;
  const { companyId } = value as Record<string, unknown>;
  return typeof companyId === 'string' && /^[1-9]\d*$/.test(companyId)
    ? { companyId, ...link }
    : null;
}

export function footerSocialEndpoint(contactEndpoint: string): string {
  const url = new URL(contactEndpoint);
  if (!url.pathname.endsWith('/wp-json/blooikos/v1/contact'))
    throw new Error('INVALID_FOOTER_SOCIAL_ENDPOINT');
  url.pathname = url.pathname.replace(/contact$/, 'footer-social');
  url.search = '';
  url.hash = '';
  return url.href;
}

export function readFooterSocial(value: unknown): FooterSocial {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error('INVALID_FOOTER_SOCIAL');
  const { schemaVersion, companies, contactInstagram, sharedInstagram } =
    value as Record<string, unknown>;
  if (schemaVersion !== 1 || !Array.isArray(companies) || companies.length > 6)
    throw new Error('INVALID_FOOTER_SOCIAL');
  const seen = new Set<string>();
  const links = companies.flatMap((item: unknown): CompanySocial[] => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return [];
    const { id, name, instagramUrl } = item as Record<string, unknown>;
    if (
      typeof id !== 'string' ||
      !/^[1-9]\d*$/.test(id) ||
      seen.has(id) ||
      typeof name !== 'string' ||
      !name.trim() ||
      name.length > 60
    )
      return [];
    const destination = instagramDestination(instagramUrl);
    if (!destination) return [];
    seen.add(id);
    return [{ id, name: name.trim(), instagramUrl: destination }];
  });
  return {
    companies: links,
    contactInstagram: readContactInstagram(contactInstagram),
    sharedInstagram: readInstagramLink(sharedInstagram),
  };
}

export async function requestFooterSocial(
  endpoint: string,
  signal?: AbortSignal,
  etag?: string,
): Promise<(FooterSocial & { etag?: string }) | null> {
  const response = await fetch(endpoint, {
    credentials: 'omit',
    cache: 'no-store',
    redirect: 'error',
    headers: etag ? { 'If-None-Match': etag } : undefined,
    signal: signal
      ? AbortSignal.any([signal, AbortSignal.timeout(4000)])
      : AbortSignal.timeout(4000),
  });
  if (response.status === 304 && etag) return null;
  if (
    !response.ok ||
    !response.headers.get('content-type')?.includes('application/json')
  )
    throw new Error('FOOTER_SOCIAL_UNAVAILABLE');
  const reader = response.body?.getReader();
  if (!reader) throw new Error('FOOTER_SOCIAL_UNAVAILABLE');
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      size += chunk.value.byteLength;
      if (size > 32768) throw new Error('FOOTER_SOCIAL_TOO_LARGE');
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
  return {
    ...readFooterSocial(
      JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)),
    ),
    etag: response.headers.get('etag') ?? undefined,
  };
}

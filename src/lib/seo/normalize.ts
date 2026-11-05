import { parseSiteOrigin } from '../site/normalize';

export const PUBLIC_ORIGIN = 'https://blooikos.com.br';
export const SEO_SCRIPT_ID = 'blooikos-seo-jsonld';
export interface SeoOptions {
  production: boolean;
  siteOrigin?: string;
  brandName?: string;
  readText: (value: string) => string;
}
type ObjectValue = Record<string, unknown>;
function object(value: unknown): ObjectValue {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error('INVALID_SEO_RESPONSE');
  return value as ObjectValue;
}

export function seoIdentity(value: unknown) {
  const root = object(value);
  const home = object(root.home);
  if (
    root.schemaVersion !== 1 ||
    typeof home.published !== 'boolean' ||
    (home.published
      ? !Number.isSafeInteger(home.id) || Number(home.id) < 1
      : home.id !== null)
  )
    throw new Error('INVALID_SEO_RESPONSE');
  return { published: home.published, id: home.id as number | null };
}

// Media and custom canonicals are checked individually; their hosts are never rewritten.
function safeUrl(value: unknown, production: boolean): string | undefined {
  if (typeof value !== 'string' || !value || /[\s\\]/.test(value)) return;
  try {
    const url = new URL(value);
    decodeURIComponent(url.pathname);
    const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
    if (
      url.username ||
      url.password ||
      (url.protocol !== 'https:' &&
        !(url.protocol === 'http:' && local && !production)) ||
      (production && local)
    )
      return;
    return url.href;
  } catch {
    return;
  }
}

export function resolveSeo(value: unknown, options: SeoOptions) {
  const home = seoIdentity(value);
  const root = object(value);
  const site = object(root.site);
  const seo = object(root.seo);
  const robots = object(seo.robots);
  const og = object(seo.openGraph);
  const twitter = object(seo.twitter);
  if (
    typeof robots.index !== 'boolean' ||
    typeof robots.follow !== 'boolean' ||
    typeof seo.canonicalIsCustom !== 'boolean'
  )
    throw new Error('INVALID_SEO_RESPONSE');
  const text = (input: unknown) =>
    typeof input === 'string' && !/%%[^%]+%%/.test(input)
      ? options.readText(input).trim().slice(0, 2000)
      : '';
  const name = text(site.name) || text(options.brandName) || 'Blooikos';
  const title = (home.published && text(seo.title)) || name;
  const description =
    (home.published && text(seo.description)) || text(site.description);
  const configuredOrigin = parseSiteOrigin(options.siteOrigin);
  const origin = configuredOrigin || PUBLIC_ORIGIN;
  const url = origin + '/';
  const diagnostics: string[] = [];
  let canonical = url;
  if (home.published && seo.canonicalIsCustom) {
    const custom = safeUrl(seo.canonical, true);
    if (
      custom &&
      !new URL(custom).hash &&
      !/\/(?:wp-admin|wp-login\.php|wp-json)(?:\/|$)/i.test(
        decodeURIComponent(new URL(custom).pathname),
      )
    )
      canonical = custom;
    else diagnostics.push('INVALID_CUSTOM_CANONICAL');
  }
  const image = (input: unknown) => {
    if (!input || typeof input !== 'object' || Array.isArray(input))
      return undefined;
    const entry = input as ObjectValue;
    const source = safeUrl(entry.url, options.production);
    if (!source) return undefined;
    const dimension = (n: unknown) =>
      typeof n === 'number' && Number.isInteger(n) && n > 0 && n <= 100000
        ? n
        : undefined;
    return {
      url: source,
      width: dimension(entry.width),
      height: dimension(entry.height),
      alt: text(entry.alt) || undefined,
    };
  };
  const ogImage = home.published ? image(og.image) : undefined;
  const twitterImage =
    (home.published ? image(twitter.image) : undefined) || ogImage;
  const index =
    home.published &&
    options.production &&
    configuredOrigin === PUBLIC_ORIGIN &&
    robots.index;
  const follow =
    home.published &&
    options.production &&
    configuredOrigin === PUBLIC_ORIGIN &&
    robots.follow;
  const language =
    typeof site.language === 'string' &&
    /^[a-z]{2}(?:-[A-Z]{2})?$/.test(site.language)
      ? site.language
      : 'pt-BR';
  const graph: ObjectValue[] = [];
  if (home.published) {
    graph.push(
      {
        '@type': 'WebSite',
        '@id': url + '#website',
        url,
        name,
        inLanguage: language,
      },
      {
        '@type': 'WebPage',
        '@id': url + '#webpage',
        url,
        name: title,
        ...(description ? { description } : {}),
        isPartOf: { '@id': url + '#website' },
        inLanguage: language,
      },
    );
    const entity =
      seo.entity && typeof seo.entity === 'object' && !Array.isArray(seo.entity)
        ? (seo.entity as ObjectValue)
        : undefined;
    if (
      entity &&
      ['Organization', 'Person'].includes(String(entity.type)) &&
      text(entity.name)
    ) {
      const logo = safeUrl(entity.logoUrl, options.production);
      const sameAs = Array.isArray(entity.sameAs)
        ? entity.sameAs
            .slice(0, 10)
            .map((entry) => safeUrl(entry, true))
            .filter((entry): entry is string => !!entry)
        : [];
      graph.push({
        '@type': entity.type,
        '@id': url + '#identity',
        name: text(entity.name),
        url,
        ...(logo ? { logo } : {}),
        ...(sameAs.length ? { sameAs } : {}),
      });
      graph[0].publisher = { '@id': url + '#identity' };
    }
  }
  return {
    home,
    name,
    title,
    description,
    origin,
    url,
    canonical,
    language,
    index,
    follow,
    icon: safeUrl(site.iconUrl, options.production),
    openGraph: {
      title: (home.published && text(og.title)) || title,
      description: (home.published && text(og.description)) || description,
      image: ogImage,
    },
    twitter: {
      title: (home.published && text(twitter.title)) || title,
      description: (home.published && text(twitter.description)) || description,
      image: twitterImage,
    },
    jsonLd: graph.length
      ? { '@context': 'https://schema.org', '@graph': graph }
      : null,
    diagnostics,
  };
}
export type ResolvedSeo = ReturnType<typeof resolveSeo>;
export function serializeJsonLd(value: ResolvedSeo['jsonLd']) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

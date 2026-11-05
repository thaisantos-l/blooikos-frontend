import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { resolveSeo, SEO_SCRIPT_ID } from '../src/lib/seo/normalize';
import { metaTags } from '../src/lib/seo/metadata';
import { canonical, sha256 } from '../src/lib/site/content-version';
import { serverText } from '../src/lib/site/visible-text.server';
interface Element {
  textContent: string;
  getAttribute(name: string): string | undefined;
  querySelectorAll(selector: string): Element[];
}
const { parse } = createRequire(import.meta.url)(
  'next/dist/compiled/node-html-parser',
) as { parse(html: string): Element };
const requireSeo = (condition: boolean) => {
  if (!condition) throw new Error('SEO_EXPORT_MISMATCH');
};

export async function verifySeo(root: string) {
  const snapshot = JSON.parse(
    await readFile('.build-snapshot/poc.json', 'utf8'),
  );
  requireSeo(sha256(canonical(snapshot.seo)) === snapshot.seoDigest);
  const seo = resolveSeo(snapshot.seo, {
    production: true,
    siteOrigin: snapshot.siteOrigin,
    brandName: snapshot.data.blooikosSettings?.blooikosSiteIdentity?.brandName,
    readText: serverText,
  });
  for (const file of ['index.html', '404.html']) {
    const document = parse(await readFile(join(root, file), 'utf8'));
    const home = file === 'index.html';
    const title = document.querySelectorAll('head title');
    requireSeo(
      title.length === 1 &&
        title[0].textContent ===
          (home ? seo.title : `Página não encontrada | ${seo.name}`),
    );
    const canonicalTags = document.querySelectorAll(
      'head link[rel="canonical"]',
    );
    requireSeo(
      home
        ? canonicalTags.length === 1 &&
            canonicalTags[0].getAttribute('href') === seo.canonical
        : canonicalTags.length === 0,
    );
    const tags = home ? metaTags(seo) : { robots: 'noindex, nofollow' };
    for (const [key, expected] of Object.entries(tags)) {
      const nodes = document.querySelectorAll(
        `head meta[${key.startsWith('og:') ? 'property' : 'name'}="${key}"]`,
      );
      // Next may add its own noindex for a not-found boundary, but never index.
      if (!home && key === 'robots')
        requireSeo(
          nodes.length >= 1 &&
            nodes.every(
              (n) => n.getAttribute('content')?.includes('noindex') === true,
            ),
        );
      else
        requireSeo(
          expected === undefined
            ? nodes.length === 0
            : nodes.length === 1 &&
                nodes[0].getAttribute('content') === expected,
        );
    }
    const icons = document.querySelectorAll('head link[rel="icon"]');
    requireSeo(
      seo.icon
        ? icons.length === 1 && icons[0].getAttribute('href') === seo.icon
        : icons.length === 0,
    );
    const scripts = document.querySelectorAll(
      'script[type="application/ld+json"]',
    );
    requireSeo(scripts.length === (home && seo.jsonLd ? 1 : 0));
    if (scripts.length)
      requireSeo(
        scripts[0].getAttribute('id') === SEO_SCRIPT_ID &&
          JSON.stringify(JSON.parse(scripts[0].textContent)) ===
            JSON.stringify(seo.jsonLd),
      );
  }
  const robots = await readFile(join(root, 'robots.txt'), 'utf8');
  requireSeo(
    robots.includes('Allow: /') &&
      !robots.includes('Disallow: /') &&
      robots.includes(`Sitemap: ${seo.origin}/sitemap.xml`),
  );
  const sitemap = parse(await readFile(join(root, 'sitemap.xml'), 'utf8'));
  const locations = sitemap
    .querySelectorAll('loc')
    .map((node) => node.textContent);
  requireSeo(
    JSON.stringify(locations) ===
      JSON.stringify(seo.index && seo.canonical === seo.url ? [seo.url] : []),
  );
}

'use client';

import { useEffect } from 'react';
import { browserText } from '../../lib/site/visible-text';
import {
  resolveSeo,
  SEO_SCRIPT_ID,
  serializeJsonLd,
} from '../../lib/seo/normalize';
import { metaTags } from '../../lib/seo/metadata';
import { requestSeo } from '../../lib/seo/transport';

export function SeoSync({
  endpoint,
  production,
  siteOrigin,
  brandName,
}: {
  endpoint: string;
  production: boolean;
  siteOrigin?: string;
  brandName: string;
}) {
  useEffect(() => {
    let active: AbortController | undefined;
    let disposed = false;
    let wasHidden = document.visibilityState === 'hidden';
    const inserted = new Set<Element>();

    // Adopt server tags; only newly inserted tags need manual removal on navigation.
    function update(
      selector: string,
      tag: string,
      attributes: Record<string, string>,
      text?: string,
    ) {
      const matches = Array.from(document.querySelectorAll(selector));
      let element = matches.shift();
      matches.forEach((duplicate) => duplicate.remove());
      if (!element) {
        element = document.createElement(tag);
        document.head.append(element);
        inserted.add(element);
      }
      for (const [key, value] of Object.entries(attributes))
        element.setAttribute(key, value);
      if (text !== undefined) element.textContent = text;
    }
    async function refresh() {
      if (disposed || active) return;
      const controller = new AbortController();
      active = controller;
      try {
        const value = await requestSeo(endpoint, controller.signal);
        const seo = resolveSeo(value, {
          production,
          siteOrigin,
          brandName,
          readText: browserText,
        });
        if (
          disposed ||
          controller.signal.aborted ||
          window.location.pathname !== '/'
        )
          return;
        for (const code of seo.diagnostics) console.warn(`[SEO] ${code}`);
        update('head title', 'title', {}, seo.title);
        update('head link[rel="canonical"]', 'link', {
          rel: 'canonical',
          href: seo.canonical,
        });
        for (const [key, content] of Object.entries(metaTags(seo))) {
          const attribute = key.startsWith('og:') ? 'property' : 'name';
          const selector = `head meta[${attribute}="${key}"]`;
          if (content === undefined)
            document
              .querySelectorAll(selector)
              .forEach((node) => node.remove());
          else update(selector, 'meta', { [attribute]: key, content });
        }
        if (seo.jsonLd)
          update(
            `#${SEO_SCRIPT_ID}`,
            'script',
            { id: SEO_SCRIPT_ID, type: 'application/ld+json' },
            serializeJsonLd(seo.jsonLd),
          );
        else document.getElementById(SEO_SCRIPT_ID)?.remove();
      } catch {
        // Network/invalid envelope is not an editorial deletion. Preserve accepted tags.
      } finally {
        active = undefined;
      }
    }
    function visible() {
      const hidden = document.visibilityState === 'hidden';
      if (wasHidden && !hidden) void refresh();
      wasHidden = hidden;
    }
    void refresh();
    document.addEventListener('visibilitychange', visible);
    return () => {
      disposed = true;
      active?.abort();
      inserted.forEach((element) => element.remove());
      document.removeEventListener('visibilitychange', visible);
    };
  }, [endpoint, production, siteOrigin, brandName]);
  return null;
}

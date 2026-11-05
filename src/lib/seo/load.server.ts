import 'server-only';
import { cache } from 'react';
import { loadSiteCapture } from '../site/load-site.server';
import { serverText } from '../site/visible-text.server';
import { resolveSeo } from './normalize';

export const loadSeo = cache(async () => {
  const capture = await loadSiteCapture();
  return resolveSeo(capture.seo, {
    production: process.env.NODE_ENV === 'production',
    siteOrigin: process.env.SITE_ORIGIN,
    brandName: capture.content.site.brandName,
    readText: serverText,
  });
});

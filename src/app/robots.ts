import type { MetadataRoute } from 'next';
import { loadSeo } from '@/lib/seo/load.server';
export const dynamic = 'force-static';
export default async function robots(): Promise<MetadataRoute.Robots> {
  const seo = await loadSeo();
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: seo.origin + '/sitemap.xml',
  };
}

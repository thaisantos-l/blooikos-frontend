import type { MetadataRoute } from 'next';
import { loadSeo } from '@/lib/seo/load.server';
export const dynamic = 'force-static';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const seo = await loadSeo();
  return seo.index && seo.canonical === seo.url ? [{ url: seo.url }] : [];
}

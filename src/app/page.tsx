import { LiveHome } from '@/components/content/LiveHome';
import { loadSeo } from '@/lib/seo/load.server';
import { homeMetadata } from '@/lib/seo/metadata';
import { SEO_SCRIPT_ID, serializeJsonLd } from '@/lib/seo/normalize';
import { SeoSync } from '@/components/layout/SeoSync';
import { runtimeConfig } from '@/lib/site/runtime-config.server';

export async function generateMetadata() {
  return homeMetadata(await loadSeo());
}
export default async function Home() {
  const seo = await loadSeo();
  const config = runtimeConfig();
  return (
    <>
      {seo.jsonLd && (
        <script
          id={SEO_SCRIPT_ID}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(seo.jsonLd) }}
        />
      )}
      <SeoSync
        endpoint={config.contactEndpoint.replace(/\/contact$/, '/site-seo')}
        production={config.production}
        siteOrigin={config.siteOrigin}
        brandName={seo.name}
      />
      <LiveHome />
    </>
  );
}

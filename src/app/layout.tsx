import type { Metadata } from 'next';
import 'bootstrap/dist/css/bootstrap-grid.min.css';
import '@/styles/globals.scss';
import { sora } from '@/styles/fonts';
import { loadSiteCapture } from '@/lib/site/load-site.server';
import { ContentProvider } from '@/components/content/ContentProvider';
import { LiveFooter } from '@/components/content/LiveFooter';
import { runtimeConfig } from '@/lib/site/runtime-config.server';
import { SkipLink } from '@/components/accessibility/SkipLink';
import { SiteIcon } from '@/components/layout/SiteIcon';
import { siteIconEndpoint } from '@/lib/site/site-icon';

// Export estático com leitura fresca no build; o transporte mantém no-store.
export const dynamic = 'force-static';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { content, metadata } = await loadSiteCapture();
  const config = runtimeConfig();
  return (
    <html lang="pt-BR" className={sora.variable}>
      <body>
        <SkipLink />
        <SiteIcon
          endpoint={siteIconEndpoint(config.contactEndpoint)}
          production={config.production}
        />
        <ContentProvider
          initialContent={content}
          metadata={metadata}
          config={config}
        >
          {children}
          <LiveFooter />
        </ContentProvider>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import 'bootstrap/dist/css/bootstrap-grid.min.css';
import '@/styles/globals.scss';
import { sora } from '@/styles/fonts';
import { loadSite } from '@/lib/site/load-site.server';
import { Footer } from '@/components/layout/Footer';
import { SkipLink } from '@/components/accessibility/SkipLink';

// Export estático com leitura fresca no build; o transporte mantém no-store.
export const dynamic = 'force-static';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { site } = await loadSite();
  return (
    <html lang="pt-BR" className={sora.variable}>
      <body>
        <SkipLink />
        {children}
        <Footer site={site} />
      </body>
    </html>
  );
}

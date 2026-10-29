import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/sections/Hero';
import { hasHeroContent } from '@/lib/site/validate-hero';
import styles from './page.module.scss';
import { loadSite } from '@/lib/site/load-site.server';
import { POC_SECTIONS } from '@/lib/site/anchors';

export default async function Home() {
  const { site, hero } = await loadSite();
  return (
    <>
      <Header site={site} variant={hasHeroContent(hero) ? 'hero' : 'solid'} />
      <main id="conteudo" tabIndex={-1} className={styles.heroMain}>
        <Hero hero={hero} />
        {POC_SECTIONS.map(({ id }) => (
          <div key={id} id={id} tabIndex={-1} />
        ))}
      </main>
    </>
  );
}

import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { InstitutionalVisual } from '@/components/sections/InstitutionalVisual';
import { Indicators } from '@/components/sections/Indicators';
import { Services } from '@/components/sections/Services';
import { hasHeroContent } from '@/lib/site/validate-hero';
import styles from './page.module.scss';
import { loadSite } from '@/lib/site/load-site.server';
import { POC_SECTIONS } from '@/lib/site/anchors';

export default async function Home() {
  const { site, hero, about, institutional, indicators, services } =
    await loadSite();
  return (
    <>
      <Header site={site} variant={hasHeroContent(hero) ? 'hero' : 'solid'} />
      <main id="conteudo" tabIndex={-1} className={styles.heroMain}>
        <Hero hero={hero} />
        <About about={about} />
        <InstitutionalVisual institutional={institutional} />
        <Indicators indicators={indicators} />
        <Services services={services} />
        {POC_SECTIONS.filter(
          ({ id }) =>
            id !== 'quem-somos' && id !== 'indicadores' && id !== 'servicos',
        ).map(({ id }) => (
          <div key={id} id={id} tabIndex={-1} />
        ))}
      </main>
    </>
  );
}

'use client';
import { Header } from '../layout/Header';
import { Hero } from '../sections/Hero';
import { About } from '../sections/About';
import { InstitutionalVisual } from '../sections/InstitutionalVisual';
import { Indicators } from '../sections/Indicators';
import { Services } from '../sections/Services';
import { Companies } from '../sections/Companies';
import { Contact } from '../sections/Contact';
import { useSiteContent } from './ContentProvider';
import { hasHeroContent } from '../../lib/site/has-hero-content';
import styles from '../../app/page.module.scss';

export function LiveHome() {
  const { content, config, retainForm } = useSiteContent();
  const {
    site,
    hero,
    about,
    institutional,
    indicators,
    services,
    companies,
    contact,
  } = content;
  return (
    <>
      <Header site={site} variant={hasHeroContent(hero) ? 'hero' : 'solid'} />
      <main id="conteudo" tabIndex={-1} className={styles.heroMain}>
        <Hero hero={hero} />
        <About about={about} />
        <InstitutionalVisual institutional={institutional} />
        <Indicators indicators={indicators} />
        <Services services={services} />
        <Companies companies={companies} />
        <Contact
          contact={contact}
          endpoint={config.contactEndpoint}
          retainForm={retainForm}
        />
      </main>
    </>
  );
}

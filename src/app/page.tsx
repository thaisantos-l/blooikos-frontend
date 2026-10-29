import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/sections/Hero';
import styles from './page.module.scss';
import { Container } from '@/components/ui/Container';
import { loadSite } from '@/lib/site/load-site.server';
import { POC_SECTIONS } from '@/lib/site/anchors';

export default async function Home() {
  const content = await loadSite();
  const { site } = content;
  return (
    <>
      <Header
        site={site}
        variant={content.profile === 'home-hero' ? 'hero' : 'solid'}
      />
      <main
        id="conteudo"
        tabIndex={-1}
        className={
          content.profile === 'home-hero' ? styles.heroMain : styles.main
        }
      >
        {content.profile === 'home-hero' ? <Hero hero={content.hero} /> : null}
        <Container>
          {content.profile === 'poc' ? (
            <>
              <h1 className={styles.title}>{site.brandName}</h1>
              <p className={styles.description}>
                Estamos preparando nosso novo site.
              </p>
            </>
          ) : null}
          {POC_SECTIONS.map((section) => (
            <section
              key={section.id}
              id={section.id}
              tabIndex={-1}
              className={styles.placeholder}
              aria-labelledby={section.id + '-title'}
            >
              <h2 id={section.id + '-title'}>{section.title}</h2>
              <p>Conteúdo em preparação.</p>
            </section>
          ))}
        </Container>
      </main>
    </>
  );
}

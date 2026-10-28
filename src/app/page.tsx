import styles from './page.module.scss';
import { Container } from '@/components/ui/Container';
import { loadSite } from '@/lib/site/load-site.server';
import { POC_SECTIONS } from '@/lib/site/anchors';

export default async function Home() {
  const site = await loadSite();
  return (
    <main id="conteudo" tabIndex={-1} className={styles.main}>
      <Container>
        <h1 className={styles.title}>{site.brandName}</h1>
        <p className={styles.description}>
          Estamos preparando nosso novo site.
        </p>
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
  );
}

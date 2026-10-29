import { Header } from '@/components/layout/Header';
import { loadSite } from '@/lib/site/load-site.server';
import styles from './page.module.scss';
import { Container } from '@/components/ui/Container';
import { ActionLink } from '@/components/ui/ActionLink';

export default async function NotFound() {
  const { site } = await loadSite();
  return (
    <>
      <Header site={site} />
      <main id="conteudo" tabIndex={-1} className={styles.main}>
        <Container>
          <h1 className={styles.title}>Página não encontrada</h1>
          <p className={styles.description}>
            Não encontramos o endereço solicitado.
          </p>
          <ActionLink className={styles.returnLink} href="/">
            Voltar à página inicial
          </ActionLink>
        </Container>
      </main>
    </>
  );
}

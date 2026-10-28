import styles from './page.module.scss';
import { Container } from '@/components/ui/Container';
import { ActionLink } from '@/components/ui/ActionLink';

export default function NotFound() {
  return (
    <main className={styles.main}>
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
  );
}

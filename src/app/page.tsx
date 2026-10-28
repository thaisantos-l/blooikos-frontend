import styles from './page.module.scss';
import { Container } from '@/components/ui/Container';

export default function Home() {
  return (
    <main className={styles.main}>
      <Container>
        <h1 className={styles.title}>Blooikos</h1>
        <p className={styles.description}>
          Estamos preparando nosso novo site.
        </p>
      </Container>
    </main>
  );
}

import styles from './page.module.scss';

export default function NotFound() {
  return (
    <main className={styles.main}>
      <div className="container">
        <h1 className={styles.title}>Página não encontrada</h1>
        <p className={styles.description}>
          Não encontramos o endereço solicitado.
        </p>
        {/* Navegação nativa: funciona também no export sem JavaScript. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a className={styles.returnLink} href="/">
          Voltar à página inicial
        </a>
      </div>
    </main>
  );
}

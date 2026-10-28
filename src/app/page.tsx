import styles from './page.module.scss';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className="container">
        <div className="row">
          <div className="col-12 col-lg-8">
            <h1 className={styles.title}>Blooikos</h1>
            <p className={styles.description}>
              Estamos preparando nosso novo site.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

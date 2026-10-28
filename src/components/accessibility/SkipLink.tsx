import styles from './SkipLink.module.scss';
export function SkipLink() {
  return (
    <a className={styles.skip} href="#conteudo">
      Pular para o conteúdo
    </a>
  );
}

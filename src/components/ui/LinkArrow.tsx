import {
  linkAttributes,
  NEW_TAB_LABEL,
  type NativeLinkProps,
} from '../../lib/links';
import styles from './LinkArrow.module.scss';

export function LinkArrow({
  className = '',
  children,
  ...props
}: NativeLinkProps) {
  return (
    <a
      {...props}
      {...linkAttributes(props)}
      className={`${styles.link} ${className}`}
    >
      <span className={styles.label}>{children}</span>
      {/* SVG original 1:189, local e decorativo; nenhum otimizador de imagem em runtime. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.arrow}
        src="/icons/arrow-right.svg"
        alt=""
        aria-hidden="true"
      />
      {props.target === '_blank' ? (
        <span className="sr-only"> ({NEW_TAB_LABEL})</span>
      ) : null}
    </a>
  );
}

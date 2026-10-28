import {
  linkAttributes,
  NEW_TAB_LABEL,
  type NativeLinkProps,
} from '../../lib/links';
import styles from './Action.module.scss';

export type ActionLinkProps = NativeLinkProps & {
  variant?: 'primary' | 'outline-inverse';
};

export function ActionLink({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ActionLinkProps) {
  return (
    <a
      {...props}
      {...linkAttributes(props)}
      className={`${styles.action} ${styles[variant]} ${className}`}
    >
      <span className={styles.label}>{children}</span>
      {props.target === '_blank' ? (
        <span className="sr-only"> ({NEW_TAB_LABEL})</span>
      ) : null}
    </a>
  );
}

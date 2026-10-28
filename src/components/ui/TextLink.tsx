import {
  linkAttributes,
  NEW_TAB_LABEL,
  type NativeLinkProps,
} from '../../lib/links';
import { inter } from '../../styles/fonts';
import styles from './TextLink.module.scss';

export type TextLinkProps = NativeLinkProps & {
  typography?: 'body' | 'navigation' | 'footer';
  tone?: 'default' | 'inverse';
};

export function TextLink({
  typography = 'body',
  tone = 'default',
  className = '',
  children,
  ...props
}: TextLinkProps) {
  return (
    <a
      {...props}
      {...linkAttributes(props)}
      className={`${styles.link} ${styles[typography]} ${tone === 'inverse' ? styles.inverse : ''} ${typography === 'navigation' ? inter.variable : ''} ${className}`}
    >
      {children}
      {props.target === '_blank' ? (
        <span className="sr-only"> ({NEW_TAB_LABEL})</span>
      ) : null}
    </a>
  );
}

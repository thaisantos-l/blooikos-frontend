import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import styles from './Action.module.scss';

export type ButtonProps = Omit<
  ComponentPropsWithoutRef<'button'>,
  'children' | 'role'
> & {
  children: ReactNode;
  variant?: 'primary' | 'outline-inverse';
  href?: never;
};

export function Button({
  type = 'button',
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={`${styles.action} ${styles[variant]} ${className}`}
    >
      <span className={styles.label}>{children}</span>
    </button>
  );
}

import type { ComponentPropsWithoutRef } from 'react';
import styles from './Container.module.scss';

export function Container({
  className = '',
  ...props
}: ComponentPropsWithoutRef<'div'>) {
  return <div {...props} className={`${styles.container} ${className}`} />;
}

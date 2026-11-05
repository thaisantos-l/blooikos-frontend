'use client';

import { useEffect, useRef, useState } from 'react';
import type { SiteChrome } from '../../lib/site/types';
import { Container } from '../ui/Container';
import { BrandLink } from './BrandLink';
import { PrimaryNavigation } from '../navigation/PrimaryNavigation';
import { MobileNavigation } from '../navigation/MobileNavigation.client';
import styles from './Header.module.scss';
export function Header({
  site,
  variant = 'solid',
}: {
  site: SiteChrome;
  variant?: 'solid' | 'hero';
}) {
  const header = useRef<HTMLElement>(null);
  const lastFixed = useRef(false);
  const [fixed, setFixed] = useState(false);
  const hasContent = Boolean(
    site.brandName ||
    site.logo ||
    site.logoInverse ||
    site.primaryNavigation.length,
  );

  useEffect(
    function trackHeader() {
      const element = header.current;
      if (!element) return;
      const root = document.documentElement;
      const previousHeight = root.style.getPropertyValue(
        '--site-header-height',
      );
      function measure() {
        root.style.setProperty(
          '--site-header-height',
          `${element!.offsetHeight}px`,
        );
      }
      function updatePosition() {
        const next = window.scrollY > 30;
        if (next === lastFixed.current) return;
        lastFixed.current = next;
        setFixed(next);
      }
      const observer =
        typeof ResizeObserver === 'undefined'
          ? null
          : new ResizeObserver(measure);
      observer?.observe(element);
      measure();
      updatePosition();
      window.addEventListener('scroll', updatePosition, { passive: true });
      window.addEventListener('pageshow', updatePosition);
      window.addEventListener('resize', measure);
      return function cleanupHeader() {
        observer?.disconnect();
        window.removeEventListener('scroll', updatePosition);
        window.removeEventListener('pageshow', updatePosition);
        window.removeEventListener('resize', measure);
        if (previousHeight)
          root.style.setProperty('--site-header-height', previousHeight);
        else root.style.removeProperty('--site-header-height');
      };
    },
    [hasContent],
  );

  if (!hasContent) return <header />;
  return (
    <>
      <header
        ref={header}
        className={`${styles.header} ${variant === 'solid' ? styles.solid : ''} ${fixed ? styles.fixed : ''}`}
      >
        <Container className={styles.inner}>
          <BrandLink
            name={site.brandName}
            logo={site.logo ?? site.logoInverse}
            placement="header"
          />
          {site.primaryNavigation.length ? (
            <>
              <PrimaryNavigation links={site.primaryNavigation} />
              <MobileNavigation links={site.primaryNavigation} />
            </>
          ) : null}
        </Container>
      </header>
      {variant === 'solid' ? (
        <div className={styles.spacer} aria-hidden="true" />
      ) : null}
    </>
  );
}

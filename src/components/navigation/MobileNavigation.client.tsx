'use client';
import { useEffect, useRef } from 'react';
import type { MouseEvent } from 'react';
import { TextLink } from '../ui/TextLink';
import type { SiteLink } from '../../lib/site/types';
import { inter } from '../../styles/fonts';
import styles from './Navigation.module.scss';

export function MobileNavigation({ links }: { links: SiteLink[] }) {
  const details = useRef<HTMLDetailsElement>(null);
  const summary = useRef<HTMLElement>(null);
  useEffect(function watchBreakpoint() {
    const media = matchMedia('(min-width: 992px)');
    const desktop = document.getElementById('primary-navigation');
    let lastFocused: Element | null = null;
    function rememberFocus(event: FocusEvent) {
      lastFocused = event.target instanceof Element ? event.target : null;
    }
    function change() {
      // O navegador pode desfocar o link assim que display:none passa a valer.
      const active =
        document.activeElement === document.body
          ? lastFocused
          : document.activeElement;
      if (media.matches) {
        const hadFocus = details.current?.contains(active);
        const id =
          active instanceof HTMLElement
            ? active.dataset.navigationId
            : undefined;
        if (details.current) details.current.open = false;
        if (hadFocus) {
          const links = Array.from(
            desktop?.querySelectorAll<HTMLAnchorElement>('a') ?? [],
          );
          (
            links.find((link) => link.dataset.navigationId === id) ?? links[0]
          )?.focus();
        }
      } else if (desktop?.contains(active)) summary.current?.focus();
    }
    document.addEventListener('focusin', rememberFocus);
    media.addEventListener('change', change);
    return function cleanup() {
      document.removeEventListener('focusin', rememberFocus);
      media.removeEventListener('change', change);
    };
  }, []);
  function selectLink(event: MouseEvent<HTMLDetailsElement>) {
    const anchor =
      event.target instanceof Element ? event.target.closest('a') : null;
    if (!anchor || event.defaultPrevented) return;
    if (details.current) details.current.open = false;
    const url = new URL(anchor.href);
    const samePage =
      url.origin === location.origin &&
      url.pathname === location.pathname &&
      url.search === location.search;
    if (
      samePage &&
      url.hash &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      anchor.target !== '_blank'
    ) {
      requestAnimationFrame(() =>
        document.getElementById(decodeURIComponent(url.hash.slice(1)))?.focus(),
      );
    } else summary.current?.focus();
  }
  return (
    <details
      ref={details}
      className={styles.mobile}
      onClick={selectLink}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && details.current?.open) {
          event.preventDefault();
          details.current.open = false;
          summary.current?.focus();
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          event.currentTarget.open = false;
      }}
    >
      <summary ref={summary} className={`${styles.summary} ${inter.variable}`}>
        Menu
      </summary>
      <nav aria-label="Navegação principal móvel">
        <ul className={styles.mobileList}>
          {links.map((link) => (
            <li key={link.id}>
              <TextLink
                data-navigation-id={link.id}
                href={link.href}
                target={link.target}
                typography="navigation"
                tone="inverse"
              >
                {link.label}
              </TextLink>
            </li>
          ))}
        </ul>
      </nav>
    </details>
  );
}

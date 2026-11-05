'use client';
import { useCallback, useEffect, useRef } from 'react';
import type { MouseEvent } from 'react';
import { TextLink } from '../ui/TextLink';
import type { SiteLink } from '../../lib/site/types';
import styles from './Navigation.module.scss';

export function MobileNavigation({ links }: { links: SiteLink[] }) {
  const details = useRef<HTMLDetailsElement>(null);
  const summary = useRef<HTMLElement>(null);
  const panel = useRef<HTMLElement>(null);
  const animation = useRef<Animation | null>(null);

  const changeMenu = useCallback((open: boolean, immediate = false) => {
    const root = details.current;
    const content = panel.current;
    if (!root || !content || (!root.open && !open)) return;
    if (!open && !immediate && root.hasAttribute('data-closing')) return;

    const current = animation.current ? getComputedStyle(content) : null;
    const from = {
      opacity: current?.opacity ?? (open ? '0' : '1'),
      transform: current?.transform ?? (open ? 'translateY(-8px)' : 'none'),
    };
    animation.current?.cancel();
    animation.current = null;

    function finish() {
      root!.open = open;
      delete root!.dataset.closing;
      content!.inert = false;
    }
    if (
      immediate ||
      matchMedia('(prefers-reduced-motion: reduce)').matches ||
      typeof content.animate !== 'function'
    ) {
      finish();
      return;
    }

    root.open = true;
    content.inert = !open;
    if (open) delete root.dataset.closing;
    else root.dataset.closing = 'true';
    const transition = content.animate(
      [
        from,
        {
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0)' : 'translateY(-8px)',
        },
      ],
      {
        duration: 360,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        fill: 'both',
      },
    );
    animation.current = transition;
    transition.onfinish = () => {
      if (animation.current !== transition) return;
      finish();
      animation.current = null;
      transition.cancel();
    };
  }, []);

  useEffect(
    function watchNavigation() {
      const media = matchMedia('(min-width: 992px)');
      const motion = matchMedia('(prefers-reduced-motion: reduce)');
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
          changeMenu(false, true);
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
      function outside(event: PointerEvent) {
        if (
          event.target instanceof Node &&
          details.current?.open &&
          !details.current.contains(event.target)
        ) {
          if (panel.current?.contains(document.activeElement))
            summary.current?.focus({ preventScroll: true });
          changeMenu(false);
        }
      }
      function reduceMotion() {
        if (motion.matches && details.current?.open)
          changeMenu(!details.current.hasAttribute('data-closing'), true);
      }
      document.addEventListener('focusin', rememberFocus);
      document.addEventListener('pointerdown', outside);
      media.addEventListener('change', change);
      motion.addEventListener('change', reduceMotion);
      return function cleanup() {
        animation.current?.cancel();
        document.removeEventListener('focusin', rememberFocus);
        document.removeEventListener('pointerdown', outside);
        media.removeEventListener('change', change);
        motion.removeEventListener('change', reduceMotion);
      };
    },
    [changeMenu],
  );
  function selectLink(event: MouseEvent<HTMLDetailsElement>) {
    const anchor =
      event.target instanceof Element ? event.target.closest('a') : null;
    if (!anchor || event.defaultPrevented) return;
    changeMenu(false);
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
        document
          .getElementById(decodeURIComponent(url.hash.slice(1)))
          ?.focus({ preventScroll: true }),
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
          changeMenu(false);
          summary.current?.focus();
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          changeMenu(false);
      }}
    >
      <summary
        ref={summary}
        className={styles.summary}
        onClick={(event) => {
          event.preventDefault();
          changeMenu(
            !details.current?.open ||
              details.current.hasAttribute('data-closing'),
          );
        }}
      >
        <span className={styles.icon} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className="sr-only">Menu principal</span>
      </summary>
      <nav
        ref={panel}
        className={styles.panel}
        aria-label="Navegação principal móvel"
      >
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

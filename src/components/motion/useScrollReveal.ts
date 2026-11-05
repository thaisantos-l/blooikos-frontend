'use client';

import { useEffect, useRef } from 'react';

// Progressive enhancement: the server HTML and the resting styles stay visible.
export function useScrollReveal() {
  const root = useRef<HTMLElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const seen = useRef(new WeakSet<HTMLElement>());
  const pending = useRef(new Set<HTMLElement>());

  useEffect(function observeEntrance() {
    const container = root.current;
    if (
      !container ||
      typeof IntersectionObserver === 'undefined' ||
      typeof HTMLElement.prototype.animate !== 'function'
    )
      return;

    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const animations = new Map<HTMLElement, Animation>();
    const waiting = pending.current;
    const visited = seen.current;

    function isNavigationTarget(element: HTMLElement) {
      const focused = document.activeElement;
      if (
        focused &&
        focused !== document.body &&
        (element.contains(focused) || focused.contains(element))
      )
        return true;
      try {
        const anchor = document.getElementById(
          decodeURIComponent(location.hash.slice(1)),
        );
        return Boolean(
          anchor && (anchor.contains(element) || element.contains(anchor)),
        );
      } catch {
        return false;
      }
    }

    const intersection = new IntersectionObserver(
      (entries) => {
        let order = 0;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const element = entry.target as HTMLElement;
          intersection.unobserve(element);
          waiting.delete(element);
          if (visited.has(element)) continue;
          visited.add(element);
          if (preference.matches || isNavigationTarget(element)) continue;

          // Independent translate preserves the existing card hover transform.
          const animation = element.animate(
            [
              { opacity: 0, translate: '0 10px' },
              { opacity: 1, translate: '0 0' },
            ],
            {
              duration: 800,
              delay: Math.min(order++, 3) * 80,
              easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              fill: 'backwards',
            },
          );
          animations.set(element, animation);
          animation.onfinish = () => animations.delete(element);
        }
      },
      { rootMargin: '0px 0px -24px 0px', threshold: 0 },
    );
    observer.current = intersection;

    function prioritizeNavigation() {
      for (const [element, animation] of animations) {
        if (preference.matches || isNavigationTarget(element)) {
          animation.cancel();
          animations.delete(element);
        }
      }
    }
    container.addEventListener('focusin', prioritizeNavigation);
    window.addEventListener('hashchange', prioritizeNavigation);
    preference.addEventListener('change', prioritizeNavigation);

    return function cleanupEntrance() {
      intersection.disconnect();
      observer.current = null;
      waiting.clear();
      for (const animation of animations.values()) animation.cancel();
      container.removeEventListener('focusin', prioritizeNavigation);
      window.removeEventListener('hashchange', prioritizeNavigation);
      preference.removeEventListener('change', prioritizeNavigation);
    };
  }, []);

  // Runs after content renders; existing DOM nodes never restart their entrance.
  useEffect(function registerContent() {
    const container = root.current;
    const intersection = observer.current;
    if (!container || !intersection) return;
    for (const element of pending.current) {
      if (!container.contains(element)) {
        intersection.unobserve(element);
        pending.current.delete(element);
      }
    }
    for (const element of container.querySelectorAll<HTMLElement>(
      '[data-reveal]',
    )) {
      if (seen.current.has(element) || pending.current.has(element)) continue;
      pending.current.add(element);
      intersection.observe(element);
    }
  });

  return root;
}

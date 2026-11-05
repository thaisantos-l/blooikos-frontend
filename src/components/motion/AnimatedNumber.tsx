'use client';

import { useEffect, useRef } from 'react';
import { countValue } from './count-value';
import styles from './AnimatedNumber.module.scss';

export function AnimatedNumber({ value }: { value: string }) {
  const display = useRef<HTMLSpanElement>(null);
  const played = useRef(false);

  useEffect(
    function countOnEntrance() {
      const element = display.current;
      if (!element) return;
      element.textContent = value;
      const format = countValue(value);
      if (
        !format ||
        played.current ||
        typeof IntersectionObserver === 'undefined'
      )
        return;

      const preference = matchMedia('(prefers-reduced-motion: reduce)');
      let frame = 0;
      const observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          observer.disconnect();
          played.current = true;
          if (
            preference.matches ||
            location.hash === `#${element.closest('section')?.id}`
          )
            return;

          const start = performance.now();
          element.textContent = format(0);
          function tick(now: number) {
            const progress = Math.min((now - start) / 1400, 1);
            element!.textContent = format!(1 - (1 - progress) ** 3);
            if (progress < 1) frame = requestAnimationFrame(tick);
          }
          frame = requestAnimationFrame(tick);
        },
        { threshold: 0.4 },
      );

      function finish() {
        if (!preference.matches) return;
        played.current = true;
        cancelAnimationFrame(frame);
        observer.disconnect();
        element!.textContent = value;
      }
      preference.addEventListener('change', finish);
      if (preference.matches) finish();
      else observer.observe(element);

      return function cleanupCount() {
        cancelAnimationFrame(frame);
        observer.disconnect();
        preference.removeEventListener('change', finish);
        element.textContent = value;
      };
    },
    [value],
  );

  return (
    <span className={styles.counter}>
      <span className={styles.size} aria-hidden="true">
        {value}
      </span>
      <span ref={display} className={styles.display} aria-hidden="true">
        {value}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}

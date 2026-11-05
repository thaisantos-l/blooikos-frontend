'use client';

import { useEffect } from 'react';
import { readSiteIcon } from '../../lib/site/site-icon';

export function SiteIcon({
  endpoint,
  production,
}: {
  endpoint: string;
  production: boolean;
}) {
  useEffect(
    function syncSiteIcon() {
      let active: AbortController | undefined;
      let disposed = false;
      let wasHidden = document.visibilityState === 'hidden';
      let icon: HTMLLinkElement | undefined;

      async function refresh() {
        if (disposed || active) return;
        const controller = new AbortController();
        active = controller;
        const timeout = setTimeout(() => controller.abort(), 4000);
        try {
          const response = await fetch(endpoint, {
            credentials: 'omit',
            cache: 'no-cache',
            redirect: 'error',
            signal: controller.signal,
          });
          if (!response.ok) throw new Error('SITE_ICON_UNAVAILABLE');
          const href = readSiteIcon(await response.json(), production);
          if (disposed || controller.signal.aborted) return;
          // Uma única declaração; nenhuma imagem ACF participa desta seleção.
          document.head.querySelectorAll('link[rel="icon"]').forEach((node) => {
            if (node !== icon) node.remove();
          });
          if (href === null) {
            icon?.remove();
            icon = undefined;
          } else {
            if (!icon) {
              icon = document.createElement('link');
              icon.rel = 'icon';
              icon.dataset.siteIcon = 'wordpress';
              document.head.append(icon);
            }
            if (icon.href !== href) icon.href = href;
          }
        } catch {
          // Metadado opcional: rede/timeout/resposta inválida mantêm o último válido.
        } finally {
          clearTimeout(timeout);
          active = undefined;
        }
      }

      function visible() {
        const hidden = document.visibilityState === 'hidden';
        if (wasHidden && !hidden) void refresh();
        wasHidden = hidden;
      }

      void refresh();
      document.addEventListener('visibilitychange', visible);
      return function cleanup() {
        disposed = true;
        active?.abort();
        icon?.remove();
        document.removeEventListener('visibilitychange', visible);
      };
    },
    [endpoint, production],
  );
  return null;
}

'use client';
import { useEffect, useState } from 'react';
import { Footer } from '../layout/Footer';
import { useSiteContent } from './ContentProvider';
import {
  footerSocialEndpoint,
  requestFooterSocial,
  type FooterSocial,
} from '../../lib/site/footer-social';

export function LiveFooter({
  initialSocial = { companies: [], contactInstagram: null },
}: {
  initialSocial?: FooterSocial;
}) {
  const { content, config } = useSiteContent();
  const [social, setSocial] = useState(initialSocial);
  const endpoint = footerSocialEndpoint(config.contactEndpoint);
  useEffect(() => {
    let disposed = false;
    let active: AbortController | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let etag: string | undefined;
    let failures = 0;
    async function refresh() {
      if (disposed || active || document.visibilityState !== 'visible') return;
      clearTimeout(timer);
      const controller = new AbortController();
      active = controller;
      let delay = 5000;
      try {
        const result = await requestFooterSocial(
          endpoint,
          controller.signal,
          etag,
        );
        if (disposed || controller.signal.aborted) return;
        if (result) {
          setSocial({
            companies: result.companies,
            contactInstagram: result.contactInstagram,
          });
          etag = result.etag;
        }
        failures = 0;
      } catch {
        // A transport failure preserves the last valid menu; [] removes it.
        delay = Math.min(120000, 5000 * 2 ** Math.min(++failures, 5));
      } finally {
        active = null;
        if (!disposed && document.visibilityState === 'visible')
          timer = setTimeout(refresh, delay);
      }
    }
    function visible() {
      clearTimeout(timer);
      if (document.visibilityState === 'visible') void refresh();
    }
    document.addEventListener('visibilitychange', visible);
    window.addEventListener('online', visible);
    void refresh();
    return () => {
      disposed = true;
      clearTimeout(timer);
      active?.abort();
      document.removeEventListener('visibilitychange', visible);
      window.removeEventListener('online', visible);
    };
  }, [endpoint]);
  return (
    <Footer
      site={content.site}
      social={social.companies}
      contactInstagram={social.contactInstagram}
    />
  );
}

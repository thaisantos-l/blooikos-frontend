'use client';
import { useEffect, useState } from 'react';
import {
  footerSocialEndpoint,
  requestFooterSocial,
  type FooterSocial,
} from './footer-social';

// One polling stream supplies both footer and shared contact Instagram fields.
export function useFooterSocial(
  contactEndpoint: string,
  initialSocial: FooterSocial = {
    companies: [],
    contactInstagram: null,
    sharedInstagram: null,
  },
): FooterSocial {
  const [social, setSocial] = useState(initialSocial);
  const endpoint = footerSocialEndpoint(contactEndpoint);
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
            sharedInstagram: result.sharedInstagram,
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
  return social;
}

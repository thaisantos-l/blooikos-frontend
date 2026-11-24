import 'server-only';
import { cache } from 'react';
import { runtimeConfig } from './runtime-config.server';
import {
  footerSocialEndpoint,
  requestFooterSocial,
  type FooterSocial,
} from './footer-social';

// Additive endpoint: older CMS releases may not expose the optional menu yet.
export const loadFooterSocial = cache(async (): Promise<FooterSocial> => {
  const empty: FooterSocial = {
    companies: [],
    contactInstagram: null,
    sharedInstagram: null,
  };
  try {
    const endpoint = footerSocialEndpoint(runtimeConfig().contactEndpoint);
    const result = await requestFooterSocial(endpoint);
    return result
      ? {
          companies: result.companies,
          contactInstagram: result.contactInstagram,
          sharedInstagram: result.sharedInstagram,
        }
      : empty;
  } catch {
    return empty;
  }
});

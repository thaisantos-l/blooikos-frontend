import 'server-only';
import { contactEndpoint } from '../contact/endpoint.server';
import { parseSiteOrigin } from './normalize';
import type { RuntimeConfig } from './runtime-content';

export function runtimeConfig(): RuntimeConfig {
  const contact = contactEndpoint();
  return {
    endpoint: contact.replace(/\/contact$/, '/site-content'),
    contactEndpoint: contact,
    siteOrigin: parseSiteOrigin(process.env.SITE_ORIGIN),
    production: process.env.NODE_ENV === 'production',
  };
}

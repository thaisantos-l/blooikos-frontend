import { contentObject as object, contentText as text } from './normalize';
import type { SiteChrome } from './types';

export interface ContactContent {
  eyebrow: string;
  title: string;
  variant: 'light' | 'muted';
  company: string;
  contacts: SiteChrome['contacts'];
  showForm: boolean;
}

export function normalizeContact(
  data: unknown,
  site: SiteChrome,
): ContactContent {
  const root = object(data);
  const home = object(root.home);
  const validHome = home.__typename === 'Page' && home.isFrontPage === true;
  const fields = validHome ? object(home.blooikosHomeContact) : {};
  const settings = object(object(root.blooikosSettings).blooikosSiteContact);
  const variant = Array.isArray(fields.variant)
    ? fields.variant[0]
    : fields.variant;
  return {
    eyebrow: text(fields.eyebrow),
    title: text(fields.title),
    variant: variant === 'light' ? 'light' : 'muted',
    company: text(object(object(settings.contactCompany).node).title),
    contacts: site.contacts,
    showForm: validHome && Boolean(site.contacts.email),
  };
}

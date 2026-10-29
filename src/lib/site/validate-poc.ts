import contract from '../../../contracts/cms/v1/contract.json';
import { GraphQLClientError } from '../graphql/errors';
import type { SiteChrome, SiteLink } from './types';
import {
  contentObject as object,
  contentText as text,
  contentLink,
  contentImage,
  copyrightYear,
  editorialDestination,
  parseSiteOrigin,
  phoneDestination,
} from './normalize';

export const POC_CONTRACT_VERSION = contract.contractVersion;
// Normaliza chrome opcional; o envelope e erros GraphQL são verificados no transporte.
export function validatePoc(
  data: unknown,
  options: { production?: boolean; siteOrigin?: string; now?: Date } = {},
): SiteChrome {
  if (data === null || typeof data !== 'object' || Array.isArray(data))
    throw new GraphQLClientError('INVALID_RESPONSE');
  const siteOrigin = parseSiteOrigin(options.siteOrigin);
  const root = object(data),
    settings = object(root.blooikosSettings);
  const identity = object(settings.blooikosSiteIdentity),
    footer = object(settings.blooikosSiteFooter),
    contact = object(settings.blooikosSiteContact);
  function nodes(value: unknown): unknown[] {
    const list = object(value).nodes;
    return Array.isArray(list) ? list : [];
  }
  function menu(value: unknown): SiteLink[] {
    return nodes(value).flatMap((item, index) => {
      const node = object(item),
        link = contentLink({ ...node, title: node.label }, siteOrigin);
      return link ? [{ ...link, id: text(node.id) || String(index) }] : [];
    });
  }
  const phone = text(contact.phone),
    email = text(contact.email);
  let instagram: string | undefined;
  if (text(contact.instagramUrl)) {
    try {
      instagram = editorialDestination(text(contact.instagramUrl), true);
    } catch {
      /* Destino inseguro não é renderizado. */
    }
  }
  return {
    brandName: text(identity.brandName),
    logo: contentImage(identity.logo, options.production),
    logoInverse: contentImage(identity.logoInverse, options.production),
    primaryNavigation: menu(root.primaryMenu),
    footerNavigation: menu(root.footerMenu),
    description: text(footer.footerDescription),
    companies: nodes(footer.footerCompanies).flatMap((item, index) => {
      const node = object(item),
        fields = object(node.blooikosCompanyFields);
      const name = text(fields.shortName) || text(node.title);
      return name
        ? [
            {
              id: text(node.id) || String(index),
              name,
              link: contentLink(fields.cta, siteOrigin),
            },
          ]
        : [];
    }),
    contacts: {
      phone:
        /^[0-9 ()+\-]+$/.test(phone) &&
        /^[0-9]{8,15}$/.test(phone.replace(/\D/g, ''))
          ? { label: phone, href: phoneDestination(phone) }
          : undefined,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? {
            label: email,
            href: 'mailto:' + encodeURIComponent(email).replace('%40', '@'),
          }
        : undefined,
      instagram,
      address: text(contact.address) || undefined,
    },
    copyrightHolder: text(footer.copyrightHolder),
    year: copyrightYear(options.now),
  };
}

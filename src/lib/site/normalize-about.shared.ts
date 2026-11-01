import {
  contentObject as object,
  contentText as text,
  contentImage,
  contentLink,
  parseSiteOrigin,
} from './normalize';
import type { SiteImage, SiteLink } from './types';

import { visibleText, type RichTextOptions } from './visible-text';

export interface AboutContent {
  eyebrow: string;
  title: string;
  body: string;
  variant: 'light' | 'muted';
  cta?: Omit<SiteLink, 'id'>;
  companies: {
    id: string;
    name: string;
    summary: string;
    icon?: SiteImage;
  }[];
}

export function normalizeAbout(
  data: unknown,
  options: RichTextOptions,
): AboutContent {
  const siteOrigin = parseSiteOrigin(options.siteOrigin);
  const home = object(object(data).home);
  const fields =
    home.__typename === 'Page' && home.isFrontPage === true
      ? object(home.blooikosHomeAbout)
      : {};
  const html = text(fields.body);
  // Não sanitiza nem reescreve HTML: a allowlist pertence ao contrato do CMS.
  const hasText = visibleText(html, options.readText);
  const variant = Array.isArray(fields.variant)
    ? fields.variant[0]
    : fields.variant;
  const nodes = object(fields.companies).nodes;
  const companies = (Array.isArray(nodes) ? nodes : [])
    .flatMap((value, index) => {
      const node = object(value);
      const company = object(node.blooikosCompanyFields);
      const name = text(node.title);
      const summary = text(company.summary);
      const icon = contentImage(company.cardIcon, options.production);
      return name || summary || icon
        ? [
            {
              id: text(node.id) || `about-company-${index}`,
              name,
              summary,
              icon,
            },
          ]
        : [];
    })
    .slice(0, 6);
  return {
    eyebrow: text(fields.eyebrow),
    title: text(fields.title),
    body: hasText ? html : '',
    variant: variant === 'light' ? 'light' : 'muted',
    cta: contentLink(fields.cta, siteOrigin),
    companies,
  };
}

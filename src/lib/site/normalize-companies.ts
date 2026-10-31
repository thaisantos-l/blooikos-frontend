import { createRequire } from 'node:module';
import {
  contentObject as object,
  contentText as text,
  contentImage,
  contentLink,
  mediaSource,
  parseSiteOrigin,
} from './normalize';
import type { SiteImage, SiteLink } from './types';

// Mesma leitura de texto visível de About; a sanitização pertence ao CMS.
const { parse } = createRequire(import.meta.url)(
  'next/dist/compiled/node-html-parser',
) as { parse(html: string): { textContent: string } };

export interface CompanyContent {
  id: string;
  eyebrow: string;
  heading: string;
  body: string;
  logo?: SiteImage;
  image?: SiteImage & { candidates?: { src: string; width: number }[] };
  cta?: Omit<SiteLink, 'id'>;
}

export interface CompaniesContent {
  items: CompanyContent[];
}

function companyImage(value: unknown, production = false) {
  const image: CompanyContent['image'] = contentImage(value, production);
  if (!image?.alt) return undefined;
  const widths = new Set<number>();
  const sources = new Set<string>();
  const candidates = text(object(object(value).node).srcSet)
    .split(',')
    .flatMap((entry) => {
      const match = entry.trim().match(/^(\S+)\s+([1-9][0-9]*)w$/);
      if (
        !match ||
        !Number.isSafeInteger(Number(match[2])) ||
        widths.has(Number(match[2]))
      )
        return [];
      try {
        const src = mediaSource(match[1], production);
        if (sources.has(src)) return [];
        widths.add(Number(match[2]));
        sources.add(src);
        return [{ src, width: Number(match[2]) }];
      } catch {
        return [];
      }
    });
  if (candidates.length) image.candidates = candidates.slice(0, 32);
  return image;
}

export function normalizeCompanies(
  data: unknown,
  options: { production?: boolean; siteOrigin?: string } = {},
): CompaniesContent {
  const siteOrigin = parseSiteOrigin(options.siteOrigin);
  const home = object(object(data).home);
  const fields =
    home.__typename === 'Page' && home.isFrontPage === true
      ? object(home.blooikosHomeCompanies)
      : {};
  const nodes = object(fields.featured).nodes;
  const items = (Array.isArray(nodes) ? nodes : [])
    .flatMap((value, index) => {
      const node = object(value);
      const fields = object(node.blooikosCompanyFields);
      const eyebrow = text(fields.eyebrow);
      const heading = text(fields.heading);
      const html = text(fields.body);
      const body = parse(html)
        .textContent.replace(/[\u200B-\u200D\uFEFF]/g, '')
        .trim()
        ? html
        : '';
      const mediaLogo = contentImage(fields.logo, options.production);
      const logo = mediaLogo?.alt ? mediaLogo : undefined;
      const image = companyImage(fields.image, options.production);
      const cta = contentLink(fields.cta, siteOrigin);
      return logo || eyebrow || heading || body || image || cta
        ? [
            {
              id: text(node.id) || `featured-company-${index}`,
              logo,
              eyebrow,
              heading,
              body,
              image,
              cta,
            },
          ]
        : [];
    })
    .slice(0, 3);
  return { items };
}

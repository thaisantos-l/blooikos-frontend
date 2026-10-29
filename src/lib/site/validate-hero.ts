import {
  contentObject as object,
  contentText as text,
  contentImage,
  contentLink,
  mediaSource,
  parseSiteOrigin,
} from './normalize';
import type { SiteChrome, SiteImage, SiteLink } from './types';
import { validatePoc } from './validate-poc';

export interface HeroContent {
  eyebrow: string;
  titleBefore: string;
  titleHighlight: string;
  titleAfter: string;
  description: string;
  background?: SiteImage & { candidates?: { src: string; width: number }[] };
  primaryCta?: Omit<SiteLink, 'id'>;
  secondaryCta?: Omit<SiteLink, 'id'>;
}
export interface SiteContent {
  site: SiteChrome;
  hero: HeroContent;
}
type Options = Parameters<typeof validatePoc>[1];
export function validateHero(
  data: unknown,
  options: Options = {},
): HeroContent {
  const siteOrigin = parseSiteOrigin(options.siteOrigin);
  const home = object(object(data).home);
  const fields =
    home.__typename === 'Page' && home.isFrontPage === true
      ? object(home.blooikosHomeHero)
      : {};
  const background: HeroContent['background'] = contentImage(
    fields.background,
    options.production,
  );
  if (background) {
    background.alt = '';
    const widths = new Set<number>();
    const candidates = text(object(object(fields.background).node).srcSet)
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
          const src = mediaSource(match[1], options.production ?? false);
          widths.add(Number(match[2]));
          return [{ src, width: Number(match[2]) }];
        } catch {
          return [];
        }
      });
    if (candidates.length) background.candidates = candidates.slice(0, 32);
  }
  return {
    eyebrow: text(fields.eyebrow),
    titleBefore: text(fields.titleBefore),
    titleHighlight: text(fields.titleHighlight),
    titleAfter: text(fields.titleAfter),
    description: text(fields.description),
    background,
    primaryCta: contentLink(fields.primaryCta, siteOrigin),
    secondaryCta: contentLink(fields.secondaryCta, siteOrigin),
  };
}
export function hasHeroContent(hero: HeroContent): boolean {
  return Object.values(hero).some(Boolean);
}
export function validateContent(
  data: unknown,
  options: Options = {},
): SiteContent {
  return {
    site: validatePoc(data, options),
    hero: validateHero(data, options),
  };
}

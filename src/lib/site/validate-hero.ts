import contract from '../../../contracts/cms/v1/contract.json';
import type { ContentProfile } from './content-version';
import {
  mediaSource,
  normalizeDestination,
  parseSiteOrigin,
} from './normalize';
import {
  PocValidationError,
  type PocIssue,
  type SiteChrome,
  type SiteImage,
  type SiteLink,
} from './types';
import { validatePoc } from './validate-poc';

export interface HeroContent {
  eyebrow: string;
  titleBefore: string;
  titleHighlight: string;
  titleAfter: string;
  description: string;
  background: SiteImage & { candidates?: { src: string; width: number }[] };
  primaryCta: Omit<SiteLink, 'id'>;
  secondaryCta?: Omit<SiteLink, 'id'>;
}
export type SiteContent =
  | { profile: 'poc'; site: SiteChrome }
  | { profile: 'home-hero'; site: SiteChrome; hero: HeroContent };
type Options = Parameters<typeof validatePoc>[1];
const object = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);

export function validateHero(
  data: unknown,
  options: Options = {},
): HeroContent {
  const issues: PocIssue[] = [];
  const root = 'data.home.blooikosHomeHero';
  const issue = (path: string, code: PocIssue['code'] = 'INVALID_CONTENT') =>
    issues.push({ path, code });
  const home = object(data) && object(data.home) ? data.home : {};
  if (
    home.__typename !== 'Page' ||
    home.isFrontPage !== true ||
    typeof home.id !== 'string' ||
    !home.id.trim()
  )
    issue('data.home', 'MISSING_REQUIRED_CONTENT');
  const fields = object(home.blooikosHomeHero) ? home.blooikosHomeHero : {};
  const rules = contract.responseRules.Hero;
  function text(key: keyof typeof rules): string {
    const value = fields[key];
    if (value === null || value === undefined || value === '') {
      if (rules[key].required)
        issue(root + '.' + key, 'MISSING_REQUIRED_CONTENT');
      return '';
    }
    const rule = rules[key];
    if (
      typeof value !== 'string' ||
      !value.replace(/<[^>]*>/g, '').trim() ||
      ('max' in rule && [...value].length > rule.max)
    ) {
      issue(root + '.' + key);
      return '';
    }
    return value;
  }
  function link(key: 'primaryCta' | 'secondaryCta') {
    const value = fields[key];
    if (value === null || value === undefined) {
      if (key === 'primaryCta')
        issue(root + '.' + key, 'MISSING_REQUIRED_CONTENT');
      return undefined;
    }
    try {
      if (
        !object(value) ||
        typeof value.title !== 'string' ||
        !value.title.replace(/<[^>]*>/g, '').trim() ||
        typeof value.url !== 'string' ||
        (value.target !== null &&
          value.target !== '' &&
          value.target !== undefined &&
          value.target !== '_blank')
      )
        throw new Error();
      return {
        label: value.title,
        href: normalizeDestination(
          value.url,
          parseSiteOrigin(options.siteOrigin),
        ),
        target: value.target === '_blank' ? ('_blank' as const) : undefined,
      };
    } catch {
      issue(root + '.' + key, 'INVALID_DESTINATION');
      return undefined;
    }
  }
  const image =
    object(fields.background) && object(fields.background.node)
      ? fields.background.node
      : {};
  const dimensions = object(image.mediaDetails) ? image.mediaDetails : {};
  let background: HeroContent['background'] | undefined;
  try {
    if (
      typeof image.sourceUrl !== 'string' ||
      !['image/jpeg', 'image/png', 'image/webp'].includes(
        String(image.mimeType),
      ) ||
      ![dimensions.width, dimensions.height].every(
        (v) => typeof v === 'number' && Number.isSafeInteger(v) && v > 0,
      )
    )
      throw new Error();
    const src = mediaSource(image.sourceUrl, options.production ?? false);
    let candidates: { src: string; width: number }[] | undefined;
    if (
      image.srcSet !== null &&
      image.srcSet !== undefined &&
      image.srcSet !== ''
    ) {
      if (typeof image.srcSet !== 'string') throw new Error();
      const widths = new Set<number>(),
        sources = new Set<string>();
      candidates = image.srcSet.split(',').map((entry) => {
        const match = entry.trim().match(/^(\S+)\s+([1-9][0-9]*)w$/);
        if (!match) throw new Error();
        const candidate = {
          src: mediaSource(match[1], options.production ?? false),
          width: Number(match[2]),
        };
        if (
          !Number.isSafeInteger(candidate.width) ||
          widths.has(candidate.width) ||
          sources.has(candidate.src)
        )
          throw new Error();
        widths.add(candidate.width);
        sources.add(candidate.src);
        return candidate;
      });
      if (candidates.length > 32) throw new Error();
    }
    background = {
      src,
      alt: '',
      width: Number(dimensions.width),
      height: Number(dimensions.height),
      candidates,
    };
  } catch {
    issue(root + '.background', 'INVALID_MEDIA');
  }
  const result = {
    eyebrow: text('eyebrow'),
    titleBefore: text('titleBefore'),
    titleHighlight: text('titleHighlight'),
    titleAfter: text('titleAfter'),
    description: text('description'),
    primaryCta: link('primaryCta'),
    secondaryCta: link('secondaryCta'),
  };
  if (issues.length || !background || !result.primaryCta)
    throw new PocValidationError(issues, 'home-hero');
  return { ...result, primaryCta: result.primaryCta, background };
}

export function validateContent(
  profile: ContentProfile,
  data: unknown,
  options: Options = {},
): SiteContent {
  const site = validatePoc(data, options);
  return profile === 'home-hero'
    ? { profile, site, hero: validateHero(data, options) }
    : { profile, site };
}

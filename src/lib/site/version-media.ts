import type { ContentVersion } from './content-version';
import type { SiteImage } from './types';
import type { SiteContent } from './validate-hero';

// Applied only after snapshot verification. Raw CMS data/digests remain unchanged.
export function versionMedia(
  content: SiteContent,
  version: ContentVersion,
): SiteContent {
  const revision = `${version.epoch}.${version.mediaRevision}`;
  function source(src: string) {
    const url = new URL(src);
    url.searchParams.set('blooikos_media', revision);
    return url.href;
  }
  function image<
    T extends SiteImage & { candidates?: { src: string; width: number }[] },
  >(value: T | undefined): T | undefined {
    if (!value) return undefined;
    return {
      ...value,
      src: source(value.src),
      ...(value.candidates && {
        candidates: value.candidates.map((candidate) => ({
          ...candidate,
          src: source(candidate.src),
        })),
      }),
    };
  }
  return {
    ...content,
    site: {
      ...content.site,
      logo: image(content.site.logo),
      logoInverse: image(content.site.logoInverse),
    },
    hero: { ...content.hero, background: image(content.hero.background) },
    about: {
      ...content.about,
      companies: content.about.companies.map((company) => ({
        ...company,
        icon: image(company.icon),
      })),
    },
    institutional: { image: image(content.institutional.image) },
    services: {
      ...content.services,
      items: content.services.items.map((item) => ({
        ...item,
        icon: image(item.icon),
      })),
    },
    companies: {
      items: content.companies.items.map((company) => ({
        ...company,
        logo: image(company.logo),
        image: image(company.image),
      })),
    },
  };
}

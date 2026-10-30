import {
  contentObject as object,
  contentText as text,
  contentImage,
  mediaSource,
} from './normalize';
import type { SiteImage } from './types';

export interface InstitutionalContent {
  image?: SiteImage & { candidates?: { src: string; width: number }[] };
}

export function normalizeInstitutional(
  data: unknown,
  options: { production?: boolean } = {},
): InstitutionalContent {
  const home = object(object(data).home);
  const fields =
    home.__typename === 'Page' && home.isFrontPage === true
      ? object(home.blooikosHomeInstitutional)
      : {};
  const image: InstitutionalContent['image'] = contentImage(
    fields.image,
    options.production,
  );
  if (!image || (fields.decorative !== true && !image.alt)) return {};
  if (fields.decorative === true) image.alt = '';

  const widths = new Set<number>();
  const sources = new Set<string>();
  const candidates = text(object(object(fields.image).node).srcSet)
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
        if (sources.has(src)) return [];
        widths.add(Number(match[2]));
        sources.add(src);
        return [{ src, width: Number(match[2]) }];
      } catch {
        return [];
      }
    });
  if (candidates.length) image.candidates = candidates.slice(0, 32);
  return { image };
}

import {
  contentObject as object,
  contentText as text,
  contentImage,
} from './normalize';
import type { SiteImage } from './types';

export interface ServicesContent {
  eyebrow: string;
  title: string;
  description: string;
  variant: 'light' | 'muted';
  items: { title: string; description: string; icon?: SiteImage }[];
}

export function normalizeServices(
  data: unknown,
  options: { production?: boolean } = {},
): ServicesContent {
  const home = object(object(data).home);
  const fields =
    home.__typename === 'Page' && home.isFrontPage === true
      ? object(home.blooikosHomeServices)
      : {};
  const variant = Array.isArray(fields.variant)
    ? fields.variant[0]
    : fields.variant;
  const items = (Array.isArray(fields.items) ? fields.items : [])
    .flatMap((value) => {
      const item = object(value);
      const title = text(item.title);
      const description = text(item.description);
      if (!title && !description) return [];
      const icon = contentImage(item.icon, options.production);
      return [
        { title, description, icon: icon ? { ...icon, alt: '' } : undefined },
      ];
    })
    .slice(0, 12);
  return {
    eyebrow: text(fields.eyebrow),
    title: text(fields.title),
    description: text(fields.description),
    variant: variant === 'muted' ? 'muted' : 'light',
    items,
  };
}

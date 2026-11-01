export { validateHero } from './validate-content';
export type { HeroContent, SiteContent } from './validate-content';
export { hasHeroContent } from './has-hero-content';
import { validateContent as normalize } from './validate-content';
import { serverText } from './visible-text.server';
export function validateContent(
  data: unknown,
  options: { production?: boolean; siteOrigin?: string; now?: Date } = {},
) {
  return normalize(data, { ...options, readText: serverText });
}

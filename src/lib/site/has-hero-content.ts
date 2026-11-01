import type { HeroContent } from './validate-content';
export function hasHeroContent(hero: HeroContent): boolean {
  return Object.values(hero).some(Boolean);
}

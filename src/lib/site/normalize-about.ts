import { normalizeAbout as normalize } from './normalize-about.shared';
import { serverText } from './visible-text.server';
export type * from './normalize-about.shared';
export function normalizeAbout(
  data: unknown,
  options: { production?: boolean; siteOrigin?: string } = {},
) {
  return normalize(data, { ...options, readText: serverText });
}

import { normalizeCompanies as normalize } from './normalize-companies.shared';
import { serverText } from './visible-text.server';
export type * from './normalize-companies.shared';
export function normalizeCompanies(
  data: unknown,
  options: { production?: boolean; siteOrigin?: string } = {},
) {
  return normalize(data, { ...options, readText: serverText });
}

import { validateHref } from '../links';
import { POC_IDS } from './anchors';

export function isPrototype(host: string) {
  return /(^|\.)(figma\.com|figma\.site)$/i.test(host.replace(/\.$/, ''));
}
// O contrato editorial é mais restrito que a API visual de links.
export function editorialDestination(value: string, httpsOnly = false): string {
  if (value !== value.trim()) throw new Error('INVALID_DESTINATION');
  const href = validateHref(value);
  if (!httpsOnly && /^#[a-zA-Z][a-zA-Z0-9_-]*$/.test(href)) return href;
  if (!httpsOnly && href.startsWith('/')) return href;
  const url = new URL(href);
  if (url.protocol !== 'https:' || isPrototype(url.hostname))
    throw new Error('INVALID_DESTINATION');
  return href;
}
export function parseSiteOrigin(value?: string): string | undefined {
  if (value === undefined || value === '') return undefined;
  const url = new URL(editorialDestination(value, true));
  if (url.pathname !== '/' || url.search || url.hash)
    throw new Error('CONFIG_ERROR');
  return url.origin;
}
export function normalizeDestination(
  href: string,
  siteOrigin?: string,
): string {
  const value = editorialDestination(href);
  const relative = value.startsWith('/') || value.startsWith('#');
  const url = new URL(value, 'https://poc.invalid');
  if (!relative && (!siteOrigin || url.origin !== siteOrigin)) return value;
  if (
    url.pathname !== '/' ||
    (url.hash && !POC_IDS.includes(url.hash.slice(1))) ||
    value.endsWith('#')
  )
    throw new Error('INVALID_DESTINATION');
  return '/' + url.search + url.hash;
}
export function mediaSource(value: string, production: boolean): string {
  const href = validateHref(value);
  const url = new URL(href);
  const host = url.hostname.toLowerCase().replace(/\.$/, '');
  const local =
    host === 'localhost' ||
    host.endsWith('.localhost') ||
    host === '[::1]' ||
    /^(?:0|10|127)\./.test(host) ||
    /^192\.168\./.test(host) ||
    /^169\.254\./.test(host) ||
    /^172\.(?:1[6-9]|2\d|3[01])\./.test(host) ||
    /^\[(?:fc|fd|fe[89ab])/i.test(host);
  if (
    href.includes(',') ||
    !['http:', 'https:'].includes(url.protocol) ||
    isPrototype(host) ||
    (production && (url.protocol !== 'https:' || local))
  )
    throw new Error('INVALID_MEDIA');
  return href;
}
export function phoneDestination(phone: string): string {
  // Mantém o + apenas quando o editor o forneceu; nunca acrescenta país.
  return (
    'tel:' +
    (phone.trim().startsWith('+') ? '+' : '') +
    phone.replace(/\D/g, '')
  );
}
export function copyrightYear(now = new Date()): string {
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    timeZone: 'America/Sao_Paulo',
  }).format(now);
}

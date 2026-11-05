import { mediaSource } from './normalize';

// O endpoint de contato já foi validado pela configuração CMS do servidor.
export function siteIconEndpoint(contactEndpoint: string): string {
  const url = new URL(contactEndpoint);
  if (!url.pathname.endsWith('/wp-json/blooikos/v1/contact'))
    throw new Error('INVALID_SITE_ICON_ENDPOINT');
  url.pathname = url.pathname.replace(/blooikos\/v1\/contact$/, '');
  url.search = '_fields=site_icon,site_icon_url';
  return url.href;
}

// null é remoção editorial; resposta inválida lança para preservar o último ícone.
export function readSiteIcon(
  value: unknown,
  production: boolean,
): string | null {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error('INVALID_SITE_ICON');
  const { site_icon: id, site_icon_url: source } = value as Record<
    string,
    unknown
  >;
  if (
    typeof id !== 'number' ||
    !Number.isSafeInteger(id) ||
    id < 0 ||
    typeof source !== 'string'
  )
    throw new Error('INVALID_SITE_ICON');
  if (source === '') return null;
  if (!id || source !== source.trim()) throw new Error('INVALID_SITE_ICON');
  const url = new URL(mediaSource(source, production));
  if (
    url.protocol === 'http:' &&
    !['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
  )
    throw new Error('INVALID_SITE_ICON');
  return url.href;
}

import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export type NativeLinkProps = Omit<
  ComponentPropsWithoutRef<'a'>,
  'href' | 'target' | 'role' | 'children' | 'aria-labelledby'
> & {
  href: string;
  target?: '_self' | '_blank';
  children: ReactNode;
  disabled?: never;
};

export const NEW_TAB_LABEL = 'abre em nova aba';

export function validateHref(value: string): string {
  const invalid = () => new Error('Destino de link inválido.');
  if (typeof value !== 'string' || /[\p{Cc}\\]/u.test(value)) throw invalid();
  const href = value.trim();
  if (!href || /\s/u.test(href) || /%(?:0[0-9a-f]|1[0-9a-f]|7f|5c)/i.test(href))
    throw invalid();
  try {
    decodeURI(href);
  } catch {
    throw invalid();
  }
  if (href.startsWith('#')) {
    if (href.length === 1) throw invalid();
    return href;
  }
  if (href.startsWith('/')) {
    if (href.startsWith('//')) throw invalid();
    return href;
  }
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    throw invalid();
  }
  if (url.username || url.password) throw invalid();
  if (/^https?:\/\//i.test(href) && url.hostname) return href;
  if (url.protocol === 'mailto:' && /^[^@/?]+@[^@/?]+$/.test(url.pathname))
    return href;
  if (
    url.protocol === 'tel:' &&
    /^\+?[0-9][0-9().-]*(?:;ext=\d+)?$/.test(url.pathname)
  )
    return href;
  throw invalid();
}

export function linkAttributes({
  href,
  target,
  rel,
  'aria-label': label,
}: Pick<NativeLinkProps, 'href' | 'target' | 'rel' | 'aria-label'>) {
  return {
    href: validateHref(href),
    target,
    rel:
      target === '_blank'
        ? [
            ...new Set([
              ...(rel?.split(/\s+/).filter(Boolean) ?? []),
              'noopener',
              'noreferrer',
            ]),
          ].join(' ')
        : rel,
    'aria-label':
      label && target === '_blank' ? `${label} (${NEW_TAB_LABEL})` : label,
  };
}

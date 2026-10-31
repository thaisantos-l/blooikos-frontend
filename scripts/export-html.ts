import { createRequire } from 'node:module';
import { mediaSource, normalizeDestination } from '../src/lib/site/normalize';
import { POC_IDS } from '../src/lib/site/anchors';
import { validateHref } from '../src/lib/links';
import contactAssets from '../src/lib/contact/assets.json';

interface Element {
  getAttribute(name: string): string | undefined;
  querySelectorAll(selector: string): Element[];
  textContent: string;
}
// Parser já distribuído no Next fixado pelo projeto; uso restrito ao CLI.
const { parse } = createRequire(import.meta.url)(
  'next/dist/compiled/node-html-parser',
) as { parse(html: string): Element };

export function verifyShell(homeHtml: string, errorHtml: string) {
  const home = parse(homeHtml);
  const error = parse(errorHtml);
  const homeIds = new Set(
    home.querySelectorAll('[id]').map((node) => node.getAttribute('id')),
  );
  for (const id of POC_IDS)
    if (!homeIds.has(id)) throw new Error('Destino da POC ausente no export.');
  for (const [name, document] of [
    ['index.html', home],
    ['404.html', error],
  ] as const) {
    const fail = () => {
      throw new Error('Shell inválido no export: ' + name);
    };
    for (const selector of ['body > header', 'main', 'body > footer']) {
      if (document.querySelectorAll(selector).length !== 1) fail();
    }
    const titleCount = document.querySelectorAll('h1').length;
    if (
      titleCount > 1 ||
      (name === '404.html' && titleCount !== 1) ||
      document.querySelectorAll('details > summary').length > 1
    )
      fail();
    const main = document.querySelectorAll('main')[0];
    if (
      main.getAttribute('id') !== 'conteudo' ||
      main.getAttribute('tabindex') !== '-1'
    )
      fail();
    const ids = document
      .querySelectorAll('[id]')
      .map((node) => node.getAttribute('id'));
    if (new Set(ids).size !== ids.length) fail();
    const names = [
      'Navegação principal',
      'Navegação principal móvel',
      'Grupo — rodapé',
      'Empresas — rodapé',
    ];
    const navs = document.querySelectorAll('nav');
    for (const label of names) {
      const nav = navs.filter(
        (node) => node.getAttribute('aria-label') === label,
      );
      if (nav.length > 1) fail();
      if (!nav.length) continue;
      const count = nav[0].querySelectorAll('li').length;
      if (count < 1 || count > (label.startsWith('Empresas') ? 6 : 20)) fail();
    }
    const menu = (label: string) =>
      navs
        .find((node) => node.getAttribute('aria-label') === label)
        ?.querySelectorAll('a')
        .map((node) => [
          node.getAttribute('href'),
          node.getAttribute('target'),
          node.textContent,
        ]);
    if (JSON.stringify(menu(names[0])) !== JSON.stringify(menu(names[1])))
      fail();
    if (
      !document
        .querySelectorAll('a')
        .some((node) => node.getAttribute('href') === '#conteudo')
    )
      fail();
    for (const link of document.querySelectorAll('a')) {
      const href = validateHref(link.getAttribute('href') ?? '');
      if (href.startsWith('#')) {
        if (!ids.includes(href.slice(1))) fail();
      } else if (!/^(mailto:|tel:)/.test(href)) {
        if (normalizeDestination(href) !== href) fail();
        if (href.startsWith('/')) {
          const hash = new URL(href, 'https://poc.invalid').hash;
          if (hash && !homeIds.has(hash.slice(1))) fail();
        }
      }
      if (link.getAttribute('target') === '_blank') {
        const rel = link.getAttribute('rel')?.split(/\s+/) ?? [];
        if (!rel.includes('noopener') || !rel.includes('noreferrer')) fail();
      }
    }
    for (const preload of document.querySelectorAll('link[as="image"]')) {
      const href = preload.getAttribute('href');
      if (href) {
        // O React também pode antecipar o SVG local usado pelo LinkArrow.
        if (href !== '/icons/arrow-right.svg') mediaSource(href, true);
      } else {
        for (const entry of (preload.getAttribute('imagesrcset') ?? '').split(
          ',',
        )) {
          const candidate = entry.trim().match(/^(\S+)\s+[1-9][0-9]*w$/);
          if (!candidate) fail();
          mediaSource(candidate![1], true);
        }
      }
    }
    for (const img of document.querySelectorAll('img')) {
      const src = img.getAttribute('src') ?? '';
      if (Object.hasOwn(contactAssets, src)) {
        const asset = contactAssets[src as keyof typeof contactAssets];
        if (
          img.getAttribute('alt') !== '' ||
          img.getAttribute('loading') !== 'lazy' ||
          img.getAttribute('decoding') !== 'async' ||
          Number(img.getAttribute('width')) !== asset.width ||
          Number(img.getAttribute('height')) !== asset.height
        )
          fail();
        continue;
      }
      // Asset intrínseco do LinkArrow; a presença do arquivo é conferida no export.
      if (img.getAttribute('src') === '/icons/arrow-right.svg') {
        if (
          img.getAttribute('alt') !== '' ||
          img.getAttribute('aria-hidden') !== 'true'
        )
          fail();
        continue;
      }
      mediaSource(img.getAttribute('src') ?? '', true);
      if (
        img.getAttribute('alt') === undefined ||
        !Number.isSafeInteger(Number(img.getAttribute('width'))) ||
        Number(img.getAttribute('width')) <= 0 ||
        !Number.isSafeInteger(Number(img.getAttribute('height'))) ||
        Number(img.getAttribute('height')) <= 0
      )
        fail();
    }
  }
}

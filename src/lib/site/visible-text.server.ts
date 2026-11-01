import { createRequire } from 'node:module';
const { parse } = createRequire(import.meta.url)(
  'next/dist/compiled/node-html-parser',
) as { parse(html: string): { textContent: string } };
export const serverText = (html: string) => parse(html).textContent;

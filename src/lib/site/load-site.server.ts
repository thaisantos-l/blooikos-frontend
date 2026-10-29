import 'server-only';
import { cache } from 'react';
import { readBuildSnapshot, readPublicSnapshot } from './build-snapshot';

// Uma fotografia para Home, Header e Footer; nenhum fetch no navegador.
export const loadSite = cache(async () =>
  process.env.NODE_ENV === 'production'
    ? readBuildSnapshot()
    : (await readPublicSnapshot('development')).content,
);

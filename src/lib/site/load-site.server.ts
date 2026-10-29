import 'server-only';
import { cache } from 'react';
import { queryGraphQL } from '../graphql/client.server';
import { readBuildSnapshot } from './build-snapshot';
import { validatePoc } from './validate-poc';

// Compartilhado no ciclo de renderização; não persiste conteúdo entre builds.
export const loadSite = cache(async () =>
  process.env.NODE_ENV === 'production'
    ? readBuildSnapshot()
    : validatePoc(await queryGraphQL('BlooikosHeaderFooter'), {
        production: false,
        siteOrigin: process.env.SITE_ORIGIN,
      }),
);

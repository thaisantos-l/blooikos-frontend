import 'server-only';
import { cache } from 'react';
import { queryGraphQL } from '../graphql/client.server';
import { validatePoc } from './validate-poc';

// Compartilhado no ciclo de renderização; não persiste conteúdo entre builds.
export const loadSite = cache(async () =>
  validatePoc(await queryGraphQL('BlooikosHeaderFooter'), {
    production: process.env.NODE_ENV === 'production',
    siteOrigin: process.env.SITE_ORIGIN,
  }),
);

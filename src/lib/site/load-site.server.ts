import 'server-only';
import { cache } from 'react';
import { readBuildSnapshot } from './build-snapshot';
import { requestGraphQL } from '../graphql/transport';
import { parseGraphQLConfig } from '../env';
import { validateContent } from './validate-hero';

// Dev lê o CMS a cada renderização; somente o build usa a captura persistida.
export const loadSite = cache(async () =>
  process.env.NODE_ENV === 'production'
    ? readBuildSnapshot()
    : validateContent(
        await requestGraphQL(
          'BlooikosHome',
          parseGraphQLConfig(process.env, 'development'),
        ),
        { siteOrigin: process.env.SITE_ORIGIN },
      ),
);

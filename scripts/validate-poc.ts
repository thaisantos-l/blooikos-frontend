import nextEnv from '@next/env';
import { parseGraphQLConfig } from '../src/lib/env';
import { requestGraphQL } from '../src/lib/graphql/transport';
import { GraphQLClientError } from '../src/lib/graphql/errors';
import { POC_CONTRACT_VERSION } from '../src/lib/site/validate-poc';
import { validateContent } from '../src/lib/site/validate-hero';
import { PocValidationError } from '../src/lib/site/types';

nextEnv.loadEnvConfig(process.cwd());
try {
  const { site } = validateContent(
    await requestGraphQL(
      'BlooikosHome',
      parseGraphQLConfig(process.env, 'diagnostic'),
    ),
    { siteOrigin: process.env.SITE_ORIGIN },
  );
  console.log(
    JSON.stringify({
      profile: 'poc',
      contractVersion: POC_CONTRACT_VERSION,
      valid: true,
      counts: {
        primary: site.primaryNavigation.length,
        footer: site.footerNavigation.length,
        companies: site.companies.length,
      },
    }),
  );
} catch (error) {
  const issues =
    error instanceof PocValidationError
      ? error.issues
      : error instanceof GraphQLClientError
        ? [{ code: error.code, path: 'data' }, ...error.issues]
        : [{ code: 'DIAGNOSTIC_ERROR', path: 'data' }];
  console.error(
    JSON.stringify({
      profile: 'poc',
      contractVersion: POC_CONTRACT_VERSION,
      valid: false,
      issues,
    }),
  );
  process.exitCode = 1;
}

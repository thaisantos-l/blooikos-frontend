import { lstat, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import nextEnv from '@next/env';
import { parseGraphQLConfig } from '../src/lib/env';
import { GraphQLClientError } from '../src/lib/graphql/errors';
import { parseSiteOrigin } from '../src/lib/site/normalize';

try {
  // out é somente saída gerada. Uma tentativa falha não pode manter artefato antigo.
  const output = resolve('out');
  const stat = await lstat(output).catch((error: NodeJS.ErrnoException) => {
    if (error.code !== 'ENOENT') throw error;
    return undefined;
  });
  if (stat?.isSymbolicLink()) throw new Error('UNSAFE_OUTPUT');
  await rm(output, { recursive: true, force: true });
  nextEnv.loadEnvConfig(process.cwd(), false);
  parseGraphQLConfig(process.env, 'production');
  parseSiteOrigin(process.env.SITE_ORIGIN);
} catch (error) {
  console.error(
    error instanceof GraphQLClientError
      ? error.message
      : 'Falha na preparação do build.',
  );
  process.exitCode = 1;
}

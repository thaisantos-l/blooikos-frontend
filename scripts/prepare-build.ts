import { randomUUID } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { captureSnapshot } from '../src/lib/site/build-snapshot';
import { appendFile, lstat, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import nextEnv from '@next/env';
import { parseGraphQLConfig } from '../src/lib/env';
import { PocValidationError } from '../src/lib/site/types';
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
  const nonce = randomUUID();
  await captureSnapshot(nonce);
  const child = spawnSync(
    process.execPath,
    [resolve('node_modules/next/dist/bin/next'), 'build'],
    {
      stdio: 'inherit',
      env: { ...process.env, BLOOIKOS_SNAPSHOT_NONCE: nonce },
    },
  );
  process.exitCode = child.status ?? 1;
} catch (error) {
  if (process.env.GITHUB_OUTPUT) {
    await appendFile(
      process.env.GITHUB_OUTPUT,
      `failure_category=${error instanceof PocValidationError ? 'editorial' : 'transient'}\n`,
    );
  }
  console.error(
    error instanceof GraphQLClientError
      ? error.message
      : error instanceof PocValidationError
        ? JSON.stringify(error.issues)
        : error instanceof Error && /^[A-Z_]+$/.test(error.message)
          ? error.message
          : 'Falha na preparação do build.',
  );
  process.exitCode = 1;
}

import nextEnv from '@next/env';
import { parseGraphQLConfig } from '../src/lib/env';
import { requestGraphQL } from '../src/lib/graphql/transport';
import { GraphQLClientError } from '../src/lib/graphql/errors';

nextEnv.loadEnvConfig(process.cwd());
try {
  const data = await requestGraphQL(
    'BlooikosFoundationSmoke',
    parseGraphQLConfig(process.env, 'diagnostic'),
  );
  if (data.__typename !== 'RootQuery')
    throw new GraphQLClientError('INVALID_RESPONSE', 'BlooikosFoundationSmoke');
  console.log(
    'Smoke aprovado: RootQuery. Conteúdo editorial não foi validado.',
  );
} catch (error) {
  console.error(
    error instanceof GraphQLClientError
      ? error.message
      : 'Falha no diagnóstico GraphQL.',
  );
  process.exitCode = 1;
}

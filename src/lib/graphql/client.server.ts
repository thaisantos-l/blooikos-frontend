import 'server-only';
import { parseGraphQLConfig } from '../env';
import { requestGraphQL } from './transport';
import type { OperationName } from './generated/operations';

export function queryGraphQL<Name extends OperationName>(
  name: Name,
  variables?: Record<string, unknown>,
) {
  const mode =
    process.env.NODE_ENV === 'production' ? 'production' : 'development';
  return requestGraphQL(name, parseGraphQLConfig(process.env, mode), variables);
}

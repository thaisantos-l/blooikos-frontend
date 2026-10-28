import { GraphQLClientError } from './graphql/errors';

export interface GraphQLConfig {
  endpoint: string;
  timeoutMs: number;
}

// Função pura: importar o módulo não consulta env nem inicia requisições.
export function parseGraphQLConfig(
  env: Record<string, string | undefined>,
  mode: 'development' | 'production' | 'diagnostic',
): GraphQLConfig {
  const invalid = () => new GraphQLClientError('CONFIG_ERROR');
  const raw = env.WORDPRESS_GRAPHQL_URL;
  if (!raw?.trim() || raw !== raw.trim()) throw invalid();
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw invalid();
  }
  const loopback = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  if (
    url.username ||
    url.password ||
    url.hash ||
    (url.protocol !== 'https:' &&
      !(url.protocol === 'http:' && loopback && mode !== 'production'))
  )
    throw invalid();
  const timeout = env.GRAPHQL_TIMEOUT_MS ?? '10000';
  if (
    !/^\d+$/.test(timeout) ||
    Number(timeout) < 1000 ||
    Number(timeout) > 30000
  )
    throw invalid();
  return { endpoint: url.href, timeoutMs: Number(timeout) };
}

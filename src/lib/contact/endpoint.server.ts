import 'server-only';
import { parseGraphQLConfig } from '../env';
import { GraphQLClientError } from '../graphql/errors';

export function contactEndpoint(): string {
  const mode =
    process.env.NODE_ENV === 'production' ? 'production' : 'development';
  const url = new URL(parseGraphQLConfig(process.env, mode).endpoint);
  if (url.search || !/\/graphql\/?$/.test(url.pathname))
    throw new GraphQLClientError('CONFIG_ERROR');
  url.pathname = url.pathname.replace(
    /\/graphql\/?$/,
    '/wp-json/blooikos/v1/contact',
  );
  return url.href;
}

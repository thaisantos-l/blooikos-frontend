import { describe, expect, it } from 'vitest';
import { parseGraphQLConfig } from '../src/lib/env';

describe('configuração somente quando chamada', () => {
  it('exige endpoint sem revelar o valor recebido', () => {
    expect(() => parseGraphQLConfig({}, 'development')).toThrow('CONFIG_ERROR');
    expect(() =>
      parseGraphQLConfig(
        { WORDPRESS_GRAPHQL_URL: 'https://user:private@host.test/graphql' },
        'development',
      ),
    ).toThrow(/^Falha GraphQL: CONFIG_ERROR\.$/);
  });
  it.each([
    '',
    'ftp://example.org',
    'javascript:alert(1)',
    'https://example.org/#fragment',
    'http://example.org/graphql',
    'https://u:p@example.org',
    ' https://example.org',
  ])('rejeita URL %s', (url) => {
    expect(() =>
      parseGraphQLConfig({ WORDPRESS_GRAPHQL_URL: url }, 'development'),
    ).toThrow('CONFIG_ERROR');
  });
  it.each(['localhost', '127.0.0.1', '[::1]'])(
    'loopback %s só em desenvolvimento/diagnóstico',
    (host) => {
      const env = { WORDPRESS_GRAPHQL_URL: `http://${host}:8082/graphql` };
      expect(parseGraphQLConfig(env, 'development').timeoutMs).toBe(10000);
      expect(parseGraphQLConfig(env, 'diagnostic').endpoint).toBe(
        env.WORDPRESS_GRAPHQL_URL,
      );
      expect(() => parseGraphQLConfig(env, 'production')).toThrow(
        'CONFIG_ERROR',
      );
    },
  );
  it.each(['0', '999', '30001', 'NaN', '1.5', '-1000', ' 1000', ''])(
    'rejeita timeout %s',
    (timeout) => {
      expect(() =>
        parseGraphQLConfig(
          {
            WORDPRESS_GRAPHQL_URL: 'https://example.org/graphql',
            GRAPHQL_TIMEOUT_MS: timeout,
          },
          'production',
        ),
      ).toThrow('CONFIG_ERROR');
    },
  );
  it.each(['1000', '30000'])('aceita limite %s', (timeout) => {
    expect(
      parseGraphQLConfig(
        {
          WORDPRESS_GRAPHQL_URL: 'https://example.org/graphql',
          GRAPHQL_TIMEOUT_MS: timeout,
        },
        'production',
      ).timeoutMs,
    ).toBe(Number(timeout));
  });
});

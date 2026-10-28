import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  MAX_RESPONSE_BYTES,
  requestGraphQL,
} from '../src/lib/graphql/transport';
import type { OperationName } from '../src/lib/graphql/generated/operations';

const config = { endpoint: 'https://cms.example.org/graphql', timeoutMs: 1000 };
const operation = 'BlooikosFoundationSmoke';
const json = (value: unknown) => new Response(JSON.stringify(value));
afterEach(() => vi.useRealTimers());

describe('transporte público GraphQL', () => {
  it('envia uma operação nomeada sem cookies, auth, cache persistente ou retries', async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValue(json({ data: { __typename: 'RootQuery' } }));
    const clearTimer = vi.fn(clearTimeout);
    const result = await requestGraphQL(
      operation,
      config,
      { example: 0 },
      { fetch: fetcher, clearTimer },
    );
    expect(result.__typename).toBe('RootQuery');
    expect(fetcher).toHaveBeenCalledTimes(1);
    const init = fetcher.mock.calls[0][1]!;
    expect(init).toMatchObject({
      method: 'POST',
      cache: 'no-store',
      credentials: 'omit',
      redirect: 'error',
    });
    expect(init.headers).not.toHaveProperty('Authorization');
    const body = JSON.parse(String(init.body));
    expect(body).toMatchObject({
      operationName: operation,
      variables: { example: 0 },
    });
    expect(body.query).toContain('query BlooikosFoundationSmoke');
    expect(clearTimer).toHaveBeenCalledTimes(1);
  });
  it.each([
    ['HTTP_ERROR', () => new Response('PRIVATE', { status: 500 })],
    ['INVALID_JSON', () => new Response('not json')],
    ['INVALID_RESPONSE', () => json({})],
    ['INVALID_RESPONSE', () => json({ data: null })],
    ['INVALID_RESPONSE', () => json({ data: [] })],
    ['INVALID_RESPONSE', () => json({ data: 123 })],
    ['INVALID_RESPONSE', () => json({ data: {}, errors: 'unexpected' })],
    [
      'RESPONSE_TOO_LARGE',
      () => new Response('x'.repeat(MAX_RESPONSE_BYTES + 1)),
    ],
  ] as const)(
    '%s propaga falha, libera timer e não tenta novamente',
    async (code, response) => {
      const fetcher = vi.fn<typeof fetch>().mockResolvedValue(response());
      const clearTimer = vi.fn(clearTimeout);
      await expect(
        requestGraphQL(operation, config, undefined, {
          fetch: fetcher,
          clearTimer,
        }),
      ).rejects.toMatchObject({ code, operationName: operation });
      expect(fetcher).toHaveBeenCalledTimes(1);
      expect(clearTimer).toHaveBeenCalledTimes(1);
    },
  );
  it('erro de rede não inclui URL nem detalhes remotos', async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockRejectedValue(new Error('SECRET token private URL'));
    await expect(
      requestGraphQL(operation, config, undefined, { fetch: fetcher }),
    ).rejects.toMatchObject({
      code: 'NETWORK_ERROR',
      message: 'Falha GraphQL: NETWORK_ERROR.',
    });
  });
  it('errors + data nunca retorna sucesso parcial; preserva só código/path seguros', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(
      json({
        data: { partial: true },
        errors: [
          {
            message: 'SECRET',
            path: ['home', 'companies', 1, '<SECRET>'],
            extensions: {
              code: 'BLOOIKOS_REFERENCE_UNAVAILABLE',
              trace: 'SECRET',
            },
          },
        ],
      }),
    );
    await expect(
      requestGraphQL(operation, config, undefined, { fetch: fetcher }),
    ).rejects.toMatchObject({
      code: 'GRAPHQL_ERROR',
      message: 'Falha GraphQL: GRAPHQL_ERROR.',
      issues: [
        {
          code: 'BLOOIKOS_REFERENCE_UNAVAILABLE',
          path: ['home', 'companies', 1],
        },
      ],
    });
  });
  it.each(['headers', 'body'])(
    'timeout inclui %s e cancela sem retries',
    async (phase) => {
      vi.useFakeTimers();
      const fetcher = vi
        .fn<typeof fetch>()
        .mockImplementation(() =>
          phase === 'headers'
            ? new Promise<Response>(() => {})
            : Promise.resolve(new Response(new ReadableStream({ start() {} }))),
        );
      const clearTimer = vi.fn(clearTimeout);
      const pending = expect(
        requestGraphQL(operation, config, undefined, {
          fetch: fetcher,
          clearTimer,
        }),
      ).rejects.toMatchObject({ code: 'TIMEOUT' });
      await vi.advanceTimersByTimeAsync(1001);
      await pending;
      expect(fetcher).toHaveBeenCalledTimes(1);
      expect(fetcher.mock.calls[0][1]?.signal?.aborted).toBe(true);
      expect(clearTimer).toHaveBeenCalledTimes(1);
      expect(vi.getTimerCount()).toBe(0);
    },
  );
  it('limita bytes acumulados de múltiplos chunks e cancela a leitura', async () => {
    const cancel = vi.fn();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new Uint8Array(MAX_RESPONSE_BYTES));
        controller.enqueue(new Uint8Array(1));
      },
      cancel,
    });
    await expect(
      requestGraphQL(operation, config, undefined, {
        fetch: vi.fn<typeof fetch>().mockResolvedValue(new Response(stream)),
      }),
    ).rejects.toMatchObject({ code: 'RESPONSE_TOO_LARGE' });
    expect(cancel).toHaveBeenCalled();
  });
  it('recusa operação desconhecida antes de fetch/timer', async () => {
    const fetcher = vi.fn<typeof fetch>();
    const setTimer = vi.fn(setTimeout);
    await expect(
      requestGraphQL('Unknown' as OperationName, config, undefined, {
        fetch: fetcher,
        setTimer,
      }),
    ).rejects.toMatchObject({ code: 'CONFIG_ERROR' });
    expect(fetcher).not.toHaveBeenCalled();
    expect(setTimer).not.toHaveBeenCalled();
  });
});

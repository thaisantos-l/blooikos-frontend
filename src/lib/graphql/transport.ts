import type { GraphQLConfig } from '../env';
import { GraphQLClientError, type SafeIssue } from './errors';
import { operations, type OperationName } from './generated/operations';
import type {
  BlooikosFoundationSmokeQuery,
  BlooikosHeaderFooterQuery,
  BlooikosHomeQuery,
} from './generated/types';

export interface OperationData {
  BlooikosFoundationSmoke: BlooikosFoundationSmokeQuery;
  BlooikosHeaderFooter: BlooikosHeaderFooterQuery;
  BlooikosHome: BlooikosHomeQuery;
}

export const MAX_RESPONSE_BYTES = 2 * 1024 * 1024;
interface Dependencies {
  fetch?: typeof fetch;
  setTimer?: (
    callback: () => void,
    milliseconds: number,
  ) => ReturnType<typeof setTimeout>;
  clearTimer?: (timer: ReturnType<typeof setTimeout>) => void;
}
const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

function safeIssues(errors: unknown[]): SafeIssue[] {
  const codes = [
    'BLOOIKOS_REFERENCE_UNAVAILABLE',
    'BLOOIKOS_CONTENT_INVALID',
    'BLOOIKOS_LIMIT_EXCEEDED',
  ];
  return errors.slice(0, 50).map((error) => {
    if (!isObject(error)) return { path: [] };
    const code = isObject(error.extensions) ? error.extensions.code : undefined;
    const path = Array.isArray(error.path)
      ? error.path
          .slice(0, 32)
          .filter(
            (part) =>
              (typeof part === 'string' &&
                /^[_A-Za-z][_0-9A-Za-z]{0,99}$/.test(part)) ||
              (typeof part === 'number' &&
                Number.isSafeInteger(part) &&
                part >= 0),
          )
      : [];
    return {
      path,
      ...(typeof code === 'string' && codes.includes(code)
        ? { code: code as SafeIssue['code'] }
        : {}),
    };
  });
}

export async function requestGraphQL<Name extends OperationName>(
  operationName: Name,
  config: GraphQLConfig,
  variables?: Record<string, unknown>,
  dependencies: Dependencies = {},
): Promise<OperationData[Name]> {
  if (!Object.hasOwn(operations, operationName))
    throw new GraphQLClientError('CONFIG_ERROR');
  const controller = new AbortController();
  const fetcher = dependencies.fetch ?? fetch;
  const clearTimer = dependencies.clearTimer ?? clearTimeout;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const deadline = new Promise<never>((_, reject) => {
    timer = (dependencies.setTimer ?? setTimeout)(() => {
      reject(new GraphQLClientError('TIMEOUT', operationName));
      controller.abort();
    }, config.timeoutMs);
  });
  let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;
  try {
    const response = await Promise.race([
      fetcher(config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/graphql-response+json, application/json',
        },
        body: JSON.stringify({
          query: operations[operationName],
          operationName,
          ...(variables === undefined ? {} : { variables }),
        }),
        cache: 'no-store',
        credentials: 'omit',
        redirect: 'error',
        signal: controller.signal,
      }),
      deadline,
    ]);
    if (!response.ok) {
      void response.body?.cancel().catch(() => undefined);
      throw new GraphQLClientError(
        'HTTP_ERROR',
        operationName,
        response.status,
      );
    }
    if (!response.body)
      throw new GraphQLClientError('INVALID_RESPONSE', operationName);
    reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let bytes = 0;
    while (true) {
      const chunk = await Promise.race([reader.read(), deadline]);
      if (chunk.done) break;
      bytes += chunk.value.byteLength;
      if (bytes > MAX_RESPONSE_BYTES)
        throw new GraphQLClientError('RESPONSE_TOO_LARGE', operationName);
      chunks.push(chunk.value);
    }
    const body = new Uint8Array(bytes);
    let offset = 0;
    for (const chunk of chunks) {
      body.set(chunk, offset);
      offset += chunk.byteLength;
    }
    let envelope: unknown;
    try {
      envelope = JSON.parse(
        new TextDecoder('utf-8', { fatal: true }).decode(body),
      );
    } catch {
      throw new GraphQLClientError('INVALID_JSON', operationName);
    }
    if (
      !isObject(envelope) ||
      (envelope.errors !== undefined && !Array.isArray(envelope.errors))
    )
      throw new GraphQLClientError('INVALID_RESPONSE', operationName);
    if (Array.isArray(envelope.errors) && envelope.errors.length)
      throw new GraphQLClientError(
        'GRAPHQL_ERROR',
        operationName,
        undefined,
        safeIssues(envelope.errors),
      );
    if (!isObject(envelope.data))
      throw new GraphQLClientError('INVALID_RESPONSE', operationName);
    // Tipagem das seleções; não substitui a validação editorial dos perfis na SPEC 06.
    return envelope.data as OperationData[Name];
  } catch (error) {
    if (error instanceof GraphQLClientError) throw error;
    throw new GraphQLClientError('NETWORK_ERROR', operationName);
  } finally {
    if (timer !== undefined) clearTimer(timer);
    if (reader) {
      void reader.cancel().catch(() => undefined);
      reader.releaseLock();
    }
  }
}

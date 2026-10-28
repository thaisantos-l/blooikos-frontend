export type GraphQLErrorCode =
  | 'CONFIG_ERROR'
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'HTTP_ERROR'
  | 'INVALID_JSON'
  | 'INVALID_RESPONSE'
  | 'RESPONSE_TOO_LARGE'
  | 'GRAPHQL_ERROR';

export interface SafeIssue {
  code?:
    | 'BLOOIKOS_REFERENCE_UNAVAILABLE'
    | 'BLOOIKOS_CONTENT_INVALID'
    | 'BLOOIKOS_LIMIT_EXCEEDED';
  path: (string | number)[];
}

export class GraphQLClientError extends Error {
  constructor(
    public readonly code: GraphQLErrorCode,
    public readonly operationName?: string,
    public readonly status?: number,
    public readonly issues: SafeIssue[] = [],
  ) {
    super(`Falha GraphQL: ${code}.`);
    this.name = 'GraphQLClientError';
  }
}

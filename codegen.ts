import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'contracts/cms/v1/schema.graphql',
  documents: ['src/lib/graphql/operations.graphql'],
  generates: {
    'src/lib/graphql/generated/types.ts': {
      plugins: ['typescript', 'typescript-operations'],
      config: {
        onlyOperationTypes: true,
        useTypeImports: true,
        defaultScalarType: 'unknown',
        avoidOptionals: { field: true },
      },
    },
  },
};

export default config;

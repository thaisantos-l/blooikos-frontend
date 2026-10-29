import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { generate } from '@graphql-codegen/cli';
import {
  buildSchema,
  Kind,
  parse,
  print,
  separateOperations,
  validate,
} from 'graphql';
import { format } from 'prettier';
import config from '../codegen';

export async function contractArtifacts(root = process.cwd()) {
  const read = (file: string) => readFile(resolve(root, file), 'utf8');
  const source = JSON.parse(await read('contracts/cms/source.json'));
  if (
    source.repository !== 'https://github.com/thaisantos-l/blooikos-cms' ||
    !/^[a-f0-9]{40}$/.test(source.revision ?? '') ||
    source.contractVersion !== '1.0.0' ||
    source.path !== 'wp-content/plugins/blooikos-core/contracts/graphql/v1'
  )
    throw new Error('Origem do contrato inválida.');
  const files = ['schema.graphql', 'operations.graphql', 'contract.json'];
  for (const file of files) {
    const bytes = await readFile(resolve(root, 'contracts/cms/v1', file));
    if (
      createHash('sha256').update(bytes).digest('hex') !== source.sha256?.[file]
    ) {
      throw new Error(`Hash do snapshot divergente: ${file}`);
    }
  }
  const manifest = JSON.parse(await read('contracts/cms/v1/contract.json'));
  if (
    manifest.contractVersion !== source.contractVersion ||
    manifest.sha256['schema.graphql'] !== source.sha256['schema.graphql'] ||
    manifest.sha256['operations.graphql'] !==
      source.sha256['operations.graphql']
  ) {
    throw new Error('Manifesto CMS inconsistente.');
  }
  const schemaText = await read('contracts/cms/v1/schema.graphql');
  const documentText = await read('src/lib/graphql/operations.graphql');
  const extraText = await read('contracts/rebuild/v1/home-hero.graphql');
  const extra = parse(extraText);
  if (
    extra.definitions.length !== 1 ||
    extra.definitions[0].kind !== Kind.OPERATION_DEFINITION ||
    extra.definitions[0].name?.value !== 'BlooikosHomeHero'
  )
    throw new Error('Documento adicional do Hero inválido.');
  const document = parse(documentText + '\n' + extraText);
  const errors = validate(buildSchema(schemaText), document);
  if (errors.length)
    throw new Error(`Operações incompatíveis: ${errors[0].message}`);
  const cmsDocument = parse(await read('contracts/cms/v1/operations.graphql'));
  const consumerDefinitions = document.definitions.filter(
    (node) =>
      !(
        node.kind === Kind.OPERATION_DEFINITION &&
        ['BlooikosFoundationSmoke', 'BlooikosHomeHero'].includes(
          node.name?.value ?? '',
        )
      ),
  );
  if (
    print({ ...document, definitions: consumerDefinitions }) !==
    print(cmsDocument)
  ) {
    throw new Error('As operações consumidoras divergiram do contrato 1.0.0.');
  }
  const operations = separateOperations(document);
  if (
    Object.keys(operations).sort().join(',') !==
      'BlooikosFoundationSmoke,BlooikosHeaderFooter,BlooikosHome,BlooikosHomeHero' ||
    print(operations.BlooikosFoundationSmoke) !==
      'query BlooikosFoundationSmoke {\n  __typename\n}'
  ) {
    throw new Error('Operações inesperadas no documento.');
  }
  const output = await generate(
    {
      ...config,
      schema: resolve(root, String(config.schema)),
      documents: (config.documents as string[]).map((file) =>
        resolve(root, file),
      ),
      silent: true,
    },
    false,
  );
  const operationNames = Object.keys(operations).sort();
  const executable = `// Gerado por graphql:generate. Não editar manualmente.\nexport const operations = ${JSON.stringify(Object.fromEntries(operationNames.map((name) => [name, print(operations[name])])), null, 2)} as const;\nexport type OperationName = keyof typeof operations;\n`;
  const options = {
    parser: 'typescript',
    singleQuote: true,
    trailingComma: 'all' as const,
  };
  return {
    'src/lib/graphql/generated/types.ts': await format(
      output[0].content,
      options,
    ),
    'src/lib/graphql/generated/operations.ts': await format(
      executable,
      options,
    ),
  };
}

export async function checkContract(root = process.cwd()) {
  for (const [file, expected] of Object.entries(
    await contractArtifacts(root),
  )) {
    if ((await readFile(resolve(root, file), 'utf8')) !== expected) {
      throw new Error(
        `Gerado divergente: ${file}. Execute graphql:generate e revise o diff.`,
      );
    }
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  try {
    const mode = process.argv[2];
    if (mode === 'generate') {
      for (const [file, text] of Object.entries(await contractArtifacts()))
        await writeFile(file, text);
    } else if (mode === 'check') await checkContract();
    else throw new Error('Use generate ou check.');
    console.log(`Contrato: ${mode} concluído.`);
  } catch (error) {
    console.error(
      error instanceof Error ? error.message : 'Falha no contrato.',
    );
    process.exitCode = 1;
  }
}

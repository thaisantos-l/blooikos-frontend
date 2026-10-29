import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { checkContract, contractArtifacts } from '../scripts/graphql-contract';

const temporary: string[] = [];
afterEach(async () => {
  await Promise.all(
    temporary
      .splice(0)
      .map((root) => rm(root, { recursive: true, force: true })),
  );
});
async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'blooikos-contract-'));
  temporary.push(root);
  for (const file of [
    'contracts/cms/source.json',
    'contracts/cms/v1/schema.graphql',
    'contracts/cms/v1/operations.graphql',
    'contracts/cms/v1/contract.json',
    'src/lib/graphql/operations.graphql',
    'src/lib/graphql/generated/operations.ts',
    'src/lib/graphql/generated/types.ts',
  ]) {
    await mkdir(dirname(join(root, file)), { recursive: true });
    await writeFile(join(root, file), await readFile(file));
  }
  return root;
}
describe('snapshot e geração portáteis', () => {
  it('gera bytes iguais e confere gerados em diretório independente', async () => {
    const root = await fixture();
    expect(await contractArtifacts(root)).toEqual(
      await contractArtifacts(root),
    );
    await expect(checkContract(root)).resolves.toBeUndefined();
  });
  it.each([
    'contracts/cms/v1/schema.graphql',
    'contracts/cms/v1/operations.graphql',
    'src/lib/graphql/generated/operations.ts',
    'src/lib/graphql/generated/types.ts',
  ])('detecta adulteração de %s sem corrigir', async (file) => {
    const root = await fixture();
    const path = join(root, file);
    const modified = (await readFile(path, 'utf8')) + '\n';
    await writeFile(path, modified);
    await expect(checkContract(root)).rejects.toThrow();
    expect(await readFile(path, 'utf8')).toBe(modified);
  });
  it('campo inexistente reprova contra SDL antes da geração', async () => {
    const root = await fixture();
    const path = join(root, 'src/lib/graphql/operations.graphql');
    await writeFile(
      path,
      (await readFile(path, 'utf8')).replace('brandName', 'unknownField'),
    );
    await expect(checkContract(root)).rejects.toThrow('unknownField');
  });
});

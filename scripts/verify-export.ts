import { readdir, readFile } from 'node:fs/promises';
import { extname, join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { gzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import contactAssets from '../src/lib/contact/assets.json';
import budget from '../performance-budget.json';
import { verifyShell } from './export-html';

export async function verifyExport(root = resolve('out')) {
  const files: string[] = [];
  async function walk(directory: string) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const file = join(directory, entry.name);
      if (entry.isSymbolicLink())
        throw new Error('Symlink inesperado no export.');
      if (entry.isDirectory()) await walk(file);
      else files.push(file);
    }
  }
  await walk(root);
  for (const [path, asset] of Object.entries(contactAssets)) {
    const bytes = await readFile(join(root, path));
    if (createHash('sha256').update(bytes).digest('hex') !== asset.sha256)
      throw new Error(`Asset original de Contato ausente ou alterado: ${path}`);
  }
  const metrics = {
    javascriptGzipBytes: 0,
    cssGzipBytes: 0,
    fontBytes: 0,
    totalBytes: 0,
  };
  for (const file of files) {
    const path = relative(root, file);
    if (
      /(^|\/)(design-system(?:[./]|$)|(?:fixtures|fixture-media)(?:\/|$))/.test(
        path,
      )
    )
      throw new Error(`Galeria/fixture proibida no export: ${path}`);
    if (
      /(^|\/)(\.git|\.env[^/]*|node_modules|contracts|docs|tools|src|tests)(\/|$)|\.(php|tsx?|sql|md|map)$/.test(
        path,
      )
    )
      throw new Error(`Arquivo proibido no export: ${path}`);
    const bytes = await readFile(file);
    metrics.totalBytes += bytes.length;
    if (extname(file) === '.js')
      metrics.javascriptGzipBytes += gzipSync(bytes, { level: 9 }).length;
    if (extname(file) === '.css')
      metrics.cssGzipBytes += gzipSync(bytes, { level: 9 }).length;
    if (/\.woff2?$/.test(file)) metrics.fontBytes += bytes.length;
    if (
      /\.(html|js|css|txt|json)$/.test(file) &&
      /WORDPRESS_GRAPHQL_URL|HOSTINGER_SSH_KEY|BlooikosHeaderFooter|BlooikosHome\b|BlooikosFoundationSmoke|\/Applications\/XAMPP|SPEC05_GALLERY_ONLY|figma\.com\/api\/mcp\/asset|makeproxy-c\.figma\.site/.test(
        bytes.toString(),
      )
    )
      throw new Error(`Dados internos no export: ${path}`);
  }
  verifyShell(
    await readFile(join(root, 'index.html'), 'utf8'),
    await readFile(join(root, '404.html'), 'utf8'),
  );
  for (const file of ['index.html', '404.html']) {
    const html = await readFile(join(root, file), 'utf8');
    if (/(?:src|href)="\/icons\/arrow-right\.svg"/.test(html)) {
      const arrow = await readFile(join(root, 'icons/arrow-right.svg'));
      if (!arrow.length) throw new Error('Asset LinkArrow vazio no export.');
    }
    const robots = [...html.matchAll(/<meta\b[^>]*name="robots"[^>]*>/g)]
      .map((m) => m[0])
      .join(' ');
    if (
      !/noindex/.test(robots) ||
      !/nofollow/.test(robots) ||
      !html.includes('lang="pt-BR"') ||
      (html.match(/<main\b/g) ?? []).length !== 1 ||
      (html.match(/<h1\b/g) ?? []).length > 1 ||
      (file === '404.html' && (html.match(/<h1\b/g) ?? []).length !== 1)
    )
      throw new Error(`HTML inválido: ${file}`);
    if (/<link[^>]*rel="canonical"/.test(html))
      throw new Error('Canonical não autorizado.');
    for (const match of html.matchAll(/(?:src|href)="(\/_next\/[^"?#]+)"/g))
      await readFile(join(root, match[1]));
  }
  for (const key of Object.keys(metrics) as (keyof typeof metrics)[]) {
    if (metrics[key] > budget[key])
      throw new Error(
        `Budget excedido: ${key} (${metrics[key]} > ${budget[key]})`,
      );
  }
  return { files: files.length, ...metrics };
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  try {
    console.log(JSON.stringify(await verifyExport(), null, 2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Export inválido.');
    process.exitCode = 1;
  }
}

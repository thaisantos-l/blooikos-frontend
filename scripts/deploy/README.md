# Build de código e publicação separados

Conteúdo editorial é lido em `/wp-json/blooikos/v1/site-content` após hidratação,
a cada 30 segundos de aba visível e no retorno/reconexão. A primeira renderização,
o HTML sem JavaScript e os metadados continuam na captura do build. Não remover
noindex: SEO depende de uma decisão posterior. A API pode estar em revisão mais
nova que `blooikos-release.json`; isso não exige publicar código.

## Build

`pnpm check`, `pnpm build` e `pnpm verify:export` não publicam. Build exige POSIX,
runtime fixado no projeto, CMS HTTPS consistente e snapshot privado. Em Windows,
executar em checkout/cópia WSL isolada do `.next` do dev.

O workflow `build-production.yml` executa esses checks no main confiável, gera
o pacote determinístico e armazena um artefato de 14 dias. Não recebe secrets de
hospedagem/environment de deploy. `ci.yml` valida PRs, mas seus artefatos não são
candidatos de produção.

```sh
gh workflow run build-production.yml --ref main
gh run view BUILD_RUN_ID
gh api repos/thaisantos-l/blooikos-frontend/actions/runs/BUILD_RUN_ID/artifacts
```

## Publicar o mesmo artefato

Somente depois de revisar um build bem-sucedido:

```sh
gh workflow run deploy-production.yml --ref main \
  -f operation=deploy -f build_run_id=BUILD_RUN_ID -f artifact_id=ARTIFACT_ID
```

O deploy consulta origem/workflow/branch/sucesso/attempt/main vigente, baixa pelo
ID, verifica o digest externo, o ZIP interno, manifesto e cada arquivo. Não
compila nem reempacota. O pacote deve ser do main atual. Um rollback explícito
usa `operation=rollback` e IDs de um build confiável anterior integrado em main;
também não recompila. Artefatos expirados, editoriais legados ou de PR são
rejeitados. Os comandos legados `cli.py gate/run` não representam este workflow.

O manifesto e o marcador conservam `runId/attempt` do **build**. Logs de seleção
e confirmação registram separadamente `buildRunId/buildAttempt` e
`deploymentRunId/deploymentAttempt`. SSH estrito, exclusões (`cms/`,
`blooikos-static/`, `.well-known/`, `.htaccess`), checksum, mtime atual no destino
e comparação de bytes HTTP permanecem obrigatórios. ZIP mantém mtime de 1980.

Configuração pública de build: repository variables `WORDPRESS_GRAPHQL_URL`,
`SITE_ORIGIN`, `CMS_REBUILD_VERSION_URL`. Secrets de SSH e `HOSTINGER_PATH`
continuam exclusivos do environment production no deploy. Antes de integrar
esta separação, suspender o dispatch editorial antigo no CMS e resolver pedido
em voo. Depois do corte, manter cron/consolidação em modo runtime.

#!/usr/bin/env node
// Regenera os templates da edição diária do DS a partir de um HTML REAL
// renderizado pelo diaria-studio (`scripts/render-newsletter-html.ts`).
//
// Por quê (diaria-design#19): os templates eram escritos à mão e ficaram
// 4 meses sem acompanhar o renderer de produção — largura, tipografia,
// kickers, boxes, marca, tudo divergiu. O renderer é quem manda; o DS passa
// a ser um SNAPSHOT dele, reproduzível por este script.
//
// Uso:
//   node scripts/sync-edition-template.mjs <newsletter-final.html> [--edition AAMMDD]
//
// Entrada: `data/editions/{AAMM}/{AAMMDD}/_internal/newsletter-final.html`
// (variante web/Beehiiv — sem as merge tags Liquid do Kit).
//
// O que faz:
//   1. baixa toda <img src="https://..."> para assets/edition/ (nome estável
//      por hash do URL) e reescreve o src para o caminho local — o DS não
//      depende do host de imagens continuar servindo aquele arquivo;
//   2. troca merge tags ({{email}}, {{ subscriber.* }}) por um e-mail de
//      exemplo, para os links de voto renderizarem num navegador;
//   3. envolve o corpo num documento HTML completo (doctype, charset,
//      viewport, title) e grava `Diar.ia Email Template.html` e
//      `Diar.ia Edição.html` — idênticos (o espelho web usa o mesmo corpo).
//   4. remove de assets/edition/ as imagens que nenhum dos dois referencia.

import { readFileSync, writeFileSync, mkdirSync, readdirSync, unlinkSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join, resolve, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ASSET_DIR = join(ROOT, "assets", "edition");
const OUTPUTS = ["Diar.ia Email Template.html", "Diar.ia Edição.html"];
const SAMPLE_EMAIL = "leitor@exemplo.com";

function die(msg) {
  console.error(`sync-edition-template: ${msg}`);
  process.exit(1);
}

const args = process.argv.slice(2);
const input = args.find((a) => !a.startsWith("--"));
const edIdx = args.indexOf("--edition");
const edition = edIdx >= 0 ? args[edIdx + 1] : (input?.match(/(\d{6})/)?.[1] ?? null);
if (!input) die("informe o caminho do newsletter-final.html");
if (!existsSync(input)) die(`arquivo não encontrado: ${input}`);

let body = readFileSync(input, "utf8");
if (/<html[\s>]/i.test(body)) die("a entrada já é um documento completo — passe o corpo renderizado (newsletter-final.html)");
if (!/class="container"/.test(body)) die("a entrada não parece um render do newsletter-render-html.ts (sem .container)");

// 1. imagens remotas -> assets/edition/
mkdirSync(ASSET_DIR, { recursive: true });
const urls = [...new Set([...body.matchAll(/<img\b[^>]*\bsrc="(https?:\/\/[^"]+)"/gi)].map((m) => m[1]))];
const kept = new Set();
for (const url of urls) {
  const ext = (extname(new URL(url).pathname) || ".jpg").toLowerCase();
  const base = new URL(url).pathname.split("/").pop().replace(/\.[^.]+$/, "").replace(/[^a-z0-9-]+/gi, "-").slice(0, 60);
  const name = `${base}-${createHash("sha1").update(url).digest("hex").slice(0, 8)}${ext}`;
  const dest = join(ASSET_DIR, name);
  if (!existsSync(dest)) {
    const res = await fetch(url, { headers: { "user-agent": "diaria-design/sync-edition-template" } });
    if (!res.ok) die(`falha ao baixar ${url}: HTTP ${res.status}`);
    const type = res.headers.get("content-type") ?? "";
    if (!type.startsWith("image/")) die(`${url} não devolveu imagem (content-type: ${type || "vazio"})`);
    writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
  }
  kept.add(name);
  body = body.split(`src="${url}"`).join(`src="assets/edition/${name}"`);
}

// 2. merge tags -> exemplo
body = body
  .replace(/\{\{\s*(?:email|subscriber\.email_address|subscriber\.email)\s*\}\}/g, SAMPLE_EMAIL)
  .replace(/\{\{[^}]*\}\}/g, "");

// 3. documento completo
const title = edition ? `diar.ia.br — Edição ${edition}` : "diar.ia.br — Edição";
const doc = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="x-apple-disable-message-reformatting" />
<title>${title}</title>
<!--
  GERADO por scripts/sync-edition-template.mjs a partir do render de produção
  do diaria-studio (scripts/render-newsletter-html.ts)${edition ? `, edição ${edition}` : ""}.
  Não edite à mão: mude o renderer no diaria-studio e rode o script de novo.
-->
</head>
<body style="margin:0; padding:0; background:#FFFFFF;">
${body.trim()}
</body>
</html>
`;
for (const out of OUTPUTS) writeFileSync(join(ROOT, out), doc);

// 4. limpa imagens órfãs
for (const f of readdirSync(ASSET_DIR)) {
  if (!kept.has(f)) unlinkSync(join(ASSET_DIR, f));
}

console.log(`ok — ${OUTPUTS.join(" + ")} (${urls.length} imagens em assets/edition/)`);

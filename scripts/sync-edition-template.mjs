#!/usr/bin/env node
// Regenera os templates da edição diária do DS a partir de um HTML REAL
// renderizado pelo diaria-studio (CLI `scripts/render-newsletter-html.ts`,
// lógica em `scripts/lib/newsletter-render-html.ts`).
//
// Por quê (diaria-design#19): os templates eram escritos à mão e ficaram
// 4 meses sem acompanhar o renderer de produção — largura, tipografia,
// kickers, boxes, marca, tudo divergiu. O renderer é quem manda; o DS passa
// a ser um SNAPSHOT dele, reproduzível por este script.
//
// Uso:
//   node scripts/sync-edition-template.mjs <newsletter-final.html> [--edition AAMMDD]
//   node scripts/sync-edition-template.mjs --check     (sem rede, sem escrita; CI)
//
// Entrada: `data/editions/{AAMM}/{AAMMDD}/_internal/newsletter-final.html`
// (variante web/Beehiiv, não a `-kit`). Ela ainda traz a merge tag de e-mail
// dos links de voto do "É IA?" (`{{email}}`).
//
// O que faz (tudo validado ANTES de escrever qualquer coisa):
//   1. baixa toda <img src="https://..."> para assets/edition/ (nome estável
//      por hash do URL) e reescreve o src para o caminho local; aborta se
//      sobrar qualquer imagem remota que o padrão não cobriu (srcset, url(),
//      aspas simples...) — o DS não pode depender do host de imagens;
//   2. troca as merge tags de e-mail conhecidas por um e-mail de exemplo e
//      ABORTA em qualquer outra tag ({{...}}, {%...%}) — nunca descarta em
//      silêncio algo que muda o conteúdo;
//   3. envolve o corpo num documento HTML completo e grava
//      `Diar.ia Email Template.html` e `Diar.ia Edição.html` — idênticos;
//   4. remove de assets/edition/ só as IMAGENS GERADAS por este script
//      (padrão `-<8 hex>.<ext>`) que nenhum template referencia, listando
//      cada uma. Outros arquivos da pasta nunca são tocados.

import { readFileSync, writeFileSync, mkdirSync, readdirSync, unlinkSync, existsSync, statSync, renameSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ASSET_DIR = join(ROOT, "assets", "edition");
const OUTPUTS = ["Diar.ia Email Template.html", "Diar.ia Edição.html"];
const SAMPLE_EMAIL = "leitor@exemplo.com";
const EMAIL_TAG = /\{\{\s*(?:email|subscriber\.email_address|subscriber\.email)\s*\}\}/g;
const GENERATED_ASSET = /-[0-9a-f]{8}\.(?:jpe?g|png|webp|gif)$/i;
const EXT_BY_TYPE = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/gif": ".gif" };
const FETCH_TIMEOUT_MS = 30_000;

function die(msg) {
  console.error(`sync-edition-template: ${msg}`);
  process.exit(1);
}

/** Imagens remotas que sobraram em qualquer forma que um cliente carregaria. */
function remoteImageRefs(html) {
  const out = [];
  for (const re of [
    /\b(?:src|data-src|background)\s*=\s*["']?\s*((?:https?:)?\/\/[^"'\s>]+)/gi,
    /\bsrcset\s*=\s*["']([^"']*(?:https?:)?\/\/[^"']*)["']/gi,
    /url\(\s*["']?((?:https?:)?\/\/[^"')]+)/gi,
  ]) {
    for (const m of html.matchAll(re)) out.push(m[1]);
  }
  return out;
}

const localAssetRefs = (html) => [...html.matchAll(/assets\/edition\/([^"'\s)]+)/g)].map((m) => m[1]);

// ---------- --check: contrato dos templates gerados (sem rede, sem escrita) ----------
if (process.argv.includes("--check")) {
  const problems = [];
  const docs = OUTPUTS.map((f) => {
    const p = join(ROOT, f);
    if (!existsSync(p)) { problems.push(`${f} não existe`); return ""; }
    return readFileSync(p, "utf8");
  });
  if (docs[0] !== docs[1]) problems.push(`${OUTPUTS[0]} e ${OUTPUTS[1]} divergem — rode o sync, não edite à mão`);
  const refs = new Set();
  docs.forEach((d, i) => {
    if (!d) return;
    if (!/^<!doctype html>/i.test(d) || !/class="container"/.test(d)) problems.push(`${OUTPUTS[i]} não tem a forma de um template gerado`);
    if (!d.includes("GERADO por scripts/sync-edition-template.mjs")) problems.push(`${OUTPUTS[i]} sem o cabeçalho de arquivo gerado`);
    for (const r of remoteImageRefs(d)) problems.push(`${OUTPUTS[i]}: imagem remota ${r}`);
    if (/\{\{|\{%/.test(d)) problems.push(`${OUTPUTS[i]}: merge tag não resolvida`);
    for (const r of localAssetRefs(d)) refs.add(r);
  });
  for (const r of refs) if (!existsSync(join(ASSET_DIR, r))) problems.push(`assets/edition/${r} referenciado mas ausente`);
  if (existsSync(ASSET_DIR)) {
    for (const f of readdirSync(ASSET_DIR)) {
      if (GENERATED_ASSET.test(f) && !refs.has(f)) problems.push(`assets/edition/${f} órfão`);
    }
  }
  if (problems.length) {
    console.error(problems.map((p) => `✗ ${p}`).join("\n"));
    process.exit(1);
  }
  console.log(`ok — templates da edição consistentes (${refs.size} imagens locais)`);
  process.exit(0);
}

// ---------- argumentos ----------
const args = process.argv.slice(2);
const edIdx = args.indexOf("--edition");
let edition = null;
if (edIdx >= 0) {
  edition = args[edIdx + 1];
  if (!edition || !/^\d{6}$/.test(edition)) die("--edition exige um valor AAMMDD");
}
const positional = args.filter((a, i) => !a.startsWith("--") && !(edIdx >= 0 && i === edIdx + 1));
if (positional.length !== 1) die("uso: sync-edition-template.mjs <newsletter-final.html> [--edition AAMMDD] | --check");
const input = positional[0];
if (!existsSync(input)) die(`arquivo não encontrado: ${input}`);
if (!edition) {
  edition = resolve(input).match(/\/(\d{6})\/_internal\/[^/]+$/)?.[1] ?? null;
  if (!edition) die("não deu para deduzir a edição do caminho (esperado .../AAMMDD/_internal/...) — passe --edition AAMMDD");
}

let body = readFileSync(input, "utf8");
if (/<html[\s>]/i.test(body)) die("a entrada já é um documento completo — passe o corpo renderizado (newsletter-final.html)");
if (!/class="container"/.test(body)) die("a entrada não parece um render do newsletter-render-html.ts (sem .container)");

// ---------- 1. imagens remotas -> assets/edition/ ----------
const decodeAttr = (s) => s.replace(/&amp;/g, "&");
const rawUrls = [...new Set([...body.matchAll(/<img\b[^>]*\bsrc="(https?:\/\/[^"]+)"/gi)].map((m) => m[1]))];
if (rawUrls.length === 0) die("nenhuma <img> remota na entrada — render inesperado, abortando antes de mexer em assets/edition/");

mkdirSync(ASSET_DIR, { recursive: true });
const kept = new Set();
for (const raw of rawUrls) {
  const url = decodeAttr(raw);
  const stem = basename(new URL(url).pathname).replace(/\.[^.]+$/, "").replace(/[^a-z0-9-]+/gi, "-").slice(0, 60);
  const hash = createHash("sha1").update(url).digest("hex").slice(0, 8);
  let res;
  try {
    res = await fetch(url, {
      headers: { "user-agent": "diaria-design/sync-edition-template" },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
  } catch (err) {
    die(`falha de rede ao baixar ${url}: ${err?.cause?.message ?? err?.message ?? err}`);
  }
  if (!res.ok) die(`falha ao baixar ${url}: HTTP ${res.status}`);
  const type = (res.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
  const ext = EXT_BY_TYPE[type];
  if (!ext) die(`${url} não devolveu imagem suportada (content-type: ${type || "vazio"})`);
  const bytes = Buffer.from(await res.arrayBuffer());
  if (bytes.length === 0) die(`${url} devolveu corpo vazio`);
  const name = `${stem}-${hash}${ext}`;
  const dest = join(ASSET_DIR, name);
  const fresh = !existsSync(dest) || !readFileSync(dest).equals(bytes);
  if (fresh) {
    writeFileSync(`${dest}.tmp`, bytes);
    renameSync(`${dest}.tmp`, dest);
  }
  console.log(`${fresh ? "baixada " : "igual   "} assets/edition/${name}`);
  kept.add(name);
  body = body.split(`src="${raw}"`).join(`src="assets/edition/${name}"`);
}
const leftover = remoteImageRefs(body);
if (leftover.length) die(`imagens remotas que o script não cobre: ${leftover.join(", ")}`);

// ---------- 2. merge tags ----------
body = body.replace(EMAIL_TAG, SAMPLE_EMAIL);
const unknownTags = body.match(/\{\{[^}]*\}\}|\{%[^%]*%\}|%7B%7B|%7B%25/gi);
if (unknownTags) die(`merge tags não tratadas: ${[...new Set(unknownTags)].join(", ")}`);

// ---------- 3. documento completo ----------
// O render começa com um <style> (hover + mobile); ele vai pro <head>.
const styles = [];
body = body.replace(/^\s*(<style[\s\S]*?<\/style>\s*)+/i, (m) => { styles.push(m.trim()); return ""; });
const doc = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="x-apple-disable-message-reformatting" />
<title>diar.ia.br — Edição ${edition}</title>
<!--
  GERADO por scripts/sync-edition-template.mjs a partir do render de produção
  do diaria-studio (scripts/render-newsletter-html.ts), edição ${edition}.
  Não edite à mão: mude o renderer no diaria-studio e rode o script de novo.
-->
${styles.join("\n")}
</head>
<body style="margin:0; padding:0; background:#FFFFFF;">
${body.trim()}
</body>
</html>
`;

// ---------- 4. plano de limpeza (validado antes de escrever) ----------
const orphans = readdirSync(ASSET_DIR).filter(
  (f) => GENERATED_ASSET.test(f) && !kept.has(f) && statSync(join(ASSET_DIR, f)).isFile(),
);

for (const out of OUTPUTS) writeFileSync(join(ROOT, out), doc);
for (const f of orphans) {
  unlinkSync(join(ASSET_DIR, f));
  console.log(`removida assets/edition/${f}`);
}
console.log(`ok — ${OUTPUTS.join(" + ")} (edição ${edition}, ${kept.size} imagens)`);

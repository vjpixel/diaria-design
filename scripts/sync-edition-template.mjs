#!/usr/bin/env node
// Regenera os templates de edição do DS a partir de um HTML REAL renderizado
// pelo diaria-studio — a diária e, desde o diaria-design#21, a mensal.
//
// Por quê (diaria-design#19): os templates eram escritos à mão e ficaram
// meses sem acompanhar o renderer de produção — largura, tipografia,
// kickers, boxes, marca, tudo divergiu. O renderer é quem manda; o DS passa
// a ser um SNAPSHOT dele, reproduzível por este script.
//
// Uso:
//   node scripts/sync-edition-template.mjs <newsletter-final.html> [--edition AAMMDD]
//   node scripts/sync-edition-template.mjs --monthly <cloudflare-preview.html> [--cycle AAMM-MM]
//   node scripts/sync-edition-template.mjs --check     (sem rede, sem escrita; CI — valida as duas)
//
// DIÁRIA — entrada `data/editions/{AAMM}/{AAMMDD}/_internal/newsletter-final.html`
// (variante web/Beehiiv, não a `-kit`; render de `scripts/render-newsletter-html.ts`).
// É o CORPO renderizado; o script o envolve num documento completo e grava
// `Diar.ia Email Template.html` e `Diar.ia Edição.html`, idênticos. Imagens em
// assets/edition/.
//
// MENSAL — entrada `data/monthly/{AAMM-MM}/_internal/cloudflare-preview.html`:
// o e-mail mensal (Clarice News, via Brevo) que `draftToEmail` de
// `scripts/lib/mensal/monthly-render.ts` gera. Já é um documento completo; o
// script só localiza as imagens, resolve as merge tags e injeta o cabeçalho de
// gerado. Grava `Diar.ia Edição Mensal.html`. Imagens em assets/edition-monthly/.
// Variante escolhida no #21: este e-mail, e não o e-mail Kit dos apoiadores
// (`apoiadores-kit-preview.html`, mesma base com merge tag Liquid) nem a página
// web da Retrospectiva (`monthly-web-render.ts`, HTML semântico que não é
// e-mail — o DS trata a mensal como e-mail).
//
// O que faz (tags e imagens não-cobertas são validadas ANTES de qualquer escrita):
//   1. baixa toda <img src="https://..."> para a pasta de assets do template
//      (nome estável por hash do URL) e reescreve o src para o caminho local;
//      aborta se sobrar qualquer imagem remota que o padrão não cobriu (srcset,
//      url(), aspas simples...) — o DS não pode depender do host de imagens;
//   2. troca as merge tags conhecidas DO CANAL do template (diária: Beehiiv/Kit;
//      mensal: Brevo — e-mail do leitor, link de descadastro) por valores de
//      exemplo e ABORTA em qualquer outra tag ({{...}}, {%...%})
//      — nunca descarta em silêncio algo que muda o conteúdo;
//   3. confere a forma do documento (o mesmo contrato do --check) e grava o(s)
//      template(s), atomicamente, com o cabeçalho "GERADO por ...";
//   4. remove da pasta de assets só as IMAGENS GERADAS por este script
//      (padrão `--<8 hex>.<ext>`) que nenhum template referencia, listando
//      cada uma. Outros arquivos da pasta nunca são tocados.

import { readFileSync, writeFileSync, mkdirSync, readdirSync, unlinkSync, existsSync, statSync, renameSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const GENERATED_MARK = "GERADO por scripts/sync-edition-template.mjs";

const SAMPLE_EMAIL = "leitor@exemplo.com";
const SAMPLE_UNSUBSCRIBE = "#descadastrar";

// Merge tags conhecidas → valor de exemplo, POR TARGET: cada template aceita só
// as tags do seu canal e aborta em qualquer outra (nunca descarta em silêncio).
const TARGETS = {
  daily: {
    label: "diária",
    // `{{email}}` (Beehiiv) e `subscriber.*` (Kit, Liquid).
    tags: [[/\{\{\s*(?:email|subscriber\.email_address|subscriber\.email)\s*\}\}/g, SAMPLE_EMAIL]],
    outputs: ["Diar.ia Email Template.html", "Diar.ia Edição.html"],
    assetSubdir: "edition",
    // Forma mínima de um template gerado: documento HTML5 + o card do renderer.
    shape: (d) => /^<!doctype html>/i.test(d) && /class="container"/.test(d),
    shapeHint: "<!doctype html> no início + .container",
  },
  monthly: {
    label: "mensal",
    // Brevo: `contact.EMAIL` e o link de descadastro, que vira uma âncora local inerte.
    tags: [
      [/\{\{\s*contact\.EMAIL\s*\}\}/g, SAMPLE_EMAIL],
      [/\{\{\s*unsubscribe\s*\}\}/g, SAMPLE_UNSUBSCRIBE],
    ],
    outputs: ["Diar.ia Edição Mensal.html"],
    assetSubdir: "edition-monthly",
    // O e-mail mensal sai em XHTML 1.0 Transitional (wrapEmail), com o canvas `.ds-canvas`.
    shape: (d) => /^<!doctype html[\s>]/i.test(d) && /class="ds-canvas"/.test(d),
    shapeHint: "<!DOCTYPE html …> no início + .ds-canvas",
  },
};

const replaceKnownTags = (html, t) => t.tags.reduce((h, [re, v]) => h.replace(re, v), html);
// Qualquer merge tag (ou sua forma URL-encoded) — mesmo regex no sync e no --check.
const ANY_TAG = /\{\{[^}]*\}\}|\{%[^%]*%\}|%7B%7B|%7B%25/gi;
// Sufixo `--<8 hex>` (traço DUPLO) marca arquivo gerado — não colide com datas
// tipo `capa-20261009.jpg` que alguém ponha à mão na pasta.
const GENERATED_ASSET = /--[0-9a-f]{8}\.(?:jpe?g|png|webp|gif)$/i;
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

const localAssetRefs = (html, subdir) =>
  [...html.matchAll(new RegExp(`assets/${subdir}/([^"'\\s)]+)`, "g"))].map((m) => m[1]);

// ---------- --check: contrato dos templates gerados (sem rede, sem escrita) ----------
function checkTarget(t) {
  const problems = [];
  const assetDir = join(ROOT, "assets", t.assetSubdir);
  const docs = t.outputs.map((f) => {
    const p = join(ROOT, f);
    if (!existsSync(p)) { problems.push(`${f} não existe`); return null; }
    const d = readFileSync(p, "utf8");
    if (!d.trim()) problems.push(`${f} vazio`);
    return d;
  });
  for (let i = 1; i < docs.length; i++) {
    if (docs[0] !== null && docs[i] !== null && docs[0] !== docs[i]) problems.push(`${t.outputs[0]} e ${t.outputs[i]} divergem — rode o sync, não edite à mão`);
  }
  const refs = new Set();
  docs.forEach((d, i) => {
    if (!d || !d.trim()) return;
    if (!t.shape(d)) problems.push(`${t.outputs[i]} não tem a forma de um template gerado`);
    if (!d.includes(GENERATED_MARK)) problems.push(`${t.outputs[i]} sem o cabeçalho de arquivo gerado`);
    for (const r of remoteImageRefs(d)) problems.push(`${t.outputs[i]}: imagem remota ${r}`);
    if (d.match(ANY_TAG)) problems.push(`${t.outputs[i]}: merge tag não resolvida`);
    for (const r of localAssetRefs(d, t.assetSubdir)) refs.add(r);
  });
  for (const r of refs) if (!existsSync(join(assetDir, r))) problems.push(`assets/${t.assetSubdir}/${r} referenciado mas ausente`);
  if (existsSync(assetDir)) {
    for (const f of readdirSync(assetDir)) {
      if (GENERATED_ASSET.test(f) && !refs.has(f)) problems.push(`assets/${t.assetSubdir}/${f} órfão`);
    }
  }
  return { problems, images: refs.size };
}

if (process.argv.includes("--check")) {
  let failed = false;
  for (const t of Object.values(TARGETS)) {
    const { problems, images } = checkTarget(t);
    if (problems.length) {
      failed = true;
      console.error(problems.map((p) => `✗ [${t.label}] ${p}`).join("\n"));
    } else {
      console.log(`ok — template ${t.label} consistente (${images} imagens locais)`);
    }
  }
  process.exit(failed ? 1 : 0);
}

// ---------- argumentos ----------
const args = process.argv.slice(2);
const monthly = args.includes("--monthly");
const target = monthly ? TARGETS.monthly : TARGETS.daily;
const valueFlag = monthly ? "--cycle" : "--edition";
const valueRe = monthly ? /^\d{4}-\d{2}$/ : /^\d{6}$/;
const valueFmt = monthly ? "AAMM-MM" : "AAMMDD";
const flagIdx = args.indexOf(valueFlag);
let edition = null;
if (flagIdx >= 0) {
  edition = args[flagIdx + 1];
  if (!edition || !valueRe.test(edition)) die(`${valueFlag} exige um valor ${valueFmt}`);
}
const positional = args.filter((a, i) => !a.startsWith("--") && !(flagIdx >= 0 && i === flagIdx + 1));
if (positional.length !== 1) {
  die("uso: sync-edition-template.mjs <newsletter-final.html> [--edition AAMMDD] | --monthly <cloudflare-preview.html> [--cycle AAMM-MM] | --check");
}
const input = positional[0];
if (!existsSync(input)) die(`arquivo não encontrado: ${input}`);
if (!edition) {
  const pathRe = monthly ? /\/(\d{4}-\d{2})\/_internal\/[^/]+$/ : /\/(\d{6})\/_internal\/[^/]+$/;
  edition = resolve(input).match(pathRe)?.[1] ?? null;
  if (!edition) die(`não deu para deduzir a edição do caminho (esperado .../${valueFmt}/_internal/...) — passe ${valueFlag} ${valueFmt}`);
}

let body = readFileSync(input, "utf8");
// Caminho REAL da entrada para o cabeçalho: relativo ao diaria-studio quando
// vier de lá (sem o home de quem rodou), senão o basename.
const inputLabel = resolve(input).match(/(data\/monthly\/[^/]+\/_internal\/[^/]+)$/)?.[1] ?? basename(input);
if (monthly) {
  if (!/<html[\s>]/i.test(body) || !/<head>/i.test(body)) die("a entrada mensal precisa ser o documento completo do e-mail (cloudflare-preview.html)");
  if (!/class="ds-canvas"/.test(body)) die("a entrada não parece um render do monthly-render.ts (sem .ds-canvas)");
  if (/data:image\//i.test(body)) die("a entrada tem imagens embutidas (data:) — use cloudflare-preview.html, não a variante -embedded");
  // O título é trocado e o cabeçalho de gerado entra logo depois dele: sem
  // <title> o arquivo sairia sem cabeçalho. Barrado antes de qualquer escrita.
  if (!/<title>[\s\S]*?<\/title>/i.test(body)) die("a entrada mensal não tem <title> — sem ele o cabeçalho de gerado não teria onde entrar");
  // O cabeçalho descreve o e-mail da Clarice News (Brevo). A mesma base sai
  // também como e-mail Kit dos apoiadores (merge tags Liquid `subscriber.*`):
  // recusar em vez de gravar um cabeçalho que descreve a variante errada.
  if (/\{\{\s*subscriber\./.test(body)) die("a entrada é o e-mail Kit dos apoiadores (merge tag subscriber.*) — o template mensal vem do cloudflare-preview.html (Brevo)");
  if (!/\{\{\s*(?:contact\.EMAIL|unsubscribe)\s*\}\}/.test(body)) die("a entrada não tem as merge tags da Brevo ({{ contact.EMAIL }}/{{ unsubscribe }}) — esperado o cloudflare-preview.html");
} else {
  if (/<html[\s>]/i.test(body)) die("a entrada já é um documento completo — passe o corpo renderizado (newsletter-final.html)");
  if (!/class="container"/.test(body)) die("a entrada não parece um render do newsletter-render-html.ts (sem .container)");
}

const ASSET_DIR = join(ROOT, "assets", target.assetSubdir);
const assetPath = (name) => `assets/${target.assetSubdir}/${name}`;

// ---------- 1. imagens remotas -> assets/ ----------
const decodeAttr = (s) => s.replace(/&amp;/g, "&");
const rawUrls = [...new Set([...body.matchAll(/<img\b[^>]*\bsrc="(https?:\/\/[^"]+)"/gi)].map((m) => m[1]))];
if (rawUrls.length === 0) die(`nenhuma <img> remota na entrada — render inesperado, abortando antes de mexer em assets/${target.assetSubdir}/`);

// Valida tags e imagens não-cobertas ANTES de baixar/escrever qualquer coisa.
const unknownTags = replaceKnownTags(body, target).match(ANY_TAG);
if (unknownTags) die(`merge tags não tratadas: ${[...new Set(unknownTags)].join(", ")}`);
const uncovered = remoteImageRefs(rawUrls.reduce((h, u) => h.split(`src="${u}"`).join('src=""'), body));
if (uncovered.length) die(`imagens remotas que o script não cobre: ${uncovered.join(", ")}`);

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
  const name = `${stem}--${hash}${ext}`;
  const dest = join(ASSET_DIR, name);
  const fresh = !existsSync(dest) || !readFileSync(dest).equals(bytes);
  if (fresh) {
    writeFileSync(`${dest}.tmp`, bytes);
    renameSync(`${dest}.tmp`, dest);
  }
  console.log(`${fresh ? "baixada " : "igual   "} ${assetPath(name)}`);
  kept.add(name);
  body = body.split(`src="${raw}"`).join(`src="${assetPath(name)}"`);
}
// Rede de segurança (já validado acima, antes dos downloads).
if (remoteImageRefs(body).length) die("imagem remota restante após a reescrita — bug no script");

// ---------- 2. merge tags (desconhecidas já barradas acima) ----------
body = replaceKnownTags(body, target);

// ---------- 3. documento completo ----------
let doc;
if (monthly) {
  const header = `<!--
  ${GENERATED_MARK} --monthly a partir do render de produção
  do diaria-studio (draftToEmail em scripts/lib/mensal/monthly-render.ts),
  ciclo ${edition}: o e-mail mensal da Clarice News (Brevo), arquivo
  ${inputLabel}.
  Variante escolhida (diaria-design#21): este e-mail, não o e-mail Kit dos
  apoiadores (mesma base, merge tag Liquid) nem a página web da Retrospectiva.
  Merge tags trocadas por exemplos (${SAMPLE_EMAIL}, ${SAMPLE_UNSUBSCRIBE}).
  Não edite à mão: mude o renderer no diaria-studio e rode o script de novo.
-->`;
  doc = body
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>diar.ia.br — Edição mensal ${edition}</title>`)
    // Depois do <title>, como na diária — mantém o <meta charset> do render no começo do <head>.
    .replace(/<\/title>/i, (m) => `${m}\n${header}`)
    .trimEnd() + "\n";
} else {
  // O render começa com um <style> (hover + mobile); ele vai pro <head>.
  const styles = [];
  body = body.replace(/^\s*(<style[\s\S]*?<\/style>\s*)+/i, (m) => { styles.push(m.trim()); return ""; });
  doc = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="x-apple-disable-message-reformatting" />
<title>diar.ia.br — Edição ${edition}</title>
<!--
  ${GENERATED_MARK} a partir do render de produção
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
}

// ---------- 4. plano de limpeza (validado antes de escrever) ----------
const orphans = readdirSync(ASSET_DIR).filter(
  (f) => GENERATED_ASSET.test(f) && !kept.has(f) && statSync(join(ASSET_DIR, f)).isFile(),
);

// Mesmo contrato do --check, antes de gravar: uma entrada com BOM/comentário
// antes do doctype não pode virar template que só o CI reprova.
if (!target.shape(doc)) die(`o documento gerado não tem a forma de um template ${target.label} (${target.shapeHint}) — entrada inesperada (BOM/comentário antes do doctype?), template não gravado`);
if (!doc.includes(GENERATED_MARK)) die("o documento gerado ficou sem o cabeçalho de gerado — bug no script, template não gravado");

// Escrita atômica (tmp + rename), como as imagens.
for (const out of target.outputs) {
  const dest = join(ROOT, out);
  writeFileSync(`${dest}.tmp`, doc);
  renameSync(`${dest}.tmp`, dest);
}
for (const f of orphans) {
  unlinkSync(join(ASSET_DIR, f));
  console.log(`removida ${assetPath(f)}`);
}
console.log(`ok — ${target.outputs.join(" + ")} (${monthly ? "ciclo" : "edição"} ${edition}, ${kept.size} imagens)`);

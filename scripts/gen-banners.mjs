#!/usr/bin/env node
// Banner/cover generation for Diar.ia social surfaces (#3577 — troca de tagline).
//
// Generates every social cover PNG from parametric SVG layouts, rendered with
// resvg. Follows the same philosophy as export-logos.mjs: the SVG layout in
// this file is the canonical source; committed PNGs are build artifacts.
//
// Fonts:
//   - Georgia (CTA serif line): system font, same rationale as
//     export-logos.mjs — proprietary, can't be vendored. Needs Georgia
//     installed (Windows/macOS ship it).
//   - Geist Mono (kickers/tagline, per tokens/typography.css): vendored via
//     npm (@fontsource/geist-mono, OFL). resvg can't read woff2, so we
//     decompress to TTF at build time into .font-cache/ (gitignored).
//
// Sizes researched 2026-07 (see diaria-studio issue #3577):
//   Facebook page cover     851×315 display  → upload 1640×624 (2×, existing convention)
//   LinkedIn company cover  1128×191 display → upload 2256×382 (2×)
//   LinkedIn personal cover 1584×396 display → upload 3168×792 (2×); avatar overlays bottom-left
//   X/Twitter header        1500×500 (native)
//   Apoia.se campaign cover 1600×300 ideal (support docs) → upload 4800×900 (3×, existing convention)
//   Uma Penca (Personalização→Tema, UI logada 2026-07-16):
//     banner desktop: largura OBRIGATÓRIA 1920px, recomendado 1920×400
//     banner mobile:  largura OBRIGATÓRIA 1250px, recomendado 1250×400
//     (altura é livre; cor de fundo do banner configurável na UI — usar PAPER #FFFFFF)
//
// Usage:  node gen-banners.mjs [--only facebook] [--out <dir>]
//         node gen-banners.mjs --check     # structural invariants only (CI, no fonts needed)

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { Resvg } from '@resvg/resvg-js'
import { PNG } from 'pngjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO = join(__dirname, '..')
const OUT_DIR_DEFAULT = join(REPO, 'assets', 'banners')

const PAPER = '#FFFFFF' // #3577 hotfix (260716): editor pediu fundo branco puro (era #FBFAF6 creme) pra casar sem transição visível com o avatar bola-preta-fundo-branco
const INK = '#171411'
const TEAL = '#00A0A0'
const RULE_SOFT = '#DDD8CE'

const TAGLINE = '5 MINUTOS DIÁRIOS PRA SE MANTER ATUALIZADO E USAR MELHOR A IA'
const TAGLINE_L1 = '5 MINUTOS DIÁRIOS PRA SE MANTER'
const TAGLINE_L2 = 'ATUALIZADO E USAR MELHOR A IA'
const EYEBROW_LEFT = 'NEWSLETTER GRATUITA'
const EYEBROW_RIGHT = 'SEG–SEX'
const CTA_PREFIX = 'Assine grátis em '
const CTA_DOMAIN = 'diar.ia.br'
// Voz de AUTOR (260719): nos perfis PESSOAIS do editor a capa não é a capa da
// marca — quem visita já sabe quem é a pessoa, e o que falta é a ligação entre
// ela e a newsletter. Mesma tagline (o plano de lançamento manda repetir a
// proposta de valor em todo canal), só o CTA muda de "assine" pra primeira
// pessoa. Não usar a wordmark em mono/caixa-alta aqui: "diar.ia.br" só aparece
// como texto serifado com o domínio em teal, que é o que o CTA já faz.
const CTA_PREFIX_AUTOR = 'Escrevo todo dia em '

const MONO = 'Geist Mono'
const SERIF = "Georgia, 'Times New Roman', serif"

export const BANNERS = [
  { key: 'facebook', file: 'facebook-cover-1640x624.png', w: 1640, h: 624, layout: 'centered', bg: PAPER },
  // #3577 hotfix rodada 3 (260718): editor pediu só a tagline, sem eyebrow
  // row (NEWSLETTER GRATUITA / SEG–SEX) nem CTA de rodapé — layout dedicado
  // 'minimal' em vez de reusar 'centered' (que os outros banners ainda usam).
  //
  // `pad`: descoberto ao vivo no editor de capa do LinkedIn (260718) — o
  // canvas de upload/crop da página de EMPRESA não é 1128×191 (a proporção
  // exibida no desktop), é ~1128×590 (medido via canvas.width/height do DOM
  // do próprio editor: 2256×1179 em 2×) — LinkedIn guarda um "master" mais
  // alto e recorta faixas diferentes por superfície (desktop largo, app
  // mobile mais quadrado). Sem isso, um PNG exatamente 2256×382 fica
  // "sobrando" no centro do canvas de 1179px com as bordas fora da imagem
  // renderizadas em PRETO pelo editor — arriscado (podia virar barra preta
  // publicada dependendo da superfície). Em vez de reajustar a tipografia
  // pro canvas alto (mudaria o tamanho validado visualmente), `pad` mantém
  // `w`×`h` como a arte já aprovada e soma fundo branco (mesma `bg`) em
  // volta até preencher `pad.h` — a tagline permanece exatamente onde já
  // foi validada, centralizada verticalmente no canvas maior.
  { key: 'linkedin-diaria', file: 'linkedin-cover-2256x382.png', w: 2256, h: 382, layout: 'minimal', bg: PAPER, pad: { w: 2256, h: 1179 } },
  // LinkedIn (empresa e pessoal), Facebook e X sobrepõem o avatar/logo no
  // canto inferior ESQUERDO do banner. O layout centered não tem NENHUM
  // conteúdo nessa zona (tudo fica centralizado ou no topo/direita) — sem
  // offset especial necessário em nenhum caso.
  { key: 'linkedin-pessoal', file: 'linkedin-cover-pessoal-3168x792.png', w: 3168, h: 792, layout: 'centered', bg: PAPER },
  { key: 'twitter', file: 'twitter-header-1500x500.png', w: 1500, h: 500, layout: 'centered', bg: PAPER },
  // Variantes de AUTOR — perfis pessoais do editor (LinkedIn 3.078, Facebook
  // 2.200, X 1.351). Mesmas dimensões das capas de marca equivalentes; só o
  // CTA muda (ver CTA_PREFIX_AUTOR). As páginas de terceiros que ele
  // administra (VJ Pixel, memeLab) usam as capas de MARCA, não estas: lá a
  // primeira pessoa não corresponde a quem assina a página.
  { key: 'linkedin-autor', file: 'linkedin-cover-autor-3168x792.png', w: 3168, h: 792, layout: 'centered', bg: PAPER, ctaPrefix: CTA_PREFIX_AUTOR },
  { key: 'facebook-autor', file: 'facebook-cover-autor-1640x624.png', w: 1640, h: 624, layout: 'centered', bg: PAPER, ctaPrefix: CTA_PREFIX_AUTOR },
  { key: 'twitter-autor', file: 'twitter-header-autor-1500x500.png', w: 1500, h: 500, layout: 'centered', bg: PAPER, ctaPrefix: CTA_PREFIX_AUTOR },
  { key: 'apoiase', file: 'apoiase-cover-4800x900.png', w: 4800, h: 900, layout: 'dark', bg: INK },
  { key: 'umapenca-desktop', file: 'umapenca-banner-desktop-1920x400.png', w: 1920, h: 400, layout: 'centered', bg: PAPER },
  { key: 'umapenca-mobile', file: 'umapenca-banner-mobile-1250x400.png', w: 1250, h: 400, layout: 'centered', bg: PAPER },
]

const escXml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function mono(x, y, size, text, { anchor = 'middle', fill = INK, tracking = '0.18em', weight = 500 } = {}) {
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${MONO}" font-weight="${weight}" font-size="${size}" letter-spacing="${tracking}" fill="${fill}">${escXml(text)}</text>`
}

// --- layouts -----------------------------------------------------------------
// centered: eyebrow row + rule / tagline (hero, 2 linhas) / soft rule / serif
// CTA. Única composição pra todo banner claro (Facebook, LinkedIn empresa e
// pessoal, X, Uma Penca).
//
// #3577 hotfix (260716, decisão do editor após reportar colisão ao vivo no
// LinkedIn): a wordmark serifada "diar.ia.br" foi REMOVIDA do banner —
// virou redundante desde que passamos a sempre parear banner com avatar
// (o avatar já carrega a marca "d..", e a própria plataforma exibe o nome
// da página ao lado dele). Menos elemento competindo por espaço também
// elimina de raiz a classe de bug "wordmark colide com o avatar overlay que
// LinkedIn/Facebook/X desenham por cima do canto inferior esquerdo do
// banner" — não há mais necessidade de zona seguem por design de qualquer
// tipo. A tagline em duas linhas vira o conteúdo principal (hero); o CTA
// "Assine grátis em diar.ia.br" no rodapé permanece — é call-to-action com
// o domínio como texto simples, não repetição do logotipo.
function layoutCentered(b) {
  const { w, h } = b
  const ctaPrefix = b.ctaPrefix ?? CTA_PREFIX
  const mx = Math.round(w * 0.06)
  const eyebrowSize = Math.round(h * 0.034)
  const maxLineLen = Math.max(TAGLINE_L1.length, TAGLINE_L2.length)
  // #3577 hotfix rodada 2 (260716): editor reportou texto ilegível no mobile
  // — cap subiu de 0.075h pra 0.12h (tagline é o hero agora que a wordmark
  // saiu; precisa ocupar proporcionalmente mais espaço, não menos).
  const taglineSize = Math.min(Math.round(h * 0.12), Math.round((w - 2 * mx) / (maxLineLen * 0.66)))
  const ctaSize = Math.round(h * 0.05)
  return `
  ${mono(mx, h * 0.135, eyebrowSize, EYEBROW_LEFT, { anchor: 'start', tracking: '0.22em' })}
  ${mono(w - mx, h * 0.135, eyebrowSize, EYEBROW_RIGHT, { anchor: 'end', tracking: '0.22em' })}
  <rect x="${mx}" y="${h * 0.175}" width="${w - 2 * mx}" height="${Math.max(2, h * 0.005)}" fill="${INK}"/>
  ${mono(w / 2, h * 0.4, taglineSize, TAGLINE_L1, { tracking: '0.04em' })}
  ${mono(w / 2, h * 0.6, taglineSize, TAGLINE_L2, { tracking: '0.04em' })}
  <rect x="${mx}" y="${h * 0.78}" width="${w - 2 * mx}" height="${Math.max(1, h * 0.0025)}" fill="${RULE_SOFT}"/>
  <text x="${w - mx}" y="${h * 0.9}" text-anchor="end" font-family="${SERIF}" font-weight="700" font-size="${ctaSize}"><tspan fill="${INK}">${escXml(ctaPrefix)}</tspan><tspan fill="${TEAL}">${escXml(CTA_DOMAIN)}</tspan></text>`
}

// minimal: só a tagline (hero, 2 linhas), sem eyebrow row nem CTA de rodapé
// — pedido do editor (#3577 rodada 3, 260718) especificamente pro banner do
// LinkedIn da empresa. Vertical-centered no canvas inteiro.
function layoutMinimal(b) {
  const { w, h } = b
  const mx = Math.round(w * 0.06)
  const maxLineLen = Math.max(TAGLINE_L1.length, TAGLINE_L2.length)
  const taglineSize = Math.min(Math.round(h * 0.17), Math.round((w - 2 * mx) / (maxLineLen * 0.66)))
  return `
  ${mono(w / 2, h * 0.46, taglineSize, TAGLINE_L1, { tracking: '0.04em' })}
  ${mono(w / 2, h * 0.66, taglineSize, TAGLINE_L2, { tracking: '0.04em' })}`
}

// dark: teal pill + white tagline + quiet sub — Apoia.se composition.
function layoutDark(b) {
  const { w, h } = b
  const pillText = EYEBROW_LEFT
  const pillSize = Math.round(h * 0.055)
  const pillW = Math.round(pillText.length * pillSize * 0.62 * 1.22 + pillSize * 2.2)
  const pillH = Math.round(pillSize * 2.1)
  const taglineSize = Math.min(Math.round(h * 0.075), Math.round((w * 0.86) / (TAGLINE.length * 0.74)))
  const subSize = Math.round(h * 0.045)
  return `
  <rect x="${(w - pillW) / 2}" y="${h * 0.28 - pillH / 2}" width="${pillW}" height="${pillH}" rx="${pillH / 2}" fill="${TEAL}"/>
  ${mono(w / 2, h * 0.28 + pillSize * 0.36, pillSize, pillText, { fill: INK, tracking: '0.22em', weight: 600 })}
  ${mono(w / 2, h * 0.52, taglineSize, TAGLINE, { fill: PAPER, tracking: '0.16em' })}
  ${mono(w / 2, h * 0.68, subSize, EYEBROW_RIGHT, { fill: '#B8B2A6', tracking: '0.3em' })}`
}

const LAYOUTS = { centered: layoutCentered, minimal: layoutMinimal, dark: layoutDark }

/** Dimensões do PNG final — `pad` (quando presente) substitui `w`×`h`, que
 * viram só o canvas INTERNO usado pela matemática de layout (ver BANNERS). */
export const outW = (b) => (b.pad ? b.pad.w : b.w)
export const outH = (b) => (b.pad ? b.pad.h : b.h)

export function bannerSvg(b) {
  const W = outW(b)
  const H = outH(b)
  const content = `
  <rect width="${b.w}" height="${b.h}" fill="${b.bg}"/>
  ${LAYOUTS[b.layout](b)}`
  const body = b.pad
    ? `<rect width="${W}" height="${H}" fill="${b.bg}"/><g transform="translate(${(W - b.w) / 2}, ${(H - b.h) / 2})">${content}</g>`
    : content
  return `<?xml version="1.0"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  ${body}
</svg>`
}

// --- font prep: woff2 → ttf into .font-cache (resvg can't read woff2) --------
async function prepFonts() {
  const cache = join(__dirname, '.font-cache')
  mkdirSync(cache, { recursive: true })
  const wanted = [
    ['geist-mono-latin-500-normal', 500],
    ['geist-mono-latin-600-normal', 600],
  ]
  const ttfs = []
  const { default: wawoff2 } = await import('wawoff2')
  for (const [name] of wanted) {
    const ttfPath = join(cache, `${name}.ttf`)
    if (!existsSync(ttfPath)) {
      const woff2 = readFileSync(join(__dirname, 'node_modules', '@fontsource', 'geist-mono', 'files', `${name}.woff2`))
      writeFileSync(ttfPath, Buffer.from(await wawoff2.decompress(woff2)))
    }
    ttfs.push(ttfPath)
  }
  return ttfs
}

function render(b, fontFiles) {
  const svg = bannerSvg(b)
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'original' },
    font: { fontFiles, loadSystemFonts: true },
    background: b.bg,
  })
  return resvg.render().asPng()
}

// --- structural check (CI-safe: no rendering, no fonts) ----------------------
function check(outDir) {
  let bad = 0
  for (const b of BANNERS) {
    const p = join(outDir, b.file)
    if (!existsSync(p)) { console.error(`MISSING ${b.file}`); bad++; continue }
    const png = PNG.sync.read(readFileSync(p))
    const [W, H] = [outW(b), outH(b)]
    if (png.width !== W || png.height !== H) {
      console.error(`DIM ${b.file}: ${png.width}x${png.height} != ${W}x${H}`); bad++
    }
    // ink presence: some pixel must differ from the background fill.
    const bgIsDark = b.bg === INK
    let inkFound = false
    for (let i = 0; i < png.data.length && !inkFound; i += 4 * 97) {
      const lum = 0.299 * png.data[i] + 0.587 * png.data[i + 1] + 0.114 * png.data[i + 2]
      if (bgIsDark ? lum > 160 : lum < 96) inkFound = true
    }
    if (!inkFound) { console.error(`BLANK ${b.file}: no visible ink`); bad++ }
  }
  if (bad) { console.error(`check FAILED (${bad})`); process.exit(1) }
  console.log(`check OK — ${BANNERS.length} banners`)
}

// --- main ---------------------------------------------------------------------
const args = process.argv.slice(2)
const only = args.includes('--only') ? args[args.indexOf('--only') + 1] : null
const outDir = args.includes('--out') ? args[args.indexOf('--out') + 1] : OUT_DIR_DEFAULT

if (args.includes('--check')) {
  check(outDir)
} else {
  mkdirSync(outDir, { recursive: true })
  const fonts = await prepFonts()
  for (const b of BANNERS) {
    if (only && b.key !== only) continue
    const png = render(b, fonts)
    writeFileSync(join(outDir, b.file), png)
    console.log(`${b.file}  ${outW(b)}x${outH(b)}  (${(png.length / 1024).toFixed(0)} KB)`)
  }
}

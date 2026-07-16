#!/usr/bin/env node
// Banner/cover generation for Diar.ia social surfaces (#3577 — troca de tagline).
//
// Generates every social cover PNG from parametric SVG layouts, rendered with
// resvg. Follows the same philosophy as export-logos.mjs: the SVG layout in
// this file is the canonical source; committed PNGs are build artifacts.
//
// Fonts:
//   - Georgia (wordmark + serif line): system font, same rationale as
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

const MONO = 'Geist Mono'
const SERIF = "Georgia, 'Times New Roman', serif"

export const BANNERS = [
  { key: 'facebook', file: 'facebook-cover-1640x624.png', w: 1640, h: 624, layout: 'centered', bg: PAPER },
  { key: 'linkedin-diaria', file: 'linkedin-cover-2256x382.png', w: 2256, h: 382, layout: 'side', bg: PAPER },
  // LinkedIn pessoal e X sobrepõem o avatar no canto inferior ESQUERDO; o
  // layout centered mantém wordmark/tagline no centro e o CTA à direita, então
  // nada essencial cai na zona coberta — sem offset especial.
  { key: 'linkedin-pessoal', file: 'linkedin-cover-pessoal-3168x792.png', w: 3168, h: 792, layout: 'centered', bg: PAPER },
  { key: 'twitter', file: 'twitter-header-1500x500.png', w: 1500, h: 500, layout: 'centered', bg: PAPER },
  { key: 'apoiase', file: 'apoiase-cover-4800x900.png', w: 4800, h: 900, layout: 'dark', bg: INK },
  { key: 'umapenca-desktop', file: 'umapenca-banner-desktop-1920x400.png', w: 1920, h: 400, layout: 'side', bg: PAPER },
  { key: 'umapenca-mobile', file: 'umapenca-banner-mobile-1250x400.png', w: 1250, h: 400, layout: 'centered', bg: PAPER },
]

const escXml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// --- wordmark (mirrors assets/logo/logo.svg tspan structure) -----------------
function wordmark(x, y, size, anchor = 'middle', dark = false) {
  const base = dark ? PAPER : INK
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${SERIF}" font-weight="700" font-size="${size}"><tspan fill="${base}">diar</tspan><tspan fill="${TEAL}">.</tspan><tspan fill="${base}">ia</tspan><tspan fill="${TEAL}">.br</tspan></text>`
}

function mono(x, y, size, text, { anchor = 'middle', fill = INK, tracking = '0.18em', weight = 500 } = {}) {
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${MONO}" font-weight="${weight}" font-size="${size}" letter-spacing="${tracking}" fill="${fill}">${escXml(text)}</text>`
}

// --- layouts -----------------------------------------------------------------
// centered: eyebrow row + rule / wordmark / tagline / soft rule / serif CTA.
// Mirrors the previous Facebook cover composition.
function layoutCentered(b) {
  const { w, h } = b
  const mx = Math.round(w * 0.06)
  const eyebrowSize = Math.round(h * 0.034)
  const wordmarkSize = Math.round(h * 0.23)
  const taglineSize = Math.min(Math.round(h * 0.045), Math.round((w - 2 * mx) / (TAGLINE.length * 0.72)))
  const ctaSize = Math.round(h * 0.058)
  return `
  ${mono(mx, h * 0.135, eyebrowSize, EYEBROW_LEFT, { anchor: 'start', tracking: '0.22em' })}
  ${mono(w - mx, h * 0.135, eyebrowSize, EYEBROW_RIGHT, { anchor: 'end', tracking: '0.22em' })}
  <rect x="${mx}" y="${h * 0.175}" width="${w - 2 * mx}" height="${Math.max(2, h * 0.005)}" fill="${INK}"/>
  ${wordmark(w / 2, h * 0.46, wordmarkSize)}
  ${mono(w / 2, h * 0.655, taglineSize, TAGLINE)}
  <rect x="${mx}" y="${h * 0.76}" width="${w - 2 * mx}" height="${Math.max(1, h * 0.0025)}" fill="${RULE_SOFT}"/>
  <text x="${w - mx}" y="${h * 0.885}" text-anchor="end" font-family="${SERIF}" font-weight="700" font-size="${ctaSize}"><tspan fill="${INK}">${escXml(CTA_PREFIX)}</tspan><tspan fill="${TEAL}">${escXml(CTA_DOMAIN)}</tspan></text>`
}

// side: wordmark left, tagline block right — for very wide/short strips
// (LinkedIn company, Uma Penca desktop). Mirrors the previous LinkedIn cover
// composition.
//
// #3577 hotfix (260716, reportado pelo editor via screenshot ao vivo do
// LinkedIn): plataformas com banner+avatar sobrepostos (LinkedIn, Facebook,
// X/Twitter) desenham o avatar/logo circular por CIMA do canto inferior
// esquerdo do banner. A composição original colocava a wordmark baixa
// (baseline em 0.56h) exatamente nessa zona — mal cabia antes do avatar
// cobrir, ficou visualmente apertado tanto no desktop quanto no mobile do
// LinkedIn (mesma imagem, mesmo recorte relativo). Fix: todo o bloco
// (wordmark + tagline) sobe pro terço superior do banner, deixando o terço
// inferior esquerdo — a zona coberta pelo avatar em qualquer plataforma que
// faça esse overlay — inteiramente livre de conteúdo essencial.
function layoutSide(b) {
  const { w, h } = b
  const mx = Math.round(w * 0.05)
  const wordmarkSize = Math.round(h * 0.34)
  const taglineSize = Math.round(h * 0.078)
  const subSize = Math.round(h * 0.062)
  return `
  ${wordmark(mx, h * 0.36, wordmarkSize, 'start')}
  ${mono(w - mx, h * 0.26, taglineSize, TAGLINE_L1, { anchor: 'end', tracking: '0.14em' })}
  ${mono(w - mx, h * 0.42, taglineSize, TAGLINE_L2, { anchor: 'end', tracking: '0.14em' })}
  ${mono(w - mx, h * 0.6, subSize, EYEBROW_RIGHT + ' · ' + EYEBROW_LEFT, { anchor: 'end', tracking: '0.2em', fill: '#6B655C' })}`
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

const LAYOUTS = { centered: layoutCentered, side: layoutSide, dark: layoutDark }

export function bannerSvg(b) {
  return `<?xml version="1.0"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${b.w}" height="${b.h}" viewBox="0 0 ${b.w} ${b.h}">
  <rect width="${b.w}" height="${b.h}" fill="${b.bg}"/>
  ${LAYOUTS[b.layout](b)}
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
    if (png.width !== b.w || png.height !== b.h) {
      console.error(`DIM ${b.file}: ${png.width}x${png.height} != ${b.w}x${b.h}`); bad++
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
    console.log(`${b.file}  ${b.w}x${b.h}  (${(png.length / 1024).toFixed(0)} KB)`)
  }
}

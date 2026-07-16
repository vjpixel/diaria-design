#!/usr/bin/env node
// Reproducible logo PNG export for Diar.ia.
//
// Renders every PNG under assets/logo/png (and the logo/ mirror) directly from
// the canonical SVGs in assets/logo, using the vendored Newsreader Bold font.
// Deterministic: a clean checkout + `npm run export` yields no diff.
//
// Why this exists: the PNGs were originally exported ad-hoc, which let bugs slip
// in (e.g. a "transparent" white wordmark that shipped with an opaque dark
// background baked in). Generating from the SVGs removes that class of error.
//
// Usage:  npm install && npm run export
//         node export-logos.mjs --check   # fail if output differs (CI guard)

import { Resvg } from '@resvg/resvg-js'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO = join(__dirname, '..')
const FONT = readFileSync(join(__dirname, 'fonts', 'Newsreader-Bold.ttf'))

// The two mirrored asset trees kept in sync. SVGs are read from the first;
// PNGs are written to the png/ dir of each.
const TREES = ['assets/logo', 'logo'].map((p) => join(REPO, p))
const SVG_DIR = TREES[0]

const PAPER = '#FBFAF6' // brand paper background for opaque composites

// --- render matrix -----------------------------------------------------------
// Wordmark canvas proportion: the family ships at 474/2048. The source SVGs use
// a tight viewBox (1180x240 -> 0.203); we reframe to 1180x273 (-> 0.2314) so the
// raster has the family's vertical padding. Icons are square, no reframe.
const WORDMARK_SIZES = [512, 1024, 2048, 3307, 4096]
const ICON_SIZES = [256, 512, 1024, 3307]
const WORDMARK_FRAME_VIEWBOX = '0 0 1180 273'
const WORDMARK_ASPECT = 273 / 1180

// slug -> config. Wordmarks and icons are discovered from the SVGs present.
const WORDMARKS = ['logo', 'logo-mono', 'logo-mono-white', 'logo-white-teal', 'logo-dark']
const ICONS = ['icon', 'icon-dark', 'icon-dotdot', 'icon-dotdot-dark']
// Opaque paper composites, rendered from an existing wordmark SVG.
const PAPER_COMPOSITES = [{ from: 'logo', out: 'logo-paper', sizes: [2048, 3307] }]

// --- helpers -----------------------------------------------------------------
function renderPng(svg, width, height, background) {
  const opts = {
    font: { fontBuffers: [FONT], loadSystemFonts: false, defaultFontFamily: 'Newsreader' },
  }
  if (background) opts.background = background
  // fitTo is unreliable across resvg-js versions for viewBox-only SVGs; set the
  // root width/height explicitly instead.
  const sized = svg.replace(/<svg /, `<svg width="${width}" height="${height}" `)
  if (sized === svg) throw new Error('opening `<svg ` tag not found — cannot set output size')
  return new Resvg(sized, opts).render().asPng()
}

function wordmarkSvg(slug) {
  const svg = readFileSync(join(SVG_DIR, `${slug}.svg`), 'utf8')
  const framed = svg.replace(/viewBox="0 0 1180 240"/, `viewBox="${WORDMARK_FRAME_VIEWBOX}"`)
  // Fail loud: a silent no-op here would raster the wrong aspect ratio and
  // commit a distorted PNG with no error (the "add a variant" flow in README).
  if (framed === svg) {
    throw new Error(`${slug}.svg: expected viewBox "0 0 1180 240" not found — reframe aborted`)
  }
  return framed
}

// Collect every (relativePath -> bytes) this build produces.
function build() {
  const out = new Map()
  const add = (name, bytes) => {
    for (const tree of TREES) out.set(join(tree, 'png', name), bytes)
  }

  for (const slug of WORDMARKS) {
    if (!existsSync(join(SVG_DIR, `${slug}.svg`))) continue
    const svg = wordmarkSvg(slug)
    for (const w of WORDMARK_SIZES) {
      add(`${slug}-${w}.png`, renderPng(svg, w, Math.round(w * WORDMARK_ASPECT)))
    }
  }

  for (const { from, out: name, sizes } of PAPER_COMPOSITES) {
    if (!existsSync(join(SVG_DIR, `${from}.svg`))) continue
    const svg = wordmarkSvg(from)
    for (const w of sizes) {
      add(`${name}-${w}.png`, renderPng(svg, w, Math.round(w * WORDMARK_ASPECT), PAPER))
    }
  }

  for (const slug of ICONS) {
    if (!existsSync(join(SVG_DIR, `${slug}.svg`))) continue
    const svg = readFileSync(join(SVG_DIR, `${slug}.svg`), 'utf8')
    for (const s of ICON_SIZES) add(`${slug}-${s}.png`, renderPng(svg, s, s))
  }

  return out
}

// --- run ---------------------------------------------------------------------
const CHECK = process.argv.includes('--check')
const files = build()
let written = 0
let drifted = 0

for (const [path, bytes] of files) {
  const exists = existsSync(path)
  const same = exists && Buffer.compare(readFileSync(path), bytes) === 0
  if (same) continue
  if (CHECK) {
    console.error(`drift: ${path.replace(REPO + '\\', '').replace(REPO + '/', '')}`)
    drifted++
    continue
  }
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, bytes)
  written++
}

if (CHECK) {
  if (drifted) {
    console.error(`\n${drifted} file(s) out of date. Run: npm run export`)
    process.exit(1)
  }
  console.log(`ok — ${files.size} PNGs match the SVG sources`)
} else {
  console.log(`exported ${files.size} PNGs (${written} written, ${files.size - written} already current)`)
}

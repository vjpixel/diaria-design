#!/usr/bin/env node
// Logo PNG export + structural check for Diar.ia.
//
// `export` renders every PNG under assets/logo/png (and the logo/ mirror)
// directly from the canonical SVGs in assets/logo. The brand face is
// **Georgia** (round teal dots) — loaded from the system, not vendored, since
// Georgia is proprietary and can't be redistributed in the repo. Generating
// from the SVGs is what removes the class of bug that shipped a "transparent"
// white wordmark with an opaque dark background baked in (see #9).
//
// NOTE: `export` needs Georgia installed (Windows/macOS ship it; on Linux
// install a metric-equivalent or the real face). `--check` does NOT render, so
// CI needs no font.
//
// `--check` does NOT compare bytes: a font rasterizer (resvg) produces
// platform-dependent pixels — the same version renders slightly differently on
// Windows vs Linux — so byte-identity across machines is unattainable and would
// make CI fail spuriously. Instead it validates platform-independent structural
// invariants of the committed PNGs (dimensions, alpha channel, expected
// transparency, visible ink). That still catches the #9-class bug while passing
// on any OS.
//
// Usage:  npm install && npm run export     # regenerate PNGs (needs resvg)
//         npm run check                      # verify invariants (needs pngjs)

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, relative } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO = join(__dirname, '..')

const TREES = ['assets/logo', 'logo'].map((p) => join(REPO, p))
const SVG_DIR = TREES[0]
const PAPER = '#FBFAF6'

// --- render matrix -----------------------------------------------------------
// Wordmark canvas proportion: the family ships at 474/2048. Source SVGs use a
// tight viewBox (1180x240 -> 0.203); we reframe to 1180x273 (-> 0.2314) so the
// raster carries the family's vertical padding. Icons are square, no reframe.
const WORDMARK_SIZES = [512, 1024, 2048, 3307, 4096]
const ICON_SIZES = [256, 512, 1024, 3307]
const WORDMARK_FRAME_VIEWBOX = '0 0 1180 273'
const WORDMARK_ASPECT = 273 / 1180

const WORDMARKS = ['logo', 'logo-mono', 'logo-mono-white', 'logo-white-teal', 'logo-dark']
const ICONS = ['icon', 'icon-dark', 'icon-dotdot', 'icon-dotdot-dark']
const PAPER_COMPOSITES = [{ from: 'logo', out: 'logo-paper', sizes: [2048, 3307] }]

// Variants whose wordmark ink is white — must contain visible near-white pixels.
const WHITE_INK = new Set(['logo-mono-white', 'logo-white-teal', 'logo-dark'])

// The build plan: one entry per output PNG, with the invariants `--check` asserts.
// { path, width, height, opaqueBg, whiteInk, rounded }
function plan() {
  const items = []
  const push = (name, spec) => {
    for (const tree of TREES) items.push({ path: join(tree, 'png', name), ...spec })
  }
  const wmH = (w) => Math.round(w * WORDMARK_ASPECT)

  for (const slug of WORDMARKS)
    for (const w of WORDMARK_SIZES)
      push(`${slug}-${w}.png`, { width: w, height: wmH(w), opaqueBg: false, whiteInk: WHITE_INK.has(slug) })

  for (const { out: name, sizes } of PAPER_COMPOSITES)
    for (const w of sizes) push(`${name}-${w}.png`, { width: w, height: wmH(w), opaqueBg: true, whiteInk: false })

  for (const slug of ICONS)
    for (const s of ICON_SIZES)
      // Icons have a rounded rect (rx=96) so the very corner is transparent, but
      // the interior is a solid fill. Dark-ground icons carry white ink.
      push(`${slug}-${s}.png`, { width: s, height: s, opaqueBg: false, rounded: true, whiteInk: slug.endsWith('-dark') })

  return items
}

// --- export (render) ---------------------------------------------------------
async function runExport() {
  const { Resvg } = await import('@resvg/resvg-js')

  const render = (svg, width, height) => {
    // Georgia is loaded from the system (proprietary — not vendored). The SVGs
    // declare `font-family="Georgia, ..."`; defaultFontFamily is the fallback.
    const opts = { font: { loadSystemFonts: true, defaultFontFamily: 'Georgia' } }
    // fitTo is unreliable across resvg-js versions for viewBox-only SVGs; set
    // the root width/height explicitly instead.
    const sized = svg.replace(/<svg /, `<svg width="${width}" height="${height}" `)
    if (sized === svg) throw new Error('opening `<svg ` tag not found — cannot set output size')
    return new Resvg(sized, opts).render().asPng()
  }
  // Opaque background is drawn as a bleeding full-canvas <rect>: resvg-js's
  // `background` option is silently ignored for these SVGs (shipped a "paper"
  // composite that was actually transparent), so bake the fill into the SVG.
  // The rect bleeds past the viewBox so the sub-pixel letterbox left by
  // preserveAspectRatio "meet" (canvas aspect ≠ viewBox aspect after integer
  // rounding) can't leave a transparent edge. Content outside the viewBox is
  // clipped to the viewport, so the bleed is harmless.
  const withBg = (svg, color) =>
    svg.replace(/(<svg\b[^>]*>)/, `$1<rect x="-40" y="-40" width="1260" height="353" fill="${color}"/>`)
  const wordmarkSvg = (slug) => {
    const svg = readFileSync(join(SVG_DIR, `${slug}.svg`), 'utf8')
    const framed = svg.replace(/viewBox="0 0 1180 240"/, `viewBox="${WORDMARK_FRAME_VIEWBOX}"`)
    if (framed === svg) throw new Error(`${slug}.svg: expected viewBox "0 0 1180 240" not found — reframe aborted`)
    return framed
  }

  const bytesFor = new Map() // name -> buffer (rendered once, written to both trees)
  const wmH = (w) => Math.round(w * WORDMARK_ASPECT)
  for (const slug of WORDMARKS) {
    if (!existsSync(join(SVG_DIR, `${slug}.svg`))) continue
    const svg = wordmarkSvg(slug)
    for (const w of WORDMARK_SIZES) bytesFor.set(`${slug}-${w}.png`, render(svg, w, wmH(w)))
  }
  for (const { from, out: name, sizes } of PAPER_COMPOSITES) {
    if (!existsSync(join(SVG_DIR, `${from}.svg`))) continue
    const svg = withBg(wordmarkSvg(from), PAPER)
    for (const w of sizes) bytesFor.set(`${name}-${w}.png`, render(svg, w, wmH(w)))
  }
  for (const slug of ICONS) {
    if (!existsSync(join(SVG_DIR, `${slug}.svg`))) continue
    const svg = readFileSync(join(SVG_DIR, `${slug}.svg`), 'utf8')
    for (const s of ICON_SIZES) bytesFor.set(`${slug}-${s}.png`, render(svg, s, s))
  }

  let written = 0
  for (const [name, bytes] of bytesFor) {
    for (const tree of TREES) {
      const path = join(tree, 'png', name)
      mkdirSync(dirname(path), { recursive: true })
      writeFileSync(path, bytes)
      written++
    }
  }
  console.log(`exported ${written} PNGs from ${bytesFor.size} unique renders`)
}

// --- check (structural, platform-independent) --------------------------------
async function runCheck() {
  const { PNG } = await import('pngjs')
  const rel = (p) => relative(REPO, p).split('\\').join('/')
  const px = (png, x, y) => {
    const i = (png.width * y + x) << 2
    return [png.data[i], png.data[i + 1], png.data[i + 2], png.data[i + 3]]
  }

  const errors = []
  const items = plan()
  for (const it of items) {
    if (!existsSync(it.path)) {
      errors.push(`${rel(it.path)}: faltando — rode 'npm run export'`)
      continue
    }
    let png
    try {
      png = PNG.sync.read(readFileSync(it.path))
    } catch (e) {
      errors.push(`${rel(it.path)}: PNG ilegível (${e.message})`)
      continue
    }
    const fail = (m) => errors.push(`${rel(it.path)}: ${m}`)

    if (png.width !== it.width || png.height !== it.height)
      fail(`dimensão ${png.width}x${png.height}, esperado ${it.width}x${it.height}`)

    // Corner pixel: transparent for wordmarks/icons (rounded), opaque for paper.
    const cornerA = px(png, 0, 0)[3]
    if (it.opaqueBg && cornerA !== 255) fail(`fundo devia ser opaco, canto alpha=${cornerA}`)
    if (!it.opaqueBg && cornerA !== 0) fail(`fundo devia ser transparente, canto alpha=${cornerA} (regressão tipo #9)`)

    // Must have visible content: sample a grid, require opaque + (white ink) near-white pixels.
    let opaque = 0
    let white = 0
    const STEP = Math.max(1, Math.floor(Math.min(png.width, png.height) / 64))
    for (let y = 0; y < png.height; y += STEP)
      for (let x = 0; x < png.width; x += STEP) {
        const [r, g, b, a] = px(png, x, y)
        if (a > 200) {
          opaque++
          if (r > 240 && g > 240 && b > 240) white++
        }
      }
    if (opaque === 0) fail('sem pixels opacos — imagem vazia?')
    if (it.whiteInk && white === 0) fail('variante de tinta branca sem pixels near-white visíveis')
  }

  if (errors.length) {
    console.error(`\n${errors.length} problema(s):`)
    for (const e of errors) console.error('  ✗ ' + e)
    console.error(`\nInvariantes estruturais falharam. Se você alterou um SVG, rode 'npm run export'.`)
    process.exit(1)
  }
  console.log(`ok — ${items.length} PNGs passam nas invariantes estruturais`)
}

// --- run ---------------------------------------------------------------------
if (process.argv.includes('--check')) await runCheck()
else await runExport()

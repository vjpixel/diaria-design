---
name: diaria-design
description: Use this skill to generate well-branded interfaces and assets for Diar.ia (a Brazilian daily AI-news newsletter with an editorial, newspaper-style identity — cream paper, ink black, a single teal accent, big serif headlines), for production or for throwaway prototypes/mocks/decks. Contains the brand's colors, type, fonts, logo assets, and reusable UI components.
user-invocable: true
---

Read `readme.md` first — it covers the product, the voice/copy rules, the visual
foundations, and iconography. Then explore the rest:

- `styles.css` (root) is the single entry point — link it and use the CSS variables
  (`var(--brand)`, `var(--font-serif)`, `var(--ink-soft)`, …). Never hardcode hexes.
- `tokens/` holds the raw color/type/spacing definitions.
- `components/core/` has the React primitives (`Button`, `Kicker`, `Rule`, `Badge`,
  `Logo`, `EmailSignup`) — each has a `.prompt.md` with usage.
- `assets/logo/` has the wordmark and icon in SVG + PNG.
- `Diar.ia Layout Proposals.html` shows full landing screens (direction A = official).

If creating visual artifacts (slides, mocks, throwaway prototypes), copy assets out and
build static HTML for the user to view. If working on production code, copy assets and
read the rules here to design as a Diar.ia brand expert.

Hold the line on the brand: editorial/newspaper voice in Brazilian Portuguese, sentence-
case headlines with MONO UPPERCASE kickers, italics (often teal) for emphasis, flat
paper surfaces with hairline rules instead of shadows, pill buttons/inputs, teal used
sparingly. No gradients, no emoji, no decorative icons or stats.

If the user invokes this skill without further guidance, ask what they want to build,
ask a few focused questions, and act as an expert designer outputting HTML artifacts or
production code as appropriate.

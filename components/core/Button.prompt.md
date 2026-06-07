**Button** — Diar.ia's pill-shaped action control; use `ink` for the primary CTA, step down to `outline`/`ghost` for secondary actions, and `teal` only on dark surfaces.

```jsx
<Button variant="ink">Assinar grátis</Button>
<Button variant="outline">Entrar</Button>
<Button variant="ghost">Buscar</Button>
<Button variant="teal" onDark>Ver os 28 cursos →</Button>
```

Variants: `ink` (filled near-black, default), `teal` (brand fill, weight 600 — pair with `onDark`), `outline` (hairline border), `ghost` (text only). Sizes `sm | md | lg`. Hover dims to 85% opacity. Always pill radius.

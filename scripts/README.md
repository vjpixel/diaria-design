# Export reproduzível dos logos

Gera **todos os PNGs** de `assets/logo/png` (e do espelho `logo/png`) a partir dos
SVGs canônicos em `assets/logo/`. Determinístico: um checkout limpo + `npm run export`
não produz diff.

## Por que existe

Os PNGs eram exportados ad-hoc, o que deixava bugs passarem — por exemplo, um
wordmark "branco transparente" que foi commitado com o fundo escuro `#171411`
**opaco embutido**. Rasterizar a partir do SVG elimina essa classe de erro e
garante que a arte publicada é sempre a arte da fonte de verdade (o SVG).

## Uso

```bash
cd scripts
npm install
npm run export     # regenera os PNGs a partir dos SVGs
npm run check      # falha se algum PNG estiver defasado (guard de CI)
```

Requer só Node + npm. A fonte **Newsreader Bold** (instância estática opsz 72 /
wght 700, família renomeada para `Newsreader`) está vendorada em
`fonts/Newsreader-Bold.ttf` — sem download em build, sem fontTools. Licença OFL
em `fonts/OFL.txt`.

## Matriz gerada

| Grupo | Variantes | Tamanhos |
|---|---|---|
| Wordmark | `logo`, `logo-mono`, `logo-mono-white`, `logo-white-teal`, `logo-dark` | 512, 1024, 2048, 3307, 4096 |
| Papel (opaco `#FBFAF6`) | `logo-paper` (de `logo.svg`) | 2048, 3307 |
| Ícones | `icon`, `icon-dark`, `icon-dotdot`, `icon-dotdot-dark` | 256, 512, 1024, 3307 |

**Enquadramento:** os SVGs de wordmark usam viewBox justa (`1180×240`, proporção
0,203). O export reframa para `1180×273` (0,231) para o raster ganhar o padding
vertical da família 2048 (474/2048). Ícones são quadrados, sem reframe.

O `3307px` corresponde à largura A4 curta (210 mm) a 400 DPI, para print.

## Adicionar uma variante

1. Coloque o `{slug}.svg` em `assets/logo/` (e no espelho `logo/`).
2. Adicione o `slug` a `WORDMARKS` ou `ICONS` em `export-logos.mjs`.
3. `npm run export`.

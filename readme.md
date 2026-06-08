# Diar.ia — Design System

> Newsletter diária sobre IA, em português. "Seu filtro no caos de notícias sobre IA."
> Identidade **editorial de jornal**: papel quase-branco quente, tinta preta, um teal de destaque,
> serifa grande para as manchetes.

Este projeto é a **fonte da verdade** da marca Diar.ia. Quem for criar slides, e-mails,
landing pages, posts ou telas de produto deve partir daqui: os tokens (cores, fontes,
espaçamento), os componentes e os arquivos de logo.

**Para consumir:** linke apenas o `styles.css` da raiz — ele importa fontes e todos os
tokens. Use as variáveis CSS (`var(--brand)`, `var(--font-serif)`, etc.) em vez de
valores fixos.

---

## O produto

Diar.ia é uma **newsletter diária** (segunda a sexta) que faz curadoria e resume as
principais pesquisas, lançamentos e notícias de inteligência artificial — pensada para
ser lida em **5 minutos**. Além da edição diária, mantém dois "cadernos especiais":
uma estante de **livros sobre IA** e uma lista de **cursos gratuitos**.

- **Tom:** editorial, confiante, brasileiro. Trata a newsletter como um jornal ("Edição
  Nº 412", "Vol. III", "redação", "cadernos especiais").
- **Público:** profissionais e curiosos que querem acompanhar IA sem se afogar no volume.
- **Métrica-âncora:** 5 minutos de leitura · ~12,4 mil leitores · edição diária.

A direção visual selecionada é a **"Edição Diária"** (newspaper / masthead). Duas
direções alternativas foram exploradas e arquivadas (B "Signal", monospace/briefing;
C "Issue Nº", revista) — não são a marca oficial, ficam só como referência em
`Diar.ia Layout Proposals.html`.

---

## Fundamentos de conteúdo (voz & copy)

- **Idioma:** português do Brasil. Sempre.
- **Pessoa:** fala com "você" ("para você não ficar perdido"), e a redação como "nós".
- **Caixa:** títulos em caixa normal (sentence case), nunca em caps. **Kickers e meta**
  (rótulos, datas, contadores) ficam em **MAIÚSCULAS** monoespaçadas com tracking largo.
- **Ênfase:** feita com **itálico serifado**, muitas vezes tingido de teal —
  ex.: "usar IA *melhor*", "O que *não cabe* em 5 minutos".
- **Números como editorial:** "Nº 412", "Vol. III", "5 min", "R$ 0,00", "28 cursos".
  Usados com parcimônia e sempre concretos — nada de métrica decorativa.
- **Emoji:** não. O único "ornamento" recorrente é o **bullet ●** antes de um kicker
  ("● EDIÇÃO DE HOJE") e o **✓** nas linhas de reasseguramento ("✓ Seg–Sex").
- **Setas:** `→` em CTAs e `↗` em links externos (mono).
- **Exemplos de copy real:**
  - Tagline: "Seu filtro no caos de notícias sobre IA."
  - CTA primário: "Assinar grátis", "Ler edição", "Ver os 28 cursos →"
  - Reasseguramento: "✓ Seg–Sex · ✓ 5 min · ✓ Cancelar a qualquer momento"
  - Fechamento: "5 minutos. *Toda manhã.*"

---

## Fundamentos visuais

**Paleta.** Quatro cores. Nada de gradientes.
- **Papel `#FBFAF6`** — fundo principal, quase branco com leve calor.
- **Bege `#EBE5D0`** — o "tom silencioso": moldura e seções recuadas, preenchimento de
  boxes e **todos os fios e bordas**. Preenche quando é área; vira fio quando é 1px.
- **Tinta `#171411`** — todo o texto sobre claro e o fundo do rodapé. Sem cinzas
  secundários: a hierarquia vem de **tamanho, peso, caixa-alta e itálico**.
- **Teal `#00A0A0`** — único acento: pontos da wordmark, `.br`, links, kickers e marcas.
  Usado com parcimônia, sobre papel ou ink.
- Superfícies escuras usam a própria tinta `#171411` com texto em papel/bege.

**Tipografia.** Três famílias:
- **Georgia** (serifada) — manchetes grandes e apertadas (tracking até −0.05em),
  itálico para ênfase. É a voz da marca. Fonte do sistema (web-safe), renderiza
  igual em todos os navegadores e clientes de email — sem depender de webfont.
- **Geist** (sans, Google Fonts) — corpo de texto, navegação, UI e a própria wordmark (600, −0.02em).
- **Geist Mono** — kickers, rótulos, datas e meta, sempre em CAIXA ALTA com tracking
  0.08–0.16em. (JetBrains Mono é o fallback.)
- Escala bem contrastada: masthead chega a 220px; manchetes 68/52/32px; corpo 15px;
  kicker 11px. Veja `tokens/typography.css` e o card "Escala tipográfica".

**Layout.** Estrutura de jornal: filetes (rules) horizontais separam tudo —
**filete fino 1px @18%** para divisões, **filete grosso 2px sólido** para emoldurar o
masthead. Grids editoriais assimétricos (ex.: `1.15fr 1fr`). Gutters laterais de ~56px,
ritmo vertical de seção de 64–88px.

**Forma.** Sistema **plano e de papel** — quase sem sombra. Cartões = branco com filete
1px (raio 6–12px). Imagens com cantos de 4–6px. **Botões e inputs são pílulas**
(raio 999px). Tags/badges têm cantos pequenos (4px). Sombra (`--shadow-pop`) só em
elementos que realmente "flutuam".

**Caixas.** Dois templates de caixa, ambos com cantos arredondados (raio 12px):
- **Contorno** — fundo igual ao papel (`--paper` `#FBFAF6`) + **linha de contorno**
  bege (`--rule` `#EBE5D0`, 1px). Leve, recua; é o "aparte" editorial. Uso canônico: o
  box **"Por que isso importa"** ao fim de cada destaque.
- **Painel** — **preenchido** em bege sólido (`--paper-alt` `#EBE5D0`), sem borda.
  Módulo fechado, com mais presença. Usos: **enquete "É IA?"**, **errata**,
  **fechamento** e **patrocínio**.
- Em e-mail, a tabela que envolve qualquer das duas precisa de
  `border-collapse:separate; border-spacing:0` — senão o `border-radius` é ignorado.

**Movimento & estados.** Discreto. Hover = leve queda de opacidade (~85%) ou troca para
o creme; transições rápidas (0.15s). Sem bounce, sem loops decorativos.

**Imagery.** Capas reais das edições (fotos editoriais, cantos levemente arredondados).
As lombadas de livros são blocos de cor sólida com sombra interna nas bordas
(`--shadow-spine`) imitando uma estante.

---

## Convenções de e-mail

O e-mail (Beehiiv) tem restrições de cliente que sobrescrevem algumas escolhas
de superfície web. Consumidor de referência: `Diar.ia Email Template.html` +
`diaria-studio/scripts/render-newsletter-html.ts`.

- **Superfícies (#3):** o e-mail é **branco** — card (`.container`) `#FFFFFF` sobre
  página `#FFFFFF`, **sem trilhos laterais**. O token `--paper` (#FBFAF6) e a
  estrutura papel-sobre-bege seguem valendo na **web/mensal**, não no e-mail
  diário (override email-only, diaria-studio#1943/#1945).
- **Underline de acento (#2):** manchetes/itens de lista usam
  `text-decoration: underline` + `text-decoration-color: var(--brand)`. Sublinha
  **todas as linhas** de um título multi-linha; o `border-bottom` (email-safe no
  Outlook) só traça a última linha — por isso preterido. Onde o cliente remove
  `text-decoration-color` (Outlook), o sublinhado degrada pra ink (aceito).
- **Reveal / nota (#1):** box **contorno** (fundo card + `1px solid --rule`), não
  painel. Convenção: **painel** (bege preenchido) = bloco de **ação** (É IA?,
  CTA); **contorno** = **nota/reveal** informativo.
- **Type scale (#4):** ponta pequena consolidada em **12px** (kicker/ui/small);
  corpo **16px**; lead/títulos de callout **22px** — ver `tokens/typography.css`.

---

## Iconografia

A marca é **quase sem ícones**. Em vez de um set de ícones, usa **glifos tipográficos**
dentro da fonte mono: `●` (bullet de kicker), `✓` (reasseguramento), `→` (CTA),
`↗` (link externo), `№/Nº` (numeração de edição). Não há icon-font nem biblioteca de SVG
no produto. **Não invente ícones** nem use emoji. Se um ícone de interface for mesmo
necessário (busca, menu), use um set de traço fino e neutro (ex.: Lucide via CDN) com
peso compatível, e trate-o como exceção, não como padrão.

Os únicos assets vetoriais da marca são os **logos** (ver abaixo).

---

## Logo & assets

Em `assets/logo/` (SVG vetorial + PNG em 512/1024/2048/4096px):
- `logo.svg` / `logo-dark.svg` — wordmark primária e invertida
- `logo-mono.svg` / `logo-mono-white.svg` — monocromática (impressão, b&w)
- `icon.svg` / `icon-dark.svg` — ícone quadrado (favicon, usos pequenos)

Regras: a cor da marca é `#00A0A0`; os **pontos e o `.br` são sempre teal**, o resto da
wordmark acompanha a cor de texto do contexto. Geist 600, tracking −0.02em. Área de
respiro ≥ altura da letra "d". Tamanho mínimo 16px de altura — abaixo disso, use o ícone
quadrado. Para impressão, converta o texto do SVG em outlines.

A página de referência completa do logo é `Diar.ia Logo.html`.

---

## Índice / manifesto

- **`styles.css`** (raiz) — ponto de entrada; importa tudo abaixo.
- **`tokens/`** — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`.
- **`components/core/`** — primitivos React: `Button`, `Kicker`, `Rule`, `Badge`,
  `Logo`, `EmailSignup` (cada um com `.jsx`, `.d.ts` e `.prompt.md`).
- **`guidelines/`** — specimen cards (cores, tipografia, espaçamento, marca) que
  alimentam a aba Design System.
- **`assets/logo/`** — logos e ícones (SVG + PNG).
- **`Diar.ia Logo.html`** — folha de referência do logo (variantes, escalas, downloads).
- **`Diar.ia Layout Proposals.html`** — as 3 direções de landing exploradas (A é a
  oficial); usa `data.js` + `v1-daily.jsx`, `v1-mobile.jsx`, `v2-signal.jsx`,
  `v3-issue.jsx`. Boa referência de telas completas.
- **`data.js`** — conteúdo de exemplo (edições, livros, cursos, FAQs).
- **`SKILL.md`** — torna este sistema utilizável como Agent Skill.

---

## Compartilhamento

Para que o resto da sua organização veja isto como design system, defina o tipo do
arquivo como **Design System** no menu Share.

# Diar.ia — Design System (memória de projeto p/ Claude Code)

Este repositório **é** o design system da Diar.ia — a fonte da verdade da marca
(newsletter brasileira diária de notícias de IA; identidade editorial de jornal).
Quem for criar e-mails, slides, landing pages, posts ou telas deve **partir daqui**.

## Comece por aqui
1. Leia `readme.md` — produto, voz/copy, fundamentos visuais e iconografia.
2. Leia `SKILL.md` — regras de marca condensadas + mapa de arquivos.

## Como consumir
- Linke **`styles.css`** (raiz) — ponto de entrada único; importa todos os tokens.
- Use as variáveis CSS (`var(--brand)`, `var(--ink)`, `var(--paper)`, `var(--font-serif)`…).
  **Nunca chumbe hex na mão.**
- `tokens/` — definições cruas de cor / tipografia / espaçamento.
- `components/core/` — primitivos React (Button, Kicker, Rule, Badge, Logo, EmailSignup),
  cada um com seu `.prompt.md`.
- `guidelines/` — specimen cards (cores, tipografia, caixas, etc.).
- `assets/logo/` — wordmark + ícone (SVG + PNG).

## Paleta (4 cores)
Ink `#171411` (todo o texto + rodapé) · Bege `#EBE5D0` (moldura, boxes e fios) ·
Papel `#FBFAF6` (fundo, quase-branco) · Teal `#00A0A0` (único acento, com parcimônia).
Hierarquia de texto por **tamanho/peso**, não por cor.

## Caixas (dois templates)
- **Contorno** — fundo papel + linha bege 1px. Uso: "Por que isso importa".
- **Painel** — bege sólido, sem borda. Usos: enquete "É IA?", errata, fechamento, patrocínio.
- Em e-mail, a tabela que envolve a caixa precisa de `border-collapse:separate; border-spacing:0`.

## Edições são E-MAIL
"Edição" = e-mail. A **diária** existe como e-mail + espelho web idêntico
(`Diar.ia Edição.html` = `Diar.ia Email Template.html`). A **mensal** é só e-mail
(`Diar.ia Edição Mensal.html`). Nunca crie um design web diferente do e-mail.

## Guardrails de marca
Voz editorial em PT-BR · títulos em sentence-case com KICKERS MONO MAIÚSCULOS ·
manchetes em serifa **Georgia** · itálico (às vezes teal) para ênfase · superfícies
planas de papel com filetes (sem sombra) · botões/inputs em pílula · teal usado pouco.
Sem gradientes, sem emoji, sem ícones decorativos ou métricas de enfeite.

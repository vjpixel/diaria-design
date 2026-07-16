# Avatar / favicon Diar.ia — "d.."

Set do avatar **d..** em círculo. Georgia bold (outlined), haste do "d"
centralizada no círculo, pontos redondos equidistantes seguindo à direita.
**Proporção canônica: d.. a 1.2× do círculo** — ver [PROPORTION.md](PROPORTION.md)
para a spec completa (composição, escalas, cores). Decisão do editor 260716.

Cores: ink `#171411`, teal `#00A0A0`, branco `#FFFFFF` (papel foi substituído por branco).

## Tratamentos (cada um: SVG + PNG 16/32/64/180/320/512/1024/1080)

| Arquivo | Descrição | Uso |
|---|---|---|
| `diaria-avatar-dd` | quadrado escuro + círculo branco | avatar principal |
| `diaria-avatar-dd-bola-preta` | disco escuro, transparente | avatar/favicon versátil |
| `diaria-avatar-dd-bola-branca` | disco branco, d preto, pontos teal, transparente | favicon fundo claro |
| `diaria-avatar-dd-bola-teal` | disco teal, d.. branco, transparente | favicon sempre-visível |
| `diaria-avatar-dd-bola-preta-fundo-branco` | quadrado branco + círculo escuro | |
| `diaria-avatar-dd-anel` | contorno (anel), transparente | marca d'água |

Os `bola-*` transparentes servem tanto de avatar quanto de favicon (tamanhos 16/32/64 inclusos). Como são transparentes, cada um "some" sobre fundo da mesma cor — a `bola-teal` é a mais segura pra qualquer superfície.

## Substituição do avatar antigo (d.)
`diaria-avatar.svg` / `-180/320/512/1080.png` / `-bola-preta.png` / `-bola-preta-fundo-papel.png` (a marca **d.** antiga) → equivalentes `diaria-avatar-dd-*`. Os antigos ficam preservados até você trocar.

## Regenerar
Espelhado no repo `diaria-design` (`assets/avatar/` + `scripts/gen-avatar.mjs`). Mudar a proporção = mudar `PROPORTION` no script e regenerar.

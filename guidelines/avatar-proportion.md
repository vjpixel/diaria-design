# Proporção do avatar/favicon "d.."

Especificação canônica da marca **"d.."** em círculo (avatar + favicon).
**Decisão do editor 260716.** Fonte reprodutível: `scripts/gen-avatar.mjs`.

## Composição

Tudo no viewBox `0 0 1080 1080` (quadrado; o círculo é `cx=540 cy=540`).

- **Letra "d"**: glifo **Georgia Bold** convertido em `<path>` outlined (self-contained — renderiza idêntico sem a fonte instalada). font-size de referência 470 (unidades Georgia, upm 2048 → `scale ≈ 0.2295`), baseline em `y=700`, posicionada com `x=310` de modo que a **haste vertical do "d" fica em x=540 (centro exato do círculo)**. A barriga fica à esquerda do centro.
- **Dois pontos**: `<circle>` REDONDOS (não o period da fonte — círculos explícitos para controle exato), raio `45`, centro-y `662`, centros-x `699` e `824`. Isso dá **espaçamento equidistante**: o gap D→ponto1 ≈ ponto1→ponto2 (whitespace ~35). Os pontos seguem à direita da haste.

## Proporção (o número que importa)

```
PROPORTION = 1.2
```

O grupo "d.." é escalado por **1.2×** em relação ao círculo (a partir da composição-base, que era 1.0). Isso deixa a marca preenchendo mais o círculo — decisão tomada para **legibilidade do favicon** (16–32px), aplicada em TODOS os lugares para manter consistência.

O escalonamento é **sobre o centro** (`transform="translate(540 540) scale(S) translate(-540 -540)"`), onde:

```
S = BASE_FIT[tratamento] × PROPORTION
```

`BASE_FIT` ajusta ao raio do círculo de cada tratamento, preservando a MESMA proporção visual do "d.." relativa ao círculo:

| Tratamento | Círculo | BASE_FIT | S (×1.2) |
|---|---|---|---|
| `bola-preta` / `bola-branca` / `bola-teal` | disco cheio r=540 | 1.0 | **1.2** |
| `avatar` (círculo inscrito em quadrado) | r=432 | 0.8 | 0.96 |
| `fundo-branco` (círculo em quadrado) | r=500 | 0.926 | 1.111 |
| `anel` (contorno) | r=500 | 0.815 | 0.978 |

## Cores por tratamento

Paleta: ink `#171411`, teal `#00A0A0`, branco `#FFFFFF`.

| Tratamento | Fundo/disco | "d" | pontos |
|---|---|---|---|
| `bola-preta` | disco ink, transparente fora | branco | teal |
| `bola-branca` | disco branco, transparente fora | ink | teal |
| `bola-teal` | disco teal, transparente fora | branco | branco* |
| `avatar` | quadrado ink + círculo branco | ink | teal |
| `fundo-branco` | quadrado branco + círculo ink | branco | teal |
| `anel` | contorno ink, transparente | ink | teal |

\* No `bola-teal` os pontos são brancos (teal sobre teal seria invisível).

## Arquivos

Cada tratamento: `{nome}.svg` + PNGs em 16/32/64/180/320/512/1024/1080.
Nomes: `diaria-avatar-dd` (avatar principal), `diaria-avatar-dd-bola-{preta,branca,teal}`, `diaria-avatar-dd-bola-preta-fundo-branco`, `diaria-avatar-dd-anel`.

Regenerar: `node scripts/gen-avatar.mjs` (não precisa de fonte — o "d" é path).

## Ao mudar a proporção

Alterar **só** a constante `PROPORTION` em `scripts/gen-avatar.mjs` e regenerar. Todos os tratamentos (avatar + favicon) mudam juntos, mantendo a consistência.

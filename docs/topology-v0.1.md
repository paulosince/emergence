# P0.5 — Métricas topológicas com nulos (H-ORG) — v0.1

**Data:** 09/11/2026 · **Código:** `src/research/bench/topology.js` · **Testes:** `tests/topology.test.js`

## Medidas (validadas em grafos com resposta conhecida)
| Medida | Validação |
|---|---|
| Grau e força (grafo simetrizado pelo maior peso) | Estrela; simetrização |
| Número *k-core* | Estrela, halteres e triângulo com cauda |
| Intermediação (Brandes), normalizada | Centro da estrela = 1, folhas = 0; nós da ponte no topo dos halteres |
| Comunidades por propagação de rótulos ponderada, determinística pela semente | Separa os dois cliques dos halteres |
| Coeficiente de participação e grau intramódulo z (Guimerà e Amaral 2005) | Participação > 0 só nos nós da ponte |
| Religação com grau preservado (trocas duplas de arestas) | Todos os graus mantidos |
| *Rich club* φ(k) e normalizado ρ(k) = φ/φ do nulo (Colizza et al. 2006) | **Núcleo determinado pelos graus → ρ = 1; clube genuíno → ρ > 1,2** |
| Resumo por nó | Completo e finito na malha real do controle TEMPO |

## Nulos disponíveis para ORG-1 a ORG-7
| Confundidor (seção 5.2 do desenho) | Nulo | Onde |
|---|---|---|
| Distribuição de grau | Religação com grau preservado | `rewire`, `richClub` |
| Taxa e duração por fonte | Dados substitutos e reprodução exata | P0.4 (`surrogates.js`, `replay.js`) |
| Geometria de exibição | Análise só em medidas topológicas | Seção 5.1; `experiments/embedding-centrality-artifact.mjs` |
| **Idade** | Teste de permutação já disponível; **nulo de crescimento com idade pareada fica para F2.3**, porque depende das regras de criação do MCM | — |

## Lição do teste
Um núcleo denso de hubs **não** implica organização além do esperado: se os graus forçam a estrutura, ρ = 1. As previsões ORG-1 e ORG-5 devem ser julgadas por ρ e por nulos, nunca por φ ou pela imagem.

## Limites
Grafo simetrizado para as medidas não dirigidas; intermediação por saltos, não por latência; propagação de rótulos é simples e pode variar com a semente (por isso semente declarada).

# P0.1 — Controle de latências no controle TEMPO de nós fixos (sala) — v0.1

**Data:** 09/11/2026 · **Script:** `experiments/latency-control.js` · **Teste:** `tests/latency-control.test.js`

## Pergunta
As 7 relações formadas pelo controle TEMPO de nós fixos na sala refletem a estrutura do mundo ou as latências fixas dos transdutores (r0 200, r1 300, r2 200, r3 400, r4 400, r5 100 ms)?

## Previsões
| Manipulação | Artefato de instrumento | Estrutura do mundo |
|---|---|---|
| Latências iguais | relações somem | relações persistem |
| Latências permutadas | direções seguem a nova ordem de latência | padrão mantido |
| Mundos diferentes, latências fixas | padrão invariante | padrão muda |

## Resultados (semente 42; latências iguais e originais repetidas com 6 sementes)
- **Latências iguais (100, 250 e 400 ms):** 0 relações nos três casos. Em 6 sementes (1, 2, 3, 7, 99, 2026): 0 relações em todas.
- **Latências permutadas (5 rotações):** 7 a 9 relações; **100%** das relações dirigidas vão do canal mais rápido para o mais lento; sobreposição com o padrão original de 0,00 a 0,23 (Jaccard).
- **12 mundos** (3 datas × 2 climas × objeto presente/ausente) com as latências originais: padrão **idêntico** ao original em 12/12, e 100% das relações seguem a ordem de latência.
- A única variação entre sementes é a direção entre r3 e r4, que têm a mesma latência (400 ms).

## Conclusão
Hipótese de artefato de instrumento **confirmada** dentro deste cenário: as relações temporotopológicas formadas pelo controle TEMPO na sala têm como conteúdo a assinatura temporal dos canais de transdução, não processos do mundo. Coerente com o critério N5 e com a recalibração de defasagens constantes (Fujisaki et al. 2004).

## Implicações para o MCM
- Relações invariantes entre condições do mundo devem ser atribuídas à via de transdução (N5). O critério D3 da etapa 9 exige covariância com o referente, não com os canais.
- A escala do TEMPO (janela de 120 ms) não alcança os processos da sala (minutos e horas): a única estrutura sub-120 ms disponível é a latência dos instrumentos (N4).

## Limites
Um cenário (sala), um mecanismo (TEMPO com nós fixos, modo `shift`, K = 4, η = 0,2) e transdutores sem ruído. Não generaliza para o MCM nem para outros mundos.

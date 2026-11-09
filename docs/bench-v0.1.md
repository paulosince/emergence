# bancada de avaliação — Nulos e bancada de avaliação — v0.1

**Data:** 09/11/2026 · **Código:** `src/research/bench/` (`stats.js`, `surrogates.js`, `replay.js`, `causal.js`) · **Testes:** `tests/bench.test.js` · **Demonstração:** `experiments/bench-demo.js`

## Componentes
| Componente | O que faz | Validação |
|---|---|---|
| Estatística | Postos com empates, Spearman, teste de permutação bilateral com semente, comparação com nulo (z e p empírico com piso 1/(n+1)), IC por bootstrap | Casos conhecidos; correlação forte com p < 0,01 e ruído com p > 0,05 |
| Dados substitutos | **Deslocamento circular** por canal (preserva contagem, valores e tempo interno; destrói o tempo entre canais); **embaralhamento de intervalos** por canal (preserva contagem, ordem dos valores e distribuição de intervalos); **permutação de rótulos de canal** (preserva todo o tempo; destrói a correspondência canal–fonte). Cada um declara o que preserva e o que destrói | Contagens, valores, intervalos e determinismo conferidos; alinhamento entre canais reduzido a menos de um terço |
| Reprodutor | Alimenta qualquer motor com um fluxo de incidências, com a mesma semântica de ordenação do executor | **Reproduz exatamente** o estado final e o número de eventos do controle TEMPO na sala |
| Remoção causal (princípio do papel causal interno; critério de papel causal) | Compara o efeito de remover uma unidade-alvo com remoções aleatórias, em execuções idênticas; recusa motores sem `ablate(unidade)` em vez de simular remoção | Unidade influente supera todas as remoções aleatórias; motor sem `ablate` recusado |

## Demonstração no controle TEMPO
**(a) Sala, número de relações (observado 7; 30 substitutos cada):**
- Deslocamento circular: nulo 0 em 30/30 → o observado **supera** o nulo (p no piso de 0,032).
- Embaralhamento de intervalos: nulo 7 em 30/30 → o observado **não** supera o nulo.

**Lição metodológica:** superar um nulo isolado **não prova ancoragem no mundo**. As 7 relações batem o deslocamento circular, mas já sabemos (controle de latências) que são artefato de latência dos instrumentos. Sobrevivem ao embaralhamento de intervalos porque a amostragem síncrona em grade de 15 min mantém o alinhamento entre canais. Os critérios de pré-registro devem exigir **conjuntos** de nulos e o teste critério de ancoragem, não um nulo só.

**(b) Quedas, critério de ancoragem (latência da relação s0→s1 × intervalo vivido; 40 episódios; teste de permutação, 2000 permutações):**

| Semente | Spearman | p |
|---|---|---|
| 1 | 0,190 | 0,223 |
| 2 | −0,000 | 0,999 |
| 3 | 0,383 | 0,015 |
| 4 | 0,115 | 0,479 |

Uma em quatro sementes abaixo de 0,05, o que não sobrevive à correção para comparações múltiplas. **O controle TEMPO não satisfaz critério de ancoragem.**

## Limites
- O p empírico tem resolução limitada pelo número de substitutos ou remoções (piso 1/(n+1)).
- A remoção causal depende de cada motor declarar `ablate`; o controle TEMPO ainda não declara.
- Os nulos foram escolhidos para os mundos atuais; mundos com objetos (mundo da mesa) podem pedir nulos novos.

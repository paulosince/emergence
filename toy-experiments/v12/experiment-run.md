# V0.12 — Etapa II: execução exploratória e auditoria de implementação

**Data:** 2026-11-12. **Status:** rodada exploratória executada, não validação pré-registrada integral. Documento de observação técnica; a análise científica formal pertence à Etapa III.

## Rastreabilidade
- Base conceitual: `EMERGENCE_V012_Pre_Experimento.pdf`, candidato, com parâmetros e mecanismos pendentes.
- Decisões operacionais tomadas antes de executar: [adendo](experiment-protocol-addendum.md).
- Código: [src/model.js](src/model.js).
- Execução: JavaScript do arquivo no GitHub avaliado diretamente, chamada `experiment12()`; 3 sementes × 2 geometrias × 4 braços = **24 corridas**; 480 ticks de treino, 120 de repouso e 72 de sonda sem plasticidade.

## Sumário observacional da rodada
| Braço | g médio | Chegada no alvo (duas geometrias, ticks) | Resposta no alvo (duas geometrias) |
|---|---:|---|---|
| A — malha fixa plástica | 0.059305174 | 17 / 8 | 0.000152512 / 0.000275380 |
| B — acoplamento variável | 0.001000000 | não atingiu limiar em 72 ticks | 1.53e-13 / 3.53e-10 |
| C — sem memória | 0.060000000 | 17 / 8 | 0.000154391 / 0.000276637 |
| D — permutado | 0.059305174 | 17 / 8 | respostas variam por semente, ~0.000151–0.000275 |

**Auditoria crítica imediata:**
1. A, B e C são determinísticos para cada geometria; variar sementes não cria replicações independentes nesses braços. Apenas D utiliza sorteio na permutação.
2. O braço B permanece no piso de g; não constitui acoplamentos funcionais sob a regra testada. Comparação A×B é fortemente confundida pela condutância inicial distinta, e não testa isoladamente conectividade variável.
3. A e C apresentam respostas próximas; diferença não constitui prova de percurso individuado.
4. Ablação de célula intermediária reduz resposta, mas a célula foi escolhida geometricamente, e a redução não basta para afirmar Upro.
5. A resposta no alvo é uma observação de difusão local; o código não rastreia sequência individualizada de transmissões nem demonstra integração coletiva.
6. O controle D preserva a distribuição de g, mas não necessariamente todos os fatores espaciais.
7. Os resultados não satisfazem critérios de constituição de Uint/Upro; nenhum resultado representacional é reivindicado.
8. As configurações de pulso são periódicas e fixas; não há variação aleatória efetiva do estímulo. É necessário ampliar o desenho antes de teste conclusivo.
9. **Não modificar retrospectivamente o PDF.** Mudanças propostas serão novas rodadas exploratórias ou nova versão/adendo explícito.

## Próximo passo
Etapa III: publicar dados completos, testes de intervenção mais abrangentes, falhas e decisão sobre a hipótese. Não reclassificar a rodada como confirmação. Não alterar TEMPO.

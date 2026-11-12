# Diagnóstico instrumental da V0.11 — sem alterar o mecanismo

**Data:** 2026-11-12. **Procedimento:** reexecutar `src/model.js` do commit da V0.11 com seed 41, persistência ativa, 840 ciclos, amostras nos ciclos 14, 70, 140, 280, 560 e 840. Não foi feita mudança no algoritmo; as métricas abaixo são observações externas.

## Resultado espacial
| Cenário | Memória total | Fração da memória nas fontes | Maior memória fora das fontes | Maior memória geral |
|---|---:|---:|---:|---:|
| Associadas | 0,22124 | 73,77% | 0,005142 | 0,081606 |
| Independentes | 0,11452 | 85,57% | 0,001697 | 0,050014 |
| Alternadas | 0,07840 | 96,91% | 0,000538 | 0,038289 |
| Fonte única | 0,11079 | 73,67% | 0,005144 | 0,081613 |

No cenário associado, as células de maior memória foram as duas fontes (1,2,2) e (1,5,3), ambas m=0,081606. O maior valor fora das fontes (0,005142) ficou abaixo do limiar externo de região (0,01). A condição de fonte única gerou praticamente a mesma memória máxima (0,081613).

## Evolução da condutância e fluxo (associadas)
| Ciclo | Fluxo máximo amostrado após atualização | g mínimo | g máximo | arestas acima de 0,012 no instante |
|---|---:|---:|---:|---:|
| 14 | 0,00102 | 0,044970 | 0,045002 | 0 |
| 70 | 0,00134 | 0,044849 | 0,045015 | 0 |
| 140 | 0,00138 | 0,044698 | 0,045034 | 0 |
| 280 | 0,00138 | 0,044395 | 0,045071 | 0 |
| 560 | 0,00138 | 0,043790 | 0,045145 | 0 |
| 840 | 0,00139 | 0,043186 | 0,045220 | 0 |

**Limitação de medição:** fluxos amostrados depois da atualização não são máximos globais de todas as operações internas; não afirmar que nunca houve fluxo maior em algum passo.

## Diagnóstico mecanístico
1. A memória `m` acumula variação de `v`, mas não retroage sobre `v` ou `g`; é registro passivo, não marca constitutiva operacional.
2. O transporte é difusivo e aproximadamente aditivo; não há operação de integração constituída.
3. A regra de condutância exige `passage>0.012` para reforço; fluxos amostrados após atualização são ~0.001–0.0014, cerca de uma ordem de grandeza abaixo do limiar. O enfraquecimento domina longe das fontes.
4. O limiar externo `m>0.01` seleciona fontes, não regiões de convergência.
5. Arestas do reticulado são infraestrutura física preexistente, não Upro.
6. `history` e `refractory` não alteram o mecanismo; nomes de atributos não demonstram funções.

## Interpretação
Compatível com H0 (diferenciação sem integração). Não discrimina H1, H2 e H3 (precedência integradora, constituição conjunta, percursos primeiro). A hipótese de Uint organizadora das Upro não foi adequadamente testada.

## Próximas medições, sem alterar o modelo
Instrumentar fluxo *durante* cada atualização, perfil espacial da energia/atividade, distribuição completa de latências e sobreposição, análise de sensibilidade dos limiares, comparação pareada A+B vs A e B separados, e controles de ablação e mudança de fontes. Somente depois propor mecanismos candidatos de transformação constitutiva.

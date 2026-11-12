# V0.11 — Rodada complementar E1–E6: execução e resultados

**Data:** 2026-11-12. **Pré-registro:** delimitação aprovada e PDF gerado antes da rodada. **Mecanismo:** `src/model.js` original, sem alteração. **Condição:** paired, seed 41, persistência ativa, 840 ciclos de aprendizagem; ensaios por cópias de estado.

## Métodos
- E1: distribuição de g após aprendizagem, comparação com g inicial 0,045.
- E2: zerar atividades, emitir A+B uma vez, evoluir 90 ciclos sem novas injeções; comparar campo v com clone em que todas as g foram restauradas a 0,045. Norma L2 e norma relativa.
- E3: em clones, restaurar a 0,045 seis arestas mais reforçadas, seis mais enfraquecidas, todas incidentes às fontes e seis arestas de controle; comparar respostas de 90 ciclos à resposta sem intervenção.
- E4: restaurar separadamente as duas arestas mais reforçadas e conjuntamente; medir resíduo vetorial `v_AB - v_A - v_B + v_original` após 90 ciclos.
- E5: clone sem novas incidências por 280 ciclos, medir alteração de condutância.
- E6: clones por 280 ciclos adicionais, um com fontes deslocadas e outro sem deslocamento; medir diferença das distribuições g.

## Resultados
| Ensaio | Medida | Valor |
|---|---|---:|
| E1 | Arestas g > 0,045 | 12 |
| E1 | Arestas g < 0,045 | 1500 |
| E1 | g médio final | 0,0432334093 |
| E1 | maior reforço (g−0,045) | +0,000219615 |
| E1 | maior enfraquecimento (g−0,045) | −0,001814399 |
| E2 | L2 campo de atividade aprendido vs restaurado | 0,0002406322 |
| E2 | L2 relativo à resposta restaurada | 1,344867% |
| E2 | maior diferença absoluta por célula | 0,0000339926 |
| E3 | Restaurar seis arestas reforçadas, L2 | 0,00000419991 |
| E3 | Restaurar seis arestas mais enfraquecidas, L2 | 0,000000001163 |
| E3 | Restaurar arestas incidentes às fontes, L2 | 0,00000317357 |
| E3 | Restaurar seis arestas de controle, L2 | 0,00000249301 |
| E4 | Intervenção primeira aresta, L2 | 0,00000187370 |
| E4 | Intervenção segunda aresta, L2 | 0,00000187370 |
| E4 | Intervenção conjunta, L2 | 0,00000335060 |
| E4 | Resíduo vetorial de interação | 1,3733 × 10⁻¹⁰ |
| E5 | L2 da alteração em g após repouso | 0,02349356 |
| E5 | g médio após repouso | 0,0426292208 |
| E6 | L2 diferença g entre deslocado e controle | 0,00322199 |
| E6 | Diferença relativa à alteração total no cenário deslocado | 13,994% |
| E6 | Maior diferença absoluta de g por aresta | 0,0006487824 |

## Classificação C1–C4
- **C1 — Evidência positiva:** diferenciação estrutural mensurável, predominantemente enfraquecimento. Persistência *durante* a aprendizagem, mas não estabilidade indefinida.
- **C2 — Evidência positiva:** diferenças de propagação em estado aprendido vs restaurado (1,34% em L2 relativo). Não implica organização integradora.
- **C3 — Não demonstrado:** o resíduo de interação de duas arestas é praticamente nulo. Isso não refuta todas as possíveis dependências distribuídas, pois o ensaio cobre apenas duas arestas e um tipo de resposta.
- **C4 — Parcial/indeterminado:** as condutâncias permanecem diferentes do início mas decaem durante repouso; mudança de fontes altera a trajetória de g em comparação com controle, mas não demonstra reorganização funcional estável.

## Limitações e honestidade experimental
1. Uma única semente, uma geometria e um horizonte temporal; não houve análise estatística entre réplicas.
2. A intervenção de E3 não normaliza por magnitudes das mudanças individuais; seis arestas de controle não são pareadas em distância, grau ou fluxo.
3. O E4 testa apenas duas arestas e a resposta final; linearidade observada não exclui outros tipos de organização.
4. O E5 revela decaimento estrutural mesmo sem atividade porque a regra `passage - 0.012` continua atuando; isso não é teste de retenção após congelamento da plasticidade.
5. O E6 demonstra diferença estrutural, mas não mede diretamente desempenho funcional nem constitui evidência de adaptação adequada.
6. O método de perturbação de E2–E4 continua aplicando plasticidade durante a prova, embora os clones partam dos mesmos estados; diferenças medem o sistema dinâmico completo, não somente transporte congelado.
7. Os resultados foram obtidos executando o núcleo JS em ambiente isolado; interface em navegador não testada.
8. Não foram demonstradas Uint, Upro, Sdom nem representação.

## Conclusão
As marcas estruturais `g` são operacionais: sua história altera a propagação posterior. A classificação mais defensável é **C1 e C2 positivos, C3 não demonstrado, C4 parcial/indeterminado**. Não confundir esse resultado com a demonstração de organização integradora. A V0.11 pode ser encerrada como investigação de diferenciação estrutural, preservando hipóteses de constituição relacional para novas versões.

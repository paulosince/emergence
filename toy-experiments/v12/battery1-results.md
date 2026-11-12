# V0.12 — Bateria corretiva 1: resultados observacionais

**Data:** 2026-11-12. **Estatuto:** resultados de bateria exploratória corretiva. Plano congelado antes da execução em [battery1-preregistration.md](battery1-preregistration.md). **Não demonstra Uint, Upro nem representação.**

## Procedimento reproduzível
Motor base [src/model.js](src/model.js), classe `Medium12`. Diagnóstico externo, sem alteração do código original: inicializar braço A e substituir todos os g por g0; adicionar amplitude a ambas as fontes antes de cada `step({learn})` nos ticks 0,12,...,468; 480 passos de treinamento; 120 de repouso com ou sem atualização; sonda `probe(0)` com plasticidade congelada; alvo id=6+8*(3+6*2)=126, 72 passos, limiar de chegada 1e-5. Controles pareados usam exatamente a mesma sequência de incidências com `learn=false`. Padrões pseudoaleatórios selecionam 40 ticks únicos entre 0 e 479 com Fisher–Yates/LCG, sementes 11,41,73; mesma quantidade de pulsos.

## E1 — análise da regra
`Δg=.0009*(|g Δv|-.002)` antes de clipping; com Δv=1, g=.001 → fluxo .001, atualização negativa; g=.06 → fluxo .06, atualização positiva. **A atualização é local e depende de gradiente efetivo; isso não garante que um pulso alcance regiões distantes.**

## E2/E3 — condições iniciais e controles pareados
| g0 | pulso | média g final | g máx | arestas acima de g0 ao fim do treino | chegada (ticks) | resposta final | resposta sem plasticidade |
|---:|---:|---:|---:|---:|---:|---:|---:|
| .001 | 1 | .001000000 | .001000 | 12 | -1 | 1.53266e-13 | 1.53266e-13 |
| .001 | 3 | .001127830 | .006042 | 12 | -1 | 7.37464e-13 | 1.53266e-13 |
| .001 | 10 | .001927769 | .037172 | 66 | -1 | 2.21203e-12 | 1.53266e-13 |
| .005 | 1 | .004036535 | .007096 | 12 | -1 | 4.86042e-9 | 1.39224e-8 |
| .005 | 3 | .004335333 | .015174 | 40 | -1 | 8.93644e-9 | 1.39224e-8 |
| .005 | 10 | .005693304 | .050644 | 70 | -1 | 2.38569e-8 | 1.39224e-8 |
| .020 | 1 | .019167324 | .023819 | 12 | 69 | 1.06415e-5 | 1.16575e-5 |
| .020 | 3 | .019690178 | .034219 | 72 | 63 | 1.22419e-5 | 1.16575e-5 |
| .020 | 10 | .021691530 | .074298 | 186 | 52 | 1.64949e-5 | 1.16575e-5 |
| .060 | 1 | .059286366 | .064784 | 44 | 17 | 1.52512e-4 | 1.54391e-4 |
| .060 | 3 | .060028391 | .076753 | 134 | 16 | 1.57148e-4 | 1.54391e-4 |
| .060 | 10 | .062701249 | .120654 | 240 | 15 | 1.71341e-4 | 1.54391e-4 |

**Cuidado:** contagem de arestas acima de g0 refere-se ao fim do *treino*, enquanto média e máximo são após repouso; no caso g0=.001, amplitude=1, reforços transitórios desapareceram no repouso. Comparações de resposta entre amplitudes usam sonda padronizada de amplitude 1.

## E4 — calendário de incidências
40 pulsos aleatórios distintos em 480 passos, g0=.06, amplitude=1:
| Semente | média g final | reforçadas ao fim do treino | chegada | resposta |
|---:|---:|---:|---:|---:|
| 11 | .059289455 | 40 | 17 | .0001525003944 |
| 41 | .059289926 | 46 | 17 | .0001524992204 |
| 73 | .059288966 | 36 | 17 | .0001525008878 |

Variação temporal real foi introduzida; respostas no alvo são muito próximas. Três sementes não sustentam inferência estatística robusta.

## E5 — repouso
Mesmo estado treinado, g0=.06, amplitude=1:
- Atualização ligada durante 120 ticks de repouso: média g = .0592863663; chegada 17; resposta .0001525116.
- Atualização desligada durante repouso: média g = .0594975435; chegada 16; resposta .0001533299.
A regra produz enfraquecimento basal sem incidência. Não demonstra que toda forma de decaimento seja biologicamente errada.

## Interpretação e falhas
1. **Refutada** versão forte de “g=.001 nunca pode reforçar”: com pulsos de amplitude 3 e 10, houve reforço local.
2. **Mantida** incapacidade de alcançar o alvo em 72 passos nas condições g0=.001, mesmo com amplitude 10.
3. Diferença entre A/B na rodada inicial é confundida por g0; controle pareado demonstra sensibilidade a g0, amplitude e plasticidade.
4. Mudanças de g e de latência não provam constituição de percurso individualizado.
5. Não houve constituição observada de Uint/Upro; os ensaios não têm medidas suficientes para afirmar sua inexistência.
6. A bateria não prova necessidade ou suficiência de regra específica; parâmetros são instrumentais.
7. **Falha de reprodutibilidade a corrigir:** o diagnóstico foi executado por script de orquestração sobre o código GitHub, mas esse script ainda não foi publicado como artefato executável. O relatório contém procedimento e resultados; recomenda-se publicar runner independente antes de encerrar a etapa II.

## Decisão
Não ajustar silenciosamente a regra original. Próxima bateria deve medir percursos com sondas e intervenções, mantendo controles e declarando se houver alteração de mecanismo. A terceira bateria integrativa não deve ser interpretada como validação sem critérios não circulares.

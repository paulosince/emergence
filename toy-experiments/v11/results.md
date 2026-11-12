# EMERGENCE V0.11 — Resultados executados

**Data:** 2026-11-12. **Status:** núcleo JavaScript executado em ambiente isolado; interface não validada em navegador real.

## Implementação
Meio tridimensional discreto 12×8×6 (576 células) com propagação por vizinhança espacial; atividade escalar `v`, memória estrutural `m`, condutância `g` adaptativa por fluxo local. Sem `traceA`, `traceB`, `min(a,b)` ou entidade `Uint`/`Upro` pré-instanciada. Identidade das fontes usada para injeção e medição externa. 840 ciclos por condição, seed 41.

## Resultados
| Cenário | Persistência | Regiões acima de m=0,01 | Máximo m | Arestas g>0,05 | Arestas podadas | Eventos |
|---|---|---:|---:|---:|---:|---:|
| Associadas | Sim | 2 | 0,081606 | 0 | 0 | 181 |
| Independentes | Sim | 2 | 0,050014 | 0 | 0 | 136 |
| Alternadas | Sim | 2 | 0,038289 | 0 | 0 | 121 |
| Fonte única | Sim | 1 | 0,081613 | 0 | 0 | 121 |
| Associadas | Não | 0 | 0 | 0 | 0 | 181 |
| Independentes | Não | 0 | 0 | 0 | 0 | 136 |
| Alternadas | Não | 0 | 0 | 0 | 0 | 121 |
| Fonte única | Não | 0 | 0 | 0 | 0 | 121 |

Células mais diferenciadas no cenário associado: 217=(1,2,2), 349=(1,5,3), coincidentes com as próprias fontes transdutivas. Não houve região integradora intermediária. Os probes em célula 217 produziram A=0,00102187, B=0,00045687, AB=0,00147872, com diferença AB−A−B aproximadamente −0,00000001 (erro numérico); propagação praticamente aditiva. Não há integração funcional demonstrada.

## Julgamento das hipóteses
H0 (diferenciação sem integração) é compatível com os resultados. H1, H2 e H3 não foram discriminadas: não houve organização integradora nem percursos novos. Ausência de arestas reforçadas e podadas significa que a implementação não atingiu o objetivo de investigar formação/perda efetiva de percursos. A simples existência de arestas vizinhas no meio é infraestrutura, não Upro constituída.

## Limitações metodológicas
- A memória responde sobretudo à variação local da atividade e concentra-se nas fontes.
- O ajuste de condutância é fraco para alterar a malha durante o horizonte escolhido.
- Arestas começam preexistentes como meio físico, sem constituição de percursos funcionais.
- Controles de ablação e deslocamento existem como ações na interface, mas **não foram executados em uma matriz comparativa automatizada** nesta rodada.
- O cenário independente permite coincidências; não constitui isolamento temporal estrito.
- O registro é de pulsos e amostras, não de todas as trocas microscópicas ou sorteios aleatórios; replay integral não demonstrado.
- Interface publicada como arquivos de origem, mas não testada em navegador.

## Conclusão
**0 Uint e 0 Upro demonstradas.** V0.11 demonstra memória local dependente de persistência e um resultado negativo útil: a retirada da coincidência explícita expõe a ausência de mecanismo de diferenciação integradora. Não afirmar que o resultado refuta a hipótese geral de Uint organizadora; refuta apenas a suficiência da dinâmica implementada. Próxima hipótese: examinar que propriedades locais podem estabilizar encontros de incidências sem definir um detector de integração ou destino antecipadamente.

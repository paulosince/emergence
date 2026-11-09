# Inventário das regras de malha temporotopológica

**Data:** 09/11/2026. **Origem:** *Programa TEMPO* (pesquisa do responsável; implementada no repositório TEMPO, só leitura), *literatura*, *proposta nossa*, *inferência nossa* (da CLEAR ou de achado nosso). "Análogo a" é leitura minha, sem fonte verificada. Divergências da neurobiologia e motivações: [revisão](neurobiological-divergence-review-v0.1.md).

## 1. Implementadas: malha do TEMPO (nós fixos; só as ligações nascem, se ajustam e morrem)
| Tipo | Regra | Heurística | Origem |
|---|---|---|---|
| Criação | Criação por coatividade ordenada | Nó dispara; cada nó que disparou até 120 ms antes ganha ligação até ele (peso 0,3; latência sorteada em 2–100 ms); sem duplicar ligação existente | Programa TEMPO; análogo a aprendizado hebbiano |
| Adequação | Reforço por concordância de intervalo | Alvo dispara depois da origem: peso sobe em direção ao teto, mais quanto mais o intervalo vivido coincide com a latência (tolerância 3 ms) | Programa TEMPO; análogo à plasticidade dependente do tempo de disparo |
| Adequação | Ajuste de latência: deslocamento (em uso), seleção, fixa | Deslocamento: a latência se move para o intervalo vivido. Seleção: latência fixa, sobrevivem as que coincidem. Fixa: ablação | Deslocamento: Programa TEMPO; seleção: literatura (Gerstner et al., 1996); termos de Eurich et al. (2000), citados pelo TEMPO |
| Adequação | Enfraquecimento por desencontro | Intervalo vivido difere da latência em mais de 3 ms: peso cai um pouco | Programa TEMPO |
| Adequação | Depressão por ordem inversa | Alvo disparou antes da origem (até 120 ms): peso cai | Programa TEMPO; coerente com Bi e Poo (1998) |
| Poda | Poda por peso mínimo | Peso < 0,05: ligação removida | Programa TEMPO |
| Estabilização | Resistência por consolidação | Perto do teto, ajuste de latência e quedas de peso ficam menores | Programa TEMPO; análogo a consolidação sináptica |
| Estabilização | Teto de peso | Peso ≤ 1,2 (acima do limiar 1,0: uma ligação consolidada dispara o alvo) | Programa TEMPO |
| Parâmetro | Limite de grau de saída | Até 4 ligações por nó; parâmetro de simulação, não critério | Programa TEMPO |

**Decaimento:** não há decaimento das ligações por desuso. Só o potencial do nó decai (integração com vazamento de 5 ms, limiar 1,0, refratário de 5 ms), o que é dinâmica do nó, não regra da malha.

## 2. Propostas: motor constitutivo mínimo (não implementado)
| Tipo | Regra | Heurística | Origem | Estado |
|---|---|---|---|---|
| Decaimento | Traço multiescala | Cada fonte deixa traços que decaem em 0,1 s, 3 s, 90 s e 45 min | Proposta nossa, com base em Fusi, Drew e Abbott (2005) e Bittner et al. (2017) | aprovada |
| Interligação | Coincidência entre fontes distintas | Sinal de uma fonte enquanto o traço de outra está acima do limiar: par candidato, com o atraso vivido | Proposta nossa; aparentada à policronia (Izhikevich, 2006) | aprovada |
| Criação | Criação por não acomodação | Cria unidade só se nenhuma existente responde; a unidade exige as duas fontes | Literatura (rede que cresce quando necessário; teoria da ressonância adaptativa); CLEAR | aprovada |
| Criação | Limiar de vigilância com habituação | Rigor do teste de novidade ajustável; contador de habituação controla a taxa | Literatura (as mesmas) | sugestão |
| Ciclo de vida | Consolidação por recorrência | Provisória → consolidada após confirmações; consolidada resiste | Programa TEMPO, transposto | aprovada |
| Poda | Poda por desuso ou contradição persistente | Provisória não confirmada ou contrariada é removida | Programa TEMPO; Perruchet e Vinter (1998) | aprovada |
| Adequação | Ajuste de atraso por chegada fora da janela | Corrige o atraso quando o sinal chega um pouco fora | Inferência nossa (corrigibilidade da CLEAR) | aprovada |
| Adequação | Revisão seletiva | Discrepância persistente: nova unidade, a antiga é preservada | Inferência nossa (correção assimétrica da CLEAR) | aprovada |
| Adequação | Recalibração de canal | Deslocamento constante entre canais absorvido por regra global | Inferência nossa (achado da latência); Fujisaki et al. (2004) | variante aprovada |
| Antecipação | Estado de espera | Pré-ativa o esperado; discrepância revisa; chegada não antecipada pode criar | Literatura (memória temporal hierárquica) | sugestão |
| Interligação entre níveis | Recursão pela mesma regra | Descarga vira sinal; nível = 1 + maior nível das entradas; sem camadas predefinidas | Literatura (Perruchet e Vinter; Lagorce et al., 2017); ausência de vizinhança dada: proposta nossa | aprovada |
| Agrupamento | Categorização por substituibilidade | Contextos de entrada e saída parecidos convergem numa unidade disjuntiva | Proposta nossa; precedente não verificado | variante aprovada |
| Limite | Orçamento de unidades | Até 5.000 unidades e 50 criações por segundo; parada automática | Proposta nossa (segurança) | no pré-registro |
| Evolução | Variação e seleção interna | Candidatas em excesso; retém confirmadas; poda o resto | Proposta nossa | sugestão |
| Plasticidade | Manutenção de plasticidade | Reinicializa capacidade não usada | Literatura de inteligência artificial (Dohare et al., 2024) | sugestão |
| Modulação | Regra de três fatores com modulação epistêmica | Marca de elegibilidade no traço; sinal global de novidade ou surpresa gerado pelo próprio sistema; mudança duradoura só se o sinal chegar dentro da janela | Literatura (Frémaux e Gerstner, 2016; Gerstner et al., 2018; Yu e Dayan, 2005; Takeuchi et al., 2016) | proposta ([neuromodulação](neuromodulation-v0.1.md)) |
| Criação | Alocação por excitabilidade relativa | Entra na representação a candidata mais excitável no momento | Literatura (Josselyn e Tonegawa, 2020; Rashid et al., 2016) | candidata |

## 3. Não são regras da malha
Classificação de ciclo de vida na visualização (exibição), disposição 3D e agrupamento do domínio (lado do pesquisador), oráculo e "criar sempre" (controles de calibração).

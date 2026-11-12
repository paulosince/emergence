# Roteiro de investigação e fechamento de lacunas — terceira geração

**Data:** 11/11/2026. **Estado:** proposta de ordenação do assistente para avaliação do responsável; **não** é aprovação automática dos mecanismos, dos valores ou da sequência rígida.  
**Fontes internas:** [arquitetura](ARQUITETURA-UNIDADES.md), [experimentos e robô](EXPERIMENTOS-ROBO-SISTEMA.md), [observatório](INTERFACE-OBSERVATORIO.md), [PPC/ADCIF](PPC-ADCIF.md), [regras científicas](../docs/regras-cientificas-e-continuidade-2026-11-11.md). Não importar V1/V2 como especificação vigente.

## Distinção metodológica

- **Unidade:** papel funcional, capacidades e restrições; não pressupõe lista definitiva de atributos.
- **Mecanismo:** transformação operacional de estados, incidências e estruturas; inclui inicialização, atualização, limites e exceções.
- **Fenômeno:** resultado cuja ocorrência se pretende investigar (não é garantido pela implementação).
- **Validação:** testes de correção do código, suficiência funcional e avaliação representacional **separados**.

Uma propriedade só está **fechada** quando há definição operacional, mecanismo de produção/alteração/uso, casos extremos, condições de teste e decisão registrada. Propriedade nominal não é mecanismo. Algumas propriedades podem ser descartadas ou alteradas ao investigar mecanismos.

## Mapa de mecanismos e dependências

| Ordem de investigação | Família | Perguntas e mecanismos a especificar | Situação |
|---|---|---|---|
| 0 | Contrato científico e instrumentação | Versões, sementes, relógio, eventos, checkpoints, rastreabilidade de constituição, critérios de teste e PPC | Exigências aprovadas; detalhes técnicos em aberto |
| 1 | Transdução | Utrd, limiares, amplitude fixa, recrutamento de Upro por intensidade, frequência e adaptação; fronteira física e incidência | Parcial; frequência/adaptação em aberto |
| 2 | Primeira constituição | Pcrt sem circularidade; condições pré-relacionais; nascimento **conjunto** de ≥2 Upro e primeira Uint; seleção de origem/destino; tempos e coincidência; estados iniciais | **Prioridade científica atual; mecanismo aberto** |
| 3 | Representações nível 1 | Critérios para organização especificadora, fundamentação transdutiva e determinação autônoma; distinguir nascimento de estrutura de nascimento de representação | Aberto; não assumir equivalência |
| 4 | Relações entre representações nível 1 | Constituição de novas Upro e Uint, convergência, divergência, recorrência, atrasos, excitação/inibição, composição temporal e constituição de estruturas derivadas | Parcial; regras abertas |
| 5 | Dinâmica e aprendizagem | Confiança e contradição verificável, reforço, estabilidade, maturação, consolidação C=c×s, decaimento, manutenção, competição e poda | Propriedades parcialmente decididas; mecanismos abertos |
| 6 | Neuromodulação | Constituição das Uint moduladoras, ACh/NE/DA/5-HT/adenosina, liberação, difusão 3D, remoção, receptores, modulação de propagação/integração/plasticidade, terceiro fator e temporalidade | Tipos e dispersão decididos; efeitos/leis/fontes parcialmente abertos |
| 7 | Dinâmica autônoma interna | Marca-passos, reativação, ritmos, sono/vigília, consolidação sem estímulo atual, homeostase, sedimentação basal e reorganização | Hipóteses e decisões históricas; reexaminar |
| 8 | Corpo, ação e aprendizagem sensório-motora | Reflexos mínimos, eferências, consequências sensoriais, exploração evocada por reflexos, equilíbrio, autotoque, ação e previsão | Robô especificado parcialmente; aprendizagem aberta |
| 9 | Desenvolvimento hierárquico | Representações derivadas/superiores, relações entre níveis, autonomia de unidades/relações/regras, limites de Sdom e metarrepresentação possível | Aberto |
| 10 | Integração e confronto | Perturbações, ablações, controles, comparadores, campanhas preregistradas, análise de resultados negativos, revisão de PPC | Transversal e final de cada etapa, não só no fim |

**Dependência não é cronologia rígida:** se um mecanismo posterior se mostrar condição necessária para um anterior, registrar evidência, reabrir a ordem e investigar a dependência. Não inserir modulação/sono na primeira constituição por conveniência.

## Estado das propriedades por componente

| Componente | Já decidido em parte | Falta fechar |
|---|---|---|
| Incidência | Origem, tempo, magnitude fixa na borda; frequência como propriedade de sequência | Forma operacional do tempo, efeito excitatório/inibitório e composição com modulação |
| Utrd | Fronteira física, limiares e recrutamento por intensidade | Adaptação, frequência, constituição de vias, limites e mecanismos físicos |
| Upro | Origem/destino, atraso, confiança, estabilidade, C=c×s, poda em C=0 | Inicialização, confirmação/contradição, velocidade, efeito, leis de atualização, extinção |
| Uint | Integra ≥2 Upro, limiar inicial menor e maturação | Integração temporal, descarga, maturação, propriedades intrínsecas, competição |
| Pcrt | Predisposição não representacional; primeira constituição conjunta | **Todo mecanismo constitutivo inicial sem circularidade** |
| Neuromodulação | Cinco tipos e dispersão espacial; Uint moduladoras na formulação recente | Origem constitutiva, difusão quantitativa, receptores, efeitos, remoção e interações |
| Robô/ambiente | Geometria e modalidades documentadas; reflexos mínimos | Contratos definitivos com Sdom, aferência/eferência, calibração e ensaios |
| Observatório | Reprodução histórica, câmeras, trilhas e malha 3D | Esquemas, volume, retenção, reconstrução e inspeção causal |

## Para cada mecanismo, ficha obrigatória

1. **Pergunta funcional e hipótese** (do responsável, assistente ou literatura; com estatuto).
2. **Pré-condições** e mecanismos dos quais depende.
3. **Operação efetiva**, estado mínimo e eventos observáveis; proibição de explicação apenas por rótulo/JSON.
4. **Propriedades afetadas** e valores iniciais, inclusive justificativa dos parâmetros.
5. **Alternativas concorrentes**, casos adversariais e condições de falha.
6. **Critérios de teste**, controles, métricas, pré-registro quando confirmatório.
7. **Riscos PPC/ADCIF** e mudanças de envelope.
8. **Decisão**: aberto / hipótese / aprovado / implementado / testado / refutado / revisado. Essas categorias não se substituem.

## Primeira entrega científica recomendada

Antes de programar: definir o **contrato operacional mínimo de Utrd → incidência → Pcrt → nascimento conjunto de Upro/Uint**; tentar refutá-lo em entradas isoladas, simultâneas, repetidas, temporalmente defasadas e de fonte indistinguível. Não fechar confiança, estabilidade e modulação além do mínimo indispensável à inicialização.

**Regra de continuidade:** os arquivos anteriores não serão migrados; criar contratos, código e testes novos para a terceira geração. Preservar todo o histórico negativo.

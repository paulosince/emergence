# Critérios de formação e papel causal: como a neurobiologia testa (investigação para D2, D4 e D5)

**Data:** 09/11/2026. **Motivo:** a calibração ([relatório](calibration-v1.md)) mostrou D2 invertido, D4 reprovando o controle positivo e D5 sem discriminar. Regra do responsável: escolher a solução mais próxima do substrato neurobiológico.

## 1. O padrão da área: critérios de engrama
A pesquisa de engramas usa quatro tipos de evidência (Josselyn e Tonegawa, 2020, citações literais da versão PMC):
- **observacional:** "the same (or overlapping) cell populations are activated both by an experience and by retrieval of that experience", com sobreposição comparada ao acaso ("above-chance overlap");
- **perda de função:** "impairing engram cell function after an experience impairs subsequent memory retrieval";
- **ganho de função:** "artificially activating engram cells induces memory retrieval, in the absence of any natural sensory retrieval cues";
- **mimetismo:** introduzir artificialmente um engrama de algo que não aconteceu.

Critérios conceituais (Josselyn, Köhler e Frankland, 2015): **persistência, ecforia, conteúdo e dormência**. Pelas fontes secundárias que consegui ler, ecforia é o despertar do traço dormente por partes do evento original (Semon); conteúdo é que o traço reflete o que ocorreu na codificação e prediz o que pode ser recuperado. **Não li o texto integral** de 2015 (o PDF retornou 403); as definições exatas precisam ser conferidas.

## 2. Os controles que a área usa
- **Remoção aleatória de tamanho igual:** Han et al. (2009) removeram neurônios alocados (CREB alto) e, como controle, "a similar number of random, nonallocated neurons" (citação da revisão de 2020). Só a remoção dos alocados apagou a memória.
- **Especificidade de conteúdo:** depois da remoção os animais ainda aprendiam uma nova tarefa ("overall LA function was not compromised"); as células marcadas "were only reactivated by the corresponding conditioned stimulus".
- **Desfecho específico:** o desfecho é a **recuperação daquela memória**, não a atividade geral do sistema.
- **Viés de amostragem em medidas de informação:** com poucas amostras, a informação mútua é inflada; a recomendação é corrigir por embaralhamento (Panzeri et al., 2007). Modelos de decodificação são julgados por generalização a dados novos (Kriegeskorte e Douglas, 2019).

## 3. O que isso diz sobre os nossos defeitos
| Defeito | Diagnóstico pela literatura |
|---|---|
| D2 contava unidades | A área não conta células; mede **reativação pelo mesmo conteúdo acima do acaso** |
| "Criar sempre" passa em D3a | Falha a **ecforia**: nada é reativado quando o conteúdo volta |
| D4 reprovou o oráculo | Desfecho global ("reuso futuro") em vez de **recuperação do conteúdo da unidade**; sem teste de especificidade |
| D5 não discrimina | Mede só persistência; falta **dormência + ecforia**: o traço sobrevive sem uso e é reativado quando o conteúdo retorna |

## 4. Proposta (aguarda decisão do responsável)
- **D2 → reativação específica (critério observacional).** Episódios divididos em metade de codificação e metade de teste. Para cada episódio de teste, verifica-se se dispara a mesma unidade que respondeu, na codificação, ao conteúdo mais próximo (altura). Compara-se com o acaso por embaralhamento do pareamento conteúdo–unidade. Exige também **especificidade**: a unidade não deve disparar igualmente para conteúdos distantes.
  - Previsões: oráculo passa; "criar sempre" falha (sem reativação); aleatório falha (reativa, mas sem relação com o conteúdo); TEMPO falha (a mesma relação para todas as alturas, sem especificidade).
- **D4 → perda de função específica.** Remover a unidade e medir a **recuperação do conteúdo dela** nos episódios de teste da sua faixa (a resposta do sistema muda ou exige nova formação), contra a remoção de número igual de unidades aleatórias. **Especificidade:** conteúdos de outras faixas devem continuar intactos.
- **D5 → persistência, dormência e ecforia.** Regime A, depois B, depois **volta a A**: as unidades de A sobrevivem ao período sem uso e são reativadas quando A retorna, sem recriar.
- **Ganho de função e mimetismo:** exigem um consumidor das unidades (ação ou outro nível). Ficam para F2/C, registrados como critérios futuros.
- **Alocação por excitabilidade** (quem entra no engrama é o neurônio relativamente mais excitável) é **informação de projeto do MCM** (F1.1), não critério.

## 5. Limites da analogia
Os estudos de engrama medem memória comportamental (medo, contexto) em animais. O nosso "conteúdo" é uma variável física de episódios e não há comportamento na Fase 1. Usamos a **lógica dos controles**, não os números. A forma exata do cálculo de acaso varia entre estudos e eu não confirmei uma fórmula única.

## Referências (verificadas quanto à existência; leitura indicada)
- Han, J.-H. et al. (2009). Selective erasure of a fear memory. *Science* 323(5920), 1492–1496. https://doi.org/10.1126/science.1164139 (resumo lido)
- Josselyn, S. A., Köhler, S., e Frankland, P. W. (2015). Finding the engram. *Nature Reviews Neuroscience* 16, 521–534. https://doi.org/10.1038/nrn4000 (texto integral não lido)
- Josselyn, S. A., e Tonegawa, S. (2020). Memory engrams: Recalling the past and imagining the future. *Science* 367(6473), eaaw4325. https://doi.org/10.1126/science.aaw4325 — texto integral na PMC: https://pmc.ncbi.nlm.nih.gov/articles/PMC7577560/ (primeiros 40% lidos)
- Kriegeskorte, N., e Douglas, P. K. (2019). Interpreting encoding and decoding models. *Current Opinion in Neurobiology* 55, 167–179. https://doi.org/10.1016/j.conb.2019.04.002 (resumo lido)
- Panzeri, S., Senatore, R., Montemurro, M. A., e Petersen, R. S. (2007). Correcting for the sampling bias problem in spike train information measures. *Journal of Neurophysiology* 98(3), 1064–1072. https://doi.org/10.1152/jn.00559.2007 (resumo lido)
- Reijmers, L. G., Perkins, B. L., Matsuo, N., e Mayford, M. (2007). Localization of a stable neural correlate of associative memory. *Science* 317(5842), 1230–1233. https://doi.org/10.1126/science.1143839 (resumo lido)

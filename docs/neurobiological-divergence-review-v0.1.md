# Revisão: regras de malha que divergem da literatura neurobiológica

**Data:** 09/11/2026. **Regra do responsável:** preferir sempre a solução mais próxima do substrato neurobiológico. **Escopo:** as regras listadas no inventário de regras de malha (malha do TEMPO, implementada; motor constitutivo mínimo, proposto). **Leitura das fontes:** resumos e registros, salvo indicação. Onde marco "a verificar", não encontrei fonte nesta sessão.

**Motivações possíveis:** *engenharia* (simplicidade, custo, auditoria), *lógica do critério* (a regra existe para que um teste seja possível ou significativo), *inferência do mecanismo representacional* (derivada da CLEAR ou de achado nosso), *segurança*.

**Contexto do TEMPO:** a pergunta do TEMPO é a organização funcional **mínima e independente de substrato** que constitui relações temporotopológicas (README do repositório TEMPO). Divergências do cérebro ali podem ser deliberadas: o objetivo é o mínimo suficiente, não a cópia do cérebro.

## 1. Divergências

| Regra | Malha | O que a literatura mostra | Origem da regra | Motivação | Alternativa mais próxima do cérebro |
|---|---|---|---|---|---|
| **Ausência de decaimento passivo das ligações** | TEMPO | A potenciação inicial decai em horas se não for capturada (marcação sináptica, Frey e Morris, 1997); o escalonamento homeostático ajusta todas as sinapses de um neurônio conforme a atividade (Turrigiano et al., 1998) | Programa TEMPO | **Não documentada.** Minha leitura: minimalidade; a persistência do teste de constituição é obtida pela consolidação | Decaimento da forma provisória, interrompido pela consolidação (marcação e captura) |
| **Teto de peso acima do limiar** (uma ligação consolidada basta para disparar o alvo) | TEMPO | Mesmo na sinapse mais forte conhecida (fibra musgosa → CA3), um disparo isolado em geral **não** dispara o alvo; trens de disparos sim (Henze, Wittner e Buzsáki, 2002) | Programa TEMPO | **Lógica do critério:** o item 2 do teste de constituição exige que "ativar i sozinho alcance j" | Variante conjuntiva (teto abaixo do limiar), que o próprio TEMPO já usa no protocolo do detector conjuntivo |
| **Ajuste rápido de latência a cada evento** | TEMPO; motor proposto (ajuste de atraso) | Há plasticidade de atraso por mielinização dependente de atividade, que altera a velocidade de condução (Fields, 2015), mas em escala lenta | Programa TEMPO (termos de Eurich et al., 2000) | Inferência do mecanismo (a latência deve refletir o intervalo vivido) + engenharia (execuções curtas) | Ajuste lento de atraso combinado com **seleção** de atrasos já existentes |
| **Janela de coatividade de 120 ms** | TEMPO | Janela clássica da plasticidade por tempo de disparo ≈ 20 ms (Bi e Poo, 1998); plasticidade em escala comportamental chega a segundos (Bittner et al., 2017) | Programa TEMPO | Engenharia/parâmetro: a janela precisa ser 2–3 × o intervalo a discriminar (resultado do próprio TEMPO) | Não é contra o princípio; manter como parâmetro, com o traço multiescala no motor proposto |
| **Ausência de inibição** | ambas | A alocação aos engramas é competitiva (Rashid et al., 2016); revisão do grupo Josselyn atribui a interneurônios inibitórios a amplificação das diferenças de excitabilidade e o controle da esparsidade (citado em revisão; primário a verificar) | ausência não justificada | **Não documentada** | Competição local por inibição na alocação |
| **Ausência de homeostase** | ambas | Escalonamento homeostático (Turrigiano et al., 1998) | ausência não justificada | **Não documentada** | Escalonamento lento da excitabilidade ou dos pesos por unidade |
| **Criação de unidades novas (nós)** | motor proposto | No adulto, a criação de neurônios é restrita e contestada em humanos (Sorrells et al., 2018 × Boldrini et al., 2018). Novas memórias **recrutam** neurônios existentes, alocados por excitabilidade relativa (Josselyn e Tonegawa, 2020; Rashid et al., 2016) | Proposta nossa, adotada da literatura de inteligência artificial (rede que cresce quando necessário; ressonância adaptativa) | Inferência do mecanismo (CLEAR: constituir quando a organização existente não acomoda) + engenharia (auditoria: começar com 0 unidades e registrar a origem de cada uma) | **Recrutamento em substrato fixo:** unidade = conjunto alocado de elementos preexistentes, por excitabilidade relativa (variante "assembleias sobre substrato", já prevista) |
| **Recursão sem camadas predefinidas** | motor proposto | O córtex tem hierarquia anatomicamente predefinida (Felleman e Van Essen, 1991) | Proposta nossa | **Lógica, aplicada além do necessário:** a neutralidade proíbe fixar *conteúdo*, não *arquitetura* | Níveis ou áreas predefinidos sem conteúdo; o conteúdo continua constituído |
| **Canais sem vizinhança espacial** (identificadores opacos) | mundos e motor | O cérebro tem mapas topográficos formados no desenvolvimento (a verificar nesta sessão) | Proposta nossa | **Lógica do teste de autonomia:** mostrar que a estrutura vem do mundo | Variante com vizinhança anatômica dada (sem conteúdo), comparada à opaca. Ligada à hipótese de organização do domínio do responsável |
| **Magnitude omitida** (incidência binária) | motor proposto | A taxa de disparo importa: mais disparos aumentam a probabilidade e reduzem o atraso da resposta (Henze et al., 2002) | Proposta nossa | Engenharia | Incidências com intensidade ou trens, como variante |
| **Manutenção de plasticidade por reinicialização** | motor proposto (sugestão) | Origem em aprendizado contínuo artificial (Dohare et al., 2024), não em neurobiologia; análogo biológico não verificado | Literatura de inteligência artificial | Engenharia | A verificar (neurogênese ou recrutamento de elementos ociosos) |
| **Revisão seletiva** (nova unidade, antiga preservada) | motor proposto | **Misto.** A extinção forma memória nova e não apaga a original (Bouton, via fontes secundárias); a reconsolidação mostra que a memória reativada pode ser modificada (Nader, Schafe e LeDoux, 2000, via fontes secundárias) | Inferência nossa (CLEAR) | Inferência do mecanismo | Duas vias: revisão seletiva para contradição persistente; modificação durante a reativação para ajuste fino |
| **Ausência de neuromodulação** | ambas | Plasticidade cerebral é modulada por sinais de valor e novidade (a verificar) | ausência deliberada | **Segurança:** valor externo é o risco de valia registrado no programa | Manter ausente até a fase de valia, por decisão do responsável |

## 2. Regras coerentes com a literatura

| Regra | Apoio |
|---|---|
| Depressão por ordem inversa | Bi e Poo (1998): disparo pós antes do pré deprime |
| Reforço com limite suave (mais fraco quando o peso já é alto) | Bi e Poo (1998): a potenciação ocorre sobretudo em sinapses inicialmente fracas |
| Poda por peso mínimo; variação e seleção | Eliminação de sinapses fracas no desenvolvimento (a verificar a fonte) |
| Integração com vazamento, limiar e período refratário | Modelo padrão de neurônio |
| Traço multiescala | Bittner et al. (2017) para segundos; marcação sináptica para horas (Frey e Morris, 1997) |
| Coincidência conjuntiva entre fontes | Variante conjuntiva do TEMPO; coerente com a falha de entradas isoladas (Henze et al., 2002) |
| Consolidação por recorrência | Passagem da potenciação inicial à tardia (Frey e Morris, 1997) |
| Alocação por excitabilidade relativa (candidata) | Josselyn e Tonegawa (2020); Rashid et al. (2016) |

## 3. Leitura geral
- **TEMPO:** as duas divergências fortes (sem decaimento; uma ligação basta) servem a um teste de **mínimo suficiente**. Não são erro. Mas não devem ser herdadas pelo motor constitutivo, cujo critério é ficar perto do substrato.
- **Motor proposto:** a divergência mais importante é **criar unidades novas**. Recrutar em substrato fixo é a forma neurobiológica e já estava prevista como variante. A troca afeta o critério de registro de origem: passa a ser registro de **alocação** (quais elementos, por quais incidências).
- **Ausências não justificadas:** inibição e homeostase. Ambas existem no cérebro e ambas atuam na alocação e na estabilidade.
- **Decisões que cabem ao responsável:** trocar criação por recrutamento; incluir inibição e homeostase; dar arquitetura de níveis predefinida; testar vizinhança anatômica.

## 4. Reavaliação pela metodologia do programa (equivalências propostas)
A [metodologia](program-methodology.md) admite divergir do cérebro só com **simplificação agnóstica de substrato justificada**: mecanismo entendido, equivalência proposta e perdas declaradas. Todas as equivalências abaixo são **propostas minhas**, a aprovar.

| Divergência | Mecanismo e função no cérebro | Equivalência proposta | O que se perde (testável) | Situação |
|---|---|---|---|---|
| Uma ligação basta para disparar o alvo (TEMPO) | Disparo exige convergência de muitas entradas; função: robustez e detecção de coincidência | **Nó = grupo de neurônios; ligação = projeção entre grupos.** Uma ligação consolidada equivale a muitas sinapses coincidentes. O próprio TEMPO apoia essa leitura: seu resultado das cadeias mostra grupos com limiar que convergem a ~0,5 ms de dispersão | Variabilidade dentro do grupo; recrutamento parcial. Teste: variante conjuntiva (teto abaixo do limiar) | **Justificável**, desde que a leitura em grupos seja declarada |
| Ausência de decaimento das ligações (TEMPO) | Potenciação provisória decai, salvo se capturada (marcação e captura); função: esquecer o não confirmado e evitar saturação | Parcial: o enfraquecimento por desencontro e a ordem inversa removem ligações **contrariadas**, não as **não usadas**; o limite de grau impede a saturação estrutural | Esquecimento por desuso. Teste: execuções longas com ligações espúrias que nunca são contrariadas | **Justificável só no escopo do TEMPO** (constituição de uma relação); **não** para o motor constitutivo |
| Criar unidades novas (motor) | Alocação de neurônios existentes por excitabilidade relativa, em competição; memórias próximas no tempo compartilham neurônios e ficam ligadas (Rashid et al., 2016) | **Criar = recrutar um elemento ocioso de um conjunto grande**, sem conteúdo prévio. Equivalente quando o conjunto é amplo e a escolha é indiferente | (i) competição; (ii) **ligação por sobreposição** entre memórias próximas no tempo; (iii) capacidade finita. Teste: variante com substrato finito e alocação por excitabilidade recente | **Justificável como simplificação**, se (i)–(iii) forem declaradas ou implementadas; (ii) parece relevante para entidade e evento |
| Recursão sem níveis predefinidos (motor) | Hierarquia anatômica dada pelo desenvolvimento; função: restringir quem se comunica com quem | **Não é simplificação:** remover a restrição aumenta a busca. A neutralidade proíbe fixar conteúdo, não arquitetura | — | **Não justificada** pela metodologia; níveis predefinidos sem conteúdo seriam mais próximos do cérebro **e** mais simples |
| Canais sem vizinhança espacial | Mapas topográficos formados no desenvolvimento | Não é simplificação; é **controle experimental** do teste de autonomia | — | Manter como controle, ao lado de uma condição com vizinhança |
| Ausência de inibição (ambos) | Competição e esparsidade na alocação | Parcial: a criação por não acomodação age como "vencedor leva tudo" **na criação** (só uma unidade recebe o conteúdo). Na resposta, várias unidades podem disparar | Competição na resposta e na alocação. Teste: variante com inibição lateral | **Parcialmente justificável**; falta equivalente na resposta |
| Ausência de homeostase (ambos) | Escalonamento que mantém a atividade numa faixa | Parcial: o período refratário limita a taxa do nó; o orçamento limita a criação. Nada ajusta a excitabilidade | Estabilidade em execuções longas. Teste: execuções de vários dias | **Não justificada** ainda |
| Ajuste rápido de latência | Mielinização dependente de atividade, lenta | **Compressão do tempo**: equivalente se a **ordem** das escalas for preservada (ajuste de latência mais lento que o de peso) | No TEMPO a ordem não é preservada (mesma taxa). Teste: taxa de latência menor que a de peso | **Justificável** se a ordem das escalas for respeitada |
| Intensidade omitida (incidência binária) | Taxa e trens de disparos codificam intensidade | **Bancos de limiares** = recrutamento de receptores com sensibilidades diferentes (codificação por população); incidência = evento discreto | Codificação temporal fina dentro de um trem | **Justificável** quando há bancos de limiares |
| Janela de 120 ms | Janela clássica ≈ 20 ms; escalas de segundos também existem | Parâmetro de escala, não mecanismo | — | **Justificável** |
| Ausência de neuromodulação | Plasticidade modulada por valor e novidade | Não é simplificação; é **decisão de segurança** | — | Registrada como decisão do responsável |

## Referências (verificadas quanto à existência)
- Bi, G., e Poo, M. (1998). *Journal of Neuroscience* 18(24), 10464–10472.
- Bittner, K. C. et al. (2017). *Science* 357, 1033–1036.
- Boldrini, M. et al. (2018). Human hippocampal neurogenesis persists throughout aging. *Cell Stem Cell* 22, 589–599.
- Felleman, D. J., e Van Essen, D. C. (1991). *Cerebral Cortex* 1(1), 1–47. https://doi.org/10.1093/cercor/1.1.1
- Fields, R. D. (2015). *Nature Reviews Neuroscience* 16(12), 756–767. https://doi.org/10.1038/nrn4023
- Frey, U., e Morris, R. G. M. (1997). *Nature* 385, 533–536. https://doi.org/10.1038/385533a0
- Henze, D. A., Wittner, L., e Buzsáki, G. (2002). *Nature Neuroscience* 5(8), 790–795.
- Josselyn, S. A., e Tonegawa, S. (2020). *Science* 367, eaaw4325.
- Rashid, A. J. et al. (2016). Competition between engrams influences fear memory formation and recall. *Science* 353, 383–387.
- Sorrells, S. F. et al. (2018). *Nature* 555, 377–381.
- Turrigiano, G. G. et al. (1998). *Nature* 391, 892–896. https://doi.org/10.1038/36103
- Bouton (extinção) e Nader, Schafe e LeDoux (2000, *Nature*, reconsolidação): **lidos só por citações secundárias**.
- Eurich et al. (2000): citado no README do TEMPO; não conferido nesta sessão.

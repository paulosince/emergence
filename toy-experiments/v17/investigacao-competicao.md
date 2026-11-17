# V0.17 — Investigação: como ramos vizinhos (e cópias da mesma relação) competem

**Pedido do responsável:** 17/11/2026, segunda parte do "os dois, em ordem", depois do [diagnóstico do disparo](ensaio-minimo/resultados.md): a força vai para a região da relação verdadeira em 10 de 10 sementes, mas fica dividida entre vizinhos e entre cópias da relação em atrasos diferentes, e a Uint quase não dispara.
**Redação:** assistente (Claude). **Estatuto:** primeira passada; nada aqui é decisão.
**Legenda:** [L] literatura (com o que foi lido); [A] inferência ou proposta do assistente.
**Como foi lido:** WebFetch (extração feita por um modelo auxiliar, não texto cru) e trechos de busca.

## 1. Achados

### 1.1 A competição clássica depende do disparo [L]
- **Song, Miller e Abbott 2000** (texto integral, via extração): o ajuste depende do intervalo entre a chegada e o **disparo** do neurônio. O que chega **antes** do disparo se fortalece; o que chega **depois** se enfraquece. As sinapses competem pelo controle do momento do disparo. Ganham as entradas de **latência curta** e os grupos que chegam juntos.
- O enfraquecimento é um pouco maior que o fortalecimento (**1,05 vez**); com isso, coincidências por acaso dão saldo negativo. (É a origem do nosso 1,05 × ganho.)
- **Não precisa de restrição global** da soma das forças; só de um teto por sinapse. A distribuição final é **bimodal**: a maioria das sinapses vai a zero ou ao máximo.
- **Limite declarado pelos autores:** essa regra **não fortalece nada se o neurônio não dispara**. Para isso, eles sugerem um mecanismo não hebbiano, como a escala sináptica.

### 1.2 Seleção de atrasos certos: há precedente direto [L]
- **Gerstner, Kempter, van Hemmen e Wagner 1996** (só o **resumo**): num modelo de neurônio do núcleo laminar da coruja, uma regra hebbiana não supervisionada **seleciona, entre axônios com atrasos aleatórios, as conexões com atrasos que combinam**, e escolhe os atrasos certos de dois grupos independentes (orelha esquerda e direita). Não vi a regra em detalhe (janela, normalização, se o neurônio precisa disparar).

### 1.3 Competição pós-sináptica por recursos [L]
- **Triesch, Vo e Hafner 2018** (resumo e trechos): sinapses vizinhas **competem por receptores de um estoque local do dendrito**; isso produz uma normalização multiplicativa que mantém constante a soma das forças, e uma plasticidade em sinapses não ativas.
- **Chistiakova et al. 2015** (revisão; resumo): a plasticidade **heterossináptica** (em sinapses que não estavam ativas, depois de atividade pós-sináptica forte) ajuda a dar estabilidade e competição.

### 1.4 Ajuste do próprio atraso [L]
- A mielina pode ser ajustada pela atividade, mudando a velocidade de condução e o momento de chegada; isso é proposto como mecanismo para sincronizar chegadas (Fields 2015, opinião; Pajevic, Basser e Fields 2014; modelo em eLife 2023). Um desses modelos usa os **instantes de chegada** como sinal de retorno (resumo e trechos; confiança média).

## 2. O que isso diz para o modelo [A]

1. **A nossa conservação está do lado errado?** Hoje, a força total conservada é **por Upro** (o axônio divide a sua força entre os ramos). Na literatura lida, a competição por recursos é **pós-sináptica**: sinapses vizinhas **no mesmo dendrito** dividem um estoque (Triesch 2018). Isso não prova que a conservação por Upro esteja errada, mas não achei apoio para ela.
2. **O que desempata os vizinhos, na biologia, é o disparo.** Pela regra de Song 2000, entre vizinhos que coincidem, quem chega **antes** do disparo ganha e quem chega **depois** perde. Hoje, o nosso reforço acontece no **favorecimento** (soma ≥ 0,3), sem relação com o disparo; por isso os vizinhos empatam.
3. **Há um ovo e a galinha:** a regra ligada ao disparo não funciona se a Uint não dispara (limite dos próprios autores). E a nossa Uint dispara muito **sem** brotamento (~2.000 vezes) e quase nada **com** ele. Uma combinação possível: o reforço no favorecimento como fase inicial (não hebbiana), e a competição ligada ao disparo quando ele aparece.
4. **As cópias da relação em atrasos diferentes** não se resolvem por desempate fino: chegam a milissegundos de distância. Na biologia, pares de atrasos diferentes ficam em neurônios diferentes. Nas 384 vias, isso seria trabalho da Pcrt (constituir Uint diferentes), não da competição dentro de uma Uint.
5. **Precedente que limita a novidade:** "uma regra local seleciona os atrasos certos de duas orelhas a partir de atrasos variados" **já existe** (Gerstner et al. 1996). O que pode ser nosso é outra coisa: a construção gradual por exuberância e poda, com custo guiado por incidências, e a separação entre a dinâmica do Sdom, a avaliação na Uint e a Pcrt.
6. **Contra a nossa regra de brotamento:** se a mielina ajusta o atraso usando o instante de chegada como retorno, a biologia **usaria** a direção do erro, ao contrário da nossa regra de que o brotamento não usa o tamanho nem o sinal do erro. Evidência fraca (modelos e opinião), mas fica registrada.

## 3. Opções para o responsável (nenhuma decidida)
- **(a)** Competição ligada ao disparo, como em Song 2000: chegada antes do disparo fortalece, depois enfraquece (1,05×), mantendo o reforço no favorecimento enquanto a Uint não dispara.
- **(b)** Mover a conservação da força para o lado da Uint (os ramos que chegam à mesma Uint dividem um estoque), como em Triesch 2018.
- **(c)** Deixar as cópias para a Pcrt nas 384 vias e, no par de vias, medir só a competição entre vizinhos colados.
- **(d)** Ler o texto integral de Gerstner 1996 antes de propor qualquer regra.

## 4. Fontes (estado de leitura)

| Fonte | Link | Leitura |
|---|---|---|
| Song, S., Miller, K. D. e Abbott, L. F. (2000). *Competitive Hebbian learning through spike-timing-dependent synaptic plasticity.* Nat Neurosci 3:919–926. | https://www.dam.brown.edu/people/elie/NEUR_1680_2012/Song_Miller_Abbott_2000.pdf | integral, via extração |
| Gerstner, W., Kempter, R., van Hemmen, J. L. e Wagner, H. (1996). *A neuronal learning rule for sub-millisecond temporal coding.* Nature 383:76–78. | https://infoscience.epfl.ch/record/97773?ln=en | resumo (há PDF em acesso aberto, não aberto) |
| Triesch, J., Vo, A. D. e Hafner, A.-S. (2018). *Competition for synaptic building blocks shapes synaptic plasticity.* eLife 7:e37836. | https://elifesciences.org/articles/37836 | resumo e trechos |
| Chistiakova, M. et al. (2015). *Homeostatic role of heterosynaptic plasticity: models and experiments.* Front Comput Neurosci 9:89. | https://www.frontiersin.org/articles/10.3389/fncom.2015.00089/full | resumo e trechos |
| Fields, R. D. (2015). *A new mechanism of nervous system plasticity: activity-dependent myelination.* Nat Rev Neurosci. | https://pmc.ncbi.nlm.nih.gov/articles/PMC6310485 | trechos da busca |
| Pajevic, S., Basser, P. J. e Fields, R. D. (2014). *Role of myelin plasticity in oscillations and synchrony of neuronal activity.* Neuroscience. | https://pubmed.ncbi.nlm.nih.gov/24291730/ | trechos da busca |
| *Oligodendrocyte-mediated myelin plasticity and its role in neural synchronization* (eLife, 2023). | https://elifesciences.org/articles/81982 | trechos da busca (autores não conferidos) |

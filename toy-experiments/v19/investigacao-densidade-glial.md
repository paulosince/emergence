# V0.19 — Investigação: densidade glial pela capacidade do hardware (a cóclea)

**Data:** 22/11/2026. **Pedido do responsável:** "Pesquisemos a densidade por capacidade de hardware, no nosso caso, nossa cóclea." **Redação:** assistente (Claude).
**Marcas:** [R] responsável; [L] literatura (grau de leitura indicado); [A] proposta do assistente, a aprovar; [M] medido.
**Contexto [R, 22/11]:** glias iniciais perto das Utrd, multiplicando-se localmente por carga; a criação das Upros onde as incidências falham passa a ser tarefa glial.

## 1. O hardware que temos [M, V0.18]

- 64 faixas (Cpro) por ouvido; **21.731 pontos transdutivos por ouvido** (média ~340 por Cpro, com o perfil humano: mais no meio da cóclea).
- Comparação humana: ~33.700 neurônios do gânglio espiral na primeira década de vida, caindo ~100 por ano (Makary et al. 2011, resumo e tabela); 41.643 por estereologia em cinco adultos normais (Ishiyama et al. 2001, via relatório do registro de ossos temporais). Nosso hardware fica em ~52–65% do humano, coerente com a regra "abaixo do humano, nunca acima" [R, 18/11].

## 2. O que o modelo neurobiológico mostra

| Achado | Número | Fonte e leitura | Confiança |
|---|---|---|---|
| Glia periférica no gânglio espiral | Corpo de cada neurônio tipo I envolto por células satélites que fazem algumas camadas de mielina; em geral **uma** célula satélite por corpo no gânglio espiral (legenda geral, não específica de humanos) | Revisão de células satélites (2025), texto por extração parcial | média |
| Regra geral das células satélites | **1 a mais de 20 por corpo de neurônio, proporcional ao tamanho do corpo**: a razão fica constante; cresce com a idade; humanos têm mais que camundongos | Mesma revisão (Pannese 1960, 1981, 2010; Avraham et al. 2022) | média-alta |
| Três tipos de glia periférica na cóclea | Envolvem ou mielinizam os três domínios do neurônio: processos centrais (nervo coclear), corpos (gânglio espiral) e processos periféricos | Locher et al. 2014 (cóclea fetal humana), resumo | alta |
| Fronteira periférico–central | Zona de transição no nervo coclear, dentro do modíolo, no nível do giro basal (camundongo) | Wang et al. 2013, resumo | média |
| Território de um astrócito (córtex, camundongo) | Envolve em média **4 corpos de neurônios** (até 8) e contata **300–600 dendritos**; ~20.000–160.000 sinapses | Halassa et al. 2007, resumo; figura de revisão de 2017 | média |
| Territórios exclusivos | Astrócitos protoplasmáticos ocupam territórios em grande parte exclusivos; um astrócito do hipocampo contata mais de 100.000 sinapses | Bushong et al. 2002, resumo e citação em Halassa et al. 2007 | alta |
| Razão glia:neurônio | ~1:1 no cérebro humano inteiro, mas varia muito por região (mais alta no tronco encefálico e na medula: 5,6–7,1 na medula) | von Bartheld et al. 2016; validação do fracionador isotrópico, resumos | média |

**Não encontrado:** uma contagem de astrócitos por neurônio, ou por fibra que chega, no **núcleo coclear** (a primeira estação central, onde as fibras do nervo terminam). As buscas acharam só estudos de reação glial a lesões. Isso fica como pendência de leitura.

## 3. Leitura [A]

1. **A regra mais robusta do modelo neurobiológico é a proporcionalidade:** o número de glias acompanha o tamanho do que elas servem (células satélites ∝ tamanho do corpo; território ∝ quantidade de elementos). Traduzido para o nosso hardware: **glias iniciais por Cpro proporcionais à capacidade do Cpro** (quantos pontos transdutivos ele tem), e não um número igual por faixa.
2. **Falta escolher a constante** (quantos pontos por glia). Duas referências:
   - densidade periférica: ~1 glia por neurônio (células satélites);
   - densidade de território central: ~1 astrócito por ~4 corpos de neurônios (córtex de camundongo; adaptação declarada).
3. Pela regra do responsável, o número fica **no máximo** no humano; a multiplicação local por carga ajusta o resto.

## 4. Decisões que faltam ao responsável

1. Proporcionalidade à capacidade de cada Cpro (sim / não).
2. A constante inicial (densidade periférica, densidade de território central, ou o mínimo — uma por Cpro — deixando a divisão por carga fazer o resto).

## Referências (completas)

- Bushong, E. A., Martone, M. E., Jones, Y. Z., e Ellisman, M. H. (2002). Protoplasmic astrocytes in CA1 stratum radiatum occupy separate anatomical domains. *J Neurosci* 22(1), 183–192. doi:10.1523/JNEUROSCI.22-01-00183.2002.
- Halassa, M. M., Fellin, T., Takano, H., Dong, J.-H., e Haydon, P. G. (2007). Synaptic islands defined by the territory of a single astrocyte. *J Neurosci* 27(24), 6473–6477. doi:10.1523/JNEUROSCI.1419-07.2007.
- Ishiyama, A., et al. (2001). Unbiased stereological quantification of neurons in the human spiral ganglion. *Neurosci Lett* 304(1–2), 93–96.
- Locher, H., et al. (2014). Distribution and development of peripheral glial cells in the human fetal cochlea. *PLoS ONE* 9(1), e88066. doi:10.1371/journal.pone.0088066.
- Makary, C. A., Shin, J., Kujawa, S. G., Liberman, M. C., e Merchant, S. N. (2011). Age-related primary cochlear neuronal degeneration in human temporal bones. *J Assoc Res Otolaryngol* 12(6), 711–717. doi:10.1007/s10162-011-0283-2.
- von Bartheld, C. S., Bahney, J., e Herculano-Houzel, S. (2016). The search for true numbers of neurons and glial cells in the human brain: a review of 150 years of cell counting. *J Comp Neurol* 524(18), 3865–3895. doi:10.1002/cne.24040.
- Wang, J., Zhang, B., Jiang, H., et al., e Hu, Z. (2013). Myelination of the postnatal mouse cochlear nerve at the peripheral–central nervous system transitional zone. *Front Pediatr* 1, 43. doi:10.3389/fped.2013.00043.
- Revisão de células satélites (2025): "Satellite glial cells: shaping peripheral input into the brain-body axis?" *Neuron* (PMC12288756; autoria não conferida nesta rodada).

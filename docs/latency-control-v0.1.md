# P0.1 — Controle de latências no controle TEMPO de nós fixos (sala) — v0.1

**Data:** 09/11/2026 · **Script:** `experiments/latency-control.js` · **Teste:** `tests/latency-control.test.js`

## Pergunta
As 7 relações formadas pelo controle TEMPO de nós fixos na sala refletem a estrutura do mundo ou as latências fixas dos transdutores (r0 200, r1 300, r2 200, r3 400, r4 400, r5 100 ms)?

## Previsões
| Manipulação | Artefato de instrumento | Estrutura do mundo |
|---|---|---|
| Latências iguais | relações somem | relações persistem |
| Latências permutadas | direções seguem a nova ordem de latência | padrão mantido |
| Mundos diferentes, latências fixas | padrão invariante | padrão muda |

## Resultados (semente 42; latências iguais e originais repetidas com 6 sementes)
- **Latências iguais (100, 250 e 400 ms):** 0 relações nos três casos. Em 6 sementes (1, 2, 3, 7, 99, 2026): 0 relações em todas.
- **Latências permutadas (5 rotações):** 7 a 9 relações; **100%** das relações dirigidas vão do canal mais rápido para o mais lento; sobreposição com o padrão original de 0,00 a 0,23 (Jaccard).
- **12 mundos** (3 datas × 2 climas × objeto presente/ausente) com as latências originais: padrão **idêntico** ao original em 12/12, e 100% das relações seguem a ordem de latência.
- A única variação entre sementes é a direção entre r3 e r4, que têm a mesma latência (400 ms).

## Conclusão
Hipótese de artefato de instrumento **confirmada** dentro deste cenário: as relações temporotopológicas formadas pelo controle TEMPO na sala têm como conteúdo a assinatura temporal dos canais de transdução, não processos do mundo. Coerente com o critério N5 e com a recalibração de defasagens constantes (Fujisaki et al. 2004).

## Implicações para o MCM
- Relações invariantes entre condições do mundo devem ser atribuídas à via de transdução (N5). O critério D3 da etapa 9 exige covariância com o referente, não com os canais.
- A escala do TEMPO (janela de 120 ms) não alcança os processos da sala (minutos e horas): a única estrutura sub-120 ms disponível é a latência dos instrumentos (N4).

## Limites
Um cenário (sala), um mecanismo (TEMPO com nós fixos, modo `shift`, K = 4, η = 0,2) e transdutores sem ruído. Não generaliza para o MCM nem para outros mundos.

## Literatura: o problema é conhecido, sob vários nomes (busca de 09/11/2026; leitura de resumos e registros)

| Área | Achado | Referência |
|---|---|---|
| Conectividade cerebral (fMRI) | Granger aplicado a fMRI falha porque o atraso hemodinâmico difere entre regiões; o "motor" só foi identificado depois de modelar e remover a hemodinâmica. Uma região que influencia outra, mas tem resposta hemodinâmica mais lenta, pode aparecer com a direção invertida | David et al. 2008 (PLoS Biol.); Smith et al. 2011 (NeuroImage); objeção de Deshpande et al. 2010 |
| Descoberta causal | A amostragem do processo de medida faz o Granger falhar; identificabilidade só sob hipóteses adicionais | Gong et al. 2015 (ICML) |
| Plasticidade por tempo de disparo | O STDP concentra peso nas aferências que chegam primeiro: transforma latência em peso por si só | Guyonneau, VanRullen e Thorpe 2005 (Neural Comput.) |
| Percepção | Atributos com latências de processamento diferentes são percebidos fora de sincronia (cor cerca de 100 ms antes de movimento), efeito contestado por manipulações de estímulo | Moutoussis e Zeki 1997 (Proc. R. Soc. B) |
| Compensação biológica | Constância de simultaneidade; recalibração de defasagens constantes; recalibração motor-sensorial que chega a inverter a ordem percebida; visão calibrando a audição no desenvolvimento; seleção de atrasos por aprendizagem hebbiana | Kopinska e Harris 2004; Fujisaki et al. 2004; Stetson et al. 2006 (Neuron); Knudsen e Knudsen 1989 (J. Neurosci.); Gerstner et al. 1996 (Nature) |
| Robótica | Calibração temporal entre sensores: o deslocamento é estimado como variável de estado, com análise de identificabilidade; exige excitação por movimento | Furgale, Rehder e Siegwart 2013 (IROS, Kalibr); Li e Mourikis 2014 (IJRR) |
| Filosofia | Não confundir o tempo do representar com o tempo representado | Dennett e Kinsbourne 1992 (BBS) |

**Analogia mais próxima:** o caso do fMRI. Lá a direção inferida segue o instrumento mais rápido, exatamente como aqui (100% das relações do canal mais rápido para o mais lento).

**Não encontrado:** um sistema auto-organizado que constitui relações temporais **como conteúdo** e absorve a latência do instrumento como conteúdo, discutido explicitamente. Não encontrar não significa que não exista.

**Implicação teórica para a CLEAR:** a tese de que tempos de chegada e integração participam do conteúdo precisa distinguir o tempo do veículo (inclui a latência da via) do tempo do referente. Proposta de critério: o conteúdo temporal só é ancorado se covaria com condições do referente que variam de forma independente; o tempo invariante entre condições pertence à via.

**Soluções candidatas para o MCM:**
1. Recalibração de defasagens constantes (regra neutra quanto ao conteúdo).
2. Calibração cruzada entre modalidades.
3. Calibração pela ação, com cópia eferente.
4. Seleção de atrasos.

**Ambiguidade de fundo:** um atraso constante do mundo é indistinguível de uma latência de instrumento sem variação ou intervenção. Isso reforça N2 e a hipótese concorrente H-AÇÃO (seção 11.1 do desenho de pesquisa).

---
title: "EMERGENCE V0.17 — Pré-experimento (Etapa I)"
subtitle: "Matemática multidimensional transdutiva: uma Pcrt de construção gradual — modalidade sonora"
author: "Responsável: Paulo Rogério da Silva · Redação, deduções e levantamento bibliográfico: assistente (Claude)"
date: "16/11/2026 — RASCUNHO v0.1, NÃO CONGELADO"
lang: pt-BR
---

# Estado deste documento

- **Etapa:** I (pré-experimento) do ciclo obrigatório da [metodologia](../../docs/program-methodology.md).
- **Estado:** **rascunho para revisão do responsável.** Nada aqui autoriza implementação. As decisões já tomadas estão em [decisões em construção](decisoes-em-construcao.md); as que faltam estão na seção 6, com recomendação do assistente.
- **Antes de congelar:** executar o **ensaio mínimo do mecanismo** (seção 5.4), lição 5 da V0.15 ("os dois achados teriam aparecido em minutos").
- **Escopo:** somente som (decisão do responsável, 16/11/2026).

## Legenda de estatuto

| Marca | Significado |
|---|---|
| **[R]** | Decisão ou hipótese do responsável |
| **[A]** | Dedução ou proposta do assistente (não aprovada, salvo indicação) |
| **[L]** | Resultado da literatura, com o que foi efetivamente lido |
| **[P]** | Regra já aprovada no programa |
| **[C]** | Fato verificado no código ou nos resultados de versões anteriores |

## Leitura rápida (linguagem simples)

1. **O que deu errado antes.** Na V0.15, a Pcrt criava uma Uint pronta, com 16 candidatas de força total, e o sistema explodiu na primeira apresentação. Na V0.16, a diferença que se queria testar nem chegava às Utrd.
2. **A ideia que testamos.** Uma só Pcrt, que trabalha sobre o que falhou, cria estrutura **fraca e provisória**, deixa o mundo selecionar, e só consolida o que **acerta de novo**. Nenhum tipo de convergência é programado. As dimensões (entre sensores, entre faixas, no tempo, por recrutamento) devem aparecer porque a transdução as faz variar.
3. **O que o experimento pode mostrar.** Que a construção gradual não explode; que o que é estável no mundo consolida e o que é instável não; e que convergências de tipos diferentes surgem pela mesma regra.
4. **O que ele não pode mostrar.** Que isso já é representação no sentido da tríade CLEAR, nem que é o mecanismo do cérebro.

# 1. Erros identificados nas versões anteriores

## 1.1 Erros demonstrados

| # | Erro | Versão | Estatuto |
|---|---|---|---|
| E1 | Candidatas de **peso cheio** na mesma Uint, com "a chegada mais recente substitui", tornam a coincidência quase sempre presente sob entrada periódica: a Uint dispara a 977/s (teto de 1.000/s) e o crédito se espalha por igual entre as candidatas | V0.15 | [C] resultados, achado 1 |
| E2 | A Pcrt reconstituía o mesmo par: até 15 Uint no mesmo par em 150 ms; 1.555 pares em 150 ms com 42 vias ativas; limite de 5.000 Uint atingido na 1ª apresentação | V0.15 | [C] |
| E3 | A estrutura nascia pronta: a Uint e as candidatas já participavam com força total no instante da criação. No modelo neurobiológico, a construção é gradual (seção 4.2.3) | V0.15 | [C]+[L] |
| E4 | As três condições produziam resultado idêntico: com 16 × 12 pixels, o caule não ocupava nenhum pixel e as duas câmeras davam a mesma imagem | V0.16 | [C] análise de 15/11/2026 |
| E5 | A origem da regra da Uint era a Utrd, e não a Upro | V0.16 | [C]; correção do responsável em 15/11/2026 |
| E6 | O motor da V0.16 recebia uma malha aleatória de Uint pronta, sem Pcrt | V0.16 | [C] |
| E7 | Implementação da V0.16 sem pré-experimento congelado | V0.16 | [C] |

## 1.2 Limitações e lacunas herdadas

| # | Item | Estatuto |
|---|---|---|
| L1 | Com fases sorteadas por apresentação, o intervalo entre faixas (Y) muda a cada repetição do mesmo som; entre sensores (Z) fica estável (0,292 ms para 0,2915 ms) | [C] V0.15, achado 2 |
| L2 | Reacesso, seletividade e dependência dos atrasos **nunca foram testados** (V0.15 interrompida) | [C] |
| L3 | Convergências temporais (X) ficaram fora da V0.15 (D9) | [C] |
| L4 | A pré-seleção de dimensões pelo observador (classificar Uint como Z, Y, recrutamento) é medida, não mecanismo; deve continuar só no observador | [P] |

# 2. Hipóteses corretivas

**HC1 — Construção gradual.** [R] (16/11/2026)
Problema: E1, E2, E3. A coincidência não gera estrutura pronta; a estrutura vai sendo construída conforme a coincidência se repete. Operacionalmente [A]: a candidata nasce com força pequena, ganha força a cada acerto e some se não acerta. Alternativa: força cheia com poda tudo-ou-nada (V0.15, refutada na prática). Perda possível: se a força inicial for pequena demais, nada chega a acertar e nada se constitui.

**HC2 — A Pcrt trabalha sobre o que falhou.** [R] (15/11/2026)
Insumo: incidências que expiraram sem integração e caminhos favorecidos que não dispararam. Num Sdom virgem, tudo é insumo. Corresponde à criação por não acomodação [P], já decidida pela propagação na V0.15 (HC5 da V0.15).

**HC3 — O laço da Pcrt.** [R] (15/11/2026)
Fixa uma incidência sem integração e testa as outras; depois avança. "As outras" são as incidências com **rastro vivo** (orientação aceita, 15/11/2026).

**HC4 — Coordenação de tempos por exuberância guiada.** [R] (16/11/2026)
A Pcrt não calcula atrasos. Combinação aprovada: (1) a fibra define a faixa de atrasos; (2) poucas candidatas iniciais, espaçadas proporcionalmente; (3) novas candidatas brotam perto das que quase acertaram, com passo proporcional. [A] Para não reintroduzir o cálculo da V0.5, o brotamento **não usa o tamanho nem o sinal do erro**: brota dos dois lados da candidata que quase acertou, e a seleção decide.

**HC5 — Recorrência é a mesma candidata que acerta de novo.** [R] (16/11/2026)
Resolve parte de E1: a V0.15 creditava qualquer candidata presente; aqui só a repetição do acerto **da mesma candidata** a fortalece.

**HC6 — Origem é a Upro.** [R] (15/11/2026)
Corrige E5. Upros diferentes da mesma Utrd são origens distintas.

**HC7 — O mundo seleciona; o estímulo precisa conter as relações.** [R] (16/11/2026)
Corrige E4. Cada relação que se quer ver emergir precisa estar no estímulo e chegar às Utrd; isso é verificado **antes** de executar (seção 9, item 1).

# 3. Hipóteses a validar

## 3.1 Hipótese principal e concorrentes

| Hipótese | Enunciado | Estatuto |
|---|---|---|
| **HM** (multidimensional) | Uma única Pcrt, sem tipo de convergência programado, constitui convergências de tipos diferentes (entre sensores, entre faixas, temporais, por recrutamento) conforme o que a transdução faz variar; e **consolida as relações estáveis no mundo**, não as instáveis | [R] hipótese; operacionalização [A] |
| **H-nula** | A consolidação não depende da estabilidade da relação: relações estáveis e instáveis consolidam igual, ou como no controle por relógio | [A] |
| **H-explosão** | A construção gradual não impede a proliferação: o número de candidatas e Uint cresce sem se estabilizar com a repetição | [A]; é a hipótese que matou a V0.15 |
| **H-aliasing** | Consolidam pares coerentes **módulo o período** do som, e não a relação verdadeira (por exemplo, a diferença entre sensores mais um período) | [A]; deduzida do mecanismo da V0.15 |
| **H1** (herdada) | Na reapresentação, as incidências percorrem as Upro consolidadas e alcançam as mesmas Uint, sem recriação | [C] V0.15; nunca testada |

## 3.2 Observações discriminantes

| Observação | HM | H-nula | H-explosão | H-aliasing |
|---|---|---|---|---|
| Uint entre sensores consolidam com diferença de atraso ≈ diferença de chegada da fonte | sim | talvez | — | consolidam também em Δ ± k·período |
| Uint entre faixas com fases sorteadas | não consolidam (ou muito menos) | consolidam igual | — | — |
| Uint entre faixas com fases fixas (controle) | consolidam | igual ao sorteado | — | — |
| Número de candidatas ao longo das apresentações | sobe e estabiliza | — | sobe sem parar | — |
| Sons de f0 diferentes no mesmo azimute | a relação entre sensores é a mesma; o *aliasing* some | — | — | o *aliasing* muda com f0 |

# 4. Aplicação integral do método

## 4.1 Fenômeno e fronteiras

**Fenômeno:** a transformação de sinais sonoros em organização Uint/Upro de vários tipos de convergência, por uma única regra de construção, e a seleção pelo mundo do que se consolida.

**Dentro da explicação:** Utrd, incidências, Pcrt, factories, propagação, integração, construção gradual, poda.

**Fora (fornecido):** o mundo sonoro, a física dos sensores, as regras da Pcrt, as factories, as propriedades físicas das fibras [R]. **Não fornecido:** a janela efetiva que se consolida e os atrasos que ficam [R].

**Condições anteriores à constituição:** zero Uint, zero Upro de destino constituído; vias de Utrd existentes.

**Fora desta versão (proposta [A], decisão D11):** repetição interna, neuromodulação, inibição, sono.

## 4.2 Investigação neurobiológica

**Ordem metodológica:** as hipóteses foram formuladas na conversa de 15–16/11/2026 antes de cada busca; a literatura confronta, não é incorporada automaticamente. **Estado de leitura** entre parênteses; nada foi lido em texto integral nesta rodada.

### 4.2.1 Quantas repetições, em quanto tempo
- [L] A plasticidade dependente do tempo dos disparos exige tipicamente 60–100 pares (revisão de Feldman, 2012; **trechos**). Bi e Poo (1998): 60 pares a 1 Hz (Bi, 2002; **trechos**). Outros protocolos: 10 pares a 5 Hz; 50–100 a 0,3 Hz (tabela de revisão PMC3589711; **trechos**).
- [L] Em córtex, pareamentos a 0,1 Hz não potenciam; a potenciação aparece em frequências mais altas (Sjöström et al., 2001; **resumo e trechos**). Preparações divergem: em cultura, há potenciação em frequência baixa (Pfister e Gerstner, 2006, comparando conjuntos de dados; **trechos**).
- [L] Espaçamento: um segundo episódio 10 ou 30 min depois não acrescenta; 60 min ou mais depois dobra a potenciação já saturada (Kramár et al., 2012; **resumo e trechos**).
- **Confronto:** sustenta a faixa aceita pelo responsável (crescer com 10–100 acertos; estabilizar em episódios espaçados).

### 4.2.2 Quanto tempo o material fica disponível
- [L] Traços de elegibilidade de segundos com terceiro fator (revisão de Gerstner et al., 2018; **resumo**); janela de 0,3–2 s para dopamina após a coativação (Yagishita et al., 2014; **resumo**); potenciação de entradas que chegam segundos antes e depois (Bittner et al., 2017; **resumo e trechos**); etiqueta que decai em menos de 3 h (Frey e Morris, 1997; **resumo**); reativação por até 10 h, meia-vida de ~6 h (Giri et al., 2019; **resumo**).
- **Confronto:** sustenta HC3 (rastro vivo). A escala de horas é incompatível com a duração de um toy; ver D9.

### 4.2.3 A estrutura nasce provisória
- [L] Espinhas novas surgem rápido e já funcionais (Kwon e Sabatini, 2011, córtex em desenvolvimento; **resumo**), mas a maioria é transitória e raramente se torna persistente (Holtmaat e Svoboda, 2009; **pontos-chave**). Proporções: ~20% duram cerca de 1 dia, ~50% mais de 8 dias (Trachtenberg et al., 2002; **secundária**, por notícia). 70% das novas com densidade pós-sináptica somem em 4 dias (Cane et al., 2014; **secundária**, por comentário).
- [L] Estímulos que induzem potenciação aumentam a sobrevida de espinhas novas **individuais** (> 14 h) (Hill e Zito, 2013; **resumo**).
- **Confronto:** sustenta HC1 e HC5. A sobrevida é decidida espinha a espinha, como "a mesma candidata que acerta de novo".

### 4.2.4 Onde brota o novo
- [L] Após potenciação, espinhas novas funcionais se agrupam perto de sinapses ativadas (De Roo et al., 2008; **resumo**).
- **Confronto:** sustenta o item (3) de HC4. A literatura fala em proximidade **espacial** no dendrito; a HC4 usa proximidade **de atraso**. A equivalência é proposta [A], não demonstrada.

### 4.2.5 Um mesmo axônio, vários contatos
- [L] Axônios fazem com frequência dois, três ou mais contatos no mesmo dendrito (Kasthuri et al., 2015; **resumo e notícia**); um mesmo axônio forma contatos agrupados no tufo distal de CA1, cerca de 25% das sinapses ali e cerca de 1% nos dendritos proximais (Bloss et al., 2018; **resumo e trechos**, confiança média nos números).
- **Confronto:** sustenta a existência de ramos [R] e a pergunta da D2 (as candidatas são ramos?).

### 4.2.6 O mesmo algoritmo com fontes diferentes
- [L] Furões com fibras da retina desviadas para a via auditiva formam módulos de orientação no córtex auditivo, com mapa menos ordenado (Sharma, Angelucci e Sur, 2000; **resumo**) e comportamento visual mediado por essa via, com acuidade menor (von Melchner, Pallas e Sur, 2000; **resumo**).
- **Confronto:** sustenta "um algoritmo, resultados diferentes conforme as fibras" [R]. A diferença de ordem é atribuída pelo responsável ao que a evolução fixou e aqui terá de ser construído.

### 4.2.7 Herdado da V0.15 (não relido)
Linhas de atraso e detecção de coincidência (Jeffress, 1948; Carr e Konishi, 1990); seleção hebbiana de atrasos (Gerstner et al., 1996); moldes harmônicos por coincidência e retificação (Shamma e Klein, 2000); inibição na codificação binaural de mamíferos (Brand et al., 2002); tonotopia (Greenwood, 1990); recrutamento (Sachs e Abbas, 1974; Liberman, 1978). Estado de leitura na bibliografia da [V0.15](../v15/pre-experiment.md#8-bibliografia-com-estado-de-leitura).

## 4.3 Reconstrução causal

| Elo | Biologia | Estatuto | Equivalente na V0.17 |
|---|---|---|---|
| 1 | Coincidência repetida inicia mudança | [L] | Acerto de uma candidata |
| 2 | A estrutura nova nasce fraca e provisória | [L] | Candidata com força inicial pequena |
| 3 | Só a estrutura que volta a ser coativada se estabiliza | [L] | Força cresce por acerto; estabilização em episódios espaçados |
| 4 | O que não se repete desaparece | [L] | Candidata sem acerto some |
| 5 | O novo brota perto do que foi ativado | [L] (espacial) | Brotamento perto do quase-acerto (de atraso) [A] |
| 6 | Relações estáveis no mundo se repetem; instáveis não | **inferência** | Seleção pelo mundo (HM) |

O elo 6 é o objeto do experimento.

## 4.4 Mínimos funcionais candidatos

| Mínimo | Função | Contraexemplo procurado |
|---|---|---|
| M1 Força inicial pequena | Impedir que o acaso tenha força total | Explosão mesmo com força pequena (H-explosão) |
| M2 Fortalecimento por acerto da mesma candidata | Selecionar o que se repete | Crédito espalhado por igual, como na V0.15 |
| M3 Desaparecimento sem acerto | Limitar o crescimento | Número de candidatas sem patamar |
| M4 Brotamento local | Refinar sem cobrir tudo | Brotamento que cobre a faixa inteira |
| M5 Variedade no mundo | Eliminar *aliasing* | Consolidação em Δ ± k·período (H-aliasing) |

## 4.5 Abstração agnóstica (com perdas)

| Propriedade biológica | Abstração [A] | Perdas | Teste |
|---|---|---|---|
| Espinha nova fraca e provisória | Candidata com força inicial f₀ < 1 | Sem forma, sem PSD, sem estados intermediários | M1, controle sem gradualidade (K-grad) |
| Potenciação por coincidência repetida | Força cresce Δf por acerto, até 1 | Sem dependência de frequência (Sjöström) | Varredura de taxa de apresentação |
| Estabilização por episódios espaçados | Estado estável após acertos em episódios separados | Escala de horas comprimida (D9) | Apresentações maciças × espaçadas |
| Eliminação | Candidata sem acerto por um prazo some | Sem dependência de LTD | Contagem ao longo do tempo |
| Brotamento perto do ativado | Ramo novo com atraso vizinho (± passo proporcional) | Proximidade de atraso, não espacial | Sem brotamento (K-brot) |

## 4.6 Previsões

**Positivas (se HM):**
- P1. O número de candidatas sobe nas primeiras apresentações e **estabiliza** (patamar), sem atingir os limites de interrupção.
- P2. Surgem e consolidam Uint entre sensores, na mesma faixa, cuja diferença de atraso entre as candidatas consolidadas fica a menos de uma janela da diferença de chegada da fonte (≈ 0,29 ms a 30°).
- P3. Com **fases sorteadas**, as Uint entre faixas consolidam **muito menos** que as entre sensores. Com **fases fixas** (controle), consolidam.
- P4. Variando f0 no mesmo azimute, as Uint entre sensores consolidam na diferença verdadeira, e não em Δ ± k·período.
- P5 (subteste com regra de distinção por emissão). Surgem Uint de uma só Upro, sintonizadas no período do som (e em Δ/2, Δ/3, ambiguidade esperada [R]). Sem a regra, não surgem.
- P6. Na reapresentação, as Uint consolidadas disparam por chegada de Upro, com pouca criação nova (H1).

**Negativas:**
- N1. Silêncio: nada se cria.
- N2. Só ruído de fundo: pode criar candidatas, mas não consolida (ou consolida muito menos que com som).
- N3. Controle por relógio, com as mesmas contagens: sem seletividade.
- N4. Permutação de identificadores: invariância exata.
- N5. Embaralhar os atrasos das candidatas consolidadas: o reacesso cai.

**Limites esperados:**
- Com a regra de distinção por emissão, o risco de *aliasing* de uma via consigo mesma aumenta (cada via passa a coincidir com o próprio passado). Previsão [A]: mais Uint de uma só Upro, mas a gradualidade deve conter a explosão. Se não conter, é um resultado do subteste.

## 4.7 Limites e refutações

- **Refuta HM nesta implementação:** P1 falha (sem patamar), ou P3 falha (fases sorteadas consolidam tanto quanto fixas), ou P4 falha (consolida o *aliasing*).
- **Não refuta a CLEAR:** falhas refutam esta Pcrt e estes parâmetros.

# 5. Hipóteses de trabalho e previsão de alcance

## 5.1 O que se pretende implementar (proposta [A])

- Mundo sonoro da V0.15 (geometria, ruído, fases sorteadas por padrão), com **famílias de estímulo em que um atributo varia de cada vez** (D10): só azimute; só f0; só nível; fases fixas × sorteadas. Depois, combinações.
- Utrd estrita da V0.15: 2 sensores × 13 faixas × 3 limiares = 78 vias [P].
- Pcrt de construção gradual (HC1–HC5), com as decisões da seção 6.
- Subtestes [R]: (a) regra de distinção por emissão, com e sem; (b) ramos terminando em Uint diferentes, com e sem.

## 5.2 O que se pode testar e o que se poderia demonstrar

| Nível | Pode demonstrar | Não pode |
|---|---|---|
| L1 transmissão | Propagação com atrasos medidos | — |
| L2 constituição | Construção gradual autônoma e rastreável, com patamar | Que esta Pcrt é a mínima ou a necessária |
| L3 representação | Evidência **parcial**: seleção pelo mundo (estável × instável), reacesso | A tríade CLEAR |

## 5.3 Critérios (propostos [A]; decisão D12)

- **Êxito parcial:** 100% de trilha; P1 (patamar antes dos limites); P2; P3 com razão de consolidação Z/Y (fases sorteadas) ≥ 5; P4; N1–N4.
- **Falha:** sem patamar até o fim da execução; ou P3 com razão < 2; ou P4 falha.
- **Interrupção:** chamada sem trilha; não determinismo; limites de recursos (propostos: 5.000 Uint ou 200.000 ramos/Upro, como na V0.15).

## 5.4 Ensaio mínimo do mecanismo (obrigatório antes de congelar)

Lição 5 da V0.15. Um par de vias, sinal periódico, com as regras da seção 6 já decididas:
1. a candidata certa ganha mais força que as vizinhas? (contra o crédito espalhado da V0.15);
2. o número de candidatas forma patamar?
3. com o período mudando, o *aliasing* deixa de consolidar?
O ensaio é **instrumental**, rotulado como controle de engenharia, e seus parâmetros não podem ser ajustados para "fazer funcionar" depois de visto o resultado sem que isso seja registrado.

# 6. Decisões pendentes do responsável

Recomendação do assistente entre parênteses; **a decisão é do responsável**.

| # | Decisão | Opções |
|---|---|---|
| D1 | Unidade das candidatas | (a) **cada candidata é um ramo de uma única Upro** por par via → Uint; (b) cada candidata é uma Upro própria. *(Recomendo a: com a origem sendo a Upro, candidatas como Upros próprias seriam origens distintas, e a mesma emissão por duas candidatas faria a Uint disparar com uma só via, o problema da D5b da V0.15)* |
| D2 | O que é um acerto | (a) chegadas de origens distintas dentro da janela na Uint, **mesmo abaixo do limiar** (favorecimento); (b) só quando a Uint dispara. *(Recomendo a: com força inicial pequena, a Uint nova quase nunca dispararia, e nada seria selecionado)* |
| D3 | Força inicial e incremento | Proposta: força inicial 0,1; +0,065 por acerto, até 1 (cerca de 10 acertos até 0,75 cada, suficiente para duas origens passarem o limiar de 1,5). *(Dentro da faixa 10–100 aceita)* |
| D4 | Desaparecimento | Candidata sem acerto por um prazo some; a Uint some se ficar com menos de duas origens [P] (D18 da V0.15). Prazo: ver D9 |
| D5 | Faixa de atrasos da fibra (som) | Proposta: 0,5 a 20 ms (cobre a diferença entre sensores e períodos de f0 entre ~50 e 400 Hz). *(O limite de 20 ms é escolha minha, sem fonte)* |
| D6 | Candidatas iniciais | Proposta: 6 por via, espaçamento proporcional na faixa da D5 |
| D7 | O que é quase-acerto, e o passo do brotamento | Proposta: chegada de origem distinta entre 1 e 3 janelas; brotar um ramo de cada lado, com passo de 10% do atraso. Sem usar o tamanho nem o sinal do erro (HC4) |
| D8 | Janela e limiar da Uint | Manter os da V0.15 como infraestrutura: limiar 1,5, constante 0,30 ms, janela ≈ 0,21 ms [C] |
| D9 | Escala de tempo | O toy dura segundos; a biologia, horas e dias. Proposta: expressar estabilização e desaparecimento **em blocos de apresentação** (por exemplo, estabiliza com acertos em 3 blocos separados; some após 5 blocos sem acerto), preservando a ordem crescer < estabilizar < sumir. Perda declarada: compressão de escala |
| D10 | Famílias de estímulo | Um atributo de cada vez, depois combinações (seção 5.1) |
| D11 | Repetição interna | Fora da V0.17 *(recomendo: isola o efeito da construção gradual; entra numa versão própria)* |
| D12 | Critérios | Aprovar, ajustar ou substituir os da seção 5.3 |
| D13 | Reacesso (H1) | Entra como hipótese secundária, ou fica para a V0.18? *(Recomendo entrar como secundária: a V0.15 nunca o testou)* |

# 7. Nomes

Este rascunho não cria termos novos. Usa "ramo" (aprovado em 15/11/2026), "rastro" e "aresta em formação" (regra hebbiana do Sdom), "via", "favorecida", "criação por não acomodação". "Quase-acerto", "força" e "acerto" são **descrições**, não termos; se forem para a teoria, o nome é do responsável.

# 8. Bibliografia (com estado de leitura)

Nenhuma fonte desta rodada foi lida em texto integral.

1. Beniaguev, D., Shapira, S., Segev, I., London, M. (2022). Multiple synaptic contacts combined with dendritic filtering enhance spatio-temporal pattern recognition capabilities of single neurons. *bioRxiv* 2022.01.28.478132. **Trecho.**
2. Bi, G.-Q. (2002). [título não registrado; verificar]. *Physiol. Behav.*, 77, 551–555. **Trechos.**
3. Bi, G.-Q., Poo, M.-M. (1998). Synaptic modifications in cultured hippocampal neurons. *J. Neurosci.*, 18(24), 10464–10472. **Resumo e trechos.**
4. Bittner, K. C. et al. (2017). Behavioral time scale synaptic plasticity underlies CA1 place fields. *Science*, 357, 1033–1036. **Resumo e trechos.**
5. Bloss, E. B. et al. (2018). Single excitatory axons form clustered synapses onto CA1 pyramidal cell dendrites. *Nat. Neurosci.*, 21, 353–363. **Resumo e trechos.**
6. Cane, M. et al. (2014). *J. Neurosci.* (espinhas transitórias e densidade pós-sináptica). **Secundária** (comentário PMC4050177); referência completa a verificar.
7. De Roo, M., Klauser, P., Muller, D. (2008). LTP promotes a selective long-term stabilization and clustering of dendritic spines. *PLoS Biol.*, 6(9), e219. **Resumo.**
8. Feldman, D. E. (2012). The spike-timing dependence of plasticity. *Neuron*, 75(4), 556–571. **Trechos.**
9. Frey, U., Morris, R. G. M. (1997). Synaptic tagging and long-term potentiation. *Nature*, 385, 533–536. **Resumo.**
10. Gerstner, W., Lehmann, M., Liakoni, V., Corneil, D., Brea, J. (2018). Eligibility traces and plasticity on behavioral time scales. *Front. Neural Circuits*, 12, 53. **Resumo.**
11. Giri, B., Miyawaki, H., Mizuseki, K., Cheng, S., Diba, K. (2019). Hippocampal reactivation extends for several hours following novel experience. *J. Neurosci.*, 39(5), 866–875. **Resumo.**
12. Hill, T. C., Zito, K. (2013). LTP-induced long-term stabilization of individual nascent dendritic spines. *J. Neurosci.*, 33(2), 678–686. **Resumo.**
13. Holtmaat, A., Svoboda, K. (2009). Experience-dependent structural synaptic plasticity in the mammalian brain. *Nat. Rev. Neurosci.*, 10, 647–658. **Pontos-chave.**
14. Kasthuri, N. et al. (2015). Saturated reconstruction of a volume of neocortex. *Cell*, 162(3), 648–661. **Resumo e notícia.**
15. Kramár, E. A. et al. (2012). Synaptic evidence for the efficacy of spaced learning. *PNAS*, 109(13), 5121–5126. **Resumo e trechos.**
16. Kwon, H.-B., Sabatini, B. L. (2011). Glutamate induces de novo growth of functional spines in developing cortex. *Nature*, 474, 100–104. **Resumo.**
17. Pfister, J.-P., Gerstner, W. (2006). Triplets of spikes in a model of spike timing-dependent plasticity. *J. Neurosci.*, 26(38), 9673–9682. **Trechos.**
18. Sharma, J., Angelucci, A., Sur, M. (2000). Induction of visual orientation modules in auditory cortex. *Nature*, 404, 841–847. **Resumo.**
19. Sjöström, P. J., Turrigiano, G. G., Nelson, S. B. (2001). Rate, timing, and cooperativity jointly determine cortical synaptic plasticity. *Neuron*, 32, 1149–1164. **Resumo e trechos.**
20. Trachtenberg, J. T. et al. (2002). Long-term in vivo imaging of experience-dependent synaptic plasticity in adult cortex. *Nature*, 420, 788–794. **Trechos; proporções por fonte secundária.**
21. von Melchner, L., Pallas, S. L., Sur, M. (2000). Visual behaviour mediated by retinal projections directed to the auditory pathway. *Nature*, 404, 871–876. **Resumo.**
22. Yagishita, S. et al. (2014). A critical time window for dopamine actions on the structural plasticity of dendritic spines. *Science*, 345, 1616–1620. **Resumo.**

Revisão com tabela de protocolos (PMC3589711): **trechos**; autores e título a verificar.

**Citados de memória, não verificados nesta rodada:** Licklider (1951), autocorrelação para altura; Edelman (1987), darwinismo neural; Baldwin (1896); Waddington (anos 1950), assimilação genética. **Herdados da V0.15:** ver seção 4.2.7.

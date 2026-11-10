# Como o tempo é representado em cada escala — pesquisa v0

Data: 10/11/2026 (19h21). Pedido do responsável: entender, pelo método, como a biologia representa intervalos longos ("é assim que representamos dias, semanas, meses, anos, décadas, eras"). Motivo: o motor v2 usa o atraso de uma Upro para intervalos de até 90 min, e atrasos de condução reais chegam a pouco mais de 100 ms ([glias e adenosina, seção 3c](glia-adenosine-v0.md)). **Nada decidido.**

## 1. O mapa por escala (literatura)
| Escala | Mecanismo na biologia | Fonte (o que foi lido) | Confiança |
|---|---|---|---|
| Microssegundos a ~100 ms | **Tempo de condução** (distância ÷ velocidade, ajustado por mielina e diâmetro); coincidência em neurônios detectores | Swadlow e Waxman 2012 (via BioNumbers); Seidl et al. 2010; Salami et al. 2003 | alta |
| Dezenas de ms a dezenas de segundos | **Sem relógio central:** o tempo emerge de propriedades intrínsecas de neurônios e circuitos — dinâmica de população ("relógios de população"), atividade em rampa, redes dependentes de estado; mecanismos distribuídos e diferentes por tarefa | Paton e Buonomano 2018, *Neuron* 98:687–705, PMC5962026 (resumo e trechos); Goel e Buonomano 2014 (resumo) | média-alta |
| Segundos (lacunas sem estímulo) | **Células de tempo:** no hipocampo, neurônios disparam em sequência durante um intervalo vazio entre dois eventos e, juntos, cobrem o intervalo; a largura do disparo cresce com o momento do pico (imprecisão que cresce com o tempo); quando o intervalo muda, "re-temporizam" | MacDonald et al. 2011, *Neuron* 71:737–749, PMC3163062 (resumo e trechos) | média-alta |
| Segundos a horas | **Estado da população do córtex entorrinal lateral:** informação temporal codificada de segundos a horas; células em rampa com constantes de tempo de minutos a centenas de minutos; o sinal é um tempo **derivado da experiência**, não um relógio explícito | Tsao et al. 2018, *Nature* 561:57–62 (resumo e material suplementar, trechos) | média-alta |
| Linha do tempo comprimida | Representação do passado **comprimida em escala logarítmica**: populações que relaxam com um **espectro contínuo de constantes de tempo** (transformada de Laplace do passado); células de tempo cobrem o eixo do tempo em escala logarítmica; a resolução cai para o passado mais distante | Howard e Eichenbaum 2013, PMC3982793; Howard (capítulo "Memory for time"); resumos de seminário do grupo | média (teoria com apoio empírico parcial) |
| Dias a semanas | **Deriva de conjuntos do hipocampo como "carimbo de tempo":** episódios próximos no tempo compartilham o carimbo mesmo em contextos diferentes; episódios distantes têm carimbos distintos mesmo no mesmo lugar | Rubin et al. 2015, *eLife* 4:e12247 (resumo e trechos) | média-alta |
| ~24 h | **Relógio circadiano** (laços de transcrição e tradução), independente dos mecanismos das outras escalas | Paton e Buonomano 2018 (trecho) | alta |
| Semanas a anos, décadas, eras | **Não há relógio neural:** o passado cronológico depende de **construção ativa e repetida**; o adulto reconstrói a localização no tempo combinando o conteúdo do evento com o conhecimento de **padrões de tempo** pessoais, naturais e convencionais; usa **marcos temporais**; datas exatas são conhecidas para menos de 20% dos eventos vividos | Friedman 1993, *Psychol. Bull.* 113:44–66 (resumo); Friedman 2004 e estudos de datação (trechos); Neusar et al. 2022 (trecho) | média-alta |

## 2. Leituras para a CLEAR (nossas, a validar)
1. **O tempo como conteúdo existe em todas as escalas, mas com portadores diferentes.** Na escala de milissegundos, o portador é o **tempo de percurso** (atraso da Upro) — a malha temporotopológica no sentido estrito. Acima disso, o tempo é carregado por **relações entre unidades**: sequências (ordem), estados que mudam devagar (contexto que deriva) e constantes de tempo variadas.
2. **Nas escalas longas, o tempo é representação derivada.** Dias, anos e eras são **reconstruídos** a partir de marcos e de padrões (dia e noite, estações, calendário). Isso combina com a ancoragem derivada da v43: novas referências constituídas a partir de representações já ancoradas.
3. **O ambiente do robô já oferece padrões naturais de tempo:** luz e escuridão, lâmpada às 22h, lua, queijo ao anoitecer, rato à noite. São candidatos a marcos para a reconstrução — sem nenhuma semântica injetada.
4. **Os traços do motor já se parecem com o "espectro de constantes de tempo":** `traceScalesMs` = 0,1 s; 3 s; 90 s; 45 min. Hoje eles servem para criar uma Upro cujo **atraso** é o intervalo vivido (errado acima de ~100 ms). Podem servir, em vez disso, para **detectar** a coocorrência, com o "quanto tempo" carregado por qual escala fez a ponte ou por unidades intermediárias.

## 3. Consequências possíveis para o motor (propostas nossas; decisão do responsável)
- **C1.** Atraso da Upro = basal pela distância − aceleração lenta (dias a semanas), dentro da faixa real (até ~100 ms ou pouco mais).
- **C2.** Coocorrência acima dessa faixa **não vira atraso**; vira relação mediada por (a) qual escala de traço fez a ponte, (b) unidades intermediárias que se encadeiam (como células de tempo), e/ou (c) unidades de dinâmica lenta cujo estado no momento do evento funciona como carimbo (como a deriva do entorrinal lateral e do hipocampo).
- **C2(d)** (acrescentada após a pesquisa de [aprendizado diferido](deferred-learning-v0.md)): a relação se forma **depois**, por reexecução comprimida de padrões marcados, que põe eventos separados por segundos dentro da janela de plasticidade.
- **C3.** Escalas de dias a eras **não recebem mecanismo próprio**: devem emergir como representação derivada (marcos, ciclos do ambiente). Isso vira **critério a observar**, não regra do motor.
- Perguntas ao responsável: (i) qual de C2(a), C2(b), C2(c) — ou combinação — entra; (ii) C2(b) e C2(c) podem surgir sozinhos da dinâmica (sem unidades dedicadas), o que seria preferível pela regra de não entregar pronto o que é constitutivo.

## Referências (o que foi lido)
- Friedman, W. J. (1993). Memory for the time of past events. *Psychological Bulletin* 113(1), 44–66. (resumo)
- Howard, M. W., e Eichenbaum, H. (2013). The hippocampus, time, and memory across scales. *J. Exp. Psychol. Gen.* PMC3982793. (resumo)
- MacDonald, C. J., Lepage, K. Q., Eden, U. T., e Eichenbaum, H. (2011). Hippocampal "time cells" bridge the gap in memory for discontiguous events. *Neuron* 71(4), 737–749. (resumo e trechos)
- Paton, J. J., e Buonomano, D. V. (2018). The neural basis of timing: distributed mechanisms for diverse functions. *Neuron* 98(4), 687–705. (resumo e trechos)
- Rubin, A., Geva, N., Sheintuch, L., e Ziv, Y. (2015). Hippocampal ensemble dynamics timestamp events in long-term memory. *eLife* 4, e12247. (resumo e trechos)
- Tsao, A. et al. (2018). Integrating time from experience in the lateral entorhinal cortex. *Nature* 561, 57–62. (resumo e material suplementar)

## 4. Fechamento proposto da pergunta C2 (10/11/2026, 20h; para decisão do responsável)
**Contexto:** já decididos H5, o controle do andamento (com portão de unidades de intervalo formadas) e o aprendizado diferido ([aprendizado diferido](deferred-learning-v0.md), seções 5 e 6). Leitura por **resumo**, salvo indicação.

### 4.1 Literatura nova
| Achado | Fonte | Leitura |
|---|---|---|
| Células de tempo no hipocampo disparam em momentos sucessivos durante um intervalo vazio entre dois eventos e, juntas, cobrem o intervalo inteiro. Quando a duração muda, a maioria **se reorganiza** ("re-time"), como as células de lugar no remapeamento. | MacDonald, Lepage, Eden e Eichenbaum (2011) | resumo e trechos |
| As células de tempo formam uma cadeia "dominó" que acompanha intervalos de **até ~10 s** com precisão. | texto de divulgação do instituto Kavli (2018) | **divulgação**; confiança média no número |
| No entorrinal lateral, o tempo é codificado de **segundos a horas** no estado da população, sem um código explícito de tempo: é derivado do fluxo da experiência. Mudar a atividade muda o sinal. | Tsao et al. (2018) | resumo e divulgação |
| Constantes de tempo das células em rampa nesse córtex: de **alguns minutos a centenas de minutos**. | Tsao et al. (2018), material suplementar | trechos; confiança média-alta |
| Redes recorrentes podem guardar padrões que variam no tempo como **trajetórias** e reconhecê-los em velocidades diferentes. A invariância ao andamento surge da dinâmica. | Goudar e Buonomano (2018) | resumo; é modelo, não biologia |

### 4.2 Proposta: as quatro opções, cada uma com um papel
| Faixa ou função | Mecanismo | Opção | Origem |
|---|---|---|---|
| até ~100 ms | atraso da Upro: basal pela distância, acelerado devagar pela mielina | C1 | literatura (seção 3b/3c de glias) |
| detectar que duas coisas coocorreram com intervalo maior e **marcar** | escala do traço que fez a ponte (os traços de 0,1 s, 3 s, 90 s e 45 min); dá só a ordem de grandeza | C2(a) | proposta nossa |
| **ligar depois** o que foi marcado | reexecução comprimida, no repouso e no sono | C2(d) | literatura + decisão de 19h41 |
| representar intervalos de ~0,1 a ~10 s (e servir de portão do andamento) | cadeias de unidades **formadas** que disparam em sucessão (como as células de tempo) | C2(b) | literatura; formação é proposta nossa |
| posição no tempo de minutos a horas | estado de unidades de dinâmica lenta no momento do evento, como **carimbo** derivado da experiência | C2(c) | literatura (Tsao 2018) |
| dias a eras | representação derivada (marcos, ciclos do ambiente); critério a observar | C3 | já proposto |

**Perdas:** a separação anatômica (hipocampo, entorrinal lateral, gânglios da base), e a precisão real de cada faixa, que fica a medir.

### 4.3 Lacuna honesta
Para uma cadeia C2(b) se formar pela regra hebbiana, é preciso **algo ativo durante o intervalo vazio** que seja coativo com o primeiro e o último evento. Num sistema que nasce vazio, a candidata natural é a **atividade interna contínua** (marca-passos como predisposição). Isso não foi verificado e fica para o item (iii).

### 4.4 Perguntas ao responsável
1. Aceita a combinação com papéis distintos (tabela 4.2)?
2. A atividade de fundo que permite formar as cadeias C2(b) vem dos marca-passos? Recomendo **decidir no item (iii)**.
3. Quando corrigir o motor (C1: remover o atraso = intervalo vivido e o alongamento livre; teto de ~100 ms)? Recomendo **depois do item (iii)**, porque os marca-passos mudam o mesmo trecho do código.

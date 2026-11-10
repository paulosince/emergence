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

# Rastreamento de inovação (para os artigos)

**Propósito:** registrar, a cada proposta, **o que já existe**, **o que seria novo** e **o que falta para poder alegar**. Atualizar sempre que surgir uma proposta, um precedente ou uma evidência nova. **Iniciado em 09/11/2026.**

**Regras de honestidade:**
- "Não encontrado" quer dizer "não encontrado nas buscas registradas", não "inexistente". Nenhuma alegação de originalidade sem **revisão sistemática** antes de cada artigo.
- Estado da evidência: **proposta** (só desenho) · **implementado** (código e testes) · **demonstrado** (critério pré-registrado satisfeito com nulos e controles) · **replicado**.
- Confiança na novidade: **baixa**, **média** ou **alta**, sempre relativa às buscas feitas.

## Resumo
| Contribuição candidata | Tipo | Estado | Confiança na novidade | Artigo provável |
|---|---|---|---|---|
| Artefato de latência dos instrumentos em relações temporais constituídas | Achado metodológico | demonstrado (controle TEMPO) | média | Metodologia de avaliação |
| Critérios de engrama calibrados com controles positivos e negativos para sistemas artificiais constitutivos | Método de avaliação | implementado e calibrado | média | Metodologia de avaliação |
| "Necessidade sem conteúdo não é representação" e contagem de unidades invertida | Achado metodológico | demonstrado na calibração | média | Metodologia de avaliação |
| Motor constitutivo mínimo (combinação de mecanismos) | Mecanismo | proposta | média (combinação), baixa (partes) | Motor constitutivo |
| Volume transmission física (núcleo de fonte pontual com α, λ e remoção), avaliado por eventos, como terceiro fator num sistema constitutivo | Mecanismo | difusão implementada e validada; uso como terceiro fator ainda em proposta | média | Neuromodulação espacial |
| Coordenadas constitutivas com posicionamento por economia de fiação e latência derivada da distância, num sistema que aprende | Mecanismo | proposta | baixa a média | Motor constitutivo ou neuromodulação espacial |
| Família epistêmica × valorativa de neuromodulação como estágio de segurança | Desenho e ética | proposta | baixa a média | Ética e monitoramento |
| Ciclo sono-vigília com pressão glial territorial, interruptor biestável e renormalização num sistema constitutivo | Mecanismo | proposta | baixa a média | Modulação cíclica |
| Detectores operacionais derivados de teorias (entidade, self, Orientação, valia) com parada que falha fechada | Ética e monitoramento | proposta | média | Ética e monitoramento |
| Metodologia com registro explícito de equivalências agnósticas de substrato | Processo | registrada | baixa | Pode compor qualquer artigo |
| Constituição a partir de vazio de convergências entre canais e binaurais por coincidência recorrente, com reacesso por propagação sem índice (V0.15) | Mecanismo | executado; interrompido, não demonstrado | baixa a média | Motor constitutivo |
| Distinção por emissão na Uint (regra B), com ramos: a mesma emissão soma, emissões diferentes da mesma Upro contam como distintas | Mecanismo | implementado; critérios do pré-teste satisfeitos (toy determinístico) | baixa | Motor constitutivo |
| Pcrt sobre o que falhou, com rastro em camadas de tempo e repetição interna que reapresenta o material à dinâmica | Mecanismo | proposta | baixa a média | Motor constitutivo |

## 1. Artefato de latência dos instrumentos
- **O que temos:** no controle TEMPO, as relações constituídas na sala refletem as latências dos transdutores. Com latências igualadas, nenhuma relação; com latências permutadas, o padrão acompanha a permutação em 100%; em 12 mundos, o padrão é idêntico ([relatório](latency-control-v0.1.md)).
- **Precedentes:** recalibração temporal entre modalidades em humanos (Fujisaki et al., 2004); a literatura de latência dos instrumentos está levantada no relatório.
- **Novo:** o controle sistemático (latências igualadas e embaralhadas) como **exigência** para alegar ancoragem em sistemas que constituem relações temporais.
- **Para alegar:** buscar o controle em modelos de aprendizado de atrasos (seleção e deslocamento de atrasos, policronia).

## 2. Critérios de engrama calibrados para sistemas artificiais
- **O que temos:** reativação específica, perda de função específica (condicionada à reativação) e persistência e retorno, validados contra um positivo e três negativos, robustos na grade de limiares ([calibração](calibration-v1.md); [investigação](engram-criteria-v0.1.md)).
- **Precedentes:** os critérios de engrama na neurociência (Josselyn e Tonegawa, 2020; Han et al., 2009); ablações em redes artificiais (não levantadas sistematicamente).
- **Novo:** transpor os critérios de engrama para sistemas constitutivos **com calibração prévia** por controles que cada critério precisa separar, incluindo "criar sempre". Também o achado de que um controle aleatório passa na necessidade sem a condição de conteúdo.
- **Para alegar:** buscar critérios de representação em interpretabilidade (sondas, ablação causal) e comparar.

## 3. Motor constitutivo mínimo
- **Precedentes de cada parte:** criação por novidade (rede que cresce quando necessário; teoria da ressonância adaptativa; rede incremental auto-organizada; memória temporal hierárquica); blocos e recursão (Perruchet e Vinter; hierarquia de superfícies temporais); atrasos (Gerstner et al., 1996; Izhikevich, 2006); traços multiescala (Fusi et al., 2005) ([precedentes](mcm-prior-art-v0.1.md)).
- **Novo (combinação não encontrada):** unidades por coincidência de fontes distintas, com o atraso vivido como conteúdo, recursão pela mesma regra e avaliação pelos critérios da CLEAR.
- **Atenção:** se a criação virar recrutamento (proposta de divergências), comparar com modelos de alocação de engramas.

## 4. Neuromodulação espacial física
- **Precedentes:**
  - **GasNets** (Husbands et al., 1998): gás em plano 2D, perfil gaussiano fixo dentro de um raio, acúmulo linear; o autor o chama de "modelo muito abstrato de difusão" (texto de um trabalho irmão lido; [avaliação](spatial-diffusion-v0.1.md)).
  - **NEST, transmissor de volume** (Potjans, Morrison e Diesmann, 2010): o sinal de dopamina é o disparo filtrado de um grupo de neurônios, entregue a um conjunto de sinapses. **Não é espacial** (pelo resumo e pela documentação).
  - **Izhikevich (2007):** dopamina modulando a plasticidade por tempo de disparo, com marcas de elegibilidade; concentração **global**.
  - **MCell e Smoldyn:** difusão física por partículas, sem rede que aprende.
  - **Cx3D** (Zubler e Douglas, 2009): **desenvolvimento cortical em espaço 3D físico, com difusão de substâncias no espaço extracelular.** É o precedente mais próximo do conjunto espaço + difusão; o foco é crescimento e desenvolvimento, não neuromodulação da plasticidade.
  - Uma perspectiva de 2025 sobre regras de três fatores em redes de disparos aponta os **aspectos espaciais e temporais do terceiro fator como questão em aberto** (por resumo).
- **Atualização (textos integrais):**
  - o GasNets de 1998 é declaradamente "only analogy";
  - o Cx3D não tem atividade elétrica, plasticidade nem neuromodulação;
  - o **método** do núcleo analítico com superposição já é usado para óxido nítrico por Philippides et al., com base em Crank (1980). Não alegar novidade de método.
  - **Philippides et al. (2005), texto integral lido:** já tem **receptores por nó** (quantidade × concentração), com ações de ganho, constante de tempo e troca de função; mediana de 47 gerações contra 1.201 do original. É em 2D, com difusão abstrata, parâmetros evolutivos e **sem aprendizado durante a vida**. **O perfil receptor por unidade não é novo.** A combinação que continua não encontrada: difusão física 3D com parâmetros medidos + receptores por tipo e nível com dessensibilização e regulação lenta + modulação da **plasticidade** num sistema que **constitui** unidades.
- **Novo (não encontrado):** concentração calculada pelo **núcleo de fonte pontual com α, λ e remoção** (parâmetros medidos, Rice e Cragg, 2008), avaliada **só nos eventos**, servindo de **terceiro fator** num sistema que **constitui** suas unidades, com **perfil receptor** por unidade e coordenadas constitutivas.
- **Para alegar:** texto integral de Philippides et al. (2005); busca dirigida por "reaction-diffusion neuromodulator spiking", "volume transmission model plasticity"; leitura integral do Cx3D, do transmissor de volume e da perspectiva de 2025.

## 5. Coordenadas constitutivas e latência derivada da distância
- **Precedentes:** Cx3D (crescimento em 3D físico); economia de fiação (Chklovskii et al., 2002; Bullmore e Sporns, 2012); GasNets (posições no plano dadas pelo genótipo); plasticidade de mielina (Fields, 2015).
- **Novo possível:** posição dada pela regra de nascimento perto das fontes aferentes, num sistema **que aprende em tempo real**, com a latência como **variante controlada** pelo controle de latências.
- **Confiança baixa a média:** modelos de desenvolvimento podem já fazer isso; ainda não lidos.

## 5b. Representação do tempo: atrasos constitutivos × estado da rede
- **Precedentes:** seleção de atrasos (Gerstner et al., 1996, texto lido); computação dependente de estado (Buonomano e Maass, 2009, texto lido).
- **Posição:** o programa aposta em atrasos constitutivos. Para alegar vantagem, comparar com uma rede dependente de estado nas mesmas condições.

## 5c. Reconstrução da topologia por coatividade
- **Precedente:** Curto e Itskov (2008, texto lido) reconstroem o espaço a partir de quais grupos disparam juntos.
- **Novo possível:** obter essa reconstrução de **unidades constituídas autonomamente** a partir de sensores opacos, como teste do marco da topologia dos sensores.

## 6. Família epistêmica × valorativa
- **Precedentes:** neuromodulação por incerteza (Yu e Dayan, 2005); erro de predição de recompensa (Schultz et al., 1997); motivação intrínseca (Oudeyer et al., 2007).
- **Novo possível:** separar explicitamente as duas famílias **como estágio de segurança**, ligado a detectores de Orientação e valia.
- **Para alegar:** levantar a literatura de bem-estar de IA (por exemplo, Butlin, Long et al., 2023, sobre propriedades indicadoras de consciência) e verificar se há estágios semelhantes.

## 7. Ciclo sono-vigília
- **Precedentes:** fase de sono com repetição em redes artificiais reduz o esquecimento catastrófico (Tadros et al., 2022); modelos de sono talamocorticais (não levantados); dois processos (Borbély, 1982); interruptor biestável (Saper et al., 2001).
- **Novo possível:** pressão de sono gerada por **territórios gliais** constitutivos, interruptor biestável, renormalização e poda num sistema que constitui unidades, e a pressão tratada como **variável regulada** sob detectores de valia.
- **Confiança baixa a média.**

## 8. Detectores com parada que falha fechada
- **Precedentes:** propriedades indicadoras de consciência para avaliar sistemas de IA (Butlin, Long et al., 2023).
- **Novo possível:** detectores **pré-registrados e calibrados**, derivados de uma teoria específica (CLEAR, VALORE, ANCHOR), que **param o experimento** em vez de apenas avaliar.
- **Para alegar:** levantar protocolos de pesquisa com sistemas potencialmente sencientes.

## 9. Efeito com sinal acrescentado por qualquer unidade do caminho
- **O que existe:** sinapses baseadas em corrente com peso com sinal; princípio de Dale; modulação pré-sináptica multiplicativa da liberação. Tudo padrão na literatura.
- **O que seria novo (hipótese, não verificado):** a formulação da CLEAR em que Utrd, Upro e Uint podem todas acrescentar efeito e magnitude à mesma incidência, separando sinal (soma) e magnitude (0–1). Provavelmente equivalente a formulações conhecidas; não alegar novidade sem busca.
- **Falta:** busca de precedentes; aprovação da [proposta](effects-v0.1.md).
- **Atualização (09/11/2026):** integrado ao [desenho da versão 2](engine-v2-design-proposal.md). A medida de surpresa por contexto negativo (seção 8) pode ser candidata a contribuição; precisa de busca sobre medidas de surpresa sem predição explícita.

## 10. Reacesso por propagação sem índice, na modalidade sonora (V0.15, proposta)
- **Origem:** hipótese HCMT V0.15 do responsável, revista em 13/11/2026; desenho no [pré-experimento V0.15](../toy-experiments/v15/pre-experiment.md).
- **O que existe:** linhas de atraso com detecção de coincidência (Jeffress, 1948; Carr e Konishi, 1990); seleção hebbiana de atrasos (Gerstner et al., 1996); moldes harmônicos por coincidência entre canais cocleares (Shamma e Klein, 2000); topologia de sensores por correlação (Pierce e Kuipers, 1997). Estado de leitura de cada fonte registrado no pré-experimento.
- **O que seria novo, se demonstrado:** constituição autônoma, a partir de zero Uint e zero Upro, de convergências entre canais e binaurais por uma única regra da Pcrt, com reacesso por propagação auditável e sem índice; e a exigência de tolerância de constituição igual à janela efetiva da Uint (dedução do assistente, não aprovada).
- **Para alegar:** executar a V0.15 após congelamento; busca de anterioridade sobre constituição a partir de vazio com reacesso sem *lookup* em vida artificial e redes de impulsos com crescimento estrutural (não feita).
- **Estado:** implementado e executado em 13/11/2026; **interrompido** pelo critério pré-registrado, sem demonstração ([resultados](../toy-experiments/v15/results.md)). Achado exploratório: a Utrd estrita reproduz, sem cálculo binaural, a diferença de chegada entre sensores (0,292 ms para 0,2915 ms), mas as relações entre faixas na escala de fase não são estáveis entre apresentações com fases sorteadas.
- **Atualização (13/11/2026, V0.16 Etapa I):** [levantamento da HCMT na audição](../toy-experiments/v16/investigacao-nb-hcmt.md). **O que existe (precedente forte):** eixos separados e ortogonais para frequência e periodicidade (Baumann et al., 2011), mapa de espaço construído por convergência entre canais (Knudsen e Konishi, 1978; Takahashi e Konishi, 1986), eixo de atraso como conteúdo (Suga e O'Neill, 1979) e janelas de integração que crescem com a hierarquia (Norman-Haignere et al., 2022). A organização por tipos de convergência, portanto, **não é nova como descrição do substrato**. **O que ainda seria novo, se demonstrado:** constituir esses eixos sem estrutura semeada, por uma regra única da Pcrt. Leitura integral (segunda rodada): atraso entre canais compensado pela posição do contato (células polvo; Golding e Oertel, 2012) e mapa espacial da coruja calibrado pela visão, com brotamento de novas ligações que coexistem com as antigas (Knudsen, 2002). Visão ([parte 2](../toy-experiments/v16/investigacao-nb-hcmt-visao.md)): o mesmo motivo de atraso por posição do contato na retina (Kim et al., 2014), e orientação, direção e disparidade previstas pela disposição das entradas ON/OFF (Kremkow et al., 2016). Tato e eletrorrecepção ([parte 3](../toy-experiments/v16/investigacao-nb-hcmt-tato.md)): o padrão de convergência Z×X se repete num sistema de evolução independente (peixes elétricos), e coexistem dois regimes de convergência (muitas entradas pequenas e coincidentes; poucas entradas fortes selecionadas por correlação). Vestibular ([parte 4 e fechamento](../toy-experiments/v16/investigacao-nb-hcmt-vestibular.md)): canais semicirculares quase ortogonais já no receptor; ambiguidade (translação × inclinação) resolvida por convergência entre canais com integração no tempo; convergência com sinal (cancelamento de cerca de 70% do movimento autogerado), que liga a HCMT ao efeito com sinal (seção 9). Consolidado no [dossiê](../toy-experiments/v16/dossie-hcmt.md). **Falta:** busca de anterioridade em modelos computacionais de auto-organização de mapas.

## 11. Distinção por emissão na Uint, com ramos (pré-teste separado da V0.17, 15/11/2026)
- **Origem:** conversa de 15/11/2026. O responsável corrigiu que a **origem é a Upro**, não a Utrd, e levantou a dúvida sobre "mesma origem" diante de ramos do mesmo axônio no mesmo dendrito. A separação em duas situações (mesma emissão × emissões diferentes da mesma Upro) foi proposta pelo assistente; o nome **ramo** foi aprovado pelo responsável.
- **O que existe:** um mesmo axônio faz vários contatos no mesmo dendrito (Kasthuri et al., 2015, *Cell* 162:648–661; Bloss et al., 2018, *Nat Neurosci* 21:353–363, cerca de 25% das sinapses no tufo distal de CA1 e cerca de 1% nos dendritos proximais, confiança média, lido em trecho); modelos com contatos múltiplos filtrados de forma diferente (Beniaguev et al., preprint 2022; Song e Benna, 2025). Comparação de um canal com o próprio passado atrasado: autocorrelação de Licklider (1951), **citada de memória, não verificada nesta sessão**. Leitura: resumos e trechos, não textos integrais.
- **O que seria novo (confiança baixa):** a regra de distinção por emissão como parte da regra de integração de uma arquitetura constitutiva agnóstica de substrato; provavelmente equivalente a linhas de atraso conhecidas.
- **Evidência:** [pré-teste de ramos](../toy-experiments/pre-v17-ramos/results.md): S1–S6 satisfeitos; seletividade à própria periodicidade com resposta também em Δ/2 e Δ/3 (ambiguidade que o responsável considera esperada, a resolver por reforço/decaimento e inibição). As previsões eram em boa parte dedutíveis da regra.
- **Falta:** como a Pcrt cria ramos com a diferença de atraso adequada sem calcular o atraso; efeito da regra B sobre a densidade de candidatas da Pcrt.

## 12. Pcrt sobre o que falhou, rastro em camadas e repetição interna (proposta, 15/11/2026)
- **Origem:** o responsável definiu que a Pcrt trabalha sobre o que não encontrou representação (incidências que expiraram sem integração; caminhos favorecidos que não dispararam) e que compara, como um laço que fixa uma incidência e testa as outras. O assistente propôs que "as outras" sejam as incidências com rastro ainda vivo, e que a comparação precisa ocorra na hora ou quando a repetição interna reapresenta o material, em vez de calcular a partir de horários guardados. O responsável aceitou essa leitura como orientação ("bate lindamente"); não é decisão de mecanismo nem de parâmetros.
- **O que existe (resumos e trechos):** plasticidade dependente do tempo dos disparos em janelas de ~20 ms, com 60–100 pares (Bi e Poo, 1998; revisão de Feldman, 2012); traços de elegibilidade de segundos com terceiro fator (revisão de Gerstner et al., 2018; Yagishita et al., 2014, janela de 0,3–2 s); plasticidade de escala comportamental de segundos (Bittner et al., 2017); etiqueta sináptica que decai em menos de 3 h (Frey e Morris, 1997); reativação por até 10 h, meia-vida de ~6 h, após experiência nova (Giri et al., 2019); repetição comprimida ~10× (revisão de Bendor, 2025).
- **Coerência com decisão anterior:** o prazo de fechamento de 4 h da regra hebbiana (v0.19 do Sdom) cai na mesma ordem de grandeza.
- **Ressalva:** as escalas vêm sobretudo de hipocampo e estriado; nas primeiras estações sensoriais, a organização se forma sobretudo no desenvolvimento.
- **Falta:** leitura integral das fontes; busca de anterioridade sobre repetição interna como mecanismo de constituição estrutural (não só de consolidação de pesos).
- **Atualização (16/11/2026):** na V0.17 a repetição interna foi **adiada** pelo responsável para a versão com segundo nível (relações entre Uint). Motivo: o conteúdo da repetição segue ligações entre unidades, que a V0.17 não tem. A parte "repetição interna" desta proposta fica sem teste até lá; a alegação não pode usar a V0.17 como evidência dela.
- **Atualização (16/11/2026) — quantas recorrências e construção gradual.** O responsável decidiu: conta como recorrência a **mesma candidata que acerta de novo**; e lembrou que, no modelo neurobiológico, a coincidência não gera estrutura pronta de uma vez, mas aos poucos, conforme se repete. Evidência levantada (resumos e trechos): protocolos de plasticidade dependente do tempo usam tipicamente 60–100 pares (revisão de Feldman, 2012); Bi e Poo (1998), 60 pares a 1 Hz; outros protocolos vão de 10 pares a 5 Hz a 50–100 a 0,3 Hz (tabela em PMC3589711); em córtex, pareamentos a 0,1 Hz não potenciam e a potenciação aparece em frequências altas (Sjöström et al., 2001), mas preparações divergem. Espaçamento: segundo trem 10 ou 30 min depois não acrescenta; 60 min depois dobra a potenciação (Kramár et al., 2012). Estrutura: espinhas novas surgem rápido e funcionais (Kwon e Sabatini, 2011, córtex em desenvolvimento), mas são majoritariamente transitórias (Holtmaat e Svoboda, 2009; Trachtenberg et al., 2002: ~20% duram ~1 dia, ~50% > 8 dias; Cane et al., 2014: 70% das novas com densidade pós-sináptica somem em 4 dias); estímulos que induzem potenciação aumentam a sobrevida de espinhas novas individuais (> 14 h; Hill e Zito, 2013). Exceção: aprendizado de uma tentativa com terceiro fator (Bittner et al., 2017). **Leitura do assistente (proposta):** estrutura nova nasce barata, fraca e provisória; ganha estabilidade a cada acerto; some se não acerta. Na V0.15, a Uint nova já nascia plenamente funcional, o que pode ter contribuído para a explosão.

## 13. Exuberância guiada e herança só de parâmetros (proposta, 16/11/2026)
- **Origem:** ponderação 5 da conversa de 16/11/2026. O responsável escolheu combinar: faixa de atrasos limitada pela fibra, candidatas iniciais espaçadas proporcionalmente, e brotamento de novas candidatas perto das que quase acertaram. Também definiu que entre versões passam só parâmetros, como na evolução, que fixa o que é codificado para construir e não o construído.
- **O que existe:** espinhas novas funcionais se agrupam perto de sinapses ativadas após potenciação (De Roo et al., 2008, *PLoS Biol* 6:e219; lido em resumo). Seleção de populações de conexões pela experiência: "darwinismo neural" (Edelman, 1987), **citado de memória**. Efeito Baldwin (1896) e assimilação genética (Waddington, anos 1950), **citados de memória**. Furões religados: córtex auditivo que recebe fibras da retina forma módulos de orientação, com mapa menos ordenado e acuidade menor (Sharma, Angelucci e Sur, 2000, *Nature* 404:841–847; von Melchner, Pallas e Sur, 2000, *Nature* 404:871–876; lidos em resumo).
- **O que seria novo (confiança baixa a média):** um único algoritmo de constituição que, por exuberância guiada pelo quase-acerto dentro da faixa física da fibra, termina em escalas temporais diferentes conforme o sentido; e a regra de auditoria de que só parâmetros, com o teste que os justificou, passam entre versões.
- **Falta:** busca de anterioridade sobre crescimento estrutural guiado por quase-coincidência em redes de impulsos; verificação das fontes citadas de memória.

## 14. Inibição lateral entre Uint (revisão neurobiológica, 16/11/2026)
- **Origem:** regra aprovada na D22 da V0.17 (a Uint que acerta inibe as outras que recebem da mesma Upro). Revisão pedida pelo responsável antes do ensaio: [investigação](../toy-experiments/v17/investigacao-inibicao-lateral.md).
- **O que já existe (precedente, por resumo):** competição por inibição de dois passos, com célula inibitória compartilhada, é clássica; com plasticidade inibitória, faz unidades excitatórias aprenderem traços diferentes (arXiv 1812.11581; Vogels et al., 2011). **A inibição lateral em si não é nova.**
- **Evidência nova relevante:** na coruja, a ambiguidade de fase é resolvida pela convergência entre faixas de frequência, com inibição como reforço (Peña e Konishi, 2000); disparos sincronizados impedem a competição (Lumer, 2000).
- **O que seria novo:** nada nesta regra, por ora. O ponto em aberto é de coerência interna: a inibição lateral exige ligação entre Uint, o mesmo segundo nível adiado com a repetição interna.
- **Evidência nova (16/11, texto integral):** no desenvolvimento, a inibição começa forte, ampla e lenta e a experiência a torna seletiva e rápida (Dorrn et al., 2010; Magnusson et al., 2005). O ensaio da V0.17 mostrou que inibição atrelada à própria ligação recém-nascida e chegando antes impede qualquer seleção (10/10 colapsos). Ainda sem precedente buscado para "inibição ampla que se refina por experiência num sistema que constitui unidades".

## 15. Vizinhança de comparação da Pcrt como dado anatômico (proposta, 16/11/2026)
- **Origem:** explosão por combinações prevista para 384 vias. [Investigação](../toy-experiments/v17/investigacao-convergencia.md).
- **O que já existe:** convergência entre orelhas na mesma faixa (Plauška et al., 2017; Fischer e Peña, 2009) e casamento presente no início da audição, mantido pela experiência (Polley et al., 2013). Restringir comparações a uma vizinhança topográfica é prática comum em modelos de mapas auto-organizados. **Não é novo.**
- **O que seria novo:** nada por si; serve para tornar viável a constituição por regra única.

## 16. Pcrt guiada por incidências, separada da dinâmica do Sdom (17/11/2026)
- **O que existe:** simulação orientada a eventos é técnica padrão em redes de disparos; detecção de coincidência por atrasos (tipo Jeffress) também. Busca de precedente específico para "construção alimentada só pelo que falhou, com custo guiado por incidências": **ainda não feita**.
- **O que seria novo (proposta do responsável):** a Pcrt trabalha só sobre incidências sem integração, com custo limitado pelo hardware sensorial (Utrd × taxa máxima), e não pelo número de ramos; o próprio aprendizado reduz o insumo da Pcrt.
- **O que falta para alegar:** o ensaio do [registro prévio](../toy-experiments/v17/ensaio-minimo/pcrt-incidencias.md); a busca de precedentes; a pesquisa de grau, poda e janelas.
- **Relação com a hipótese astroglial (responsável, 17/11):** o achado de custo reforça, para ele, a hipótese glial: avaliação **local, distribuída e curta**, instalada em pontos da malha e acompanhando o seu crescimento, em vez de um processo central que varre tudo. Leitura do assistente: o argumento de custo sustenta a avaliação **local**, mas ainda não discrimina entre avaliação pela própria Uint (base decidida em 10–11/11) e por território glial (variante; ver `docs/glia-adenosine-v0.md`, seções 2 e 7, no ramo `claude/zealous-hawking-sdw2w8`).

## Pendências de busca (antes de cada artigo)
1. Revisão sistemática para o motor constitutivo (criação por coincidência com atraso como conteúdo).
2. Neuromodulação espacial em redes que aprendem (difusão física como terceiro fator).
3. Critérios de representação em interpretabilidade, comparados aos critérios de engrama.
4. Protocolos de segurança para pesquisa de sistemas potencialmente sencientes.
5. Constituição a partir de vazio com reacesso sem índice (V0.15).

## Referências novas deste documento (verificadas quanto à existência, por resumo)
- Butlin, P., Long, R. et al. (2023). Consciousness in artificial intelligence: insights from the science of consciousness. arXiv:2308.08708.
- Izhikevich, E. M. (2007). Solving the distal reward problem through linkage of STDP and dopamine signaling. *Cerebral Cortex* 17(10), 2443–2452.
- Potjans, W., Morrison, A., e Diesmann, M. (2010). Enabling functional neural circuit simulations with distributed computing of neuromodulated plasticity. *Frontiers in Computational Neuroscience* 4, 141.
- Tadros, T., Krishnan, G. P., Ramyaa, R., e Bazhenov, M. (2022). Sleep-like unsupervised replay reduces catastrophic forgetting in artificial neural networks. *Nature Communications* 13, 7742.
- Zubler, F., e Douglas, R. (2009). A framework for modeling the growth and development of neurons and networks. *Frontiers in Computational Neuroscience* 3, 25.

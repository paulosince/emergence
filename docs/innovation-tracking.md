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

## 10. Utrd eferente: destinos e ligação fixa × formada (10/11/2026)
- **O que existe:** robótica do desenvolvimento com "motor babbling" e esquemas corporais aprendidos (conhecimento geral, sem busca registrada); espasmos imitados em robô levando à auto-organização de circuitos (Blumberg, Marques e Iida 2013, *Current Biology*; resumo).
- **O que seria novo (hipótese, não verificado):** saída do domínio que nasce do movimento reflexo já representado (via inversa), com ligação final fixa ao atuador e ligação de cima formada pela experiência, e com o sistema modulador como destino eferente explícito do domínio.
- **Falta:** busca em robótica do desenvolvimento (babbling, aprendizado de modelo inverso, teoria ideomotora em robôs); decisão do responsável ([revisão da arquitetura](architecture-review-v0.md), seção 1).

## Pendências de busca (antes de cada artigo)
1. Revisão sistemática para o motor constitutivo (criação por coincidência com atraso como conteúdo).
2. Neuromodulação espacial em redes que aprendem (difusão física como terceiro fator).
3. Critérios de representação em interpretabilidade, comparados aos critérios de engrama.
4. Protocolos de segurança para pesquisa de sistemas potencialmente sencientes.

## Referências novas deste documento (verificadas quanto à existência, por resumo)
- Butlin, P., Long, R. et al. (2023). Consciousness in artificial intelligence: insights from the science of consciousness. arXiv:2308.08708.
- Izhikevich, E. M. (2007). Solving the distal reward problem through linkage of STDP and dopamine signaling. *Cerebral Cortex* 17(10), 2443–2452.
- Potjans, W., Morrison, A., e Diesmann, M. (2010). Enabling functional neural circuit simulations with distributed computing of neuromodulated plasticity. *Frontiers in Computational Neuroscience* 4, 141.
- Tadros, T., Krishnan, G. P., Ramyaa, R., e Bazhenov, M. (2022). Sleep-like unsupervised replay reduces catastrophic forgetting in artificial neural networks. *Nature Communications* 13, 7742.
- Zubler, F., e Douglas, R. (2009). A framework for modeling the growth and development of neurons and networks. *Frontiers in Computational Neuroscience* 3, 25.

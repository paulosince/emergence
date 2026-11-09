# Avaliação: coordenadas 3D reais e difusão física dos moduladores

**Data:** 09/11/2026. **Ideia do responsável:** adotar coordenadas tridimensionais reais para as unidades (hoje o 3D só existe na interface) e usar um algoritmo físico de partículas para dispersar os neuromoduladores. **Estado:** avaliação e proposta minhas; decisões do responsável pendentes.

## 1. Veredito
**A ideia é coerente com a metodologia e aproxima o mecanismo do substrato.** A transmissão por volume é espacial por natureza: quem é afetado depende da distância à fonte, da difusão e da remoção (Cragg e Rice, 2004; Syková e Nicholson, 2008). Com coordenadas reais, as perdas que declarei para a concentração por compartimento (gradientes, fontes pontuais, especificidade regional) deixam de existir.

**Precedentes (não é novo isoladamente):**
- **GasNets** (Husbands, Smith, Jakobi e O'Shea, 1998): redes com um gás virtual que se difunde no espaço e modula os nós. Evoluíram controladores de robôs mais rápido que redes sem o mecanismo (segundo os próprios autores).
- **Simuladores de partículas**: MCell (Stiles e Bartol) e Smoldyn (Andrews) acompanham moléculas individuais em difusão e reação.

O diferencial possível está na **combinação**: unidades constituídas autonomamente, em espaço físico próprio, moduladas por difusão, e avaliadas pelos critérios da CLEAR.

## 2. Três condições para não comprometer o programa

### 2.1 As coordenadas não podem vir da interface
A disposição 3D atual é **calculada pelo observador**: escalonamento multidimensional da proveniência e da coatividade. Entregá-la ao motor violaria a separação obrigatória entre pesquisador e motor. Seria também circular: a posição já carrega a semelhança de atividade, que é quase conteúdo. As coordenadas precisam ser **constitutivas**, dadas por regras de posicionamento do próprio motor:
- **canais** posicionados pela anatomia do corpo ou do sensor (é a condição "com vizinhança"); a condição opaca sorteia as posições;
- **unidades novas** posicionadas a partir de suas fontes aferentes (por exemplo, perto do centro delas, com dispersão). Proposta minha; o paralelo com migração neuronal no desenvolvimento **não foi verificado**;
- **fontes moduladoras** em posições fixas da arquitetura.

A interface passa então a ter duas geometrias distintas: a **real** (do motor) e as **analíticas** (do observador).

### 2.2 Confundidor novo para a hipótese de organização do domínio
Se unidades nascem perto de suas fontes e a modulação depende da proximidade, unidades do mesmo canal serão **co-moduladas mecanicamente**. Isso produziria, por construção, comunidades por canal aferente, que é uma das previsões da hipótese. É preciso um nulo: o mesmo motor com **posições embaralhadas** (mesmas distâncias, outra atribuição).

### 2.3 Distância e latência
Com coordenadas, a latência de condução pode derivar do comprimento da ligação e da velocidade, e a plasticidade de mielina vira ajuste de velocidade (Fields, 2015). É mais próximo do cérebro, mas lembra a lição do controle de latências: latências estruturais **são instrumento**. Deve ser variante explícita, com o controle de latências igualadas.

## 3. Método de difusão: três níveis
| Nível | Como funciona | Vantagens | Custos e perdas |
|---|---|---|---|
| **Partículas** (pedido do responsável) | Cada liberação emite pacotes que fazem passeio aleatório e são removidos com probabilidade por passo; cada pacote representa muitas moléculas | Estocástico, como o real; aceita fronteiras, obstáculos e recaptação saturável | Passo de tempo fixo, em conflito com o motor por eventos; custo alto em execuções de dias |
| **Núcleo analítico de fonte pontual** | Concentração no receptor = soma, sobre as liberações recentes, da solução da equação de difusão com remoção: c = Q / (α (4π D* t)^{3/2}) · exp(−r²/(4 D* t) − k t), com D* = D/λ² | **Exato** em meio homogêneo; calculado só nos instantes de evento, compatível com o motor; determinístico | Sem fronteiras; meio homogêneo; recaptação linear |
| **Grade** | Equação de difusão em grade 3D | Heterogeneidade e fronteiras | Passo fixo; custo de memória |

**Equivalência entre os níveis:** o passeio aleatório de muitas partículas converge para a equação de difusão (relação de Einstein: deslocamento quadrático médio = 6Dt em 3D). A regra agnóstica é a **equação de difusão com remoção**; partículas e núcleo analítico são duas implementações.

**Parâmetros do meio:** fração de volume extracelular α ≈ 0,2 e tortuosidade λ ≈ 1,6, que torna a difusão efetiva cerca de 2,5 vezes mais lenta que a livre (Syková e Nicholson, 2008, resumo). O coeficiente livre de cada modulador **ainda precisa de fonte**; não vou dar números de memória.

**Recomendação:** núcleo analítico como implementação principal (exato, por eventos, reprodutível), com partículas como **variante de validação** (estocasticidade, fronteiras, poucas moléculas). Os dois devem concordar no limite de muitas partículas: é um teste automático natural.

## 4. Custos
- Núcleo analítico: liberações recentes × receptores dentro de um raio de corte (onde a concentração cai abaixo de um limiar). Com índice espacial, viável em Node e no navegador. Estimativa de confiança baixa até medir.
- Partículas: viável em execuções curtas; em execuções de dias, só no monitor sem interface.

## 5. Decisões do responsável
1. Adotar coordenadas constitutivas (regras de posicionamento no motor), mantendo as geometrias do observador separadas?
2. Regra de posicionamento das unidades novas: perto das fontes aferentes, com dispersão? Outras opções: posição sorteada, ou crescimento a partir de uma região de origem.
3. Difusão: núcleo analítico como principal e partículas como variante (minha recomendação), ou partículas como principal?
4. Latência derivada da distância: variante agora ou depois?
5. Aprofundar antes: coeficientes de difusão por modulador, posicionamento no desenvolvimento e GasNets em texto integral.

## 6. Decisões do responsável (09/11/2026)
1. **Coordenadas constitutivas: sim.** As geometrias do observador continuam separadas.
2. **Unidades novas nascem perto das fontes aferentes: sim.**
3. **Difusão: núcleo analítico como implementação principal, sem colisões mecânicas.** Os obstáculos do tecido entram em média por α e λ. Os nós atuam como **sensores** (receptores), **fontes** (liberação) e, quando for o caso, **sumidouros** (recaptação ou degradação local). **Variante de partículas** com obstáculos esféricos refletores, ajustados para α ≈ 0,2: deve **fazer emergir** a tortuosidade de cerca de 1,6 e concordar com o núcleo no limite de muitas partículas (teste de equivalência). **Correção (09/11/2026, texto integral de Syková e Nicholson, 2008):** a geometria de células convexas sozinha dá tortuosidade de **no máximo cerca de 1,225** (Tao e Nicholson); o valor medido de cerca de 1,6 exige outros fatores, como **microdomínios sem saída** (bolsões), estimados em 40% do volume extracelular no córtex. O teste com obstáculos passa a ser: (1) obstáculos convexos devem dar tortuosidade ≤ 1,225; (2) só com bolsões a tortuosidade se aproxima de 1,6. A equivalência entre partículas e núcleo é testada em meio livre, com D* imposto. Difusão anisotrópica ao longo das arestas fica como variante futura. Aprovado pelo responsável em 09/11/2026.
4. **Latência derivada da distância: agora** (como variante, com o controle de latências igualadas).
5. Aprofundamento: pedido; resultado abaixo.

## 7. Aprofundamento (09/11/2026)

### 7.1 O mecanismo do GasNets (texto lido)
Lido em texto integral: Husbands, *Evolving robot behaviours with diffusing gas networks* (Universidade de Sussex, por volta de 1998). É um trabalho irmão do artigo da *Connection Science*, que **não consegui obter**.
- Nós num **plano 2D**, com posições definidas pelo genótipo.
- Um nó emite um de quatro gases quando sua ativação passa de um limiar **ou** quando a concentração de outro gás no local passa de um limiar.
- O autor chama de "modelo muito abstrato de difusão": perfil **gaussiano** centrado no nó, nulo além de um raio de influência; acúmulo e decaimento **lineares** no tempo, saturando entre 0 e 1.
- O gás 1 aumenta e o gás 2 diminui o **ganho** da função de transferência dos nós atingidos.

**Consequência:** o GasNets não resolve a física da difusão. O núcleo analítico proposto aqui é **mais próximo do substrato** que o precedente.

### 7.2 Parâmetros reais da dopamina (texto integral lido)
Rice e Cragg (2008), *Brain Research Reviews* 58, 303–313, equação 1 (de Nicholson, 1985):

C(r, t) = Q / (α (4π D* t)^{3/2}) · exp(−r² / (4 D* t)) · exp(−k′ t), com D* = D/λ²

| Parâmetro | Estriado | Substância negra | Fonte citada pelos autores |
|---|---|---|---|
| D livre (37 °C) | 7,63 × 10⁻⁶ cm²/s | 7,63 × 10⁻⁶ cm²/s | Nicholson (1995) |
| Tortuosidade λ | 1,54 | 1,58 | Rice e Nicholson (1991); Cragg et al. (2001) |
| Fração de volume α | 0,21 | 0,30 | idem |
| Quantum Q | 9.800 moléculas | 14.000 moléculas | Jaffe et al. (1998); Cragg et al. (2001) |
| Remoção linear k′ | 20 s⁻¹ (= Vmax/Km = 4,1 μM/s ÷ 0,21 μM) | 0,12 s⁻¹ | Ross (1991); Cragg et al. (2001) |

Os autores registram que k′ = Vmax/Km só vale com concentração bem abaixo de Km. Resultados: raio de influência ≈ 7 μm para receptores de alta afinidade (10 nM) e ≈ 2 μm para os de baixa afinidade (1 μM); pico a 5 μm cerca de 10 ms após a liberação.

**Reprodução por nós (estriado, com remoção):** D* = 322 μm²/s. Pico a 5 μm em 11,3 ms, com 36 nM; a 10 μm, 2,5 nM. O limiar de 10 nM é cruzado entre 5 e 10 μm, coerente com o raio de ≈ 7 μm. A 20 μm o nosso pico sai em 93 ms, e o artigo cita ≈ 250 ms. Não sei explicar a diferença; talvez a condição seja outra (sem remoção, o pico teórico é r²/6D* ≈ 207 ms).

**Discordância a registrar:** uma medida in vivo recente dá 1,05 × 10⁻⁶ cm²/s para a dopamina no cérebro de camundongo, cerca de 3 vezes menor que o D* acima. Só li o resumo, citado por terceiros.

### 7.3 Outros moduladores
- **Acetilcolina:** a remoção é dominada pela **hidrólise enzimática** (acetilcolinesterase), não pela difusão. Única medida encontrada: 4 × 10⁻⁶ cm²/s na fenda (lagarto, via BioNumbers). Sarter, Parikh e Howe (2009) contestam que a acetilcolina cortical aja por volume: o sinal fásico seria mais localizado. **Consequência:** a acetilcolina pode exigir remoção rápida e alcance curto, não o mesmo núcleo da dopamina.
- **Serotonina, noradrenalina e adenosina:** **não encontrei** coeficientes confiáveis. Segundo o resumo de um estudo de voltametria, espécies catiônicas difundem cerca de 3 vezes mais devagar que as aniônicas no cérebro.

### 7.4 Posicionamento no desenvolvimento
- **Migração radial guiada pela glia radial**, com camadas formadas de dentro para fora; interneurônios chegam por migração tangencial (Rakic, 1972; revisões de 2015 a 2024, por resumo).
- **Economia de fiação:** os circuitos tendem a minimizar comprimento de fio e atrasos de condução (Chklovskii, Schikorski e Stevens, 2002), num compromisso com eficiência topológica (Bullmore e Sporns, 2012).

**Consequência para a regra aprovada:** "nascer perto das fontes aferentes" é uma forma de **economia de fiação**. A migração radial sugere uma variante: **crescer a partir de uma região de origem**, com posições organizadas por ordem de criação.
- Não encontrei literatura sobre posicionamento **dependente de atividade**.

### 7.6 Textos integrais obtidos depois (09/11/2026)
**Husbands, Smith, Jakobi e O'Shea (1998), *Connection Science* 10(3–4)** (enviado pelo responsável; lido):
- Os autores avisam: "the physical language used in this paper (gas, diffusion etc.) is again only analogy"; "there is no modelling involved".
- Difusão: C(d, t) = C₀ · e^(−2d/r) · T(t) dentro do raio r e zero fora. T(t) sobe e desce **linearmente** até saturar em 0 e 1; as fontes somam. Limiares: emissão a 0,5 de ativação ou 0,1 de concentração de outro gás.
- O gás 1 aumenta e o gás 2 diminui o parâmetro da função de transferência (ganho).
- Nós num plano 2D; não há aprendizado durante a vida, só evolução.
- Resultado: com o gás ativo, a evolução chega a controladores bem-sucedidos muito mais rápido, "often by an order of magnitude" mais rápido que redes convencionais.
- Os próprios autores preveem: "different, less arbitrary, abstractions may be used in the future, guided by the results of the detailed computational modelling". **É o espaço que a nossa proposta ocupa.**

**Zubler e Douglas (2009), Cx3D** (texto integral lido na página da revista, cerca de 80%):
- Espaço 3D contínuo, com vizinhança dada por triangulação de Delaunay. O espaço extracelular é dividido em pequenos volumes, com fluxo pela lei de Fick resolvido analiticamente entre vizinhos. Há difusão e degradação por substância.
- Substâncias secretadas por células e cones de crescimento servem para **quimiotaxia, ramificação e agregação**.
- Mecânica de molas e massas, forças de repulsão e atração, movimento superamortecido.
- Citação: "our program does not yet incorporate electrophysiology"; as sinapses "are not functional". **Não há plasticidade, aprendizado nem neuromodulação.**
- **Consequência:** Cx3D é o precedente de espaço 3D físico com difusão, mas para **desenvolvimento morfológico**, não para modulação da aprendizagem.

**Philippides, Husbands, Smith e O'Shea, "Structure based models of NO diffusion in the nervous system"** (preprint da Universidade de Sussex; lido em parte):
- Usa a **mesma solução analítica de fonte pontual** que propusemos: C = S₀/(8(πDt)^{3/2}) · exp(−r²/4Dt) · e^(−λt), de Crank (1980), com **superposição** de pulsos para fontes contínuas e estruturas 3D (esferas, tubos).
- Os autores defendem a solução analítica sempre que tratável, por ser exata e mais barata, e usam diferenças finitas para estruturas irregulares.
- **Consequência:** o **método** do núcleo analítico é estabelecido (Crank; Nicholson; Philippides et al.). A novidade possível não está no método.

**Philippides, Husbands, Smith e O'Shea (2005), *Artificial Life* 11, 139–160**: extensões do GasNets com um **modelo de plexo** (inspirado na difusão de óxido nítrico em plexos corticais) e um **modelo de receptores**. Ambos melhoram a evolvabilidade. **Só li o resumo; o texto integral não foi obtido** e é o precedente mais próximo da combinação "difusão mais realista + receptores numa rede artificial".

**Porkka-Heiskanen et al. (1997), *Science* 276, 1265–1268** (enviado pelo responsável; lido):
- No prosencéfalo basal colinérgico de gatos, a adenosina extracelular foi de 30,6 ± 5,1 nM na vigília e 24,1 ± 4,4 nM no sono de ondas lentas (21% menor).
- Subiu progressivamente até cerca do dobro (58,9 ± 15,7 nM) em 6 h de vigília prolongada e caiu lentamente no sono de recuperação, sem voltar à base em 3 h.
- O efeito sobre o sono foi **específico do local**: aumentar a adenosina no prosencéfalo basal mudou o sono; no tálamo, não. A adenosina inibe os neurônios colinérgicos do despertar.
- Mecanismo sugerido: a produção acompanha o **metabolismo** neuronal.
- **Consequência para a proposta de pressão de sono:** a substância de pressão é produzida em proporção à atividade e age **inibindo a fonte de despertar** (equivalente da acetilcolina). As constantes de subida e descida podem ser ajustadas a esses dados.

### 7.7 Syková e Nicholson (2008), texto integral (enviado pelo responsável)
- **Dopamina** (tabela 2, cobaias, fatias, 32 °C; Cragg et al., 2001): D livre = **6,90 × 10⁻⁶ cm²/s**; tortuosidade **1,68 (SNc), 1,80 (SNr), 1,72 (área tegmental ventral)**, um pouco acima da medida com o íon de referência nas mesmas regiões. É consistente com 7,63 × 10⁻⁶ a 37 °C (correção por temperatura usada por Rice e Cragg).
- **Remoção da dopamina:** no mesbencéfalo basta remoção proporcional à concentração, com k′ = **0,085 s⁻¹ (SNc)**, **0,093 s⁻¹ (área tegmental ventral)** e **0,006 s⁻¹ (SNr)**. No **estriado domina a cinética de Michaelis-Menten**. **Consequência:** a remoção linear do núcleo analítico serve ao mesencéfalo; para regiões tipo estriado é preciso a variante com recaptação saturável (numérica).
- **Cátions:** em estriado, D* foi cerca de **3 vezes menor** para compostos catiônicos (dopamina, α-metildopamina) que para aniônicos; os autores dizem que a interpretação (interação com a matriz extracelular com carga negativa) **continua controversa**.
- **Serotonina:** só um estudo breve, que mediu α = 0,17 e λ = 1,65 no cerebelo isolado de tartaruga; **sem coeficiente de difusão da serotonina**. Os autores pedem mais estudos de dopamina "e possivelmente serotonina".
- **Noradrenalina e adenosina:** **não aparecem** nas tabelas. Continuam sem fonte.
- **Anisotropia:** em feixes de axônios (corpo caloso) a difusão é mais fácil ao longo do feixe; D* e λ viram **tensores**; α é sempre escalar. Isso dá base à variante futura de difusão anisotrópica ao longo das arestas.
- **Microdomínios sem saída** (bolsões onde as moléculas se demoram) compõem a tortuosidade; podem ser absorvidos nela.
- **Definição de concentração:** a concentração fisiologicamente efetiva é a do **espaço extracelular** (C), não a do tecido inteiro (C₁ = αC). **Consequência para a unidade moduladora:** "partes por milhão" deve se referir ao **volume extracelular**, não ao volume total.
- **Fórmula:** a equação de fonte pontual com remoção (equação 17 da revisão) é a mesma do núcleo analítico; a revisão dá a extensão anisotrópica (equação 18).

### 7.8 Serotonina: Raghupathi et al. (2013), *Journal of Physiology* 591(23), 5959–5975 (enviado pelo responsável; lido)
Modelo 3D de difusão de serotonina por diferenças finitas com recaptação saturável. O tecido é o **intestino** (células enterocromafins), mas os parâmetros do meio vêm de medidas no **sistema nervoso central**. Tabela 1:
- D livre **5,4 × 10⁻⁶ cm²/s** (Gerhardt e Adams, 1982); D efetivo **1,98 × 10⁻⁶ cm²/s** com tortuosidade **1,65**; fração de volume **0,17** (Rice e Nicholson, 1986, sistema nervoso central).
- Recaptação pelo transportador de serotonina: Km **605 nM**; Vmax 38 pmol/min por 10⁶ células (Miller et al., 2001).
- Liberação por evento nas células enterocromafins: cerca de **9.000 moléculas** (célula endócrina, não neurônio).
- Limiares de ativação de receptores citados: 1–10 nM e acima de 10 nM, conforme o tipo de receptor.
- As concentrações relatadas são as do **compartimento extracelular**, como em Syková e Nicholson (2008).

**Consequência:** com isso, a serotonina tem coeficiente de difusão e parâmetros do meio com fonte. Faltam noradrenalina e adenosina. O quantum por vesícula neuronal de serotonina continua sem fonte; o valor intestinal não deve ser transposto sem justificativa.

### 7.5 O que não consegui obter (para o responsável tentar)
- ~~Husbands et al. (1998)~~ obtido pelo responsável.
- ~~Philippides et al. (2005)~~ obtido pelo responsável ([leituras](literature-received-2026-11-09.md)).
- Nicholson (1995): tabela de coeficientes de difusão de neurotransmissores (há registro: "Diffusion coefficients of neurotransmitters and their metabolites in brain extracellular fluid space", Universidade de Kentucky).
- Coeficientes de difusão no cérebro de noradrenalina e adenosina (serotonina obtida: seção 7.8).
- Josselyn, Köhler e Frankland (2015), texto integral (o acesso foi negado).
- ~~Porkka-Heiskanen et al. (1997)~~ obtido pelo responsável. ~~Rakic (1972)~~ obtido pelo responsável.

## 8. Implementação (09/11/2026)
Módulo `src/space/diffusion.js`, com testes em `tests/diffusion.test.js` (8 testes) e validação em `experiments/diffusion-validation.js` ([resultado](calibration/diffusion-validation.json)).
- **Núcleo analítico:** concentração extracelular em nM; raio de influência por fórmula fechada; campo por eventos com superposição de liberações e poda das que já caíram abaixo do corte em todo o espaço; **recusa** substâncias com remoção saturável.
- **Conjuntos de parâmetros com fonte:** dopamina no estriado e na substância negra compacta (Rice e Cragg, 2008); serotonina (Raghupathi et al., 2013, remoção saturável, por isso ainda não utilizável no núcleo).
- **Validação:**
  - **Conservação de massa:** a integral da concentração devolve Q·e^(−kt) com erro < 0,1%.
  - **Rice e Cragg reproduzido:** raio máximo de influência a 10 nM de 7,11 μm (por volta de 20 ms); pico a 5 μm em 11,2 ms.
  - **Equivalência com partículas** em meio livre (40.000 partículas, 10 ms): concordância de 1% a 3% entre 1 e 8 μm. Nas cascas externas, onde há poucas partículas, a diferença relativa cresce.
  - **Tortuosidade geométrica de cubos convexos:** 1,24 (α = 0,2), 1,17 (α = 0,3), 1,15 (α = 0,5). Fica perto do limite teórico de cerca de 1,225, com ruído de amostragem de alguns centésimos e viés do passo. **Confirma que obstáculos convexos não chegam a 1,6.**
- **Espaço constitutivo** (`src/space/constitutive-space.js`, 4 testes): canais por anatomia, com controle opaco que embaralha a atribuição; unidades novas perto do centro das fontes aferentes, com dispersão sorteada e **origem registrada**; sítios fixos de arquitetura; latência = distância/velocidade + atraso sináptico (variante aprovada); nulo de posições embaralhadas.
- **Pendente:** variante numérica com remoção saturável (estriado, serotonina); bolsões sem saída na variante de partículas; anisotropia ao longo das arestas.

## Referências (verificadas quanto à existência; leitura por resumo)
- Andrews, S. S., e Bray, D. (2004). *Physical Biology* 1, 137–151; Andrews et al. (2010). Detailed simulations of cell biology with Smoldyn 2.1. *PLoS Computational Biology* 6, e1000705.
- Cragg, S. J., e Rice, M. E. (2004). *Trends in Neurosciences* 27, 270–277.
- Fields, R. D. (2015). *Nature Reviews Neuroscience* 16, 756–767.
- Husbands, P., Smith, T., Jakobi, N., e O'Shea, M. (1998). Better living through chemistry: evolving GasNets for robot control. *Connection Science* 10(3–4), 185–210.
- Kerr, R. A. et al. (2008). Fast Monte Carlo simulation methods for biological reaction-diffusion systems in solution and on surfaces. *SIAM Journal on Scientific Computing* 30, 3126–3149 (MCell).
- Bullmore, E., e Sporns, O. (2012). The economy of brain network organization. *Nature Reviews Neuroscience* 13, 336–349.
- Chklovskii, D. B., Schikorski, T., e Stevens, C. F. (2002). Wiring optimization in cortical circuits. *Neuron* 34, 341–347.
- Rice, M. E., e Cragg, S. J. (2008). Dopamine spillover after quantal release. *Brain Research Reviews* 58, 303–313 (texto integral lido).
- Sarter, M., Parikh, V., e Howe, W. M. (2009). Phasic acetylcholine release and the volume transmission hypothesis: time to move on. *Nature Reviews Neuroscience* 10, 383–390.
- Syková, E., e Nicholson, C. (2008). Diffusion in brain extracellular space. *Physiological Reviews* 88(4), 1277–1340.

Números de volume e página de Andrews e Bray, Andrews et al., Husbands et al. (páginas) e Kerr et al. foram escritos de memória e precisam ser conferidos.

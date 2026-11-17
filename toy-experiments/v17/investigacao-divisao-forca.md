# EMERGENCE V0.17 — Investigação neurobiológica da divisão da força

**Data:** 17/11/2026  
**Responsável pelas decisões:** Paulo Rogério da Silva. **Investigação e redação:** assistente (GPT-6).  
**Origem:** ramo `claude/pre-v17-ramos`. **Destino:** ramo isolado `investigacao-divisao-forca`.  
**Estado:** INVESTIGAÇÃO; os ensaios estão **PAUSADOS**. **NENHUMA hipótese aprovada, regra alterada, motor executado ou resultado científico reclassificado.**

## 0. Método, proveniência e legenda

**Documentos lidos integralmente antes da pesquisa (GitHub):**
1. [Pedido do responsável](pedido-pesquisa-divisao-forca.md), íntegro, 99 linhas;
2. [Guia para continuar V17](guia-para-continuar-v17.md), íntegro, atualização 17/11;
3. [Resultados do ensaio mínimo](ensaio-minimo/resultados.md), íntegro, inclusive errata e todas as seções 17/11;
4. [Investigação de competição](investigacao-competicao.md), íntegra;
5. [Investigação de escala](investigacao-escala.md), íntegra. **Seção histórica**: suas contagens/perfis são de `motor_par.py` e não constituem evidência do atual `motor_eventos.py`.

O **motor vigente é `motor_eventos.py`**, não `motor_par.py`. O antigo percorria pares de ramos indiscriminadamente, violando a decisão sobre o insumo da Pcrt. O novo processamento por eventos está documentado em `resultados.md`; **não executei motor algum nesta investigação**. As métricas abaixo são **resultados relatados e lidos no repositório**, não medições minhas.

**Legenda:** [R] hipótese/pergunta do responsável ou hipótese já presente no pedido (não aprovada); [C-repo] número e descrição lidos no repositório, sem nova execução; [L-modelo] resultado de simulação ou análise publicado; [L-exp] dado experimental de animais/células; [I] inferência do assistente, não decisão; [P] opção para discussão, não implementação.

**Estado de leitura de fontes externas:** **TI** = texto integral PDF/HTML acessível e foram efetivamente examinados texto, métodos/resultados pertinentes e figuras; não significa leitura linha por linha; **RT** = resumo e trechos recuperados, sem inspeção suficiente do integral; **R** = resumo/metadados; **H** = somente registro anterior do EMERGENCE, não reconferido. **Confiança** alta para o que um artigo efetivamente demonstra em seu próprio preparado ou para uma regra explícita; média para parâmetros de modelos e extrapolação próxima; baixa para transferências entre circuitos/espécies ou hipótese não testada. Números de *modelos* não são medidas biológicas.

## 1. O problema que as hipóteses precisam explicar [C-repo]

Ensaio **mínimo e exploratório**: 2 Upro (uma por ouvido), uma Uint, relação temporal verdadeira `Δ≈0,458 ms`, atraso de ramo permitido 0,5–20 ms. Na condição de notas graves do `motor_eventos.py`:
- 10/10 sementes terminam com **70–100% da força de cada Upro em ramos compatíveis com a região da relação verdadeira**, frequentemente ~100%;
- distribui-se entre **4–9 ramos** por Upro, com forças individuais da ordem de **0,20–0,38**; coexistem vizinhos próximos (**~0,17–0,42 ms**) e, em **5/10**, grupos de atrasos separados por **~3,6–4,6 ms**;
- para pulso isolado com estado final, pico na Uint **0,81–1,25**, sempre abaixo do limiar **1,5**; concentrando artificialmente força num par, ultrapassa 1,5 em **6/10**;
- competição pós-disparo elevou a classe operacional no grave de 4/10 para 8/10, porém **sem concentrar as forças**: melhora de classe principalmente por desempate da identificação do par mais forte;
- no agudo, alta densidade de chegadas e depressão após disparo levaram a **19/20 colapsos** na exploração de janelas e **10/10 colapsos** no conjunto I1 da etapa B;
- nota de período fixo: uma solução por aliasing pode monopolizar a força, apesar de não corresponder à relação do mundo.

**Não concluir:** (a) que cada ramo é um axônio físico; (b) que força é exatamente número de AMPAR, probabilidade de liberação ou condutância; (c) que 8/10 de "seleção" já demonstram constituição estável e disparo confiável; (d) que qualquer regra relatada de outro circuito já foi validada na MSO; (e) que o `motor_par.py` antigo serve de referência científica para o motor atual.

**Problema lógico:** distinguir **detecção da região**, **determinabilidade de uma chegada**, **limiar de disparo** e **estabilização estrutural**. Os quatro não decorrem uns dos outros por definição.

## 2. Precedente principal — Gerstner, Kempter, van Hemmen e Wagner (1996)

**Fonte integral examinada:** W. Gerstner, R. Kempter, J. Leo van Hemmen & H. Wagner, *A neuronal learning rule for sub-millisecond temporal coding*, **Nature 383, 76–78 (1996)**. [PDF integral EPFL, 3 páginas](https://lcnwww.epfl.ch/gerstner/PUBLICATIONS/Gerstner96.pdf). **TI — texto, fórmula, três páginas e figuras examinados.** É **simulação da NL da coruja**, **não demonstração experimental de plasticidade na NL**.

**Regra realmente escrita (métodos, p. 77):**
\[
\Delta J_i=\varepsilon\sum_{\text{chegadas }i}\left[\gamma+\sum_{\text{disparos pós}}W(t_i-t_{\rm pós})\right].
\]
Parâmetros **do modelo**, não dados de neurônio: \(\varepsilon=0{,}002\), \(\gamma=0{,}1\), força inicial \(J_i=1\), saturação individual em \(J_i=3\), eliminação se \(J_i=0\). Janela \(W(s)\), **s em ms**, dada por dois ramos: \(0{,}3\exp[(s+0{,}05)/0{,}5]\) para \(s<-0{,}05\) e \(0{,}5\exp[-(s+0{,}05)/0{,}5]-0{,}2\exp[-(s+0{,}05)/5]\) para \(s\ge-0{,}05\). Aprendizagem simulada por **3.000 s** com passo numérico de **5 µs**. O máximo de reforço ocorre para chegada pouco **antes** do disparo; chegada posterior é depreciada.

1. **Precisa de disparo?** **Não para todo aumento:** o termo \(\gamma>0\) fortalece toda chegada ativa, mesmo sem disparo pós-sináptico. **Sim para a parte correlacional seletiva**: o produto com \(W\) exige disparos pós. Se a Uint nunca disparar, restará crescimento não seletivo, não um mecanismo demonstrado para resolver o impasse sozinho.
2. **Conservação/normalização:** não há a imposição \(\sum_{\rm ramos\ de\ uma\ Upro}J=1\). Sob a dinâmica e parâmetros escolhidos, emerge competição/normalização do **total de aferências do neurônio pós-sináptico**; cada sinapse tem limite individual. Não confundir essa normalização emergente com exata conservação por Uint.
3. **Como concentra os atrasos?** Correlações com disparos pós selecionam sinapses de atrasos próximos à fase apropriada, enquanto as demais perdem peso; a forma da janela pode se estender por milissegundos, sem exigir janela positiva ultracurta. O modelo começou com **600 sinapses já existentes**, atrasos aleatórios aproximados por \(\mathcal N(2{,}5\,\mathrm{ms},0{,}3\,\mathrm{ms})\), **não criou Upro/Uint a partir de zero nem brotou novos atrasos**.
4. **Resolve cópias da mesma relação? NÃO.** Na simulação **2 kHz, 105 sinapses** sobreviventes com atrasos em grupos separados pelo período **T=0,5 ms**; na de **5 kHz, 154 sinapses** sobreviventes, também agrupadas em múltiplos do período **T=0,2 ms**. O próprio artigo identifica a ambiguidade periódica. Logo, **não há prova** de colapso para um único caminho/atraso absoluto.
5. **Taxa alta:** exemplo com frequência acústica **5 kHz**, mas taxa média **667 disparos/s por aferente**, com muitos ciclos sem disparo; **154 sinapses sobreviventes** no modelo de 5 kHz. Frequência do tom, taxa de disparo de uma fibra e taxa de eventos que chegam à Uint são variáveis diferentes. **Não há normalização explícita do ganho por taxa aferente** demonstrada como regra de desenvolvimento.
6. **Duas orelhas e população:** as entradas do mesmo neurônio são separadas em dois grupos, com ITD fixo durante a aprendizagem; a regra melhora resposta àquela ITD. O artigo calcula também leitura de **população de ~100 neurônios simulados**, para precisão comportamental de ~5 µs com 100 ms, em condições ideais. Não demonstra que cada cópia do atraso ocorra sempre em Uint diferente.

**Conclusão [I]:** excelente anterioridade contra alegar novidade para "seleção hebbiana de linhas de atraso", "normalização competitiva convergente" e "populações que codificam ITD". **Não soluciona integralmente** a partida sem disparos, o aliasing ou a construção endógena de unidades/ramificações da V17. Confiança **alta para o conteúdo do modelo; baixa para equivalência neurobiológica à V17**.

### 2.1 Dois precedentes complementares

**Kempter, Gerstner & van Hemmen (1999)**, *Hebbian learning and spiking neurons*, **Physical Review E 59, 4498–4514**; [PDF integral EPFL](https://lcnwww.epfl.ch/gerstner/PUBLICATIONS/Kempter99.pdf). **TI: equação (1), desenvolvimento da normalização, condições para ponto fixo e seção de formação de estrutura examinadas.** Generaliza uma regra de **três termos**: ganho por disparo pré, mudança por disparo pós e janela pré/pós. **Normalização intrínseca é possível sob condições dos parâmetros**, não universal; diferenças entre grupos podem crescer em escala diferente da normalização. É **análise matemática com neurônios modelados**, não experimentação em tronco auditivo. Contraexemplo à inferência de que normalização exige soma fixa por axônio e à ideia de que "basta acrescentar ganho pré" para obter automaticamente uma única vencedora.

**Leibold & van Hemmen (2005)**, *Spiking Neurons Learning Phase Delays: How Mammals May Develop Auditory Time-Difference Sensitivity*, **Physical Review Letters 94, 168102**; [PDF integral em repositório universitário](https://epub.ub.uni-muenchen.de/14755/1/leibold_14755.pdf). **TI: método, equações, parâmetros e gráficos examinados.** **Modelo** de MSO mamífera: combina plasticidade temporizada em entradas **excitatórias e inibitórias**; o equilíbrio entre ambas gera deslocamento **de fase**, não obriga ajustar o atraso físico do ramo. Usa intensidades/correlações postuladas e sinapses já existentes. Simula janelas e tempos curtos, não demonstra experimentalmente STDP da MSO e **não constitui Pcrt**. É precedente direto e alternativa séria à ideia de criar/ajustar atrasos físicos.

## 3. As sete hipóteses confrontadas com evidência favorável e contrária

### 3.1 Conservação do lado errado

**[L-modelo, favorável à concorrência pós-sináptica]** Triesch, Vo & Hafner (2018), *Competition for synaptic building blocks shapes synaptic plasticity* ([eLife 7:e37836](https://elifesciences.org/articles/37836), **TI HTML**): competição por AMPARs e sítios de ancoragem num **estoque dendrítico local** produz aproximadamente normalização multiplicativa e plasticidade heterossináptica em **modelo molecular/computacional**. O próprio artigo lista previsões experimentais ainda a testar; não é medição de uma força total constante na MSO.

**[L-exp e revisão, evidência contrária ao “só pós”]** Schuemann, Klawiter, Bonhoeffer & Wierenga (2013), *Structural plasticity of GABAergic axons is regulated by network activity and GABAA receptor activation* ([Front Neural Circuits 7:113](https://www.frontiersin.org/journals/neural-circuits/articles/10.3389/fncir.2013.00113/full), **TI HTML**): mudança de atividade altera estabilidade e dinâmica de botões **pré-sinápticos** inibitórios em preparo de cultura; material é redistribuído entre botões. Review *Activity-dependent adaptations in inhibitory axons* (2013, [texto integral](https://www.frontiersin.org/journals/cellular-neuroscience/articles/10.3389/fncel.2013.00219/full), **TI**) descreve compartilhamento de material/vesículas no axônio. **Não** equivale a conservação exata de \(\sum J\) de cada axônio, nem é demonstração direta em MSO.

**[L-exp, via auditiva]** *Changes in Properties of Auditory Nerve Synapses following Conductive Hearing Loss* (2017; [texto integral PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC6596576/), **TI HTML**): em **camundongos P15–P33, endbulb de Held no núcleo coclear**, uma semana de oclusão auditiva alterou probabilidade de liberação e sítios de liberação (pré-sinápticos); tamanho quântico não mudou. A compensação existe, mas não dá um orçamento `1,0` por axônio.

**[I, confiança alta sobre o contraponto e baixa na transferência]** **Ambos os lados importam.** O mecanismo biologicamente plausível pode ter recursos pré e pós distintos, cada um com escala/localidade. Não encontrei demonstração de uma **conservação universal e exata** da força dos contatos de uma mesma Upro, nem de uma conservação exata comum a **todas** as sinapses de uma Uint da MSO. **Não decidir migrar a conservação.**

**Teste crítico futuro [P]:** medir, independentemente, orçamento pós-sináptico local versus custo axonal; perguntar se `força` representa receptores, condutância, probabilidade de liberação ou eficácia funcional. Antes dessa definição, mover o limite para a Uint pode apenas trocar um artefato por outro.

### 3.2 Região como forma da relação

**[L-exp, MSO]** Callan, Heß, Felmy & Leibold (2021), *Arrangement of Excitatory Synaptic Inputs on Dendrites of the Medial Superior Olive* ([J Neurosci, texto integral](https://pmc.ncbi.nlm.nih.gov/articles/PMC7810653/), **TI HTML**, **gerbilo P21–P30, ambos os sexos**): **55 ramos terminais em 6 animais**, mediana **4 botões por aferente**, 49/55 com vários botões; um mesmo axônio percorre até **120 µm** do dendrito, fazendo contatos em posições distintas. Botões têm múltiplas zonas ativas. O artigo **não mede diretamente** as diferenças de chegada entre cada botão do mesmo axônio em microssegundos. Modelagem dos autores indica que distribuição anatômica e canais K\(_{\mathrm{LT}}\) ativos podem **aumentar amplitude e estreitar EPSP**; quando simulam **imprecisão ≥300 µs** entre entradas de **fibras diferentes**, parte do benefício temporal diminui. São **resultados de simulação**, apoiados numa anatomia medida.

**[L-exp, limite contrário]** MSO de gerbilo integra na escala submilissegundo e seus canais K\(_v1\) ativos estreitam a janela, não alargam indiscriminadamente (Mathews et al., 2010, *Control of submillisecond synaptic timing in binaural coincidence detectors by Kv1 channels*, [abstract Nature Neuroscience](https://www.nature.com/articles/nn.2530), **R**). Em Callan, múltiplos sítios do **mesmo axônio** são altamente coordenados, **não** equivalem a quatro ramos que chegam deliberadamente com 0,2–0,4 ms de dispersão nem a cópias separadas por 3–5 ms. O artigo discute integração de mesma orelha e entre orelhas em seu modelo, mas não fornece **limiar único medido em vivo** para "atraso entre todos os sítios ipsilaterais".

**[I]:** a soma funcional de diversos contatos é plausível, mas a estrutura e a biofísica importam: contato anatômico ≠ caminho independente com atraso arbitrário ≠ canal de força automaticamente somável. Não é lícito simplesmente contar 4 vizinhos como uma única força de 1,0. **Confiança alta** nos contatos; **média** no modelo de integração; **baixa** na equivalência dos ramos do toy.

**Teste futuro [P]:** discriminar três hipóteses: (i) vários contatos de *mesmo disparo e mesmo caminho*, (ii) ramos próximos com latências distintas, (iii) pares em atrasos absolutos distantes. Identificar qual corresponde ao mecanismo das Upro/Uint antes de ajustar uma janela.

### 3.3 Cópias em neurônios diferentes

**[L-exp]** A **NL da coruja** apresenta mapa de ITDs com organização espacial dos detectores de coincidência (Carr e colaboradores, *Maps of interaural delay in the owl's nucleus laminaris*, 2015, [texto indexado do artigo](https://pmc.ncbi.nlm.nih.gov/articles/PMC4575979/), **RT**). Cada localização do mapa pode ter neurônios sintonizados em atrasos diferentes. Em **mamíferos**, porém, não se deve impor o mesmo mapa: *Population Coding of Interaural Time Differences in Gerbils and Barn Owls* ([texto indexado](https://pmc.ncbi.nlm.nih.gov/articles/PMC6633420/), **RT**) discute diferenças entre representações populacionais nos dois grupos.

**[L-modelo, CONTRA a versão categórica]** Gerstner et al. (1996), **TI**, selecionaram **várias classes de atraso, separadas por períodos do estímulo, em um mesmo neurônio simulado**. **A cópia dentro de uma Uint não é proibida pela literatura.** Além disso, cópias ao mesmo ITD podem contribuir para robustez populacional e persistir por ambiguidade de fase.

**[I]:** existe precedente para múltiplos neurônios cobrirem valores de ITD; **não** encontrei prova geral de que dois pares de atrasos absolutos que compensam a mesma ITD *precisam* pertencer a neurônios diferentes. A escolha é de organização da Pcrt, não consequência necessária da anatomia.

**Teste [P]:** comparar hipótese de **uma Uint por conjunto local de chegadas** versus **uma Uint abrigando diversas cópias**; registrar qual fenômeno seria medido, sem criar Uint extras agora.

### 3.4 Partida não hebbiana

**[L-exp]** Hoffpauir, Grimes, Mathers & Spirou (2006), *Synaptogenesis of the Calyx of Held* ([PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC6675295/), **RT**): em **camundongos P1–P4**, corrente sináptica aumenta de **−0,14±0,04 nA (P1)** a **−6,71±0,65 nA (P4)**; grandes calyces emergem em ~2 dias, antes da audição (~P8 nesse estudo). Holcomb et al. (2013), *Synaptic Inputs Compete during Rapid Formation of the Calyx of Held* ([PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC3735879/), **RT**): em **camundongos neonatos**, competição se resolve em monoinervação em ~**2/3 das células em 3 dias**. Circuito é **MNTB/cálice**, não MSO. Evidência de consolidação precoce, **não prova ausência de descarga pós**: o sistema tem atividade espontânea pré-auditiva.

**[L-modelo]** O termo \(\gamma\) de Gerstner (1996) permite ganho pré mesmo sem disparo pós, mas **não fornece seleção temporal específica nessa condição**; Song, Miller & Abbott (2000) reconhecem o problema de STDP dependente do disparo e evocam escalamento não hebbiano, segundo a [investigação de competição anterior](investigacao-competicao.md) [H; **não reli o PDF integral de Song nesta rodada**].

**[L-exp, CONTRA "não há atividade antes de ouvir"]** atividade espontânea da cóclea pode desencadear descargas do tronco antes de estímulos acústicos; ver *In vivo matching of postsynaptic excitability with spontaneous synaptic inputs during formation of the rat calyx of Held synapse* ([PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC5199743/), **RT**, **rato P2–P6**). Assim, competição inicial pode envolver **atividade pós-sináptica antes da experiência sonora**; desenvolvimento pré-auditivo não significa mecanismo independente de atividade/disparo.

**[I]:** há **múltiplas candidatas** (atividade espontânea, recursos locais, desenvolvimento estrutural, plasticidade homeostática). Não há base para escolher uma e inserir um impulso artificial de inicialização no toy.

### 3.5 Regras próprias do tronco auditivo

**[L-exp]** *Posthearing Developmental Refinement of Temporal Processing in Principal Neurons of the Medial Superior Olive* ([PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC6725447/), **RT**): em **gerbilos até ~P21**, resistência/membrana e EPSPs encurtam com maturação; constante de tempo de membrana chega a aproximadamente **0,3 ms** por ~3 semanas; possibilita disparos de centenas de Hz sem soma temporal como num neurônio cortical lento. *Development of gerbil medial superior olive: integration of temporally delayed excitation and inhibition at physiological temperature* (2007, [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC2277048/), **RT**): entre **P7 e P16**, IPSPs inicialmente mais longos se aproximam da duração dos EPSPs; aos ~P15, integração temporal já se aproxima da madura. **Tempo de EPSP não é janela de STDP.**

**[L-modelo]** Leibold & van Hemmen (2005), **TI**, simulam STDP de **excitação e inibição** da MSO, incluindo ajuste de fase. Não há aí uma medida experimental direta de janela sináptica de aprendizado da MSO.

**[L-exp, CONTRA transpor uma regra cortical fixa]** *Changes in Properties of Auditory Nerve Synapses following Conductive Hearing Loss* (2017, **TI**, camundongo núcleo coclear P15–P33) registra alterações de sítios e probabilidade de liberação; *Minimizing Synaptic Depression by Control of Release Probability* ([PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC6762601/), **RT**, núcleo magnocelular aviário) descreve mecanismos que preservam resposta a estímulos até **500 Hz**. São mudanças de **transmissão**, não demonstrações de STDP temporal bidirecional típica do córtex.

**Busca negativa declarada:** nesta rodada **não localizei artigo experimental em MSO, LSO ou núcleo coclear que medisse diretamente uma curva STDP de fortalecimento/depressão, em µs/ms e com estimativas de magnitude, equivalente à regra Song 2000**. Isso **não prova** inexistência; fica como lacuna de busca. Não transferir janela de ~20 ms do córtex como se fosse medida na MSO.

### 3.6 Ganho proporcional à taxa

**[L-exp em OUTRO circuito]** Kirkwood, Rioult & Bear (1996), *Experience-dependent modification of synaptic plasticity in visual cortex* ([Nature 381:526–528](https://www.nature.com/articles/381526a0), **R: resumo/editor bloqueado**): limiar de transição LTD/LTP muda com experiência sensorial no **córtex visual**. Demonstra metaplasticidade dependente de experiência, **não** a regra exata "dividir cada atualização pela taxa aferente" e **não** a mede no tronco auditivo.

**[L-exp auditiva]** Em endbulb de Held há depressão de curto prazo, compensação homeostática e alterações de liberação dependentes da estimulação (p.ex. *Activity-dependent, homeostatic regulation of neurotransmitter release from auditory nerve fibers*, 2015, [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC4443347/), **RT**; e *Changes in Properties…*, 2017, **TI**). Existem também sinapses especializadas que sustentam frequências elevadas com **menor** depressão conforme a história de uso ([revisão Calyx of Held](https://pmc.ncbi.nlm.nih.gov/articles/PMC4967386/), **RT**). Logo, nem a relação "mais disparos ⇒ proporcionalmente mais mudança permanente" nem "todos os eventos têm a mesma consequência" é geral.

**[I]:** seu diagnóstico aritmético é válido **para a regra fixa do toy**: sem outra compensação, 6× eventos podem acumular muito mais depressão. Mas BCM, depressão por depleção vesicular e ajuste da excitabilidade são **mecanismos diferentes**, com variáveis e prazos próprios. A literatura encontrada **não** fornece número de normalização por Hz que se possa importar com segurança para a V17. **Confiança alta na distinção; baixa na atribuição causal exata ao toy sem teste controlado.**

**Teste [P]:** analisar taxa de chegada e taxa de disparos por ramo sob o mesmo calendário físico e contabilizar depressão versus reforço. Só depois decidir se falta regulação e qual mecanismo neurobiológico o justifica.

### 3.7 Ajuste do atraso em vez de brotamento

**[L-exp FORTE, MAS não demonstra aprendizagem pelo erro]** Seidl, Rubel e colaboradores (2014), *Differential Conduction Velocity Regulation in Ipsilateral and Contralateral Collaterals Innervating Brainstem Coincidence Detector Neurons* ([J Neurosci, texto integral](https://pmc.ncbi.nlm.nih.gov/articles/PMC3972718/), **TI HTML**): em **galinhas**, mediram velocidade de condução em dois colaterais do mesmo axônio do núcleo magnocelular. A arquitetura compensa comprimento por velocidade; tempos calculados **457±98 µs ipsilateral** versus **399±64 µs contralateral** (diferença não significativa, p=0,26). Seidl & Rubel (2016), *Systematic and Differential Myelination of Axon Collaterals in the Mammalian Auditory Brainstem* ([PubMed](https://pubmed.ncbi.nlm.nih.gov/26556176/), **RT**, **gerbilo**): diferença de comprimento internodal, calibre e mielina ajusta velocidades de ramificações ipsi/contra; **a diferença surge ANTES do início da audição**.

**[L-exp, CONTRA hipótese de adaptação online guiada pelo sinal do erro]** Nem o estudo de galinha nem o de gerbilo demonstrou plasticidade provocada experimentalmente pelo **sinal/direção de erro de chegada**, seguida de calibração daquele axônio. O desenvolvimento pré-auditivo no gerbilo é contraexemplo forte à necessidade de calibrar *pela experiência sonora*. Estudos de mielinização dependente de atividade em outros circuitos não são prova específica de correção online de ITD na MSO.

**[L-modelo, alternativa]** Leibold & van Hemmen (2005), **TI**, obtêm preferências temporais por reconfiguração de **pesos excitatórios e inibitórios**, produzindo um **atraso de fase**, sem mover fisicamente o atraso de cada axônio. Isso é alternativa a ajustar mielina e também a brotar ramos.

**[I]:** há evidência direta de anatomia/velocidade organizadas para sincronização, mas **não da regra local de correção pela direção do erro**. Ajustar atraso e selecionar ramos são soluções computacionalmente distintas e nenhuma foi autorizada.

## 4. Confrontos que impedem conclusões prematuras

| Hipótese do pedido [R] | Evidência favorável | Evidência contrária/limite | Estatuto da conclusão |
|---|---|---|---|
| Conservação do lado errado | Modelo de competição pós-sináptica de receptores (Triesch 2018); Gerstner 1996 não conserva por axônio | Botões pré-sinápticos competem por material e parâmetros de liberação mudam (Schuemann 2013; endbulb 2017) | **Ambos os lados; nenhuma soma fixa universal demonstrada** |
| Região como forma | Mediana 4 botões por fibra ao dendrito da MSO, distribuídos espacialmente (Callan 2021) | Precisão depende de sincronização/condutância; botões ≠ ramos de atrasos independentes; imprecisão ≥0,3 ms degrada parte do ganho no modelo | **Plausível, não equivalência estabelecida** |
| Cópias em neurônios diferentes | NL da coruja tem mapa de detectores; codificação populacional | Gerstner 1996 preserva múltiplos atrasos por período no **mesmo** neurônio simulado; mamíferos não exigem mapa Jeffress | **Organização contingente, não necessária** |
| Partida não hebbiana | Cálice de Held é forte pré-audição; termo \(\gamma\) de Gerstner 1996 | Atividade espontânea também produz disparos pós antes da audição; crescimento pré-sensorial não significa independente de atividade | **A partida pode ser mista** |
| Regras do tronco auditivo | Cinética sub-ms e amadurecimento de inibição; mecanismos pré-sinápticos especializados | STDP excitação/inibição local da MSO ainda não demonstrado nos estudos localizados; 2005 é **modelo** | **Não importar janelas corticais como medidas** |
| Ganho proporcional à taxa | Metaplasticidade cortical; endbulb com homeostase e depressão | Nenhum desses mede divisão exata do ganho por taxa; certos circuitos preservam transmissão a centenas de Hz | **Mecanismo e escala ficam abertos** |
| Ajuste do atraso | Condução diferencial medida em galinha e mielinização diferencial no gerbilo | Mielina organizada pré-audição; não há prova experimental de uso do **sinal do erro**; atraso de fase por inibição é alternativa | **Anatomia real ≠ aprendizado direcional demonstrado** |

## 5. O que a pesquisa pode e NÃO pode sugerir para o modelo

### 5.1 Constatações relevantes [L]

1. **Não há obrigação biológica de conservar exatamente força total por axônio.** Recursos pré-sinápticos existem e podem competir; os estoques pós-sinápticos também. Em nenhum artigo examinado está uma lei universal \(\sum_{\mathrm{ramos\ por\ Upro}}f=1\).
2. **Múltiplos contatos do mesmo axônio podem ser uma solução funcional**, não necessariamente redundância improdutiva. Mas o efeito depende de dendrito, sincronização, canais ativos, zonas de liberação e força; contatos não implicam atrasos iguais.
3. **Atrasos distintos por múltiplos do período podem persistir mesmo após aprendizagem:** antecedente 1996 mostra explicitamente isso. Uma regra que selecione apenas *fase* não resolve, por si, o problema de identificar um caminho absoluto específico.
4. **Neurônios auditivos especializados têm integração temporal rápida e mecanismos de maturação diferentes dos corticais**. Aplicar STDP cortical sem medir seu efeito no regime agudo é uma hipótese.
5. **Existe ajuste estrutural de velocidade de condução**, mas não encontrei demonstração de que seja adquirido pela direção do erro temporal da coincidência.

### 5.2 Opções de investigação para o responsável [P — nenhuma decidida]

- **Opção 1: primeiro precisar o significado de força e ramo.** Se ramo representa *contato independente* ou *trajeto axonal com atraso distinto*, o uso da anatomia da MSO e da conservação muda radicalmente. Clarificar sem renomear termos da teoria.
- **Opção 2: estudar integração dendrítica com estímulos iguais, mantendo o mecanismo atual congelado**, apenas para discriminar a função de contatos sincronizados/espalhados: é **investigação conceitual ou teste futuro autorizado**, não execução desta rodada.
- **Opção 3: separar a necessidade de disparo da seleção estrutural.** A literatura fornece concorrentes (atividade espontânea, termo pré-sináptico, homeostase, poda); sem decidir qual é suficiente, nem impor todos.
- **Opção 4: tratar "uma Uint por cópia" como hipótese de organização**, não correção automática. Primeiro verificar que tipo de evento e origem cada Uint teria e como Pcrt não confundiria aliasing com relação estável.
- **Opção 5: manter como alternativas independentes ajustar força, ajustar atraso físico, ajustar fase por inibição e mudar a integração**. Cada uma exige nova justificativa e novos testes; não combinar mudanças num ensaio que produza resultados predeterminados.
- **Opção 6: auditar a comparação entre notas graves/agudas pela **taxa física de eventos e oportunidades** de reforço/depressão, sem alterar ganho; não converter BCM ou homeostase em uma função numérica sem evidência.

**Recomendação investigativa [I]:** a ordem de maior poder discriminativo é (i) estabelecer equivalências entre ramo/contato/atraso e força/condutância/recursos, (ii) distinguir a falha de soma de contatos próximos da coexistência de cópias distantes, (iii) decidir qual problema é de competição e qual é de integração, (iv) só então confrontar possíveis mecanismos de partida e especificidades da taxa auditiva. **Não é recomendação de alterar ou rodar o motor.**

## 6. Matriz de fontes: autores, ano, link, o que foi efetivamente lido e confiança

**TI** significa texto integral acessado e partes centrais realmente examinadas (não leitura integral linha a linha); **RT** resumo e trechos; **R** só resumo. Todos os títulos/links abaixo foram conferidos em páginas públicas ou fontes editoriais; onde uma autoria completa não foi verificada, usa-se "et al.", sem inventar nomes. A **confiança** é na atribuição contextual da evidência e não em uma equivalência automática à V17.

| Ref. | Título / autores / ano | Link real | Leitura nesta rodada | Evidência e limites | Confiança |
|---|---|---|---|---|---|
| L1 | *A neuronal learning rule for sub-millisecond temporal coding* — **Wulfram Gerstner, Richard Kempter, J. Leo van Hemmen, Hermann Wagner (1996)** | https://lcnwww.epfl.ch/gerstner/PUBLICATIONS/Gerstner96.pdf | **TI — PDF 3/3 páginas, figuras/fórmula** | Modelo NL coruja: termo pré, janela relativa a pós, competição emergente, vários atrasos \( \bmod T\) | Alta no modelo; baixa como mecanismo biológico demonstrado |
| L2 | *Hebbian learning and spiking neurons* — **Richard Kempter, Wulfram Gerstner, J. Leo van Hemmen (1999)** | https://lcnwww.epfl.ch/gerstner/PUBLICATIONS/Kempter99.pdf | **TI — PDF, equações/seções relevantes** | Condições para normalização dinâmica e estrutura, teoria de spikes | Alta no formalismo, baixa para MSO |
| L3 | *Spiking Neurons Learning Phase Delays: How Mammals May Develop Auditory Time-Difference Sensitivity* — **Christian Leibold, J. Leo van Hemmen (2005)** | https://epub.ub.uni-muenchen.de/14755/1/leibold_14755.pdf | **TI — PDF e figuras** | Modelo MSO: seleção de fase por plasticidade de excitação/inibição | Alta no modelo; sem validação experimental da regra |
| L4 | *Competition for synaptic building blocks shapes synaptic plasticity* — **Jochen Triesch, Anh Duong Vo, Anne-Sophie Hafner (2018)** | https://pmc.ncbi.nlm.nih.gov/articles/PMC6181566/ | **TI — HTML, métodos/discussão** | Modelo de competição local pós-sináptica, não experiência na MSO | Alta na formulação; média-baixa em transferência |
| L5 | *Structural plasticity of GABAergic axons is regulated by network activity and GABAA receptor activation* — **Anne Schuemann, Agnieszka Klawiter, Tobias Bonhoeffer, Corette J. Wierenga (2013)** | https://www.frontiersin.org/journals/neural-circuits/articles/10.3389/fncir.2013.00113/full | **TI — HTML, métodos/resultados/discussão** | Mudança dinâmica de botões pré-sinápticos de inibição, não conservação fixa em MSO | Alta no preparado, baixa em transposição |
| L6 | *Activity-dependent adaptations in inhibitory axons* — **autoria completa não reconferida** (2013) | https://www.frontiersin.org/journals/cellular-neuroscience/articles/10.3389/fncel.2013.00219/full | **TI — HTML, seções relevantes** | Revisão de recursos compartilhados/variabilidade; não dado auditivo direto | Média qualitativa |
| L7 | *Changes in Properties of Auditory Nerve Synapses following Conductive Hearing Loss* — **autoria completa não reconferida** (2017) | https://pmc.ncbi.nlm.nih.gov/articles/PMC6596576/ | **TI — HTML, resumo/métodos** | Camundongo P15–P33, endbulb no AVCN: mudanças pré por oclusão, não soma axonal fixa | Alta no contexto |
| L8 | *Arrangement of Excitatory Synaptic Inputs on Dendrites of the Medial Superior Olive* — **Alexander R. Callan, Martin Heß, Felix Felmy, Christian Leibold (2021)** | https://pmc.ncbi.nlm.nih.gov/articles/PMC7810653/ | **TI — HTML, método/figuras/discussão** | Gerbilo P21–P30, 55 aferentes/6 animais, mediana 4 botões; integração dendrítica também modelada | Alta na anatomia, média no mecanismo |
| L9 | *Control of submillisecond synaptic timing in binaural coincidence detectors by Kv1 channels* — **autoria não reconferida** (2010) | https://www.nature.com/articles/nn.2530 | **R — resumo** | MSO gerbilo: canais de potássio aceleram a integração; janela de EPSP ≠ janela de aprendizagem | Média |
| L10 | *Posthearing Developmental Refinement of Temporal Processing in Principal Neurons of the Medial Superior Olive* — **autoria não reconferida** (2005) | https://pmc.ncbi.nlm.nih.gov/articles/PMC6725447/ | **RT — resumo/trechos** | Gerbilo P21, resposta e tempo de membrana ~0,3 ms; não mede STDP | Média |
| L11 | *Development of gerbil medial superior olive: integration of temporally delayed excitation and inhibition at physiological temperature* — **autoria não reconferida** (2007) | https://pmc.ncbi.nlm.nih.gov/articles/PMC2277048/ | **RT — resumo/trechos; abertura bloqueada** | Gerbilo P7–P16: amadurecimento de EPSP/IPSP e janela de integração | Média |
| L12 | *Maps of interaural delay in the owl's nucleus laminaris* — **Carr et al. (2015)** | https://pmc.ncbi.nlm.nih.gov/articles/PMC4575979/ | **RT — resumo e trechos indexados** | Coruja NL: distribuição espacial de ITD, não uma cópia por neurônio comprovada | Média |
| L13 | *Population Coding of Interaural Time Differences in Gerbils and Barn Owls* — **autores completos não reconferidos** (2010) | https://pmc.ncbi.nlm.nih.gov/articles/PMC6633420/ | **RT — resumo/trechos** | Diferenças avian/mamífera e debate de codificação populacional | Média |
| L14 | *Synaptogenesis of the Calyx of Held: Rapid Onset of Function and One-to-One Morphological Innervation* — **Brian K. Hoffpauir, Janelle L. Grimes, Peter H. Mathers, George A. Spirou (2006)** | https://pmc.ncbi.nlm.nih.gov/articles/PMC6675295/ | **RT — resumo/trechos** | Camundongo P1–P4, amadurece pré-audição, não prova independência de disparos | Média-alta |
| L15 | *Synaptic Inputs Compete during Rapid Formation of the Calyx of Held: A New Model System for Neural Development* — **Paul S. Holcomb et al. (2013)** | https://pmc.ncbi.nlm.nih.gov/articles/PMC3735879/ | **RT — resumo/trechos** | Camundongo neonatal, competição/monoinervação em dias | Média |
| L16 | *In vivo matching of postsynaptic excitability with spontaneous synaptic inputs during formation of the rat calyx of Held synapse* — **autores não reconferidos** (2017) | https://pmc.ncbi.nlm.nih.gov/articles/PMC5199743/ | **RT — resumo/trechos** | Rato P2–P6, atividade espontânea e excitabilidade pós pré-audição | Média |
| L17 | *Minimizing Synaptic Depression by Control of Release Probability* — **autoria não reconferida** (2000/2001, verificar) | https://pmc.ncbi.nlm.nih.gov/articles/PMC6762601/ | **RT — trechos** | Núcleo magnocelular aviário, mecanismos de transmissão até ~500 Hz; não STDP | Média (ano não usado como dado) |
| L18 | *Activity-dependent, homeostatic regulation of neurotransmitter release from auditory nerve fibers* — **autores completos não reconferidos** (2015) | https://pmc.ncbi.nlm.nih.gov/articles/PMC4443347/ | **RT — resumo/trechos** | Núcleo coclear, homeostase do endbulb em atividade sustentada; não normalização de ganho por evento | Média |
| L19 | *Experience-dependent modification of synaptic plasticity in visual cortex* — **Alfredo Kirkwood, M. C. Rioult, Mark F. Bear (1996)** | https://www.nature.com/articles/381526a0 | **R — resumo; integral indisponível** | Córtex visual, limiar de plasticidade dependente de experiência; não MSO | Alta para resumo, baixa para V17 |
| L20 | *Differential Conduction Velocity Regulation in Ipsilateral and Contralateral Collaterals Innervating Brainstem Coincidence Detector Neurons* — **Seidl et al. (2014)** | https://pmc.ncbi.nlm.nih.gov/articles/PMC3972718/ | **TI — HTML, métodos/resultados** | Galinha, condutividade ipsi/contra medida, ajuste anatômico de latência | Alta para anatomia/velocidade; não aprendizagem por erro |
| L21 | *Systematic and differential myelination of axon collaterals in the mammalian auditory brainstem* — **Armin H. Seidl, Edwin W. Rubel (2016)** | https://pubmed.ncbi.nlm.nih.gov/26556176/ | **RT — resumo e trechos; não integral nesta rodada** | Gerbilo, mielina/calibre diferencial **antes de ouvir** | Alta no relato, baixa para plasticidade direcional |
| L22 | *Input timing for spatial processing is precisely tuned via constant synaptic delays and myelination patterns in the auditory brainstem* — **autoria não reconferida** (2017) | https://pubmed.ncbi.nlm.nih.gov/28559325/ | **RT — resumo/trechos** | Gerbilo, atrasos de transmissão estáveis sob variação de atividade; contra ajuste online simples | Média |
| H1 | *V17: investigação de escala* — investigação anterior (17/11/2026) | [documento local](investigacao-escala.md) | **Integral do arquivo** | Não reutilizar números do motor antigo como achados do novo | Alta quanto à proveniência |
| H2 | *V17: investigação de competição* — investigação anterior (17/11/2026) | [documento local](investigacao-competicao.md) | **Integral do arquivo** | Song 2000 e teses herdadas: referências devem ser separadas das leituras novas | Alta quanto à proveniência |

### Fontes e dados NÃO encontrados

- **Não encontrei** artigo experimental que teste diretamente a conservação **exata** de força total **por Upro/axônio** em neurônios da MSO.
- **Não encontrei** medidas diretas de distribuição de diferenças de chegada entre os quatro botões típicos do **mesmo** aferente da MSO (Callan apresenta anatomia + modelo, não esse histograma de latências).
- **Não encontrei** evidência de que **cada** cópia da mesma ITD em atrasos absolutos distintos obrigatoriamente pertença a neurônio diferente.
- **Não encontrei** curva experimental de STDP excitatória/inibitória da MSO com equivalência demonstrada à de Song 2000.
- **Não encontrei** ganho permanente normalizado exatamente por frequência de disparos aferentes na MSO/LSO.
- **Não encontrei** demonstração de **ajuste de mielina pela direção do erro de coincidência** após aprendizagem acústica no circuito da MSO.

**Não interpretar “não encontrado nesta busca” como “não existe na literatura”.** Investigações futuras necessitam estratégias específicas de busca em registros eletrofisiológicos, anatomia e genética do desenvolvimento.

## 7. O que seria novo e o que falta demonstrar

**Precedentes que limitam originalidade [L]:** seleção de atrasos por regra temporizada com competição e normalização pós-sináptica; disparo em populações sensíveis a ITD; múltiplos contatos de aferente na MSO; regras de plasticidade/competição pré e pós; adaptação da transmissão a taxas altas; ajuste anatômico de condução; sinapses modeladas com atrasos e fase. Esses mecanismos tomados isoladamente **não são novos**.

**Hipótese que ainda seria do programa [R/P, NÃO demonstrada]:** constituição gradual de relações entre incidências e de unidades/percursos (Upro/Uint) a partir de insumos não acomodados, com a Pcrt separada do funcionamento do Sdom, sem classes de relações programadas, seleção estável e determinação funcional de disparos. **Não foi feita revisão sistemática de anterioridade para esse conjunto**. A existência de Pcrt separada não autoriza alegar originalidade sem comparação com aprendizado estrutural em SNNs, árvores dendríticas adaptativas, synaptic clustering, polychronization e growing neural gas.

**Antes de alegar:** definir ontologia funcional dos ramos/contatos, política de recursos e plasticidade; resolver a divisão de força sem circularidade; preservar os controles negativos, a distinção por emissão, reflexões (a)/(b), vizinhança ±2, ausência de repetição interna/segundo nível; congelar pré-experimento, medir estabilização/reacesso/disparo e reproduzir com sementes/sons heterogêneos. Toda modificação exigirá decisão e registro prévio do responsável.

## 8. Encerramento

**Sete hipóteses confrontadas; nenhuma aceita ou refutada definitivamente como mecanismo da V0.17.** Em particular, *o achado mais restritivo* é que **o principal precedente de 1996 seleciona vários atrasos equivalentes por período, não uma cópia única**, e sua competição converge na Uint, não exige conservação por Upro. Em segundo lugar, os contatos múltiplos na MSO possuem coordenação temporal e biofísica específicas, não se confundindo com atrasos arbitrários do toy. Finalmente, a existência de myelin-tuning anatômico **antes** da audição limita inferir aprendizagem direcional.

**Nenhuma alteração em** `motor_eventos.py`, `motor_par.py`, `resultados.md`, decisões ou repositório TEMPO. Os ensaios seguem pausados.

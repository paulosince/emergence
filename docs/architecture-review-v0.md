# Revisão da arquitetura atual — v0 (em andamento)

Iniciada em 10/11/2026 com o responsável. Passamos unidade por unidade: o que o motor v2 faz hoje (`src/engines/constitutive/engine-v2.js`) e o que o responsável define. Nada implementado ainda.

## 0. Limites do domínio representacional
Guia: [texto do responsável sobre os limites do Sdom](sdom-boundaries-guide.md) (10/11/2026, 16h45). Ele substitui a leitura que fizemos às 16h12, que tinha três erros: (1) pôr Uint e Upro "dentro" por definição; (2) pôr a Utrd "fora" por definição; (3) pôr o sistema modulador "fora" por definição.

### Definições diretas do responsável (10/11/2026, 17h00; prevalecem sobre o texto-guia)
- O texto-guia foi feito pelo ChatGPT a partir das anotações do responsável e pode ter interpretado algo mal; **o que o responsável diz aqui prevalece**.
- **Sem nenhuma representação, não há domínio representacional.** Mas há **sistema**, e pode haver **predisposição** à criação de um domínio representacional, porque as regras e os processos criadores (Pcrt) já existem.
- **As Utrd não estão dentro nem fora: são parte da fronteira.** Vão de fora para dentro. Na prática, o que se vê **dentro** são as Upro que delas provêm ou que as atingem.

### O que o guia estabelece (resumo nosso; vale o texto, salvo as definições acima)
1. A fronteira é **funcional e constitutiva**: vai até onde a organização participa da constituição de conteúdo, pela tríade (organização especificadora de conteúdo, fundamentação transdutiva, determinação autônoma). Nem anatomia, nem tipo celular, nem toda a cadeia de dependências.
2. **Nada é incluído nem excluído por antecipação.** Quatro situações: constitui diretamente (integra o Sdom enquanto participa); fornece diferenças transduzidas (pode ficar fora); regula condições (não integra necessariamente); constitui representações próprias (pode ser outro Sdom).
3. ~~A Utrd pode participar da especificação do conteúdo~~ **Substituído pela definição direta:** a Utrd é parte da fronteira.
4. **Mecanismos que constituem ≠ domínio constituído.** Uma organização de unidades (no texto, "UI–UT") pode ser necessária numa implementação sem que sua existência baste para constituir o Sdom; antes da tríade há só **organização precursora**.
5. A fronteira pode **variar com a história** (incorporar ou perder participantes), mas só quando a mudança atinge as operações constitutivas de conteúdo.
6. Pode haver **vários Sdom** num organismo; comunicação ou dependência não prova pertença ao mesmo domínio.
7. Glias: G1 (regulação externa), G2 (participação num Sdom compartilhado), G3 (Sdom glial próprio) são possíveis; a evidência discutida não seleciona G2 nem G3.
8. Representação constituída ≠ acesso.
9. Questões abertas do guia: critério operacional de pertença; individuação de um Sdom; quando a organização passa a especificar conteúdo (o "primeiro conteúdo"), ligado diretamente aos nossos experimentos.

### Consequências para a revisão (propostas nossas; uma a uma com o responsável)
1. **Decidido (17h01): manter o nome do painel.** Visualmente, no momento zero há um espaço vazio; a partir das transduções, as incidências pelas Upro culminam na criação de nós e arestas. (Texto original da consequência:) Uint e Upro são unidades da implementação; a existência delas não marca o Sdom. O "mapa do domínio representacional" da interface mostra a organização (precursora ou não); dizer o que dela é representação exige o critério do primeiro conteúdo. Como nomear isso é decisão do responsável.
2. **Critério do primeiro conteúdo no experimento:** os critérios de engrama já calibrados no repositório são candidatos a teste operacional da tríade; precisam ser revistos à luz do guia.
3. **Utrd (resolvido pela definição direta):** parte da fronteira; no mapa, aparece na borda, e dentro aparecem as Upro que saem dela ou chegam a ela.
4. **Sistema modulador e glias:** começar como reguladores (situação 3, G1), com o desenho aberto a testar participação constitutiva (G2) mais tarde. Decisão do responsável.
5. **Hipótese (a) da Utrd eferente:** os destinos levantados (atuadores, sentidos, autônomo, moduladores) continuam válidos como destinos **fora do que hoje constitui conteúdo**, sem afirmar que nunca possam participar.

## 1. Utrd (unidade de transdução)

### Definição do responsável (10/11/2026, 15h52)
- O que se usa aqui é **transdução representacional**, não qualquer transdução física.
- A Utrd faz a intermediação entre **tudo o que está fora do domínio representacional** e o domínio, nos dois sentidos:
  - **aferente:** sinais **exógenos** (de fora do sistema) ou **endógenos** (de dentro do sistema, mas de fora do domínio) → domínio;
  - **eferente:** domínio → dentro do sistema (endógeno). A eferência só chega até dentro do sistema; as consequências no mundo dependem dos atuadores.
- A Utrd promove toda transformação necessária: na aferência, sinais elétricos, mecânicos, de temperatura etc. viram **incidências**; na eferência, incidência vira sinal no **canal atuador adequado**.

### Conferência com a teoria
- CLEAR v43 (trechos lidos pela busca do projeto): a Utrd "realizes the conversion between media"; rotas aferentes exógenas e endógenas até o Sdom (Figura 1). **Compatível.**
- Nos trechos da v43 lidos, a figura mostra só rotas aferentes; o sentido eferente vem da definição do responsável. (O preprint v2.1.0 não serve de referência para a arquitetura; ver [metodologia](program-methodology.md), versões da CLEAR.)
- A v43 dá o norte, mas está em revisão pelo responsável; "compatível" aqui não é veredito.

### Sequência de entrada (responsável, 10/11/2026, 17h04)
- Exemplo: a **cóclea é uma Utrd**. Ela recebe o sinal do sensor (o microfone) e o transduz em **incidências** que podem adentrar o **espaço onde haverá um domínio representacional**, mesmo quando ele ainda não existe.
- Essas incidências, ainda fora do domínio, **precisam entrar** nesse espaço, e isso se faz **necessariamente por Upro**.
- Logo, **a primeira coisa que surge são as Upro**, que culminam na integração do sinal, isto é, numa **Uint**. "Daí vêm os nomes": transdução → propagação → integração.
- **Diferença do motor v2:** hoje a Pcrt cria a Uint e as Upro ao mesmo tempo, quando há coincidência; não existe Upro antes de Uint.
- **Resposta (17h08):** a Utrd é uma **unidade especializada**: age num domínio físico específico e promove transduções específicas, para incidências e vice-versa. Mas **não pode decidir de antemão quais sinais receberá do mundo**; logo a necessidade de "fibras propagadoras" não é conhecida previamente. **As Upro se criam conforme as transduções acontecem**, em relação com as regras de criação (Pcrt). Isto responde à pergunta (1) e, em parte, à (3).
- **Resposta à (2) (17h24):**
  - **Uma Upro só existe se já tem destino.** Sem destino, ela está sendo criada naquele momento.
  - Se a incidência da Utrd **encontra** uma Upro, já há caminho para convergir. Se **não encontra**, aquele sinal nunca foi transduzido daquela forma: é criação nova, e a nova Upro **tem de convergir numa Uint**.
  - A Utrd pode ter **mais de uma saída ao mesmo tempo**. Saídas dentro de um **limiar de tempo** integram no mesmo ponto; ou vale **outro tipo de regra**, por exemplo numa Utrd visual: todas as linhas convergem para um ponto, todas as colunas para outro (coluna 1, coluna 2...).
  - Portanto, **Upro que provém da Utrd + regra determinam a Uint inicial.**
  - O responsável pediu verificação na literatura (17h24).

#### Literatura sobre o modelo de criação das Upro (pesquisa de 10/11/2026)
1. **"Upro só existe com destino."** Na biologia, neurônios são superproduzidos e os que não obtêm fator de sobrevivência do alvo morrem (hipótese neurotrófica; Hamburger e Levi-Montalcini 1949; revisões lidas em trechos). A biologia chega a "fibra só persiste com destino" por **superprodução herdada + eliminação**, não por criação sob demanda. Aferentes talamocorticais **esperam** na subplaca, fazem contatos transitórios com ela antes do alvo final, e a subplaca amplifica a atividade correlacionada que permite a seleção hebbiana na camada 4 (Kanold 2009, *Front. Neuroanat.*; revisão PMC6495198, autor e ano não conferidos; trechos).
   - Pelo princípio da arquitetura herdada: criar a Upro já com destino é equivalente ao **resultado** da superprodução + eliminação. **Perdas:** a exuberância exploratória e a competição entre excedentes; o andaime transitório (subplaca). Teste possível: variante com Upro em excesso e poda.
2. **"Saídas dentro de um limiar de tempo integram no mesmo ponto."** Sustentado: modelos baseados em correlação têm três componentes — plasticidade por correlação ("neurons that fire together, wire together": neurônios correlacionados tendem a inervar alvos comuns), competição e organização colunar (Miller, Erwin e Kayser 1999, *J. Neurobiol.* 41:44–57; **texto integral**, lido por ferramenta de resumo). Na cóclea antes da audição, a atividade espontânea sincroniza células ciliadas vizinhas e ajuda a refinar os mapas tonotópicos (Tritsch et al. 2007, *Nature* 450:50–55; **resumo**).
3. **"Regras do tipo linhas e colunas (Utrd visual)."** Na biologia, o mapa retinotópico é grosseiramente posto por **gradientes moleculares herdados** (Eph/efrina), com cada eixo da retina mapeado **de forma independente** — um sistema cartesiano — e refinado pela atividade (ondas retinianas) (Triplett e Feldheim 2012, PMC3288406; Feldheim e O'Leary 2010, PMC2964178; **resumos**). A convergência de entradas alinhadas numa célula (seletividade a orientação) surge, em modelos, de correlações da atividade espontânea sem linhas pré-ligadas (Miller 1994, *J. Neurosci.* 14:409–441; resumo); experimentos são compatíveis com papel instrutivo da atividade, sem prova definitiva (Miller et al. 1999).
   - **Ponderação nossa:** a regra "linhas/colunas" corresponde ao que na biologia é **herdado** (gradientes cartesianos). Uma regra que fixa de antemão quais canais convergem pode estar pré-definindo caminhos, a linha que o responsável confirmou às 17h18. A v43 admite relações topológicas na Pcrt; a dúvida é entre **regra genérica** (coincidência temporal + vizinhança no sensor, para todas as Utrd) e **regra específica por modalidade** (linhas/colunas). Recomendação: genérica como principal; linhas/colunas como variante de comparação. **Decisão do responsável.**
   - **Decidido (responsável, 17h30):** regra **genérica** como principal, pela **regra hebbiana, como no TEMPO**; linhas/colunas ficam como variante de comparação. O exemplo das linhas e colunas veio de raciocínio de engenharia; a formação deve emergir.
   - Conferência nossa: no TEMPO, a criação é por coatividade ordenada (o nó que disparou até 120 ms antes ganha ligação até o que disparou, peso inicial 0,3, abaixo do limiar) e depois reforço, ajuste de latência e poda ([inventário de regras](mesh-rules-v0.1.md)). A Pcrt do motor v2 já é dessa família (coincidência por traços; acomodar antes de criar; criar a Uint com as Upro no mesmo evento). Na prática, isso já realiza "Upro só existe com destino": a Upro nasce no mesmo evento que a Uint de destino.
   - A confirmar: criação com **uma** coatividade (como no TEMPO) ou exigindo **recorrência** (como no Sdom v0.19: rastro → aresta em formação → fechar)?
   - **Resposta do responsável (17h34):** sem resposta definitiva; entende que cada Utrd é **especializada** e que **não valem as mesmas regras** para a Utrd visual, auditiva, tátil, de temperatura etc. Pediu pesquisa e uso do método.

#### Pesquisa: regras de formação por sentido; uma coincidência ou recorrência (10/11/2026)
**Parte 1 — as regras mudam conforme o sentido?**
1. **Reconexão entre sentidos:** em furões com a retina ligada à via auditiva, o córtex auditivo "reconectado" desenvolve módulos de orientação com sintonia comparável à de V1, mas mapa menos ordenado; as ligações mantêm traços do córtex auditivo (Sharma, Angelucci e Sur 2000, *Nature* 404:841–847; **resumo e trechos do texto integral**). Leitura: a forma da regra cortical é em boa parte **comum**; o que difere é sobretudo o **padrão de entrada**, com alguma especificidade local.
2. **A regra não é uniforme nem dentro de um neurônio:** a importância do tempo exato varia entre sinapses e regimes de atividade; existem várias formas de STDP; a janela depende da posição no dendrito (Feldman 2012, *Neuron*, PMC3431193; revisão "Dendritic synapse location and neocortical spike-timing-dependent plasticity", *Front. Synaptic Neurosci.* 2010, autores não conferidos; **resumos e trechos**). Janela típica da STDP hebbiana: potencialização com o pré antes do pós por ~0–20 ms (Feldman 2012; confiança média).
3. **Períodos críticos** têm tempo, duração e mecanismos moleculares próprios em cada região e modalidade (Hensch 2004, *Annu. Rev. Neurosci.* 27:549–579; **resumo e trechos**).
4. **Resolução temporal por sentido:** o processamento temporal auditivo supera o tátil e o visual; tátil × visual dá resultados mistos (revisão em *Atten. Percept. Psychophys.* 2023, doi 10.3758/s13414-023-02736-y; **trecho**).
- **Hipótese proposta (nossa):** a especialização mora **na Utrd** (o que ela transduz, com que resolução e taxa de amostragem) e nos **parâmetros** da janela de coincidência, que acompanham a resolução da Utrd; a **forma** da regra de formação na Pcrt é comum (hebbiana). Equivalência: igual ao resultado da reconexão de Sur (regra comum, entrada diferente). Perdas: especializações locais do tecido (o mapa reconectado é menos ordenado). Teste: variante com regras diferentes por sentido.
- **Decidido (responsável, 17h39):** proposta da parte 1 aprovada — especialização na Utrd e nos parâmetros da janela; forma da regra comum (hebbiana); variante por sentido como comparação.

**Parte 2 — uma coincidência ou recorrência?**
1. **Por repetição:** na STDP clássica, a mudança é induzida por dezenas de pareamentos (por exemplo, 60 pares a 20 Hz; Morrison, Diesmann e Gerstner 2008, *Biol. Cybern.* 98:459–478; **trecho do texto integral**).
2. **Por um evento:** no hipocampo, campos de lugar se formam **numa única passagem** por uma plasticidade não hebbiana, de segundos, disparada por platôs dendríticos (Bittner et al. 2017, *Science* 357:1033–1036; **resumo e trechos**).
3. **Marcação e captura:** a estimulação fraca cria só o **potencial** de mudança duradoura (uma marca temporária); ela se fixa se um evento forte acontece perto no tempo (Frey e Morris 1997; Redondo e Morris 2011; **resumos**).
4. **Regras de três fatores:** a coatividade cria uma marca de elegibilidade; a mudança só ocorre se um terceiro fator (recompensa, punição, **surpresa ou novidade**) chega enquanto a marca existe (Gerstner et al. 2018, *Front. Neural Circuits* 12:53, PMC6079224; **resumo e trechos**).
- **Não encontrei** evidência de que "uma vez × repetição" dependa do **sentido**; nas fontes lidas, depende da região, do mecanismo e da presença do terceiro fator.
- **O motor v2 já é de três fatores:** a coincidência não coberta cria uma marca e dispara a novidade; a Uint só é criada se o modulador abre a porta dentro da janela de elegibilidade (2 s). Como a própria coincidência nova gera a novidade, na prática quase sempre basta uma.
- **Proposta (nossa):** dois caminhos, como na biologia: (i) **uma coincidência + terceiro fator** (novidade ou surpresa) cria; (ii) **sem terceiro fator, exige recorrência** (a marca se acumula a cada repetição até fechar, como no Sdom v0.19). Hoje o caminho (ii) não existe. **Decisão do responsável.**
- **Decidido (responsável, 17h43):** os **dois caminhos** aprovados "com absoluta certeza". O responsável pede que os **tempos** sejam investigados com precisão na literatura, "não tempos da nossa cabeça".

#### Tempos da formação na literatura (pesquisa de 10/11/2026; todos em fatias ou animais, sobretudo roedores)
| Tempo | Valor na literatura | Fonte (o que foi lido) | Confiança | Motor v2 hoje |
|---|---|---|---|---|
| Janela do terceiro fator, estriado (dopamina) | só durante ou logo após o protocolo de 1 s; marca decai em ~1 s | Yagishita et al. 2014, resumido em Gerstner et al. 2018 (texto integral da revisão, por ferramenta de resumo) | média-alta | `eligibilityMs` = 2 s (declarado), um só modulador |
| Janela do terceiro fator, córtex (noradrenalina) | atraso de até 5 s funciona; 10 s não; marca pré→pós decai em 5–10 s | He et al. 2015, em Gerstner et al. 2018 | média-alta | idem |
| Janela do terceiro fator, córtex (serotonina, para depressão) | até 2,5 s funciona; 5 s não; marca pós→pré decai em ~3 s | idem | média-alta | não existe |
| Janela do terceiro fator, hipocampo (dopamina) | até ~1 min funciona; ~10 min não | Brzosko et al. 2015, 2017, em Gerstner et al. 2018 | média-alta | idem |
| Plasticidade de um evento (platô dendrítico) | platô alguns segundos antes ou depois; marca ~2 s; in vivo, campo de lugar numa passagem; em fatia, 5 pareamentos | Bittner et al. 2017 (resumo e trechos) e Gerstner et al. 2018 | média-alta | — |
| Repetições usadas nos experimentos de três fatores | 10 × 15 ensaios (estriado); 40 a 200 repetições (córtex); 100 pareamentos (hipocampo) | Gerstner et al. 2018 | alta (protocolos) | basta uma coincidência |
| Duração da marca (marcação e captura) | a marca da estimulação fraca decai em menos de 3–4 h (com 3 h de intervalo já não houve captura); potencialização inicial dura 2–3 h | Frey e Morris 1997, por fontes secundárias (revisões; texto original não lido) | média | não existe (caminho ii) |
| Intervalo entre repetições (espaçamento) | segunda estimulação aumenta a potencialização a 60 min, não a 40 min (refratário de 30–60 min); três trens a 1 h saturam | Kramár et al. 2012, *PNAS* 109:5121–5126 (resumo e trechos da PMC) | média-alta | — |
| Espaçamento no comportamento (camundongo) | pelo menos 3 ensaios a 1 h; intervalos menores ou maiores ineficazes | Seese et al. 2014, *PNAS* 111:16907–16912 (resumo) | média | — |
| Janela de coincidência (STDP hebbiana) | pré antes do pós por ~0–20 ms | Feldman 2012 (resumo e trechos) | média | tolerância de atraso: 2 ms ou 5% do atraso |

**Leituras (nossas):**
1. A janela do terceiro fator **depende do modulador e da região**: ~1 s a ~1 min. Com vários moduladores aprovados, cada um teria a **sua** janela (noradrenalina ~5 s; serotonina ~2,5 s; dopamina ~1 s no estriado, até ~1 min no hipocampo). O valor atual (2 s, um só modulador) está dentro da faixa, mas não vem de uma fonte.
2. **Cuidado com "uma coincidência basta":** os experimentos de três fatores usaram dezenas de repetições; a evidência de **um evento** vem sobretudo da plasticidade de platô (Bittner 2017). O caminho (i) tem apoio, mas mais estreito do que parecia.
   - **Decidido (responsável, 17h51): opção B** — mesmo com o terceiro fator, exigem-se **algumas repetições**, bem menos do que sem ele; o terceiro fator encurta o caminho, não o elimina. Isto **substitui** a formulação "uma coincidência + terceiro fator cria" do caminho (i) aprovada às 17h43. Número de repetições: aberto (os protocolos da literatura não dão um mínimo).
3. **Caminho (ii), recorrência sem terceiro fator:** candidatos da literatura — a marca dura até ~3 h; repetições só somam se espaçadas (~1 h, refratário de 30–60 min); ~3 repetições saturam. O Sdom usou 4 h para fechar; fica perto do limite da marca.
4. O robô vive em **tempo real contínuo**, então esses tempos valem diretamente, sem conversão.
- **Decidido (responsável, 17h52):** desenho do caminho (ii) aprovado (marca de até ~3 h; repetição só soma depois do refratário de 30–60 min; ~3 repetições espaçadas fecham). Número do caminho (i): **para começar, 10% do exigido no caminho (ii)**, a calibrar.
  - A esclarecer: 10% de 3 repetições dá 0,3, menos de uma, o que voltaria a "uma basta" e contrariaria a opção B. Falta definir em que unidade o "exigido" é medido (repetições espaçadas, coincidências ou quantidade acumulada na marca).
  - **Decidido (17h54): quantidade acumulada na marca.** Cada coincidência soma um pouco à marca; a formação fecha quando a marca atinge um **limiar**. No caminho (i), com terceiro fator, fecha com **10% do limiar**; a contribuição de cada coincidência é pequena o bastante para que ainda sejam necessárias algumas (menos de 10% do limiar por coincidência). Valores a calibrar.
  - Proposta de compatibilização (nossa, a confirmar na implementação): dentro do refratário (30–60 min), as contribuições de uma mesma sessão somam até cerca de 1/3 do limiar, de modo que ~3 sessões espaçadas fechem o caminho (ii).
- **Responsável (17h47), sobre a janela da dopamina:** "de certa maneira, nós teremos uma relação de canal e local também. Então a gente tenta seguir mais ou menos na mesma linha." **Confirmado (17h48):** a janela de cada modulador varia também conforme o **local** (como estriado × hipocampo), e no nosso espaço o local se relaciona com o **canal** (as unidades nascem perto das fontes). Ponto a cuidar: no cérebro as regiões são herdadas; no nosso espaço não há regiões pré-definidas, então "local" é definido pela relação com o canal (por exemplo, a região das unidades ligadas à cóclea tem a janela adequada à resolução da cóclea), não por um mapa pronto.
4. **Achado lateral:** antes da audição, a própria cóclea gera atividade espontânea (células de suporte liberam ATP), que desaparece depois do início da audição (Tritsch et al. 2007). Equivalente: atividade intrínseca na Utrd antes da experiência. É andaime herdado; incluir ou não é decisão do responsável.
- A verificar pela metodologia (hipótese, não decisão): na biologia, fibras aferentes parecem existir antes da experiência, refinadas depois pela atividade (de memória; pesquisar). Se for assim, "Upro criadas conforme as transduções" precisa da justificativa de simplificação agnóstica (mecanismo, equivalência, perdas).
- **Princípio do responsável (17h10):** seres biológicos são darwinianos e nascem com arquitetura herdada; o sistema agnóstico de substrato não se vale disso ([metodologia](program-methodology.md)). Rascunho da justificativa (proposta nossa): **mecanismo** — fibras aferentes presentes antes da experiência, pela herança; **equivalência** — o sistema não herda caminhos, então as Upro surgem das transduções pela Pcrt; **perdas** — organização inicial pronta (por exemplo, tonotópica) e o ganho de tempo que ela dá; **teste** — variante com Upro pré-existentes (aleatórias ou ordenadas) como comparação.

### O motor v2 hoje (diferenças)
1. A Utrd não é uma unidade: é só um identificador de canal; a conversão acontece fora do motor.
2. Só existe o sentido aferente; não há Utrd eferente.
3. A conversão é mínima: emite magnitude 1 e efeito 0 quando a medida muda (a decisão de 10/11 é magnitude pela variação).
4. Não há fontes endógenas (interocepção) ainda.

### Hipóteses da Utrd eferente (o responsável pediu o método completo, 10/11/2026, 16h02)
- **(a)** A Utrd eferente leva só aos atuadores, ou também a outros sistemas internos fora do domínio (por exemplo, o sistema modulador)?
- **(b)** A ligação Utrd eferente → canal atuador é fixa, dada pelo corpo, ou também se forma?

Leitura que a pesquisa assumiu: "domínio ≈ córtex". **Corrigida em 10/11/2026 (16h12), a pedido do responsável:** a fronteira do Sdom é **funcional, não anatômica** (v43: "operational distinctions, not anatomical ones"; o Sdom existe onde as organizações sustentam relações representacionais, e a primeira representação o inaugura). Um neurônio cortical sem representação constituída não é domínio; uma estrutura fora do córtex pode participar. A lista dos destinos (motoneurônios, núcleos moduladores, autônomo, receptores) continua fora do domínio por não sustentar relações representacionais, não por estar fora do córtex. Ver seção 0 (agora guiada pelo texto do responsável).

#### Literatura — hipótese (a): para onde vai a eferência
1. **Músculos, por circuitos espinhais e do tronco.** A via corticoespinal raramente comanda o motoneurônio sozinha: o controle motor resulta da rede inteira, não de um comando do cérebro para a medula; ligações diretas córtex → motoneurônio existem em primatas e servem sobretudo à destreza das mãos (Lemon 2008, *Annu. Rev. Neurosci.* 31:195–218; **texto integral**, lido por ferramenta de resumo).
2. **Os próprios sentidos.** A via corticoespinal tem projeção ao corno dorsal em todos os mamíferos e é fonte importante de **inibição pré-sináptica das fibras sensoriais**, o que poderia remover a retroaferência previsível durante o movimento (Lemon 2008, p. 201). O córtex auditivo chega à cóclea pelo sistema olivococlear, que é a via final e obrigatória para modular a membrana basilar e o nervo auditivo (Terreros e Delano 2015, *Front. Syst. Neurosci.* 9:134; trechos do texto integral). Os motoneurônios gama ajustam a sensibilidade dos fusos musculares; no gato há controle independente claro, no ser humano o efeito independente é modesto (Prochazka 2015, *J. Anat.* 227:167–177, e revisões citadas; **resumos e trechos**).
3. **Sistema autônomo e endócrino.** Por vírus da raiva transneuronal em macacos *Cebus*, 63% dos neurônios corticais que influenciam a medula da adrenal estão na rede motora (todas as áreas motoras frontais) e quase 25% no pré-frontal medial; as áreas motoras agem pela medula espinhal e formação reticular, as pré-frontais mediais por hipotálamo, substância cinzenta periaquedutal e formação reticular. Os autores concluem que os comandos viscerais saem das mesmas áreas que preparam e geram o movimento, mas o estudo **não** mostra que os mesmos neurônios façam as duas coisas (Dum, Levinthal e Strick 2016, *PNAS* 113(35):9922–9927, PMC5024624; **texto integral**, lido por ferramenta de resumo; confiança alta nos percentuais).
4. **Núcleos moduladores.** O pré-frontal é uma das poucas entradas corticais do locus coeruleus (noradrenalina), em relação recíproca (Ramos e Arnsten 2007, *Pharmacol. Ther.* 113:523–536, citando Arnsten e Goldman-Rakic 1984, *Brain Res.* 306:9–18; **revisão lida em trechos; o artigo de 1984 não foi lido**). O locus coeruleus, por sua vez, faz sinapse com os neurônios olivococleares (Delano, revisão da Universidade do Chile; trechos).
5. **Uma via, várias funções.** "A single neuroanatomical pathway can mediate many different functions": a via corticoespinal participa do controle da entrada aferente, do bloqueio de reflexos, da excitação e inibição de motoneurônios, do controle autônomo, da plasticidade e de efeitos tróficos (Lemon 2008, p. 201).

**Conclusão (a):** o modelo neurobiológico **não sustenta** "só atuadores". A eferência do córtex chega a quatro classes de destino fora dele: (i) atuadores, quase sempre por circuitos intermediários (reflexos, via final comum); (ii) os próprios sentidos (ganho e bloqueio da entrada); (iii) sistema autônomo e endócrino; (iv) núcleos moduladores.

#### Literatura — hipótese (b): fixa ou formada
1. **Motoneurônio → músculo: dada pelo corpo.** Uma rede de fatores de transcrição Hox estabelece a identidade de cada grupo de motoneurônios e o músculo-alvo; sem o cofator FoxP1, os axônios escolhem trajetos e músculos ao acaso (Dasen et al. 2005, *Cell* 123:477–491; Dasen et al. 2008, *Cell* 134:304–316; Dasen e Jessell 2009; **resumos**). Depois do nascimento há **poda dependente de atividade** da inervação múltipla de cada fibra (em roedores, nas três primeiras semanas), que refina quantos axônios ficam, não qual músculo (Lee, PMC7144835, ano não conferido; **resumo e introdução**). Nota para a discussão das glias: as células de Schwann terminais participam dessa poda (Lee, Thompson e Harlow, PMC5732880; **resumo**).
2. **Córtex → medula: formada pela atividade e pela experiência.** A via corticoespinal é o último sistema motor a se desenvolver; os sistemas do tronco já estão bem desenvolvidos ao nascer. O refinamento (eliminação de terminações transitórias e crescimento para novos alvos) é dirigido pela atividade do córtex motor e pela experiência motora do membro: no gato, silenciar o córtex (semanas 3 a 7) ou impedir o uso do membro deixa conexões alteradas de forma duradoura; os terminais **competem**, os mais ativos ganham espaço, e os perdedores "do not catch up" (Martin 2005, *The Neuroscientist* 11(2):161–173; **texto integral**, lido por ferramenta de resumo; confiança média nas semanas). A organização topográfica básica do mapa motor não mudou com treino, e ganhos do treino se desfizeram em cerca de 4 meses (mesma fonte).
3. **O córtex motor começa como estrutura sensorial.** Em ratos, M1 primeiro codifica os movimentos produzidos pelo próprio corpo, sobretudo os espasmos do sono ativo; a estimulação de M1 só passa a produzir movimento por volta de P25–P35 (dado citado pelos autores, com divergência na literatura); antes disso os movimentos dependem do tronco, como o núcleo rubro. Os autores **propõem, sem testar**, que esse mapa sensorial sirva de referência para dirigir a saída motora ao alvo eferente correto (Glanz, Dooley, Sokoloff e Blumberg 2021, *J. Neurosci.* 41(32):6905–6918; **texto integral**, lido por ferramenta de resumo).
4. **Espasmos treinam os mapas.** Revisão: espasmos mioclônicos do sono ativo ajudam a desenvolver e manter mapas sensório-motores (Tiriac, Sokoloff e Blumberg 2015, PMC4334153; **resumo e introdução**). Precedente em robôs: espasmos imitados num modelo musculoesquelético levam à auto-organização do circuito básico (Blumberg, Marques e Iida 2013, *Current Biology*; **resumo**).

**Conclusão (b):** são **duas ligações diferentes**. A ligação final (motoneurônio → músculo) é **dada pelo corpo**, com poda que só refina. A ligação de cima (córtex → circuitos motores) **forma-se pela atividade e pela experiência**, com competição, e o córtex motor primeiro representa o movimento produzido pelo corpo e só depois passa a produzi-lo. Isso bate com a decisão de 10/11 sobre a via eferente ("representação criada a partir do representado pelos movimentos reflexos").

### Objeção do responsável à proposta (a) (10/11/2026, 17h56)
"Se uma unidade transdutora faz via eferente para uma unidade neuromoduladora, isso significa que já estamos pressupondo que são fora do domínio representacional. E eu ainda não tenho certeza quanto a isso."
- Procede: a linha "sistema modulador entra já como destino da Utrd eferente" pressupõe que ele está fora do Sdom, contra o princípio "nada incluído nem excluído por antecipação". **Essa linha fica suspensa.**
- Alternativa (proposta nossa, a decidir): tratar a liberação de modulador como uma **propriedade** que uma unidade pode ter (como a propriedade marca-passo), alcançada por Upro; se essa unidade pertence ou não ao Sdom passa a ser uma questão **empírica** (a tríade), não de desenho. Pesquisa sugerida antes de decidir: os núcleos moduladores mostram organização diferenciada e aprendida (respostas específicas a estímulos, plasticidade das entradas, módulos com alvos próprios)?

### Conclusão do responsável sobre os moduladores (10/11/2026, 18h54)
A tabela ([neuromoduladores](neuromodulators-sources-v0.md)) mostra que **a imensa maior parte da neuromodulação é feita pelas próprias unidades**, os nós do grafo temporotopológico (no cérebro, neurônios que integram entradas). Logo, **muito pouco** depende de Utrd eferente exportando incidências para fora do domínio. Próximo passo pedido: aprofundar **glias e adenosina**.

### Proposta mínima agnóstica de substrato (proposta nossa; aguardando decisão)
**(a) Destinos da Utrd eferente**
| Destino | Recomendação | Motivo | Perda declarada se ficar fora |
|---|---|---|---|
| Atuadores, pela via final comum (soma com o reflexo; pode inibir o reflexo) | **Entra já** | Sem ela não há movimento a partir do domínio; já decidido em [via eferente](efferent-path-v0.md) | — |
| Sistema modulador | **Suspenso (17h56)** — ver objeção acima | O sistema modulador está fora do domínio; hoje o motor liga a surpresa ao marca-passo da novidade por dentro, sem Utrd. Com a difusão espacial aprovada, o caminho domínio → moduladores precisa ser explícito | — |
| Sentidos (ganho e bloqueio da entrada) | **Depois** | Útil, mas não necessário para os primeiros testes; o robô pode começar com ganho fixo; os movimentos dos olhos já são atuadores | Sem cancelamento periférico da retroaferência; o cancelamento fica só pela expectativa (descarga corolária) dentro do domínio. Teste: comparar com e sem ganho eferente quando entrar |
| Autônomo e interocepção (bateria, temperatura) | **Depois, com alerta** | O robô não tem atuador autônomo hoje; ligar o domínio à própria homeostase toca o alerta de ANCHOR ("querer mínimo") | Sem regulação do próprio corpo pelo domínio; registrar no pré-registro |

**(b) Fixa ou formada**
1. **Utrd eferente → canal atuador: fixa, dada pelo corpo.** Uma Utrd eferente por canal atuador, com identificador opaco, definida pela especificação do robô (equivalente ao par motoneurônio-músculo). Perda declarada: sem poda da inervação redundante. Ela só refina força e não muda o alvo, então a perda parece pequena; testável comparando com ganhos de saída plásticos.
2. **Domínio → Utrd eferente: formada pela experiência**, pelos mesmos processos do domínio (Pcrt, fortalecimento por confirmação, inibição entre concorrentes), nascendo do movimento já representado (via inversa por Upro recíprocas, já decidida). Antes disso, só reflexos e movimentos espontâneos do corpo.
3. **A decidir:** período crítico imposto (como as semanas 3 a 7 no gato) ou emergente da consolidação. Recomendação: **não impor**; deixar emergir e medir.

## 2. Upro (unidade de propagação) — revisão iniciada em 10/11/2026, 20h05

### 2.1 Como está no motor v2 (lido no código)
- Campos: `{id, from, to, delayMs, gain, dEffect}`.
- Criação: junto com a Uint, no mesmo evento.
  - Excitatórias: das incidências constituintes para a Uint nova. Atraso = intervalo vivido + 1 ms; ganho inicial 0,6 (uma incidência sozinha não atinge o limiar 1; duas coincidentes atingem).
  - Inibitórias (decisão D2, validada em 09/11): recíprocas entre a Uint nova e até 16 concorrentes que compartilham origens. Ganho **fixo** 0,5; atraso 1 ms.
- Plasticidade: confirmação fortalece (taxa 0,1, teto 1); incidência tardia enfraquece (0,1) e encurta o atraso; convergência falha alonga a anterior e encurta a atual.
- Não há: marca, nível de estabilidade, velocidade de propagação (nome decidido em 10/11, 20h27; antes chamada "mielinização").

### 2.2 Pontos, um a um
| # | Ponto | Estado |
|---|---|---|
| U1 | Atraso: basal pela distância, acelerado devagar; teto de ~100 ms (C1) | **decidido**; implementar após o item (iii) |
| U2 | Ganho inicial 0,6 (o TEMPO usa 0,3, com outro limiar) | calibração; não bloqueia; fica para depois |
| U3 | Sinal na aresta (`dEffect`) ou na unidade de origem (princípio de Dale)? | **a decidir** |
| U4 | Inibitórias criadas na constituição com ganho fixo × plasticidade inibitória pela experiência | **a decidir** |
| U5 | Campos novos exigidos pelas decisões de hoje: marca, nível de estabilidade, velocidade de propagação; ordem e carimbo como relações | ver 2.11 |

### 2.3 U3 — literatura
| Achado | Fonte | Leitura |
|---|---|---|
| A expressão "princípio de Dale" foi cunhada por Eccles (1954): um neurônio libera o mesmo transmissor (ou conjunto) em todas as sinapses. A regra "um neurônio, um transmissor" está se mostrando falsa: várias populações liberam também GABA. | revisão de coliberação de GABA, *Nat. Rev. Neurosci.* 17 (2016) (autores não conferidos; laboratório Sabatini pelo endereço) | trechos |
| Neurônios motores liberam acetilcolina no músculo e glutamato em colaterais na medula: **ramos diferentes, transmissores diferentes**. | Hnasko e Edwards (2012), *Annu. Rev. Physiol.*; divulgação na *Scientific American* | resumo e trechos |
| Neurônios da área tegmentar ventral e do núcleo entopeduncular liberam glutamato **e** GABA na habênula lateral. | revisão de 2016 (acima) | trechos |

**Leitura:** a regra geral no córtex é a separação entre neurônios excitatórios e inibitórios (os interneurônios), mas há exceções. Pôr o sinal na aresta é uma simplificação mais permissiva que a biologia típica.

### 2.4 U4 — literatura
| Achado | Fonte | Leitura |
|---|---|---|
| O equilíbrio entre excitação e inibição pode ser estabelecido e mantido **pela experiência**, por plasticidade nas sinapses inibitórias. Isso explica o disparo esparso, dá um mecanismo homeostático e permite guardar memórias que ficam indistinguíveis do fundo, mas podem ser reativadas. | Vogels, Sprekeler, Zenke, Clopath e Gerstner (2011), *Science* 334, 1569–1573 | resumo |

### 2.5 Decisão U3 (responsável, 10/11/2026, 20h09)
O **sinal fica na Upro** (como está). Perda declarada: a restrição biológica típica de populações excitatórias e inibitórias separadas (princípio de Dale), que tem exceções conhecidas.

### 2.6 U4 — forma da regra de Vogels et al. (2011), lida no código de exemplo do simulador Brian
- A cada disparo da origem inibitória: peso += taxa × (traço recente do alvo − α), em que α corresponde a uma taxa-alvo de disparo.
- A cada disparo do alvo: peso += taxa × (traço recente da origem).
- Em palavras: a inibição **cresce** quando o alvo dispara perto da inibição (excitação demais) e **diminui um pouco** a cada disparo da origem com o alvo calado. O alvo tende a uma taxa-alvo.

**Opções:**
1. Manter a criação na constituição (D2) e tornar o ganho **plástico** por essa regra. Recomendada.
2. Manter tudo fixo (como está).
3. Não criar inibitórias na constituição; elas nasceriam só pela experiência. Exigiria um mecanismo que ainda não pesquisei.

### 2.7 Decisões e objeção do responsável sobre U4 (10/11/2026, 20h18)
- **Criação por dois caminhos:**
  - na concepção dos nós e arestas, quando a relação de inibição já deve existir (como D2);
  - **pela experiência**, especialmente quando algo mostra que uma relação aprendida estava errada.
- **O ganho não pode ser fixo.**
- **Objeção:** se a origem dispara e o destino fica calado, a Upro inibitória **não deve enfraquecer**: ela fez o seu papel, inibiu. Isso contesta o termo de enfraquecimento da regra de Vogels et al. (2011).

### 2.8 Literatura sobre a objeção e sobre o caminho pela experiência
| Achado | Fonte | Leitura |
|---|---|---|
| No córtex auditivo de camundongo (fatias), parear disparos pré e pós **fortaleceu** as sinapses inibitórias **independentemente da ordem**, dentro de ~10 ms. Nas excitatórias, a janela é assimétrica. A plasticidade inibitória precisou de sinapses excitatórias coativas. | D'amour e Froemke (2015), *Neuron* 86(2), 514–528 | resumo |
| Na mesma linha: a plasticidade dependente do tempo das sinapses inibitórias é **simétrica** (fortalece nas duas ordens). | Froemke (2015), *Annu. Rev. Neurosci.* 38, 195–219 | resumo e legenda de figura |
| A extinção **não apaga** o aprendizado original: é **aprendizado inibitório novo**, sobretudo dependente do contexto, movido pela correção do erro de previsão. | Bouton (2004), *Learning & Memory*; Todd, Vurbic e Bouton (2014); revisão de 2021 (PMC8428921) | resumo |
| Há também evidência de **apagamento parcial**, conforme o intervalo entre treino e extinção. | Barad (2006), *Learning & Memory*; Delamater e Westbrook (2014) | resumo |

**Leitura:**
- O experimento biológico mostra **fortalecimento por coatividade**. Não mostra o enfraquecimento pela "origem dispara, destino calado". Esse termo é uma escolha **do modelo** de Vogels, para manter uma taxa-alvo. A objeção do responsável tem apoio: não encontrei evidência experimental para esse termo nesta busca, o que não prova que ele não exista.
- A extinção apoia o segundo caminho de criação: quando uma relação aprendida falha, nasce inibição nova, e a original fica.

### 2.9 Proposta (nossa, para decisão)
- **Fortalecer:** a Upro inibitória fortalece quando a origem e o destino ficam coativos dentro de ~10 ms, em qualquer ordem.
- **Enfraquecer:** sem o termo "origem sem destino". O enfraquecimento vem só:
  - do decaimento lento da escada de estabilidade;
  - da correção, quando a experiência mostra que a própria inibição estava errada.
- **Nascer pela experiência:** quando uma relação excitatória aprendida prevê uma incidência e ela não acontece (erro de previsão negativo), nasce uma Upro inibitória vinda das unidades ativas no momento (o contexto) para o destino previsto. A relação original **não é apagada**.
- **Em aberto:**
  - o que conta como "a inibição estava errada";
  - o risco de a inibição só crescer, sem o termo homeostático (a observar em simulação).

### 2.10 Respostas do responsável aos pontos em aberto de U4 (10/11/2026, 20h24)
1. **O que mostra que a inibição estava errada:** a transdução aferente (ancoragem). O mundo mostra ocorrendo junto algo que foi representado como incompatível. O nó recebe incidências que não conseguem disparar o que foi inibido por engano, não há convergência, e isso **obriga a criar uma representação nova, corrigida**.
2. **A correção é construtiva, não destrutiva:** a inibição se corrige **criando de novo**. As convergências futuras vão para a representação corrigida, e a errada **decai por desuso até a poda**.

**Consequências:**
- A Upro inibitória não precisa de regra própria de enfraquecimento. Fortalece por coatividade e decai pela escada de estabilidade quando deixa de ser usada. O risco de a inibição só crescer fica resolvido pelo desuso.
- Isso combina com a extinção como aprendizado novo, sem apagamento (Bouton 2004), e com o item 1 da [auditoria](clear-implementation-audit-v0.1.md): a transdução alcança antes de criar; quando nada corresponde, há síntese.
- No motor atual, a convergência falha só ajusta atrasos (alonga a anterior, encurta a atual). Pela decisão C1 e por esta, ela passa a ser **ocasião de criação** de representação corrigida. Fica registrado para a implementação.

**U4 fechado.**

### 2.11 U5 — campos novos (10/11/2026, 20h26–20h27)
**Proposta (nossa):**
- três **campos** da Upro: marca (intensidade e momento em que foi posta), nível de estabilidade e velocidade de propagação;
- **ordem** e **carimbo de tempo** como **relações formadas**, não como campos. Gravá-los como dados entregaria pronto um conteúdo que a malha deve constituir.

**Nome:** o responsável trocou "mielina" por **velocidade de propagação** (registrado na [nomenclatura](nomenclature.md)). Tempo de propagação = distância ÷ velocidade de propagação; a velocidade parte de um basal e aumenta com o uso.

**Divisão campos × relações:** o responsável não objetou, mas também não confirmou explicitamente. Fica **pendente de confirmação**.

### 2.12 Correções do U5 (10/11/2026, 20h33–20h38)
- **Ordem:** é a **direção da Upro** (de origem para destino), e encadeada nas faixas longas. Não precisa de campo nem de nome (leitura do responsável, confirmada).
- **Carimbo de tempo: a questão estava fora de lugar** (responsável, confirmado). Não é campo nem objeto novo da Upro: é uma Upro comum cujo parceiro é uma Uint de dinâmica lenta. A relação temporal entre eventos distantes existe pelos parceiros lentos que eles compartilham ou não, sem aresta entre eles. Retirada a sugestão de nome "posição temporal do evento". **A pergunta vai para a revisão da Uint:** o que faz uma Uint ter dinâmica lenta (predisposição, como uma constante de tempo, ou dinâmica formada pela experiência)?
- **Campos da Upro que ficam:** marca, nível de estabilidade e velocidade de propagação. Nomes propostos para os dois primeiros: **marca de consolidação** e **nível de consolidação**. Aguardam o responsável.

### 2.13 U6 — ação da Upro conforme os moduladores presentes (pergunta do responsável, 10/11/2026, 20h40)
**Pergunta:** a Upro não precisa de algo como "ação por sinal", isto é, o que ela faz na presença de determinados neuromoduladores, que mudam sua ação?

**Literatura (resumo, salvo indicação):**
| Achado | Fonte | Leitura |
|---|---|---|
| A acetilcolina suprime a transmissão nas sinapses **intrínsecas** (entre neurônios corticais) e não nas **aferentes** (que chegam de fora). Isso impede que a lembrança do que já está guardado interfira na aprendizagem do novo. Em CA3, os receptores muscarínicos suprimem as conexões recorrentes, mas não as aferentes. | Hasselmo e Bower (1992); Hasselmo (2006), *Curr. Opin. Neurobiol.* | resumo e trechos |
| A acetilcolina também **reforça** a entrada aferente por receptores nicotínicos. | Hasselmo (2006) | trechos |
| Os moduladores controlam a **polaridade** da plasticidade dependente do tempo. O resultado (fortalecer ou enfraquecer) depende da ordem dos disparos e **da ativação relativa de receptores** ligados a duas vias internas. Moduladores colinérgicos e adrenérgicos controlam o **portão** e a **polaridade** da plasticidade cortical. Agonistas β-adrenérgicos aumentam a janela de tempo do fortalecimento. | Seol et al. (2007), *Neuron* 55, 919–929; Lin et al. (2003), citado | resumo e trechos |
| As ações dos moduladores muitas vezes não se resumem a "excitatórias" ou "inibitórias": mudam a dinâmica do circuito por várias influências paralelas, em várias escalas de tempo. | Nadim e Bucher (2014), *Curr. Opin. Neurobiol.* 29, 48–56; editorial de McCormick e Nusbaum | resumo |
| Os moduladores ajustam as propriedades das membranas e as conexões sinápticas de modo **específico por tipo de célula**. | revisão de interneurônios, *Curr. Opin. Neurobiol.* (2014) | resumo |
| Também agem nos canais do axônio e mudam a propagação até as sinapses. | revisão de 2019, *Front. Cell. Neurosci.* | resumo |

**Leitura:** sim. A mesma presença de um modulador faz coisas diferentes em sinapses diferentes, em duas dimensões:
- **transmissão:** suprime algumas e reforça outras;
- **plasticidade:** abre ou fecha o portão, muda a janela e pode **inverter a polaridade**.

O que decide é o conjunto de receptores daquela sinapse, que depende do tipo de célula e da via.

**Proposta (nossa):**
- Cada Upro tem um **perfil de resposta a cada modulador**, com duas partes: efeito na transmissão (multiplica o ganho) e efeito na plasticidade (portão, janela, polaridade).
- **Origem do perfil:** predisposição pela **classe** da Upro (aferente, vinda de Utrd, × intrínseca, entre Uint; excitatória × inibitória). Isso é coerente com a decisão de janelas por modulador e por local definido pelo canal. Não entrega conteúdo pronto: diz como a aresta responde, não o que ela representa.
- **Perdas:** a diversidade real de receptores e vias internas; a mudança de expressão de receptores com a experiência (não pesquisada).

**Nome:** "ação por sinal" é a expressão provisória do responsável. Na nomenclatura, "sinal" já designa o sinal do efeito (+ ou −), o que pode confundir. Fica a decisão do nome com o responsável.

### 2.14 Decisões de U6 (responsável, 10/11/2026, 20h44)
1. **Sim:** o perfil entra na Upro.
2. **Sim:** o perfil vem da classe da Upro, como predisposição.
3. **Nome:** **ação sob modulação**, proposto pelo responsável e registrado na [nomenclatura](nomenclature.md).

**Pendentes da Upro:** os nomes **marca de consolidação** e **nível de consolidação** (U5).

### 2.15 Upro fechada (10/11/2026, 20h45)
Nomes aprovados: **marca de consolidação** e **nível de consolidação**.

**Especificação revista da Upro:**
- **Existência e nascimento:** só com destino; nasce das transduções, junto com a Uint. As inibitórias nascem na concepção (quando a inibição já deve existir) e pela experiência (quando uma relação aprendida se mostra errada; a correção é construtiva).
- **Direção:** de origem para destino. É a ordem.
- **Tempo de propagação:** distância ÷ **velocidade de propagação**. A velocidade parte de um basal e aumenta devagar com o uso; teto de ~100 ms (C1, a implementar).
- **Ganho:** plástico. Nas excitatórias, regra comum (fortalece por confirmação). Nas inibitórias, fortalece por coatividade dentro de ~10 ms em qualquer ordem, sem termo de enfraquecimento próprio. Todas decaem pelo **nível de consolidação** e são podadas por desuso.
- **Sinal do efeito:** na Upro (perda declarada: princípio de Dale).
- **Marca de consolidação:** intensidade e momento; ~3 h.
- **Nível de consolidação.**
- **Ação sob modulação:** perfil por classe (transmissão; plasticidade: portão, janela, polaridade).
- **Calibração pendente:** ganho inicial (U2).
- **Movido para a revisão da Uint:** a pergunta das unidades de dinâmica lenta (antigo "carimbo").

## 3. Uint (unidade integradora) — revisão iniciada em 10/11/2026, 20h46

### 3.1 Como está no motor v2 (lido no código)
- **Nascimento:** num evento de convergência de ≥2 incidências. Recruta elementos do substrato perto do centro das fontes, preferindo os **mais excitáveis**, como a alocação de engrama.
- **Integração:** potenciais excitatório e inibitório separados; limiar 1; janela de disponibilidade proporcional ao intervalo vivido que a formou.
- **Refratário:** 5 ms.
- **Estado próprio:** nível e força (estabilidade **na unidade**), nível hierárquico, posição.
- **Não há:** liberação de moduladores (decidida em 10/11), constante de tempo lenta, supressão longa após disparar.

### 3.2 Pontos, um a um
| # | Ponto | Origem |
|---|---|---|
| I1 | **Supressão após disparar:** 5 ms é curto demais para a peça "supressão" da fila competitiva (os itens de uma sequência duram centenas de ms) | decisão de 20h01 |
| I2 | **Dinâmica lenta:** o que faz uma Uint mudar devagar (constante de tempo como predisposição × dinâmica formada) | U5, antigo "carimbo" |
| I3 | **Estabilidade na Uint e na Upro:** o motor guarda nível na Uint; a revisão pôs o nível de consolidação na Upro. Fica nos dois, ou só na Upro? | U5 |
| I4 | **Liberação de moduladores** por algumas Uint e adenosina como subproduto de todas | decisão de 19h02 |
| I5 | **Janela de disponibilidade** ligada ao intervalo vivido; precisa ser revista com C1 | C1 |
| I6 | **Marca-passos** e atividade de fundo (para as cadeias C2(b)) | itens (ii) e (iii) |

### 3.3 Respostas do responsável (10/11/2026, 20h48)
- **I3:** "Uint também tem sua consolidação." Fica nos dois: nível de consolidação na Upro **e** na Uint. **Decidido.**
- **I4:** pergunta se a adenosina como subproduto tem função. Resposta abaixo, em 3.4.
- **I6:** observou que eu não formulei a pergunta. Formulada em 3.8.
- **I1, I2 e I5:** "aplique o método".

### 3.4 I4 — a adenosina como subproduto tem função?
Sim, duas, e nenhuma carrega conteúdo (detalhe e fontes em [glias e adenosina](glia-adenosine-v0.md), seção 1):
1. **Freio rápido e local** (segundos a minutos): neurônios que disparam muito liberam adenosina, que deprime a transmissão excitatória pelo receptor A1. Os autores propõem um sinal de "fadiga" contra o esgotamento metabólico (Lovatt et al. 2012). Sem o freio microglial pela adenosina, a atividade se amplifica e sincroniza, com crises (Badimon et al. 2020).
2. **Pressão lenta e acumulada** (horas): sobe na vigília prolongada e cai no sono (Porkka-Heiskanen et al. 1997; Peng et al. 2020).

Leitura agnóstica (nossa): é uma **conta de gasto** que vira retroalimentação negativa em duas escalas.

### 3.5 I1 — supressão após disparar (método)
**Hipótese:** a peça "supressão" da fila competitiva exige que a Uint que disparou fique menos excitável por centenas de ms, e não por 5 ms.

| Achado | Fonte | Leitura |
|---|---|---|
| Três pós-hiperpolarizações após os disparos: rápida (~10 ms), média (50–100 ms) e lenta (~3–20 s), somando de 10 ms a 30 s. | Sahu e Turner (2021), *Front. Physiol.* 12:759707 | resumo e trechos |
| A lenta aparece depois de **salvas** de disparos e cresce com elas, controlando a adaptação da frequência. Duração típica de 1–5 s após 5–10 disparos. | Sahu e Turner (2021); Andrade, Foehring e Tzingounis (2012), *Front. Cell. Neurosci.* 6:47 | trechos |
| A lenta é fortemente regulada por moduladores: a noradrenalina (β) e a histamina (H2) a **inibem** e reduzem a adaptação. | Andrade et al. (2012), citando Madison e Nicoll (1982) e Haas e Konnerth (1983) | trechos |
| Até neurônios de disparo rápido, depois de ativação longa (~20 s), ficam menos excitáveis por dezenas de segundos. | Descalzo et al. (2005) | trechos |

**Mínimo:** a Uint tem uma **supressão após disparar em três escalas** (~10 ms, ~50–100 ms e segundos). A componente lenta cresce com a quantidade de disparos recentes. A média cobre a supressão de item da fila competitiva; a lenta dá adaptação.

**Proposta:**
- três constantes, como predisposição por classe de Uint;
- a componente lenta é modulável: os moduladores a reduzem, como a ação sob modulação da Upro, agora na Uint.

**Perdas:** os canais específicos, e a mistura com a bomba de sódio e potássio.

### 3.6 I2 — dinâmica lenta (método)
**Hipótese:** algumas Uint precisam mudar devagar (minutos a horas) para que a ligação com elas dê a posição de um evento no tempo.

| Achado | Fonte | Leitura |
|---|---|---|
| Neurônios da camada V do entorrinal respondem a estímulos sucessivos com mudanças **graduais** de frequência que ficam **estáveis** depois de cada estímulo, por minutos, mesmo sem entrada de outros neurônios. É uma capacidade **intrínseca** do neurônio. | Egorov et al. (2002), *Nature* 420, 173–178; Frank e Brown (2003), *Trends Neurosci.* | resumo |
| O mecanismo proposto é uma corrente catiônica sensível ao cálcio, que depende de acetilcolina. | Fransén et al. (2006), *Neuron*; Fransén, Alonso e Hasselmo (2002) | resumo e trechos |
| Modelo: um conjunto de **integradores com vazamento**, com um **espectro de constantes de tempo**, representa o passado de forma comprimida; uma segunda camada gera unidades que disparam em sequência (como células de tempo) e são invariantes à escala. | Howard, Shankar, Aue e Criss (2015), *Psychol. Rev.* 122, 24–53; Tiganj, Hasselmo e Howard (2015) | resumo e trechos |
| Constantes de tempo das células em rampa do entorrinal lateral: de minutos a centenas de minutos. Mecanismo não estabelecido. | Tsao et al. (2018), material suplementar | trechos |

**Leitura:** há duas vias biológicas, a intrínseca (persistência gradual da célula) e a de rede (não estabelecida no entorrinal lateral). O modelo de Howard mostra que um **espectro** de constantes basta.

**Mínimo:** cada Uint tem uma **constante de tempo de integração**, e o conjunto das Uint cobre um espectro largo, de ms a horas.

**Proposta:**
- a constante é **predisposição**, atribuída quando a Uint nasce, a partir de uma distribuição em escala logarítmica, por classe ou por local;
- o **conteúdo** do que ela integra vem da experiência;
- a persistência é modulável pela acetilcolina (ação sob modulação).

**Equivalência:** espectro de integradores com vazamento.

**Perdas:** o mecanismo intrínseco específico e a contribuição da rede.

**Alternativa a testar:** sem espectro (todas iguais), para ver se a lentidão surge da rede.

### 3.7 I5 — janela de disponibilidade (método)
**Hipótese:** a janela em que uma Uint soma incidências deve ser uma propriedade dela, e não vir do intervalo vivido (o que C1 já invalidou).

| Achado | Fonte | Leitura |
|---|---|---|
| A janela de integração é dada pela constante de tempo da membrana, de dezenas de ms. Com atividade de rede alta *in vivo*, a resposta encolhe e a janela **encurta** muito. | Léger et al. (2005), *J. Neurophysiol.* 93, 281–293; Bernander, Koch e Douglas (1991) | resumo e trechos |
| A corrente NMDA decai em duas fases nas piramidais do hipocampo: ~66 ms e ~354 ms (média). | Perouansky e Yaari (1993), *J. Physiol.* | resumo; confiança alta no número, mas hipocampo de rato |
| Platôs dendríticos põem a piramidal num "estado preparado" de **200–500 ms**, mais excitável. | Milojkovic, Antic et al. (2020), *J. Neurophysiol.* (PMC8087381; autores conferidos só em parte) | resumo |

**Mínimo:** a janela é uma **propriedade intrínseca** da Uint, com uma componente rápida (dezenas de ms) e uma lenta (centenas de ms). Ela encurta quando a atividade de fundo é alta.

**Proposta:**
- a janela é predisposição por classe e não depende do intervalo vivido;
- ela encurta com a atividade de fundo (a atividade da própria malha, não um parâmetro de estado);
- é coerente com a janela de formação de 120 ms já usada (TEMPO).

**Perdas:** a geometria dendrítica.

**Observação:** I1, I2 e I5 são o mesmo tipo de coisa: **constantes de tempo intrínsecas da Uint** (integração, supressão e persistência).

### 3.8 I6 — a pergunta sobre os marca-passos
**Fatos já registrados:**
- "Incidências só surgem de transdução ou de marca-passos" (responsável, 09/11, [nomenclatura](nomenclature.md)).
- A primeira avaliação dos marca-passos está em [marca-passos v0.1](pacemakers-v0.1.md).
- Hoje: a atividade de fundo para formar as cadeias C2(b) provavelmente vem deles.

**Literatura nova relevante:** antes da visão, a retina imatura gera **ondas espontâneas** de salvas sincronizadas (salvas de alguns segundos, separadas por 1–2 minutos de silêncio) que organizam as conexões visuais antes de qualquer estímulo (Meister, Wong, Baylor e Shatz 1991, *Science* 252, 939–943; Wong 1999, *Annu. Rev. Neurosci.*; resumos). Isso é atividade espontânea **formando estrutura sem mundo**.

**Pergunta:**
1. Os marca-passos são **predisposição presente desde o início**, como as Utrd, ou uma **propriedade que algumas Uint adquirem**?
2. As incidências dos marca-passos podem **participar da formação** de Uint e Upro sem transdução (como as ondas da retina, que organizam a estrutura antes do mundo)? Ou só **sustentam e cadenciam** a atividade, sem criar nada sozinhas?

**Tensão com a regra da arquitetura herdada:** se a atividade espontânea criar estrutura sem mundo, o sistema ganha organização que não veio da experiência. A biologia faz isso (é parte da herança darwiniana). Para o nosso sistema, pode ser justamente o que não se deve entregar pronto.

### 3.9 Decisão I1 e pergunta do responsável sobre os marca-passos (10/11/2026, 20h56)
- **I1 decidido:** a Uint tem supressão após disparar em três escalas (~10 ms, ~50–100 ms e segundos), como predisposição por classe. A componente lenta cresce com os disparos recentes e fica sob modulação.
- **Pergunta:** na neurobiologia, os marca-passos têm "regras" de disparo ligadas às concentrações do meio? Isso se relaciona aos neuromoduladores? "Se sim, teremos que refletir."

**Literatura (resumo e trechos):**
| Concentração do meio | Achado | Fonte |
|---|---|---|
| **O próprio modulador (autorregulação)** | A dopamina liberada pelo soma e pelos dendritos ativa receptores D2 inibitórios nos próprios neurônios de dopamina (via canais GIRK). É uma retroalimentação ou inibição lateral que regula a atividade deles. A dopamina **desacelera o ritmo** de marca-passo, mesmo com os GIRK bloqueados (via canal NALCN). | Courtney, Mamaligas e Ford (2012), *J. Neurosci.*; Philippart e Khaliq (2018), *eLife* 7:e40984 (autores pelo endereço, não conferidos) |
| **Outros moduladores** | A ativação de GABA-B também inibe o mesmo canal de marca-passo. O locus coeruleus recebe orexina, serotonina, histamina e outros. | eLife 2018 (acima); de Carvalho et al. (2014), *Front. Physiol.* 5:288 |
| **Química do corpo (CO₂/pH)** | Mais de 80% dos neurônios do locus coeruleus são quimiossensíveis e **aumentam o disparo** com CO₂ alto. Em fatias, a acidose hipercápnica aumentou o disparo em 93%. Neurônios de orexina também são sensores de pH e CO₂. | de Carvalho et al. (2014); Filosa, Dean e Putnam (2002), *J. Physiol.* 541, 493–509; nota em *Nat. Rev. Neurosci.* sobre Williams et al. (2007) |
| **Íons produzidos pela própria atividade** | A atividade locomotora reduz o cálcio extracelular (para 0,9 mM) e aumenta o potássio (para 6 mM). Essas mudanças **ligam e ajustam** as propriedades de marca-passo de interneurônios da medula. | Brocard et al. (2013), *Neuron* 77, 1047–1054 |
| | No complexo pré-Bötzinger, a frequência dos marca-passos aumenta com o potássio extracelular. Também há cálcio externo baixo acelerando os neurônios de dopamina. | Del Negro et al. (2001), *J. Neurophysiol.* 86, 59–74 (por resumo); Khaliq e Bean (2010), citado |

**Leitura: sim, a três coisas do meio:**
1. aos **moduladores**, inclusive ao próprio (autorregulação);
2. à **química do corpo** (CO₂, pH);
3. aos **íons que a própria atividade da rede muda**.

**O que pede reflexão (inferência nossa, para o responsável):**
- **R1. Laços fechados dentro do domínio.** Os neurônios de dopamina e do locus coeruleus são, ao mesmo tempo, marca-passos, fontes de moduladores e regulados por moduladores. Isso combina com a decisão de regulação pelas próprias Uint (19h02), e cria laços de retroalimentação **entre unidades**, não impostos de fora.
- **R2. Marca-passo como sensor do corpo.** Um marca-passo cujo ritmo depende de CO₂ ou pH está, na prática, **transduzindo um sinal endógeno**: o ritmo dele carrega informação sobre o estado do corpo. Isso aproxima o marca-passo da Utrd endógena e conversa com a pergunta I6: estaria na fronteira, como a Utrd?
- **R3. O meio como variável lenta.** Os íons que a atividade muda são outra "conta de uso", como a adenosina: a própria atividade altera o meio, que altera os marca-passos.
- **R4. Risco de variável regulada.** Se um marca-passo responde ao **desvio** de uma variável do corpo e o seu disparo leva à **correção** (como o CO₂ e a respiração), isso é um laço regulatório: território do VALORE. A decisão de 09/11 manteve o relógio fora da rota regulatória. Precisa de cuidado.

### 3.10 Decisão sobre R2 (responsável, 10/11/2026, 21h01)
"Ele responde a algo que sempre me incomodou: a falta de sensor 'interno'; perfeito. Seria uma Utrd; mas veja que mesmo geograficamente dentro… ainda é 'borda' de domínio representacional; porque ainda pega sinais que não são representacionais e os converte em incidências."

**Registro:**
- O marca-passo sensível à química do corpo (CO₂, pH e semelhantes) é uma **Utrd endógena**.
- Mesmo que fique geograficamente dentro, é **fronteira** do Sdom, porque converte sinais não representacionais em incidências.
- Reforça que a fronteira do Sdom é **funcional, não anatômica** (seção 0).
- Preenche a lacuna do **sensor interno**.

**Consequências a confirmar (inferência nossa):**
- **(a) Três tipos de dependência do meio, três tratamentos:**
  - química do corpo → **Utrd endógena** (transdução);
  - moduladores liberados por Uint do domínio → **ação sob modulação** (não é transdução: o sinal já é do domínio);
  - íons alterados pela própria atividade → **conta de uso**, como a adenosina.
- **(b) O marca-passo de ritmo puramente intrínseco**, sem dependência do meio, converte a própria química interna em incidências. Seria também uma Utrd? Se for, "incidências só surgem de transdução ou de marca-passos" se reduz a "incidências só surgem de transdução".
- **(c) R4 continua aberto:** uma Utrd endógena de CO₂ ligada a uma correção (respiração) forma laço regulatório, território do VALORE.

### 3.11 Decisões (a) e (b) (responsável, 10/11/2026, 21h07)
- **(a) Concordo:** química do corpo → Utrd endógena; moduladores do domínio → ação sob modulação; íons da própria atividade → conta de uso.
- **(b) "Perfeito, a regra ficou mais limpa":** marca-passos de ritmo intrínseco também são Utrd. Regra: **incidências só surgem de transdução** (registrado na [nomenclatura](nomenclature.md)).

**Consequências para I6 (inferência nossa):**
- I6.1 fica respondida: os marca-passos são Utrd, logo fronteira e predisposição presente desde o início (como as demais Utrd).
- I6.2 muda de forma. Incidências de marca-passo são transduções endógenas, e transduções podem formar Uint e Upro. Então a estrutura que elas formam vem da **experiência do corpo**, não é entregue pronta. Isso legitima algo como as ondas espontâneas da retina. **Confirmado pelo responsável (21h10: "Perfeito, coisa linda!").**
- A atividade de fundo para as cadeias C2(b) vem dessas Utrd endógenas.

### 3.12 Correção do responsável sobre o R4 (10/11/2026, 21h16)
"Calma que misturamos muita coisa aqui." O robô e a fase do motor foram **primeiros ensaios**; estamos redesenhando tudo, e "o que passou passou". A análise do R4 em termos do envelope da fase do motor **fica sem efeito**. O R4 volta a ser só uma pergunta conceitual do redesenho: quando uma Utrd endógena forma laço regulatório, e como tratá-lo. Aguarda o responsável.

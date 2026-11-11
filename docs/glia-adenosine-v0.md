# Glias e adenosina — aprofundamento v0

Data: 10/11/2026 (18h54, pedido do responsável). Situação: pesquisa e propostas nossas; **nada decidido**. Conecta-se a: [unidades moduladoras v0.1](modulatory-units-v0.1.md) (decisão de 09/11: "fontes gliais por território, com divisão por capacidade"; ciclo imposto agora, pressão homeostática depois), [texto-guia dos limites do Sdom](sdom-boundaries-guide.md) (hipóteses G1, G2, G3) e [tabela dos neuromoduladores](neuromodulators-sources-v0.md).

## 0. Decisão do responsável (10/11/2026, 19h02)
"Não temos, até o momento, base forte o suficiente que nos obrigue a postular unidades fora do domínio representacional para produzirem neuromodulação para regular o próprio domínio. Não estou dizendo que não existe nem que não acontece; no momento não temos base." **Escolha atual: usar as próprias unidades (no nosso caso, as Uint) para fazer a regulação.**
- Isto **substitui**, por ora, a decisão de 09/11 "fontes gliais por território" (que fica como variante de comparação).
- Cuidados levantados (a confirmar): (1) duas formas — propriedade de liberação em algumas Uint (equivalentes de noradrenalina, dopamina, acetilcolina) e subproduto da atividade de **todas** as unidades (equivalente da adenosina); (2) perdas declaradas: astrócito como componente do homeostato do sono (Ingiosi 2020) e portão territorial (Paukert 2014); freio microglial (Badimon 2020); variante glial para teste; (3) consequência: a detecção de novidade e de surpresa, hoje calculada de forma central pelo motor, terá de vir de unidades.

## 1. Adenosina

### 1.1 O que é e como se comporta no tempo
- A concentração extracelular **sobe com o metabolismo do cérebro**. No prosencéfalo basal de gatos, subiu na vigília espontânea em relação ao sono de ondas lentas, **subiu progressivamente na vigília prolongada** e **caiu devagar no sono de recuperação** (Porkka-Heiskanen et al. 1997, *Science* 276:1265–1268; resumo e legendas das figuras). Valores medidos nesse local (já registrados em [difusão espacial](spatial-diffusion-v0.1.md)): ~31 nM na vigília e ~24 nM no sono de ondas lentas.
- O efeito sobre o sono é **específico do local**: aumentar a adenosina no prosencéfalo basal mudou o sono; no tálamo, não (mesma fonte).
- Age sobretudo pelo **receptor A1**, inibitório: inibição pré-sináptica e hiperpolarização (comentário sobre Lovatt 2012, PMC3577085; trecho).

### 1.2 Quem a produz: três fontes, em debate
| Fonte | Evidência | Leitura |
|---|---|---|
| **Neurônios** | Neurônios que disparam muito liberam adenosina diretamente (por transportadores), deprimindo a transmissão excitatória; o ATP liberado por astrócitos **não** produziu essa depressão. Os autores chamam isso de retroalimentação autônoma durante atividade prolongada e propõem um sinal de "fadiga" contra o esgotamento metabólico (Lovatt et al. 2012, *PNAS* 109:6265–6270; resumo e trechos da discussão). No prosencéfalo basal, um sensor novo mostrou aumento **rápido e dependente de atividade** da adenosina; os **neurônios glutamatérgicos** contribuíram muito mais que os colinérgicos; sem eles, o aumento caiu e a homeostase do sono piorou (Peng et al. 2020, *Science* 369:eabb0556; resumo) | fonte principal e rápida, ao menos no prosencéfalo basal |
| **Astrócitos** | Bloquear a liberação dos astrócitos reduziu o acúmulo da pressão de sono, via A1 (Halassa et al. 2009, *Neuron* 61:213–219; resumo e trechos). Mas o cálcio dos astrócitos modulou o sono **sem** passar pela adenosina em outro estudo (Peng et al. 2023, *Cell Discovery* 9:16; resumo) | papel real no sono, mas a rota pela adenosina está em disputa |
| **Micróglia** | O ATP liberado na ativação atrai prolongamentos da micróglia, que o convertem (CD39 → AMP; CD73 → adenosina); a adenosina suprime os neurônios via A1. Sem micróglia, a atividade se amplifica e sincroniza, com crises (Badimon et al. 2020, *Nature* 586:417–423; resumo). Os autores comparam esse freio ao de neurônios inibitórios | retroalimentação negativa local |

### 1.3 Leitura agnóstica (nossa)
A adenosina **não carrega conteúdo**: é um **subproduto da atividade** (ATP gasto vira adenosina) que funciona como retroalimentação em **duas escalas**:
1. **Rápida e local** (segundos a minutos): freia o que está muito ativo (Lovatt 2012; Badimon 2020).
2. **Lenta e acumulada** (horas): pressão de sono, que se dissipa no sono (Porkka-Heiskanen 1997; Peng 2020).
É o mesmo papel do "resíduo" do gasto já usado no Sdom: uma conta de uso, não uma mensagem.

## 2. Glias

### 2.1 Astrócitos
- **Territórios:** em grande parte exclusivos (Bushong et al. 2002, já em [unidades moduladoras](modulatory-units-v0.1.md)). Um astrócito protoplasmático de roedor cobre ~20 mil a 120 mil sinapses; o humano, até ~2 milhões; o humano é ~2,6 vezes maior em diâmetro, com ~10 vezes mais prolongamentos primários (Oberheim et al. 2009, *J. Neurosci.* 29:3276–3287; Verkhratsky et al., revisão MDPI; resumos). Confiança média nos números.
- **Ganho controlado pela noradrenalina:** a noradrenalina "liga" os astrócitos para responder à atividade local; sem ela, raramente respondem ao estímulo visual (Paukert et al. 2014, *Neuron* 82:1263–1270; resumo). Leitura: o astrócito combina um **sinal global** (estado) com a **atividade local** do território — a forma de um terceiro fator territorial.
- **Sono:** o cálcio dos astrócitos é máximo na vigília e mínimo no sono, varia com a necessidade de sono, e reduzi-lo prejudica a resposta homeostática à privação: os autores concluem que é **componente do homeostato do sono** (Ingiosi et al. 2020, *Curr. Biol.* 30:4373–4383; resumo e trechos).
- **Gliotransmissão** (glutamato, D-serina, ATP): **controversa** em condições fisiológicas (Fiacco e McCarthy 2018 × Savtchouk e Volterra 2018).

### 2.2 Micróglia
- Poda de sinapses não funcionais e retroalimentação negativa por adenosina (Badimon et al. 2020; resumo).

### 2.3 Oligodendrócitos (mielina)
- A mielinização dependente de atividade muda a **velocidade de condução** e, portanto, o **tempo de chegada** dos sinais (Fields 2015, *Nat. Rev. Neurosci.* 16:756–767; resumo e trechos).
- **Escala de tempo:** mudanças de mielina que alteram de forma significativa a condução ocorrem mais provavelmente em **dias a semanas** (revisão *J. Neurosci.* 2017, 37:10023–10034, PMC6596541; trecho; autores não conferidos).
- **Divergência no motor v2:** o ajuste de atraso (`delayAdjustRate` = 0,5, citando Fields 2015) age **a cada evento**, isto é, rápido; a decisão de 09/11 diz "ajuste de atraso mais lento que o de peso". Precisa ser revisto.

## 3. Glias e os limites do Sdom (G1, G2, G3)
| Glia | Hipótese mais sustentada hoje | Observação |
|---|---|---|
| Micróglia (adenosina, poda) | **G1** — regula condições | Nenhuma evidência de organização específica de conteúdo nas fontes lidas |
| Astrócitos | **G1** sustentada; **G2** possível | Integram muitos sinais de um território e são controlados por estado; participação na especificação de conteúdo **não demonstrada** |
| Oligodendrócitos | **Pergunta aberta para o responsável** | Na CLEAR, o **tempo de percurso** faz parte do conteúdo da relação (malha temporotopológica). Se a mielina ajusta esse tempo, ela altera **a parte temporal do conteúdo** — isso é regular uma condição (G1) ou participar da constituição (G2)? |

## 3b. Tempo, mielina e conteúdo — aplicação do método (10/11/2026, 19h07)
**Afirmação do responsável:** o tempo é codificado nas malhas temporotopológicas e faz parte do conteúdo; mudar o tempo muda o conteúdo; portanto, mexer na mielina (ou em qualquer coisa que altere o tempo de resposta) mexe no conteúdo representado.

**Hipóteses derivadas:**
- **H1:** mudar o tempo de condução muda o conteúdo (o que é representado).
- **H2:** o ajuste do tempo pela mielina participa da **constituição** (aprendizagem e consolidação), não só das condições.

**Literatura:**
- **H1 — fenômeno de Pulfrich:** com um atraso num dos olhos (filtro ou desmielinização do nervo óptico), um pêndulo que oscila num plano é percebido numa **trajetória elíptica em profundidade**; o córtex interpreta a diferença de tempo entre os olhos como diferença de distância (Scotcher et al. 1997, *Br. J. Ophthalmol.*; Farr et al. 2018, *Neuro-Ophthalmology* 42:349–355; trechos do texto integral). Em pacientes com neurite óptica, o desempenho em movimento em profundidade piora com a diferença de latência entre os olhos (resumo de congresso da AAN; fraco).
- **H1 — localização do som:** a posição de uma fonte é codificada por diferenças de **microssegundos** entre os ouvidos; o comprimento dos axônios sozinho tornaria a codificação impossível, e o diâmetro e a distância entre nódulos de Ranvier (mielina) **compensam** (Seidl, Rubel e Harris 2010, *J. Neurosci.* 30:70–80; Seidl 2014, PMC3849146; resumos e trechos).
- **H2 — aprender exige mielina nova:** sem novos oligodendrócitos, camundongos não aprendem uma nova habilidade motora, mas executam as já aprendidas (McKenzie et al. 2014, *Science* 346:318–322; trechos do texto integral); bloquear a formação de oligodendrócitos durante ou logo após o treino prejudica a **consolidação** de memória espacial e de medo e impede o aumento do acoplamento entre ondas do hipocampo e fusos corticais (Steadman et al. 2020, *Neuron* 105:150–164; resumo); a preservação de uma memória de medo remota exige mielina nova, numa escala de semanas (Pan et al. 2020, *Nat. Neurosci.* 23:487–499; por comentário).

**Conclusões (nossas, a validar):**
1. **H1 sustentada:** diferenças de tempo são lidas como conteúdo (profundidade, posição). Uma mudança de tempo sem aprendizagem nenhuma (doença, filtro) produz conteúdo **errado** (ilusão) — o que mostra que o tempo carrega conteúdo e que o conteúdo continua ancorado no mundo (o erro é detectável contra o referente).
2. **H2 sustentada:** a mielinização adaptativa é **necessária** para aprender e consolidar; pelo critério do texto-guia (participar das operações que especificam o conteúdo), isso é **participação constitutiva**, não só condição.
3. **Agnóstico, sem unidade nova:** na nossa arquitetura o tempo de percurso é **propriedade da Upro** (o atraso); o equivalente da mielina é o **ajuste lento do atraso**, parte da Pcrt e da plasticidade. Isso respeita a decisão de 19h02 (regulação pelas próprias unidades). Perdas: um oligodendrócito mieliniza vários axônios (ajustes correlacionados entre Upro); diferença entre mielina nova e remodelagem da existente. Teste: variante sem ajuste de atraso (ablação já prevista como "atraso fixo").
4. **Duas fontes de mudança de tempo:** adaptativa (constitui) e perturbadora (distorce). Só a primeira entra como plasticidade; a segunda poderia ser modelada como ruído ou dano, para testar a ancoragem.
5. **Escala:** mielina nova e compacta leva **dias a semanas**; o ajuste atual do motor (a cada evento) está rápido demais.

## 3c. A mielina acelera ou atrasa? Conferência do motor (10/11/2026, 19h13)
**Hipótese do responsável:** a mielina serve para **acelerar**, não atrasar; os nervos partem de um **tempo basal** relacionado à **distância**, que pode ser acelerado. O motor trabalha com "atraso" — erramos?

**Literatura:**
- A mielinização **acelera** a condução (Arancibia-Cárcamo et al. 2017, *eLife* 6:e23329; resumo e trechos). A velocidade cresce de modo aproximadamente linear com o diâmetro, em axônios mielinizados e não mielinizados (Wang et al. 2008, *J. Neurosci.* 28:4047–4056; trecho).
- **Tempo basal = distância ÷ velocidade:** as diferenças de atraso entre axônios vêm de velocidade e distância; os atrasos vão de menos de 100 µs (axônios muito curtos) a **mais de 100 ms** (axônios centrais longos não mielinizados) (Swadlow e Waxman 2012, *Scholarpedia* 7(6):1451, via BioNumbers; trecho).
- **Isocronia por aceleração seletiva:** no caminho tálamo → córtex, a latência é quase constante (~2 ms) apesar das distâncias diferentes, porque o trecho longo até a substância branca é ~10 vezes mais rápido por mielinização seletiva (Salami et al. 2003, *PNAS* 100:6174–6179; resumo e trechos). O mesmo ocorre na localização do som (Seidl et al. 2010).
- **Ajuste fino nos dois sentidos, dentro do mielinizado:** variar o comprimento do nódulo de Ranvier muda a velocidade em ~20%, para mais ou para menos (Arancibia-Cárcamo et al. 2017; modelagem). Mesmo assim, a referência continua sendo o tempo basal: a mielina não deixa um axônio mais lento que sem ela; a perda de mielina devolve o axônio ao basal (leitura nossa; demielinização = condução mais lenta, Pulfrich).

**Veredito (nosso):** a hipótese do responsável é **sustentada**. E o motor v2 **diverge em três pontos**:
1. **Origem do atraso:** a Upro nasce com atraso = intervalo vivido entre as fontes + 1 ms (`engine-v2.js`, linha 300). Ou seja, o atraso é escolhido para produzir a coincidência, **não vem da distância**. A variante "latência derivada da distância" (aprovada em 09/11; `constitutive-space.js`: latência = distância ÷ velocidade + atraso sináptico) **não está ligada ao motor v2**.
2. **Direção do ajuste:** o motor **alonga e encurta** livremente (convergência falha empurra um atraso para cima; incidência tardia encurta até 1 ms). Pelo modelo biológico, o ajuste é **aceleração a partir do basal**, com teto no basal e piso na aceleração máxima; alongar só voltando ao basal (perda de mielina).
3. **Alcance:** o motor aceita intervalos de até **90 min** (`maxDelayMs`) como atraso de Upro. Atrasos de condução reais chegam a **dezenas a pouco mais de 100 ms**. Intervalos de segundos a horas **não podem** ser tempo de percurso de uma Upro; precisam ser representados de outro modo (por exemplo, por relações entre várias unidades). **Ponto mais grave; pesquisar como a biologia representa intervalos longos antes de propor.**

## 4. Proposta mínima agnóstica (nossa; a decidir)
1. **Adenosina como subproduto da atividade das próprias unidades:** cada descarga deixa uma pequena quantidade no local; ela se difunde (difusão espacial aprovada) e é removida devagar, mais depressa no sono. Efeitos: (a) **freio local** (A1: sobe o limiar ou reduz a magnitude onde há muita atividade); (b) o **nível acumulado** alimenta a propensão ao sono (processo S). Fonte neuronal como principal (Lovatt 2012; Peng 2020); mediação por astrócitos ou micróglia como variantes.
   - **Conflito com a decisão de 09/11** ("fontes gliais por território"): a evidência nova aponta fonte principalmente neuronal no prosencéfalo basal. Decisão do responsável.
2. **Unidade territorial do tipo astrócito:** integra lentamente a atividade do seu território; o **ganho** dela é controlado pelo modulador de estado (equivalente da noradrenalina); a saída é (a) contribuição para a necessidade de sono e (b) **portão territorial de plasticidade**. Começa como **G1**; o desenho permite testar G2.
3. **Mielina:** o ajuste de atraso passa a ser **lento** (dias a semanas), coerente com a decisão de 09/11 e com a literatura.
4. **Micróglia:** a poda já existe; o freio rápido entra pelo item 1.

## 5. Alerta de ANCHOR (já registrado no guia de continuidade)
A pressão de sono é **variável regulada** (ponto de ajuste). A decisão de 09/11 foi **ciclo imposto agora; ciclo completo com pressão homeostática depois** da fase do motor. O item 1(b) traz o processo S de volta: **precisa de decisão explícita** do responsável sobre o envelope (detectores de Orientação e de valia ativos, parada que falha fechada).

## Referências desta pesquisa (o que foi lido)
- Badimon, A. et al. (2020). Negative feedback control of neuronal activity by microglia. *Nature* 586, 417–423. (resumo)
- Fields, R. D. (2015). A new mechanism of nervous system plasticity: activity-dependent myelination. *Nat. Rev. Neurosci.* 16, 756–767. PMC6310485. (resumo e trechos)
- Halassa, M. M. et al. (2009). *Neuron* 61, 213–219. PMC2673052. (resumo e trechos)
- Ingiosi, A. M. et al. (2020). A role for astroglial calcium in mammalian sleep and sleep regulation. *Curr. Biol.* 30, 4373–4383. PMC7919541. (resumo e trechos)
- Lovatt, D. et al. (2012). Neuronal adenosine release, and not astrocytic ATP release, mediates feedback inhibition of excitatory activity. *PNAS* 109, 6265–6270. (resumo e trechos)
- Oberheim, N. A. et al. (2009). Uniquely hominid features of adult human astrocytes. *J. Neurosci.* 29, 3276–3287. (resumo)
- Paukert, M. et al. (2014). Norepinephrine controls astroglial responsiveness to local circuit activity. *Neuron* 82, 1263–1270. PMC4080721. (resumo)
- Peng, W. et al. (2020). Regulation of sleep homeostasis mediator adenosine by basal forebrain glutamatergic neurons. *Science* 369, eabb0556. (resumo)
- Peng, W. et al. (2023). Adenosine-independent regulation of the sleep–wake cycle by astrocyte activity. *Cell Discovery* 9, 16. (resumo)
- Porkka-Heiskanen, T. et al. (1997). Adenosine: a mediator of the sleep-inducing effects of prolonged wakefulness. *Science* 276, 1265–1268. (resumo e legendas)

## 6. Macroglias, revisão no redesenho (11/11/2026, 11h03, pedido do responsável)
**Ponto de partida, o que já está decidido:**
- **10/11, 19h02:** sem base, por ora, para postular unidades fora do domínio representacional produzindo regulação; a regulação é feita pelas próprias Uint.
- **Mielina:** vira a **velocidade de propagação** da Upro (decisão de 10/11, 20h27).
- **Adenosina:** subproduto da atividade.
- **Astrócito como portão territorial:** variante.

O pedido agora é olhar as **macroglias** (astrócitos e linhagem do oligodendrócito), não as micróglias.

### 6.1 Funções das macroglias no NB e situação no EMERGENCE
Lido: resumos, salvo indicação.

| # | Função no NB | Fonte | Situação |
|---|---|---|---|
| A1 | **Portão territorial de plasticidade:** um astrócito, pela D-serina dependente de cálcio, controla a plasticidade dependente de NMDA em **milhares de sinapses** ao redor. A noradrenalina "liga" a resposta do astrócito à atividade local. | Henneberger et al. 2010, Nature 463:232 (resumo e trechos); Paukert et al. 2014 | variante (19h02) |
| A2 | **Suficiência:** ativar astrócitos durante o aprendizado induz potenciação nova, que persiste depois. A memória melhora **só quando a ativação coincide com o aprendizado**; ativar neurônios diretamente piora a memória. | Adamsky et al. 2018, Cell 174:59 | variante (mesma forma de A1) |
| A3 | **Energia para a memória de longo prazo:** o glicogênio, que só os astrócitos guardam, vira lactato. É necessário para a memória de **longo** prazo, não para a de curto, e para manter a potenciação. A glicose em mesma quantidade de energia não substitui. | Suzuki et al. 2011, Cell 144:810 | **lacuna** |
| A4 | **Eliminação de sinapses:** astrócitos englobam sinapses de modo dependente de atividade (MEGF10 e MERTK). Sem as duas vias, a eliminação cai ~90% e sobram sinapses. Persiste na vida adulta. | Chung et al. 2013, Nature 504:394 (resumo e divulgação; número de divulgação, confiança média) | coberto pela poda por desuso na Upro |
| A5 | **Fechamento do período crítico:** a conexina 30 dos astrócitos sobe no desenvolvimento, inibe uma enzima que degrada a matriz, a matriz se estabiliza, os interneurônios inibitórios amadurecem e o período fecha. Astrócitos imaturos enxertados em adultos **reabrem** a plasticidade. | Ribot et al. 2021, Science 373:77 (resumo e trechos do preprint) | **lacuna** |
| A6 | **Acúmulo de evidência de inutilidade:** no peixe-zebra, astrócitos radiais acumulam por dezenas de segundos o sinal noradrenérgico de tentativas falhas e, ao atingir o limite, suprimem o nado (passividade). | Mu et al. 2019, Cell 178:27 | sem equivalente; **toca o ramo do querer** |
| A7 | Componente do homeostato do sono. | Ingiosi et al. 2020 (seção 2.1) | adiado (estados de sono) |
| A8 | Remoção de potássio e glutamato do meio. | conhecimento geral, **não conferido nesta sessão** | entra em "remoção local" (detalhes da liberação, pendente) |
| O1 | Mielina altera a velocidade de condução. | seção 3c | coberto: velocidade de propagação |
| O2 | Oligodendrócitos novos são necessários para aprender e consolidar. | McKenzie 2014; Steadman 2020 (seção 3b) | coberto: velocidade cresce com o uso, devagar |
| O3 | Precursores de oligodendrócito recebem **sinapses glutamatérgicas verdadeiras** de neurônios, em jovens e adultos: um canal rápido neurônio → glia. | Bergles et al. 2000, Nature 405:187 | coberto: o aumento da velocidade é movido pelo uso da própria Upro |

### 6.2 Leitura (inferência nossa)
As funções caem em **três grupos**:
1. **Já absorvidas como propriedades das unidades:** velocidade de propagação (O1–O3), poda (A4) e remoção local (A8). A perda declarada continua a mesma: o executor territorial; um oligodendrócito mieliniza vários axônios, então seus ajustes são correlacionados.
2. **Integrador territorial lento que abre a plasticidade** quando a atividade local coincide com um estado global (A1, A2; A6 tem a mesma forma, com outro alvo). É a mesma **forma** dos moduladores com difusão que já temos: liberação, alcance, ação sob modulação. A decisão de 19h02 continua coerente; a variante glial serve para comparar.
3. **Duas lacunas sem equivalente na arquitetura:**
   - **(a) Custo da consolidação (A3).** Consolidar exige um recurso local que não é o da atividade de curto prazo. Hoje a consolidação só depende de marca e moduladores, não de um recurso que possa faltar. Hipótese **H-G1:** a consolidação consome um recurso local, que se repõe devagar; sem ele, a marca não vira consolidação.
   - **(b) Fechamento do período crítico (A5).** Não há na arquitetura nada que reduza a plasticidade com a maturação. A questão já aparecia como pendente na Utrd eferente (período crítico). Hipótese **H-G2:** uma variável lenta de maturação, territorial e movida pela experiência, reduz a taxa de formação e de plasticidade; ela pode ser reaberta.

**Alerta para o ramo do querer (A6):** um integrador que acumula falhas e muda o estado comportamental toca diretamente o desenho de ANCHOR (Orientação, persistência, desistência). Fica registrado para aquele ramo, sem proposta aqui.

### 6.3 Perguntas ao responsável
1. A decisão de 19h02 continua como **base**, com as macroglias absorvidas nas unidades e a forma glial territorial como variante?
2. **H-G1** (custo da consolidação): investigamos?
3. **H-G2** (fechamento do período crítico): investigamos?

## 7. Excerto "Hipótese astroglial da CLEAR" (11/11/2026, 12h26; gerado pelo responsável com o ChatGPT)
Arquivo trazido pelo responsável. O texto revisa a hipótese do responsável: a astroglia como **segundo Sdom**, possivelmente metarrepresentacional (G3).

### 7.1 Conferência das referências (resumos e páginas de divulgação; existência e dados bibliográficos)
| Referência do excerto | Conferido |
|---|---|
| Benoit et al. 2025, Cell 188:6453 | **existe**: os folhetos ("leaflets") envolvem 90% das sinapses em grupos e só 10% individualmente; há eventos de cálcio próprios de cada folheto, induzidos por sinapses |
| Cooper et al. 2026, Nature (abril) | **existe**: as redes astrogliais, por junções comunicantes, ligam regiões **não ligadas por neurônios** e são plásticas |
| Cahill et al. 2024, Nature 629:146 | **existe** (o excerto não dá os autores) |
| Williamson et al. 2025, Nature 637:478 | **existe** (online em nov/2024; autores não dados no excerto): os conjuntos de astrócitos associados ao aprendizado bastam para provocar a evocação |
| Dewa et al. 2025, Nature 648:146 | **existe** (autores não dados no excerto): rastro astroglial de vários dias que estabiliza a memória lábil |
| Bukalo et al. 2026, Nature (fev.) | **existe**: os astrócitos da amígdala basolateral acompanham o estado de medo e sustentam a evocação e a extinção |
| Sánchez Romero & Navarrete 2026, Nat Rev Neurosci | **existe** (Perspective "Astroengrams") |
| "The Duality of Astrocyte Neuromodulation" (2025); "Multiple ions control astroglial excitability"; Ahrens, Khakh & Poskanzer 2024 | **não conferidos** |

O excerto traz marcas de busca da ferramenta ("PubMed +1", "Nature") no meio do texto e não informa a confiança de cada afirmação. As afirmações conferidas batem com os resumos.

### 7.2 O que o excerto acerta (leitura nossa)
- G1, G2 e G3 **não são uma escada**: demonstrar um não implica o outro.
- **Codificar não é representar.** Os quatro níveis são distintos: covariação; informação recuperável; informação usada pela dinâmica; representação com referente.
- **Controlar um processo não exige representá-lo.**
- A explicação concorrente forte é a da própria Dewa et al.: o rastro astroglial como **elegibilidade** para a consolidação, não como conteúdo. Isso corresponde à nossa **marca de consolidação**.
- **Segundo Sdom não implica metarrepresentação.** E a CLEAR já permite representações sobre representações dentro de um só Sdom.
- A pergunta central da seção 8: em que condições duas organizações acopladas são **dois Sdom** e não um só.

### 7.3 Contribuição da arquitetura à pergunta da fronteira (inferência nossa, a validar)
A regra decidida em 10/11 ("incidências só surgem de transdução"; a fronteira é funcional) dá um **teste preciso** para G2 × G3:
1. **Se a astroglia recebe incidências** das unidades neuronais, ou seja, sinal já representacional, ela está **dentro** do mesmo Sdom. Isso é G2.
2. **Se a astroglia responde a correlatos físicos** da atividade neuronal (glutamato que extravasa, potássio, concentração de noradrenalina), que são sinais **não representacionais**, ela **transduz**. Seria então fronteira (Utrd) de um **segundo** Sdom.
3. Nesse caso, o referente direto do segundo Sdom seria o **estado físico** do substrato do primeiro. É o caso 6.4 do excerto: segundo Sdom sem metarrepresentação.
4. **Mas isso não fecha G3.** O primeiro Sdom também só recebe correlatos físicos do mundo e, ainda assim, forma entidades cujo referente é o mundo. Por paridade, o segundo Sdom poderia formar, a partir dos correlatos do primeiro, entidades cujo referente é a **organização** do primeiro.
   - Assim, a exigência da seção 4.2 do excerto (correspondência com propriedades representacionais, não só com correlatos) talvez seja **mais forte do que a CLEAR exige** de qualquer Sdom.
   - O critério seria o mesmo de sempre: ancoragem, determinação autônoma e formação de entidades.
5. **Teste possível no EMERGENCE, como variante:** um segundo grafo cujas Utrd transduzem campos físicos agregados do primeiro (subproduto da atividade, concentrações de moduladores). Observar se ele forma entidades que acompanham organizações do primeiro (o protocolo da seção 7 do excerto, em simulação).
   - Custo: dobra a malha.
   - Pré-requisito: o critério de primeiro conteúdo (consequência 2 dos limites do Sdom).

### 7.4 Pergunta ao responsável
A leitura 7.3 (o teste da fronteira pela transdução, e a paridade com o primeiro Sdom) serve para levar à revisão da hipótese? E o teste em simulação fica guardado como variante, depois do critério de primeiro conteúdo?

### 7.5 Terceiro gêmeo (responsável, 11/11, 12h33)
- **Opção (ii):** a primeira rodada tem **dois gêmeos** (A, moduladoras sem conteúdo; B, moduladoras com conteúdo).
- "Assim já saberemos qual usar: A ou B." A **segunda rodada** usa como base o vencedor da primeira, com o gêmeo **C** (segundo grafo que transduz campos físicos do primeiro).
- Cuidados registrados:
  - a composição de cada rodada é fixada antes de começar, porque os gêmeos se veem;
  - as posições são simétricas;
  - C exige antes o critério de primeiro conteúdo e a especificação do que o segundo grafo transduz;
  - o custo estimado de C é cerca de 2 vezes o de um sistema (estimativa, sem medição).

### 7.6 Decisões (responsável, 11/11, 12h34): "Sim"
1. A decisão de 10/11 (19h02) **continua como base**: as macroglias ficam absorvidas nas unidades, e a forma glial territorial fica como variante.
2. A leitura 7.3 (teste da fronteira pela transdução; paridade entre o primeiro e o segundo Sdom) **serve** para a revisão da hipótese astroglial.

## 8. Lacuna H-G1: o custo da consolidação (11/11/2026)

### 8.1 Observação do NB
Lido: resumos, salvo indicação.
- **A consolidação depende de energia trazida pelo astrócito.** O lactato vindo do glicogênio é necessário para a memória de longo prazo, não para a de curto, e para manter a potenciação. A glicose na mesma quantidade de energia não substitui (Suzuki et al. 2011, Cell 144:810). Confiança: alta.
- **A memória de longo prazo encurta a vida sob escassez.** Moscas que formaram memória de longo prazo sobreviveram em média ~17 h sem comida e água; as que formaram só a forma barata ("resistente à anestesia"), ~21 h (Mery & Kawecki 2005, Science 308:1148; números do comunicado da universidade). Confiança: média nos números.
- **Sob fome, o cérebro desliga a consolidação cara.** Moscas famintas não formam memória aversiva de longo prazo e passam à forma barata (Plaçais & Preat 2013, Science 339:440; texto integral, por resumo da ferramenta).
  - O portão são **oscilações de dois pares de neurônios dopaminérgicos**, que somem na fome.
  - Forçar esses neurônios restaura a memória, mas reduz a sobrevivência em ~30%. Confiança: alta quanto ao que o artigo reporta.
- **Aumentar o fluxo de energia é o próprio gatilho** da memória de longo prazo; isso é necessário e suficiente, e é comandado por neurônios dopaminérgicos (Plaçais et al. 2017, Nat Commun 8:15510).
- **Ordem de grandeza** (estimativa teórica): ~10 mJ por bit guardado na memória de longo prazo da mosca, 6 a 7 ordens acima do armazenamento em computador. A incerteza é grande, e ~3 ordens de grandeza ficam sem explicação biofísica (Girard, Jiang & van Rossum 2023, arXiv:2301.09565; texto integral). Confiança: baixa.
- **Estratégia de economia (modelo):** guardar mudanças transitórias baratas e consolidar só de vez em quando, quando o acumulado passa de um limiar. A energia total é mínima com um limiar **intermediário** (Li & van Rossum 2020, eLife 9:e50804, "synaptic caching").

### 8.2 Leitura (inferência nossa)
- A **estratégia de economia já está na arquitetura**: a marca de consolidação com limiar é o "synaptic caching". Isso é um bom sinal de que o desenho converge.
- **O que falta** é o **recurso que a consolidação consome.** Hoje, tudo o que é marcado acima do limiar consolida, sem orçamento. No NB:
  1. **Há competição:** consolidar custa, então nem toda marca vira consolidação.
  2. **Há um portão de estado:** sob escassez, o sistema troca a forma cara pela barata.
- **Proposta mínima, H-G1 revisada:**
  - Cada Uint, ou território, tem uma **reserva local**.
  - Subir o nível de consolidação de uma Upro **consome** dessa reserva.
  - A reserva se **repõe devagar**, mais depressa no repouso e no sono.
  - Com a reserva baixa, as marcas esperam (dentro da janela da marca, ~3 h) ou caducam. Assim surge **competição entre marcas sem seletor central**: consolidam as marcas mais fortes (as feitas sob modulação, da novidade e da surpresa).
- **Ligação com o que já existe:** a adenosina é o **subproduto** do gasto e funciona como freio. A reserva é o **suprimento**. São os dois lados da mesma conta de energia.
- **Adiado:** o acoplamento da reserva ao estado do corpo (fome, saciedade) pertence ao desenho do corpo (R4). É também variável regulada, com o alerta de ANCHOR já registrado (seção 5).
- **Relevância para o conjunto mínimo:** a peça serve para tornar a consolidação **seletiva**. Não é claro que seja necessária para a consciência. Pode entrar como **variante**, para comparar uma consolidação com orçamento e uma sem.

### 8.3 Perguntas ao responsável
1. A reserva local que a consolidação consome, com reposição lenta e competição entre marcas, entra **no desenho** ou como **variante**?
2. O acoplamento ao estado do corpo fica para o desenho do corpo (R4)?

### 8.4 Decisões (responsável, 11/11, 13h55)
1. **A reserva local entra no desenho.** A consolidação consome a reserva local; a reposição é lenta, mais rápida no repouso e no sono; as marcas competem sem seletor central.
2. **O acoplamento ao estado do corpo** fica para discussão ("teremos que discutir").

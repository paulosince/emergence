# Hipótese: as propriedades físicas preservadas na transdução (v0, 11/11/2026, 17h36)

**Hipótese do responsável:** "Poderia a frequência dos sinais físicos ser transformada em frequência de disparos de incidências, a intensidade em magnitude, a topologia na topologia das Upro, etc.? Com as incidências que adentram sendo acopladas pelas regras Hebbianas do Sdom?"

**Estado:** observação do NB e leitura. Nada decidido.

## 1. Observação do NB
Lido: resumos e trechos, salvo indicação.

### 1.1 Intensidade
- **Adrian & Zotterman (1926):** os impulsos de uma fibra sensorial têm sempre o **mesmo tamanho**; só a **frequência** varia com a intensidade (tensão no músculo). Princípios: tudo ou nada, codificação por taxa e adaptação. Confiança: alta (achado clássico).
- **População:** para cobrir a faixa auditiva (10 oitavas, 120 dB no humano), há ~10 neurônios do gânglio espiral por célula ciliada interna. Eles se dividem em três classes de taxa espontânea, com limiares diferentes (cochlea.eu; página didática; confiança média). Uma fibra sozinha tem faixa dinâmica estreita (Viemeister 1988; Carney 1994; resumos).
- **Adaptação da faixa:** a faixa dinâmica do nervo auditivo se ajusta à estatística dos níveis sonoros recentes (Wen et al. 2009, J Neurosci 29:13797; resumo).
- **Adaptação rápida × lenta:** desde Adrian & Zotterman (1926), os mecanorreceptores se dividem em de adaptação **rápida** e **lenta**.

### 1.2 Frequência do sinal físico
- **Som, dois códigos:**
  - **lugar**: a fibra é sintonizada a uma faixa (tonotopia), então a frequência vira **qual canal**;
  - **tempo**: os disparos se travam na fase da onda (*phase locking*).
- O travamento de fase é usado no processamento binaural até ~1.500 Hz. As estimativas do limite superior geral vão de 1.500 a 10.000 Hz, sem consenso (Verschooten et al. 2019, Hear Res 377:109; resumo). Confiança: alta quanto à faixa citada.
- **Luz e pele** (conhecimento geral, **não conferido nesta sessão**): o comprimento de onda vira **qual receptor** (cones). Na pele, alguns receptores acompanham a vibração no tempo.

### 1.3 Topologia
- No NB, o mapa topográfico tem **duas etapas**:
  1. gradientes moleculares (Eph/efrina) estabelecem um mapa **grosseiro**;
  2. pistas **dependentes de atividade** o refinam, num mecanismo Hebbiano (revisão PMC2714953; O'Leary & McLaughlin 2005; trechos).
- Antes da visão, as **ondas retinianas espontâneas** dão atividade correlacionada entre vizinhos. Elas são necessárias para ordenar o mapa e eliminar axônios em excesso (Nat Neurosci, nn1842; resumo).

### 1.4 Precedente agnóstico: topologia a partir de sensores sem interpretação
**Pierce & Kuipers 1997**, Artif Intell 92:169 (texto integral, ~60%, por resumo da ferramenta).
- Um agente que **não sabe** o que são seus sensores aprende a disposição deles a partir dos sinais. Sensores fisicamente próximos têm valores parecidos, então a diferença média entre dois sensores ao longo do tempo serve de distância.
- Depois, um escalonamento métrico reconstrói o anel ou a grade.
- **Pressupostos:** o mundo é contínuo quase em toda parte, no espaço e no tempo.
- Diferença para nós: eles usam um **algoritmo explícito** de distância e escalonamento, não acoplamento Hebbiano.

## 2. Leitura para o EMERGENCE (inferência nossa)
A hipótese é **coerente com o NB e com o que já decidimos**: a transdução preserva propriedades físicas na forma das incidências, e a regra Hebbiana as acopla. Mas há **quatro ajustes**.

1. **A intensidade, no NB, é taxa mais população, não amplitude.** O impulso é tudo ou nada. A nossa **magnitude** (0–1) já é uma simplificação: a magnitude resumiria taxa × população numa janela.
   - **Risco:** se a magnitude e a taxa codificarem a intensidade ao mesmo tempo, haverá redundância, e a Uint soma as duas.
   - Escolha a fazer: (a) intensidade → magnitude, com taxa fixa; (b) intensidade → taxa, com magnitude fixa (mais NB); (c) as duas, com a perda declarada.
2. **A frequência física vira frequência de incidências só em baixas frequências** (travamento de fase até ~1,5 kHz para o binaural). Acima disso, e para luz e cor, a frequência vira **qual Utrd** dispara (lugar). A nossa cóclea de 64 faixas já é código de lugar. O travamento de fase nas faixas baixas seria um acréscimo, útil para localizar o som com dois microfones (diferença de tempo entre os ouvidos), e conversa com o tempo de propagação da Upro.
3. **A topologia pode emergir das correlações, sem coordenadas.**
   - Num mundo contínuo, Utrd vizinhas recebem sinais parecidos e coincidem com mais frequência. A regra Hebbiana as faz convergir nas mesmas Uint, e a topologia das Upro passaria a **espelhar** a disposição das Utrd.
   - É a etapa 2 do NB, sem a etapa 1 (perda declarada: o mapa grosseiro herdado, já registrado em 10/11).
   - Pierce & Kuipers mostram que a informação está nos sinais. O que seria nosso é obtê-la por **convergência Hebbiana numa malha que cresce**, sem um algoritmo de distância.
   - **Escolha a fazer:** (a) os identificadores das Utrd são opacos e a vizinhança emerge, ou (b) a proximidade física favorece a formação de Upro. A (b) aparece na síntese do ChatGPT, mas não está registrada como decisão.
   - Atividade espontânea correlacionada nas Utrd antes da experiência, como as ondas retinianas e a atividade espontânea da cóclea (Tritsch 2007, já registrado), aceleraria isso. Incluí-la segue em aberto.
4. **Adaptação.** O plano antigo dizia "Utrd que emitem só na variação". O NB tem **os dois tipos**, de adaptação rápida (variação) e lenta (sustentada). Tê-los por tipo de Utrd é escolha a fazer.

## 3. Perguntas ao responsável (uma por vez)
1. **Intensidade:** magnitude, taxa ou as duas?
2. **Frequência:** lugar como regra (qual Utrd), com travamento de fase como acréscimo nas faixas baixas?
3. **Topologia:** identificadores opacos com a vizinhança emergindo, ou a proximidade favorecendo?
4. **Adaptação:** Utrd de adaptação rápida e lenta?

## 4. Intensidade: discussão com o responsável (17h44–17h46)
- **17h44:** "Mas intensidade não é justamente magnitude? Não há uma correlação direta?" Resposta: sim. Magnitude = intensidade é a equivalência agnóstica direta (opção a). A recomendação (b) foi retirada, porque imitava o meio do NB, não a função. Cuidados: compressão com ajuste ao contexto; o tempo das incidências fica livre para frequência e variação.
- **17h46, proposta do responsável:** "Há uma outra forma: número de fibras (Upro). Uma intensidade baixa aciona algumas e uma intensidade alta um número maior (incluindo as primeiras). Acho que essa forma é ainda mais correlacionada e sensível."

**Leitura (inferência nossa): opção (d), recrutamento de Upro.**
- **É o que o NB faz:** fibras com limiares diferentes por célula ciliada; as de limiar baixo disparam primeiro, e as de limiar alto entram depois (1.1).
- **A compressão sai sozinha** do número de limiares e do espaçamento entre eles; com espaçamento logarítmico, a faixa larga cabe sem função separada.
- **Vantagem decisiva para a CLEAR:** intensidades diferentes ativam **conjuntos diferentes** de Upro. Então "fraco" e "forte" podem virar representações distintas por convergência Hebbiana. A intensidade vira estrutura, não só soma de amplitude.
- **Coerente com as regras:** a Upro só existe com destino e nasce da transdução. Uma Upro de limiar alto nasceria na **primeira vez** que aquela intensidade ocorre. A faixa representada cresce com a experiência.
- O conjunto é aninhado: a intensidade alta inclui as primeiras Upro. Na Uint, a soma cresce com a intensidade, então o efeito de magnitude continua.
- **Custo:** mais Upro por Utrd.
- **A decidir:**
  - onde ficam os limiares: na Utrd, como especialização e predisposição (número de níveis e espaçamento), ou de outro modo;
  - se a magnitude de cada incidência fica fixa ou também varia dentro da faixa de cada Upro (como a taxa de cada fibra dentro da sua faixa).

**Decisões (responsável, 17h50):**
- **(a)** Os limiares ficam **na Utrd**: "assim as Upro já estão normalizadas".
- **(b)** "Agora a magnitude precisa ser repensada quanto à correspondência transdutória." O responsável pediu pesquisa na literatura (seção 5).

## 5. Magnitude: a correspondência transdutória (pesquisa pedida às 17h50)

### 5.1 O que o NB mostra (cadeia da cóclea; resumos e trechos)
1. **O potencial do receptor é gradual e contém toda a intensidade.** A informação de intensidade está inteira no potencial da célula ciliada interna e é **fracionada** por sinapses heterogêneas entre as fibras (Özçete & Moser 2024, EMBO J 42:e114587; resumo e comentário). Confiança: alta quanto ao que o artigo afirma.
2. **Cada fibra cobre só uma fração.** Depois da compressão feita pela mecânica coclear ativa, a célula ciliada cobre a faixa inteira, mas a **taxa** de cada fibra codifica só uma fração. Em população, as frações cobrem toda a faixa audível (mesma fonte).
3. **Dentro da sua fração, a taxa cresce do espontâneo à saturação.**
   - A faixa dinâmica de cada fibra vai do nível que tira a taxa do espontâneo até o que a satura. Nas fibras de taxa espontânea alta, a média foi de **41 dB** no gato (Evans & Palmer? resumo Springer BF00236671; autores não conferidos; confiança média-alta no número).
   - Faixa típica: 20–40 dB por neurônio, contra 100–120 dB do sistema (Wen et al. 2009).
   - Formato da função: Sachs & Abbas 1974 (saturante; resumo).
4. **Mais intensidade, mais cedo.** Com despolarização maior, a abertura dos canais de cálcio adianta a liberação (Goutman 2012?, PMC3705563; trecho; autoria não conferida).
   - Os primeiros disparos de conjuntos de aferentes táteis codificam eventos rápidos do dedo, mais depressa do que um código de taxa explicaria (Johansson & Birznieks 2004, Nat Neurosci 7:170; resumo).
   - Confiança: alta quanto ao fenômeno.

### 5.2 Correspondência proposta (inferência nossa)
| NB | EMERGENCE |
|---|---|
| potencial gradual do receptor e sinapses heterogêneas (fracionamento) | **Utrd**, com os limiares (decidido às 17h50) |
| fibra do nervo | **Upro** recrutada |
| taxa dentro da faixa da fibra (do espontâneo à saturação) | **magnitude** da incidência naquela Upro |
| latência do primeiro disparo (mais forte, mais cedo) | **momento** da incidência |

**Opções para a magnitude:**
- **(m1) Magnitude = posição dentro da faixa da Upro:** 0 no limiar dela e 1 na saturação, com curva saturante. Somada ao recrutamento, dá a contagem de Upro (grosso) mais a posição dentro de cada faixa (fino). É o análogo direto da taxa dentro da faixa de cada fibra, e já vem **normalizada**, como o responsável pediu.
- **(m2) Magnitude fixa**, com a posição dentro da faixa levada pela taxa de incidências. Mais literal ao NB, mas ocupa o tempo, que queremos livre para frequência e variação.
- **(m3) Magnitude fixa**, com a posição levada pela **latência**: mais forte, mais cedo.
- **Acréscimo possível a (m1):** um leve adiantamento com a intensidade, como no NB. Isso favorece o mais forte nas convergências e na fila competitiva.

**Recomendação:** (m1), com o adiantamento leve como variante.

### 5.3 Decisão e reformulação (responsável, 18h08–18h11)
- **18h08, pergunta do responsável:** "o que significaria a magnitude?" Resposta: no esquema do responsável não sobra nada para ela codificar na fronteira:
  - a intensidade vira o número de Upro recrutadas;
  - a frequência vira o momento das incidências (travamento de fase nas faixas baixas, lugar acima de ~1,5 kHz; parte 2 em aberto).
  - A opção (m1) só serviria com limiares grossos.
- **18h11, decidido:** "Perfeito." **Na fronteira, a magnitude é fixa**: o equivalente do tudo ou nada.
- **Reformulação do responsável:** "A magnitude passa a codificar a **confiança** daquela relação. Uma relação muito repetida tem confiança maior e, consequentemente, uma magnitude maior."
- **Ponto a confirmar:**
  - Essa magnitude coincide com o **ganho da Upro**, que já fortalece por confirmação e tem teto abaixo de 0,9? Ou é um campo novo?
  - Como se distingue do **nível de consolidação**, que mede a resistência ao decaimento? No NB, peso sináptico e estabilidade (fase tardia) são coisas diferentes, embora a repetição aumente os dois.
  - "Confiança" seria nome de termo? Os nomes são decididos pelo responsável.

### 5.4 Termos e estado (responsável, 18h15–18h23)
- **18h15, proposta do responsável:**
  - **confiança** = propriedade intrínseca da relação (Upro), o que chamávamos de peso;
  - **magnitude** = grandeza da incidência, afetada pela confiança;
  - **consolidação** = um **estado** dado por limiares de confiança, em três degraus: **efêmera, estável, consolidada**.
- **18h23, decidido:** "Concordo. **Sai ganho.** A magnitude da incidência é o resultado da confiança × modulação."
  - Isso altera a especificação de 10/11 (2.15): o campo "ganho" sai. O "nível de consolidação" como campo separado passa a ser estado em degraus. Atualizar a revisão e a nomenclatura depois da confirmação final.
  - Conforme o desenho de 18h15, cada degrau decai num ritmo: rápido, lento, muito lento.
- **18h23, pergunta do responsável:** "uma Upro recém-criada o é com baixíssima confiança. Afinal é nova… justamente por isso é efêmera, sujeita ao decaimento. Precisaria de algo mais?"

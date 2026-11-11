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

# Novidade e surpresa vindas das unidades (v0)

**Pergunta do programa:** como o sistema sinaliza novidade e surpresa **sem um calculador central**, só com propriedades das unidades, e como esse sinal chega às Uint moduladoras (disparos fásicos, [moduladores](modulator-release-v0.md), 7.5.4).

**Estado:** observação do NB e hipóteses. Nada decidido. Os nomes usados aqui são descrições; nenhum termo novo foi criado.

**Termos (correção de 11/11, 09h56).** "Previsão" só no sentido da CLEAR ([nomenclatura](nomenclature.md)). Nas seções 1 e 2, onde os autores falam em "prediction" ou "expectation", lê-se **expectativa**: o estado favorecido pela dinâmica de acessos naquele momento. Surpresa é **expectativa violada**, ou seja, o disparo de uma unidade não esperada (definição do responsável, 09/11). Quando a literatura diz "predição", o termo é dela.

## 1. Observação do NB

### N1. Novidade e surpresa são coisas diferentes
Fonte: Barto, Mirolli & Baldassarre 2013, Front Psychol 4:907. Lido: cerca de 2/3 do texto integral (PMC).
- **Novidade** depende da memória: algo é novo quando não está guardado. Não precisa de expectativa.
- **Surpresa** é a discrepância entre uma expectativa e o que ocorre. Precisa de uma expectativa e de comparação, mas não de busca na memória. O item que surpreende pode ser familiar ou novo.
  - Exemplo dos autores: aperta-se o destravar e a porta do carro continua trancada. É algo familiar, mas inesperado.
- Os autores defendem que as respostas "de novidade" da dopamina a luzes e tons se explicam melhor como surpresa: elas persistem com a repetição.
- Os autores defendem também que os dois podem envolver circuitos diferentes.

### N2. Novidade de curto prazo já aparece em neurônios isolados
Fonte: Ulanovsky, Las & Nelken 2003, Nat Neurosci 6:391. Lido: resumo e trechos do texto.
- Neurônios do córtex auditivo primário respondem mais a um som raro do que ao mesmo som quando é comum. É a **adaptação específica ao estímulo**.
- Depois ela foi achada também no tálamo e no colículo inferior (J Neurosci 2009, 29:7359, tálamo de camundongo; J Neurosci 2009, 29:5483, colículo de rato; trechos — autores não conferidos).
- Ressalva: Farley et al. (J Neurosci, trecho) acham que essa adaptação é dissociável do potencial cortical de "descompasso". Ou seja, adaptar-se não é o mesmo que detectar novidade em sentido pleno. Confiança na ressalva: média.

### N3. A surpresa vem da comparação entre expectativa e entrada, numa unidade que recebe as duas
- **Hipocampo** (Lisman & Grace 2005, Neuron 46:703; lido o texto integral, por resumo da ferramenta). CA1 funcionaria como comparador. CA3 manda o que a literatura chama de "predição" e o córtex entorrinal manda a entrada direta. No nosso vocabulário, CA3 manda a expectativa. A resposta a sons novos em CA1 aparece em menos de 100 ms (confiança: alta quanto ao que o artigo afirma). Os autores dizem que o local exato não é certo.
- **Córtex visual do camundongo** (Keller, Bonhoeffer & Hübener 2012, Neuron; lido o resumo; Jordan & Keller 2020, trecho). Há neurônios que disparam quando o fluxo visual não corresponde ao esperado pelo movimento.
  - Mecanismo proposto: a expectativa (na literatura, "predição" motora) chega excitando e a entrada real chega inibindo. Quando a entrada esperada falta, a excitação fica sem freio e o neurônio dispara.
  - Ressalva: Muzzu & Saleem 2021 (Cell Rep, resumo) explicam parte desses sinais só por seletividade sensorial e motora. Confiança no mecanismo: média.
- **Peixe-elétrico** (Bell 1981 e seguintes; revisões Roberts & Leen 2010, Requarth & Sawtell 2014, Enikolopov et al. 2018; trechos). O circuito aprende uma **imagem negativa** da entrada habitual (a que acompanha o próprio comando) e a soma à entrada real. O habitual se cancela e o inesperado se destaca.
  - O aprendizado ocorre por plasticidade anti-Hebbiana na via que traz o sinal do próprio comando motor.
  - A imagem negativa se adapta em minutos e se afina em uma hora ou mais (confiança: média, trecho).

### N4. O sinal chega à moduladora por convergência
Fonte: Lisman & Grace 2005.
- O sinal de novidade do hipocampo chega à área tegmental ventral por várias sinapses (subículo → accumbens → pálido ventral → área tegmental ventral), por **desinibição**.
- O disparo em rajada precisa **também** de uma segunda entrada, a de saliência (núcleo pedunculopontino). Com as duas juntas, o número de neurônios dopaminérgicos em rajada quase triplica (confiança: alta quanto ao que o artigo afirma).
- A maior mudança é no **número** de células que disparam, não na frequência de cada uma.

### N5. A resposta da moduladora à novidade some rápido e volta quando algo muda
Fontes: Vankov, Hervé-Minvielle & Sara 1995, Eur J Neurosci 7:1180; Sara, Vankov & Hervé 1994, Brain Res Bull; Bouret et al. 2003, J Neurosci. Lido: resumos e trechos.
- Neurônios do locus coeruleus disparam em rajada diante de um objeto novo. Na segunda visita, a resposta já diminui ou some (confiança: alta).
- A resposta **volta** quando a contingência muda: associação a reforço, reversão, extinção.
- Leitura dos autores: o locus coeruleus responde a novidade ou mudança, não à importância do estímulo em si.

### N6. Na volta, a moduladora decide o que se consolida
Fonte: Lisman & Grace 2005.
- A dopamina liberada em CA1 permite a fase tardia da potenciação de longo prazo, a que depende de síntese de proteína. Sem ela, a fase inicial decai em cerca de 1 hora (confiança: alta quanto ao que o artigo afirma).
- Um ambiente novo eleva a dopamina do hipocampo e faz um estímulo fraco produzir potenciação.

## 2. Leitura para o EMERGENCE (inferência nossa)
Quase tudo que o NB usa para isso **já existe** nas unidades que fechamos. Não parece preciso criar uma peça nova.

### 2.1 Novidade de curto prazo (algo que não se repetiu há pouco)
- A Uint já tem supressão após disparar com uma componente lenta, de segundos, que cresce com os disparos recentes ([revisão](architecture-review-v0.md), 3.16, I1). O que se repete encontra Uint suprimidas; o que é raro encontra Uint descansadas e produz mais atividade.
- É o equivalente da adaptação específica ao estímulo (N2), sem regra nova.

### 2.2 Novidade de longo prazo (algo nunca representado)
- As incidências não encontram uma Uint que as integre com força, porque não há Upro consolidadas para elas. A atividade fica **espalhada e fraca** em muitas Uint, até nascer uma nova.
- O familiar, ao contrário, ativa poucas Uint fortes, e as inibitórias formadas pela experiência calam as demais.
- **Hipótese H-N1:** a novidade aparece como **amplitude da atividade** (quantas Uint ativas), não como um valor calculado. Isso combina com N4 (o que muda é o número de células) e com a rápida habituação de N5, que viria da formação das próprias Uint. Confiança: baixa; é uma hipótese a observar.

### 2.3 Surpresa (expectativa violada)
- A expectativa já existe: é a preparação do campo pelas Upro de cadeias e relações formadas ([aprendizado diferido](deferred-learning-v0.md), 6; [tempo](time-representation-v0.md)).
- A comparação aconteceria em Uint que recebem **as duas vias**: a da expectativa, interna, e a da entrada que vem da transdução. Não há comparador especial; é qualquer Uint com essa convergência.
- **Hipótese H-N2:** o sinal da Upro decide o caso, e o sinal está na Upro (decisão 2.15).
  - **Expectativa excita, entrada real inibe:** a Uint dispara quando o esperado **não chega** (como em N3, córtex visual).
  - **Entrada real excita, expectativa inibe:** a Uint dispara quando chega o que **não era esperado**. É a imagem negativa de N3, no peixe-elétrico.
- Pela definição do responsável, nos dois casos a surpresa é o mesmo evento: dispara uma Uint que **não estava esperada**. Na omissão, quem dispara é a Uint de descompasso, que não estava no rol das esperadas.
- Essas Upro inibitórias nasceriam da experiência pela regra que já decidimos (2.15): nascimento quando a representação aprendida se mostra errada e ganho que cresce com coatividade.
  - Equivalência declarada: no peixe-elétrico, o aprendizado é anti-Hebbiano numa sinapse excitatória. Aqui seria Hebbiano numa Upro inibitória. A função é a mesma (cancelar o esperado); o mecanismo, não.
  - Isso precisa ser conferido quando as regras forem simuladas.

### 2.4 Como chega às moduladoras
- Pela regra comum: as Uint moduladoras disparam com ≥2 convergências dentro da janela de integração (7.5.4). Isso reproduz N4, em que a rajada exige novidade **e** saliência.
- A habituação rápida (N5) viria de duas fontes que já temos: a supressão lenta e a formação de Uint para o que era novo.
- O retorno quando algo muda (N5) viria da surpresa (2.3).

### 2.5 O que a moduladora faz na volta
- N6 corresponde ao que já temos: ação sob modulação sobre a marca de consolidação e o nível de consolidação. A moduladora converteria a marca em consolidação.
- Isso liga este item ao [aprendizado diferido](deferred-learning-v0.md) sem regra nova.

## 3. O que falta
- **Perdas declaradas:** no NB há regiões especializadas (CA1, cerebelo-símiles). Aqui a função ficaria espalhada em qualquer Uint com a convergência certa. Pode ser que, sem especialização regional, o sinal fique fraco demais. Isso é observável.
- **Leituras integrais pendentes:** Keller et al. 2012; Ulanovsky et al. 2003; Vankov et al. 1995.

## 4. Perguntas ao responsável
1. Adotamos a **distinção** entre novidade (falta na memória) e surpresa (expectativa violada) como duas coisas diferentes no programa? **Resposta parcial (09h56):** surpresa como expectativa violada. Falta a novidade.
2. **Novidade de curto prazo** pela supressão lenta já existente, sem peça nova: serve?
3. **H-N1:** novidade de longo prazo como amplitude da atividade: serve como hipótese a observar?
4. **H-N2:** surpresa nas Uint que recebem expectativa e entrada, com o caso decidido pelo sinal das Upro: serve?

## 5. Aprofundamento (11/11/2026, 10h04, pedido do responsável)

**Decidido antes do aprofundamento:**
- Surpresa = expectativa violada.
- Expectativa = estado produzido pela preparação do campo (confirmado às 10h04).

### 5.1 Literatura nova
Desta vez consegui o texto integral de quatro fontes; as três primeiras foram lidas em cerca de 70–80%, por resumo da ferramenta.

**Xu, Modirshanechi, Lehmann, Gerstner & Herzog 2021**, PLoS Comput Biol 17:e1009070 (texto integral, ~78%).
- Definições formais:
  - Novelty é atributo de **estados**: o inverso do logaritmo da frequência com que o estado foi encontrado, ou seja, raridade.
  - Surprise é atributo de **transições**: quão pouco provável era chegar a este estado a partir do anterior, segundo o modelo do mundo do agente.
- Papéis:
  - A novidade guia **onde e o que explorar**.
  - A surpresa sinaliza **quando se adaptar**: aumenta a taxa de aprendizado. Para eventos muito surpreendentes, a taxa ajustada foi mais de 8 vezes maior que a dos não surpreendentes (~0,06). Confiança: alta quanto ao que o artigo reporta; são 12 participantes.
- Exemplo dos autores: se você sabia que a geladeira iria para o conserto, a cozinha sem ela é **nova, mas não surpreendente**.
- Eletroencefalograma (10 participantes): o efeito da novidade começa por volta de 200 ms; o da surpresa tem pico por volta de 300 ms. Confiança: média.

**Homann, Koay, Chen, Tank & Berry 2022**, PNAS 119:e2108882119 (texto integral).
- No córtex visual primário do camundongo, **77% das respostas** (878 de 1.134) mostraram excesso de atividade diante de imagem nova. O excesso é **fraco e espalhado**; já as respostas ao familiar variam muito entre neurônios.
  - A leitura "esparso e forte para o familiar, denso e fraco para o novo" aparece na versão de 2017 (bioRxiv, resumo). A ferramenta indica que a versão publicada não usa esse enquadramento.
- Constantes de tempo:
  - a imagem fica "familiar" em τ = 2,6 ± 0,9 s, cerca de 3 repetições;
  - o excesso cai em τ = 1,4 ± 0,4 s;
  - a recuperação leva ~33 ± 11 s;
  - capacidade de ~15 imagens familiares.
  - Confiança: alta quanto ao que o artigo reporta.
- Mecanismo proposto: o neurônio recebe muitas subunidades com sintonias diferentes, cada uma com controle de ganho que se adapta em ~30 s. A imagem nova pega subunidades não adaptadas.
- **Dissociação importante:** quebrar a **ordem** de imagens familiares quase não gerou excesso. Essa região responde à novidade do conteúdo, não à violação da ordem.
- Os autores citam efeitos de exposição única de ~24 h no córtex perirrinal e no temporal inferior. Não li essas fontes.

**Schulz, Miehl, Berry & Gjorgjieva 2021**, eLife 10:e65309 (texto integral, ~70%). Modelo, não experimento.
- Uma rede de 4.000 unidades excitatórias e 1.000 inibitórias, com plasticidade inibitória do tipo Vogels et al. 2011. Isso basta para gerar respostas de novidade.
  - O estímulo repetido acumula inibição sobre o grupo que responde a ele.
  - O estímulo novo encontra inibição ainda fraca.
  - Nas palavras dos autores, a novidade é a ausência de adaptação numa resposta adaptada.
- Depende da **distribuição** dos estímulos, não da ordem. Concorda com a dissociação de Homann.
- A adaptação aparece em várias escalas: milissegundos, segundos e minutos. Intervalos maiores entre repetições deixam a inibição se recuperar.
- Limites declarados:
  - o aprendizado inibitório precisa ser rápido: cinco vezes mais lento e o efeito some;
  - a desinibição que amplifica a resposta foi posta de fora, sem fonte modelada;
  - o modelo leva ~9 repetições para adaptar; o experimento, ~3.

**Kafkas & Montaldi 2018**, Neurosci Lett 680:60 (texto integral).
- Dois tipos de novidade episódica:
  - **Absoluta:** o estímulo não tem representação prévia.
  - **Contextual:** o estímulo é conhecido, mas não combina com o contexto em que costuma aparecer.
- Novidade e familiaridade **não são imagens espelhadas**: seriam sinais parcialmente distintos, em regiões diferentes, que convergem.
- Proposta dos autores, com confiança baixa e que pedem para ser testada:
  - a absoluta usaria **acetilcolina**, sem dopamina nem noradrenalina;
  - a contextual usaria **dopamina e noradrenalina**.

**Duszkiewicz, McNamara, Takeuchi & Genzel 2019**, Trends Neurosci 42:102 (texto integral, artigo de opinião).
- **Novidade comum** (algo parecido com o vivido) ativaria a área tegmental ventral. Resultado: consolidação de sistema, reativação nas ondas agudas, memória mais semântica.
- **Novidade distinta** (quase sem relação com o vivido) ativaria o locus coeruleus, com dopamina coliberada. Resultado: consolidação inicial forte e memória episódica rica em detalhes.
- Para a coliberação de dopamina, o locus coeruleus precisaria de atividade **sustentada por minutos**; disparos fásicos curtos não elevaram a dopamina no hipocampo.
- Ativar o locus coeruleus **30 min depois** do aprendizado ainda melhorou a memória.
- A janela de captura da marca é de **algumas horas**.
- Confiança: média; é uma proposta dos autores.

### 5.2 Leitura para o EMERGENCE (inferência nossa)

**(a) Novidade e surpresa são dois eixos independentes na malha.**
- **Novidade** pergunta se **existe** Uint, com Upro consolidadas, para aquela combinação. É memória: estrutura formada.
- **Surpresa** pergunta se a Uint que disparou estava **no rol das esperadas**. É dinâmica: estado da preparação do campo naquele momento.
- Daí os quatro casos:

| | Esperada | Não esperada |
|---|---|---|
| **Combinação já representada** | familiar e esperado | **surpresa sem novidade** (porta trancada) |
| **Combinação sem representação** | **novidade sem surpresa** (geladeira) | novidade e surpresa |

- Na novidade sem surpresa, a preparação do campo favorece as **partes** (cozinha, ausência), mas a Uint da **combinação** ainda não existe. Isso é possível porque a expectativa age sobre o que já existe.

**(b) A novidade contextual vira surpresa.** Pela definição do responsável, um item conhecido que dispara fora do rol esperado é surpresa, mesmo sendo familiar. Barto et al. (N1) chegam à mesma conclusão sobre os estudos de "novidade" em sequências.

**(c) A novidade absoluta pode vir de uma peça que já temos.**
- O mecanismo de Schulz et al. é, na forma, a regra que decidimos para a Upro inibitória: fortalece por coatividade em qualquer ordem, como Vogels (2.15). O familiar acumularia inibição e o novo não. Daí a atividade **fraca e espalhada** para o novo (Homann) sem peça dedicada.
- Isso reforça a **H-N1** (novidade como amplitude).
- Duas dependências a conferir:
  1. **Recuperação.** No modelo, a inibição se recupera quando a repetição cessa. A nossa Upro inibitória não tem enfraquecimento próprio; só decai pelo nível de consolidação (decisão 2.15). Se esse decaimento for lento demais, o familiar ficaria "familiar para sempre" na escala curta. Pode bastar a supressão lenta da Uint (2.1), que se recupera em segundos. É questão de calibração, não de regra.
  2. **Existência das Upro inibitórias.** O mecanismo precisa que já existam Upro inibitórias sobre os grupos que respondem ao estímulo. As nossas nascem na concepção ou por falha. A amplitude da predisposição de concepção decide se o mecanismo funciona desde o início.

**(d) Novidade comum × distinta, sem decreto.**
- O grau de sobreposição com o vivido seria **quantas Uint existentes respondem em parte**.
- Hipótese **H-N3**:
  - novidade distinta = atividade espalhada quase sem Uint fortes;
  - novidade comum = algumas Uint fortes mais atividade espalhada.
- O sítio noradrenalina + dopamina (decisão 7.4) corresponde ao locus coeruleus de Duszkiewicz. Que tipo de novidade chega a cada sítio dependeria das entradas formadas pela regra comum.
- Confiança: baixa; é hipótese a observar.

**(e) A surpresa acelera o aprendizado.** Xu et al. mostram taxa >8 vezes maior. Para nós, isso seria ação sob modulação sobre a plasticidade, com a noradrenalina já associada à incerteza inesperada (Yu & Dayan 2005, [moduladores](modulator-release-v0.md), seção 4).

**(f) Escalas de tempo da novidade.** Há pelo menos duas:
- **curta**, de segundos a ~1 min: Homann, Ulanovsky e a supressão lenta;
- **longa**, de horas a dias: exposição única de ~24 h no perirrinal, citada por Homann; e o nível de consolidação.

### 5.3 Perguntas ao responsável (substituem as da seção 4)
1. **Dois eixos independentes**: novidade = existência de representação; surpresa = disparo fora do rol esperado. Serve?
2. **A novidade contextual vira surpresa**, pela sua definição. Concorda?
3. **Novidade absoluta pela Upro inibitória plástica** já decidida (Schulz), com a amplitude como sinal (H-N1). Serve como hipótese a observar? As duas dependências, recuperação e existência das Upro inibitórias, ficam para a calibração?
4. **H-N3**, novidade comum × distinta pela sobreposição: guardamos como hipótese a observar?

### 5.4 Decisões (responsável, 11/11/2026, 10h15)
"Sim. Exatamente. Perfeito.":
- **Pergunta 1:** dois eixos independentes. A **novidade** é a existência, ou não, de representação para a combinação: estrutura, memória. A **surpresa** é o disparo de uma Uint fora do rol esperado: dinâmica, preparação do campo.
- **Pergunta 2:** a novidade contextual é surpresa.

### 5.5 Objeção do responsável (10h28) e revisão da parte (c)
**Objeção (resumo fiel):**
- O excesso de atividade diante do novo não poderia vir da **criação** de nós e arestas, e não só do acesso?
- Há, inequivocamente, inibição do familiar? Onde há novidade não há convergência; não deveria haver acesso, só nas unidades já existentes.
- Exemplo: ver uma xícara pela primeira vez. O copo já tem representação e acessa; a alça produz novidade, com a criação e o relacionamento correspondentes.

**O que a literatura diz:**
- **Não há inibição inequívoca do familiar.** A redução da resposta com a repetição é robusta como observação. Seu mecanismo, porém, é **desconhecido** (revisão de Grill-Spector, Henson & Martin 2006, TICS 10:14; lido: resumo e trechos de textos que a citam). Há três modelos, que não se excluem:
  - **Fadiga:** cada neurônio responde menos.
  - **Afinamento ("sharpening"):** diante do novo, muitos neurônios respondem; com a repetição, só os seletivos continuam e os demais saem.
  - **Facilitação:** o familiar é processado mais rápido, e a atividade dura menos.
- Na própria literatura, a inibição é uma entre várias candidatas. Schulz et al. dizem que a sua é "adequada, mas claramente não a única". Homann et al. usam controle de ganho, não inibição.

**Leitura (inferência nossa):** a proposta do responsável corresponde ao **afinamento**, e a malha já tem as peças:
- **Novo:** incidências chegam a muitas Uint sem convergência forte. Há recrutamento por excitabilidade e nascimento de Uint e Upro. A atividade é larga e fraca **porque é atividade de formação**, não só de acesso.
- **Familiar:** só as Uint já formadas convergem; as recrutadas que não ganharam decaem até a poda.
- **Facilitação também já existe:** a velocidade de propagação aumenta com o uso, então o familiar percorre mais rápido.
- Correspondência com o NB (corrigida às 10h31, objeção do responsável: "isso não é inteiramente certo"):
  - **Neocórtex adulto:** não se detectam neurônios novos no humano (Bhardwaj et al. 2006, PNAS 103:12564; datação por carbono-14 e BrdU; lido o resumo; confiança alta). No neocórtex, que é onde Homann registrou, a "criação" da malha corresponde ao **recrutamento** de neurônios para um grupo novo e às mudanças sinápticas. Os 77% com excesso fraco seriam esse recrutamento.
  - **Giro denteado do hipocampo:** nascem neurônios na vida adulta. No rato, cerca de 0,2% das células granulares por dia; no camundongo, ~0,06% (revisão de Fölsz, Trouche & Croset 2023, Front Neurosci 17:1128623; trechos; confiança média-alta).
    - Os jovens são **hiperexcitáveis e hiperplásticos** e têm mais chance de ser recrutados por uma experiência nova. Isso está ligado à separação de padrões e à codificação do novo (mesma revisão; Kropff, Yang & Schinder 2015, trecho).
    - No humano, isso é **disputado**: Sorrells et al. 2018 contra Boldrini et al. 2018 e Moreno-Jiménez et al. 2019 (trechos de revisões).
  - **Bulbo olfatório:** recebe neurônios novos vindos da zona subventricular, nos roedores (mesma revisão).
  - **Diferença declarada:** no giro denteado, os neurônios nascem continuamente e são **selecionados** pela atividade, pois os que disparam se mantêm. Não nascem **por demanda** diante do novo. Na malha, a Uint nasce da convergência. A função, dar ao novo unidades novas e excitáveis, é a mesma; a ordem (nascer e depois ser recrutada × nascer porque houve convergência) não é.

**Revisão da parte (c):**
- A H-N1 continua (novidade como amplitude), mas a **origem** muda: a amplitude vem da atividade de formação.
- A Upro inibitória plástica (Schulz) deixa de ser o mecanismo principal e fica como **variante**. As duas dependências listadas em (c) só valem para essa variante.

**Pergunta ao responsável:** a origem da amplitude na formação (afinamento), com a inibição como variante: serve?

**Decisão (responsável, 10h37): "Sim".**
- A novidade aparece como **amplitude**, e essa amplitude vem da **atividade de formação** (recrutamento, nascimento de Uint e Upro, afinamento), não só do acesso.
- A Upro inibitória plástica (Schulz) fica como **variante**.
- A pergunta 3 da seção 5.3 fica respondida nessa forma.

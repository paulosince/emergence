# Novidade e surpresa vindas das unidades (v0)

**Pergunta do programa:** como o sistema sinaliza novidade e surpresa **sem um calculador central**, só com propriedades das unidades, e como esse sinal chega às Uint moduladoras (disparos fásicos, [moduladores](modulator-release-v0.md), 7.5.4).

**Estado:** observação do NB e hipóteses. Nada decidido. Os nomes usados aqui são descrições; nenhum termo novo foi criado.

## 1. Observação do NB

### N1. Novidade e surpresa são coisas diferentes
Fonte: Barto, Mirolli & Baldassarre 2013, Front Psychol 4:907. Lido: cerca de 2/3 do texto integral (PMC).
- **Novidade** depende da memória: algo é novo quando não está guardado. Não precisa de previsão.
- **Surpresa** é a discrepância entre uma expectativa e o que ocorre. Precisa de previsão e de comparação, mas não de busca na memória. O item que surpreende pode ser familiar ou novo.
  - Exemplo dos autores: aperta-se o destravar e a porta do carro continua trancada. É algo familiar, mas inesperado.
- Os autores defendem que as respostas "de novidade" da dopamina a luzes e tons se explicam melhor como surpresa: elas persistem com a repetição.
- Os autores defendem também que os dois podem envolver circuitos diferentes.

### N2. Novidade de curto prazo já aparece em neurônios isolados
Fonte: Ulanovsky, Las & Nelken 2003, Nat Neurosci 6:391. Lido: resumo e trechos do texto.
- Neurônios do córtex auditivo primário respondem mais a um som raro do que ao mesmo som quando é comum. É a **adaptação específica ao estímulo**.
- Depois ela foi achada também no tálamo e no colículo inferior (J Neurosci 2009, 29:7359, tálamo de camundongo; J Neurosci 2009, 29:5483, colículo de rato; trechos — autores não conferidos).
- Ressalva: Farley et al. (J Neurosci, trecho) acham que essa adaptação é dissociável do potencial cortical de "descompasso". Ou seja, adaptar-se não é o mesmo que detectar novidade em sentido pleno. Confiança na ressalva: média.

### N3. A surpresa vem da comparação entre previsão e entrada, numa unidade que recebe as duas
- **Hipocampo** (Lisman & Grace 2005, Neuron 46:703; lido o texto integral, por resumo da ferramenta). CA1 funcionaria como comparador. CA3 manda a previsão e o córtex entorrinal manda a entrada direta. A resposta a sons novos em CA1 aparece em menos de 100 ms (confiança: alta quanto ao que o artigo afirma). Os autores dizem que o local exato não é certo.
- **Córtex visual do camundongo** (Keller, Bonhoeffer & Hübener 2012, Neuron; lido o resumo; Jordan & Keller 2020, trecho). Há neurônios que disparam quando o fluxo visual não corresponde ao esperado pelo movimento.
  - Mecanismo proposto: a previsão chega excitando e a entrada real chega inibindo. Quando a entrada esperada falta, a excitação fica sem freio e o neurônio dispara.
  - Ressalva: Muzzu & Saleem 2021 (Cell Rep, resumo) explicam parte desses sinais só por seletividade sensorial e motora. Confiança no mecanismo: média.
- **Peixe-elétrico** (Bell 1981 e seguintes; revisões Roberts & Leen 2010, Requarth & Sawtell 2014, Enikolopov et al. 2018; trechos). O circuito aprende uma **imagem negativa** da entrada previsível e a soma à entrada real. O previsível se cancela e o inesperado se destaca.
  - O aprendizado ocorre por plasticidade anti-Hebbiana na via que traz a previsão.
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

### 2.3 Surpresa (algo previsto que não veio, ou algo que veio sem ser previsto)
- A previsão já existe: é a pré-ativação por Upro de cadeias e relações formadas ([aprendizado diferido](deferred-learning-v0.md), 6; [tempo](time-representation-v0.md)).
- A comparação aconteceria em Uint que recebem **as duas vias**: a da previsão, interna, e a da entrada que vem da transdução. Não há comparador especial; é qualquer Uint com essa convergência.
- **Hipótese H-N2:** o sinal da Upro decide o caso, e o sinal está na Upro (decisão 2.15).
  - **Previsão excita, entrada real inibe:** a Uint dispara quando o previsto **não chega** (como em N3, córtex visual).
  - **Entrada real excita, previsão inibe:** a Uint dispara quando chega o que **não foi previsto**. É a imagem negativa de N3, no peixe-elétrico.
- Essas Upro inibitórias nasceriam da experiência pela regra que já decidimos (2.15): nascimento por falha de previsão e ganho que cresce com coatividade.
  - Equivalência declarada: no peixe-elétrico, o aprendizado é anti-Hebbiano numa sinapse excitatória. Aqui seria Hebbiano numa Upro inibitória. A função é a mesma (cancelar o previsível); o mecanismo, não.
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
1. Adotamos a **distinção** entre novidade (falta na memória) e surpresa (previsão violada) como duas coisas diferentes no programa?
2. **Novidade de curto prazo** pela supressão lenta já existente, sem peça nova: serve?
3. **H-N1:** novidade de longo prazo como amplitude da atividade: serve como hipótese a observar?
4. **H-N2:** surpresa nas Uint que recebem previsão e entrada, com o caso decidido pelo sinal das Upro: serve?

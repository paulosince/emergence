# V0.17 — Ensaio mínimo do mecanismo (controle de engenharia)

**Data:** 16/11/2026. **Estatuto:** instrumental, antes do congelamento (seção 5.4 do pré-experimento). **Não é a V0.17.** Onde as decisões D1–D9 não bastavam, o assistente usou regras provisórias, marcadas nos scripts.

## Parte 1 — sinais nos microfones ([script](sinais_microfones.py), [saída](parte1-saida.txt))

Geometria das decisões D14 e D19; sem reflexões; modelo esférico de cabeça (Brown e Duda, 1998; fórmulas de fonte secundária, a verificar); trecho de 10 s a partir de 200 s.

| Condição | Atraso da orelha direita (300–800 Hz) | Diferença de nível esquerda − direita |
|---|---|---|
| Só o alto-falante próximo (canal E) | +0,458 ms | +1,6 dB (0,5–1 kHz); +8,2 dB (2–4 kHz); +13,7 dB (4–8 kHz) |
| Só o distante (canal D) | −0,458 ms | −1,4; −8,1; −13,9 dB |
| Os dois juntos | +0,583 ms (medida por correlação; confiança média) | +0,4; +3,0; +5,6 dB |

**Leitura:**
- As duas pistas chegam aos microfones e mudam de sinal entre os alto-falantes. O próximo domina na mistura, como previsto.
- **Correção de previsão:** com a cabeça esférica, a diferença de chegada é ~**0,46 ms**, não os 0,29 ms da conta em linha reta usada até aqui. A fórmula de Woodworth dá 0,375 ms a 90°; o filtro de sombra acrescenta atraso nos graves. P3 precisa usar o valor medido na própria simulação.

## Parte 2 — um par de vias, sinal periódico ([script](par_de_vias_vetorizado.py), [saída](parte2-saida.txt))

Duas vias com pulsos periódicos, a segunda 0,458 ms depois da primeira, jitter de 0,02 ms; 6 episódios de 20 s, um a cada 3 min; período fixo (5 ms) ou variando por episódio.

| Medida | Período fixo | Período variando |
|---|---|---|
| Ramos por Upro | 6 → **74 em ~50 ms** (todo o reticulado possível) | igual |
| Ramos sem nenhum acerto num episódio | **0** em todos os episódios | **0** |
| Ramos removidos | **0** | **0** |
| Relação mais creditada | a verdadeira (0,39–0,44 ms) | a verdadeira |
| Fração do crédito na relação verdadeira | 0,42 | 0,33 a 0,55, maior com períodos longos |

**Leitura:**
1. **O brotamento cobre a faixa inteira** em ~50 ms: é o contraexemplo do mínimo M4. Um quase-acerto basta para brotar, e com entrada periódica há quase-acertos a todo pulso.
2. **Não há seleção.** Todo ramo acerta em todo episódio, por relações verdadeiras ou por *aliasing* (Δ ± k·período). A força satura (bastam ~10 acertos), e nenhum ramo passa 10 min sem acerto. As regras decididas **só fortalecem**: não existe enfraquecimento dentro do episódio nem competição entre ramos.
3. **O sinal está lá:** a relação verdadeira é a mais creditada, e a variedade de períodos muda o *aliasing* de um episódio para outro. Falta um mecanismo que transforme essa diferença de crédito em seleção.

## Parte 3 — custo ([script](custo_vias.py), [saída](parte3-saida.txt))

Com calibração **provisória** dos limiares (percentil 90 de cada faixa; a calibração da V0.17 não foi decidida):
- **~19.700 incidências por segundo** nas 384 vias (mediana de 96/s por faixa; máximo de 407/s).
- **~7,8 milhões de comparações por segundo** se a Pcrt comparar cada incidência com as das outras vias nos 20 ms anteriores.
- Projeção do assistente (confiança baixa): com as regras atuais, cada par de vias que criar uma Uint tende a encher ~148 ramos. Bastam ~7.000 pares para passar do limite de 1.000.000 de ramos (D18). Com 384 vias há ~73.000 pares possíveis. **A V0.17, como está, provavelmente seria interrompida pelo limite.**

## O que precisa ser decidido antes de congelar (para o responsável)

1. **Enfraquecimento ou competição.** No Sdom, o responsável já decidiu que "reforço e decaimento devem agir no mesmo aspecto, em sentidos opostos", e que se enfraquece quando a incidência chega fora de sincronia. As decisões da V0.17 ainda não têm isso.
2. **Brotamento exigindo recorrência**: brotar só depois de o mesmo quase-acerto se repetir, como se exige para o acerto.
3. **O valor de P3:** usar a diferença de chegada medida na simulação (~0,46 ms), não a da conta em linha reta.
4. **Calibração dos limiares das Utrd** para a gravação.
5. **A D11c** (ver a [investigação](../investigacao-repeticao.md)).

## Parte 2, rodada 2 — com D20–D23 ([script](par_de_vias_v2.py), [saída](parte2-rodada2-saida.txt))

Mesmo par de vias. Testa decaimento, competição e portão do brotamento. **A inibição (D22) não foi testada**: com um único par não há inibição lateral, e como o acerto (D2) é só a coincidência dentro da janela, a inibição pré-alimentada não muda o que é acerto.

| Medida | Fixo 5 ms | Variando por episódio | Mudando a cada 250 ms (como notas) |
|---|---|---|---|
| Ramos por Upro no fim | A 19, B 30 | A 20, B 39 | A 23, B 63 |
| Ramos estáveis no fim | quase todos | quase todos | quase todos |
| Crédito na relação verdadeira | 0,64–0,69 | 0,58–0,65 | 0,26–0,46 |
| Relações diferentes acertando | ~60 | ~80 | ~550–770 |
| Maior força de um ramo | ≤ 0,29 | ≤ 0,27 | ≤ 0,28 |

**Leitura:**
1. **A exuberância ficou contida** (de 74 para 13–63 ramos), e no período fixo o crédito na relação verdadeira subiu (0,42 → ~0,66).
2. **A estabilização ficou fácil demais:** basta um ramo acertar em dois episódios separados por 2 min, o que qualquer ramo consegue por coincidência. Estável, ele fica livre do decaimento, e a seleção para.
3. **Com períodos mudando como notas, piora:** com dezenas de ramos, quase todo ramo encontra algum parceiro coincidindo por acaso a cada pulso (perto de 8% de chance por par, estimativa do assistente). Como o acerto não depende da força, cada ramo "acerta" quase sempre.
4. **Nenhum ramo passa de 0,29:** a força total de 1,0 fica dividida entre os muitos ramos que acertam. A Uint nunca chega ao limiar.

**O ponto central (dedução do assistente):** o que deixa "tudo gerar tudo" é a **D2**, porque o acerto independe da força e do estado da Uint. Na biologia, o fortalecimento depende do estado da célula que recebe, e é por aí que a inibição age sobre o aprendizado. Enquanto o acerto não depender da força, a inibição não tem como selecionar.

## Parte 2, rodada 3 — com D2′, D3′ e D24 ([script](par_de_vias_v3.py), [saída](parte2-rodada3-saida.txt))

Acerto passa a exigir soma líquida ≥ 0,3 na Uint, com inibição pré-alimentada (−0,5, uma janela depois); força inicial 0,15; estável exige acertos espaçados e força ≥ 0,5.

**Resultado: colapso nas três condições.** No 1º episódio, poucos pares acertam, e são de *aliasing* (por exemplo, ramo de 20 ms em A com 9,56 ms em B, diferença ≈ Δ + 2 períodos). A relação verdadeira tem **crédito zero**. Do 2º episódio em diante, nenhum acerto, nenhum disparo. Todos os ramos somem no 5º episódio.

**Por quê (dedução do assistente, conferida nos números):**
1. **O desacerto pesa por chegada:** −0,01 por chegada sem coincidência, a ~200 chegadas por segundo, dá ~−2 por segundo. Só sobrevive quem acerta a quase todo pulso.
2. **A relação verdadeira precisa de brotos, e brotar exige força ≥ 0,3**, que ninguém tem sem antes acertar. Os ramos iniciais (iguais nas duas vias) ficam a 0,458 ms da coincidência verdadeira, fora da janela. É um círculo: sem broto não acerta, e sem acerto não brota.
3. **0,15 + 0,15 = 0,3 exige coincidência quase perfeita:** o decaimento dentro da janela e a inibição pré-alimentada deixam a soma abaixo de 0,3 em quase todo par.
4. **No silêncio entre episódios** (160 s), a meia-vida de 30 s apaga até os vencedores, porque ninguém chegou a ser estável.

**Leitura geral das três rodadas:** o sistema passa de "tudo gera tudo" (rodada 1) para "nada sobrevive" (rodada 3) com mudanças pequenas. Os parâmetros interagem: o desacerto por chegada depende da taxa de disparo, o portão de força do broto depende do acerto, e o favorecimento depende da força inicial e da janela.

## Mapa de sensibilidade (opção c) — [faixas registradas antes](mapa-faixas.md), [script](mapa.py), [dados](mapa-saida.csv)

144 execuções (72 combinações × 2 condições), semente 1. Para poupar tempo, uma execução é interrompida se passar de 300 ramos (é contada como explosão).

| Classe | Execuções |
|---|---|
| Colapso | 108 |
| Explosão | 14 |
| Difuso | 15 |
| **Seleção** | **7** |

**Onde aparece a seleção:** só com **ganho de 0,0065 por acerto** (~100 acertos, o extremo superior da faixa aceita) e **meia-vida de 300 s**; seis das sete com força inicial 0,15. Nas condições de notas, com portão de broto 0,3, o crédito na relação verdadeira foi de 0,69 a 0,84, e **a Uint disparou** em ~900 pulsos do último episódio. No período fixo, houve seleção com portão igual à força inicial, mas as forças ficaram baixas (≤ 0,15) e a Uint não disparou. O modo de enfraquecimento (sincronia, ou por chegada a 5% ou 15,4% do ganho) não decidiu entre seleção e não seleção.

**O que o mapa mostra:**
1. **Meia-vida de 30 s colapsa sempre** (72 de 72). Com silêncios entre episódios, tudo some antes de poder estabilizar.
2. **Ganho grande prende o primeiro acaso:** com +0,065 por acerto, no período fixo, um par de *aliasing* chega a força 1,0 cedo e fica com todo o crédito (crédito verdadeiro 0). Ganhos pequenos deixam a evidência se acumular. Isso concorda com a literatura (ganho de ~0,5% por pareamento em Song et al., 2000).
3. **A região de seleção é estreita**, e com uma única semente. Antes de congelar, ela precisa ser confirmada com mais sementes.

## Confirmação com 10 sementes ([registro prévio](mapa-faixas.md#4-confirmação-com-10-sementes-registrada-antes-de-rodar-16112026), [script](confirmacao.py), [dados](confirmacao-saida.csv))

Conjunto: ganho 0,0065; meia-vida 300 s; força inicial 0,15; enfraquecimento por sincronia.

| Portão do broto | Condição | Seleção | Outras classes | Crédito verdadeiro | Disparos da Uint (último episódio) |
|---|---|---|---|---|---|
| **0,30** | **notas** | **9 de 10** | 1 difuso | 0,72–0,88 | 583–915 pulsos nas seleções |
| 0,30 | fixo | 2 de 10 | 8 difusos | 0,335 nos difusos | 0 nos difusos |
| 0,15 | notas | 4 de 10 | 5 explosões, 1 difuso | 0,63–0,88 | 0–5 |
| 0,15 | fixo | 2 de 10 | 8 difusos | 0–0,15 nos difusos | 0 |

**Critério registrado (≥ 8 de 10 em notas): satisfeito para o portão 0,30 (9 de 10).** O portão 0,15 não satisfaz.

**Leitura:** com período variando como notas, o conjunto seleciona a relação verdadeira com regularidade, e a Uint passa a disparar. Com uma única nota repetida para sempre (período fixo), o *aliasing* vence em 8 de 10 sementes; o mundo sem variação não dá ao sistema o que selecionar. É coerente com a hipótese de que o mundo seleciona. **Limites:** um par de vias, pulsos ideais, não as 384 vias nem a gravação; a inibição lateral não foi testada.

## Ensaio da inibição pré-alimentada (16/11/2026)

Registro prévio: [inibicao-prealimentada.md](inibicao-prealimentada.md), aprovado pelo responsável. Código: `inibicao.py` (testes em `test_inibicao.py`, 4 aprovados). Saída: `inibicao-saida.csv`, `inibicao-progresso.txt`.

**Execução:** as 40 execuções do grave terminaram. O agudo foi **interrompido** pelo assistente depois de 22 min sem terminar nenhuma execução (ver errata no registro prévio). Nenhum resultado do agudo foi visto.

**Grave (notas de 2,5–8 ms), 10 sementes por condição:**

| Condição | Seleção | Explosão | Colapso | Crédito verdadeiro (mediana) | Par mais forte verdadeiro | Dispersão (mediana, ms) |
|---|---|---|---|---|---|---|
| I0 sem inibição | 5 | 5 | 0 | 0,754 | 6 | 0,060 |
| I1 uma janela depois, 0,30 ms | 8 | 2 | 0 | 0,805 | 10 | 0,060 |
| I2 0,3 ms antes, 0,30 ms | 0 | 0 | **10** | 0 | 0 | — |
| I3 0,3 ms antes, 1,5 ms | 0 | 0 | **10** | 0 | 0 | — |

**Leitura pelas regras fixadas (seção 7):** "adotar a duração biológica" **não** se aplica (I3 não seleciona em nenhuma semente). As regras do agudo não podem ser aplicadas. A dispersão não mudou entre I0 e I1.

**Mecanismo (conta do assistente, conferível):** no começo, cada ramo tem força 0,15; dois ramos coincidindo somam no máximo 0,30, exatamente o favorecimento exigido (0,3). Com a inibição chegando antes, a própria dupla se inibe: soma máxima 0,245 (I2) e 0,177 (I3), abaixo de 0,3 em qualquer intervalo. Nada é favorecido, nada se fortalece: colapso. Com a inibição depois (I1), a dupla não se inibe; só as chegadas seguintes são freadas, o que **reduziu as explosões** (5 → 2) e deixou o par mais forte correto em 10 de 10.

**Achado não previsto:** I1, a forma que vinha rodando, foi **melhor** que nenhuma inibição. A previsão 1 (I0, I1 e I2 parecidas) falhou.

**Limites:** um par de vias, pulsos ideais; a inibição vem na mesma Upro e com a mesma força da excitação (simplificação da D22); na oliva ela vem de outra unidade, com força própria (proporção 1:1 de condutância nos experimentos de Myoga et al., 2014, com entradas fortes).

## Ensaio da inibição pré-alimentada fiel (16/11/2026)

Registro prévio: [inibicao-fiel.md](inibicao-fiel.md), aprovado pelo responsável. Código: `inibicao_fiel.py` (testes em `test_inibicao_fiel.py`, 3 aprovados; a tolerância do teste do pico foi afrouxada de 1e-9 para 1e-3 porque a grade de 1 µs pode cair um passo depois do instante exato). Saída: `inibicao-fiel-saida.csv`, `inibicao-fiel-progresso.txt`.

**Controle de código:** com a força da inibição zerada, o script fiel reproduz exatamente a condição sem inibição do ensaio anterior (semente 1: seleção, crédito 0,824, 1600 disparos).

| Condição | Seleção | Colapso | Acertos em toda a execução |
|---|---|---|---|
| F (amadurece com os acertos) | 0 | **10** | 0 em todas |
| F-imatura | 0 | **10** | 0 em todas |
| F-madura | 0 | **10** | 0 em todas |

**Leitura pela regra fixada (seção 6):** "não funciona" (F seleciona em ≤ 3 de 10). Previsão 1 (F-madura colapsa) confirmada; o risco da previsão 2 se realizou por inteiro.

**Mecanismo (dedução do assistente):** a inibição imatura dura 4 ms e chega 2,7 ms depois de cada chegada; com 12 ramos e pulsos a cada 2,5–8 ms, as inibições de chegadas anteriores se somam num freio contínuo durante as notas, e **nenhuma** coincidência alcança o favorecimento, nem a primeira. Sem acerto, a inibição nunca amadurece: o processo não tem como começar.

**O que isso diz (para o responsável):** a regra fiel exige, para funcionar, algo que este ensaio não tem: excitação também "jovem" (lenta e longa, como na biologia; ver a observação da seção 5 do registro prévio). Com excitação adulta (0,30 ms) e inibição jovem (4 ms), a inibição sempre vence.

## Motor rápido do par de vias (16/11/2026) — engenharia, nenhuma regra nova

`motor_par.py` (numba) reproduz a mesma dinâmica de `inibicao.py` e `inibicao_fiel.py`. `valida_motor_par.py` compara com as 70 execuções de referência do grave: **idênticas em todos os campos (70/70)**, 119 s de CPU no total com 2 processos. **Não medido:** o tempo nas notas agudas (uma tentativa passou de 10 min sem terminar e foi encerrada pelo ambiente; nenhum resultado foi visto). Rust discutido, não tentado.

## Errata (17/11/2026) — o motor do ensaio mínimo não seguia a decisão sobre o insumo da Pcrt

**O erro (do assistente, na implementação):** em todos os scripts do ensaio mínimo (`par_de_vias_v2.py` em diante, `mapa.py`, `confirmacao.py`, `inibicao.py`, `inibicao_fiel.py` e `motor_par.py`), um mesmo laço faz duas coisas: a dinâmica do Sdom (chegadas pelos ramos, soma na Uint, acerto) e a Pcrt (quase-acertos e brotamento). E a Pcrt roda sobre **todos os pares de ramos a cada pulso**, inclusive os que acertaram. A decisão de 15/11 diz que o insumo da Pcrt é **o que não encontrou representação** (incidências que expiraram sem integração; num Sdom virgem, tudo). Nenhum script tem a noção de incidência integrada (verificado por busca no código).

**Como foi achado:** pela etapa 2 de medição de desempenho (ramo `perf-motor-par`): 90–93% do tempo está na avaliação por pares de ramos, e o trabalho cresce muito mais rápido que a duração. A pergunta do responsável ("por que iteramos sobre ramos, e não sobre incidências?") levou à releitura.

**Estatuto dos resultados acima:** valem **para o motor antigo**. Em especial o conjunto confirmado (9 de 10), a região do mapa e o plano B da inibição (8 de 10) **não valem automaticamente** para o motor corrigido. As decisões de mecanismo que não dependem do motor continuam de pé.

**Decisão do responsável (17/11/2026):** a V0.17 **não é encerrada**: o pré-experimento não foi congelado e nenhuma execução do experimento ocorreu; o ensaio mínimo existe para achar erros assim antes de congelar. Corrige-se o motor (a Pcrt passa a se limitar às incidências), com registro prévio aprovado, e repete-se o ensaio mínimo. Parâmetro que mudar depois disso vira decisão registrada com motivo. Registro prévio: [pcrt-incidencias.md](pcrt-incidencias.md).

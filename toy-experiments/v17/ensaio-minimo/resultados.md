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

## Motor por eventos — controle de código (17/11/2026)

Registro prévio: [pcrt-incidencias.md](pcrt-incidencias.md) (aprovado). Código: `motor_eventos.py`; controle: `controle_eventos.py`; saída: `controle-eventos-saida.csv`.

**Desvio declarado do registro prévio:** o controle prometido ("com o brotamento desligado, resultado idêntico ao motor antigo") **não é possível por construção**. Ao implementar, o assistente verificou que a dinâmica por eventos difere do motor antigo em detalhes de contagem que não são regras do responsável, mas que impedem a igualdade bit a bit: (1) o motor antigo reforça cada ramo no máximo uma vez por pulso de A; o novo, no máximo uma vez por chegada; (2) o antigo procura só a incidência mais próxima de cada par de ramos; o novo olha todas as chegadas a até uma janela (equivalente quando o período é maior que 2 janelas, o que vale aqui); (3) no antigo, o enfraquecimento por sincronia de B usava o instante do pulso de B com o mesmo índice do pulso de A (defeito do código antigo); o novo usa o instante real da chegada; (4) soma exata, sem corte em 5 constantes de tempo; (5) a contagem de quase-acertos é por ramo, não por par. O controle foi substituído por uma **comparação** com o brotamento desligado nos dois motores (grave, notas, 10 sementes), a ser aceita ou não pelo responsável.

| Condição | Mesma classe | Seleção (antigo → novo) | Tempo por execução (antigo → novo) |
|---|---|---|---|
| I0 | 6 de 10 | 4 → 5 | ~0,1 s → 0,02 s |
| I1 | 9 de 10 | 7 → 6 | ~0,1 s → 0,04 s |

Os trens de pulsos são idênticos nos dois motores (verificado). O número de acertos é ~1,4–1,7 vez maior no novo, pela diferença (1) de contagem.

**Tempo com brotamento (Q = 0,75; janela 60 s; sem enfraquecimento; semente 1; I1):** grave **0,13 s**, agudo **0,97 s** por execução (o motor antigo passava de 10 min no agudo sem terminar). Esse resultado único foi visto pelo assistente antes da etapa A: grave = seleção (crédito 0,814; 3 estabilizações; força máxima ~0,25; a Uint quase não dispara no último episódio); agudo = difuso (crédito 0,098).

## Etapa A — motor por eventos (17/11/2026)

Controle aceito pelo responsável (comparação, ver seção anterior). Script `etapa_a.py`; dados `etapa-a-saida.csv`. Grave, notas, I1, 10 sementes por combinação; **180 execuções em 6,7 s** no total (2 processos).

| Quase-acerto (fração do limiar) | Janela do acerto recente | Enfraquecimento do isolado | Seleção | Difuso | Explosão | Colapso | Crédito (mediana) | Força máxima (mediana) |
|---|---|---|---|---|---|---|---|---|
| 0,50 | 10, 60 ou 600 s | sem / com | 4 | 6 | 0 | 0 | 0,79 | 0,26 / 0,30 |
| 0,75 | 10, 60 ou 600 s | sem / com | 4 | 6 | 0 | 0 | 0,80 / 0,82 | 0,25 |
| 0,90 | 10, 60 ou 600 s | sem / com | 3 | 7 | 0 | 0 | 0,84 | 0,33 |

**O que se vê:** nenhuma combinação seleciona em mais de 4 de 10. A janela e o enfraquecimento quase não mudam nada (as classes são idênticas entre as janelas). Nenhuma explosão e nenhum colapso. A Uint dispara cerca de 1 vez no último episódio (mediana), e ~96% das incidências do último episódio terminam sem integração (insumo da Pcrt).

**Comparação que ajuda a ler (dados do controle, brotamento desligado):** sem brotamento, a força máxima chega a **1,0** e a Uint dispara ~2.000 vezes no último episódio, nos dois motores; a seleção é de 6–7 de 10. No motor antigo **com** brotamento, a força máxima também ficava em ~0,2–0,3.

**Hipótese do assistente (não verificada):** a força total de cada Upro é conservada (1,0); os ramos que brotam ao lado do verdadeiro também coincidem e dividem essa força. Com cada ramo em ~0,25, a soma raramente chega ao limiar, e o portão do broto (0,30) quase nunca é atingido. Por isso a janela não faz diferença: o gargalo seria o portão, não o acerto recente.

## Diagnóstico da força (17/11/2026) — pedido do responsável

Script `diagnostico_forca.py`; saída `diagnostico-forca-saida.txt`. Condição da etapa A (grave, notas, I1, quase-acerto 0,75, janela 60 s, sem enfraquecimento), 10 sementes, com e sem brotamento. O motor ganhou só medidas (retratos por episódio e contagem de bloqueios no portão); a dinâmica não mudou. "Ramo da relação verdadeira": ramo cuja diferença de atraso com algum ramo da outra Upro fica a até uma janela de Δ.

**Hipótese confirmada, com uma surpresa.** No fim do 5º episódio, com brotamento:
- A parte da força total que está nos ramos da relação verdadeira é de **70% a 100%** (mediana ~100%) **em 10 de 10 sementes**. O sistema acha a região da relação em todas.
- Mas ela fica **dividida entre 4 e 8 ramos vizinhos** por Upro, cada um com ~0,20–0,38. Sem brotamento, um único ramo fica com ~1,0.
- O portão do broto bloqueou entre ~3.800 e ~52.600 quase-acertos por execução (força abaixo de 0,30). O brotamento para cedo: por isso não há explosão, e a janela não muda nada.
- As sementes classificadas como "difuso" também têm a força na região certa. O classificador exige **um** par mais forte a até uma janela de Δ; com vários ramos empatados em ~0,25, esse par muitas vezes não é identificável.

**Leitura do assistente (não decisão):** o que falta não é achar a relação, mas (a) os vizinhos competirem entre si, ou (b) aceitar a região como a forma da relação (na MSO do gerbil, um mesmo axônio faz mediana de 4 contatos num dendrito; Callan et al. 2021, via investigação de escala) e entender por que, dividida, ela quase não faz a Uint disparar (as chegadas dos vizinhos se espalham no tempo).

## Diagnóstico do disparo (17/11/2026)

Decisões do responsável depois do diagnóstico da força: **ler "os dois, em ordem"** (primeiro entender por que a região quase não faz a Uint disparar; depois, se preciso, competição entre vizinhos) e **medir e reportar a parte da força na região da relação verdadeira** ao lado das classes, sem mudar o critério (o motor passa a devolver `parte_forca_regiao` e `ramos_na_regiao`).

Script `diagnostico_disparo.py`; saída `diagnostico-disparo-saida.txt`. Para cada semente, com os ramos do fim do 5º episódio, calculou-se o **pico da soma na Uint para um pulso isolado** (A em 0, B em Δ, sem ruído, com a inibição I1).

| Medida | Resultado (10 sementes) |
|---|---|
| Pico da soma, com os ramos como estão | **0,81 a 1,25**: abaixo do limiar (1,5) em **10 de 10** |
| Pico, se a força da região estivesse toda no par verdadeiro mais forte | 1,25 a 1,90: acima do limiar em **6 de 10** |
| Espalhamento dos atrasos dos ramos da região | dois grupos: **0,17–0,42 ms** (5 sementes) e **3,6–4,6 ms** (5 sementes) |

**Leitura do assistente (conferível nos dados):** a força se divide de **dois jeitos**.
1. **Cópias da mesma relação em atrasos diferentes:** a relação é a *diferença* de atraso (a − b ≈ Δ). Pares como (~0,5 ms; ~0,05 ms antes) e (~5 ms; ~4,5 ms) são ambos verdadeiros, mas chegam em instantes distantes e não se somam. Com a força total conservada, as cópias dividem a força entre si.
2. **Vizinhos colados:** quando a região é estreita (0,2–0,4 ms), os vizinhos chegam quase juntos, mas espalhados o bastante para a inibição do plano B (uma janela depois) frear as chegadas de trás: sem inibição, o pico sobe (por exemplo, 1,02 → 1,20).

## Ensaio da competição ligada ao disparo (17/11/2026)

Registro prévio: [competicao-disparo.md](competicao-disparo.md) (aprovado). Script `ensaio_competicao.py`; dados `competicao-saida.csv`. **80 execuções em 12 s.** Controle de regressão: com a regra desligada, o motor reproduz a etapa A exatamente (10 de 10 na combinação 0,75 / 60 s / sem enfraquecimento).

| Faixa | Largura da janela do disparo | X (fase não hebbiana) | Seleção | Colapso | Difuso | Parte da força na região (mediana) | Ramos na região | Força máxima | Disparos (último episódio) |
|---|---|---|---|---|---|---|---|---|---|
| grave | 0,30 ms | 10 ou 60 s | 7 | 1 | 2 | 1,00 | 9 | 0,26 | 1 |
| grave | **1,0 ms** | 10 ou 60 s | **8** | 1 | 1 | 1,00 | 9 | 0,26 | 1 |
| agudo | 0,30 ms | 10 ou 60 s | 0 | 9 | 1 | 0 | 0 | 0,008 | 0 |
| agudo | 1,0 ms | 10 ou 60 s | 0 | **10** | 0 | 0 | 0 | 0,03 | 0 |

**Pelas regras fixadas:** no grave, a largura de 1,0 ms seleciona em **8 de 10** → segue para a etapa B. O X não mudou nada (resultados idênticos entre 10 e 60 s), então a escolha do conjunto fica com o responsável.

**Mas as previsões de mecanismo não se confirmaram:** previsão 1 (menos ramos na região, força máxima maior) **falhou**: continuam ~9 ramos na região e força máxima ~0,26, como na etapa A. A previsão 3 (risco) **se realizou**: a Uint dispara pouco depois do brotamento, e a regra agiu pouco (mediana de ~109 fortalecimentos por disparo em toda a execução). A melhora de 4 para 8 de 10 não veio de a competição ter desempatado os vizinhos; sem análise adicional, a causa não é conhecida.

**Agudo:** passou de "difuso" (etapa A) para **colapso** em 19 de 20. Leitura do assistente, a verificar: no agudo a Uint dispara logo no início; o reforço no favorecimento fica desligado por X segundos e o enfraquecimento depois do disparo age; a força cai a quase zero e os ramos são podados (mediana de 1,5 a 4,5 ramos no fim).

## Etapa B (17/11/2026) e diagnóstico em paralelo

Decisão do responsável: rodar a etapa B já, com o conjunto 1,0 ms / X = 10 s, e diagnosticar em paralelo. Script `etapa_b.py`; dados `etapa-b-saida.csv` (80 execuções, 5,5 s). Diagnóstico: `diagnostico_etapa_b.py`, `diagnostico-etapa-b-saida.txt`.

| Faixa | Estímulo | Inibição | Seleção | Colapso | Difuso | Parte da força na região | Força máxima | Disparos (último ep.) |
|---|---|---|---|---|---|---|---|---|
| grave | notas | I0 | 7 | 0 | 3 | 1,00 | 0,26 | 2 |
| grave | notas | **I1** | **8** | 1 | 1 | 1,00 | 0,26 | 1 |
| grave/agudo | período fixo* | I0 | 0 | 0 | 10 | 0,31 | 0,36 | 0 |
| grave/agudo | período fixo* | I1 | 0 | 0 | 10 | **0,01** | **1,00** | **1.999** |
| agudo | notas | I0 | 0 | 7 | 3 | 0 | 0 | 0 |
| agudo | notas | I1 | 0 | **10** | 0 | 0 | 0,03 | 0 |

\* No período fixo, o trem é o mesmo para grave e agudo (5 ms), então as linhas são idênticas.

**Pelas regras fixadas:** I1 no grave com notas = **8 de 10** → "o conjunto é mantido para os degraus seguintes". O agudo é lido à parte: **não passa**.

**Diagnóstico (1) — por que o grave subiu de 4 para 8 de 10:** semente a semente, o **crédito quase não mudou** e a força máxima também não. O que mudou foi o **par mais forte** do classificador: em 5 sementes ele passou de "não identificável" a "verdadeiro". A estrutura continua a mesma da etapa A (força ~100% na região, dividida entre ~9 ramos). **A melhora é sobretudo de desempate do classificador, não de mecanismo.** Uma semente (2) passou de seleção a colapso.

**Diagnóstico (2) — por que o agudo colapsa:** sem a regra nova, a soma das forças de cada Upro fica perto de 1,0 em todos os episódios; com ela, cai para perto de zero em alguns episódios (por exemplo, 0,036 e 0,0). Leitura do assistente: no agudo, as chegadas são densas; cada disparo enfraquece **todas** as chegadas dos 1,5 ms seguintes, de qualquer ramo; a conservação só corta o que passa de 1,0 e não repõe o que falta. A força se esvai.

**Período fixo:** com I1, um *aliasing* fica com força 1,0 e a Uint dispara ~2.000 vezes, mas fora da região verdadeira (0,6% da força). Coerente com a hipótese de que, sem variação, o mundo não dá ao sistema o que selecionar.

## Ensaio da estrutura fibra / Upro com várias cabeças / estoque na Uint (17/11/2026)

Registro prévio: [estrutura-ramos.md](estrutura-ramos.md) (aprovado). Código `motor_estrutura.py`; script `ensaio_estrutura.py`; dados `estrutura-saida.csv`. **60 execuções em 158 s.**

**Erro de conta no registro prévio (do assistente):** o registro dizia "80 execuções" para a forma principal e "100" no total. A grade descrita (grave e agudo × notas e período fixo × I1 × 10 sementes) dá **40**, e o total, **60**. Rodou-se a grade descrita.

| Faixa | Estímulo | Forma | Seleção | Difuso | Uints sintonizadas (mediana) | Força máxima | Força total | Ramos |
|---|---|---|---|---|---|---|---|---|
| grave | notas | principal | **1** | 9 | 0 | 0,40 | 16,0 | 208 |
| grave | notas | uma Upro por Uint | 3 | 7 | 0 | 0,40 | 16,0 | 173 |
| agudo | notas | principal | 0 | 10 | 0 | 0,12 | 15,5 | 264 |
| agudo | notas | uma Upro por Uint | 0 | 10 | 0 | 0,19 | 15,5 | 213 |
| grave e agudo | período fixo | principal | 0 | 10 | 0 | 1,00 | 16,0 | 36 |

**Pela regra fixada:** grave com notas, forma principal, **1 de 10 ≤ 3** → **parar e levar ao responsável**. O agudo não seleciona.

**O que se vê:**
- No grave, **70–78% dos acertos** de cada Uint estão na relação verdadeira, mas as Uints quase não disparam (1–3 vezes no último episódio). A força total fica em 16,0 = 8 Uints × 2 lados × 1,0: **o estoque de cada lado de cada Uint está cheio e dividido entre ~13 ramos**, cada um com ≤ 0,4.
- A previsão 1 (a força deixa de se dividir) **falhou**. A divisão mudou de lugar: saiu da Upro e foi para o lado da Uint.
- Período fixo: Uints disparam ~2.000 vezes com ramos de força 1,0, mas em relações erradas ou mistas (25–50% verdadeira); nenhuma conta como "presa no acaso" (< 20%) nem como sintonizada.
- Agudo: 7–8% dos acertos na relação verdadeira (nível do acaso) e nenhum disparo.

**Leitura do assistente (não decisão):** qualquer **estoque fixo** dividido entre **muitos candidatos igualmente bons** termina dividido, esteja ele na Upro ou na Uint. No controle sem brotamento (6 ramos), a força chegou a 1,0 e a Uint disparou ~2.000 vezes: com poucos candidatos, um vence; com exuberância, empatam. O que quebra o empate, na literatura lida, é o disparo — e o disparo não vem enquanto a força está dividida.

## Triagem das correções 1, 2 e 8 (17/11/2026)

Registro prévio: [correcoes-mapa.md](correcoes-mapa.md) (aprovado; maturação depois). Código `motor_correcoes.py` (derivado de `motor_estrutura.py`); script `mapa_correcoes.py`; dados `mapa-correcoes-saida.csv`. **729 execuções em 223 s** (grave, notas, I1, sementes 1–3).

**Resultado geral:** **624 de 729 execuções são seleção** (as outras, difuso; nenhuma explosão, nenhum colapso). **157 de 243 combinações** selecionam nas 3 sementes. Por número (seleções / 243): tamanho do recurso 0,5 → 167, 1,0 → 214, **2,0 → 243**; expoente 4 → 196, 8 → 209, 16 → 219; a reposição, a fração e o tempo da eliminação mudam pouco.

**O que mudou em relação a todos os ensaios anteriores:** as Uints **disparam** (milhares de vezes no último episódio), a força chega a 1,0 em vários ramos, ramos perdedores são eliminados (centenas por execução), e o **insumo da Pcrt cai a zero** a partir do 3º episódio — a criação de Upros para sozinha, como a previsão 1 dizia. Em várias combinações, as Uints sintonizadas usam 3 a 5 pares de Upros diferentes (as cópias caem em Uints diferentes, previsão 2).

| Conjunto (reposição / recurso / fração / tempo da eliminação / expoente) | Seleção | Uints sintonizadas | Parte verdadeira (mediana) | Ramos | Força total |
|---|---|---|---|---|---|
| 60 s / 1,0 / 0,25 / 60 s / 8 (valores centrais) | 3/3 | 7 | 0,90 | 120 | 63 |
| 60 s / 1,0 / 0,50 / 60 s / 16 | 3/3 | 8 | 0,96 | 45 | 43 |
| 300 s / 2,0 / 0,25 / 10 s / 4 | 3/3 | 8 | 0,95 | 120 | 57 |
| 60 s / 0,5 / 0,25 / 60 s / 8 | 1/3 | 6 | 0,88 | 94 | 29 |

**Cuidados (assistente):** (1) com tanta seleção, o controle do período fixo (na confirmação) é essencial para saber se a classe não ficou fácil demais; (2) a força **total** cresce muito (40–120), sem soma imposta — é o risco 1 na forma de força, não de número de ramos; (3) a medida "diferença preferida" como **média** de todas as diferenças dos acertos (como registrada) é puxada pelos acertos de *aliasing* e dá valores enganosos; a mediana seria melhor (mudança de medida a decidir).

## Confirmação das correções 1, 2 e 8 (17/11/2026)

Conjuntos escolhidos pelo responsável: A (60 s / 1,0 / 0,25 / 60 s / 8), B (60 s / 1,0 / 0,50 / 60 s / 16), C (300 s / 2,0 / 0,25 / 10 s / 4). Medida "diferença preferida" passou a ser reportada também como **mediana** (decisão do responsável). Script `confirmacao_correcoes.py`; dados `confirmacao-correcoes-saida.csv`. **120 execuções em 142 s.**

| Conjunto | Grave, notas | Agudo, notas | Período fixo* | Parte verdadeira (grave / agudo / fixo) |
|---|---|---|---|---|
| A | **10/10** | 0/10 (difuso; 8 Uints presas no acaso, no máximo) | **10/10** | 0,95 / 0,13 / 0,74 |
| B | **9/10** | 0/10 | 9/10 | 0,98 / 0,17 / 0,66 |
| C | **10/10** | 0/10 | 10/10 | 0,95 / 0,07 / 0,69 |

\* O trem do período fixo é o mesmo no grave e no agudo (5 ms).

**Pela regra fixada:** nenhum conjunto passa. O agudo seleciona em **0 de 10** (≤ 3 → parar e levar ao responsável), e o período fixo seleciona em 9–10 de 10 (a regra pedia ≤ 2).

**Diagnóstico do agudo** (`diagnostico_agudo_fase.py`, `diagnostico-agudo-fase-saida.txt`; conjunto A, sementes 1–3): os acertos das Uints no agudo se distribuem entre a relação verdadeira (11–18%), **Δ − período** (12–19%), **Δ + período** (6–7%) e **Δ ± 2 períodos** (17–19%). Ou seja, boa parte dos disparos "no acaso" está em **relações equivalentes de fase**. No grave, 80–96% dos acertos estão em Δ e quase nada nos equivalentes de fase.

**Leitura do assistente (não decisão):** (1) com período de 0,6–0,9 ms, Δ = 0,458 ms é maior que meio período: num único canal de frequência, Δ e Δ ± período são fisicamente equivalentes; a variação das notas (só 1,5× entre o menor e o maior período) desloca pouco os equivalentes em relação à janela de 0,21 ms. Na biologia, neurônios binaurais de banda estreita também respondem igualmente a uma diferença e às suas equivalentes de fase, e a ambiguidade é resolvida **combinando canais de frequência** (literatura, resumo; ver mensagem de 17/11). (2) No período fixo, nada no mundo distingue Δ de Δ ± 5 ms; a "seleção" de Δ reflete a estrutura inicial (os atrasos disponíveis favorecem diferenças pequenas), não o mundo. A expectativa registrada ("o período fixo não deve selecionar") vinha dos motores antigos, em que o fixo caía no *aliasing*.

## Critério de fase no agudo e controle da preferência da estrutura (17/11/2026)

Registro prévio: [fase-e-preferencia.md](fase-e-preferencia.md) (aprovado). Script `ensaio_fase_preferencia.py`; dados `fase-saida.csv` e `preferencia-saida.csv`. **240 execuções em 279 s** (210 previstas + 30 de reclassificação exploratória das sementes já vistas).

**Agudo, critério de fase, sementes novas (11–20):** A **4/10**, **B 9/10**, C 2/10. → **Só o conjunto B passa** (≥ 8/10). Exploratório (sementes 1–10, já vistas): A 5, B 9, C 5.

**Controle da preferência da estrutura (grave), seleção por Δ do mundo:**

| Conjunto | Notas, Δ = 0,458 | Notas, Δ = 1,5 | Notas, Δ = 3,0 | Fixo, Δ = 0,458 | Fixo, Δ = 1,5 | Fixo, Δ = 3,0 |
|---|---|---|---|---|---|---|
| A | 10 | 6 | 2 | 10 | 0 | 0 |
| B | 9 | 4 | 1 | 9 | 0 | 0 |
| C | 10 | **10** | 4 | 10 | 1 | 0 |

- Quando há Uints sintonizadas, a diferença preferida **acompanha o Δ do mundo** (medianas 0,45 / 1,46–1,50 / 2,96–3,08). Isto é o mundo escolhendo.
- Mas a **frequência** com que o sistema chega lá **cai** quando Δ cresce. **Pela regra fixada, o grave fica sob suspeita** de depender da estrutura (seleção < 8/10 em Δ = 1,5 e 3,0 nos conjuntos A e B, e em 3,0 no C).
- No período fixo, só Δ = 0,458 "seleciona": confirma que aquele resultado era **preferência da estrutura** por diferenças pequenas.
- **Leitura do assistente:** a estrutura inicial (atrasos grandes espaçados proporcionalmente, atrasos pequenos de 0–0,2 ms, novas Upros a ±10%) torna as diferenças pequenas muito mais fáceis de alcançar. O Δ do experimento real (±0,458 ms) cai justamente na zona fácil.

## Ensaio da maturação conjunta (correção 6) (17/11/2026)

Registro prévio: [maturacao.md](maturacao.md) (aprovado). Script `ensaio_maturacao.py`; dados `maturacao-saida.csv`. **380 execuções em 338 s.**

**Erro de conta no registro prévio (do assistente):** dizia 400 execuções, com "40 a mais" de referência; a referência descrita (grave e agudo × 10 sementes) dá **20**, e o total, **380**. Rodou-se a grade descrita.

| Condição | Grave (seleção) | Agudo (seleção em fase) | Maturidade média no fim |
|---|---|---|---|
| **Referência: conjunto B sem maturação, sementes 21–30** | **7/10** | 9/10 | — |
| Maturação, 18 combinações | **0/10 em todas** (colapso em 10/10 em 16 delas) | **0/10 em todas** | 0,00–0,29 |

**Pelas regras fixadas:** nenhuma combinação com maturação passa, e **a referência também não passa no grave nas sementes novas (7/10, abaixo de 8)** → "o resultado de B não se replica" → levar ao responsável.

**O que se vê:** com maturação, as Uints quase não acertam, a maturidade não sobe (fica perto de 0) e os ramos desaparecem (mediana 0 ramos no fim em 12 combinações). A única tendência: excitação jovem mais longa (1,5 ms), passo rápido (30 acertos) e regressão lenta (1 h) dão 6 difusos e maturidade 0,29.

**Leitura do assistente (conferível):** é o mesmo colapso da versão fiel de 16/11. Na inibição jovem (força 0,77, decaimento 4 ms), cada chegada deixa uma carga inibitória de ~0,77 × 4 = 3,1 (em unidades de força × ms), contra 0,6–1,5 da excitação jovem. Com chegadas a cada poucos milissegundos, a inibição acumulada vence sempre; sem acertos, a maturidade não sobe, e a inibição nunca amadurece. A faixa de excitação jovem escolhida (0,6–1,5 ms, sem fonte) é **curta demais** em relação à inibição jovem (4 ms, com fonte). Na biologia, os dois amadurecem juntos, mas o valor inicial da excitação jovem na MSO não foi encontrado.

## Replicação do conjunto B com 30 sementes (17/11/2026)

Registro prévio: [replicacao-b.md](replicacao-b.md) (aprovado). Script `replicacao_b.py`; dados `replicacao-b-saida.csv`. **60 execuções em 104 s.**

| Faixa | Sucessos (sementes 31–60) | Taxa | Intervalo de confiança de 95% (Wilson) | Pela regra |
|---|---|---|---|---|
| grave (seleção de Δ) | **28/30** | 93% | 79% a 98% | **passa** (≥ 24) |
| agudo (seleção em fase) | **27/30** | 90% | 74% a 97% | **passa** (≥ 24) |

**Exploratório (todas as sementes vistas):** grave 44/50 (sementes 1–10: 9; 21–30: 7; 31–60: 28); agudo em fase 45/50.
**Leitura:** o 7/10 das sementes 21–30 foi variação de amostra; o conjunto B se sustenta, com taxa perto de 90% nas duas faixas.

---

## Otimização, fase 1 (17/11) — plano em `otimizacao-fase1.md`, critério "estatístico + exato onde der"

Motor: `motor_rapido.py` (OPT=1: mudanças exatas 1–2 e retirada de um laço morto; OPT=2: mais decaimento sob demanda e eliminação a cada 1 ms). Script `valida_motor_rapido.py`, saída `valida-motor-rapido-saida.csv`. Conjunto B, inibição I1, 2 núcleos.

| teste | faixa | resultado | critério |
|---|---|---|---|
| exato (OPT=1), sementes 31–40 | grave | 10/10 saídas idênticas | **passa** |
| exato (OPT=1), sementes 31–40 | agudo | 10/10 saídas idênticas | **passa** |
| estatístico (OPT=2), sementes 61–90 | grave | referência 28/30, novo 28/30 (IC95% ref 79–98%) | **passa** (diferença 0 pp) |
| estatístico (OPT=2), sementes 61–90 | agudo, em fase | referência 24/30, novo 26/30 (IC95% ref 63–91%) | **passa** (diferença 6,7 pp; 87% dentro do IC) |

**Ganho de velocidade: nenhum.** Tempo médio por execução (50 s simulados): grave 0,37 → 0,34 s; agudo 5,7 → 5,7 s (OPT=1) e 6,3 → 6,5 s (OPT=2). Ganho 0,98–1,10×. Confiança alta na medida (60 pares de execuções na mesma máquina).

**Por que (medido, semente 61, OPT=2):** agudo tem ~135 mil incidências e ~120 ramos (≈ 60 por fibra) ao fim; grave, ~22 mil incidências e 48 ramos. Cada incidência põe na fila uma chegada por ramo da fibra, e outra de inibição: no agudo são da ordem de 16 milhões de eventos (estimativa por conta, confiança média). O custo está na **fila de eventos**, não nos laços sobre ramos que a fase 1 removeu (com ~120 ramos eles são baratos). A estimativa de ganho de 3–10× do estudo (`estudo-otimizacao-motor.md`, §4) estava errada para as mudanças 1–4: o desperdício que importa é o item 3/4 do estudo (fila em heap; inibição como evento separado).

**Leitura:** as quatro mudanças são equivalentes, mas não aceleram. Recomendação de engenharia: manter `motor_correcoes.py` como referência (o motor rápido não traz ganho que pague a mudança); a próxima frente é a fila (baldes de tempo, exata) e a inibição, com nova prova de igualdade.

## Fila de eventos por cursor (17/11) — exata

**O que muda (engenharia, sem efeito no modelo):** em vez de pôr na fila uma chegada por ramo a cada incidência (≈ 60 por fibra no agudo, mais as de inibição), a incidência guarda seus ramos num anel, já ordenados pelo instante de chegada, e a fila recebe **uma entrada por incidência e por tipo** (excitação, inibição). Ao sair da fila, a entrada entrega a chegada seguinte daquela incidência. A fila fica ~30 vezes menor; a ordem de processamento é a mesma. Os pesos da inibição são os do instante da incidência, como na referência. Com maturação ligada, o motor volta à fila antiga (a inibição de cada Uint chega com atraso próprio).

**Prova de igualdade** (`valida_fila_cursor.py`, `valida-fila-cursor-saida.csv`; sementes 31–40, grave e agudo, conjunto B, I1): **20/20 saídas idênticas** à referência. Ganho: grave **1,55×** (0,36 → 0,23 s), agudo **1,28×** (5,6 → 4,4 s). Confiança alta.

**Micromedida (fora do motor, só a fila):** 16 milhões de eventos com a fila antiga: 2,3 s; com a fila por cursor: 1,0 s. O resto do tempo (~60%) é o trabalho de cada chegada na Uint (decaimentos, janela de coincidência, disparo), que é intrínseco: cada chegada é um potencial chegando a uma sinapse. Ganho exato adicional possível, estimado: pequeno (< 1,3×). Confiança média.

**Decisão de engenharia:** `motor_rapido.py` com `CUR=True` (e `OPT=1`) passa a ser o motor dos próximos ensaios, por ser idêntico à referência e mais rápido; o decaimento sob demanda (`OPT=2`) **não** é usado (equivalente só estatisticamente e sem ganho).

## Medida de custo ao longo do aprendizado (17/11)

Script `medida_custo.py`, saída `medida-custo-saida.csv`; sementes 61–70, grave e agudo, conjunto B, I1, motor com fila por cursor. "Eventos" = chegadas processadas (excitação + inibição). Medianas de 10 sementes.

| episódio | grave: eventos/s simulado | grave: ramos que seguem | agudo: eventos/s simulado | agudo: ramos que seguem |
|---|---|---|---|---|
| 1 | 75.710 | 176 | 564.860 | 208 |
| 2 | 23.972 | 59 | 445.837 | 172 |
| 3 | 30.548 | 72 | 423.443 | 157 |
| 4 | 28.592 | 69 | 494.901 | 181 |
| 5 | 35.729 | 96 | 435.911 | 162 |

"Ramos que seguem" = ramos vivos depois da poda do fim do episódio (primeira versão da medida contava antes da poda; corrigido antes do registro). Incidências: ~430/s (grave) e ~2.720/s (agudo), contando as duas fibras. Tempo por evento: ~130 ns (grave) e ~220 ns (agudo), nesta máquina, um núcleo.

**Leitura:**
- O custo **não cresce** com o aprendizado: é maior no primeiro episódio (todos os ramos iniciais vivos) e se estabiliza depois da poda e da eliminação. Confiança alta (10 sementes, padrão igual em todas).
- O custo é ≈ incidências × ramos por fibra × 2 (excitação e inibição). No agudo, ~165 eventos por incidência.
- Um par de vias no agudo custa ~0,1 s de processamento por segundo simulado (≈ 10× mais rápido que o tempo real). Para 384 vias, **se** cada par se parecer com este agudo: ~19 s por segundo simulado num núcleo (≈ 19× mais lento que o tempo real). Confiança **baixa**: depende de quantos ramos por fibra existirão com 8+ Uints por via e da organização das vias, ainda não decidida. A estimativa anterior (~200×) supunha mais ramos por via.
- A parte "1/2/4 canais" precisa do motor com várias vias (degrau 4); fica para lá.

## Degrau 2 — duas relações verdadeiras (17/11)

Registro prévio: [duas-relacoes.md](duas-relacoes.md) (aprovado). Script `ensaio_duas_relacoes.py`; dados `duas-relacoes-saida.csv`. 90 execuções. Motor com fila por cursor.

| Condição | Sucesso | IC95% | Uints em Δ1 / Δ2 (soma de 30 sementes) | Presas |
|---|---|---|---|---|
| **Grave, duas fontes (julgado)** | **7/30** | 12–41% | 85 / 66 | 14 |
| Grave, só a fonte 1 (controle) | 30/30 | 89–100% | 236 / 0 | 0 |
| Agudo, duas fontes (descritivo) | 0/30 | — | 0 / 0 | 2 |

**Pelas regras fixadas:** 7 ≤ 17 → **parar e levar ao responsável**, sem ajustar.

**O que se vê (descritivo):**
- **"Quem chega primeiro leva tudo":** em 21 das 30 sementes, as Uints sintonizadas ficaram **todas numa só relação** (12 só em Δ1; 9 só em Δ2). Em várias, as 8 Uints foram para a mesma (8/0 ou 0/8). As duas relações aparecem juntas em 8 sementes; em 7, sem presas.
- Cada relação, sozinha, é encontrada com facilidade: o controle passa em 30/30, e Δ1 e Δ2 vencem em proporções parecidas (12 contra 9). O problema é **dividir** as Uints, não **achar** a relação.
- Presas no acaso: 14 Uints em 9 sementes (coincidências entre as fontes, que não têm relação fixa; o controle não tem nenhuma).
- Agudo: nenhuma Uint sintonizada em Δ1 nem em Δ2 pelo critério estrito (todas "difuso"), como previsto: num canal só, as duas relações são equivalentes em fase.

**Hipóteses do assistente (não testadas):**
1. **Destino compartilhado:** cada Upro nasce com ramos para as 8 Uints, e as Upros novas nascem perto das que quase acertaram. Quando uma relação consolida primeiro, as Upros que a servem se multiplicam **para todas as Uints**, e a outra relação perde a corrida em todas ao mesmo tempo.
2. **Falta de diversidade de entrada:** na MSO, cada célula recebe poucas fibras (2–4 por dendrito; Couchman et al. 2010), e células diferentes recebem subconjuntos diferentes. Aqui as 8 Uints recebem das **mesmas duas fibras**. Nada as diferencia, a não ser o acaso dos pequenos atrasos dos ramos.
3. **Separação por canais:** a biologia talvez separe fontes simultâneas sobretudo combinando faixas de frequência (cada fonte domina faixas diferentes em momentos diferentes), e não dentro de uma faixa só. Confiança baixa; a pesquisar.

### Diagnóstico do degrau 2 (17/11; só medidas)
Script `diagnostico_duas_relacoes.py`; saída `diagnostico-duas-relacoes-saida.txt`. Conferência: as 30 sementes reproduzem exatamente as contagens do ensaio (a medida não altera o modelo).

- **A decisão acontece cedo e em bloco:** a primeira Uint se sintoniza no **episódio 2** em 22 das 30 sementes (no 1, em 7). Em muitas sementes **todas as Uints passam ao mesmo tempo** para a mesma relação no episódio 2 (ex.: 106, 108, 113, 116: as 8 Uints com "·2222" ou "·1111"). Não é uma Uint puxando as outras depois: é uma causa **comum, no episódio 1**.
- Em 17 de 30 sementes, toda Uint que se sintonizou seguiu a relação da primeira.
- **Os pares de Upros mais fortes não são os mesmos:** nas sementes com 6–8 Uints em Δ1, há 3 a 7 pares de Upros distintos. As Uints não são servidas pelo mesmo par. (Essa medida só existe para Δ1: o motor guarda os pares só das Uints sintonizadas na relação principal. Limitação declarada.)
- Algumas Uints **trocam** de relação ao longo dos episódios (ex.: semente 124, "·22·1"; 128, "·2221").

**Leitura do assistente:** a hipótese 1 fica **refinada**. Não é o mesmo par de Upros servindo todas as Uints; é o **conjunto de atrasos disponíveis** que se inclina, no episódio 1, para a relação que ganhou os primeiros quase-acertos. As Upros novas nascem perto delas e têm ramos para todas as Uints, e todas recebem das mesmas duas fibras. A hipótese 2 (falta de diversidade de entrada) continua de pé.

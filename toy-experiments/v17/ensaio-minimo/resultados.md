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

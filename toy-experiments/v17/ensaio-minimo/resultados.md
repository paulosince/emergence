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

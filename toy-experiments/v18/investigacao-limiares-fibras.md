# V0.18 — Limiares das fibras do nervo auditivo (leitura de Liberman 1978)

**Data:** 18/11/2026. **Pedido do responsável:** a forma não linear das vagas de limiar das Upros de cada fibra (Cpro, nome a confirmar).
**Fonte:** Liberman, M. C. (1978). Auditory-nerve response from cats raised in a low-noise chamber. *J Acoust Soc Am* 63(2):442–455. DOI 10.1121/1.381736. **Leitura: texto integral** (PDF enviado pelo responsável; texto extraído por OCR e figuras 10–13 lidas visualmente). O PDF não é versionado no repositório (direitos autorais).

## O que o artigo diz [literatura]

| Achado | Onde | Confiança |
|---|---|---|
| Gatos nascidos e criados em câmara silenciosa (para evitar danos de ruído); 4 animais | Métodos | alta |
| Três grupos pela atividade espontânea: alta (> 18 disparos/s), média (0,5 a 18), baixa (< 0,5) | Resultados, Fig. 10 | alta |
| Nos animais da câmara: **61% alta, 23% média, 16% baixa** | texto, p. 448 | alta |
| **Limiar relativo** = limiar da fibra na sua frequência característica menos a média dos limiares das fibras de atividade alta de mesma frequência | legenda da Fig. 10 | alta |
| As de atividade alta formam um grupo **homogêneo** em limiar | p. 447–448 | alta |
| As de atividade média têm limiares relativos **dentro de 10–15 dB umas das outras**; a média se mantém igual em todas as frequências | p. 448, Fig. 11 | alta (texto) |
| Em duas regiões de frequência, as curvas de sintonia das de atividade média ficam, em média, **~7–8 dB acima** das de atividade alta | p. 449, Fig. 13 | alta (texto) |
| As de atividade baixa são **inomogêneas**: limiares relativos espalhados por **mais de 50 dB**; o espalhamento é maior perto de 3 kHz | p. 448, Fig. 11 | alta (texto) |
| Resumo: ~10% das fibras quase sem atividade espontânea, às vezes **80 dB menos sensíveis** | resumo | alta |
| Nos 3 animais mais sensíveis, todas as fibras de atividade alta estavam a até **20 dB** da curva de melhor limiar, em todas as frequências | Discussão | alta |
| Leitura visual das figuras: atividade alta perto de 0 dB relativo; atividade média de ~5 a ~25 dB; atividade baixa de ~15 a ~80 dB (Fig. 10) e de ~10 a ~65 dB (Fig. 11) | Figs. 10–11 | **média** (leitura de gráfico) |
| As medidas de taxa por nível foram até ~54 dB acima do limiar, e quase todas as fibras já tinham saturado | p. 451–452 | alta |

## Proposta do assistente para as 240 vagas [proposta, não aprovada]

Limiares contados **a partir do limiar mais sensível da faixa** (o zero de cada faixa; ponderação 3, em aberto). Três zonas, nas proporções do artigo:

| Zona | Parte das vagas | Vagas (de 240) | Extensão (dB acima do zero da faixa) | Densidade aproximada |
|---|---|---|---|---|
| 1 (como a atividade alta) | 61% | 146 | 0 a ~10 | ~15 por dB |
| 2 (como a atividade média) | 23% | 55 | ~5 a ~25 | ~3 por dB |
| 3 (como a atividade baixa) | 16% | 39 | ~15 a ~80 | ~0,6 por dB |

## Ponderação: a Upro liga ou não liga; a fibra biológica cresce aos poucos [inferência]

- Na biologia, cada fibra **aumenta a sua taxa** ao longo de uma faixa de níveis (dezenas de dB) até saturar. No nosso modelo, cada Upro **liga ou não liga** no seu limiar.
- Se copiarmos só a distribuição dos limiares, ~60% das vagas ficam nos primeiros ~10 dB: a contagem de Upros ativas quase satura cedo. Acima disso, a diferença de intensidade dependeria só das poucas vagas das zonas 2 e 3. Haveria perda de informação de intensidade em níveis médios.
- **Equivalência possível, agnóstica de substrato:** uma fibra biológica cuja taxa cresce ao longo de ~30 dB equivale a várias Upros binárias com limiares escalonados nesses ~30 dB. A distribuição equivalente das vagas seria então a **distribuição dos limiares combinada com a faixa de crescimento de cada fibra**. Matematicamente, isso é uma **convolução** das duas distribuições, a palavra que o responsável usou.
- Perdas declaradas em qualquer opção: sem taxa graduada por Upro, sem saturação gradual, sem adaptação (item próprio, mais adiante).

**Decisão do responsável pendente.**

## Decisão do responsável (18/11): **B, a convolução**
"B — Eu já sabia." A distribuição das vagas é a dos limiares **combinada com a faixa de crescimento de cada fibra**.

## Primeira conta da distribuição B [proposta do assistente; parâmetros a aprovar]
**Parâmetros usados** (cada um tem uma fonte, mas a forma é simplificada):
- Limiares relativos ao zero da faixa, distribuição uniforme em cada grupo: atividade alta 0–10 dB (61%); média 1–14 dB (23%; 10–15 dB de espalhamento, ~7–8 dB acima da alta); baixa 15–80 dB (16%; leitura das figuras).
- Crescimento de cada fibra, do limiar à saturação, **linear**: 30 dB para as de atividade alta e média ("menos de 30 dB" na maioria; Heinz & Carney 2001, citando May & Sachs 1992; resumo); 50 dB para as de atividade baixa (média no gato para atividade espontânea abaixo de 15/s; artigo em *Exp Brain Res*, resumo; autoria não conferida).
- 240 vagas postas nos quantis da distribuição resultante.

**Resultado (conta, confiança da forma: média; dos números exatos: baixa, porque dependem dos parâmetros):**

| Nível do som (dB acima do zero da faixa) | Upros ativas (de 240) |
|---|---|
| 5 | 7 |
| 10 | 30 |
| 20 | 96 |
| 30 | 165 |
| 40 | 204 |
| 60 | 214 |
| 80 | 225 |
| 120 | 239 |

- A densidade é maior entre 10 e 40 dB (5–7 vagas por dB). Acima de 40 dB há uma cauda longa e rala (0,3–0,6 por dB), feita pelas de atividade baixa.
- A distribuição combinada vai até **~120 dB**, sem que isso tenha sido imposto: são os 80 dB dos limiares mais altos somados aos 50 dB de crescimento.
- Só com os limiares (opção A), 10 dB já ativariam 185 das 240.

## Vale a pena melhorar as formas? Teste de sensibilidade (18/11, pedido do responsável)
Seis variações da conta B (Upros ativas, de 240, por nível acima do zero da faixa):

| Variação | 5 | 10 | 20 | 30 | 40 | 60 | 80 | 120 dB |
|---|---|---|---|---|---|---|---|---|
| zonas uniformes + crescimento linear (conta inicial) | 7 | 30 | 96 | 165 | 204 | 214 | 225 | 239 |
| uniformes + crescimento em S (sigmoide) | 4 | 19 | 85 | 154 | 191 | 211 | 223 | 238 |
| formas realistas (sinos; cauda assimétrica nas de atividade baixa) + linear | 9 | 35 | 101 | 169 | 205 | 219 | 233 | 240 |
| formas realistas + S | 5 | 22 | 90 | 157 | 192 | 217 | 231 | 239 |
| formas realistas + S, crescimento **20/20/40 dB** | 8 | 39 | 141 | 192 | 205 | 222 | 234 | 240 |
| formas realistas + S, crescimento **40/40/60 dB** | 3 | 15 | 60 | 119 | 166 | 209 | 226 | 238 |

**Leitura:** refinar a forma das zonas e do crescimento muda pouco (5 a 15 Upros). O que muda muito é a **largura do crescimento** de cada fibra (a 20 dB: de 60 a 141 Upros). Vale buscar dados de população para essa largura, e não refinar a forma.
**Exemplos do próprio Liberman (Fig. 16, um neurônio de cada grupo, leitura visual, confiança média):** atividade alta cresce em ~20–25 dB; média em ~30 dB; baixa em mais de 40 dB, saturando numa taxa baixa. Saturação média de ~200 disparos/s nas de atividade alta e média; nas de atividade baixa, de 40 a 190 (texto, p. 451).

## Frequência: o mesmo mecanismo? (pesquisa de 18/11; resumos e trechos, salvo indicação)

| Achado [literatura] | Fonte | Confiança |
|---|---|---|
| Curvas de sintonia (chinchila): uma ponta que vai até 30–40 dB acima do limiar na frequência característica, com inclinações de −60 e +120 dB por oitava; uma "cauda" rasa nos graves e um corte muito íngreme nos agudos | Temchin, Rich & Ruggero 2008 (resumo) | alta |
| A largura do filtro coclear cresce com o nível, sobretudo 30–40 dB acima do limiar (no gato, de 1,1 a 2,5 vezes a 100–110 dB) | Evans (texto de revisão, trecho) | média |
| A transmissão do ouvido médio é um determinante do audiograma (gerbil) | Ravicz e colegas (resumo; autoria a conferir) | média-alta |
| O número de sinapses por célula ciliada interna **é máximo onde a cóclea é mais sensível** (camundongo) | Meyer et al. 2009, *Nature Neuroscience* (resumo) | alta |
| De 5 a 30 fibras por célula ciliada interna; a diferença de limiar entre elas vem de gradientes no tamanho das sinapses | Liberman, Wang & Liberman 2011 (resumo) | alta |

**Leitura [inferência]:**
1. **Entre faixas, também há convolução.** O som de uma frequência acorda faixas vizinhas, com limiar que sobe conforme a frequência se afasta (curva em V, assimétrica). Quanto mais alto o som, mais faixas acordam. No nosso hardware, os filtros da cóclea já se sobrepõem: combinados com as vagas de limiar, eles fazem essa convolução de frequência × intensidade sem nada a mais. **Perda:** um filtro linear não alarga com o nível, e o da biologia alarga.
2. **A sensibilidade por frequência tem duas origens:** o filtro do ouvido externo e médio (o "zero" de cada faixa) e **quantas fibras há em cada lugar**, que é máximo onde a cóclea é mais sensível. É a intuição do responsável: "poucas acionadas em uma, muitas em outras" vale também para a frequência. A capacidade por fibra (240) poderia variar com a faixa.
3. **A combinação frequência × decibéis existe e tem nome na biologia: a curva de sintonia** (o limiar de uma fibra para cada frequência). Fig. 13 e Fig. 16 (à direita) de Liberman 1978.

## Dados humanos (decisão de 18/11: "sempre que tivermos o exemplo humano, seguimos por ele")

| Achado [literatura] | Fonte e leitura | Confiança |
|---|---|---|
| Limiar de audição normal (dB SPL): 250 Hz **12**; 500 Hz **5**; 1 kHz **2**; 2 kHz **−2**; 4 kHz **−5**; 8 kHz **13** | Tabela extraída da ISO (2003), reproduzida em GreenFacts (página lida) | média-alta (poucos pontos; a tabela completa está na norma, paga) |
| Faixa audível: de 0 dB SPL (limiar) a 120–140 dB SPL (limiar de dor) | idem | média |
| Contatos por célula ciliada interna em humanos: **11,1 a 13,3** na orelha mais jovem da amostra (54 anos); fibras por célula com **pico de ~14 no meio da cóclea**; microscopia eletrônica (64 anos): **6,5 a 12,5** conforme o lugar | Viana et al. 2015, *Hear Res* (texto integral, lido por resumo; os valores por frequência só nas figuras); Nadol 1988 citado ali | média-alta |
| Com a idade, a perda de fibras é grande: em 7 de 11 pessoas acima de 60 anos, mais de 60% de perda | Wu et al. 2019, *Neuroscience* (resumo) | alta |
| Não há registro de fibras isoladas do nervo auditivo humano: limiares por grupo e faixas de crescimento vêm de animais (gato) → **adaptação declarada** | inferência | alta |

**Leitura [inferência]:**
- As amostras humanas com números por lugar são de pessoas de 54 anos ou mais, com perda pela idade. Para um sistema "jovem", os números devem ser maiores. Wu et al. 2019 tem pessoas de 0 a 89 anos, mas os valores por lugar só aparecem nas figuras.
- Se as 64 faixas forem espaçadas como a cóclea (ERB), cada faixa cobre um trecho parecido da cóclea: ~3.500 / 64 ≈ 55 células ciliadas internas por faixa. Com 6,5 a 14 fibras por célula, seriam **~360 a ~770 fibras por faixa**, com pico no meio. Conta do assistente; confiança baixa.
- **Proposta [A]:** capacidade por fibra (Cpro) variando com a faixa, proporcional ao perfil humano de fibras por célula ciliada, em vez de 240 fixo. Decisão do responsável.

## Tabela das 64 faixas (proposta para revisão, 18/11)
Script `tabela_faixas.py`; saídas `tabela-faixas.csv` e `tabela-faixas.png`.
- **Frequências:** 64 centros na escala ERB, de 50 Hz a 8 kHz (fórmula de Glasberg & Moore 1990, de memória, padrão da área).
- **Zero de cada faixa:** limiar humano (ISO 2003) interpolado em log da frequência entre 250 Hz e 8 kHz. Abaixo de 250 Hz, extrapolado com a inclinação de 250–500 Hz (7 dB por oitava), o que dá 28 dB a 50 Hz. **Provavelmente subestima** o limiar grave real (o limiar humano sobe mais rápido nos graves; não confirmado aqui).
- **Capacidade:** posição na cóclea pela função de Greenwood humana (1990; constantes de memória), 3.500 células ciliadas internas com densidade uniforme, e fibras por célula indo de 6,5 nas pontas a 14 no meio (forma senoidal suposta, a partir dos extremos de Nadol 1988 e de Viana et al. 2015). Resultado: **406 a 572 Upros por faixa** (pico perto de 1,2–1,4 kHz); **33.116 por ouvido**.
- **Inconsistência a declarar:** 33 mil por ouvido, numa faixa que cobre só ~77% da cóclea, passa dos ~30 mil do nervo humano inteiro (média adulta). O perfil de 6,5–14 por célula combinado com 3.500 células dá ~40 mil na cóclea toda. Para fechar com 30 mil, a capacidade cairia ~25% (≈ 300–430 por faixa). Decisão do responsável.
- **Vagas de limiar:** decisão B (convolução), formas realistas + crescimento em S, 30/30/50 dB. As vagas mais altas passam de 140 dB SPL: vagas que, como previsto pelo responsável, provavelmente nunca serão criadas.

### Ajustes pedidos pelo responsável (18/11)
- **Graves:** "Ajuste a interpolação dos graves." O zero agora vem da **tabela completa** do limiar humano de referência em campo livre, **ISO 389-7:2005**, reproduzida de forma idêntica na norma chinesa GB/T 4854.7-2008 (tabela 1; valores lidos de uma página com OCR; alguns rótulos de frequência estavam embaralhados; **não conferidos com o original**). Valores entre 50 Hz e 8 kHz, por exemplo: 50 Hz **44,0**; 100 Hz **26,5**; 250 Hz **11,4**; 1 kHz **2,4**; 3,15 kHz **−6,0**; 4 kHz **−5,4**; 8 kHz **12,6** dB SPL. Não há mais extrapolação. A extrapolação anterior (28 dB a 50 Hz) subestimava o grave em 16 dB.
- **Escala:** "Podemos ter menos que o humano, não mais. Não temos a mesma capacidade de processamento." O perfil foi escalado para dar ~30.000 fibras na cóclea humana inteira (fator 0,76). Resultado: **308 a 434 Upros por faixa**, **25.143 por ouvido** nas 64 faixas (que cobrem ~77% da cóclea).
- **Pico em ~1,2 kHz, e não em ~4 kHz:** o pico de fibras por célula "no meio da cóclea" vem de Viana et al. 2015 (pessoas de 54 anos ou mais, já com perda pela idade). A **forma senoidal** e o lugar exato do pico são **suposições do assistente**. No camundongo, o número de sinapses por célula tem pico onde a cóclea é mais sensível (Meyer et al. 2009). No humano, a maior sensibilidade em 3–4 kHz é atribuída em grande parte à ressonância do canal do ouvido (de memória, a conferir), e não necessariamente à densidade de fibras. Para saber onde fica o pico humano, é preciso ler as figuras de Viana et al. 2015 ou de Wu et al. 2019.

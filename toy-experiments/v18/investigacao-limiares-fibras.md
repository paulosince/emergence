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

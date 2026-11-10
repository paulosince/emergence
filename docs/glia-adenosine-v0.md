# Glias e adenosina — aprofundamento v0

Data: 10/11/2026 (18h54, pedido do responsável). Situação: pesquisa e propostas nossas; **nada decidido**. Conecta-se a: [unidades moduladoras v0.1](modulatory-units-v0.1.md) (decisão de 09/11: "fontes gliais por território, com divisão por capacidade"; ciclo imposto agora, pressão homeostática depois), [texto-guia dos limites do Sdom](sdom-boundaries-guide.md) (hipóteses G1, G2, G3) e [tabela dos neuromoduladores](neuromodulators-sources-v0.md).

## 1. Adenosina

### 1.1 O que é e como se comporta no tempo
- A concentração extracelular **sobe com o metabolismo do cérebro**. No prosencéfalo basal de gatos, subiu na vigília espontânea em relação ao sono de ondas lentas, **subiu progressivamente na vigília prolongada** e **caiu devagar no sono de recuperação** (Porkka-Heiskanen et al. 1997, *Science* 276:1265–1268; resumo e legendas das figuras). Valores medidos nesse local (já registrados em [difusão espacial](spatial-diffusion-v0.1.md)): ~31 nM na vigília e ~24 nM no sono de ondas lentas.
- O efeito sobre o sono é **específico do local**: aumentar a adenosina no prosencéfalo basal mudou o sono; no tálamo, não (mesma fonte).
- Age sobretudo pelo **receptor A1**, inibitório: inibição pré-sináptica e hiperpolarização (comentário sobre Lovatt 2012, PMC3577085; trecho).

### 1.2 Quem a produz: três fontes, em debate
| Fonte | Evidência | Leitura |
|---|---|---|
| **Neurônios** | Neurônios que disparam muito liberam adenosina diretamente (por transportadores), deprimindo a transmissão excitatória; o ATP liberado por astrócitos **não** produziu essa depressão. Os autores chamam isso de retroalimentação autônoma durante atividade prolongada e propõem um sinal de "fadiga" contra o esgotamento metabólico (Lovatt et al. 2012, *PNAS* 109:6265–6270; resumo e trechos da discussão). No prosencéfalo basal, um sensor novo mostrou aumento **rápido e dependente de atividade** da adenosina; os **neurônios glutamatérgicos** contribuíram muito mais que os colinérgicos; sem eles, o aumento caiu e a homeostase do sono piorou (Peng et al. 2020, *Science* 369:eabb0556; resumo) | fonte principal e rápida, ao menos no prosencéfalo basal |
| **Astrócitos** | Bloquear a liberação dos astrócitos reduziu o acúmulo da pressão de sono, via A1 (Halassa et al. 2009, *Neuron* 61:213–219; resumo e trechos). Mas o cálcio dos astrócitos modulou o sono **sem** passar pela adenosina em outro estudo (Peng et al. 2023, *Cell Discovery* 9:16; resumo) | papel real no sono, mas a rota pela adenosina está em disputa |
| **Micróglia** | O ATP liberado na ativação atrai prolongamentos da micróglia, que o convertem (CD39 → AMP; CD73 → adenosina); a adenosina suprime os neurônios via A1. Sem micróglia, a atividade se amplifica e sincroniza, com crises (Badimon et al. 2020, *Nature* 586:417–423; resumo). Os autores comparam esse freio ao de neurônios inibitórios | retroalimentação negativa local |

### 1.3 Leitura agnóstica (nossa)
A adenosina **não carrega conteúdo**: é um **subproduto da atividade** (ATP gasto vira adenosina) que funciona como retroalimentação em **duas escalas**:
1. **Rápida e local** (segundos a minutos): freia o que está muito ativo (Lovatt 2012; Badimon 2020).
2. **Lenta e acumulada** (horas): pressão de sono, que se dissipa no sono (Porkka-Heiskanen 1997; Peng 2020).
É o mesmo papel do "resíduo" do gasto já usado no Sdom: uma conta de uso, não uma mensagem.

## 2. Glias

### 2.1 Astrócitos
- **Territórios:** em grande parte exclusivos (Bushong et al. 2002, já em [unidades moduladoras](modulatory-units-v0.1.md)). Um astrócito protoplasmático de roedor cobre ~20 mil a 120 mil sinapses; o humano, até ~2 milhões; o humano é ~2,6 vezes maior em diâmetro, com ~10 vezes mais prolongamentos primários (Oberheim et al. 2009, *J. Neurosci.* 29:3276–3287; Verkhratsky et al., revisão MDPI; resumos). Confiança média nos números.
- **Ganho controlado pela noradrenalina:** a noradrenalina "liga" os astrócitos para responder à atividade local; sem ela, raramente respondem ao estímulo visual (Paukert et al. 2014, *Neuron* 82:1263–1270; resumo). Leitura: o astrócito combina um **sinal global** (estado) com a **atividade local** do território — a forma de um terceiro fator territorial.
- **Sono:** o cálcio dos astrócitos é máximo na vigília e mínimo no sono, varia com a necessidade de sono, e reduzi-lo prejudica a resposta homeostática à privação: os autores concluem que é **componente do homeostato do sono** (Ingiosi et al. 2020, *Curr. Biol.* 30:4373–4383; resumo e trechos).
- **Gliotransmissão** (glutamato, D-serina, ATP): **controversa** em condições fisiológicas (Fiacco e McCarthy 2018 × Savtchouk e Volterra 2018).

### 2.2 Micróglia
- Poda de sinapses não funcionais e retroalimentação negativa por adenosina (Badimon et al. 2020; resumo).

### 2.3 Oligodendrócitos (mielina)
- A mielinização dependente de atividade muda a **velocidade de condução** e, portanto, o **tempo de chegada** dos sinais (Fields 2015, *Nat. Rev. Neurosci.* 16:756–767; resumo e trechos).
- **Escala de tempo:** mudanças de mielina que alteram de forma significativa a condução ocorrem mais provavelmente em **dias a semanas** (revisão *J. Neurosci.* 2017, 37:10023–10034, PMC6596541; trecho; autores não conferidos).
- **Divergência no motor v2:** o ajuste de atraso (`delayAdjustRate` = 0,5, citando Fields 2015) age **a cada evento**, isto é, rápido; a decisão de 09/11 diz "ajuste de atraso mais lento que o de peso". Precisa ser revisto.

## 3. Glias e os limites do Sdom (G1, G2, G3)
| Glia | Hipótese mais sustentada hoje | Observação |
|---|---|---|
| Micróglia (adenosina, poda) | **G1** — regula condições | Nenhuma evidência de organização específica de conteúdo nas fontes lidas |
| Astrócitos | **G1** sustentada; **G2** possível | Integram muitos sinais de um território e são controlados por estado; participação na especificação de conteúdo **não demonstrada** |
| Oligodendrócitos | **Pergunta aberta para o responsável** | Na CLEAR, o **tempo de percurso** faz parte do conteúdo da relação (malha temporotopológica). Se a mielina ajusta esse tempo, ela altera **a parte temporal do conteúdo** — isso é regular uma condição (G1) ou participar da constituição (G2)? |

## 4. Proposta mínima agnóstica (nossa; a decidir)
1. **Adenosina como subproduto da atividade das próprias unidades:** cada descarga deixa uma pequena quantidade no local; ela se difunde (difusão espacial aprovada) e é removida devagar, mais depressa no sono. Efeitos: (a) **freio local** (A1: sobe o limiar ou reduz a magnitude onde há muita atividade); (b) o **nível acumulado** alimenta a propensão ao sono (processo S). Fonte neuronal como principal (Lovatt 2012; Peng 2020); mediação por astrócitos ou micróglia como variantes.
   - **Conflito com a decisão de 09/11** ("fontes gliais por território"): a evidência nova aponta fonte principalmente neuronal no prosencéfalo basal. Decisão do responsável.
2. **Unidade territorial do tipo astrócito:** integra lentamente a atividade do seu território; o **ganho** dela é controlado pelo modulador de estado (equivalente da noradrenalina); a saída é (a) contribuição para a necessidade de sono e (b) **portão territorial de plasticidade**. Começa como **G1**; o desenho permite testar G2.
3. **Mielina:** o ajuste de atraso passa a ser **lento** (dias a semanas), coerente com a decisão de 09/11 e com a literatura.
4. **Micróglia:** a poda já existe; o freio rápido entra pelo item 1.

## 5. Alerta de ANCHOR (já registrado no guia de continuidade)
A pressão de sono é **variável regulada** (ponto de ajuste). A decisão de 09/11 foi **ciclo imposto agora; ciclo completo com pressão homeostática depois** da fase do motor. O item 1(b) traz o processo S de volta: **precisa de decisão explícita** do responsável sobre o envelope (detectores de Orientação e de valia ativos, parada que falha fechada).

## Referências desta pesquisa (o que foi lido)
- Badimon, A. et al. (2020). Negative feedback control of neuronal activity by microglia. *Nature* 586, 417–423. (resumo)
- Fields, R. D. (2015). A new mechanism of nervous system plasticity: activity-dependent myelination. *Nat. Rev. Neurosci.* 16, 756–767. PMC6310485. (resumo e trechos)
- Halassa, M. M. et al. (2009). *Neuron* 61, 213–219. PMC2673052. (resumo e trechos)
- Ingiosi, A. M. et al. (2020). A role for astroglial calcium in mammalian sleep and sleep regulation. *Curr. Biol.* 30, 4373–4383. PMC7919541. (resumo e trechos)
- Lovatt, D. et al. (2012). Neuronal adenosine release, and not astrocytic ATP release, mediates feedback inhibition of excitatory activity. *PNAS* 109, 6265–6270. (resumo e trechos)
- Oberheim, N. A. et al. (2009). Uniquely hominid features of adult human astrocytes. *J. Neurosci.* 29, 3276–3287. (resumo)
- Paukert, M. et al. (2014). Norepinephrine controls astroglial responsiveness to local circuit activity. *Neuron* 82, 1263–1270. PMC4080721. (resumo)
- Peng, W. et al. (2020). Regulation of sleep homeostasis mediator adenosine by basal forebrain glutamatergic neurons. *Science* 369, eabb0556. (resumo)
- Peng, W. et al. (2023). Adenosine-independent regulation of the sleep–wake cycle by astrocyte activity. *Cell Discovery* 9, 16. (resumo)
- Porkka-Heiskanen, T. et al. (1997). Adenosine: a mediator of the sleep-inducing effects of prolonged wakefulness. *Science* 276, 1265–1268. (resumo e legendas)

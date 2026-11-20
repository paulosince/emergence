# V0.18 — Plano de extensão: testes antes do Sdom

**Data:** 19/11/2026. **Pedido do responsável:** criar o planejamento de uma extensão da V0.18 para medir, antes do Sdom: **intensidade**, **ordem dos inícios**, **duas fontes simultâneas** (a separação de entidades sonoras) e **o viés do código de tempo**.

**Situação:** proposta do assistente, **a aprovar**. Nada aqui é decisão científica tomada.

**Marcas:** [R] responsável; [L] literatura (com grau de leitura); [A] proposta do assistente.

---

## 0. O que vale para todos os testes

- **Dado × criado:** os mesmos da V0.18. Dados: robô parado, Utrd auditiva (microfone + cóclea) e pontos transdutivos. Criado: **nada**. O observador é externo e não altera o robô.
- **Borda:** a atual (sensibilidade por área +20/+10/0 dB; atenuação para som forte a partir de 70 dB; sem compressão; emissão proporcional à reserva; janela de carregamento que se alonga com o uso). Se a borda mudar, os testes rodam de novo.
- **Variação entre repetições [A]:** 5 repetições por condição, com ±0,5 dB, ±0,5° e fase ao acaso, como na bateria (decisão pendente do responsável).
- **Critério de "separa" [A]:** diferença entre condições maior que 2 desvios-padrão das repetições. **Os limites de "suficiente" são do responsável** e ficam em aberto até ele fixá-los (ver seção 6).
- **Resultado de cada teste:** script do observador, números em JSON, uma seção de registro, e a condição como botão na página do Pages.

---

## 1. Intensidade

**Pergunta:** qual é a menor diferença de volume que sobrevive nas incidências, e em que parte delas ela fica: quantos pontos acendem, quantas incidências saem, quanto pesam, ou quando chegam?

**Estímulos:**
- Grupo 2, já gerado: tons de 1 e 4 kHz, bases de 40 e 70 dB, acréscimos de 0; 0,5; 1; 2; 3 e 6 dB.
- **Novo:** base de **85 dB**, para ver o comportamento com som forte, quando a atenuação para som forte entra.
- **Novo:** **ruído largo**, nas mesmas bases e acréscimos.
- **Novo:** tons de **250 Hz**, onde há travamento de fase.

**O que o observador mede [A]:**
1. Número de pontos ativos, por área de intensidade transdutiva (sensível, intermediária, som forte).
2. Número de incidências e soma das magnitudes.
3. **Latência**: quanto antes as incidências chegam quando o som é mais forte. O acumulador completa mais cedo com mais excesso, e isso é uma pista de volume no tempo.
4. Menor diferença separável em dB, por medida, por frequência e por base.

**Régua humana:** ~1 dB (Jesteadt, Wier e Green 1977; **de memória**, a confirmar por leitura integral).

**O que observar com cuidado:** a saturação da área sensível no som forte; o papel das áreas intermediária e de som forte; o efeito da reserva de efeito das Upros (magnitude), que depende da história recente.

---

## 2. Ordem dos inícios

**Pergunta:** quando dois sons começam quase juntos, as incidências dizem **que são dois**, **quanto tempo os separa** e **qual veio primeiro**?

**Estímulos:**
- Grupo 4b, já gerado: 500 e 2.000 Hz com inícios separados por 0, 2, 5, 10, 20 e 40 ms, nas duas ordens.
- **Novo:** pares **na mesma região** de frequência (1.000 e 1.200 Hz), em que as faixas se sobrepõem.
- **Novo:** separações de **1, 3 e 7 ms**, para achar o limiar com mais finura.
- **Novo:** pares em **direções diferentes** (±30°), que juntam ordem e direção.

**O que o observador mede [A]:**
1. Instante de início em cada faixa: a primeira incidência acima da atividade anterior.
2. Diferença entre os instantes de início das faixas de cada som, comparada com a assincronia real.
3. Ordem correta ou não, em cada repetição.
4. Menor assincronia detectável (dois em vez de um) e menor assincronia com a ordem certa.

**Régua humana:** a ordem fica segura em ~17–20 ms (Hirsh 1959; fontes secundárias); a fusão em um só som fica em ~2 ms (fontes secundárias). A confirmar por leitura integral.

**Um cuidado:** a borda calcula tempos em microssegundos, e o observador terá resolução muito melhor que a humana. A pergunta para o Sdom não é "melhor que o humano?". É se a ordem fica **estável** entre repetições.

---

## 3. Duas fontes simultâneas (separação de entidades sonoras)

**Pergunta:** quando duas fontes soam ao mesmo tempo em lugares diferentes, as incidências permitem dividir as faixas em **dois grupos**, cada um com a sua direção e o seu início?

**Estímulos:**
- Grupo 7, já gerado: 500 Hz a 30° à esquerda e 600 Hz a 30° à direita.
- **Novo:** dois tons, à esquerda e à direita, separados por **1 semitom, 4 semitons e uma oitava**.
- **Novo, controle:** os mesmos dois tons **no mesmo lugar** (0°). Aqui a direção não ajuda.
- **Novo:** **duas vogais** com frequências fundamentais diferentes (120 e 220 Hz), em lugares diferentes e no mesmo lugar.
- **Novo:** **fala + piano** (LibriVox + Satie), a ±30°.
- **Novo:** **início diferente** (uma fonte começa 50 ms depois), que junta duas pistas de separação.

**O que o observador mede [A]:**
1. A **diferença de chegada estimada em cada faixa**, ao longo do tempo (janelas de 20–50 ms).
2. Se as faixas se agrupam em duas direções e se cada grupo corresponde às faixas de cada fonte. Medida: acerto da divisão em dois grupos.
3. O mesmo para a **diferença de volume** em cada faixa (agudos).
4. Para as vogais no mesmo lugar: se o travamento de fase de cada faixa segue 120 ou 220 Hz.

**Régua humana e literatura (a ler):** a separação de fontes usa direção, início comum e frequência fundamental comum (Bregman 1990, *Auditory Scene Analysis*, MIT Press; **de memória**). Sobre o papel da diferença de chegada no agrupamento: Darwin e Hukin (1999); sobre a harmonicidade: Moore, Glasberg e Peters (1986). Referências **a confirmar**.

**Por que importa:** é a primeira medida que olha para **entidades**, e não só para diferenças. Se as faixas não se agrupam pela direção nem pelo início, o Sdom terá de fazer esse trabalho sozinho com incidências misturadas.

---

## 4. Viés do código de tempo

**O problema:** na medida de frequência pelo tempo, o período estimado pela autocorrelação das incidências saiu **2,5% a 3,6% mais longo** que o real (250 e 1.000 Hz) [M]. Ainda não se sabe se é **defeito da medida** ou **propriedade da transdução**.

**Hipóteses [A]:**
1. **Defeito do estimador:** a autocorrelação da soma de muitos pontos mistura intervalos de pontos diferentes, e a varredura de fase entre eles desloca o pico.
2. **Deslocamento de fase pela reserva:** com a emissão proporcional à reserva, o acumulador completa mais tarde quando a reserva está baixa. Isso move a fase da emissão ao longo do tom.
3. **Efeito da janela de fase:** o filtro de 1,2 kHz atrasa e arredonda a onda, mas não deveria mudar o período.
4. **Defeito de código:** no tempo das incidências (pedaços, interpolação, unidades).

**Testes [A]:**
1. **Tom sintético direto na borda**, sem cabeça, de 1 s, em 250 e 1.000 Hz.
   - Comparar quatro estimadores: autocorrelação da soma; intervalos entre incidências de **um mesmo ponto**; fase de cada incidência no ciclo (força de travamento de fase); ajuste de período.
2. **Mudar a reserva** (reserva sempre cheia, como teste de código) e ver se o viés some. Se sumir, vale a hipótese 2.
3. **Tirar a janela de fase** só no teste. Se o viés mudar, vale a hipótese 3.
4. **Comparar** o tempo das incidências com o pico real de cada ciclo do sinal de comando.

**Resultado esperado:** saber se o código de tempo carrega a frequência com precisão. Se for propriedade da transdução, quantificar e levar a decisão ao responsável.

---

## 5. Ordem, esforço e entregas

| Etapa | O que fazer | Custo estimado [A] |
|---|---|---|
| 1. Viés do tempo | Testes da seção 4 (não precisam de novas trilhas longas) | baixo (minutos de cálculo) |
| 2. Gerar trilhas novas | Grupos ampliados 1–3 (intensidade, ordem, duas fontes) | baixo |
| 3. Rodar a borda | Trilhas novas, dois ouvidos | ~1,6 s de cálculo por segundo de som (medido na bateria) |
| 4. Observador | Intensidade, ordem, duas fontes | médio |
| 5. Página | Botões das condições novas | baixo |
| 6. Registro | Seções novas, números, inovação | baixo |

**Começar pelo viés do tempo** porque, se for defeito de código, ele afetaria as outras medidas de tempo (ordem e duas fontes).

---

## 6. Decisões para o responsável

1. Aprovar ou ajustar os testes e os estímulos novos.
2. Aprovar a variação entre repetições (ou pedir ruído interno na borda, que hoje não existe).
3. Fixar, para cada teste, o que é "suficiente". Por exemplo:
   - intensidade: até 2 dB?
   - ordem: ordem certa a partir de 20 ms em todas as repetições?
   - duas fontes: divisão certa das faixas em pelo menos X% das janelas?
4. Dizer se a leitura integral das referências humanas vem antes das medidas.

## 7. Fica de fora (declarado)

Ruído interno da borda (determinismo); a adaptação em lei de potência (efeito de um som sobre o seguinte); sala com eco; fontes em movimento; distância e altura da fonte.

---

## Andamento

**19/11/2026, decisões do responsável:** (1) testes e estímulos aprovados; (2) variação entre repetições aprovada; (3) critérios de "suficiente" definidos **um teste de cada vez**; (4) leitura das referências humanas **antes** de medir ([régua humana](regua-humana.md)).

### Viés do código de tempo: resultado [M]

Script: [borda/vies_tempo.py](borda/vies_tempo.py); números: [borda/vies-tempo.json](borda/vies-tempo.json). Tom sintético direto na cóclea, 60 dB, 1 s, faixas vizinhas à frequência.

| Estimador | 250 Hz | 1.000 Hz |
|---|---|---|
| Picos do sinal de comando (referência) | 250,0 | 1.000,0 |
| Fase das incidências no ciclo (força de travamento de fase) | **249,8** | **1.000,0** |
| Intervalos entre incidências do **mesmo ponto** | **243,9 (−2,4%)** | **1.000,0** |
| Autocorrelação da soma de todos os pontos (o estimador usado antes) | 243,7 (−2,5%) | 947,0 (−5,3%) |
| Autocorrelação com a reserva da Utrd sempre cheia (teste de código) | 250,0 | 1.000,0 |

**Leitura:**
1. **Não é defeito de código.** Com a reserva sempre cheia, o viés some.
2. **A frequência está nas incidências.** A fase de cada incidência no ciclo dá a frequência certa nos dois casos.
3. **A autocorrelação da soma era um estimador ruim.** Ela mistura pontos que disparam em fases diferentes (a varredura), e por isso saiu −5,3% em 1 kHz.
4. **Em 250 Hz há um efeito real da transdução.** Com a emissão proporcional à reserva, a reserva baixa depois de cada emissão faz a próxima completar mais tarde no ciclo. Os intervalos de um mesmo ponto ficam ~2,4% maiores que um número inteiro de períodos. Em 1 kHz o efeito não aparece. Até onde o assistente sabe (de memória, a conferir), no nervo auditivo os intervalos se agrupam em múltiplos inteiros do período. Seria então um desvio do modelo neurobiológico, **para o responsável decidir** se corrige.

### Viés do tempo: o que diz a literatura (19/11)

- Rose, Brugge, Anderson e Hind (1967), *J. Neurophysiol.* 30(4), 769–793, https://doi.org/10.1152/jn.1967.30.4.769 (**resumo**): no nervo auditivo do macaco-de-cheiro, os intervalos entre disparos se agrupam **em torno** dos múltiplos inteiros do período.
- Estudo sobre a base neural do "alargamento da oitava" (**resumo**; autores a confirmar, de memória McKinney e Delgutte 1999, *J. Acoust. Soc. Am.*): os intervalos do nervo auditivo **desviam sistematicamente** dos múltiplos inteiros e ficam **um pouco maiores** que o período. Abaixo de 500 Hz, os intervalos de primeira ordem ficam menores, por causa de vários disparos no mesmo ciclo.
- **Leitura provisória:** o alongamento que medimos em 250 Hz (2,4%) **tem a mesma direção** do que se vê no nervo. Falta comparar o **tamanho** (precisa do texto integral).

### Teste 1: intensidade (19–20/11) [M]

**Critério do responsável:** "suficiente" = menor diferença separável **até 2 dB**.

**Estímulos:** grupo 8 da bateria, 216 s: tons de 250, 1.000 e 4.000 Hz e ruído largo; bases de 40, 70 e 85 dB; acréscimos de 0; 0,5; 1; 2; 3 e 6 dB; 5 repetições. **Escolha do assistente:** sem variação de volume entre repetições, porque o volume é a própria variável medida, como nos experimentos humanos. A variação de direção e de fase ficou.

**Script:** [borda/observador_intensidade.py](borda/observador_intensidade.py); números: [borda/observador-intensidade.json](borda/observador-intensidade.json).

**Resultado:** o critério de 2 dB **passa nas 12 condições**.

| Condição | Menor Δ separável: pontos ativos / incidências / padrão completo | Observação |
|---|---|---|
| Tons (250, 1.000, 4.000 Hz) a 40, 70 e 85 dB | **0,5–1 dB** / **0,5 dB** / **0,5 dB** | ex.: 1 kHz a 70 dB: 3.497 → 3.566 → 3.642 pontos ativos com +0,5 e +1 dB |
| Ruído a 40 dB | 0,5 / 0,5 / 1 dB | |
| Ruído a 70 dB | 1 / 1 / 2 dB | |
| Ruído a 85 dB | **2** / 3 / 6 dB | a área sensível satura (Δ de 6 dB); a de som forte separa 1 dB |

**Cuidados:**
1. **O resultado é otimista.** A borda é determinística, e a única variação é a do mundo (direção e fase). Sem ruído interno, diferenças de 0,5 dB sempre deixam rastro. A informação de volume **está lá**, mas a resolução humana inclui um ruído que a borda não tem.
2. **A magnitude** (reserva de efeito das Upros) **não serve** como medida de volume aqui. Ela depende da história (o trecho anterior), e mais incidências gastam mais reserva. Em vários casos ela nem separa 6 dB.
3. **No som forte largo (ruído a 85 dB)**, a informação fica quase só na área de som forte, como se esperava.

### Teste 2: ordem dos inícios (20/11) [M]

**Critério do responsável:** "suficiente" = **ordem certa a partir de 20 ms**, em todas as repetições, nas duas ordens.

**Estímulos:** grupo 9 da bateria, 205 s; cada tom é uma fonte própria. Três configurações:
- 500 + 2.000 Hz no mesmo lugar;
- 1.000 + 1.200 Hz no mesmo lugar (faixas sobrepostas);
- 500 + 2.000 Hz a ±30°.

Inícios separados por 0, 1, 2, 3, 5, 7, 10, 20 e 40 ms, nas duas ordens; 60 dB; 5 repetições.

**Observador [A]:** para cada tom, uma faixa afastada meio ERB do outro tom; o início é o instante da maior subida da taxa de incidências. A assincronia estimada desconta a média da condição de 0 ms, ou seja, o observador conhece as latências próprias de cada faixa. Script: [borda/observador_ordem.py](borda/observador_ordem.py); números: [borda/observador-ordem.json](borda/observador-ordem.json).

**Resultado:** o critério de 20 ms **passa nas 3 configurações, nos dois ouvidos**.

| Configuração | Menor assincronia com ordem sempre certa (esq. / dir.) | Exemplos da assincronia estimada (esq., "A primeiro") |
|---|---|---|
| 500 + 2.000 Hz, mesmo lugar | **7 ms** / **7 ms** | 10 → 9,8 ± 1,4 ms; 20 → 19,8 ± 1,0; 40 → 39,1 ± 0,7 |
| 1.000 + 1.200 Hz, mesmo lugar | **2 ms** / **2 ms** | 10 → 9,8 ± 0,5; 20 → 20,2 ± 0,7; 40 → 40,5 ± 1,3 |
| 500 + 2.000 Hz, ±30° | **5 ms** / **7 ms** | 10 → 10,8 ± 1,3; 20 → 19,2 ± 3,0; 40 → 40,6 ± 1,3 |

**Leitura:** as incidências guardam a ordem e a separação dos inícios **bem abaixo** dos ~20 ms humanos. O mesmo cuidado de antes vale: sem ruído interno, o resultado é otimista. O observador também usa as latências próprias de cada faixa; um sistema que não as conhecesse teria um viés de alguns décimos de milissegundo (a condição de 0 ms deu −0,6 a +0,1 ms).

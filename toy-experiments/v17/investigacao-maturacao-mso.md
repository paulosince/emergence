# V0.17 — Investigação: números da MSO jovem para a maturação (correção 6)

**Pedido do responsável (17/11):** "Pesquisar o valor antes" — antes de repetir o ensaio da maturação, buscar números da **MSO** (não do córtex) para a excitação e a inibição jovens.
**Redação:** assistente (Claude), 17/11/2026.
**Por que importa:** a maturação colapsou em 18/18 combinações ([resultados](ensaio-minimo/resultados.md), seção de 17/11). A leitura foi: a inibição jovem (força 0,77, decaimento 4 ms, chegando 2,7 ms depois) deixava uma carga muito maior que a excitação jovem (τ 0,6–1,5 ms, faixa **sem fonte**). O "2,7 ms depois" e o 0,77 vieram do **córtex auditivo** (Cai et al. 2017; Dorrn et al. 2010).

**Como li:** buscas na web e extração de páginas por um modelo auxiliar (o shell não acessa sites). Indico o nível de leitura de cada fonte. Algumas páginas do PMC estavam bloqueadas (verificação de navegador); quando foi o caso, digo.

**Legenda:** [L] literatura; [I] inferência do assistente; [A] proposta do assistente (a aprovar).

---

## 1. O que a MSO jovem mostra

### 1.1 Excitação jovem
- **Constante de tempo da membrana:** **2,51 ± 1,24 ms em P12** → **0,76 ± 0,56 ms em P17**; resistência de entrada 53 → 10 MΩ. Gerbil, 32 °C. [L] Magnusson, Kapfer, Grothe & Koch 2005, *J Physiol* 568:497 — **texto integral** (por extração; referências cortadas). Confiança: alta no número reportado.
- **Largura do EPSP à meia altura:** **0,78 ± 0,05 ms em P14–P16**, caindo na semana seguinte. [L] Scott, Mathews & Golding 2005, *J Neurosci* 25:7887 — **resumo e trechos**. Confiança: alta no número; média no contexto.
- **Antes de P14 a duração do EPSP cai rapidamente**; a geração de disparo amadurece entre P10 e P16. [L] Chirila et al. 2007, *J Physiol* 584:167 — **só resumo** (texto integral bloqueado).
- [I] Na nossa abstração, a constante da excitação (τ = 0,30 ms no maduro) representa o decaimento do potencial na Uint. O valor jovem com fonte mais próximo é a **constante da membrana em P12, ~2,5 ms**. A faixa testada antes (0,6–1,5 ms) estava **abaixo** desse valor.

### 1.2 Inibição jovem
Tudo de Magnusson et al. 2005 (texto integral, gerbil, P12–P25) [L]:
- **Decaimento da corrente inibitória:** **4,0 ± 1,8 ms (P12)** → **2,0 ± 0,5 ms (P17)**, sem mudança depois.
- **Subida (10–90%):** 0,7 → 0,45 ms.
- **Potencial inibitório, largura à meia altura:** **11,8 ± 5,2 ms (P12)** → **3,1 ± 1,2 ms (P20)**; subida 2,1 → 1,0 ms.
- **Força (condutância de pico):** **23,7 nS (P12)** → **11,4 nS (P17–P20)**: o jovem tem **cerca do dobro**. O número de vesículas liberadas por estímulo cai (9,1 → 3,2) e os eventos espontâneos ficam 3× mais raros: menos entradas depois da poda.
- **Sinal:** reversão da glicina em −90 mV, igual em P12 e P21; repouso −60 mV. **Já inibe em P12** (não excita).
- **Depende da experiência:** animais criados em ruído omnidirecional (P7–P20) **não** reduzem a força (28,8 nS) nem a frequência de eventos. Ou seja, **ouvir som não basta**: é preciso som com estrutura espacial. Kapfer et al. 2002 (*Nat Neurosci* 5:247, resumo) mostrou a parte anatômica: as sinapses inibitórias se recolhem para o corpo da célula, dependendo da experiência.
- Chirila et al. 2007 (resumo) [L]: o potencial inibitório é **mais longo que o excitatório nas idades jovens** e se aproxima dele em P16. **Só uma faixa estreita de tempos relativos (< 1 ms)** dá sensibilidade à diferença de tempo. Os autores **propõem** que as entradas inibitórias com atrasos inadequados sejam **podadas**.

### 1.3 Tempo da inibição em relação à excitação
- **Maduro/juvenil (P15–P20, in vitro):** a inibição **chega antes** da excitação. [L] Roberts, Seeman & Golding 2013, *Neuron* 78:923 — **resumo e trechos**; o valor médio da antecipação **não foi lido** (página bloqueada; o trecho visível corta no número). Roberts et al. 2014 (*Front Neural Circuits*, resumo): MNTB e LNTB chegam com latência e tremor parecidos; atraso disparo-no-MNTB → início do potencial inibitório = **0,55 ± 0,01 ms**.
- **Jovem (P12) na MSO:** **não encontrei medida.** O "chega 2,7 ms depois" não tem apoio na MSO; é do córtex.
- [L] Condução nas fibras do corpo trapezoide (camundongo): **4,2 m/s antes da audição (P8–P10)** → **8,5 m/s depois**, madura por volta de P18. Sinclair et al. 2017, *J Neurosci* 37:8239, **texto integral**. [I] Isto atrasa todas as vias jovens, mas não diz quanto a inibição se atrasa **em relação** à excitação.

### 1.4 Relação de força excitação : inibição na MSO jovem
- **Não encontrei.** É o número de que o colapso depende. Os dados existentes estão em condutância (nS) ou em formas de onda, não na proporção entre os dois efeitos sobre o potencial. Confiança de que não está nas fontes lidas: média (duas fontes centrais só em resumo).

---

## 2. Achado lateral importante: seleção de atrasos pela experiência na MSO

- [L] **Sierksma & Borst 2024**, *PLoS Biol* 22:e3002586 — **texto principal integral** (por extração). Em gerbis juvenis (P15–P28), in vivo:
  - a diferença de tempo preferida das células da MSO é **deslocada para o lado contralateral** em P18–P21: **0,24–0,28 ms**, muitas vezes fora da faixa ecológica;
  - em P26–P28 ela já é **como a do adulto**: 0,03 ms contra 0,04 ms;
  - a preferência acompanha a **diferença das latências que chegam dos dois lados** (r = 0,71), não a parte dentro da célula, que explica pouco;
  - os autores **propõem** plasticidade dependente do tempo dos disparos (STDP) ajustando as latências de chegada, com um modelo treinado em diferenças de tempo ecológicas. **Não testam diretamente** a dependência da experiência. Consideram improvável que a inibição defina a preferência durante o desenvolvimento.
- [I] Isso é um precedente direto da hipótese da V0.17: na MSO real, as diferenças de atraso **chegam desajustadas e são ajustadas pelo mundo** depois que o animal começa a ouvir. Também conversa com a "terceira camada" (selecionado pelo mundo). Registrado em [innovation-tracking](../../docs/innovation-tracking.md), seção 22.

---

## 3. O que isso muda na maturação [I]

1. **Excitação jovem:** há um valor com fonte, ~2,5 ms (membrana em P12), acima da faixa testada. Com excitação jovem de 2,5 ms, a carga excitatória jovem fica ~8× a madura. Isso pode desfazer o colapso, mas traz o risco já previsto: Uints jovens disparando em coincidências erradas.
2. **Inibição jovem:** na MSO ela é mais **forte** (~2×) e mais **longa** (corrente 2×; potencial ~4×) que a madura. O sentido da mudança coincide com o que usamos; o valor absoluto da força relativa à excitação continua sem fonte.
3. **Tempo:** não há base na MSO para a inibição jovem chegar tarde. A proposta mais fiel ao que foi lido é **não amadurecer o tempo** (manter o tempo do plano B) e amadurecer só a duração e a força.
4. **Quem dirige a maturação:** a regra aprovada (pelos acertos da Uint, não pela atividade bruta) tem apoio. Na MSO, o ruído sem estrutura espacial **não** faz amadurecer.
5. **A causa do colapso continua aberta:** sem a proporção E:I jovem, qualquer valor é escolha nossa. A forma honesta é usar **razões jovem/maduro** com fonte, aplicadas sobre os valores maduros já em uso (plano B), e declarar a perda.

## 4. Proposta para um novo registro [A] (depende do responsável)
- Excitação: τ jovem **2,5 ms** → 0,30 ms (Magnusson 2005).
- Inibição: tempo **fixo** (plano B: uma janela depois). Duração jovem = **2 × a madura** (razão das correntes, 4,0/2,0). Força jovem = **2 × a madura** (razão das condutâncias, 23,7/11,4). Ambas amadurecem até os valores do plano B.
- Regra de maturidade: a aprovada (acertos da Uint; meia-vida de regressão). N_meio e M_meia como antes, num mapa pequeno.
- Sementes novas (91–100), referência B nas mesmas sementes, motor com fila por cursor (com maturação ele usa a fila antiga).
- Leitura, como antes: passa se grave ≥ 8/10 e agudo em fase ≥ 8/10.

## 5. Fontes
- [Magnusson et al. 2005, J Physiol (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC1474742) — texto integral (extração).
- [Scott, Mathews & Golding 2005, J Neurosci](https://www.jneurosci.org/content/25/35/7887) — resumo e trechos.
- [Chirila et al. 2007, J Physiol (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC2277048) — só resumo (página bloqueada).
- [Kapfer et al. 2002, Nat Neurosci](https://link.springer.com/article/10.1038/nn810) — resumo.
- [Roberts, Seeman & Golding 2013, Neuron (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC3690812) — resumo e trechos; número da antecipação não lido.
- [Roberts, Seeman & Golding 2014, Front Neural Circuits](https://www.frontiersin.org/journals/neural-circuits/articles/10.3389/fncir.2014.00049/text) — resumo.
- [Sinclair et al. 2017, J Neurosci (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC5566870) — texto integral (extração).
- [Sierksma & Borst 2024, PLoS Biol](https://journals.plos.org/plosbiology/article?id=10.1371%2Fjournal.pbio.3002586) — texto principal integral (extração).

**Pendências de leitura:** resolvidas em 17/11 (seção 6), com os PDFs enviados pelo responsável.

---

## 6. Leitura integral dos dois artigos que faltavam (17/11, PDFs enviados pelo responsável)

Lidos por extração de texto do PDF (pdftotext), com as passagens conferidas no texto cru. As figuras só aparecem pelas legendas.

### 6.1 Roberts, Seeman & Golding 2013, *Neuron* 78:923 — texto integral
- **Idade e temperatura:** gerbis de **P15–P20** (as células da Figura 1 são de P15–P17), registros a **35 °C**, em fatia grossa com a via inteira, do nervo auditivo até a MSO.
- **A inibição chega antes da excitação:** do início do IPSP ao início do EPSP (a 20% da subida), **0,32 ± 0,13 ms** (ipsilateral, n = 6) e **0,38 ± 0,09 ms** (contralateral, n = 6); faixa de **0,15 a 0,54 ms**. Isso **sempre** aconteceu, mesmo com uma sinapse e uma célula a mais no caminho inibitório.
- **EPSP nessa idade:** amplitude 5–7 mV; meia-largura **0,85–0,89 ms**; subida (20–80%) 0,21–0,22 ms; tremor da latência 0,03–0,04 ms (menos de 2% da latência).
- A inibição que chega antes **não desloca** a função de diferença de tempo; ela reduz o pico e estreita a janela.
- [I] O **−0,3 ms** que usamos para a inibição madura passa a ter fonte direta na MSO: −0,32 a −0,38 ms em P15–20. Confiança alta.

### 6.2 Chirila, Rowland, Thompson & Spirou 2007, *J Physiol* 584:167 — texto integral
- **Temperatura fisiológica** (35,5–37,5 °C); idades de P6 a P22.
- **Excitação:**
  - EPSPs **com mais de 30 ms antes de P10**; **~4 ms em P11**; **≤ 2 ms em P14**;
  - amadurecem com constante de **1,4 dias**;
  - constante de tempo ponderada do EPSP em P8: 4,32 ms.
- **Inibição** (evocada pelo MNTB):
  - duração de **~40 ms em P10** para **3–4 ms em P16–P18**;
  - amadurece com constante de **2,05 dias**;
  - foi **tão longa ou mais longa que o EPSP em todas as idades**;
  - constante de tempo ponderada do IPSP em P10: 4,06 ms.
  - Antes de P10, os IPSPs passam de despolarizantes a hiperpolarizantes (citando Lohrke et al. 2005). Os autores sugerem que a maturação da cinética pode depender de autoestimulação ou de um programa genético, **não** da experiência sonora.
- **Tempo relativo:** em P15, **só uma faixa estreita de tempos de início do IPSP (< 1 ms, quase coincidente com a excitação)** dá sensibilidade à diferença de tempo. Os outros tempos dão curvas planas.
  - Os autores **propõem**: se existem, no animal, conexões inibitórias com esses tempos inadequados, elas **devem ser podadas**, o que exige um mecanismo que detecte as mudanças com o movimento da fonte ou da cabeça e as devolva à célula.
  - **Não mediram o tempo natural** da inibição no jovem.
- IPSPs espontâneos (mais curtos que os evocados, frequentes e sem período) **não** aumentam a inclinação da curva.
- Concluem que, em P15, a capacidade para a diferença de tempo já está pronta, e que o tempo relativo entre excitação e inibição é refinado nas semanas seguintes.

### 6.3 O que muda na proposta de maturação [I]
1. **Tempo maduro:** −0,3 ms tem fonte (Roberts 2013). **Tempo jovem:** continua **sem medida**. A proposta de Chirila é que, no jovem, existam inibições com tempos variados e que as inadequadas sejam podadas. Isso é **seleção pelo mundo** aplicada à inibição: a mesma lógica da terceira camada que já usamos para os atrasos.
2. **Duração da excitação jovem:** ~4 ms em P11 (37 °C) e constante da membrana de 2,5 ms em P12 (32 °C, Magnusson) apontam na mesma direção. τ jovem ≈ 2,5 ms continua razoável. Confiança média: duração e constante não são a mesma medida.
3. **Duração da inibição jovem:** a razão jovem/maduro, medida no **potencial**, fica perto de **4×** (meia-largura 11,8 → 3,1 ms, Magnusson; Chirila dá ordem de grandeza parecida ou maior). Não 2×: o 2× vinha da corrente.
4. **Regra da biologia:** a inibição dura **tanto ou mais** que a excitação, em todas as idades. **O plano B não cumpre isso.** A inibição dele dura 0,30 ms, igual à excitação madura, enquanto na MSO madura o IPSP dura 3–4 ms e o EPSP menos de 1 ms. Divergência já declarada no plano B; agora com números.
5. **O que move a maturação:** na inibição, a cinética talvez amadureça sem som (Chirila), enquanto a **força e o lugar** dependem da experiência espacial (Magnusson; Kapfer 2002). [I] Isso sugere separar dois relógios: um para a cinética (próprio, independente do mundo) e um para força e tempo (pelos acertos).

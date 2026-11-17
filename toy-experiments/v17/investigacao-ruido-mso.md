# V0.17 — Investigação: o ruído na MSO e o disparo da Uint (correção 8)

**Pedido do responsável (17/11):** "Quero discutir os modelos usados em redes neurais, com funções específicas de integração. Além disso, pesquise a fundo o ruído na MSO."
**Contexto:** desde a correção 8, a Uint dispara por sorteio, com chance p = min(1, (V/1,5)^n), n = 16 no conjunto B. O responsável perguntou se isso se justifica.
**Redação:** assistente (Claude), 17/11/2026. Leitura por buscas na web e extração de páginas por um modelo auxiliar; nível de leitura indicado em cada fonte.
**Legenda:** [L] literatura; [I] inferência do assistente; [A] proposta (a aprovar); [M] conhecimento geral do assistente, de memória (sem link; confiança indicada).

---

## 1. De onde vem o ruído na MSO [L]

### 1.1 A fonte principal: entradas espontâneas
- **In vivo, a MSO recebe um bombardeio de eventos sinápticos espontâneos**, mesmo em silêncio:
  - em registro de célula inteira (n = 3): **~900 eventos/s** acima de 0,5 mV, com meia-largura de ~0,6 ms;
  - em registro justacelular (n = 19): **mais de 500 eventos/s** em 14 de 19 células, e esse número é só um limite inferior.
  - [L] van der Heijden et al. 2013, *Neuron* 78:936; gerbil anestesiado; **texto integral** (por extração).
- **Em fatias, essas entradas espontâneas não aparecem** (mesma fonte). [I] Portanto, boa parte do ruído do potencial é **atividade de fundo que chega pelas fibras**, não algo interno à célula.
- **Disparo espontâneo da MSO:** de 0 a 12,5 disparos/s, com mediana de **0,4/s** (mesma fonte). [I] As entradas de fundo quase nunca levam a célula a disparar sozinhas; elas mexem o potencial perto do limiar.
- **A origem a montante:** as fibras do nervo auditivo têm atividade espontânea que pode chegar a ~100 Hz. [L] Svirskis et al. 2002 (*J Neurosci* 22:11019, resumo e introdução no PMC), citando Liberman 1978. Os neurônios do MNTB também disparam espontaneamente in vivo (… von Gersdorff, Grothe & Klug 2007, *J Neurophysiol* 98:807, resumo; o primeiro autor não aparece na página lida, a conferir).
- **O som reduz a variabilidade:** durante o som, a variância do potencial cai abaixo do nível espontâneo em 64% do ciclo, chegando a 5% dele (van der Heijden 2013). [I] O som organiza o fundo: o "ruído" é maior no silêncio do que durante o estímulo.

### 1.2 Como a célula trata esse ruído
- **A curva entrada → disparo é expansiva, do tipo potência:** pequenos aumentos no potencial do corpo produzem grandes aumentos na chance de disparo.
  - [L] van der Heijden 2013 (integral) e Mackenbach & Borst 2023 (*J Neurosci* 43:4093, texto quase integral pelo PDF dos autores).
  - **Nenhum dos dois dá o expoente nem a curva ajustada no texto**; ela só aparece em figura.
- **O mesmo tamanho de EPSP às vezes dispara e às vezes não?** O texto não diz explicitamente. [I] A curva de probabilidade contínua implica que sim.
- **Tempo do disparo:**
  - do EPSP ao disparo, 168 ± 20 µs, com coeficiente de variação 0,24;
  - EPSPs que **mal passam do limiar** produzem a maior parte da variação de tempo (van der Heijden 2013).
- **Uma corrente de potássio de baixo limiar** (I_KLT) faz a MSO responder às subidas rápidas e ignorar as lentas. Assim, a célula separa o sinal do ruído de fundo.
  - Em fatias com ruído artificial somado a um sinal abaixo do limiar, o disparo fica travado na fase do sinal; sem I_KLT, aumenta o disparo espontâneo.
  - [L] Svirskis et al. 2002 (resumo); *J Neurophysiol* 2009, "Noise-gated encoding of slow inputs…" (resumo; autoria não conferida).
- **Poucas entradas, grandes:**
  - bastam **2–4 fibras excitatórias por dendrito** para disparar, de pelo menos 4–8 no total;
  - **2–3 fibras inibitórias** (do MNTB);
  - a força excitação : inibição fica perto de **1:1 a 1,3:1** em condutância (adulto, P60–100).
  - [L] Couchman, Grothe & Felmy 2010, *J Neurosci* 30:17111, **texto integral** (por extração). Franken, Bremen & Joris 2014 (resumo): modelos com **≤ 10 entradas por lado**, sensíveis a uma única coincidência binaural.

### 1.3 Ruído intrínseco (canais)
- Não encontrei medida específica de ruído de canais na MSO. [I] Com ~900 eventos espontâneos por segundo, o ruído sináptico de fundo deve dominar; isto é inferência, com confiança média.

---

## 2. Modelos de integração usados em redes neurais [M]
Conhecimento geral, de memória. A existência e as ideias centrais são clássicas (confiança alta); detalhes de cada artigo, confiança média. Posso buscar e ler qualquer um deles se você quiser aprofundar.

| Família | Como integra | Como decide a saída | Ruído |
|---|---|---|---|
| **Limiar binário** (McCulloch & Pitts 1943; perceptron, Rosenblatt 1958) | soma ponderada | degrau: acima do limiar, 1; abaixo, 0 | nenhum |
| **Redes artificiais de taxa** (sigmoide, tanh, ReLU) | soma ponderada | função contínua da soma (taxa ou "ativação") | nenhum; o sorteio aparece no treino, não no neurônio |
| **Integra-e-dispara com vazamento** (LIF; Lapicque 1907) | potencial que soma entradas e decai | limiar duro: cruzou, dispara e reinicia | só se for somado de fora (ruído no potencial) |
| **LIF com ruído difusivo** | idem | limiar duro | ruído contínuo no potencial; a chance de disparar vira uma curva suave |
| **Ruído de escape / Spike Response Model** (Gerstner & Kistler) | potencial filtrado | **sorteio** a cada instante, com chance que cresce (em geral exponencialmente) com a distância ao limiar | o sorteio **é** o ruído, sem modelar sua origem |
| **Linear–não linear–Poisson (LNP/GLM)** | filtro linear | não linearidade (exponencial ou potência) seguida de sorteio de Poisson | idem |
| **Lei de potência** (córtex visual; Priebe, Ferster e outros; Miller & Troyer; Hansel & van Vreeswijk) | potencial médio | taxa ∝ (V − limiar)^n, com n ≈ 2–5 | explica a potência como **efeito do ruído** sobre um limiar duro |
| **Hodgkin–Huxley e modelos de compartimentos** | correntes iônicas reais em dendritos e corpo | o disparo emerge dos canais | ruído de canais e sinapses, se modelado |

[I] **Onde está a nossa Uint:** é um modelo de **ruído de escape** com não linearidade de potência, a mesma família do LNP e do Spike Response Model. A soma linear dos dois lados segue a MSO; o sorteio substitui o ruído **sem dizer de onde ele vem**.

[I] **O ponto conceitual:** a família "lei de potência" mostra que uma curva expansiva pode **surgir** de um limiar duro com ruído no potencial. Se a origem do ruído é conhecida (aqui, entradas espontâneas), dá para trocar o sorteio pelo mecanismo.

---

## 3. Opções para a Uint [A] (decisão do responsável)

1. **Manter o sorteio (como está).**
   - Equivale a ruído de escape.
   - Perdas: a origem do ruído não existe no modelo; o ruído é independente entre momentos e entre Uints; o expoente (16) não tem fonte, porque o texto lido não dá o valor.
2. **Limiar duro + ruído no potencial.** Um termo aleatório somado a V a cada avaliação. Fica mais perto do LIF com ruído, mas o sorteio continua, só que em outro lugar, e ainda sem origem.
3. **Limiar duro + atividade espontânea nas fibras (o mecanismo NB).**
   - As fibras A e B passam a ter **incidências espontâneas** além das causadas pelo mundo, com taxa de fundo das fibras de entrada.
   - O ruído vira **chegadas reais na Uint**: passam pela mesma soma, pelos mesmos ramos, e somem com o som organizando o fundo.
   - Liga-se à **segunda camada** já registrada (atividade própria do sensor antes do mundo).
   - Riscos [I]:
     - a atividade espontânea também passa pela Pcrt e pode criar Upros e ramos por acaso, o que é uma previsão testável;
     - aumenta o custo (mais incidências);
     - pede números: taxa de fundo por fibra e quanto dela chega à Uint.
   - [I] A biologia sugere que a MSO resolve isso com poucas entradas grandes e com a I_KLT, que filtra subidas lentas.
4. **Híbrido:** atividade espontânea nas fibras **e** um limiar menos duro, se o primeiro sozinho não bastar.

[I] Pelo método (modelo NB → mecanismo entendido → equivalência com perdas declaradas), a opção 3 é a mais fiel. A 1 é uma simplificação aceitável enquanto a origem não for modelada, mas a perda deve ficar escrita.

## 4. Fontes lidas
- [van der Heijden et al. 2013, Neuron (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC3741096) — texto integral (extração).
- [Mackenbach & Borst 2023, J Neurosci (PDF dos autores)](https://yarmo.eu/mackenbach-2023-dzw-mso.pdf) — texto quase integral (extração).
- [Couchman, Grothe & Felmy 2010, J Neurosci (CORE)](https://core.ac.uk/download/12174948.pdf) — texto integral, figuras só nas legendas (extração).
- [Svirskis et al. 2002, J Neurosci (PubMed)](https://pubmed.ncbi.nlm.nih.gov/12486197/) e [introdução no PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC3677217) — resumo e introdução.
- ["Noise-gated encoding…", J Neurophysiol 2009](https://journals.physiology.org/doi/full/10.1152/jn.00538.2009) — resumo.
- [Franken, Bremen & Joris 2014 (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC4013490) — resumo.
- [Calyx de Held sob atividade in vivo, J Neurophysiol 2007](https://epub.ub.uni-muenchen.de/60729/) — resumo.

**Pendências:**
- a curva entrada → disparo com números (só nas figuras de van der Heijden 2013 e Mackenbach & Borst 2023);
- taxas espontâneas das células esféricas (entradas excitatórias da MSO) no gerbil;
- quanto da atividade espontânea das fibras chega à MSO jovem (antes e depois de P12).

---

## 5. Taxa da atividade espontânea (pesquisa pedida em 17/11, 16h40)

| Achado [L] | Fonte e leitura | Confiança |
|---|---|---|
| Gerbil in vivo: atividade espontânea das **entradas** (endbulbs, fibras do nervo) **96 ± 52 disparos/s** (2–245; n = 42); das **células esféricas**, **60 ± 44/s** (1–188). Em média **42%** dos disparos espontâneos da entrada **não** geram disparo na célula esférica (de 4% a 93%) | Kopp-Scheinpflug, Dehmel, Dörrscheidt & Rübsamen 2002, *J Neurosci* 22:11004 — **texto integral** (extração; figuras só pelas legendas) | alta |
| Fibras do nervo de **baixa frequência** no gerbil: distribuição **bimodal**, com um modo perto de **5/s** e outro perto de **60/s** | Conjunto de dados de fibras de gerbis jovens e velhos, *Scientific Data* 2024 (s41597-024-03259-3) — **resumo e trechos** | média-alta |
| Abaixo de ~3,6 kHz, cerca de **74%** das fibras são de alta atividade espontânea (> 18/s) | Huet et al. 2016, *Hear Res* (revisão; trechos) | média |

[I] **Para a nossa fibra:** a fibra que chega à Uint corresponde, na MSO, ao axônio da **célula esférica**, não à fibra do nervo. O número mais direto é **~60/s em média**, com grande variação entre células. Isso bate com os ~900 eventos espontâneos por segundo na MSO (van der Heijden 2013), se cada célula da MSO recebe algo como 8–15 entradas. Esta última parte é conta minha, com confiança baixa.

[I] **Perda a declarar:** com som, a atividade espontânea não se soma simplesmente à evocada (a fibra satura e trava na fase). Na abstração, as incidências espontâneas seriam sorteadas à parte e somadas às do mundo.

## 6. Como a atividade espontânea varia entre fibras (pesquisa pedida em 17/11, 17h)

| Achado [L] | Fonte e leitura | Confiança |
|---|---|---|
| Cada célula ciliada interna é parceira **única** de 10–30 fibras do nervo, com taxas espontâneas variadas; a **diversificação das taxas acontece depois do início da audição** (rato, cóclea excisada) | Wu, Young & Glowatzki 2016, *J Neurosci* (PMC5059429) — resumo e significância | média-alta |
| Antes do início da audição, uma parte maior das fibras e dos neurônios do tronco fica **em silêncio**, e isso diminui com a idade. Nos animais que já ouvem, a taxa espontânea varia de poucos Hz a mais de 100 Hz | revisão em PDF (core.ac.uk 357392181), citando Kiang 1965, Liberman 1978, Walsh & McGee 1987, Taberner & Liberman 2005 — trechos | média |
| No MNTB do camundongo in vivo, a taxa espontânea **sobe** de P8 a P13 e muda de **surtos** (pré-audição) para disparo **contínuo e aleatório** perto do início da audição; antes de ouvir, 1–20 disparos/s | Sonntag et al. 2009, *J Neurosci* (PMC6666529) — resumo e legenda de figura | média-alta |
| Gerbil adulto: células esféricas 60 ± 44/s (1–188); entradas 96 ± 52/s (2–245) | Kopp-Scheinpflug et al. 2002 — texto integral (seção 5) | alta |
| Fibras de baixa frequência no gerbil: distribuição bimodal (modos ~5/s e ~60/s) | *Scientific Data* 2024 — resumo e trechos (texto não aberto) | média-alta |

[I] **Leitura:** a taxa espontânea é uma **propriedade de cada fibra** (dada), que se **diversifica com o desenvolvimento**. No adulto ela é contínua e aleatória; no jovem, mais baixa e em surtos. Para o passo 2: **60/s fixo** agora, como decidido. Depois, **taxa por fibra sorteada da distribuição medida** (média 60, desvio 44, de 1 a 188), como dado anatômico. Os surtos antes de ouvir pertencem à segunda camada (depois da V0.17).

## 7. Janela retangular: quanto tempo cada incidência vale (pesquisa pedida em 17/11, 17h)

**O que a janela retangular troca [I]:** hoje cada incidência entra inteira e decai com τ = 0,30 ms. Na janela retangular, ela vale inteira por L ms e depois some. Duas formas de escolher L com base no NB:

| Critério | Valor | Base [L] | Perda declarada [I] |
|---|---|---|---|
| **Mesma carga que hoje** (a área de uma exponencial com τ é τ × pico) | **L = 0,30 ms** | τ da membrana madura ≈ 0,31 ms (Couchman et al. 2010, texto integral: 305,78 ± 74,29 µs) | só muda a **forma**; a carga e o número continuam os de hoje; perde-se a soma parcial de incidências separadas por mais de L |
| **Meia-largura do EPSP in vivo** | **L ≈ 0,4–0,6 ms** | 415 ± 73 µs (espontâneos, justacelular) a 608 ± 142 µs (célula inteira), van der Heijden 2013 (texto integral) | janela maior que hoje, porque em vivo o EPSP é mais largo que em fatia |
| Janela de coincidência medida | 0,05–0,5 ms (depende do tamanho) | em fatia, dois EPSPs somam para disparar se separados por 50–500 µs, em 73% das células (Grothe & Sanes 1994, J Neurosci, **resumo**) | não é um número só; depende da força |

[I] **Proposta:** para respeitar "um mecanismo por vez", **L_E = 0,30 ms**. Assim o passo 1 muda só a forma (retangular) e tira o sorteio, sem mudar a carga. A meia-largura in vivo fica para quando a excitação ganhar maturação.

**Inibição retangular:** pela regra aprovada, L_I ≥ L_E. Na MSO madura, o IPSP dura bem mais: 3–4 ms em P16–18 (Chirila 2007, texto integral); meia-largura de 3,1 ms em P20 (Magnusson 2005); decaimento da condutância de 1,5–1,8 ms no adulto (Myoga et al. 2014, trecho; Couchman 2010). Proposta para o passo 1: **L_I = L_E = 0,30 ms**. Mantém o plano B como está e cumpre "≥" no limite. A duração verdadeira (ordem de 1,5–4 ms) entra junto com a maturação da inibição, que é outro mecanismo.

**Adaptações que continuam no modelo (para o princípio "sem adaptações"):**
1. o tempo da inibição do plano B ("uma janela depois"; na MSO ela chega 0,3 ms **antes**);
2. a duração da inibição do plano B (0,30 ms contra 1,5–4 ms);
3. a força 0,5 da inibição sem base na MSO;
4. o sorteio, que sai no passo 1.

Já estão em [dissonâncias](dissonancias-nb.md); a ordem de troca é decisão do responsável.

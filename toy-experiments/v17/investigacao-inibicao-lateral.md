# V0.17 — Revisão neurobiológica da inibição lateral (antes do ensaio)

**Pedido do responsável (16/11/2026):** "Revise o mecanismo NB antes" do ensaio de inibição lateral.
**Regra em revisão (D22, aprovada em 16/11):** "a Uint que acerta inibe, com −0,5, as outras Uint que recebem da mesma Upro". A inibição pré-alimentada (D22, mesma decisão) entra aqui só onde a literatura a toca.
**Estado de leitura:** todas as fontes abaixo foram lidas **só por resumo ou trechos** devolvidos pela busca, salvo indicação. Nenhum texto integral. Autoria marcada "a verificar" quando a busca não a mostrou.

## 1. Hipóteses, escritas antes da busca (assistente)

1. **Intermediária:** uma célula excitatória não inibe a vizinha diretamente; passa por uma célula inibitória, o que acrescenta atraso e muda quem é inibido.
2. **Alvo:** quem é inibido é definido por vizinhança ou por entradas em comum, não por "receber da mesma fibra".
3. **Tempo:** a inibição tem atraso (~1 ms) e duração (vários ms); nossa janela é de 0,21 ms.
4. **Plasticidade:** as ligações inibitórias também se ajustam com a experiência.
5. **Audição:** no tronco auditivo, a inibição participa da própria detecção das diferenças de chegada.

## 2. O que a literatura diz

| # | Achado | Fonte (estado) | Hipótese |
|---|---|---|---|
| 1 | Em redes de competição, a célula excitatória mais estimulada suprime as outras **pela célula inibitória compartilhada** (inibição de dois passos); no extremo, só uma fica ativa ("o vencedor leva tudo") | Artigo de revisão no repositório edoc da Universidade de Basel (autoria e título a verificar; trecho) | 1 confirmada |
| 2 | O princípio de Dale: a maioria dos neurônios é só excitatória ou só inibitória; modelos com inibição direta entre células excitatórias o violam. Há exceções (coliberação) | Artigo em PMC3403226 (resumo; autoria, ano e periódico a verificar); revisões em arXiv (trechos) | 1, com ressalva: o programa já admite efeito com sinal por Upro e coliberação ([efeitos v0.1](../../docs/effects-v0.1.md)) |
| 3 | **Dois tipos, dois tempos.** Pré-alimentada: recrutada pelas mesmas entradas que excitam as células inibidas. De retorno: recrutada pelas próprias células que depois recebem a inibição, e por isso **começa mais tarde** | Artigo em PMC7176419 (autoria a verificar; trecho) | 2 e 3: a nossa regra lateral é um híbrido (disparada pelo vencedor, como a de retorno; dirigida a quem tem entrada em comum, como a pré-alimentada) |
| 4 | No hipocampo (CA1), a inibição de retorno começou **mais de 3 ms depois** do pico da excitação | Artigo em PMC2269280 (autoria a verificar; resumo) | 3 confirmada |
| 5 | No detector de diferenças de chegada dos mamíferos (oliva superior medial), a inibição pré-alimentada **chega antes** da excitação direta; ela estreita a janela de coincidência, mas não a desloca | Roberts, Seeman e Golding, 2013, *Neuron* 78(5):923–935 (resumo) | 5 confirmada; diverge da D22 ("uma janela depois") |
| 6 | Da célula inibitória (núcleo medial do corpo trapezoide) até o início da inibição na célula da oliva: **0,55 ms** | Roberts, Seeman e Golding, 2014, *Front. Neural Circuits* 8:49 (resumo). Confiança alta no número (medido, n = 4) | 3 |
| 7 | Bloquear a inibição **desloca** a preferência por diferença de chegada; inibição precisa seria essencial | Brand et al., 2002, *Nature* 417:543–547; Pecka et al., 2008, *J. Neurosci.* 28:6914–6925 (resumos) | 5. **Controverso:** outros registros concluem que a preferência é determinada pelo tempo das entradas excitatórias (resumo de congresso, IUPS 2013; autoria a verificar) |
| 8 | A inibição desloca o pico da excitação conforme o momento em que chega, e com isso o momento de melhor coincidência | Myoga et al., 2014, *Nat. Commun.* 5:3790 (resumo) | 5 |
| 9 | Plasticidade nas sinapses inibitórias equilibra excitação e inibição, conforme a experiência | Vogels et al., 2011, *Science* 334:1569–1573 (resumo) | 4 confirmada; nosso −0,5 é fixo |
| 10 | Inibição de dois passos **com plasticidade** faz as células excitatórias aprenderem traços **diferentes** entre si | arXiv 1812.11581 (resumo; autoria a verificar) | 4; é precedente direto do que o ensaio quer ver |
| 11 | Disparos sem correlação geram competição; **disparos sincronizados impedem** a competição do tipo "vencedor leva tudo" | Lumer, 2000, *Neural Comput.* (resumo) | Nova: o som da peça sincroniza as vias; risco para o ensaio |
| 12 | Na coruja, a ambiguidade de fase (o *aliasing* do nosso ensaio) é resolvida pela **convergência de várias faixas de frequência** numa célula de banda larga; a inibição **aumenta** a diferença entre o pico verdadeiro e os falsos | Peña e Konishi, 2000, *PNAS* 97:11787–11792 (resumo) | Nova: a solução biológica do *aliasing* é principalmente convergência entre faixas, com inibição como reforço |

## 3. Confronto com a regra aprovada (dedução do assistente)

1. **A inibição lateral precisa de uma ligação entre Uint.** Na biologia, a inibição de retorno passa por uma célula intermediária ligada às células excitatórias. No Sdom, isso é uma Upro de uma Uint para outra (direta, com efeito negativo, ou por uma unidade intermediária). É o **segundo nível**, que acabou de ser adiado junto com a repetição interna. A regra, como está, faz a inibição chegar sem Upro, o que contraria "incidências só saem por Upro".
2. **Quem é inibido.** "Receber da mesma Upro" corresponde à inibição pré-alimentada (entrada em comum), não à de retorno (vizinhança ligada ao vencedor).
3. **Tempo.** A de retorno começa milissegundos depois; com janela de 0,21 ms, ela não pode impedir a coincidência atual, só as seguintes. A pré-alimentada, na oliva, chega **antes** da excitação, não uma janela depois.
4. **Força fixa.** Na biologia a inibição se ajusta; com −0,5 fixo perde-se o mecanismo que, nos modelos (achado 10), faz as unidades se diferenciarem.
5. **Sincronia.** Com som, as vias disparam juntas; a competição por inibição pode falhar (achado 11).
6. **Aliasing.** A biologia o resolve sobretudo pela convergência entre faixas (achado 12), que a V0.17 já pode produzir com 64 faixas, sem inibição lateral.
7. **Contradição interna encontrada:** a seção 4.1 do pré-experimento lista "inibição" como **fora desta versão**, mas a D22 a inclui. Precisa de decisão.

## 4. Caminhos (para o responsável decidir)

- **(a) Manter como simplificação declarada:** efeito direto, sem intermediária, com atraso de retorno (milissegundos), perdas declaradas (itens 1–4).
- **(b) Ficar só com a pré-alimentada nesta versão** (não exige ligação entre Uint) e revisar o seu tempo pela oliva (antes da excitação, ou o tempo como algo a ser construído).
- **(c) Adiar a inibição lateral para a versão com segundo nível**, pela mesma razão da repetição; a competição entre ramos e a convergência entre faixas ficam como os mecanismos de seleção da V0.17.

## 5. Bibliografia desta revisão (só resumos ou trechos)

1. Brand, A., Behrend, O., Marquardt, T., McAlpine, D., Grothe, B. (2002). Precise inhibition is essential for microsecond interaural time difference coding. *Nature*, 417, 543–547. **Resumo.**
2. PMC3403226. Inhibitory interneurons enable sparse code formation in a spiking circuit model of V1. **Resumo; autoria, ano e periódico a verificar.**
3. Lumer, E. D. (2000). Effects of spike timing on winner-take-all competition in model cortical circuits. *Neural Computation*. **Resumo.**
4. Myoga, M. H., Lehnert, S., Leibold, C., Felmy, F., Grothe, B. (2014). Glycinergic inhibition tunes coincidence detection in the auditory brainstem. *Nat. Commun.*, 5, 3790. **Resumo.**
5. Pecka, M., Brand, A., Behrend, O., Grothe, B. (2008). Interaural time difference processing in the mammalian medial superior olive: the role of glycinergic inhibition. *J. Neurosci.*, 28(27), 6914–6925. **Resumo.**
6. Peña, J. L., Konishi, M. (2000). Cellular mechanisms for resolving phase ambiguity in the owl's inferior colliculus. *PNAS*, 97(22), 11787–11792. **Resumo.**
7. Roberts, M. T., Seeman, S. C., Golding, N. L. (2013). A mechanistic understanding of the role of feedforward inhibition in the mammalian sound localization circuitry. *Neuron*, 78(5), 923–935. **Resumo.**
8. Roberts, M. T., Seeman, S. C., Golding, N. L. (2014). The relative contributions of MNTB and LNTB neurons to inhibition in the medial superior olive assessed through single and paired recordings. *Front. Neural Circuits*, 8, 49. **Resumo.**
9. Vogels, T. P., Sprekeler, H., Zenke, F., Clopath, C., Gerstner, W. (2011). Inhibitory plasticity balances excitation and inhibition in sensory pathways and memory networks. *Science*, 334, 1569–1573. **Resumo.**
10. arXiv 1812.11581. Unsupervised learning by a nonlinear network with Hebbian excitatory and anti-Hebbian inhibitory neurons. **Resumo; autoria a verificar.**
11. PMC2269280 (inibição de retorno em CA1, início > 3 ms após o pico da excitação). **Resumo; autoria e título a verificar.**
12. PMC7176419 (latência entre excitação e inibição; pré-alimentada × de retorno). **Trecho; autoria e título a verificar.**
13. Revisão sobre "vencedor leva tudo" e inibição em córtex colunar, edoc Universidade de Basel. **Trecho; autoria e título a verificar.**

# V0.17 — Investigação: como o neurônio da MSO integra as duas orelhas (forma da Uint)

**Pedido do responsável:** 17/11/2026 (correção 8: "pesquisar a forma antes"). **Redação:** assistente (Claude). Nada aqui é decisão.
**Leitura:** WebFetch (extração por modelo auxiliar) e trechos de busca; o nível de cada fonte está na tabela.

## 1. Achados [L]

| Achado | Fonte e leitura | Confiança |
|---|---|---|
| **As entradas das duas orelhas somam linearmente** no corpo da célula: a previsão linear explicou 97,9% da variância da resposta abaixo do limiar; somar as respostas de cada orelha previu a binaural com 95,5% (19 células) | van der Heijden et al. 2013, Neuron 78:936, gerbil anestesiado, in vivo — **integral, via extração** | alta |
| **A não linearidade está na saída:** a relação entre o potencial abaixo do limiar e a taxa de disparo é **expansiva** (tipo potência); estímulo binaural no melhor atraso deu 3,8× a soma dos disparos de cada orelha. O artigo não dá o expoente no texto (só na figura) | idem | alta para a forma; sem número |
| Sem evidência de inibição bem cronometrada que desloque a sintonia (com a ressalva da anestesia) | idem | média (debate em aberto; há trabalhos em sentido contrário, por exemplo Myoga et al. 2014 em fatias) |
| EPSP com meia-largura de ~0,4–0,6 ms; do EPSP ao disparo, ~0,17–0,22 ms; a latência cai quando o EPSP cresce, e EPSPs que mal passam do limiar geram a maior parte da variação de tempo | idem | alta |
| Entradas de dendritos diferentes **somam linearmente** no corpo; pequenos aumentos no potencial do corpo produzem grandes aumentos na chance de disparo (não linearidade expansiva na geração do disparo); a resposta a uma orelha pouco depende do som na outra | Mackenbach e Borst 2023, J Neurosci 43:4093 — **resumo e trechos** | alta |
| Canais de sódio perto do corpo **compensam a soma sublinear** dos EPSPs e mantêm a integração **linear**; isso baixa o limiar para entradas das duas orelhas em relação a uma só | Scott, Mathews e Golding 2010 — **resumo e trechos** | média-alta |
| Canais Kv1, mais concentrados perto do corpo, compensam o filtro do cabo e **melhoram a resolução temporal** | Mathews et al. 2010, Nat Neurosci — **resumo e trechos** | média-alta |
| Os **próprios dendritos** são fonte importante de atraso interno (40 morfologias completas, modelagem) | Casarez, Voglewede et al. 2026, eLife (preprint revisado) — **trechos** | média |
| A detecção de coincidência não é instantânea: é moldada pelas condutâncias intrínsecas e pela atividade sináptica anterior, o que gera um atraso interno | Franken et al. 2015, Nat Neurosci 18:444 — **resumo** | média |
| Em modelo, os dendritos separados por orelha **melhoram** a detecção de coincidência | Agmon-Snir, Carr e Rinzel 1998, Nature 393:268 — **resumo (parcial)** | média |

## 2. O que muda na correção 8 [A]

**A proposta anterior estava errada em um ponto.** Eu tinha proposto que o corpo combinasse os dois lados de forma **supralinear**, para que poucas entradas fortes valessem mais que muitas fracas. A evidência in vivo diz o contrário: **a soma dos dois lados é linear**. Treze ramos de 0,08 produzem, no corpo, o mesmo que um de 1,0 — na biologia também.

**Onde está a não linearidade:** na **saída**. A chance de disparar cresce de forma **expansiva** com o potencial, e não salta de zero para um num limiar exato.

**Consequência para nós (inferência):** a nossa Uint tem um **limiar duro** (abaixo de 1,5, nunca dispara). Na biologia, uma soma de 1,2 dispararia **às vezes**. Esses disparos ocasionais são o que permitiria começar a competição que depende do disparo e a integração que alimenta a Pcrt — o "ovo e a galinha" que vimos três vezes. O limiar duro pode ser parte do preço.

**Correção 8 revisada (proposta):**
1. **Dois compartimentos (um por orelha), somados linearmente** no corpo. Na prática, é o que já fazemos, mais o recurso por lado (correção 1); a diferença é declarar a forma.
2. **Saída probabilística e expansiva** em vez do limiar duro: a chance de disparo cresce com a soma de forma expansiva (por exemplo, uma potência ou uma curva em S íngreme), passando pelo valor de hoje (1,5) como ponto de chance alta. O expoente não está no texto lido (só na figura de van der Heijden 2013) → **mapear**.
3. **Os pequenos atrasos dos ramos** ganham uma base anatômica a mais: a posição no dendrito (Casarez et al. 2026). Continua "dado, sorteado sem ordem".

**Perdas:** geometria dendrítica, canais específicos, ruído de membrana (a chance de disparo resume tudo isso).

## 3. Evidência contrária a registrar
A hipótese "no mamífero, o mundo seleciona a fase pela inibição" (innovation-tracking, seção 21) encontra aqui **evidência contra**: in vivo, van der Heijden et al. 2013 não acharam inibição bem cronometrada deslocando a sintonia; Mackenbach e Borst 2023 concluem soma linear sem papel substancial da inibição no corpo. O debate continua (trabalhos em fatia apontam papel da inibição).

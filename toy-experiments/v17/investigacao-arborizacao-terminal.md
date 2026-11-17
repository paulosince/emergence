# V0.17 — Investigação: as subdivisões de um colateral (os nossos ramos)

**Pedido do responsável:** 17/11/2026, na discussão do ramo. Modelo dele: **fibra** = axônio; **Upro** = colateral (ramo do axônio); **ramo** = subdivisão da Upro, a aresta com várias cabeças.
**Pergunta:** quantas cabeças tem um colateral, para quantos alvos, e quanta diferença de atraso há entre elas?
**Redação:** assistente (Claude). **Leitura:** WebFetch (extração por modelo auxiliar) e trechos de busca. Nada aqui é decisão.

## 1. Achados [L]

| O quê | Achado | Fonte e leitura | Confiança |
|---|---|---|---|
| Para quantos alvos | No gato, os axônios das células esféricas do núcleo coclear dão vários colaterais na MSO contralateral; 7 de 9 cobrem 40–60% da extensão rostrocaudal do núcleo; nenhum cobre o núcleo inteiro. O número de neurônios contatados não foi estimado | Karino, Smith, Yin e Joris 2011, J Neurosci 31:3016 — **integral, via extração** | alta para a anatomia; média para os números (diâmetros estimados ao microscópio óptico) |
| Dois padrões | Alguns axônios contralaterais têm colaterais de comprimento graduado (mais curtos para a parte rostral, mais longos para a caudal); outros têm campo terminal restrito, do tamanho de uma só árvore dendrítica | Beckius, Batra e Oliver 1999, J Neurosci 19:3146 — **resumo** | média |
| Diferença de atraso entre as cabeças (mamífero) | Pequena. No único exemplo calculado no texto, de ~220 a ~350 µs (~130 µs de faixa) entre pontos terminais do mesmo axônio. Os autores dizem que os pontos medidos não são idênticos a terminais sinápticos | Karino et al. 2011 — integral, via extração | média (um exemplo; estimativa a partir de diâmetros) |
| Diferença de atraso entre as cabeças (ave) | Na coruja, o tempo de condução muda **~160 µs** ao longo dos 700 µm de profundidade do núcleo laminar, e isso corresponde à faixa de diferenças entre as orelhas que a coruja usa. Os axônios agem como linhas de atraso | Carr e Konishi 1990, J Neurosci 10:3227 — **resumo** | média-alta |
| Isso explica a sintonia? | **Na ave, sim** (linhas de atraso formam um mapa). **No gato, os autores duvidam:** as estimativas não são consistentes, numa forma simples, com os dados binaurais; parece cada vez mais duvidoso que esses padrões sejam essenciais | Karino et al. 2011 — integral, via extração | alta para o que os autores concluem |
| Contatos no mesmo neurônio | Mediana de 4 contatos por fibra num dendrito da MSO (gerbil jovem), coordenados | Callan et al. 2021 — via investigação do ChatGPT (texto integral segundo ele) | média |

## 2. O que isso diz para o modelo [A]

1. **A aresta com várias cabeças tem apoio.** Um colateral (Upro) se abre em muitas subdivisões (ramos) que chegam a **muitos neurônios** (Uints) diferentes de uma faixa do núcleo, e a cada um com alguns contatos coordenados.
2. **A diferença de atraso entre as cabeças é da ordem de 0,1–0,2 ms**, e não de milissegundos. É a mesma escala das próprias diferenças entre as orelhas (a nossa é de 0,458 ms). Isso confirma a decisão: **atraso grande na Upro, pequeno no ramo**.
3. **Na ave, é exatamente a pequena diferença entre as cabeças que sintoniza cada neurônio** numa diferença diferente entre as orelhas: um mapa. Então as **cópias da relação** teriam um lugar natural: **em Uints diferentes**, cada uma alcançada por uma cabeça com atraso ligeiramente diferente.
4. **No mamífero, isso é duvidoso** (Karino 2011). Reforça a hipótese registrada de que, nos mamíferos, outra coisa (a inibição, a dispersão temporal, a convergência) faz a sintonia.
5. **Consequência para a V0.17:** com 0,5–20 ms de atraso nos ramos de uma mesma Upro, o nosso modelo dava a uma única Upro diferenças que, na biologia, pertencem a **colaterais diferentes** (Upros diferentes). Isso ajuda a explicar a divisão da força: tratávamos como "vizinhos da mesma aresta" o que seriam arestas distintas.

## 3. Fontes
- Karino, S., Smith, P. H., Yin, T. C. T. e Joris, P. X. (2011). *Axonal branching patterns as sources of delay in the mammalian auditory brainstem: a re-examination.* J Neurosci 31:3016–3031. https://pmc.ncbi.nlm.nih.gov/articles/PMC3157295 — integral, via extração.
- Beckius, G. E., Batra, R. e Oliver, D. L. (1999). *Axons from anteroventral cochlear nucleus that terminate in medial superior olive of cat: observations related to delay lines.* J Neurosci 19:3146–3161. https://pmc.ncbi.nlm.nih.gov/articles/PMC6782263 — resumo.
- Carr, C. E. e Konishi, M. (1990). *A circuit for detection of interaural time differences in the brain stem of the barn owl.* J Neurosci 10:3227–3246. https://pmc.ncbi.nlm.nih.gov/articles/PMC6570189 — resumo.
- Smith, P. H., Joris, P. X. e Yin, T. C. T. (1993). *Projections of physiologically characterized spherical bushy cell axons from the cochlear nucleus of the cat: evidence for delay lines to the medial superior olive.* J Comp Neurol — resumo (não aberto).

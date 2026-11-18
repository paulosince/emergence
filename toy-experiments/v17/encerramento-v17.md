---
title: "EMERGENCE V0.17 — Encerramento"
subtitle: "O que buscávamos, o que foi dado, o que as regras fizeram e o que aprendemos"
author: "Responsável: Paulo Rogério da Silva · Redação: assistente (Claude)"
date: "18/11/2026"
lang: pt-BR
---

# Estado

- **A V0.17 foi encerrada pelo responsável em 18/11/2026.** O pré-experimento nunca foi congelado. O experimento propriamente dito (Bach numa sala, 384 vias) **não chegou a rodar**. Tudo o que está aqui vem do **ensaio mínimo**: um par de vias (uma por ouvido), pulsos ideais e uma única relação a descobrir.
- Nada deste documento é decisão nova. Os números vêm de `ensaio-minimo/resultados.md` e das investigações citadas. Os detalhes e as fontes completas estão lá.
- Marcas usadas: **[medido]** quando foi observado nos ensaios; **[hipótese]** quando é leitura nossa ainda não testada; **[literatura]** quando vem de artigo lido, com o grau de leitura indicado na investigação correspondente.

# 1. Por que a V0.17 foi encerrada

Desde 11/11/2026, a pergunta vigente do programa é a **constituição inicial**: quais operações mínimas do construtor (a Pcrt) permitem que as incidências vindas dos sensores **constituam por conta própria** as primeiras Upros e Uints, partindo de **zero Upros e zero Uints** ([regras de 11/11](../../docs/regras-cientificas-e-continuidade-2026-11-11.md), seção 4).

No ensaio mínimo da V0.17, as **Uints já existiam desde o início**: uma Uint até 17/11 e **oito** a partir do registro de 17/11. As 96 Upros iniciais e os ramos delas também eram dados. Assim, a V0.17 testou **seleção sobre uma malha pronta**, e não constituição. Isso foi percebido só em 18/11, ao separar com cuidado o que era dado do que era criado (seção 4).

**Responsabilidade.** A decisão das 8 Uints entrou no registro de 17/11 como decisão do responsável, que assumiu ter aprovado sem perceber o alcance. O assistente redigiu o registro e implementou o motor. A regra de 11/11 estava escrita no repositório, e o assistente **deveria ter apontado o conflito** e não apontou. O erro é dos dois.

# 2. O que a V0.17 queria saber

Um sistema que **nasce quase vazio** e **constrói ligações aos poucos**, sem nenhuma regra dizendo o que procurar, consegue:

1. não explodir (criar sem parar) nem morrer (perder tudo);
2. guardar o que é **estável** no mundo (de onde vêm os sons) mais do que o que é passageiro (coincidências entre notas);
3. reusar o que guardou quando o mundo se repete?

O mundo planejado era uma sala com dois alto-falantes tocando a Tocata e Fuga em Ré menor, de Bach, e um robô parado ouvindo. No ensaio mínimo, a relação a descobrir era: o som do alto-falante mais próximo chega a um ouvido **0,458 ms** antes do outro [medido na simulação da cabeça]. Os testes usaram notas **graves** (125–400 Hz) e **agudas** (1,1–1,7 kHz).

# 3. As peças, explicadas do começo

**O que a biologia faz.** Para saber de onde vem um som grave, o cérebro usa a pequena diferença de chegada entre os dois ouvidos. No tronco cerebral, numa região chamada oliva superior medial (MSO), há células que recebem fios dos dois ouvidos e **só disparam quando os pulsos dos dois lados chegam juntos**. Se o fio de um lado atrasa 0,46 ms a mais, os pulsos de um som que vem daquele lado se encontram, e aquela célula passa a "significar" aquela direção. Ninguém programa isso: no desenvolvimento, as ligações que combinam com o som ficam, e as outras somem [literatura].

**As peças do modelo:**

| Peça | O que é, em palavras simples |
|---|---|
| **Utrd** | A unidade que transforma o som em pulsos. |
| **Fibra** | Cada linha de pulsos que sai de um ouvido. Na biologia são muitas; no ensaio, primeiro uma e depois oito por ouvido. |
| **Incidência** | Um pulso que sai de uma fibra. Só nasce do som (um pulso por ciclo da nota, quando a fibra consegue disparar) ou da atividade espontânea (pulsos ao acaso, como na biologia). |
| **Upro** | O fio que leva a incidência, com um atraso (de 0,5 a 20 ms). Pertence a uma fibra. |
| **Ramo** | A ponta da Upro que toca uma Uint. Soma um atraso pequeno (0 a 0,2 ms) e tem **força**, ou seja, o quanto empurra. |
| **Uint** | O ponto de encontro. Soma o que chega pelos ramos. Se a soma passa do **limiar (1,5)** dentro de uma janela curta (0,3 ms), ela **dispara**. |
| **Pcrt** | O construtor: cria Upros novas perto das que quase fizeram a Uint disparar. |
| **Aprendizado** | O ramo que ajuda num disparo ganha força; o que nunca participa dos disparos é removido; depois de um disparo, quem chega atrasado perde um pouco. |
| **Episódio** | O som toca 10 s; depois vem silêncio. Cada ensaio tem 5 episódios. |
| **Semente** | Cada repetição do ensaio com um acaso diferente (tremor dos pulsos, atrasos pequenos, quem alcança quem). "30/30" = deu certo nas 30 repetições. |

# 4. O que era dado, o que as regras criaram, o que removeram

Medido no último modelo (8 fibras por ouvido, limite de disparo por fibra, depressão, força por fibra, sem inibição), sementes 371–376, medianas.

**Dado desde o início (não criado por regra nenhuma):**

- **8 Uints.**
- **8 fibras por ouvido** (16 no total).
- **Quem alcança quem:** cada Uint recebe de 2 a 4 fibras de cada lado, por sorteio, tratado como dado anatômico.
- **6 Upros por fibra** (96 no total), com atrasos fixos de 0,5 a 20 ms.
- **Ramos:** cada Upro nasce com **um ramo para cada Uint que a sua fibra alcança** (de 1 a 6; mediana 3). **Não existe critério de necessidade para um ramo:** ele vem junto com a Upro.

**O que as regras fizeram:**

| | Grave | Agudo |
|---|---|---|
| Incidências por fibra (com som / no silêncio) | ~253/s / ~58/s | ~306/s / ~57/s |
| Incidências inibitórias | 0 | 0 |
| Chegadas a ramos por episódio | 680 mil → 335 mil | ~970 mil |
| Upros novas criadas pela Pcrt | 26 (de 24 a 35) | **0** |
| Ramos vivos (do 1º ao 5º episódio) | 232 → 119 | 306 → 306 |
| Ramos removidos por não participar | 268 | **0** |
| Ramos por lado de Uint, no fim | 8 | 18 |
| Força do maior ramo / força do lado | 0,17 | 0,08 |

**Leitura [medido]:**

1. **No agudo, a malha do fim é exatamente a malha dada:** nada foi criado e nada foi removido. A Pcrt só brota de um ramo com força de pelo menos 0,3, e nenhum ramo do agudo chega lá.
2. **No grave, as regras esculpem:** removem ~270 ramos e criam algumas Upros, que são cópias com atraso 10% maior ou menor que o de Upros existentes.
3. **Não houve convergência forte, nem no grave:** cada lado de Uint termina com 8–9 ramos, e o maior tem só ~15% da força.
4. **Inibição:** nenhuma no último modelo. A inibição provisória ("plano B") saiu em 18/11. A inibição da MSO foi programada, mas não chegou a ser adotada.

# 5. Como chegamos aqui (resumo da trajetória)

1. **Primeiros ensaios (16/11).** Com as regras iniciais, "tudo gerava tudo": em 50 ms, o construtor encheu todos os atrasos possíveis. Com mudanças pequenas, veio o oposto: nada sobrevivia. Num mapa de parâmetros, achou-se uma região estreita onde a relação certa vencia (9 de 10 sementes com notas variando).
2. **Erro do motor (17/11).** O programa testava todos os pares de fios a cada pulso, contra a decisão de que o construtor só olha o que falhou. Foi corrigido, e os resultados anteriores deixaram de valer automaticamente.
3. **Força dividida (17/11).** O sistema achava a região certa, mas dividia a força entre vizinhos e cópias. Com isso, a Uint não disparava.
4. **Correções (17/11).** Com estoque por lado da Uint e eliminação dos perdedores, as Uints passaram a disparar, e o grave selecionava.
5. **"Acabou o sorteio" (17–18/11).** Até aqui, a Uint disparava por sorteio. A regra do responsável passou a ser trocar cada adaptação por um mecanismo biológico, **um por vez**, e cada mecanismo fica. Entraram nesta ordem: limiar fixo e janela retangular; atividade espontânea; correção do relógio da eliminação; eliminação por não participação; retirada do plano B; 8 fibras com limite de disparo; depressão no lugar da punição antiga; força por fibra.
6. **Diagnósticos de 18/11.** A força por fibra deixa o agudo mudo (~80% do limiar). O critério do agudo media o som, e não o aprendizado. A malha era quase toda dada.

# 6. O que aprendemos de verdade

## 6.1 Lições de método (as mais importantes para a V0.18)

1. **Separar, antes de tudo, o que é dado do que é criado,** e conferir isso contra a pergunta vigente do programa. Contar unidades não mede formação, e uma malha dada não demonstra constituição.
2. **Um critério precisa medir aprendizado, e não o mundo.** O critério de fase do agudo dava "sintonizado" para qualquer coincidência causada pelo próprio som: a fase era boa já no 1º episódio e não melhorava [medido]. Um teste de aprendizado compara **antes e depois** do treino, com o aprendizado congelado, e usa controles como a nota fixa e a relação deslocada.
3. **Adaptações escondem causas.** O sorteio do disparo, o plano B e a punição fixa produziram falhas difíceis de diagnosticar. O plano B em janela retangular matou o agudo [medido], e a punição fixa matou o sistema quando as fibras se multiplicaram [medido].
4. **O motor precisa seguir as decisões, e isso precisa ser conferido.** Houve dois erros desse tipo: a Pcrt rodava sobre todos os pares de fios, e o relógio da eliminação contava o silêncio entre episódios.
5. **Medir antes de afirmar.** Várias afirmações do assistente foram corrigidas pela medida. Por exemplo: "nenhuma Uint chega a 100 disparos" estava errado; a causa do colapso do passo 1 também estava errada.

## 6.2 Lições de mecanismo

Valem para **uma malha dada, um par de vias e pulsos ideais**. Não generalizar sem testar.

1. **Sem variação no mundo, não há o que aprender:** com uma nota fixa, vence um encaixe com um ciclo a mais ou a menos [medido].
2. **Achar não é escolher:** a força ia para a região certa (70–100%), mas se dividia. Quem desempata é o disparo, e o disparo não vem enquanto a força está dividida [medido].
3. **Um enfraquecimento sem limite mata o sistema quando as entradas se multiplicam.** A forma biológica (perder uma fração da própria força, só depois de um disparo) não mata, e deixa o disparo no silêncio em ~0,5/s, perto dos ~0,4/s da MSO [medido; literatura: van der Heijden et al. 2013].
4. **Atividade espontânea só faz sentido em fibras individuais.** Num fio único que vale por uma população inteira, ela fazia a Uint disparar 55/s no silêncio [medido].
5. **A estrutura inicial favorece diferenças pequenas:** quando o mundo mudou a diferença para 1,5 ou 3,0 ms, as Uints acompanharam, mas com menos frequência [medido].
6. **No agudo, com a força realista de cada fibra e fibras que pulam ciclos** (~23% dos ciclos com o limite de 300 disparos/s), a soma chega a ~80% do limiar. Sem disparo, nada é selecionado [medido].

## 6.3 O que a literatura lida acrescentou

Graus de leitura e confiança nas investigações citadas.

- **Convergência:** os 2–4 fibras por lado são um **limite inferior** funcional (Couchman, Grothe & Felmy 2010). A anatomia indica pelo menos 7 por lado, talvez algumas dezenas (Callan, Heß, Felmy & Leibold 2021). Com entradas reais até ~1,5 kHz, uma saída fisiológica pede tipicamente 4 ou mais por lado (Franken, Bremen & Joris 2014). Ver `investigacao-tres-pecas.md`, seção 9.
- **O jovem:** a fibra jovem é **mais fraca** em relação ao limiar (são precisas 4,6 fibras juntas no jovem e 3,3 no maduro; Kladisios, Fischer & Felmy 2020), mas a janela de soma é ~2× mais longa (Scott, Mathews & Golding 2005). Ver `investigacao-tres-pecas.md`, seção 8.
- **No jovem, as entradas ficam distribuídas em pequenos contatos,** que crescem com o desenvolvimento (Callan et al. 2021, discussão).
- **Sincronização à fase interaural na MSO de gato:** exemplos de 0,30 e 0,72 (Batra & Yin 2004). Ver `investigacao-criterio-agudo.md`, seção 5.

# 7. O desafio do agudo (registro)

Imagine o ponteiro de um relógio que dá uma volta a cada ciclo da nota. No agudo, uma volta dura de 0,6 a 0,9 ms.

1. **Ambiguidade.** A diferença procurada (0,46 ms) é mais de meia volta. "Chegou 0,46 ms depois" e "chegou 0,46 ms menos uma volta depois" deixam o ponteiro no mesmo lugar. Num único canal de frequência, não há como distinguir. A biologia resolve isso juntando vários canais [literatura, resumo].
2. **Quase tudo coincide.** Com uma janela de 0,3 ms numa volta de ~0,7 ms, quase qualquer par de fios coincide em algum ciclo.
3. **As fibras pulam ciclos** e, com força realista, a soma não chega ao limiar [medido].
4. **Quando dispara, não aprende:** os ramos continuam espalhados, e a fase "boa" já vem do som [medido].

# 8. Erros registrados

| Erro | De quem | Onde está a correção |
|---|---|---|
| Uints e Upros dadas, contra a pergunta vigente de 11/11 | responsável e assistente | este documento |
| Pcrt testando todos os pares de fios | assistente (implementação) | errata de 17/11 em `resultados.md` |
| Relógio da eliminação contando o silêncio | assistente | errata de 17/11 (noite) |
| Critério de fase do agudo medindo o mundo | assistente (proposta) | diagnóstico de 18/11; `investigacao-criterio-agudo.md`, seção 6 |
| Causa do colapso do passo 1 atribuída ao fim do sorteio | assistente | diagnóstico do agudo, 17/11 |
| "Nenhuma Uint do agudo chega a 100 disparos" | assistente | seção "Força por fibra" |
| Estimativa de ganho da otimização (3–10×; deu ~1×) | assistente | seção "Otimização, fase 1" |
| Medida "V potencial" apresentada como teto | assistente | diagnóstico do impasse, 18/11 |

# 9. O que passa para a V0.18

- **Regra já decidida:** entre versões passam **só parâmetros**, nunca estrutura consolidada.
- O código, as investigações e os diagnósticos da V0.17 ficam no repositório como **referência**. Nenhum resultado da V0.17 vale como evidência de constituição.
- **A direção da V0.18 é do responsável.** Nada está decidido.

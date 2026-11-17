# V0.17 — Registro prévio: fibra, Upro com várias cabeças, estoque na Uint

**Estado:** **APROVADO** pelo responsável em 17/11/2026 ("Aprovo, pode implementar").
**Redação:** assistente (Claude), 17/11/2026. **Base:** [proposta e decisões](../proposta-ramos-e-upros.md); [decisões em construção](../decisoes-em-construcao.md) (linhas de 17/11).
**Legenda:** [R] decisão do responsável; [A] proposta do assistente (a aprovar com este registro); [L] literatura.
**Continua valendo** do [motor por eventos](pcrt-incidencias.md): Pcrt restrita às incidências sem integração; integrada = fez a Uint disparar; quase-acerto = soma ≥ 75% do limiar sem disparar, avaliado pela Uint; broto só perto de acerto recente (janela de 60 s); inibição do plano B (I1).
**Sai:** a soma fixa da força por Upro [R]; a competição ligada ao disparo (não escolhida) [R]; o enfraquecimento do quase-acerto isolado (não fez diferença) [A].

## 1. Estrutura
- **[R]** Fibra = a origem (uma por orelha no par de vias). **Upro** = aresta com atraso **grande**. **Ramo** = cabeça da Upro que chega a **uma** Uint, com atraso **pequeno** somado ao da Upro e com **força**; um ponto de chegada por ramo.
- **[R]** Cada Upro tem ramos para **várias Uints**: **8 Uints** no ensaio.
- **[R]** Atrasos pequenos dos ramos: **dados, sorteados sem ordem**. [A] Uniformes de **0 a 0,2 ms**, com semente; sorteados de novo para cada Upro nova.
- **[A] Início:** cada fibra começa com **6 Upros**, com os atrasos grandes de antes (0,5 a 20 ms, espaçados proporcionalmente); cada Upro com 8 ramos (um por Uint), força inicial **0,15**.

## 2. Força e competição
- **[R]** Estoque na Uint (Triesch, Vo e Hafner 2018, modelo).
- **[A]** O estoque é **por lado** de cada Uint: na MSO, as entradas de cada orelha chegam a dendritos diferentes (Mackenbach e Borst 2023, resumo), e o estoque de Triesch é local, do dendrito. **Tamanho: 1,0 por lado** (com os dois lados cheios, a soma pode chegar a 2,0, acima do limiar de 1,5). Quando a soma das forças dos ramos que chegam a um lado de uma Uint passa de 1,0, os ramos que não acabaram de se fortalecer são reduzidos na mesma proporção (a mesma conta de hoje, agora por lado da Uint).
- **[A]** Teto por ramo: **1,0**. Ganho por acerto, meia-vida, enfraquecimento por sincronia, estabilização e poda: **iguais aos de hoje**, por ramo.

## 3. Exuberância (Pcrt) e poda
- **[R]** Upro nova a **±10%** do atraso grande de uma Upro com quase-acerto.
- **[A] Gatilho:** como hoje, por ramo: o ramo contribuiu para um quase-acerto da sua Uint, ele ou um vizinho acertou nos últimos 60 s, 5 contagens, força ≥ 0,3. Então a **Upro dele** dá origem a duas Upros novas da mesma fibra (+10% e −10%), se ainda não existir Upro a menos de 2% desse atraso. Cada Upro nova nasce com 8 ramos de força 0,15 e atrasos pequenos sorteados.
- **[A] Poda:** ramo sem acerto por 600 s some (salvo se estável); Upro sem ramos some.
- **[A] Limite de engenharia:** se a soma de ramos passar de **2.000**, a execução para e conta como explosão.

## 4. Subteste: uma Upro por Uint [R: com e sem]
- Cada Upro tem **um** ramo, para uma só Uint. Início: 6 Upros por fibra **para cada Uint** (48 por fibra). Upro nova a ±10%, para a mesma Uint. O resto igual.

## 5. Medidas
- Por Uint: disparos no último episódio, parte dos acertos na relação verdadeira (atraso total de A − atraso total de B a até uma janela de 0,458 ms), par mais forte.
- **[A] Uint sintonizada** (descrição, não termo): ≥ 100 disparos no último episódio e ≥ 60% dos seus acertos na relação verdadeira. **Uint presa no acaso:** ≥ 100 disparos e < 20% dos acertos na relação verdadeira.
- Por execução: número de Uints sintonizadas e presas no acaso; se as cópias da relação (mesma diferença por Upros diferentes) caem em Uints diferentes; soma total da força (risco de explosão); número de Upros e ramos; insumo da Pcrt; tempo.

## 6. Classes e regras de leitura (fixadas agora) [A]
- **Seleção:** ≥ 1 Uint sintonizada e **nenhuma** presa no acaso. **Explosão:** limite de 2.000 ramos atingido. **Colapso:** nenhum acerto no último episódio. **Difuso:** o resto.
- **Grade:** grave e agudo; notas e período fixo; I1; 10 sementes; forma principal = **80 execuções**; subteste uma Upro por Uint: grave e agudo, notas, I1 = **20 execuções**.
- **Leitura:** grave com notas, forma principal, **≥ 8 de 10** seleções: a estrutura segue para o degrau seguinte da escada. **4–7:** levar ao responsável com diagnóstico, sem ajustar. **≤ 3:** parar e levar. O **agudo** é lido à parte, mas, como é o degrau 1 da escada, só se sobe de degrau se ele também selecionar em ≥ 8 de 10. O período fixo deve **não** selecionar (previsão). O subteste é lido por comparação.

## 7. Previsões (escritas antes de rodar) [A]
1. Sem a soma fixa por Upro, os ramos de uma Upro não disputam entre si; a força deixa de se dividir entre vizinhos colados. Esperado: Uints que disparam com regularidade no grave.
2. Uints diferentes se sintonizam na relação por caminhos diferentes (as cópias se separam).
3. **Risco 1 (explosão de força):** sem soma fixa por Upro, o estoque na Uint é o único freio; se ele não bastar, muitos ramos ficam fortes e muitas Uints disparam por acaso (presas no acaso).
4. **Risco 2 (agudo):** a densidade de chegadas pode fazer as Uints dispararem por acaso; a previsão é incerta.

# V0.17 — Registro prévio: degrau 2 da escada — duas relações verdadeiras (uma por alto-falante)

**Estado:** **RASCUNHO** — aguarda aprovação do responsável. Nada foi rodado.
**Redação:** assistente (Claude), 17/11/2026. **Base:** [guia](../guia-para-continuar-v17.md), escada de ensaios, degrau 2; [pré-experimento](../pre-experimento.md) (sala com dois alto-falantes em paredes opostas, robô de lado); [replicação do conjunto B](replicacao-b.md) (passou: grave 28/30, agudo em fase 27/30).
**Ponto de partida:** conjunto B, inibição I1 (plano B), motor com fila por cursor (saída idêntica à referência; ver resultados de 17/11). Nada mais muda.
**Legenda:** [R] decisão do responsável; [A] proposta do assistente (a aprovar); [I] inferência.

## 1. O mundo deste degrau [A]
- **Duas fontes independentes**, cada uma com seu próprio ritmo (mesma regra de antes: período sorteado na faixa a cada 250 ms), tocando ao mesmo tempo.
- Fonte 1 (alto-falante de um lado): B chega **Δ1 = +0,458 ms** depois de A. Fonte 2 (alto-falante do lado oposto): B chega **Δ2 = −0,458 ms** (antes de A). [I] Com o robô de lado e os alto-falantes em paredes opostas, as duas fontes ficam perto do eixo dos ouvidos, com diferenças de sinal oposto e tamanho parecido; o valor medido para um lado é ~0,46 ms.
- Cada fibra recebe a união das incidências das duas fontes.
- **Perda declarada [I]:** uma fibra real responde à **mistura** do som (não carrega dois trens independentes) e tem refratariedade. Aqui as duas fontes só se somam. A mistura de verdade entra no degrau 3 (gravação real, transdução pelas Utrd).

## 2. Medidas
Por Uint com ≥ 100 disparos, a partir das diferenças de atraso dos acertos no último episódio:
- **sintonizada em Δ1:** fração dos acertos a até uma janela (0,21 ms) de Δ1 ≥ 0,6;
- **sintonizada em Δ2:** idem para Δ2;
- **presa no acaso:** fração somada em Δ1 e Δ2 < 0,2.
Também: ramos, classe antiga, número de Uints em cada relação.

## 3. Leitura (fixada agora)
- **Grave (julgado):** sucesso numa semente se houver **≥ 1 Uint em Δ1 e ≥ 1 Uint em Δ2** e **nenhuma presa**. Passa se **≥ 24 de 30** sementes (101–130, novas), o mesmo padrão da replicação.
- **Controle (grave, só a fonte 1, mesmas sementes):** sucesso = ≥ 1 Uint em Δ1 e nenhuma presa. Serve para ver se a segunda fonte atrapalha a primeira.
- **Agudo (só descritivo, sem critério):** [I] com período de 0,6–0,9 ms, Δ2 = −0,458 cai **dentro** da faixa de equivalentes de fase de Δ1 (Δ1 − T, com a janela: −0,65 a +0,07 ms): **num único canal, as duas relações são quase equivalentes em fase** e não dá para separá-las. A separação fica para o degrau com várias faixas, como na biologia.
- Passou → degrau 3. 18–23 → levar ao responsável com diagnóstico, sem ajustar. ≤ 17 → parar e levar.

## 4. Previsões [A]
1. As Uints se dividem entre as duas relações (competição por estoque na Uint e eliminação competitiva separam as cópias, como no degrau 1).
2. Risco: coincidências **entre** as fontes (A de uma com B da outra) não têm relação fixa, então não devem consolidar; mas aumentam o ruído e podem baixar a taxa em relação ao controle.
3. Risco: a relação mais "fácil" para a estrutura (preferência medida em 17/11) pode tomar mais Uints. Com |Δ1| = |Δ2|, esperamos divisão parecida.

## 5. Execuções e custo
30 sementes × (grave e agudo com duas fontes + grave com uma fonte) = **90 execuções**. Estimativa: ~3–5 min nos 2 núcleos (as incidências dobram). Confiança média. Script pronto: `ensaio_duas_relacoes.py`.

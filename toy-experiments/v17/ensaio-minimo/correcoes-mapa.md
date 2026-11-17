# V0.17 — Registro prévio: correções 1, 2 e 8 com mapa de sensibilidade

**Estado:** RASCUNHO para aprovação do responsável. Nada de código antes da aprovação.
**Redação:** assistente (Claude), 17/11/2026. **Base:** [correções aprovadas](../correcoes-dissonancias.md); [integração na Uint](../investigacao-integracao-uint.md); [estrutura](estrutura-ramos.md) (continua valendo: fibra, Upro com 8 cabeças, atrasos pequenos dados e sorteados, Upro nova a ±10%, quase-acerto a 75%, broto perto de acerto recente, inibição do plano B, integrada = fez a Uint disparar).
**Legenda:** [R] decisão do responsável; [A] proposta do assistente (a aprovar com este registro); [L] literatura.

## 1. As mudanças
1. **Correção 1 [R] — recurso local por lado da Uint**, no lugar do estoque de soma fixa. [A] Cada lado de cada Uint tem um recurso R, que começa cheio (R_cheio). Um acerto fortalece o ramo em **ganho × R/R_cheio** e gasta esse valor de R. R se repõe exponencialmente até R_cheio com constante τ_R. Teto por ramo: 1,0. **Nenhuma soma imposta.**
2. **Correção 2 [R] — eliminação competitiva.** [A] Num mesmo lado de uma Uint, um ramo não estável cuja força fique abaixo de **θ × (força do ramo mais forte desse lado)** continuamente por um tempo **T_elim** (tempo do mundo simulado, contando os silêncios) é retirado. A poda por desuso continua.
3. **Correção 8 [R] — saída probabilística e expansiva.** [A] A cada chegada, a Uint dispara com chance **p = min(1, (V/1,5)ⁿ)** (V = soma; 1,5 = limiar de hoje), com um intervalo mínimo de uma janela (0,21 ms) entre disparos. Quanto maior n, mais perto do limiar duro de hoje. Sorteio com semente (reprodutível). Soma dos dois lados: linear (como hoje).
4. **Correção 7 [R]:** sem regra ligada ao disparo; ganho por acerto mantido e marcado como sem base NB.
5. **Correção 9 [R]:** medidas de população (seção 4).
6. **Correção 6 [R] (maturação):** **não entra neste mapa** [A]; ver seção 5.

## 2. Mapa (etapa de triagem) [A]
- Faixas, registradas antes: τ_R ∈ {10 s, 60 s, 300 s}; R_cheio ∈ {0,5; 1,0; 2,0}; θ ∈ {0,10; 0,25; 0,50}; T_elim ∈ {10 s, 60 s, 300 s}; n ∈ {4, 8, 16}.
- Grave, notas, I1, **sementes 1 a 3**: 3⁵ = 243 combinações × 3 = **729 execuções** (estimativa: ~10 min; confiança média).
- O responsável vê o mapa e escolhe até **3 conjuntos** para a confirmação.

## 3. Confirmação [A]
- Cada conjunto escolhido: grave e agudo × notas e período fixo × I1 × **10 sementes** = 40 execuções por conjunto.
- **Leitura (fixada agora):** um conjunto passa se o grave **e** o agudo com notas selecionarem em **≥ 8 de 10** e o período fixo **não** selecionar em mais de 2 de 10. Passou → segue para a maturação (seção 5) e depois para o degrau seguinte da escada. 4–7 de 10 → levar ao responsável com diagnóstico. ≤ 3 → parar e levar.

## 4. Medidas
- Classes como no registro da estrutura: Uint sintonizada (≥ 100 disparos no último episódio e ≥ 60% dos acertos na relação verdadeira); presa no acaso (≥ 100 e < 20%); seleção = ≥ 1 sintonizada e nenhuma presa.
- **População (correção 9):** número de Uints sintonizadas; diferença preferida de cada Uint (média das diferenças de atraso dos acertos) e o espalhamento entre Uints; se as cópias caem em Uints diferentes.
- Força: por ramo (máxima), número de ramos por lado de Uint, recurso médio no fim, ramos eliminados (correção 2) e podados por desuso.
- Disparos por Uint, insumo da Pcrt, Upros novas, tempo.

## 5. Por que a maturação (correção 6) fica para depois [A]
Ela traz pelo menos 4 números novos (constante de tempo jovem e madura da excitação, o mesmo para a inibição, a velocidade de maturação pelos acertos e a de regressão pelo decaimento), e a versão fiel da inibição já falhou uma vez. Misturá-la a este mapa tornaria impossível saber qual correção fez o quê. Proposta: mapear 1, 2 e 8 agora; com um conjunto que passe, acrescentar a 6 num registro próprio.

## 6. Previsões [A]
1. Com a saída probabilística, as Uints passam a disparar às vezes mesmo com a força dividida; os disparos tiram incidências do insumo da Pcrt e reduzem a criação de Upros.
2. Com a eliminação, o número de ramos por lado de Uint cai ao longo dos episódios; com o recurso, o ramo que acerta mais concentra força sem soma imposta.
3. **Risco:** com n pequeno, disparos ao acaso demais (Uints presas no acaso); com θ alto e T_elim curto, eliminação precoce da relação verdadeira (colapso).

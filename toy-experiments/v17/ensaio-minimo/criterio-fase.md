# V0.17 — Registro: reavaliação do agudo com o critério de fase

**Estado:** **APROVADO** pelo responsável em 18/11/2026 ("Aprovo a troca", com a opção "Instrumento o motor e reavalio o modelo atual com o critério novo, em sementes novas").
**Redação:** assistente (Claude), 18/11/2026. **Base:** [investigação do critério do agudo](../investigacao-criterio-agudo.md).

## 1. Critério (aprovado)
- Para cada acerto da Uint no último episódio: fase = 2π·(diferença de atraso − Δ)/T, com **T da nota tocada no momento do acerto**.
- R = |média de e^{i·fase}|; p de Rayleigh ≈ exp(−n·R²).
- **Sintonizada:** ≥ 100 disparos, p < 0,01 e |fase média| < π/4. **Presa:** ≥ 100 disparos e p ≥ 0,01.
- **Sucesso numa semente:** ≥ 1 sintonizada e nenhuma presa. O grave mantém o critério antigo.
- **Engenharia:** o motor passa a acumular a fase dos acertos (só medida; com as opções antigas, saída idêntica). Pequena imprecisão declarada: usa-se o período da nota no instante da **chegada** na Uint, e não no da incidência; a diferença só pesa perto da troca de nota (atrasos ≤ 20 ms contra notas de 250 ms).

## 2. Condições, sementes
- **Sementes 371–400** (30, novas), grave e agudo.
- (a) **modelo atual** (8 fibras, limite 300/s, depressão NB A = 0,02, **com** força por fibra, sem inibição);
- (b) o mesmo **sem** força por fibra;
- (c) **referência antiga** (1 fibra, sorteio, plano B, conjunto B), só para calibrar o critério novo.
- Total: 3 × 2 × 30 = 180 execuções.

## 3. Leitura
- Reavaliação **descritiva**: mostra o que o critério novo diz de cada modelo.
- Para o modelo atual valem as regras do registro da força por fibra (o agudo precisa disparar); a decisão sobre seguir é do responsável.
- **Declaração:** verificação de funcionamento (semente 1, fora do conjunto):
  - (b) R ≈ 0,32–0,35 com fase média de 0,11–0,21 rad (sucesso);
  - (a) R ≈ 0,33–0,35, mas sem disparos (não conta);
  - (c) R ≈ 0,50–0,76.
- **Limite já visível:** com dezenas de milhares de acertos, até um R pequeno é "significativo". Na prática, o critério passa a depender da **direção** da fase. Pode ser preciso um piso de R, que exigiria um valor biológico (ainda não lido).

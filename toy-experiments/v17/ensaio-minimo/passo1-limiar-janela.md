# V0.17 — Registro prévio: passo 1 — tirar o sorteio (limiar duro e janela retangular)

**Estado:** **APROVADO** pelo responsável em 17/11/2026 (L_E = L_I = 0,30 ms; "Aprovo, com a regra"). Declaração: antes da aprovação, um teste de funcionamento na semente 31 (fora deste conjunto) deu grave em seleção e agudo em colapso sem disparos.
**Redação:** assistente (Claude), 17/11/2026.
**Base:**
- decisões do responsável de 17/11 (17h): fim do sorteio; janela retangular também na inibição; um mecanismo por vez; ordem 1 → 2 → 3;
- [ruído na MSO](../investigacao-ruido-mso.md), seção 7.

**Ponto de partida:** conjunto B, inibição I1 (plano B), fila por cursor, duas fibras (uma por ouvido). **Só muda o que está abaixo.**
**Legenda:** [R] decisão do responsável; [A] proposta do assistente (a aprovar); [L] literatura.

## 1. O que muda
1. **Disparo [R]:** a Uint dispara quando **V ≥ 1,5**, fora do período de uma janela depois do último disparo (como hoje). Sem sorteio; o expoente sai do modelo.
2. **Janela retangular da excitação [R: forma; A: duração]:** cada incidência soma sua força a V **por inteiro durante L_E = 0,30 ms** e depois sai.
   - É a mesma carga do decaimento atual (τ = 0,30 ms, ≈ τ da membrana madura, Couchman 2010). Muda só a forma.
3. **Janela retangular da inibição [R: forma; A: duração]:** cada chegada inibitória vale por inteiro durante **L_I = 0,30 ms** (= L_E, o mínimo pela regra L_I ≥ L_E).
   - O tempo (uma janela depois) e a força (−0,5) seguem os do plano B.
   - A duração verdadeira entra com a maturação da inibição.
4. **Nada mais muda:** quase-acerto (75% do limiar), Pcrt, competição, eliminação, estoque.

## 2. Mundo, sementes, condições
- Degrau 1: uma relação, Δ = 0,458 ms; grave e agudo (notas).
- **Sementes 131–160** (30, novas).
- **Referência:** o conjunto B atual (com sorteio) nas mesmas sementes.
- Total: 2 motores × 2 faixas × 30 = **120 execuções**, ~10 min nos 2 núcleos. Confiança média.

## 3. Medidas
- Seleção no grave; seleção em fase no agudo; Uints sintonizadas e presas.
- Disparos e acertos por episódio.
- Insumo da Pcrt; ramos; Upros novas.
- **Episódio do primeiro acerto** (para ver se volta o "ovo e a galinha": sem sorteio, as Uints novas podem nunca disparar).

## 4. Leitura (fixada agora)
- **Passa** se grave ≥ 24/30 **e** agudo em fase ≥ 24/30: o passo 1 fica, e seguimos para o passo 2 (atividade espontânea, 60/s).
- **Não passa:** não se ajusta nada. O passo 2 (atividade espontânea) é o mecanismo NB previsto para dar os disparos perto do limiar que o sorteio fazia. **Proposta:** registrar o resultado e seguir para o passo 2 **mantendo o passo 1**, desde que o motivo seja a falta de disparos (diagnóstico pelo episódio do primeiro acerto). Se o motivo for outro, levar ao responsável.
- A referência é lida por comparação.

## 5. Previsões [A]
1. Com a mesma carga, o grave deve se comportar perto da referência, talvez com menos disparos no começo.
2. **Risco provável:** sem sorteio, menos disparos perto do limiar, menos competição no início, e o "ovo e a galinha" pode voltar, sobretudo no agudo.
3. A janela retangular de 0,30 ms soma por inteiro incidências separadas por até 0,30 ms; hoje, a 0,21 ms (a janela de coincidência), a soma valia só ~50%. Isso pode **facilitar** coincidências um pouco mais afastadas.

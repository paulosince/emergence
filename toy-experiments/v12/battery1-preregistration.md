# V0.12 — Adendo corretivo Bateria 1 (congelado antes de executar)

**Objetivo:** auditar viabilidade instrumental da regra atual, não demonstrar Uint/Upro. **Estatuto:** bateria exploratória corretiva, posterior ao PDF candidato e à primeira execução. Não altera código V0.12 original.

## Problemas diagnosticados
P1: braço B começa g=.001, com fluxo diminuto, enquanto regra de atualização subtrai .0000018 por passo quando |flux|≈0, prendendo g no piso. P2: A e C iniciam g=.06; comparação com B é confundida. P3: sementes não variam fontes periódicas nos braços A/B/C. P4: métricas de alvo podem ocultar diferenças locais e a regra reduz g em repouso.

## Hipóteses corretivas a testar, sem assumir confirmação
- HC-B1: piso de B é estado absorvente para pulsos atuais e atualização `+.0009(|flux|-.002)`; aumentar apenas a amplitude do pulso ou reduzir o limiar basal pode liberar o estado, sem provar constituição.
- HC-B2: com g inicial igual, diferenças de resposta entre regras devem ser atribuíveis à atualização, não ao estado inicial.
- HC-B3: alterar calendário de incidências pode alterar distribuição espacial de g; sementes só são replicações quando determinam efetivamente calendários distintos.
- HC-B4: atualização durante repouso enfraquece g mesmo sem incidência, o que pode mascarar retenção.

## Plano e critérios de leitura
**E1 — teste analítico local:** calcular fluxos iniciais `g*Δv` e condição `|flux|>.002` para reforço; considerar g=.001 e g=.06 e Δv=1. Regra de atualização original, sem ajuste.
**E2 — varredura de condições iniciais:** g0 ∈ {.001,.005,.02,.06}; amplitude ∈ {1,3,10}; mesma geometria e 480 ticks de pulsos a cada 12 ticks; registrar média, mínimo, máximo, número de arestas reforçadas relativamente a g0, resposta e chegada ao alvo; repouso 120 ticks; não comparar g0 distintos como prova de plasticidade.
**E3 — controles pareados:** para cada g0 e amplitude, comparar `learn=true` e `learn=false` sob mesma sequência; sonda sem atualização. O braço instrumental é uma cópia parametrizada da regra A/B, não reinterpretação de B original.
**E4 — padrões temporais:** com g0=.06, amplitude=1, comparar periodicidade 12 com calendário pseudoaleatório de 40 pulsos em 480 ticks, sementes [11,41,73]; preservar mesma quantidade de pulsos; observar se sementes geram condições efetivamente distintas.
**E5 — repouso:** comparar 120 passos com atualização ligada vs desligada, a partir do mesmo estado treinado.

## Restrições
Não adicionar detectores de coincidência, destinos, Uint/Upro ou rótulos de fonte ao mecanismo. Sondas observacionais podem usar fonte e alvo definidos externamente. Resultados positivos significam apenas viabilidade de propagação/plasticidade. Registrar falhas e confusões; não declarar equivalência NB. Execução somente depois deste arquivo estar salvo.

# Pré-teste de ramos — resultados

**Execução:** 15/11/2026, Node 22.23.4. `node --test engine.test.mjs` (7 de 7 passam) e `node run.mjs` → [resultados.json](./resultados.json) (dados brutos de todas as condições e sementes).
**Pré-registro:** [pre-registro.md](./pre-registro.md), congelado e versionado antes do código (commit `b8b036e`). Nenhum parâmetro foi alterado depois da execução.

## Confronto com as previsões

| Cond. | Previsto A / B | Observado A / B | Critério |
|---|---|---|---|
| C1 — 3 ramos quase simultâneos | 0 / 0 | 0 / 0 | S1 ✔ |
| C2 — ramos 2 / 7 ms, período 5 ms | 0 / 19 | 0 / 19 | S2 ✔ |
| C3 — 131 períodos (1,50–8,00 ms) | A = 0; B conforme \|k·P − 5\| ≤ 0,25 | 0 divergências em 131 | S3 ✔ |
| C4a — um pulso | 0 / 0 | 0 / 0 | S4 ✔ |
| C4b — trem aleatório, 500 sementes | 0 / ~0,1 por pulso | 0 / 0,092 por pulso (dp 1,28 disparos por trem; máx. 7) | — |
| C2 ÷ C4b (B, por pulso) | ≥ 3 × (esperado ~10 ×) | 0,95 ÷ 0,092 = **10,3 ×** | S5 ✔ |
| C4c — duas Upros | (i) 20 / 20; (ii) 0 / 0 | (i) 20 / 20; (ii) 0 / 0 | S6 ✔ |

**C3, períodos em que B dispara:** 1,60–1,75 ms (17 disparos, k = 3), 2,40–2,60 ms (18, k = 2) e 4,75–5,25 ms (19, k = 1). Nenhum disparo fora dessas faixas.

**C5 — jitter (só medida, 200 sementes):** disparos de B por pulso: dp 0,05 ms → 0,95; 0,1 → 0,88; 0,2 → 0,60; 0,4 → 0,33. A = 0 em todos. Com dp 0,4 ms, B ainda fica cerca de 3,6 × acima do acaso (comparação feita depois, sem critério pré-registrado).

**Conclusão pelo critério pré-registrado:** a regra B passa em S1–S6.

## O que isto mostra e o que não mostra

1. **Mostra:** com a regra B, um único canal, por uma única Upro com dois ramos, fica seletivo à **própria periodicidade**. Isso é uma convergência temporal sem outro canal. A regra A não permite isso em nenhuma condição. B não altera o caso comum de duas Upros diferentes (C4c).
2. **Grau de novidade, com honestidade:** como tudo é determinístico e dado, as previsões de C1–C4 eram dedutíveis da regra. O pré-teste confirma sobretudo que **a regra faz o que dizemos que faz** e que a implementação está correta. As medidas que não eram triviais são a taxa por acaso (0,092, perto da estimativa de ~0,1) e a degradação com jitter.
3. **Propriedade que veio junto, e que é um problema a decidir:** a Uint sintonizada em Δ = 5 ms também dispara com períodos Δ/2 e Δ/3. Para ela, um trem de 2,5 ms e um de 5 ms são parecidos. Isso é próprio de qualquer comparação de um sinal com o seu passado atrasado. Desfazer a ambiguidade exige outras Uint ou outros ramos.
4. **Não mostra:** que o sistema nervoso usa esse mecanismo, nem que ele é necessário. Também não mostra como a Pcrt criaria ramos com a diferença de atraso certa sem calcular o atraso (ponderação 3 da conversa), nem a representação segundo a tríade.
5. **Risco para a Pcrt:** com B, cada Upro passa a poder se relacionar consigo mesma. Isso aumenta o espaço de candidatas, o que pesa sobre a explosão já vista na V0.15 (ponderação 4).

## Desvios

Nenhum desvio do pré-registro na execução de 15/11/2026.

## Errata (16/11/2026)

A regra B foi especificada como "distintas se vêm de emissões diferentes (mesma Upro ou não)" e implementada com a emissão como única chave. Como a emissão era registrada **por pulso da Utrd**, duas Upros diferentes da mesma Utrd, levando o mesmo pulso, contariam como **uma** contribuição em B. Isso contraria a decisão do responsável de 15/11/2026: a origem é a **Upro**, e Upros diferentes da mesma Utrd são origens distintas. Apontado na conversa ao esclarecer o que é ramo.

- **Correção:** em B, a chave passa a ser **Upro + emissão** (distintas se a Upro difere **ou** a emissão difere). Teste novo: duas Upros da mesma Utrd, mesmo pulso, disparam em A e em B (8 de 8 testes passam).
- **Efeito sobre os resultados:** nenhum. Todas as condições usavam uma só Upro por Utrd; a reexecução produziu `resultados.json` idêntico, byte a byte.

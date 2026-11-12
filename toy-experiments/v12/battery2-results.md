# V0.12 — Bateria 2: resultados exploratórios

**12/11/2026.** Plano congelado previamente em [battery2-preregistration.md](battery2-preregistration.md). Execução de 12 combinações (2 geometrias × 3 sementes × 2 fontes) para cada braço, sondando 192 células, 3 limiares e ablações individuais em 190 células internas por condição (A/C/D). O runner em [battery2-runner.mjs](battery2-runner.mjs) reproduz as medidas e emite JSON. **Nenhuma alteração no mecanismo.**

## Resultados
- Distância L1 espacial normalizada (A comparado a C): **média 0,00256084**; intervalo **0,00198901–0,00313267** nas 12 combinações. Isto é ~0,20–0,31% da massa de resposta do controle C; não é efeito constitutivo demonstrado.
- Distância A comparado a D: média **0,00392023**; D comparado a C: média **0,00541848**. A não se distingue de D por superioridade sistemática da distância; a permutação não estabelece um teste decisivo de individuação.
- Geometria original, fonte 0, limiares [1e-6,1e-5,1e-4]: células atingidas A=**[192,192,182]**, C=**[192,192,182]**, D (semente 11)=**[192,192,181]**, B=**[44,42,22]**. A fonte 1 apresentou a mesma contagem nesse arranjo simétrico.
- Ablação de todas as 190 células não fonte: na geometria original, fonte 0, semente 11, maior impacto A: célula 58 (**0,00920626**), depois 65 (**0,00885729**); C: célula 58 (**0,00915025**), depois 65 (**0,00878182**). Médias de impacto A **0,00189539**, C **0,00189502**. Portanto os maiores impactos se explicam em grande parte pela geometria preexistente.
- Os valores de A/C/B são idênticos entre sementes na mesma geometria porque não há aleatoriedade efetiva; apenas D varia. Não interpretar 12 condições como 12 replicações independentes.

## Interpretação adversarial
**Não sustentada:** individualização de Upro. A difusão em malha fixa explica propagação, latência e dependência de ablação; o contraste aprendido é pequeno e não se separa claramente da geometria ou da permutação. A chegada de todas as células com limiares baixos **não** significa existência de percurso individualizado. O braço B é um controle de limitação de transmissão, não um controle pareado de plasticidade.

**Questões abertas:** critérios de individualização podem exigir outra dinâmica ou testes de formação de fronteiras; isso não autoriza mudar mecanismo dentro desta bateria. A ausência de evidência não é demonstração de impossibilidade. Nenhuma Uint ou representação foi investigada ou demonstrada.

## Decisão
Não proclamar Upro na V0.12. Antes da Bateria 3, avaliar se o modelo linear difusivo admite integração emergente ou se os testes de integração seriam necessariamente negativos por construção. Se negativos por construção, registrar limite estrutural em vez de simular uma validação.

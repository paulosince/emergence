# V0.9 — results.md

**Status: executada, com falha de critério arquitetural.** Este documento foi escrito depois da execução; não alterar o pré-registro para fazer os resultados corresponderem à hipótese.

## Pré-registro
[preregistration.md](./preregistration.md). O PDF candidato foi entregue ao usuário na conversa anterior; sua inclusão binária no repositório permanece pendente.

## Implementação executada
Vanilla JavaScript ES modules em [index.html](./index.html) e [src/](./src/). Sdom 10×8×6, duas Utrd, fibras lógicas, marcas com posição/intensidade/raio, Upro candidatas, sem Uint. Sementes: treino 41 e teste 1041. 36 incidências A e B por fase. A avaliação no teste não cria novas Upro; chegada agendada em evento próprio. A auditoria registra alterações e permite exportar CSV.

## Resultados efetivos da execução do núcleo JavaScript
O teste carregou o código-fonte dos módulos do GitHub, removeu apenas sintaxe de import/export para compô-los em ambiente JS isolado e executou até esgotar a fila. Não houve teste automatizado da interface no navegador.

| Cenário | Passos de fila | Upro finais | Uint | Coincidências teste | Chegadas totais | Eventos de trilha |
|---|---:|---:|---:|---:|---:|---:|
| Estável | 285 | 2 | 0 | 36/36 | 141 | 970 |
| Independente | 981 | 15 | 0 | 17/36 | 837 | 3008 |
| Variável | 977 | 16 | 0 | 34/36 | 833 | 3060 |
| Mudança de fase | 387 | 4 | 0 | 31/36 | 243 | 1278 |

## Diagnóstico adversarial e critérios não atendidos
1. **Falha crítica de geometria:** a captura usa idade/raio da marca mas não exige que a frente alcance a posição da Utrd B. A distância entre A=(2,3,2) e B=(8,5,4) é ~6,63 unidades, enquanto o raio máximo da marca é 0,48. As capturas observadas seriam impossíveis por contato espacial nesse meio. Logo, o Sdom continua parcialmente decorativo.
2. **Propagação não é percurso físico:** a Upro agenda uma chegada em t+length/speed sem simular frente ao longo de uma estrutura conectando A a B. O ponto desenhado e a linha verde não demonstram condução.
3. **Coincidência não é capacidade preditiva robusta:** a métrica aceita qualquer chegada dentre todas as Upro e portanto favorece cenários com muitas candidatas; no independente há 17/36 coincidências.
4. **Consolidação incompleta:** a confiança ainda cresce com capturas durante o treino, não com sucesso ou fracasso funcional; nenhuma contradição diminui confiança.
5. **Uint não constituída:** zero em todos os cenários; não declarar representação.
6. **Auditoria incompleta:** há trilhas exportáveis, mas não replay independente demonstrado e a geração de estímulos não registra cada sorteio.
7. **Prévia versus observado:** a interface conserva o Sdom sem cubo, Utrd e Upro visíveis, mas ainda desenha conexões que não são percursos físicos reais.

## Conclusão
A separação de treino/teste e o escalonamento de chegadas como eventos próprios funcionaram nesta execução. A hipótese principal da V0.9 — geometria causalmente operacional — **não foi testada de maneira válida**. A experiência é registrada como falha parcial, sem ajustes retrospectivos dos critérios. Próxima correção: garantir encontro espacial, estrutura de propagação percorrível e contraste com controle nulo.

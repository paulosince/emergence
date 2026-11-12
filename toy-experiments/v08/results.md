# V0.8 — execução auditada do núcleo JS

## Hipótese e registro
Ver [preregistration.md](./preregistration.md). A interface foi aberta pelo usuário no iPhone, com captura do cenário associado mostrando 2 Upro, 0 Uint e 591 eventos na versão inicial. Posteriormente as arestas do cubo foram ocultadas, sem alterar limites físicos. Foi acrescentada auditoria de recepção por Utrd B.

## Resultados executados após a atualização (2026-11-12)
O núcleo ES modules foi carregado do GitHub e executado em ambiente JavaScript isolado, removendo apenas declarações de import/export para compor os módulos no teste. **Não foi uma execução de navegador automatizada**.

| Cenário | Passos | Upro finais | Uint | Inspeções em B | Inspeções com >=1 chegada coincidente | Chegadas processadas | Eventos totais |
|---|---:|---:|---:|---:|---:|---:|---:|
| Associação estável | 72 | 2 | 0 | 36 | 32 | 69 | 627 |
| Independente | 72 | 15 | 0 | 36 | 19 | 294 | 1263 |
| Atraso variável | 72 | 16 | 0 | 36 | 34 | 257 | 1196 |
| Mudança de fase | 72 | 4 | 0 | 36 | 27 | 99 | 729 |

## Diagnóstico adversarial
**Não interpretar essas correspondências como acurácia de representação.** A métrica marca correspondência se qualquer chegada de qualquer candidata estiver dentro de 45 ms da incidência B; isso favorece cenários com muitas Upro, particularmente o variável (16) e o independente (15). A Pcrt cria candidatas em resposta às próprias incidências B; portanto, parte da avaliação não é prospectiva independente. As chegadas são agendadas com atraso, mas processadas na próxima incidência da simulação, não em um relógio de eventos contínuo. A confirmação ainda não retroalimenta confiança de forma adequada. Não existe Uint constituída. As fibras ainda são agrupamentos lógicos e as marcas não são volumes de propagação reais. A trilha não é event sourcing completo.

## Próximos critérios
Separar treino de teste, processar chegadas em tempo simulado correto, definir critério de recepção prospectivo e comparação com controle nulo, não reforçar por coincidência retrospectiva, constituir Uint apenas mediante mecanismo operacional explícito e testável.

# V0.15 — Desvios e registros de implementação

Registro de tudo o que a implementação fez de diferente ou de mais específico que a [especificação congelada](experiment-spec.md). Nenhum item altera o texto congelado.

| # | Data | Item | O que foi feito | Por quê | Efeito sobre a inferência |
|---|---|---|---|---|---|
| 1 | 13/11/2026 | Calibração (D16) | θ0 = 0,2 × média dos picos de resposta de cada ressonador a um tom nominal na sua frequência central; θ1 = θ0·√10; θ2 = 10·θ0. Valores em `calibration.json` | A especificação fixava as condições (nominal passa θ0 e θ1, não θ2; A+ passa θ2), não a fórmula | Nenhum; todas as verificações de `calibration.json` passaram |
| 2 | 13/11/2026 | Ruído de fundo | Valor eficaz 40 dB abaixo do valor eficaz de um componente nominal (0,00707). O pico do ruído filtrado fica entre 0,002 e 0,007, muito abaixo de θ0 = 0,2 | Interpretação de "40 dB abaixo do nível nominal" | O ruído sozinho não gera incidências (K8b: zero emissões). A variação entre apresentações vem principalmente das fases sorteadas |
| 3 | 13/11/2026 | Estímulo R (K9) | Ruído branco com o mesmo valor eficaz total de A | A especificação não fixava o nível de R | Só afeta a condição exploratória K9 |
| 4 | 13/11/2026 | Registros brutos | Emissões e entregas individuais não são gravadas por padrão (milhões por execução); gravam-se contagens, constituições com trilha, disparos, remoções e intervenções. O nível de registro 2 grava emissões | Volume de dados | A trilha de cada constituição continua completa até as incidências (id, instante e amostra) |
| 5 | 13/11/2026 | Auditoria antes da execução | As execuções diagnósticas de `results-diagnostic.md` foram feitas **antes** de concluída a auditoria formal (seção 9). Os testes automáticos foram escritos e passaram logo depois (9 de 9) | Ordem de trabalho | As execuções são **diagnósticas**, não a campanha. A campanha formal não foi executada |

# Toy experiments — EMERGENCE

Registro auditável dos experimentos exploratórios de constituição diferida. **Não alterar resultados históricos para melhorar conclusões.** Os arquivos originais Python, CSV e HTML estão preservados em cada versão.

| Versão | Questão testada | Registro |
|---|---|---|
| [V0.1](./v01/results.md) | Marcas temporais e limiar absoluto | Falsos positivos |
| [V0.2](./v02/results.md) | Controles temporais e generalização | Redução de falsos positivos, falhas de fase |
| [V0.3](./v03/results.md) | Propagação experimental e atrasos discretos | Ambiguidade de atrasos |
| [V0.4](./v04/results.md) | Exuberância, confiança, estabilidade e poda | Seleção parcial; erro admissível |
| [V0.5](./v05/results.md) | Atrasos calculados das marcas | Cálculo explícito permanece |
| [V0.6](./v06/results.md) | Captura de frentes físicas simuladas | Mecanismo alternativo; não demonstra necessidade |
| [V0.7](./v07/results.md) | Marcas locais versus frentes propagantes | Comparação assimétrica; atraso funcional só no mecanismo de frente |

## Regras de auditoria

1. Cada versão tem `results.md` com hipótese prévia, heurística aplicada, dados observados e conclusões científicas delimitadas.
2. Distinguir detecção de regularidades, constituição estrutural, propagação funcional e representação conforme a tríade CLEAR.
3. Preservar casos adversariais, sementes, parâmetros, código, saídas e falhas; nunca substituir dados históricos silenciosamente.
4. A pasta contém registros retrospectivos dos experimentos já executados, **não pré-registros**.
5. TEMPO original permanece intocado. Estes toys não substituem a implementação EMERGENCE.
6. Para novas versões: publicar hipótese e critérios antes de executar; depois registrar resultados efetivos e testes adversariais.

## Aprendizados e situação atual

- [Síntese V0.1–V0.11](LEARNINGS.md).
- [V0.11, resultados complementares E1–E6](v11/supplementary-results.md).
- [V0.12, etapa I: diagnóstico e hipóteses iniciais](v12/pre-experiment-stage1.md).

## Ciclo obrigatório a partir da V0.12

1. **Pré-experimento:** erros anteriores; hipóteses corretivas; hipóteses científicas; método completo (investigação NB, reconstrução causal, mínimos, abstração agnóstica, deduções e bibliografia); hipóteses de trabalho e previsão de alcance. PDF congelado antes de implementar.
2. **Experimento:** implementação, execução, controles e desvios registrados.
3. **Resultados:** medidas, testes adversariais, confronto com previsões, limitações e conclusão.

O diagnóstico inicial não substitui o PDF completo nem autoriza implementação. [Método normativo](../docs/program-methodology.md).

## Situação documental V0.12–V0.14 (auditoria de 13/11/2026)

| Versão | Evidência localizada na branch padrão | Estatuto verificável |
|---|---|---|
| V0.12 | `v12/pre-experiment-stage1.md` | Diagnóstico inicial; não é pré-registro congelado nem resultado experimental. |
| V0.13 | `v13/pre-experiment-stage1.md`, `independent-constitutive-analysis.md`, `factory-contract-and-decision-gates.md`, `architecture-comparison-independent.md`, `operational-mechanism-candidates.md` | Fontes conceituais presentes. A consolidação candidata exige fechamento de D1–D4 e congelamento D5 antes de declarar campanha prospectiva. A presença de implementação e resultados completos não foi comprovada nesta auditoria. |
| V0.14 | Não foram localizados `v14/pre-experiment-stage1.md` nem `v14/results.md` nos caminhos convencionais. | Conclusão e integralidade documental não verificadas. Não interpretar 404 desses caminhos como prova de ausência em todo o histórico ou em outras branches. |

**Escopo da auditoria:** consultas pontuais à API GitHub, sem listagem recursiva da árvore, sem execução de testes, sem validação empírica. Não substituir arquivos históricos ou atribuir resultados inexistentes. Ver `AUDIT-V13-V14-2026-11-13.md`.


### Retificação de integridade (13/11/2026)

A auditoria inicial de V0.13–V0.14 não identificou arquivos já publicados. Foram confirmados os arquivos instrumentais em `v13/instrumental-v0.13.0/`, os exploratórios em `v13/experimental-v0.13.1/` (inclusive o README com resultados) e os estudos diagnósticos em `v14/`. Consulte [a retificação da auditoria](AUDIT-V13-V14-2026-11-13.md#retificação-verificável-posterior--13112026). A presença dos artefatos **não** transforma ensaios exploratórios em validação confirmatória. ZIPs originais e reexecução independente permanecem não verificados.

## V0.15 — som (13/11/2026)

Pré-experimento e especificação **candidatos, não congelados, não executados**: [pré-experimento](v15/pre-experiment.md) e [especificação](v15/experiment-spec.md), com PDFs na mesma pasta. Testa a constituição a partir de vazio e o reacesso por propagação, sem índice (lacuna da primeira ponte deixada pela V0.14). As decisões D1–D18 foram tomadas pelo responsável em 13/11/2026; falta o congelamento. A visão fica para a V0.16.

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

## Próxima comparação

V0.8: comparação simétrica de mecanismos capazes de determinar atrasos funcionais, seguida da investigação da primeira Uint constituída e dos requisitos operacionais de representação.

# V0.7 — Marcas locais versus frentes propagantes

## Hipóteses prévias e pré-registro
Ver [preregistration.md](./preregistration.md), criado **antes da execução**. H-local: marcas residuais podem sustentar constituição sem frente espacial. H-frente: captura de frente produz comprimento/atraso. H-nula: ambos podem falhar fora do treino.

## Heurística efetivamente aplicada
- Mesmas incidências em ambos os mecanismos; 36 eventos por fibra; 7 ciclos de treino; sementes 41–47; teste separado com semente 1041.
- **Local:** marca exponencial com tau=0,32 s; incidência B captura resíduo acima de 0,20. Por decisão experimental, conexões locais recebem atraso operacional **zero**, não extraído do estado residual.
- **Frente:** deslocamento a velocidade 1 unidade/s, extensão máxima 0,48; captura da posição por B; quantização espacial 0,02; comprimento capturado define atraso.
- Ambas: candidatos exuberantes; confiança inicial 0,12, estabilidade inicial 0,12; C=c*s; reforço para evidência >0,3; decaimento da estabilidade por fator 0,58 quando não sustentada; poda para C<0,004 após primeiro ciclo. Não há decaimento automático de confiança por inatividade.
- Teste posterior: fração dos eventos A cujas chegadas previstas encontram B em tolerância de 45 ms. É **métrica externa**, não integração por Uint autônoma.
- Código: [toy_constituicao_v07.py](./toy_constituicao_v07.py); dados completos: [toy_resultados_v07.csv](./toy_resultados_v07.csv).

## Resultados efetivamente executados (ciclo 7)

| Sinais | Mecanismo | Upro sobreviventes | Atraso mais consolidado (s) | Maior C | Acerto posterior |
|---|---|---:|---:|---:|---:|
| Associação estável | Local | 1 | 0,00 | 0,84074 | 0% |
| Associação estável | Frente | 2 | 0,22 | 0,94222 | 100% |
| Independentes | Local | 1 | 0,00 | 0,49532 | 13,89% |
| Independentes | Frente | 10 | 0,32 | 0,00835 | 5,56% |
| Atraso variável | Local | 1 | 0,00 | 0,76512 | 0% |
| Atraso variável | Frente | 15 | 0,12 | 0,00835 | 27,78% |
| Mudança de fase | Local | 1 | 0,00 | 0,57027 | 0% |
| Mudança de fase | Frente | 4 | 0,22 | 0,13445 | 50% |

## Conclusões científicas delimitadas
1. **Nesta implementação**, a frente produz um atraso útil de 220 ms para sinais estáveis com atraso físico de aproximadamente 213 ms. A marca local captura associações, mas não produz atraso funcional porque a própria implementação fixa sua saída em zero.
2. **Não é uma demonstração de necessidade de propagação espacial.** A comparação é assimétrica: a arquitetura local não recebeu um mecanismo alternativo de conversão de estado residual em atraso. A diferença de desempenho é em parte consequência do desenho experimental.
3. Marcas locais podem consolidar fortemente relações independentes ou variáveis: C elevado não garante acerto posterior. A versão de frentes também mantém candidatas frágeis e apresenta erro com mudança de fase.
4. O mecanismo de captura e a estrutura do meio continuam predefinidos. Não foi constituída uma primeira Uint; não se demonstrou representação autônoma segundo a tríade CLEAR.

## Refutações e próximo experimento
A próxima comparação deve fornecer **capacidade de atraso funcional a ambos os mecanismos**, sem pré-selecionar o atraso correto; caso contrário, a comparação é enviesada. Em paralelo, investigar a primeira Uint constituída e o teste operacional de organização especificadora, fundamentação transdutiva e determinação autônoma, sem confundir codificação de timestamps com representação.

## Integridade
Relatório escrito após a execução; pré-registro separado, preservado. Dados negativos e parâmetros incluídos. Código não contém mecanismos neurobiológicos demonstrados; trata-se de um toy computacional.

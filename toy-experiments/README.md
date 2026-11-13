# Toy experiments — EMERGENCE

Registro auditável dos experimentos exploratórios sobre a constituição inicial de Upro e Uint. **Reorganizado em 13/11/2026**; os registros de cada versão foram preservados sem alteração, e este índice apenas os ordena.

**Estatuto (regras de 11/11/2026):** toy models são instrumentos **subsidiários e ocasionais**, usados só quando uma dúvida específica não pode ser resolvida com confiança por raciocínio e literatura. Não ditam a arquitetura do EMERGENCE e não validam a CLEAR. Ver [regras científicas e continuidade](../docs/regras-cientificas-e-continuidade-2026-11-11.md), seções 1 e 6.

## Por onde começar

1. [Síntese dos aprendizados V0.1–V0.14](LEARNINGS.md): o que cada fase ensinou e o que continua aberto.
2. [Registro consolidado da V0.13 e da V0.14](v13/README.md): a fase atual, em ordem lógica.
3. [Revisão de 13/11/2026](revisao-2026-11-13.md): quatro ponderações e uma proposta de delimitação da autonomia representacional. **Proposta do assistente, não aprovada.**
4. Para qualquer versão: abrir os documentos na ordem indicada na tabela abaixo.

## Índice completo

**Estatuto do registro:** *retrospectivo* = interpretação escrita depois da execução, sem pré-registro; *pré-registrado* = hipótese e critérios gravados antes de executar; *exploratório* = execução com desvios declarados que impedem tratá-la como confirmação; *estudo* = análise sem execução científica.

| Versão | Pergunta | Resultado principal | Limite decisivo | Estatuto | Documentos, em ordem de leitura |
|---|---|---|---|---|---|
| V0.1 | Coincidência temporal acumulada acima de limiar absoluto inicia constituição? | Também o cenário independente "constitui" | Indicador booleano não é Upro | retrospectivo | [resultados](v01/results.md) · [código](v01/toy_constituicao.py) · [dados](v01/toy_resultados.csv) |
| V0.2 | Controles por permutação reduzem falsos positivos? | Reduzem; periodicidade independente ainda cria candidato | Estatística externa não é mecanismo | retrospectivo | [resultados](v02/results.md) · [código](v02/toy_constituicao_v02.py) · [dados](v02/toy_resultados_v02.csv) |
| V0.3 | Canais de atraso com competição formam Upro? | Conexões para casos relacionados; periodicidade gera atrasos equivalentes | Uint receptora predefinida | retrospectivo | [resultados](v03/results.md) · [código](v03/toy_constituicao_v03.py) · [dados](v03/toy_resultados_v03.csv) |
| V0.4 | Criar candidatos em excesso e podar por confiança e estabilidade funciona? | Associações consolidam; independentes ficam frágeis ou são podadas | Confiança, estabilidade e poda heurísticas | retrospectivo | [resultados](v04/results.md) · [código](v04/toy_constituicao_v04.py) · [dados](v04/toy_resultados_v04.csv) · interfaces [v0.4](v04/toy_constituicao_v04.html), [v0.4.1](v04/toy_constituicao_v041.html) |
| V0.5 | Atrasos podem vir das marcas temporais, sem tabela prévia? | Sim; mudança de fase consolida relações que falham depois | Diferença entre instantes calculada explicitamente | retrospectivo | [resultados](v05/results.md) · [código](v05/toy_constituicao_v05.py) · [dados](v05/toy_resultados_v05.csv) |
| V0.6 | Frentes simuladas determinam atraso por captura? | Comprimento e atraso emergem da captura | Meio e regra de captura predefinidos | retrospectivo | [resultados](v06/results.md) · [código](v06/toy_constituicao_v06.py) · [dados](v06/toy_resultados_v06.csv) |
| V0.7 | Marcas locais bastam, ou é preciso frente propagante? | Frente: 220 ms e 100% de acerto no cenário estável; marca local: 0% | Comparação assimétrica: atraso local fixado em zero | pré-registrado | [pré-registro](v07/preregistration.md) · [resultados](v07/results.md) · [código](v07/toy_constituicao_v07.py) · [dados](v07/toy_resultados_v07.csv) |
| V0.8 | Marcas situadas no espaço e frentes, com trilha auditável (JavaScript) | 2 a 16 Upro conforme o cenário; 0 Uint | Métrica favorece cenários com muitas candidatas; avaliação não prospectiva | pré-registrado | [pré-registro](v08/preregistration.md) · [README](v08/README.md) · [resultados](v08/results.md) · [interface](v08/index.html) · [código](v08/src/) |
| V0.9 | Geometria causalmente operacional, com treino e teste separados | Treino/teste e chegadas agendadas funcionaram | Capturas espacialmente impossíveis (distância ≈ 6,63 contra raio 0,48); hipótese principal não testada validamente | pré-registrado | [pré-registro](v09/preregistration.md) · [README](v09/README.md) · [resultados](v09/results.md) · [interface](v09/index.html) · [código](v09/src/) |
| V0.10 | Marcas persistentes diferenciam uma organização integradora? | 60 células acima do limiar no cenário associado | Seletividade conjunta codificada por `min(a,b)` e traços rotulados por fonte | pré-registrado | [pré-registro](v10/preregistration.md) · [README](v10/README.md) · [resultados](v10/results.md) · [interface](v10/index.html) · [código](v10/src/) |
| V0.11 | Sem detector de coincidência, surge organização integradora? | Memória concentrada nas fontes; propagação aditiva; condutâncias operam | Sem organização coletiva, Uint ou Upro | pré-registrado (rodada complementar com delimitação aprovada antes) | [pré-registro](v11/preregistration.md) · [README](v11/README.md) · [resultados](v11/results.md) · [diagnóstico](v11/diagnostic.md) · [rodada complementar](v11/supplementary-results.md) · [interface](v11/index.html) · [código](v11/src/) |
| V0.12 | Malha local com plasticidade individualiza percursos? | Transmissão, plasticidade e diferenciação espacial pequena (0,256% entre plástico e fixo) | Topologia fixa; nenhuma Upro ou Uint individualizada | exploratório (pré-registro incompleto antes da primeira execução) | [pré-experimento](v12/pre-experiment-stage1.md) · [adendo operacional](v12/experiment-protocol-addendum.md) · [execução](v12/experiment-run.md) · [pré-registro bateria 1](v12/battery1-preregistration.md) · [resultados bateria 1](v12/battery1-results.md) · [roteiro bateria 1](v12/battery1-runner.mjs) · [pré-registro bateria 2](v12/battery2-preregistration.md) · [resultados bateria 2](v12/battery2-results.md) · [roteiro bateria 2](v12/battery2-runner.mjs) · [encerramento](v12/final-results-stage3.md) · [código](v12/src/model.js) |
| V0.13 | Com factories de Uint e Upro prontas, como o sistema decide quando e como usá-las? | Diretriz das factories; regra contra soluções programadas | Protótipo reacessava a Uint por consulta a um mapa (lookup); nenhum experimento científico executado | estudo + protótipo instrumental | ver [registro consolidado](v13/README.md) |
| V0.14 | Como uma incidência alcança uma organização já constituída sem lookup? | Achado do lookup confirmado por inspeção; hipóteses concorrentes | Nenhuma solução implementada | estudo | ver [registro consolidado](v13/README.md) |

Os números da tabela foram copiados dos registros de cada versão, sem recálculo. A confiança neles é a dos próprios registros.

## Fases

1. **Detectores temporais, em Python (V0.1–V0.7).** Lição: identificar uma regularidade não é constituir uma relação, e consolidar não é validar.
2. **Meio espacial, em JavaScript (V0.8–V0.11).** Lição: geometria desenhada não é contato físico, e diferenciar regiões não é integrar.
3. **Malha local com plasticidade (V0.12).** Lição: alterar condutâncias numa topologia fixa não individualiza percursos.
4. **Factories e reacesso (V0.13–V0.14).** Mudança de pergunta: deixar de exigir que as unidades surjam do nada e investigar como o sistema decide usar factories dadas. Lição até agora: um mapa auxiliar pode fazer escondido o trabalho que se queria atribuir à malha.

## Defeitos conhecidos nos registros (não corrigidos nos originais)

Registrados aqui para não alterar a história. Corrigir somente com decisão do responsável e em arquivo novo.

- **Cabeçalho corrompido nos CSV de V0.1, V0.2, V0.3, V0.5 e V0.6:** as duas primeiras linhas são resto de uma extração (`<PARSED TEXT FOR SHEET…>`). Por isso a seção "Resultados registrados" desses `results.md` mostra "unidentified". Os dados abaixo do cabeçalho parecem íntegros. Conferir antes de usar.
- **Resumo enganoso na V0.4:** a seção "Resultados registrados" mostra, para os três cenários, uma candidata fraca (atraso 0,4 s, C = 0,0288). O CSV mostra que, no cenário associado, as candidatas de 0,2 s e −0,2 s chegaram a C = 1 com 240 confirmações. A conclusão escrita está correta; a amostra numérica não a representa.
- **PDFs de pré-experimento fora do repositório:** V0.9, V0.10, V0.11 e V0.12 citam PDFs entregues na conversa e nunca incluídos.
- **Código da V0.13:** incluído em 13/11/2026 (`v13/instrumental-v0.13.0` e `v13/experimental-v0.13.1`); o achado do lookup foi confirmado contra ele ([verificação](v13/README.md#4b-verificação-contra-o-código-13112026)). O pacote do diagnóstico da V0.14 continua fora.
- **Interfaces V0.8–V0.11 não testadas em navegador:** os núcleos rodaram em ambiente JavaScript isolado.
- **Correspondência a confirmar:** as regras de 11/11 citam "toy models V1–V4" sobre confiança, estabilidade, marca e captura seletiva. Não está claro se são as V0.1–V0.4 desta pasta ou outra série.

## Regras de auditoria

1. Cada versão tem registros com hipótese prévia, mecanismo efetivamente aplicado, dados observados e conclusões delimitadas.
2. Distinguir detecção de regularidades, constituição estrutural, propagação funcional e representação conforme a tríade CLEAR.
3. Preservar casos adversariais, sementes, parâmetros, código, saídas e falhas; nunca substituir dados históricos silenciosamente.
4. Os registros de V0.1 a V0.6 são **retrospectivos**. A partir da V0.7 há pré-registros, com os desvios declarados em cada versão.
5. TEMPO permanece intocado. Estes toys não substituem a implementação do EMERGENCE.
6. Nenhuma programação pode fornecer antecipadamente o resultado que o experimento investiga ([regra vinculante de 12/11/2026](../docs/program-methodology.md#regra-vinculante-de-não-substituição-do-fenômeno-por-programação-12112026)).

## Ciclo obrigatório a partir da V0.12

1. **Pré-experimento:** erros anteriores; hipóteses corretivas; hipóteses científicas; método completo (investigação NB, reconstrução causal, mínimos, abstração agnóstica, deduções e bibliografia); hipóteses de trabalho e previsão de alcance. PDF congelado antes de implementar.
2. **Experimento:** implementação, execução, controles e desvios registrados.
3. **Resultados:** medidas, testes adversariais, confronto com previsões, limitações e conclusão.

O diagnóstico inicial não substitui o PDF completo nem autoriza implementação. [Método normativo](../docs/program-methodology.md).

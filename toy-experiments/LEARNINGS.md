# EMERGENCE — Aprendizados experimentais V0.1–V0.14

> Síntese retrospectiva dos registros em `toy-experiments/v01` a `v14`, ampliada em 13/11/2026 (a versão anterior cobria até a V0.11; seu conteúdo foi mantido). Resultados são específicos dos mecanismos testados. **Nenhuma versão demonstrou representação autônoma, nem Uint ou Upro constituída autonomamente.** As interpretações de V0.1 a V0.6 foram consolidadas retrospectivamente, não pré-registradas.

| Versão | Aprendizado principal | Limite decisivo |
|---|---|---|
| **V0.1** | Coincidências fortuitas também superam limiar absoluto. | Indicador booleano não é Upro funcional. |
| **V0.2** | Controles por permutação e teste posterior reduzem falsos positivos. | Discriminação estatística externa não constitui relações. |
| **V0.3** | Canais de atraso produzem conexões candidatas; periodicidade causa ambiguidade de atraso (*aliasing*). | Uint receptora predefinida. |
| **V0.4** | Candidatas podem consolidar ou ser podadas; consolidação não garante correção. | Confiança, estabilidade e poda heurísticas. |
| **V0.5** | Atrasos candidatos podem ser derivados das marcas temporais. | Diferenças entre instantes calculadas explicitamente. |
| **V0.6** | Frentes simuladas permitem obter comprimento e atraso por captura. | Meio e regra de captura predefinidos. |
| **V0.7** | Frente: 220 ms e 100% de acerto no cenário estável; marca local: 0%. | Comparação assimétrica: atraso local fixado em zero; não demonstra necessidade da frente. |
| **V0.8** | Recepção e chegadas auditáveis; muitas candidatas aumentam coincidências. | Avaliação não prospectiva; 0 Uint. |
| **V0.9** | Treino e teste separados, chegadas agendadas; geometria desenhada não garante contato físico. | Captura espacialmente impossível; trajetórias não percorridas. |
| **V0.10** | Plasticidade espacial diferencia regiões (60 acima do limiar no cenário associado). | Seletividade conjunta codificada por `min(a,b)` e traços por fonte. |
| **V0.11** | Condutâncias adaptativas `g` modificam a propagação posterior. | Sem organização coletiva, Uint ou Upro demonstradas. |
| **V0.12** | Transmissão local, retroação da atividade sobre `g`, diferenciação espacial pequena. | Topologia fixa; alterar condutâncias não individualiza percursos. |
| **V0.13** | Mudança de pergunta: factories de Uint e Upro são infraestrutura dada; investiga-se como o sistema decide usá-las. | Protótipo com Uint e Upro semeadas e, depois, reacesso por consulta a um mapa (lookup). |
| **V0.14** | Auditoria: o lookup explica integralmente o "reacesso" observado. | Nenhum mecanismo alternativo implementado. |

## Síntese por fase

- **V0.1–V0.3 — Identificar não é constituir:** encontrar associações e atrasos não demonstra relações autonomamente constituídas.
- **V0.4–V0.7 — Consolidar não é validar:** estabilidade e reforço não garantem acerto; comparações exigem capacidades equivalentes.
- **V0.8–V0.10 — Simular não é demonstrar:** geometria, recepção e coincidência podem depender de funções pré-programadas.
- **V0.11–V0.12 — Diferenciar não é integrar:** alterações estruturais afetam a propagação, mas não demonstram organização relacional autônoma.
- **V0.13–V0.14 — Fabricar não é constituir, e reutilizar não é reacessar:** dispor de factories é legítimo; o que importa é quem decide as instâncias e por onde a organização volta a operar.

## V0.11: evidência quantitativa complementar

- **Diferenciação:** 12 de 1.512 arestas fortalecidas e 1.500 enfraquecidas em relação a `g=0,045`.
- **Efeito funcional:** a resposta à incidência A+B difere **1,34%** em norma L2 relativa entre meio aprendido e condutâncias restauradas.
- **Intervenções:** restaurar conexões selecionadas altera a resposta, evidenciando participação operacional das condutâncias.
- **Dependência coletiva:** não demonstrada; resíduo de interação de duas arestas ≈ `1,37×10⁻¹⁰`, sem excluir outros tipos de organização distribuída.
- **Persistência:** condutâncias continuam decaindo durante 280 ciclos sem novas incidências; estabilidade não demonstrada.
- **Mudança de fontes:** diferença estrutural detectável frente ao controle, sem demonstrar adaptação funcional adequada.

**Classificação:** diferenciação e efeito funcional sustentados; dependência coletiva não demonstrada; persistência parcial ou indeterminada. Uma semente, uma geometria e um horizonte temporal; sem generalização estatística. A memória celular `m` não retroage sobre a propagação, mas `g` retroage; não confundir as duas.

## V0.12: o que a malha local mostrou

- **Rodada inicial (24 corridas):** malha plástica e malha fixa chegam ao alvo no mesmo tempo (17 e 8 passos nas duas geometrias), com respostas próximas. A malha que parte de `g` muito baixo não chega ao alvo em 72 passos.
- **Bateria corretiva 1:** `g` muito baixo não é estado absorvente absoluto (com pulso de amplitude 10, 66 arestas acima do valor inicial ao fim do treino), mas continua sem chegar ao alvo. O repouso com plasticidade ligada enfraquece `g`.
- **Bateria 2:** distância espacial média entre malha plástica e fixa de 0,256%; a célula de maior impacto por ablação é a mesma nas duas. A geometria fixa explica parte substancial dos efeitos.
- **Desvio decisivo:** o pré-registro não estava completo antes da primeira execução; tudo é exploratório. Sementes repetidas não foram replicações independentes nos braços determinísticos.

Fonte: [encerramento da V0.12](v12/final-results-stage3.md).

## V0.13–V0.14: o que a fase atual estabeleceu

- **Diretriz das factories (decisão do responsável, 12/11/2026):** factories de Uint e Upro, com suas propriedades operacionais, são infraestrutura dada. Investiga-se a determinação autônoma de se, quando, com quais parâmetros e com quais ligações usá-las, e, separadamente, a constituição de representação. Essa diretriz supera a exigência implícita, de V0.8 a V0.12, de que as unidades surgissem de um meio sem capacidades integradoras.
- **Regra contra soluções programadas (decisão do responsável, 12/11/2026):** a programação pode fornecer condições de possibilidade, não o resultado investigado. Quem implementa deve encontrar o atalho antes de executar.
- **Achado da auditoria (inspeção de código, não reproduzível hoje porque o código não está no repositório):** a Uint "reacessada" era recuperada por consulta a um mapa indexado por canal e intervalo; o limiar da Uint não governava a ativação; a intensidade transduzida não participava de nada.
- **Nenhum experimento científico da V0.13 ou da V0.14 foi executado.** Há um protótipo instrumental e um diagnóstico A → B → A sem Upro entre as fases.

Detalhes e ordem lógica: [registro consolidado](v13/README.md).

## Questões científicas abertas

1. Que condições permitem passar de diferenciação local para organização relacional distribuída?
2. Como identificar percursos com trajetórias e tempos efetivos sem programar previamente Upro?
3. Uint precede Upro, Upro precede Uint ou ambas se constituem conjuntamente? **Não discriminado.**
4. Quais condições operacionais adicionais seriam necessárias para satisfazer a tríade representacional, sem confundir codificação, funcionamento e representação?
5. Que operações do Pcrt decidem a primeira chamada às factories a partir das incidências das Utrd, e quais parâmetros elas podem calcular legitimamente (por exemplo, o atraso de uma Upro a partir do intervalo entre emissões)? **Aberta; decisão do responsável.**
6. ~~Uma Upro pode partir de uma Utrd?~~ **Esclarecido pelo responsável em 13/11/2026:** a Upro parte necessariamente da Utrd; no Sdom, unidades se conectam por Upro, e não há Utrd ligada diretamente a uma Uint. O contrato da factory da V0.13, que só aceitava Uint nas pontas, contrariava a teoria.
7. Pode haver Upro sem Uint na constituição inicial, e Uint com uma só aferente? Ambas eram tratadas como regras e foram reclassificadas como **hipóteses em teste** pelo responsável em 13/11/2026; Upro sem Uint é o teste pretendido agora.
8. Como uma incidência atual alcança a organização constituída antes, sem consulta a mapa? Ver as alternativas da V0.14 e a [revisão de 13/11/2026](revisao-2026-11-13.md).

**Conclusão:** o programa avançou de detectores temporais e heurísticas para um meio com memória estrutural operacional e, na V0.13, para uma formulação mais precisa do problema. Ainda não há demonstração de constituição autônoma de Uint, Upro ou representação.

## Fontes internas

- Relatórios individuais: `toy-experiments/v01/results.md` a `toy-experiments/v11/results.md`; V0.12 em `v12/final-results-stage3.md`; V0.13–V0.14 em `v13/README.md`.
- V0.11, diagnóstico: `toy-experiments/v11/diagnostic.md`; ensaios complementares: `toy-experiments/v11/supplementary-results.md`.
- Pré-registros disponíveis nas pastas de cada versão; não inferir pré-registro das versões V0.1–V0.6.
- Defeitos conhecidos dos registros: [índice da pasta](README.md#defeitos-conhecidos-nos-registros-não-corrigidos-nos-originais).

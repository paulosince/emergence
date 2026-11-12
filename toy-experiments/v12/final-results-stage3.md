# EMERGENCE V0.12 — Etapa III: consolidação e encerramento científico

**Data:** 12/11/2026. **Status:** versão experimental V0.12 encerrada para novas alterações constitutivas; **resultado exploratório, não confirmação integralmente pré-registrada**. A V0.13 depende de novo pré-experimento. O repositório TEMPO permanece intocado.

## 1. Escopo e cadeia de evidência

Fontes: [pré-experimento inicial](pre-experiment-stage1.md), PDF candidato `EMERGENCE_V012_Pre_Experimento.pdf` (disponibilizado na conversa, não registrado aqui como PDF congelado), [adendo operacional](experiment-protocol-addendum.md), [código](src/model.js), [execução inicial](experiment-run.md), [pré-registro B1](battery1-preregistration.md), [runner B1](battery1-runner.mjs), [resultados B1](battery1-results.md), [pré-registro B2](battery2-preregistration.md), [runner B2](battery2-runner.mjs), [resultados B2](battery2-results.md).

**Desvio metodológico decisivo:** o PDF era candidato e não congelou todos os parâmetros, braços, critérios e horizontes antes da primeira execução. O adendo operacional foi salvo antes da primeira rodada; as baterias corretivas foram registradas antes de suas respectivas execuções. Portanto, todos os resultados da V0.12 permanecem **exploratórios**, ainda que rastreáveis. Não corrigir retroativamente o PDF.

**Reprodutibilidade:** scripts B1 e B2 foram publicados posteriormente às respectivas execuções; sua disponibilidade permite repetição, mas não converte o desenho original em confirmação pré-registrada. Os relatórios contêm agregados e amostras, não arquivo imutável de todos os dados brutos. Executar os scripts e preservar suas saídas integrais é uma pendência de arquivamento, não motivo para alterar conclusões.

## 2. Implementação efetivamente testada

Malha 8×6×4 (192 células), adjacências ortogonais preexistentes, estado local escalar `v`, transmissão por diferenças locais de estado com condutância `g`, dissipação por passo. Braços A: `g0=.06`, plástico; B: `g0=.001`, plástico nas mesmas adjacências potenciais; C: `g0=.06`, fixo; D: A com permutação espacial das condutâncias ao final. Treinamento 480 ticks, repouso 120, sonda 72 sem plasticidade. Não se criam novas adjacências, nem objetos Uint/Upro, nem destino/identidade de percurso no motor.

O braço B **não** representa criação topológica autônoma. A comparação A×B está confundida pelo estado inicial diferente. A, B e C não usam sementes como aleatoriedade efetiva; somente D usa a semente na permutação.

## 3. Resultados observados

### Rodada inicial
24 corridas (3 sementes × 2 geometrias × 4 braços, com redundância determinística). A e C: chegada ao alvo em 17 e 8 ticks, respectivamente nas duas geometrias; respostas próximas (A ~0,000152512/0,000275380; C ~0,000154391/0,000276637). B: não atingiu limiar 1e-5 no alvo em 72 ticks; condutância média no piso ~.001. Ablação intermediária altera resposta, mas não demonstra individualização.

### Bateria corretiva 1
Varredura g0 [.001,.005,.02,.06] × amplitude [1,3,10] com controle pareado sem plasticidade. Com g0=.001 e amplitude 10, g média final ~.001927769 e 66 arestas acima de g0 ao fim do treino, mas sem chegada ao alvo no horizonte/limiar; portanto **refutada a impossibilidade absoluta de reforço**, não a insuficiência de propagação nessa condição. Com g0=.02, amplitude 10, chegada 52 ticks, versus 65 no controle sem plasticidade; com g0=.06, amplitude 10, chegada 15 versus 17 no controle. Repouso com plasticidade reduz g médio (.0594975435 sem atualização versus .0592863663 com atualização). Calendários temporalmente variados com sementes reais alteraram quantidades de reforços, mas produziram respostas remotas próximas.

### Bateria 2
12 combinações (2 geometrias × 3 sementes × 2 fontes), com respostas distribuídas e ablações de todas as células não fonte para A/C/D. Distância espacial L1 normalizada A×C média .00256084 (0,256%), intervalo .00198901–.00313267; A×D média .00392023; D×C média .00541848. Para geometria original, fonte 0 e limiares [1e-6,1e-5,1e-4], A e C alcançam [192,192,182] células; B [44,42,22]. A célula de maior impacto por ablação é 58 tanto em A (impacto ~.00920626) como C (~.00915025); médias de impacto A .00189539, C .00189502. A geometria fixa explica parte substancial dos efeitos; não se individualizou Upro.

**Não houve Bateria 3 executada.** Sua discussão foi metodológica; não registrar qualquer resultado de integração ou não aditividade como observado. A transmissão com g congelado é linear no regime efetivamente alcançado da sonda, mas o motor completo inclui atualização de g com módulo, limiar e saturação. Linearidade de uma sonda não demonstra ausência ou impossibilidade de Uint.

## 4. Confronto explícito com hipóteses

| Hipótese | Evidência V0.12 | Estatuto |
|---|---|---|
| H0 — mudanças sem percursos ou organização integradora constituídos | Propagação e mudanças de g observadas; não se demonstrou individuação ou integração constitutiva | **Compatível**, não provada universalmente |
| H1 — Uint candidata antecede Upro | Nenhuma Uint identificada por critério não circular | **Não testada adequadamente** |
| H2 — constituição recíproca | Não houve demonstração de constituição de ambas | **Não testada adequadamente** |
| H3 — Upro antecede Uint | Diferenciação de transporte não individualiza Upro | **Não sustentada**, não refutada universalmente |
| H4 — Upro sem Uint | Não foi demonstrada Upro | **Não sustentada**, não refutada universalmente |
| HC1 — persistência condicionada | Enfraquecimento basal observado durante repouso | Limitação da regra identificada; necessidade de outra persistência **aberta** |
| HC2 — interdependência local | Fluxos e atualizações locais reais | Interação demonstrada; constituição coletiva **não** |
| HC3 — percurso operacional | Latências e ablações observadas | Propagação sim; percurso individuado **não** |
| HC4 — constituição integradora | Sem teste constitutivo discriminante e sem Bateria 3 | **Aberta** |
| HC5 — controles rigorosos | B1 controles pareados; B2 ablações extensas e D permutado | **Parcialmente atendida**; independência de sementes e pareamento ainda limitados |

## 5. Conclusões demonstradas e não demonstradas

**Demonstrado no motor:** transmissão local efetiva, tempo de chegada dependente das condições, retroação de atividade sobre g, diferenciação espacial pequena, sensibilidade a ablações e enfraquecimento basal da regra atual. **Não demonstrado:** constituição autônoma de Upro, Uint, relação nova fora da topologia potencial, organização integradora individuada, representação ou consciência. A ausência de demonstração não estabelece impossibilidade.

**Falha interpretativa corrigida:** não linearidade de resposta não é critério necessário nem suficiente para Uint; linearidade da sonda não constitui, por si, limite constitutivo universal. O problema é ausência de demonstração operacional da origem e individuação das unidades/relações.

## 6. Limites de inferência e decisão de parada

- O pré-registro integral não foi concluído antes da primeira execução.
- B não é criação de conectividade; A×B não isola variável causal.
- Sementes repetidas não constituem replicações independentes em A/B/C.
- Não há critérios empíricos suficientemente discriminantes de individuação autônoma.
- Bateria 3 não foi executada; não extrapolar resultado.
- A escolha de topologia fixa é uma hipótese instrumental, não uma demonstração de suficiência constitutiva.
- Resultados não determinam quais mecanismos são necessários ou suficientes em qualquer substrato.
- Faltam arquivamento de saídas brutas integrais, testes de robustez independentes e demonstração de equivalência neurobiológica.

**Decisão:** encerrar V0.12 como série exploratória que delimitou capacidade de transmissão/plasticidade e insuficiência de evidência constitutiva. Não repetir baterias sem hipótese discriminante nova. Não modificar retrospectivamente código ou registros.

## 7. Transferência de questões à V0.13 — sem escolher implementação

A próxima **Etapa I (pré-experimento)** deve investigar antes de codificar: (i) o que passa a existir quando se constitui Uint ou Upro, sem rótulo externo circular; (ii) operações efetivas pelas quais relações e unidades podem se constituir; (iii) origem, manutenção, transformação e perda; (iv) hipóteses de precedência Uint→Upro, Upro→Uint, co-constituição ou nenhuma; (v) capacidades iniciais necessárias e alternativas; (vi) investigação neurobiológica e abstração funcional rastreável, com hipóteses independentes preservadas. Não pressupor que criação física de novas adjacências seja universalmente necessária, nem que reponderação de arestas preexistentes seja suficiente.

**Minimalidade funcional:** evitar mimetizar a complexidade integral do NB; não buscar economia computacional. A demonstração de constituição autônoma por regras determinísticas relacionais transdutoras é prioritária, ainda que custosa. Suficiência não demonstra necessidade ou minimalidade.

**Marco de encerramento:** V0.12 concluída como experimento exploratório, com pendências de arquivamento e lacunas declaradas; V0.13 ainda não iniciada.

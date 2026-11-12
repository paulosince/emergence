# EMERGENCE V0.13 — Investigação independente: individuação, constituição e contraexemplos

**Data:** 12/11/2026. **Fase:** elaboração independente, anterior à confrontação bibliográfica. **Estatuto:** análise lógica e hipóteses candidatas; não são evidências empíricas, definições canônicas aprovadas nem mecanismos selecionados. Nenhuma implementação autorizada.


## Diretriz constitutiva vinculante — factories e objeto representacional (12/11/2026)
**Origem:** esclarecimento explícito do responsável na elaboração independente da V0.13. **Aplicação:** V0.13 e todos os experimentos posteriores do EMERGENCE; não altera retrospectivamente resultados da V0.12.

**Questão científica principal:** como transformar sinais em representações utilizando Uint (unidades) e Upro (relações temporotopológicas) dotadas de suas propriedades operacionais. **Não** é descobrir como inventar do nada um nó integrador, refratariedade, mecanismos de propagação ou os princípios de fabricação dos elementos.

1. **Factories prontas desde o início:** disponibilizar mecanismos de construção operacionais de **Uint e Upro**, com estruturas, capacidades, propriedades possíveis, invariantes e operações efetivas. Sua especificação técnica deve preceder a implementação de cada experimento, sem presumir que uma factory por si constitua representação.
2. **Determinação autônoma:** o funcionamento do sistema, por incidências e regras determinísticas relacionais transdutoras, deve determinar **se e quando** acionar cada factory, **quais parâmetros particulares** fornecer e **quais ligações concretas** estabelecer. A infraestrutura pode definir tipos, limites, invariantes e valores-padrão; não deve impor as instâncias, conteúdos, destinos ou organização específicos que o experimento pretende demonstrar como autonomamente determinados.
3. **Três problemas distintos:** (a) fabricação/implementação dos elementos — infraestrutura fornecida; (b) constituição e transformação da organização concreta — mecanismo investigado; (c) **constituição de representação a partir de sinais** — objeto científico principal. Demonstrar (b) não demonstra automaticamente (c).
4. **Sem emergência ex nihilo:** a autonomia constitutiva não exige inventar factories, regras de construção, propriedades básicas ou matéria computacional. Regras predefinidas são compatíveis com constituição autônoma; também não bastam para prová-la. Um temporizador externo que chama uma factory ou um plano de ligações previamente especificado não satisfaz a determinação autônoma pretendida.
5. **Representação não é rótulo:** diferenciar propagação, plasticidade, integração, memória, criação de instâncias, organização e representação. A avaliação representacional deve examinar separadamente **organização especificadora, fundamentação transdutiva e determinação autônoma**, com operações efetivas e controles que afastem interpretação exclusiva do observador. Nenhuma mera propriedade declarativa em JSON substitui mecanismo.
6. **Não circularidade corretamente delimitada:** é legítimo fornecer Uint e Upro como categorias construtivas, suas capacidades e factories; é ilegítimo inserir como entrada o conteúdo representacional ou a organização particular que se quer demonstrar como resultado. Não exigir que a unidade recém-instanciada tenha inventado sua própria fábrica.
7. **Rastreabilidade:** os documentos experimentais devem distinguir explicitamente *o que foi fornecido* (factories, capacidades, regras), *o que o sistema determinou* (chamadas, parâmetros, ligações, modificações) e *o que foi efetivamente demonstrado* (organização e, separadamente, representação). Investigar contraexemplos em que factories funcionam e uma malha se organiza sem representação.

**Correção de escopo:** formulações anteriores que tomem “constituição autônoma de Uint/Upro” como invenção de suas propriedades construtivas, que exijam ausência de funções integradoras pré-instaladas nos elementos, ou que façam da individuação coletiva um requisito universal de Uint, ficam **superadas** por esta diretriz. Critérios de observação de novas organizações continuam possíveis como testes candidatos, nunca como definições obrigatórias de Uint/Upro ou prova automática de representação.

## 1. Separações indispensáveis

1. **Factory predefinida ≠ instância concretamente determinada.** O sistema pode dispor desde o início das factories de Uint/Upro, com integração e demais propriedades operacionais; o que se investiga é a determinação de instâncias, parâmetros, ligações e, sobretudo, representação.
2. **Capacidade de transmissão ≠ representação.** Uma Upro pode ser construída por factory e operar temporalmente sem que a organização resultante constitua conteúdo representacional.
3. **Transformação ≠ organização ≠ representação.** A criação autônoma de instâncias e ligações não demonstra por si só representação.
4. **Observabilidade ≠ constituição.** O observador pode identificar clusters, caminhos, fronteiras, limiares ou persistência mesmo sem haver mecanismo operacional que individualize uma organização no meio.
5. **Determinação causal ≠ codificação antecipada.** Regras determinísticas podem permitir trajetórias dependentes da história; o resultado não pode ser imposto por rótulos, destinos ou templates.

## 2. Problema da primeira constituição e não circularidade

É inadequado exigir um meio sem componentes ou sem capacidades relacionais: isso tornaria impossível a própria experimentação. O requisito é que as **capacidades iniciais não contenham já, como função atribuída, a Uint/Upro cujo surgimento se pretende explicar**. A pergunta é quais transformações efetivas produzem uma diferença constitutiva, e não como eliminar todos os pressupostos materiais.

**Possível círculo 1:** declarar que um conjunto de células forma Uint porque um detector externo identifica coativação. O detector constitui o agrupamento conceitual; não se demonstrou que o meio o constituiu.

**Possível círculo 2:** chamar qualquer transmissão sucessiva de Upro, embora todos os trajetos possíveis já estejam fixados e não haja individuação operacional.

**Possível círculo 3:** adicionar uma regra que cria objeto `Uint` sempre que uma métrica ultrapassa limiar. Se o objeto só existe no relatório ou se o agrupamento não passa a operar como unidade, há rotulagem, não constituição demonstrada.

**Possível círculo 4 (reformulado):** fornecer capacidade integradora na factory é legítimo; o círculo surge ao programar previamente a organização particular ou o conteúdo representacional cuja constituição autônoma se pretende demonstrar.

## 3. Critérios candidatos — não validados (escopo corrigido)

**Advertência vinculante:** C-U1–C-U5 e C-P1–C-P3 abaixo são testes exploratórios de organização e individuação, **não** requisitos para que uma instância construída por factory seja Uint/Upro. Em particular, Uint não precisa ser uma entidade coletiva emergente, e Upro não precisa inventar sua própria capacidade de propagação. O foco principal é a constituição de representação, distinta da criação das peças.

### C-U1 Origem
Identificar transformação verificável entre estado anterior sem organização candidata e posterior com organização candidata. Comparar histórias alternativas sob as mesmas regras.

### C-U2 Organização efetiva
As relações entre partes devem alterar operacionalmente as possibilidades de transformação posterior. Não basta descrição estática de proximidade ou conectividade.

### C-U3 Individuação
A organização candidata deve ser distinguível de recortes alternativos por consequências operacionais discriminantes, não por limiar observacional escolhido após os resultados.

### C-U4 Continuidade e transformação
Investigar se a organização mantém alguma identidade operacional sob mudanças de componentes, incidências e condições; não pressupor persistência obrigatória ou fronteiras rígidas.

### C-U5 Dependência constitutiva
Intervenções que perturbam relações constituintes devem produzir efeitos distinguíveis de mera perda de massa, energia, condutância ou caminhos geométricos preexistentes.

### C-P1 Trajetória temporal efetiva
Para Upro, verificar sequências de transmissão com tempos próprios, distinguindo-as de um caminho desenhado no grafo.

### C-P2 Diferenciação e origem
A história deve modificar operacionalmente quais sequências se sustentam; não concluir individuação apenas porque um limiar externo revela um caminho preferencial.

### C-P3 Alterabilidade
Investigar manutenção, desvio, recomposição ou desaparecimento da relação candidata sob intervenções, com controles pareados.

**Advertência:** não se demonstrou que cada critério seja necessário ou que sua conjunção seja suficiente. Persistência, autonomia, fronteira, não linearidade e dependência de ablação não são equivalentes entre si.

## 4. Contraexemplos adversariais

| Candidato a evidência | Contraexemplo que a enfraquece | Discriminação necessária |
|---|---|---|
| Cluster espacial denso | Difusão e geometria geram densidade sem entidade constituída | Comparar controles geométricos e histórias, perturbações e recortes alternativos |
| Resposta coletiva | Soma de transmissões independentes ou resposta de integrador pré-programado, que é legítimo como propriedade da Uint mas insuficiente como evidência de representação | Comparar respostas e origem da organização, sem definir Uint por não aditividade |
| Não linearidade | Saturação local pré-instalada | Demonstrar formação da organização, não apenas forma da função |
| Persistência | Atributo com decaimento lento preprogramado | Identificar o que persiste e como essa persistência altera operações futuras |
| Sensibilidade a ablação | Toda malha difusiva sofre perdas ao remover célula | Controles com geometria, massa e conectividade pareadas |
| Caminho preferencial | Gradiente fixo de condutância ou caminho mais curto | Comparar com topologia inicial e trajetórias alternativas |
| Emergência de fronteira visual | Limiar ou algoritmo de segmentação do observador | Demonstrar fronteira funcional operacional no próprio meio |
| História altera pesos | Plasticidade sem individualização de relação | Exigir discriminação constitutiva além de mudança de parâmetros |
| Formação de nova aresta | Algoritmo de criação já impõe destino e função | Examinar origem da possibilidade relacional, sem seleção externa de pares |
| Substituição de componentes | Reação global indiferenciada | Testar continuidade discriminante frente a perturbações não equivalentes |

## 5. Hipóteses concorrentes e falsificadores candidatos

- **H0:** apenas transmissão/plasticidade e padrões identificados pelo observador. Enfraquecida se houver demonstração operacional não circular de origem e individuação que controles sem história/organização não reproduzam.
- **H1 Upro→Uint:** enfraquecida por constituição demonstrável de Uint anterior a qualquer Upro constituída, sob critérios independentes.
- **H2 Uint→Upro:** enfraquecida por Upro demonstrável antes de qualquer Uint constituída.
- **H3 co-constituição:** enfraquecida por precedência estável demonstrada sob medidas temporais suficientemente resolvidas; simultaneidade observacional limitada não prova co-constituição.
- **H4 reorganização de possibilidades preexistentes suficiente:** seria sustentada por demonstração de constituição sob regras que não criam adjacências; um resultado negativo isolado não a refuta universalmente.
- **H5 novas possibilidades necessárias:** seria enfraquecida por contraexemplo constitutivo com possibilidades relacionais fixas; sucesso com criação de adjacências não prova necessidade.

**Risco:** H1–H3 podem depender de como se define e mede o instante de constituição. Sem critérios independentes e resolução temporal, a precedência não é testável.

## 6. Alternativas que devem permanecer abertas

- Reorganização funcional de relações potencialmente disponíveis.
- Alteração efetiva das possibilidades de interação.
- Constituição de organizações por transformações distribuídas sem fronteiras físicas fixas.
- Constituições que dependam de uma unidade material inicial distinta da Uint investigada.
- Possibilidade de que Uint/Upro não sejam individualizáveis como entidades discretas em todos os meios.

Nenhuma alternativa foi escolhida; não presumir necessidade universal de nova aresta nem suficiência de peso variável.

## 7. Consequências para desenho experimental futuro

Antes de codificar: definir o observável constitutivo sem pressupor a entidade, controles pareados com geometria/energia/história, intervenções de formação e desorganização, critérios prospectivos para individuação, medição de temporalidade e rastreabilidade do mecanismo. Testar se qualquer critério também classificaria erroneamente o controle difusivo V0.12.

Não selecionar a arquitetura por simplicidade ou eficiência: minimalidade é funcional e busca evitar mimetização integral do substrato neurobiológico, sem remover capacidades ainda candidatas a necessárias.

## 8. Pendências abertas

1. Quais operações determinam autonomamente chamadas às factories, parâmetros e ligações, sem programar conteúdos representacionais?
2. Como demonstrar representação efetiva para além da instanciação de Uint/Upro e da organização da malha?
3. Pode existir Upro individuada em campo distribuído sem caminho discreto?
4. Como diferenciar identidade operacional de mera descrição histórica por observador?
5. Quais critérios são necessários, suficientes, apenas instrumentais ou ainda desconhecidos?
6. Quais casos de falha e contraexemplos devemos incluir antes da pesquisa NB?

**Próxima decisão metodológica:** revisar esta análise independente e só então autorizar confrontação bibliográfica NB, mantendo-a separada do refinamento informado. Não produzir PDF congelado nem executar V0.13 nesta fase.

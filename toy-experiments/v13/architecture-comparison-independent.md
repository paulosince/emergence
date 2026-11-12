# EMERGENCE V0.13 — Comparação adversarial das arquiteturas constitutivas

**Data:** 12/11/2026. **Estado:** elaboração independente; análise de candidatos, sem seleção definitiva, sem implementação, sem validação empírica. **Origem:** deduções e propostas do assistente a partir das definições do responsável; não é revisão bibliográfica.

## 1. Problema e critérios de comparação
O objetivo principal é investigar como sinais podem constituir representações usando Uint e Upro com factories predefinidas. A autonomia incide sobre a determinação concreta de chamadas, argumentos e ligações, e não sobre a invenção das factories. Separar L1: transmissão/transformação; L2: organização endógena; L3: representação efetiva, examinando organização especificadora, fundamentação transdutiva e determinação autônoma.

Critérios: **K1** decisão produzida por operações do sistema; **K2** proveniência reconstruível de chamadas; **K3** ausência de conteúdo representacional ou conectividade específica impostos; **K4** compatibilidade com propriedades operacionais das factories; **K5** capacidade de formar, modificar e desconstituir relações; **K6** possibilidade de controles discriminantes de L1/L2/L3; **K7** tratamento da primeira criação sem pressupor uma instância futura; **K8** preservação de hipóteses concorrentes e ausência de simplificação funcional não demonstrada.

## 2. A — decisões locais de instâncias
**Operação candidata:** uma Uint existente modifica seu estado ao receber incidências e, conforme operações internas predefinidas, produz uma solicitação concreta de criação/modificação de Uint ou Upro. A factory apenas valida invariantes e executa a solicitação. **Ponto não resolvido:** como uma instância determina um destino que ainda não conhece sem receber uma lista de destinos desejados ou um mecanismo de busca com solução embutida? Não se presume que a escolha seja aleatória, nem que aleatoriedade seja autonomia.

**Forças condicionais:** proveniência local direta; intervenções causais por instância; nenhuma exigência de coordenador global. **Falhas possíveis:** o conjunto de operações locais já contém um mapa de conexões; a escolha depende de coordenadas externas; a regra de limiar é um temporizador disfarçado; a primeira Uint é pressuposta. **Contraexemplo:** cada Uint conecta-se sempre ao vizinho de menor índice, e uma malha cresce; há criação dinâmica, mas o destino foi fixado pela regra, sem constituição representacional demonstrada.

## 3. B — solicitações distribuídas de constituição
**Operação candidata:** múltiplas operações de Uint/Upro produzem condições ou solicitações que, quando compostas por um mecanismo efetivo, determinam uma instanciação. O mecanismo de composição pode ser infraestrutura predefinida, mas não pode consultar rótulos ambientais, destinos representacionais ou uma planta da malha.

**Forças condicionais:** possibilidade de decisões dependentes de múltiplas incidências e histórias; permite examinar temporalidade relacional. **Falhas possíveis:** arbitragem central escolhe o conteúdo, destino ou prioridade; a agregação reduz-se a um limiar de observador; pedidos incompatíveis são resolvidos por preferência externa. **Contraexemplo:** um coordenador recebe sinais e usa uma tabela de classes para criar nós com ligações predefinidas; parece distribuído, mas a constituição foi terceirizada.

## 4. C — estado distribuído com instanciação discreta
**Operação candidata:** o meio mantém estados e transformações distribuídos que, mediante operação endógena verificável, produzem os argumentos de uma factory. A operação de conversão não pode ser um algoritmo de segmentação aplicado somente pelo observador aos resultados.

**Forças condicionais:** não pressupõe uma Uint anterior para toda decisão; pode representar condições de desenvolvimento antes de haver instâncias discretas. **Falhas possíveis:** um detector externo escolhe regiões e atribui identidade; a dinâmica do campo já codifica a solução; a instância criada não participa causalmente do funcionamento posterior. **Contraexemplo:** um mapa de calor é segmentado por pós-processamento e seus clusters viram Uint apenas no relatório; não houve constituição operacional.

## 5. Comparação qualitativa — hipóteses, não pontuação de desempenho
| Critério | A local | B distribuída | C estado distribuído |
|---|---|---|---|
| K1 origem endógena | Possível; depende da operação local | Possível; depende da composição | Possível; depende da conversão operacional |
| K2 rastreabilidade | Potencialmente direta | Exige trilha de composição | Exige trilha estado→evento→factory |
| K3 não pré-imposição | Risco de seleção de vizinhos embutida | Risco de planejador na arbitragem | Risco de segmentador externo |
| K4 factories prontas | Compatível | Compatível | Compatível |
| K5 transformação/desconstituição | Possível | Possível | Possível |
| K6 testes L1/L2/L3 | Viável, não demonstrado | Viável, não demonstrado | Viável, não demonstrado |
| K7 primeira criação | Requer Uint inicial ou outro disparador | Requer fontes iniciais de solicitação | Pode operar antes de Uint, mas pressupõe meio funcional |
| K8 minimalidade funcional | Não avaliada | Não avaliada | Não avaliada |

**Não há vencedor demonstrado.** As três arquiteturas admitem tanto implementações legítimas quanto falsos positivos. Escolher uma por elegância, facilidade de codificação ou número de componentes violaria o método.

## 6. Distinção nova: mecanismo de decisão e topologia não são a mesma escolha
Uma operação local pode utilizar condições distribuídas; uma composição distribuída pode acionar uma factory diretamente; um estado distribuído pode gerar solicitações locais. Portanto, A/B/C podem descrever **onde a informação decisória é formada**, **como é combinada** e **como se torna uma chamada executável**, respectivamente. Hipótese concorrente: a classificação original mistura eixos ortogonais. Isso exige decomposição antes de escolher arquitetura, não adoção silenciosa de uma combinação.

## 7. Experimentos discriminantes propostos — ainda não pré-registrados
**T1 proveniência:** para cada criação, arquivar estados anteriores, incidências, operações executadas, parâmetros, alvos, validações da factory e efeitos posteriores. **T2 história pareada:** preservar cargas marginais e alterar ordem temporal; verificar mudanças nas decisões e no uso operacional posterior. **T3 conectividade cega:** permutar identidades e posições mantendo propriedades físicas compatíveis; testar dependência de rótulos/índices. **T4 controle de construção:** criar quantidades e custos equivalentes de Uint/Upro por regra exógena, mantendo factories idênticas. **T5 perturbação temporal:** alterar tempos efetivos de Upro, com controles de carga e conectividade. **T6 ancoragem:** interromper ou trocar transduções de origem sem alterar artificialmente o decodificador; verificar se conteúdo candidato muda em operações do próprio sistema. **T7 uso de conteúdo:** testar se a organização constituída altera seletivamente decisões posteriores em condições discriminantes; decodificação por observador não basta.

Resultados possíveis: L1 sem L2; L2 sem L3; L3 candidata com limites de identificabilidade; nenhum nível demonstrado. Nenhum teste isolado prova necessidade universal.

## 8. Questões bloqueantes antes de selecionar e congelar
1. Quais operações efetivas das Uint/Upro, além de integração/refratariedade/propagação, permitem produzir argumentos para factories?
2. Como são disponibilizadas possibilidades de origem/destino sem fornecer a malha particular?
3. Qual mecanismo resolve conflitos e limites de recursos sem escolher conteúdos?
4. Como o meio inicia a primeira chamada e como distinguir infraestrutura inicial de resultado representacional?
5. Quais observáveis operacionais sustentariam a tríade representacional, e que controles poderiam refutá-los?
6. Qual a semântica temporal das factories, inclusive incidências concorrentes, atraso, plasticidade e refratariedade?

## 9. Conclusão provisória e próxima decisão
**Não selecionar A/B/C como arquitetura completa.** Primeiro decompor o mecanismo em (i) formação de condições operacionais, (ii) composição/resolução, (iii) emissão de chamada, (iv) validação e instanciação por factory, (v) participação posterior na dinâmica, sem assumir que todas as camadas são necessárias. Para cada operação, testar se a decisão deriva de estados e incidências ou se codifica resultado. Só depois comparar implementações concretas e justificar seleção.

**Estado metodológico:** documento orientador candidato. Não congela o PDF, não autoriza implementação, não apresenta literatura nova e não modifica TEMPO.

# EMERGENCE V0.13 — Contrato constitutivo e decisões pré-implementação (candidato)

**Data:** 12/11/2026. **Estado:** elaboração técnica independente, não congelada, sem código executado. Complementa o pré-experimento candidato; não substitui validação do responsável.

## 1. Objetivo vinculante
Investigar a transformação de sinais em representações por um sistema que já dispõe de factories operacionais de Uint e Upro. Distinguir (L1) transmissão/transformação, (L2) organização endogenamente constituída e (L3) representação fundamentada, especificada e utilizada. Não exigir que o sistema invente a fábrica, integração, refratariedade ou propagação.

## 2. Contrato de infraestrutura — UintFactory
**Fornecido:** tipo operacional Uint, capacidade de receber incidências, integrar estados, operar refratariedade, emitir consequências, manter/alterar propriedades, identidade técnica da instância e invariantes de execução. A factory deve retornar unidade executável; nenhuma propriedade pode existir apenas como metadado descritivo.

**Determinados pela dinâmica:** momento da chamada, parâmetros particulares permitidos, incidências que motivaram a chamada, inserção na organização, alterações subsequentes e eventual desconstituição. O identificador técnico gerado pela factory não constitui conteúdo semântico.

**A especificar antes do congelamento:** modelo temporal da integração, condições de refratariedade, limites de parâmetros, estados admissíveis, política de recursos, operações de modificação e condições de encerramento. Não atribuir valores numéricos sem justificativa funcional.

## 3. Contrato de infraestrutura — UproFactory
**Fornecido:** tipo operacional de relação temporotopológica, transmissão efetiva entre extremidades, tempo de percurso operacional, condições de incidência, modificação e interrupção, identidade técnica e invariantes. Uma Upro não é somente aresta desenhada nem atributo JSON de atraso: a transmissão deve ser realizada por mecanismo executável.

**Determinados pela dinâmica:** momento de criação, origem e destino particulares, parâmetros de percurso, condições de modificação e remoção. As extremidades devem existir e ser operacionalmente compatíveis no momento da instanciação; validação estrutural não equivale a escolha de destino.

**A especificar antes do congelamento:** comportamento de sinais simultâneos, filas/propagação, reversibilidade, atrasos e sua variabilidade, saturação, perdas, plasticidade, conflitos e política de recursos.

## 4. Fronteira de autonomia
A infraestrutura pode conter tipos, invariantes, regras determinísticas e valores-padrão; não pode receber classes ambientais, rótulos de conteúdo, destino representacional desejado, plano particular de conectividade ou solução de tarefa. Cada chamada deve ter proveniência verificável: incidência → estado anterior → operação de decisão → argumentos → factory → instância/relação → consequência posterior. Um relógio externo, script de montagem ou supervisor que escolha destinos não prova autonomia.

## 5. Arquiteturas concorrentes, sem escolha prematura
**A — decisão por operações locais das instâncias:** favorece rastreabilidade; risco de regras de ligação já codificarem a solução. **B — solicitações distribuídas de constituição:** favorece composição de condições; risco de arbitragem global ocultar um planejador. **C — estado distribuído com instanciação discreta:** permite organização anterior à discretização; risco de segmentação constitutiva pelo observador. Não declarar nenhuma necessária, suficiente ou superior antes de reconstruir operações e confrontar contraexemplos.

## 6. O que deverá ser demonstrado, separadamente
**L1:** sinais efetivamente propagados e transformados por Uint/Upro, com tempos medidos. **L2:** decisões endógenas, dependentes da história, de instanciação/parametrização/ligação e organização operacional posterior. **L3:** organização especificadora de conteúdo candidato, fundamentação transdutiva rastreável e uso operacional seletivo da organização em novas incidências. Decodificação externa, criação de objetos, memória e plasticidade não demonstram L3.

## 7. Ensaios adversariais obrigatórios
(a) Parear número de elementos/recursos com controle de criação por relógio ou aleatoriedade; (b) preservar sinais marginais e permutar histórias; (c) perturbar tempo de Upro sem alterar carga total; (d) desconectar ou permutar fundamentação transdutiva; (e) comparar ablação seletiva com ablação pareada por recursos; (f) demonstrar que a leitura de conteúdo não depende apenas de decodificador externo; (g) verificar episódios causalmente distintos com observações locais indistinguíveis e reconhecer limites de identificabilidade.

## 8. Portões para execução
**D1:** responsável valida este contrato conceitual. **D2:** comparar e selecionar mecanismo de determinação endógena, justificando perdas e alternativas. **D3:** especificar parâmetros, invariantes, eventos e cenário semântica-cego. **D4:** definir testes e critérios prospectivos sem usar resultados. **D5:** congelar PDF integral e versão da especificação; somente depois implementar. **D6:** executar, arquivar dados e avaliar adversarialmente.

**Pendência central:** sem decisão fundamentada sobre A/B/C e contratos temporais concretos, o pré-experimento não está pronto para congelamento. Não preencher essas lacunas com conveniência de implementação.

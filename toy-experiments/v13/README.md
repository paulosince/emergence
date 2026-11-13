# V0.13 e V0.14 — registro consolidado

**Organizado em 13/11/2026** a partir dos oito documentos de 12/11/2026 (cinco da V0.13, três da V0.14), que continuam preservados sem alteração. Este arquivo não acrescenta decisões: ordena o que já existe, aponta onde cada assunto está e registra conflitos e lacunas. As ponderações do assistente estão à parte, na [revisão de 13/11/2026](../revisao-2026-11-13.md).

**Estado em uma frase:** nenhum experimento científico da V0.13 ou da V0.14 foi executado; há duas decisões do responsável, um protótipo instrumental cujo atalho foi encontrado pela auditoria, e uma pergunta aberta sobre como a organização constituída volta a ser alcançada.

## 1. Cronologia (horários dos commits de 12/11/2026)

| Hora | Passo | Documento |
|---|---|---|
| 14:49 | Encerramento da V0.12 e transferência de questões | [V0.12, etapa III](../v12/final-results-stage3.md) |
| 14:50–15:44 | Abertura da V0.13: diagnóstico, pergunta, hipóteses concorrentes, critérios candidatos e contraexemplos | [pré-experimento, etapa I](pre-experiment-stage1.md) · [análise independente](independent-constitutive-analysis.md) |
| 16:34 | **Decisão do responsável:** diretriz das factories | inserida nos dois arquivos acima e na [metodologia](../../docs/program-methodology.md#diretriz-constitutiva-vinculante--factories-e-objeto-representacional-12112026) |
| 17:25 | Contrato das factories e portões antes da implementação | [contrato e portões](factory-contract-and-decision-gates.md) |
| 17:54 | Comparação das três alternativas de decisão | [comparação](architecture-comparison-independent.md) |
| 18:30 | Especificação operacional das alternativas | [candidatos operacionais](operational-mechanism-candidates.md) |
| 18:53 | Protótipo instrumental (código incluído só em 13/11, ver seção 4) | [`prototype/package.json`](prototype/package.json) · [instrumental v0.13.0](instrumental-v0.13.0/) · [exploratório v0.13.1](experimental-v0.13.1/) |
| 20:57 | **Decisão do responsável:** regra contra soluções programadas; adendo de auditoria | [metodologia](../../docs/program-methodology.md#regra-vinculante-de-não-substituição-do-fenômeno-por-programação-12112026) · [adendo no pré-experimento](pre-experiment-stage1.md#adendo-de-auditoria-v013--proibição-de-soluções-programadas-12112026) |
| 21:19 | Abertura da V0.14: achado do lookup e diagnóstico A → B → A | [auditoria e diagnóstico](../v14/audit-and-diagnostic.md) |
| 21:29–21:31 | Dois estudos sobre o reacesso | [estudo de continuidade e reacesso](../v14/constitutive-reaccess-solution-study.md) · [estudo do mecanismo de reacesso](../v14/independent-reaccess-study.md) |

## 2. Decisões do responsável que valem daqui em diante

1. **Diretriz das factories.** Factories de Uint e Upro, com estrutura, propriedades, invariantes e operações efetivas, são infraestrutura dada desde o início. O funcionamento do sistema deve determinar **se e quando** acionar cada uma, **com quais parâmetros** e **com quais ligações**. Há três problemas distintos: fabricação dos elementos (dada), constituição da organização concreta (investigada) e constituição de representação a partir de sinais (objeto principal). Demonstrar o segundo não demonstra o terceiro. Texto integral: [metodologia](../../docs/program-methodology.md#diretriz-constitutiva-vinculante--factories-e-objeto-representacional-12112026).
2. **Regra contra soluções programadas.** A programação pode fornecer condições de possibilidade; não pode fornecer antecipadamente o resultado investigado. Exige auditoria de toda chamada de factory antes de executar e trilha causal sinal → transdução → estados → decisão → argumentos → factory → participação posterior. Quem implementa deve achar o atalho antes do responsável. Texto integral: [metodologia](../../docs/program-methodology.md#regra-vinculante-de-não-substituição-do-fenômeno-por-programação-12112026).

**Superado pela diretriz:** formulações que tomavam "constituição autônoma de Uint e Upro" como invenção de suas propriedades, que proibiam funções integradoras pré-instaladas, ou que faziam da individuação coletiva um requisito de Uint. Os critérios de individuação continuam como testes candidatos, não como definições.

## 3. A pergunta atual

Como um sistema que dispõe de factories de Uint e Upro determina, por incidências e regras operacionais, suas instâncias, parâmetros e ligações, e, com elas, transforma sinais em representações sem conteúdo imposto? Desde a V0.14, uma parte dessa pergunta ficou em primeiro plano: **como uma incidência atual alcança uma organização constituída antes**, sem que um mapa, um controlador ou um identificador escolha a unidade.

## 4. O protótipo: fornecido, determinado, demonstrado

Separação exigida pelo item 7 da diretriz. Fonte original: os documentos da V0.14. O código foi incluído pelo responsável em 13/11/2026 ([instrumental v0.13.0](instrumental-v0.13.0/), [exploratório v0.13.1](experimental-v0.13.1/)) e os achados abaixo foram **confirmados contra ele** na seção 4b.

| | Conteúdo |
|---|---|
| **Fornecido** | Factories de Uint e Upro; transdutor que calcula a intensidade como `log1p(amplitude)`; estímulos A (9), B (9) e A de novo (6), todos pelo transdutor. |
| **Determinado pelo sistema** | Criação de uma Uint quando um par canal-intervalo se repete o número de vezes previsto; criação de Upro orientada quando uma transição entre ativações se repete. |
| **Demonstrado** | Nada constitutivo. Uma Uint para A, uma para B, a mesma Uint de A ativada na reapresentação, sem Upro entre as fases. Quatro testes instrumentais passaram. |

**Achados da auditoria (por inspeção):**
- A Uint "reacessada" é recuperada por consulta a um mapa indexado por canal e intervalo, que guarda a própria unidade; a reapresentação apenas incrementa sua ativação. A seleção é feita pelo mapa, não pela malha.
- O limiar da Uint existe, mas não governa a ativação.
- A intensidade é transduzida, mas não participa da constituição nem do reacesso.
- A marca de origem "endógena" é fornecida por quem chama a factory; não autentica nada.
- A origem e o alvo das Upro dependem das ativações escolhidas pelo mapa.
- A função de relatório drena eventos pendentes até o fim; não mede o estado no instante da reapresentação.
- Uma versão ainda anterior do protótipo tinha Uint e Upro iniciais instanciadas à mão e uma relação com orientação e atraso predefinidos. Esses resultados são só instrumentais.

**Consequência registrada:** retirar o mapa sem substituto inviabiliza a constituição atual; trocá-lo por outro reconhecedor programado repetiria o erro. A "limpeza" não está concluída e nenhuma conclusão de reacesso pode ser declarada.

## 4b. Verificação contra o código (13/11/2026)

**Executado pelo assistente, exploratório, não pré-registrado.** Node.js 22.23.4. Os testes de ambos os pacotes passam (7 de 7 e 6 de 6). O ensaio do v0.13.1 reproduz o relatado: 2 Uint em t = 30 e t = 34; 2 Upro em t = 44 e t = 50, atrasos 4 e 6; 14 entregas. Quatro verificações adicionais: [script](verificacao-2026-11-13/check.mjs) · [saída](verificacao-2026-11-13/saida.txt).

**Pacote instrumental v0.13.0.**
- Aqui a Uint tem limiar, decaimento e refratariedade que **de fato governam** a descarga, e o motor trata eventos simultâneos sem depender da ordem. Upro tem atraso efetivo. Há um portador local com distância e velocidade e um receptor de coincidência.
- Não existe Utrd como entidade. A factory de Upro exige Uint nas duas pontas, e um teste ("nonexistent endpoints rejected") impõe a hipótese de que não há Upro sem destino, hoje em teste (seção 7, item 7).
- O roteiro de demonstração cria três Uint e uma Upro à mão, e a função chamada na coincidência, escrita no roteiro, cria Upro com atraso fixo 1. Uso só instrumental, como já registrado.
- O contador de identificadores é global ao módulo e não reinicia entre motores; cuidado em testes de permutação.

**Pacote exploratório v0.13.1.**
- **A ordem "Uint antes de Upro" está programada.** Upro só são criadas entre Uint já existentes e ativadas. O ensaio não pode informar o teste de precedência.
- **Cada Uint nasce da repetição do intervalo de um único canal**, e canal e intervalo ficam guardados como atributos da unidade. Não há Utrd como entidade nem Upro chegando à Uint a partir dela.
- **A Uint não integra.** A entrega por Upro só incrementa um contador de ativação; o limiar calculado não é usado; a incidência entregue não segue adiante (um único salto).
- **Lookup confirmado** (verificação 3): apagado o mapa depois da constituição, a reapresentação de A não alcança a Uint de A e cria uma Uint duplicada para o mesmo canal e intervalo. É o caso "reconstituição sem reacesso" da V0.14.
- **Falso positivo** (verificação 1): dois canais periódicos sem relação entre si (períodos 10 e 7) também produzem 2 Uint e 2 Upro. A Upro registra proximidade temporal dentro da janela, não covariação.
- **Rótulo de origem forjável** (verificação 2): a factory aceita criação manual com `kind: 'endogenous'` e um histórico qualquer. O teste "factories reject direct/manual calls" só verifica a ausência do rótulo.
- **Intensidade irrelevante** (verificação 4): amplitudes 0,01 e 1000 dão a mesma organização.
- **Teste com nome trocado:** "changing signal chronology changes relational constitution" troca os **nomes** dos canais, não a cronologia. O que ele mostra é uma permutação de identificadores.
- Entregas só são processadas na chegada da incidência seguinte, e o relatório drena eventos até o infinito.

## 5. Mapa dos assuntos

Os oito documentos se sobrepõem bastante. Esta tabela diz onde está a versão mais completa de cada assunto e onde ele se repete.

| Assunto | Versão mais completa | Repetido ou retomado em |
|---|---|---|
| Diagnóstico herdado da V0.12 | [pré-experimento](pre-experiment-stage1.md), seção 1 | [encerramento da V0.12](../v12/final-results-stage3.md), seção 7 |
| Separações (factory × instância, transmissão × representação, observável × constituição) | [análise independente](independent-constitutive-analysis.md), seções 1 e 2 | [contrato](factory-contract-and-decision-gates.md), seção 1 |
| Critérios candidatos de organização e individuação | [análise independente](independent-constitutive-analysis.md), seção 3 | [pré-experimento](pre-experiment-stage1.md), seção 4 |
| Contraexemplos (cluster, não linearidade, persistência, ablação, caminho preferencial etc.) | [análise independente](independent-constitutive-analysis.md), seção 4 | [comparação](architecture-comparison-independent.md), seções 2 a 4 |
| Contrato das factories (o que é fornecido e o que a dinâmica decide) | [contrato](factory-contract-and-decision-gates.md), seções 2 a 4 | [candidatos operacionais](operational-mechanism-candidates.md), seção 2 |
| Três alternativas de onde nasce a decisão: na própria Uint, em pedidos compostos de várias unidades, ou no estado de um meio | [comparação](architecture-comparison-independent.md), seções 2 a 6 | [candidatos operacionais](operational-mechanism-candidates.md), seções 4 a 6; [contrato](factory-contract-and-decision-gates.md), seção 5 |
| Origem dos extremos de uma Upro (contato, exploração, coincidência, disponibilidade) | [candidatos operacionais](operational-mechanism-candidates.md), seção 7 | — |
| Semântica temporal das factories (simultaneidade, filas, refratariedade) | [candidatos operacionais](operational-mechanism-candidates.md), seção 8 | [contrato](factory-contract-and-decision-gates.md), seções 2 e 3 |
| Três níveis de evidência: infraestrutura, organização, representação | [candidatos operacionais](operational-mechanism-candidates.md), seção 9 | [contrato](factory-contract-and-decision-gates.md), seção 6; [comparação](architecture-comparison-independent.md), seção 1 |
| Ensaios adversariais | [comparação](architecture-comparison-independent.md), seção 7 | [contrato](factory-contract-and-decision-gates.md), seção 7; [metodologia](../../docs/program-methodology.md#regra-vinculante-de-não-substituição-do-fenômeno-por-programação-12112026), item 6 |
| Portões antes de executar | [contrato](factory-contract-and-decision-gates.md), seção 8 | [pré-experimento](pre-experiment-stage1.md), seção 7 |
| Achado do lookup | [estudo do mecanismo de reacesso](../v14/independent-reaccess-study.md), seções 1 e 2 | [auditoria](../v14/audit-and-diagnostic.md); [estudo de continuidade](../v14/constitutive-reaccess-solution-study.md) |
| Alternativas para o reacesso | [estudo de continuidade](../v14/constitutive-reaccess-solution-study.md) | [estudo do mecanismo de reacesso](../v14/independent-reaccess-study.md), seção 4 |
| Testes discriminantes do reacesso (A → B → A, A → B → B, sinal novo, permutação, ablação) | [estudo do mecanismo de reacesso](../v14/independent-reaccess-study.md), seção 5 | [estudo de continuidade](../v14/constitutive-reaccess-solution-study.md) |

**Repetições literais:** a diretriz das factories aparece palavra por palavra no [pré-experimento](pre-experiment-stage1.md) e na [análise independente](independent-constitutive-analysis.md) (linhas 6 a 19 idênticas), além da metodologia. A versão de referência é a da metodologia.

## 6. Hipóteses concorrentes

Os documentos originais as identificam por códigos. Estão descritas aqui pelo conteúdo, com o código só para ler os originais. **Nomes definitivos para substituir os códigos ainda precisam ser combinados com o responsável.**

**Sobre a primeira constituição** (V0.13):

**Estatuto (esclarecimento do responsável, 13/11/2026):** a ordem de constituição entre Uint e Upro é o que está **em teste** nos toy experiments. A frase das regras de 11/11 ("primeira Uint e pelo menos duas Upro diferentes convergentes são constituídas conjuntamente") não fecha a questão; estas hipóteses continuam abertas.

**Reclassificação pelo responsável (13/11/2026):** duas afirmações antes tratadas como regras são **hipóteses**, que precisam se sustentar ou cair nos experimentos: (1) a Upro tem origem e destino efetivos, ou seja, não existem arestas para lugar nenhum (regras de 11/11, seção 4); (2) a Uint integra pelo menos duas Upro aferentes (v43; CONTINUITY). Continua valendo que a Upro parte da Utrd e que não há Utrd ligada diretamente a uma Uint. **Teste pretendido agora pelo responsável:** Upro sem Uint na constituição inicial.

| Conteúdo | Código no original |
|---|---|
| Só há propagação, plasticidade e agrupamentos vistos pelo observador | H0 |
| A Upro precede a Uint | H1 (pré-experimento) |
| A Uint precede a Upro | H2 (pré-experimento) |
| Uint e Upro se constituem conjuntamente | H3 |
| Reorganizar possibilidades de relação já existentes pode bastar | H4 |
| Novas possibilidades de interação são necessárias em certas condições | H5 |

Atenção: **os mesmos códigos mudam de sentido entre versões.** Na V0.12, H1 era "a Uint precede a Upro" e H3 "a Upro precede a Uint"; na V0.13, H1 é "a Upro precede a Uint". Na V0.10 e na V0.11 os códigos tinham ainda outros sentidos. Conferir sempre a descrição, não o código.

**Sobre o reacesso** (V0.14):

| Conteúdo | Código no original |
|---|---|
| O reacesso aparente é consulta a um mapa; retirar o mapa extingue o efeito | H0 / Hlookup |
| As incidências percorrem Upro já constituídas até as Uint | H1 (estudo do mecanismo); C3 (estudo de continuidade) |
| Propriedades e estados das Uint participam diretamente do acoplamento com as incidências | H2; C2 |
| Vínculos persistentes entre a interface transdutora e as Uint, constituídos pela história | C1 |
| Cada reapresentação recria uma estrutura semelhante, sem reacesso (controle nulo) | H3; C4 |
| As incidências afetam muitas organizações sem seleção específica | H4; C5 |
| Uma organização anterior participa seletivamente, mas a tríade não é satisfeita | H5 |

## 7. Conflitos e lacunas

Só o primeiro foi resolvido, por esclarecimento do responsável; os demais seguem abertos.

1. **Upro a partir de Utrd — resolvido.** **Esclarecido pelo responsável em 13/11/2026:** a Upro parte necessariamente da Utrd; no Sdom, unidades se conectam por Upro, e não há Utrd ligada diretamente a uma Uint. O contrato da factory na V0.13, que segundo a V0.14 só aceita Uint nas pontas, estava **errado em relação à teoria**; não se tratava de revisão opcional de contrato. Ver também as [regras de 11/11](../../docs/regras-cientificas-e-continuidade-2026-11-11.md), seção 4.
2. **Variável de elegibilidade.** Os [candidatos operacionais](operational-mechanism-candidates.md), seção 3, introduzem uma variável `eligibility`; as regras de 11/11, seção 6, pedem que não se introduzam campos de elegibilidade como se fossem decisões aprovadas. O documento a declara variável de trabalho, mas o termo não foi aprovado.
3. **Pcrt ausente das alternativas de decisão.** As três alternativas não mencionam o Pcrt, que a CLEAR v43 e as regras de 11/11 descrevem como o processo que opera antes de existirem Uint, Upro ou Sdom.
4. **A v43 não é citada** em nenhum dos oito documentos.
5. **Código — resolvido em parte.** Os pacotes da V0.13 foram incluídos em 13/11/2026. O pacote do diagnóstico A → B → A da V0.14 continua fora do repositório.
6. **Uma versão ou duas?** A V0.14 é a auditoria da V0.13, não um experimento novo. Mantê-la como versão separada ou incorporá-la à V0.13 é escolha do responsável; até lá, este registro trata as duas juntas.
7. **Invariantes do contrato que pressupõem hipóteses em teste.** A [interface comum](operational-mechanism-candidates.md) (seção 2, invariante "nenhuma Upro conecta extremos inexistentes") impõe na factory a hipótese de que não há Upro sem destino, e a validação de Uint provavelmente impõe as duas aferências. Com essas invariantes, o toy não pode ver as hipóteses caírem. Para testá-las, a factory precisa permitir Upro sem destino e Uint com uma só aferente, e a ocorrência dessas formas passa a ser observada. **Ajuste a submeter ao responsável.**
8. **Portões:** o primeiro portão (validação do contrato das factories pelo responsável) não foi cumprido. Nenhum dos seguintes pode ser iniciado antes dele.

## 8. Próximo passo segundo os próprios documentos

1. Corrigir o contrato das factories para que a Upro parta da Utrd (seção 7, item 1) e submetê-lo à validação do responsável.
2. Decidir o mecanismo que determina as chamadas às factories, com perdas e alternativas justificadas.
3. Especificar parâmetros, invariantes, eventos e um cenário sem semântica.
4. Definir testes e critérios antes de ver resultados.
5. Congelar o PDF e a versão da especificação; só então implementar, executar, arquivar e avaliar.

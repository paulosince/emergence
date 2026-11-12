# EMERGENCE V0.13 — Especificação operacional comparativa dos mecanismos de determinação

**Data:** 12/11/2026. **Estatuto:** elaboração independente, proposta do assistente, não validada, sem seleção arquitetural, implementação ou resultado empírico. Este documento operacionaliza alternativas para comparação; não é pré-registro congelado.

## 1. Problema operacional
Dadas factories prontas de Uint e Upro, como estados e incidências efetivos do sistema determinam quando criar instâncias, com quais parâmetros e ligações, de modo que a organização resultante possa ser testada quanto à constituição de representação? A fábrica não inventa as regras de construção, e sua chamada não é, por si, representação.

## 2. Interface funcional comum, independente de algoritmo
**UintFactory.create(spec):** recebe parâmetros operacionais admissíveis, valida invariantes, aloca uma Uint efetivamente integradora/transdutora e retorna identificador técnico e portas de incidência/saída. **UproFactory.create(spec):** recebe origem, destino, parâmetros temporotopológicos e condições operacionais, valida compatibilidade e cria transmissão efetiva com tempo de percurso mensurável. Ambas devem expor operações efetivas de alterar e desconstituir, e emitir eventos auditáveis. O campo `spec` é uma interface de programação, não um mecanismo causal explicativo; seus valores precisam ter origem em operações anteriores identificáveis.

**Invariantes:** (i) nenhuma Upro conecta extremos inexistentes; (ii) tempo de percurso é realizado pelo motor de eventos, não apenas descrito; (iii) integração/refratariedade alteram respostas executadas, não só metadados; (iv) instâncias novas participam de operações posteriores; (v) não há categorias ambientais ou conteúdos semânticos embutidos nas factories.

## 3. Variáveis operacionais candidatas — sem valores fixados
- `incidence`: evento aferente com canal físico, intensidade e instante de chegada; o canal é origem transdutora, não rótulo de objeto.
- `state(u,t)`: estado interno operacional de uma Uint existente.
- `history(u,t)`: traços fisicamente atualizados por operações anteriores, com custos e decaimento explícitos.
- `eligibility(u,v,t)`: condição de interação construída por operações atuais; não uma matriz de destinos predefinidos.
- `proposal(t)`: solicitação transitória de criação/alteração; sua origem é rastreável e ela não representa uma Uint antes da instanciação.
- `resource(t)`: disponibilidade física/computacional; restrição de viabilidade, não seleção semântica.

Esses nomes são variáveis de trabalho, não propriedades já demonstradas como necessárias. Não atribuir-lhes conteúdo representacional por nomenclatura.

## 4. Candidata A — emissão local
**Passos executáveis propostos:** (A1) uma Uint recebe uma incidência pela Upro existente; (A2) integra e atualiza estados/traços por suas regras; (A3) sua operação produz, ou não, uma solicitação; (A4) a seleção de um destino possível é feita por incidências de descoberta efetivamente recebidas, não por lista de alvos semânticos; (A5) a factory valida e executa. **Risco:** A4 pode ocultar um algoritmo de busca que já predetermina a topologia. **Teste de refutação:** permutar IDs e coordenadas sem alterar relações operacionais e verificar se a seleção muda indevidamente. **Primeira Uint:** requer transdutor inicial capaz de emitir solicitação ou instância-semente explicitamente fornecida; a semente não pode ser contada como surgida autonomamente.

## 5. Candidata B — composição distribuída
**Passos executáveis propostos:** (B1) operações de múltiplas Uint/Upro geram solicitações parciais com proveniência; (B2) solicitações coexistem em um meio de composição; (B3) uma operação de compatibilidade e disponibilidade, sem rótulos de conteúdo, determina uma solicitação completa; (B4) a factory executa; (B5) a organização resultante altera operações futuras. **Risco:** B3 é um planejador oculto se escolhe origem/destino por tabelas ou prioridades sem relação com incidências. **Teste:** substituir B3 por controle pareado de custo e verificar se organização e uso posteriores são indistinguíveis.

## 6. Candidata C — conversão de estado distribuído
**Passos executáveis propostos:** (C1) um meio com dinâmica própria recebe incidências e mantém transformações distribuídas; (C2) essas transformações geram uma condição de instanciação que é efetivamente executada; (C3) parâmetros e extremos são determinados por relações operacionais do meio; (C4) a factory instancia e a nova unidade/relação modifica o meio. **Risco:** C2/C3 podem ser segmentação externa com valores codificados pelo pesquisador. **Teste:** retirar o observador/visualizador e verificar se o mesmo evento de instanciação ocorre e altera o comportamento do sistema.

## 7. Questão transversal: como selecionar extremos sem fornecer o quebra-cabeça
Quatro fontes de candidatos a extremo devem permanecer alternativas: **E1** contato operacional já existente; **E2** propagação exploratória por caminhos disponíveis; **E3** coincidência temporal de incidências; **E4** disponibilidade em um meio distribuído. Nenhuma é automaticamente suficiente ou necessária. Em cada caso, demonstrar: (a) de onde veio a possibilidade de contato; (b) como a operação distingue o par concreto; (c) que parâmetros a história determina; (d) como a relação criada altera consequências posteriores. Evitar impor uma topologia final ou rotular pares por classes ambientais.

## 8. Temporalidade e concorrência: contrato ainda a decidir
É obrigatório especificar antes de congelar: ordem de eventos simultâneos, unidade temporal e resolução, transmissão em curso quando Upro é alterada/removida, fila/saturação, refratariedade de Uint, conservação/dissipação, regras de conflito, disponibilidade de recursos, efeitos de atraso variável. Opções alternativas: eventos discretos com ordem total explícita; eventos parcialmente ordenados; dinâmica contínua com eventos de criação discretos. Não escolher por facilidade de implementação. Registrar divergências funcionais de cada opção.

## 9. Observáveis e falsificadores separados
**L1:** eventos propagados, atrasos efetivos, integração/refratariedade observável. **L2:** eventos de factory com trilha causal e alterações organizacionais que afetam operações posteriores; comparar controle exógeno pareado por recursos e cronologia. **L3:** (i) organização especificadora distinguível por consequências operacionais, (ii) fundamentação transdutiva por intervenções nas incidências de origem, (iii) determinação autônoma do conteúdo candidato, e (iv) uso efetivo em novas operações. Testar mudanças de ordem temporal mantendo contagens, permutação de canais, desvinculação da origem, controles de resposta sem organização e decodificação externa sem uso interno. Uma classificação externa bem-sucedida não satisfaz L3.

**Possíveis falhas:** factories funcionam mas não são acionadas; chamadas ocorrem mas só por relógio; organização cresce mas não altera operações; operações mudam mas conteúdo não é especificável; conteúdo decodificável mas não fundamentado; fundamentação aparente mas sem uso autônomo.

## 10. Decisões não tomadas e próximo portão
1. Definir semântica temporal das factories e dos eventos, preservando concorrentes.
2. Definir como se tornam disponíveis os extremos de Upro sem solução codificada.
3. Definir transdutores e condições iniciais sem fornecer categorias representacionais.
4. Construir matriz de equivalência funcional e perdas para cada alternativa.
5. Comparar alternativas em termos de testes discriminantes, não eficiência.
6. Selecionar apenas com fundamento suficiente e aprovação do responsável; atualizar PDF pré-experimental e congelar antes do código.

**Atenção:** o documento descreve mecanismos candidatos. Não declara que qualquer deles constitua representação, nem que a tríade seja empiricamente validada.

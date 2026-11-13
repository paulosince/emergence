# EMERGENCE V0.14 — Investigação independente da continuidade constitutiva e do reacesso
**Data:** 12/11/2026. **Estado:** estudo teórico e auditoria de implementação; nenhuma solução implementada ou validada. **Fase:** elaboração independente, sem confronto bibliográfico.

## Problema
Como uma incidência transduzida pode alcançar uma organização Uint/Upro constituída anteriormente, sem que um mapa de correspondências, um controlador externo ou um identificador programado selecione a unidade? Teste-alvo: A → B → A; A/B são nomes de condições do observador, não etiquetas transmitidas ao sistema.

## Fatos do código V0.13 (não hipóteses)
- `features` indexa `channel:interval` e guarda `f.unit`; a reapresentação faz `f.unit.activation++`.
- `threshold` existe mas não governa ativação; `intensity=log1p(amplitude)` não governa formação/reacesso.
- Upro têm propagação atrasada operacional, mas sua origem e alvo dependem de ativações já selecionadas pelo lookup.
- `proof.kind='endogenous'` é dado fornecido pelo chamador, não demonstra a origem.
- O ensaio A→B→A anterior formou duas Uint e nenhuma Upro relacional entre A/B; não testou acesso relacional.

## Dedução: necessidade de continuidade operacional
Para que duas organizações persistentes A e B sejam alcançadas diferencialmente por incidências futuras, deve existir algum mecanismo pelo qual propriedades e estados da incidência produzam efeitos diferentes sobre A e B. Sem continuidade material/operacional, ou sem qualquer diferença no acoplamento entre entrada e organizações, o resultado seletivo não é determinado pela história constitutiva. Isso não implica necessariamente um índice, um endereço, uma Upro particular, ou um algoritmo específico; tampouco demonstra representação. **Não é prova de impossibilidade universal**, pois depende das hipóteses de acesso seletivo e de ausência de outros canais operacionais.

Separar três operações: (i) individuação/constituição, (ii) estabelecimento e persistência de vínculos operacionais, (iii) reacesso e uso subsequente. A V0.13 implementa (ii)/(iii) por referência auxiliar `f.unit`, não por operação demonstrada do domínio.

## Arquiteturas candidatas — não selecionar prematuramente

### C1. Continuidade de acoplamento constituída
O contato inicial de incidências com um substrato de recepção/transdução fornece operações locais genéricas; durante constituição, o sistema estabelece **vínculos efetivos persistentes** entre interfaces transdutivas e Uint emergentes, com parâmetros determinados pela história. Reapresentação propaga incidências por esses vínculos e alcança organizações existentes. Os vínculos devem ser operacionais e participar de processamento, não ser tabela de rótulos. Exige especificar (a) como a primeira incidência encontra o local de constituição sem representação prévia; (b) como a factory recebe parâmetros e endpoints sem controlador externo; (c) como duas histórias podem se diferenciar apesar de compartilhar transdutor; (d) se vínculos são Upro ou outra operação legitimamente anterior às Upro, evitando introduzir um novo tipo de representação disfarçado.

**Contraexemplo:** criar vínculo transdutor→Uint por chave `channel:interval` apenas renomeia o lookup; falha. Outro: toda incidência do mesmo transdutor alcança A e B indistintamente; falha seletividade.

### C2. Encontro por propriedades operacionais das unidades
Incidências propagam-se por um meio com acoplamento local às propriedades e estados funcionais das Uint, sem seleção por rótulo. A dinâmica da unidade decide resposta; competição ou restrições de recursos podem contribuir, mas não devem ser acrescentadas apenas para forçar A/B. É preciso demonstrar de onde vêm as propriedades diferenciadoras, sua persistência e sua função causal. `threshold` só é legítimo como operação real de integração/ativação, não campo declarativo.

**Contraexemplo:** `if (signature===A) activate(uA)` ou varredura de padrões codificados externamente é lookup disfarçado. Uma busca computacional por todas as Uint não é automaticamente inválida: só é legítima se implementa acoplamento operacional justificado, e não uma classificação fornecida pelo observador.

### C3. Propagação exclusivamente por Upro constituídas
O sinal alcança alguma estrutura inicial via transdução; a ativação se propaga pelas Upro anteriores até organizações persistentes. É necessário demonstrar a **primeira ponte** entre transdutor e domínio; Upro entre Uint não resolve essa ponte por si. Também é necessário impedir que a origem da propagação seja escolhida por um reconhecedor programado.

**Contraexemplo:** Upro com entrega real, mas ativação inicial de sua Uint-fonte ainda vem de `features`; acesso aparente continua dependente do lookup.

### C4. Reconstituição sem reacesso
O sistema recria organização semelhante a cada incidência. Serve como hipótese nula/controle; pode produzir respostas semelhantes e até reutilizar parâmetros, sem continuidade da mesma organização.

### C5. Participação difusa não discriminativa
A incidência excita várias organizações anteriores, sem distinção entre A/B. Pode ser acesso amplo, mas não comprova seletividade específica. Testar sem impor seletividade como requisito universal de representação.

## Uma distinção importante
Uma **interface transdutiva estável** pode ser condição legítima de possibilidade: sua persistência não é representação pré-instalada. Entretanto, escolher a Uint-alvo em função de um padrão codificado no controlador de entrada não é interface neutra; é o fenômeno terceirizado. Uma **Upro que parte da interface** exige revisão do contrato, pois a factory atual aceita somente endpoints Uint; não alterar silenciosamente esse contrato.

## Testes discriminantes e critérios de bloqueio
1. Congelar mecanismo e regras antes do ensaio; registrar quais parâmetros são infraestrutura e quais emergem.
2. Confirmar duas organizações distinguíveis *sem* instanciá-las por fora; se falhar, relatar condição não satisfeita.
3. A→B→A e A→B→B; controlar tempos e intensidades; não entregar os rótulos A/B ao motor.
4. Observar cadeia sinal→transdução→acoplamento/propagação→ativação de organização anterior→efeito posterior; proibir `features.get(...).unit` ou equivalente como origem da ativação.
5. Ablacionar A após constituição; manter B e transdução; observar diferença na operação atribuída a A. Incluir ablação B como controle. Ablação externa é instrumento de teste, não mecanismo constitutivo.
6. Permutar IDs e nomes de canal, mantendo propriedades funcionais relevantes; detectar escolhas arbitrárias. Canal físico pode ser diferença transdutiva legítima, não descartar por definição.
7. Testar sinal novo C, variação de intensidade e pequenas alterações de intervalos, além de ausência de incidência.
8. Inspecionar todas as chamadas de factory e trajetórias de ativação; evitar que observador, logs ou visualizador influenciem o mecanismo.
9. Distinguir existência da Uint, reativação, utilização operacional, reacesso seletivo e representação segundo tríade CLEAR. Nenhum único teste prova a tríade.

## Decisão recomendada (condicional)
**Não implementar ainda um reconhecedor alternativo.** Primeiro elaborar o contrato de interface transdutora↔domínio e demonstrar operacionalmente a primeira ponte, mantendo C1–C3 como alternativas concorrentes. Uma implementação candidata deve passar em auditoria de atalhos *antes* de rodar A→B→A. Se C1 exigir ampliar Upro a endpoints transdutivos ou criar outra classe de vínculo, registrar a mudança como hipótese constitutiva e submetê-la à aprovação, não como refatoração trivial.

## Estatuto das afirmações
**Documentado no código:** lookup e campos inertes. **Dedução condicional:** necessidade de algum mecanismo de continuidade/acoplamento para acesso seletivo. **Hipóteses:** C1–C3. **Contraexemplos:** C4–C5 e lookups disfarçados. **Não demonstrado:** mecanismo endógeno suficiente, reacesso representacional, necessidade de Upro específica, satisfação da tríade, originalidade científica.

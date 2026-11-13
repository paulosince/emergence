# EMERGENCE V0.14 — Estudo independente do mecanismo de reacesso (12/11/2026)

**Estatuto:** análise de código, deduções e hipóteses concorrentes; não implementação nem validação de representação. **Fase:** elaboração independente, sem incorporação bibliográfica. **Base examinada:** cópia de `src/core.js` no diagnóstico V0.14; histórico preservado em `audit-and-diagnostic.md`.

## Pergunta delimitada
Após incidências transduzidas constituírem duas organizações candidatas distinguíveis (A e B), a reapresentação de A provoca participação operacional da organização anterior de A por operações próprias de Uint/Upro, sem reconhecedor externo, sem recriação imposta e sem seleção pelo observador?

A e B são nomes de condições do experimentador, **não rótulos entregues ao sistema**. Não pressupor que as organizações já sejam representações.

## 1. Reconstrução do código atual
- `transduce(raw)` calcula `intensity = log1p(amplitude)`; a intensidade não entra na decisão de formação, na seleção da Uint ou no disparo de Upro.
- `lastByChannel` armazena o instante anterior; `features` usa a chave textual `channel:interval`; `hits` conta recorrências.
- Ao atingir `repeat`, `UintFactory.create` cria objeto com `channel`, `interval`, `threshold`, `activation`; a tabela recebe `f.unit`.
- A incidência posterior recupera diretamente `f.unit` e incrementa `activation`, sem verificar `threshold`. **Logo, o lookup é o seletor de qual unidade participa; não há operação da própria Uint que discrimine incidência corrente.**
- `recent` e `transitions` acumulam pares de ativações e intervalos; `UproFactory.create` cria relação orientada após `linkRepeat`. `pending` e `deliverUntil` produzem entrega temporal real ao alvo, mas a escolha do alvo ainda depende das ativações produzidas pelo lookup.
- `proof.kind='endogenous'` é um marcador fornecido pelo próprio chamador, não autenticação independente da cadeia causal.
- `report()` drena pendências até infinito, portanto não deve ser usado como medida do estado no instante de uma reapresentação sem distinguir eventos futuros.

## 2. Falha de identificação experimental
A observação “mesmo ID da Uint A aumenta activation após A reapresentado” é compatível com duas explicações:
- Hlookup: o índice programado seleciona o objeto já armazenado;
- Hacesso: operações constitutivas do domínio fazem a incidência alcançar a organização anterior.
No motor atual, Hlookup explica integralmente o evento. Portanto o diagnóstico não discrimina Hacesso.

Além disso, a sequência A (sensor-1) → B (sensor-2) → A, com fases afastadas e `maxGap` curto, não formou Upro. Logo, a afirmação “acesso à organização relacional” não foi sequer colocada à prova.

## 3. Decomposição operacional sem circularidade
**Entrada:** propriedades do sinal transduzido, não identidade representacional preatribuída.
**Constituição:** mecanismos determinam se/quando criar Uint/Upro e seus parâmetros concretos.
**Persistência:** a organização continua disponível como estado operacional do sistema.
**Encontro:** incidência corrente alcança a organização anterior por operação física/computacional interna; nenhuma busca do observador decide qual organização.
**Participação:** a organização alcançada efetivamente altera processamento subsequente.
**Discriminação:** A reapresentado e B reapresentado não mobilizam indiscriminadamente as mesmas organizações; controles de sinal novo, perturbação e ablação.
Nenhum desses passos, isoladamente, é definição suficiente de representação segundo a tríade CLEAR (organização especificadora, fundamentação transdutiva, determinação autônoma).

**Cuidado:** exigir “reconhecimento prévio de A” para permitir acesso a A seria circular. O encontro deve ser definido por operações anteriores à identificação representacional.

## 4. Hipóteses concorrentes, sem escolha de implementação
- **H0 (lookup):** o reacesso aparente é seleção externa por chave; remover lookup extingue o efeito.
- **H1 (propagação relacional):** incidências ativam estruturas transdutoras e percorrem Upro já constituídas, alcançando outras Uint. Necessita explicar como a primeira organização é alcançada sem lookup e demonstrar especificidade.
- **H2 (acoplamento por propriedades operacionais):** propriedades e estados efetivos das Uint participam diretamente do acoplamento com incidências; necessita demonstrar que não é um comparador de padrões A/B codificado sob outro nome.
- **H3 (constituição recorrente sem acesso):** cada reapresentação produz uma nova estrutura funcionalmente semelhante; a similaridade de saída não implica identidade nem participação da organização anterior.
- **H4 (participação difusa):** incidências afetam muitas organizações sem seleção específica; pode haver propagação e memória sem reacesso discriminativo.
- **H5 (reacesso relacional sem representação):** uma organização anterior participa seletivamente, mas a tríade representacional não é satisfeita.

H1/H2 são possibilidades operacionais a investigar, **não soluções aprovadas**; H3–H5 são contraexemplos e limites de inferência. Não acrescentar componente, regra, indexação ou roteamento para forçar H1/H2.

## 5. Testes discriminantes candidatos
1. **A→B→A e A→B→B**, com transdução idêntica e sem identidade simbólica A/B entregue ao motor; preservar a trilha causal de cada incidência.
2. **Sinal novo C** após A/B: observar se há constituição nova, participação difusa ou seleção específica.
3. **Permutar nomes/IDs dos canais** mantendo propriedades e temporalidade, para detectar seleção por identidade arbitrária; interpretar com cuidado porque canal físico pode ser propriedade transdutora legítima.
4. **Igualar quantidade/intensidade e alterar intervalos**; comparar organizações e acesso.
5. **Interromper seletivamente organização candidata A** *após constituição*, sem reprogramar mecanismo: verificar se a operação atribuída ao acesso a A desaparece, preservando B e a transdução.
6. **Controle de reconstituição:** medir criação de novas Uint/Upro e identidade operacional das antigas, sem confundir identidade do objeto com representação.
7. **Remover instrumentação/observador**: a dinâmica constitutiva e de acesso não pode depender de relatórios, etiquetas ou visualização.
8. **Congelar regras e parâmetros** antes de ver os resultados; registrar resultados negativos e mudanças prospectivas.

A ablação é uma intervenção experimental externa legítima quando segregada da condição constitutiva; seu efeito isolado não prova representação.

## 6. Bloqueios antes de programar
- Justificar a fronteira entre estado auxiliar legítimo e **seleção constitutiva substituída por índice**. Um mapa não é ilegítimo por sua estrutura de dados, mas é ilegítimo quando executa a função que se pretende demonstrar como própria da malha.
- Explicar operacionalmente como o primeiro contato de uma incidência com uma Uint previamente constituída ocorre; não ocultar o problema em `findUnit`, tabela, limiar de similaridade, callback ou observador.
- Definir como uma Uint distingue entrada de mera entrega Upro e como seu `threshold` atua, se for funcionalmente necessário; não atribuir função retrospectiva a campos inertes.
- Garantir duas organizações realmente distinguíveis; se o mecanismo não as constituir, declarar a condição experimental não atingida em vez de semeá-las.
- Exigir trilha sinal → transdução → operações → participação de organização anterior → efeito subsequente.
- Antes de alterações constitutivas, concluir pré-experimento e registrar hipótese e mecanismo candidato; não converter diagnóstico exploratório em pré-registro retrospectivo.

## 7. Conclusão atual
**Demonstrado por inspeção:** o motor atual usa `features[channel:interval].unit` para recuperar diretamente a Uint; `threshold` não determina ativação; `intensity` não determina criação ou acesso; o ensaio A→B→A não formou Upro. **Inferência:** o resultado é explicado por lookup, não discrimina acesso efetivo. **Aberto:** que operações internas podem permitir encontro e participação específica da organização anterior sem introduzir reconhecedor programado? Não selecionar solução nem afirmar impossibilidade.

**Decisão metodológica:** manter V0.14 em estudo constitutivo até resolver essa questão, preservando o código V0.13 como evidência histórica e sem “limpeza” destrutiva que disfarce a lacuna.

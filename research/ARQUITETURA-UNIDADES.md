# Arquitetura constitutiva — unidades e propriedades

**Versão:** registro inicial da terceira geração, 11/11/2026. **Status:** especificação de pesquisa, não contrato implementado ou teoria validada.  
**Regra:** não importar automaticamente mecanismos dos motores V1/V2. Distinguir **[D] decisão do responsável**, **[H] hipótese**, **[A] aberto**, **[L] mecanismo de literatura não adotado**, **[I] convenção de implementação**. Conflitos exigem reconciliação explícita.

## 1. Organização geral

O objetivo é investigar a constituição autônoma de um Sdom, sem unidades representacionais pré-programadas. Na condição inicial relevante, há **Utrd operacionais na borda, mas nenhuma Upro nem Uint constituída**. A **Pcrt** é uma predisposição constitutiva pré-representacional: deve permitir a criação conjunta das primeiras relações e unidades sem circularidade.

A constituição de um grafo adaptativo não demonstra representação. A tríade CLEAR exige organização especificadora, fundamentação transdutiva e determinação autônoma. A validade desta interpretação deve ser examinada e não presumida.

## 2. Incidência

| Propriedade | Estado | Especificação |
|---|---|---|
| Origem | [D] | Nasce de transdução na Utrd ou, em estágios pertinentes, de propriedade marca-passo. |
| Magnitude na borda | [D] recente | Valor fixo na transdução; intensidade física **não** é codificada diretamente pela amplitude de uma incidência. |
| Magnitude após Upro | [D] recente | Confiança × modulação. **Substitui, para a arquitetura candidata, ganho independente**; implementação anterior não deve ser reescrita retroativamente. |
| Efeito | [D] histórico | Excitação/inibição são efeitos acrescentados pelas unidades; combinação por soma algébrica. Relação exata com a formulação recente da magnitude requer reconciliação. |
| Tempo | [D] | Instante de emissão e chegada; atrasos de propagação são operacionalmente relevantes. |
| Frequência | [D] recente | Propriedade de **sequências** de incidências, não de uma incidência isolada. |

## 3. Utrd — unidade transdutora

**Papel [D]:** fronteira entre propriedades físicas e incidências internas. A Utrd não deve atribuir previamente significado representacional a estímulos.

| Propriedade/mecanismo | Estado | Descrição |
|---|---|---|
| Canal e posição física | [D] | Vinculados ao transdutor; identificadores opacos para o motor. |
| Limiar de transdução | [D] recente | Limiares graduados permitem recrutamento de diferentes vias. |
| Codificação da intensidade | [D] recente | Pela **quantidade de Upro efetivamente recrutadas**. Não confundir possibilidades de recrutamento com Upro já constituídas. |
| Emissão de incidências | [D] | Em resposta a condições físicas transduzidas. |
| Codificação da frequência | [A] | Investigar incidências por unidade de tempo, sincronização/phase locking, múltiplas vias e limites físicos. |
| Adaptação do limiar/sensibilidade | [A] | Não presumir mecanismo ou taxa. |
| Topologia física e conectividade | [A] | Proximidade pode favorecer; não obriga mapa representacional pré-programado. |
| Efeito excitatório/inibitório acrescentado | [D] histórico | Unidades podem acrescentar efeito, mas não são obrigadas. Reconciliar com contratos novos. |

**Problema inicial:** como Utrd que emitem incidências sem Upro constituídas tornam possível o primeiro evento constitutivo sem criar uma ligação oculta?

## 4. Upro — unidade propagadora

**Papel [D]:** relação operacional dirigida que propaga incidências entre origem e destino. **Não existe Upro sem origem e destino.**

| Propriedade | Estado | Descrição |
|---|---|---|
| Origem e destino | [D] | Referências efetivas, nunca destinos fictícios. |
| Atraso | [D] | Tempo de propagação; depende de distância e velocidade quando aplicável. |
| Velocidade | [D/H] | Pode adaptar-se ao uso; lei e limites específicos ainda requerem especificação. |
| Confiança, c | [D] recente | Propriedade aprendida; pode nascer alta; aumenta com confirmação, diminui com contradição observável; **não decai pela ausência de contato**. |
| Estabilidade, s | [D] recente | É **a própria marca de consolidação**, sem segunda marca intrínseca pressuposta. Cresce com condições de consolidação e recorrência espaçada; decaimento basal depende do grau de estabilidade. |
| Consolidação, C | [D] recente | `C = c × s`; classes efêmera, estável e consolidada; `C = 0` implica poda. |
| Magnitude transmitida | [D] recente | `c × modulação`, sujeita à definição operacional da modulação e dos limites numéricos. |
| Efeito excitatório/inibitório | [D] histórico | Efeito acrescentado à incidência pela unidade, não necessariamente sinal inerente à ligação. |
| Confirmação e contradição | [A] | Definir sem oráculo, distinguindo inibição, atrasos, indisponibilidade e ausência de evidência. |
| Decaimento até zero | [A] | Definir extinção em tempo finito ou assintótica; não introduzir limiar arbitrário sem aprovação. |
| Captura modulada tardia | [A] | Não adicionar marca de elegibilidade independente sem demonstrar necessidade. |
| Valores iniciais c/s | [A] | Determinar mecanismo de inicialização, não apenas escolher números. |

**Conflito documentado:** V2 emprega ganho multiplicativo independente; terceira geração formula confiança × modulação. Não afirmar equivalência sem prova.

## 5. Uint — unidade integradora

**Papel [D]:** integra contribuições que chegam por **pelo menos duas Upro diferentes**, ainda que compartilhem a mesma Utrd de origem.

| Propriedade | Estado | Descrição |
|---|---|---|
| Aferências | [D] | Duas ou mais Upro convergentes. |
| Integração temporal | [D] | Avaliar tempos de chegada, incluindo atrasos das Upro, não apenas emissões. |
| Limiar de integração | [D] recente | Inicialmente baixo em Uint jovem, aumenta com maturação. |
| Critério exato de coincidência | [A] | Janela, efeito da inibição e forma da integração requerem mecanismo demonstrável. |
| Maturação | [A] | Lei de elevação do limiar, dependência de uso e condições-limite. |
| Propriedades próprias de confiança/estabilidade | [A] | Não presumir duplicação das propriedades das Upro. |
| Descarga e propagação | [D] histórico | Integra efeitos e pode disparar; forma e amplitude precisam ser reconciliadas com decisões recentes. |
| Marca-passo | [D] histórico | Propriedade possível de unidades em fases pertinentes; não confundir com existência inicial de Uint. |
| Neuromodulação | [D/H] | Algumas Uint podem desempenhar função moduladora; constituição pelas regras gerais é requisito da formulação recente. |

## 6. Pcrt — predisposição constitutiva

**[D]** Não é representação pronta nem Sdom preexistente. Deve tornar possível a constituição **conjunta** da primeira Uint e de pelo menos duas Upro com destinos reais.

**[A] Questão prioritária:** como detectar, acumular e selecionar condições iniciais de convergência quando ainda não existem Upro e Uint? Candidatos de investigação (não aprovados): dinâmica precursora transitória; detecção física direta; formação exploratória com seleção posterior. Comparar circularidade, custo, suficiência e necessidade; não escolher pela elegância.

**[A]** Repetições espaçadas e novidade/terceiro fator foram investigados como candidatos em discussões anteriores, mas **não são pressupostos necessários para o primeiro nascimento**.

## 7. Neuromoduladores

**[D] Cinco tipos considerados:** acetilcolina (ACh), noradrenalina (NE), dopamina (DA), serotonina (5-HT) e adenosina. **[D]** A arquitetura contempla dispersão espacial, liberada por unidades integradoras moduladoras. Não transformar substância em mera descrição JSON.

| Tipo | Estado da inclusão | Funções candidatas — NÃO inferir aprovação específica |
|---|---|---|
| Acetilcolina | [D] incluída | Plasticidade, estados de vigília/sono, atenção; mecanismos e receptores a determinar. |
| Noradrenalina | [D] incluída | Novidade/surpresa e mudanças de regime; a especificar operacionalmente. |
| Dopamina | [D] incluída | Consolidação e aprendizagem; não introduzir recompensa/valia antes da fase pertinente. |
| Serotonina | [D] incluída | Papel funcional, receptores, fontes e dinâmica **em aberto**. |
| Adenosina | [D] incluída | Pressão de sono e modulação; origem glial e implicações éticas ainda exigem investigação. |

**[D] Difusão espacial:** aprovada historicamente; consultar `docs/spatial-diffusion-v0.1.md`. **[A]** coeficientes, unidades físicas, fontes, receptores, alcance, recaptação, interações e condições de emergência das fontes na terceira geração.

**Conflito:** documento antigo `docs/modulatory-units-v0.1.md` propõe fontes neuronais predefinidas e gliais por território; formulação recente pede Uint moduladoras constituídas por regras gerais. Não resolver silenciosamente; fontes gliais e possibilidade de Sdom adicional são hipóteses de investigação, não decisões incorporadas.

**Terceiro fator:** pode favorecer processos de consolidação; **não implica automaticamente marca de elegibilidade**. Sua dinâmica não é parte do experimento imediato de nascimento das primeiras Uint/Upro, salvo dependência demonstrada.

## 8. Questões abertas e testes prioritários

1. Condições mínimas para a primeira constituição conjunta sem circularidade.
2. Coincidência inicial com Utrd isoladas, pares, emissões espaçadas, atrasos distintos e fontes indistinguíveis.
3. Mecanismo de seleção de origem/destino e de inicialização de c, s, atraso e limiar.
4. Transdução de frequência e intensidade sem Upro predefinidas.
5. Contradição verificável e decaimento de estabilidade sem confundir falta de contato com evidência negativa.
6. Reconciliar magnitude/efeito/gain com documentação antiga.
7. Funções e parâmetros de cada neuromodulador; fontes gliais; difusão e receptores.
8. Separar constituição de estrutura, constituição representacional e validação da tríade CLEAR.

**Escopo atual:** primeira constituição a partir da borda. Consolidar, modular e podar são etapas posteriores, embora constem aqui para preservar decisões.

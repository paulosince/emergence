# V0.17 — Investigação de escala: incidências, ramos, grau e janelas

**Responsável pelas hipóteses H1/H2 e pelas decisões:** Paulo Rogério da Silva.  
**Investigação, leitura de código, instrumentação e confronto bibliográfico:** assistente (GPT-6).  
**Data:** 17/11/2026.  
**Estatuto:** INVESTIGAÇÃO, não pré-registro e **não é decisão de mecanismo**.  
**Origem:** ramo `claude/pre-v17-ramos`, commit `ae76050c`. Diagnósticos isolados no ramo `investigacao-escala`. O ramo `perf-motor-par` e os motores originais NÃO foram modificados.

## 0. Convenções epistemológicas e limites

- **[R]** hipótese, decisão ou pergunta do responsável; não confundir com evidência.
- **[C]** conferido no código ou saída de execução reproduzível. *Resultado de engenharia* não implica validação científica.
- **[L]** fonte externa consultada, identificada na matriz bibliográfica.
- **[A]** inferência ou proposta do assistente, **não aprovada**.
- **Leitura TI:** página do artigo integral acessada em HTML; examinei seções metodológicas/resultados pertinentes, **não** necessariamente cada linha do artigo.
- **Leitura RT:** resumo e trechos recuperados, mas texto integral não foi efetivamente inspecionado.
- **Leitura R:** apenas resumo e metadados. **H:** resultado já registrado no repositório, reutilizado sem nova verificação primária.
- **Confiança:** alta = contagem direta/reprodução do código ou dado explicitamente medido na fonte e população especificada; média = estimativa experimental indireta/limites de amostra; baixa = extrapolação/modelagem, leitura apenas secundária ou poucos pontos.
- Nenhum limite, critério, força, duração, janela, regra de brotamento, tipo de convergência, ordem das somas, classe ou código científico foi alterado. Os testes A–E não são uma nova campanha científica pré-registrada.

## 1. Pergunta do responsável e hipóteses concorrentes

**H1 — custo guiado por incidências [R]:** o trabalho deveria seguir primordialmente eventos sensoriais, cuja taxa física é limitada pelo número de unidades transdutoras e frequência de emissão. O crescimento potencialmente gigantesco da estrutura não deveria obrigar a comparar todos os ramos entre si.

**H2 — grau local e janela [R]:** possíveis limites locais de saída/entrada, rastro vivo e regiões anatômicas de comparação; fatias paralelas respeitariam causalidade e vizinhança. Pergunta aberta: uma janela descartaria incidências sem exame?

**Contrapontos levantados a testar:** (i) um evento com `p` destinatários não custa `O(1)`: mesmo simuladores orientados a eventos costumam requerer trabalho proporcional ao fan-out; (ii) `grau limitado` não significa mesmo grau em espécies e tipos celulares; (iii) atividade fora da janela sináptica pode modificar plasticidade por traços mais longos ou participar de reativação em outras redes; (iv) o paralelismo biológico não garante que duas CPUs executem exatamente a mesma aritmética de ponto flutuante ou mantenham ordem causal.

## 2. O que o código realmente faz — A/E

Fonte primária: `toy-experiments/v17/ensaio-minimo/motor_par.py`, copiado e instrumentado **apenas em módulo temporário**, contra o motor original no mesmo job. Código e logs reproduzíveis: `investigacao_escala_medidas.py`, `investigacao_escala_grave.py` e [workflow A–E](../../.github/workflows/investigacao-escala-medicoes.yml).

### 2.1 Não é matriz incidência × incidência

- A cada pulso `tA[idx]`, o motor copia `a=dA[:nA]` e `b=dB[:nB]`; percorre **todos os pares de ramos** `(i,j)` em `nA × nB`.
- Calcula `alvo=t+a[i]-b[j]`, busca no `tB` inteiro com `searchsorted` o pulso mais próximo e registra `gap`. Pares com `gap<=W=0,21 ms` chamam `_V(T,...)`.
- `_V` examina eventos de ambas as vias com **tempos de emissão** em `[T-21-H, T+1]` ms, expandindo cada evento pelos ramos da respectiva Upro. Só acumula contribuição se a **chegada atrasada** satisfizer a janela da excitação (0–1,5 ms) ou inibição (0–5τ da condição).
- A persistência `qk1/qk2/qv` conta quase-acertos de **pares de atrasos**, não conserva uma lista ilimitada de incidências passadas. **Esses contadores são inicializados antes dos cinco episódios e não têm carimbo de expiração temporal; acumulam/reiniciam contagens de quase-acertos através de longos silêncios entre episódios.** Isso é diferente da regra teórica de comparar somente **rastros vivos**: o toy guarda evidência agregada entre episódios mesmo quando a incidência original já expirou. A malha de ramos também se acumula e muda em episódios sucessivos. [C, leitura direta; não alterar sem decisão científica.]
- `searchsorted` busca num vetor `tB` que já contém o **episódio inteiro**, inclusive pulsos posteriores ao instante `tA[idx]`. [A] Essa antecipação na execução offline precisa ser examinada ao exigir equivalência com uma arquitetura causal online (pode-se calcular a coincidência após a chegada futura, sem poder antecipar o disparo).

**Conclusão [C+A]:** a matriz inicial é ramo × ramo por pulso, não incidência × incidência. Contudo `_V` multiplica cada avaliação candidata pelas emissões recentes e respectivos ramos. Para custo, distinguem-se `N_pulsos`, `nA*nB`, fração W, avaliações `_V` e iterações internas por avaliação. Não afirmar que uma taxa física limitada torna o custo automaticamente limitado.

### 2.2 Medição curta, agudo idealizado, semente 1

Cinco episódios de **120 ms cada**; isto não exercita estabilização de longo prazo. Todas as comparações exibidas abaixo entre cópia instrumentada e motor original passaram por **igualdade EXATA de todos os campos expostos**, sem tolerância.

| Métrica [C] | I0 | I1 | I2 |
|---|---:|---:|---:|
| Pulsos de A processados | 869 | 869 | 869 |
| Ramos finais A+B | 66 | 54 | 58 |
| Relações distintas creditadas | 832 | 560 | 650 |
| Pares de ramos examinados | 388.529 | 324.094 | 331.065 |
| Passaram W | 229.419 | 187.641 | 192.325 |
| Fração W | 59,05% | 57,90% | 58,09% |
| Iterações internas de `_V` | 387.569.546 | 274.567.985 | 287.233.921 |
| Iterações por `_V` | 1.689,35 | 1.463,26 | 1.493,48 |
| Contribuições excitatórias | 25.119.090 | 17.822.786 | 18.630.847 |
| Contribuições inibitórias | 0 | 17.585.981 | 18.382.990 |
| Média de valores distintos de T por pulso | 148,42 | 123,65 | 126,58 |
| Brotamentos | 54 | 42 | 46 |
| Estabilizações | **0** | **0** | **0** |
| Classe emitida pelo código | explosao | explosao | explosao |

Em I1, **apenas 6,49%** de todas as iterações internas satisfazem a condição de contribuição excitatória; as inibitórias são contadas separadamente e podem coincidir com elas. **As janelas já existem**, mas a faixa escolhida para varredura, multiplicada pelos ramos, faz muitas verificações que não contribuem.

O valor global de ~56–59% de candidatos aceitos por W é compatível, em ordem de grandeza, com a heurística `2W/p` de pulsos periódicos densos (p ~0,6–0,9 ms). **Não é igualdade teórica:** há jitter, atrasos variáveis, bordas e crescimento da estrutura. A proporção no grave ainda não foi medida aqui de modo equivalente; não transportar ~8% como resultado observado.

**Atenção científica:** classe `explosao` é calculada pelo motor assim: `ramos>100 OU relacoes>200`, desde que `tot>0`; por isso os três casos de 120 ms são classificados como explosão **pela contagem de relações**, apesar de menos de 100 ramos finais. O fato é computacional; sua interpretação como achado científico da V0.17 requer confrontá-lo com o pré-registro e condições experimentais válidas. Não confundir relações distintas creditadas com Uint estabilizadas.

### 2.3 Crescimento e proporção dos custos

Um único caso I1, semente 1, saltou de 324.094 pares (120 ms) para **21.960.202 pares (1.000 ms)**, fator 67,76 para duração 8,33 vezes maior; expoente descritivo ~1,99 em dois pontos [A, confiança **muito baixa** para inferir lei de escala]. **Não demonstrou crescimento exponencial**; tampouco demonstra uma lei quadrática permanente.

Em 1.000 ms na condição I1, já observado previamente em engenharia: 137 ramos finais e 125 brotamentos; 0 estabilizações, máximos A/B 49/88, e 12.358.787 pares passaram W. O perfil original marcado teve ~90,6% do tempo na avaliação de excitação/inibição. O experimento I0 da presente investigação também terminou com 137 ramos finais, 1.858 relações e exatamente 21.960.202 pares, 12.358.787 passando W, mas **resultado científico e perfis da condição I1 não podem ser inferidos do I0**.

**Tabela de curva independente**: atualizar somente com jobs finalizados; não confundir tempos de runners distintos com comparação direta de desempenho.

| Condição, agudo, 5 episódios | Original | Cópia instrumentada | Pares | Equivalência |
|---|---:|---:|---:|---|
| I1, 120 ms | registro no log | registro no log | 324.094 | exata |
| I0, 1.000 ms | 53,809 s | 55,340 s | 21.960.202 | exata |
| I1, 2.000 ms | 139,270 s | 135,995 s | 35.839.172 | exata |
| I1, 3.000 ms | **pendente de término** | **pendente** | não medido | não declarada |

Os jobs de 2 s e 3 s têm timeout **60 minutos cada**. Uma execução encerrada por limite não permite inventar resultado final nem observação de grau máximo.

### 2.3A Dados consolidados da etapa A/B/D (execuções verificadas)

**Condições:** agudo idealizado, cinco episódios, semente 1, exceto na seção dos 70 casos do grave. Igualdade *exata*, sem tolerância, entre motor original e cópia instrumentada em **todas** as linhas concluídas. Condição/versão de entrada distintas não devem ser interpretadas como uma só série temporal.

| Condição/duração por episódio | Pulsos A | Ramos finais | Relações | Pares testados | Dentro de W | Iterações de _V | Ramos estabilizados | Tempo original / instrumentado |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| I0 / 120 ms | 869 | 66 | 832 | 388.529 | 229.419 (59,05%) | 387.569.546 | 0 | logs A–E |
| I1 / 120 ms | 869 | 54 | 560 | 324.094 | 187.641 (57,90%) | 274.567.985 | 0 | logs A–E |
| I2 / 120 ms | 869 | 58 | 650 | 331.065 | 192.325 (58,09%) | 287.233.921 | 0 | logs A–E |
| I0 / 1.000 ms | 6.656 | 137 | 1.858 | 21.960.202 | 12.358.787 (56,28%) | 49.704.457.582 | 0 | 53,809 / 55,340 s |
| I1 / 1.000 ms | 6.656 | 137 | 1.858 | 21.960.202 | 12.358.787 (56,28%) | 49.704.457.582 | 0 | 142,713 / 150,607 s |
| I2 / 1.000 ms | 6.656 | 198 | 2.512 | 40.544.426 | 22.917.312 (56,52%) | 127.888.920.713 | 0 | 228,282 / 226,982 s |
| I1 / 2.000 ms | 12.802 | 112 | 1.370 | 35.839.172 | 19.155.581 (53,45%) | 63.846.154.862 | 0 | 139,270 / 135,995 s |

**Interpretação [C/A]:** não se estabelece lei quadrática a partir de 120 ms e 1 s: em I1, 2 s produziu **112 ramos finais**, menos que os **137** de 1 s. Cada duração reamostra a sequência de estímulos; não se trata de prolongar uma mesma trajetória fixa. Na condição I2/1 s, há 198 ramos e 40,5 milhões de pares; os dados rejeitam tratar o custo observado em I1 como representativo de todas as condições de inibição. **Os tempos variam por runner; apenas original versus instrumentado no mesmo job é comparação instrumental controlada.**

**Frações de contribuição efetiva:** I1/120 ms percorreu 274.567.985 combinações em _V, mas só 17.822.786 satisfizeram o suporte excitatório (6,49%); em I1/1 s, 3.189.320.273 de 49.704.457.582 (6,42%). Há custo substancial em avaliar pares que não contribuem. Contudo, qualquer tentativa de pular operações necessita preservar a mesma sequência e ordem de somas flutuantes.

**Pulso a pulso — I1, 1.000 ms**, contagens agregadas por episódio:

| Episódio | Pulsos A | nA inicial→máx | nB inicial→máx | Pares por pulso (média) |
|---|---:|---|---|---:|
| 1 | 1.287 | 6→43 | 6→47 | 973,55 |
| 2 | 1.368 | 43→49 | 47→74 | 3.026,14 |
| 3 | 1.373 | 49→49 | 74→88 | 3.813,22 |
| 4 | 1.276 | 49→49 | 88→88 | 4.312,00 |
| 5 | 1.352 | 49→49 | 88→88 | 4.312,00 |

O número de pulsos por episódio é **limitado pelo estímulo**, enquanto o número de **pares calculados por pulso** cresce com os ramos candidatos. O motor de hoje executa o produto dos ramos mesmo quando uma pequena fração das iterações de _V produz contribuição.

**B — a classe “explosão” não é contagem de ramos necessariamente:** I0/I1/I2 de 120 ms possuem apenas 66/54/58 ramos, mas registram 832/560/650 relações, excedendo o limiar **relações>200**. Nos três casos de 1 s, **ramos>100 e relações>200** são ambos verdadeiros. A classe, portanto, não deve ser lida como número absoluto de ramos ou comprovante de inviabilidade fisiológica.

**D — 70 referências históricas do grave medidas de novo:** 10 sementes × 7 condições. Instrumento versus motor original **e** motor original versus CSV de referência: **70/70 coincidências exatas**. Contagem de transições para ramo estabilizado (detectadas quando _marcar efetivamente muda \`est\` de falso para verdadeiro):

| Condição | Ramos estabilizados | Sementes com alguma estabilização | Classificação relevante |
|---|---:|---:|---|
| I0 | 0 | 0/10 | resultados históricos variam |
| I1 | 0 | 0/10 | 8/10 “seleção”, **sem estabilização** |
| I2 | **6** | **3/10** (sementes 4, 5, 9) | **10/10 “colapso”**, apesar dos ramos estabilizados |
| I3 | 0 | 0/10 | “colapso” |
| F | 0 | 0/10 | “colapso” |
| F-imatura | 0 | 0/10 | “colapso” |
| F-madura | 0 | 0/10 | “colapso” |
| **Total** | **6** | **3/70** | não confundir seleção, crédito e estabilidade |

Na I2, semente 4, estabilizaram 2 ramos A + 2 B; na semente 5, 1 ramo A; na semente 9, 1 ramo A. **O classificador “colapso” é acionado porque o crédito contabilizado nos últimos 200 pulsos do último episódio é zero. Não significa ausência de ramos sobreviventes.** Analogamente, “seleção” significa a regra operacional do classificador de crédito, **não consolidação de estrutura**. Este é um problema de interpretação dos resultados históricos que deve ser levado ao responsável, sem mudar a definição científica em silêncio.


### 2.4 MAXR=512 versus interrupção com soma >300 [C]

- `_brotar(...)` só insere quando `n<MAXR`. Em `n==512`, tentativas de criar novos ramos são recusadas, sem exceção.
- O teste de borda realizado no ramo separado `perf-motor-par` verificou este comportamento com arrays artificiais; esse teste não equivale a atingir 512 numa execução natural.
- **Não é rigorosamente impossível atingir 512:** o teste `if nA+nB>300: break` fica **ao fim do processamento de um pulso**, após o laço de quase-acertos que pode criar diversos ramos dentro do mesmo pulso. Uma Upro poderia, em princípio, ultrapassar 300 ramos nesse único processamento antes da verificação; `MAXR` continuaria ativo.
- Nos casos naturais de 120 ms e I0/I1 de 1 s concluídos até o momento não houve acionamento de MAXR nem parada por soma>300; a ausência nos restantes precisa ser confirmada a partir das saídas.
- Alterar `MAXR`, a regra >300 ou restringir brotamento constitui mudança científica **não autorizada**.

## 3. Trilha 1 — engenharia, só propostas, resultado IDÊNTICO

**Possibilidades [A], ainda não implementadas:**

1. Evitar percorrer estados sem evento novo, **desde que** preserve estado e ordem causal do motor atual. A operação só é removível se provadamente não altera nenhuma contribuição relevante.
2. Reduzir cópias/alocações por pulso, sem alterar ordem, precisão, arredondamento, eventos ou condições de emissão.
3. Pré-indexar janelas e percursos `_V` para evitar varrer chegadas impossíveis, mas preservar a **mesma sequência e ordem de adições**. Cache de soma, soma vetorizada ou incremental pode mudar erro em ponto flutuante; **não adotar se divergir em qualquer campo**.
4. Paralelizar sementes independentes sem alterar números; paralelizar pares dentro do mesmo pulso demanda agregação ordenada e equivalência exata, não garantida por duas CPUs.
5. Para as 384 vias, **somente desenho** de adjacência pré-computada da vizinhança anatômica já decidida (entre orelhas mesma faixa ±2; dentro da orelha faixas vizinhas ±2 e três limiares da mesma faixa), processamento por eventos e buffers limitados de incidências. Nenhum código novo do modelo é autorizado por este documento.

**Questão aberta:** a soma de todos os ramos em `_V` pode ser referenciada por estrutura de índice sem reordenar adições; isso precisa de prova e validação bit a bit. A otimização vem após nova autorização.

## 4. Trilha 2 — confronto bibliográfico de H1 e H2

### 4.1 Hipótese 1: custo por incidência, espalhamento e custo físico

**[L]** Em axônio real, um potencial de ação se propaga fisicamente pelos colaterais em paralelo temporal: não há uma CPU central percorrendo todos os pares de axônios. **Mas** cada extensão de membrana, botão e evento de transmissão impõe custos de energia, espaço e transmissão. Attwell e Laughlin (2001) estimaram, para córtex de roedor e hipóteses de taxa média, aproximadamente **47%** do orçamento em potenciais de ação e **34%** em efeitos pós-sinápticos; são **estimativas de modelo**, não frações universais medidas diretamente. Eles também usaram um valor aproximado de **8.000 botões por neurônio cortical típico**, dependente de literatura anterior e médias amplas; não é limite de uma Upro. [Confiança alta na atribuição dos percentuais ao modelo; baixa para extrapolação a vias auditivas.]

**[L]** Brette et al. (2007) analisam explicitamente simuladores dirigidos a eventos: custo aproximado proporcional a **frequência média de disparo × número de neurônios × conectividade média**, com custo adicional de filas. Logo, *event-driven* remove muitas atualizações inúteis, **mas não elimina o fan-out**. O texto também demonstra que precisão temporal pode alterar dinâmica e plasticidade — argumento contra trocar ordem/cálculo por velocidade sem validação.

**[L]** Loihi (Davies et al., 2018) e BrainScaleS-2 (Pehle et al., 2022) fornecem precedentes de roteamento de eventos a destinatários e integração local, inclusive conectividade hierárquica, atrasos e plasticidade. São precedentes **computacionais**; não validam Pcrt, HCMT ou a ontologia do Sdom.

**[L]** A via auditiva tem limites físicos por fibra, mas **não há limite global fixo de taxa para todos os tipos celulares**. Em camundongos CBA, um estudo de Wang, Ren e Manis (2010), citando Taberner e Liberman (2005), registra **200–400 disparos/s como máximos sustentados de fibras auditivas** [fonte primária da faixa não relida integralmente: confiança média]. Não confundir **frequência acústica**, **sincronização de fase** e **taxa de potenciais de ação individuais**. A revisão de Verschooten et al. (2019) salienta incertezas e diferenças por espécie; não há medida fisiológica direta equivalente em nervo auditivo humano para todos os cortes propostos.

**[H]** `investigacao-convergencia.md`, seção 6, já registra cerca de **30–34 mil fibras por orelha em humanos**, com origem Makary et al. (2011). Não refiz a contagem nem afirmo que 384 vias da V0.17 sejam 384 fibras anatômicas idênticas. O produto ilustrativo 60 mil × (200–400) = 12–24 milhões de eventos por segundo **mistura contagem humana e faixa de taxas de camundongo**, supõe todas as fibras simultaneamente no máximo e é, portanto, só uma **cota hipotética grosseira [A, confiança baixa]**, jamais taxa medida em humanos. Nosso `trem` agudo idealizado (~0,6–0,9 ms por período) também **não é um modelo fisiológico validado de disparo individual**.

**Síntese H1 [A]:** crítica ao exame do produto cartesiano de ramos é forte; conclusão “custo deve depender só de incidências” é **forte demais**. Uma formulação para testar, não decidir: custo proporcional a **eventos efetivamente distribuídos × conectividade local relevante**, mais plasticidade/custo de busca e roteamento, sem varreduras globais. O evento de entrada pode ser finito, mas fan-out pode crescer até atingir outro orçamento físico.

### 4.2 Hipótese 2: grau local, janelas, poda e paralelo

**[L] Entradas por neurônio (não “ramos por Upro”):** Cao e Oertel (2010), em cortes de **camundongo**, estimaram `≤3` aferentes excitatórios em pequenas bushy (geralmente 2), ~5 em bushy globulares, média 6,5 em T-stellate e **>60** em octopus [resumo e trechos; alta para valores relatados, média para generalizar]. Couchman, Grothe e Felmy (2010) estimam **mínimo de 4–8 entradas excitatórias e 2–4 inibitórias por célula MSO de gerbil adulto**, em estudo in vitro [TI; confiança média por caráter de estimativa e limite inferior].

**[L] LSO — precedente adicional e contraexemplo de universalidade:** Walcher, Hassfurth, Grothe e Koch (2011), em **gerbilos e camundongos P10/P18**, não observaram mudança significativa no número estimado de aferentes inibitórios após o início da audição. Por análise de degraus, médias de **3,1±0,4 (P10)** e **2,8±0,4 (P18)** no gerbilo, e **4,0±0,6 (P10)** e **3,45±0,3 (P18)** no camundongo; por razão de condutâncias, estimativas maiores. [**RT**, texto completo da editora bloqueado na abertura, porém resultados indexados; confiança média para números reportados e limitada para inferir "número real"]. Haragopal, Voytek e Winters (2025), na **LSO de camundongo**, registram diferenças de propriedades intrínsecas entre dois tipos de neurônio principal, mas **número semelhante de entradas independentes** entre esses tipos, com ressalva de que estimativas eletrofisiológicas fornecem limites inferiores; um artigo anterior estimara até **~40 entradas excitatórias e ~8 inibitórias** por métodos distintos. [Resumo integral e trechos de resultados indexados; **RT**, confiança média]. Este contraste impede interpretar a convergência da LSO como um único número anatômico definitivo.

**[L] Córtex humano, exame complementar:** Shapson-Coe et al. (2024), reconstrução de um fragmento de córtex temporal humano (de cirurgia de epilepsia), descrevem milhares de conexões fracas e **raras conexões fortes de até ~50 sinapses entre um par de células**. [**R/RT**, resumo PubMed e trechos indexados; confiança alta para o relato, baixa para qualquer extrapolação populacional ou equiparação a "ramo"]. Isso reforça a necessidade de distinguir contagem de contatos entre duas células de fan-out total de um axônio.

**[L] Contatos de UM aferente não equivalem a número de aferentes:** Callan et al. (2021), **gerbil P21–P30**, observam uma mediana de **4 sítios de contato** entre um único axônio e um dendrito MSO, com várias zonas de liberação por sítio [TI; alta nesse preparado]. Esse precedente proíbe igualar diretamente um `ramo` a uma fibra, botão, contato, zona ativa ou saída independente sem especificar equivalência.

**[L] Contraexemplos a um grau universal pequeno:** em células de coincidência da **coruja**, revisão de Ashida e Carr (2011) relata ordem de **100–300 aferentes na NL**, contra ~4–8 estimados na MSO de gerbil; a confirmação primária específica da faixa 100–300 não foi reaberta aqui [RT, confiança média]. Reconstruções de **39 neurônios/afluentes em V1 de gato** (Binzegger, Douglas e Martin, 2004) informam **975–9.641 sinapses de saída por neurônio** [RT; confiança média]. Em **células de Golgi cerebelares de camundongos adultos, 2–5 meses**, Tabuchi et al. (2019) mapearam **~6.000–7.500 botões por axônio** em **4 células reconstruídas** [TI, confiança alta dentro da pequena amostra]. Logo, conectividade e custo local variam enormemente por tipo celular e espécie.

**[L] Poda/refinamento:** Hoffpauir et al. (2006) descrevem formação rápida do cálice de Held e quase mono-inervação em camundongos antes da audição; Holcomb et al. (2013) documentam competição precoce até predomínio de uma entrada em dias pós-natais — **contraexemplo a exigir que toda especificação venha apenas da experiência sonora** [resumo e trechos]. Rodríguez-Contreras et al. (2008) observaram em **ratos neonatos** formação, retração e modificação de **até 65% dos colaterais durante 1 h**; isso é proporção de **dinâmica de colaterais de calyces jovens**, não taxa geral de poda sináptica do cérebro [TI; alta para a amostra, baixa para extrapolação]. Kapfer et al. (2002), bem como Kandler e Gillespie (2005), sustentam refinamento anatômico dependente da experiência nas vias inibitórias auditivas, mas as condições e mecanismos variam por circuito [R/RT].

**[L] Limites por custo:** modelos de orçamento energético (Attwell & Laughlin, 2001) e de cabeamento cortical (Chklovskii, Schikorski & Stevens, 2002), além da revisão de economia de redes (Bullmore & Sporns, 2012), sustentam compromissos entre função, comprimento de fio, volume, atraso e energia. **Não estabelecem** um teto numérico universal para ramos por Upro; tampouco autorizam transformar o limite computacional `MAXR=512` num número neurobiológico.

**[L] Janelas com funções DISTINTAS:**
1. **Coincidência/integração eletrofisiológica:** submilissegundos a poucos ms nas vias auditivas rápidas; por exemplo, em camundongo Cao & Oertel (2010) reportam largura à meia-altura de **~0,5 ms** em EPSCs de células bushy e **0,8–0,9 ms** em outros tipos. Trata-se de **corrente pós-sináptica**, não prazo de armazenar incidências do Sdom.
2. **Traços de plasticidade:** segundos em paradigmas de estriado, córtex e hipocampo, com terceiro fator (Gerstner, Lehmann, Liakoni, Corneil & Brea, 2018, texto integral de revisão consultado). **Traço de elegibilidade não é memória exata do evento bruto nem janela da Uint**.
3. **Retenção e reativação de redes:** estados persistentes, disparo recorrente e *replay* podem reintroduzir atividade muito depois da coincidência; Buzsáki (2015, resumo/trechos) documenta reativação hipocampal em ondas agudas-ripples nos estados offline. **Não há evidência de que a V0.17 implemente isto.** A repetição interna foi explicitamente adiada com as relações entre Uint.

Essa distinção complementa — não repete como se fosse novo — a seção 4.2.2 do `pre-experimento.md`, que já lista elegibilidade de segundos, marcação sináptica e reativação mais longa. O valor adicional aqui é separar **janela de coincidência**, **janela de elegibilidade** e **reentrada de um novo evento por circuito**, sem supor equivalência.

### 4.3 Uma janela deixaria incidências sem análise?

**Depende da definição operacional de “analisar” [A].** Se cada nova incidência é examinada contra **todos os rastros ainda vivos**, a expiração de um rastro encerra sua elegibilidade para *novas coincidências imediatas*. Uma incidência expirada não integra mais uma ocorrência que só chegou **depois de expirar**; isso não é bug por si, mas uma **fronteira constitutiva** a explicitar e testar. Incidências que nunca geraram pares favoráveis devem permanecer documentadas como não acomodadas, não ser silenciosamente contadas como representadas.

No código atual já há `W=0,21 ms` para coincidência e suporte físico finito em `_V`; a seleção de emissões usa `T-21-H` até `T+1` ms e atrasos de ramo limitados por `DMAX=20 ms`. **Essas são janelas diferentes**: [A] uma fila online precisaria conservar emissões enquanto puderem gerar chegadas e efeitos, e decidir o destino depois que os atrasos pertinentes forem conhecidos. Janela curta sobre **emissões**, sem considerar `DMAX` e o suporte de excitação/inibição, pode perder relações reais, quebrando equivalência. Por exemplo, para uma chegada em T, o corpo atual permite contribuições de emissões com idade da ordem de **DMAX + H**; em F-imatura, H pode atingir 20 ms. Este é limite de suporte da formulação atual, não novo parâmetro recomendado.

**Repetição interna adiada:** não usar *replay* como “solução escondida” para incidências expiradas. Se uma relação não se constituiu no primeiro contato, estruturas já consolidadas ou traços moleculares ainda poderiam influenciar futuros eventos noutro modelo, mas isso requer mecanismo próprio. Na V0.17 não há segundo nível entre Uint; os silêncios têm só decaimento. Uma janela de rastros não é, sozinha, armazenamento/replay.

### 4.4 Fatias paralelas e vizinhança ±2

**[L]** O sistema auditivo possui mapas tonotópicos e vias paralelo-convergentes; a anatomia fornece uma restrição espacial biológica real, não um produto cartesiano de todo o sistema. O desempenho de NEST e neuromórficos aproveita agrupamentos locais e comunicação por evento, mas existe custo nas **fronteiras** de partição e na propagação de atrasos.

**[A]** Fatias tonotópicas contíguas com **sobreposição de ±2 faixas** podem preservar a vizinhança decidida, desde que pares entre fronteiras sejam avaliados **uma vez só** e que atrasos/eventos sejam entregues na ordem causal relevante. Isso é **desenho para comparação**, não mecanismo autorizado. Há duas possibilidades distintas:
- **Engenharia:** dividir cálculo sem mudar um único par, tempo, soma ou regra; igualdade exata indispensável.
- **Mudança científica:** cada fatia tornar-se unidade causal com sua própria janela/memória e comunicação: muda o modelo, exige deliberação e pré-registro. Não misturar com paralelismo de CPU.

## 5. Matriz de fontes e estado real da leitura

**Rigor:** TI significa que o **texto integral estava acessível e examinei partes relevantes**; não alego leitura linha a linha. RT = resumo e trechos; R = apenas resumo. Links são reais e identificados por título/autor/ano; fontes prévias do repositório são assinaladas H. Números referem-se às espécies, idades e tipos celulares indicados, não ao humano por generalização.

| Fonte | Ano / autores verificados | Link | Leitura | Sustenta / limita | Confiança |
|---|---|---|---|---|---|
| *Simulation of networks of spiking neurons: A review of tools and strategies* | Brette et al., 2007 | https://pmc.ncbi.nlm.nih.gov/articles/PMC2638500/ | **TI**, seções 2.4, complexidade e precisão | Evento × fan-out; filas; diferenças de precisão | Alta para fórmula de custo apresentada; média para implementação V0.17 |
| *An Energy Budget for Signaling in the Grey Matter of the Brain* | David Attwell; Simon B. Laughlin, 2001 | https://doi.org/10.1097/00004647-200110000-00001 | **RT**, resumo e corpo indexado; abertura integral instável | Custo axonal/sináptico; 47%/34% estimados em modelo para córtex de roedor | Alta para modelo publicado; baixa para extrapolação |
| *Synaptic energy use and supply* | Julia J. Harris; Renaud Jolivet; David Attwell, 2012 | https://doi.org/10.1016/j.neuron.2012.08.019 | **R** | Revisão de custo sináptico/metabólico | Média qualitativa |
| *Loihi: A Neuromorphic Manycore Processor with On-Chip Learning* | Mike Davies et al., 2018 | https://doi.org/10.1109/MM.2018.112130359 | **RT**; resumo e trechos públicos; PDF não inspecionado | Fan-out/roteamento e plasticidade em hardware | Alta para existência; média para detalhes |
| *The BrainScaleS-2 Accelerated Neuromorphic System With Hybrid Plasticity* | Christian Pehle et al., 2022 | https://doi.org/10.3389/fnins.2022.795876 | **TI**, texto HTML e sistema/roteador | Eventos encaminhados a endereços locais, plasticidade híbrida | Alta para arquitetura publicada |
| *Axonal delay lines for time measurement in the owl's brainstem* | Catherine E. Carr; Masakazu Konishi, 1988 | https://doi.org/10.1073/pnas.85.21.8311 | **R** | Linhas de atraso biológicas, sem analogia automática à Pcrt | Média |
| *Endbulb synaptic depression within the range of presynaptic spontaneous firing and its impact on the firing reliability of cochlear nucleus bushy neurons* | Yong Wang; Chongyu Ren; Paul B. Manis, 2010 | https://pmc.ncbi.nlm.nih.gov/articles/PMC2997871/ | **TI** | Faixa 200–400/s citada de Taberner & Liberman; depressão sináptica | Média para taxa citada; alta para contexto |
| *Response properties of single auditory nerve fibers in the mouse* | Annette M. Taberner; M. Charles Liberman, 2005 | https://doi.org/10.1152/jn.00574.2004 | **R**; taxa via Wang 2010 | Taxas em fibra individual de camundongo, não transdutor genérico | Média |
| *The upper frequency limit for the use of phase locking to code temporal fine structure in humans: A compilation of viewpoints* | Eric Verschooten et al., 2019 | https://pmc.ncbi.nlm.nih.gov/articles/PMC6524635/ | **TI** | Limites/controvérsias de sincronização de fase e espécies | Alta para existência da controvérsia |
| *Auditory nerve fibers excite targets through synapses that vary in convergence, strength, and short-term plasticity* | Xiao-Jie Cao; Donata Oertel, 2010 | https://doi.org/10.1152/jn.00451.2010 | **RT**; página integral bloqueou abertura, resumo com números | Bushy ~2/5, T-stellate 6,5, octopus >60 em camundongo | Alta para números do resumo; média para generalização |
| *Medial Superior Olivary Neurons Receive Surprisingly Few Excitatory and Inhibitory Inputs with Balanced Strength and Short-Term Dynamics* | Kiri Couchman; Benedikt Grothe; Felix Felmy, 2010 | https://pmc.ncbi.nlm.nih.gov/articles/PMC6634925/ | **TI** | MSO de gerbil **adulto**, ≥4–8 excit., ~2–4 inibit. (estimativas) | Média para estimativa; alta para relato |
| *Arrangement of Excitatory Synaptic Inputs on Dendrites of the Medial Superior Olive* | Alexander R. Callan; Martin Heß; Felix Felmy; Christian Leibold, 2021 | https://pmc.ncbi.nlm.nih.gov/articles/PMC7810653/ | **TI** | Gerbil **P21–P30**, mediana 4 sítios por axônio-dendrito | Alta para amostra; baixa para teto global |
| *Pathway-Specific Drive of Cerebellar Golgi Cells Reveals Integrative Rules of Cortical Inhibition* | Sawako Tabuchi; Jesse I. Gilmer; Karen Purba; Abigail L. Person, 2019 | https://pmc.ncbi.nlm.nih.gov/articles/PMC6381242/ | **TI** | 6.000–7.500 botões/axônio em 4 células, camundongo **adulto 2–5 meses** | Alta no grupo; baixa para generalização |
| *A Quantitative Map of the Circuit of Cat Primary Visual Cortex* | Tom Binzegger; Rodney J. Douglas; Kevan A. C. Martin, 2004 | https://pmc.ncbi.nlm.nih.gov/articles/PMC6729898/ | **RT**; PMC bloqueou abertura integral | 975–9.641 sinapses por neurônio reconstruído, V1 gato | Média |
| *Synaptogenesis of the Calyx of Held: Rapid Onset of Function and One-to-One Morphological Innervation* | Brian K. Hoffpauir; Janelle L. Grimes; Peter H. Mathers; George A. Spirou, 2006 | https://pmc.ncbi.nlm.nih.gov/articles/PMC6675295/ | **RT** | Crescimento rápido, em grande parte antes da experiência auditiva; **contraexemplo H2 forte** | Alta para cronologia do artigo |
| *Synaptic Inputs Compete during Rapid Formation of the Calyx of Held: A New Model System for Neural Development* | Paul S. Holcomb et al., 2013 | https://doi.org/10.1523/JNEUROSCI.1087-13.2013 | **RT**; texto PMC bloqueou abertura | Competição e mono-inervação em dias, não taxa universal de poda | Média |
| *Dynamic development of the calyx of Held synapse* | Adrián Rodríguez-Contreras et al., 2008 | https://pmc.ncbi.nlm.nih.gov/articles/PMC2291093/ | **TI** | Até 65% dos colaterais mudam em 1 h, **ratos neonatos** | Alta para relato; baixa para extrapolação |
| *Experience-dependent refinement of inhibitory inputs to auditory coincidence-detector neurons* | Christoph Kapfer; Armin H. Seidl; Hermann Schweizer; Benedikt Grothe, 2002 | https://doi.org/10.1038/nn810 | **R** | Refinamento de posições inibitórias com experiência | Média |
| *Developmental refinement of inhibitory sound-localization circuits* | Karl Kandler; Deda C. Gillespie, 2005 | https://pmc.ncbi.nlm.nih.gov/articles/PMC4120098/ | **RT**; abertura PMC bloqueada | Revisão de trajetórias de refinamento das vias auditivas | Média |
| *Wiring optimization in cortical circuits* | Dmitri B. Chklovskii; Thomas Schikorski; Charles F. Stevens, 2002 | https://doi.org/10.1016/S0896-6273(02)00679-7 | **R/RT**; resumo + trechos indexados | Custo de fio, atenuação e atraso, não limite numérico Upro | Média |
| *The economy of brain network organization* | Ed Bullmore; Olaf Sporns, 2012 | https://doi.org/10.1038/nrn3214 | **R** | Trade-off entre custo de conexões e integração | Média qualitativa |
| *Eligibility Traces and Plasticity on Behavioral Time Scales: Experimental Support of NeoHebbian Three-Factor Learning Rules* | Wulfram Gerstner; Marco Lehmann; Vasiliki Liakoni; Dane Corneil; Johanni Brea, 2018 | https://doi.org/10.3389/fncir.2018.00053 | **TI**, texto HTML e seções experimental/discussão | Traços de segundos; três fatores; diferente de coincidência imediata | Alta para distinção funcional |
| *Hippocampal sharp wave-ripple: A cognitive biomarker for episodic memory and planning* | György Buzsáki, 2015 | https://pmc.ncbi.nlm.nih.gov/articles/PMC4648295/ | **R/RT**; resumo e trechos, abertura HTML bloqueada | Replay/reativação em circuito recorrente, não presente na V0.17 | Média qualitativa |
| *Comparative posthearing development of inhibitory inputs to the lateral superior olive in gerbils and mice* | Jan Walcher; Benjamin Hassfurth; Benedikt Grothe; Ursula Koch, 2011 | https://doi.org/10.1152/jn.01087.2010 | **RT**; resumo PubMed e trechos indexados do corpo, abertura integral bloqueada | Gerbilos/camundongos **P10 e P18**, número estimado de aferentes inibitórios sem mudança significativa pós-audição | Média: números fisiológicos indiretos, amostras pequenas |
| *Synaptic Drive onto Inhibitory and Excitatory Principal Neurons of the Mouse Lateral Superior Olive* | Hariprakash Haragopal; Mara J. Voytek; Bradley D. Winters, 2025 | https://doi.org/10.1523/ENEURO.0106-25.2025 | **RT**; resumo PubMed e trechos indexados do corpo, abertura integral bloqueada | Camundongo: tipos celulares da LSO têm entradas independentes semelhantes, diferenças de excitabilidade e inibição; grau estimado depende do método | Média para relato, baixa para teto numérico |
| *A petavoxel fragment of human cerebral cortex reconstructed at nanoscale resolution* | Alexander Shapson-Coe et al., 2024 | https://doi.org/10.1126/science.adk4858 | **R/RT**; resumo PubMed e trechos indexados, sem texto integral aberto | Fragmento de córtex temporal humano: conexões entre pares podem atingir ~50 sinapses; exemplar cirúrgico específico | Alta para relato; baixa para generalização |
| *Synaptic integration in dendrites: exceptional need for speed* | Nace L. Golding; Donata Oertel, 2012 | https://doi.org/10.1113/jphysiol.2012.229328 | **R** | Integração auditiva temporal muito rápida | Média |
| *Tonotopic reorganization of developing auditory brainstem circuits* | autoria a verificar no original desta rodada | https://pmc.ncbi.nlm.nih.gov/articles/PMC2780022/ | **RT**, seções do corpo recuperadas; abertura bloqueada | MNTB pré-estruturado; MSO inibitória experiencial | Média; autoria não afirmada |
| *Loss of C1q alters the auditory brainstem response* | autoria não conferida nesta rodada | https://pmc.ncbi.nlm.nih.gov/articles/PMC11480778/ | **R** | Possível papel de microglia/complemento; **não usado como prova quantitativa** | Baixa |

**Reuso auditável [H]:** `toy-experiments/v17/investigacao-convergencia.md`, seção 6, já registra números humanos e suas ressalvas; `pre-experimento.md`, seção 4.2.2, já trata elegibilidade e reativação. Este documento não substitui esses registros nem converte suas estimativas em medidas novas.

## 6. Confronto explícito e contraexemplos

| Hipótese [R] | Evidência favorável [L] | Evidência contrária / alcance [L] | Inferência [A], não decisão |
|---|---|---|---|
| H1: custo ligado às incidências | paralelismo axonal físico; atualização por eventos em Brette/Loihi/BrainScaleS | custo de fan-out e energia; taxa × sinapses na revisão de simuladores; alguns axônios possuem milhares de botões | abandonar produto cartesiano global parece justificável como proposta; custo restante ~eventos×grau relevante, **não só** eventos |
| H2: grau local limitado | MSO gerbil poucos aferentes; pequeno número bushy; restrições anatômicas e energia | octopus >60, NL coruja 100–300 (secundária), 975–9.641 contatos de saída em V1 gato; 6–7,5 mil botões por axônio Golgi | estudar grau **por tipo/localidade**; sem teto universal decidido |
| H2: poda mantém grau sob controle | cálice de Held, refinamento de inibição MSO, dinâmica de colaterais | cálice forma conexão dominante pré-auditiva; grande arborização preservada noutros circuitos; escalas distintas | poda e estabilização não equivalem automaticamente à redução do número de ramos por Upro neste motor |
| H2: janela de rastro vivo | EPSCs rápidas; condições de coincidência finitas; traços de elegibilidade | janelas longas moduladas, reativação por circuitos superiores; perda de eventos se corte for inadequado | distinguir janela de chegada, coincidência e elegibilidade; sem replay na V0.17 |
| H2: paralelismo por fatias | tonotopia, feixes locais, event routers | comunicação/limites entre fatias, atrasos e ordem de somas | partições com halo ±2 são candidatas **de engenharia**; a partição como mecanismo científico é outra hipótese |

## 7. O que seria novo, e o que falta para alegar

**Já existe [L]:** simulação orientada a eventos, roteamento de disparos para contatos, detectores com linhas de atraso, integrações locais com graus variados, plasticidade e poda dependente de atividade, mapas tonotópicos, traços de elegibilidade e reativação em redes recorrentes. **Esses princípios isolados não constituem novidade.**

**Seria potencial contribuição do EMERGENCE [R+A, NÃO demonstrada]:** uma regra constitutiva única, aplicada a incidências não acomodadas e apenas a uma vizinhança física pré-definida, produzir crescimento seletivo de Upro/Uint com reutilização e sem classes de convergência dadas, além de exigir que a computação seja causal e auditável. A existência de precedentes de auto-organização estrutural ainda precisa ser investigada de modo específico; **não reivindicar originalidade**.

**Lacunas para demonstração:** pré-registro congelado; primeira Pcrt operacional multivia; condições N1–N5, P1–P6 (atualmente propostas [A], não aprovadas); distinção por emissão; ramos em Uint diferentes; reflexões a/b; estabilização real; reacesso; separação de coincidência física de aliasing; limites e causalidade dos rastros; comparação com baselines e literatura de redes com crescimento. A etapa A–E diagnostica **custo do toy**, não supre esses requisitos.

## 8. Pendências / decisões reservadas ao responsável

1. **Engenharia:** entender por que `_V` visita tantas combinações sem contribuição, preservando rigorosamente a ordem das somas; não propor adoção automática de cache/soma incremental.
2. **Engenharia:** conferir com saídas de 2 s e 3 s — se concluírem — o estágio onde ramos dominam e possíveis limites; a medição não pode ser substituída por projeção.
3. **Ciência:** decidir *se* deve existir limite local de grau, e a que entidade ele se aplica (Upro, Uint, contato, ramo, alvo, conexão); não transferir números de gerbil/camundongo/córtex diretamente à V0.17.
4. **Ciência:** decidir sem circularidade o que é “rastro vivo” e se o prazo deve ser por modalidade, latência máxima ou elemento; não converter o `H` de implementação em regra teórica por acidente.
5. **Ciência:** testar a hipótese de partições locais causalmente independentes em vez de presumir que paralelização de CPU corresponda a organização biológica.
6. **Ciência:** distinguir seleção de relações no toy de **estabilização** de ramos e constituição representacional; não considerar valores de “explosão” uma refutação/validação científica sem condições e critérios pré-fixados.

**Estado final:** documento de investigação, sem decisão científica nem modificação do motor. Resultados eventualmente ainda pendentes da curva de 2/3 s não serão apresentados como medidos até job terminar com artefato íntegro.

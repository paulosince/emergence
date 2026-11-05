# EMERGENCE — Acoplamento físico e modalidades sensoriais (v0.1)

**Estatuto:** instrumento experimental mínimo implementado e testado. Não equivale a visão, audição, tato humano, interocepção ou constituição de representações.

## Finalidade

Este módulo transforma grandezas efetivamente produzidas pelo mundo analítico do item 3 em incidências numéricas. Não injeta eventos prontos nem fornece rótulos de objetos ao motor experimental.

A cena física é a esfera rígida acima de um plano, com queda, primeiro impacto e possível ressalto. O mundo continua existindo mesmo quando todas as modalidades estão desativadas.

## Duas modalidades operacionais

| Sensor | Modalidade | Grandeza | Localização | Amostragem | Latência |
| --- | --- | --- | --- | --- | --- |
| s0 | Óptica | Transmissão de luz normalizada (0 a 1) | Barreira a 0,70 m | 10 ms | 2 ms |
| s1 | Óptica | Transmissão de luz normalizada (0 a 1) | Barreira a 0,30 m | 10 ms | 3 ms |
| s2 | Mecânica | Impulso normal integrado (N·s) | Placa no plano de impacto | 10 ms | 4 ms |

O valor inicial dos três sensores é obtido por leitura, não imposto ao mecanismo de constituição.

**Óptica:** a primeira idealização é uma barreira colimada horizontal, alinhada ao eixo vertical da esfera. A transmissão é nula quando a distância entre o centro da esfera e a altura da barreira não excede o raio; em outros momentos, é unitária. A luz não sofre reflexão, difração ou atraso perceptível no modelo. Não há câmera, imagem ou retina.

**Mecânica:** a placa mede a soma dos impulsos normais durante cada janela temporal. O impulso decorre da conservação do momento linear e do coeficiente de restituição do mundo. A janela é igual ao período do sensor; assim, um evento é registrado em um único intervalo temporal. O resultado é N·s, e não uma força máxima em N. Não existe uma onda acústica sintética nem um valor de impacto introduzido por roteiro.

A placa é parte do aparato físico experimental; **não** é ainda um sensor interoceptivo de um corpo.

## Equações dos acoplamentos

Para a barreira à altura z, raio r e centro da esfera na altura c(t):

- Transmissão = 0 quando |c(t)-z| <= r.
- Transmissão = 1 caso contrário.

Para a placa com janela delta e leitura no instante t:

- Impulso medido = soma dos impulsos físicos em (t-delta, t].
- Um impacto ocorrido exatamente em t=0 entra na amostra inicial; nos intervalos posteriores, a borda esquerda é exclusiva.

Essas relações são mecanismos executados pelo software, não apenas metadados interpretados por uma visualização.

## Resultado esperado do cenário padrão

O mundo apresenta uma queda a partir de 1 m, gravidade 9,81 m/s², restituição 0,5 e termina no instante de 800 ms, antes da segunda colisão.

| Canal | Leituras que geram incidência (instante da amostragem: valor) |
| --- | --- |
| s0 | 0:1; 250:0; 290:1 |
| s1 | 0:1; 380:0; 410:1; 580:0; 780:1 |
| s2 | 0:0; 460:impulso positivo; 470:0 |

Portanto, há **11 incidências entregues** ao motor diagnóstico (com a política de emitir apenas mudanças). As cinco alterações observadas por s1 incluem a passagem na descida e no ressalto, sem que tenhamos programado uma sequência sensorial para isso.

O instante físico do impacto é aproximadamente 451,524 ms; o sensor mecânico o integra até a leitura de 460 ms e só entrega a medida depois da latência. As observações ópticas também têm suas próprias latências. A coerência está nas transformações do mundo, não na sincronização artificial dos sinais.

## Controles experimentais disponíveis

- Modalidades ativadas: óptica e mecânica, somente óptica, somente mecânica, ou nenhuma.
- Posição da barreira óptica (altura).
- Período e fase de amostragem de cada canal.
- Latência de entrega, resolução por quantização e ruído numérico.
- Emissão de todas as amostras ou somente de mudanças acima do limiar.
- Semente pseudoaleatória; fluxos de ruído independentes por transdutor.

Uma configuração de sensores desligados não interrompe a dinâmica do mundo. Parâmetros atribuídos a sensores desativados são rejeitados em vez de ignorados silenciosamente.

A medição de impulso usa janelas que não se sobrepõem. Quando o período de amostragem é alterado, a largura da janela é atualizada para preservar a interpretação física. Essa regra é uma decisão de instrumento documentada, não uma lei geral da transdução.

## Limites científicos e controles adversariais

- **Perda de fenômenos:** a barreira superior fica obstruída por aproximadamente 38 ms; uma amostragem a cada 100 ms pode não registrar sua obstrução.
- **Ausência de sensor:** sem sensores, não há incidências, mas há trajetória, intervenção de soltura e impacto para o avaliador.
- **Mudança de sensor:** mover a barreira altera observações ópticas sem alterar a colisão.
- **Atraso:** mudar a latência modifica a chegada da incidência, não o instante de amostragem nem o fenômeno.
- **Quantização:** modifica a medição sem modificar o impulso físico.
- **Fidelidade limitada:** nenhuma conclusão de validade fisiológica, acústica, visual, generalização a outros mundos ou formação de representações.
- **Horizonte físico:** mesmo sem sensores, não é permitida uma execução além da segunda colisão ainda não modelada.

A relação entre valores ópticos e mecânicos pode ser estudada, mas não estabelece por si só que um mecanismo constituiu a representação de uma causa comum. O motor diagnóstico não aprende.

## Fronteiras de informação

1. O mundo possui estado e eventos físicos.
2. O adaptador de acoplamento produz apenas grandezas fisicamente especificadas.
3. Os transdutores amostram, eventualmente quantizam, adicionam ruído e atrasam a entrega.
4. O motor recebe incidências com identificador do canal, medição e tempos, sem nome de modalidade, identidade da esfera, altura da barreira ou rótulo de colisão.
5. O manifesto guarda a verdade física para avaliação científica separada.

Não se confunde armazenamento de informações verdadeiras com conhecimento efetivamente constituído no domínio.

## Como executar

Requer Node.js 20+ e ESM nativo, sem build.

~~~sh
npm test
npm run experiment:world-senses
npm run experiment:world-senses:json > physical-sensing.json
npm run experiment:world-senses:csv > incidences.csv
npm run experiment:world-senses:trace > event-trace.csv
npm run experiment:world-senses:optical
npm run experiment:world-senses:mechanical
npm run experiment:world-senses:none
~~~

As saídas CSV ainda não formam o pacote científico completo de importação e replay; isso pertence à etapa 7.

## Arquivos e proveniência

- src/sensory/world-signals.js — acoplamentos físicos, validação de janelas e fronteiras.
- src/sensory/world-scenario.js — registro de sensores, configurações e modalidades selecionáveis.
- src/sensory/numeric-transducer.js — mecanismo numérico reutilizado.
- src/runtime/experiment-runner.js — relógio, agendamento e entrega.
- experiments/world-senses.js — comandos e exportação.
- tests/world-sensory.test.js — regressões, ablações e verificações.
- src/world/ — fenômeno analítico congelado em suas condições de validade.

TEMPO permanece **somente leitura**. Nenhum mecanismo de constituição de unidades ou representações foi introduzido nesta etapa.

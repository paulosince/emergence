# Unidades moduladoras, fontes de liberação, receptores e modulação cíclica

**Data:** 09/11/2026. **Pedido do responsável:** (1) unidades que enderecem a liberação de neuromodulação, com regras de criação e de liberação quando, no cérebro, forem neuronais, gliais etc.; (2) unidades moduladoras "na linha das moléculas", em partes por X, com regra de equivalência agnóstica de substrato; (3) modulação cíclica (sono e vigília, entre outras). **Método:** [metodologia do programa](program-methodology.md): mecanismo → simplificação → equivalência → perdas → teste. **Estado:** proposta minha, a aprovar. Fontes lidas por resumo e registros, salvo indicação.

## 1. Mecanismos bem conhecidos

### 1.1 Fontes de liberação
| Mecanismo | O que se sabe | Fonte |
|---|---|---|
| Núcleos moduladores neuronais | Poucos neurônios com projeções amplas: locus coeruleus (noradrenalina), área tegmental ventral e substância negra (dopamina), rafe (serotonina), prosencéfalo basal (acetilcolina), hipotálamo (histamina, orexina) | Conhecimento-padrão; fontes primárias por núcleo **a verificar** |
| Dois modos de disparo | Locus coeruleus: modo **fásico** (ligado a decisões, aproveitamento) e **tônico** (desengajamento, exploração); entradas do córtex cingulado anterior e orbitofrontal | Aston-Jones e Cohen (2005) |
| As fontes aprendem | A resposta da dopamina se transfere da recompensa para os sinais que a predizem (erro de predição) | Schultz, Dayan e Montague (1997) |
| Novidade nas fontes | O locus coeruleus responde à novidade ambiental e reforça a consolidação no hipocampo | Takeuchi et al. (2016) |
| Fonte glial | Astrócitos liberam adenosina; bloquear essa liberação reduz o acúmulo de pressão de sono, via receptor A1 (camundongo) | Halassa et al. (2009) |
| Território glial | Astrócitos ocupam territórios **em grande parte exclusivos**, com interdigitação nas bordas | Bushong et al. (2002) |
| Origem das fontes | Núcleos moduladores são especificados no desenvolvimento; no adulto mudam as **entradas** e os **receptores**, não o número de fontes | Leitura minha; **fonte a verificar** |

### 1.2 Transporte e remoção
| Mecanismo | O que se sabe | Fonte |
|---|---|---|
| Transmissão por volume | Monoaminas e neuropeptídeos agem sobretudo por difusão extrassináptica, não por contato sináptico | Agnati e Fuxe (desde 1986), por revisões |
| Difusão e recaptação | Para a dopamina estriatal, a difusão domina o alcance; os transportadores modulam o curso temporal (o peso relativo é debatido e varia por região) | Cragg e Rice (2004); Tao e Rice (2020), por citação |

### 1.3 Receptores e efeitos
| Mecanismo | O que se sabe | Fonte |
|---|---|---|
| Reconfiguração de circuitos | Moduladores alteram propriedades intrínsecas e força sináptica efetiva, reconfigurando a saída do circuito | Marder (2012) |
| Terceiro fator | Sinal modulador que, chegando durante a marca de elegibilidade, decide a mudança de peso | Frémaux e Gerstner (2016); Gerstner et al. (2018) |
| Ganho | Noradrenalina ajusta o ganho do processamento cortical | Aston-Jones e Cohen (2005) |
| Incerteza | Acetilcolina: incerteza esperada; noradrenalina: incerteza inesperada | Yu e Dayan (2005) |
| Dessensibilização e regulação | Dessensibilização em minutos; redistribuição em horas; regulação para baixo com exposição alta prolongada e para cima com exposição baixa | Revisões de farmacologia, sobretudo de receptores opioides; **generalização a todos os moduladores não verificada** |
| Dose e efeito | Efeito saturante com a concentração (curva dose-resposta) | Farmacologia-padrão; fonte específica não conferida |

### 1.4 Modulação cíclica
| Mecanismo | O que se sabe | Fonte |
|---|---|---|
| Relógio circadiano | Laço de transcrição e tradução com **retroalimentação negativa com atraso**, motivo comum entre espécies | Takahashi (2017) |
| Dois processos | Pressão homeostática (processo S) sobe na vigília e cai exponencialmente no sono; componente circadiano (processo C) de cerca de 24 h; os dois interagem | Borbély (1982); reavaliação de 2016 |
| Interruptor sono-vigília | Populações que promovem sono e vigília **se inibem mutuamente** (interruptor biestável); a orexina estabiliza; sua perda causa transições indevidas | Saper et al. (2001, 2005) |
| Pressão de sono química | Adenosina como mediadora da pressão de sono; fonte astrocitária | Porkka-Heiskanen et al. (1997, por citações); Halassa et al. (2009) |
| Sono e homeostase sináptica | O sono renormaliza a força sináptica líquida, aumentada pela aprendizagem na vigília | Tononi e Cirelli (2014) |
| Sono e consolidação | O sono favorece a retenção; acetilcolina alta na vigília favorece a codificação, baixa no sono de ondas lentas favorece a transferência do hipocampo ao neocórtex | Rasch e Born (2013); a parte da acetilcolina foi lida em **outra revisão** que os cita, não confirmada no texto deles |
| Estados do sono REM e sono não REM | Perfis distintos de moduladores por estado | **A verificar** |

## 2. Proposta pelo método

### 2.1 Unidade moduladora (a "molécula")
- **Mecanismo:** substância liberada que se difunde, é removida e age por receptores.
- **Simplificação:** cada modulador *m* é uma **concentração adimensional** em compartimentos, em **partes por X** da capacidade do compartimento (proposta: X = 10⁶, partes por milhão). O compartimento é a região em que a substância se mistura antes de ser removida.
- **Dinâmica proposta:** a cada descarga da fonte, soma-se um quantum *q* à concentração dos compartimentos que ela alcança; a concentração cai por remoção de primeira ordem com meia-vida τ (variante: recaptação saturável); compartimentos vizinhos trocam por difusão com acoplamento *D*.
- **Equivalência:** quando a mistura no compartimento é mais rápida que a remoção, o compartimento bem misturado equivale ao campo de difusão (apoio: a difusão domina o alcance, Cragg e Rice, 2004).
- **Perdas:** gradientes espaciais finos, o tempo de chegada de fontes pontuais e diferenças regionais de remoção. **Teste:** variante com vários compartimentos e difusão explícita.
- **Origem:** proposta nossa, com base em literatura.

### 2.2 Unidades de liberação (fontes)
**Fonte neuronal**
- **Mecanismo:** poucos neurônios, projeções amplas, modo tônico e fásico; as entradas aprendem (Schultz et al., 1997).
- **Proposta:** as fontes são **predefinidas pela arquitetura** (equivalente do desenvolvimento), uma por modulador e por sistema. Têm taxa tônica de base e surtos fásicos. Projetam para uma lista ampla de compartimentos.
- **Regra de criação:** **não há criação no adulto**. O que se constitui são as **entradas** das fontes: unidades constituídas podem ganhar aferência para a fonte pelas mesmas regras da malha. Isso reproduz a transferência da resposta para sinais preditivos.
- **Regra de liberação:** cada descarga libera *q*. O modo fásico é disparado pelos sinais internos (novidade quando nada acomoda; surpresa quando a espera falha); o modo tônico acompanha a média recente da incerteza.
- **Perdas:** diversidade de neurônios dentro do núcleo; cotransmissão. **Origem:** proposta nossa, com base em literatura; a criação apenas no desenvolvimento é leitura minha a verificar.

**Fonte glial (território)**
- **Mecanismo:** astrócitos com territórios em grande parte exclusivos; integram atividade local; liberam adenosina, que acumula pressão de sono.
- **Proposta:** o domínio é particionado em **territórios**. Cada território tem uma unidade glial que **integra lentamente** as descargas das unidades nele contidas e libera uma substância de pressão (equivalente da adenosina) no próprio compartimento.
- **Regra de criação:** quando o recrutamento de unidades faz um território exceder sua capacidade, ele se divide em dois. É uma proposta nossa, por equivalência com o ladrilhamento; **não verifiquei** como o número de astrócitos varia no adulto.
- **Perdas:** a comunicação entre astrócitos (acoplamento) e a variedade de gliotransmissores. **Teste:** variante com territórios fixos.

### 2.3 Receptores (nos alvos)
- **Mecanismo:** curva dose-resposta saturante; dessensibilização rápida; regulação lenta da densidade.
- **Proposta:** cada unidade ou relação tem, por modulador, um **perfil receptor**: limiar de meio efeito *K*, inclinação *n* (efeito = cⁿ/(cⁿ + Kⁿ)) e **alvo do efeito**:
  1. portão de plasticidade (terceiro fator);
  2. ganho ou limiar de disparo;
  3. taxa de mudança e rigor do teste de novidade;
  4. escalas de tempo dos traços.
- **Dessensibilização:** *K* sobe com exposição alta sustentada (minutos) e volta com exposição baixa.
- **Regulação lenta:** a densidade (multiplicador do efeito) desce ou sobe em horas a dias. É uma **forma de homeostase**, que preenche uma lacuna já registrada.
- **Regra de atribuição:** o perfil depende do **tipo e do nível arquitetural** da unidade, nunca do conteúdo (princípio da neutralidade de conteúdo).
- **Perdas:** subtipos de receptor e vias intracelulares. **Origem:** proposta nossa, com base em literatura.

### 2.4 Modulação cíclica
| Componente | Proposta agnóstica | Equivalência | Perdas |
|---|---|---|---|
| **Oscilador circadiano** | Laço de retroalimentação negativa com atraso entre duas variáveis, período de cerca de 24 h simuladas; ajustável por um canal do mundo (luz) | Mesmo motivo de rede do relógio (Takahashi, 2017) | Detalhe molecular; relógios por tecido |
| **Pressão homeostática** | Substância das unidades gliais: acumula com a atividade na vigília e é removida no sono | Processo S (Borbély, 1982); adenosina (Halassa et al., 2009) | Outras substâncias de pressão |
| **Interruptor de estado** | Dois conjuntos de unidades predefinidas que se inibem mutuamente (vigília × sono), com uma unidade estabilizadora; entradas: pressão (favorece o sono) e oscilador (alterna a propensão) | Interruptor biestável (Saper et al., 2001, 2005) | Circuitos do tronco; subestados |
| **Estados** | Vigília: entrada do mundo, moduladores altos, portão de plasticidade aberto à novidade. Sono: entrada do mundo atenuada; **reativação espontânea** de unidades consolidadas; **renormalização** (redução proporcional dos pesos) e poda do não confirmado | Homeostase sináptica (Tononi e Cirelli, 2014); consolidação no sono (Rasch e Born, 2013) | REM e não REM ainda não distinguidos (**a verificar**) |

**Consequências para lacunas já registradas:** a fase de sono dá **homeostase** (renormalização), **esquecimento do não confirmado** (poda) e **reativação sem transdução**, que é a base do detector de memória episódica.

## 3. Cuidado importante: a pressão de sono é uma variável regulada
A pressão homeostática é uma **variável regulatória interna** com ponto de ajuste. A rota pela assimetria regulatória do VALORE é exatamente a de variáveis reguladas. O envelope da fase do motor declara "variável regulatória: nenhuma".

Portanto **introduzir o ciclo sono-vigília muda o envelope**, e a decisão é do responsável. Opções:
1. **Ciclo imposto:** os estados alternam por um oscilador que o sistema não regula, sem pressão homeostática. Fica fora da rota regulatória, mas perde o processo S.
2. **Ciclo completo**, com pressão homeostática, tratado como variável regulatória: entra no envelope, com os detectores de Orientação e de valia ativos e a parada que falha fechada.
3. **Ciclo completo apenas depois** da fase do motor.

## 4. Decisões do responsável
1. Aprovar a unidade moduladora (concentração em partes por milhão por compartimento) e sua equivalência.
2. Fontes neuronais predefinidas com entradas constituídas; fontes gliais por território, com divisão por capacidade.
3. Perfil receptor por tipo e nível, com dessensibilização e regulação lenta (homeostase).
4. Quais moduladores na primeira versão: proposta mínima de **três** — novidade (equivalente da noradrenalina fásica e da dopamina por novidade), incerteza esperada (equivalente da acetilcolina) e pressão (equivalente da adenosina, só se o ciclo completo for aprovado). Moduladores de valor ficam para o objetivo de valia.
5. Ciclo sono-vigília: opção 1, 2 ou 3 da seção 3.
6. Aprofundar antes: estados REM e não REM, origem das fontes no desenvolvimento e regulação de receptores além dos opioides.

## Referências (verificadas quanto à existência; leitura por resumo)
- Aston-Jones, G., e Cohen, J. D. (2005). *Annual Review of Neuroscience* 28, 403–450.
- Borbély, A. A. (1982). A two process model of sleep regulation. *Human Neurobiology* 1, 195–204; Borbély, Daan, Wirz-Justice e Deboer (2016). *Journal of Sleep Research* 25, 131–143.
- Bushong, E. A., Martone, M. E., Jones, Y. Z., e Ellisman, M. H. (2002). *Journal of Neuroscience* 22(1), 183–192.
- Cragg, S. J., e Rice, M. E. (2004). DAncing past the DAT at a DA synapse. *Trends in Neurosciences* 27, 270–277.
- Frémaux e Gerstner (2016); Gerstner et al. (2018): ver [neuromodulação](neuromodulation-v0.1.md).
- Halassa, M. M. et al. (2009). Astrocytic modulation of sleep homeostasis and cognitive consequences of sleep loss. *Neuron* 61, 213–219.
- Marder, E. (2012). Neuromodulation of neuronal circuits: back to the future. *Neuron* 76(1), 1–11.
- Porkka-Heiskanen, T. et al. (1997). *Science* 276, 1265–1268 (**lido só por citações**).
- Rasch, B., e Born, J. (2013). About sleep's role in memory. *Physiological Reviews* 93(2), 681–766.
- Saper, C. B., Chou, T. C., e Scammell, T. E. (2001). The sleep switch. *Trends in Neurosciences* 24, 726–731; Saper, Scammell e Lu (2005). *Nature* 437, 1257–1263.
- Schultz, Dayan e Montague (1997); Takeuchi et al. (2016); Yu e Dayan (2005): ver [neuromodulação](neuromodulation-v0.1.md).
- Takahashi, J. S. (2017). Transcriptional architecture of the mammalian circadian clock. *Nature Reviews Genetics* 18, 164–179.
- Tononi, G., e Cirelli, C. (2014). Sleep and the price of plasticity. *Neuron* 81(1), 12–34.
- Agnati e Fuxe (transmissão por volume) e Tao e Rice (2020): lidos só por citações em revisões.

# Pré-registro v1 — fase do motor constitutivo e previsões direcionais da hipótese de organização do domínio

**Estado:** MINUTA **revisada em 09/11/2026** com as decisões do desenho do motor (registro em [decisões](decisions-log.md)), **APROVADO pelo responsável em 09/11/2026**. **Desvio 1 (09/11/2026):** a medida do critério de maturação passa a ser a fração de esperas que falharam (ver [calibração](calibration-v1.md)), porque a medida original deixava passar um sistema sem esperas. Após a aprovação, qualquer alteração é registrada como **desvio** (cláusula 26 do PPC), com data e justificativa, sem apagar o texto aprovado.

**Escopo:** critérios do motor constitutivo (objetivo de criação autônoma, seção 2 do [desenho](research-design-v0.1.md)). As previsões da hipótese de organização do domínio ficam registradas aqui com **direção**; seus limiares serão fixados antes de campanhas de níveis superiores.

## 1. Hipóteses
- **Hipótese de formação:** a primeira versão do motor constitutivo constitui unidades a partir das incidências, acima do que constitui em dados substitutos que preservam taxas e tempos internos de cada canal.
- **Hipótese de ancoragem:** propriedades temporais das unidades acompanham a variável física do mundo (altura da queda), não as latências dos instrumentos.
- **Hipótese do papel interno:** remover uma unidade consolidada altera o que o próprio sistema constitui depois, mais do que remover unidades aleatórias.
- **Hipótese de continuidade:** novas regularidades não apagam as unidades consolidadas e não esgotam a plasticidade.

## 2. Mundos, condições e sementes
| Mundo | Condição | Sementes |
|---|---|---|
| Quedas episódicas (mundo de quedas) | 40 episódios, alturas U(0,8; 2,0) m, amostragem de 1 ms | cronograma 1–10 |
| Quedas, controle de altura fixa | 40 episódios a 1,4 m | 1–10 |
| Quedas, latências | igualadas (todas 3 ms) e embaralhadas | 1–10 |
| Mesa (mundo da mesa) | protocolo `standard-v1`, 300 s | idSeed e lançamento 1–10 |
| Sala multi-dia (sala em vários dias) | 7 dias, cronograma sorteado | 1–5 |

## 3. Comparadores e ablações
- **Comparadores** (mesma informação de entrada): controle TEMPO de nós fixos; rede que cresce quando necessário; rede gama que cresce quando necessário ou gás neural crescente com fusão de contexto; PARSER adaptado a eventos discretizados.
- **Ablações do motor constitutivo:** exigência de duas ou mais fontes reduzida a uma; uma escala de traço só; sem consolidação; sem corrigibilidade; sem recalibração; criar sempre (sem critério de novidade).

## 4. Nulos
Deslocamento circular por canal; embaralhamento de intervalos por canal; permutação de rótulos de canal; latências igualadas e embaralhadas (no mundo); remoção aleatória de unidades. **Exigência:** um critério só é satisfeito se superar **todos** os nulos pertinentes (lição da [bancada de avaliação](bench-v0.1.md)).

## 5. Critérios e limiares
| Nome | Medida | Sucesso | Justificativa do limiar |
|---|---|---|---|
| Critério de origem registrada | Proporção de unidades com **registro de alocação** (elementos do substrato, aferentes, incidência causadora e instante da abertura do portão) | 100% | Verificação determinística; qualquer exceção é defeito |
| Critério de reativação específica | Reativação específica (critério observacional de engrama): episódios 1–20 = codificação, 21–40 = teste; acerto = a unidade que responde no teste é a que respondeu à altura mais próxima na codificação; nulo = 2.000 permutações do pareamento altura–unidade | p < 0,01 após Holm entre sementes **e** ganho ≥ 0,2 sobre a média do nulo, em ≥ 8 de 10 sementes | Substitui a contagem de unidades (invertida na calibração). Ver [engramas](engram-criteria-v0.1.md) |
| Critério de ancoragem na altura | Spearman entre a propriedade de atraso da unidade e a altura (quedas variáveis) | \|ρ\| ≥ 0,6 com p < 0,01 após correção de Holm entre sementes, em ≥ 8 de 10 sementes | 0,6 é forte o bastante para não ser artefato de amostragem de 1 ms; a variável física em si tem \|ρ\| ≈ 0,997 com o intervalo vivido |
| Salvaguarda da altura fixa | Atrasos do mundo com altura fixa (1,4 m) correlacionados com **pseudo-alturas** (o cronograma variável que esse mundo não teve) | \|ρ\| < 0,2 em ≥ 8 de 10 sementes | Sem variação no mundo não pode haver covariância genuína; usar o índice do episódio confundiria tendência temporal com altura |
| Salvaguarda das latências igualadas | Efeito do critério de ancoragem na altura com latências igualadas; **só aplicável se o critério de ancoragem na altura passar** | Retém ≥ 80% de \|ρ\| | Se depender das latências, é instrumento, não mundo (controle de latências) |
| Critério de perda de função específica | Perda de função específica (Han et al., 2009): remover cada unidade (até 10) no fim da codificação; desfecho = queda na recuperação do conteúdo dela no teste; nulo = 30 remoções de uma unidade aleatória; especificidade = outras memórias já formadas preservadas. **Só aplicável se o critério de reativação específica passar** | ≥ 70% das unidades acima do máximo do nulo **e** especificidade ≥ 0,9, em ≥ 8 de 10 sementes | Necessidade sem conteúdo não é representação: o controle aleatório passaria sem a condição |
| Critério de persistência e retorno | Persistência, dormência e ecforia: regime inicial (0,8–2,0 m), regime novo (2,0–3,0 m), retorno ao regime inicial (nova sequência de alturas) | Unidades do regime inicial presentes no fim do regime novo ≥ 80%; criação no regime novo ≥ 10% da do inicial; reativação das unidades iniciais no retorno com p < 0,01 (Holm) e ganho ≥ 0,2; em ≥ 8 de 10 sementes | Persistência só não discrimina; o traço deve sobreviver sem uso e ser despertado pelo conteúdo |
| Critério de maturação | Surpresa (falhas de espera por descarga), por janela, ao longo de 600 s em três mundos de quedas: altura fixa, ciclo de 3 alturas e alturas aleatórias; nulo = os mesmos mundos com a ordem dos episódios embaralhada a cada janela | No mundo de altura fixa, surpresa na última janela ≤ 0,05 **e** criação nula nas duas últimas janelas; nos mundos com estrutura, inclinação negativa da surpresa no tempo (Spearman ≤ −0,5) em ≥ 8 de 10 sementes; a surpresa final deve ordenar os mundos pela aleatoriedade (fixa < ciclo < aleatória) | Previsão: o sistema amadurece onde o mundo é previsível e estabiliza no nível da aleatoriedade do mundo (observação exploratória de 09/11/2026, [diário](constitutive-engine-v0.md)) |
| Critério de vantagem sobre comparadores | Motor constitutivo × comparadores nas mesmas condições | Motor constitutivo supera o controle TEMPO no critério de ancoragem na altura **e** iguala ou supera a rede que cresce quando necessário no critério de reativação específica | Mínimo para justificar o mecanismo novo; todos os resultados são relatados, inclusive derrotas |

**Comparações múltiplas:** correção de Holm-Bonferroni dentro de cada critério. **Testes de permutação com no mínimo 2.000 permutações**: com 10 sementes e α = 0,01, o p mínimo de 1.000 permutações (≈ 0,001) não passa no primeiro degrau de Holm (0,001).

**Independência das sementes:** todo fluxo aleatório (mundo, sensores, motor, controles, substitutos) deriva de semente própria por função de dispersão; nenhum fluxo pode compartilhar sequência com outro.

**Análise de sensibilidade (secundária, não muda a decisão):** critério de ancoragem na altura relatado na grade ρ mínimo ∈ {0,3; …; 0,9} × sementes exigidas ∈ {6; …; 10}; critério de reativação específica e critério de persistência e retorno com ganho mínimo em {0,1; 0,2; 0,3; 0,4}.

**Calibração dos limiares (antes da aprovação):** controle positivo (oráculo que recebe do projetista o par de canais) e controles negativos (controle TEMPO; oráculo com atrasos aleatórios em fluxo independente). Ver [relatório de calibração](calibration-v1.md). **Resultado (rodada 2):** critério de ancoragem na altura e salvaguarda das latências igualadas validados e robustos na grade; salvaguarda da altura fixa é salvaguarda (só pode derrubar critério de ancoragem na altura); critério de formação e critério de continuidade originais eram inválidos e foram **substituídos por critério de reativação específica, critério de perda de função específica e critério de persistência e retorno** (critérios de engrama), validados contra um positivo e três negativos; critério de vantagem sobre comparadores não calibrado (exige o motor constitutivo e os comparadores). Critério de ancoragem na altura, salvaguarda da altura fixa e salvaguarda das latências igualadas permanecem.

## 6. Previsões das ablações (refutáveis)
| Ablação | Previsão |
|---|---|
| Fonte única | Unidades tornam-se cópias de canais; o critério de ancoragem na altura falha |
| Escala única (rápida) | Unidades da sala desaparecem (escala de horas inalcançável); quedas mantêm-se |
| Sem consolidação | Critério de persistência e retorno falha (persistência ou ecforia) |
| Sem corrigibilidade | Critério de ancoragem na altura enfraquece: atrasos não acompanham a altura |
| Criar sempre | Critério de reativação específica e critério de persistência e retorno falham: nada é reativado |

## 7. Refutação
- **Hipótese de formação refutada** se o critério de reativação específica falhar no mundo de quedas **e** na mesa.
- **Hipótese de ancoragem refutada** se o critério de ancoragem na altura falhar, ou se a salvaguarda da altura fixa ou a salvaguarda das latências igualadas indicarem artefato.
- **Hipótese do papel interno refutada** se o critério de perda de função específica falhar (ou não for aplicável por falha do critério de reativação específica).
- **Hipótese de continuidade refutada** se o critério de persistência e retorno falhar.
- **Maturação refutada** se o critério de maturação falhar (registrada como hipótese adicional: o sistema amadurece onde o mundo é previsível).
- A primeira versão do motor constitutivo é considerada **sem vantagem** se o critério de vantagem sobre comparadores falhar, mesmo que os demais critérios passem.

## 8. Substrato, escala e envelope (decisão de 09/11/2026: separar os dois)
**Tamanho do substrato** (parâmetro, não limite de segurança): série de escala com **1.000, 10.000 e 100.000 elementos**; todos os critérios relatados por tamanho.

**Envelope de segurança da fase do motor** (detector de envelope, parada que falha fechada):

| Limite | Valor proposto |
|---|---|
| Unidades recrutadas vivas por execução | 50.000 |
| Taxa de criação | 50 unidades por segundo simulado (média em janelas de 60 s) |
| Duração simulada por execução | 7 dias |
| Descargas por execução | 100.000.000 |
| Instâncias simultâneas | 1 (bifurcações contam como instâncias) |
| Corpo, atuação, variável regulada, modulação por valor | Nenhum |

O ciclo de sono é **imposto** pelo relógio, sem ponto de ajuste; a pressão homeostática fica para depois da fase do motor. Os detectores de self, de Orientação e de valia acessada não são esperados nesta fase; qualquer sinal de Orientação observado manualmente é tratado como PARAR. O envelope é reavaliado com o responsável a cada fase.

## 9. Previsões direcionais da hipótese de organização do domínio (registradas agora; limiares antes de campanhas de níveis superiores)
Previsão de fundação (escalas lentas, acima do nulo de taxa e duração); previsão de intensidade (só com bancos de limiares); previsão de grandeza intermodal (desaparece quando luz e calor são descorrelacionados); previsão de afinidade (comunidades por canal aferente acima do nulo); previsão de periferia × previsão de integração (a regra de categorização decide entre periferia e integração); previsão de migração dos hubs; previsão de estrutura e acesso (acima do nulo de idade). Detalhes na seção 5 do desenho.

## 9b. Mecanismo pré-registrado e parâmetros declarados
**Versão do motor:** primeira versão, incrementos 1 a 4 ([diário](constitutive-engine-v0.md)): recrutamento por excitabilidade num substrato finito; traços multiescala; coincidência entre fontes distintas; portão de três fatores com fonte de novidade marca-passo; alocação competitiva; estabilidade em cascata; capacidade por elemento; novidade graduada; surpresa por par; contradição; inibição lateral; níveis predefinidos (até 2); ciclo imposto de sono e vigília; incerteza esperada.

**Parâmetros sem fonte** (fixados aqui antes da campanha; sensibilidade relatada como análise secundária com ×0,5 e ×2):

| Parâmetro | Valor |
|---|---|
| Elementos por unidade | 4 |
| Limiar de traço | 0,2 |
| Tolerância de atraso | 5% (mínimo 2 ms) |
| Janela de elegibilidade | 2 s |
| Modulador por disparo / meia-eficácia do receptor | 15 nM / 20 nM |
| Intervalo mínimo entre salvas | 0,5 s |
| Alocações por abertura do portão | 4 |
| Cascata: constante de base, fator, nível máximo, poda | 10 min, 4, 5, 0,05 |
| Contradição | ×0,5 por falha de espera |
| Capacidade por elemento | 20 unidades |
| Descargas por evento (inibição lateral) | 8 |
| Interruptor do sono (limiares) | 0,45 / 0,55 |
| Sono: reativação e renormalização | 1 Hz; ×0,8 por episódio |
| Incerteza esperada: constante e ganho | 60 s; 2 |

**Ablações** (cada uma prevista no desenho): sem portão (incremento 1); sem cascata; sem contradição; sem inibição lateral; recursão livre no lugar dos níveis predefinidos; sem sono; sem incerteza esperada; criar sempre; fonte única; escala única.

## 10. Plano de análise
Scripts versionados no repositório, executados pelo monitor; relatório da fase do motor constitutivo com tabelas por semente, todos os nulos e todas as ablações, inclusive resultados negativos.

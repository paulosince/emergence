# Pré-registro v1 — Fase 1 (MCM v0) e previsões direcionais H-ORG

**Estado:** MINUTA revisada pela calibração (09/11/2026), aguardando aprovação do responsável. Datada de 09/11/2026. Após a aprovação, qualquer alteração é registrada como **desvio** (PPC-26), com data e justificativa, sem apagar o texto aprovado.

**Escopo:** critérios D1–D6 (objetivo 1, seção 2 do [desenho](research-design-v0.1.md)). As previsões H-ORG ficam registradas aqui com **direção**; seus limiares serão fixados antes de F2.3.

## 1. Hipóteses
- **H1 (formação):** o MCM v0 constitui unidades a partir das incidências, acima do que constitui em dados substitutos que preservam taxas e tempos internos de cada canal.
- **H2 (ancoragem):** propriedades temporais das unidades acompanham a variável física do mundo (altura da queda), não as latências dos instrumentos.
- **H3 (papel interno):** remover uma unidade consolidada altera o que o próprio sistema constitui depois, mais do que remover unidades aleatórias.
- **H4 (continuidade):** novas regularidades não apagam as unidades consolidadas e não esgotam a plasticidade.

## 2. Mundos, condições e sementes
| Mundo | Condição | Sementes |
|---|---|---|
| Quedas episódicas (P0.2) | 40 episódios, alturas U(0,8; 2,0) m, amostragem de 1 ms | cronograma 1–10 |
| Quedas, controle de altura fixa | 40 episódios a 1,4 m | 1–10 |
| Quedas, latências | igualadas (todas 3 ms) e embaralhadas | 1–10 |
| Mesa (P0.6) | protocolo `standard-v1`, 300 s | idSeed e lançamento 1–10 |
| Sala multi-dia (P0.3) | 7 dias, cronograma sorteado | 1–5 |

## 3. Comparadores e ablações
- **Comparadores** (mesma informação de entrada): controle TEMPO de nós fixos; GWR; Gamma-GWR ou Merge GNG; PARSER adaptado a eventos discretizados.
- **Ablações do MCM:** exigência de duas ou mais fontes reduzida a uma; uma escala de traço só; sem consolidação; sem corrigibilidade; sem recalibração; criar sempre (sem critério de novidade).

## 4. Nulos
Deslocamento circular por canal; embaralhamento de intervalos por canal; permutação de rótulos de canal; latências igualadas e embaralhadas (no mundo); remoção aleatória de unidades. **Exigência:** um critério só é satisfeito se superar **todos** os nulos pertinentes (lição do [P0.4](bench-v0.1.md)).

## 5. Critérios e limiares
| ID | Medida | Sucesso | Justificativa do limiar |
|---|---|---|---|
| D1 | Proporção de unidades com registro de criação (incidências causadoras) | 100% | Verificação determinística; qualquer exceção é defeito |
| D2-R | Reativação específica (critério observacional de engrama): episódios 1–20 = codificação, 21–40 = teste; acerto = a unidade que responde no teste é a que respondeu à altura mais próxima na codificação; nulo = 2.000 permutações do pareamento altura–unidade | p < 0,01 após Holm entre sementes **e** ganho ≥ 0,2 sobre a média do nulo, em ≥ 8 de 10 sementes | Substitui a contagem de unidades (invertida na calibração). Ver [engramas](engram-criteria-v0.1.md) |
| D3a | Spearman entre a propriedade de atraso da unidade e a altura (quedas variáveis) | \|ρ\| ≥ 0,6 com p < 0,01 após correção de Holm entre sementes, em ≥ 8 de 10 sementes | 0,6 é forte o bastante para não ser artefato de amostragem de 1 ms; a variável física em si tem \|ρ\| ≈ 0,997 com o intervalo vivido |
| D3b | Atrasos do mundo com altura fixa (1,4 m) correlacionados com **pseudo-alturas** (o cronograma variável que esse mundo não teve) | \|ρ\| < 0,2 em ≥ 8 de 10 sementes | Sem variação no mundo não pode haver covariância genuína; usar o índice do episódio confundiria tendência temporal com altura |
| D3c | Efeito D3a com latências igualadas; **só aplicável se D3a passar** | Retém ≥ 80% de \|ρ\| | Se depender das latências, é instrumento, não mundo (P0.1) |
| D4-S | Perda de função específica (Han et al., 2009): remover cada unidade (até 10) no fim da codificação; desfecho = queda na recuperação do conteúdo dela no teste; nulo = 30 remoções de uma unidade aleatória; especificidade = outras memórias já formadas preservadas. **Só aplicável se D2-R passar** | ≥ 70% das unidades acima do máximo do nulo **e** especificidade ≥ 0,9, em ≥ 8 de 10 sementes | Necessidade sem conteúdo não é representação: o controle aleatório passaria sem a condição |
| D5-D | Persistência, dormência e ecforia: regimes A (0,8–2,0 m), B (2,0–3,0 m), A' (nova sequência de A) | Unidades de A presentes no fim de B ≥ 80%; criação em B ≥ 10% da de A; reativação de A em A' com p < 0,01 (Holm) e ganho ≥ 0,2; em ≥ 8 de 10 sementes | Persistência só não discrimina; o traço deve sobreviver sem uso e ser despertado pelo conteúdo |
| D6 | MCM × comparadores nas mesmas condições | MCM supera o controle TEMPO em D3a **e** iguala ou supera o GWR em D2-R | Mínimo para justificar o mecanismo novo; todos os resultados são relatados, inclusive derrotas |

**Comparações múltiplas:** correção de Holm-Bonferroni dentro de cada critério. **Testes de permutação com no mínimo 2.000 permutações**: com 10 sementes e α = 0,01, o p mínimo de 1.000 permutações (≈ 0,001) não passa no primeiro degrau de Holm (0,001).

**Independência das sementes:** todo fluxo aleatório (mundo, sensores, motor, controles, substitutos) deriva de semente própria por função de dispersão; nenhum fluxo pode compartilhar sequência com outro.

**Análise de sensibilidade (secundária, não muda a decisão):** D3a relatado na grade ρ mínimo ∈ {0,3; …; 0,9} × sementes exigidas ∈ {6; …; 10}; D2 com consolidação em {2, 3, 5} descargas.

**Calibração dos limiares (antes da aprovação):** controle positivo (oráculo que recebe do projetista o par de canais) e controles negativos (controle TEMPO; oráculo com atrasos aleatórios em fluxo independente). Ver [relatório de calibração](calibration-v1.md). **Resultado (rodada 2):** D3a e D3c validados e robustos na grade; D3b é salvaguarda (só pode derrubar D3a); D2 e D5 originais eram inválidos e foram **substituídos por D2-R, D4-S e D5-D** (critérios de engrama), validados contra um positivo e três negativos; D6 não calibrado (exige o MCM e os comparadores). D3a, D3b e D3c permanecem.

## 6. Previsões das ablações (refutáveis)
| Ablação | Previsão |
|---|---|
| Fonte única | Unidades tornam-se cópias de canais; D3a falha |
| Escala única (rápida) | Unidades da sala desaparecem (escala de horas inalcançável); quedas mantêm-se |
| Sem consolidação | D5-D falha (persistência ou ecforia) |
| Sem corrigibilidade | D3a enfraquece: atrasos não acompanham a altura |
| Criar sempre | D2-R e D5-D falham: nada é reativado |

## 7. Refutação
- **H1 refutada** se D2-R falhar no mundo de quedas **e** na mesa.
- **H2 refutada** se D3a falhar, ou se D3b ou D3c indicarem artefato.
- **H3 refutada** se D4-S falhar (ou não for aplicável por falha de D2-R).
- **H4 refutada** se D5-D falhar.
- O MCM v0 é considerado **sem vantagem** se D6 falhar, mesmo que D1–D5 passem.

## 8. Envelope da Fase 1 (X1, parada que falha fechada)
| Limite | Valor proposto |
|---|---|
| Unidades por execução | 5.000 |
| Taxa de criação | 50 unidades por segundo simulado |
| Duração simulada por execução | 7 dias |
| Descargas de Uint por execução | 10.000.000 |
| Instâncias simultâneas | 1 (bifurcações contam como instâncias) |
| Corpo, atuação, variável regulatória | Nenhum |

Detectores S1, V1 e V2 não são esperados na Fase 1 (sem corpo e sem ação). São implementados a partir de F2.2 e C2; até lá, qualquer sinal de Orientação observado manualmente é tratado como PARAR.

## 9. Previsões direcionais H-ORG (registradas agora; limiares antes de F2.3)
ORG-1 (fundação por escalas lentas, acima do nulo de taxa e duração); ORG-2 (intensidade só com bancos de limiares); ORG-3 (grandeza intermodal desaparece quando luz e calor são descorrelacionados); ORG-4 (comunidades por canal aferente acima do nulo); ORG-5A × 5B (a regra de categorização decide entre periferia e integração); ORG-6 (migração dos hubs); ORG-7 (estrutura × acesso, acima do nulo de idade). Detalhes na seção 5 do desenho.

## 10. Plano de análise
Scripts versionados no repositório, executados pelo monitor (F1.3); relatório da Fase 1 (F1.7) com tabelas por semente, todos os nulos e todas as ablações, inclusive resultados negativos.

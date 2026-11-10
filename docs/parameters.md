# Parâmetros do motor constitutivo

Lista completa e editável. Fonte única: `src/engines/constitutive/parameters.js`. Situação: **medido** (com fonte), **decisão** (do responsável), **declarado** (sem fonte; fixado no pré-registro), **implementação** (ajuste numérico).

## Como alterar e testar
- Listar: `node scripts/run-constitutive.mjs --list`
- Rodar com alterações: `node scripts/run-constitutive.mjs --world=quedas --seconds=120 --set unitSize=6 --set contradictionFactor=0.8`
- Arquivo de configuração: `--config=minha-config.json` (objeto JSON com os nomes abaixo)
- Mundos: `quedas`, `quedas-fixa`, `quedas-ciclo`, `mesa`. Saída em JSON com `--json`.
- Nome desconhecido é **recusado** (evita erro de digitação silencioso).
- Qualquer valor diferente do pré-registro marca a execução como **exploratória** (exceto o tamanho do substrato, que é a série de escala). Resultados confirmatórios usam só os valores pré-registrados; mudanças neles depois da aprovação são **desvios** registrados.

| Parâmetro | Valor | Unidade | Situação | Fonte ou justificativa |
|---|---|---|---|---|
| `substrateSize` | `1000` | elementos | decisão | Série de escala 1.000 / 10.000 / 100.000 (decisões, 09/11/2026) |
| `substrateSideUm` | `400` | μm | implementação | Lado do cubo do substrato |
| `unitSize` | `4` | elementos | declarado | Elementos por unidade (pré-registro, parâmetros declarados) |
| `traceScalesMs` | `[100,3000,90000,2700000]` | ms | decisão | Traço multiescala 0,1 s; 3 s; 90 s; 45 min (desenho, motor aprovado) |
| `traceThreshold` | `0.2` |  | declarado | Limiar de traço para coincidência |
| `delayTolFrac` | `0.05` | fração | declarado | Tolerância relativa de atraso |
| `delayTolMinMs` | `2` | ms | declarado | Tolerância mínima de atraso |
| `maxDelayMs` | `5400000` | ms | implementação | Maior atraso considerado (2 × escala mais lenta) |
| `recruitRadiusUm` | `60` | μm | declarado | Raio inicial de busca de elementos (economia de fiação) |
| `excitabilitySd` | `0.1` |  | declarado | Variação da excitabilidade de base |
| `recentBoost` | `0.3` |  | declarado | Reforço de excitabilidade após alocação (Rashid et al., 2016: forma; valor sem fonte) |
| `recentTauMs` | `21600000` | ms | declarado | Decaimento do reforço (ordem de horas, Rashid et al., 2016) |
| `fluctuationSd` | `0.1` |  | declarado | Flutuação lenta da excitabilidade |
| `fluctuationPeriodMs` | `43200000` | ms | declarado | Período da flutuação |
| `maxCandidatesPerEvent` | `64` |  | implementação | Limite de candidatos por evento |
| `gating` | `true` |  | decisão | Regra de três fatores (false = ablação: incremento 1) |
| `eligibilityMs` | `2000` | ms | declarado | Janela da marca de elegibilidade (segundos; Gerstner et al., 2018) |
| `maxTags` | `5000` |  | implementação | Limite de marcas pendentes |
| `noveltyPacemaker` | `{"tauMs":500,"threshold":1,"refractoryMs":30,"drive":0.0021}` |  | declarado | Fonte de novidade marca-passo (tônico ~0,7 Hz) |
| `noveltyInput` | `2.5` |  | declarado | Entrada fásica por novidade (gera salva) |
| `burstRefractoryMs` | `500` | ms | declarado | Intervalo mínimo entre salvas (proposta sem fonte) |
| `maxAllocationsPerGate` | `4` |  | declarado | Alocações por abertura do portão (alocação esparsa e competitiva) |
| `modulatorPerSpikeNM` | `15` | nM | declarado | Concentração adicionada por disparo da fonte |
| `modulatorClearancePerS` | `20` | 1/s | medido | Remoção da dopamina no estriado, Vmax/Km (Rice e Cragg, 2008) |
| `receptorHalfNM` | `20` | nM | declarado | Meia-eficácia do receptor |
| `desensitizationTauMs` | `60000` | ms | declarado | Dessensibilização (minutos; revisões de farmacologia) |
| `desensitizationGain` | `1` |  | declarado | Ganho da dessensibilização |
| `cascade` | `true` |  | decisão | Estabilidade em cascata (false = ablação) |
| `cascadeBaseTauMs` | `600000` | ms | declarado | Constante de decaimento no nível 0 |
| `cascadeFactor` | `4` |  | declarado | Multiplicador por nível (forma: Fusi et al., 2005) |
| `cascadeMaxLevel` | `5` |  | declarado | Nível máximo de estabilidade |
| `pruneBelow` | `0.05` |  | declarado | Força abaixo da qual a unidade é podada |
| `maxUnitsPerElement` | `20` |  | declarado | Capacidade por elemento |
| `gradedNovelty` | `true` |  | decisão | Novidade graduada pela fração não acomodada |
| `surprise` | `true` |  | decisão | Falhas de espera geram surpresa (false = ablação) |
| `surpriseInput` | `2.5` |  | declarado | Entrada fásica por falha de espera |
| `maxDischargesPerEvent` | `8` |  | declarado | Inibição lateral: descargas por evento |
| `contradictionFactor` | `0.5` |  | declarado | Poda por contradição: fator por falha de espera |
| `clock` | `null` |  | decisão | Ciclo imposto; ex. { cells: 10, timeScale: 1, lightChannel: null, lightGain: 0.01 }; null = sempre acordado |
| `switchHigh` | `0.55` |  | declarado | Interruptor: limiar de despertar |
| `switchLow` | `0.45` |  | declarado | Interruptor: limiar de adormecer |
| `sleepReactivationHz` | `1` | Hz | declarado | Reativação espontânea no sono |
| `sleepDownscale` | `0.8` |  | declarado | Renormalização por episódio de sono (forma: Tononi e Cirelli, 2014) |
| `achTauMs` | `60000` | ms | declarado | Incerteza esperada: constante de tempo |
| `achGain` | `2` |  | declarado | Incerteza esperada: redução da resposta fásica |
| `maxLevel` | `2` |  | decisão | Níveis predefinidos (Infinity = recursão livre, variante) |

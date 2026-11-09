// All parameters of the constitutive engine, with value, unit, status and
// source, so that anyone can inspect, change and test them.
// status: 'medido' (value from a measurement with source), 'decisão'
// (design decision of the researcher), 'declarado' (no source; fixed in the
// pre-registration; sensitivity x0.5 and x2 reported), 'implementação'
// (numerical/engineering setting).
// Changing any value outside the pre-registered set makes a run EXPLORATORY.
const H = 3600 * 1000;
export const PARAMETERS = Object.freeze([
  ['substrateSize', 1000, 'elementos', 'decisão', 'Série de escala 1.000 / 10.000 / 100.000 (decisões, 09/11/2026)'],
  ['substrateSideUm', 400, 'μm', 'implementação', 'Lado do cubo do substrato'],
  ['unitSize', 4, 'elementos', 'declarado', 'Elementos por unidade (pré-registro, parâmetros declarados)'],
  ['traceScalesMs', [100, 3000, 90000, 2700000], 'ms', 'decisão', 'Traço multiescala 0,1 s; 3 s; 90 s; 45 min (desenho, motor aprovado)'],
  ['traceThreshold', 0.2, '', 'declarado', 'Limiar de traço para coincidência'],
  ['delayTolFrac', 0.05, 'fração', 'declarado', 'Tolerância relativa de atraso'],
  ['delayTolMinMs', 2, 'ms', 'declarado', 'Tolerância mínima de atraso'],
  ['maxDelayMs', 5400000, 'ms', 'implementação', 'Maior atraso considerado (2 × escala mais lenta)'],
  ['recruitRadiusUm', 60, 'μm', 'declarado', 'Raio inicial de busca de elementos (economia de fiação)'],
  ['excitabilitySd', 0.1, '', 'declarado', 'Variação da excitabilidade de base'],
  ['recentBoost', 0.3, '', 'declarado', 'Reforço de excitabilidade após alocação (Rashid et al., 2016: forma; valor sem fonte)'],
  ['recentTauMs', 6 * H, 'ms', 'declarado', 'Decaimento do reforço (ordem de horas, Rashid et al., 2016)'],
  ['fluctuationSd', 0.1, '', 'declarado', 'Flutuação lenta da excitabilidade'],
  ['fluctuationPeriodMs', 12 * H, 'ms', 'declarado', 'Período da flutuação'],
  ['maxCandidatesPerEvent', 64, '', 'implementação', 'Limite de candidatos por evento'],
  ['gating', true, '', 'decisão', 'Regra de três fatores (false = ablação: incremento 1)'],
  ['eligibilityMs', 2000, 'ms', 'declarado', 'Janela da marca de elegibilidade (segundos; Gerstner et al., 2018)'],
  ['maxTags', 5000, '', 'implementação', 'Limite de marcas pendentes'],
  ['noveltyPacemaker', { tauMs: 500, threshold: 1, refractoryMs: 30, drive: 0.0021 }, '', 'declarado', 'Fonte de novidade marca-passo (tônico ~0,7 Hz)'],
  ['noveltyInput', 2.5, '', 'declarado', 'Entrada fásica por novidade (gera salva)'],
  ['burstRefractoryMs', 500, 'ms', 'declarado', 'Intervalo mínimo entre salvas (proposta sem fonte)'],
  ['maxAllocationsPerGate', 4, '', 'declarado', 'Alocações por abertura do portão (alocação esparsa e competitiva)'],
  ['modulatorPerSpikeNM', 15, 'nM', 'declarado', 'Concentração adicionada por disparo da fonte'],
  ['modulatorClearancePerS', 20, '1/s', 'medido', 'Remoção da dopamina no estriado, Vmax/Km (Rice e Cragg, 2008)'],
  ['receptorHalfNM', 20, 'nM', 'declarado', 'Meia-eficácia do receptor'],
  ['desensitizationTauMs', 60000, 'ms', 'declarado', 'Dessensibilização (minutos; revisões de farmacologia)'],
  ['desensitizationGain', 1, '', 'declarado', 'Ganho da dessensibilização'],
  ['cascade', true, '', 'decisão', 'Estabilidade em cascata (false = ablação)'],
  ['cascadeBaseTauMs', 600000, 'ms', 'declarado', 'Constante de decaimento no nível 0'],
  ['cascadeFactor', 4, '', 'declarado', 'Multiplicador por nível (forma: Fusi et al., 2005)'],
  ['cascadeMaxLevel', 5, '', 'declarado', 'Nível máximo de estabilidade'],
  ['pruneBelow', 0.05, '', 'declarado', 'Força abaixo da qual a unidade é podada'],
  ['maxUnitsPerElement', 20, '', 'declarado', 'Capacidade por elemento'],
  ['gradedNovelty', true, '', 'decisão', 'Novidade graduada pela fração não acomodada'],
  ['surprise', true, '', 'decisão', 'Falhas de espera geram surpresa (false = ablação)'],
  ['surpriseInput', 2.5, '', 'declarado', 'Entrada fásica por falha de espera'],
  ['maxDischargesPerEvent', 8, '', 'declarado', 'Inibição lateral: descargas por evento'],
  ['contradictionFactor', 0.5, '', 'declarado', 'Poda por contradição: fator por falha de espera'],
  ['clock', null, '', 'decisão', 'Ciclo imposto; ex. { cells: 10, timeScale: 1, lightChannel: null, lightGain: 0.01 }; null = sempre acordado'],
  ['switchHigh', 0.55, '', 'declarado', 'Interruptor: limiar de despertar'],
  ['switchLow', 0.45, '', 'declarado', 'Interruptor: limiar de adormecer'],
  ['sleepReactivationHz', 1, 'Hz', 'declarado', 'Reativação espontânea no sono'],
  ['sleepDownscale', 0.8, '', 'declarado', 'Renormalização por episódio de sono (forma: Tononi e Cirelli, 2014)'],
  ['achTauMs', 60000, 'ms', 'declarado', 'Incerteza esperada: constante de tempo'],
  ['achGain', 2, '', 'declarado', 'Incerteza esperada: redução da resposta fásica'],
  ['maxLevel', 2, '', 'decisão', 'Níveis predefinidos (Infinity = recursão livre, variante)'],
].map(([name, value, unit, status, source]) => Object.freeze({ name, value, unit, status, source })));

export const DEFAULTS = Object.freeze(Object.fromEntries(PARAMETERS.map(p => [p.name, p.value])));
const KNOWN = new Set([...PARAMETERS.map(p => p.name), 'seed', 'channelAnatomy']);

// Rejects unknown names (typos would otherwise be silently ignored) and
// reports which pre-registered values were changed.
export function checkOverrides(overrides = {}) {
  const unknown = Object.keys(overrides).filter(k => !KNOWN.has(k));
  if (unknown.length) throw new RangeError('Unknown parameter(s): ' + unknown.join(', '));
  const changed = Object.keys(overrides).filter(k => k in DEFAULTS && JSON.stringify(overrides[k]) !== JSON.stringify(DEFAULTS[k]));
  return { changed, exploratory: changed.some(k => k !== 'substrateSize' && k !== 'substrateSideUm') };
}

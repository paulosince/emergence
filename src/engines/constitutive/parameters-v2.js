// Parameters of the constitutive engine, version 2 (docs/engine-v2-design-proposal.md).
// Same conventions as parameters.js (value, unit, status, source). Parameters
// of version 1 that the new design removes are not carried over; new ones are
// marked 'declarado' (no source; to be calibrated and fixed in pre-registration v2).
import { PARAMETERS as V1 } from './parameters.js';

const REMOVED = new Set(['firstWeightInit', 'firstWeightPerLevel', 'secondWeight', 'integration', 'projection',
  'contradictionFactor', 'maxDischargesPerEvent', 'sleepReactivationHz']);

const NEW = [
  ['conductionDelayMs', 1, 'ms', 'declarado', 'Atraso mínimo de uma Upro (a coincidência constituída chega ao mesmo tempo após este atraso)'],
  ['maxAfferents', 4, 'Upro', 'declarado', 'Aferências recebidas por uma Uint constituída (pelo menos 2; CLEAR v43 L73)'],
  ['uproInitGain', 0.6, '', 'declarado', 'Ganho inicial da Upro excitatória: uma incidência sozinha (0,6) não atinge o limiar 1; duas coincidentes (1,2) atingem'],
  ['availabilityFactor', 2.5, '', 'declarado', 'Disponibilidade τ da Uint = fator × max(tolerância mínima, fração × maior atraso)'],
  ['refractoryMs', 5, 'ms', 'declarado', 'Refratário da Uint'],
  ['accommodationFactor', 2, '', 'declarado', 'D3: uma Uint existente acomoda descompasso de até fator × tolerância de atraso'],
  ['potentiationRate', 0.1, '', 'declarado', 'Fortalecimento por confirmação (resposta b do responsável; forma: Bi e Poo 1998)'],
  ['depressionRate', 0.1, '', 'declarado', 'Enfraquecimento por incidência tardia (CLEAR v43 L81; forma: Bi e Poo 1998)'],
  ['delayAdjustRate', 0.5, '', 'declarado', 'Ajuste de atraso por convergência falha ou tardia (CLEAR v43 L81; forma: Fields 2015)'],
  ['plasticityModGain', 1, '', 'declarado', 'O modulador multiplica a taxa de plasticidade (regra de três fatores, Gerstner et al. 2018)'],
  ['inhibitoryGain', 0.5, '', 'declarado', 'D2: magnitude das Upro inibitórias entre Uint concorrentes'],
  ['inhibitoryDelayMs', 1, 'ms', 'declarado', 'D2: atraso das Upro inibitórias (dissináptico)'],
  ['maxCompetitors', 16, 'Uint', 'declarado', 'D2: concorrentes ligadas por inibição a cada Uint constituída'],
  ['upStatePeriodMs', 1500, 'ms', 'declarado', "D4': período da oscilação lenta do sono (< 1 Hz; 0,3–1 Hz em Steriade, Nuñez e Amzica 1993, sob anestesia)"],
  ['upStateDurationMs', 500, 'ms', 'declarado', "D4': duração do estado ativo (fase hiperpolarizante de ~1 s no resumo de Steriade et al. 1993)"],
  ['upStateTauMs', 20, 'ms', 'declarado', "D4': constante de integração do impulso intrínseco (ordem da constante de membrana)"],
  ['upStateDrive', 0.04587, '1/ms', 'declarado', "D4': impulso intrínseco do estado ativo; com τ = 20 ms só Uint com excitabilidade > 1,09 atingem o limiar, ~10% das Uint sem reforço recente (≈10% das piramidais disparam numa onda aguda: Ylinen et al. 1995, citado por fonte secundária; confiança moderada a baixa)"],
  ['sleepRecurrentGain', 1.5, '', 'declarado', "D4': ganho das Upro excitatórias entre Uint no sono (acetilcolina baixa libera o retorno; Hasselmo 1999)"],
  ['surpriseInhibitionMin', 0.2, 'limiar', 'declarado', 'Surpresa: inibição de contexto mínima sobre a Uint antes da descarga provocada por transdução'],
];

export const PARAMETERS = Object.freeze([
  ...V1.filter(p => !REMOVED.has(p.name)),
  ...NEW.map(([name, value, unit, status, source]) => Object.freeze({ name, value, unit, status, source })),
]);

export const DEFAULTS = Object.freeze(Object.fromEntries(PARAMETERS.map(p => [p.name, p.value])));
const KNOWN = new Set([...PARAMETERS.map(p => p.name), 'seed', 'channelAnatomy']);

export function checkOverrides(overrides = {}) {
  const unknown = Object.keys(overrides).filter(k => !KNOWN.has(k));
  if (unknown.length) throw new RangeError('Unknown parameter(s): ' + unknown.join(', '));
  const changed = Object.keys(overrides).filter(k => k in DEFAULTS && JSON.stringify(overrides[k]) !== JSON.stringify(DEFAULTS[k]));
  return { changed, exploratory: changed.some(k => k !== 'substrateSize' && k !== 'substrateSideUm') };
}

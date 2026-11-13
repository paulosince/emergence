// Mundo sonoro (especificação, seção 2). Gera pressão nos dois sensores.
// Os nomes de estímulos (A, B, ...) pertencem ao observador e nunca chegam ao motor:
// o motor só recebe amostras de pressão.
import { stream, gaussian } from './rng.js';

export const FS = 32000;                 // Hz
export const DT = 1 / FS;
export const C_SOUND = 343;              // m/s
export const SENSOR_DIST = 0.20;         // m
export const RAMP = 0.010;               // s, rampa cosseno
export const PRES_DUR = 0.300;           // s
export const PRES_PERIOD = 0.500;        // s (300 ms de som + 200 ms de intervalo)
export const PRE_SILENCE = 0.5;          // s
export const INTER_BLOCK = 1.0;          // s
export const NOMINAL_AMP = 1.0;          // amplitude de cada componente no nível nominal
// Ruído de fundo 40 dB abaixo do nível nominal (D16), referido ao valor eficaz de um componente nominal.
export const BG_NOISE_RMS = (NOMINAL_AMP / Math.SQRT2) * 10 ** (-40 / 20);

const harm = (f0) => [1, 2, 3, 4, 5].map((h) => h * f0);
export const STIMULI = {
  A: { freqs: harm(200), gainDb: 0, az: -30 },
  B: { freqs: harm(300), gainDb: 0, az: 30 },
  C: { freqs: [230, 470, 690, 1010, 1270], gainDb: 0, az: 0 },
  Ap: { freqs: harm(200), gainDb: 0, az: 30 },     // A′
  Aplus: { freqs: harm(200), gainDb: 12, az: -30 }, // A+
  // R: ruído de banda larga com o mesmo valor eficaz total de A (registro em deviations.md).
  R: { noise: true, gainDb: 0, az: 0 },
};

export const SEQUENCES = {
  S1: [['A', 10], ['B', 10], ['A', 5]],
  S2: [['A', 10], ['B', 10], ['B', 5]],
  S3: [['A', 10], ['B', 10], ['C', 5]],
  S4: [['A', 10], ['B', 10], ['Ap', 5]],
  S5: [['A', 10], ['B', 10], ['Aplus', 5]],
  S6: [['B', 10], ['A', 10], ['A', 5]],
  K9: [['R', 20]],
  SILENCE: [],
};

/** Diferença de chegada: atraso de cada sensor (E, D) em segundos. θ>0: fonte à direita. */
export function sensorDelays(azDeg) {
  const itd = SENSOR_DIST * Math.sin((azDeg * Math.PI) / 180) / C_SOUND;
  return itd >= 0 ? [itd, 0] : [0, -itd]; // [E, D]
}

export function buildSchedule(seqName, seed) {
  const seq = SEQUENCES[seqName];
  if (!seq) throw Error(`sequência desconhecida: ${seqName}`);
  const rPhase = stream(seed, 'world:phases');
  const presentations = [];
  let t = PRE_SILENCE;
  const blocks = [];
  seq.forEach(([stim, n], b) => {
    const bStart = t;
    for (let i = 0; i < n; i++) {
      const S = STIMULI[stim];
      const amp = NOMINAL_AMP * 10 ** (S.gainDb / 20);
      const p = { start: t, dur: PRES_DUR, stim, block: b + 1, index: i, delays: sensorDelays(S.az), amp };
      if (S.noise) {
        p.noiseSeed = `${seed}::world:R:${b}:${i}`;
      } else {
        p.comps = S.freqs.map((f) => ({ f, amp, phase: 2 * Math.PI * rPhase() }));
      }
      presentations.push(p);
      t += PRES_PERIOD;
    }
    blocks.push({ block: b + 1, stim, start: bStart, end: t });
    t += INTER_BLOCK;
  });
  // Duração: igual à de S1 quando não há apresentações (silêncio, K8).
  const duration = seq.length === 0 ? 15.0 : t - INTER_BLOCK + 0.1;
  return { seqName, seed, presentations, blocks, duration };
}

function envelope(u, dur) {
  if (u < 0 || u >= dur) return 0;
  if (u < RAMP) return 0.5 * (1 - Math.cos((Math.PI * u) / RAMP));
  if (u > dur - RAMP) return 0.5 * (1 - Math.cos((Math.PI * (dur - u)) / RAMP));
  return 1;
}

/** Gera a pressão nos dois sensores, amostra a amostra. */
export class World {
  constructor(schedule, seed, { backgroundNoise = true } = {}) {
    this.schedule = schedule;
    this.rBg = [stream(seed, 'world:bg:E'), stream(seed, 'world:bg:D')];
    this.bg = backgroundNoise ? BG_NOISE_RMS : 0;
    this.active = [];
    this.next = 0;
    // Pré-gera o ruído de banda larga das apresentações R (mesmo valor eficaz total de A).
    for (const p of schedule.presentations) {
      if (p.noiseSeed) {
        const r = stream(p.noiseSeed, 'samples');
        const n = Math.ceil((p.dur + 0.002) * FS) + 4;
        const buf = new Float64Array(n);
        const rmsA = Math.sqrt(5) * (p.amp / Math.SQRT2);
        for (let i = 0; i < n; i++) buf[i] = rmsA * gaussian(r);
        p.noiseBuf = buf;
      }
    }
  }
  /** Pressão em t (s) nos sensores E e D; escreve em out[0], out[1]. */
  sample(t, out) {
    const pres = this.schedule.presentations;
    while (this.next < pres.length && pres[this.next].start <= t) this.active.push(pres[this.next++]);
    if (this.active.length && this.active[0].start + this.active[0].dur + 0.002 < t) {
      this.active = this.active.filter((p) => p.start + p.dur + 0.002 >= t);
    }
    for (let s = 0; s < 2; s++) {
      let v = this.bg ? this.bg * gaussian(this.rBg[s]) : 0;
      for (const p of this.active) {
        const u = t - p.start - p.delays[s];
        const e = envelope(u, p.dur);
        if (e === 0) continue;
        if (p.comps) {
          let acc = 0;
          for (const c of p.comps) acc += c.amp * Math.sin(2 * Math.PI * c.f * u + c.phase);
          v += e * acc;
        } else {
          const x = u * FS, i = Math.floor(x), fr = x - i;
          const b = p.noiseBuf;
          if (i >= 0 && i + 1 < b.length) v += e * (b[i] * (1 - fr) + b[i + 1] * fr);
        }
      }
      out[s] = v;
    }
  }
  /** Rótulo do observador para um instante (apresentação corrente ou null). */
  presentationAt(t) {
    for (const p of this.schedule.presentations) if (t >= p.start && t < p.start + PRES_PERIOD) return p;
    return null;
  }
}

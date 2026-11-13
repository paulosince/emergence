// Utrd estrita (especificação, seção 3; HC2; D3, D4, D16).
// Converte pressão em incidências e mais nada: ressonador → retificação → cruzamento de limiar.
// Não compara faixas nem sensores; cada via ignora a existência das outras.
import { FS, DT } from './world.js';

export const N_SENSORS = 2;
export const N_BANDS = 13;
export const N_LEVELS = 3;
export const Q = 4;
export const VIA_REFRACTORY = 0.001; // s
export const bandCenter = (k) => 150 * 2 ** (k / 3);

/** Biquad passa-banda com ganho de pico 0 dB (RBJ). */
export function bandpassCoeffs(f0, q = Q, fs = FS) {
  const w0 = (2 * Math.PI * f0) / fs, alpha = Math.sin(w0) / (2 * q), a0 = 1 + alpha;
  return { b0: alpha / a0, b1: 0, b2: -alpha / a0, a1: (-2 * Math.cos(w0)) / a0, a2: (1 - alpha) / a0 };
}

export function viaIndex(s, k, j) { return (s * N_BANDS + k) * N_LEVELS + j; }
export function viaDescriptor(v) {
  const j = v % N_LEVELS, k = Math.floor(v / N_LEVELS) % N_BANDS, s = Math.floor(v / (N_LEVELS * N_BANDS));
  return { sensor: s === 0 ? 'E' : 'D', band: k, level: j, fc: bandCenter(k) };
}

export class Utrd {
  /** thresholds: limiares θ_j da calibração única (calibration.json). */
  constructor(thresholds) {
    if (thresholds.length !== N_LEVELS) throw Error('limiares inválidos');
    this.th = thresholds;
    this.filters = [];
    for (let s = 0; s < N_SENSORS; s++) for (let k = 0; k < N_BANDS; k++) {
      this.filters.push({ c: bandpassCoeffs(bandCenter(k)), x1: 0, x2: 0, y1: 0, y2: 0, rPrev: 0 });
    }
    this.refrUntil = new Float64Array(N_SENSORS * N_BANDS * N_LEVELS).fill(-1);
    this.emitted = 0;
  }
  /** Processa uma amostra em t; chama emit(viaIdx, tCruzamento, amostraN) para cada incidência. */
  step(t, n, pressure, emit) {
    for (let s = 0; s < N_SENSORS; s++) {
      const x = pressure[s];
      for (let k = 0; k < N_BANDS; k++) {
        const f = this.filters[s * N_BANDS + k], c = f.c;
        const y = c.b0 * x + c.b1 * f.x1 + c.b2 * f.x2 - c.a1 * f.y1 - c.a2 * f.y2;
        f.x2 = f.x1; f.x1 = x; f.y2 = f.y1; f.y1 = y;
        const r = y > 0 ? y : 0; // retificação de meia onda
        const rp = f.rPrev;
        if (r > rp) {
          for (let j = 0; j < N_LEVELS; j++) {
            const th = this.th[j];
            if (rp < th && r >= th) {
              const tc = t - DT + ((th - rp) / (r - rp)) * DT; // interpolação linear do cruzamento
              const v = (s * N_BANDS + k) * N_LEVELS + j;
              if (tc >= this.refrUntil[v]) {
                this.refrUntil[v] = tc + VIA_REFRACTORY;
                this.emitted++;
                emit(v, tc, n);
              }
            }
          }
        }
        f.rPrev = r;
      }
    }
  }
}

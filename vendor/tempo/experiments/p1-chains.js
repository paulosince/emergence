// P1: does temporal precision survive a chain of stages?
// Threshold groups (leaky integrate-and-fire, threshold, reset) vs a linear control
// with the same synaptic kernel and the same total drive per stage.
// Setup follows the spirit of Diesmann, Gewaltig & Aertsen (1999): groups of w neurons,
// all-to-all feed-forward between consecutive groups, noisy membrane below threshold.
// Usage: node experiments/p1-chains.js [nSeeds=5]

import { writeFileSync, mkdirSync } from 'node:fs';
import { makeRng } from '../core/rng.js';

const P = { w: 100, D: 6, dt: 0.1, tm: 10, ts: 2, theta: 15, mu: 8, sigma: 2.5, tref: 2, psp: 0.14, T: 120, onset: 40 };

// Synaptic jump J so that one input spike gives a PSP peak of P.psp mV (no noise).
const tp = (Math.log(P.tm / P.ts) * P.tm * P.ts) / (P.tm - P.ts);
const kernelPeak = (P.ts / (P.tm - P.ts)) * (Math.exp(-tp / P.tm) - Math.exp(-tp / P.ts));
const J = P.psp / kernelPeak;

const stats = (xs) => {
  if (xs.length < 2) return { a: xs.length, sd: NaN };
  const m = xs.reduce((s, x) => s + x, 0) / xs.length;
  return { a: xs.length, sd: Math.sqrt(xs.reduce((s, x) => s + (x - m) ** 2, 0) / (xs.length - 1)) };
};

// Input drive as a function of time: array of spike counts per time bin.
function binsFromTimes(times) {
  const nb = Math.round(P.T / P.dt), b = new Float64Array(nb);
  for (const t of times) { const k = Math.round(t / P.dt); if (k >= 0 && k < nb) b[k] += 1; }
  return b;
}

// Threshold group: each neuron fires at most once after onset (Diesmann's condition).
function thresholdStage(drive, rng) {
  const nb = drive.length, out = [];
  for (let n = 0; n < P.w; n++) {
    let V = P.mu + P.sigma * rng.normal(), I = 0, refr = 0;
    for (let k = 0; k < nb; k++) {
      I += -I * P.dt / P.ts + J * drive[k];
      V += (P.dt * (-(V - P.mu) + I)) / P.tm + P.sigma * Math.sqrt((2 * P.dt) / P.tm) * rng.normal();
      if (refr > 0) { refr -= P.dt; continue; }
      if (V >= P.theta) {
        const t = k * P.dt;
        V = 0; refr = P.tref;
        if (t >= P.onset - 5) { out.push(t); break; }      // first event after the volley
      }
    }
  }
  return out;
}

// Linear control: same kernel, no threshold. The population response r(t) = mean(V) - mu
// (positive part) is passed on as a drive with the same total count as the input volley.
function linearStage(drive, total) {
  const nb = drive.length, r = new Float64Array(nb);
  let V = 0, I = 0;
  for (let k = 0; k < nb; k++) {
    I += -I * P.dt / P.ts + J * drive[k];
    V += (P.dt * (-V + I)) / P.tm;
    r[k] = Math.max(0, V);
  }
  const area = r.reduce((s, x) => s + x, 0) || 1;
  return r.map((x) => (x * total) / area);
}
const spread = (bins) => {
  let s = 0, m = 0, v = 0;
  bins.forEach((x, k) => { s += x; m += x * k * P.dt; });
  m /= s;
  bins.forEach((x, k) => { v += x * (k * P.dt - m) ** 2; });
  return Math.sqrt(v / s);
};

function run(sigIn, a0, seed) {
  const rng = makeRng(seed);
  const t0 = Array.from({ length: a0 }, () => P.onset + sigIn * rng.normal());
  // threshold chain
  const thr = [stats(t0)];
  let times = t0;
  for (let d = 1; d <= P.D; d++) {
    times = thresholdStage(binsFromTimes(times), rng);
    // re-centre the volley at onset so the next stage sees it inside the window
    if (times.length) {
      const m = times.reduce((s, x) => s + x, 0) / times.length;
      times = times.map((t) => t - m + P.onset);
    }
    thr.push(stats(times));
    if (times.length === 0) break;
  }
  // linear chain
  const lin = [{ a: a0, sd: stats(t0).sd }];
  let drive = binsFromTimes(t0);
  for (let d = 1; d <= P.D; d++) {
    drive = linearStage(drive, a0);
    lin.push({ a: a0, sd: spread(drive) });
    // re-centre
    const mBin = Math.round(drive.reduce((s, x, k) => s + x * k, 0) / drive.reduce((s, x) => s + x, 0));
    const shift = mBin - Math.round(P.onset / P.dt), c = new Float64Array(drive.length);
    drive.forEach((x, k) => { const kk = k - shift; if (kk >= 0 && kk < c.length) c[kk] += x; });
    drive = c;
  }
  return { thr, lin };
}

const nSeeds = Number(process.argv[2] ?? 5);
const R = { params: P, J, runs: {} };
for (const sigIn of [0.5, 2, 4])
  for (const a0 of [100, 60])
    R.runs[`sig${sigIn}_a${a0}`] = [...Array(nSeeds).keys()].map((s) => run(sigIn, a0, s));

mkdirSync(new URL('../results/', import.meta.url), { recursive: true });
writeFileSync(new URL('../results/p1-chains.json', import.meta.url), JSON.stringify(R, null, 1));

const fmt = (x) => (Number.isFinite(x) ? x.toFixed(2) : '-');
for (const [k, runs] of Object.entries(R.runs)) {
  const depth = P.D + 1;
  const thrSd = [], thrA = [], linSd = [];
  for (let d = 0; d < depth; d++) {
    const t = runs.map((r) => r.thr[d]).filter(Boolean);
    thrSd.push(t.length === runs.length ? t.reduce((s, x) => s + x.sd, 0) / t.length : NaN);
    thrA.push(t.length === runs.length ? t.reduce((s, x) => s + x.a, 0) / t.length : 0);
    linSd.push(runs.reduce((s, r) => s + r.lin[d].sd, 0) / runs.length);
  }
  console.log(`${k}  threshold sd(ms): ${thrSd.map(fmt).join(' ')} | spikes: ${thrA.map((x) => x.toFixed(0)).join(' ')} | linear sd(ms): ${linSd.map(fmt).join(' ')}`);
}

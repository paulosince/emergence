// Volume transmission in constitutive 3D space (decisions of 09/11/2026,
// docs/spatial-diffusion-v0.1.md). Principal implementation: the analytic
// point-source kernel of the diffusion equation with first-order clearance
// (Nicholson; Rice and Cragg 2008, eq. 1; Sykova and Nicholson 2008, eq. 17):
//   C(r,t) = Q / (alpha (4 pi D* t)^{3/2}) exp(-r^2 / (4 D* t)) exp(-k t),
//   D* = D / lambda^2.
// Concentration is EXTRACELLULAR (Sykova and Nicholson 2008: the physiologically
// effective concentration is that of the extracellular space, not of tissue).
// Units: micrometres, seconds (milliseconds at the field interface), nM.
// Tissue obstacles enter on average through alpha and lambda: no mechanical
// collisions. Saturable (Michaelis-Menten) clearance is NOT linear and cannot
// use the kernel; such substances are refused (numerical variant pending).
import { makeRng } from '../../vendor/tempo/core/rng.js';

export const AVOGADRO = 6.02214076e23;
const UM3_TO_L = 1e-15;
export const moleculesPerUm3ToNM = x => (x / AVOGADRO / UM3_TO_L) * 1e9;

// Parameter sets with their sources. Free D in cm^2/s converted to um^2/s (x 1e8).
export const SUBSTANCES = Object.freeze({
  'dopamine-striatum': Object.freeze({
    source: 'Rice and Cragg 2008, Table 1 (striatum); uptake linearised as Vmax/Km, valid only far below Km',
    freeDiffusionUm2PerS: 7.63e-6 * 1e8, tortuosity: 1.54, volumeFraction: 0.21,
    clearance: { kind: 'linear', ratePerS: 20 }, quantumMolecules: 9800,
  }),
  'dopamine-snc': Object.freeze({
    source: 'Rice and Cragg 2008, Table 1 (substantia nigra pars compacta)',
    freeDiffusionUm2PerS: 7.63e-6 * 1e8, tortuosity: 1.58, volumeFraction: 0.30,
    clearance: { kind: 'linear', ratePerS: 0.12 }, quantumMolecules: 14000,
  }),
  'serotonin-raghupathi-2013': Object.freeze({
    source: 'Raghupathi et al. 2013, Table 1 (CNS medium parameters; saturable SERT uptake)',
    freeDiffusionUm2PerS: 5.4e-6 * 1e8, tortuosity: 1.65, volumeFraction: 0.17,
    clearance: { kind: 'saturable', kmNM: 605 }, quantumMolecules: null,
  }),
});

export const effectiveDiffusion = s => s.freeDiffusionUm2PerS / s.tortuosity ** 2;

function linearRate(s) {
  if (s.clearance.kind !== 'linear') {
    throw new RangeError('Analytic kernel requires linear clearance; saturable clearance needs the numerical variant');
  }
  return s.clearance.ratePerS;
}

// Extracellular concentration (nM) at distance rUm, tS seconds after an
// instantaneous release of q molecules.
export function kernelNM(s, q, rUm, tS) {
  if (!(tS > 0)) return 0;
  const D = effectiveDiffusion(s), k = linearRate(s);
  const c = q / (s.volumeFraction * (4 * Math.PI * D * tS) ** 1.5) * Math.exp(-(rUm * rUm) / (4 * D * tS) - k * tS);
  return moleculesPerUm3ToNM(c);
}

// Radius (um) within which the concentration exceeds thresholdNM at time tS
// (closed form: the iso-concentration surfaces are spheres).
export function influenceRadiusUm(s, q, thresholdNM, tS) {
  const c0 = kernelNM(s, q, 0, tS);
  if (!(c0 > thresholdNM)) return 0;
  return Math.sqrt(4 * effectiveDiffusion(s) * tS * Math.log(c0 / thresholdNM));
}

const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

// Event-driven field: releases are stored; concentration is evaluated only
// when a receptor asks (superposition of linear solutions).
export function createDiffusionField({ substances = SUBSTANCES, cutoffNM = 1e-3 } = {}) {
  const releases = new Map(); // id -> [{pos, tMs, q}]
  const params = id => {
    const s = substances[id];
    if (!s) throw new RangeError('Unknown substance: ' + id);
    linearRate(s);
    return s;
  };
  return {
    release(id, pos, tMs, q = params(id).quantumMolecules) {
      params(id);
      if (!(q > 0)) throw new RangeError('release quantity must be positive');
      if (!releases.has(id)) releases.set(id, []);
      releases.get(id).push({ pos: [...pos], tMs, q });
    },
    concentrationNM(id, pos, tMs) {
      const s = params(id);
      let c = 0;
      for (const r of releases.get(id) ?? []) if (r.tMs < tMs) c += kernelNM(s, r.q, dist(pos, r.pos), (tMs - r.tMs) / 1000);
      return c;
    },
    // Drop releases whose peak concentration (at the source) is already below
    // cutoff: the kernel's maximum over space decreases monotonically in time.
    prune(tMs) {
      let removed = 0;
      for (const [id, list] of releases) {
        const s = params(id);
        const keep = list.filter(r => tMs <= r.tMs || kernelNM(s, r.q, 0, (tMs - r.tMs) / 1000) >= cutoffNM);
        removed += list.length - keep.length;
        releases.set(id, keep);
      }
      return removed;
    },
    releaseCount(id) { return (releases.get(id) ?? []).length; },
  };
}

// --- Particle variant (validation only) -----------------------------------
// Free medium with the effective diffusion coefficient imposed: Gaussian
// random-walk steps, removal with probability k*dt per step. Returns radii of
// surviving particles at tS. Used to check equivalence with the kernel.
export function simulateFreeParticles(s, { particles, tS, dtS, seed = 1 }) {
  const rng = makeRng(seed), D = effectiveDiffusion(s), k = linearRate(s);
  const sigma = Math.sqrt(2 * D * dtS), steps = Math.round(tS / dtS), pRemove = k * dtS;
  const radii = [];
  for (let i = 0; i < particles; i++) {
    let x = 0, y = 0, z = 0, alive = true;
    for (let n = 0; n < steps; n++) {
      if (rng.random() < pRemove) { alive = false; break; }
      x += sigma * rng.normal(); y += sigma * rng.normal(); z += sigma * rng.normal();
    }
    if (alive) radii.push(Math.hypot(x, y, z));
  }
  return radii;
}
// Extracellular concentration (nM) in spherical shells from particle radii.
export function shellConcentrationNM(s, radii, { particles, q, edgesUm }) {
  const perParticle = q / particles;
  return edgesUm.slice(0, -1).map((r0, i) => {
    const r1 = edgesUm[i + 1], n = radii.filter(r => r >= r0 && r < r1).length;
    const vol = (4 / 3) * Math.PI * (r1 ** 3 - r0 ** 3);
    return { r0, r1, rMid: (r0 + r1) / 2, count: n, nM: moleculesPerUm3ToNM((n * perParticle) / (s.volumeFraction * vol)) };
  });
}

// Geometric tortuosity of a cubic lattice of convex cells (cubes of side a in
// periodic boxes of side L = a + gap) with volume fraction alpha = 1 - (a/L)^3.
// Random walk restricted to the extracellular space (moves into a cell are
// rejected). lambda_g = sqrt(D_free / D_effective) from mean square
// displacement. Theory: for convex cells lambda_g <= ~1.225 (Tao and Nicholson,
// cited by Sykova and Nicholson 2008).
export function measureLatticeTortuosity({ alpha = 0.2, periodUm = 1, freeDiffusionUm2PerS = 760,
  particles = 400, steps = 20000, stepUm = null, seed = 1 } = {}) {
  const a = periodUm * Math.cbrt(1 - alpha), gap = periodUm - a;
  const h = stepUm ?? gap / 10;
  const dt = (h * h) / (2 * freeDiffusionUm2PerS);
  const inCell = (x, y, z) => {
    const m = v => ((v % periodUm) + periodUm) % periodUm;
    return m(x) < a && m(y) < a && m(z) < a;
  };
  const rng = makeRng(seed);
  let msd = 0;
  for (let i = 0; i < particles; i++) {
    // start uniformly in the extracellular space
    let x, y, z;
    do { x = rng.random() * periodUm; y = rng.random() * periodUm; z = rng.random() * periodUm; } while (inCell(x, y, z));
    const x0 = x, y0 = y, z0 = z;
    for (let n = 0; n < steps; n++) {
      const nx = x + h * rng.normal(), ny = y + h * rng.normal(), nz = z + h * rng.normal();
      if (!inCell(nx, ny, nz)) { x = nx; y = ny; z = nz; }
    }
    msd += (x - x0) ** 2 + (y - y0) ** 2 + (z - z0) ** 2;
  }
  msd /= particles;
  const tS = steps * dt, dEff = msd / (6 * tS);
  return { alpha, cellSideUm: a, gapUm: gap, tS, msdUm2: msd, dEffUm2PerS: dEff, tortuosity: Math.sqrt(freeDiffusionUm2PerS / dEff),
    rmsDisplacementUm: Math.sqrt(msd) };
}

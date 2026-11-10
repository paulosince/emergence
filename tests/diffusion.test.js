import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SUBSTANCES, kernelNM, influenceRadiusUm, createDiffusionField, simulateFreeParticles,
  shellConcentrationNM, measureLatticeTortuosity, moleculesPerUm3ToNM, effectiveDiffusion } from '../src/space/diffusion.js';

const DA = SUBSTANCES['dopamine-striatum'];

test('kernel conserves mass up to clearance', () => {
  const t = 0.02, q = 9800;
  let total = 0; const dr = 0.05;
  for (let r = dr / 2; r < 60; r += dr) total += kernelNM(DA, q, r, t) * 4 * Math.PI * r * r * dr;
  const molecules = total / moleculesPerUm3ToNM(1) * DA.volumeFraction;
  assert.ok(Math.abs(molecules / (q * Math.exp(-DA.clearance.ratePerS * t)) - 1) < 1e-3);
});

test('reproduces Rice and Cragg (2008): ~7 um sphere of influence at 10 nM; peak at 5 um near 10 ms', () => {
  let maxR = 0;
  for (let t = 0.001; t < 0.1; t += 0.001) maxR = Math.max(maxR, influenceRadiusUm(DA, 9800, 10, t));
  assert.ok(maxR > 6.5 && maxR < 7.5, `max radius ${maxR}`);
  let best = 0, bt = 0;
  for (let t = 0.0005; t < 0.1; t += 0.0005) { const c = kernelNM(DA, 9800, 5, t); if (c > best) { best = c; bt = t; } }
  assert.ok(bt > 0.008 && bt < 0.014, `peak time ${bt}`);
});

test('iso-concentration surfaces are spheres: radius formula matches the kernel', () => {
  const t = 0.01, R = influenceRadiusUm(DA, 9800, 10, t);
  assert.ok(Math.abs(kernelNM(DA, 9800, R, t) - 10) < 1e-6);
});

test('field superposes releases and evaluates only on demand', () => {
  const f = createDiffusionField();
  f.release('dopamine-striatum', [0, 0, 0], 0);
  f.release('dopamine-striatum', [10, 0, 0], 0);
  const c = f.concentrationNM('dopamine-striatum', [5, 0, 0], 10);
  assert.ok(Math.abs(c - 2 * kernelNM(DA, 9800, 5, 0.01)) < 1e-9);
  assert.equal(f.concentrationNM('dopamine-striatum', [5, 0, 0], 0), 0, 'nothing before release');
});

test('pruning removes only releases already below cutoff everywhere', () => {
  const f = createDiffusionField({ cutoffNM: 1e-3 });
  f.release('dopamine-striatum', [0, 0, 0], 0);
  assert.equal(f.prune(50), 0);
  assert.equal(f.prune(2000), 1);
  assert.equal(f.releaseCount('dopamine-striatum'), 0);
});

test('saturable clearance is refused by the analytic kernel', () => {
  assert.throws(() => kernelNM(SUBSTANCES['serotonin-raghupathi-2013'], 1000, 1, 0.01), /linear clearance/);
  assert.throws(() => createDiffusionField().release('serotonin-raghupathi-2013', [0, 0, 0], 0, 1000), /linear clearance/);
});

test('particle variant agrees with the kernel in free medium (equivalence)', () => {
  const particles = 8000, q = 9800, t = 0.01;
  const radii = simulateFreeParticles(DA, { particles, tS: t, dtS: 0.0002, seed: 5 });
  const shells = shellConcentrationNM(DA, radii, { particles, q, edgesUm: [1, 2, 3, 4, 5, 6, 7] });
  for (const s of shells) {
    // shell average vs kernel averaged over the shell
    let num = 0, den = 0;
    for (let r = s.r0 + 0.005; r < s.r1; r += 0.01) { num += kernelNM(DA, q, r, t) * r * r; den += r * r; }
    const expected = num / den;
    assert.ok(Math.abs(s.nM / expected - 1) < 0.15, `shell ${s.rMid}: ${s.nM} vs ${expected}`);
  }
});

test('convex obstacles alone give geometric tortuosity near the ~1.225 bound, far below the measured ~1.6', () => {
  const r = measureLatticeTortuosity({ alpha: 0.2, particles: 120, steps: 30000, seed: 3 });
  assert.ok(r.tortuosity > 1.1 && r.tortuosity < 1.4, `tortuosity ${r.tortuosity}`);
  assert.ok(effectiveDiffusion(DA) < DA.freeDiffusionUm2PerS);
});

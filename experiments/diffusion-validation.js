// Validation of the volume-transmission module (docs/spatial-diffusion-v0.1.md).
// Usage: node experiments/diffusion-validation.js [--json]
import { SUBSTANCES, kernelNM, influenceRadiusUm, simulateFreeParticles, shellConcentrationNM,
  measureLatticeTortuosity, effectiveDiffusion } from '../src/space/diffusion.js';

const DA = SUBSTANCES['dopamine-striatum'];
const out = { substance: 'dopamine-striatum', source: DA.source, effectiveDiffusionUm2PerS: effectiveDiffusion(DA) };
out.influence10nM = [1, 5, 10, 20, 40, 60].map(ms => ({ ms, radiusUm: +influenceRadiusUm(DA, 9800, 10, ms / 1000).toFixed(2) }));
out.peaks = [1, 5, 10, 20].map(r => { let b = 0, bt = 0; for (let t = 0.0002; t < 0.3; t += 0.0002) { const c = kernelNM(DA, 9800, r, t); if (c > b) { b = c; bt = t; } }
  return { rUm: r, peakMs: +(bt * 1000).toFixed(1), peakNM: +b.toFixed(2) }; });
const particles = 40000, radii = simulateFreeParticles(DA, { particles, tS: 0.01, dtS: 0.0001, seed: 11 });
out.equivalence = shellConcentrationNM(DA, radii, { particles, q: 9800, edgesUm: [0, 1, 2, 3, 4, 5, 6, 7, 8, 10] })
  .map(s => ({ rMid: s.rMid, count: s.count, particlesNM: +s.nM.toFixed(2), kernelNM: +kernelNM(DA, 9800, s.rMid, 0.01).toFixed(2) }));
out.latticeTortuosity = [0.2, 0.3, 0.5].map(alpha => {
  const r = measureLatticeTortuosity({ alpha, particles: 200, steps: 80000, seed: 7 });
  return { alpha, tortuosity: +r.tortuosity.toFixed(3), rmsUm: +r.rmsDisplacementUm.toFixed(2) };
});
if (process.argv.includes('--json')) console.log(JSON.stringify(out, null, 2));
else {
  console.log('D* =', out.effectiveDiffusionUm2PerS.toFixed(0), 'um^2/s');
  console.log('Raio de influencia (10 nM):', out.influence10nM.map(x => `${x.ms} ms: ${x.radiusUm} um`).join('; '));
  console.log('Picos:', out.peaks.map(p => `${p.rUm} um: ${p.peakMs} ms, ${p.peakNM} nM`).join('; '));
  console.log('Particulas x nucleo (10 ms):'); for (const s of out.equivalence) console.log(`  ${s.rMid} um  ${s.particlesNM} x ${s.kernelNM} nM  (n=${s.count})`);
  console.log('Tortuosidade geometrica (cubos convexos):', out.latticeTortuosity.map(x => `alfa ${x.alpha}: ${x.tortuosity}`).join('; '));
}

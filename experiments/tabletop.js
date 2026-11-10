// P0.6 — Tabletop world summary: physics verification and sensing statistics.
// Usage: node experiments/tabletop.js [--json]
import { createTabletopScenario } from '../src/sensory/tabletop-scenario.js';
import { verifyTabletop } from '../src/world/tabletop-verifier.js';
import { runExperiment } from '../src/runtime/experiment-runner.js';
import { DiagnosticEngine } from '../src/engines/diagnostic-engine.js';
const { world, ...cfg } = createTabletopScenario({});
const v = verifyTabletop(world, { stepMs: 10 });
const r = runExperiment({ ...cfg, engine: new DiagnosticEngine() });
const spec = cfg.environment.specification().channels;
const per = t => r.incidences.filter(i => spec.find(c => c.channelId === i.transducerId).type === t).length;
const out = { verification: { passed: v.passed, checks: v.checks }, collisions: world.describe().collisions,
  channels: { total: spec.length, retina: spec.filter(c => c.type === 'retina').length,
    tactile: spec.filter(c => c.type === 'tactile').length, thermalThreshold: spec.filter(c => c.type === 'thermal-threshold').length },
  incidences: { total: r.summary.deliveredCount, retina: per('retina'), tactile: per('tactile'), thermal: per('thermal-threshold') },
  interventions: world.eventsThrough(cfg.endTimeMs).filter(e => e.type.startsWith('intervention')).length };
console.log(process.argv.includes('--json') ? JSON.stringify(out, null, 2) : out);

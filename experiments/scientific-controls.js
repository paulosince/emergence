// Scientific control campaign, researcher-facing.
// node experiments/scientific-controls.js [--json] [--condition=single-baseline-v1]
import { SCIENTIFIC_CONTROLS_V1, runScientificControl } from
  '../src/research/scientific-controls.js';
import { readSourceRevision } from '../src/research/source-revision.js';

const flags = process.argv.slice(2);
if (flags.some(f => f !== '--json' && !f.startsWith('--condition=')) ||
    flags.filter(f => f.startsWith('--condition=')).length > 1) {
  throw new Error('Use --json and/or --condition=<versioned-control-id>');
}
const requested = flags.find(f => f.startsWith('--condition='))?.slice(12);
const ids = requested ? [requested] : SCIENTIFIC_CONTROLS_V1.map(x => x.id);
const revision = readSourceRevision(new URL('../', import.meta.url));
const outputs = ids.map(id => runScientificControl(id, {
  softwareRevision: revision,
}));
if (flags.includes('--json')) {
  console.log(JSON.stringify({
    campaign: 'EMERGENCE scientific controls v1',
    status: 'instrument validation, not autonomous representation',
    outputs,
  }, null, 2));
} else {
  console.log(JSON.stringify({
    campaign: 'EMERGENCE scientific controls v1',
    scenarioCount: outputs.length,
    scenarios: outputs.map(out => ({
      controlId: out.condition.id,
      changedFactor: out.condition.changedFactor,
      sampleCount: out.result.summary.sampleCount,
      incidenceCount: out.result.summary.deliveredCount,
      incidenceAudit: out.incidenceAudit.passed,
      physicalAudits: out.physicalAudits.every(x => x.passed),
    })),
  }, null, 2));
}
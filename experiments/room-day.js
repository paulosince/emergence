// node experiments/room-day.js [--json|--csv] [--overcast] [--no-sensors]
import { createRoomScenario } from '../src/room/room-scenario.js';
import { runExperiment } from '../src/runtime/experiment-runner.js';
import { DiagnosticEngine } from '../src/engines/diagnostic-engine.js';
import { readSourceRevision } from '../src/research/source-revision.js';
import { toCsv } from '../src/research/csv.js';

const flags=process.argv.slice(2);
const valid=['--json','--csv','--overcast','--no-sensors'];
if(flags.some(f=>!valid.includes(f)) ||
   new Set(flags).size!==flags.length ||
   (flags.includes('--json') && flags.includes('--csv')))
  throw new Error('Use one output format, optional --overcast and --no-sensors');
const scene=createRoomScenario({
  weatherPreset:flags.includes('--overcast')?'overcast':'clear',
  modalities:flags.includes('--no-sensors')?[]:undefined,
});
const result=runExperiment({
  ...scene,engine:new DiagnosticEngine(),
  softwareRevision:readSourceRevision(new URL('../',import.meta.url)),
});
if(flags.includes('--json')) {
  console.log(JSON.stringify({
    result,physicalEvents:scene.world.eventsThrough(scene.endTimeMs),
    researcherStates:[0,6,9,12,15,18,21,23.5].map(hour=>
      scene.world.stateAt(hour*3600000)),
  },null,2));
} else if(flags.includes('--csv')) {
  process.stdout.write(toCsv(result.incidences.map(i=>({
    channel:i.transducerId,observed_at_ms:i.observedAtMs,
    delivered_at_ms:i.arrivedAtMs,measurement:i.measurement,
  })),['channel','observed_at_ms','delivered_at_ms','measurement']));
} else {
  const events=scene.world.eventsThrough(scene.endTimeMs);
  console.log(JSON.stringify({
    scenarioId:scene.researchScenarioId,
    description:'Naturalistic room v1, researcher-side real mechanisms; not learned',
    date:scene.world.describe().date,
    weatherProvenance:scene.world.describe().weather,
    events, summary:result.summary,
    diagnosticSnapshot:result.finalSnapshot,
  },null,2));
}
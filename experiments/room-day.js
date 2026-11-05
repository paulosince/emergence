// Bounded naturalistic external-world scenario. No action by investigated body.
import { createRoomScenario } from '../src/room/room-scenario.js';
import { runExperiment } from '../src/runtime/experiment-runner.js';
import { DiagnosticEngine } from '../src/engines/diagnostic-engine.js';
import { readSourceRevision } from '../src/research/source-revision.js';
import { toCsv } from '../src/research/csv.js';
const flags=new Set(process.argv.slice(2));
if([...flags].some(x=>!['--json','--csv','--without-sensors','--overcast'].includes(x)) ||
   (flags.has('--json')&&flags.has('--csv')))
   throw new Error('Supported flags: --json, --csv, --without-sensors, --overcast');
const scene=createRoomScenario({
  modalities:flags.has('--without-sensors')?[]:['optical','electrical'],
  worldOptions:flags.has('--overcast')?{cloudCover:1}:{},
});
const result=runExperiment({
  ...scene,engine:new DiagnosticEngine(),
  softwareRevision:readSourceRevision(new URL('../',import.meta.url)),
});
const sampledPhysical=[0,3,6,9,12,15,18,21,24].map(h=>{
  const state=scene.world.stateAt(h*3600000);
  return {solarHour:h,altitudeDeg:state.sun.altitudeDeg,
    outdoorIlluminance:state.outdoorIlluminance,
    floorIlluminance:scene.world.floorIlluminanceAt(h*3600000,{x:0,y:0}),
    lampOn:state.lampOn,
    windowPatchAreaM2:state.projectedWindowAreaM2};
});
if(flags.has('--json'))console.log(JSON.stringify({
  result,physicalAudit:sampledPhysical,
  lampEvents:scene.world.eventsThrough(scene.endTimeMs),
},null,2));
else if(flags.has('--csv'))
  process.stdout.write(toCsv(result.incidences.map(i=>({
    channel:i.transducerId,observed_ms:i.observedAtMs,
    arrived_ms:i.arrivedAtMs,measurement:i.measurement,
  })),['channel','observed_ms','arrived_ms','measurement']));
else console.log(JSON.stringify({
  scenario:scene.researchScenarioId,
  scientificStatus:'analytic daylight and optical sensing only; no unit constitution',
  parameters:scene.world.describe().parameters,
  receivedIncidences:result.summary.deliveredCount,
  events:scene.world.eventsThrough(scene.endTimeMs),
  observations:sampledPhysical,
},null,2));

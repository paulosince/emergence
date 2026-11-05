// A research record contains a versioned, re-creatable SCENARIO definition
// and a RESULT captured for the researcher. Imported content is untrusted.
// Recorded replay reads history; independent re-execution computes a fresh
// physics/sensor trace and reports exact equivalence.
import {createRoomScenario} from '../room/room-scenario.js';
import {DiagnosticEngine} from '../engines/diagnostic-engine.js';
import {runExperiment} from '../runtime/experiment-runner.js';
import {ExperimentSession} from '../runtime/experiment-session.js';
import {EMERGENCE_VERSION} from '../research/version.js';
import {validateResearchRecord} from './archive.js';

export const RECORD_SCHEMA='emergence-record-v1';
export const RESEARCH_CHECKPOINT_MS=12*3600000;
const clone=x=>structuredClone(x);

export function configurationForRecord(options) {
  if(!options || typeof options!=='object' || Array.isArray(options))
    throw new TypeError('Room scenario options must be a record');
  const {
    modalities=['optical','thermal','electrical'],
    weatherPreset='clear',
    worldOptions={date:'2026-06-21',opaqueObjectEnabled:true},
    sensorOverrides={},
    seed=42,
    endTimeMs=86400000-1,
  }=options;
  const snapshot=clone({
    modalities,weatherPreset,worldOptions,sensorOverrides,seed,endTimeMs,
  });
  // Use the actual scenario constructor as the canonical parameter validator.
  createRoomScenario(snapshot);
  return snapshot;
}

export function buildRoomRecord(options, {
  withCheckpoint=true,softwareRevision=null,
}={}) {
  const config=configurationForRecord(options);
  const scene=createRoomScenario(config);
  const result=runExperiment({
    ...scene,engine:new DiagnosticEngine(),softwareRevision,
  });
  let checkpoint=null;
  if(withCheckpoint) {
    const session=new ExperimentSession({
      ...createRoomScenario(config),
      engine:new DiagnosticEngine(),softwareRevision,
    });
    session.advanceThrough(Math.min(RESEARCH_CHECKPOINT_MS,scene.endTimeMs));
    checkpoint=session.checkpoint();
  }
  return Object.freeze({
    schema:RECORD_SCHEMA,
    scenario:{kind:'room-v1',options:config},
    checkpoint,
    result,
    researcherOnly:true,
  });
}

function firstDifference(expected,actual,path='result'){
  if(Object.is(expected,actual))return null;
  if(typeof expected!==typeof actual ||
     expected===null||actual===null ||
     typeof expected!=='object'){
    return {path,stored:expected,computed:actual};
  }
  const keysA=Object.keys(expected).sort(),keysB=Object.keys(actual).sort();
  if(JSON.stringify(keysA)!==JSON.stringify(keysB))
    return {path,storedKeys:keysA,computedKeys:keysB};
  for(const k of keysA){
    const difference=firstDifference(expected[k],actual[k],
      path+'.'+k);
    if(difference)return difference;
  }
  return null;
}

export function independentlyReexecute(record) {
  validateResearchRecord(record);
  const config=configurationForRecord(record.scenario.options);
  const fresh=runExperiment({
    ...createRoomScenario(config),engine:new DiagnosticEngine(),
    softwareRevision:record.result.manifest.software.revision,
  });
  const difference=firstDifference(record.result,fresh);
  return {
    equivalent:difference===null,
    mode:'fresh-physical-world-and-sensors-reexecution',
    exactComparison:'all manifest, samples, incidences, events, counters, state',
    firstDifference:difference,
    comparedIncidences:fresh.incidences.length,
    softwareVersion:EMERGENCE_VERSION,
    storedSoftwareVersion:record.result.manifest.software.version,
  };
}

export function resumeSavedCheckpoint(record) {
  validateResearchRecord(record);
  if(!record.checkpoint)
    throw new RangeError('This record has no genuine saved checkpoint');
  const config=configurationForRecord(record.scenario.options);
  const session=ExperimentSession.restore(record.checkpoint,{
    ...createRoomScenario(config),engine:new DiagnosticEngine(),
    softwareRevision:record.result.manifest.software.revision,
  });
  const result=session.finish();
  const difference=firstDifference(record.result,result);
  return {
    equivalent:difference===null,
    mode:'resume-from-captured-state-not-replay-from-start',
    checkpointTimeMs:record.checkpoint.cursor.processedThroughMs,
    firstDifference:difference,
    comparedIncidences:result.incidences.length,
    softwareVersion:EMERGENCE_VERSION,
  };
}

export function recordedPlayback(record) {
  validateResearchRecord(record);
  // History is copied, not recomputed. This operation does not assert
  // independent reproducibility: use independentlyReexecute for that.
  return {
    mode:'recorded-history-playback',
    incidences:clone(record.result.incidences),
    trace:clone(record.result.trace),
    manifest:clone(record.result.manifest),
    summary:clone(record.result.summary),
  };
}

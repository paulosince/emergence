import {test} from 'node:test';
import assert from 'node:assert/strict';
import {buildRoomRecord,independentlyReexecute,resumeSavedCheckpoint,
  recordedPlayback} from '../src/persistence/records.js';
import {exportScientificArchive,importScientificArchive,
  validateResearchRecord} from '../src/persistence/archive.js';
import {ExperimentSession} from '../src/runtime/experiment-session.js';
import {DiagnosticEngine} from '../src/engines/diagnostic-engine.js';
import {createRoomScenario} from '../src/room/room-scenario.js';
import {openExperimentStore,DB_VERSION} from '../src/persistence/indexeddb.js';

test('scientific ZIP package roundtrip preserves actual manifest, traces and checkpoint',async()=>{
  const record=buildRoomRecord({
    weatherPreset:'overcast',worldOptions:{
      date:'2026-09-22',opaqueObjectEnabled:false,
    },
    modalities:['optical','electrical'],
  });
  assert.equal(validateResearchRecord(record),true);
  const data=await exportScientificArchive(record);
  assert.equal(data[0],80);assert.equal(data[1],75);
  assert.ok(data.length>2000);
  const imported=await importScientificArchive(data);
  assert.deepEqual(imported,record);
  assert.equal(independentlyReexecute(imported).equivalent,true);
  const resumed=resumeSavedCheckpoint(imported);
  assert.equal(resumed.equivalent,true,JSON.stringify(resumed.firstDifference));
  assert.ok(resumed.checkpointTimeMs>=12*3600000);
  const playback=recordedPlayback(imported);
  assert.equal(playback.mode,'recorded-history-playback');
  assert.deepEqual(playback.incidences,record.result.incidences);
});

test('noise streams survive archived checkpoints and exact replay',async()=>{
  const opts={seed:15,
    sensorOverrides:{r0:{periodMs:123456,noiseStd:.1,emitMode:'all'}},
  };
  const record=buildRoomRecord(opts);
  assert.equal(independentlyReexecute(record).equivalent,true);
  assert.equal(resumeSavedCheckpoint(record).equivalent,true);
  const revived=await importScientificArchive(await exportScientificArchive(record));
  assert.deepEqual(revived,record);
});

test('archive without checkpoint still independently reexecutes',async()=>{
  const rec=buildRoomRecord({modalities:[]},{withCheckpoint:false});
  assert.equal(rec.result.incidences.length,0);
  const output=await importScientificArchive(await exportScientificArchive(rec));
  assert.equal(output.checkpoint,null);
  assert.equal(independentlyReexecute(output).equivalent,true);
  assert.throws(()=>resumeSavedCheckpoint(output),/no genuine/);
});

test('corrupted ZIP payload and directory are rejected instead of silently loaded',async()=>{
  const record=buildRoomRecord({});
  const data=await exportScientificArchive(record);
  const flipped=new Uint8Array(data);
  const index=flipped.indexOf(123,50);
  assert.ok(index>0);
  flipped[index]^=0x01;
  await assert.rejects(()=>importScientificArchive(flipped),
    /CRC|integrity/i);
  const broken=new Uint8Array(data);
  broken[0]=0;
  await assert.rejects(()=>importScientificArchive(broken),
    /ZIP/);
  await assert.rejects(()=>importScientificArchive(new Uint8Array(20)),
    /Invalid/);
});

test('recorded data are not asserted equivalent if altered, and bad scenarios fail',()=>{
  const stored=structuredClone(buildRoomRecord({
    weatherPreset:'clear',
  }));
  stored.result.incidences[2].measurement+=1;
  const verdict=independentlyReexecute(stored);
  assert.equal(verdict.equivalent,false);
  assert.ok(verdict.firstDifference.path.includes('incidences'));
  const checkpoint=resumeSavedCheckpoint(stored);
  assert.equal(checkpoint.equivalent,false);
  const damaged=structuredClone(stored);
  damaged.scenario.options.worldOptions.date='2026-02-30';
  assert.throws(()=>independentlyReexecute(damaged),RangeError);
  const unknown=structuredClone(stored);
  unknown.scenario.kind='motor-v1';
  assert.throws(()=>independentlyReexecute(unknown),/unsupported/);
  const wrongVersion=structuredClone(stored);
  wrongVersion.checkpoint.simulationVersion='0.0.0';
  assert.throws(()=>resumeSavedCheckpoint(wrongVersion),/incompatible/);
});

test('checkpoint held in archive contains real pending queue, world state and RNG',()=>{
  const record=buildRoomRecord({});
  const cp=record.checkpoint;
  assert.equal(cp.world.kind,'immutable-analytic-world');
  assert.equal(cp.manifest.environment.world.modelId,
    'naturalistic-room-thermal-optical-v1');
  assert.equal(cp.scheduler.events.some(x=>x.kind==='sample'),true);
  assert.equal(cp.sensorStates.length,6);
  const session=ExperimentSession.restore(cp,{
    ...createRoomScenario(record.scenario.options),
    engine:new DiagnosticEngine(),
  });
  assert.deepEqual(session.finish(),record.result);
});

test('IndexedDB adapter fails explicitly when unavailable, and schema remains versioned',async()=>{
  assert.equal(DB_VERSION,2);
  await assert.rejects(()=>openExperimentStore(null),/unavailable/);
  await assert.rejects(()=>openExperimentStore({
    open(){const req={};queueMicrotask(()=>{
      req.error=new Error('access denied');req.onerror();
    });return req;},
  }),/access denied/);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRoomScenario } from '../src/room/room-scenario.js';
import { runExperiment } from '../src/runtime/experiment-runner.js';
import { DiagnosticEngine } from '../src/engines/diagnostic-engine.js';
import { auditIncidenceTrace } from '../src/research/incidence-audit.js';
import { auditDiagnosticDelivery } from '../src/research/diagnostic-audit.js';
const execute=(opts)=>runExperiment({
  ...createRoomScenario(opts),engine:new DiagnosticEngine(),
});

test('naturalistic room executes one day with instrumented heterogeneous channels',()=>{
  const result=execute();
  assert.equal(result.manifest.environment.world.modelId,
    'naturalistic-room-thermal-optical-v1');
  assert.equal(result.manifest.environment.couplings.length,6);
  assert.ok(result.summary.deliveredCount>20);
  assert.ok(result.incidences.some(i=>i.transducerId==='r0'));
  assert.ok(result.incidences.some(i=>i.transducerId==='r3'));
  assert.ok(result.incidences.some(i=>i.transducerId==='r5'));
  assert.equal(result.finalSnapshot.nodeCount,0);
  assert.equal(result.finalSnapshot.relationCount,0);
  assert.equal(auditIncidenceTrace(result).passed,true);
  assert.equal(auditDiagnosticDelivery(result).passed,true);
});

test('removing every modality leaves persistent physical solar and lamp events',()=>{
  const full=execute();
  const none=execute({modalities:[]});
  assert.deepEqual(none.manifest.environment.world,
    full.manifest.environment.world);
  assert.equal(none.summary.deliveredCount,0);
  assert.equal(none.summary.sampleCount,0);
  assert.equal(none.finalSnapshot.receivedCount,0);
  assert.deepEqual(none.incidences,[]);
  const world=createRoomScenario({modalities:[]}).world;
  assert.ok(world.eventsThrough(86399999).filter(e=>
    e.type==='lamp.toggle').length>=2);
});

test('changing one sensor period affects only that incidence series',()=>{
  const full=execute();
  const coarse=execute({sensorOverrides:{r0:{periodMs:3600000}}});
  assert.deepEqual(full.manifest.environment.world,
    coarse.manifest.environment.world);
  for(const id of ['r1','r2','r3','r4','r5']) {
    const row=x=>x.incidences.filter(i=>i.transducerId===id)
      .map(i=>[i.observedAtMs,i.measurement]);
    assert.deepEqual(row(coarse),row(full));
  }
  assert.notDeepEqual(
    coarse.incidences.filter(i=>i.transducerId==='r0').map(i=>i.observedAtMs),
    full.incidences.filter(i=>i.transducerId==='r0').map(i=>i.observedAtMs));
});

test('overcast changes physical daylight but does not inject semantic labels',()=>{
  const clear=execute();
  const overcast=execute({weatherPreset:'overcast'});
  assert.notDeepEqual(clear.manifest.environment.world.weather,
    overcast.manifest.environment.world.weather);
  assert.notDeepEqual(clear.incidences.filter(i=>i.transducerId==='r2')
    .map(i=>i.measurement),
    overcast.incidences.filter(i=>i.transducerId==='r2')
    .map(i=>i.measurement));
  for(const i of overcast.incidences) {
    assert.deepEqual(Object.keys(i).sort(),[
      'arrivedAtMs','incidenceId','measurement','observedAtMs',
      'transducerId'].sort());
  }
  assert.ok(!JSON.stringify(overcast.incidences).includes('cloudCover'));
});

test('no requested sensor can read the physical world metadata through an incidence',()=>{
  const observed=[];
  const engine={
    ingest(i){observed.push(structuredClone(i));},
    advanceTo(){},snapshot(){return{};},drainEvents(){return[];},
  };
  const scene=createRoomScenario();
  runExperiment({...scene,engine});
  assert.ok(observed.length>0);
  for(const i of observed) {
    assert.equal(typeof i.measurement,'number');
  }
  const stream=JSON.stringify(observed);
  assert.ok(!stream.includes('latitudeDeg'));
  assert.ok(!stream.includes('lampOn'));
  assert.ok(!stream.includes('window'));
  assert.ok(!stream.includes('temperatureC'));
});

test('same scenario is deterministic independent of sensor modality availability',()=>{
  const first=execute(),second=execute();
  assert.deepEqual(first,second);
  const visual=execute({modalities:['optical']});
  assert.deepEqual(visual.manifest.environment.world,
    first.manifest.environment.world);
  assert.ok(visual.incidences.every(i=>['r0','r1','r2'].includes(i.transducerId)));
});

test('invalid or out-of-domain sensory couplings are rejected',()=>{
  assert.throws(()=>createRoomScenario({modalities:['audio']}),RangeError);
  assert.throws(()=>createRoomScenario({
    modalities:[],sensorOverrides:{r0:{periodMs:10}},
  }),RangeError);
  assert.throws(()=>createRoomScenario({
    sensorOverrides:{r0:{objectId:'sun'}},
  }),RangeError);
  const scene=createRoomScenario();
  assert.throws(()=>scene.environment.readAt('c999',0),RangeError);
  assert.throws(()=>runExperiment({
    ...createRoomScenario({endTimeMs:86400001}),
    engine:new DiagnosticEngine(),
  }),RangeError);
});

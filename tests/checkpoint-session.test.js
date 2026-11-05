import {test} from 'node:test';
import assert from 'node:assert/strict';
import {ExperimentSession,CHECKPOINT_SCHEMA} from
  '../src/runtime/experiment-session.js';
import {runExperiment} from '../src/runtime/experiment-runner.js';
import {sensorRandomStream} from '../src/runtime/seed-stream.js';
import {checkpointSensorRng} from '../src/runtime/checkpoint-rng.js';
import {DiagnosticEngine} from '../src/engines/diagnostic-engine.js';
import {createRoomScenario} from '../src/room/room-scenario.js';
import {createBodyScenario} from '../src/body/body-scenario.js';
import {createWorldSensoryScenario} from '../src/sensory/world-scenario.js';
import {createPhase1Scenario} from '../src/sensory/scenarios.js';

function inputs(factory,options={}) {
  return {...factory(options),engine:new DiagnosticEngine()};
}
function proveParity(label,factory,options={},cuts=[0,10,250,500,1000]) {
  test(label+': continuous execution matches fresh checkpointed and multiple resumes',()=>{
    const baseline=runExperiment(inputs(factory,options));
    const uninterrupted=new ExperimentSession(inputs(factory,options)).finish();
    assert.deepEqual(uninterrupted,baseline,
      'Checkpoint-capable session must match original runner in all recorded fields');
    let s=new ExperimentSession(inputs(factory,options));
    for(const cut of cuts.filter(t=>t<s.endTimeMs)){
      s.advanceThrough(cut);
      const payload=JSON.parse(JSON.stringify(s.checkpoint()));
      assert.equal(payload.schema,CHECKPOINT_SCHEMA);
      assert.ok(Array.isArray(payload.scheduler.events));
      assert.ok(payload.sensorStates.every(x=>Number.isInteger(x.rngState)));
      assert.deepEqual(payload.world.specification,
        payload.manifest.environment);
      s=ExperimentSession.restore(payload,inputs(factory,options));
    }
    assert.deepEqual(s.finish(),baseline);
  });
}
proveParity('room standard',createRoomScenario,{},[
  0,900000,900020,12*3600000,23*3600000]);
proveParity('room with slow random and noise',createRoomScenario,{
  sensorOverrides:{
    r0:{periodMs:123456,noiseStd:.3,emitMode:'all'},
    r3:{periodMs:97000,noiseStd:.04,latencyMs:50000},
  },
  seed:321,
},[0,97000,100000,999999,18*3600000]);
proveParity('body actuator',createBodyScenario,{},[
  0,10,100,800,900,1200,1500]);
proveParity('controlled world with deliberately noisy sensors',
  createWorldSensoryScenario,{
    sensorOverrides:{s0:{noiseStd:.05,periodMs:10,emitMode:'all'}},
    seed:102,
  },[0,2,125,250,460,700]);
proveParity('all-disabled room',createRoomScenario,{
  modalities:[],
},[0,10,12*3600000]);
proveParity('all-disabled body',createBodyScenario,{
  modalities:[],
},[0,800,1500]);

test('checkpoint PRNG reproduces pinned TEMPO generator exactly including Gaussians',()=>{
  for(const seed of [0,1,42,0xffffffff]){
    for(const id of ['r0','sensor-one','s4']){
      const upstream=sensorRandomStream(seed,id);
      const checkpoint=checkpointSensorRng(seed,id);
      for(let j=0;j<15;j++) {
        assert.equal(checkpoint.random(),upstream.random());
        assert.equal(checkpoint.normal(),upstream.normal());
      }
      const state=checkpoint.state();
      const restored=checkpointSensorRng(seed,id,state);
      for(let j=0;j<9;j++) {
        assert.equal(checkpoint.normal(),restored.normal());
        assert.equal(checkpoint.random(),restored.random());
      }
    }
  }
});

test('pending delayed deliveries remain pending at a checkpoint, then arrive exactly once',()=>{
  const options={sensorOverrides:{
    r0:{periodMs:900000,latencyMs:40000},
  }};
  const expected=runExperiment(inputs(createRoomScenario,options));
  const session=new ExperimentSession(inputs(createRoomScenario,options));
  session.advanceThrough(100);
  const checkpoint=session.checkpoint();
  assert.equal(checkpoint.cursor.processedThroughMs,100);
  assert.ok(checkpoint.scheduler.events.some(e=>e.kind==='deliver'));
  const after=ExperimentSession.restore(
    structuredClone(checkpoint),inputs(createRoomScenario,options));
  assert.deepEqual(after.finish(),expected);
});

test('resuming after all events but before finalization preserves final time',()=>{
  const scene=inputs(createWorldSensoryScenario,{
    modalities:[],endTimeMs:800,
  });
  const expected=runExperiment(scene);
  const session=new ExperimentSession(inputs(createWorldSensoryScenario,{
    modalities:[],endTimeMs:800,
  }));
  session.advanceThrough(400);
  const cp=session.checkpoint();
  assert.equal(cp.cursor.clockMs,0);
  assert.equal(cp.cursor.processedThroughMs,400);
  const again=ExperimentSession.restore(cp,
    inputs(createWorldSensoryScenario,{modalities:[],endTimeMs:800}));
  assert.deepEqual(again.finish(),expected);
});

test('checkpoint rejects mismatched world, sensor controls, version and corrupted counters',()=>{
  const scenario=()=>inputs(createRoomScenario);
  const ses=new ExperimentSession(scenario());
  ses.advanceThrough(900000);
  const saved=ses.checkpoint();
  assert.throws(()=>ExperimentSession.restore(saved,
    inputs(createRoomScenario,{weatherPreset:'overcast'})),
    /mismatch/);
  assert.throws(()=>ExperimentSession.restore(saved,
    inputs(createRoomScenario,{modalities:[]})),
    /mismatch/);
  const changed=structuredClone(saved);
  changed.simulationVersion='999';
  assert.throws(()=>ExperimentSession.restore(changed,scenario()),
    /incompatible/);
  const corrupted=structuredClone(saved);
  corrupted.counts.deliveredCount=-1;
  assert.throws(()=>ExperimentSession.restore(corrupted,scenario()),
    /incoherent/);
  const unordered=structuredClone(saved);
  unordered.scheduler.events[0].timeMs=-1;
  assert.throws(()=>ExperimentSession.restore(unordered,scenario()),
    /scheduler event/);
  assert.throws(()=>ses.advanceThrough(1),/boundary/);
});

test('session does not share mutable references with exported checkpoint',()=>{
  const scenario=()=>inputs(createBodyScenario);
  const ses=new ExperimentSession(scenario());
  ses.advanceThrough(100);
  const saved=ses.checkpoint();
  const second=ExperimentSession.restore(saved,scenario());
  saved.trace[0].measurement=99999;
  saved.sensorStates[0].rngState=88888;
  assert.deepEqual(second.finish(),runExperiment(scenario()));
});


test('actual world temperature, lamp events and solar state are captured at the boundary',()=>{
  const scene=inputs(createRoomScenario,{});
  const ses=new ExperimentSession(scene);
  const at=12*3600000;
  ses.advanceThrough(at);
  const cp=ses.checkpoint();
  assert.equal(cp.world.capturedAtMs,at);
  assert.equal(cp.world.physicalState.world.timeMs,at);
  assert.ok(Number.isFinite(cp.world.physicalState.world.thermal.indoorTemperatureC));
  assert.ok(Array.isArray(cp.world.physicalState.physicalEvents));
  const changed=structuredClone(cp);
  changed.world.physicalState.world.thermal.indoorTemperatureC+=0.1;
  assert.throws(()=>ExperimentSession.restore(changed,inputs(createRoomScenario,{})),
    /physical state differs/);
});

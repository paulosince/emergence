import {test} from 'node:test';
import assert from 'node:assert/strict';
import {ExecutionController,EXECUTION_STATES,ExecutionStateError}
  from '../src/runtime/execution-controller.js';
import {runExperiment} from '../src/runtime/experiment-runner.js';
import {DiagnosticEngine} from '../src/engines/diagnostic-engine.js';
import {createRoomScenario} from '../src/room/room-scenario.js';
import {createBodyScenario} from '../src/body/body-scenario.js';

const HOUR=3600000;
const room=()=>({...createRoomScenario({}),engine:new DiagnosticEngine()});

// Engine wrapper that counts every operation the runtime performs on it.
class CountingEngine extends DiagnosticEngine {
  ingested=0;advanced=0;
  ingest(incidence){this.ingested++;return super.ingest(incidence);}
  advanceTo(t){this.advanced++;return super.advanceTo(t);}
}

test('acceptance 2.4: an operational pause stops ALL engine activity until resume',()=>{
  const engine=new CountingEngine();
  const c=new ExecutionController({...createRoomScenario({}),engine});
  c.start().advanceTo(6*HOUR).pause('test');
  const frozen=c.observe().progress;
  const ops={ingested:engine.ingested,advanced:engine.advanced};
  assert.ok(ops.ingested>0,'some incidences must have reached the engine');

  for(const attempt of [()=>c.advanceTo(12*HOUR),()=>c.advanceBy(HOUR),
    ()=>c.runToEnd(),()=>c.start(),()=>c.pause()]){
    assert.throws(attempt,ExecutionStateError);
  }
  assert.deepEqual(c.observe().progress,frozen,'no scheduled event processed');
  assert.deepEqual({ingested:engine.ingested,advanced:engine.advanced},ops,
    'engine received nothing while paused');
  assert.equal(c.state,EXECUTION_STATES.PAUSED);

  c.resume().advanceTo(7*HOUR);
  assert.ok(engine.ingested>ops.ingested,'execution continues after resume');
});

test('paused, resumed and chunked execution equals the continuous reference run',()=>{
  const reference=runExperiment(room());
  const c=new ExecutionController(room());
  c.start();
  for(const t of [1,2.5,6,11.99,12,18])c.advanceTo(t*HOUR);
  c.pause().resume();
  c.advanceBy(30*60000).pause('mid-afternoon').resume().runToEnd();
  assert.equal(c.state,EXECUTION_STATES.COMPLETED);
  assert.deepEqual(c.result(),reference);
});

test('body scenario: chunked controller execution preserves exact history',()=>{
  const inputs=()=>({...createBodyScenario({}),engine:new DiagnosticEngine()});
  const reference=runExperiment(inputs());
  const c=new ExecutionController(inputs()).start();
  const end=c.endTimeMs;
  for(let k=1;k<=7;k++)c.advanceTo(end*k/8);
  c.runToEnd();
  assert.deepEqual(c.result(),reference);
});

test('a prepared run executes nothing and exposes no result',()=>{
  const engine=new CountingEngine();
  const c=new ExecutionController({...createRoomScenario({}),engine});
  assert.equal(c.state,EXECUTION_STATES.PREPARED);
  assert.equal(c.observe().progress.processedEvents,0);
  assert.equal(c.observe().incidences.length,0);
  assert.equal(engine.ingested,0);
  assert.throws(()=>c.advanceTo(HOUR),ExecutionStateError);
  assert.throws(()=>c.resume(),ExecutionStateError);
  assert.throws(()=>c.result(),ExecutionStateError);
});

test('completed runs refuse further commands; invalid targets fail closed',()=>{
  const c=new ExecutionController(room()).start();
  c.advanceTo(5*HOUR);
  assert.throws(()=>c.advanceTo(4*HOUR),ExecutionStateError,'no time reversal');
  assert.throws(()=>c.advanceBy(0),ExecutionStateError);
  assert.throws(()=>c.advanceBy(Number.NaN),ExecutionStateError);
  c.advanceTo(10*c.endTimeMs); // clamped to horizon, completes
  assert.equal(c.state,EXECUTION_STATES.COMPLETED);
  for(const cmd of ['start','pause','resume','runToEnd'])
    assert.throws(()=>c[cmd](),ExecutionStateError,cmd);
});

test('control log records accepted and rejected commands with their effect',()=>{
  const c=new ExecutionController(room());
  assert.throws(()=>c.pause());
  c.start().advanceTo(2*HOUR).pause('observer request');
  assert.throws(()=>c.advanceTo(3*HOUR));
  c.resume();
  const log=c.controlLog();
  assert.deepEqual(log.map(e=>[e.command,e.accepted]),[
    ['pause',false],['start',true],['advance',true],['pause',true],
    ['advance',false],['resume',true],
  ]);
  const pause=log[3];
  assert.equal(pause.stateBefore,'running');
  assert.equal(pause.stateAfter,'paused');
  assert.equal(pause.executedThroughMs,2*HOUR);
  assert.deepEqual(pause.detail,{reason:'observer request'});
  assert.equal(log[4].processedEvents,pause.processedEvents,
    'rejected advance had no effect');
  assert.ok(log[2].detail.processed>0);
});

test('observation is read-only: repeated observation never changes the run',()=>{
  const a=new ExecutionController(room()).start();
  const b=new ExecutionController(room()).start();
  a.advanceTo(9*HOUR);b.advanceTo(9*HOUR);
  for(let i=0;i<50;i++){
    const view=a.observe();
    view.incidences.length=0;view.progress.processedEvents=-1; // mutate copies
    a.manifest().seed=999;
  }
  a.runToEnd();b.runToEnd();
  assert.deepEqual(a.result(),b.result());
});

test('incremental observation returns only incidences actually delivered so far',()=>{
  const c=new ExecutionController(room()).start();
  c.advanceTo(8*HOUR);
  const first=c.observe().incidences;
  assert.ok(first.every(i=>i.arrivedAtMs<=8*HOUR));
  c.advanceTo(9*HOUR);
  const delta=c.observe(first.length).incidences;
  assert.ok(delta.length>0);
  assert.ok(delta.every(i=>i.arrivedAtMs>8*HOUR && i.arrivedAtMs<=9*HOUR));
});

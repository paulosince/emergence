// P0.2 validation: episodic drop world composes the validated one-drop model.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createEpisodicDropWorld,episodicHeights} from '../src/world/episodic-drops.js';
import {createReleaseControlledWorld} from '../src/world/release-control.js';
import {verifyVerticalTrajectory} from '../src/world/trajectory-verifier.js';
import {researchSampleTimes} from '../src/world/scenarios.js';
import {createEpisodicDropScenario} from '../src/sensory/episodic-drop-scenario.js';
import {runExperiment} from '../src/runtime/experiment-runner.js';
import {ExecutionController} from '../src/runtime/execution-controller.js';
import {DiagnosticEngine} from '../src/engines/diagnostic-engine.js';

const H=[0.9,1.4,2.0,1.1];

test('stitched states equal the validated one-drop model at local time',()=>{
  const w=createEpisodicDropWorld({heightsM:H,episodeMs:3000,holdMs:1000});
  H.forEach((h,i)=>{
    const ref=createReleaseControlledWorld({releaseAtMs:1000,clearanceM:h,restitution:0});
    for(const local of [0,500,999,1000,1200,1500,2999]){
      const a=w.stateAt(i*3000+local),b=ref.stateAt(local);
      assert.equal(a.clearanceM,b.clearanceM);
      assert.equal(a.verticalVelocityMps,b.verticalVelocityMps);
      assert.equal(a.phase,b.phase);
      assert.equal(a.episode,i);
    }
  });
});

test('every episode passes the independent invariant verifier',()=>{
  const w=createEpisodicDropWorld({heightsM:H});
  for(const ep of w.episodeWorlds()){
    const times=researchSampleTimes(ep,{horizonMs:2999,stepMs:25});
    const v=verifyVerticalTrajectory(ep,times);
    assert.equal(v.passed,true,JSON.stringify(v).slice(0,300));
    assert.ok(v.checks>100);
  }
});

test('events: reposition, release, impact per episode at analytic times, in order',()=>{
  const w=createEpisodicDropWorld({heightsM:H,episodeMs:3000,holdMs:1000});
  const ev=w.eventsThrough(w.describe().endMs);
  const types=ev.map(e=>e.type);
  assert.equal(types.filter(t=>t==='intervention.reposition').length,H.length);
  assert.equal(types.filter(t=>t==='intervention.release').length,H.length);
  assert.equal(types.filter(t=>t==='collision.impact').length,H.length);
  for(let k=1;k<ev.length;k++)assert.ok(ev[k].timeMs>=ev[k-1].timeMs);
  H.forEach((h,i)=>{
    const imp=ev.find(e=>e.type==='collision.impact'&&e.episode===i);
    const analytic=i*3000+1000+1000*Math.sqrt(2*h/9.81);
    assert.ok(Math.abs(imp.timeMs-analytic)<1e-9*analytic,'impact '+i);
    assert.equal(imp.verticalVelocityAfterMps,0,'restitution 0: rests after impact');
  });
  assert.equal(w.eventsThrough(1400).filter(e=>e.type==='collision.impact').length,0,'impact of 0.9 m drop occurs at 1428 ms');
  assert.equal(w.eventsThrough(1430).filter(e=>e.type==='collision.impact').length,1);
});

test('domain limits fail closed',()=>{
  assert.throws(()=>createEpisodicDropWorld({heightsM:[5],episodeMs:1500,holdMs:1000}),/too short/);
  assert.throws(()=>createEpisodicDropWorld({heightsM:[]}));
  const w=createEpisodicDropWorld({heightsM:[1]});
  assert.throws(()=>w.stateAt(3001));
  assert.throws(()=>w.stateAt(-1));
});

test('height schedule is deterministic and recorded for the researcher only',()=>{
  assert.deepEqual(episodicHeights({episodes:10,scheduleSeed:7}),episodicHeights({episodes:10,scheduleSeed:7}));
  assert.notDeepEqual(episodicHeights({episodes:10,scheduleSeed:7}),episodicHeights({episodes:10,scheduleSeed:8}));
  const hs=episodicHeights({episodes:200,minHeightM:0.8,maxHeightM:2,scheduleSeed:3});
  assert.ok(hs.every(h=>h>=0.8&&h<=2));
  const s=createEpisodicDropScenario({episodes:3,scheduleSeed:3});
  const {world,...cfg}=s;
  const r=runExperiment({...cfg,engine:new DiagnosticEngine()});
  for(const i of r.incidences){
    assert.deepEqual(Object.keys(i).sort(),['arrivedAtMs','incidenceId','measurement','observedAtMs','transducerId']);
  }
  assert.ok(!JSON.stringify(r.incidences).includes('height'));
  assert.equal(world.describe().episodes.length,3);
});

test('the independent variable is present in transduction: barrier interval shrinks with height',()=>{
  const heights=[0.85,1.0,1.3,1.6,2.0,2.5];
  const s=createEpisodicDropScenario({heightsM:heights,
    sensorOverrides:{s0:{periodMs:1},s1:{periodMs:1},s2:{periodMs:1}}});
  const {world,...cfg}=s;
  const r=runExperiment({...cfg,engine:new DiagnosticEngine()});
  const intervals=heights.map((h,i)=>{
    const inEp=r.incidences.filter(x=>x.observedAtMs>=i*3000&&x.observedAtMs<(i+1)*3000);
    const top=inEp.find(x=>x.transducerId==='s0'&&x.measurement===0);
    const low=inEp.find(x=>x.transducerId==='s1'&&x.measurement===0);
    return low.observedAtMs-top.observedAtMs;
  });
  for(let k=1;k<intervals.length;k++)assert.ok(intervals[k]<intervals[k-1],JSON.stringify(intervals));
});

test('runs through the real execution controller with pause and resume',()=>{
  const s=createEpisodicDropScenario({episodes:4,scheduleSeed:11});
  const {world,...cfg}=s;
  const ref=runExperiment({...cfg,engine:new DiagnosticEngine()});
  const s2=createEpisodicDropScenario({episodes:4,scheduleSeed:11});
  const {world:w2,...cfg2}=s2;
  const c=new ExecutionController({...cfg2,engine:new DiagnosticEngine()}).start();
  c.advanceTo(2500).pause('t').resume().advanceTo(7000).runToEnd();
  assert.deepEqual(c.result(),ref);
});

// P0.6 validation: tabletop world with entities and uninterpreted sensing.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createTabletopWorld} from '../src/world/tabletop.js';
import {verifyTabletop} from '../src/world/tabletop-verifier.js';
import {createTabletopScenario,DEFAULT_DISCS} from '../src/sensory/tabletop-scenario.js';
import {runExperiment} from '../src/runtime/experiment-runner.js';
import {ExecutionController} from '../src/runtime/execution-controller.js';
import {DiagnosticEngine} from '../src/engines/diagnostic-engine.js';

const scen=createTabletopScenario({});
const {world}=scen;
const run=(()=>{let r=null;return()=>{if(!r){const {world:_,...cfg}=createTabletopScenario({});r=runExperiment({...cfg,engine:new DiagnosticEngine()});}return r;};})();
const ivs=world.eventsThrough(299999).filter(e=>e.type.startsWith('intervention'));
const spec=scen.environment.specification().channels;
const byType=t=>spec.filter(c=>c.type===t);

test('independent verifier passes and detects deliberately injected defects',()=>{
  const v=verifyTabletop(world,{stepMs:10});
  assert.equal(v.passed,true,JSON.stringify(v.errors));assert.ok(v.checks>100000);
  const drift={...world,stateAt:t=>{const s=world.stateAt(t);return {...s,discs:s.discs.map(d=>({...d,vx:d.vx*(1+t*1e-7)}))};}};
  assert.equal(verifyTabletop(drift,{stepMs:50}).passed,false,'energy drift detected');
  const pen={...world,stateAt:t=>{const s=world.stateAt(t);return t>1000?{...s,discs:s.discs.map((d,k)=>k===1?{...d,x:s.discs[0].x,y:s.discs[0].y}:d)}:s;}};
  assert.equal(verifyTabletop(pen,{stepMs:50}).passed,false,'penetration detected');
});

test('protocol: rests, 10-step drift, change while hidden, teleport without overlap',()=>{
  const types=ivs.map(e=>e.type);
  assert.equal(types.filter(t=>t==='intervention.rest').length,2);
  const drift=ivs.filter(e=>e.type==='intervention.feature-drift-step');
  assert.equal(drift.length,10);
  for(let k=1;k<drift.length;k++)assert.ok(drift[k].value<drift[k-1].value);
  const hid=ivs.find(e=>e.type==='intervention.feature');
  assert.equal(world.stateAt(hid.timeMs).discs[1].fullyHidden,true,'feature changed while fully hidden');
  assert.notEqual(world.stateAt(hid.timeMs-1).discs[1].reflectance,world.stateAt(hid.timeMs).discs[1].reflectance);
  const tp=ivs.find(e=>e.type==='intervention.teleport');
  const a=world.stateAt(tp.timeMs-1).discs[2],b=world.stateAt(tp.timeMs).discs[2];
  assert.ok(Math.hypot(a.x-b.x,a.y-b.y)>0.05,'spatiotemporal discontinuity');
  assert.throws(()=>createTabletopWorld({discs:[{radiusM:.05,reflectance:.5,temperatureC:20,x:.1,y:.1},
    {radiusM:.05,reflectance:.5,temperatureC:20,x:.12,y:.1}]}),/overlap/);
});

test('rest periods are silent: no incidence while every disc is still',()=>{
  const r=run();
  for(const [a,b] of [[80000,95000],[230000,245000]])
    assert.equal(r.incidences.filter(i=>i.arrivedAtMs>a+200&&i.arrivedAtMs<b).length,0);
});

test('screen hides discs from the retina but not from touch',()=>{
  const r=run(),scr=world.describe().screen;
  const under=byType('retina').filter(c=>c.x0>=scr.x0-1e-9&&c.x1<=scr.x1+1e-9).map(c=>c.channelId);
  assert.ok(under.length>0);
  const changes=id=>r.incidences.filter(i=>i.transducerId===id).length;
  for(const id of under)assert.ok(changes(id)<=1,'covered retina cell never changes after its first reading');
  // a tactile cell under the screen changes while a disc is fully hidden
  const hidden=[];for(let t=0;t<299000;t+=100)if(world.stateAt(t).discs.some(d=>d.fullyHidden))hidden.push(t);
  const tactUnder=byType('tactile').filter(c=>c.x0<scr.x1&&c.x1>scr.x0).map(c=>c.channelId);
  const felt=r.incidences.filter(i=>tactUnder.includes(i.transducerId)&&hidden.some(t=>Math.abs(t-i.arrivedAtMs)<=100));
  assert.ok(felt.length>0,'touch perceives a hidden disc');
});

test('threshold banks are nested: a higher threshold fires only when lower ones do',()=>{
  const env=scen.environment,th=byType('thermal-threshold');
  for(const sensor of [0,1,2]){
    const bank=th.filter(c=>c.sensor===sensor).sort((a,b)=>a.thresholdK-b.thresholdK);
    for(let t=0;t<299000;t+=997){
      const v=bank.map(c=>env.readAt(c.channelId,t));
      for(let k=1;k<v.length;k++)assert.ok(v[k]<=v[k-1]);
    }
  }
});

test('channel identities are opaque and shuffled; geometry stays researcher-side',()=>{
  const ids=scen.transducers.map(t=>t.id);
  assert.equal(ids.length,84);
  assert.ok(ids.every(id=>/^k[0-9a-f]{6}$/.test(id)));
  assert.equal(new Set(ids).size,ids.length);
  const other=createTabletopScenario({idSeed:9}).transducers.map(t=>t.id);
  assert.notDeepEqual(other,ids);
  const r=run();
  for(const i of r.incidences.slice(0,500))
    assert.deepEqual(Object.keys(i).sort(),['arrivedAtMs','incidenceId','measurement','observedAtMs','transducerId']);
  assert.ok(!JSON.stringify(r.incidences.slice(0,2000)).match(/retina|tactile|thermal|disc/));
});

test('deterministic and identical under the real controller with pauses',()=>{
  const ref=run();
  const {world:_,...cfg}=createTabletopScenario({});
  const c=new ExecutionController({...cfg,engine:new DiagnosticEngine()}).start();
  c.advanceTo(50000).pause('t').resume().advanceTo(150000).runToEnd();
  assert.deepEqual(c.result(),ref);
  assert.equal(DEFAULT_DISCS.length,3);
});

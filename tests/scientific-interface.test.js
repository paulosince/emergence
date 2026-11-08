// Stage 8 acceptance at model level: views are read-only projections of what
// was executed, share one time base, and never invent mesh elements.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {ExecutionController} from '../src/runtime/execution-controller.js';
import {runExperiment} from '../src/runtime/experiment-runner.js';
import {DiagnosticEngine} from '../src/engines/diagnostic-engine.js';
import {TempoFixedNodesControl} from '../src/engines/tempo-fixed-nodes-control.js';
import {createRoomScenario} from '../src/room/room-scenario.js';
import {meshModel,firingsFromTrace,propagationAt,activityAt,firingCause,
  relationLifecycle,LIFECYCLE} from '../src/visualization/mesh-model.js';
import {timelineModel,preciseClock,LANES} from '../src/visualization/timeline-model.js';
import {compareRuns,metricsRow,metricsCsv,manifestDigest,METRIC_COLUMNS}
  from '../src/research/run-comparison.js';
import {DEFAULTS} from '../vendor/tempo/core/net.js';

const HOUR=3600000;
const NODES={r0:0,r1:1,r2:2,r3:3,r4:4,r5:5};
const tempo=(seed=42)=>new TempoFixedNodesControl({nodeCount:6,transducerNodes:NODES,seed});
const room=(engine,options={})=>({...createRoomScenario(options),engine});

function runInBlocks(engine,options={},blockMs=15*60000){
  const c=new ExecutionController(room(engine,options)).start();
  const snaps=[{t:0,snapshot:c.engineSnapshot()}];
  while(c.state==='running'){c.advanceBy(blockMs);snaps.push({t:c.executedThroughMs,snapshot:c.engineSnapshot()});}
  return {result:c.result(),snaps};
}

test('TEMPO control: block execution with snapshots equals continuous execution',()=>{
  const reference=runExperiment(room(tempo()));
  const {result,snaps}=runInBlocks(tempo());
  assert.deepEqual(result,reference,'observing engine state never alters the run');
  assert.ok(snaps.length>90);
  assert.deepEqual(snaps.at(-1).snapshot.relations,reference.finalSnapshot.relations);
});

test('diagnostic engine produces a true empty mesh, never nodes or relations',()=>{
  const {result}=runInBlocks(new DiagnosticEngine());
  const mesh=meshModel(result.finalSnapshot);
  assert.equal(mesh.kind,'empty');
  assert.deepEqual([mesh.nodeCount,mesh.relations.length,mesh.constitutedUnits],[0,0,0]);
  assert.deepEqual(firingsFromTrace(result.trace),[]);
  assert.equal(meshModel(null).kind,'empty');
  assert.equal(meshModel({nodeCount:0,relations:[]}).kind,'empty');
});

test('mesh projects exactly the engine relations; predefined nodes are not units',()=>{
  const {result,snaps}=runInBlocks(tempo());
  const snap=result.finalSnapshot;
  const mesh=meshModel(snap,snaps[snaps.length-3].snapshot);
  assert.equal(mesh.kind,'fixed-nodes');
  assert.equal(mesh.constitutedUnits,0);
  assert.equal(mesh.nodeCount,6);
  assert.ok(mesh.nodes.every(n=>n.predefined));
  assert.equal(mesh.relations.length,snap.relations.length);
  mesh.relations.forEach((r,k)=>{
    const s=snap.relations[k];
    assert.deepEqual([r.source,r.target,r.weight,r.traversalMs],
      [s.source,s.target,s.weight,s.traversalMs]);
  });
});

test('relation lifecycle follows TEMPO classification thresholds',()=>{
  assert.equal(relationLifecycle(.05),LIFECYCLE.PRUNING);
  assert.equal(relationLifecycle(.3),LIFECYCLE.WEAK);
  // With TEMPO's parameters, (1 - w/wMax)^2 < 0.05 already holds at w = theta:
  // with consolidation on, a link able to fire its target alone is consolidated.
  assert.equal(relationLifecycle(DEFAULTS.theta),LIFECYCLE.CONSOLIDATED);
  assert.equal(relationLifecycle(.9),LIFECYCLE.WEAK);
  assert.equal(relationLifecycle(DEFAULTS.wMax),LIFECYCLE.CONSOLIDATED);
  assert.equal(relationLifecycle(DEFAULTS.theta,{...DEFAULTS,consol:false}),LIFECYCLE.STRONG);
  assert.equal(relationLifecycle(DEFAULTS.wMax,{...DEFAULTS,consol:false}),LIFECYCLE.STRONG);
});

test('new and removed relations are detected between captured blocks',()=>{
  const rel=(s,t,w)=>({source:s,target:t,weight:w,delaySourceMs:5,delayTargetMs:5,traversalMs:10});
  const before={nodeCount:3,relations:[rel(0,1,.3),rel(1,2,.3)]};
  const after={nodeCount:3,relations:[rel(0,1,.5),rel(2,0,.3)]};
  const m=meshModel(after,before);
  assert.deepEqual(m.relations.map(r=>r.isNew),[false,true]);
  assert.equal(m.newCount,1);assert.equal(m.removedCount,1);
});

test('acceptance 3.8: the same event carries the same time in every view',()=>{
  const {result}=runInBlocks(tempo());
  const lanes=Object.fromEntries(timelineModel({incidences:result.incidences,
    trace:result.trace,worldEvents:[],horizonMs:result.manifest.endTimeMs})
    .map(l=>[l.id,l]));
  const byId=new Map(result.incidences.map(i=>[i.incidenceId,i]));
  for(const item of lanes.delivered.items)
    assert.equal(item.timeMs,byId.get(item.ref).arrivedAtMs);
  for(const item of lanes.observed.items)
    assert.equal(item.timeMs,byId.get(item.ref).observedAtMs);
  const fired=firingsFromTrace(result.trace);
  const engineFires=lanes.engine.items.filter(i=>i.kind==='node.fired');
  assert.deepEqual(engineFires.map(i=>[i.timeMs,i.node]),fired.map(f=>[f.timeMs,f.node]));
  // Forced firings coincide exactly with the delivery of their incidence.
  const forced=fired.map(f=>firingCause(f,result.incidences,NODES))
    .filter(c=>c.kind==='forced');
  assert.ok(forced.length>0);
  for(const c of forced)assert.ok(byId.has(c.incidenceId));
});

test('timeline never shows anything after the executed horizon',()=>{
  const c=new ExecutionController(room(tempo())).start();
  c.advanceTo(6*HOUR);
  const view=c.observe(0,0);
  const lanes=timelineModel({incidences:view.incidences,trace:view.trace,
    worldEvents:[{timeMs:5*HOUR,type:'lamp.toggle'},{timeMs:7*HOUR,type:'lamp.toggle'}],
    horizonMs:c.executedThroughMs});
  for(const lane of lanes)
    for(const item of lane.items)assert.ok(item.timeMs<=6*HOUR,lane.id);
  assert.equal(lanes.find(l=>l.id==='world').items.length,1);
  assert.deepEqual(LANES.map(l=>l.audience),['researcher','researcher','engine','engine']);
});

test('replay/projection functions do not modify recorded data',()=>{
  const {result}=runInBlocks(tempo());
  const frozen=JSON.stringify(result);
  const fired=firingsFromTrace(result.trace);
  const mesh=meshModel(result.finalSnapshot);
  for(let t=0;t<=result.manifest.endTimeMs;t+=HOUR){
    timelineModel({incidences:result.incidences,trace:result.trace,horizonMs:t});
    activityAt(fired,6,t,30*60000);
    propagationAt(fired,mesh.relations,t);
  }
  assert.equal(JSON.stringify(result),frozen);
});

test('propagation uses only recorded firing time and recorded traversal time',()=>{
  const relations=[{key:'0>1#0',source:0,target:1,traversalMs:40},
    {key:'0>2#0',source:0,target:2,traversalMs:100}];
  const fires=[{timeMs:1000,node:0}];
  assert.deepEqual(propagationAt(fires,relations,999),[]);
  const mid=propagationAt(fires,relations,1020);
  assert.deepEqual(mid.map(p=>[p.key,p.fraction,p.arrivesAtMs]),
    [['0>1#0',.5,1040],['0>2#0',.2,1100]]);
  assert.deepEqual(propagationAt(fires,relations,1100),[]);
  assert.equal(preciseClock(3723004),'01:02:03.004');
});

test('comparison: identical definitions reproduce; isolated change is reported',async()=>{
  const runA={id:'A',result:runInBlocks(tempo()).result};
  const runB={id:'B',result:runInBlocks(tempo()).result};
  const same=compareRuns(runA,runB);
  assert.ok(same.identicalManifest);assert.ok(same.identicalHistory);
  assert.equal(same.firstIncidenceDivergence,null);
  const seedB={id:'C',result:runInBlocks(tempo(),{seed:7}).result};
  const diff=compareRuns(runA,seedB);
  assert.equal(diff.isolatedChange,'seed');
  // Room transducers declare no noise, so the seed cannot alter deliveries.
  assert.equal(diff.firstIncidenceDivergence,null);
  const noThermal={id:'D',result:runInBlocks(new DiagnosticEngine(),
    {modalities:['optical','electrical']}).result};
  const full={id:'E',result:runInBlocks(new DiagnosticEngine()).result};
  const ablation=compareRuns(full,noThermal);
  assert.ok(ablation.summaryDelta.delivered<0);
  assert.ok(ablation.manifestDifferences.some(d=>d.path==='transducers'));
  const digestA=await manifestDigest(runA.result.manifest);
  assert.match(digestA,/^[0-9a-f]{64}$/);
  assert.equal(digestA,await manifestDigest(runB.result.manifest));
  assert.notEqual(digestA,await manifestDigest(seedB.result.manifest));
  const row=metricsRow({...full,manifestSha256:'x'});
  assert.equal(row.relations,0);assert.equal(row.constitutedUnits,0);
  const csv=metricsCsv([runA,full]);
  assert.equal(csv.split('\r\n')[0],METRIC_COLUMNS.join(','));
});

// P0.4 evaluation bench: statistics, surrogates, replay equivalence, causal removal.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spearman,permutationTest,compareToNull,bootstrapMeanCI,ranks} from '../src/research/bench/stats.js';
import {circularShift,intervalShuffle,channelPermutation} from '../src/research/bench/surrogates.js';
import {replayIncidences} from '../src/research/bench/replay.js';
import {causalRemovalTest} from '../src/research/bench/causal.js';
import {runExperiment} from '../src/runtime/experiment-runner.js';
import {createRoomScenario} from '../src/room/room-scenario.js';
import {TempoFixedNodesControl} from '../src/engines/tempo-fixed-nodes-control.js';
import {DiagnosticEngine} from '../src/engines/diagnostic-engine.js';

const MAP={r0:0,r1:1,r2:2,r3:3,r4:4,r5:5};
const roomRun=()=>{const s=createRoomScenario({});
  return runExperiment({...s,engine:new TempoFixedNodesControl({nodeCount:6,transducerNodes:MAP,seed:42})});};

test('statistics: ranks with ties, Spearman, permutation test, null comparison, bootstrap',()=>{
  assert.deepEqual(ranks([3,1,3,2]),[2.5,0,2.5,1]);
  assert.equal(spearman([1,2,3,4],[10,20,30,40]),1);
  assert.equal(spearman([1,2,3,4],[4,3,2,1]),-1);
  const x=Array.from({length:30},(_,i)=>i);
  const strong=permutationTest(x,x.map(v=>v*2+((v*7)%3)),{seed:1,permutations:500});
  assert.ok(strong.p<0.01);
  const noise=permutationTest(x,x.map(v=>(v*37)%11),{seed:1,permutations:500});
  assert.ok(noise.p>0.05,JSON.stringify(noise));
  const c=compareToNull(10,[1,2,3,2,1,2,3]);assert.ok(c.z>3);assert.equal(c.pGreater,1/8);
  const ci=bootstrapMeanCI([1,2,3,4,5],{seed:2});assert.ok(ci.low<=3&&ci.high>=3);
});

test('replay of recorded incidences reproduces the full session exactly (TEMPO, room)',()=>{
  const full=roomRun();
  const engine=new TempoFixedNodesControl({nodeCount:6,transducerNodes:MAP,seed:42});
  const rep=replayIncidences(engine,full.incidences,{endTimeMs:full.manifest.endTimeMs});
  assert.deepEqual(rep.finalSnapshot,full.finalSnapshot);
  assert.equal(rep.events.length,full.summary.engineEventCount);
});

test('surrogates preserve and destroy exactly what they declare',()=>{
  const inc=roomRun().incidences,H=86400000;
  const count=list=>Object.fromEntries([...new Set(list.map(i=>i.transducerId))].sort().map(id=>[id,list.filter(i=>i.transducerId===id).length]));
  const values=(list,id)=>list.filter(i=>i.transducerId===id).map(i=>i.measurement).sort((a,b)=>a-b);
  const cs=circularShift(inc,{horizonMs:H,seed:3});
  assert.deepEqual(count(cs.incidences),count(inc));
  for(const id of Object.keys(MAP))assert.deepEqual(values(cs.incidences,id),values(inc,id));
  // cross-channel alignment: in the real room all channels sample on the same
  // 15-min grid, so many arrivals of different channels fall within 1 s.
  const aligned=list=>{let n=0;const s=list.slice().sort((a,b)=>a.arrivedAtMs-b.arrivedAtMs);
    for(let k=1;k<s.length;k++)if(s[k].transducerId!==s[k-1].transducerId&&s[k].arrivedAtMs-s[k-1].arrivedAtMs<1000)n++;return n;};
  assert.ok(aligned(cs.incidences)<aligned(inc)/3,'cross-channel alignment destroyed');
  const is=intervalShuffle(inc,{seed:4});
  assert.deepEqual(count(is.incidences),count(inc));
  const gaps=list=>{const t=list.map(i=>i.arrivedAtMs);return t.slice(1).map((x,k)=>x-t[k]).sort((a,b)=>a-b);};
  for(const id of Object.keys(MAP))
    assert.deepEqual(gaps(is.incidences.filter(i=>i.transducerId===id)),gaps(inc.filter(i=>i.transducerId===id)));
  const cp=channelPermutation(inc,{seed:5});
  assert.deepEqual(cp.incidences.map(i=>i.arrivedAtMs).sort((a,b)=>a-b),inc.map(i=>i.arrivedAtMs).sort((a,b)=>a-b));
  assert.deepEqual(circularShift(inc,{horizonMs:H,seed:3}),cs,'deterministic');
});

class CountingTestEngine extends DiagnosticEngine {
  #blocked=new Set();count=0;
  ingest(i){if(!this.#blocked.has(i.transducerId))this.count++;return super.ingest(i);}
  ablate(key){this.#blocked.add(key);}
}
test('causal removal: an influential unit beats random removals; engines without ablate are refused',()=>{
  const inc=[];for(let t=0;t<100;t++){inc.push({incidenceId:'a'+t,transducerId:'A',observedAtMs:t*10,arrivedAtMs:t*10,measurement:1});
    if(t%10===0)for(const id of ['B','C','D','E'])inc.push({incidenceId:id+t,transducerId:id,observedAtMs:t*10+1,arrivedAtMs:t*10+1,measurement:1});}
  const r=causalRemovalTest({makeEngine:()=>new CountingTestEngine(),incidences:inc,endTimeMs:1000,removeAtMs:200,
    target:'A',candidates:['A','B','C','D','E'],outcome:(_,e)=>e.count,randomRemovals:20,seed:1});
  assert.ok(r.targetEffect>r.null.nullMax,'target effect exceeds every random removal');
  assert.equal(r.null.pGreater,r.null.pFloor,'p at its resolution floor');
  assert.ok(r.null.z>3,JSON.stringify(r.null));
  assert.throws(()=>causalRemovalTest({makeEngine:()=>new DiagnosticEngine(),incidences:inc,endTimeMs:1000,
    removeAtMs:200,target:'A',candidates:['A'],outcome:()=>0}),/ablate/);
});

// P0.1 evidence: in the room, TEMPO fixed-node relations are produced by the
// transducers' fixed latencies, not by world structure.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createRoomScenario} from '../src/room/room-scenario.js';
import {runExperiment} from '../src/runtime/experiment-runner.js';
import {TempoFixedNodesControl} from '../src/engines/tempo-fixed-nodes-control.js';

const IDS=['r0','r1','r2','r3','r4','r5'];
const MAP=Object.fromEntries(IDS.map((id,i)=>[id,i]));
function relations(options,seed=42){
  const s=createRoomScenario({seed,...options});
  const r=runExperiment({...s,engine:new TempoFixedNodesControl({nodeCount:6,transducerNodes:MAP,seed})});
  return r.finalSnapshot.relations.map(x=>[IDS[x.source],IDS[x.target]]);
}
const lat=v=>Object.fromEntries(IDS.map((id,i)=>[id,{latencyMs:v[i]}]));

test('equal transducer latencies: no relation forms',()=>{
  assert.equal(relations({sensorOverrides:lat([250,250,250,250,250,250])}).length,0);
});
test('permuted latencies: every directed relation goes from faster to slower channel',()=>{
  const v=[400,100,200,300,200,400];
  const rels=relations({sensorOverrides:lat(v)});
  assert.ok(rels.length>0);
  const L=Object.fromEntries(IDS.map((id,i)=>[id,v[i]]));
  for(const [a,b] of rels)if(L[a]!==L[b])assert.ok(L[a]<L[b],a+'>'+b);
});
test('different worlds with the same latencies: same relation pattern',()=>{
  const key=r=>r.map(x=>x.join('>')).sort().join(' ');
  const base=key(relations({}));
  assert.equal(key(relations({worldOptions:{date:'2026-12-21',opaqueObjectEnabled:false},weatherPreset:'overcast'})),base);
});

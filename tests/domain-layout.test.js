import {test} from 'node:test';
import assert from 'node:assert/strict';
import {domainLayout} from '../src/visualization/domain-layout.js';
import {meshModel,firingsFromTrace} from '../src/visualization/mesh-model.js';
import {ExecutionController} from '../src/runtime/execution-controller.js';
import {TempoFixedNodesControl} from '../src/engines/tempo-fixed-nodes-control.js';
import {createRoomScenario} from '../src/room/room-scenario.js';

const CH=['r0','r1','r2','r3','r4','r5'];
const MAP={r0:0,r1:1,r2:2,r3:3,r4:4,r5:5};
const rel=(s,t,w=.3)=>({source:s,target:t,weight:w,delaySourceMs:5,delayTargetMs:5,traversalMs:10});
const inc=(id,ch,t)=>({incidenceId:id,transducerId:ch,observedAtMs:t-1,arrivedAtMs:t,measurement:1});

test('empty model gives anchors only, never invented nodes',()=>{
  const L=domainLayout({model:meshModel(null),firings:[],incidences:[],channels:CH,timeMs:1e9});
  assert.equal(L.nodes.length,0);assert.equal(L.clusters.length,0);
  assert.equal(L.anchors.length,6);
  assert.ok(L.anchors.every(a=>a.z===0));
});

test('same provenance and co-activity -> same cluster; different -> apart',()=>{
  // Node 1 is driven by node 0 through a recorded relation; node 2 by r3.
  const model=meshModel({nodeCount:3,relations:[rel(0,1,1.2)]});
  const incidences=[inc('a','r0',1000),inc('b','r0',5000),inc('c','r3',90000)];
  const firings=[{timeMs:1000,node:0},{timeMs:1000,node:1},{timeMs:5000,node:0},
    {timeMs:5000,node:1},{timeMs:90000,node:2}];
  const L=domainLayout({model,firings,incidences,transducerNodes:{r0:0,r3:2},channels:CH,timeMs:1e9});
  assert.equal(L.distance[0][1]<L.distance[0][2],true);
  assert.equal(L.nodes[0].cluster,L.nodes[1].cluster);
  assert.notEqual(L.nodes[0].cluster,L.nodes[2].cluster);
  const d01=Math.hypot(L.nodes[0].x-L.nodes[1].x,L.nodes[0].y-L.nodes[1].y);
  const d02=Math.hypot(L.nodes[0].x-L.nodes[2].x,L.nodes[0].y-L.nodes[2].y);
  assert.ok(d01<d02,'close in operational distance -> close in space');
  assert.equal(L.nodes[2].dominantChannel,'r3');
});

test('provenance propagates one hop through recorded relations only',()=>{
  const model=meshModel({nodeCount:2,relations:[rel(0,1,1.2)]});
  const incidences=[inc('a','r0',1000)];
  const firings=[{timeMs:1000,node:0},{timeMs:1010,node:1}];
  const L=domainLayout({model,firings,incidences,transducerNodes:MAP,channels:CH,timeMs:1e9});
  assert.equal(L.nodes[1].dominantChannel,'r0','node 1 was driven via a relation from r0');
  const L0=domainLayout({model:meshModel({nodeCount:2,relations:[]}),firings,incidences,
    transducerNodes:MAP,channels:CH,timeMs:1e9});
  assert.equal(L0.nodes[1].dominantChannel,null,'no relation -> no inherited provenance');
});

test('cursor bounds the data used; layout is deterministic',()=>{
  const model=meshModel({nodeCount:2,relations:[]});
  const incidences=[inc('a','r0',1000),inc('b','r1',9000)];
  const firings=[{timeMs:1000,node:0},{timeMs:9000,node:1}];
  const early=domainLayout({model,firings,incidences,transducerNodes:MAP,channels:CH,timeMs:2000});
  assert.equal(early.nodes[1].fired,0);
  const a=domainLayout({model,firings,incidences,transducerNodes:MAP,channels:CH,timeMs:1e9});
  const b=domainLayout({model,firings,incidences,transducerNodes:MAP,channels:CH,timeMs:1e9});
  assert.deepEqual(a,b);
});

test('real TEMPO room run: every node position derives from recorded data',()=>{
  const c=new ExecutionController({...createRoomScenario({}),
    engine:new TempoFixedNodesControl({nodeCount:6,transducerNodes:MAP,seed:42})}).start();
  c.runToEnd();
  const r=c.result();
  const L=domainLayout({model:meshModel(r.finalSnapshot),firings:firingsFromTrace(r.trace),
    incidences:r.incidences,transducerNodes:MAP,channels:CH,timeMs:r.manifest.endTimeMs});
  assert.equal(L.nodes.length,6);
  for(const node of L.nodes){
    assert.ok([node.x,node.y,node.z].every(Number.isFinite));
    if(node.fired)assert.ok(node.dominantChannel);
  }
  assert.ok(L.clusters.length>=1);
  for(const cl of L.clusters)for(const m of cl.members)assert.equal(L.nodes[m].cluster,cl.id);
});

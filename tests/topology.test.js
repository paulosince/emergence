// P0.5 topology measures validated on graphs with known answers.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {undirected,degree,strength,coreNumber,betweenness,communities,participation,rewire,richClub}
  from '../src/research/bench/topology.js';

const g=(n,pairs)=>undirected({n,edges:pairs.map(([s,t,w=1])=>({source:s,target:t,weight:w}))});
const star=g(5,[[0,1],[0,2],[0,3],[0,4]]);
// two 4-cliques joined by the bridge 3-4
const cl=[];for(const base of [0,4])for(let i=0;i<4;i++)for(let j=i+1;j<4;j++)cl.push([base+i,base+j]);
const barbell=g(8,[...cl,[3,4]]);

test('degree, strength and symmetrization',()=>{
  assert.deepEqual(degree(star),[4,1,1,1,1]);
  const d=undirected({n:2,edges:[{source:0,target:1,weight:.2},{source:1,target:0,weight:.9}]});
  assert.deepEqual(strength(d),[.9,.9]);
});
test('k-core numbers',()=>{
  assert.deepEqual(coreNumber(star),[1,1,1,1,1]);
  assert.deepEqual(coreNumber(barbell),[3,3,3,3,3,3,3,3]);
  const tail=g(5,[[0,1],[1,2],[2,0],[2,3],[3,4]]);
  assert.deepEqual(coreNumber(tail),[2,2,2,1,1]);
});
test('betweenness: star centre 1, leaves 0; bridge nodes highest in barbell',()=>{
  const b=betweenness(star);assert.ok(Math.abs(b[0]-1)<1e-12);assert.ok(b.slice(1).every(x=>x===0));
  const bb=betweenness(barbell);
  const top=bb.map((x,i)=>[x,i]).sort((a,c)=>c[0]-a[0]).slice(0,2).map(x=>x[1]).sort();
  assert.deepEqual(top,[3,4]);
});
test('communities split the barbell; participation highest at the bridge',()=>{
  const m=communities(barbell,{seed:1});
  assert.equal(new Set(m.slice(0,4)).size,1);assert.equal(new Set(m.slice(4)).size,1);assert.notEqual(m[0],m[7]);
  const {participation:P}=participation(barbell,m);
  assert.ok(P[3]>0&&P[4]>0);assert.ok([0,1,2,5,6,7].every(i=>P[i]===0));
});
test('degree-preserving rewiring keeps every degree',()=>{
  const r=rewire(barbell,{seed:3});
  assert.deepEqual(degree(r),degree(barbell));
});
test('rich club is normalized: degree-determined cores give rho = 1, genuine hub clubs give rho > 1',()=>{
  // (a) 5 interconnected hubs with private leaves: degrees force the structure -> rho = 1
  const a=[];for(let i=0;i<5;i++)for(let j=i+1;j<5;j++)a.push([i,j]);
  let leaf=5;for(let h=0;h<5;h++)for(let k=0;k<4;k++)a.push([h,leaf++]);
  const ra=richClub(g(25,a),{nulls:30,seed:2}).find(r=>r.k===4);
  assert.equal(ra.phi,1);assert.equal(ra.rho,1);
  // (b) 6-hub clique + each hub linked to 5 nodes of a 30-node ring: the null
  // can move hub-hub links to the ring, so the observed club is denser than chance
  const b=[];for(let i=0;i<6;i++)for(let j=i+1;j<6;j++)b.push([i,j]);
  for(let r=0;r<30;r++)b.push([6+r,6+((r+1)%30)]);
  for(let h=0;h<6;h++)for(let k=0;k<5;k++)b.push([h,6+h*5+k]);
  const rb=richClub(g(36,b),{nulls:40,seed:3}).find(r=>r.k===3);
  assert.equal(rb.phi,1);assert.ok(rb.rho>1.2,JSON.stringify(rb));
});

import {domainTopology} from '../src/research/bench/topology.js';
test('per-node summary on the real TEMPO room mesh is complete and finite',async()=>{
  const {runExperiment}=await import('../src/runtime/experiment-runner.js');
  const {createRoomScenario}=await import('../src/room/room-scenario.js');
  const {TempoFixedNodesControl}=await import('../src/engines/tempo-fixed-nodes-control.js');
  const MAP={r0:0,r1:1,r2:2,r3:3,r4:4,r5:5};
  const r=runExperiment({...createRoomScenario({}),engine:new TempoFixedNodesControl({nodeCount:6,transducerNodes:MAP,seed:42})});
  const t=domainTopology({n:6,edges:r.finalSnapshot.relations});
  assert.equal(t.nodes.length,6);
  for(const n of t.nodes)for(const v of Object.values(n))assert.ok(Number.isFinite(v));
});

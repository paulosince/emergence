// Phase 1 criteria functions and calibration controls.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {holm,d3aDecision,d3bDecision,d3cDecision,d2Decision,d5Decision,d3Seeds} from '../src/research/criteria/phase1.js';
import {OracleIntervalControl} from '../src/engines/oracle-interval-control.js';
import {assertExperimentEngine} from '../src/contracts/engine.js';

test('Holm–Bonferroni rejects in order and stops at the first failure',()=>{
  assert.deepEqual(holm([0.001,0.02,0.004],0.01),[true,false,true]); // 0.001<0.01/3, 0.004<0.01/2, 0.02>0.01
  assert.deepEqual(holm([0.0005,0.0005,0.0005],0.01),[true,true,true]);
  assert.deepEqual(holm([0.5,0.0001],0.01),[false,true]);
});
test('D3 decisions respect magnitude, correction and seed count',()=>{
  const strong=Array.from({length:10},(_,s)=>({seed:s,rho:-0.9,p:0.0005}));
  assert.equal(d3aDecision(strong).pass,true);
  assert.equal(d3aDecision(strong.map(x=>({...x,rho:-0.5}))).pass,false,'rho below 0.6');
  assert.equal(d3aDecision(strong.map((x,i)=>i<3?{...x,p:0.2}:x)).pass,false,'only 7 of 10 seeds');
  assert.equal(d3bDecision(strong.map(x=>({...x,rho:0.05}))).pass,true);
  assert.equal(d3cDecision(strong,strong.map(x=>({...x,rho:-0.85})),{primaryPass:true}).pass,true);
  assert.equal(d3cDecision(strong,strong.map(x=>({...x,rho:-0.3})),{primaryPass:true}).pass,false);
  assert.equal(d3cDecision(strong,strong,{primaryPass:false}).pass,false,'no effect to retain');
  assert.throws(()=>d3cDecision(strong,strong));
});
test('D2 needs ratio and exceeding the null maximum; D5 needs persistence and plasticity',()=>{
  const seeds=k=>Array.from({length:10},()=>k);
  assert.equal(d2Decision(seeds({observed:20,nulls:new Array(30).fill(3)})).pass,true);
  assert.equal(d2Decision(seeds({observed:5,nulls:new Array(30).fill(3)})).pass,false,'ratio < 2');
  assert.equal(d2Decision(seeds({observed:20,nulls:[...new Array(29).fill(3),25]})).pass,false,'below null max');
  assert.equal(d5Decision({before:['a','b','c','d','e'],after:['a','b','c','d','x'],rateBefore:10,rateAfter:2}).pass,true);
  assert.equal(d5Decision({before:['a','b'],after:['x'],rateBefore:10,rateAfter:5}).pass,false);
  assert.equal(d5Decision({before:['a'],after:['a'],rateBefore:10,rateAfter:0}).pass,false);
});
test('oracle control declares designer knowledge and is never a candidate',()=>{
  const o=new OracleIntervalControl();assertExperimentEngine(o);
  assert.equal(o.describe().candidate,false);assert.ok(o.describe().designerKnowledge.length>0);
  o.ingest({transducerId:'s0',measurement:0,arrivedAtMs:100});o.ingest({transducerId:'s1',measurement:0,arrivedAtMs:190});
  o.ingest({transducerId:'s0',measurement:0,arrivedAtMs:1100});o.ingest({transducerId:'s1',measurement:0,arrivedAtMs:1192});
  assert.equal(o.snapshot().units.length,1,'92 ms within 5 ms of 90 ms reuses the unit');
  o.ablate('u1');assert.equal(o.snapshot().units.length,0);
  const s=d3Seeds([{seed:1,heights:[1,2,3,4,5,6],delays:[6,5,4,3,2,1]}],{permutations:200});
  assert.equal(s[0].rho,-1);
});

import {episodicHeights} from '../src/world/episodic-drops.js';
import {spearman} from '../src/research/criteria/phase1.js';
test('negative control stream is independent of the world schedule (calibration v1 defect)',()=>{
  for(const seed of [1,2,3]){
    const h=episodicHeights({episodes:40,scheduleSeed:seed});
    const o=new OracleIntervalControl({randomDelays:true,seed});const d=[];
    h.forEach((_,k)=>{o.ingest({transducerId:'s0',measurement:0,arrivedAtMs:k*3000});
      o.ingest({transducerId:'s1',measurement:0,arrivedAtMs:k*3000+100});});
    for(const e of o.drainEvents())if(e.type==='unit.discharge')d.push(e.delayMs);
    assert.ok(Math.abs(spearman(h,d))<0.5,'seed '+seed+': '+spearman(h,d));
  }
});


test('oracle createAlways never reuses a unit', () => {
  const e = new OracleIntervalControl({ createAlways: true });
  for (let k = 0; k < 3; k++) {
    e.ingest({ transducerId: 's0', measurement: 0, arrivedAtMs: 1000 * k });
    e.ingest({ transducerId: 's1', measurement: 0, arrivedAtMs: 1000 * k + 100 });
  }
  const u = e.snapshot().units;
  assert.equal(u.length, 3);
  assert.ok(u.every(x => x.discharges === 1));
});

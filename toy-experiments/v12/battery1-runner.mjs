// Reproduction of corrective battery 1; run: node battery1-runner.mjs
import {Medium12} from './src/model.js';
const target=6+8*(3+6*2);
function trial(g0,amp,learn=true,pattern=null,restLearn=true){
 const m=new Medium12({arm:'A'});
 for(const e of m.edges)e.g=g0;
 for(let t=0;t<480;t++){
  if(pattern?pattern.has(t):t%12===0)for(const s of m.sources)m.v[s]+=amp;
  m.step({learn});
 }
 const trained=m.edges.map(e=>e.g);
 for(let t=0;t<120;t++)m.step({learn:restLearn&&learn});
 const p=m.probe(0);
 return {g0,amp,mean:m.summary().meanG,min:m.summary().minG,max:m.summary().maxG,reinforced:trained.filter(g=>g>g0+1e-12).length,arrival:p.arrival[target],response:p.response[target],trainMean:trained.reduce((a,b)=>a+b,0)/trained.length};
}
function schedule(seed){
 let x=seed>>>0;const a=Array.from({length:480},(_,i)=>i);
 for(let i=a.length-1;i>0;i--){x=(Math.imul(1664525,x)+1013904223)>>>0;const j=Math.floor(x/4294967296*(i+1));[a[i],a[j]]=[a[j],a[i]]}
 return new Set(a.slice(0,40));
}
const E2=[];
for(const g0 of [.001,.005,.02,.06])for(const amp of [1,3,10]){
 const a=trial(g0,amp),c=trial(g0,amp,false);
 E2.push({...a,controlResponse:c.response,controlArrival:c.arrival,delta:a.response-c.response});
}
const E4=[11,41,73].map(seed=>({seed,...trial(.06,1,true,schedule(seed))}));
const E5={restOn:trial(.06,1),restOff:trial(.06,1,true,null,false)};
console.log(JSON.stringify({E1:[.001,.06].map(g=>({g,flux:g,reinforce:g>.002})),E2,E4,E5},null,2));

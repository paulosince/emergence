// V0.12 battery 2 — run node battery2-runner.mjs
import {Medium12} from './src/model.js';
const N=192;
const l1=(a,b)=>a.reduce((s,x,i)=>s+Math.abs(x-b[i]),0)/(b.reduce((s,x)=>s+Math.abs(x),0)||1);
function run(arm,shift,seed){const m=new Medium12({arm,shift,seed});m.run(480,true,true).run(120,false,true).scramble();return m}
function probe(m,k,threshold=1e-5,ablate=-1){return m.probe(k,{threshold,ablate})}
const out=[];
for(const shift of [false,true])for(const seed of [11,41,73]){
 const models=Object.fromEntries(['A','B','C','D'].map(a=>[a,run(a,shift,seed)]));
 for(const source of [0,1]){
  const p=Object.fromEntries(Object.entries(models).map(([a,m])=>[a,probe(m,source)]));
  const ablation=[];
  for(const arm of ['A','C','D']){
   const m=models[arm],base=p[arm].response,impacts=[];
   for(let i=0;i<N;i++){
    if(m.sources.includes(i))continue;
    const q=probe(m,source,1e-5,i).response;
    impacts.push({cell:i,impact:base.reduce((s,x,j)=>s+Math.abs(x-q[j]),0)});
   }
   impacts.sort((a,b)=>b.impact-a.impact);
   ablation.push({arm,top:impacts.slice(0,3),max:impacts[0].impact,mean:impacts.reduce((s,x)=>s+x.impact,0)/impacts.length});
  }
  out.push({shift,seed,source,AC:l1(p.A.response,p.C.response),AD:l1(p.A.response,p.D.response),DC:l1(p.D.response,p.C.response),arrivalCount:Object.fromEntries(Object.entries(models).map(([arm,m])=>[arm,[1e-6,1e-5,1e-4].map(th=>probe(m,source,th).arrival.filter(t=>t>=0).length)])),ablation});
 }
}
console.log(JSON.stringify(out,null,2));

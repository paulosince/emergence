// EMERGENCE V0.12 exploratory engine; see experiment-protocol-addendum.md
// No Uint/Upro classes, source-specific traces, programmed destinations or coincidence detection.
export const dims=[8,6,4];
const [X,Y,Z]=dims,N=X*Y*Z;
const id=(x,y,z)=>x+X*(y+Y*z);
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export class Medium12 {
 constructor({arm="A",seed=41,shift=false}={}){
  if(!["A","B","C","D"].includes(arm))throw Error("arm");
  this.arm=arm;this.seed=seed>>>0;this.tick=0;
  this.v=new Float64Array(N);
  this.sources=shift?[id(2,2,1),id(2,3,2)]:[id(1,1,1),id(1,4,2)];
  this.edges=[];
  for(let z=0;z<Z;z++)for(let y=0;y<Y;y++)for(let x=0;x<X;x++)for(const [dx,dy,dz] of [[1,0,0],[0,1,0],[0,0,1]]){
   const xx=x+dx,yy=y+dy,zz=z+dz;
   if(xx<X&&yy<Y&&zz<Z)this.edges.push({u:id(x,y,z),w:id(xx,yy,zz),g:arm==="B"?.001:.06});
  }
 }
 random(){this.seed=(Math.imul(1664525,this.seed)+1013904223)>>>0;return this.seed/4294967296}
 step({pulse=false,learn=true}={}){
  if(pulse&&this.tick%12===0)for(const s of this.sources)this.v[s]+=1;
  const delta=new Float64Array(N);
  for(const e of this.edges){
   const f=e.g*(this.v[e.u]-this.v[e.w]);
   delta[e.u]-=f;delta[e.w]+=f;
   if(learn&&this.arm!=="C")e.g=clamp(e.g+.0009*(Math.abs(f)-.002),.001,.14);
  }
  for(let i=0;i<N;i++)this.v[i]=Math.max(0,(this.v[i]+delta[i])*.97);
  this.tick++;return this;
 }
 run(n,pulse=true,learn=true){for(let t=0;t<n;t++)this.step({pulse,learn});return this}
 scramble(){
  if(this.arm!=="D")return this;
  // Fisher-Yates permutation of g only, preserving multiset.
  const a=this.edges.map(e=>e.g);
  for(let i=a.length-1;i>0;i--){const j=Math.floor(this.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}
  this.edges.forEach((e,i)=>e.g=a[i]);return this;
 }
 clone(){const q=new Medium12({arm:this.arm,seed:this.seed});q.tick=this.tick;q.sources=[...this.sources];q.v=Float64Array.from(this.v);q.edges=this.edges.map(e=>({...e}));return q}
 probe(sourceIndex=0,{ablate=-1,steps=72,threshold=.00001}={}){
  const q=this.clone();q.v.fill(0);q.v[q.sources[sourceIndex]]=1;
  const arrival=new Int16Array(N);arrival.fill(-1);
  const response=new Float64Array(N);
  for(let t=0;t<steps;t++){
   for(let i=0;i<N;i++)if(i!==ablate&&arrival[i]<0&&q.v[i]>=threshold)arrival[i]=t;
   const dv=new Float64Array(N);
   for(const e of q.edges){if(e.u===ablate||e.w===ablate)continue;const f=e.g*(q.v[e.u]-q.v[e.w]);dv[e.u]-=f;dv[e.w]+=f}
   for(let i=0;i<N;i++)q.v[i]=i===ablate?0:Math.max(0,(q.v[i]+dv[i])*.97);
  }
  response.set(q.v);
  return{arrival:Array.from(arrival),response:Array.from(response)};
 }
 summary(){const g=this.edges.map(e=>e.g);const mean=g.reduce((a,b)=>a+b,0)/g.length;return{arm:this.arm,tick:this.tick,cells:N,edges:g.length,meanG:mean,minG:Math.min(...g),maxG:Math.max(...g),sourcePositions:[...this.sources]}}
}
export function experiment12({seeds=[11,41,73],arms=["A","B","C","D"],shifts=[false,true]}={}){
 const rows=[];
 for(const seed of seeds)for(const shift of shifts)for(const arm of arms){
  const m=new Medium12({arm,seed,shift});m.run(480,true,true);m.run(120,false,true);m.scramble();
  const baseline=m.probe(0);const middle=id(3,2,1),control=id(7,5,3);
  const intervention=m.probe(0,{ablate:middle});const sham=m.probe(0,{ablate:control});
  const target=id(6,3,2);
  rows.push({...m.summary(),seed,shift,target,arrival:baseline.arrival[target],
   response:baseline.response[target],ablatedResponse:intervention.response[target],
   shamResponse:sham.response[target],middle,control});
 }
 return rows;
}

// EMERGENCE V0.10 — local medium, no hardcoded Upro/Uint objects.
// Each cell exchanges with six spatial neighbors. A and B carry source tags solely for external measurement.
export const NX=12,NY=8,NZ=6,N=NX*NY*NZ;
const idx=(x,y,z)=>x+NX*(y+NY*z);
export class Experiment{
 constructor(mode='paired',seed=41,plastic=true){this.mode=mode;this.seed=seed>>>0;this.plastic=plastic;this.t=0;this.tick=0;this.log=[];this.cells=Array.from({length:N},(_,i)=>({i,x:i%NX,y:Math.floor(i/NX)%NY,z:Math.floor(i/(NX*NY)),a:0,b:0,traceA:0,traceB:0,structure:0,output:0}));this.links=[];for(const c of this.cells){for(const [dx,dy,dz] of [[1,0,0],[0,1,0],[0,0,1]]){const x=c.x+dx,y=c.y+dy,z=c.z+dz;if(x<NX&&y<NY&&z<NZ)this.links.push({u:c.i,v:idx(x,y,z),g:.08})}}this.sourceA=idx(1,2,2);this.sourceB=idx(1,5,3);this.sample=[];this.logEvent('initialize',{mode,seed,plastic,cells:N,links:this.links.length,sources:[this.sourceA,this.sourceB]})}
 rand(){this.seed=(Math.imul(1664525,this.seed)+1013904223)>>>0;return this.seed/4294967296}
 logEvent(kind,data){this.log.push({tick:this.tick,time:+this.t.toFixed(3),kind,...data})}
 pulse(a,b){if(a){this.cells[this.sourceA].a+=1;this.logEvent('pulse',{source:'A'})}if(b){this.cells[this.sourceB].b+=1;this.logEvent('pulse',{source:'B'})}}
 step(inject=true){if(inject&&this.tick%12===0){if(this.mode==='paired')this.pulse(true,true);else if(this.mode==='independent')this.pulse(this.rand()<.65,this.rand()<.65);else if(this.mode==='alternating')this.pulse(this.tick%24===0,this.tick%24!==0);else this.pulse(true,true)}const da=new Float64Array(N),db=new Float64Array(N);for(const l of this.links){const u=this.cells[l.u],v=this.cells[l.v];const fa=l.g*(u.a-v.a),fb=l.g*(u.b-v.b);da[l.u]-=fa;da[l.v]+=fa;db[l.u]-=fb;db[l.v]+=fb}
 let active=0,peak=0,integrated=0;for(const c of this.cells){c.a=Math.max(0,(c.a+da[c.i])*.982);c.b=Math.max(0,(c.b+db[c.i])*.982);c.traceA=c.traceA*.965+c.a*.035;c.traceB=c.traceB*.965+c.b*.035;const overlap=Math.min(c.traceA,c.traceB);if(this.plastic)c.structure=Math.min(1,Math.max(0,c.structure*.999+overlap*.008-.000025));c.output=c.structure*Math.min(c.a,c.b);if(c.structure>.025)integrated++;if(c.a+c.b>.008)active++;peak=Math.max(peak,c.structure)}
 // Local plasticity: conductance increases with local traces, not with an encoded destination.
 if(this.plastic)for(const l of this.links){const u=this.cells[l.u],v=this.cells[l.v];const co=Math.min(u.traceA,v.traceA)+Math.min(u.traceB,v.traceB);l.g=Math.max(.025,Math.min(.22,l.g*.9998+.0003*co))}
 this.tick++;this.t=this.tick*.04;if(this.tick%12===0){this.sample.push({tick:this.tick,active,integrated,peak:+peak.toFixed(5)});this.logEvent('sample',{active,integrated,peak})}return this}
 run(n=720){for(let i=0;i<n;i++)this.step();return this}
 candidates(threshold=.025){return this.cells.filter(c=>c.structure>threshold).sort((a,b)=>b.structure-a.structure)}
 // Freeze learned medium; compare joint vs single-source responses at identical coordinates.
 probe(cellId,source,n=60){const m=this.clone();for(const c of m.cells){c.a=0;c.b=0;c.traceA=0;c.traceB=0;c.output=0}m.pulse(source==='A'||source==='AB',source==='B'||source==='AB');let max=0;for(let i=0;i<n;i++){m.step(false);max=Math.max(max,m.cells[cellId].output)}return max}
 clone(){const m=new Experiment(this.mode,41,false);m.cells=this.cells.map(c=>({...c}));m.links=this.links.map(l=>({...l}));m.tick=this.tick;m.t=this.t;m.log=[];m.sample=[];return m}
 evaluate(){const candidates=this.candidates();const top=candidates.slice(0,5).map(c=>{const a=this.probe(c.i,'A'),b=this.probe(c.i,'B'),ab=this.probe(c.i,'AB');return{id:c.i,xyz:[c.x,c.y,c.z],structure:+c.structure.toFixed(5),a:+a.toFixed(7),b:+b.toFixed(7),ab:+ab.toFixed(7),nonlinear:ab>Math.max(a,b)+1e-8}});return{mode:this.mode,ticks:this.tick,plastic:this.plastic,activeCandidates:candidates.length,peak:+(candidates[0]?.structure||0).toFixed(6),top,logEvents:this.log.length,links:this.links.length}}
 exportCSV(){const cols=['tick','time','kind','source','active','integrated','peak'];return[cols.join(','),...this.log.map(e=>cols.map(k=>e[k]??'').join(','))].join('\n')}
}

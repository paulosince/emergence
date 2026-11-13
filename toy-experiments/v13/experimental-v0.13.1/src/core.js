// V0.13: transduction and endogenous construction; no external factory calls.
export class UintFactory {
  constructor(){this.units=new Map();this.next=0;}
  create(spec, proof){if(proof?.kind!=='endogenous' || !proof?.history?.length)throw Error('unauthorized Uint creation'); const id=`u${++this.next}`;const unit={id,channel:spec.channel,interval:spec.interval,threshold:spec.threshold,activation:0,createdAt:proof.time};this.units.set(id,unit);return unit;}
}
export class UproFactory {
  constructor(units){this.units=units;this.edges=new Map();this.next=0;}
  create(spec,proof){if(proof?.kind!=='endogenous'||!proof?.history?.length)throw Error('unauthorized Upro creation');if(!this.units.has(spec.source)||!this.units.has(spec.target)||spec.source===spec.target||!(spec.delay>0))throw Error('invalid edge');if([...this.edges.values()].some(e=>e.source===spec.source&&e.target===spec.target))return null;const edge={id:`p${++this.next}`,source:spec.source,target:spec.target,delay:spec.delay,createdAt:proof.time};this.edges.set(edge.id,edge);return edge;}
}
export class Experiment {
  constructor({repeat=3,linkRepeat=2,bin=2,maxGap=20}={}){this.uf=new UintFactory();this.pf=new UproFactory(this.uf.units);this.repeat=repeat;this.linkRepeat=linkRepeat;this.bin=bin;this.maxGap=maxGap;this.lastByChannel=new Map();this.features=new Map();this.recent=[];this.transitions=new Map();this.events=[];this.pending=[];this.audit=[];this.now=0;}
  // Environmental inputs are raw channel/amplitude/time, not factory requests.
  transduce(raw){if(!Number.isFinite(raw.time)||!Number.isFinite(raw.amplitude)||raw.amplitude<0||typeof raw.channel!=='string')throw Error('invalid physical incidence');return {channel:raw.channel,time:raw.time,intensity:Math.log1p(raw.amplitude)};}
  feed(raw){const s=this.transduce(raw);if(s.time<this.now)throw Error('nonmonotonic time');this.deliverUntil(s.time);this.now=s.time;this.events.push({kind:'transduced',...s});const prior=this.lastByChannel.get(s.channel);this.lastByChannel.set(s.channel,s.time);if(prior===undefined)return;const dt=s.time-prior;if(dt<=0)return;const interval=Math.max(1,Math.round(dt/this.bin));const key=`${s.channel}:${interval}`;let f=this.features.get(key);if(!f){f={channel:s.channel,interval,hits:0,times:[],unit:null};this.features.set(key,f);}f.hits++;f.times.push(s.time);if(!f.unit&&f.hits>=this.repeat){const history=f.times.slice();f.unit=this.uf.create({channel:s.channel,interval,threshold:Math.max(1,Math.round(f.hits/2))},{kind:'endogenous',time:s.time,history});this.audit.push({kind:'Uint-created',time:s.time,id:f.unit.id,channel:s.channel,interval,history});}
    if(!f.unit)return;f.unit.activation++;this.events.push({kind:'activation',time:s.time,unit:f.unit.id});const earlier=this.recent.filter(r=>r.time<s.time&&s.time-r.time<=this.maxGap&&r.id!==f.unit.id);for(const r of earlier){const tkey=`${r.id}>${f.unit.id}`;let tr=this.transitions.get(tkey);if(!tr){tr={source:r.id,target:f.unit.id,gaps:[],times:[],edge:null};this.transitions.set(tkey,tr);}tr.gaps.push(s.time-r.time);tr.times.push(s.time);if(!tr.edge&&tr.gaps.length>=this.linkRepeat){const sorted=[...tr.gaps].sort((a,b)=>a-b);const delay=sorted[Math.floor(sorted.length/2)];tr.edge=this.pf.create({source:r.id,target:f.unit.id,delay},{kind:'endogenous',time:s.time,history:tr.times});if(tr.edge)this.audit.push({kind:'Upro-created',time:s.time,id:tr.edge.id,source:r.id,target:f.unit.id,delay,history:[...tr.times]});}}
    this.recent.push({id:f.unit.id,time:s.time});this.recent=this.recent.filter(r=>s.time-r.time<=this.maxGap);
    // Real propagation by effective delayed delivery, not merely edge metadata.
    for(const e of this.pf.edges.values())if(e.source===f.unit.id){const ev={kind:'scheduled-delivery',time:s.time+e.delay,source:e.source,target:e.target,edge:e.id};this.events.push(ev);this.pending.push(ev);}
  }
  deliverUntil(time){const due=this.pending.filter(e=>e.time<=time).sort((a,b)=>a.time-b.time);this.pending=this.pending.filter(e=>e.time>time);for(const e of due){const target=this.uf.units.get(e.target);if(target){target.activation++;this.events.push({kind:'delivered',time:e.time,source:e.source,target:e.target,edge:e.edge});}}}
  report(){this.deliverUntil(Infinity);return {units:[...this.uf.units.values()],edges:[...this.pf.edges.values()],audit:this.audit,events:this.events};}
}

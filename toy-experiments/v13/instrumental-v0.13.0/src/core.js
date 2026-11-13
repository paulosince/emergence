// EMERGENCE V0.13: infraestrutura operacional; nenhum conteúdo representacional é programado.
export class EventEngine {
  constructor({maxEvents=2_000_000}={}) {this.time=0;this.queue=[];this.seq=0;this.processed=0;this.maxEvents=maxEvents;this.audit=[];}
  schedule(time, receiver, payload) {if(!(Number.isFinite(time)&&time>=this.time)) throw Error('invalid event time');this.queue.push({time,receiver,payload,seq:this.seq++});}
  run(until=Infinity) {
    while(this.queue.length){this.queue.sort((a,b)=>a.time-b.time||a.seq-b.seq);const t=this.queue[0].time;if(t>until)break;
      const batch=[];while(this.queue.length&&this.queue[0].time===t)batch.push(this.queue.shift());
      this.time=t;this.processed+=batch.length;if(this.processed>this.maxEvents)throw Error('event budget exceeded');
      const groups=new Map();for(const e of batch){if(!groups.has(e.receiver))groups.set(e.receiver,[]);groups.get(e.receiver).push(e.payload);}
      // All recipients compute from pre-batch state; effects cannot be read by other recipients in same batch.
      const effects=[];for(const [receiver,items] of groups)effects.push(...receiver.prepare(items,t));
      for(const effect of effects)effect();this.audit.push({time:t,count:batch.length});
    }
  }
}
let nextId=1;
export class UintFactory {
  constructor(engine,{max=128}={}){this.engine=engine;this.max=max;this.units=new Map();this.audit=[];}
  create({threshold=1,decay=0,refractory=0}={},cause={kind:'seed'}){
    if(this.units.size>=this.max)throw Error('Uint budget');
    if(!(threshold>0&&decay>=0&&refractory>=0))throw Error('invalid Uint parameters');
    const u=new Uint(`u${nextId++}`,this.engine,{threshold,decay,refractory});this.units.set(u.id,u);
    this.audit.push({op:'create',id:u.id,time:this.engine.time,cause});return u;
  }
}
export class Uint {
  constructor(id,engine,{threshold,decay,refractory}){Object.assign(this,{id,engine,threshold,decay,refractory,level:0,last:0,refractoryUntil:-Infinity,emissions:0,outgoing:[],history:[]});}
  prepare(items,t){const total=items.reduce((a,x)=>a+x.amplitude,0);const next=this.level*Math.exp(-this.decay*(t-this.last))+total;
    const fire=t>=this.refractoryUntil&&next>=this.threshold;
    return [()=>{this.level=fire?0:next;this.last=t;this.history.push({t,total,fire});if(fire){this.emissions++;this.refractoryUntil=t+this.refractory;for(const edge of this.outgoing)edge.emit(1,t);}}];
  }
}
export class UproFactory {
  constructor(engine,{max=1024}={}){this.engine=engine;this.max=max;this.edges=[];this.audit=[];}
  create({source,target,delay=1,capacity=Infinity},cause={kind:'seed'}){
    if(!(source instanceof Uint&&target instanceof Uint&&delay>0&&capacity>0))throw Error('invalid Upro');
    if(this.edges.length>=this.max)throw Error('Upro budget');
    const edge=new Upro(this.engine,source,target,delay,capacity);this.edges.push(edge);source.outgoing.push(edge);
    this.audit.push({op:'create',source:source.id,target:target.id,delay,time:this.engine.time,cause});return edge;
  }
}
export class Upro {
  constructor(engine,source,target,delay,capacity){Object.assign(this,{engine,source,target,delay,capacity,active:true,sent:0});}
  emit(amplitude,t){if(!this.active||this.sent>=this.capacity)return false;this.sent++;
    this.engine.schedule(t+this.delay,this.target,{amplitude,source:this.source.id,emitted:t,delay:this.delay});return true;}
  retire(){this.active=false;}
}
// Portadora local de descoberta. Contato físico é infraestrutura, não uma Upro emergente.
export class LocalCarrier {
  constructor(engine,{speed=1,range=1}={}){if(!(speed>0&&range>=0))throw Error('invalid carrier');Object.assign(this,{engine,speed,range,receivers:[]});}
  attach(receiver,x){this.receivers.push({receiver,x});}
  pulse(source,x,t){for(const {receiver,x:rx} of this.receivers){const d=Math.abs(rx-x);if(d<=this.range)this.engine.schedule(t+d/this.speed,receiver,{kind:'pulse',source:source.id,amplitude:0,emitted:t});}}
}
export class CoincidenceReceiver {
  constructor({window,onPair}){if(window<0)throw Error('invalid window');Object.assign(this,{window,onPair,seen:[],pairs:[]});}
  prepare(items,t){const incoming=items.filter(x=>x.kind==='pulse').map(x=>({source:x.source,t}));
    const current=[...this.seen.filter(x=>t-x.t<=this.window),...incoming];const pairs=[];
    for(let i=0;i<current.length;i++)for(let j=i+1;j<current.length;j++)if(current[i].source!==current[j].source&&Math.abs(current[i].t-current[j].t)<=this.window){const p=[current[i].source,current[j].source].sort();if(!pairs.some(q=>q.join('|')===p.join('|')))pairs.push(p);}
    return [()=>{this.seen=current;for(const p of pairs){this.pairs.push({t,p});this.onPair?.(p,t);}}];
  }
}

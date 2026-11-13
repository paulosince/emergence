import {EventEngine,UintFactory,UproFactory,LocalCarrier,CoincidenceReceiver} from './core.js';
const engine=new EventEngine();const uf=new UintFactory(engine),pf=new UproFactory(engine);
const a=uf.create({threshold:1},{kind:'seed'}),b=uf.create({threshold:1},{kind:'seed'}),c=uf.create({threshold:1},{kind:'seed'});
pf.create({source:a,target:c,delay:2},{kind:'instrumental-seed'});
engine.schedule(0,a,{amplitude:1});engine.run();
const carrier=new LocalCarrier(engine,{speed:1,range:10});const receiver=new CoincidenceReceiver({window:0.5,onPair:(pair,t)=>{const src=uf.units.get(pair[0]),dst=uf.units.get(pair[1]);if(src&&dst&&!pf.edges.some(e=>e.source===src&&e.target===dst))pf.create({source:src,target:dst,delay:1},{kind:'R2-L',pair,t});}});
carrier.attach(receiver,0);carrier.pulse(a,-1,engine.time+1);carrier.pulse(b,1,engine.time+1);engine.run();
console.log(JSON.stringify({events:engine.processed,units:uf.units.size,edges:pf.edges.length,created:pf.audit,coincidences:receiver.pairs},null,2));

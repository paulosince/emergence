// EMERGENCE V0.16 — motor de propagação e integração; sem formação autônoma.
// Unidades: posição em unidade espacial (ue); tempo em ms; velocidade em ue/ms.
// Não há classificadores, rótulos semânticos, criação automática de Uint/Upro ou ajuste a alvo.
export class Engine {
  constructor({ windowMs = 0.25, threshold = 1.5, refractoryMs = 1,
    emission = "onset", periodMs = null, modulation = 1 } = {}) {
    if (!(windowMs > 0 && threshold > 0 && refractoryMs >= 0)) throw Error("parâmetros inválidos");
    if (!["onset", "sustained"].includes(emission)) throw Error("emissão inválida");
    if (emission === "sustained" && !(periodMs > 0)) throw Error("periodMs necessário");
    this.cfg = {windowMs, threshold, refractoryMs, emission, periodMs, modulation};
    this.units = new Map(); this.paths = new Map(); this.out = new Map();
    this.queue = []; this.log = []; this.now = 0; this.seq = 0; this.eventId = 0;
    this.lastInput = new Map(); this.lastEmission = new Map();
    this.latest = new Map(); this.refractoryUntil = new Map();
  }
  unit({id, type, position, thresholds = []}) {
    if (this.units.has(id) || !["Utrd", "Uint"].includes(type) ||
        !Array.isArray(position) || position.length !== 3 ||
        !position.every(Number.isFinite)) throw Error("unidade inválida");
    if (type === "Utrd" && (!thresholds.length || thresholds.some(x=>!(x>=0)) ||
        thresholds.some((x,i)=>i>0 && x<=thresholds[i-1]))) throw Error("limiares inválidos");
    this.units.set(id,{id,type,position:[...position],thresholds:[...thresholds]});
    this.out.set(id,[]);
    if (type === "Uint") this.latest.set(id,new Map());
  }
  path({id, from, to, speed, confidence = 1, modulation = 1, thresholdIndex = null}) {
    const a=this.units.get(from), b=this.units.get(to);
    if (this.paths.has(id) || !a || !b || b.type!=="Uint" ||
        !(speed>0) || !(confidence>=0 && confidence<=1) ||
        !(modulation>=0) || (a.type==="Utrd" &&
        (!Number.isInteger(thresholdIndex) || thresholdIndex<0 ||
         thresholdIndex>=a.thresholds.length)) ||
        (a.type==="Uint" && thresholdIndex!==null)) throw Error("Upro inválida");
    const distance=Math.hypot(...a.position.map((x,i)=>x-b.position[i]));
    if (!(distance>0)) throw Error("distância nula");
    const p={id,from,to,speed,confidence,modulation,thresholdIndex,distance};
    this.paths.set(id,p); this.out.get(from).push(id); return p;
  }
  enqueue(time, kind, payload) {
    if (!Number.isFinite(time) || time<this.now-1e-9) throw Error("tempo retroativo");
    this.queue.push({time,kind,payload,seq:++this.seq});
  }
  // A entrada é uma medida física escalar, não um identificador de objeto.
  input(id, time, intensity) {
    const u=this.units.get(id);
    if (!u || u.type!=="Utrd" || !(intensity>=0) || !Number.isFinite(intensity))
      throw Error("entrada inválida");
    this.enqueue(time,"sample",{id,intensity});
  }
  emit(origin, time, via = null, parent = null) {
    const eid=++this.eventId;
    this.log.push({kind:"emit",time,eid,origin,via,parent});
    // Todas as Upros de saída são consideradas, sem seleção pelo destino.
    for(const pid of this.out.get(origin)) {
      const p=this.paths.get(pid);
      if (via!==null && p.thresholdIndex!==via) continue;
      const arrival=time+p.distance/p.speed; // velocidade congelada na emissão
      const magnitude=p.confidence*p.modulation*this.cfg.modulation;
      this.enqueue(arrival,"arrival",{eid,origin,pid,to:p.to,magnitude});
      this.log.push({kind:"travel",time,eid,pid,arrival,magnitude});
    }
  }
  sample({id,intensity},time) {
    const u=this.units.get(id), prior=this.lastInput.get(id)??0;
    for(let k=0;k<u.thresholds.length;k++) {
      const active=intensity>=u.thresholds[k], was=prior>=u.thresholds[k];
      const key=id+":"+k;
      if(active && !was) {this.emit(id,time,k);this.lastEmission.set(key,time);}
      else if(active && this.cfg.emission==="sustained" &&
        time-(this.lastEmission.get(key)??time)>=this.cfg.periodMs-1e-9) {
        this.emit(id,time,k);this.lastEmission.set(key,time);
      }
    }
    this.lastInput.set(id,intensity);
    this.log.push({kind:"sample",time,id,intensity});
  }
  arrive(e,time) {
    const p=this.paths.get(e.pid);
    const byOrigin=this.latest.get(e.to);
    // D17/D17a: uma contribuição por origem; a última chegada substitui.
    byOrigin.set(e.origin,{time,magnitude:e.magnitude,pid:e.pid,eid:e.eid});
    const active=[...byOrigin.entries()].filter(([,v])=>time-v.time<=this.cfg.windowMs+1e-9);
    const sum=active.reduce((s,[,v])=>s+v.magnitude,0);
    this.log.push({kind:"arrival",time,...e,origins:active.length,sum});
    if(active.length<2 || sum<this.cfg.threshold ||
       time<(this.refractoryUntil.get(e.to)??-Infinity)) return;
    const contributors=active.map(([origin,v])=>({origin,pid:v.pid,eid:v.eid}));
    this.log.push({kind:"fire",time,id:e.to,contributors,sum});
    byOrigin.clear();this.refractoryUntil.set(e.to,time+this.cfg.refractoryMs);
    this.emit(e.to,time,null,e.eid);
  }
  run(until=Infinity,maxEvents=1000000) {
    let n=0;
    while(this.queue.length) {
      this.queue.sort((a,b)=>a.time-b.time||a.seq-b.seq);
      if(this.queue[0].time>until) break;
      if(++n>maxEvents) throw Error("limite de eventos: possível ciclo");
      const e=this.queue.shift();this.now=e.time;
      if(e.kind==="sample") this.sample(e.payload,e.time);
      else this.arrive(e.payload,e.time);
    }
    return this.log;
  }
  setSpeed(pid,speed) {
    if(!(speed>0) || !this.paths.has(pid)) throw Error("velocidade inválida");
    // Só afeta emissões futuras; eventos em trânsito conservam seu atraso.
    this.paths.get(pid).speed=speed;
    this.log.push({kind:"speed-change",time:this.now,pid,speed});
  }
}

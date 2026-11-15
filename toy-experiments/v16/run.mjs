// node toy-experiments/v16/run.mjs
// Condições pareadas; conectividade sorteada ANTES de gerar os estímulos.
// Não há busca por parâmetros que maximizem disparos.
import {Engine} from "./engine.mjs";
import {stereoFrames,injectStereo} from "./scene.mjs";
const seed=20261115;
function rng(s){return ()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296;};}
function experiment(condition) {
  const random=rng(seed),width=16,height=12;
  const e=new Engine({windowMs:0.25,threshold:1.5,emission:"onset"});
  const ids=[[],[]];
  for(let c=0;c<2;c++)for(let k=0;k<width*height;k++){
    const id="u"+c+"_"+k;ids[c].push(id);
    e.unit({id,type:"Utrd",position:[(k%width)/width,c*0.2,Math.floor(k/width)/height],thresholds:[0.15,0.5]});
  }
  const all=ids.flat();
  for(let j=0;j<64;j++){
    const id="j"+j;
    e.unit({id,type:"Uint",position:[random()*2,0.3+random(),random()]});
    const used=new Set();
    while(used.size<4)used.add(Math.floor(random()*all.length));
    for(const index of used){
      const from=all[index];
      for(const thresholdIndex of [0,1])
        e.path({id:"p"+j+"_"+index+"_"+thresholdIndex,from,to:id,
          thresholdIndex,speed:0.7+random()*0.6});
    }
  }
  const frames=stereoFrames({width,height,...condition});
  // 60 quadros por câmera, em 1 segundo; emissão apenas na transição.
  for(let frame=0;frame<60;frame++)injectStereo(e,frames,frame*1000/60,ids);
  e.run();
  const count=k=>e.log.filter(x=>x.kind===k).length;
  return {condition,seed,units:e.units.size,paths:e.paths.size,
    emissions:count("emit"),travels:count("travel"),
    arrivals:count("arrival"),firings:count("fire"),
    firingIds:[...new Set(e.log.filter(x=>x.kind==="fire").map(x=>x.id))].sort(),
    events:e.log};
}
const conditions=[
  {stem:true,stemShift:0},
  {stem:false},
  {stem:true,stemShift:0.35}
];
for(const c of conditions){
  const r=experiment(c);
  // JSONL é apenas FORMATO DE AUDITORIA, não mecanismo representacional.
  console.log(JSON.stringify({condition:r.condition,seed:r.seed,
    units:r.units,paths:r.paths,emissions:r.emissions,
    travels:r.travels,arrivals:r.arrivals,firings:r.firings,
    firingIds:r.firingIds}));
}

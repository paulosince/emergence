import {Experiment,UintFactory} from '../experimental-v0.13.1/src/core.js';
const P={repeat:3,linkRepeat:2,bin:2,maxGap:12};
function run(sig){const x=new Experiment(P);for(const s of sig.sort((a,b)=>a.time-b.time))x.feed(s);return x;}
const summ=x=>({units:[...x.uf.units.values()].map(u=>`${u.id}:${u.channel}/${u.interval}`),edges:[...x.pf.edges.values()].map(e=>`${e.source}>${e.target} d${e.delay}`)});
// 1 controle independente: A periodo 10, B periodo 7 (sem relacao entre canais)
let s=[];for(let i=0;i<12;i++)s.push({channel:'sensor-A',amplitude:2,time:10*i});for(let i=0;i<17;i++)s.push({channel:'sensor-B',amplitude:4,time:7*i+3});
console.log('1 independente (10 x 7):',JSON.stringify(summ(run(s))));
// 1b B com fase aleatoria a cada ciclo (LCG)
let r=12345;const rnd=()=>(r=(r*1103515245+12345)%2147483648)/2147483648;
s=[];for(let i=0;i<12;i++){s.push({channel:'sensor-A',amplitude:2,time:10*i});}let t=0;for(let i=0;i<14;i++){t+=10;s.push({channel:'sensor-B',amplitude:4,time:t+Math.floor(rnd()*3)});}
console.log('1b B quase periodico, fase variavel:',JSON.stringify(summ(run(s))));
// 2 rotulo de origem falsificado
const uf=new UintFactory();uf.create({channel:'X',interval:1},{kind:'endogenous',history:[0]});console.log('2 criacao manual com rotulo falso aceita:',uf.units.size===1);
// 3 lookup: apagar o mapa depois da constituicao e reapresentar A
s=[];for(let i=0;i<12;i++){s.push({channel:'sensor-A',amplitude:2,time:10*i},{channel:'sensor-B',amplitude:4,time:10*i+4});}
const x=run(s);const before=x.uf.units.get('u1').activation;x.features.clear();
for(let i=12;i<16;i++)x.feed({channel:'sensor-A',amplitude:2,time:10*i});
console.log('3 sem o mapa: ativacao de u1',before,'->',x.uf.units.get('u1').activation,'; Uint totais',x.uf.units.size,summ(x).units);
// 4 intensidade: amplitudes 0.01 vs 1000 dao o mesmo resultado?
const a=run(s.map(z=>({...z,amplitude:0.01}))),b=run(s.map(z=>({...z,amplitude:1000})));
console.log('4 intensidade irrelevante:',JSON.stringify(summ(a))===JSON.stringify(summ(b)));

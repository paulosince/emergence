// EMERGENCE laboratory page. The SIMULATOR, TRANSDUCERS and ENGINE are the
// only sources of displayed quantities; every view is a read-only projection
// of what was actually executed (or of a recorded history). Neither playback
// speed, zoom nor GUI state writes into the scientific engine.
import { createRoomScenario } from '../src/room/room-scenario.js';
import { ExecutionController } from '../src/runtime/execution-controller.js';
import { DiagnosticEngine } from '../src/engines/diagnostic-engine.js';
import { TempoFixedNodesControl } from '../src/engines/tempo-fixed-nodes-control.js';
import { DAY_MS } from '../src/room/solar.js';
import {buildRoomRecord,recordedPlayback,
  independentlyReexecute,resumeSavedCheckpoint}
  from '../src/persistence/records.js';
import {exportScientificArchive,importScientificArchive}
  from '../src/persistence/archive.js';
import {openExperimentStore}
  from '../src/persistence/indexeddb.js';
import {EMERGENCE_VERSION} from '../src/research/version.js';
import {meshModel,firingsFromTrace,propagationAt,activityAt,firingCause,LIFECYCLE}
  from '../src/visualization/mesh-model.js';
import {timelineModel,preciseClock} from '../src/visualization/timeline-model.js';
import {domainLayout} from '../src/visualization/domain-layout.js';
import {manifestDigest,metricsRow,metricsCsv,compareRuns}
  from '../src/research/run-comparison.js';

const el=id=>document.getElementById(id);
const sensors=document.querySelectorAll('[data-room-modality]');
const format=new Intl.NumberFormat('pt-BR',{maximumFractionDigits:2});
const num=x=>format.format(x);
const clone=x=>structuredClone(x);
const clock=t=>{
  const mins=Math.floor(t/60000);
  return String(Math.floor(mins/60)).padStart(2,'0')+':'+
    String(mins%60).padStart(2,'0');
};
const channelNames=Object.freeze({
  r0:'Luz no piso · ponto 1',
  r1:'Luz no piso · ponto 2',
  r2:'Radiação externa',
  r3:'Temperatura interna · tensão',
  r4:'Temperatura externa · tensão',
  r5:'Corrente da lâmpada',
});
const unitNames=Object.freeze({
  r0:'W/m²',r1:'W/m²',r2:'W/m²',r3:'V',r4:'V',r5:'A',
});
const eventNames=Object.freeze({
  'lamp.initial':'Estado inicial da lâmpada',
  'lamp.toggle':'Fotocélula alterou a lâmpada',
});
// Explicit, recorded control parameter: one PREDEFINED node per room channel.
const ROOM_NODES=Object.freeze({r0:0,r1:1,r2:2,r3:3,r4:4,r5:5});
const NODE_CHANNEL=Object.keys(ROOM_NODES);
const engineNotes=Object.freeze({
  diagnostic:'O motor diagnóstico não aprende: não constitui unidades nem relações. Os contadores 0/0 são o resultado real, não falta de dados.',
  'tempo-fixed':'Controle TEMPO com nós fixos: cada transdutor é mapeado a um nó predefinido (r0→0 … r5→5); as relações e latências surgem das regras plásticas do TEMPO, sem alterar o código original. Não é constituição autônoma de unidades. As relações refletem tempos de chegada, que incluem a latência própria de cada transdutor.',
});

// `result` is ALWAYS a read-only projection of what was actually executed
// (live controller) or of a recorded history. The view never computes ahead.
let scene=null,result=null,tMs=0,playback=null;
let controller=null,runTimer=null,mode='prepared',engineKind='diagnostic';
let snapHistory=[],firingCache={length:-1,firings:[]};
let currentOptions=null,currentRecord=null,db=null;
const runs=[];let runCounter=0;
const RUN_STEP_MS=900000; // simulated block executed per real tick (15 min)
const ACTIVITY_WINDOW_MS=1800000;
const modeText=Object.freeze({
  prepared:'PREPARADO · o motor ainda não processou nenhum evento',
  running:'EXECUÇÃO REAL · o motor está processando eventos',
  paused:'EXECUÇÃO PAUSADA · nenhum evento é processado até retomar',
  completed:'EXECUÇÃO CONCLUÍDA · navegação no histórico executado',
  recorded:'REGISTRO GRAVADO · reprodução sem executar o motor',
});

function setText(id,value){el(id).textContent=value;}
function setAttribute(id,name,value){el(id).setAttribute(name,String(value));}
function svgNode(tag,attrs={},text=null){
  if(typeof document.createElementNS!=='function')return null;
  const n=document.createElementNS('http://www.w3.org/2000/svg',tag);
  for(const [k,v] of Object.entries(attrs))n.setAttribute(k,String(v));
  if(text!==null)n.textContent=text;
  return n;
}

// ---------------------------------------------------------------- tabs
const TABS=['Prepare','Observe','Analyze','Audit'];
function selectTab(name){
  for(const t of TABS){
    const on=t===name;
    el('tab'+t).setAttribute('aria-selected',String(on));
    el('panel'+t).hidden=!on;
  }
  if(name==='Audit')renderAudit();
  if(name==='Observe')drawMesh();
}
for(const t of TABS)el('tab'+t).addEventListener('click',()=>selectTab(t));

// ---------------------------------------------------------------- world scene
function project(east,north,up=0){
  return {x:360+55*east-52*north,
    y:314+19*east-28*north-65*up};
}
function shapeFromWorld(points){
  if(!points || points.length<3) return '';
  return points.map((p,i)=>{
    const q=project(p.x,p.y,p.z??0);
    return (i?'L':'M')+q.x.toFixed(3)+','+q.y.toFixed(3);
  }).join(' ')+' Z';
}
function planePoint(east,north,up=0){return {x:east,y:north,z:up};}
function drawGeometry(geometry) {
  const w=geometry.widthM/2,d=geometry.depthM/2,H=geometry.heightM;
  const P=planePoint;
  setAttribute('wallNorth','d',shapeFromWorld([
    P(-w,d,0),P(w,d,0),P(w,d,H),P(-w,d,H),
  ]));
  setAttribute('wallWest','d',shapeFromWorld([
    P(-w,-d,0),P(-w,d,0),P(-w,d,H),P(-w,-d,H),
  ]));
  setAttribute('floorSurface','d',shapeFromWorld([
    P(-w,-d),P(-w,d),P(w,d),P(w,-d),
  ]));
  const window=geometry.window,wx=window.widthM/2,cx=window.centerEastM;
  const zl=window.sillM,zh=zl+window.heightM;
  setAttribute('windowOpening','d',shapeFromWorld([
    P(cx-wx,d,zl),P(cx+wx,d,zl),P(cx+wx,d,zh),P(cx-wx,d,zh),
  ]));
  const door=geometry.door,dy=door.widthM/2;
  setAttribute('doorOpening','d',shapeFromWorld([
    P(-w,door.centerNorthM-dy,0),P(-w,door.centerNorthM+dy,0),
    P(-w,door.centerNorthM+dy,door.heightM),
    P(-w,door.centerNorthM-dy,door.heightM),
  ]));
  const b=geometry.opaqueObject;
  for(const id of ['objectLeft','objectFront','objectTop']) {
    setAttribute(id,'d','');
  }
  if(b) {
    const x1=b.centerEastM-b.widthM/2,x2=b.centerEastM+b.widthM/2;
    const y1=b.centerNorthM-b.depthM/2,y2=b.centerNorthM+b.depthM/2;
    setAttribute('objectLeft','d',shapeFromWorld([
      P(x1,y1,0),P(x1,y2,0),P(x1,y2,b.heightM),P(x1,y1,b.heightM),
    ]));
    setAttribute('objectFront','d',shapeFromWorld([
      P(x1,y1,0),P(x2,y1,0),P(x2,y1,b.heightM),P(x1,y1,b.heightM),
    ]));
    setAttribute('objectTop','d',shapeFromWorld([
      P(x1,y1,b.heightM),P(x2,y1,b.heightM),
      P(x2,y2,b.heightM),P(x1,y2,b.heightM),
    ]));
  }
  const lightFixture=project(0,0,geometry.heightM-.15);
  for(const id of ['lampAuraRing','lampFixture']) {
    setAttribute(id,'cx',lightFixture.x);
    setAttribute(id,'cy',lightFixture.y);
  }
}

// ---------------------------------------------------------------- modes
// Stops VISUAL playback only. It has no effect on the engine.
function stop(){
  if(playback!==null) clearInterval(playback);
  playback=null;
  setText('roomPlay','Reproduzir histórico');
  showMode();
}
function horizonMs(){
  if(!scene)return 0;
  return mode==='recorded'?scene.endTimeMs:controller.executedThroughMs;
}
function showMode(){
  const replaying=playback!==null;
  setText('roomMode',replaying
    ?'REPRODUÇÃO · revendo o histórico já executado; o motor não avança'
    :modeText[mode]);
  el('roomMode').setAttribute('data-mode',replaying?'replay':mode);
  const live=mode!=='recorded';
  setText('roomRun',mode==='running'?'Pausar execução':
    mode==='paused'?'Retomar execução':'Executar motor');
  el('roomRun').disabled=!live||mode==='completed';
  el('roomRunAll').disabled=!live||mode==='completed';
}
function pullExecuted(){
  const view=controller.observe(result.incidences.length,result.trace.length);
  if(view.incidences.length)result.incidences.push(...view.incidences);
  if(view.trace.length)result.trace.push(...view.trace);
  const t=controller.executedThroughMs;
  if(!snapHistory.length || snapHistory[snapHistory.length-1].t<t)
    snapHistory.push({t,snapshot:controller.engineSnapshot()});
  if(controller.state==='completed'){
    result=controller.result();
    snapHistory[snapHistory.length-1]={t:controller.endTimeMs,
      snapshot:clone(result.finalSnapshot)};
    mode='completed';
    registerRun();
  }else mode=controller.state;
}
function stopRunTimer(){
  if(runTimer!==null)clearInterval(runTimer);
  runTimer=null;
}
// Operational pause: the controller refuses to process events while paused.
function pauseExecution(reason){
  stopRunTimer();
  if(controller && controller.state==='running')controller.pause(reason);
  if(controller && mode!=='recorded')pullExecuted();
  showMode();
  renderAudit();
}
function executeTick(){
  if(!controller || controller.state!=='running'){stopRunTimer();return;}
  controller.advanceBy(RUN_STEP_MS);
  pullExecuted();
  if(mode==='completed')stopRunTimer();
  redraw(controller.executedThroughMs);
  setText('roomStatus',statusText());
  showMode();
  renderAudit();
}
function statusText(){
  if(mode==='recorded')return 'Registro gravado · '+result.incidences.length+
    ' incidências (não reexecutado)';
  return 'Motor executado até '+clock(controller.executedThroughMs)+' · '+
    result.incidences.length+' incidências entregues';
}

// ---------------------------------------------------------------- redraw
function laneX(t){return 160+600*t/DAY_MS;}
function redraw(timeMs) {
  if(!scene) return;
  // Never display world or domain beyond what was actually executed.
  tMs=Math.min(Math.max(0,timeMs),horizonMs());
  el('roomTimeline').value=String(tMs);
  setText('roomTimeOutput',clock(tMs));
  setText('roomClock',clock(tMs));
  const s=scene.world.stateAt(tMs);
  const light=s.lighting;
  const day=s.sun.isAboveHorizon;
  const cloudy=s.weather.cloudCover>.5;
  setText('phaseLabel',day?(cloudy?'Dia encoberto':'Dia claro'):'Noite');
  setText('sunElevation',num(s.sun.altitudeDeg)+'°');
  setText('outdoorLight',num(light.outdoorIrradianceWm2)+' W/m²');
  setText('floorLight',num(scene.world.floorIrradianceAt(tMs,.65,.7))+' W/m²');
  setText('lampState',light.lampOn?'Acesa':'Apagada');
  setText('outdoorTemp',num(s.thermal.outdoorTemperatureC)+' °C');
  setText('indoorTemp',num(s.thermal.indoorTemperatureC)+' °C');

  setAttribute('sunPatch','d',shapeFromWorld(
    light.sunlightFloorPolygon));
  setAttribute('obstacleShadow','d',shapeFromWorld(
    light.obstacleShadowFloorPolygon));
  setAttribute('skyBackdrop','fill',!day?'#1a2532':
    cloudy?'#9fb0c0':'#bcd9ea');
  setAttribute('windowOpening','fill',!day?'#273950':
    cloudy?'#acc1ce':'#a4d7ef');
  setAttribute('wallNorth','fill',!day?'#6f7780':
    cloudy?'#c3ccd6':'#e7ebef');
  setAttribute('wallWest','fill',!day?'#5a6168':
    cloudy?'#aab8c5':'#d1dfe9');
  setAttribute('floorSurface','fill',!day?'#68757d':
    cloudy?'#b7c6cf':'#dae5ea');
  setAttribute('lampAuraRing','opacity',light.lampOn?'.85':'0');
  setAttribute('lampFixture','fill',light.lampOn?'#fff2b7':'#8b9eab');
  setAttribute('sunPatch','fill-opacity',
    (Math.max(0,Math.min(1,light.transmittedDirectPowerW/1400))*.65+.12)
      .toFixed(3));

  const explanation=!day
    ? 'Sol abaixo do horizonte: não entra luz solar. A fotocélula externa pode manter a lâmpada ligada.'
    : light.transmittedDirectPowerW===0
      ? 'O Sol está acima do horizonte, mas não ilumina diretamente esta janela: orientação e geometria importam.'
      : 'A luz atravessa a janela; seu alcance e a sombra do objeto derivam da direção solar e das interseções geométricas.';
  setText('roomExplanation',explanation);

  const delivered=result.incidences.filter(i=>i.arrivedAtMs<=tMs);
  setText('roomDelivered',String(delivered.length));
  setText('roomIncidenceCount',delivered.length+' incidências até '+clock(tMs));

  const readings=el('roomSensorReadings');
  readings.replaceChildren();
  const last=new Map();
  for(const i of delivered) last.set(i.transducerId,i);
  for(const config of result.manifest.transducers) {
    const div=document.createElement('div');
    const value=last.get(config.id);
    div.textContent=(channelNames[config.id]??config.id)+': ';
    const strong=document.createElement('strong');
    strong.textContent=value?num(value.measurement)+' '+
      (unitNames[config.id]??''):'—';
    div.append(strong);
    readings.append(div);
  }
  if(!result.manifest.transducers.length){
    const d=document.createElement('div');
    d.textContent='Todas as modalidades desativadas.';
    readings.append(d);
  }

  const incidenceList=el('roomIncidenceList');
  incidenceList.replaceChildren();
  for(const i of delivered.slice(-8).reverse()) {
    const li=document.createElement('li');
    const name=document.createElement('span');
    name.textContent=(channelNames[i.transducerId]??i.transducerId)+
      ' · '+num(i.measurement)+' '+(unitNames[i.transducerId]??'');
    const time=document.createElement('span');
    time.textContent=clock(i.arrivedAtMs);
    li.append(name,time);
    incidenceList.append(li);
  }
  if(!delivered.length){
    const li=document.createElement('li');
    li.textContent='Nenhuma incidência entregue até este instante.';
    incidenceList.append(li);
  }

  const events=el('roomEvents');
  events.replaceChildren();
  for(const e of scene.world.eventsThrough(tMs).slice(-5).reverse()){
    const row=document.createElement('li');
    const name=document.createElement('span');
    name.textContent=(eventNames[e.type]??e.type)+
      ' · '+(e.stateOn?'acesa':'apagada');
    const stamp=document.createElement('span');
    stamp.textContent=clock(e.timeMs);
    row.append(name,stamp);events.append(row);
  }
  setAttribute('chartCursor','x1',laneX(tMs).toFixed(2));
  setAttribute('chartCursor','x2',laneX(tMs).toFixed(2));
  drawLanes();
  if(!propagation)drawMesh();
}

function drawDayChart(){
  const samples=[];
  for(let t=0;t<=DAY_MS;t+=900000) {
    samples.push({
      t,value:scene.world.floorIrradianceAt(t,.65,.7),
    });
  }
  const maximum=Math.max(1,...samples.map(s=>s.value));
  const points=samples.map(s=>{
    const y=145-135*s.value/maximum;
    return laneX(s.t).toFixed(2)+','+y.toFixed(2);
  }).join(' ');
  setAttribute('daylightCurve','points',points);
}

// ---------------------------------------------------------------- lanes
const laneColors={world:'#e8a04c',observed:'#8a93a6',delivered:'#3fb8a9',engine:'#f5c26b'};
const laneShort={world:'Mundo · pesquisador',observed:'Amostras emitidas',
  delivered:'Entregas ao motor',engine:'Eventos do motor'};
function drawLanes(){
  const svg=el('laneChart');
  if(!scene || typeof svg.replaceChildren!=='function')return;
  const h=horizonMs();
  const lanes=timelineModel({incidences:result.incidences,trace:result.trace??[],
    worldEvents:scene.world.eventsThrough(h),horizonMs:h});
  const nodes=[];
  const end=scene.endTimeMs;
  // Region that has NOT been executed is shaded, never filled with data.
  if(h<end)nodes.push(svgNode('rect',{x:laneX(h),y:0,width:Math.max(0,laneX(end)-laneX(h)),
    height:140,fill:'#ffffff',opacity:.04}));
  if(h<end)nodes.push(svgNode('text',{x:Math.min(laneX(h)+6,700),y:136,fill:'#8a93a6','font-size':10},'não executado'));
  lanes.forEach((lane,k)=>{
    const y0=8+k*32,y1=y0+20;
    nodes.push(svgNode('text',{x:4,y:y0+14,fill:laneColors[lane.id],'font-size':11},laneShort[lane.id]));
    nodes.push(svgNode('line',{x1:160,x2:760,y1:y1,y2:y1,stroke:'#262c38'}));
    const d=lane.items.map(it=>'M'+laneX(it.timeMs).toFixed(2)+' '+y0+'V'+y1).join('');
    if(d)nodes.push(svgNode('path',{d,stroke:laneColors[lane.id],'stroke-width':1.2,opacity:.85}));
  });
  nodes.push(svgNode('line',{x1:laneX(tMs),x2:laneX(tMs),y1:0,y2:140,stroke:'#5b8def','stroke-width':1.5,'stroke-dasharray':'4 4'}));
  svg.replaceChildren(...nodes.filter(Boolean));
}
el('laneChart').addEventListener('click',event=>{
  const svg=el('laneChart');
  if(!scene||typeof svg.getBoundingClientRect!=='function')return;
  const box=svg.getBoundingClientRect();
  const x=(event.clientX-box.left)*760/box.width;
  if(x<160)return;
  stop();redraw((x-160)/600*DAY_MS);
});

// ---------------------------------------------------------------- domain (3-D)
// Read-only 3-D projection of the investigated domain. Positions come from
// domainLayout(): recorded afferent provenance + recorded co-activity. The
// camera, zoom and focus never touch the run.
const canvas=el('meshView');
const ctx=typeof canvas.getContext==='function'?canvas.getContext('2d'):null;
const CAMERA0=Object.freeze({yaw:-0.7,pitch:0.62,dist:3.3,tx:0,ty:0,tz:0.45});
let cam={...CAMERA0},meshGeometry=null,selection=null,propagation=null;
let layoutCache={key:null,layout:null};
const CHANNEL_COLORS=Object.freeze({r0:'#f2d27a',r1:'#d9a05b',r2:'#b48ead',
  r3:'#e06c6c',r4:'#8fbcbb',r5:'#a3be8c'});
const channelColor=c=>CHANNEL_COLORS[c]??'#8a93a6';

function firings(){
  const trace=result.trace??[];
  if(firingCache.length!==trace.length)
    firingCache={length:trace.length,firings:firingsFromTrace(trace)};
  return firingCache.firings;
}
function snapshotAt(t){
  let at=null,prev=null;
  for(const entry of snapHistory){
    if(entry.t<=t){prev=at;at=entry;}else break;
  }
  return {at,prev};
}
function currentMesh(t){
  if(mode==='recorded'||engineKind==='diagnostic')
    return {model:meshModel(null),capturedAt:null};
  const {at,prev}=snapshotAt(t);
  if(!at)return {model:meshModel(null),capturedAt:null};
  return {model:meshModel(at.snapshot,prev?.snapshot??null),capturedAt:at.t};
}
// Layout is recomputed per executed block (not per frame), so positions do
// not jitter during playback and never use data after the cursor's block.
function currentLayout(model,capturedAt,t){
  const key=engineKind+'|'+capturedAt+'|'+Math.floor(t/RUN_STEP_MS)+'|'+(result.trace?.length??0);
  if(layoutCache.key!==key){
    layoutCache={key,layout:domainLayout({model,firings:firings(),
      incidences:result.incidences,transducerNodes:ROOM_NODES,
      channels:NODE_CHANNEL,timeMs:t})};
  }
  return layoutCache.layout;
}
function heatColor(a){
  const t=Math.min(1,a);
  const stops=[[58,36,20],[201,121,47],[245,194,107],[255,243,196]];
  const x=t*3,k=Math.min(2,Math.floor(x)),f=x-k;
  const c=stops[k].map((v,i)=>Math.round(v+(stops[k+1][i]-v)*f));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}
const edgeStyles={
  [LIFECYCLE.PRUNING]:{c:'#c46a45',dash:[6,5],a:.9},
  [LIFECYCLE.CONSOLIDATED]:{c:'#e8a04c',dash:[],a:1},
  [LIFECYCLE.STRONG]:{c:'#5b8def',dash:[],a:1},
  [LIFECYCLE.WEAK]:{c:'#3fb8a9',dash:[2,4],a:.75},
};
const lifecycleNames={weak:'nova ou fraca',strong:'forte',consolidated:'consolidada',pruning:'candidata à poda'};

function project3(p,w,h){
  const x=p.x-cam.tx,y=p.y-cam.ty,z=p.z-cam.tz;
  const cy=Math.cos(cam.yaw),sy=Math.sin(cam.yaw);
  const x1=x*cy-y*sy,y1=x*sy+y*cy;
  const cp=Math.cos(cam.pitch),sp=Math.sin(cam.pitch);
  const y2=y1*cp-z*sp,z2=y1*sp+z*cp;
  const depth=cam.dist+y2;
  const f=Math.min(w,h)*0.95/Math.max(0.15,depth);
  return {x:w/2+x1*f,y:h/2-z2*f,depth,f};
}
function lerp3(a,b,u){return {x:a.x+(b.x-a.x)*u,y:a.y+(b.y-a.y)*u,z:a.z+(b.z-a.z)*u};}
function hexAlpha(hex,a){
  const n=parseInt(hex.slice(1),16);
  return `rgba(${n>>16&255},${n>>8&255},${n&255},${a})`;
}

function drawMesh(){
  const t=propagation?propagation.t:tMs;
  const {model,capturedAt}=currentMesh(t);
  const empty=model.kind==='empty';
  el('meshEmpty').hidden=!empty;
  if(empty){
    el('meshEmpty').textContent=mode==='recorded'
      ?'Registro do motor diagnóstico: não há malha a exibir. Nenhum nó ou relação é inventado.'
      :engineKind==='diagnostic'
        ?'Não exibimos uma malha que não existe. O motor diagnóstico não constitui unidades nem relações; ele apenas registra as incidências que recebe.'
        :'O motor ainda não registrou estado.';
  }
  setText('unitCount',String(model.constitutedUnits));
  setText('nodeCount',String(model.nodeCount));
  setText('relationCount',String(model.relations.length));
  const layout=empty?null:currentLayout(model,capturedAt,t);
  setText('meshCaption',empty?(engineKind==='diagnostic'||mode==='recorded'
    ?'motor diagnóstico · sem estrutura relacional':'sem estado registrado')
    :'controle TEMPO · estado capturado em '+clock(capturedAt)+
      ' · '+model.newCount+' nova(s), '+model.removedCount+' removida(s) no bloco · '+
      layout.clusters.length+' agrupamento(s) operacional(is)');
  meshGeometry=null;
  if(!ctx){if(layout)meshGeometry={layout,model,projNodes:[],projEdges:[],clusters:[]};return;}
  const r=globalThis.devicePixelRatio||1,w=canvas.clientWidth||600,h=canvas.clientHeight||340;
  if(canvas.width!==w*r||canvas.height!==h*r){canvas.width=w*r;canvas.height=h*r;}
  ctx.setTransform(r,0,0,r,0,0);ctx.clearRect(0,0,w,h);
  if(empty)return;
  const P=p=>project3(p,w,h);
  const zoomedIn=cam.dist<2.4;

  // ground ring (z = 0): transduction channels
  ctx.strokeStyle='#262c38';ctx.lineWidth=1;ctx.beginPath();
  for(let k=0;k<=72;k++){const a=2*Math.PI*k/72,q=P({x:Math.cos(a),y:Math.sin(a),z:0});
    k?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y);}
  ctx.stroke();
  for(const level of [1,2]){
    ctx.strokeStyle='rgba(38,44,56,.45)';ctx.setLineDash([2,6]);ctx.beginPath();
    for(let k=0;k<=72;k++){const a=2*Math.PI*k/72,q=P({x:.55*Math.cos(a),y:.55*Math.sin(a),z:.9*level});
      k?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y);}
    ctx.stroke();ctx.setLineDash([]);
  }
  const anchors=layout.anchors.map(a=>({...a,q:P(a)}));
  // afferent provenance (recorded): anchor -> node
  const nodeP=layout.nodes.map(n=>({...n,q:P(n)}));
  for(const n of nodeP)n.profile.forEach((wgt,c)=>{
    if(wgt<.15)return;
    const a=anchors[c];
    ctx.strokeStyle=hexAlpha(channelColor(a.channel),.18+.35*wgt);ctx.setLineDash([3,5]);ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(a.q.x,a.q.y);ctx.lineTo(n.q.x,n.q.y);ctx.stroke();ctx.setLineDash([]);
  });
  for(const a of anchors){
    const s=5;ctx.fillStyle=channelColor(a.channel);
    ctx.beginPath();ctx.moveTo(a.q.x,a.q.y-s);ctx.lineTo(a.q.x+s,a.q.y);ctx.lineTo(a.q.x,a.q.y+s);ctx.lineTo(a.q.x-s,a.q.y);ctx.fill();
    ctx.fillStyle='#8a93a6';ctx.font='10px system-ui';
    ctx.fillText(a.channel+(zoomedIn?' · '+(channelNames[a.channel]??''):''),a.q.x+7,a.q.y+3);
  }
  // cluster halos
  const clusters=layout.clusters.map(cl=>{
    const q=P(cl.centroid),rad=Math.max(14,cl.radius*q.f);
    const col=channelColor(cl.dominantChannel);
    ctx.fillStyle=hexAlpha(col,.07);ctx.strokeStyle=hexAlpha(col,selection?.kind==='cluster'&&selection.id===cl.id?.8:.35);
    ctx.lineWidth=1;ctx.beginPath();ctx.arc(q.x,q.y,rad,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.fillStyle=hexAlpha(col,.85);ctx.font='600 10px system-ui';
    ctx.fillText('A'+(cl.id+1),q.x+rad*.72,q.y-rad*.72);
    return {id:cl.id,x:q.x,y:q.y,r:rad};
  });
  // activity glow
  const fs=firings();
  const act=activityAt(fs,model.nodeCount,t,propagation?200:ACTIVITY_WINDOW_MS);
  ctx.globalCompositeOperation='lighter';
  nodeP.forEach(n=>{
    const a=act[n.index];if(a<.02)return;
    const rad=(26+30*a)*n.q.f/300;
    const g=ctx.createRadialGradient(n.q.x,n.q.y,0,n.q.x,n.q.y,rad);
    g.addColorStop(0,heatColor(a));g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.globalAlpha=.55;ctx.fillStyle=g;ctx.beginPath();ctx.arc(n.q.x,n.q.y,rad,0,Math.PI*2);ctx.fill();
  });
  ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;
  // relations, far to near
  const edges=model.relations.map(rel=>{
    const a=layout.nodes[rel.source],b=layout.nodes[rel.target];
    return {rel,a,b,qa:P(a),qb:P(b)};
  }).sort((u,v)=>(v.qa.depth+v.qb.depth)-(u.qa.depth+u.qb.depth));
  const projEdges=[];
  for(const e of edges){
    const {rel}=e,st=edgeStyles[rel.lifecycle];
    const selected=selection?.kind==='relation'&&selection.key===rel.key;
    ctx.strokeStyle=st.c;ctx.globalAlpha=st.a;ctx.setLineDash(st.dash);
    ctx.lineWidth=(1+2.2*Math.min(rel.weight,1.2)/1.2)*(e.qa.f+e.qb.f)/600+(selected?1.5:0);
    ctx.beginPath();ctx.moveTo(e.qa.x,e.qa.y);ctx.lineTo(e.qb.x,e.qb.y);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle=st.c;
    const fj=rel.delaySourceMs/(rel.delaySourceMs+rel.delayTargetMs);
    const j=P(lerp3(e.a,e.b,fj));ctx.beginPath();ctx.arc(j.x,j.y,2.4,0,Math.PI*2);ctx.fill();
    const tip=P(lerp3(e.a,e.b,.86)),ang=Math.atan2(e.qb.y-tip.y,e.qb.x-tip.x),s=7;
    ctx.beginPath();ctx.moveTo(tip.x+Math.cos(ang)*s,tip.y+Math.sin(ang)*s);
    ctx.lineTo(tip.x+Math.cos(ang+2.5)*s,tip.y+Math.sin(ang+2.5)*s);
    ctx.lineTo(tip.x+Math.cos(ang-2.5)*s,tip.y+Math.sin(ang-2.5)*s);ctx.fill();
    if(rel.isNew){ctx.strokeStyle='#fff3c4';ctx.lineWidth=1;ctx.globalAlpha=.9;
      const m=P(lerp3(e.a,e.b,.5));ctx.beginPath();ctx.arc(m.x,m.y,7,0,Math.PI*2);ctx.stroke();}
    ctx.globalAlpha=1;
    if(zoomedIn||selected){
      const m=P(lerp3(e.a,e.b,.5));ctx.fillStyle='#d9dde6';ctx.font='10px system-ui';
      ctx.fillText(num(rel.traversalMs)+' ms',m.x+5,m.y-5);
    }
    projEdges.push({key:rel.key,x1:e.qa.x,y1:e.qa.y,x2:e.qb.x,y2:e.qb.y});
  }
  // propagation: recorded firing time + recorded traversal time only
  if(propagation){
    for(const p of propagationAt(propagation.firings,model.relations,t)){
      const rel=model.relations.find(x=>x.key===p.key);if(!rel)continue;
      const q=P(lerp3(layout.nodes[rel.source],layout.nodes[rel.target],p.fraction));
      ctx.fillStyle='#fff3c4';ctx.shadowColor='#f5c26b';ctx.shadowBlur=10;
      ctx.beginPath();ctx.arc(q.x,q.y,4,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
    }
  }
  // nodes, far to near
  const projNodes=[];
  [...nodeP].sort((u,v)=>v.q.depth-u.q.depth).forEach(n=>{
    const a=act[n.index],selected=selection?.kind==='node'&&selection.index===n.index;
    const rad=Math.max(3,(selected?10:7.5)*n.q.f/300);
    ctx.fillStyle=a>.15?heatColor(a):'#5c6578';
    ctx.strokeStyle=channelColor(n.dominantChannel);ctx.lineWidth=n.dominantChannel?2:0;
    ctx.beginPath();ctx.arc(n.q.x,n.q.y,rad,0,Math.PI*2);ctx.fill();if(n.dominantChannel)ctx.stroke();
    ctx.fillStyle='#d9dde6';ctx.font='600 11px system-ui';
    ctx.fillText(NODE_CHANNEL[n.index]??String(n.index),n.q.x+rad+3,n.q.y-rad);
    projNodes.push({index:n.index,x:n.q.x,y:n.q.y,r:rad});
  });
  meshGeometry={layout,model,projNodes,projEdges,clusters};
}

function segDist(px,py,e){
  const dx=e.x2-e.x1,dy=e.y2-e.y1,l2=dx*dx+dy*dy||1;
  const u=Math.max(0,Math.min(1,((px-e.x1)*dx+(py-e.y1)*dy)/l2));
  return Math.hypot(px-(e.x1+u*dx),py-(e.y1+u*dy));
}
function hitTest(px,py){
  if(!meshGeometry)return null;
  const node=meshGeometry.projNodes.find(n=>Math.hypot(n.x-px,n.y-py)<n.r+5);
  if(node)return {kind:'node',index:node.index};
  const edge=meshGeometry.projEdges.find(e=>segDist(px,py,e)<6);
  if(edge)return {kind:'relation',key:edge.key};
  const cl=meshGeometry.clusters.find(c=>Math.hypot(c.x-px,c.y-py)<c.r);
  if(cl)return {kind:'cluster',id:cl.id};
  return null;
}
function inspectAt(px,py){selection=hitTest(px,py);describeSelection();drawMesh();}
function focusAt(px,py){
  const hit=hitTest(px,py);if(!hit||!meshGeometry)return;
  const L=meshGeometry.layout;
  const target=hit.kind==='node'?L.nodes[hit.index]:hit.kind==='cluster'?L.clusters[hit.id].centroid:null;
  if(!target)return;
  selection=hit;describeSelection();
  const from={...cam},to={...cam,tx:target.x,ty:target.y,tz:target.z,dist:Math.min(cam.dist,1.7)};
  let k=0;const steps=18;
  const timer=setInterval(()=>{k++;const u=k/steps,s=u*u*(3-2*u);
    for(const key of ['tx','ty','tz','dist'])cam[key]=from[key]+(to[key]-from[key])*s;
    drawMesh();if(k>=steps)clearInterval(timer);},16);
}
function describeSelection(){
  const box=el('meshInspect');
  if(!selection||!meshGeometry){box.textContent='Toque em um nó, relação ou agrupamento para inspecionar o que o motor registrou. Duplo toque aproxima.';return;}
  const {model,layout}=meshGeometry;
  const provenance=p=>p.map((v,c)=>[NODE_CHANNEL[c],v]).filter(([,v])=>v>.05)
    .map(([c,v])=>c+' '+Math.round(100*v*v/p.reduce((s,x)=>s+x*x,0))+'%').join(', ')||'nenhuma registrada';
  if(selection.kind==='node'){
    const k=selection.index,channel=NODE_CHANNEL[k],L=layout.nodes[k];
    const fs=firings().filter(f=>f.node===k&&f.timeMs<=tMs);
    const lastFire=fs[fs.length-1];
    const inc=model.relations.filter(r=>r.target===k).length;
    const out=model.relations.filter(r=>r.source===k).length;
    let cause='—';
    if(lastFire){
      const c=firingCause(lastFire,result.incidences,ROOM_NODES);
      cause=c.kind==='forced'
        ?'forçado pela incidência '+c.incidenceId+' ('+c.transducerId+')'
        :'chegada interna por relação — o motor não registra qual relação';
    }
    box.textContent='Nó '+k+' · predefinido para '+channel+' ('+(channelNames[channel]??'')+') · nível '+L.level+
      (L.cluster>=0?' · agrupamento A'+(L.cluster+1):'')+'\n'+
      'Disparos até '+clock(tMs)+': '+fs.length+(lastFire?' · último em '+preciseClock(lastFire.timeMs):'')+'\n'+
      'Causa do último disparo: '+cause+'\n'+
      'Proveniência aferente registrada: '+provenance(L.profile)+'\n'+
      'Relações: '+inc+' de entrada, '+out+' de saída. Não é unidade constituída.';
  }else if(selection.kind==='relation'){
    const rel=model.relations.find(r=>r.key===selection.key);
    if(!rel){selection=null;describeSelection();return;}
    box.textContent='Relação '+NODE_CHANNEL[rel.source]+' → '+NODE_CHANNEL[rel.target]+' · '+lifecycleNames[rel.lifecycle]+(rel.isNew?' · surgiu neste bloco':'')+'\n'+
      'Peso '+rel.weight.toFixed(3)+' · percorrimento '+rel.traversalMs.toFixed(2)+' ms ('+
      rel.delaySourceMs.toFixed(2)+' + '+rel.delayTargetMs.toFixed(2)+' ms)\n'+
      'Valores do estado capturado ao fim do bloco ≤ cursor.';
  }else{
    const cl=layout.clusters[selection.id];
    if(!cl){selection=null;describeSelection();return;}
    box.textContent='Agrupamento operacional A'+(cl.id+1)+' · '+cl.members.length+' nó(s): '+
      cl.members.map(m=>NODE_CHANNEL[m]).join(', ')+'\n'+
      'Canal aferente dominante: '+(cl.dominantChannel?cl.dominantChannel+' ('+(channelNames[cl.dominantChannel]??'')+')':'—')+'\n'+
      'Critério: distância operacional < '+layout.clusterThreshold+' (proveniência aferente + coatividade registradas). Não é categoria nem representação.';
  }
}
function zoom(f){cam.dist=Math.min(8,Math.max(.6,cam.dist/f));drawMesh();}
el('meshIn').addEventListener('click',()=>zoom(1.25));
el('meshOut').addEventListener('click',()=>zoom(1/1.25));
el('meshFit').addEventListener('click',()=>{cam={...CAMERA0};selection=null;describeSelection();drawMesh();});
canvas.addEventListener('wheel',e=>{e.preventDefault();zoom(e.deltaY<0?1.1:1/1.1);},{passive:false});
canvas.addEventListener('dblclick',e=>{
  if(typeof canvas.getBoundingClientRect!=='function')return;
  const b=canvas.getBoundingClientRect();focusAt(e.clientX-b.left,e.clientY-b.top);
});
{
  const touches=new Map();let pinch0=null,last=null,moved=false,panMode=false,lastTap=0;
  canvas.addEventListener('pointerdown',e=>{
    canvas.setPointerCapture?.(e.pointerId);touches.set(e.pointerId,[e.clientX,e.clientY]);
    moved=false;panMode=e.shiftKey||e.button===2;last=[e.clientX,e.clientY];
  });
  canvas.addEventListener('pointermove',e=>{
    if(!touches.has(e.pointerId))return;
    touches.set(e.pointerId,[e.clientX,e.clientY]);
    const pts=[...touches.values()];
    if(pts.length===2){
      const dist=Math.hypot(pts[0][0]-pts[1][0],pts[0][1]-pts[1][1]);
      if(pinch0)zoom(dist/pinch0);pinch0=dist;moved=true;return;
    }
    if(!last)return;
    const dx=e.clientX-last[0],dy=e.clientY-last[1];
    if(!moved&&Math.hypot(dx,dy)<4)return;
    moved=true;last=[e.clientX,e.clientY];
    if(panMode){
      const s=cam.dist/400,cy=Math.cos(cam.yaw),sy=Math.sin(cam.yaw);
      cam.tx-=(dx*cy)*s;cam.ty-=(-dx*sy)*s;cam.tz+=dy*s;
    }else{
      cam.yaw+=dx*0.01;cam.pitch=Math.max(0.05,Math.min(1.5,cam.pitch+dy*0.008));
    }
    drawMesh();
  });
  const end=e=>{
    if(touches.size===1&&!moved&&typeof canvas.getBoundingClientRect==='function'){
      const b=canvas.getBoundingClientRect(),x=e.clientX-b.left,y=e.clientY-b.top;
      const now=Date.now();
      if(e.pointerType==='touch'&&now-lastTap<300)focusAt(x,y);else inspectAt(x,y);
      lastTap=now;
    }
    touches.delete(e.pointerId);if(touches.size<2)pinch0=null;if(!touches.size)last=null;
  };
  canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);
  canvas.addEventListener('contextmenu',e=>e.preventDefault?.());
}
// Slow-motion view of ONE recorded firing: the clock below the mesh shows
// simulated milliseconds; particle positions come from the recorded firing
// time and the recorded traversal time of each relation. Engine untouched.
el('meshPropagate').addEventListener('click',()=>{
  if(propagation){clearInterval(propagation.timer);propagation=null;drawMesh();setText('meshClock','');return;}
  const fs=firings().filter(f=>f.timeMs<=tMs);
  const {model}=currentMesh(tMs);
  // Selected node if any; otherwise the latest recorded firing whose node has
  // outgoing relations in the captured state (so something can propagate).
  const hasOut=new Set(model.relations.map(r=>r.source));
  const candidates=selection?.kind==='node'?fs.filter(f=>f.node===selection.index):
    fs.filter(f=>hasOut.has(f.node));
  const lastFire=candidates[candidates.length-1];
  if(!lastFire||model.kind==='empty'){
    el('meshInspect').textContent=model.kind==='empty'
      ?'Este motor não registra disparos nem relações.'
      :'Nenhum disparo registrado até '+clock(tMs)+(selection?.kind==='node'?' neste nó.':' em nó com relações de saída.');
    return;
  }
  const outgoing=model.relations.filter(r=>r.source===lastFire.node);
  const span=Math.max(20,...outgoing.map(r=>r.traversalMs))+10;
  const window=fs.filter(f=>f.timeMs>=lastFire.timeMs-span&&f.timeMs<=lastFire.timeMs);
  const start=lastFire.timeMs-2,stopAt=lastFire.timeMs+span,steps=90;
  let k=0;
  stop();
  propagation={t:start,firings:window,timer:setInterval(()=>{
    k++;propagation.t=start+(stopAt-start)*k/steps;
    setText('meshClock','câmera lenta · '+preciseClock(propagation.t)+' (tempo simulado)');
    drawMesh();
    if(k>=steps){clearInterval(propagation.timer);propagation=null;setText('meshClock','');drawMesh();}
  },33)};
  el('meshInspect').textContent='Propagação a partir do disparo do nó '+lastFire.node+' ('+NODE_CHANNEL[lastFire.node]+') em '+preciseClock(lastFire.timeMs)+'. '+
    outgoing.length+' relação(ões) de saída no estado capturado; as posições usam somente tempos registrados.';
});

// ---------------------------------------------------------------- prepare
function makeEngine(kind,seed){
  if(kind==='tempo-fixed')
    return new TempoFixedNodesControl({nodeCount:NODE_CHANNEL.length,transducerNodes:ROOM_NODES,seed});
  return new DiagnosticEngine();
}
function preparedOptions(){
  const modalities=[...sensors].filter(x=>x.checked).map(x=>x.value);
  const seed=Number(el('roomSeed').value||42);
  if(!Number.isInteger(seed)||seed<0||seed>0xffffffff)
    throw new RangeError('A semente deve ser um inteiro entre 0 e 4294967295');
  const hours=Number(el('roomHorizon').value||24);
  return {
    modalities,
    weatherPreset:el('roomWeather').value,
    worldOptions:{
      date:el('roomDate').value,
      opaqueObjectEnabled:el('roomObstacle').checked,
    },
    seed,
    endTimeMs:hours>=24?DAY_MS-1:hours*3600000,
  };
}
function restart() {
  stop();
  stopRunTimer();
  if(propagation){clearInterval(propagation.timer);propagation=null;}
  try{
    currentOptions=preparedOptions();
    engineKind=el('roomEngine').value||'diagnostic';
    const maxEvents=Number(el('roomMaxEvents').value||100000);
    currentRecord=null;selection=null;
    scene=createRoomScenario(currentOptions);
    // Prepare only: nothing is executed until the researcher starts the run.
    controller=new ExecutionController({...createRoomScenario(currentOptions),
      engine:makeEngine(engineKind,currentOptions.seed),maxEvents});
    result={manifest:controller.manifest(),incidences:[],trace:[]};
    snapHistory=[{t:0,snapshot:controller.engineSnapshot()}];
    mode='prepared';
    drawGeometry(scene.world.describe().geometry);
    drawDayChart();
    el('roomTimeline').max=String(scene.endTimeMs);
    setText('roomStatus','Cenário preparado · motor ainda não executado');
    setText('roomEngineNote',engineNotes[engineKind]);
    setText('roomVersion',EMERGENCE_VERSION);
    setText('roomManifest',JSON.stringify(result.manifest,null,2));
    showMode();
    redraw(0);
    renderAudit();
  }catch(error){
    setText('roomStatus','Erro na preparação: '+error.message);
    throw error;
  }
}

el('roomRun').addEventListener('click',()=>{
  if(!controller||mode==='recorded'||mode==='completed')return;
  stop();
  if(mode==='running'){pauseExecution('pesquisador');return;}
  if(mode==='prepared')controller.start();
  else controller.resume();
  pullExecuted();showMode();renderAudit();
  runTimer=setInterval(executeTick,90);
});
el('roomRunAll').addEventListener('click',()=>{
  if(!controller||mode==='recorded'||mode==='completed')return;
  stop();stopRunTimer();
  if(controller.state==='prepared')controller.start();
  else if(controller.state==='paused')controller.resume();
  // Executed block by block so that the mesh state is captured per block.
  while(controller.state==='running'){controller.advanceBy(RUN_STEP_MS);pullExecuted();}
  setText('roomStatus',statusText());
  showMode();
  redraw(tMs);
  renderAudit();
});
// Visual playback of the ALREADY EXECUTED history; it never advances the engine.
el('roomPlay').addEventListener('click',()=>{
  if(playback!==null){stop();return;}
  if(mode==='running')return; // live execution already drives the view
  if(tMs>=horizonMs())redraw(0);
  setText('roomPlay','Parar reprodução');
  playback=setInterval(()=>{
    redraw(tMs+600000); // Ten simulated minutes per visual tick.
    if(tMs>=horizonMs())stop();
  },75);
  showMode();
});
el('roomStep').addEventListener('click',()=>{
  stop();redraw(tMs+1800000);
});
el('roomTimeline').addEventListener('input',()=>{
  stop();redraw(Number(el('roomTimeline').value));
});
for(const id of ['roomDate','roomWeather','roomObstacle','roomEngine','roomSeed','roomHorizon','roomMaxEvents'])
  el(id).addEventListener('change',restart);
for(const m of sensors)m.addEventListener('change',restart);

// ---------------------------------------------------------------- analyse
function registerRun(){
  const run={
    id:'E'+(++runCounter),
    engineKind,
    options:clone(currentOptions),
    hypothesis:el('roomHypothesis').value??'',
    comparator:el('roomComparator').value||null,
    result:clone(result),
    controlLog:controller.controlLog(),
    manifestSha256:null,
  };
  runs.push(run);
  refreshAnalysis();
  if(run.comparator){
    el('cmpA').value=run.comparator;el('cmpB').value=run.id;renderComparison();
  }
  manifestDigest(run.result.manifest).then(h=>{run.manifestSha256=h;refreshAnalysis();})
    .catch(()=>{});
}
function fillSelect(select,placeholder){
  const keep=select.value;
  select.replaceChildren();
  if(placeholder!==null){
    const o=document.createElement('option');o.value='';o.textContent=placeholder;select.append(o);
  }
  for(const run of runs){
    const o=document.createElement('option');o.value=run.id;
    o.textContent=run.id+' · '+(run.engineKind==='diagnostic'?'diagnóstico':'controle TEMPO')+
      ' · '+(run.options.modalities.join('+')||'sem transdutores')+' · semente '+run.options.seed;
    select.append(o);
  }
  if(keep&&runs.some(r=>r.id===keep))select.value=keep;
}
function refreshAnalysis(){
  el('analysisEmpty').hidden=runs.length>0;
  const body=el('runTable');body.replaceChildren();
  for(const run of runs){
    const m=metricsRow(run),tr=document.createElement('tr');
    for(const v of [m.run,m.engine,m.modalities,m.weather,m.date,m.seed,m.delivered,
      m.engineEvents,m.relations,m.manifestSha256?m.manifestSha256.slice(0,12)+'…':'calculando…']){
      const td=document.createElement('td');td.textContent=String(v);tr.append(td);
    }
    body.append(tr);
  }
  fillSelect(el('cmpA'),null);fillSelect(el('cmpB'),null);
  fillSelect(el('roomComparator'),'Nenhuma execução anterior');
  if(runs.length>=2&&!el('cmpB').value)el('cmpB').value=runs[runs.length-1].id;
}
function renderComparison(){
  const out=el('cmpOut');out.replaceChildren();
  const a=runs.find(r=>r.id===el('cmpA').value),b=runs.find(r=>r.id===el('cmpB').value);
  const p=(text,cls)=>{const n=document.createElement('p');n.textContent=text;if(cls)n.className=cls;out.append(n);return n;};
  if(!a||!b){p('Selecione duas execuções concluídas.');return;}
  const c=compareRuns(a,b);
  p(a.id+' × '+b.id+(c.identicalManifest?' · manifestos idênticos':' · '+c.manifestDifferences.length+' diferença(s) de manifesto'));
  if(c.isolatedChange)p('Mudança isolada (comparação do tipo ablação): '+c.isolatedChange,'ok');
  if(c.identicalManifest)p(c.identicalHistory?'Históricos idênticos: mesma definição produz o mesmo resultado (determinismo).':'DIVERGÊNCIA com manifesto idêntico.',c.identicalHistory?'ok':'bad');
  if(c.manifestDifferences.length){
    const ul=document.createElement('ul');
    for(const d of c.manifestDifferences.slice(0,12)){
      const li=document.createElement('li');li.textContent=d.path+': '+d.a+' → '+d.b;ul.append(li);
    }
    if(c.manifestDifferences.length>12){const li=document.createElement('li');li.textContent='… e mais '+(c.manifestDifferences.length-12);ul.append(li);}
    out.append(ul);
  }
  p('Variação (B − A): '+Object.entries(c.summaryDelta).map(([k,v])=>k+' '+(v>0?'+':'')+v).join(' · '));
  p(c.firstIncidenceDivergence
    ?'Primeira incidência divergente: posição '+c.firstIncidenceDivergence.index+
      ' (A: '+(c.firstIncidenceDivergence.a?.incidenceId??'nenhuma')+' em '+(c.firstIncidenceDivergence.a?preciseClock(c.firstIncidenceDivergence.a.arrivedAtMs):'—')+
      '; B: '+(c.firstIncidenceDivergence.b?.incidenceId??'nenhuma')+' em '+(c.firstIncidenceDivergence.b?preciseClock(c.firstIncidenceDivergence.b.arrivedAtMs):'—')+')'
    :'Incidências entregues idênticas.');
  for(const run of [a,b])if(run.hypothesis)p('Hipótese registrada em '+run.id+': '+run.hypothesis);
}
el('cmpRun').addEventListener('click',renderComparison);
function download(bytes,type,name){
  const blob=new Blob([bytes],{type});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;a.download=name;a.click();
  setTimeout(()=>URL.revokeObjectURL(url),500);
}
el('exportCsv').addEventListener('click',()=>{
  if(!runs.length){setText('analysisEmpty','Nenhuma execução concluída para exportar.');el('analysisEmpty').hidden=false;return;}
  download(metricsCsv(runs),'text/csv;charset=utf-8','emergence-execucoes.csv');
});

// ---------------------------------------------------------------- audit
function renderAudit(){
  if(!controller||el('panelAudit').hidden)return;
  const body=el('controlLog');body.replaceChildren();
  for(const e of controller.controlLog().slice(-200).reverse()){
    const tr=document.createElement('tr');
    const cells=[e.order,e.command,e.accepted?'sim':'recusado',e.stateBefore,e.stateAfter,
      preciseClock(e.executedThroughMs),e.processedEvents,
      e.detail?JSON.stringify(e.detail):''];
    cells.forEach((v,k)=>{const td=document.createElement('td');td.textContent=String(v);
      if(k===2)td.className=e.accepted?'ok':'bad';tr.append(td);});
    body.append(tr);
  }
  setText('auditManifest',JSON.stringify(result?.manifest??null,null,2));
}

// Explicit operation modes: save, recorded playback and scientific
// reexecution/resume have different meanings and report distinct outcomes.
function archiveMessage(message){setText('roomArchiveStatus',message);}
function recordForCurrent(){
  if(currentRecord)return currentRecord;
  if(!currentOptions)throw new Error('No active physical experiment');
  if(engineKind!=='diagnostic')
    throw new Error('replicação, checkpoint e pacote ZIP estão implementados apenas para o motor diagnóstico; o controle TEMPO ainda não tem contrato de checkpoint');
  return buildRoomRecord(currentOptions);
}
async function guardedArchiveAction(work){
  try{await work();}
  catch(error){
    archiveMessage('Operação não concluída: '+error.message);
    return false;
  }
  return true;
}
async function refreshRunList(){
  if(!db)return;
  const list=await db.listRuns();
  const select=el('roomRecordList');
  select.replaceChildren();
  const empty=document.createElement('option');
  empty.value='';empty.textContent='Escolha uma execução salva';
  select.append(empty);
  for(const entry of list){
    const option=document.createElement('option');
    option.value=entry.id;
    option.textContent=new Date(entry.savedAt).toLocaleString('pt-BR')+
      ' · '+(entry.date??'sem data')+
      ' · '+entry.deliveredCount+' incidências';
    select.append(option);
  }
}
function displayRecorded(record){
  if(record.result.manifest.software.version!==EMERGENCE_VERSION) {
    throw new RangeError('A versão científica do arquivo difere da versão atual; '+
      'não é seguro reconstruir a cena com equações alteradas.');
  }
  stop();
  stopRunTimer();
  if(controller && controller.state==='running')controller.pause('registro aberto');
  mode='recorded';
  const options=record.scenario.options;
  currentOptions=structuredClone(options);
  currentRecord=structuredClone(record);
  const selected=new Set(options.modalities);
  for(const input of sensors)input.checked=selected.has(input.value);
  el('roomDate').value=options.worldOptions.date;
  el('roomWeather').value=options.weatherPreset;
  el('roomObstacle').checked=options.worldOptions.opaqueObjectEnabled;
  el('roomEngine').value='diagnostic';engineKind='diagnostic';
  el('roomSeed').value=String(options.seed??42);
  el('roomHorizon').value=(options.endTimeMs??DAY_MS-1)>=DAY_MS-1?'24':
    String(Math.round(options.endTimeMs/3600000));
  scene=createRoomScenario(options); // deterministic world for visualization
  const view=recordedPlayback(record);
  result={...view,trace:view.trace??record.result.trace??[],
    finalSnapshot:record.result.finalSnapshot};
  drawGeometry(scene.world.describe().geometry);
  drawDayChart();
  el('roomTimeline').max=String(scene.endTimeMs);
  setText('roomStatus',statusText());
  setText('roomManifest',JSON.stringify(result.manifest,null,2));
  showMode();
  redraw(0);
}
el('roomSave').addEventListener('click',()=>guardedArchiveAction(async()=>{
  if(!db)throw new Error('IndexedDB indisponível. Use Exportar ZIP.');
  const record=recordForCurrent();
  const id=globalThis.crypto.randomUUID();
  await db.saveRun({id,savedAt:Date.now(),record});
  await db.saveConfig({id:'current-room',scenario:record.scenario});
  await refreshRunList();
  el('roomRecordList').value=id;
  archiveMessage('Execução e checkpoint salvos localmente. Não foram enviados a servidor.');
}));
el('roomLoad').addEventListener('click',()=>guardedArchiveAction(async()=>{
  if(!db)throw new Error('IndexedDB indisponível');
  const id=el('roomRecordList').value;
  if(!id)throw new Error('Selecione uma execução salva');
  const stored=await db.loadRun(id);
  if(!stored)throw new Error('Registro não encontrado');
  displayRecorded(stored.record);
  archiveMessage('Histórico gravado aberto, sem recalcular o experimento.');
}));
el('roomVerify').addEventListener('click',()=>guardedArchiveAction(async()=>{
  const record=recordForCurrent();
  const verdict=independentlyReexecute(record);
  archiveMessage(verdict.equivalent
    ? 'Reexecução independente equivalente: manifesto e incidências coincidem integralmente.'
    : 'DIVERGÊNCIA na reexecução: '+JSON.stringify(verdict.firstDifference));
}));
el('roomResume').addEventListener('click',()=>guardedArchiveAction(async()=>{
  const record=recordForCurrent();
  const verdict=resumeSavedCheckpoint(record);
  archiveMessage(verdict.equivalent
    ? 'Checkpoint retomado com equivalência integral ao registro executado.'
    : 'DIVERGÊNCIA na retomada: '+JSON.stringify(verdict.firstDifference));
}));
el('exportRoom').addEventListener('click',()=>guardedArchiveAction(async()=>{
  const record=recordForCurrent();
  const bytes=await exportScientificArchive(record);
  download(bytes,'application/zip','emergence-room-'+record.scenario.options.worldOptions.date+'.zip');
  archiveMessage('Pacote ZIP científico exportado: JSON, CSV, eventos, checkpoint e SHA-256.');
}));
el('roomImport').addEventListener('click',()=>{
  el('roomImportFile').click();
});
el('roomImportFile').addEventListener('change',()=>guardedArchiveAction(async()=>{
  const input=el('roomImportFile');
  const file=input.files?.[0];
  if(!file)return;
  const bytes=new Uint8Array(await file.arrayBuffer());
  const record=await importScientificArchive(bytes);
  displayRecorded(record);
  archiveMessage('ZIP verificado (CRC32 e SHA-256); registro aberto apenas como histórico.');
  input.value='';
}));
openExperimentStore().then(async store=>{
  db=store;
  await refreshRunList();
  archiveMessage('Armazenamento local pronto. Checkpoints não saem deste dispositivo.');
}).catch(error=>{
  archiveMessage('Salvamento local indisponível: '+
    error.message+'. Exportar ZIP continua disponível.');
});

document.addEventListener('visibilitychange',()=>{
  if(document.hidden){stop();pauseExecution('página oculta');}
});
globalThis.addEventListener?.('resize',()=>drawMesh());
selectTab('Observe');
refreshAnalysis();
restart();

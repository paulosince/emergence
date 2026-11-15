import test from "node:test";
import assert from "node:assert/strict";
import {Engine} from "./engine.mjs";

function fixture({speedA=1,speedB=1,windowMs=0.25}={}) {
  const e=new Engine({windowMs,threshold:1.5});
  e.unit({id:"a",type:"Utrd",position:[0,0,0],thresholds:[0.5]});
  e.unit({id:"b",type:"Utrd",position:[0,2,0],thresholds:[0.5]});
  e.unit({id:"j",type:"Uint",position:[2,0,0]});
  e.path({id:"pa",from:"a",to:"j",speed:speedA,thresholdIndex:0});
  e.path({id:"pb",from:"b",to:"j",speed:speedB,thresholdIndex:0});
  return e;
}
test("não dispara com uma única origem",()=>{
  const e=fixture();e.input("a",0,1);e.run();
  assert.equal(e.log.filter(x=>x.kind==="fire").length,0);
});
test("duas origens, chegadas coincidentes, disparam",()=>{
  const e=fixture({speedB:Math.SQRT2});
  e.input("a",0,1);e.input("b",0,1);e.run();
  const fires=e.log.filter(x=>x.kind==="fire");
  assert.equal(fires.length,1);
  assert.deepEqual(new Set(fires[0].contributors.map(x=>x.origin)),new Set(["a","b"]));
});
test("duas origens fora da janela não disparam",()=>{
  const e=fixture();e.input("a",0,1);e.input("b",0,1);e.run();
  assert.equal(e.log.filter(x=>x.kind==="fire").length,0);
});
test("uma origem com duas Upros não simula duas origens",()=>{
  const e=fixture({speedB:Math.SQRT2});
  e.path({id:"pa2",from:"a",to:"j",speed:1,thresholdIndex:0});
  e.input("a",0,1);e.run();
  assert.equal(e.log.filter(x=>x.kind==="fire").length,0);
  assert.equal(e.log.filter(x=>x.kind==="travel").length,2);
});
test("intensidade recruta vias, sem escalar magnitude individual",()=>{
  const e=new Engine();
  e.unit({id:"a",type:"Utrd",position:[0,0,0],thresholds:[0.2,0.7]});
  e.unit({id:"j",type:"Uint",position:[1,0,0]});
  e.path({id:"p0",from:"a",to:"j",speed:1,thresholdIndex:0});
  e.path({id:"p1",from:"a",to:"j",speed:1,thresholdIndex:1});
  e.input("a",0,0.3);e.input("a",10,0.9);e.run();
  const travels=e.log.filter(x=>x.kind==="travel");
  assert.equal(travels.length,2);
  assert.deepEqual(travels.map(x=>x.magnitude),[1,1]);
});
test("alterar velocidade afeta chegada, não seleciona Upro",()=>{
  const e=fixture();
  e.input("a",0,1);e.run();
  const first=e.log.find(x=>x.kind==="travel");
  assert.equal(first.arrival,2);
  e.setSpeed("pa",2);
  e.input("a",3,0);e.input("a",4,1);e.run();
  const travels=e.log.filter(x=>x.kind==="travel"&&x.pid==="pa");
  assert.deepEqual(travels.map(x=>x.arrival),[2,5]);
});
test("mesma entrada e configuração são determinísticas",()=>{
  const go=()=>{const e=fixture({speedB:Math.SQRT2});e.input("a",0,1);e.input("b",0,1);return e.run();};
  assert.deepEqual(go(),go());
});
test("amostragem de 60 Hz não quantiza chegadas",()=>{
  const e=fixture({speedA:3});e.input("a",1000/60,1);e.run();
  const a=e.log.find(x=>x.kind==="arrival");
  assert.ok(Math.abs(a.time-(1000/60+2/3))<1e-9);
});
test("nenhum nó ou conexão é criado pela atividade",()=>{
  const e=fixture({speedB:Math.SQRT2});
  const before=[e.units.size,e.paths.size];
  e.input("a",0,1);e.input("b",0,1);e.run();
  assert.deepEqual([e.units.size,e.paths.size],before);
});

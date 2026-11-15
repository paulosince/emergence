// Estímulo exógeno simplificado: cena geométrica com esfera e cilindro.
// Os nomes das peças existem SOMENTE no gerador/observador, não no motor.
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const sub=(a,b)=>a.map((x,i)=>x-b[i]);
const add=(a,b)=>a.map((x,i)=>x+b[i]);
const mul=(a,s)=>a.map(x=>x*s);
const norm=a=>{const d=Math.hypot(...a);return a.map(x=>x/d);};
function sphere(origin,dir,center,r) {
  const oc=sub(origin,center), b=dot(oc,dir), c=dot(oc,oc)-r*r;
  const d=b*b-c;
  if(d<0)return Infinity;
  const t=-b-Math.sqrt(d);return t>0?t:Infinity;
}
function cylinder(origin,dir,center,r,z0,z1) {
  const ox=origin[0]-center[0], oy=origin[1]-center[1];
  const a=dir[0]**2+dir[1]**2;
  if(a<1e-12)return Infinity;
  const b=ox*dir[0]+oy*dir[1], c=ox*ox+oy*oy-r*r, d=b*b-a*c;
  if(d<0)return Infinity;
  for(const t of [(-b-Math.sqrt(d))/a,(-b+Math.sqrt(d))/a]) {
    const z=origin[2]+t*dir[2];
    if(t>0&&z>=z0&&z<=z1)return t;
  }
  return Infinity;
}
export function cameraFrame({eyeX=0,width=32,height=24,stem=true,stemShift=0,
  appleX=0,baselineZ=0,background=0.08}={}) {
  const pixels=new Float64Array(width*height);
  const origin=[eyeX,-4,1.4], focus=[0,0,1.0+baselineZ];
  const forward=norm(sub(focus,origin)),right=norm([forward[1],-forward[0],0]);
  const up=norm([0,0,1]); // aproximação: eixo vertical do sensor
  for(let y=0;y<height;y++)for(let x=0;x<width;x++) {
    const dx=((x+0.5)/width-0.5)*1.6;
    const dy=(0.5-(y+0.5)/height)*1.2;
    const dir=norm(add(add(forward,mul(right,dx)),mul(up,dy)));
    const apple=sphere(origin,dir,[appleX,0,0.9],0.55);
    const stalk=stem?cylinder(origin,dir,[appleX+stemShift,0,0],0.065,1.35,1.72):Infinity;
    // Intensidades físicas simplificadas; sem anotação de objeto por pixel.
    pixels[y*width+x]=stalk<apple?0.24:apple<Infinity?0.68:background;
  }
  return {width,height,pixels};
}
export function stereoFrames(opts={}) {
  const {baseline=0.16,...rest}=opts;
  return [cameraFrame({...rest,eyeX:-baseline/2}),cameraFrame({...rest,eyeX:baseline/2})];
}
export function injectStereo(engine,frames,time,ids) {
  if(frames.length!==2 || ids.length!==2)throw Error("estéreo exige duas câmeras");
  for(let c=0;c<2;c++) {
    const frame=frames[c];if(ids[c].length!==frame.pixels.length)throw Error("mapa Utrd incompleto");
    for(let k=0;k<frame.pixels.length;k++)engine.input(ids[c][k],time,frame.pixels[k]);
  }
}

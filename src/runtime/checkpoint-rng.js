// State-capturable equivalent of the pinned TEMPO mulberry32 generator.
// The upstream copy in vendor/tempo/ remains untouched. This generator is
// verified against the reference output at test time.
export function checkpointSensorRng(seed, transducerId, savedState = null) {
  if (!Number.isInteger(seed) || seed < 0 || seed > 0xffffffff ||
      typeof transducerId !== 'string' || !transducerId) {
    throw new RangeError('Invalid per-sensor random stream seed or ID');
  }
  let hash = (2166136261 ^ seed) >>> 0;
  for (let i=0;i<transducerId.length;i++)
    hash = Math.imul(hash ^ transducerId.charCodeAt(i),16777619) >>> 0;
  let a=(Math.imul(hash+1,2654435761)>>>0) || 0x9e3779b9;
  if(savedState!==null) {
    if(!Number.isInteger(savedState) || savedState<0 ||
       savedState>0xffffffff) throw new RangeError('Invalid captured RNG state');
    a=savedState;
  }
  const random=()=>{
    a=(a+0x6d2b79f5)|0;
    let t=Math.imul(a^(a>>>15),1|a);
    t=(t+Math.imul(t^(t>>>7),61|t))^t;
    return ((t^(t>>>14))>>>0)/4294967296;
  };
  const normal=()=>{
    let u=0;
    while(u===0)u=random();
    return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*random());
  };
  return Object.freeze({
    random,normal,
    uniform:(lo,hi)=>lo+(hi-lo)*random(),
    poisson:lam=>{
      const L=Math.exp(-lam);let k=0,p=1;
      do{k++;p*=random();}while(p>L);
      return k-1;
    },
    state:()=>a>>>0,
  });
}
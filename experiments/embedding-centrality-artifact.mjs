// Reproducible check used in docs/research-design-v0.1.md, section 5.
// Question: does a relation-based 3-D embedding (classical MDS of shortest-
// path distance) place high-degree nodes near the centre BY CONSTRUCTION?
// Compares preferential-attachment graphs, a degree-preserving rewired null
// and random geometric graphs over 20 seeds. Run: node experiments/embedding-centrality-artifact.mjs
// Does a relation-based 3-D embedding place high-degree nodes at the centre
// BY CONSTRUCTION? Compare a preferential-attachment graph with a degree-
// preserving rewired null and with a random geometric graph.
let s=12345;const rnd=()=>((s=(s*1664525+1013904223)>>>0)/4294967296);
function ba(n,m){const A=Array.from({length:n},()=>new Set());const deg=[];
  for(let i=0;i<=m;i++)for(let j=0;j<i;j++){A[i].add(j);A[j].add(i);}
  for(let i=m+1;i<n;i++){const tot=A.reduce((t,x)=>t+x.size,0);const tg=new Set();
    while(tg.size<m){let r=rnd()*tot;for(let j=0;j<i;j++){r-=A[j].size;if(r<=0){tg.add(j);break;}}}
    for(const j of tg){A[i].add(j);A[j].add(i);}}return A;}
function rewire(A,iters){const E=[];A.forEach((x,i)=>x.forEach(j=>{if(i<j)E.push([i,j]);}));
  const B=A.map(x=>new Set(x));for(let k=0;k<iters;k++){const a=E[Math.floor(rnd()*E.length)],b=E[Math.floor(rnd()*E.length)];
    const [p,q]=a,[r,t]=b;if(new Set([p,q,r,t]).size<4||B[p].has(t)||B[r].has(q))continue;
    B[p].delete(q);B[q].delete(p);B[r].delete(t);B[t].delete(r);B[p].add(t);B[t].add(p);B[r].add(q);B[q].add(r);a[1]=t;b[1]=q;}return B;}
function geo(n,rad){const P=Array.from({length:n},()=>[rnd(),rnd(),rnd()]);const A=Array.from({length:n},()=>new Set());
  for(let i=0;i<n;i++)for(let j=0;j<i;j++)if(Math.hypot(...P[i].map((v,k)=>v-P[j][k]))<rad){A[i].add(j);A[j].add(i);}return A;}
function sp(A){const n=A.length;return A.map((_,s0)=>{const d=new Array(n).fill(Infinity);d[s0]=0;const q=[s0];
  while(q.length){const u=q.shift();for(const v of A[u])if(d[v]===Infinity){d[v]=d[u]+1;q.push(v);}}
  const mx=Math.max(...d.filter(Number.isFinite));return d.map(x=>Number.isFinite(x)?x:mx+1);});}
function mds(D,k){const n=D.length,D2=D.map(r=>r.map(x=>x*x)),rm=D2.map(r=>r.reduce((a,b)=>a+b)/n),all=rm.reduce((a,b)=>a+b)/n;
  const B=D2.map((r,i)=>r.map((x,j)=>-.5*(x-rm[i]-rm[j]+all)));const out=Array.from({length:n},()=>[]);
  for(let e=0;e<k;e++){let v=Array.from({length:n},(_,i)=>1+((i*7+e*3)%11)/10),l=0;
    for(let it=0;it<300;it++){const w=B.map(r=>r.reduce((s1,x,j)=>s1+x*v[j],0));const len=Math.hypot(...w);l=w.reduce((s1,x,i)=>s1+x*v[i],0);v=w.map(x=>x/len);}
    for(let i=0;i<n;i++)for(let j=0;j<n;j++)B[i][j]-=l*v[i]*v[j];v.forEach((x,i)=>out[i].push(x*Math.sqrt(Math.max(l,0))));}return out;}
const rank=a=>{const o=a.map((v,i)=>[v,i]).sort((x,y)=>x[0]-y[0]);const r=new Array(a.length);o.forEach(([,i],k)=>r[i]=k);return r;};
function spearman(a,b){const ra=rank(a),rb=rank(b),n=a.length,ma=(n-1)/2;let num=0,da=0,db=0;
  for(let i=0;i<n;i++){num+=(ra[i]-ma)*(rb[i]-ma);da+=(ra[i]-ma)**2;db+=(rb[i]-ma)**2;}return num/Math.sqrt(da*db);}
function test(name,A){const X=mds(sp(A),3);const c=[0,1,2].map(d=>X.reduce((s1,p)=>s1+p[d],0)/X.length);
  const radius=X.map(p=>Math.hypot(...p.map((v,d)=>v-c[d])));const deg=A.map(x=>x.size);
  console.log(name.padEnd(34),'Spearman(grau, distância ao centro) =',spearman(deg,radius).toFixed(3));}
const out={ba:[],null:[],geo:[]};
function rho(A){const X=mds(sp(A),3);const c=[0,1,2].map(d=>X.reduce((s1,p)=>s1+p[d],0)/X.length);
 const radius=X.map(p=>Math.hypot(...p.map((v,d)=>v-c[d])));return spearman(A.map(x=>x.size),radius);}
for(let k=0;k<20;k++){s=1000+k*7919;const G=ba(150,2);out.ba.push(rho(G));out.null.push(rho(rewire(G,5000)));out.geo.push(rho(geo(150,.28)));}
for(const [k,v] of Object.entries(out)){v.sort((a,b)=>a-b);console.log(k,'mediana',v[10].toFixed(2),'faixa',v[0].toFixed(2),'a',v[19].toFixed(2),'negativos',v.filter(x=>x<0).length+'/20');}

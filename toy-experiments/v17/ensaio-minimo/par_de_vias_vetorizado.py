import numpy as np, time
W,DMIN,DMAX,PASSO,DEDUP=0.21,0.5,20.0,0.10,0.02; DELTA,JIT=0.458,0.02; DUR,CICLO=20000.,180000.; SOME,EST=600000.,120000.
def brotos(ds):
    out=list(ds)
    for d in list(ds):
        for nd in (d*1.1,d*0.9):
            if DMIN<=nd<=DMAX and all(abs(x-nd)>DEDUP*nd for x in out): out.append(nd)
    return out
def rodar(periodos,seed=1):
    rng=np.random.default_rng(seed)
    dA=[DMIN*(DMAX/DMIN)**(k/5) for k in range(6)]; dB=list(dA)
    lastA={};lastB={};firstA={};firstB={}
    for ep,P in enumerate(periodos):
        t0=ep*CICLO; n=int(DUR/P)
        tA=t0+np.arange(n)*P+rng.normal(0,JIT,n); tB=t0+np.arange(n)*P+DELTA+rng.normal(0,JIT,n)
        cred={}
        for idx,t in enumerate(tA):
            a=np.array(dA); b=np.array(dB); alvo=(t+a)[:,None]-b[None,:]
            k=np.clip(np.searchsorted(tB,alvo),1,n-1)
            gap=np.minimum(np.abs(tB[k]-alvo),np.abs(tB[k-1]-alvo))
            hit=gap<=W; near=(gap>W)&(gap<=3*W)
            hi,hj=np.nonzero(hit)
            for i in set(hi): lastA[a[i]]=t; firstA.setdefault(a[i],t)
            for j in set(hj): lastB[b[j]]=t; firstB.setdefault(b[j],t)
            if idx>=n-200:
                for i,j in zip(hi,hj):
                    o=round(a[i]-b[j],2); cred[o]=cred.get(o,0)+1
            ni,nj=np.nonzero(near)
            if len(ni):
                dA=brotos(dA) if True else dA; dB=brotos(dB)
        tf=t0+DUR
        keep=lambda d,last,first: (d in last and (tf-last[d]<SOME or last[d]-first[d]>=EST)) or (d not in last and tf-t0<SOME)
        dA=[d for d in dA if keep(d,lastA,firstA)]; dB=[d for d in dB if keep(d,lastB,firstB)]
        tot=sum(cred.values()) or 1; ver=sum(v for o,v in cred.items() if abs(o-DELTA)<=W)
        semhit=sum(1 for d in dA if d not in lastA or tf-lastA[d]>DUR)
        print(f"  ep {ep+1} P={P}: ramos A {len(dA)} B {len(dB)}; ramos de A sem acerto neste episódio {semhit}; relações que acertam {len(cred)}; crédito na relação verdadeira {ver/tot:.2f}; top {sorted(cred.items(),key=lambda x:-x[1])[:3]}",flush=True)
for nome,per in [("fixo 5 ms",[5.0]*6),("variando",[5.0,3.7,6.3,4.4,7.1,5.6])]:
    print(nome,flush=True); t=time.time(); rodar(per); print(f"  ({time.time()-t:.0f} s)",flush=True)

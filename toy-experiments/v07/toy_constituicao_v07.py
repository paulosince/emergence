"""V0.7: confronto entre marca local e frente propagante.
Sem bibliotecas externas. Candidatos surgem em interações por eventos; não por diferença direta de timestamps.
A avaliação posterior pode medir erros temporais. Uma Uint é predefinida como aparato de teste.
"""
import csv, math, random, argparse
from dataclasses import dataclass

TAU=.32
SPEED=1.0
MAX_LENGTH=.48
QUANTUM=.02
MAX_AGE=.48
MATCH=.045

@dataclass
class Link:
    lag:float
    c:float=.12
    s:float=.12
    n:int=0
    def C(self):return self.c*self.s

def signals(mode,seed,n=36):
    rng=random.Random(seed)
    a=[.4+i*.73+rng.uniform(-.012,.012) for i in range(n)]
    if mode=='associated':b=[t+.213+rng.uniform(-.014,.014) for t in a]
    elif mode=='independent':b=sorted(rng.uniform(.4, .4+(n-1)*.73+.45) for _ in range(n))
    elif mode=='variable':b=[t+.09+i*.009+rng.uniform(-.012,.012) for i,t in enumerate(a)]
    elif mode=='phase_change':b=[t+.213+rng.uniform(-.014,.014) for t in a[:n//2]]+[t+.39+rng.uniform(-.014,.014) for t in a[n//2:]]
    else:raise ValueError(mode)
    return sorted(a),sorted(b)

def captures(a,b,mechanism):
    # local: exponential trace of A; B samples its residual state; no delay inferred from amplitude
    # front: A emits moving front; B captures current position; distance is physically retained
    events=sorted([(t,0) for t in a]+[(t,1) for t in b],key=lambda x:(x[0],x[1]))
    traces=[];out=[];prev=0
    for t,typ in events:
        dt=t-prev
        if mechanism=='local':
            traces=[x*math.exp(-dt/TAU) for x in traces if x*math.exp(-dt/TAU)>.20]
        else:
            traces=[x+SPEED*dt for x in traces if x+SPEED*dt<=MAX_LENGTH]
        prev=t
        if typ==0:traces.append(1.0 if mechanism=='local' else 0.0)
        else:
            for x in traces:
                if mechanism=='local':
                    # residual mark can enable creation, but provides no operational propagation delay
                    if x>.20:out.append((0.0,x))
                else:out.append((round(x/QUANTUM)*QUANTUM,1.0))
    return out

def train(mode,mechanism,cycles=7):
    links={};history=[]
    for cycle in range(cycles):
        a,b=signals(mode,41+cycle)
        cap=captures(a,b,mechanism)
        observed={}
        for lag,amplitude in cap:observed[lag]=observed.get(lag,0)+amplitude
        created=0;pruned=0
        for lag,total in observed.items():
            if lag not in links:
                links[lag]=Link(lag);created+=1
        for lag,link in list(links.items()):
            evidence=observed.get(lag,0)/max(1,len(a))
            if evidence>.3:
                link.c=min(1,link.c+.25*min(1,evidence));link.s=min(1,link.s+.20*min(1,evidence));link.n+=1
            else:
                # no automatic confidence decay for inactivity
                link.s*=.58
            if link.C()<.004 and cycle>0:
                del links[lag];pruned+=1
        history.append(dict(mode=mode,mechanism=mechanism,cycle=cycle+1,captures=len(cap),created=created,pruned=pruned,survivors=len(links),best_lag=max(links.values(),key=lambda l:l.C()).lag if links else '',best_C=round(max((l.C() for l in links.values()),default=0),5)))
    a,b=signals(mode,1041)
    # Operational test: does a candidate's propagation delay align A arrivals with B events?
    best=max(links.values(),key=lambda l:l.C()) if links else None
    accuracy=sum(any(abs((t+best.lag)-u)<MATCH for u in b) for t in a)/len(a) if best else 0
    return history,round(accuracy,4)

def main():
    p=argparse.ArgumentParser();p.add_argument('--csv',default='toy_resultados_v07.csv');args=p.parse_args()
    rows=[]
    for mode in ['associated','independent','variable','phase_change']:
        for mechanism in ['local','front']:
            h,acc=train(mode,mechanism);rows.extend([dict(r,heldout_accuracy=acc) for r in h]);print(mode,mechanism,'survivors',h[-1]['survivors'],'best_lag',h[-1]['best_lag'],'C',h[-1]['best_C'],'heldout',acc)
    with open(args.csv,'w',newline='',encoding='utf-8') as f:
        w=csv.DictWriter(f,fieldnames=rows[0].keys());w.writeheader();w.writerows(rows)
if __name__=='__main__':main()

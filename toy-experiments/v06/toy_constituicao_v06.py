"""EMERGENCE toy V0.6: frentes de propagacao e captura local.
Nao calcula t_B-t_A para constituir atrasos; atraso resulta de distancia capturada / velocidade.
Modelo hipotetico, nao prova constituicao autonoma. Python 3 stdlib.
"""
import argparse, csv, random
from dataclasses import dataclass

SPEED=1.0               # unidades espaciais por segundo
MAX_LENGTH=.48          # limite fisico da frente
RESOLUTION=.01          # resolucao de captura espacial
TOLERANCE=.035          # tolerancia de chegada

@dataclass
class Link:
    length:float
    c:float=.10
    s:float=.10
    hits:int=0
    misses:int=0
    @property
    def C(self): return self.c*self.s

def signals(mode, seed, n=36, spacing=.73):
    r=random.Random(seed)
    a=[1+i*spacing+r.uniform(-.012,.012) for i in range(n)]
    if mode=='associated': b=[t+.213+r.uniform(-.014,.014) for t in a]
    elif mode=='independent': b=sorted(r.uniform(.9,1+(n-1)*spacing+.5) for _ in range(n))
    elif mode=='drifting': b=[t+.10+.007*i+r.uniform(-.014,.014) for i,t in enumerate(a)]
    elif mode=='phase_shift':
        shift=.213 if seed%2 else .365
        b=[t+shift+r.uniform(-.014,.014) for t in a]
    else: raise ValueError(mode)
    return sorted(a),sorted(b)

def captures(a,b):
    """Frentes nascem em A, avancam continuamente; B captura a posicao atual.
    Nenhuma diferenca de timestamps e computada para gerar comprimentos.
    A e B sao eventos fisicos locais; frentes antigas desaparecem.
    """
    events=sorted([(t,0) for t in a]+[(t,1) for t in b])
    fronts=[]; last=0.; lengths=[]
    for t,kind in events:
        elapsed=t-last  # integracao do movimento, nao comparacao de pares A/B
        fronts=[x+SPEED*elapsed for x in fronts if x+SPEED*elapsed<=MAX_LENGTH]
        last=t
        if kind==0: fronts.append(0.)
        else:
            for x in fronts:
                q=round(x/RESOLUTION)*RESOLUTION
                if q>0: lengths.append(round(q,3))
    return lengths

def arrivals(a,b,lag):
    """Valida propagacao: evento A gera chegada apos tempo de percurso length/speed.
    Mede coincidencia de chegada com atividade B; nao escolhe lag pelo resultado.
    """
    used=set();hits=0
    for t in a:
        expected=t+lag
        matches=[(abs(expected-v),j) for j,v in enumerate(b)
                 if j not in used and abs(expected-v)<=TOLERANCE]
        if matches:
            _,j=min(matches);used.add(j);hits+=1
    return hits,len(a)-hits

def run(mode,cycles=7,seed=41):
    links={}; rows=[]
    for cycle in range(cycles):
        a,b=signals(mode,seed+cycle*11)
        observed=captures(a,b)
        new=0
        for length in observed:
            if length not in links:
                links[length]=Link(length);new+=1
        pruned=0
        for length,link in list(links.items()):
            hits,misses=arrivals(a,b,length/SPEED)
            link.c=max(0.,min(1.,link.c+.013*hits-.012*misses))
            link.s=max(0.,min(1.,link.s*.78+.012*hits))
            link.hits+=hits;link.misses+=misses
            if link.s<.022 or link.C<.0025:
                del links[length];pruned+=1
        top=sorted(links.values(),key=lambda l:l.C,reverse=True)
        rows.append(dict(mode=mode,cycle=cycle+1,captures=len(observed),created=new,
                         pruned=pruned,survivors=len(top),best_length=top[0].length if top else '',
                         best_c=round(top[0].c,4) if top else 0,
                         best_s=round(top[0].s,4) if top else 0,
                         best_C=round(top[0].C,4) if top else 0))
    aa,bb=signals(mode,seed+999)
    top=sorted(links.values(),key=lambda l:l.C,reverse=True)
    accuracy=arrivals(aa,bb,top[0].length/SPEED)[0]/len(aa) if top else 0.
    return rows,top,accuracy

def self_test():
    assert captures([1.0],[1.213])==[.21]
    assert captures([1.0],[.5])==[]
    assert arrivals([1.0],[1.21],.21)==(1,0)
    assert arrivals([1.0],[1.40],.21)==(0,1)

if __name__=='__main__':
    self_test()
    p=argparse.ArgumentParser();p.add_argument('--csv',default='toy_resultados_v06.csv');p.add_argument('--cycles',type=int,default=7)
    args=p.parse_args();allrows=[]
    for mode in ('associated','independent','drifting','phase_shift'):
        rows,top,accuracy=run(mode,args.cycles);allrows.extend(rows)
        print(f'{mode:12s} sobreviventes={len(top):3d} comprimento={top[0].length if top else None} '
              f'C={top[0].C if top else 0:.3f} teste={accuracy:.1%}')
    with open(args.csv,'w',newline='',encoding='utf-8') as f:
        w=csv.DictWriter(f,fieldnames=list(allrows[0]));w.writeheader();w.writerows(allrows)
    print('CSV:',args.csv)
"""EMERGENCE toy V0.5 — atrasos candidatos derivados das marcas temporais.
Python 3, biblioteca padrao. Nao demonstra constituicao autonoma nem Pcrt fisica.
Uso: python toy_constituicao_v05.py --csv /mnt/data/toy_resultados_v05.csv
"""
import argparse, csv, random
from dataclasses import dataclass

@dataclass
class Candidate:
    lag: float
    c: float = .12
    s: float = .14
    confirmations: int = 0
    contradictions: int = 0
    age: int = 0
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
    return sorted(a), sorted(b)

def candidate_lags(a,b, window=.45, quantum=.01):
    """Geracao por pares de marcas: nenhuma lista de atrasos candidatos.
    A janela e resolucao fisica *impostas*, nao emergentes. Sem filtro de frequencia.
    """
    lagset=set()
    for x in a:
        for y in b:
            delta=y-x
            if abs(delta)<=window:
                lagset.add(round(round(delta/quantum)*quantum, 3))
    return sorted(lagset)

def score(a,b,lag,tolerance=.038):
    """Correspondencia 1:1 gananciosa, sem reutilizar eventos; inclui falhas."""
    used=set(); hits=0
    for x in a:
        valid=[(abs(x+lag-y),j) for j,y in enumerate(b) if j not in used and abs(x+lag-y)<=tolerance]
        if valid:
            _,j=min(valid);used.add(j);hits+=1
    return hits,len(a)-hits

def experiment(mode, cycles=7, seed=41):
    units={}; history=[]
    for cycle in range(cycles):
        a,b=signals(mode,seed+cycle*11)
        # Cria candidatos somente a partir das marcas observadas neste ciclo.
        # Nao sabe qual atraso seria o 'correto'.
        observed=candidate_lags(a,b)
        created=0
        for lag in observed:
            if lag not in units:
                units[lag]=Candidate(lag);created+=1
        removed=0
        for lag,u in list(units.items()):
            hits,misses=score(a,b,lag)
            # C e s tem dinâmicas diferentes: inatividade não altera c;
            # aqui todas as candidatas têm oportunidade de avaliação em cada ciclo.
            u.c=max(0.,min(1.,u.c+.014*hits-.012*misses))
            u.s=max(0.,min(1.,u.s*.78+.013*hits))
            u.confirmations+=hits;u.contradictions+=misses;u.age+=1
            if u.s<.025 or u.C<.004:
                del units[lag];removed+=1
        top=sorted(units.values(),key=lambda u:u.C,reverse=True)
        history.append(dict(mode=mode,cycle=cycle+1,observed_candidates=len(observed),created=created,
            pruned=removed,survivors=len(units),best_lag_s=round(top[0].lag,3) if top else '',
            best_confidence=round(top[0].c,4) if top else 0,
            best_stability=round(top[0].s,4) if top else 0,
            best_C=round(top[0].C,4) if top else 0))
    # Teste independente: nao altera unidades; mede correspondencia sem reconstituicao
    aa,bb=signals(mode,seed+999)
    top=sorted(units.values(),key=lambda u:u.C,reverse=True)
    holdout=score(aa,bb,top[0].lag)[0]/len(aa) if top else 0.
    return history,top,holdout

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--csv',default='toy_resultados_v05.csv');ap.add_argument('--cycles',type=int,default=7)
    args=ap.parse_args(); rows=[]
    for mode in ('associated','independent','drifting','phase_shift'):
        hist,top,hold=experiment(mode,args.cycles);rows.extend(hist)
        print(f'{mode:12s} sobreviventes={len(top):3d} melhor_atraso={top[0].lag if top else None} '
              f'C={top[0].C if top else 0:.3f} validacao={hold:.2%}')
    with open(args.csv,'w',newline='',encoding='utf-8') as f:
        writer=csv.DictWriter(f,fieldnames=list(rows[0]));writer.writeheader();writer.writerows(rows)
    print('CSV:',args.csv)
if __name__=='__main__': main()
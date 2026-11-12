"""Toy V0.4: exuberancia constitutiva, confianca c, estabilidade s e poda.
Python 3, apenas biblioteca padrao. Modelo operacional hipotetico, nao prova CLEAR.
Executar: python toy_constituicao_v04.py --csv toy_v04.csv
"""
import argparse, csv, math, random
from dataclasses import dataclass

DT=0.05
LAGS=(-0.30,-0.20,-0.10,0.0,0.10,0.20,0.30,0.40)
WIDTH=0.055

@dataclass
class Upro:
    source: int
    lag: float
    c: float = 0.16
    s: float = 0.18
    age: int = 0
    confirmations: int = 0
    contradictions: int = 0
    @property
    def consolidation(self): return self.c*self.s

def events(seed=17, mode='associated'):
    r=random.Random(seed)
    a=[1.0+i*.75+r.uniform(-.025,.025) for i in range(48)]
    if mode=='associated':
        b=[t+.20+r.uniform(-.022,.022) for t in a]
    elif mode=='independent':
        b=sorted(r.uniform(1,37) for _ in range(48))
    elif mode=='drifting':
        b=[t+.20+.007*i+r.uniform(-.025,.025) for i,t in enumerate(a)]
    else: raise ValueError(mode)
    return [sorted(a),sorted(b)]

def nearest_error(t, seq):
    return min((abs(t-x) for x in seq),default=float('inf'))

def run(mode='associated', seed=17, cycles=5):
    """Candidatas surgem por proximidade de atividade; nao por p-valor.
    Cada rodada e uma nova experiencia. Confirmacoes e contradicoes dependem
    de chegadas esperadas e observadas; s decai inclusive sem atividade.
    """
    units=[]; rows=[]; rng=random.Random(seed+1000)
    for cycle in range(cycles):
        a,b=events(seed+cycle*13,mode)
        # Exuberancia: cria candidatos em cada fibra a partir de encontros locais.
        if cycle==0:
            for lag in LAGS:
                # Proposta: cada canal de atraso e um estado fisico elegivel;
                # todas as hipoteses de ligacao nascem com c e s baixos.
                units.append(Upro(0,lag))
                units.append(Upro(1,-lag))
        # Uma Uint experimental com duas entradas; somente pares complementares
        # podem disparar nela. Nao e Uint emergente.
        responses=0
        for u in units[:]:
            src=a if u.source==0 else b
            dst=b if u.source==0 else a
            matches=0; misses=0
            for t in src:
                error=nearest_error(t+u.lag,dst)
                if error<=WIDTH: matches+=1
                else: misses+=1
            # c: evidencia observada; sem decaimento por inatividade
            u.c=max(0,min(1,u.c+.014*matches-.009*misses))
            # s: decaimento e reforco por atividade coincidente
            u.s=max(0,min(1,u.s*.83+.012*matches))
            u.confirmations+=matches; u.contradictions+=misses; u.age+=1
            if u.source==0 and matches>0:
                responses+=matches # proxy de chegadas concordantes, nao saidas independentes
            if u.s<.035 or u.consolidation<.008:
                units.remove(u)
        # Nova exuberancia quando novas experiencias produzem proximidade.
        if cycle>0:
            for lag in LAGS:
                if rng.random()<.10 and not any(u.source==0 and u.lag==lag for u in units):
                    units.append(Upro(0,lag))
        for u in units:
            rows.append(dict(mode=mode,cycle=cycle+1,source=u.source,lag_s=u.lag,
                confidence=round(u.c,5),stability=round(u.s,5),consolidation=round(u.consolidation,5),
                confirmations=u.confirmations,contradictions=u.contradictions,proxy_arrivals=responses))
    return units,rows

def main():
    p=argparse.ArgumentParser();p.add_argument('--csv',default='toy_resultados_v04.csv');p.add_argument('--cycles',type=int,default=5)
    args=p.parse_args();allrows=[]
    for mode in ('associated','independent','drifting'):
        units,rows=run(mode,cycles=args.cycles);allrows.extend(rows)
        best=sorted(units,key=lambda u:u.consolidation,reverse=True)[:3]
        print(f'{mode}: sobreviventes={len(units)}; melhores='+', '.join(f'{u.source}:{u.lag:+.2f}s C={u.consolidation:.3f}' for u in best))
    with open(args.csv,'w',newline='',encoding='utf-8') as f:
        w=csv.DictWriter(f,fieldnames=['mode','cycle','source','lag_s','confidence','stability','consolidation','confirmations','contradictions','proxy_arrivals']);w.writeheader();w.writerows(allrows)
    print('CSV:',args.csv)
if __name__=='__main__':main()
"""Toy V0.3: marcas locais, maturacao de conexoes e Uint com propagacao operacional.
Somente biblioteca padrao. Nao demonstra emergencia representacional.
Executar: python toy_constituicao_v03.py
"""
import argparse, csv, random, math
from dataclasses import dataclass

N=32
PERIOD=450.0
SIGMA=35.0
# Canais de atraso sao uma capacidade fisica do meio experimental, NAO um atraso escolhido apos ver os dados.
LAGS=tuple(range(-400,401,20))


def generate(kind,seed):
    rng=random.Random(seed)
    a=sorted(500+i*PERIOD+rng.uniform(-18,18) for i in range(N))
    if kind=='paired': b=[t+120+rng.uniform(-18,18) for t in a]
    elif kind=='reversed': b=[t-120+rng.uniform(-18,18) for t in a]
    elif kind=='independent': b=[rng.uniform(100,16000) for _ in range(N)]
    elif kind=='jitter': b=[t+120+rng.uniform(-380,380) for t in a]
    elif kind=='periodic_independent':
        phase=rng.uniform(0,450)
        b=[500+i*PERIOD+phase+rng.uniform(-18,18) for i in range(N)]
    elif kind=='drifting': b=[t+120+i*8+rng.uniform(-18,18) for i,t in enumerate(a)]
    else: raise ValueError(kind)
    return a,sorted(b)


def kernel(delta): return math.exp(-.5*(delta/SIGMA)**2)


def local_activity(a,b):
    """Marcas fisicas toy: cada canal integra sobreposicoes locais e satura por evento.
    Nao calcula p-value, nao escolhe atraso otimo globalmente.
    """
    marks=[0.0]*len(LAGS)
    for t in a:
        for i,lag in enumerate(LAGS):
            # max evita contar varias coincidencias da mesma incidencia A
            match=max((kernel((u-t)-lag) for u in b),default=0.)
            marks[i]+=match
    return [m/len(a) for m in marks]


@dataclass
class Connection:
    lag: int
    weight: float
    state: str


class Constitutor:
    """Hipotese B toy: canais Upro latentes associados a fibras; maturacao local.
    A comparacao entre canais vizinhos implementa competicao, nao semantica de padroes.
    """
    def __init__(self,threshold=.72,contrast=.12):
        self.threshold=threshold;self.contrast=contrast
        self.connections=[]
        self.marks=[]

    def train(self,a,b):
        self.marks=local_activity(a,b)
        # Competicao local: nao criar 10 Upro equivalentes por uma unica coincidencia
        candidates=[]
        for i,(lag,m) in enumerate(zip(LAGS,self.marks)):
            left=self.marks[max(0,i-5)]
            right=self.marks[min(len(LAGS)-1,i+5)]
            if m>=self.threshold and m-max(left,right)>=self.contrast:
                candidates.append((lag,m))
        # Competicao entre canais proximos: apenas um vencedor por vizinhanca.
        winners=[]
        for lag,m in sorted(candidates,key=lambda item:-item[1]):
            if all(abs(lag-old_lag)>80 for old_lag,_ in winners):
                winners.append((lag,m))
        self.connections=[Connection(lag,m,'mature') for lag,m in sorted(winners)]
        return self.connections


def propagate(a,b,connections,tolerance=65):
    """Simula a chegada de incidencias por duas Upro e saida da Uint por coincidencia.
    Para cada evento A, um impulso chega apos lag; B chega no seu proprio instante.
    Conta respostas Uint sem reutilizar a mesma incidencia B.
    """
    output=[]
    for c in connections:
        remaining=set(range(len(b)))
        for t in a:
            arrival=t+c.lag
            matches=[j for j in remaining if abs(b[j]-arrival)<=tolerance]
            if matches:
                j=min(matches,key=lambda j:abs(b[j]-arrival))
                remaining.remove(j)
                output.append((max(arrival,b[j]),c.lag))
    return sorted(output)


def experiment(kind,seed,threshold,contrast):
    train_a,train_b=generate(kind,seed)
    system=Constitutor(threshold,contrast)
    connections=system.train(train_a,train_b)
    test_a,test_b=generate(kind,seed+1000)
    out=propagate(test_a,test_b,connections)
    _,independent_b=generate('independent',seed+3000)
    control=propagate(test_a,independent_b,connections)
    return dict(scenario=kind,connections=len(connections),lags=';'.join(str(c.lag) for c in connections),
                strongest_mark=round(max(system.marks),3),test_outputs=len(out),control_outputs=len(control),
                functional=bool(connections and len(out)>=int(.65*N) and len(out)>len(control)+int(.35*N)))


def checks():
    a,b=generate('paired',17)
    assert generate('paired',17)==(a,b)
    assert local_activity(a,b)[LAGS.index(120)]>local_activity(a,b)[LAGS.index(-120)]
    assert propagate([100],[220],[Connection(120,1.,'mature')])==[(220,120)]
    assert not propagate([100],[350],[Connection(120,1.,'mature')])


def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('--seed',type=int,default=17)
    ap.add_argument('--threshold',type=float,default=.72)
    ap.add_argument('--contrast',type=float,default=.12)
    ap.add_argument('--csv',default='/mnt/data/toy_resultados_v03.csv')
    args=ap.parse_args();checks()
    kinds=('paired','reversed','independent','jitter','periodic_independent','drifting')
    results=[experiment(k,args.seed,args.threshold,args.contrast) for k in kinds]
    print('TOY V0.3 — constituicao local e propagacao operacional (hipotese programada)')
    for r in results: print(r)
    with open(args.csv,'w',newline='',encoding='utf-8') as f:
        writer=csv.DictWriter(f,fieldnames=list(results[0]));writer.writeheader();writer.writerows(results)
    print('LIMITES: atraso discretizado, competição e limiares sao mecanismos impostos; nao prova autonomia.')

if __name__=='__main__':main()
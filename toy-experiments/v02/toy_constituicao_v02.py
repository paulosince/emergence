"""Toy V0.2: comparação adversarial de marcas temporais e conexão diferida.
Python 3, apenas biblioteca padrão. Executar: python toy_constituicao_v02.py
Modelo de teste: algoritmo estatístico programado, NÃO emergência autônoma.
"""
import argparse, csv, math, random
from dataclasses import dataclass

DELAYS = tuple(range(-400, 401, 20))
SIGMA = 35.0
WINDOW = 16000.0
N = 32


def kernel(x):
    return math.exp(-.5*(x/SIGMA)**2)


def generate(kind, seed):
    rng = random.Random(seed)
    a = sorted(500+i*450+rng.uniform(-18,18) for i in range(N))
    if kind == 'paired':
        b = [t+120+rng.uniform(-18,18) for t in a]
    elif kind == 'reversed':
        b = [t-120+rng.uniform(-18,18) for t in a]
    elif kind == 'independent':
        b = [rng.uniform(100, WINDOW-100) for _ in range(N)]
    elif kind == 'jitter':
        b = [t+120+rng.uniform(-380,380) for t in a]
    elif kind == 'periodic_independent':
        # Mesmo período, fase independente entre sessões: falso positivo plausível.
        phase = rng.uniform(0,450)
        b = [500+i*450+phase+rng.uniform(-18,18) for i in range(N)]
    else:
        raise ValueError(kind)
    return a, sorted(b)


def score(a,b,delay):
    # Uma coincidência por evento A, evitando somar arbitrariamente todas as combinações.
    return sum(max((kernel((u-t)-delay) for u in b), default=0) for t in a)/len(a)


def scores(a,b):
    return [score(a,b,d) for d in DELAYS]


def surrogate(b, rng):
    # Permuta intervalos entre disparos: conserva a distribuição dos intervalos
    # e o primeiro instante, mas destrói parcialmente relações com A.
    gaps = [b[i+1]-b[i] for i in range(len(b)-1)]
    rng.shuffle(gaps)
    start = b[0]
    return [start]+[start+sum(gaps[:i]) for i in range(1,len(b))]


def calibrate(a,b,seed,reps):
    rng = random.Random(seed)
    null = []
    for _ in range(reps):
        bs = surrogate(b,rng)
        null.append(max(scores(a,bs))) # corrige busca por múltiplos atrasos
    return null

@dataclass
class Result:
    scenario: str
    delay: int
    score: float
    p: float
    created: bool
    heldout: float
    control: float
    functional: bool


def trial(kind,seed,reps,alpha,margin):
    a,b = generate(kind,seed)
    vals = scores(a,b)
    idx = max(range(len(vals)), key=vals.__getitem__)
    delay, strength = DELAYS[idx],vals[idx]
    null = calibrate(a,b,seed+20000,reps)
    p = (1+sum(x>=strength for x in null))/(reps+1)
    # Pré-condição programada para constituição: evidência contra nulo E força mínima.
    created = p <= alpha and strength >= margin
    aa,bb = generate(kind,seed+1000)
    heldout = score(aa,bb,delay)
    # Controle de nova sessão com B independente, mantendo número de disparos.
    _,ind = generate('independent',seed+3000)
    control = score(aa,ind,delay)
    # Resposta funcional toy: Uint recebe incidências de A e B por Upro com atraso;
    # produz saída somente quando chegada coincide dentro de 2 SIGMA.
    functional = created and heldout >= margin and heldout > control + .15
    return Result(kind,delay,strength,p,created,heldout,control,functional)


def checks():
    assert abs(kernel(0)-1)<1e-12
    assert kernel(100)<kernel(20)
    assert generate('paired',17)==generate('paired',17)
    assert len(generate('paired',17)[0])==N
    a,b=generate('paired',17)
    assert score(a,b,120)>score(a,b,-120)
    # Controle da permutação: mesmos intervalos (multiconjunto).
    bs=surrogate(b,random.Random(4))
    assert sorted(round(b[i+1]-b[i],7) for i in range(N-1))==sorted(round(bs[i+1]-bs[i],7) for i in range(N-1))


def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('--seed',type=int,default=17)
    ap.add_argument('--reps',type=int,default=199)
    ap.add_argument('--alpha',type=float,default=.05)
    ap.add_argument('--margin',type=float,default=.45)
    ap.add_argument('--csv',default='/mnt/data/toy_resultados_v02.csv')
    args=ap.parse_args()
    checks()
    kinds=('paired','reversed','independent','jitter','periodic_independent')
    results=[trial(k,args.seed,args.reps,args.alpha,args.margin) for k in kinds]
    print('TOY V0.2 — teste de constituição diferida (heurística programada)')
    print('cenario               delay   marca      p    criou  novo    controle funcional')
    for r in results:
        print(f'{r.scenario:<22} {r.delay:>4} {r.score:>8.3f} {r.p:>6.3f} {str(r.created):>7} {r.heldout:>6.3f} {r.control:>9.3f} {str(r.functional):>9}')
    if args.csv:
        with open(args.csv,'w',newline='',encoding='utf-8') as f:
            w=csv.writer(f);w.writerow(Result.__dataclass_fields__)
            for r in results:w.writerow([getattr(r,k) for k in Result.__dataclass_fields__])
    print('ATENÇÃO: p é relativo ao nulo por permutação de intervalos; não é prova de emergência.')
    print('funcional é critério operacional toy sobre novos eventos, não uma Uint biológica.')

if __name__=='__main__':main()
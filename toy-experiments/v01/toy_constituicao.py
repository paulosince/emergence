"""Toy de marcas temporais e constituição diferida (Python 3, biblioteca padrão).
Executar: python toy_constituicao.py
Opcional: python toy_constituicao.py --csv resultados.csv --seed 17
Não demonstra emergência autônoma: canais, limiar e criação são regras programadas.
"""
import argparse
import csv
import math
import random
from dataclasses import dataclass

DELAYS = tuple(range(-400, 401, 100))
WIDTH_MS = 65.0
THRESHOLD = 7.0

@dataclass(frozen=True)
class Result:
    scenario: str
    a: tuple
    b: tuple
    weights: tuple
    best_delay: int
    best_weight: float
    constituted: bool
    test_support: float
    shuffled_support: float


def events(scenario, seed):
    rng = random.Random(seed)
    a, b = [], []
    for i in range(32):
        t = 400 + i * 410 + (rng.random() - .5) * 40
        if scenario == 'reversed':
            b.append(t)
            a.append(t + 120)
        else:
            a.append(t)
            if scenario == 'paired':
                b.append(t + 120 + (rng.random() - .5) * 30)
            elif scenario == 'jitter':
                b.append(t + 80 + rng.random() * 700)
    if scenario == 'independent':
        b = [300 + rng.random() * 13400 for _ in range(32)]
    return tuple(sorted(a)), tuple(sorted(b))


def kernel(delta, delay):
    return math.exp(-0.5 * ((delta - delay) / WIDTH_MS) ** 2)


def support(a, b, delay):
    return sum(kernel(u - t, delay) for t in a for u in b)


def run(scenario, seed):
    a, b = events(scenario, seed)
    weights = tuple(support(a, b, d) for d in DELAYS)
    ix = max(range(len(weights)), key=lambda i: weights[i])
    delay, strength = DELAYS[ix], weights[ix]
    formed = strength >= THRESHOLD
    aa, bb = events(scenario, seed + 100)
    # Contraprova: preserva contagem e janela temporal, embaralha tempos de B.
    # Deslocamento aleatório circular quebra o alinhamento sem eliminar disparos.
    rng = random.Random(seed + 200)
    shift = rng.uniform(1000, 12000)
    bb_shuffle = tuple(sorted((t + shift) % 14000 for t in bb))
    return Result(scenario, a, b, weights, delay, strength, formed,
                  support(aa, bb, delay) if formed else 0.,
                  support(aa, bb_shuffle, delay) if formed else 0.)


def checks():
    # Testes determinísticos do mecanismo implementado, não validação da teoria.
    assert abs(kernel(120, 120) - 1) < 1e-12
    assert support((100,), (220,), 120) > support((100,), (220,), -120)
    assert events('paired', 17) == events('paired', 17)
    assert len(events('independent', 17)[1]) == 32
    assert len(DELAYS) == 9


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--seed', type=int, default=17)
    p.add_argument('--csv', default=None, help='salva resumo CSV')
    args = p.parse_args()
    checks()
    results = [run(s, args.seed) for s in ('paired', 'reversed', 'independent', 'jitter')]
    print('TOY — MARCAS TEMPORAIS / CONSTITUIÇÃO DIFERIDA')
    print('Zero Upro e Uint iniciais. A regra de criação é explicitamente programada.')
    print(f'Canais: {DELAYS} ms | largura: {WIDTH_MS} ms | limiar: {THRESHOLD}')
    print(f'{"Cenário":<14} {"atraso":>8} {"marca":>9} {"criou?":>8} {"teste":>9} {"controle":>9}')
    for r in results:
        print(f'{r.scenario:<14} {r.best_delay:>7}ms {r.best_weight:>9.2f} {str(r.constituted):>8} {r.test_support:>9.2f} {r.shuffled_support:>9.2f}')
    print('\nInterpretação: teste e controle são escores de compatibilidade temporal,')
    print('NÃO respostas de uma Uint. Upro/Uint são apenas contabilizadas após o limiar.')
    if args.csv:
        with open(args.csv, 'w', newline='', encoding='utf-8') as f:
            w = csv.writer(f)
            w.writerow(('cenario','atraso_ms','forca_marca','constituiu','teste','controle'))
            for r in results:
                w.writerow((r.scenario,r.best_delay,round(r.best_weight,4),r.constituted,round(r.test_support,4),round(r.shuffled_support,4)))
        print('CSV:', args.csv)

if __name__ == '__main__':
    main()
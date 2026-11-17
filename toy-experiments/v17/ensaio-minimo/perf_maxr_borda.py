"""Teste de engenharia da borda MAXR=512; nenhuma regra científica alterada.

Estados artificiais apenas para exercer o guarda de capacidade da função
original _brotar. Não comprovam que estados assim sejam alcançáveis na V0.17.
"""
import json
import numpy as np
from motor_par import MAXR, _brotar

assert MAXR == 512, "MAXR foi alterado: interromper análise"

def estado(n):
    d = np.zeros(MAXR, dtype=float)
    d[0] = 1.0
    if n > 1:
        d[1:n] = np.linspace(10.0, 19.0, n - 1)
    f = np.full(MAXR, 0.15)
    first = np.zeros(MAXR)
    last = np.zeros(MAXR)
    nasc = np.zeros(MAXR)
    est = np.zeros(MAXR, np.bool_)
    prot = np.ones(MAXR, np.bool_)
    return [d, f, first, last, nasc, est, prot]

n = MAXR - 1
args = estado(n)
out = _brotar(0, 0.0, 0.15, n, *args)
assert out == MAXR, f"esperado apenas um novo ramo: {out}"
assert args[0][MAXR - 1] == 1.1, "primeiro broto não foi criado como esperado"
assert np.count_nonzero(args[6]) == 0, "prot não foi zerado"
print("BORDA 511 -> 512: cria primeiro broto, recusa o segundo; sem exceção", flush=True)

n = MAXR
args = estado(n)
before = [x.copy() for x in args[:-1]]
out = _brotar(0, 0.0, 0.15, n, *args)
assert out == MAXR, "número ultrapassou o MAXR"
for a,b in zip(args[:-1], before):
    assert np.array_equal(a,b), "estado estrutural alterado sem novo ramo"
assert np.count_nonzero(args[-1]) == 0, "prot não foi zerado"
print("BORDA 512 -> 512: nenhum novo ramo; arrays estruturais preservados; prot zerado; sem exceção",flush=True)

with open("perf-v17-maxr-borda.json","w") as fh:
    json.dump({"MAXR": MAXR,"511_para_512": "um broto criado, segundo bloqueado",
               "512_para_512": "sem broto; arrays originais mantidos; prot zerado",
               "observacao":"entrada artificial, não é simulação científica"},
              fh,ensure_ascii=False,indent=2)

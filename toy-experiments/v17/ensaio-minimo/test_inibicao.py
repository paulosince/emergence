"""Testes do item 4 do registro prévio. Uso: python3 -I -m pytest -q test_inibicao.py  (ou python3 -I test_inibicao.py)"""
import sys
sys.path.insert(0, ".")
import numpy as np
from inibicao import inibicao, COND, INH

def test_I0_zero():
    T = np.linspace(-5, 10, 301)
    assert np.all(inibicao(T, [0.0], [1.0], "I0") == 0)

def test_pre_alimentada_antes():
    for c in ("I2", "I3"):
        off, tau = COND[c]
        T = np.linspace(-1.0, 10.0, 11001)
        v = inibicao(T, [0.0], [1.0], c)
        assert abs(T[np.argmin(v)] - off) <= 1.5e-3, c          # máximo 0,3 ms antes da chegada
        assert abs(v.min() - INH) < 1e-9, c
        assert np.all(v[T < off - 1e-9] == 0), c                 # nada antes
        assert np.all(v[T > off + 5 * tau + 1e-9] == 0), c       # nada após 5 constantes

def test_I1_depois():
    off, tau = COND["I1"]
    T = np.linspace(-1.0, 3.0, 4001)
    v = inibicao(T, [0.0], [1.0], "I1")
    assert abs(T[np.argmin(v)] - off) <= 1.5e-3 and np.all(v[T < off - 1e-9] == 0)

def test_I2_na_hora_da_excitacao():
    # chegada e sua inibição: na hora da própria chegada, a inibição vale −0,5·e^(−1) ≈ −0,184
    assert abs(inibicao(np.array([0.0]), [0.0], [1.0], "I2")[0] - INH * np.exp(-1)) < 1e-9

if __name__ == "__main__":
    for f in (test_I0_zero, test_pre_alimentada_antes, test_I1_depois, test_I2_na_hora_da_excitacao):
        f(); print("ok", f.__name__)

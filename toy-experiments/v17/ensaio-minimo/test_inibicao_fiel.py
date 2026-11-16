"""Testes da regra fiel. Uso: python3 -I test_inibicao_fiel.py"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from inibicao_fiel import maturidade, estado, inib_fiel, RAZAO

def test_maturidade():
    assert maturidade("F", 0) == 0 and abs(maturidade("F", 100) - 0.5) < 1e-12
    assert maturidade("F-imatura", 10**6) == 0 and maturidade("F-madura", 0) == 1

def test_estados():
    assert estado(0) == (2.7, 4.0) and np.allclose(estado(1), (-0.3, 1.5))

def test_kernel():
    for m in (0.0, 0.5, 1.0):
        off, tau = estado(m); T = np.linspace(-2, 30, 32001)
        v = inib_fiel(T, [0.0], [1.0], m)
        assert abs(T[np.argmin(v)] - off) <= 1.5e-3 and abs(v.min() + RAZAO) < 1e-3
        assert np.all(v[T < off - 1e-9] == 0) and np.all(v[T > off + 5 * tau + 1e-9] == 0)

if __name__ == "__main__":
    for f in (test_maturidade, test_estados, test_kernel): f(); print("ok", f.__name__)

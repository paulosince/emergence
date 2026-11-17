"""Diagnóstico de engenharia da V0.17: referências CURTAS do agudo e perfil do motor atual.

Não altera motor_par.py, inibicao.py, inibicao_fiel.py nem decisões científicas.
O perfil usa uma CÓPIA instrumentada da mesma fonte Numba, incluindo custo dos
marcadores. O tempo dela não é um benchmark justo contra o original; use
os tempos do motor original para comparar revisões na MESMA máquina.
"""
from __future__ import annotations

import importlib.util
import json
import os
from pathlib import Path
import sys
import tempfile
import time

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))

import inibicao
import inibicao_fiel
from motor_par import rodar_rapido

DUR_MS = 120.0  # duração técnica CURTA; não altera os protocolos científicos
SEED = 1
CASES = ("I0", "I1", "I2", "I3", "F", "F-imatura", "F-madura")
COMMON = ("classe", "ramos", "relacoes", "credito_verdadeiro", "dispersao_ms",
          "par_mais_forte_verdadeiro", "maxfA", "maxfB", "disparos_ultimo_ep")
STAGES = ("preparacao_e_busca_de_pares", "avaliacao_e_exc_inib",
          "credito_fortalecimento_decaimento", "contagem_credito",
          "quase_acertos_e_brotamento")


def ref_puro(cond: str, dur: float):
    if cond.startswith("F"):
        # A referência fiel usa faixa='grave' hardcoded. Fornecer-lhe o
        # MESMO trem agudo sem editar o arquivo histórico nem suas regras.
        antigo = inibicao_fiel.trem
        try:
            inibicao_fiel.trem = lambda rng, faixa, t0, d: inibicao.trem(
                rng, "agudo", t0, d)
            return inibicao_fiel.rodar((cond, SEED, dur))
        finally:
            inibicao_fiel.trem = antigo
    return inibicao.rodar((cond, "agudo", SEED, dur))


def comparar(a: dict, b: dict, cond: str):
    campos = list(COMMON)
    if cond.startswith("F"):
        campos.append("acertos")
    diferencas = {
        k: {"puro": a.get(k), "numba": b.get(k)}
        for k in campos if a.get(k) != b.get(k)
    }
    return diferencas


def trocar(src: str, old: str, new: str) -> str:
    qtd = src.count(old)
    if qtd != 1:
        raise AssertionError(f"marcador não único ({qtd}): {old[:75]!r}")
    return src.replace(old, new, 1)


def instrumentar_fonte():
    """Instrumenta trechos sem alterar as expressões numéricas existentes."""
    src = (HERE / "motor_par.py").read_text()
    src = trocar(src, "from numba import njit\n",
                 "from numba import njit, objmode\nimport time\n"
                 "@njit(cache=True)\ndef _clock_ns():\n"
                 "    with objmode(ns='int64'):\n"
                 "        ns = time.perf_counter_ns()\n"
                 "    return ns\n")
    src = trocar(src, "    nac = 0; disparos = 0\n    for ep in range(NEP):",
                 "    nac = 0; disparos = 0\n"
                 "    profile_ns = np.zeros(5, np.int64)\n"
                 "    pair_count = 0; coinc_count = 0\n"
                 "    for ep in range(NEP):")
    src = trocar(src, "            a = dA[:nA].copy();",
                 "            stage = _clock_ns()\n"
                 "            pair_count += nA * nB\n"
                 "            a = dA[:nA].copy();")
    src = trocar(src, "            hit = np.zeros((na, nb), np.bool_)",
                 "            profile_ns[0] += _clock_ns() - stage\n"
                 "            stage = _clock_ns()\n"
                 "            hit = np.zeros((na, nb), np.bool_)")
    src = trocar(src, "                    if gapm[i, j] <= W:",
                 "                    if gapm[i, j] <= W:\n"
                 "                        coinc_count += 1")
    src = trocar(src, "            hA = np.zeros(na, np.bool_)",
                 "            profile_ns[1] += _clock_ns() - stage\n"
                 "            stage = _clock_ns()\n"
                 "            hA = np.zeros(na, np.bool_)")
    src = trocar(src, "            # crédito\n",
                 "            profile_ns[2] += _clock_ns() - stage\n"
                 "            stage = _clock_ns()\n"
                 "            # crédito\n")
    src = trocar(src, "            # quase-acertos\n",
                 "            profile_ns[3] += _clock_ns() - stage\n"
                 "            stage = _clock_ns()\n"
                 "            # quase-acertos\n")
    src = trocar(src, "            if nA + nB > 300: break",
                 "            profile_ns[4] += _clock_ns() - stage\n"
                 "            if nA + nB > 300: break")
    src = trocar(src, "ck[:nc].copy(), cv[:nc].copy(), disparos, nac",
                 "ck[:nc].copy(), cv[:nc].copy(), disparos, nac, profile_ns, pair_count, coinc_count")
    src = trocar(src, "ck, cv, disparos, nac = _rodar(",
                 "ck, cv, disparos, nac, profile_ns, pair_count, coinc_count = _rodar(")
    src = trocar(src, "    return dict(cond=cond, faixa=faixa, semente=semente,",
                 "    return dict(_profile_ns=tuple(int(v) for v in profile_ns), "
                 "_pairs=int(pair_count), _coincidences=int(coinc_count), "
                 "cond=cond, faixa=faixa, semente=semente,")
    return src


def carregar_instrumentada(tmp: Path):
    file = tmp / "motor_par_instrumentado.py"
    file.write_text(instrumentar_fonte())
    spec = importlib.util.spec_from_file_location("motor_par_instrumentado", file)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def main():
    print(f"DIAGNÓSTICO V17 | agudo curto {DUR_MS} ms por episódio, 5 episódios, semente {SEED}", flush=True)
    print(f"Python {sys.version.split()[0]} | commit {os.environ.get('GITHUB_SHA', 'local')}", flush=True)
    import numba
    import numpy
    print(f"Numba {numba.__version__} | NumPy {numpy.__version__}", flush=True)
    rodar_rapido("I1", "agudo", SEED, dur=5.0)  # compilação fora do cronômetro
    rows = []
    for cond in CASES:
        t0 = time.perf_counter()
        puro = ref_puro(cond, DUR_MS)
        dt_puro = time.perf_counter() - t0
        t0 = time.perf_counter()
        numba_result = rodar_rapido(cond, "agudo", SEED, dur=DUR_MS)
        dt_numba = time.perf_counter() - t0
        diff = comparar(puro, numba_result, cond)
        rows.append({"condicao": cond, "duracao_ms": DUR_MS, "semente": SEED,
                     "tempo_puro_s": round(dt_puro, 6),
                     "tempo_numba_atual_s": round(dt_numba, 6),
                     "identico": not diff, "diferencas": diff,
                     "referencia": puro, "motor_atual": numba_result})
        print(f"BASELINE {cond:9} | puro={dt_puro:.4f}s | numba={dt_numba:.4f}s "
              f"| equivalência={'SIM' if not diff else 'NÃO'} | diferenças={diff}", flush=True)
    with tempfile.TemporaryDirectory() as tmp:
        mod = carregar_instrumentada(Path(tmp))
        # Compilação/JIT separada da medição.
        mod.rodar_rapido("I1", "agudo", SEED, dur=5.0)
        t0 = time.perf_counter()
        perfil = mod.rodar_rapido("I1", "agudo", SEED, dur=DUR_MS)
        dt_instrumentado = time.perf_counter() - t0
    normal = rodar_rapido("I1", "agudo", SEED, dur=DUR_MS)
    diff_profile = comparar(normal, perfil, "I1")
    valores = perfil["_profile_ns"]
    total = sum(valores)
    perfil_rows = []
    print("PERFIL AGUDO I1 — cópia Numba instrumentada (sobrecarga de marcadores)", flush=True)
    for nome, nanos in zip(STAGES, valores):
        frac = 100.0 * nanos / total if total else 0.0
        perfil_rows.append({"trecho": nome, "tempo_s": nanos / 1e9, "fracao_marcada_pct": frac})
        print(f"PERFIL {nome:37} | {nanos / 1e9:.6f}s | {frac:6.2f}%", flush=True)
    print(f"CONTAGENS pares_avaliados={perfil['_pairs']} coincidencias_avaliadas={perfil['_coincidences']}")
    print(f"PERFIL equivalência instrumento/original={'SIM' if not diff_profile else 'NÃO'}")
    print(f"PERFIL tempo_total_instrumentado_s={dt_instrumentado:.6f}", flush=True)
    out = {"contexto": "diagnóstico de engenharia; NÃO é resultado científico",
           "commit": os.environ.get("GITHUB_SHA", "local"),
           "python": sys.version.split()[0], "numba": numba.__version__,
           "numpy": numpy.__version__, "referencia_agudo_curto": rows,
           "perfil": perfil_rows, "pares": perfil["_pairs"],
           "coincidencias": perfil["_coincidences"],
           "equivalencia_motor_instrumentado": not diff_profile,
           "diferencas_instrumentado": diff_profile,
           "tempo_instrumentado_s": dt_instrumentado}
    Path("perf-v17-baseline.json").write_text(json.dumps(out, ensure_ascii=False, indent=2))
    if any(not r["identico"] for r in rows) or diff_profile:
        print("FALHA: equivalência insuficiente; não otimizar.", flush=True)
        raise SystemExit(2)
    print("PASSOU: referência curta do AGUDO vs motor atual; NÃO há otimização ainda.", flush=True)


if __name__ == "__main__":
    main()

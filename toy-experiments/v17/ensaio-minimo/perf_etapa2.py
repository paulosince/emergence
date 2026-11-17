"""Etapa 2 (somente engenharia): cobertura dos sete casos curtos e MAXR=512.

Deriva em memória uma cópia instrumentada do motor ORIGINAL a partir de
perf_baseline.instrumentar_fonte(). O arquivo motor_par.py não é editado.
O acompanhamento numérico acrescentado não muda os cálculos científicos.

Execução: python -u perf_etapa2.py --duracao-ms 120 --todos
         python -u perf_etapa2.py --duracao-ms 1000 --cond I1
         python -u perf_etapa2.py --duracao-ms 10000 --cond I1
"""
from __future__ import annotations

import argparse
import importlib.util
import json
import os
from pathlib import Path
import sys
import tempfile
import time

import numpy as np
import numba

import perf_baseline as base

HERE = Path(__file__).resolve().parent
# stats: máximos por Upro; brotos; propostas barradas; estabilizações; paradas
IDX = {
    "max_ramos_A": 0,
    "max_ramos_B": 1,
    "brotos_A": 2,
    "brotos_B": 3,
    "propostas_barradas_MAXR_antes_dedup": 4,
    "estabilizacoes_A": 5,
    "estabilizacoes_B": 6,
    "paradas_limite_total_300": 7,
    "max_total_ramos": 8,
    "pulsos_processados": 9,
}
STAGES = base.STAGES
META = ("_profile_ns", "_pairs", "_coincidences", "_stats")


def trocar(src, antes, depois):
    n = src.count(antes)
    if n != 1:
        raise AssertionError(f"padrão esperado exatamente uma vez; achado {n}: {antes[:120]}")
    return src.replace(antes, depois, 1)


def fonte_instrumentada():
    s = base.instrumentar_fonte()
    # Insere contadores apenas na cópia; preserva operações e ordenação de somas.
    s = trocar(s, "def _brotar(i, t, f0, n, d, f, first, last, nasc, est, prot):",
              "def _brotar(i, t, f0, n, d, f, first, last, nasc, est, prot, stats):")
    s = trocar(s, "        if DMIN <= nd <= DMAX and n < MAXR:",
              "        if DMIN <= nd <= DMAX and n >= MAXR:\n"
              "            stats[4] += 1\n"
              "        if DMIN <= nd <= DMAX and n < MAXR:")
    s = trocar(s, "    profile_ns = np.zeros(5, np.int64)",
              "    profile_ns = np.zeros(5, np.int64)\n"
              "    stats = np.zeros(10, np.int64)\n"
              "    stats[0] = NINI; stats[1] = NINI; stats[8] = 2 * NINI")
    s = trocar(s, "        for idx in range(n):\n            t = tA[idx]",
              "        for idx in range(n):\n"
              "            stats[9] += 1\n"
              "            t = tA[idx]")
    s = trocar(s,
              "                    fA[i] = min(TOTAL, fA[i] + DF); _marcar(i, t, fA, firA, lasA, estA)",
              "                    ja_estavel = estA[i]\n"
              "                    fA[i] = min(TOTAL, fA[i] + DF); _marcar(i, t, fA, firA, lasA, estA)\n"
              "                    if (not ja_estavel) and estA[i]: stats[5] += 1")
    s = trocar(s,
              "                    fB[j] = min(TOTAL, fB[j] + DF); _marcar(j, t, fB, firB, lasB, estB)",
              "                    ja_estavel = estB[j]\n"
              "                    fB[j] = min(TOTAL, fB[j] + DF); _marcar(j, t, fB, firB, lasB, estB)\n"
              "                    if (not ja_estavel) and estB[j]: stats[6] += 1")
    s = trocar(s,
              "nA = _brotar(ia, t, F0, nA, dA, fA, firA, lasA, nasA, estA, protA)",
              "nA = _brotar(ia, t, F0, nA, dA, fA, firA, lasA, nasA, estA, protA, stats)\n"
              "                                stats[2] += nA - n0")
    s = trocar(s,
              "nB = _brotar(ib, t, F0, nB, dB, fB, firB, lasB, nasB, estB, protB)",
              "nB = _brotar(ib, t, F0, nB, dB, fB, firB, lasB, nasB, estB, protB, stats)\n"
              "                                stats[3] += nB - n0")
    s = trocar(s, "            if nA + nB > 300: break",
              "            if nA > stats[0]: stats[0] = nA\n"
              "            if nB > stats[1]: stats[1] = nB\n"
              "            if nA + nB > stats[8]: stats[8] = nA + nB\n"
              "            if nA + nB > 300: stats[7] += 1\n"
              "            if nA + nB > 300: break")
    s = trocar(s,
              "ck[:nc].copy(), cv[:nc].copy(), disparos, nac, profile_ns, pair_count, coinc_count",
              "ck[:nc].copy(), cv[:nc].copy(), disparos, nac, profile_ns, pair_count, coinc_count, stats")
    s = trocar(s,
              "ck, cv, disparos, nac, profile_ns, pair_count, coinc_count = _rodar(",
              "ck, cv, disparos, nac, profile_ns, pair_count, coinc_count, stats = _rodar(")
    s = trocar(s,
              "return dict(_profile_ns=tuple(int(v) for v in profile_ns), ",
              "return dict(_stats=tuple(int(v) for v in stats), "
              "_profile_ns=tuple(int(v) for v in profile_ns), ")
    return s


def carregar_modulo(tmp):
    caminho = Path(tmp) / "motor_par_diagnostico2.py"
    caminho.write_text(fonte_instrumentada())
    spec = importlib.util.spec_from_file_location("motor_par_diagnostico2", caminho)
    mod = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = mod
    spec.loader.exec_module(mod)
    return mod


def comparacao_exata(a, b):
    """Compara todos os campos expostos no motor original, sem tolerância."""
    return {k: {"original": a.get(k), "instrumentado": b.get(k)}
            for k in sorted(set(a) | set(b)) if a.get(k) != b.get(k)}


def executar_condicao(mod, cond, dur):
    t0 = time.perf_counter()
    original = base.rodar_rapido(cond, "agudo", base.SEED, dur=dur)
    tempo_original = time.perf_counter() - t0
    t0 = time.perf_counter()
    diagnostico = mod.rodar_rapido(cond, "agudo", base.SEED, dur=dur)
    tempo_diagnostico = time.perf_counter() - t0
    limpo = {k: v for k, v in diagnostico.items() if k not in META}
    diferencas = comparacao_exata(original, limpo)
    stats = {nome: int(diagnostico["_stats"][i]) for nome, i in IDX.items()}
    stats["atingiu_MAXR_512"] = (stats["max_ramos_A"] >= 512 or
                                stats["max_ramos_B"] >= 512)
    assert stats["max_ramos_A"] <= 512 and stats["max_ramos_B"] <= 512
    tempo_ns = diagnostico["_profile_ns"]
    soma_ns = sum(tempo_ns)
    perfil = [
        {"trecho": nome, "tempo_s": nanos / 1e9,
         "participacao_pct": 100 * nanos / soma_ns if soma_ns else 0.0}
        for nome, nanos in zip(STAGES, tempo_ns)
    ]
    return {"condicao": cond, "duracao_ms_por_episodio": dur,
            "sementes": [base.SEED], "episodios": 5,
            "original": original, "resultado_instrumentado": limpo,
            "identico_original_instrumentado": not diferencas,
            "diferencas": diferencas, "stats": stats,
            "tempo_original_s": tempo_original,
            "tempo_instrumentado_s": tempo_diagnostico,
            "pares_examinados": diagnostico["_pairs"],
            "coincidencias_avaliadas": diagnostico["_coincidences"],
            "perfil": perfil}


def linha_curta(d):
    s = d["stats"]
    print(f"CASO {d['condicao']:10} classe={d['original']['classe']:9} "
          f"ramos_finais={d['original']['ramos']:3} "
          f"brotamentos={s['brotos_A'] + s['brotos_B']:4} "
          f"estabilizacoes={s['estabilizacoes_A'] + s['estabilizacoes_B']:3} "
          f"maxA={s['max_ramos_A']:3}/512 maxB={s['max_ramos_B']:3}/512 "
          f"barreiras_MAXR={s['propostas_barradas_MAXR_antes_dedup']:3} "
          f"paradas_300={s['paradas_limite_total_300']:3} "
          f"igual={'SIM' if d['identico_original_instrumentado'] else 'NÃO'} "
          f"original={d['tempo_original_s']:.4f}s "
          f"instrumentado={d['tempo_instrumentado_s']:.4f}s", flush=True)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--duracao-ms", type=float, required=True)
    ap.add_argument("--todos", action="store_true")
    ap.add_argument("--cond", choices=base.CASES, default="I1")
    args = ap.parse_args()
    dur = args.duracao_ms
    conds = base.CASES if args.todos else (args.cond,)
    print(f"ETAPA2 INICIO duracao={dur}ms, condicoes={','.join(conds)} "
          f"seed={base.SEED} Python={sys.version.split()[0]} "
          f"Numba={numba.__version__} NumPy={np.__version__} "
          f"commit={os.environ.get('GITHUB_SHA', 'local')}", flush=True)
    with tempfile.TemporaryDirectory() as tmp:
        mod = carregar_modulo(tmp)
        # Compile ambos os motores com o mesmo caso pequeno antes de medir.
        base.rodar_rapido("I1", "agudo", base.SEED, dur=5.0)
        mod.rodar_rapido("I1", "agudo", base.SEED, dur=5.0)
        dados = []
        for cond in conds:
            d = executar_condicao(mod, cond, dur)
            if dur == 120.0:
                ref = base.ref_puro(cond, dur)
                divergencias_puro = base.comparar(ref, d["original"], cond)
                d["referencia_puro_igual"] = not divergencias_puro
                d["referencia_puro_diferencas"] = divergencias_puro
                print(f"REFERENCIA CURTA {cond:9}: "
                      f"{'SIM' if not divergencias_puro else 'NÃO'} {divergencias_puro}",
                      flush=True)
            dados.append(d)
            linha_curta(d)
            for item in d["perfil"]:
                print(f"PERFIL {dur:7.0f}ms {cond:9} {item['trecho']:38}"
                      f"{item['tempo_s']:.6f}s {item['participacao_pct']:.2f}%",
                      flush=True)
            print(f"ESCALA {dur:7.0f}ms {cond:9} "
                  f"pares={d['pares_examinados']} "
                  f"coincidencias={d['coincidencias_avaliadas']}", flush=True)
    saida = {
        "proposito": "etapa 2, diagnóstico de engenharia, não resultados científicos",
        "ambiente": {"python": sys.version.split()[0], "numba": numba.__version__,
                     "numpy": np.__version__, "sha": os.environ.get("GITHUB_SHA", "local")},
        "MAXR_constante": 512,
        "limite_interrupcao_soma_ramos": 300,
        "casos": dados,
    }
    nome = f"perf-v17-etapa2-{int(dur)}ms.json"
    Path(nome).write_text(json.dumps(saida, ensure_ascii=False, indent=2))
    print(f"ARQUIVO={nome}", flush=True)
    if not all(d["identico_original_instrumentado"] and
               d.get("referencia_puro_igual", True) for d in dados):
        print("FALHA: ao menos uma comparação EXATA divergiu", flush=True)
        raise SystemExit(2)
    print(f"ETAPA2 PASSOU duracao={dur}ms: "
          "equivalência exata dos campos expostos, sem tolerância.", flush=True)


if __name__ == "__main__":
    main()

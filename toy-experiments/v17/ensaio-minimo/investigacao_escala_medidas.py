"""Investigação de escala V0.17 — somente DIAGNÓSTICO do motor, sem alterar modelo.

Instrumenta uma cópia temporária dos arquivos originais, a partir das versões
versionadas em investigacao-escala. Nenhuma alteração dos motores científicos.
Contadores por pulso: nA,nB,pares,W,T distintos,_V iterações e contribuições.
Uso: python -u investigacao_escala_medidas.py --duracao-ms 1000 --cond I1
"""
import argparse
import csv
import gzip
import importlib.util
import json
import os
from pathlib import Path
import sys
import tempfile
import time

import numpy as np
import numba
import perf_etapa2 as etapa2
import perf_baseline as base

HERE = Path(__file__).resolve().parent


def trocar(src, antigo, novo):
    qty = src.count(antigo)
    if qty != 1:
        raise AssertionError(f"trecho não único {qty}: {antigo[:110]}")
    return src.replace(antigo, novo, 1)


def fonte_diagnostico():
    src = etapa2.fonte_instrumentada()
    # Instrumentação inteira dentro de _V: contagens, sem alterar ordem de soma.
    src = trocar(src, "    exc = 0.0; inh = 0.0",
                "    exc = 0.0; inh = 0.0\n"
                "    iteracoes = 0; exc_validas = 0; inh_validas = 0; eventos_varridos = 0")
    src = trocar(src, "        for k in range(k0, k1):",
                "        for k in range(k0, k1):\n"
                "            eventos_varridos += 1")
    src = trocar(src, "            for r in range(nr):",
                "            for r in range(nr):\n"
                "                iteracoes += 1")
    src = trocar(src, "if dx >= 0 and dx <= HEXC: exc += ww[r] * np.exp(-dx / TAU)",
                "if dx >= 0 and dx <= HEXC:\n"
                "                    exc_validas += 1\n"
                "                    exc += ww[r] * np.exp(-dx / TAU)")
    src = trocar(src, "if di >= 0 and di <= 5 * tau: inh += -razao * ww[r] * np.exp(-di / tau)",
                "if di >= 0 and di <= 5 * tau:\n"
                "                        inh_validas += 1\n"
                "                        inh += -razao * ww[r] * np.exp(-di / tau)")
    src = trocar(src, "    return exc + inh",
                "    return exc + inh, iteracoes, exc_validas, inh_validas, eventos_varridos")
    src = trocar(src,
                "    stats[0] = NINI; stats[1] = NINI; stats[8] = 2 * NINI",
                "    stats[0] = NINI; stats[1] = NINI; stats[8] = 2 * NINI\n"
                "    trac = np.zeros((trensA.size, 11), np.float64)\n"
                "    nt = 0\n")
    src = trocar(src,
                "            gapm = np.empty((na, nb)); kkm = np.empty((na, nb), np.int64)",
                "            gapm = np.empty((na, nb)); kkm = np.empty((na, nb), np.int64)\n"
                "            count_pass = 0; count_iter = 0; count_exc = 0; count_inh = 0; count_eventos = 0\n"
                "            ts = np.empty(na * nb, np.float64)")
    src = trocar(src,
                "                    if gapm[i, j] <= W:\n                        coinc_count += 1",
                "                    if gapm[i, j] <= W:\n                        coinc_count += 1\n"
                "                        count_pass += 1")
    src = trocar(src,
                "                        V = _V(T, t, a, fa, na, tA, 0.0, b, fb, nb, tB, razao, off, tau, H)",
                "                        ts[count_pass - 1] = T\n"
                "                        V, its, exs, ins, evs = _V(T, t, a, fa, na, tA, 0.0, b, fb, nb, tB, razao, off, tau, H)\n"
                "                        count_iter += its; count_exc += exs; count_inh += ins; count_eventos += evs")
    src = trocar(src,
                "            profile_ns[1] += _clock_ns() - stage",
                "            ts_sorted = np.sort(ts[:count_pass])\n"
                "            distintos = 0\n"
                "            for p in range(count_pass):\n"
                "                if p == 0 or ts_sorted[p] != ts_sorted[p-1]: distintos += 1\n"
                "            trac[nt, 0] = ep\n"
                "            trac[nt, 1] = t - t0\n"
                "            trac[nt, 2] = na\n"
                "            trac[nt, 3] = nb\n"
                "            trac[nt, 4] = na * nb\n"
                "            trac[nt, 5] = count_pass\n"
                "            trac[nt, 6] = distintos\n"
                "            trac[nt, 7] = count_iter\n"
                "            trac[nt, 8] = count_exc\n"
                "            trac[nt, 9] = count_inh\n"
                "            trac[nt, 10] = count_eventos\n"
                "            nt += 1\n"
                "            profile_ns[1] += _clock_ns() - stage")
    src = trocar(src,
                "ck[:nc].copy(), cv[:nc].copy(), disparos, nac, profile_ns, pair_count, coinc_count, stats",
                "ck[:nc].copy(), cv[:nc].copy(), disparos, nac, profile_ns, pair_count, coinc_count, stats, trac[:nt].copy()")
    src = trocar(src,
                "ck, cv, disparos, nac, profile_ns, pair_count, coinc_count, stats = _rodar(",
                "ck, cv, disparos, nac, profile_ns, pair_count, coinc_count, stats, trac = _rodar(")
    src = trocar(src,
                "return dict(_stats=tuple(int(v) for v in stats), ",
                "return dict(_trac=trac, _stats=tuple(int(v) for v in stats), ")
    return src


def carregar(tmp):
    path = Path(tmp) / "motor_par_escala.py"
    path.write_text(fonte_diagnostico())
    spec = importlib.util.spec_from_file_location("motor_par_escala", path)
    mod = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = mod
    spec.loader.exec_module(mod)
    return mod


COLS = ("ep", "tempo_local_ms", "nA", "nB", "pares", "passa_W",
        "T_distintos", "_V_iteracoes", "exc_validas", "inh_validas", "eventos_varridos")
PRIVATE = ("_trac", "_stats", "_profile_ns", "_pairs", "_coincidences")


def estatisticas(trac):
    if len(trac) == 0:
        return {}
    pairs = int(np.sum(trac[:, 4]))
    accepted = int(np.sum(trac[:, 5]))
    visits = int(np.sum(trac[:, 7]))
    ex = int(np.sum(trac[:, 8]))
    inh = int(np.sum(trac[:, 9]))
    events = int(np.sum(trac[:,10]))
    groups = []
    for ep in range(5):
        rows = trac[trac[:, 0] == ep]
        if rows.size == 0:
            groups.append({"episodio": ep+1,"pulsos":0})
            continue
        groups.append({
            "episodio": ep + 1, "pulsos": len(rows),
            "tempo_ultimo_pulso_ms": float(rows[-1,1]),
            "nA_inicial": int(rows[0,2]), "nB_inicial": int(rows[0,3]),
            "nA_max": int(rows[:,2].max()), "nB_max": int(rows[:,3].max()),
            "pares_examinados": int(rows[:,4].sum()),
            "passa_W": int(rows[:,5].sum()),
            "fracao_W": float(rows[:,5].sum()/rows[:,4].sum()),
            "pares_por_pulso_media": float(rows[:,4].mean()),
            "T_distintos_por_pulso_media": float(rows[:,6].mean()),
            "T_distintos_por_pulso_max": int(rows[:,6].max()),
        })
    return {
        "pulsos_processados": len(trac),
        "pares_examinados": pairs,
        "passa_W": accepted,
        "fracao_W": accepted/pairs if pairs else 0,
        "avaliacoes_de_V": accepted,
        "iteracoes_internas_V": visits,
        "iteracoes_por_V": visits/accepted if accepted else 0,
        "excitacoes_ativas": ex,
        "inibicoes_ativas": inh,
        "contribuicoes_por_iteracao_exc": ex/visits if visits else 0,
        "contribuicoes_por_iteracao_inh": inh/visits if visits else 0,
        "eventos_varridos_V": events,
        "eventos_por_V": events/accepted if accepted else 0,
        "T_distintos_por_pulso_media": float(trac[:, 6].mean()),
        "episodios": groups,
    }


def amostras(trac, bucket=250.0):
    result = []
    for ep in range(5):
        e = trac[trac[:,0] == ep]
        if not len(e): continue
        n_grupos = int(e[-1,1] // bucket) + 1
        for g in range(n_grupos):
            f = e[(e[:,1] >= g*bucket)&(e[:,1] < (g+1)*bucket)]
            if not len(f): continue
            result.append({
                "episodio": ep+1,
                "de_ms": g*bucket, "ate_ms": (g+1)*bucket,
                "pulsos": len(f),
                "nA_primeiro": int(f[0,2]),"nB_primeiro":int(f[0,3]),
                "nA_ultimo": int(f[-1,2]),"nB_ultimo":int(f[-1,3]),
                "pares_media_por_pulso": float(f[:,4].mean()),
                "passa_W_pct": float(100*f[:,5].sum()/f[:,4].sum()),
                "T_distintos_media":float(f[:,6].mean()),
                "V_iteracoes_por_avaliacao":float(f[:,7].sum()/f[:,5].sum()) if f[:,5].sum() else 0,
            })
    return result


def run(cond, dur, mod, escreve_traco=False):
    base.rodar_rapido("I1", "agudo", 1, dur=5)  # JIT
    mod.rodar_rapido("I1", "agudo", 1, dur=5)  # JIT
    t0=time.perf_counter()
    a=base.rodar_rapido(cond,"agudo",1,dur=dur)
    s_original=time.perf_counter()-t0
    t0=time.perf_counter()
    b=mod.rodar_rapido(cond,"agudo",1,dur=dur)
    s_instrumentado=time.perf_counter()-t0
    c={k:v for k,v in b.items() if k not in PRIVATE}
    dif={k:{"original":a.get(k),"instrumentado":c.get(k)}
         for k in sorted(set(a)|set(c)) if a.get(k)!=c.get(k)}
    trace=b["_trac"]
    stats={name:int(b["_stats"][i]) for name,i in etapa2.IDX.items()}
    count=estatisticas(trace)
    ts=b["_profile_ns"]; tot=sum(ts)
    times={name:{"segundos":float(v/1e9),"pct":float(v/tot*100) if tot else 0.0}
           for name,v in zip(base.STAGES,ts)}
    trigger={"ramos_maior_100": a["ramos"]>100,
             "relacoes_maior_200":a["relacoes"]>200,
             "classe":a["classe"]}
    report={
        "condicao":cond,"duracao_ms_por_episodio":dur,"semente":1,
        "resultado":a,"equivalencia_exata":not dif,"divergencias":dif,
        "gatilhos_explosao":trigger,"stats":stats,"contadores":count,
        "amostras_250ms":amostras(trace),
        "perfil":times,"tempo_original_s":s_original,
        "tempo_instrumentado_s":s_instrumentado,
    }
    if escreve_traco:
        name=f"escala-pulsos-{cond}-{int(dur)}ms.csv.gz"
        with gzip.open(name,"wt",newline="") as fh:
            w=csv.writer(fh); w.writerow(COLS)
            for row in trace: w.writerow(row)
        report["trace_csv_gz"]=name
    print(f"FINAL {cond} dur={dur}ms classe={a['classe']} "
          f"ramos={a['ramos']} relacoes={a['relacoes']} "
          f"brotos={stats['brotos_A']+stats['brotos_B']} "
          f"estaveis={stats['estabilizacoes_A']+stats['estabilizacoes_B']} "
          f"maxA={stats['max_ramos_A']} maxB={stats['max_ramos_B']} "
          f"paradas300={stats['paradas_limite_total_300']} "
          f"exato={'SIM' if not dif else 'NAO'} "
          f"original={s_original:.3f}s instrumentado={s_instrumentado:.3f}s",flush=True)
    print(f"CONTADORES {cond} {dur}ms "
          f"pulsos={count['pulsos_processados']} pares={count['pares_examinados']} "
          f"passaW={count['passa_W']} ({count['fracao_W']:.4f}) "
          f"V_iter={count['iteracoes_internas_V']} "
          f"V_iter_por_call={count['iteracoes_por_V']:.2f} "
          f"exc_ativas={count['excitacoes_ativas']} "
          f"inh_ativas={count['inibicoes_ativas']} "
          f"T_distintos_por_pulso={count['T_distintos_por_pulso_media']:.2f}", flush=True)
    for ep in count["episodios"]:
        print("EPISODIO "+json.dumps(ep,ensure_ascii=False),flush=True)
    for name,t in times.items():
        print(f"PERFIL {cond} {dur}ms {name} {t['segundos']:.4f}s {t['pct']:.2f}%",flush=True)
    out=f"escala-medidas-{cond}-{int(dur)}ms.json"
    Path(out).write_text(json.dumps(report,ensure_ascii=False,indent=2))
    print(f"SAIDA={out}",flush=True)
    if dif:
        raise SystemExit(2)
    return report


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument("--duracao-ms",type=float,required=True)
    parser.add_argument("--cond",default="I1",choices=base.CASES)
    parser.add_argument("--trace",action="store_true")
    args=parser.parse_args()
    print(f"INICIO cond={args.cond} duracao={args.duracao_ms}ms "
          f"commit={os.getenv('GITHUB_SHA','local')} Python={sys.version.split()[0]} "
          f"Numba={numba.__version__} numpy={np.__version__}",flush=True)
    with tempfile.TemporaryDirectory() as tmp:
        mod=carregar(tmp)
        run(args.cond,args.duracao_ms,mod,args.trace)


if __name__=="__main__":
    main()

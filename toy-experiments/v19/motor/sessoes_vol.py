"""V0.19 — ENTRADA VOLUMÉTRICA (sdom_vol + nucleo). Saídas com prefixo V19_PREFIXO (padrão "vol").

Texto do executor planar:
V0.19 — apresentações completas, em sequência, no MESMO Sdom (ele não zera entre apresentações) [R 27/11].

Uso: python sessoes.py <ouvido: esq|dir> <grav1> <grav2> ...
- A borda da V0.18 é calculada em blocos de 20 s (com 0,5 s de aquecimento dos filtros, descartado) e consumida na hora:
  a peça inteira não cabe em disco [M, piloto]. O estado da borda continua entre blocos (como na V0.18).
- O Sdom continua de onde parou: mesmas Uints, ramos, pares, heap de eventos.
- Entre apresentações: 1 min de silêncio [R 27/11; o calendário completo ainda não foi decidido]; sem atividade espontânea,
  nada acontece no silêncio (só as reservas se recuperam).
- Retomável: a cada bloco, se passou do tempo-limite (V19_LIMITE, s), grava o estado em dados/estado-<ouvido>.pkl e sai com
  código 3; a próxima execução continua exatamente dali (o Sdom não zera).
- Ganho de calibração: mesma regra da V0.18 (trecho mais forte da peça = 85 dB SPL), calculado aqui e guardado em
  motor/dados (não escreve na pasta da V0.18).
Grava: dados/sessoes-<ouvido>.npz (instantâneos por apresentação) e dados/estado-<ouvido>.npz (para continuar depois)."""
import os, sys, time, json, pathlib, pickle
os.environ.setdefault("NUMBA_CACHE_DIR", "/tmp/numba-v19-vol")
import numpy as np
from numba import types
from numba.typed import Dict

AQUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(AQUI))
import instante_zero as iz, nucleo as nu, sdom_vol as sdom
PRE = os.environ.get('V19_PREFIXO', 'vol')
V18 = AQUI.parents[1] / "v18" / "borda"
sys.path.insert(0, str(V18))
import cena, coclea, pontos, motor as m18

DADOS = AQUI / "dados"; DADOS.mkdir(exist_ok=True)
OBS0 = np.array([0, 0, 0, 0, 0, 0, 1e18, 1e18], float); LOGC0 = np.zeros((1, 4))   # sem janela de observação aqui
BLOCO = float(os.environ.get("V19_BLOCO", "20")); AQUEC, SILENCIO = 0.5, 60.0          # bloco só muda a memória, não o resultado
MAXU, MAXP, MAXR = int(os.environ.get("V19_MAXU", 200_000)), int(os.environ.get("V19_MAXP", 2_000_000)), int(os.environ.get("V19_MAXR", 6_000_000))

def ganho(grav):
    """Igual a v18/borda/cena.ganho_calibracao, com o cache em motor/dados."""
    cache = DADOS / f"ganho-{pathlib.Path(grav).stem}.txt"
    if cache.exists(): return float(cache.read_text().split()[0])
    L, R = cena.ler(gravacao=grav)
    o = cena.ouvidos([(L, cena.NEAR), (R, cena.FAR)])
    n = int(cena.JANELA_PICO * cena.FS); best = 0.0
    for ear in o:
        x2 = o[ear] ** 2; cs = np.concatenate(([0.0], np.cumsum(x2)))
        best = max(best, np.sqrt((cs[n:] - cs[:-n]) / n).max())
    g = cena.P_REF * 10 ** (cena.PICO_DB / 20) / best
    cache.write_text(f"{float(g)!r} Pa/unidade (regra da V0.18: trecho mais forte = {cena.PICO_DB} dB SPL)\n")
    return g
cena.ganho_calibracao = ganho          # só nesta execução; o arquivo da V0.18 não muda

def duracao(grav):
    import subprocess
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(grav)],
                                capture_output=True, text=True).stdout)

def main(ouvido, gravs):
    lado = -1 if ouvido == "esq" else 1
    P = pontos.construir(); par = json.loads((V18 / "calibracao.json").read_text())["parametros"]
    x, y, z, banda, posto = iz.faixa(P, lado)
    g = nu.geometria(x, y, z, banda, lado)
    ux, uy, uz, TG, g0 = g["ux"], g["uy"], g["uz"], g["TG"], g["g0"]
    fptr = g["fptr"].astype(np.int64); tatr = g["atr"] * sdom.CUBO_S
    cap = np.array([len(p["limiar_db"]) for p in P]); off = np.concatenate(([0], np.cumsum(cap)[:-1]))
    NF, NU = len(x), len(ux); NT = len(g["fib"]); N = NT
    E = NT + MAXU
    S = dict(ex=np.zeros(E, np.int64), ey=np.zeros(E, np.int64), ez=np.zeros(E, np.int64), eu=np.full(E, -1, np.int64))
    S["ex"][:NT], S["ey"][:NT], S["ez"][:NT], S["eu"][:NT] = g["tx"], g["ty"], g["tz"], g["tu"]
    mem = np.full((NU, sdom.MAXM), -1, np.int64); nmem = np.zeros(NU, np.int64)
    for i in range(NT):
        u0 = g["tu"][i]
        if nmem[u0] < sdom.MAXM: mem[u0, nmem[u0]] = i; nmem[u0] += 1
        else: S["eu"][i] = -1
    pslot = Dict.empty(key_type=types.int64, value_type=types.int64); lastf = np.full(E, -1e9)
    rf_s = np.zeros((NU, sdom.RF), np.int64); rf_t = np.full((NU, sdom.RF), -1e9); rf_n = np.zeros(NU, np.int64)
    cubos = Dict.empty(key_type=types.int64, value_type=types.int64)
    for U in range(NU): cubos[int(sdom._chave(int(ux[U]), int(uy[U]), int(uz[U])))] = -2 - U
    A = lambda n, t=np.int64, v=0: np.full(n, v, t)
    p_ = [A(MAXP), A(MAXP), A(MAXP), A(MAXP), np.zeros(MAXP), np.zeros(MAXP), A(MAXP), A(MAXP), A(MAXP), np.zeros((MAXP, sdom.MAXVAR), np.int64)]
    r_ = [A(MAXR), A(MAXR), A(MAXR), np.zeros(MAXR), np.zeros(MAXR), A(MAXR, np.int8), A(MAXR), A(MAXR, np.int8),
          A(E, np.int64, -1), A(MAXR, np.int64, -1), np.full(MAXR, -1.0), A(E, np.int64, -1), A(MAXR, np.int64, -1)]
    R = sdom.RING
    u_ = [np.full((MAXU, R), -1e9), np.zeros((MAXU, R)), np.zeros((MAXU, R), np.int64), np.zeros((MAXU, R), np.int64),
          A(E), np.full(E, -1.0), np.full(E, -1.0), np.full(E, -1.0), np.ones(E), np.ones(E), np.zeros(E), A(E)]
    integ = np.zeros(1 << 24, np.int8); cont = np.zeros(len(sdom.CONTADORES), np.int64)
    tr_cnt = np.zeros(NF, np.int64); log_t = np.zeros((600_000, 3)); r_ch = np.zeros(MAXR, np.int64)
    log_r = np.zeros((1, 5)); log_u = np.zeros((MAXU, 5)); log_s = np.zeros((1, 3)); log_f = np.zeros((1, 2))
    H = sdom.HCAP
    heap = [np.empty(H), np.empty(H, np.int8), np.empty(H, np.int64), np.empty(H, np.int64), np.empty(H, np.int64), np.empty(H)]
    glob = np.array([0, 0, 1 << 40], np.int64)
    PG = m18.lambdas(1.0, par["tcG"], par["tdG"], par["MG"])
    ne, npar, nr = N, 0, 0
    T0 = 0.0; inst = []; t_ini = time.time()
    log = open(DADOS / f"{PRE}-sessoes-{ouvido}.log", "a")
    def chamar(ev_t, ev_p, ev_m, t_fim):
        nonlocal ne, npar, nr
        ser = np.zeros((40, 5))
        ne, npar, nr = sdom.simular(ev_t, ev_p, ev_m, lado, fptr, tatr, NT, ux, uy, uz, TG, g0, PG, par["fG"],
                                    S["ex"], S["ey"], S["ez"], S["eu"], mem, nmem, pslot, lastf, cubos, rf_s, rf_t, rf_n, *p_, *r_, *u_,
                                    integ, cont, ser, log_r, log_u, log_s, log_f, t_fim, sdom.J_RAPIDA, *heap, glob,
                                    float(ev_t[0]) if len(ev_t) else t_fim, ne, npar, nr, OBS0, LOGC0, tr_cnt, log_t, r_ch)
    LIMITE = float(os.environ.get("V19_LIMITE", "1e9")); SALVAR_CADA = float(os.environ.get("V19_SALVAR", "300")); ult_salvo = [time.time()]
    CK = DADOS / f"{PRE}-estado-{ouvido}.pkl"
    E_ = ["ex", "ey", "ez", "eu"]
    def salvar(ap, ini, B, c0, ne0, nr0):
        nU = ne - N; nh = int(glob[0])
        st = dict(ne=ne, npar=npar, nr=nr, T0=T0, ap=ap, ini=ini, inst=inst, B=B, c0=c0, ne0=ne0, nr0=nr0, gravs=[str(g) for g in gravs],
                  S={k: S[k][:ne].copy() for k in E_}, mem=mem, nmem=nmem, pslot=(np.array(list(pslot.keys()), np.int64), np.array(list(pslot.values()), np.int64)), rf=(rf_s, rf_t, rf_n), lastf=lastf[:ne].copy(),
                  p_=[a_[:npar].copy() for a_ in p_], r_=[(a_[:ne] if a_.shape[0] == E else a_[:nr]).copy() for a_ in r_],
                  u_=[(a_[:nU] if i < 4 else a_[:ne]).copy() for i, a_ in enumerate(u_)], integ=integ, cont=cont, tr_cnt=tr_cnt.copy(), log_t=log_t[:cont[18]].copy(), r_ch=r_ch[:nr].copy(),
                  log_u=log_u[:nU].copy(), heap=[h[:nh].copy() for h in heap], glob=glob, tempo=time.time() - t_ini + t_antes)
        tmp = CK.with_suffix(".tmp")
        with open(tmp, "wb") as f: pickle.dump(st, f, protocol=5)
        os.replace(tmp, CK)
    ap0, ini0, B0, t_antes = 0, 0.0, None, 0.0
    if CK.exists():
        with open(CK, "rb") as f: st = pickle.load(f)
        assert st["gravs"] == [str(g) for g in gravs], "o estado salvo é de outra sequência de gravações"
        ne, npar, nr, T0, inst = st["ne"], st["npar"], st["nr"], st["T0"], st["inst"]
        for k in E_: S[k][:ne] = st["S"][k]
        mem[:] = st["mem"]; nmem[:] = st["nmem"]; lastf[:ne] = st["lastf"]
        for k_, v_ in zip(*st["pslot"]): pslot[int(k_)] = int(v_)
        rf_s[:], rf_t[:], rf_n[:] = st["rf"]
        for a_, v in zip(p_, st["p_"]): a_[:len(v)] = v
        for a_, v in zip(r_, st["r_"]): a_[:len(v)] = v
        for a_, v in zip(u_, st["u_"]): a_[:len(v)] = v
        integ[:] = st["integ"]; cont[:] = st["cont"]; log_u[:ne - N] = st["log_u"]
        tr_cnt[:] = st["tr_cnt"]; log_t[:len(st["log_t"])] = st["log_t"]; r_ch[:len(st["r_ch"])] = st["r_ch"]
        for h, v in zip(heap, st["heap"]): h[:len(v)] = v
        glob[:] = st["glob"]
        for i in range(N, ne): cubos[int(sdom._chave(int(S["ex"][i]), int(S["ey"][i]), int(S["ez"][i])))] = i
        ap0, ini0, B0, t_antes = st["ap"], st["ini"], st["B"], st["tempo"]
        c0_salvo, ne0_salvo, nr0_salvo = st["c0"], st["ne0"], st["nr0"]
        print(f"{ouvido} retomado: apresentação {ap0 + 1}, {ini0:.1f} s | Uints {ne - N} ramos {nr}", file=log, flush=True)
    for ap, grav in enumerate(gravs):
        if ap < ap0:
            continue
        dur = min(duracao(grav), float(os.environ.get("V19_MAXDUR", "1e9")))
        if ap == ap0 and B0 is not None:
            B, ini, c0, ne0, nr0 = B0, ini0, c0_salvo, ne0_salvo, nr0_salvo
        else:
            B = m18.Borda(P, par); c0 = cont.copy(); ne0, nr0 = ne, nr; ini = 0.0
        while ini < dur - 1e-6:
            if time.time() - ult_salvo[0] > SALVAR_CADA:
                salvar(ap, ini, B, c0, ne0, nr0); ult_salvo[0] = time.time()
                print(f"{ouvido} estado salvo: apresentação {ap + 1}, {ini:.1f} s", file=log, flush=True)
            if time.time() - t_ini > LIMITE:
                salvar(ap, ini, B, c0, ne0, nr0)
                print(f"{ouvido} pausa (estado salvo): apresentação {ap + 1}, {ini:.1f} s", file=log, flush=True)
                sys.exit(3)
            fim = min(ini + BLOCO, dur); a0 = max(0.0, ini - AQUEC)
            mic, _, nivel = cena.microfones(a0, fim - a0, str(grav), cru=True)
            aten = coclea.atenuacao_reflexo(nivel)
            Dfull = coclea.comando(mic[ouvido], reflexo_db=aten)
            w = int(round((ini - a0) * cena.FS)); n = int(round((fim - ini) * cena.FS))
            D = Dfull[:, w:w + n]
            ev = B.rodar(D, ini, cap=int(os.environ.get("V19_CAP", 3_000_000)))
            T = np.concatenate([e[0] for e in ev]); F = np.concatenate([np.full(len(e[0]), b) for b, e in enumerate(ev)])
            K = np.concatenate([e[1] for e in ev]).astype(np.int64); M = np.concatenate([e[2] for e in ev]).astype(np.float64)
            o = np.argsort(T, kind="stable")
            chamar(T[o] + T0, off[F[o]] + K[o], M[o], T0 + fim)
            print(f"{ouvido} ap{ap + 1} {pathlib.Path(grav).stem} {fim:6.1f}/{dur:.1f} s | Uints {ne - N} ramos {nr} "
                  f"disparos {cont[12]} | {time.time() - t_ini + t_antes:.0f} s", file=log, flush=True)
            ini = fim
        chamar(np.zeros(0), np.zeros(0, np.int64), np.zeros(0), T0 + dur + 0.2)       # termina o que ficou no heap
        inst.append(dict(apresentacao=ap + 1, gravacao=pathlib.Path(grav).stem, inicio=T0, dur=dur, ne=int(ne), nr=int(nr),
                         uints=int(ne - N), uints_novas=int(ne - ne0), ramos=int(nr), ramos_novos=int(nr - nr0),
                         contadores={k: int(v) for k, v in zip(sdom.CONTADORES, cont - c0)},
                         u_nin=u_[11][N:ne].copy(), r_part=r_[6][:nr].copy(), tr=tr_cnt.copy(), rch=r_ch[:nr].copy()))
        T0 += dur + SILENCIO
        salvar(ap + 1, 0.0, None, cont.copy(), ne, nr)
    np.savez_compressed(DADOS / f"{PRE}-sessoes-{ouvido}.npz", N=N, NF=NF, px=x, py=y, pz=z, t_fib=g["fib"], tx=g["tx"], ty=g["ty"], tz=g["tz"], t_sub=g["sub"], lados=np.array(g["lados"]), ux=ux, uy=uy, uz=uz,
                        ex=S["ex"][N:ne], ey=S["ey"][N:ne], ez=S["ez"][N:ne], log_u=log_u[:ne - N],
                        r_src=r_[0][:nr], r_dst=r_[1][:nr], r_len=r_[2][:nr], r_ok=r_[5][:nr], r_born=r_[10][:nr], r_f=r_[4][:nr],
                        r_sem=r_[7][:nr], log_t=log_t[:cont[18]], nervo=sdom.NERVO, tr_passos=sdom.TR_PASSOS, x0=g['x0'],
                        **{f"ap{i['apresentacao']}_tr": i.pop("tr") for i in inst},
                        **{f"ap{i['apresentacao']}_rch": i.pop("rch") for i in inst},
                        **{f"ap{i['apresentacao']}_u_nin": i.pop("u_nin") for i in inst},
                        **{f"ap{i['apresentacao']}_r_part": i.pop("r_part") for i in inst},
                        resumo=json.dumps(inst))
    (DADOS / f"{PRE}-sessoes-{ouvido}.json").write_text(json.dumps(inst, ensure_ascii=False, indent=1))
    print("fim", ouvido, f"{time.time() - t_ini + t_antes:.0f} s", file=log, flush=True)

if __name__ == "__main__":
    main(sys.argv[1], [pathlib.Path(g).resolve() for g in sys.argv[2:]])

"""Ensaio mínimo, parte 2, rodada 2 — par de vias com as decisões D20–D23 (16/11/2026).
Controle de engenharia; não é a V0.17. Uso: python3 -I par_de_vias_v2.py

Decididas [R]: D1–D9 (ver par_de_vias_vetorizado.py) e
  D20 desacerto −0,01 por chegada sem coincidência e meia-vida de 30 s, só para ramos instáveis;
  D21 força total de 1,0 por Upro, conservada entre os ramos;
  D23 brotar só após 5 repetições do mesmo quase-acerto e com força do ramo >= 0,3.
NÃO testada aqui: D22 (inibição). Com um único par e uma única Uint não há inibição lateral; e,
como o acerto (D2) é a coincidência dentro da janela, a inibição pré-alimentada (uma janela depois)
não muda o que é acerto. Falta decidir como a inibição age sobre o aprendizado.
Provisórias [A]: Uint criada na 1ª coincidência; brotos não duplicam a menos de 2%; contagens por
pulso de A; conservação aplicada reduzindo proporcionalmente os outros ramos quando a soma passa de 1,0;
o ramo nascido do broto começa com 0,1 (D3).
"""
import numpy as np

W, F0, DF = 0.21, 0.1, 0.065
DESAC, MEIA, TOTAL = 0.01, 30_000.0, 1.0
DMIN, DMAX, NINI, PASSO, DEDUP = 0.5, 20.0, 6, 0.10, 0.02
NQUASE, FBROTO = 5, 0.3
EST_SEP, SOME = 120_000.0, 600_000.0
DELTA, JIT = 0.458, 0.02
DUR, CICLO = 20_000.0, 180_000.0

class Upro:
    def __init__(s):
        s.d = [DMIN * (DMAX / DMIN) ** (k / (NINI - 1)) for k in range(NINI)]
        s.f = [F0] * NINI; s.first = [None] * NINI; s.last = [None] * NINI; s.nasc = [0.0] * NINI
    def estavel(s, i): return s.first[i] is not None and s.last[i] - s.first[i] >= EST_SEP
    def conservar(s, protegidos):
        tot = sum(s.f)
        if tot <= TOTAL: return
        livre = sum(f for i, f in enumerate(s.f) if i not in protegidos)
        excesso = tot - TOTAL
        if livre > 0:
            k = max(0.0, (livre - excesso) / livre)
            s.f = [f if i in protegidos else f * k for i, f in enumerate(s.f)]
    def brotar(s, i, t):
        novos = []
        for nd in (s.d[i] * (1 + PASSO), s.d[i] * (1 - PASSO)):
            if DMIN <= nd <= DMAX and all(abs(x - nd) > DEDUP * nd for x in s.d):
                s.d.append(nd); s.f.append(F0); s.first.append(None); s.last.append(None); s.nasc.append(t)
                novos.append(len(s.d) - 1)
        s.conservar(set(novos))
    def decair(s, dt):
        k = 2 ** (-dt / MEIA)
        s.f = [f if s.estavel(i) else f * k for i, f in enumerate(s.f)]
    def podar(s, t):
        keep = [i for i in range(len(s.d)) if s.estavel(i) or (t - (s.last[i] if s.last[i] is not None else s.nasc[i])) < SOME]
        for nome in ("d", "f", "first", "last", "nasc"):
            v = getattr(s, nome); setattr(s, nome, [v[i] for i in keep])

def rodar(periodos, seed=1):
    rng = np.random.default_rng(seed); A, B = Upro(), Upro(); quase = {}; out = []
    for ep, P in enumerate(periodos):
        t0 = ep * CICLO; n = int(DUR / P) if P != "notas" else 0
        if ep > 0:
            A.decair(CICLO - DUR); B.decair(CICLO - DUR)        # silêncio entre episódios
        if P == "notas":                                   # período muda a cada 250 ms (como notas)
            base = []; t = 0.0
            while t < DUR:
                p_ = rng.uniform(2.5, 8.0); seg = np.arange(t, min(t + 250.0, DUR), p_); base.extend(seg); t += 250.0
            base = np.array(base); n = base.size
        else:
            base = np.arange(n) * P
        tA = t0 + base + rng.normal(0, JIT, n)
        tB = t0 + base + DELTA + rng.normal(0, JIT, n)
        cred = {}
        for idx, t in enumerate(tA):
            dtp = (tA[idx] - tA[idx - 1]) if idx > 0 else 0.0
            a = np.array(A.d); b = np.array(B.d); alvo = (t + a)[:, None] - b[None, :]
            k = np.clip(np.searchsorted(tB, alvo), 1, n - 1)
            gap = np.minimum(np.abs(tB[k] - alvo), np.abs(tB[k - 1] - alvo))
            hit = gap <= W; near = (gap > W) & (gap <= 3 * W)
            hA = set(np.nonzero(hit.any(1))[0]); hB = set(np.nonzero(hit.any(0))[0])
            for U, hs in ((A, hA), (B, hB)):
                for i in range(len(U.d)):
                    if i in hs:
                        U.f[i] = min(TOTAL, U.f[i] + DF); U.last[i] = t
                        if U.first[i] is None: U.first[i] = t
                    elif not U.estavel(i):
                        U.f[i] = max(0.0, U.f[i] - DESAC)
                U.conservar(hs); U.decair(dtp)
            if idx >= n - 200:
                for i, j in zip(*np.nonzero(hit)):
                    o = round(a[i] - b[j], 2); cred[o] = cred.get(o, 0) + 1
            for i, j in zip(*np.nonzero(near)):
                key = (round(a[i], 4), round(b[j], 4)); quase[key] = quase.get(key, 0) + 1
                if quase[key] >= NQUASE:
                    quase[key] = 0
                    ia = A.d.index(a[i]) if a[i] in A.d else None; jb = B.d.index(b[j]) if b[j] in B.d else None
                    if ia is not None and A.f[ia] >= FBROTO: A.brotar(ia, t)
                    if jb is not None and B.f[jb] >= FBROTO: B.brotar(jb, t)
        tf = t0 + DUR; A.podar(tf); B.podar(tf)
        tot = sum(cred.values()) or 1; ver = sum(v for o, v in cred.items() if abs(o - DELTA) <= W)
        def resumo(U):
            fs = sorted(zip(U.f, U.d), reverse=True)[:3]
            return f"{len(U.d)} ramos ({sum(f >= 0.05 for f in U.f)} com força >= 0,05; {sum(U.estavel(i) for i in range(len(U.d)))} estáveis); maiores {[(round(d,2), round(f,2)) for f, d in fs]}"
        out.append(f"  ep {ep+1} P={P}: A {resumo(A)} | B {resumo(B)} | crédito na relação verdadeira {ver/tot:.2f} ({len(cred)} relações acertando)")
    return out

import sys
conds = [("período fixo 5 ms", [5.0] * 6), ("período variando por episódio", [5.0, 3.7, 6.3, 4.4, 7.1, 5.6]),
         ("período mudando a cada 250 ms", ["notas"] * 6)]
for nome, per in conds[int(sys.argv[1]):int(sys.argv[2])] if len(sys.argv) > 2 else conds:
    print(nome, flush=True)
    for linha in rodar(per): print(linha, flush=True)

"""V0.18 — calibrações da borda, com tons constantes (antes de qualquer Bach). Grava calibracao.json e calibracao.md.
Alvos (especificação, seções 6 e 7):
1. Unidade do acumulador: um ponto transdutivo logo acima do limiar emite uma vez por ciclo nos graves.
   Operacionalização [A]: o ponto mais sensível da faixa mais próxima de 125 Hz, com tom na frequência central a +1 dB
   do seu limiar, completa exatamente uma unidade por ciclo (unidade = 0,9 × excesso relativo acumulado num ciclo).
2. Tamanho da reserva lenta da Utrd (M): teto sustentado de ~200/s com som forte (tom de 4 kHz, +40 dB sobre o ponto).
3. Fração gasta do g da Upro (f): queda de ~38% (meio de 35–40%) ao fim de 1 s de incidências a 100/s.
   Tamanho do compartimento lento do g: M_g = 1 [A, provisório]."""
import json, numpy as np
from scipy.optimize import brentq
import coclea, pontos, motor

FS = coclea.FS
P = pontos.construir(); FC = coclea.centros()
par = dict(tcU=16.5e-3, tcU3=40e-3, tdU=0.100, MU=None, tcG=25e-3, tdG=2.0, MG=1.0, fG=None, U=None)

def tom(f, db, dur):
    t = np.arange(int(dur * FS)) / FS
    return coclea.limiar_pa(db) * np.sin(2 * np.pi * f * t)          # amplitude de pico

def comando_faixa(b, x):
    from scipy.signal import sosfilt
    return sosfilt(coclea._SOS_FASE, np.maximum(coclea.filtrar(b, x), 0)) / coclea._kappa()[b]

# 1. unidade
b1 = int(np.argmin(abs(FC - 125))); f1 = FC[b1]; th_db = P[b1]["limiar_db"][0]
d = comando_faixa(b1, tom(f1, th_db + 1.0, 0.5)); th = coclea.limiar_pa(th_db)
ex = np.maximum(d / th - 1, 0) / FS
nper = FS / f1; i0 = int(0.3 * FS); ciclos = int((len(d) - i0) / nper) - 1
por_ciclo = np.sum(ex[i0:i0 + int(ciclos * nper)]) / ciclos
par["U"] = 0.9 * por_ciclo

def rodar_tom(b, f, db_rel, dur, ponto=0, par=par, so_ponto=True):
    th_db = P[b]["limiar_db"][ponto]
    d = comando_faixa(b, tom(f, th_db + db_rel, dur))
    pp = dict(P[b]);
    if so_ponto:
        pp = dict(fc=P[b]["fc"], zero=P[b]["zero"], limiar_db=P[b]["limiar_db"][ponto:ponto + 1], area=P[b]["area"][ponto:ponto + 1],
                  refr=P[b]["refr"][ponto:ponto + 1])
    B = motor.Borda([pp], par)
    ev = B.rodar(d[None, :], 0.0)[0]
    return ev, B.cont[0].copy()

# 2. M da Utrd: taxa sustentada (de 0,5 a 1,0 s) com tom forte de 4 kHz no ponto mais sensível
b2 = int(np.argmin(abs(FC - 4000))); f2 = FC[b2]
def taxa_sust(MU):
    ev, c = rodar_tom(b2, f2, 40.0, 1.0, par=dict(par, MU=MU, fG=0.0))
    t = ev[0]; return np.sum((t > 0.5) & (t < 1.0)) / 0.5
taxas = {M: taxa_sust(M) for M in [1, 2, 5, 10, 20, 50, 100, 1000]}
alvo = 200.0
Ms = sorted(taxas); ok = [m for m in Ms if taxas[m] >= alvo]
if ok:
    lo = max([m for m in Ms if taxas[m] < alvo] or [Ms[0]]); hi = min(ok)
    for _ in range(25):
        mid = np.sqrt(lo * hi)
        if taxa_sust(mid) < alvo: lo = mid
        else: hi = mid
    par["MU"] = hi
else:
    par["MU"] = Ms[-1]

# conferência da unidade: emissões por ciclo a +1 dB
ev, c = rodar_tom(b1, f1, 1.0, 0.5, par=dict(par, fG=0.0))
t = ev[0]; t = t[t > 0.3]
emis_ciclo = len(t) / ((0.5 - 0.3) * f1)
# e a +3, +6 e +10 dB
emis_rel = {}
for dbr in (3.0, 6.0, 10.0, 20.0):
    evr, _ = rodar_tom(b1, f1, dbr, 0.5, par=dict(par, fG=0.0)); tr = evr[0]; emis_rel[f"+{dbr:.0f} dB"] = np.sum(tr > 0.3) / ((0.5 - 0.3) * f1)

# 3. f do g: trem a 100/s por 1 s
PG = motor.lambdas(1.0, par["tcG"], par["tdG"], par["MG"])
def g_trem(f, n, isi=0.01):
    gq, gs = 1.0, 1.0; out = []
    for i in range(n):
        if i: gq, gs = motor.avancar(gq, gs, isi, 1.0, PG)
        out.append(gq); gq = gq - f * gq
    return np.array(out)
par["fG"] = brentq(lambda f: g_trem(f, 100)[-1] - 0.62, 1e-4, 0.9)
gt = g_trem(par["fG"], 1000)

# curso temporal da Utrd com os valores calibrados (tom forte de 4 kHz, ponto mais sensível)
ev, c = rodar_tom(b2, f2, 40.0, 1.0, par=dict(par))
te = ev[0]
def taxa(a, b): return np.sum((te >= a) & (te < b)) / (b - a)
curso = {f"{a*1000:.0f}-{b*1000:.0f} ms": taxa(a, b) for a, b in [(0, .002), (0, .005), (.005, .02), (.02, .05), (.05, .1), (.1, .2), (.2, .5), (.5, 1.0)]}
# área de som forte: ponto da área 3, tom forte
k3 = int(np.where(P[b2]["area"] == 3)[0][0])
ev3, c3 = rodar_tom(b2, f2, 40.0, 1.0, ponto=k3, par=dict(par))
t3 = ev3[0]; taxa3 = np.sum((t3 > 0.5) & (t3 < 1.0)) / 0.5

res = dict(parametros=par, unidade=dict(faixa=b1 + 1, fc=f1, limiar_db=th_db, excesso_por_ciclo=por_ciclo, emissoes_por_ciclo_a_1dB=emis_ciclo, emissoes_por_ciclo_acima=emis_rel),
           reserva_utrd=dict(faixa=b2 + 1, fc=f2, taxas_por_M={str(k): v for k, v in taxas.items()}, curso_4kHz_40dB=curso,
                             contadores_4kHz=dict(emitidas=int(c[0]), repassadas=int(c[1]), bloq_refr=int(c[2]), sem_reserva=int(c[3])),
                             taxa_sustentada_area3=taxa3),
           reserva_upro=dict(g_apos_20=float(gt[19]), g_apos_100=float(gt[99]), g_apos_1000=float(gt[999])))
json.dump(res, open("calibracao.json", "w"), indent=1, default=float)
print(json.dumps(res, indent=1, default=float))

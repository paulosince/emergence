"""V0.18 — calibrações da borda, com tons constantes (antes de qualquer obra). Grava calibracao.json.
Revisão de 19/11 (responsável: "emissão proporcional à reserva"): o acumulador soma excesso_saturado × reserva/capacidade.
Alvos:
1. Unidade do acumulador (U): o ponto mais sensível da faixa de ~117 Hz, com tom a +1 dB do limiar, emite 1 vez por ciclo.
2. Saturação do excesso (emax): com som forte e reserva cheia, a primeira emissão depois da do início vem a ~1 ms
   (taxa de início ~1.000/s) [A: alvo do assistente, de memória das curvas de adaptação do nervo auditivo do gato; a conferir].
3. Reserva lenta da Utrd (M): teto sustentado de ~200/s (0,5–1 s) com som forte; se inalcançável com os números aprovados,
   usa o maior M testado e registra.
4. Fração gasta do g da Upro (f): queda de ~38% ao fim de 1 s a 100/s (M_g = 1, provisório).
Tons calibrados no domínio da cóclea (Pa no tímpano, sem o microfone), sem compressão nem atenuação. A compressão e a
atenuação ficam fora da calibração e entram nas obras."""
import json, numpy as np
from scipy.optimize import brentq
from scipy.signal import sosfilt
import coclea, pontos, motor

FS = coclea.FS
P = pontos.construir(); FC = coclea.centros()
R_INICIO = 1000.0
# Janela de carregamento que se alonga com o uso (19/11; escolhida pelo responsável; pôster de Bruce, Erfani e
# Zilany 2017, preliminar): base 14 ms, +0,4 ms por reposição, volta em 60 ms (a média em atividade fica perto dos 16–17 ms
# do artigo de 2018). Área de som forte: base de 40 ms (suposição de 18/11), mesmo crescimento.
par = dict(tcU=16.5e-3, tcU3=40e-3, tau0U=14e-3, ttauU=0.060, dtauU=0.4e-3, tdU=0.100, MU=400.0, tcG=25e-3, tdG=2.0, MG=1.0, fG=0.0, U=1e-4, emax=0.0)

def tom(f, db, dur):
    t = np.arange(int(dur * FS)) / FS
    return coclea.limiar_pa(db) * np.sin(2 * np.pi * f * t)

def comando_faixa(b, x):
    return sosfilt(coclea._SOS_FASE, np.maximum(coclea.filtrar(b, x), 0)) / coclea._kappa()[b]

_cache = {}
def rodar_tom(b, f, db_rel, dur, ponto=0, par=par):
    th_db = P[b]["limiar_db"][ponto]
    chave = (b, round(f, 3), db_rel, dur, ponto)
    if chave not in _cache: _cache[chave] = comando_faixa(b, tom(f, th_db + db_rel, dur))
    d = _cache[chave]
    pp = dict(fc=P[b]["fc"], zero=P[b]["zero"], limiar_db=P[b]["limiar_db"][ponto:ponto + 1], area=P[b]["area"][ponto:ponto + 1],
              refr=P[b]["refr"][ponto:ponto + 1])
    B = motor.Borda([pp], par)
    ev = B.rodar(d[None, :], 0.0)[0]
    return ev, B.cont[0].copy()

b1 = int(np.argmin(abs(FC - 125))); f1 = FC[b1]
b2 = int(np.argmin(abs(FC - 4000))); f2 = FC[b2]
def emis_ciclo(p, dbr=1.0):
    ev, _ = rodar_tom(b1, f1, dbr, 0.6, par=p); t = ev[0]
    return np.sum((t > 0.3) & (t < 0.6)) / (0.3 * f1)
def taxa_inicio(p):
    ev, _ = rodar_tom(b2, f2, 40.0, 0.05, par=p); t = ev[0]
    return 1 / (t[1] - t[0]) if len(t) > 1 else 0.0
def taxa_sust(p):
    ev, _ = rodar_tom(b2, f2, 40.0, 1.0, par=p); t = ev[0]
    return np.sum((t > 0.5) & (t < 1.0)) / 0.5

def bissec_log(fun, alvo, lo, hi, n=30, crescente=True):
    for _ in range(n):
        mid = np.sqrt(lo * hi); v = fun(mid)
        if (v < alvo) == crescente: lo = mid
        else: hi = mid
    return np.sqrt(lo * hi)

def U_graves(p):
    return bissec_log(lambda U: emis_ciclo(dict(p, U=U)), 1.0, 1e-8, 1e-1, crescente=False, n=34)
def inicio_com(p, e):
    q = dict(p, emax=e); q["U"] = U_graves(q); return taxa_inicio(q), q["U"]
# emax: a taxa de início (1/primeiro intervalo) não varia de forma monotônica com emax (U amarrado à regra dos graves):
# ~1.050/s em emax = 0,001; ~1.500/s em 0,03; ~1.140/s em 0,1; cai para ~200/s a partir de 0,3, porque a segunda emissão
# passa a cair dentro da janela de refratariedade. Escolha do assistente: emax = 0,1 (início ~1.100/s; resposta graduada
# ao longo de ~1 dB acima do limiar). Varredura registrada em "varredura_emax".
varredura = {}
for e in (1e-3, 1e-2, 0.03, 0.1, 0.3, 1.0):
    r, u = inicio_com(par, e); varredura[str(e)] = dict(inicio=r, U=u)
par["emax"] = 0.1
par["U"] = U_graves(par)
taxas = {M: taxa_sust(dict(par, MU=M)) for M in [3, 10, 30, 100, 300, 1000, 1e4]}
if max(taxas.values()) >= 200: par["MU"] = bissec_log(lambda M: taxa_sust(dict(par, MU=M)), 200.0, 1.0, 1e4)
else: par["MU"] = 1e4
par["U"] = U_graves(par)
hist = varredura

PG = motor.lambdas(1.0, par["tcG"], par["tdG"], par["MG"])
def g_trem(f, n, isi=0.01):
    gq, gs = 1.0, 1.0; out = []
    for i in range(n):
        if i: gq, gs = motor.avancar(gq, gs, isi, 1.0, PG)
        out.append(gq); gq = gq - f * gq
    return np.array(out)
par["fG"] = brentq(lambda f: g_trem(f, 100)[-1] - 0.62, 1e-4, 0.9)
gt = g_trem(par["fG"], 1000)

ev, c = rodar_tom(b2, f2, 40.0, 1.0, par=par); te = ev[0]
def taxa(a, b): return np.sum((te >= a) & (te < b)) / (b - a)
janelas = [(0, .002), (.002, .005), (.005, .01), (.01, .02), (.02, .05), (.05, .1), (.1, .2), (.2, .5), (.5, 1.0)]
curso = {f"{a*1000:.0f}-{b*1000:.0f} ms": taxa(a, b) for a, b in janelas}
k3 = int(np.where(P[b2]["area"] == 3)[0][0])
ev3, _ = rodar_tom(b2, f2, 40.0, 1.0, ponto=k3, par=par); t3 = ev3[0]
taxa3 = np.sum((t3 > 0.5) & (t3 < 1.0)) / 0.5
emis_rel = {f"+{d:g} dB": emis_ciclo(par, d) for d in (1.0, 3.0, 10.0, 20.0)}
nivel = {}
for d in (0.5, 1, 2, 5, 10, 20, 40):
    evn, _ = rodar_tom(b2, f2, float(d), 0.5, par=par); tn = evn[0]; nivel[f"+{d:g} dB"] = float(np.sum((tn > 0.2) & (tn < 0.5)) / 0.3)

res = dict(parametros=par, alvo_inicio=R_INICIO, varredura_emax=hist, taxa_inicio_final=taxa_inicio(par),
           unidade=dict(faixa=b1 + 1, fc=f1, emissoes_por_ciclo=emis_rel),
           reserva_utrd=dict(faixa=b2 + 1, fc=f2, taxas_sustentadas_por_M={str(k): v for k, v in taxas.items()}, curso_4kHz_40dB=curso,
                             contadores_4kHz=dict(emitidas=int(c[0]), repassadas=int(c[1]), bloq_refr=int(c[2]), sem_reserva=int(c[3])),
                             taxa_sustentada_area3=taxa3, taxa_por_nivel_4kHz=nivel),
           reserva_upro=dict(g_apos_20=float(gt[19]), g_apos_100=float(gt[99]), g_apos_1000=float(gt[999])))
json.dump(res, open("calibracao.json", "w"), indent=1, default=float)
print(json.dumps(res, indent=1, default=float))

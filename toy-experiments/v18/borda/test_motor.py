"""Testes de código da borda (especificação, seção 10). Uso: python test_motor.py"""
import json, numpy as np
import motor

FS = motor.FS
CAL = json.load(open("calibracao.json"))["parametros"]

def borda_um(theta, refr=0.39e-3, area=1, par=CAL):
    p = dict(limiar_db=np.array([0.0]), area=np.array([area], np.int8), refr=np.array([refr]))
    B = motor.Borda([p], par); B.P[0]["theta"][:] = theta
    return B

def ref_passo_a_passo(d, theta, refr, par, sub=200):
    """Referência independente: integra a reserva da Utrd (q, s, janela que se alonga) por Euler com sub-passos em toda
    amostra, sem fórmula fechada nem atalhos; mesma regra de emissão (excesso saturado × reserva/capacidade)."""
    U, emax = par["U"], par["emax"]; dt = 1 / FS; h = dt / sub
    tau0, ttau, dtau, td, M = par.get("tau0U", par["tcU"]), par.get("ttauU", 0.06), par.get("dtauU", 0.0), par["tdU"], par["MU"]
    q, s, tau, gq, gs = 4.0, 1.0, tau0, 1.0, 1.0; acc = 0.0; last_pass = -1.0; ev = []; gt = 0.0
    PG = motor.lambdas(1.0, par["tcG"], par["tdG"], par["MG"])
    prev_above = False
    for i, x in enumerate(d):
        if i > 0:
            for _ in range(sub):
                fl = (4.0 * s - q) / tau
                q += h * fl; s += h * ((1 - s) / td - fl / M); tau += h * ((tau0 - tau) / ttau + dtau * max(fl, 0.0))
        if x > theta:
            if not prev_above: acc = 0.0
            e = x / theta - 1; sat = emax * e / (emax + e) if emax > 0 else e
            inc = sat * dt * q / 4.0
            if acc + inc >= U:
                t = (i - 1 + (U - acc) / inc) * dt; acc = 0.0
                if q >= 1.0:
                    q -= 1.0
                    if t - last_pass >= refr:
                        gq, gs = motor.avancar(gq, gs, t - gt, 1.0, PG); ev.append((t, gq)); gq -= par["fG"] * gq; gt = t; last_pass = t
            else:
                acc += inc
            prev_above = True
        else:
            prev_above = False
    return np.array(ev)

def sinal(f=4000.0, dur=0.3, amp=0.05):
    t = np.arange(int(dur * FS)) / FS
    return amp * (1 + 0.5 * np.sin(2 * np.pi * 7 * t)) * (np.sin(2 * np.pi * f * t) > -2)   # envoltória lenta, sem fase

ok = True
def checa(nome, cond, extra=""):
    global ok; ok &= bool(cond); print(("OK   " if cond else "FALHA"), nome, extra)

# 1. eventos por fórmula fechada (preguiçosa) = integração passo a passo
d = sinal(); theta = 0.005
B = borda_um(theta); ev = B.rodar(d[None, :], 0.0)[0]
# (a) mesma discretização (um passo por amostra): o cálculo por eventos tem de reproduzir o passo a passo exatamente
R = ref_passo_a_passo(d, theta, 0.39e-3, CAL, sub=1)
n = min(len(ev[0]), len(R))
checa("mesmo número de incidências (preguiçoso × passo a passo)", len(ev[0]) == len(R), f"{len(ev[0])} × {len(R)}")
checa("mesmos instantes (|dif| < 1 amostra)", n > 0 and np.max(abs(ev[0][:n] - R[:n, 0])) < 1 / FS, f"máx {np.max(abs(ev[0][:n]-R[:n,0]))*1e6:.2f} µs")
# (b) integração fina (50 sub-passos): mesma contagem e taxa (empates no limiar podem deslocar uma emissão)
R2 = ref_passo_a_passo(d, theta, 0.39e-3, CAL, sub=50)
checa("integração fina: mesma contagem (±1) e taxa média (±1%)", abs(len(R2) - len(ev[0])) <= 1 and abs((R2[-1, 0] - R2[0, 0]) / (ev[0][-1] - ev[0][0]) - 1) < 0.01,
      f"{len(ev[0])} × {len(R2)}")
checa("mesmas magnitudes (|dif| < 1e-3)", n > 0 and np.max(abs(ev[2][:n] - R[:n, 1])) < 1e-3, f"máx {np.max(abs(ev[2][:n]-R[:n,1])):.2e}")

# 1b. com pausas (exercita o atalho de intervalos longos): mesma contagem (±1) e instantes próximos
tt = np.arange(len(d)) / FS
dg = d * ((np.sin(2 * np.pi * 9 * tt) > 0.3))
Bg = borda_um(theta); eg = Bg.rodar(dg[None, :], 0.0)[0]
Rg = ref_passo_a_passo(dg, theta, 0.39e-3, CAL, sub=1)
ng = min(len(eg[0]), len(Rg))
checa("com pausas: mesma contagem (±1) e mediana da diferença < 1 amostra", abs(len(eg[0]) - len(Rg)) <= 1 and ng > 0 and np.median(abs(eg[0][:ng] - Rg[:ng, 0])) < 1 / FS,
      f"{len(eg[0])} × {len(Rg)}")

# 2. abaixo do limiar: nada
B = borda_um(1.0); ev = B.rodar(d[None, :], 0.0)[0]
checa("sinal abaixo do limiar não emite", len(ev[0]) == 0 and B.cont[0].sum() == 0)

# 3. janela de refratariedade: só bloqueia
B = borda_um(theta, refr=5e-3); ev = B.rodar(d[None, :], 0.0)[0]
checa("nenhum repasse com intervalo menor que a janela de refratariedade", np.all(np.diff(ev[0]) >= 5e-3))
checa("incidências bloqueadas são contadas e não repassadas", B.cont[0][2] > 0 and B.cont[0][1] == len(ev[0]) and B.cont[0][0] == B.cont[0][1] + B.cont[0][2])

# 4. reserva de efeito da Utrd: com a reserva vazia, não emite
B = borda_um(theta); B.P[0]["q"][:] = 0.0; B.P[0]["s"][:] = 0.0; B.P[0]["iu"][:] = 0
ev = B.rodar(d[None, :2000], 0.0)[0]
checa("reserva vazia: nenhuma emissão no primeiro instante", len(ev[0]) == 0 or ev[0][0] > 1e-3, f"primeira em {ev[0][0]*1000 if len(ev[0]) else float('nan'):.2f} ms")
checa("tentativas sem reserva são contadas", B.cont[0][3] > 0)

# 5. reserva de efeito da Upro: magnitude cai com o uso e volta com o tempo
B = borda_um(theta); ev = B.rodar(d[None, :], 0.0)[0]
checa("magnitude começa em 1 e cai com repasses seguidos", abs(ev[2][0] - 1) < 1e-6 and ev[2][-1] < ev[2][0])
d2 = np.concatenate([d, np.zeros(int(10 * FS)), d[:2000]])
B = borda_um(theta); ev = B.rodar(d2[None, :], 0.0)[0]
mag_volta = ev[2][ev[0] > 10.2]
checa("depois de 10 s de silêncio a magnitude volta perto de 1 (janela de dispersão de 2 s)", len(mag_volta) > 0 and mag_volta[0] > 0.95, f"{mag_volta[0]:.3f}")

# 6. continuidade entre trechos: rodar em dois pedaços = rodar inteiro
B1 = borda_um(theta); e1 = B1.rodar(d[None, :], 0.0)[0]
B2 = borda_um(theta); h = 7001
ea = B2.rodar(d[None, :h], 0.0)[0]; eb = B2.rodar(d[None, h:], h / FS)[0]
checa("dois trechos = um trecho", np.allclose(np.concatenate([ea[0], eb[0]]), e1[0]) and np.allclose(np.concatenate([ea[2], eb[2]]), e1[2]))

print("\nTODOS OS TESTES PASSARAM" if ok else "\nHÁ FALHAS")

"""V0.18 — motor da borda auditiva, por eventos (estado de cada ponto transdutivo atualizado só quando preciso,
por fórmula fechada a partir do instante anterior; ideia do responsável). Só o sinal de comando é amostra a amostra.

Regras (especificação, seções 5–7):
- Utrd, por ponto transdutivo: acumula o excesso relativo (d/limiar − 1) enquanto o sinal está acima do limiar; zera
  quando cai abaixo; ao completar a unidade, tenta emitir. Emite se a reserva de efeito da Utrd tiver ao menos um
  ponto de liberação carregado (gasta 1); senão não emite (perda "reserva vazia"). Em ambos os casos o acumulado zera.
- Reserva de efeito (mesmo mecanismo nos dois lugares, decisão de 18/11): compartimento rápido q (capacidade Q) que se
  recarrega a partir de um compartimento lento s (fração 0–1) com a janela de carregamento; o lento se recarrega de
  fora com a janela de dispersão. dq/dt = (Q·s − q)/tc ; ds/dt = (1 − s)/td − (Q·s − q)/(tc·M). Linear: fórmula fechada.
  Utrd: Q = 4 pontos de liberação; emissão gasta 1. Upro: Q = 1 (é o g); cada repasse gasta a fração f do g atual.
- Upro (o ponto transdutivo que receberia): janela de refratariedade própria (só bloqueia); se passa, a magnitude
  repassada é o g atual (incidência chega com magnitude 1). Janela de propagação igual para todas (não altera nada aqui).
"""
import numpy as np
from numba import njit

FS = 48000.0

def lambdas(Q, tc, td, M):
    a11, a12, a21, a22 = -1 / tc, Q / tc, 1 / (tc * M), -1 / td - Q / (tc * M)
    tr, det = a11 + a22, a11 * a22 - a12 * a21
    r = np.sqrt(tr * tr / 4 - det)
    return np.array([a11, a12, a21, a22, tr / 2 + r, tr / 2 - r])

@njit(cache=True)
def avancar(q, s, dt, Q, P):
    """Estado (q, s) depois de dt sem gastos. P = [a11, a12, a21, a22, l1, l2]."""
    if dt <= 0.0:
        return q, s
    a11, a12, a21, a22, l1, l2 = P[0], P[1], P[2], P[3], P[4], P[5]
    e1, e2 = np.exp(l1 * dt), np.exp(l2 * dt)
    c0 = (l1 * e2 - l2 * e1) / (l1 - l2)
    c1 = (e1 - e2) / (l1 - l2)
    y0, y1 = q - Q, s - 1.0
    z0 = c0 * y0 + c1 * (a11 * y0 + a12 * y1)
    z1 = c0 * y1 + c1 * (a21 * y0 + a22 * y1)
    return Q + z0, 1.0 + z1

@njit(cache=True)
def banda(d, t0, i0, theta, area, refr, U, QU, PU12, PU3, tcU12, tcU3, QG, PG, fG,
          st_acc, st_last, st_q, st_s, st_t, st_chk, st_gq, st_gs, st_gt, st_pass,
          ev_t, ev_k, ev_m, n_ev, cont):
    """Processa uma faixa. theta: limiares (Pa de pico) crescentes. cont = [emitidas, repassadas, bloq_refr, sem_reserva]."""
    n = d.shape[0]; K = theta.shape[0]; dt = 1.0 / FS
    kmax = 0
    for i in range(n):
        x = d[i]
        # quantos pontos estão acima do limiar (prefixo, porque os limiares são crescentes)
        while kmax < K and theta[kmax] < x:
            kmax += 1
        while kmax > 0 and theta[kmax - 1] >= x:
            kmax -= 1
        if kmax == 0:
            continue
        t_i = t0 + i * dt
        ig = i0 + i                                   # índice global da amostra (continuidade entre trechos)
        for k in range(kmax):
            if st_last[k] != ig - 1:
                st_acc[k] = 0.0                       # esteve abaixo do limiar: acumulado zerado
            st_last[k] = ig
            inc = (x / theta[k] - 1.0) * dt
            a = st_acc[k] + inc
            if a < U:
                st_acc[k] = a
                continue
            # completou a unidade dentro desta amostra: instante interpolado
            fr = (U - st_acc[k]) / inc
            t = t_i - dt + fr * dt
            st_acc[k] = 0.0
            if t < st_chk[k]:
                cont[3] += 1                          # reserva ainda vazia (limite inferior do tempo de recarga)
                continue
            if area[k] == 3:
                P = PU3; tc = tcU3
            else:
                P = PU12; tc = tcU12
            q, s = avancar(st_q[k], st_s[k], t - st_t[k], QU, P)
            st_q[k] = q; st_s[k] = s; st_t[k] = t
            if q < 1.0:
                cont[3] += 1
                st_chk[k] = t + (1.0 - q) * tc / (QU - q)
                continue
            st_q[k] = q - 1.0                         # emitiu: gasta um ponto de liberação
            if st_q[k] < 1.0:
                st_chk[k] = t + (1.0 - st_q[k]) * tc / (QU - st_q[k])
            cont[0] += 1
            # a incidência chega à Upro
            if t - st_pass[k] < refr[k]:
                cont[2] += 1                          # janela de refratariedade aberta: não passa
                continue
            gq, gs = avancar(st_gq[k], st_gs[k], t - st_gt[k], QG, PG)
            m = gq
            st_gq[k] = gq - fG * gq; st_gs[k] = gs; st_gt[k] = t
            st_pass[k] = t
            cont[1] += 1
            j = n_ev[0]
            if j < ev_t.shape[0]:
                ev_t[j] = t; ev_k[j] = k; ev_m[j] = m
            n_ev[0] = j + 1

class Borda:
    """Estado de uma Utrd (um ouvido) com seus 64 Cpros."""
    def __init__(self, pontos, par):
        from coclea import limiar_pa
        self.par = par; self.P = []
        PU12 = lambdas(4.0, par["tcU"], par["tdU"], par["MU"])
        PU3 = lambdas(4.0, par["tcU3"], par["tdU"], par["MU"])
        PG = lambdas(1.0, par["tcG"], par["tdG"], par["MG"])
        self.PU12, self.PU3, self.PG = PU12, PU3, PG
        for p in pontos:
            K = len(p["limiar_db"])
            self.P.append(dict(theta=limiar_pa(p["limiar_db"]).astype(np.float64), area=p["area"].astype(np.int64),
                               refr=p["refr"].astype(np.float64),
                               acc=np.zeros(K), last=np.full(K, -10, np.int64), q=np.full(K, 4.0), s=np.ones(K),
                               t=np.zeros(K), chk=np.full(K, -1.0), gq=np.ones(K), gs=np.ones(K), gt=np.zeros(K),
                               ps=np.full(K, -1.0)))
        self.cont = np.zeros((len(pontos), 4), np.int64)

    def rodar(self, D, t0, cap=4_000_000):
        """t0 em segundos, múltiplo exato do período de amostragem (continuidade entre trechos)."""
        """D: (64, n) sinal de comando. Devolve lista de eventos por faixa: (t, k, magnitude)."""
        par = self.par; out = []
        for b, p in enumerate(self.P):
            ev_t = np.empty(cap); ev_k = np.empty(cap, np.int32); ev_m = np.empty(cap, np.float32); n_ev = np.zeros(1, np.int64)
            banda(D[b], t0, int(round(t0 * FS)), p["theta"], p["area"], p["refr"], par["U"], 4.0, self.PU12, self.PU3, par["tcU"], par["tcU3"],
                  1.0, self.PG, par["fG"], p["acc"], p["last"], p["q"], p["s"], p["t"], p["chk"], p["gq"], p["gs"], p["gt"], p["ps"],
                  ev_t, ev_k, ev_m, n_ev, self.cont[b])
            m = int(n_ev[0]); assert m <= cap, "capacidade de eventos excedida"
            out.append((ev_t[:m].copy(), ev_k[:m].copy(), ev_m[:m].copy()))
        return out

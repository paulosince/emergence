"""V0.19 — entrada volumétrica no Sdom (proposta de 27/11, adotada pelo responsável: "Vamos mudar e já fechar o escopo").

Números humanos; onde não há número humano, interpolação declarada (ver ../entrada-volumetrica-e-fechamento.md, seção 7.1):
- NERVO_H: Upro do nervo (no NB, o axônio do nervo coclear humano) ≈ 26 mm = 1.300 cubos (canal auditivo interno ~10 mm + trecho cisternal
  16,5 ± 1,8 mm, medido em 10 nervos de cadáver). Confiança média-baixa (soma de partes medidas em estudos diferentes).
- Volume do núcleo coclear humano ≈ 29 mm³ (estereologia, adultos, décadas 2–8: 25–36 mm³; Sharma et al. 2014),
  escalado pelo número de Upros possíveis do robô (21.731 pontos transdutivos, contra ~33.700 axônios no humano jovem; Makary et al. 2011): ≈ 18,7 mm³.
- Divisão AVCN : PVCN : DCN = 43 : 20 : 36 % (hamster, sem regiões granulares; proporção humana não encontrada).
- Lâmina de cada banda: 10 cubos (200 µm). Gato: 188–223 µm para um setor de ~400 µm da cóclea (~1,6% do comprimento;
  Leake et al. 2006); uma banda nossa é 1/64 ≈ 1,56% da faixa; escala pelo tamanho linear do núcleo (18,7 / 21,2 mm³ do gato)^(1/3) ≈ 0,96.
- Ustr da zona de entrada: ~1 por 4 pontos [R 23/11] → ladrilhos de 8 × 7 × 8 cubos (x, y, z) ≈ 1 por 4,2 pontos.
Geometria (simplificação agnóstica, perdas declaradas no escopo):
- y = eixo tonotópico (64 lâminas de 10 cubos); x = sensibilidade (para dentro da cabeça); z = eixo dos ramos.
- A Upro chega à zona de bifurcação (z = 0) e se divide: ramo ascendente atravessa o AVCN (z > 0); o descendente
  atravessa o PVCN (z < 0) e segue até o DCN. A Upro é vista uma vez em cada território (ladrilho) que atravessa:
  dentro de um território, vários contatos da mesma Upro equivalem a um só para a Ustr (ela vê a incidência uma vez).
  Vocabulário [R 28/11]: Cpro = fibra (feixe das Upros de uma faixa); Upro = aresta com várias cabeças; ramo = cabeça.
  No código, "terminação" (t*) = o ponto da Upro num território (nome descritivo, não aprovado). Tensão aberta:
  os trechos até ~64 cubos (~4 ms) não são "ramos" (atraso pequeno no ramo [R 17/11]); ver o registro, 7.5.
- Lâminas planas e paralelas (no cérebro ondulam); bordas retas entre subdivisões.
"""
import numpy as np

CUBO_MM = 0.02
NERVO_H = 1300
LAM = 10
TX, TY, TZ = 8, 7, 8
V_NUCLEO_MM3 = 29.0 * 21731 / 33679
FRAC = np.array([0.289, 0.136, 0.241]); FRAC = FRAC / FRAC.sum()      # AVCN, PVCN, DCN (hamster)
NOMES = ["AVCN", "PVCN", "DCN"]

def lados_subdivisoes():
    v = V_NUCLEO_MM3 / CUBO_MM ** 3
    return [int(round(np.sqrt(v * f / (64 * LAM)))) for f in FRAC]

def geometria(x, y, z, banda, lado, meia_dist=2500):
    """Devolve os pontos das Upros nos territórios ("terminações"): (upro, tx, ty, tz, atraso_cubos, subdivisao), e a grade de Ustr."""
    aA, aP, aD = lados_subdivisoes()
    x0 = lado * (meia_dist - NERVO_H)            # zona de bifurcação (fim do nervo)
    zr = {0: (1, 1 + aA), 1: (-aP, 0), 2: (-aP - aD, -aP)}
    lad = {0: aA, 1: aP, 2: aD}
    N = len(x)
    nb = int(banda.max()) + 1
    # posição fina dentro da banda (ao longo da frequência) e coluna de sensibilidade (V0.18: 16 colunas, z da faixa)
    col = z - z.min()                             # 0..15
    yf = np.zeros(N, int); comp = np.zeros(nb, int)
    for b in range(nb):
        m = banda == b; yy = y[m]; yf[m] = yy - yy.min(); comp[b] = yy.max() - yy.min() + 1
    ty = (banda - nb // 2) * LAM + (yf * LAM) // comp[banda]
    zmin = -aP - aD
    fib, TXs, TYs, TZs, ATR, SUB = [], [], [], [], [], []
    xb = x0 - lado * (1 + ((col + 0.5) * aA / 16).astype(int))  # posição de chegada (na bifurcação) = coluna no AVCN
    for s in range(3):
        a = lad[s]; z0, z1 = zr[s]
        xs = x0 - lado * (1 + ((col + 0.5) * a / 16).astype(int))
        # centros dos ladrilhos (em z) que caem dentro da subdivisão
        k0 = (z0 - zmin) // TZ; k1 = (z1 - 1 - zmin) // TZ
        for k in range(k0, k1 + 1):
            lo = max(z0, zmin + k * TZ); hi = min(z1, zmin + (k + 1) * TZ)
            zc = (lo + hi - 1) // 2
            fib.append(np.arange(N)); TXs.append(xs); TYs.append(ty); TZs.append(np.full(N, zc))
            ATR.append(np.abs(zc) + np.abs(xs - xb)); SUB.append(np.full(N, s))
    fib, TXs, TYs, TZs, ATR, SUB = map(np.concatenate, (fib, TXs, TYs, TZs, ATR, SUB))
    o = np.lexsort((TZs, fib)); fib, TXs, TYs, TZs, ATR, SUB = fib[o], TXs[o], TYs[o], TZs[o], ATR[o], SUB[o]
    fptr = np.searchsorted(fib, np.arange(N + 1))
    # grade de Ustr: ladrilhos que contêm volume de alguma subdivisão; Ustr no centro do ladrilho
    amax = max(aA, aP, aD)
    gx0 = int(x0 - amax) if lado > 0 else int(x0 + 1)
    gy0 = int(ty.min()); gz0 = int(zmin)
    nx = (amax + TX - 1) // TX + 1; ny = (int(ty.max()) - gy0) // TY + 1; nz = (aA + 1 + aP + aD) // TZ + 1
    TG = np.full((nx, ny, nz), -1, np.int64)
    ux, uy, uz = [], [], []
    for ix in range(nx):
        for iy in range(ny):
            for iz_ in range(nz):
                cx = gx0 + ix * TX + TX // 2; cy = gy0 + iy * TY + TY // 2; cz = gz0 + iz_ * TZ + TZ // 2
                # dentro de alguma subdivisão?
                dentro = False
                for s in range(3):
                    z0, z1 = zr[s]; a = lad[s]
                    xlo, xhi = (x0 - a, x0 - 1) if lado > 0 else (x0 + 1, x0 + a)
                    if z0 - TZ // 2 <= cz < z1 + TZ // 2 and xlo - TX // 2 <= cx <= xhi + TX // 2:
                        dentro = True
                if not dentro or cy > ty.max() + TY // 2:
                    continue
                TG[ix, iy, iz_] = len(ux); ux.append(cx); uy.append(cy); uz.append(cz)
    ux, uy, uz = np.array(ux), np.array(uy), np.array(uz)
    tu = TG[(TXs - gx0) // TX, (TYs - gy0) // TY, (TZs - gz0) // TZ]
    return dict(fptr=fptr, fib=fib, tx=TXs, ty=TYs, tz=TZs, atr=ATR, sub=SUB, tu=tu, TG=TG, g0=np.array([gx0, gy0, gz0]),
                ux=ux, uy=uy, uz=uz, lados=(aA, aP, aD), x0=x0)

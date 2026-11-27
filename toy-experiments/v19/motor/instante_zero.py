"""V0.19 — instante zero do Sdom: coordenadas da borda e das Ustr iniciais, e a contagem obrigatória.

Decisões usadas (toy-experiments/v19/decisoes-em-construcao.md):
- espaço em cubos de ~20 µm [R 24/11]; faixas nas posições dos microfones, a ~10 cm [R 24/11];
- faixa desenrolada e compacta: bandas na ordem de frequência; dentro da banda, ordem de sensibilidade; um ponto por cubo [R 24/11];
- Ustr espalhadas por igual ao lado da faixa, uma a cada ~4 pontos vizinhos [R 23–24/11];
- nada representacional no instante zero (erro que encerrou a V0.17).
Parâmetro PROVISÓRIO [A], a confirmar com o responsável: LARGURA da faixa (cubos no eixo da sensibilidade).
A V0.18 é só importada (leitura); nada nela é alterado."""
import json, base64, sys, pathlib
import numpy as np

AQUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(AQUI.parents[1] / "v18" / "borda"))
import pontos  # V0.18: pontos transdutivos por banda (capacidade e limiares, já em ordem de sensibilidade)

CUBO_MM = 0.02            # [R] ~20 µm
MEIA_DIST = 2500          # [R] 10 cm entre os microfones = 5.000 cubos; cada faixa a ±2.500 cubos do centro
LARGURA = 16              # [R, 27/11] cubos no eixo da sensibilidade: uma coluna de sensibilidade da V0.18 por linha

def faixa(P, lado):
    """Coordenadas inteiras (x, y, z) dos pontos de um ouvido. x: esquerda(-)/direita(+); y: frequência; z: sensibilidade."""
    xs, ys, zs, banda, posto = [], [], [], [], []
    y0 = 0
    for b, p in enumerate(P):
        n = len(p["limiar_db"])                       # já ordenados do mais sensível ao menos sensível (V0.18)
        r = np.arange(n)
        z = (r * LARGURA) // n                        # sensibilidade atravessa a largura (lado pilar → lado do modíolo)
        y = np.zeros(n, dtype=int)
        for k in range(LARGURA):                      # dentro de cada coluna de sensibilidade, os pontos seguem ao longo de y
            m = z == k; y[m] = np.arange(m.sum())
        comp = int(y.max()) + 1
        xs.append(np.full(n, lado * MEIA_DIST)); ys.append(y0 + y); zs.append(z); banda.append(np.full(n, b)); posto.append(r)
        y0 += comp
    xs, ys, zs = map(np.concatenate, (xs, ys, zs))
    ys = ys - y0 // 2; zs = zs - LARGURA // 2         # centraliza a faixa no plano do ouvido
    return xs, ys, zs, np.concatenate(banda), np.concatenate(posto)

def ustr(xs, ys, zs, lado):
    """Uma Ustr para cada bloco 2×2 de pontos vizinhos (y, z), um cubo para dentro da cabeça."""
    blocos = np.unique(np.stack([ys // 2, zs // 2], 1), axis=0)
    n = len(blocos)
    return np.full(n, lado * (MEIA_DIST - 1)), blocos[:, 0] * 2 + 1, blocos[:, 1] * 2 + 1

def b64(a, tipo):
    return base64.b64encode(np.asarray(a, dtype=tipo).tobytes()).decode()

def main(saida):
    P = pontos.construir()
    dados = dict(cubo_mm=CUBO_MM, largura=LARGURA, ouvidos={})
    cont = dict(pontos=0, ustr=0, uint=0, upro=0, cpro=0, ramos=0)
    for nome, lado in (("E", -1), ("D", +1)):
        x, y, z, banda, posto = faixa(P, lado)
        ux, uy, uz = ustr(x, y, z, lado)
        # conferência: um ponto por cubo
        assert len(np.unique(np.stack([x, y, z], 1), axis=0)) == len(x), "dois pontos no mesmo cubo"
        cont["pontos"] += len(x); cont["ustr"] += len(ux)
        dados["ouvidos"][nome] = dict(
            n_pontos=len(x), n_ustr=len(ux),
            pontos=dict(x=b64(x, "<i2"), y=b64(y, "<i2"), z=b64(z, "<i2"), banda=b64(banda, "u1")),
            ustr=dict(x=b64(ux, "<i2"), y=b64(uy, "<i2"), z=b64(uz, "<i2")),
            comprimento_cubos=int(y.max() - y.min() + 1))
    # CONFERÊNCIA OBRIGATÓRIA DO INSTANTE ZERO: nada representacional existe
    for k in ("uint", "upro", "cpro", "ramos"):
        assert cont[k] == 0, f"violação: {k} no instante zero"
    dados["contagem"] = cont
    dados["bandas_fc_hz"] = [round(float(p["fc"]), 1) for p in P]
    pathlib.Path(saida).parent.mkdir(parents=True, exist_ok=True)
    pathlib.Path(saida).write_text(json.dumps(dados))
    return dados

if __name__ == "__main__":
    d = main(AQUI.parent / "visual" / "instante-zero.json")
    c = d["contagem"]
    print("contagem do instante zero:", c)
    for k, o in d["ouvidos"].items():
        print(f"ouvido {k}: {o['n_pontos']} pontos, {o['n_ustr']} Ustr, faixa de {o['comprimento_cubos']} × {d['largura']} cubos "
              f"({o['comprimento_cubos']*d['cubo_mm']:.1f} × {d['largura']*d['cubo_mm']:.2f} mm)")

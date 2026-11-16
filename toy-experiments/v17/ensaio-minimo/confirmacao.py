"""Confirmação com 10 sementes (seção 4 de mapa-faixas.md). Uso: python3 -I confirmacao.py"""
import csv, sys
sys.path.insert(0, ".")
from multiprocessing import Pool
import mapa
if __name__ == "__main__":
    grade = [(c, 0.0065, "S", 0.15, 300_000.0, fb, s) for fb in (0.30, 0.15) for c in ("notas", "fixo") for s in range(1, 11)]
    with Pool(2) as pool, open("confirmacao-saida.csv", "w", newline="") as fh:
        wr = None
        for k, r in enumerate(pool.imap_unordered(mapa.rodar, grade)):
            if wr is None: wr = csv.DictWriter(fh, fieldnames=list(r)); wr.writeheader()
            wr.writerow(r); fh.flush()
            print(f"{k+1}/{len(grade)} {r['cond']} broto={r['fbroto']} semente={r['semente']}: {r['classe']} cred={r['credito_verdadeiro']} disp={r['disparos_ultimo_ep']}", flush=True)

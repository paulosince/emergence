"""70 execuções documentadas do grave: contar estabilizações via instrumentação,
sem editar o motor. Comparar referência CSV, original e cópia instrumentada.
"""
import argparse
import csv
import json
from pathlib import Path
import sys
import tempfile
import time

import investigacao_escala_medidas as inv
import perf_baseline as base

HERE=Path(__file__).resolve().parent
CAMPOS_CSV=("classe","ramos","relacoes","credito_verdadeiro","dispersao_ms","disparos_ultimo_ep")


def rows():
    with (HERE/"inibicao-saida.csv").open() as fh:
        a=[x for x in csv.DictReader(fh) if x["faixa"]=="grave"]
    with (HERE/"inibicao-fiel-saida.csv").open() as fh:
        a += [dict(x,faixa="grave") for x in csv.DictReader(fh)]
    return a


def cmp_csv(row,res):
    err={}
    for name in CAMPOS_CSV:
        a=str(res.get(name) if res.get(name) is not None else "")
        b=str(row[name] if row[name] not in (None,"None") else "")
        if a!=b: err[name]=[b,a]
    return err


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument("--cond",required=True,choices=base.CASES)
    args=parser.parse_args()
    refs=[r for r in rows() if r["cond"]==args.cond]
    assert len(refs)==10,(args.cond,len(refs))
    result=[]
    with tempfile.TemporaryDirectory() as tmp:
        mod=inv.carregar(tmp)
        base.rodar_rapido("I1","grave",1,dur=5.0)
        mod.rodar_rapido("I1","grave",1,dur=5.0)
        for row in refs:
            cond=args.cond; seed=int(row["semente"])
            a=base.rodar_rapido(cond,"grave",seed)
            b=mod.rodar_rapido(cond,"grave",seed)
            pure={k:v for k,v in b.items() if k not in inv.PRIVATE}
            diff=inv.etapa2.comparacao_exata(a,pure)
            ref=cmp_csv(row,a)
            st={k:int(b["_stats"][i]) for k,i in inv.etapa2.IDX.items()}
            item={"cond":cond,"semente":seed,"classe":a["classe"],
                  "ramos":a["ramos"],"estabilizacoes_A":st["estabilizacoes_A"],
                  "estabilizacoes_B":st["estabilizacoes_B"],
                  "max_A":st["max_ramos_A"],"max_B":st["max_ramos_B"],
                  "barreiras_MAXR":st["propostas_barradas_MAXR_antes_dedup"],
                  "paradas_300":st["paradas_limite_total_300"],
                  "identico_motor":not diff,"identico_CSV":not ref,
                  "diferencas_motor":diff,"diferencas_CSV":ref}
            result.append(item)
            print("GRAVE "+json.dumps(item,ensure_ascii=False),flush=True)
    soma=sum(x["estabilizacoes_A"]+x["estabilizacoes_B"] for x in result)
    n_semente=sum(x["estabilizacoes_A"]+x["estabilizacoes_B"]>0 for x in result)
    print(f"RESUMO cond={args.cond} estaveis={soma} "
          f"sementes_com_estabilizacao={n_semente}/10 "
          f"equivalencias={sum(x['identico_motor'] and x['identico_CSV'] for x in result)}/10",flush=True)
    out=f"escala-grave-{args.cond.replace('-','_')}.json"
    Path(out).write_text(json.dumps({"condicao":args.cond,"casos":result,
        "numero_transicoes_ao_estavel":soma,
        "sementes_com_estabilizacao":n_semente},ensure_ascii=False,indent=2))
    if any(not x["identico_motor"] or not x["identico_CSV"] for x in result):
        raise SystemExit(2)


if __name__=="__main__":
    main()

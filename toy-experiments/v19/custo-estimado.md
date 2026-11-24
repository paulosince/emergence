# V0.19 — Custo estimado (item 17), 24/11/2026

Estimativa do assistente a partir de medidas da V0.18 [M] e contas [A]. Não é medida do motor da V0.19 (ainda não existe).

## Medidas que já temos [M]
- Gymnopédie n.º 1 (Alciatore), trecho de 9 a 19 s: **24,9 milhões de incidências no ouvido esquerdo em 10 s** (~2,5 M/s por ouvido) (`v18/borda/teste-10s.md`).
- A borda levou ~80 s para gerar 10 s de Bach nos dois ouvidos; o arquivo completo de eventos de 10 s tinha ~600 MB.
- ~80% dos pontos ativos o tempo todo acima de ~300 Hz (saturação por recrutamento).

## Contas [A]
- Duração da gravação: **não conferida** (o arquivo não está nesta máquina); uso ~3 min para a conta.
- **Borda:** ~450 M incidências por ouvido em 3 min, ~900 M nos dois; ~24 min de cálculo por gravação. **Como tudo é determinístico, a saída da borda de cada gravação é calculada uma vez e reaproveitada** em todas as apresentações.
- **Armazenamento:** com ~9 bytes por incidência (instante, faixa, ponto, magnitude), ~8 GB por gravação; esta máquina tem 7 GB de memória, então o motor lê em blocos.
- **No começo, tudo é fracasso:** ~5 M fracassos por segundo para ~10.860 Ustr ≈ **460 fracassos/s por Ustr**.
- **Risco encontrado:** com o rastro durando até a sessão seguinte, uma Ustr acumularia ~83 mil fracassos por sessão; comparar todos com todos daria ~3 × 10⁹ pares por Ustr. Inviável. Saída proposta: separar os dois papéis do rastro:
  1. **coincidência:** comparar só fracassos dentro de uma janela curta (ordenados no tempo, custo linear);
  2. **guia do crescimento:** uma contagem acumulada por cubo, que decai até a sessão seguinte (custo constante por fracasso).
- **Sdom:** ~900 M eventos por apresentação; a 1–10 µs por evento, de 15 min a 2,5 h por apresentação. **Precisa de medida** num piloto de 10 s antes de decidir peça inteira ou trechos.

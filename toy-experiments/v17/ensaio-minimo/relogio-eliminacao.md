# V0.17 — Registro prévio: relógio da eliminação só com mundo (correção de erro)

**Estado:** **SUBSTITUÍDO** (17/11, noite): o responsável decidiu pular para o critério por participação (registro participacao.md), já com o relógio corrigido, que fica.
**Redação:** assistente (Claude), 17/11/2026.
**Base:**
- decisão do responsável (17/11, noite): "Só tempo com mundo"; testar antes no modelo atual, com 1 fibra;
- errata em [resultados](resultados.md); [investigação](../investigacao-competicao-fibras.md).

**Modelo atual (ponto de partida):** passo 1 (limiar duro; janela retangular de 0,30 ms) + atividade espontânea (60/s, 2 s de silêncio por episódio), 1 fibra por ouvido, conjunto B, inibição I1. Motor `motor_fibras.py` (F = 1, idêntico ao anterior).

## 1. O que muda
- **Relógio [R]:** o tempo TEL (60 s abaixo de θ × a mais forte) passa a contar **só o tempo de episódio**. [A] Isso inclui os 2 s de silêncio, porque neles há atividade espontânea. O intervalo de 170 s sem mundo **não conta**.
- Nada mais muda.

## 2. Consequência prevista [I] — importante
Cada execução tem 5 episódios de 12 s = **60 s de tempo com mundo no total**. Com TEL = 60 s, um ramo só seria eliminado se ficasse abaixo de θ **o tempo todo, do primeiro ao último instante**. **Na prática, a eliminação competitiva deixa de existir.** Antes da correção 2, isso levava à força dividida entre vizinhos e cópias.

## 3. Mundo, sementes, condições
- Degrau 1 (Δ = 0,458 ms), grave e agudo. **Sementes 221–250** (30, novas).
- Condições: (a) **relógio corrigido**; (b) relógio antigo (o modelo atual sem correção), nas mesmas sementes, para comparação.
- Total: 2 × 2 × 30 = **120 execuções**, ~10 min.
- **Declaração:** teste de funcionamento curto (semente 1, 2 s, agudo): zero eliminações, como previsto, e colapso.

## 4. Medidas
Seleção (grave), seleção em fase (agudo), colapsos, disparos, eliminados, ramos, força total, disparo no silêncio.

## 5. Leitura (fixada agora)
- **Fica** a correção do relógio, em qualquer caso: é correção de erro, decidida pelo responsável. O ensaio mede o efeito, não decide se fica.
- Passa (≥ 24/30 no grave e no agudo em fase) → seguimos para os passos 2 + 3 com ele.
- Não passa → levar ao responsável com diagnóstico, junto com a proposta do critério por participação (investigação, seção 6), sem ajustar.

## 6. Previsões [A]
1. Quase nenhuma eliminação; mais ramos e força total maior no fim.
2. **Risco:** sem eliminação, a força volta a se dividir, e a seleção cai, sobretudo no grave.

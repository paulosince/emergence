# V0.17 — Registro prévio: 8 fibras por ouvido com limite de disparo por fibra (refratário + chance por ciclo)

**Estado:** **RASCUNHO** — aguarda aprovação do responsável.
**Redação:** assistente (Claude), 18/11/2026.
**Base:**
- decisões do responsável (18/11): ordem (1) limite por fibra junto com as 8 fibras; (2) inibição da MSO; (3) depressão só se necessária; taxas a mapear: 150 e 300/s;
- [investigação das três peças](../investigacao-tres-pecas.md); decisões anteriores sobre as 8 fibras e o alcance de 2–4 (17/11).

**Modelo atual (ponto de partida):** passo 1 (limiar duro; janela retangular de 0,30 ms) + espontânea 60/s + relógio corrigido + participação (N = 100), **sem inibição** (o plano B saiu). Motor `motor_fibras.py`.
**Legenda:** [R] decisão do responsável; [A] proposta do assistente (a aprovar); [L] literatura.

## 1. O que muda
1. **8 fibras por ouvido** [R], cada uma com tremor e espontânea próprios; cada Uint alcança 2–4 fibras de cada lado [R]; Upros por fibra (como no rascunho dos passos 2 + 3).
2. **Limite por fibra** [R: junto; A: forma]:
   - cada ciclo do mundo é candidato a disparo da fibra com **chance p**. É o acaso físico do sensor. p = taxa-alvo ÷ taxa do mundo, limitada a 1;
   - a atividade espontânea também é candidata;
   - **refratário:** nenhum disparo a menos de **0,4 ms** do último; depois, chance de recuperar de 1 − exp(−(Δt − 0,4)/0,4) [L: ~0,33–0,39 ms e ~0,41–0,43 ms, medidos com estímulo elétrico];
   - **taxas-alvo mapeadas** [R]: **150 e 300/s**. Taxas medidas (semente 1): agudo 166 e 265/s por fibra; grave 171 e 217/s (no grave, a taxa do mundo já é ~190/s).
3. Nada mais muda. A inibição continua fora; entra no passo seguinte da ordem.

## 2. Mundo, sementes, condições
- Degrau 1 (Δ = 0,458 ms), grave e agudo. **Sementes 281–310** (30, novas).
- **Condições:**
  - julgadas: (a) 8 fibras + limite 150/s; (b) 8 fibras + limite 300/s;
  - comparação: (c) 8 fibras sem limite; (d) modelo atual (1 fibra).
- Total: 4 × 2 × 30 = **240 execuções**, ~20–40 min. Confiança baixa.
- Verificação de engenharia: com o limite desligado, o motor reproduz o anterior exatamente.
- **Declaração:** teste curto (semente 1, 2 s, 8 fibras, limite 300/s): grave difuso com disparos; agudo em **colapso** com 9 ramos.

## 3. Medidas
Seleção (grave), seleção em fase (agudo), colapsos, disparos, ramos, eliminados, taxa real por fibra, disparo no silêncio, força ganha e perdida por episódio.

## 4. Leitura (fixada agora) [A]
Sem inibição, o agudo deve continuar com sintonia larga: é a inibição, que vem no passo seguinte, que estreita a janela. Por isso este passo é julgado assim:
- **Passa** uma taxa se o grave selecionar em **≥ 24/30** **e** o agudo **não colapsar** (≤ 3 colapsos em 30). O agudo em fase é lido como descrição.
- Se as duas passarem, o responsável escolhe. Passou → inibição da MSO (passo seguinte).
- Não passa: levar ao responsável com diagnóstico, sem ajustar.

## 5. Previsões [A]
1. Com fibras que pulam ciclos, uma coincidência do mundo chega por **algumas** fibras de cada lado, não por todas. A Uint precisa de mais de uma fibra para disparar, como na MSO.
2. **Risco (visto no teste curto):** com força inicial de 0,15 por ramo e poucas fibras disparando por ciclo, a soma não chega ao favorecimento (0,3), a força não cresce, e o agudo colapsa.
3. **Risco:** com 300/s, mais disparos espontâneos coincidentes entre fibras.

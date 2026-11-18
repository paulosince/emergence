# V0.17 — Registro prévio: força por fibra (teto, estoque proporcional, força inicial)

**Estado:** **RASCUNHO** — aguarda aprovação do responsável.
**Redação:** assistente (Claude), 18/11/2026.
**Base:**
- decisões do responsável (18/11): força por fibra **antes** da inibição; aprovados juntos: teto por fibra de 0,5; estoque proporcional; força inicial de ~43% do teto, dividida entre os ramos;
- [investigação](../investigacao-tres-pecas.md), seção 7.

**Modelo atual (ponto de partida):**
- passo 1 (limiar duro; janela retangular de 0,30 ms), espontânea 60/s, relógio corrigido, participação (N = 100);
- 8 fibras por ouvido, alcance de 2–4, limite por fibra de 300/s, depressão NB (A = 0,02);
- sem inibição.

Motor `motor_fibras.py`.
**Legenda:** [R] decisão do responsável; [A] proposta do assistente (a aprovar); [L] literatura.

## 1. O que muda [R]
1. **Teto por fibra:** a soma das forças dos ramos de uma mesma fibra numa Uint fica limitada a **0,5** (1/3 do limiar) [L: Couchman 2010]. Uma fibra sozinha não dispara a Uint.
2. **Estoque por lado proporcional:** o estoque de cada lado da Uint passa a ser **0,5 × número de fibras** que alcançam aquele lado (2–4 fibras → 1,0–2,0); continua se repondo com τ = 60 s.
3. **Força inicial:** **0,43 × 0,5 ≈ 0,215 por fibra**, dividida entre os 6 ramos iniciais dela na Uint (≈ 0,036 por ramo) [L: Franzen 2020, ~43% da força adulta no início da audição]. Upros novas (Pcrt) começam com o mesmo valor por ramo.
4. Nada mais muda.

## 2. Mundo, sementes, condições
- Degrau 1 (Δ = 0,458 ms), grave e agudo. **Sementes 341–370** (30, novas).
- Condições: (a) **com a força por fibra** (julgada); (b) modelo atual, para comparação.
- Total: 2 × 2 × 30 = **120 execuções**, ~15–25 min.
- Verificação: com a opção desligada, o motor reproduz o anterior exatamente.
- **Declaração:** teste curto (semente 1, 2 s): grave em seleção; agudo difuso, ainda **sem disparos** em 2 s (a força começa baixa).

## 3. Medidas
Seleção (grave), seleção em fase (agudo), colapsos, **disparos por Uint no agudo**, ramos, eliminados, força total, disparo no silêncio, força ganha e perdida.

## 4. Leitura (fixada agora) [A]
**Passa** se:
- o grave selecionar em **≥ 24/30**;
- o agudo não colapsar (≤ 3 em 30);
- **e** o agudo **disparar**: em **≥ 24/30** sementes, pelo menos uma Uint com ≥ 100 disparos no último episódio, o mínimo para o critério de fase poder ser lido.

O agudo em fase continua descritivo (a inibição vem depois). Passou → inibição da MSO. Não passou → levar ao responsável com diagnóstico.

## 5. Previsões [A]
1. As fibras certas chegam perto de 0,5 cada; com ~3 coincidindo, a Uint dispara. O agudo volta a disparar, de dezenas a centenas por segundo por Uint.
2. **Risco:** com força inicial baixa (0,036 por ramo), o favorecimento (V ≥ 0,3 numa coincidência) fica raro no começo, e a força pode não sair do lugar no agudo.
3. **Risco:** com o teto por fibra, o grave pode perder Uints que dependiam de um ramo muito forte.

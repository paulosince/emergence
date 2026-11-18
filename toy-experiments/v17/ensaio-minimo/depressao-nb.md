# V0.17 — Registro prévio: depressão NB (depois do disparo, proporcional à força) no lugar da punição, com 8 fibras e limite por fibra

**Estado:** **APROVADO** pelo responsável em 18/11/2026 ("Aprovo, pode rodar").
**Redação:** assistente (Claude), 18/11/2026.
**Base:**
- decisões do responsável (18/11): trocar a punição da quase-sincronia pela forma NB; a força perdida **não** volta ao estoque; ordem aprovada (8 fibras + limite → inibição da MSO → depressão de curto prazo, se necessária);
- diagnóstico (a punição causa o colapso com várias fibras); [investigação](../investigacao-tres-pecas.md), seção 6.

**Modelo atual (ponto de partida):** passo 1 + espontânea 60/s + relógio corrigido + participação (N = 100), sem inibição. Agora com **8 fibras por ouvido**, alcance de 2–4 e **limite por fibra**.
**Legenda:** [R] decisão do responsável; [A] proposta do assistente (a aprovar); [L] literatura.

## 1. O que muda
1. **Sai a punição da quase-sincronia** (−1,05 × DF fixo por chegada de 1 a 3 janelas depois de um **favorecimento**).
2. **Entra a depressão NB** [R: forma; A: detalhes]:
   - é disparada pelo **disparo** da Uint [L: Bi & Poo 1998, a depressão vem quando o disparo pós-sináptico precede a chegada];
   - atinge a chegada excitatória que cai de **1 a 3 janelas** depois do disparo (0,21–0,63 ms), como na janela de antes;
   - é **proporcional à força** do ramo [L: Bi & Poo 1998; van Rossum, Bi & Turrigiano 2000]: perde a fração **A** da própria força;
   - não atinge ramos estabilizados (como antes); a força perdida **não** volta ao estoque [R].
3. **Número a mapear [A]:** **A ∈ {0,005; 0,02}** por chegada. Não há número NB para esta escala de tempo comprimida.
4. Com isso, retesta-se o **passo 1 da ordem** (8 fibras + limite por fibra), com as taxas mapeadas antes (150 e 300/s).

## 2. Mundo, sementes, condições
- Degrau 1 (Δ = 0,458 ms), grave e agudo. **Sementes 311–340** (30, novas).
- **Julgadas:** 8 fibras + limite {150, 300}/s × A {0,005; 0,02} = **4 condições**.
- **Comparação:** (e) 8 fibras + limite 150/s **sem** punição nem depressão; (f) modelo atual de 1 fibra, com a punição antiga.
- Total: 6 × 2 × 30 = **360 execuções**, ~30–50 min. Confiança baixa.
- Verificação: com a opção desligada, o motor reproduz o anterior exatamente.
- **Declaração:** testes curtos (semente 1, 2 s, limite 150/s): grave em seleção com as duas forças de A; agudo difuso, sem colapso; perdas de 0,2 a 12 contra ganhos de ~16–17.

## 3. Medidas
As do registro do limite: seleção (grave), seleção em fase (agudo), colapsos, disparos, ramos, eliminados, disparo no silêncio, força ganha e perdida por episódio.

## 4. Leitura (fixada agora)
- **Passa** uma combinação se o grave selecionar em **≥ 24/30** **e** o agudo **não colapsar** (≤ 3 colapsos em 30). O agudo em fase é lido como descrição, porque a inibição vem no passo seguinte.
- Se mais de uma passar, o responsável escolhe. Passou → inibição da MSO.
- Nenhuma passa: levar ao responsável com diagnóstico, sem ajustar.

## 5. Previsões [A]
1. Sem a punição aditiva, nenhum colapso (como no diagnóstico).
2. A depressão depois do disparo afina a sintonia: atinge as chegadas que vêm logo depois do disparo, que não contribuíram para ele.
3. **Risco:** com A = 0,02, os ramos corretos de uma Uint que dispara muito também perdem força, porque chegadas de ciclos seguintes caem na janela no agudo (período de 0,6–0,9 ms).

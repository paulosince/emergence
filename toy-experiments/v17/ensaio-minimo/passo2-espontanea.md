# V0.17 — Registro prévio: passo 2 — atividade espontânea nas fibras

**Estado:** **APROVADO** pelo responsável em 17/11/2026 ("Aprovo, pode rodar").
**Redação:** assistente (Claude), 17/11/2026.
**Base:**
- decisões do responsável de 17/11 (ordem 1 → 2 → 3; 60/s fixo; fim do sorteio);
- resultado do passo 1 (grave 25/30; agudo 7/30 por falta de disparos; pela regra aprovada, o passo 1 fica e seguimos);
- [ruído na MSO](../investigacao-ruido-mso.md), seções 1, 5 e 6.

**Ponto de partida:** o passo 1 (limiar duro; janela retangular L_E = L_I = 0,30 ms), conjunto B, inibição I1, fila por cursor, duas fibras. **Só muda o que está abaixo.**
**Legenda:** [R] decisão do responsável; [A] proposta do assistente (a aprovar); [L] literatura.

## 1. O que muda
1. **Atividade espontânea [R: 60/s fixo]:**
   - cada fibra (A e B) recebe, além das incidências do mundo, incidências **espontâneas**: processo de Poisson com **60 por segundo**, independente entre as fibras e do mundo;
   - [L] 60/s é a média das células esféricas do gerbil in vivo (Kopp-Scheinpflug et al. 2002).
2. **Trecho de silêncio [A]:** cada episódio ganha **2 s sem mundo** no fim, só com a atividade espontânea, para medir quanto as Uints disparam sozinhas. Na MSO, a mediana do disparo espontâneo é 0,4/s (van der Heijden 2013).
3. [A] A Pcrt, a competição e tudo o mais tratam as incidências espontâneas **como quaisquer outras** (não sabem de onde vêm).
4. **Perda declarada:**
   - as espontâneas são sorteadas à parte e **somadas** às do mundo; na fibra real, com som, elas não se somam simplesmente, porque a fibra satura e trava na fase;
   - sem período refratário na fibra.

## 2. Mundo, sementes, condições
- Degrau 1 (Δ = 0,458 ms), grave e agudo, notas. **Sementes 161–190** (30, novas).
- Condições: (a) **passo 2** (passo 1 + espontânea); (b) **passo 1** sem espontânea; (c) **referência** (conjunto B com sorteio). Todas nas mesmas sementes. As duas últimas só para comparação.
- Total: 3 × 2 × 30 = **180 execuções**, ~15–20 min nos 2 núcleos. Confiança média.
- Verificação de engenharia já feita: com as opções novas desligadas, o motor reproduz a referência e o passo 1 exatamente. Um teste de funcionamento curto (semente 1, 2 s, fora do conjunto) rodou sem erro.

## 3. Medidas
- Seleção no grave; seleção em fase no agudo; colapsos; disparos.
- **Disparos por Uint no silêncio** (último episódio).
- Upros novas e ramos; custo (eventos por segundo simulado).

## 4. Leitura (fixada agora)
- **Passa** se o passo 2 der grave **≥ 24/30 e** agudo em fase **≥ 24/30**: o passo 2 fica e seguimos para o passo 3 (8 fibras por ouvido e alcance de 2–4).
- 18–23 em alguma faixa: levar ao responsável com diagnóstico, sem ajustar. ≤ 17: parar e levar.
- Descritivo, sem critério: o disparo no silêncio comparado aos 0,4/s da MSO.

## 5. Previsões [A]
1. A atividade espontânea dá às Uints os disparos perto do limiar que o sorteio dava. O agudo volta a selecionar.
2. **Risco:** coincidências espontâneas entre A e B (sem relação fixa) criam Upros e ramos à toa e aumentam as presas no acaso.
3. **Risco:** no silêncio, as Uints disparam bem mais que 0,4/s. Na MSO, a corrente de potássio de baixo limiar filtra o fundo; aqui ela não existe.

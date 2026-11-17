# V0.17 — Registro prévio: maturação conjunta da excitação e da inibição (correção 6)

**Estado:** RASCUNHO para aprovação do responsável. Nada de código antes da aprovação.
**Redação:** assistente (Claude), 17/11/2026. **Base:** [correção 6](../correcoes-dissonancias.md) (aprovada: maturação pelos acertos da Uint; a recorrência reforça, o decaimento derruba); [investigação da inibição](../investigacao-inibicao-lateral.md), seções 6–7; [investigação da divisão da força](../investigacao-divisao-forca.md), seção 3.5.
**Ponto de partida:** o **conjunto B** do motor com as correções 1, 2 e 8 (passou no grave, 9/10, e no agudo pelo critério de fase, 9/10). Nada mais muda.
**Legenda:** [R] decisão do responsável; [A] proposta do assistente (a aprovar); [L] literatura.

## 1. O mecanismo NB [L] (leituras já registradas)
- **Inibição:** vem de outra unidade; no jovem chega **tarde e longa**, no adulto chega **antes e curta**. Valores usados na versão fiel de 16/11: imatura chega **2,7 ms depois** e decai em **4 ms**; madura chega **0,3 ms antes** e decai em **1,5 ms**; força **0,77** da excitação (E:I ≈ 1,3, que não muda com a idade). Fontes: Cai et al. 2017 (córtex auditivo, integral); Magnusson et al. 2005 (MSO, integral: decaimento da inibição de 4,0 para 2,0 ms após o início da audição); Dorrn et al. 2010 (E:I, integral).
- **Excitação:** na MSO do gerbil, os EPSPs encurtam e a constante de tempo da membrana chega a **~0,3 ms** em ~3 semanas (via investigação da divisão da força; resumo e trechos). **Não temos o valor inicial** da excitação jovem.
- **Dependência da experiência:** o refinamento da inibição na MSO depende da experiência espacial (Kapfer et al. 2002; Magnusson et al. 2005).

## 2. A regra [R: com os acertos; A: forma]
- Cada Uint tem uma **maturidade** m entre 0 (jovem) e 1 (madura), começando em 0.
- **Recorrência reforça:** a cada acerto na Uint, m sobe um passo proporcional ao que falta: m ← m + (1 − m) / N, com N escolhido para que **N_meio** acertos levem m a 0,5.
- **Decaimento derruba:** m cai com meia-vida própria **M_meia** quando não há acertos (pode regredir).
- **O que m controla, por interpolação linear entre jovem e madura:**
  - constante de tempo da excitação: de **τ_jovem** a **0,30 ms**;
  - inibição (unidade intermediária, alimentada pelas mesmas chegadas, força 0,77): chegada de **+2,7 ms** a **−0,3 ms**; decaimento de **4,0 ms** a **1,5 ms**.
- A janela de coincidência (0,21 ms) e o resto do conjunto B **não mudam**.
- **Substitui** a inibição do plano B (mesma chegada, × 0,5, uma janela depois).

## 3. Números a mapear [A]
- τ_jovem ∈ {0,6; 1,0; 1,5 ms} (sem valor na literatura lida);
- N_meio ∈ {30; 100; 300} acertos (100 foi o valor da versão fiel de 16/11, sem fonte direta);
- M_meia ∈ {300 s; 3.600 s} (300 s é a meia-vida dos ramos instáveis; 3.600 s, uma escala mais lenta).
- 3 × 3 × 2 = 18 combinações × grave e agudo (notas, I1→ substituída pela inibição que amadurece) × **10 sementes (21 a 30, novas)** = **360 execuções** (estimativa: ~10–15 min; confiança média).

## 4. Medidas
As de antes (classe do grave; seleção em fase no agudo; Uints sintonizadas; parte verdadeira; diferença preferida pela mediana; ramos, eliminados, força total, insumo da Pcrt), mais: **maturidade média** das Uints ao fim de cada episódio, e o número de Uints maduras (m ≥ 0,9) no fim.

## 5. Leitura (fixada agora)
- Referência: o conjunto B **sem** maturação, nas mesmas sementes novas (21–30), rodado junto (40 execuções a mais; total **400**).
- **Uma combinação passa** se o grave selecionar em ≥ 8/10 **e** o agudo selecionar em fase em ≥ 8/10, nas sementes 21–30.
- Se **alguma** passar: o responsável escolhe uma e ela segue para o degrau 2 (duas relações). Se **nenhuma** passar e a referência passar: a maturação, nesta forma, **piora** o modelo → levar ao responsável com diagnóstico, sem ajustar. Se a referência também não passar nas sementes novas: o resultado de B não se replica → levar ao responsável.

## 6. Previsões [A]
1. Com excitação jovem longa, as Uints disparam **mais cedo** (janela efetiva mais larga), o que ajuda a partida; a inibição jovem, tardia e longa, não mata a coincidência porque chega depois e a excitação também é longa.
2. À medida que as Uints amadurecem, a sintonia fica **mais precisa** (diferença preferida mais concentrada em Δ).
3. **Risco:** com τ_jovem longo, as Uints jovens disparam em muitas coincidências erradas e ficam presas no acaso antes de amadurecer.

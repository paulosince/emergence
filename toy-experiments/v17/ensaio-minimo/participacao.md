# V0.17 — Registro prévio: eliminação por não participação (critério NB) com o relógio corrigido

**Estado:** **RASCUNHO** — aguarda aprovação do responsável.
**Redação:** assistente (Claude), 17/11/2026.
**Base:**
- decisões do responsável (17/11, noite): relógio só com mundo (fica); "pesquisar a forma NB" do critério; "Pular para participação";
- [investigação](../investigacao-competicao-fibras.md), seção 6.

**Modelo atual (ponto de partida):** passo 1 (limiar duro; janela retangular de 0,30 ms) + atividade espontânea (60/s; 2 s de silêncio), conjunto B, inibição I1, relógio corrigido. Motor `motor_fibras.py`.
**Legenda:** [R] decisão do responsável; [A] proposta do assistente (a aprovar); [L] literatura.

## 1. O mecanismo NB [L]
- **Junção neuromuscular:** atividade síncrona suprime a eliminação, assíncrona a promove (Busetto et al. 2000). Disparos separados por ≥ 25 ms eliminam; por ≤ 20 ms, não (Favero et al. 2012).
- **Cerebelo:** a entrada mais próxima do disparo da célula é fortalecida e as outras são eliminadas (Kawamura et al. 2013). Depende da atividade da célula pós-sináptica (Choo et al. 2017).
- **Princípio:** decide a **sincronia com o disparo da célula**; sem atividade, sem eliminação.

## 2. O que muda [A]
1. **Participação:** quando a Uint dispara, todo ramo cuja chegada excitatória está dentro da janela de integração (L_E = 0,30 ms antes do disparo) **participou** daquele disparo.
2. **Eliminação:** um ramo (não estabilizado) é eliminado quando a sua Uint disparou **N vezes seguidas sem que ele participasse**. Se a Uint não dispara, ninguém é eliminado.
3. **Sai** o critério antigo (força < θ × a mais forte do lado, por TEL).
4. Ramos novos começam "zerados": contam a partir do disparo seguinte da Uint.
5. **Equivalência e perda:**
   - a janela de "síncrono" é a da Uint (0,30 ms), não os ~20 ms da junção neuromuscular, porque o que importa é a sincronia com o disparo daquela célula;
   - **N não tem número na literatura lida**; é o análogo, comprimido, de dias a semanas de atividade.
6. Nada mais muda.

## 3. Números a mapear [A]
- **N ∈ {100, 1000}** disparos da Uint. Para referência: no grave, uma Uint dispara da ordem de 3 mil vezes por episódio no modelo atual. Confiança média.

## 4. Mundo, sementes, condições
- Degrau 1 (Δ = 0,458 ms), grave e agudo. **Sementes 221–250** (30, novas).
- **Condições:**
  - julgadas (1 fibra): (a) N = 100; (b) N = 1000;
  - referência: (c) modelo atual com o critério antigo e o relógio corrigido;
  - descritivas (8 fibras, alcance 2–4): (d) N = 100; (e) N = 1000. Servem só para informar o próximo passo.
- Total: 5 × 2 × 30 = **300 execuções**, ~25–40 min. Confiança baixa.
- Verificação de engenharia: com a opção desligada, o motor reproduz o anterior exatamente.
- **Declaração:** testes curtos (semente 1, 2 s, agudo, 1 e 8 fibras) rodaram sem erro e terminaram sem disparos (ainda sem força).

## 5. Leitura (fixada agora)
- **Passa** um N se, com 1 fibra, grave ≥ 24/30 **e** agudo em fase ≥ 24/30. Se os dois passarem, o responsável escolhe. Passou → passos 2 + 3 com o critério novo.
- Nenhum passa: levar ao responsável com diagnóstico, sem ajustar.

## 6. Previsões [A]
1. Ramos com o atraso certo participam dos disparos e ficam, **mesmo vários por lado**: os cooperadores sobrevivem juntos.
2. Ramos de atraso errado nunca participam e saem depois de N disparos.
3. **Risco:** no agudo, se a Uint não dispara (limiar duro), nada é eliminado e a força se divide. É o "ovo e a galinha" outra vez.
4. **Risco:** com N pequeno, um ramo certo que perdeu alguns disparos por tremor é eliminado cedo.

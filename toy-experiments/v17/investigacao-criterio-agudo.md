# V0.17 — Investigação: o critério de sintonia do agudo é realista?

**Pedido do responsável (18/11):** "Só o critério": antes de seguir com o agudo, conferir se o critério de fase é realista diante do que a MSO faz a ~1–1,5 kHz.
**Redação:** assistente (Claude), 18/11/2026.
**Legenda:** [L] literatura; [C] leitura do código; [I] inferência; [A] proposta (a aprovar).

## 1. O que a biologia faz [L]
- **Ambiguidade de fase:** neurônios da MSO (e o equivalente nas aves) respondem a uma diferença de tempo **e a todas as suas equivalentes de fase**, ou seja, diferenças que diferem por múltiplos exatos do período do som (estudo na coruja, PNAS, PMC27998; resumo e introdução; autoria não conferida). A ambiguidade é resolvida **mais acima**, combinando canais de frequência (idem; Peña & Konishi 2000, PNAS).
- **A largura da sintonia acompanha o período:** em neurônios do complexo olivar superior, a largura da sintonia à diferença de tempo diminui com a frequência, na relação 1/frequência esperada (Fitzpatrick & Kuwada 2001, *J Neurosci* 21:4844; resumo). Acima do complexo olivar, há neurônios com largura constante.
- **A precisão de entrada limita a sintonia:** perto de 1 kHz, as entradas têm dispersão temporal de cerca de ±100 µs, e as curvas de sintonia têm inclinações mais suaves que em frequências altas (revisão no PMC3170859, citando Köppl 1997 e Batra & Yin 2004; trecho).
- **Como se mede:** com batimentos binaurais, o **coeficiente de sincronização à fase interaural** (Goldberg & Brown 1969; usado por Yin & Chan 1990 e Batra et al. 1997, citados em Batra & Yin 2004, PMC2504554; trecho). Quanto maior o coeficiente, mais estreita a sintonia a uma diferença de tempo. **Não li valores numéricos.**
- **A melhor diferença** costuma ficar dentro de meio período ("limite π"; PMC1568946, colículo inferior; trecho).

## 2. O que o nosso critério mede [C]
- Hoje uma Uint do agudo está "sintonizada em fase" se **≥ 60%** dos seus acertos tiverem diferença de atraso a até **uma janela (0,21 ms)** de Δ ou de Δ ± k·T, com T em toda a faixa das notas (0,6–0,9 ms) e k = 1, 2.
- **Problema 1:** como T varia de nota para nota, a máscara junta faixas largas: cada equivalente de fase ocupa 0,3 ms de largura **mais** duas janelas. A máscara cobre boa parte do eixo, e o **nível do acaso** observado é 0,27–0,31.
- **Problema 2:** a janela de 0,21 ms é **~1/4 do período** do agudo. Uma sintonia cíclica como a da MSO (largura da ordem de meio período) nunca concentraria 60% numa janela de ±0,21 ms, a não ser que fosse **mais estreita que a biológica**.
- [I] Ou seja, o critério de 60% em ±0,21 ms exige do agudo uma precisão que a MSO não tem nessa faixa. E, ao mesmo tempo, a máscara de fase é larga demais para separar o certo do acaso.

## 3. Proposta [A] (decisão do responsável)
**Medir a sintonia do agudo como a biologia mede: em fase.**
1. Para cada acerto da Uint, calcular a **fase** da diferença de atraso em relação a Δ, **no período da nota tocada naquele momento**: φ = 2π·(diferença − Δ)/T.
2. Medir a **força de sintonia** R = |média de e^{iφ}| (vetor de fase; 0 = acaso, 1 = perfeito) e a **fase média**.
3. **Uint sintonizada em fase** se:
   - R for **significativamente maior que o acaso** (teste de Rayleigh, p < 0,01, com o número de acertos dela);
   - **e** a fase média estiver a menos de **π/4** de 0 (a fase de Δ).
4. **Presa** se tiver ≥ 100 disparos e R não for significativo.
5. O **grave** continua com o critério de hoje: lá o período é longo (2,5–8 ms) e a janela é pequena diante dele.
6. **Perda/limite:** não li valores biológicos de coeficiente de sincronização. Por isso o critério é **estatístico** (sintonia acima do acaso, na fase certa), e não um número biológico.
7. **Engenharia:** o motor precisa saber o período da nota em cada acerto (hoje não sabe). A mudança só acrescenta medida.

## 4. Fontes
- [Resolução da ambiguidade de fase (PMC27998)](https://pmc.ncbi.nlm.nih.gov/articles/PMC27998/) — resumo e introdução.
- [Peña & Konishi 2000, PNAS (PMC34350)](https://pmc.ncbi.nlm.nih.gov/articles/PMC34350) — resumo.
- [Fitzpatrick & Kuwada 2001, J Neurosci (PMC6762340)](https://pmc.ncbi.nlm.nih.gov/articles/PMC6762340) — resumo.
- [Revisão sobre o código de diferença de tempo (PMC3170859)](https://pmc.ncbi.nlm.nih.gov/articles/PMC3170859) — trecho.
- [Batra & Yin 2004 (PMC2504554)](https://pmc.ncbi.nlm.nih.gov/articles/PMC2504554) — trecho.
- [Melhores atrasos no colículo inferior (PMC1568946)](https://pmc.ncbi.nlm.nih.gov/articles/PMC1568946) — trecho.

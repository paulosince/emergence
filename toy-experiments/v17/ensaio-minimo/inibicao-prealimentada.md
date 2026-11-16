# Ensaio da inibição pré-alimentada — registro prévio

**Estado:** RASCUNHO para revisão do responsável. Nada roda antes da aprovação. Depois de aprovado, nada aqui muda; mudanças viram errata datada.
**Data:** 16/11/2026. **Responsável:** Paulo Rogério da Silva. **Redação:** assistente (Claude).
**Base:** D22 revista (a inibição pré-alimentada chega cerca de 0,3 ms antes da excitação que acompanha); [revisão neurobiológica](../investigacao-inibicao-lateral.md); conjunto adotado na D25.

## 1. Correção antes de começar

Na conversa, o assistente disse que a condição "sem inibição" já era conhecida. **Estava errado.** A confirmação com 10 sementes ([resultados](resultados.md)) rodou **com** a inibição pré-alimentada chegando uma janela (0,21 ms) **depois**, com a constante de 0,30 ms (`mapa.py`, linhas 78–79). Não existe execução da D25 sem inibição. Este ensaio passa a ter quatro condições de inibição.

## 2. Pergunta

Com o conjunto da D25, a inibição pré-alimentada chegando antes ajuda a seleção da relação verdadeira, atrapalha, ou não muda nada? E a duração da inibição importa, em especial quando os ciclos do som são mais curtos que ela?

## 3. Hipóteses (assistente, a verificar)

- **H-estreita:** inibição chegando antes estreita a janela efetiva e reduz créditos falsos, como na oliva (Myoga et al., 2014: em certos tempos, só estreita).
- **H-acúmulo:** com duração de ~1,5 ms e ciclos mais curtos que isso, as inibições de ciclos seguidos se somam, viram um freio quase contínuo, e a via deixa de acertar.
- **H-irrelevante:** com o efeito reduzido pela constante de 0,30 ms (~−0,18 na hora da excitação), a inibição não muda o resultado.

## 4. Desenho

**Mantido da confirmação:** par de vias (A e B), relação verdadeira Δ = 0,458 ms, oscilação de 0,02 ms, conjunto da D25 (ganho +0,0065; meia-vida dos instáveis 300 s; força inicial 0,15; enfraquecimento por sincronia; portão de broto 0,3), 5 episódios de 10 s separados por 170 s, sementes 1 a 10, classificação da [seção 3 de mapa-faixas](mapa-faixas.md).

**Condições de inibição (o que varia):**

| Nome | Inibição | Quando chega | Duração (constante) |
|---|---|---|---|
| I0 | nenhuma | — | — |
| I1 | −0,5 por chegada | uma janela **depois** (como rodou até hoje) | 0,30 ms |
| I2 | −0,5 por chegada | **0,3 ms antes** (D22 revista) | 0,30 ms (a atual) |
| I3 | −0,5 por chegada | **0,3 ms antes** | **1,5 ms** (decaimento médio da inibição em fatias de adulto, Myoga et al., 2014; confiança moderada) |

**Faixas de período (o "grave" e o "agudo"):**
- **Grave:** a condição "notas" de antes: notas de 250 ms com período sorteado entre 2,5 e 8 ms (125–400 Hz). A inibição de 1,5 ms quase não se acumula.
- **Agudo:** notas de 250 ms com período sorteado entre 0,6 e 0,9 ms (~1,1–1,7 kHz), abaixo do limite de 2,4 kHz em que a Utrd emite por ciclo. A inibição de 1,5 ms cobre 2 a 3 ciclos e se acumula.
- **Cuidado declarado:** no agudo o período é menor que 2Δ, então a ambiguidade de fase é **muito maior** que no grave, com ou sem inibição. A comparação válida é **entre condições de inibição dentro da mesma faixa**, nunca grave contra agudo.

**Total:** 4 condições × 2 faixas × 10 sementes = 80 execuções.

**Ajustes de implementação necessários (engenharia, não ciência):**
1. A inibição de cada chegada é calculada com o seu próprio tempo (chegada − 0,3 ms para I2 e I3; chegada + janela para I1) e a sua constante.
2. As chegadas consideradas passam a ser escolhidas **por tempo** (as que chegaram até 5 constantes antes), não pelas 5 últimas; com a constante de 1,5 ms e períodos de 0,6 ms, as 5 últimas não bastam. O limite de soma passa de 1,5 ms para 5 constantes da inibição.
3. **Custo:** o agudo tem ~5 a 10 vezes mais pulsos. Antes de rodar a grade, o assistente mede o tempo de **uma** execução agudo-I3 (sem olhar a classe). Se a grade estimada passar de 4 h, a duração dos episódios cai de 10 s para 5 s **em todas** as 80 execuções, decidido antes de ver qualquer resultado.
4. Teste automático antes de rodar: I0 deve dar soma inibitória zero; em I2 e I3, uma chegada isolada deve produzir inibição máxima 0,3 ms antes dela e nenhum efeito depois de 5 constantes.

## 5. Medidas

Por execução: a classe (colapso, explosão, difuso, seleção); o crédito verdadeiro; se o par mais forte é o verdadeiro; disparos no último episódio; número de ramos. **Nova:** a **dispersão** dos acertos em torno de Δ (desvio-padrão de |relação − Δ| entre os acertos com |relação − Δ| ≤ janela, no último episódio), para ver se a janela efetiva estreita.

## 6. Previsões (assistente; confiança baixa: a dinâmica do par de vias já surpreendeu três vezes)

1. **Grave:** I0, I1 e I2 parecidas (diferença de até 2 sementes na contagem de seleção). I3 igual ou com dispersão menor.
2. **Agudo:** a seleção é rara em todas as condições (ambiguidade de fase). I3 tem **mais colapsos** que I0 (H-acúmulo).
3. I2 fica entre I0 e I3 em todas as medidas.

## 7. Leitura dos resultados (fixada antes de rodar; a decisão continua do responsável)

- **Indica adotar a duração biológica (I3):** no grave, I3 seleciona em pelo menos tantas sementes quanto I0, menos 1, e tem dispersão menor ou igual; e no agudo, I3 não tem mais colapsos que I0 + 2.
- **Indica problema real de acúmulo:** no agudo, I3 colapsa em ≥ 5 sementes e I0 em ≤ 2.
- **Indica custo sem ganho:** I1, I2 e I3 a até 1 semente de I0 na contagem de seleção, em ambas as faixas, e sem diferença de dispersão.
- **Qualquer outro padrão:** descrever sem forçar uma leitura e levar ao responsável.

## 8. O que este ensaio não testa

A inibição lateral (adiada). A origem da inibição numa unidade própria (aqui cada chegada traz a sua, simplificação já declarada na D22). As 384 vias e a gravação. O tempo de chegada constituído pela Pcrt (alternativa não escolhida).

## Errata (16/11/2026, depois da execução)

1. **Medida de tempo falha.** O item 4.3 mandava medir uma execução agudo-I3; ela levou 28 s, e a grade foi estimada em ~10 min. A condição medida colapsa cedo e por isso é a mais rápida; as execuções agudas sem inibição passaram de 22 min sem terminar. A regra dos 5 s não foi aplicada: quando o problema apareceu, os resultados do grave já tinham sido vistos, e a regra exigia decidir antes disso. O agudo foi interrompido; a decisão de como seguir é do responsável.
2. O caminho de importação foi corrigido (`sys.path`) antes da execução válida; a primeira tentativa falhou ao iniciar, sem produzir resultados.

# Ensaio da inibição pré-alimentada fiel (que amadurece) — registro prévio

**Estado:** RASCUNHO para aprovação do responsável. Nada roda antes. Depois de aprovado, mudanças só por errata datada.
**Data:** 16/11/2026. **Responsável:** Paulo Rogério da Silva. **Redação:** assistente (Claude).
**Base:** [revisão neurobiológica, seções 6 e 7](../investigacao-inibicao-lateral.md); [ensaio anterior](inibicao-prealimentada.md) (antes: 10/10 colapsos; uma janela depois: 8/10 seleções).
**Plano B do responsável:** se a versão fiel não funcionar, volta-se à inibição "uma janela depois".

## 1. Decisões do responsável (16/11)

| Item | Decisão | Base |
|---|---|---|
| Mecanismo | Unidade inibitória intermediária, alimentada pelas mesmas vias, que inibe a Uint; nasce perto das fontes (coordenadas constitutivas) | Oliva (núcleos do corpo trapezoide); córtex (interneurônios da via pré-alimentada) |
| O que faz amadurecer | **Os acertos da Uint** | Poda da inibição na oliva depende de pistas espaciais (Magnusson et al., 2005) |
| Estado imaturo | Chega **2,7 ms depois** da excitação que a recruta; decaimento **4 ms** | Cai et al., 2017 (atraso no córtex jovem); Magnusson et al., 2005 (decaimento na oliva em P12) |
| Estado maduro | Chega **0,3 ms antes**; decaimento **1,5 ms** | D22 revista; Myoga et al., 2014 |
| Velocidade | Metade do caminho com **100 acertos** | Faixa aceita para "crescer" (10–100 acertos) |
| Força | **0,77** da excitação que a recruta (E:I = 1,3), constante | Dorrn et al., 2010 |

## 2. Regra (tradução do assistente, a conferir)

- Maturidade da Uint: m = 1 − 2^(−n/100), com n = número de pulsos em que a Uint teve algum acerto. Escolhida a forma exponencial porque satura (m ≈ 0,97 com 500 acertos); a hiperbólica n/(n+100) também dá metade em 100, mas nunca amadurece de fato. **Escolha do assistente; o responsável pode trocar.**
- Atraso da inibição: 2,7 − 3,0·m ms (de +2,7 a −0,3). Decaimento: 4 − 2,5·m ms (de 4 a 1,5).
- Cada chegada excitatória de força w recruta, pela unidade intermediária, uma inibição de −0,77·w no seu instante + atraso, decaindo com a constante do momento; nada depois de 5 constantes.
- **Simplificação declarada:** a unidade intermediária é tratada como repasse linear (sem limiar próprio). Na biologia, o atraso inicial vem justamente do recrutamento lento e incerto dessa célula; aqui ele é dado pelo atraso imaturo. Perda: sem falhas de recrutamento, sem limiar.

## 3. Condições (grave apenas; agudo continua suspenso)

| Nome | O que testa |
|---|---|
| **F** | A regra fiel: começa imatura, amadurece com os acertos |
| **F-imatura** | Fica imatura para sempre (m = 0): separa o efeito da inibição tardia do efeito do amadurecimento |
| **F-madura** | Já nasce madura (m = 1): confirma a leitura de "fases" (deve repetir o colapso) |

Referências do ensaio anterior, com o mesmo código e as mesmas sementes: sem inibição (5 seleções em 10) e uma janela depois (8 em 10).

Mantido: par de vias, Δ = 0,458 ms, conjunto da D25, notas graves (2,5–8 ms), 5 episódios de 10 s, sementes 1–10, mesma classificação. **Total:** 30 execuções.

## 4. Medidas

As do ensaio anterior (classe, crédito verdadeiro, par mais forte, dispersão, disparos, ramos) e, na F: **maturidade final**, atraso e decaimento finais.

## 5. Previsões (assistente; conta conferível)

1. **F-madura colapsa** (≥ 8 em 10). Conta: a dupla recém-nascida soma no máximo 0,30 e a própria inibição madura tira ≈ 0,19 → 0,11. **Confiança alta.**
2. **Risco para F e F-imatura (confiança baixa):** a inibição imatura dura 4 ms e chega 2,7 ms depois; nas notas graves (períodos de 2,5–8 ms) ela cai em cima do **ciclo seguinte**. Conta para a dupla recém-nascida: com período de 4 ms a soma cai de 0,30 para ≈ 0,13; com 5 ms, ≈ 0,17; com 8 ms, ≈ 0,24. Se só a dupla contar, nada é favorecido depois do primeiro ciclo, e **F e F-imatura colapsam**. Outras chegadas dentro da janela podem compensar; não sei prever.
3. Se F seleciona, a dispersão final é menor que a do "uma janela depois" (a janela estreita na maturidade).

**Observação que vale antes do resultado:** no animal jovem, a excitação também é lenta (decaimento de ~37 ms na conexão excitatória em P10–14, Oswald e Reyes, 2011; componente NMDA grande, Chittajallu e Isaac, 2010). Aqui a excitação já é "adulta" (0,30 ms) e só a inibição é jovem. Se F colapsar por isso, a falta é de fidelidade da excitação, não da inibição. Isso **não** será corrigido neste ensaio.

## 6. Leitura (fixada antes de rodar; a decisão continua do responsável)

- **Funciona:** F seleciona em ≥ 7 de 10 e F-madura colapsa em ≥ 8 de 10.
- **Fases confirmadas, mas o amadurecimento não é necessário:** F-imatura seleciona tanto quanto F (diferença ≤ 1).
- **Não funciona:** F seleciona em ≤ 3 de 10. Aplica-se o plano B (uma janela depois), salvo outra decisão do responsável.
- Qualquer outro padrão: descrever e levar ao responsável.

## 7. Custo

Grave apenas: execuções de segundos a poucos minutos; estimativa da grade abaixo de 30 min (as do ensaio anterior no grave terminaram em ~14 min para 40 execuções).

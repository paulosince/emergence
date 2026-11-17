# V0.17 — Registro prévio: Pcrt restrita às incidências (motor corrigido)

**Estado:** RASCUNHO para aprovação do responsável (Paulo Rogério da Silva). Nada de código antes da aprovação.
**Redação:** assistente (Claude), 17/11/2026. **Motivo:** [errata de 17/11](resultados.md) — o motor antigo rodava a Pcrt sobre todos os pares de ramos, contra a decisão de 15/11.
**Legenda:** [R] decisão do responsável; [A] proposta ou dedução do assistente (não aprovada); [C] verificado no código ou nos dados.

## 1. O que muda (e o que não muda)

**Separação em dois processos** [R, 17/11]:

1. **Dinâmica do Sdom** (sem mudança de regra, só de forma de calcular): cada incidência de uma Upro desce por cada um dos seus ramos e vira uma chegada na Uint, no instante da incidência mais o atraso do ramo, com o peso do ramo. A Uint soma as chegadas (excitação e a inibição pré-alimentada do plano B). Quando a soma no instante de uma chegada alcança o favorecimento (0,3), as chegadas que coincidem dentro da janela (0,21 ms) **acertam**: seus ramos se fortalecem (+0,0065), como hoje. Enfraquecimento por sincronia, decaimento, conservação da força, estabilização e poda: **iguais** ao motor antigo.
2. **Pcrt** (muda o insumo): recebe **só as incidências sem integração**. Fixa uma, compara com as outras que têm rastro vivo, dentro da vizinhança anatômica, e dali saem os quase-acertos e o brotamento.

**Não muda:** exuberância guiada (6 ramos iniciais, 0,5–20 ms, espaçamento proporcional), força inicial 0,15, portão de broto 0,3, 5 quase-acertos para brotar, passo 0,10, limiar 1,5, classes e critérios de explosão/colapso/seleção.

## 2. Decisões que faltam ao responsável (o assistente propõe; não decide)

**Q1. Quando uma incidência conta como integrada?**
- (a) [A, recomendada] Quando **pelo menos uma** das suas chegadas participou de um acerto. Se nenhuma acertou até o fim do seu alcance (instante + 20 ms + 0,21 ms), ela expira **sem integração** e vai para a Pcrt.
- (b) Quando a chegada disparou a Uint (soma ≥ 1,5), mais exigente: muito mais incidências iriam para a Pcrt.
- (c) Outra.

**Q2. Como a Pcrt acha o quase-acerto olhando incidências?**
Duas incidências sem integração, uma de cada Upro, têm uma diferença de tempo Δ. Elas formam um quase-acerto de um par de ramos existente quando a diferença de atrasos desse par fica entre 0,21 e 0,63 ms de Δ (a mesma faixa do motor antigo: mais que uma janela, até três).
- (a) [A, recomendada] Consultar uma **lista ordenada** das diferenças de atrasos dos pares de ramos, refeita só quando nasce ou some um ramo (raro perto do número de incidências). Cada consulta é uma busca rápida, que não percorre os ramos.
- (b) Guardar a contagem de Δ e brotar onde ela se repete. **Risco:** seria entregar ao sistema a resposta (o atraso), contra a regra já registrada de que o brotamento não usa o tamanho nem o sinal do erro.
- (c) Outra.

**Q3. Até onde vai o rastro vivo na comparação?** [A] Proposta: ±19,5 ms (a maior diferença que algum par de ramos pode realizar, 20 − 0,5). No agudo, cerca de 25 incidências da outra Upro por incidência fixada; no grave, cerca de 4. É um teto fixo, que não cresce com os ramos.

## 3. O que se espera do custo (deduções, confiança média)

- **Pcrt:** proporcional às incidências sem integração × as incidências no rastro vivo. Tem teto físico (Utrd × taxa máxima) e **diminui** à medida que o Sdom aprende, porque menos incidências ficam sem integração.
- **Dinâmica do Sdom:** proporcional às chegadas (incidências × ramos da Upro), **linear** nos ramos. Hoje é aproximadamente nA × nB por pulso, vezes o percurso da soma. Para a soma, proposta [A]: manter a excitação e a inibição como somas que decaem continuamente, atualizadas a cada chegada. **Diferença declarada:** o motor antigo cortava o efeito de cada chegada em 5 constantes de tempo (resta ~0,7%); a forma nova não corta. Isso pode mudar casos na beira do favorecimento.
- **Limite que permanece:** se os ramos crescerem sem freio, a dinâmica cresce junto. Na biologia isso é física em paralelo; aqui, quem o seguraria é um limite de grau (decisão científica pendente, depende da pesquisa de grau e poda).

## 4. Previsões (escritas antes de rodar) [A]

1. **Freio natural:** como só o que falha alimenta a Pcrt, o brotamento cai quando o Sdom começa a acertar. Esperado: menos explosões que no motor antigo.
2. **Risco no agudo:** com pulsos densos, ~56% dos pares de chegadas caem na janela por acaso [C, dados da etapa 2]. Se muitas incidências se integrarem por acaso logo no início, quase nada vai para a Pcrt: pouco brotamento, risco de **colapso** ou de **difuso** (o acaso vence a relação verdadeira).
3. O conjunto de parâmetros antigo pode não ficar na região de seleção (foi escolhido com o motor errado).

## 5. Ensaio (depois da aprovação)

**Controle de código** (engenharia): com a Pcrt desligada (sem brotamento) e o corte de 5 constantes de tempo imitado, o motor novo deve dar **resultado idêntico** ao antigo na mesma condição. Isso separa erro de programação de efeito do modelo.

**Grade:** a confirmação de 16/11 (10 sementes; notas e período fixo; portão 0,30) e a inibição (I0 e I1), no **grave** e no **agudo**. Mais o tempo de execução, medido junto com o motor antigo na mesma máquina.

**Regras de leitura (fixadas agora):**
- I1 no grave com notas seleciona em **≥ 8 de 10**: o conjunto atual é mantido para os degraus seguintes.
- Seleciona em **4–7 de 10**: refazer o mapa de sensibilidade (mesmas faixas registradas em [mapa-faixas.md](mapa-faixas.md)) antes de qualquer decisão.
- **≤ 3 de 10**: parar e levar ao responsável, sem ajustar nada.
- O agudo é lido à parte. Explosão ou colapso no agudo vai ao responsável como achado, não se corrige com parâmetro.
- **Critério de parada:** uma execução que passar de 30 min é interrompida e registrada como "não concluída", com o tempo.

## 6. Fora deste registro

Limite de grau por Upro ou Uint, janela de tempo como regra nova da Pcrt, fatias paralelas, outro processo de avaliação dentro da dinâmica do Sdom: tudo depende da pesquisa pedida (grau, poda e janelas) e de decisão do responsável.

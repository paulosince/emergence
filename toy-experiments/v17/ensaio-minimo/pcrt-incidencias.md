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

**Q1. Quando uma incidência conta como integrada?** — **Decidido [R, 17/11]: (b).** Integrada é a incidência que **passou por integração**: sua chegada fez a Uint **disparar** (soma ≥ 1,5). A que só promoveu **favorecimento** (soma ≥ 0,3, sem disparo) ajudou a integrar, mas não foi integrada. Consequência: toda incidência que não fez a Uint disparar até o fim do seu alcance (instante + 20 ms + 0,21 ms) vai para a Pcrt, inclusive as que favoreceram (essas também fortalecem seus ramos, como antes). Alternativa não escolhida: (a) integrada = participou de favorecimento (recomendação do assistente).

**Q2. O que é um quase-acerto?** — **Decidido [R, 17/11]: (c), outra.** O quase-acerto **não é uma relação entre incidências**. É uma relação dinâmica entre as incidências que chegam e um nó **efetivamente constituído** na malha: **uma Uint que chega bem perto do limiar, mas não o ultrapassa**. Substitui a definição do motor antigo (par de ramos com chegadas separadas por mais de uma janela e até três). Alternativas não escolhidas: (a) lista ordenada de diferenças de atraso; (b) contagem de Δ.
**Divisão de papéis — decidida [R, 17/11]** (proposta do assistente, aceita):
- **A própria Uint avalia o quase-acerto** e responde por ele com o brotamento: os ramos cujas chegadas contribuíram para a soma perto do limiar brotam vizinhos (um passo para cada lado), sem usar o tamanho nem o sinal do erro. Avaliação local: só acontece onde houve atividade.
- **A Pcrt** trabalha sobre as incidências sem integração e **constitui** estrutura nova (Upro e Uint candidatas). No par de vias essa estrutura já vem dada (uma Uint, 6 ramos de cada lado), então a Pcrt quase não aparece; ela pesa nas 384 vias.
- **Território glial** (avaliar regiões, vários nós ao longo do tempo): variante guardada, coerente com a decisão de 10–11/11 (macroglias absorvidas nas unidades). Para o responsável, o achado de custo reforça a hipótese glial (ver innovation-tracking, seção 16).
**Faixa, partida e enfraquecimento — decididos [R, 17/11]** (base: [L] Artola, Bröcher e Singer 1990, resumo: dois limiares de despolarização, LTD entre eles e LTP acima; Golding, Staff e Spruston 2002, resumo: potenciação sem disparo do axônio, por eventos locais regenerativos; Harvey e Svoboda 2007, resumo: estímulo abaixo do limiar só produziu potenciação e aumento de espinha **perto de uma espinha recém-potenciada**, efeito de ~10 min e ~10 µm):
- **Faixa do quase-acerto:** hipótese do responsável, a integração é não linear e **acima de ~75% do limiar** já é quase-acerto (soma ≥ 1,125 sem chegar a 1,5). Nenhuma fonte dá esse número em fração do limiar (os limiares da literatura vêm em mV, com voltagem fixada). **Mapear em torno de 75%:** 50%, 75% e 90%.
- **Partida: aceita.** Com força inicial 0,15, nada chega a 75% de 1,5 no começo; o brotamento só começa depois de haver acertos que fortaleçam ramos. Registrado como **previsão** (coerente com Harvey e Svoboda 2007), não como defeito.
- **O broto é condicionado [R, 17/11]** ("duas mãos" é descrição, não termo aprovado). No quase-acerto, cada ramo que contribuiu para a soma **brota** se ele mesmo, ou um ramo vizinho da mesma Upro, **acertou há pouco**; se não, o quase-acerto é isolado e o ramo **não brota**. Base: Harvey e Svoboda 2007 (perto de um sucesso recente, o estímulo abaixo do limiar fortalece e faz crescer) e Artola, Bröcher e Singer 1990 (isolado, tende a enfraquecer). Propostas do assistente, a aprovar: **vizinho** = atraso a até 2 passos (±0,20 ms; equivalente, no par de vias, à proximidade espacial de ~10 µm, que aqui não existe); **"há pouco"** = janela a mapear em **10 s, 60 s e 600 s** (600 s ≈ os ~10 min de Harvey e Svoboda, em hipocampo de roedor).
- **Enfraquecer no quase-acerto isolado: testar (subteste com e sem).** Proposta do assistente para o valor, a aprovar junto com este registro: os ramos de um quase-acerto **isolado** perdem **1,05 × ganho** (o mesmo valor do enfraquecimento por sincronia), além de brotar.

**Q3. Até onde vai o rastro vivo na comparação?** [A] Proposta: ±19,5 ms (a maior diferença que algum par de ramos pode realizar, 20 − 0,5). No agudo, cerca de 25 incidências da outra Upro por incidência fixada; no grave, cerca de 4. É um teto fixo, que não cresce com os ramos.

## 3. O que se espera do custo (deduções, confiança média)

- **Pcrt:** proporcional às incidências sem integração × as incidências no rastro vivo. Tem teto físico (Utrd × taxa máxima) e **diminui** à medida que o Sdom aprende, porque menos incidências ficam sem integração.
- **Dinâmica do Sdom:** proporcional às chegadas (incidências × ramos da Upro), **linear** nos ramos. Hoje é aproximadamente nA × nB por pulso, vezes o percurso da soma. Para a soma, proposta [A]: manter a excitação e a inibição como somas que decaem continuamente, atualizadas a cada chegada. **Diferença declarada:** o motor antigo cortava o efeito de cada chegada em 5 constantes de tempo (resta ~0,7%); a forma nova não corta. Isso pode mudar casos na beira do favorecimento.
- **Limite que permanece:** se os ramos crescerem sem freio, a dinâmica cresce junto. Na biologia isso é física em paralelo; aqui, quem o seguraria é um limite de grau (decisão científica pendente, depende da pesquisa de grau e poda).

## 4. Previsões (escritas antes de rodar) [A]

1. **Freio, mas tardio** (dedução com Q1 = b): com força inicial 0,15 e força total 1,0 por Upro, o disparo (1,5) só é possível quando a força já se concentrou nos ramos que coincidem (pelo menos ~75% do total das duas Upro). Até lá, **toda** incidência vai para a Pcrt (coerente com "num Sdom virgem, tudo é insumo"). O brotamento só cai depois da seleção. Esperado: explosões no início em número parecido ou maior que no motor antigo; depois da seleção, brotamento bem menor.
2. **Agudo:** com pulsos densos, ~56% dos pares de chegadas caem na janela por acaso [C, dados da etapa 2]. Com Q1 = b, o acaso não tira incidências da Pcrt (favorecer não basta), então o risco no agudo é de **explosão** (muito quase-acerto), não de colapso.
3. O conjunto de parâmetros antigo pode não ficar na região de seleção (foi escolhido com o motor errado).

## 5. Ensaio (depois da aprovação)

**Controle de código** (engenharia): com a Pcrt desligada (sem brotamento) e o corte de 5 constantes de tempo imitado, o motor novo deve dar **resultado idêntico** ao antigo na mesma condição. Isso separa erro de programação de efeito do modelo.

**Grade, em duas etapas.** **Etapa A** (grave, notas, I1, 10 sementes): faixa do quase-acerto (50%, 75%, 90%) × janela do "há pouco" (10 s, 60 s, 600 s) × enfraquecimento do isolado (com e sem) = 18 combinações, **180 execuções**. O responsável vê o mapa e escolhe o conjunto, como no mapa de 16/11. **Etapa B**, com o conjunto escolhido: a confirmação de 16/11 (notas e período fixo; I0 e I1; grave e agudo; 10 sementes) = 80 execuções. Tempo de execução medido junto com o motor antigo na mesma máquina.

**Regras de leitura (fixadas agora):**
- Na etapa B: I1 no grave com notas seleciona em **≥ 8 de 10**: o conjunto atual é mantido para os degraus seguintes.
- Seleciona em **4–7 de 10**: refazer o mapa de sensibilidade (mesmas faixas registradas em [mapa-faixas.md](mapa-faixas.md)) antes de qualquer decisão.
- **≤ 3 de 10**: parar e levar ao responsável, sem ajustar nada.
- O agudo é lido à parte. Explosão ou colapso no agudo vai ao responsável como achado, não se corrige com parâmetro.
- **Estabilização [R, 17/11]: medir e reportar**, sem virar critério ainda: número de ramos que passam a estável, força máxima do ramo verdadeiro e intervalo entre acertos. Motivo: no motor antigo nenhuma execução classificada como seleção estabilizou um ramo (6 estabilizações nos 70 casos do grave, todas em I2 classificada como colapso; contagem do ChatGPT em [investigacao-escala](../investigacao-escala.md)).
- **Critério de parada:** uma execução que passar de 30 min é interrompida e registrada como "não concluída", com o tempo.

## 6. Fora deste registro

**Limite de grau [R, 17/11]:** decidir **depois** deste ensaio, vendo se o motor corrigido ainda prolifera ramos (no antigo: 49–88 por Upro; na MSO do gerbil, mediana de 4 contatos por par axônio–dendrito, Callan 2021).


Limite de grau por Upro ou Uint, janela de tempo como regra nova da Pcrt, fatias paralelas, outro processo de avaliação dentro da dinâmica do Sdom: tudo depende da pesquisa pedida (grau, poda e janelas) e de decisão do responsável.

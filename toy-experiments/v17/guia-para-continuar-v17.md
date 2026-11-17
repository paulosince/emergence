# V0.17 — guia para quem for continuar o trabalho (por exemplo, o ChatGPT)

**Escrito em:** 16/11/2026, ao fim de uma sessão longa com o Claude. **Responsável:** Paulo Rogério da Silva.
**Estatuto:** guia de passagem. Não é pré-registro, não decide nada, não substitui os documentos citados. Se este guia e um documento de origem divergirem, vale o documento de origem (e avise o Paulo).

## Atualização de 17/11/2026 (leia antes do resto)
- O motor do ensaio mínimo rodava a Pcrt sobre todos os pares de ramos, contra a decisão de 15/11 ([errata](ensaio-minimo/resultados.md)). Foi substituído pelo **motor por eventos** (`ensaio-minimo/motor_eventos.py`): Pcrt restrita às incidências sem integração; integrada = fez a Uint disparar; quase-acerto = Uint perto do limiar (≥ 75%) sem disparar, avaliado pela própria Uint; broto só perto de acerto recente; competição ligada ao disparo (adendo). Registros prévios: `pcrt-incidencias.md` e `competicao-disparo.md` (aprovados). Uma execução do agudo caiu de mais de 10 min para ~1 s.
- **Estado: ensaios PAUSADOS pelo responsável para revisão do mecanismo.** O grave cumpre o critério (8/10), mas por desempate do classificador; a força vai para a região da relação verdadeira em 10/10, dividida entre vizinhos e cópias; o agudo colapsa.
- Novas investigações: `investigacao-escala.md` (ChatGPT), `investigacao-pre-audicao.md` (três camadas: dado, atividade própria antes do mundo, selecionado pelo mundo), `investigacao-competicao.md` (precedente: Gerstner et al. 1996).
- O que está abaixo (seções 3–4) descreve o estado de 16/11 e vale com essas correções.

## 0. Antes de tudo

1. Leia **inteiro** o [CONTINUITY.md](../../CONTINUITY.md), o [CLAUDE.md](../../CLAUDE.md), a [metodologia](../../docs/program-methodology.md) e a [nomenclatura](../../docs/nomenclature.md). Este guia só cobre a V0.17.
2. O trabalho desta fase está no ramo **`claude/pre-v17-ramos`** (o CONTINUITY.md cita outro ramo, `claude/zealous-hawking-sdw2w8`, de uma fase anterior; não é onde a V0.17 está).
3. **Não altere o repositório TEMPO** (`paulosince/temporotopological-relations`). Só leitura.

## 1. Regras que não se negociam (resumo; o texto completo está no CONTINUITY.md)

- **Decisões científicas são do Paulo:** mecanismo, critérios, limiares, equivalências. Proponha com recomendação, **não decida**, registre. Pergunte quando não estiver claro; não infira.
- **Nunca invente fonte nem número.** Diga o que foi lido (resumo ou texto integral) e a **confiança de cada número**. Se não achou, diga que não achou.
- **Nomes, não códigos.** Hipóteses, critérios, propostas e itens são citados por nome. **Não crie nomes de termos da teoria por conta própria:** nomes são combinados e aprovados com o Paulo antes de entrar na teoria ou no artigo.
- Diga, para cada regra, se vem da **literatura** ou é **proposta/inferência nossa**.
- Não marque item do roteiro como concluído sem validação do Paulo.
- A cada proposta, precedente ou evidência nova, atualize [docs/innovation-tracking.md](../../docs/innovation-tracking.md) (o que existe, o que seria novo, o que falta para alegar).
- Modelo é o **neurobiológico**. Divergir só com simplificação agnóstica de substrato **justificada** (mecanismo entendido, equivalência proposta, perdas declaradas).
- **Responda em português, em linguagem simples.** O Paulo valoriza cuidado no tom e responde melhor a explicações simples. Se ele fizer uma piada ou digressão, reconheça antes de voltar ao assunto. Objeções longas: divida em partes numeradas e apresente uma por vez.
- A CLEAR atual é a **versão 43** (em revisão, "dá um norte, não é a última palavra"). O preprint v2.1.0 está desatualizado. O estudo é sobre **consciência**; querer, valia e afins são ramos/instrumentos.

## 2. O que a V0.17 quer saber

Testar a **matemática multidimensional transdutiva** com uma Pcrt de **construção gradual**: som real (Bach, Tocata e Fuga em Ré menor, BWV 565, gravação de Ashtar Moïra, domínio público, estéreo sem alterações) numa sala de 2 × 2 × 3 m, dois alto-falantes em paredes opostas, **robô parado**, três execuções da peça com silêncio entre elas.

Pergunta central: a construção gradual, sem programar nenhuma convergência, **não explode** e **seleciona o que é estável no mundo** (onde estão as fontes) mais do que o instável (coincidências entre notas), e o consolidado é reacessado nas execuções seguintes?

A V0.16 "nasceu podre" (as três condições davam o mesmo resultado porque a diferença testada não chegava às Utrd). Por isso a lição desta versão: **verificar antes que as relações chegam às Utrd**.

Documentos-base: [pré-experimento (rascunho v0.4, NÃO congelado)](pre-experimento.md), [decisões em construção](decisoes-em-construcao.md) (**é a tabela de decisões do Paulo; leia primeiro**), [a gravação](gravacao.md).

## 3. Onde estamos (16/11/2026)

### 3.1 Decidido pelo Paulo (resumo; a tabela completa está em decisoes-em-construcao.md)
- Cenário, fonte do som, robô parado, três execuções, reflexões da sala só (a) sem reflexões e (b) primeiras reflexões; trovão e chuva retirados.
- 384 vias (2 orelhas × 64 faixas × 3 limiares). Abaixo de ~2,4 kHz a Utrd emite no ciclo; acima, acompanha o envelope (proposta herdada da V0.15).
- Regras de construção: exuberância guiada, ganho +0,0065 por acerto, meia-vida dos instáveis 300 s, força inicial 0,15, enfraquecimento por sincronia, portão de broto 0,3, acerto exige favorecimento ≥ 0,3. Base: mapa e confirmação com 10 sementes (9 de 10 selecionam nas notas).
- **Repetição interna: adiada** (só decaimento nos silêncios). **Inibição lateral: adiada** (ambas dependem de um segundo nível, relações entre Uint, que a V0.17 não tem).
- **Inibição pré-alimentada: plano B** (chega uma janela depois, 0,21 ms, duração 0,30 ms, −0,5 por chegada). A versão "fiel" à biologia colapsou em 30 de 30 e ficou como hipótese futura.
- **Vizinhança de comparação** dada pela anatomia: entre orelhas, mesma faixa ±2; dentro da orelha, faixas vizinhas ±2 e os 3 limiares. Cerca de 5.500 pares em vez de 73.000.
- Sessões de Bach **separadas**, com pausa e inspeção do Paulo entre elas (mesmo Sdom, estado salvo). Antes, **sessão de teste de 10 s** com dois trechos (abertura e trecho cheio da fuga), com critérios de parada escritos antes.
- Entre versões passam **só parâmetros**, nunca estrutura consolidada.

### 3.2 Resultados já em mãos (detalhes: [ensaio-minimo/resultados.md](ensaio-minimo/resultados.md))
Todos são de **um par de vias com pulsos ideais**, não das 384 vias nem da gravação. Não generalize além disso.

| Ensaio | Resultado | Confiança |
|---|---|---|
| Conjunto confirmado (10 sementes, notas) | seleção em 9 de 10 | alta (medido); poucas sementes |
| Inibição "uma janela depois" (I1), grave | seleção 8/10, 2 explosões; sem inibição: 5/10 e 5 explosões | alta (medido), 10 sementes |
| Inibição "antes" (I2/I3), grave | colapso 10/10 | alta; mecanismo deduzido e conferível: a dupla recém-nascida soma no máximo 0,30 e a própria inibição a derruba (0,245 / 0,177) |
| Inibição fiel (F, imatura, madura) | colapso 30/30, nenhum acerto | alta (medido); causa deduzida |
| Notas **agudas** | **sem resultado** | o ensaio foi interrompido; nada foi visto |

### 3.3 Engenharia (motor rápido)
- **`ensaio-minimo/motor_par.py`** reescreve o par de vias em **numba**; **`valida_motor_par.py`** o compara com as execuções de referência. Resultado medido: **70 de 70 execuções idênticas em todos os campos** (classe, ramos, relações, crédito, dispersão, disparos); 119 s de CPU no total (2 CPUs). Referência em Python puro: ~14 min só para as 40 do grave (medida anterior, confiança média).
- **Não medido:** o tempo do motor rápido nas notas **agudas**. Uma tentativa passou de 10 min sem terminar e foi perdida quando o ambiente encerrou o processo. **Não afirme que o agudo ficou rápido.** O próximo passo é perfilar onde o tempo vai (suspeita, não confirmada: o custo vem do número de pares de Upro por milissegundo, não da linguagem).
- **Rust:** discutido, **não tentado**. O numba já usa o mesmo back-end (LLVM); a estimativa de ganho do Rust é de empate a ~30% (confiança baixa, palpite). O ganho grande esperado vem do algoritmo (orientação a eventos, vizinhança ±2), e só o paralelismo teria efeito extra (apenas 2 CPUs). Se for portar, use `valida_motor_par.py` como rede de segurança (exigir 70/70 idênticas).
- Ambiente usado: Node 22, Python 3 com numpy/scipy/matplotlib, ffmpeg, numba 0.68.1 num venv (`/home/claude/venv-nb`, **fora do repositório**; recrie com `python3 -m venv venv-nb && venv-nb/bin/pip install numba numpy`). O `__pycache__` do numba não deve ser commitado.

## 4. O que falta (em ordem)

**Decisões do Paulo ainda pendentes (não decida por ele):**
1. **Coordenadas constitutivas na V0.17.** A regra aprovada em 09/11 dá posição a toda unidade (canais pela anatomia do sensor; unidades novas nascem perto das fontes aferentes; latência pela distância só como variante). Falta decidir a **posição anatômica das 384 vias** (por exemplo, lugar tonotópico na cóclea de cada orelha) e se a **latência pela distância** entra ou fica desligada. O Claude chegou a dizer, errado, que "o Sdom não tem coordenadas"; o Paulo corrigiu.
2. Tempo da inibição: com constante de disponibilidade de 0,30 ms, uma inibição que chega 0,3 ms antes teria só ~37% da força na chegada da excitação (dedução do Claude). Pode justificar diferença por sinal; decisão dele.
3. (Opcional) testar excitação "jovem" junto com inibição "jovem".

**Antes de congelar o pré-experimento:** calibrar os limiares das Utrd para a gravação; atualizar a previsão P3 com a diferença de chegada medida (~0,46 ms); conferir no original as fórmulas do modelo esférico (Brown & Duda); conferir as fontes citadas de memória; atualizar a descrição e a medida "unidades sobreviventes por via"; gerar o PDF ao congelar.

**Escada de ensaios (todos com a inibição "uma janela depois"), um degrau por vez, com resultado ao Paulo entre eles:**
1. Par de vias com notas agudas (resolver o tempo de execução antes).
2. Par com duas relações verdadeiras (uma por alto-falante).
3. Par com a gravação real numa faixa.
4. Cerca de 8 faixas por orelha, 30 s.
5. 384 vias num trecho curto.
6. Sessão de teste de 10 s de Bach (os dois trechos) e depois as três sessões completas, com pausa e vídeo.

**Vídeo da visão 3D do Sdom** surgindo com a música tocando (som e imagem): há um quadro de exemplo em [visual/quadro_exemplo.py](visual/quadro_exemplo.py) (estrutura **fictícia**, rotulada; som e espectrograma reais). O Paulo quer ser **avisado quando for com Bach e a gravação**: avise.

## 5. Cuidados e armadilhas já vistas (aprenda com elas)

- Não diga que algo é "já conhecido" sem checar a condição exata rodada. O Claude errou assim sobre a confirmação sem inibição.
- Hipótese minha refutada: "a inibição nasce fraca e cresce". Os dados de desenvolvimento mostram o contrário (Dorrn 2010; Magnusson 2005): em jovens a inibição chega tarde e longa.
- Não atribua autoria sem conferir (houve um caso em que a autoria de uma fonte teve de ser marcada "a verificar").
- Textos integrais foram lidos por extração de um modelo auxiliar, não por texto cru, porque o shell não acessa sites e o PMC às vezes bloqueia. **Declare isso** sempre que for o caso, e dê confiança menor aos números tirados daí.
- Interromper uma execução longa sem registrar vira número perdido. Escreva o critério de parada **antes** de rodar.
- Não aplique regras do registro prévio a resultados que não foram vistos (foi o caso do agudo).

## 6. Mapa de arquivos desta versão (`toy-experiments/v17/`)

| Arquivo | Para que serve |
|---|---|
| `pre-experimento.md` | rascunho v0.4 do pré-experimento (não congelado) |
| `decisoes-em-construcao.md` | decisões do Paulo, com data |
| `gravacao.md`, `estimulo/`, `analise/` | proveniência (SHA-256), licença e medidas da gravação |
| `investigacao-repeticao.md` | por que a repetição interna foi adiada |
| `investigacao-inibicao-lateral.md` | mecanismo biológico da inibição, leitura integral das fontes principais |
| `investigacao-convergencia.md` | vizinhança de comparação e comparação de escala com o cérebro humano |
| `ensaio-minimo/` | scripts, saídas e [resultados.md](ensaio-minimo/resultados.md); `motor_par.py` e `valida_motor_par.py` (motor rápido) |
| `visual/` | quadro de exemplo da visualização do Sdom |
| [docs/innovation-tracking.md](../../docs/innovation-tracking.md) | seções 14 e 15 (inibição lateral; vizinhança de comparação) |

## 7. Comparação de escala com o cérebro humano (resumo)

As 384 vias correspondem a ~1/160 das fibras do nervo auditivo humano; os ~14 Uint projetados por via seriam cerca de 100× a densidade de neurônios da oliva superior medial humana (estimativa de ~0,13 neurônio por fibra). Provavelmente é exagero, porque as Uint também fazem o papel de núcleo coclear. Confiança nos números: **média a baixa** (extrapolações a partir de contagens de Herculano-Houzel e de outras fontes; ver a investigação). Métrica sugerida (ainda não aprovada como nome): unidades sobreviventes por via.

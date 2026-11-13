---
title: "EMERGENCE V0.15 — Especificação do experimento (Etapa II, candidata)"
subtitle: "Criação e utilização da representação transduzida — som"
author: "Responsável: Paulo Rogério da Silva · Redação: assistente (Claude)"
date: "13/11/2026 — versão 1.0, CONGELADA"
lang: pt-BR
---

# Estado

- **CONGELADA** em 13/11/2026 (versão 1.0), junto com o [pré-experimento](pre-experiment.md). Desvios na implementação serão registrados em `deviations.md`, sem alterar este texto.
- Os valores marcados "(D#)" foram **decididos pelo responsável** em 13/11/2026 (pré-experimento, seção 6). Os demais são infraestrutura proposta pelo assistente e entram no congelamento junto com o documento.
- A legenda de estatuto ([R], [A], [L], [P], [C]) é a mesma do pré-experimento.

# 1. Fronteira: fornecido, determinado pelo sistema, demonstrado

| Fornecido (infraestrutura) | Determinado pelo sistema (Pcrt e dinâmica) | A demonstrar (separadamente) |
|---|---|---|
| Mundo sonoro e sua física (fontes, azimute, ruído) | **Se e quando** chamar UintFactory e UproFactory | L1: propagação com atrasos medidos |
| Utrd: ressonadores, retificação, limiares, refratariedade | **Quais vias** são origem de cada Upro | L2: toda criação vem da Pcrt, com trilha completa |
| UintFactory, UproFactory, seus contratos e valores-padrão | **Quais candidatas** sobrevivem à seleção (e, com isso, a diferença de atraso efetiva) | L3 parcial: reacesso por propagação, seletividade, dissociação A/A′ |
| Regras da Pcrt (seção 6) | Quais Uint disparam a cada momento | — |
| Relógio do experimento, filas de eventos, registro | — | — |

**Proibido na condição experimental** ([regra de não substituição](../../docs/program-methodology.md#regra-vinculante-de-não-substituição-do-fenômeno-por-programação-12112026), item 3): chamar factory a partir do roteiro de estímulos; semear Uint ou Upro; disparar factory por relógio; escolher destino por ID ou índice; qualquer estrutura que associe propriedades do sinal (faixa, intervalo, padrão) a uma Uint ou Upro já existente.

# 2. Mundo sonoro

## 2.1 Geometria [A]

- Dois sensores (E e D) separados por 0,20 m; velocidade do som 343 m/s.
- Fonte em azimute θ (0° = frente; positivo = direita). Diferença de chegada: Δ = 0,20·sen(θ)/343 s. Exemplo: θ = ±30° → ±0,29 ms; máximo ±0,58 ms.
- **Sem** sombra da cabeça (sem diferença de nível entre sensores) e sem reverberação. Perdas declaradas.

## 2.2 Geração do sinal [A]

- Taxa de amostragem 32 kHz. Os sinais são somas de senoides calculadas **analiticamente** em t − atraso, sem interpolação de amostras.
- Ruído de fundo branco gaussiano, **independente por sensor**, com semente própria por apresentação, 40 dB abaixo do nível nominal (D16).
- Cada apresentação tem fase inicial sorteada para cada componente (semente própria). **Nenhuma apresentação repete a sequência de amostras de outra.**
- Envelope: rampa cosseno de 10 ms no início e no fim.

## 2.3 Catálogo de estímulos (nomes do observador, nunca entregues ao sistema)

| Estímulo | Conteúdo | Azimute | Duração |
|---|---|---|---|
| A | Complexo harmônico, f0 = 200 Hz, harmônicos 1–5, amplitudes iguais, nível nominal | −30° | 300 ms |
| B | Complexo harmônico, f0 = 300 Hz, harmônicos 1–5, nível nominal | +30° | 300 ms |
| C | Complexo **inarmônico**: 230, 470, 690, 1.010, 1.270 Hz, nível nominal | 0° | 300 ms |
| A′ | Igual a A, mas em +30° | +30° | 300 ms |
| A+ | Igual a A, +12 dB | −30° | 300 ms |
| R | Ruído de banda larga (K9) | 0° | 300 ms |

## 2.4 Sequências (cada execução começa do zero: zero Uint, zero Upro)

Estrutura comum: 0,5 s de silêncio (só ruído de fundo) → **bloco 1**: 10 apresentações (intervalos de 200 ms) → 1 s de silêncio → **bloco 2**: 10 apresentações → 1 s de silêncio → **bloco de teste**: 5 apresentações.

| Sequência | Bloco 1 | Bloco 2 | Teste | Para quê |
|---|---|---|---|---|
| S1 | A | B | A | Reacesso (principal) |
| S2 | A | B | B | Reacesso de B, controle de ordem |
| S3 | A | B | C | Sinal novo |
| S4 | A | B | A′ | Dissociação "o quê" e "onde" (exploratória) |
| S5 | A | B | A+ | Recrutamento (exploratória) |
| S6 | B | A | A | Permutação da história (K10) |

**Sementes:** 10 por combinação sequência × condição. Fluxos aleatórios **separados** para ruído, fases iniciais e controles.

# 3. Utrd (borda transdutora) — Utrd estrita [R]

Para cada sensor s ∈ {E, D} e faixa k = 0…12:

1. **Ressonador:** filtro passa-banda de 2ª ordem (biquad), Q = 4, frequência central f_k = 150·2^(k/3) Hz. São 13 faixas de 150 a 2.400 Hz (D3).
2. **Retificação de meia onda:** r(t) = max(0, y(t)).
3. **Vias de recrutamento:** j = 0, 1, 2 com limiares θ_j = θ₀·10^(j/2), um degrau de 10 dB (D4). θ₀ é calibrado **uma vez, antes de qualquer execução**, para que o nível nominal ultrapasse θ₀ e θ₁ na faixa de maior resposta, e registrado (D16).
4. **Emissão:** a via (s, k, j) emite uma incidência quando r(t) cruza θ_j subindo e a via não está refratária. O instante é obtido por **interpolação linear** entre as amostras do cruzamento.
5. **Refratariedade da via:** 1 ms.
6. **Incidência emitida:** {id único, via, instante, magnitude = 1, efeito = +1}. Magnitude fixa na fronteira (regras de 11/11 [P]); efeito só excitatório (perda declarada).

Total: 2 × 13 × 3 = **78 vias**. Os identificadores das vias são **opacos** (cadeias sorteadas por semente própria). A física da via não depende do nome.

**A Utrd não faz:** convolução, comparação entre faixas ou entre sensores, detecção de início ou fim, normalização adaptativa. Ela não sabe que há outras vias.

# 4. Upro e UproFactory (contrato estendido, D2)

## 4.1 Contrato

- `UproFactory.create({origem, destino, atraso}, trilha)`
- **origem:** uma via de Utrd **ou** uma Uint (a segunda só na condição de segundo nível, D14). **destino:** uma Uint existente. Não existe Upro sem destino.
- **atraso:** número > 0, em ms.
- **trilha:** referência ao registro da operação da Pcrt que gerou a chamada (seção 6.6). A factory **recusa** a chamada sem trilha válida. Uma trilha válida é uma referência a um registro **criado pelo módulo da Pcrt** no mesmo relógio, verificada por um registro interno ao qual o chamador não tem acesso de escrita.
- Duplicata (mesma origem, mesmo destino, mesmo atraso) é recusada.

## 4.2 Propagação [P]+[A]

- Quando uma via emite, ou uma Uint dispara, a incidência é entregue por **todas** as Upro que partem dela (D8). Não há seleção de saída.
- Entrega no instante t + atraso, com a mesma magnitude e o mesmo efeito, e com a referência da incidência de origem.
- Fila de eventos única ordenada por instante. Empates são resolvidos por número de sequência de criação do evento, que é determinístico.
- **Sem plasticidade na V0.15:** o atraso de uma Upro nunca muda. A única mudança permitida é a **remoção de candidatas** na seleção (6.4), além das intervenções de controle K3 e K4, aplicadas por fora e registradas.

# 5. Uint e UintFactory

## 5.1 Contrato

- `UintFactory.create(trilha)` → Uint com parâmetros-padrão da infraestrutura: limiar θ_U = 1,5; constante de disponibilidade τ = 0,30 ms; refratariedade 1 ms. Esses valores são infraestrutura, não escolha da Pcrt.
- **Janela efetiva** para duas chegadas de magnitude 1: W = τ·ln(1/(θ_U − 1)) = 0,30·ln 2 ≈ **0,21 ms** (HC6, D6).

## 5.2 Operação (com as regras D17 e D17a)

1. **Estado:** para cada **origem** aferente (via ou Uint de onde partiu a incidência), a chegada mais recente: instante, magnitude × efeito e referência da Upro e da incidência de origem. Também o fim da refratariedade. Esse estado é indexado pela **origem aferente**, nunca por propriedades do sinal.
2. **Chegada de uma entrega:** a contribuição daquela origem é **substituída** pela nova (D17a). Chegadas da mesma origem não se somam (D17).
3. **Potencial:** V(t) = Σ, sobre origens distintas, de c_o·exp(−(t − t_o)/τ), em que c_o e t_o são o valor e o instante da chegada mais recente da origem o.
4. **Disparo:** se V ≥ θ_U e a Uint não está refratária, ela **dispara**. Registra como contribuintes as origens cuja chegada mais recente está nos últimos W ms, com a respectiva Upro (é a candidata creditada na seleção, 6.5). Zera as contribuições, entra em refratariedade e emite uma incidência (magnitude 1, efeito +1) por todas as suas Upro de saída.
5. **Registro local de participação** (descrição, não nome; [A]): cada incidência de origem creditada no disparo recebe a referência desse disparo. É o único "retorno" da Uint e é local: só toca as incidências que de fato chegaram a ela.

**Invariante verificado em teste:** uma Uint só muda de estado dentro da rotina de entrega. Não existe outro caminho de código que a ative.

# 6. Pcrt (condição principal: atraso por seleção, D5)

Todas as regras abaixo são **infraestrutura fornecida**. O que elas produzem (quais pares, quando, quais atrasos) é o que se observa.

## 6.1 Traço por via [P]

Cada via guarda só a sua **emissão mais recente**: instante e referência da incidência. Esse é o traço da via (D15: só a mais recente, contra *aliasing*).

## 6.2 Coincidência entre fontes distintas [P]

Quando a via j emite a incidência e_j no instante t_j, para **cada outra via** i cujo traço e_i satisfaz 0 ≤ t_j − t_i ≤ Δmax = 3 ms (D15), forma-se um **par candidato pendente** (e_i, e_j) com intervalo vivido Δ = t_j − t_i. Pares da mesma via não existem; pares de vias do mesmo ressonador existem (D13).

## 6.3 Não acomodação, decidida pela propagação [P]+[A]

O par pendente só é avaliado após T_ava = d_base + Δmax + W (tempo máximo para qualquer disparo causado por essas incidências). Na avaliação:

- se e_i e e_j têm **a mesma referência de disparo** no registro local de participação, o par foi **acomodado** por uma Uint existente e é descartado;
- caso contrário, o par conta como **não acomodado**.

Essa decisão consulta só as duas incidências. **Não consulta nenhuma estrutura que liste Uint ou Upro.**

## 6.4 Consolidação por recorrência [P] → constituição com candidatas (D5, D5a, D5b, D7)

- Registro precursor por par **ordenado de vias** (i, j): lista dos intervalos vividos não acomodados nos últimos T_fecho = 2 s do relógio do experimento (D7).
- **Portão de recorrência:** se pelo menos n_rec = 5 intervalos da lista estão a menos de W do intervalo mais recente (D6, D7), a Pcrt **constitui conjuntamente**:
  1. `U = UintFactory.create(trilha)`;
  2. para **cada uma das duas vias** (i e j), 16 Upro candidatas até U, com atrasos fixos 0,5 + 0,2·m ms, m = 0…15, isto é, de 0,5 a 3,5 ms (D5a, D5b revista).

  **Os atrasos não usam o intervalo vivido nem a ordem das emissões.** O intervalo vivido só serve ao portão de recorrência.
- Em seguida, o registro precursor do par é **apagado**. **Nenhuma estrutura guarda a referência de U a partir das vias.** A única ligação entre a via e U são as próprias Upro, percorridas por propagação.

**Por que funciona com a regra D17/D17a:** como chegadas da mesma via não se somam, a Uint só dispara quando chegam juntas incidências das **duas** vias. Durante a seleção, as candidatas cobrem todo o intervalo, então U dispara para quase qualquer intervalo vivido. Em cada disparo, porém, só é creditada a candidata de cada via que chegou por último, a mais próxima do encontro. A cada recorrência com o mesmo intervalo vivido, são creditadas as mesmas candidatas. Depois da poda, sobram só elas, e U passa a disparar apenas para o intervalo aprendido (dentro da janela de ~0,21 ms).

## 6.5 Seleção e poda mínima (D5) [L]+[A]

- **Período de seleção:** 2 s do relógio do experimento a partir da constituição de U.
- Uma candidata **contribui** quando uma chegada sua está entre as contribuições registradas num disparo de U (seção 5.2, item 3).
- Ao fim do período, as candidatas que **nunca contribuíram** são removidas. Essa remoção é a poda mínima autorizada na D5 e fica registrada na trilha.
- **Remoção (D18):** se U ficar com Upro sobreviventes de menos de duas origens diferentes, U é removida com as Upro restantes.
- Referência: seleção de atrasos (Gerstner et al., 1996; resumo).

## 6.6 Trilha (obrigatória para cada chamada e cada remoção)

Cada constituição grava um registro imutável com: ids das incidências de cada intervalo da lista de recorrência → suas vias e instantes → os intervalos vividos → a regra satisfeita (n_rec, W) → os argumentos das chamadas → ids criados. A partir dos ids das incidências, a trilha volta até o estímulo do mundo e a amostra em que a Utrd emitiu. Cada remoção da seleção grava: candidata, U, período, ausência de contribuição.

**Variante não adotada:** atraso por deslocamento (derivado do intervalo vivido). Fica registrada como alternativa recusada na D5, sem execução.

## 6.7 Condição exploratória de segundo nível (aprovada na D14)

Os disparos de Uint também deixam traço e participam de 6.2–6.4 como "fontes", pela mesma regra ("recursão pela mesma regra" [P]). Os resultados ficam **fora** dos critérios de êxito.

# 7. Controles e intervenções

Todos são executados **fora** da condição experimental e rotulados como controle.

| Código | Controle | Como | O que discrimina |
|---|---|---|---|
| K1 | *Lookup* (controle positivo de H0) | Variante em que o reacesso usa um índice par-de-vias → Uint, no estilo da V0.13 | Mostra a assinatura de H0: insensível a K3 e K4 |
| K2 | Criação por relógio | Mesmas contagens de Uint e Upro da execução principal de mesma semente, criadas em instantes fixos, com origens sorteadas entre as vias ativas nos últimos 3 ms e atrasos sorteados em [d_base, d_base + Δmax] | Separa "ter Uint" de "ter as Uint certas" |
| K3 | Origens embaralhadas | Antes do bloco de teste, troca a via de origem de cada Upro por outra sorteada, preservando contagens e atrasos | Testa a dependência da fundamentação transdutiva |
| K4 | Atrasos embaralhados | Antes do bloco de teste, permuta os atrasos entre as Upro | Testa o conteúdo temporal (M4) |
| K5 | Ablação | Antes do bloco de teste de S1, remove as Uint criadas no bloco 1 e suas Upro | H1 prevê recriação para A e B intacto |
| K6 | Permutação de identificadores | Execução inteira com outros ids opacos de vias e Uint, mesma física | Invariância exata a menos da troca de nomes |
| K7 | Sem observador | Execução sem métricas nem registro detalhado; compara o resumo estrutural final (hash) | O observador não interfere na dinâmica |
| K8 | Silêncio | (a) Silêncio absoluto, sem ruído; (b) só ruído de fundo durante toda a execução | (a) Nenhuma incidência e nenhuma criação; (b) quanto o ruído sozinho cria, medido |
| K9 | Ruído de banda larga (exploratória, autorizada na D11) | 20 apresentações de R | Previsão de Shamma e Klein: surgem Uint ligando vias em razões harmônicas? |
| K10 | Permutação da história | Sequência S6 | Efeito de ordem |
| K11 | Regra D17 desligada (instrumental) | Mesma execução de S1, mas a Uint soma chegadas da mesma origem | Mede quantos disparos de origem única a regra evita; testa a perda declarada da divergência D17 |

# 8. Medidas

As etiquetas A e B pertencem ao **observador** e são atribuídas pelo bloco em que cada Uint foi criada. O sistema nunca as recebe.

| Medida | Definição |
|---|---|
| N_cria(bloco) | Número de Uint criadas no bloco |
| Razão de recriação | N_cria(teste) / N_cria(bloco 1) |
| Reacesso R | Fração das Uint do bloco 1 que disparam pelo menos uma vez por apresentação do teste, por chegada de Upro (média das 5 apresentações) |
| Seletividade S | Disparos médios por apresentação das Uint do bloco 1 durante o bloco 2, divididos pelos disparos durante o teste A |
| Classificação por eixo (observador) | Par de vias com sensores diferentes e a mesma faixa → binaural (Z); mesmo sensor, faixas diferentes → entre canais (Y); mesma faixa e sensor, limiares diferentes → recrutamento |
| Ajuste binaural | Para as Uint binaurais: diferença dos atrasos das duas Upro comparada à diferença de chegada da fonte |
| Razões harmônicas | Para as Uint entre canais: razão entre as frequências centrais das duas vias (comparar com 2:1, 3:2, 4:3, 5:4) |
| Completude da trilha | Fração das chamadas de factory com trilha reconstruível até amostras do mundo (deve ser 100%) |

Registros brutos: JSONL por execução (emissões, entregas, disparos, pares pendentes, constituições, intervenções). Resumo em CSV por execução. Versão do código (commit), parâmetros e sementes em cada arquivo.

# 9. Auditoria antes da execução (obrigatória)

Segue o item 4 da regra de não substituição.

1. Inventário de **todas** as chamadas de UintFactory e UproFactory no código, inclusive indiretas, cada uma classificada (infraestrutura, transdução, regra constitutiva, decisão endógena, controle, intervenção).
2. Teste automático: o registro precursor da Pcrt **não contém** referência a Uint nem a Upro, e os atrasos das candidatas não dependem de nenhum intervalo vivido (teste com intervalos alterados deve produzir os mesmos atrasos).
3. Teste automático: nenhuma Uint muda de estado fora da rotina de entrega; e uma Uint que recebe chegadas de uma só origem nunca dispara (D17).
4. Busca no código por estruturas indexadas por propriedades do sinal (faixa, frequência, intervalo) que apontem para Uint ou Upro. O único índice permitido é a adjacência origem → Upro de saída, que **é** o mecanismo de propagação.
5. Execução de K6 e K7 antes de qualquer análise.
6. Determinismo: duas execuções com a mesma semente produzem o mesmo hash de eventos.
7. Se algum item falhar, **não executar** a campanha e relatar.

# 10. Critérios (resumo; aprovados na D12)

- **Êxito parcial:** 100% de trilha; nenhuma criação em silêncio absoluto; razão de recriação ≤ 0,2; R ≥ 0,8; S ≤ 0,2; K3 e K4 reduzem R em pelo menos 50%; K6 com invariância exata.
- **Falha:** R < 0,5; ou razão de recriação > 0,5; ou S ≥ 0,8.
- **Interrupção:** chamada sem trilha; não determinismo; mais de 5.000 Uint ou 200.000 Upro numa execução, contando candidatas (D12a).
- **Relato:** separar L1, L2 e L3. Não usar "provou" sem dizer exatamente qual proposição foi testada.

# 11. Implementação prevista (depois do congelamento)

- Node.js 22, ESM, sem dependências (padrão das versões anteriores).
- Pasta `toy-experiments/v15/`: `src/world.js`, `src/utrd.js`, `src/factories.js`, `src/engine.js` (fila, entrega, integração), `src/pcrt.js`, `src/controls.js`, `src/metrics.js`, `src/run.js`; `test/`; `results/` (dados brutos preservados); `README.md`; `results.md` (Etapa III).
- Gerador pseudoaleatório com semente e fluxos separados.
- Custo estimado: dezenas de milhares de emissões por segundo simulado, cada uma comparada com até 77 traços. É viável em Node num computador comum, mas o custo real será medido e registrado.

# 12. Riscos conhecidos antes de executar

1. **Explosão de pares:** vias com resposta forte e periódica podem gerar muitas Uint por consistência de fase (*aliasing*, como na V0.3). Mitigação: só a emissão mais recente (D15). O número será medido, não escondido.
2. **Uint triviais de recrutamento:** vias do mesmo ressonador disparam quase juntas e tendem a formar pares. Serão relatadas à parte (D13).
3. **Ruído também cria:** o controle K8 mede quanto. Se for muito, isso é um resultado.
4. **Sobreposição espectral entre A e B** (a faixa de 600 Hz recebe o 3º harmônico de A e o 2º de B): limita a seletividade máxima possível. S será interpretado com isso em vista.
5. **Mamíferos usam inibição** na codificação binaural (Brand et al., 2002, texto integral via extração): o resultado binaural, se houver, mostra suficiência num sistema agnóstico, não o mecanismo dos mamíferos (perda registrada, D11c).
6. **Disparos amplos durante a seleção:** enquanto as candidatas existem, U dispara para quase qualquer intervalo vivido. Isso é esperado e não entra nas medidas de reacesso, que só começam após o período de seleção.
7. **Custo da seleção:** 32 Upro candidatas por Uint antes da poda. O limite de 200.000 Upro (D12a) pode ser atingido se houver milhares de Uint em seleção ao mesmo tempo; nesse caso a execução para e isso é um resultado.

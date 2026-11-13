---
title: "EMERGENCE V0.15 — Pré-experimento (Etapa I)"
subtitle: "Criação e utilização da representação transduzida — modalidade sonora"
author: "Responsável: Paulo Rogério da Silva · Redação, deduções e levantamento bibliográfico: assistente (Claude)"
date: "13/11/2026 — versão candidata 0.1, NÃO congelada"
lang: pt-BR
---

# Estado deste documento

- **Etapa:** I (pré-experimento) do ciclo obrigatório da [metodologia](../../docs/program-methodology.md).
- **Estado:** **candidato a congelamento. Não está congelado e não autoriza implementação.** O congelamento depende das decisões D1–D16 (seção 6), que são do responsável.
- **Escopo:** somente som. A visão fica para a V0.16 (decisão do responsável, 13/11/2026: "testamos devagar e evoluímos aos poucos").
- **Documento irmão:** [especificação do experimento](experiment-spec.md) (Etapa II, também candidata, não executada).
- **Origem da hipótese:** documento do responsável *Hipótese HCMT V0.15* ("Uma geometria para convergências") e a conversa de 13/11/2026, em que a hipótese foi revista.

## Legenda de estatuto (usada em todo o texto)

| Marca | Significado |
|---|---|
| **[R]** | Decisão ou hipótese do responsável |
| **[A]** | Dedução ou proposta do assistente (não aprovada, salvo indicação) |
| **[L]** | Resultado da literatura, com o que foi efetivamente lido |
| **[P]** | Regra já aprovada no programa (documento indicado) |
| **[C]** | Fato verificado no código das versões anteriores |

## Leitura rápida (linguagem simples)

1. **O problema herdado.** Na V0.13/V0.14, o sistema "reconhecia" um som repetido consultando uma tabela que devolvia a unidade pronta. Isso é um *lookup*: quem reconhecia era a tabela, não a malha. A V0.14 parou na pergunta: **como o sinal chega a uma organização antiga sem um seletor programado?**
2. **A ideia que testamos.** A transdução só converte energia em incidências. Cada faixa de frequência e cada sensor é um caminho físico próprio (uma *via*). A Pcrt cria Uint e Upro quando incidências de vias diferentes **se encontram de forma recorrente**. Quando o mesmo som volta, as incidências saem pelas mesmas vias, percorrem as mesmas Upro e **reencontram-se na mesma Uint**, que dispara pelo próprio limiar. Não há tabela, só caminho.
3. **O que o experimento pode mostrar.** Que a organização é criada pelo próprio sistema (rastreável), que é **reacessada por propagação** e não recriada, e que isso depende do conteúdo temporal das Upro (se embaralharmos os atrasos, o reacesso deve cair).
4. **O que ele não pode mostrar.** Que isso já é representação no sentido completo da tríade CLEAR. No máximo, evidência parcial.

# 1. Erros identificados nas versões anteriores

Separados em erros demonstrados, limitações e lacunas, conforme a metodologia.

## 1.1 Erros demonstrados (por inspeção do código V0.13, confirmados na V0.14)

| # | Erro | Estatuto | Consequência |
|---|---|---|---|
| E1 | O reacesso usa `features[channel:interval].unit`: a tabela seleciona a Uint | [C] | O "reacesso" da V0.13 é explicado por *lookup* (hipótese H0) |
| E2 | `threshold` da Uint não governa a ativação | [C] | A integração não participa da seleção; campo inerte |
| E3 | `intensity = log1p(amplitude)` não participa de formação nem de acesso | [C] | A intensidade transduzida é descartada |
| E4 | `proof.kind='endogenous'` é fornecido pelo próprio chamador | [C] | O marcador não autentica a origem da chamada |
| E5 | O ensaio A→B→A não formou Upro entre A e B | [C] | O acesso relacional não foi testado |

## 1.2 Limitações (não são erros, mas restringem a inferência)

| # | Limitação | Estatuto |
|---|---|---|
| L1 | Uma só semente e estímulo periódico idêntico a cada repetição: repetir era trivialmente idêntico | [C] |
| L2 | O atraso da Upro era a mediana de diferenças de *timestamps*, linhagem já criticada na V0.5 ("diferenças calculadas explicitamente") | [C] |
| L3 | Distinção de canais e discretização do intervalo eram predefinidas pelo código, não vinham de um transdutor físico | [C] |
| L4 | A "transdução" recebia canal e amplitude prontos: não havia conversão de energia física | [C] |

## 1.3 Lacunas abertas (herdadas)

- **Lacuna da primeira ponte** (V0.14): como a incidência alcança a primeira organização sem seletor programado.
- **Contrato da Upro:** a factory da V0.13 só aceita extremidades Uint; a V0.14 alertou que uma Upro que parte da interface transdutora exige revisão explícita do contrato.
- **Frequência física → incidências** e **topologia física → organização** estavam em aberto em `regras-cientificas-e-continuidade-2026-11-11.md`, seção 5.

# 2. Hipóteses corretivas

Cada uma: problema visado, alternativa e perdas possíveis.

**HC1 — Reacesso por propagação, sem tabela.** [R]+[A]
Problema: E1. Hipótese: a incidência atual alcança a organização anterior porque sai pelas mesmas vias, percorre as Upro constituídas a partir dessas vias e satisfaz o limiar da mesma Uint. Corresponde às candidatas C1/C3 do [estudo da V0.14](../v14/constitutive-reaccess-solution-study.md). Alternativa concorrente: acoplamento por propriedades das unidades (C2/H2), não implementada nesta versão. Perda possível: se a primeira ponte depender de algo além de vias fixas (por exemplo, adaptação da Utrd), o reacesso pode falhar sob variações que a biologia tolera.

**HC2 — Utrd estrita.** [R] (13/11/2026)
"A Utrd lida só com o que se relaciona à transdução, nada além disso." Operacionalmente [A]: converter energia física em incidências e mais nada. A frequência vai **pela via** (cada faixa é um caminho físico), a intensidade vai pelo **número de vias recrutadas** (limiares diferentes; decisão de 11/11 [P]) e o tempo vai pelo **instante** da incidência. Perdas declaradas: sem adaptação da Utrd, sem inibição, sem diferença de nível entre sensores (sombra da cabeça), sem compressão coclear ativa.

**HC3 — A integração governa o disparo.** [A]
Problema: E2. A Uint soma contribuições com a constante de disponibilidade própria ([efeitos v0.1](../../docs/effects-v0.1.md), decisão de 09/11 [P]) e dispara só ao ultrapassar o limiar, com refratariedade. Alternativa: limiar fixo sem decaimento (janela retangular). Perda: a forma exata da janela pode mudar quais encontros contam.

**HC4 — Upro com origem na Utrd.** [R]
"A Upro parte necessariamente da Utrd; não há Utrd ligada diretamente a uma Uint" (responsável, nov/2026). Exige estender o contrato da UproFactory para aceitar uma **via** de Utrd como origem. Registrado como mudança de contrato, não como refatoração.

**HC5 — Não acomodação decidida pela propagação, não por chave.** [P]+[A]
A regra "criação por não acomodação" já está aprovada ([inventário de regras](../../docs/mesh-rules-v0.1.md), seção 2). O que muda [A]: "nenhuma unidade existente responde" passa a ser um **fato da dinâmica** (uma Uint disparou com contribuições vindas dessas incidências), registrado localmente nas próprias incidências, e não uma consulta a um índice.

**HC6 — A tolerância de "junto" é a janela da Uint.** [A] (pergunta deixada em aberto na conversa de 13/11)
Dedução: se a Pcrt considerar "coincidentes" incidências mais afastadas do que a Uint consegue integrar, ela criará Uint que nunca voltam a disparar. Isso produz recriação sistemática, a assinatura de H3. Se considerar só as mais próximas, haverá menos criação e mais participação difusa. A escolha consistente é **tolerância da Pcrt = janela efetiva da Uint criada**. Alternativa: tolerâncias independentes, como condição de controle.

**HC7 — Variação real entre apresentações.** [A]
Problema: L1. Cada apresentação do mesmo som tem ruído de fundo com semente própria e fase de início sorteada. Assim, "o mesmo som" nunca é a mesma sequência de amostras, e o reacesso não pode ser identidade trivial de entrada.

# 3. Hipóteses a validar

## 3.1 Hipóteses sobre reacesso (herdadas da V0.14, com o estatuto ajustado)

| Hipótese | Enunciado | Situação na V0.15 |
|---|---|---|
| **H0** (*lookup*) | O reacesso aparente é seleção por chave | Excluída por construção na condição experimental; volta como **controle positivo** (K1) para mostrar sua assinatura |
| **H1** (propagação relacional) | A incidência percorre Upro já constituídas a partir das vias e alcança a Uint anterior | **Hipótese principal** |
| **H2** (acoplamento por propriedades) | Propriedades da Uint selecionam diretamente a entrada | Não implementada; registrada como alternativa |
| **H3** (reconstituição) | Cada reapresentação cria estrutura nova parecida | **Hipótese nula** de trabalho |
| **H4** (participação difusa) | A incidência ativa muitas organizações sem distinguir A de B | Concorrente |
| **H5** (reacesso sem representação) | Há reacesso seletivo, mas a tríade não é satisfeita | Limite de inferência sempre presente |

## 3.2 Hipóteses da HCMT revista (conversa de 13/11/2026)

| Hipótese | Enunciado | Estatuto |
|---|---|---|
| **HY** | Componentes que chegam juntos por vias de frequências diferentes (harmônicos de um mesmo som) produzem convergências entre canais (eixo Y) | [R] |
| **HZ** | Incidências da mesma faixa nos dois sensores, defasadas pela diferença de chegada, produzem convergências espaciais (eixo Z) com atrasos que compensam essa diferença | [R]+[A] |
| **HX** | Incidências sucessivas (exemplo do responsável: 15 ms depois) produzem convergências temporais (eixo X) | [R]; **fora do teste principal da V0.15** (ver D9) |
| **HT** | O tipo da convergência (X, Y, Z) não é programado: sai da convergência encontrada (intervalo vivido e vias de origem) | [R]; dedução de forma única [A]: a aresta guarda o intervalo vivido; o "eixo" é consequência |

## 3.3 Observações discriminantes

| Observação | H1 | H3 | H4 | H0 (controle K1) |
|---|---|---|---|---|
| Novas Uint na reapresentação de A | quase nenhuma | tantas quanto na 1ª vez | poucas | nenhuma |
| Uint de A disparam na reapresentação de A | sim, por Upro rastreáveis | não (são outras) | sim | sim, sem passar por Upro |
| Uint de A disparam durante B | pouco | — | tanto quanto em A | depende da chave |
| Embaralhar atrasos das Upro (K4) | reacesso cai | — | cai pouco | **não muda** |
| Trocar a origem das Upro por vias aleatórias (K3) | reacesso cai | — | cai | **não muda** |
| Remover as Uint de A (K5) | A volta a criar; B intacto | — | — | erro ou criação |

# 4. Aplicação integral do método

## 4.1 Fenômeno e fronteiras

**Fenômeno:** a transformação de sinais sonoros em organização Uint/Upro (criação) e a participação dessa organização quando sinais semelhantes voltam (utilização), sem conteúdo nem organização impostos.

**Dentro da explicação:** Utrd (borda), incidências, Pcrt, UintFactory, UproFactory, propagação, integração.

**Fora (fornecido como condição):** o mundo sonoro (gerado por programa, permitido pela [regra de não substituição](../../docs/program-methodology.md#regra-vinculante-de-não-substituição-do-fenômeno-por-programação-12112026), item 1), a física dos sensores, as factories e as regras da Pcrt.

**Condições anteriores à constituição** (para evitar circularidade): zero Uint, zero Upro, vias de Utrd existentes e operantes. Nenhuma via tem destino até que a Pcrt o constitua. As vias são potenciais; o que se constitui são as Upro que partem delas ([regras de 11/11](../../docs/regras-cientificas-e-continuidade-2026-11-11.md), seção 5: "distinguir via potencial, via efetivamente constituída e via ativada").

**Não investigado nesta versão** (seguindo a seção 4 das regras de 11/11): confiança, estabilidade, consolidação, poda, neuromodulação, sono, adaptação da Utrd.

## 4.2 Investigação neurobiológica (confrontação bibliográfica)

**Ordem metodológica respeitada:** as hipóteses das seções 2–3 foram formuladas na conversa de 13/11/2026, **antes** desta busca. A literatura abaixo confronta essas hipóteses; ela **não** foi incorporada automaticamente. O que dela se propõe incorporar está na seção 4.5 como refinamento, aguardando autorização (D11).

**Estado de leitura:** "resumo" = só o resumo; "integral (extração)" = texto completo processado por ferramenta de extração, não lido linha a linha; "secundária" = afirmação conhecida por citação em outro trabalho.

### 4.2.1 A frequência vai por lugar (tonotopia)

- [L] A posição ao longo da membrana basilar segue uma função quase exponencial da frequência. A mesma forma se ajusta a várias espécies trocando constantes (Greenwood, 1990; **resumo**).
- **Confronto:** sustenta HC2 (frequência pela via) e o espaçamento aproximadamente logarítmico das faixas. A separação por frequência é **mecânica**, anterior à célula ciliada. Isso cabe na "Utrd estrita": é parte da conversão física, não análise posterior.

### 4.2.2 A intensidade vai por recrutamento

- [L] Cada fibra do nervo auditivo aumenta a taxa de disparo só numa faixa de cerca de 20 a 30 dB acima do próprio limiar e depois satura (Sachs e Abbas, 1974; **resumo**).
- [L] Há fibras com limiares muito diferentes. Uma minoria, de disparo espontâneo baixo, chega a ser cerca de 80 dB menos sensível que as de disparo espontâneo alto com a mesma frequência característica (Liberman, 1978; **resumo**).
- **Confronto:** sustenta a decisão de 11/11 [P] (intensidade = número de vias recrutadas por limiares diferentes). Também mostra que uma via isolada **satura**: sem recrutamento, sons fortes ficariam indistinguíveis.

### 4.2.3 O tempo fino é preservado só até certo limite

- [L] O nervo auditivo do gato acompanha a fase do som até cerca de 5 kHz (Johnson, 1980; o resumo mede a sincronização abaixo de 6 kHz; o valor de cerca de 5 kHz vem de citações **secundárias**). O mesmo resumo relata que a sincronização e a taxa média variam cada uma numa faixa de 20 a 30 dB, mas essas faixas só se sobrepõem em cerca de 10 dB.
- [L] Uma compilação de especialistas estima que, em humanos, o uso de fase para processamento binaural vai até cerca de 1,5 kHz. Para o uso geral, as estimativas variam de 1,5 a 10 kHz (Verschooten et al., 2019; **resumo e destaques**).
- **Confronto:** as faixas da V0.15 ficam abaixo de 2,4 kHz (proposta, D3), onde a regra de "emitir no ciclo" da Utrd tem respaldo. Acima disso, a Utrd estrita precisaria de outra forma de emissão. Isso é uma perda declarada, não um problema da V0.15.

### 4.2.4 Encontro com atraso: linhas de atraso e detectores de coincidência

- [L] Jeffress (1948) propôs que diferenças de chegada entre os ouvidos sejam convertidas em **lugar**: neurônios recebem dos dois lados por caminhos de comprimentos diferentes e só disparam quando os sinais chegam juntos (**não lido**; descrição segundo McAlpine, 2005, **trechos**).
- [L] Na coruja-das-torres, os axônios aferentes funcionam como **linhas de atraso** (cerca de 160 µs de diferença de condução ao longo do núcleo laminar) e os neurônios-alvo como **detectores de coincidência**. A resposta é máxima quando a diferença interaural anula a diferença de chegada. A projeção é tonotópica, com aferentes casados em frequência (Carr e Konishi, 1990; **resumo**).
- [L] **Ressalva importante:** em mamíferos (gerbil), as respostas da oliva superior medial não são compatíveis com um mapa topográfico do espaço, e uma inibição temporalmente precisa é parte crítica da codificação (Brand et al., 2002; **resumo**).
- **Confronto:** HZ tem precedente direto nas aves. Nos mamíferos, o mecanismo inclui inibição, que a V0.15 exclui (efeito só excitatório). **Consequência:** a V0.15 pode testar se o encontro com atraso **é suficiente** para constituir e reacessar convergências binaurais num sistema agnóstico. **Não** pode afirmar que é o mecanismo dos mamíferos.

### 4.2.5 Os atrasos certos podem ser aprendidos (desenvolvimento)

- [L] Num modelo de neurônio da coruja, uma regra hebbiana não supervisionada **seleciona**, de uma distribuição ampla de axônios com atrasos aleatórios, as conexões cujos atrasos fazem as chegadas coincidirem, inclusive para dois grupos independentes de entradas (ouvido esquerdo e direito) (Gerstner et al., 1996; **resumo**).
- [P] O programa já registra "deslocamento" (em uso no TEMPO) e "seleção" (Gerstner et al., 1996) como formas de ajuste de latência, com termos de Eurich et al. ([inventário de regras](../../docs/mesh-rules-v0.1.md)).
- **Confronto:** há duas formas concorrentes de a Pcrt obter o atraso de uma Upro nova. **Deslocamento:** o atraso nasce do intervalo vivido. **Seleção:** nascem candidatas com atrasos diversos e ficam as que coincidem. O deslocamento é mais simples, mas pertence à linhagem criticada na V0.5 (atraso calculado das marcas). A seleção tem respaldo de desenvolvimento, mas exige criar em excesso e eliminar depois, e a poda está fora do escopo (seção 4.1). **Decisão D5.**

### 4.2.6 Atividade espontânea antes da audição

- [L] Na cóclea em desenvolvimento, células de suporte liberam ATP espontaneamente. Isso despolariza as células ciliadas internas próximas e provoca rajadas no nervo auditivo antes de o animal ouvir. A atividade some após o início da audição (Tritsch et al., 2007; **resumo**).
- [L] Uma revisão relata que, como a liberação é focal, células ciliadas **vizinhas** disparam juntas, e os autores propõem que essa correlação dirija plasticidade do tipo hebbiano e o refinamento tonotópico. Os próprios autores dizem que esses papéis ainda são **em grande parte especulativos**: a surdez também causa morte neuronal, e algumas linhagens de camundongos surdos têm tonotopia normal (Wang e Bergles, 2015; **integral, extração**).
- **Confronto:** a biologia não constitui a organização auditiva só por som. Há fiação herdada e atividade espontânea correlacionada. O EMERGENCE não usa arquitetura herdada [R] (princípio de nov/2026), e as incidências só vêm de transdução ou marca-passos [P]. Fica registrada como **hipótese concorrente** uma fase de atividade espontânea das próprias Utrd (marca-passo na borda). **Não entra na V0.15** (D10).

### 4.2.7 Convergência entre canais: harmônicos

- [L] Um modelo mostra que, com qualquer som de banda larga (até ruído ou cliques), **canais cocleares espaçados em intervalos harmônicos coincidem mais**. Acumular coincidências forma "moldes" harmônicos **sem linhas de atraso**. Os ingredientes são o banco de filtros, a não linearidade após o filtro (retificação) e o acompanhamento de fase (Shamma e Klein, 2000; **integral da versão técnica, extração**).
- [L] No córtex auditivo primário do sagui, cerca de 17% dos neurônios registrados respondem fortemente a complexos harmônicos e fracamente ou nada a componentes isolados. Há sinais de **inibição** entre as entradas excitatórias preferidas. Os autores deixam em aberto se esses moldes são aprendidos ou inatos (Feng e Wang, 2017; **integral, extração**).
- **Confronto:** sustenta HY. Mais que isso, gera uma **previsão independente**: se a Utrd estrita (filtro → retificação → emissão no ciclo) for suficiente, a exposição a **ruído de banda larga** deveria produzir Uint ligando vias em intervalos harmônicos. É uma previsão exploratória (K9), porque a Utrd da V0.15 é mais simples que o modelo de Shamma e Klein.

### 4.2.8 Integrador ou detector de coincidência

- [L] O mesmo neurônio funciona como **integrador** quando o intervalo efetivo de soma é longo em relação ao intervalo entre disparos, e como **detector de coincidência** quando é curto (König, Engel e Singer, 1996; **resumo**).
- **Confronto:** sustenta HC6. A constante de disponibilidade da Uint decide se ela "vê" coincidências finas (Y e Z na escala de fase) ou sequências (X). Uma só constante não serve às duas escalas. Isso justifica deixar HX fora do teste principal (D9).

### 4.2.9 Vizinhança sem mapa prévio

- [L] Um agente com sensores sem interpretação prévia reconstruiu a organização dos próprios sensores a partir de correlações entre pares (Pierce e Kuipers, 1997; **trechos**).
- **Confronto:** sustenta a decisão de 13/11 [R]: as relações de vizinhança são **criadas pela Pcrt**, não entregues pela Utrd. Faixas vizinhas tendem a ser coativas, e a V0.15 pode medir se surgem Uint entre vias vizinhas sem que a vizinhança seja informada.

## 4.3 Reconstrução causal

| Elo | Biologia | Estatuto | Equivalente na V0.15 |
|---|---|---|---|
| 1 | Onda sonora chega aos dois ouvidos com diferença de tempo | física | Fonte com azimute; diferença de chegada calculada pela geometria |
| 2 | Membrana basilar separa por lugar | [L] evidência | Banco de ressonadores por sensor |
| 3 | Célula ciliada converte movimento em sinal (retificação) | [L] evidência | Retificação de meia onda |
| 4 | Fibras com limiares diferentes disparam em fase | [L] evidência | Vias com limiares diferentes, emissão no ciclo, refratariedade |
| 5 | Aferentes chegam a alvos com atrasos | [L] evidência (aves) | Upro com atraso operacional |
| 6 | Alvo dispara só com chegada conjunta | [L] evidência | Uint com constante de disponibilidade e limiar |
| 7 | Atrasos adequados surgem no desenvolvimento | [L] modelo (Gerstner); mecanismo real não estabelecido | Pcrt (D5) |
| 8 | Repetição do som percorre os mesmos caminhos | **inferência** | Reacesso por propagação (H1) |

O elo 8 é o objeto do experimento. Os elos 2–6 são condições. O elo 7 é o mecanismo investigado.

## 4.4 Mínimos funcionais candidatos

São candidatos, não resultados. Suficiência não prova necessidade.

| Mínimo | Função | Contraexemplo procurado |
|---|---|---|
| M1 Separação por via | Distinguir frequência e lado sem rótulo | Duas fontes diferentes com o mesmo conjunto de vias ativas |
| M2 Recrutamento | Distinguir intensidade sem saturar | Som forte que recruta as mesmas vias que o fraco |
| M3 Tempo preservado na incidência | Permitir encontro e intervalo vivido | Incidências sem instante preciso (por exemplo, médias) |
| M4 Atraso operacional na Upro | Transformar "depois" em "junto" | Reacesso igual com atrasos embaralhados (K4) |
| M5 Integração com janela e limiar | Selecionar por encontro | Uint que dispara com uma só incidência |
| M6 Constituição por encontro recorrente | Evitar criar por acaso | Ruído sem estrutura criando tanto quanto som estruturado |
| M7 Persistência da organização | Haver o que reacessar | Reacesso igual após remover as Uint (K5) |

## 4.5 Abstração agnóstica (com perdas)

| Propriedade biológica | Abstração | Equivalência argumentada | Perdas | Teste |
|---|---|---|---|---|
| Lugar na membrana | Via por faixa (ressonador) | Mesma seletividade de frequência por caminho | Sem amplificação ativa, sem compressão | Varredura de tons |
| Fibras com limiares | K vias por faixa, limiares em degraus | Recrutamento monotônico | Sem adaptação nem taxa espontânea | Varredura de nível |
| Acompanhamento de fase | Emissão no cruzamento ascendente do limiar, com refratariedade | Tempo preservado abaixo de cerca de 2,4 kHz | Sem jitter biológico (há o ruído do mundo) | Histograma de fase |
| Linha de atraso | Atraso escalar da Upro | Chegada deslocada | Sem dispersão nem custo | K4 |
| Detector de coincidência | Soma com decaimento exponencial e limiar | Janela efetiva = τ·ln(1/(θ−1)) para duas chegadas de magnitude 1 | Sem inibição (Brand et al., 2002) nem dendritos | Varredura de Δt |
| Desenvolvimento dos atrasos | Pcrt (deslocamento ou seleção, D5) | Produz chegadas coincidentes | Sem fiação herdada nem atividade espontânea | K2, K3 |

**Refinamentos vindos da literatura, aguardando autorização (D11):** (a) seleção de atrasos como variante da Pcrt (Gerstner et al., 1996); (b) exposição a ruído como condição exploratória (Shamma e Klein, 2000); (c) inibição como perda declarada e candidata para uma versão futura (Brand et al., 2002; Feng e Wang, 2017).

## 4.6 Previsões

**Positivas (se H1):**

- P1. Uma apresentação de A cria Uint pela Pcrt, todas com trilha completa até incidências de Utrd.
- P2. Na reapresentação de A (com ruído e fase diferentes), a maioria das Uint criadas na primeira vez dispara **por chegada de Upro** e quase nenhuma Uint nova é criada.
- P3. Durante B (outro f0, outro lado), as Uint de A disparam muito menos que durante A.
- P4 (HZ). Surgem Uint com uma Upro de cada sensor na mesma faixa, e a diferença entre seus atrasos fica próxima da diferença interaural da fonte (cerca de 0,29 ms para 30°, com a geometria proposta).
- P5 (HY). Surgem Uint entre vias de faixas diferentes do mesmo sensor, ligando componentes harmônicos de A.

**Negativas:**

- N1. Silêncio absoluto: nenhuma criação (sem incidências não há combustível).
- N2. Embaralhar os atrasos (K4) ou as origens (K3) após a constituição derruba o reacesso.
- N3. Criação por relógio (K2) com o mesmo número de Uint/Upro não produz reacesso seletivo.
- N4. Trocar identificadores (K6) não muda nenhuma medida, a menos da troca de nomes.

**Limites esperados:**

- A apresentado de outro lado (A′): as Uint espectrais (HY) devem disparar; as binaurais (HZ) não. Se isso ocorrer, é uma **dissociação** entre "o quê" e "onde". Previsão exploratória.
- A mais forte: recruta vias de limiar mais alto ainda sem Upro. Prevê-se a criação de algumas Uint novas, coerente com "não pré-criar Upro para faixas ainda não experimentadas" [P].

## 4.7 Limites e refutações

- **Refuta H1 (nesta implementação):** P2 falha (criação na reapresentação comparável à primeira) **ou** K4/K3 não alteram o reacesso. No segundo caso, algo além das Upro está selecionando, e a auditoria deve procurar *lookup* escondido.
- **Indica H4:** as Uint de A disparam durante B tanto quanto durante A.
- **Não refuta a CLEAR:** falhas da V0.15 refutam esta Pcrt e estes parâmetros, não a possibilidade de outra realização (regra da metodologia: ausência de demonstração não estabelece impossibilidade).

# 5. Hipóteses de trabalho e previsão de alcance

## 5.1 O que se pretende implementar

Detalhes na [especificação](experiment-spec.md).

- Mundo sonoro com duas fontes possíveis em azimute, dois sensores, ruído de fundo com semente.
- Utrd estrita: 2 sensores × 13 faixas × 3 limiares = 78 vias (proposta, D3/D4).
- UintFactory e UproFactory com contrato estendido (HC4).
- Pcrt com: traço por via; coincidência entre fontes distintas [P]; consolidação por recorrência [P] (o mesmo intervalo vivido repetido); criação por não acomodação [P], decidida pela propagação (HC5); criação conjunta de uma Uint com duas Upro convergentes.
- Propagação: toda incidência sai por **todas** as Upro da via ou da Uint de origem (confirmado pelo responsável em 13/11 para o Sdom; D8 confirma para o EMERGENCE).

## 5.2 O que se pode testar e o que se poderia demonstrar

| Nível | O que se pode demonstrar | O que não se pode |
|---|---|---|
| L1 transmissão | Incidências percorrem Upro com atrasos medidos | — |
| L2 constituição | Cada criação decorre de operações rastreáveis da Pcrt sobre incidências, sem chamadas externas | Que esta Pcrt é a mínima ou a necessária |
| L3 representação | Evidência **parcial**: fundamentação transdutiva (trilha), determinação autônoma (L2) e organização especificadora candidata (seletividade, dissociação A′) | Satisfação da tríade CLEAR |

## 5.3 Critérios (valores propostos; decisão D12)

- **Êxito parcial (L2 + reacesso):** 100% das chamadas de factory com trilha; zero criação em silêncio; criação na reapresentação ≤ 20% da primeira; reacesso ≥ 80% das Uint de A; disparo das Uint de A durante B ≤ 20% do disparo durante A; K3 e K4 reduzem o reacesso em pelo menos 50%; K6 com invariância exata.
- **Falha:** reacesso < 50%, **ou** criação na reapresentação > 50% da primeira (H3), **ou** seletividade ausente (H4).
- **Interrupção:** qualquer chamada de factory sem trilha; não determinismo com a mesma semente; limite de recursos (proposta: 5.000 Uint ou 50.000 Upro por execução, alinhado ao orçamento do [inventário](../../docs/mesh-rules-v0.1.md)).

# 6. Decisões pendentes do responsável (bloqueiam o congelamento)

| # | Decisão | Proposta do assistente |
|---|---|---|
| D1 | Aprovar as hipóteses corretivas HC1–HC7 | Aprovar |
| D2 | Estender o contrato da UproFactory: origem pode ser via de Utrd (HC4) | Aprovar, já que é regra do responsável |
| D3 | Faixas: quantas e qual intervalo | 13 faixas de 150 a 2.400 Hz, 3 por oitava |
| D4 | Recrutamento: quantos limiares por faixa e espaçamento | 3 limiares, cerca de 10 dB entre eles |
| D5 | Como a Pcrt obtém o atraso: deslocamento, seleção ou ambos como condições | Deslocamento como condição principal; seleção como condição concorrente, se aprovar a poda mínima que ela exige |
| D6 | Tolerância da Pcrt = janela efetiva da Uint (HC6) | Aprovar |
| D7 | Recorrência: quantos encontros com o mesmo intervalo vivido e em quanto tempo | 5 encontros em até 2 s do relógio do experimento |
| D8 | Confirmar para o EMERGENCE: a incidência segue por todas as Upro de saída | Confirmar (já confirmado para o Sdom) |
| D9 | Incluir as convergências temporais (X, dezenas de ms) na V0.15? | Não; testar Y e Z primeiro. X na V0.15b ou depois |
| D10 | Fase de atividade espontânea das Utrd antes do som? | Não na V0.15 |
| D11 | Autorizar os refinamentos da literatura (seção 4.5: seleção, ruído, inibição como perda) | Autorizar (a) e (b) como condições; (c) só como registro |
| D12 | Aprovar os critérios de êxito, falha e interrupção | Aprovar ou ajustar os números |
| D13 | Vias do mesmo ressonador (mesma faixa e sensor, limiares diferentes) podem formar par? | Sim, sem exclusão (excluir seria dar ao sistema conhecimento da própria estrutura); relatar à parte |
| D14 | Incluir condição exploratória de segundo nível (disparos de Uint como fontes para a mesma regra, "recursão pela mesma regra" [P])? | Sim, como condição exploratória separada, fora dos critérios de êxito |
| D15 | Maior intervalo vivido considerado pela Pcrt e regra contra *aliasing* | 3 ms, considerando só a emissão mais recente de cada outra via (lição da V0.3) |
| D16 | Nível do ruído de fundo e calibração dos limiares das vias | Ruído 40 dB abaixo do nível nominal; limiares tais que o som nominal recrute 2 de 3 níveis |

**Nomes:** este documento não cria termos novos. Usa "via" (regras de 11/11), "traço", "coincidência entre fontes distintas", "consolidação por recorrência", "criação por não acomodação" (inventário de regras), "intervalo vivido" e "constante de disponibilidade" (efeitos v0.1). Onde precisa descrever algo sem nome aprovado, usa descrição, não termo: por exemplo, "registro local de participação" na especificação. Se o responsável quiser um nome, ele escolhe.

# 7. Conflitos documentais encontrados (não resolvidos aqui)

1. **Condições ou hipóteses?** As regras de 11/11 (seção 4) listam "a Upro tem destino efetivo" e "a primeira Uint e pelo menos duas Upro convergentes são constituídas conjuntamente" como condições de partida. Registro posterior do responsável (nov/2026) trata "a Upro tem destino efetivo", "a Uint integra pelo menos duas Upro aferentes" e a ordem de constituição como **hipóteses a testar**. A V0.15 adota a criação conjunta (uma Uint e duas Upro) como **regra da Pcrt desta versão**, sem tratá-la como lei. A ordem de constituição não é discriminada aqui.
2. **Magnitude:** [efeitos v0.1](../../docs/effects-v0.1.md) aprova m′ = min(1, m × g); as regras de 11/11 registram "magnitude = confiança × modulação" e retiram o ganho independente. **A V0.15 evita o conflito:** magnitude fixa igual a 1 na borda e transportada sem alteração (equivalente a g = 1, sem confiança nem modulação). Não é uma reconciliação.
3. **Toy models como instrumentos subsidiários** (regras de 11/11, seção 1) e a série de toys em andamento: a V0.15 foi pedida pelo responsável para uma dúvida específica (a primeira ponte) e segue essa condição.

# 8. Bibliografia (com estado de leitura)

1. Brand, A., Behrend, O., Marquardt, T., McAlpine, D., Grothe, B. (2002). Precise inhibition is essential for microsecond interaural time difference coding. *Nature*, 417, 543–547. doi:10.1038/417543a. **Resumo.**
2. Carr, C. E., Konishi, M. (1990). A circuit for detection of interaural time differences in the brain stem of the barn owl. *J. Neurosci.*, 10(10), 3227–3246. doi:10.1523/JNEUROSCI.10-10-03227.1990. **Resumo** (texto integral aberto existe, mas não foi possível obtê-lo nesta sessão).
3. Feng, L., Wang, X. (2017). Harmonic template neurons in primate auditory cortex underlying complex sound processing. *PNAS*, 114(5), E840–E848. doi:10.1073/pnas.1607519114. **Integral (extração), sem a lista de referências.**
4. Gerstner, W., Kempter, R., van Hemmen, J. L., Wagner, H. (1996). A neuronal learning rule for sub-millisecond temporal coding. *Nature*, 383, 76–78. doi:10.1038/383076a0. **Resumo** (o PDF aberto do repositório EPFL falhou ao baixar).
5. Greenwood, D. D. (1990). A cochlear frequency-position function for several species — 29 years later. *J. Acoust. Soc. Am.*, 87(6), 2592–2605. doi:10.1121/1.399052. **Resumo.**
6. Jeffress, L. A. (1948). A place theory of sound localization. *J. Comp. Physiol. Psychol.*, 41, 35–39. doi:10.1037/h0061495. **Não lido; descrição secundária** (McAlpine, 2005).
7. Johnson, D. H. (1980). The relationship between spike rate and synchrony in responses of auditory-nerve fibers to single tones. *J. Acoust. Soc. Am.*, 68(4), 1115–1122. doi:10.1121/1.384982. **Resumo** (o resumo trata da sincronização abaixo de 6 kHz; o limite de cerca de 5 kHz é atribuído a este trabalho por fontes secundárias).
8. König, P., Engel, A. K., Singer, W. (1996). Integrator or coincidence detector? The role of the cortical neuron revisited. *Trends Neurosci.*, 19(4), 130–137. doi:10.1016/S0166-2236(96)80019-1. **Resumo.**
9. Liberman, M. C. (1978). Auditory-nerve response from cats raised in a low-noise chamber. *J. Acoust. Soc. Am.*, 63(2), 442–455. **Resumo.**
10. McAlpine, D. (2005). Creating a sense of auditory space. *J. Physiol.*, 566(1), 21–28. doi:10.1113/jphysiol.2005.083113. **Trechos.**
11. Pierce, D., Kuipers, B. (1997). Map learning with uninterpreted sensors and effectors. *Artificial Intelligence*, 92, 169–229. doi:10.1016/S0004-3702(96)00051-3. **Trechos.**
12. Sachs, M. B., Abbas, P. J. (1974). Rate versus level functions for auditory-nerve fibers in cats: tone-burst stimuli. *J. Acoust. Soc. Am.*, 56(6), 1835–1847. doi:10.1121/1.1903521. **Resumo.**
13. Shamma, S., Klein, D. (2000). The case of the missing pitch templates: how harmonic templates emerge in the early auditory system. *J. Acoust. Soc. Am.*, 107(5), 2631–2644. doi:10.1121/1.428649. **Integral da versão técnica ISR TR 99-27 (extração).**
14. Tritsch, N. X., Yi, E., Gale, J. E., Glowatzki, E., Bergles, D. E. (2007). The origin of spontaneous activity in the developing auditory system. *Nature*, 450, 50–55. doi:10.1038/nature06233. **Resumo.**
15. Verschooten, E., Shamma, S., Oxenham, A. J., Moore, B. C. J., et al. (2019). The upper frequency limit for the use of phase locking to code temporal fine structure in humans: a compilation of viewpoints. *Hearing Research*, 377, 109–121. **Resumo e destaques.**
16. Wang, H. C., Bergles, D. E. (2015). Spontaneous activity in the developing auditory system. *Cell Tissue Res.* doi:10.1007/s00441-014-2007-5. **Integral (extração).**

Já presentes no programa e **não relidos** nesta sessão: Bi e Poo (1998); Izhikevich (2006); Eurich et al. (termos de deslocamento e seleção de atraso).

# 9. Registro proposto para `docs/innovation-tracking.md`

- **O que existe:** linhas de atraso com detecção de coincidência (Jeffress; Carr e Konishi); seleção hebbiana de atrasos (Gerstner et al.); moldes harmônicos por coincidência entre canais (Shamma e Klein); topologia de sensores por correlação (Pierce e Kuipers).
- **O que seria novo, se demonstrado:** constituição **autônoma**, a partir de zero Uint e zero Upro, de convergências entre canais e binaurais por uma única regra da Pcrt, com **reacesso por propagação auditável e sem índice**. Também a ligação explícita entre a constante de disponibilidade da Uint e a tolerância de constituição (HC6).
- **O que falta para alegar:** busca de anterioridade específica para "constituição a partir de vazio + reacesso sem *lookup*" em vida artificial e redes de impulsos com crescimento estrutural, que não foi feita nesta sessão.

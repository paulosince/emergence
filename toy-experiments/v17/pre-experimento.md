---
title: "EMERGENCE V0.17 — Pré-experimento (Etapa I)"
subtitle: "Matemática multidimensional transdutiva: uma Pcrt de construção gradual — Bach numa sala, ouvido por um robô parado"
author: "Responsável: Paulo Rogério da Silva · Redação, deduções e levantamento bibliográfico: assistente (Claude)"
date: "16/11/2026 — RASCUNHO v0.3, NÃO CONGELADO (decisões D1–D19 tomadas; D11c pendente)"
lang: pt-BR
---

# Estado deste documento

- **Etapa:** I (pré-experimento) do ciclo obrigatório da [metodologia](../../docs/program-methodology.md).
- **Estado:** rascunho para revisão. Nada aqui autoriza implementação. Decisões tomadas: [decisões em construção](decisoes-em-construcao.md). Decisões: seção 6 (só a D11c está pendente).
- **O que mudou da v0.1:** o cenário do responsável (16/11/2026) substitui as "famílias de estímulo" propostas pelo assistente: sala, dois alto-falantes, gravação real de Bach, robô parado, três execuções. As previsões foram refeitas para esse mundo.
- **Antes de congelar:** ensaio mínimo do mecanismo (seção 5.4).

## Legenda de estatuto

| Marca | Significado |
|---|---|
| **[R]** | Decisão ou hipótese do responsável |
| **[A]** | Dedução ou proposta do assistente (não aprovada, salvo indicação) |
| **[L]** | Literatura, com o que foi efetivamente lido |
| **[P]** | Regra já aprovada no programa |
| **[C]** | Fato verificado no código, nos resultados ou nas medidas |

## Leitura rápida

1. **O mundo.** Uma sala de 2 × 2 × 3 m. Dois alto-falantes em paredes opostas tocam uma gravação real da Tocata e Fuga em Ré menor, de Bach, em estéreo, sem alterações. O robô está parado, de lado para os alto-falantes, mais perto de um deles. A peça toca três vezes.
2. **A ideia.** Uma só Pcrt trabalha sobre o que falhou, cria estrutura fraca e provisória e só consolida o que acerta de novo. Nenhum tipo de convergência é programado. O mundo seleciona.
3. **O que se pode mostrar.** Que a construção gradual não explode; que o que é estável no mundo (onde estão as fontes) consolida mais que o que é instável (coincidências entre notas); e que o consolidado é reacessado nas execuções seguintes.
4. **O que não se pode mostrar.** Representação no sentido da tríade CLEAR, nem que este é o mecanismo do cérebro.

# 1. Erros identificados nas versões anteriores

## 1.1 Erros demonstrados

| # | Erro | Versão | Estatuto |
|---|---|---|---|
| E1 | Candidatas de peso cheio na mesma Uint, com "a chegada mais recente substitui", tornam a coincidência quase sempre presente sob entrada periódica (977 disparos/s; teto de 1.000/s); crédito espalhado por igual | V0.15 | [C] |
| E2 | Reconstituição do mesmo par: até 15 Uint em 150 ms; 1.555 pares em 150 ms; limite de 5.000 Uint na 1ª apresentação | V0.15 | [C] |
| E3 | Estrutura nascida pronta, com força total no instante da criação | V0.15 | [C] |
| E4 | A diferença testada não chegava às Utrd (caule sem pixel; câmeras idênticas) | V0.16 | [C] |
| E5 | Origem da regra da Uint era a Utrd, não a Upro | V0.16 | [C] |
| E6 | Malha de Uint aleatória dada pronta, sem Pcrt | V0.16 | [C] |
| E7 | Implementação sem pré-experimento congelado | V0.16 | [C] |

## 1.2 Limitações e lacunas herdadas

| # | Item | Estatuto |
|---|---|---|
| L1 | Com fases variando, o intervalo entre faixas muda a cada repetição; entre sensores, fica estável (0,292 ms para 0,2915 ms) | [C] V0.15 |
| L2 | Reacesso nunca testado | [C] V0.15 |
| L3 | Faixas da V0.15 (150–2.400 Hz) perderiam 11,4% da energia da gravação abaixo de 150 Hz e 11,3% entre 2,4 e 8 kHz | [C] [caracterização](gravacao.md) |

# 2. Hipóteses corretivas

**HC1 — Construção gradual.** [R] Problema: E1–E3. A candidata nasce fraca, ganha força a cada acerto e some se não acerta [A].

**HC2 — A Pcrt trabalha sobre o que falhou.** [R] Incidências que expiraram sem integração; caminhos favorecidos que não dispararam. Corresponde à criação por não acomodação [P].

**HC3 — O laço da Pcrt.** [R] Fixa uma incidência sem integração e testa as outras com rastro vivo; depois avança.

**HC4 — Exuberância guiada.** [R] A fibra define a faixa de atrasos; poucas candidatas iniciais, espaçadas proporcionalmente; novas brotam perto das que quase acertaram, com passo proporcional. [A] O brotamento não usa o tamanho nem o sinal do erro: brota dos dois lados, e a seleção decide.

**HC5 — Recorrência é a mesma candidata que acerta de novo.** [R]

**HC6 — Origem é a Upro.** [R] Corrige E5.

**HC7 — O estímulo precisa conter as relações, e elas precisam chegar às Utrd.** [R] Corrige E4. Verificação prévia já feita para a gravação ([caracterização](gravacao.md)); a verificação dos sinais **nos microfones** é parte do ensaio mínimo.

**HC8 — Faixas e emissão adequadas ao mundo.** [R] Corrige L3: 64 faixas na escala ERB, de ~50 Hz a 8 kHz; emissão no ciclo abaixo de um limite (proposta: 2,4 kHz) e pelo envelope acima. 2 × 64 × 3 = 384 vias.

# 3. Hipóteses a validar

## 3.1 Principal e concorrentes

| Hipótese | Enunciado | Estatuto |
|---|---|---|
| **HM** | Uma única Pcrt, sem tipo programado, constitui convergências de tipos diferentes conforme o que a transdução faz variar, e **consolida relativamente mais as relações estáveis no mundo** | [R]; operacionalização [A] |
| **H-nula** | A consolidação não depende da estabilidade: a proporção de cada tipo entre as consolidadas é a mesma que entre as criadas | [A] |
| **H-explosão** | A construção gradual não impede a proliferação | [A] |
| **H-aliasing** | Consolidam pares coerentes módulo o período das notas, e não a relação espacial verdadeira | [A] |
| **H1** (herdada) | Na reexecução, as incidências percorrem as Upro consolidadas e alcançam as mesmas Uint, sem recriação | [C] V0.15, nunca testada |
| **H-trivial** | O reacesso aparente vem só de a mesma gravação se repetir idêntica, e não da organização | [A]; discriminada pelo controle D16a |

## 3.2 O que é estável e o que é instável neste mundo [A]

| Relação | Estável? | Por quê |
|---|---|---|
| Entre os dois ouvidos, para cada alto-falante | **Sim** | As fontes e o robô não se movem |
| Entre a chegada do alto-falante próximo e a do distante | **Parcial** | ~2,3 ms de diferença fixa, mas os canais têm correlação de só 0,48 [C] |
| Entre faixas da mesma nota quando ela volta | **Em parte** | Depende de o mesmo tubo soar de novo; a reverberação da igreja embaralha |
| Entre faixas de notas que coincidem por acaso | **Não** | Mudam conforme a música anda |

## 3.3 Observações discriminantes

| Observação | HM | H-nula | H-explosão | H-aliasing | H-trivial |
|---|---|---|---|---|---|
| Proporção de Uint entre ouvidos: consolidadas ÷ criadas | > 1 | ≈ 1 | — | — | — |
| Diferença de atraso consolidada entre ouvidos | ≈ diferença de chegada de cada alto-falante | qualquer | — | ≈ diferença ± k·período | — |
| Número de candidatas ao longo das 3 execuções | sobe e estabiliza | — | sobe sem parar | — | — |
| Reacesso no controle com ruído diferente por execução (D16a) | mantém-se | — | — | — | cai |

# 4. Aplicação integral do método

## 4.1 Fenômeno e fronteiras

**Fenômeno:** a transformação dos sinais sonoros de uma sala real em organização Uint/Upro de vários tipos de convergência, por uma única regra de construção gradual, com seleção pelo mundo.

**Fornecido:** a sala, os alto-falantes, a gravação, a propagação até os microfones (incluindo a sombra da cabeça), as Utrd, as factories, as regras da Pcrt e as propriedades físicas das fibras [R].
**Não fornecido:** a janela efetiva que se consolida, os atrasos que ficam, os tipos de convergência [R].
**Condições anteriores:** zero Uint; nenhuma Upro com destino constituído.
**Fora desta versão:** movimento e reflexos do robô [R]; tempestade [R]; reverberação completa da sala do robô [R]; neuromodulação, inibição, sono; lateralização (hipótese futura [R]).

## 4.2 Investigação neurobiológica

**Ordem metodológica:** hipóteses formuladas na conversa de 15–16/11/2026 antes de cada busca. **Estado de leitura** entre parênteses; nenhuma fonte desta rodada foi lida em texto integral.

### 4.2.1 Quantas repetições, em quanto tempo
- [L] Tipicamente 60–100 pares na plasticidade dependente do tempo dos disparos (revisão de Feldman, 2012; **trechos**); 60 pares a 1 Hz em Bi e Poo, 1998 (Bi, 2002; **trechos**); outros protocolos de 10 pares a 5 Hz até 50–100 a 0,3 Hz (tabela de revisão PMC3589711; **trechos**).
- [L] Pareamentos lentos (0,1 Hz) não potenciam em córtex (Sjöström et al., 2001; **resumo e trechos**); preparações divergem (Pfister e Gerstner, 2006; **trechos**).
- [L] Espaçamento: um segundo episódio 60 min depois dobra a potenciação; 10 ou 30 min depois não acrescenta (Kramár et al., 2012; **resumo e trechos**).

### 4.2.2 Quanto tempo o material fica disponível
- [L] Traços de elegibilidade de segundos (Gerstner et al., 2018; **resumo**); janela de 0,3–2 s (Yagishita et al., 2014; **resumo**); segundos antes e depois (Bittner et al., 2017; **resumo e trechos**); etiqueta que decai em menos de 3 h (Frey e Morris, 1997; **resumo**); reativação por até 10 h (Giri et al., 2019; **resumo**).

### 4.2.3 A estrutura nasce provisória
- [L] Espinhas novas surgem rápido e funcionais (Kwon e Sabatini, 2011; **resumo**), mas a maioria é transitória (Holtmaat e Svoboda, 2009; **pontos-chave**; Trachtenberg et al., 2002, proporções por **fonte secundária**; Cane et al., 2014, por **comentário**). Estímulos que induzem potenciação aumentam a sobrevida de espinhas novas individuais (> 14 h) (Hill e Zito, 2013; **resumo**).

### 4.2.4 Onde brota o novo
- [L] Espinhas novas se agrupam perto de sinapses ativadas (De Roo et al., 2008; **resumo**). A HC4 usa proximidade de **atraso**, não espacial: equivalência proposta [A].

### 4.2.5 Um axônio, vários contatos
- [L] Contatos múltiplos do mesmo axônio no mesmo dendrito (Kasthuri et al., 2015; Bloss et al., 2018; **resumos e trechos**).

### 4.2.6 O mesmo algoritmo, fontes diferentes
- [L] Córtex auditivo que recebe fibras da retina forma módulos de orientação, com mapa menos ordenado (Sharma, Angelucci e Sur, 2000; von Melchner, Pallas e Sur, 2000; **resumos**).

### 4.2.7 Onde os dois ouvidos se encontram
- [L] O complexo olivar superior é o primeiro nível que recebe informação dos dois lados da cabeça; a maior parte das fibras cruza, mas a maior parte da via é binaural (StatPearls, NBK532311; texto de referência da Taylor & Francis; **trechos**).
- **Confronto:** as convergências entre ouvidos que a V0.17 estuda pertencem a esse nível, anterior a qualquer hemisfério. Justifica deixar a lateralização fora.

### 4.2.8 Especialização dos hemisférios (para o futuro)
- [L] Proposta de resolução temporal melhor à esquerda e espectral à direita (Zatorre, Belin e Penhune, 2002; **resumo**); a predisposição se liga à informação temporal rápida, não ao conteúdo, e é modificável (Tervaniemi e Hugdahl, 2003; **resumo**).

### 4.2.9 Duas fontes do mesmo som
- [L, de memória, **não verificado nesta rodada**] Efeito de precedência: com duas chegadas do mesmo som separadas por poucos milissegundos, a primeira domina a localização (revisão de Litovsky et al., 1999). A sombra da cabeça gera diferença de nível sobretudo nos agudos (teoria duplex de Rayleigh, 1907).
- **Confronto:** sustenta a previsão P3 (domínio do alto-falante próximo). Como os canais da gravação não são iguais, a situação é intermediária entre "uma fonte com eco" e "duas fontes".

### 4.2.10 Herdado da V0.15 (não relido)
Linhas de atraso (Jeffress, 1948; Carr e Konishi, 1990); seleção de atrasos (Gerstner et al., 1996); moldes harmônicos (Shamma e Klein, 2000); inibição binaural em mamíferos (Brand et al., 2002); tonotopia (Greenwood, 1990); recrutamento (Sachs e Abbas, 1974; Liberman, 1978); fase até alguns kHz (Johnson, 1980; Verschooten et al., 2019).

## 4.3 Reconstrução causal

| Elo | Biologia | Estatuto | Equivalente na V0.17 |
|---|---|---|---|
| 1 | Som chega aos dois ouvidos com diferença de tempo e de nível | física | Propagação na sala, com sombra da cabeça |
| 2 | A cóclea separa por lugar; fibras com limiares diferentes | [L] | 64 faixas ERB × 3 limiares |
| 3 | Fase acompanhada até alguns kHz; acima, envelope | [L] | Emissão no ciclo / pelo envelope (HC8) |
| 4 | Coincidência repetida inicia mudança; o novo nasce fraco | [L] | Acerto; candidata fraca (HC1) |
| 5 | Só o que volta a ser coativado se estabiliza | [L] | Força por acerto da mesma candidata (HC5) |
| 6 | Relações estáveis no mundo se repetem; instáveis não | **inferência** | Seleção pelo mundo (HM) |

O elo 6 é o objeto do experimento.

## 4.4 Mínimos funcionais candidatos

| Mínimo | Função | Contraexemplo procurado |
|---|---|---|
| M1 Força inicial pequena | O acaso não ganha força total | Explosão mesmo assim |
| M2 Força pelo acerto da mesma candidata | Selecionar o que se repete | Crédito espalhado (V0.15) |
| M3 Desaparecimento sem acerto | Limitar o crescimento | Sem patamar |
| M4 Brotamento local | Refinar sem cobrir tudo | Brotamento que cobre a faixa inteira |
| M5 Mundo com relações estáveis e instáveis | Haver o que selecionar | Proporções iguais entre tipos (H-nula) |

## 4.5 Abstração agnóstica (com perdas)

| Propriedade biológica | Abstração [A] | Perdas | Teste |
|---|---|---|---|
| Espinha nova fraca e provisória | Força inicial f₀ < 1 | Sem forma nem estados intermediários | M1 |
| Potenciação por coincidência repetida | +Δf por acerto, até 1 | Sem dependência de frequência | — |
| Estabilização por episódios espaçados | Estável após acertos em execuções diferentes | Escala de horas comprimida (D9) | Comparação entre execuções |
| Eliminação | Sem acerto por um prazo, some | Sem LTD | Contagem no tempo |
| Brotamento perto do ativado | Ramo vizinho, ± passo proporcional | Proximidade de atraso, não espacial | — |
| Sombra da cabeça | Modelo esférico simples (D15) | Cabeça real é uma caixa; sem pavilhão, sem tronco | Diferença de nível medida nos microfones |
| Repetição nos silêncios (reativação após a experiência) | Reapresentação do que está em formação, na mesma velocidade (D11–D11b) | Sem compressão (o hipocampo comprime ~10×); mecanismo pendente (D11c) | Comparar com e sem repetição, se o responsável quiser |

## 4.6 Previsões

**Positivas (se HM):**
- **P1 (patamar).** O número de candidatas sobe na 1ª execução e estabiliza; nas 2ª e 3ª, a criação nova é bem menor que na 1ª.
- **P2 (seleção pelo mundo).** A proporção de Uint entre ouvidos é maior entre as **consolidadas** que entre as **criadas**.
- **P3 (onde).** As Uint entre ouvidos consolidadas têm diferença de atraso próxima da diferença de chegada de um dos alto-falantes (com a geometria do exemplo, ±0,29 ms), mais vezes a do **próximo**.
- **P4 (contra o aliasing).** Essa diferença não se espalha em Δ ± k·período.
- **P5 (reacesso, secundária).** Nas execuções 2 e 3, as Uint consolidadas na 1ª disparam por chegada de Upro. Na condição de controle com ruído de fundo diferente por execução (D16a), o reacesso se mantém.
- **P6 (subteste da regra de distinção por emissão).** Com a regra, surgem Uint de uma só Upro, sintonizadas em periodicidades (com Δ/2, Δ/3); sem ela, não surgem.

**Negativas:**
- N1 silêncio: nada se cria. N2 só ruído de fundo: pode criar candidatas, mas consolida muito menos. N3 criação por relógio com as mesmas contagens: sem seletividade nem reacesso. N4 permutação de identificadores: invariância exata. N5 embaralhar os atrasos consolidados antes da 3ª execução: o reacesso cai.

**Exploratórias (sem critério):** a diferença fixa de ~2,3 ms entre as chegadas dos dois alto-falantes consolida como relação temporal? As primeiras reflexões (subexperimento b) reduzem P3?

## 4.7 Limites e refutações

- **Refuta HM nesta implementação:** P1 falha (sem patamar), ou P2 falha (proporções iguais), ou P4 falha.
- **Indica H-trivial:** o reacesso some no controle com ruído diferente por execução (D16a).
- **Não refuta a CLEAR:** falhas refutam esta Pcrt e estes parâmetros.

# 5. Hipóteses de trabalho e previsão de alcance

## 5.1 O que se pretende implementar

**Mundo** [R]+[A]:
- Sala de 2 × 2 m, 3 m de altura. Dois alto-falantes no meio de paredes opostas, na altura da cabeça do robô (proposta, D19).
- Robô parado, sem reflexos, de lado para os alto-falantes, deslocado: exemplo de 0,6 m de um e 1,4 m do outro (D14). Cabeça a ~0,355 m do chão; microfones a 10 cm um do outro [C] modelo do robô.
- Gravação [R]: Ashtar Moïra, domínio público, original sem alterações, estéreo, 513,56 s, SHA-256 em [gravacao.md](gravacao.md). Canal esquerdo no alto-falante próximo.
- Propagação: atraso e atenuação por distância; sombra da cabeça (D15); subexperimentos (a) sem reflexões e (b) primeiras reflexões [R].
- Microfones a 48 kHz (especificação do robô); a reamostragem de 44,1 para 48 kHz é parte da simulação da propagação, não alteração da gravação [A].
- Sequência: 3 execuções completas, com 30 s de silêncio entre elas, sem ruído (D16); controle com ruído diferente por execução (D16a).

**Sistema:** Utrd de 384 vias (HC8); Pcrt de construção gradual (HC1–HC5) com as decisões da seção 6; Uint com janela que pode se estreitar pela construção [R]; repetição interna nos silêncios, do que está em formação, na mesma velocidade (D11–D11b; mecanismo pendente, D11c).

**Ordem dos subexperimentos** [R]: primeiro (a) e (b), com a regra de distinção por emissão ligada e ramos só na mesma Uint; depois, só em (a), os subtestes da regra (com e sem) e de ramos em Uint diferentes (com e sem).

## 5.2 O que se pode demonstrar

| Nível | Pode | Não pode |
|---|---|---|
| L1 transmissão | Propagação com atrasos e níveis medidos nos microfones | — |
| L2 constituição | Construção gradual autônoma e rastreável, com patamar | Que esta Pcrt é mínima ou necessária |
| L3 representação | Evidência **parcial**: seleção pelo mundo (P2–P4) e reacesso (P5) | A tríade CLEAR |

## 5.3 Critérios (propostos [A]; D12)

- **Êxito parcial:** 100% de trilha; P1 (criação na 2ª execução ≤ 20% da 1ª); P2 (razão consolidadas ÷ criadas para Uint entre ouvidos ≥ 2); P3; P5 (reacesso ≥ 80% das consolidadas); N1–N4.
- **Falha:** sem patamar; ou P2 com razão < 1,2; ou P4 falha.
- **Interrupção:** chamada sem trilha; não determinismo; mais de 20.000 Uint ou 1.000.000 de Upro e ramos (D18).

## 5.4 Ensaio mínimo do mecanismo (obrigatório antes de congelar) — executado em 16/11/2026, ver [resultados](ensaio-minimo/resultados.md)

Instrumental, rotulado como controle de engenharia:
1. **Sinais nos microfones:** conferir, com a geometria escolhida, as diferenças de chegada e de nível de cada alto-falante (lição da V0.16).
2. **Um par de vias, sinal periódico:** a candidata certa ganha mais força que as vizinhas? Há patamar?
3. **Trecho de 10 s da gravação, 384 vias:** medir o custo real por segundo simulado e estimar o da campanha.

# 6. Decisões do responsável (16/11/2026, por perguntas estruturadas)

| # | Decisão | Resultado [R] |
|---|---|---|
| D1 | Unidade das candidatas | **Ramos de uma única Upro** por par via → Uint |
| D2 | O que é um acerto | **Coincidência de origens distintas dentro da janela, mesmo abaixo do limiar** |
| D3 | Força inicial e incremento | **0,1; +0,065 por acerto, até 1** (~10 acertos até 0,75) |
| D4 | Desaparecimento | Decorre da D9: some após 10 min simulados sem acerto; a Uint some se ficar com menos de duas origens [P] |
| D5 | Faixa de atrasos da fibra | **0,5 a 20 ms** (limite superior sem fonte) |
| D6 | Candidatas iniciais | **6 por via**, espaçamento proporcional |
| D7 | Quase-acerto e brotamento | **Chegada de origem distinta entre 1 e 3 janelas; um ramo de cada lado, a ±10% do atraso**, sem usar tamanho nem sinal do erro |
| D8 | Janela e limiar iniciais da Uint | **Os da V0.15:** limiar 1,5; constante 0,30 ms; janela ≈ 0,21 ms; pode se estreitar pela construção |
| D9 | Escala de tempo | **Em minutos simulados:** estabiliza com acertos em episódios separados por **≥ 2 min**; some após **10 min** sem acerto |
| D10 | — | Substituída pelo cenário |
| D11 | Repetição interna | **Dentro da V0.17, nos silêncios** |
| D11a | O que é repetido | **O que está em formação** (candidatas e Uint ainda não estabilizadas) |
| D11b | Velocidade | **A mesma velocidade** (os intervalos são o conteúdo) |
| D11c | **Mecanismo que inicia e conduz a repetição** | **PENDENTE.** No Sdom, "disparos espontâneos vêm antes da repetição interna" [R]. Falta definir como a repetição acontece sem guardar uma cópia da entrada que funcione como *lookup*. Exige investigação antes do congelamento |
| D12 | Critérios | **Aprovados como propostos** (seção 5.3) |
| D13 | Reacesso | **Hipótese secundária** |
| D14 | Posição | Alto-falantes no meio de paredes opostas; **robô a 0,6 m do próximo** (1,4 m do outro), de lado, no eixo entre eles |
| D15 | Sombra da cabeça | **Modelo esférico simples**, escolhido após leitura da fonte |
| D16 | Entre as execuções | **30 s de silêncio, sem ruído** |
| D16a | Controle de reacesso trivial | **Sim:** condição de controle, fora da principal, com ruído de fundo diferente em cada execução |
| D17 | Taxa dos microfones | 48 kHz, conforme a especificação do robô (não perguntado; seguir a especificação) |
| D18 | Limites de recursos | **20.000 Uint e 1.000.000 de Upro e ramos** |
| D19 | Altura dos alto-falantes | **Altura da cabeça do robô** (~0,36 m) |
| D20 | Decaimento dos instáveis (após o ensaio mínimo) | **Desacerto −0,01 por chegada sem coincidência; meia-vida de 30 s** |
| D21 | Competição | **Força total de 1,0 por Upro, conservada entre os ramos** |
| D22 | Inibição | **Pré-alimentada e lateral**, ambas com efeito −0,5; a pré-alimentada chega uma janela depois da excitação |
| D23 | Portão do brotamento | **5 repetições do mesmo quase-acerto e força do ramo ≥ 0,3** |

# 7. Nomes

Nenhum termo novo. "Ramo" (aprovado em 15/11/2026); "rastro", "aresta em formação" (Sdom); "via", "favorecida", "criação por não acomodação" [P]. "Acerto", "quase-acerto" e "força" são descrições; se forem para a teoria, o nome é do responsável.

# 8. Bibliografia (com estado de leitura)

Nenhuma fonte desta rodada foi lida em texto integral.

1. Beniaguev, D. et al. (2022). Multiple synaptic contacts combined with dendritic filtering enhance spatio-temporal pattern recognition capabilities of single neurons. *bioRxiv*. **Trecho.**
2. Bi, G.-Q. (2002). [título não registrado; verificar]. *Physiol. Behav.*, 77, 551–555. **Trechos.**
3. Bi, G.-Q., Poo, M.-M. (1998). Synaptic modifications in cultured hippocampal neurons. *J. Neurosci.*, 18(24), 10464–10472. **Resumo e trechos.**
4. Bittner, K. C. et al. (2017). Behavioral time scale synaptic plasticity underlies CA1 place fields. *Science*, 357, 1033–1036. **Resumo e trechos.**
5. Bloss, E. B. et al. (2018). Single excitatory axons form clustered synapses onto CA1 pyramidal cell dendrites. *Nat. Neurosci.*, 21, 353–363. **Resumo e trechos.**
6. Cane, M. et al. (2014). *J. Neurosci.* (espinhas transitórias). **Secundária** (comentário PMC4050177); referência completa a verificar.
7. De Roo, M., Klauser, P., Muller, D. (2008). LTP promotes a selective long-term stabilization and clustering of dendritic spines. *PLoS Biol.*, 6(9), e219. **Resumo.**
8. Feldman, D. E. (2012). The spike-timing dependence of plasticity. *Neuron*, 75(4), 556–571. **Trechos.**
9. Frey, U., Morris, R. G. M. (1997). Synaptic tagging and long-term potentiation. *Nature*, 385, 533–536. **Resumo.**
10. Gerstner, W. et al. (2018). Eligibility traces and plasticity on behavioral time scales. *Front. Neural Circuits*, 12, 53. **Resumo.**
11. Giri, B. et al. (2019). Hippocampal reactivation extends for several hours following novel experience. *J. Neurosci.*, 39(5), 866–875. **Resumo.**
12. Hill, T. C., Zito, K. (2013). LTP-induced long-term stabilization of individual nascent dendritic spines. *J. Neurosci.*, 33(2), 678–686. **Resumo.**
13. Holtmaat, A., Svoboda, K. (2009). Experience-dependent structural synaptic plasticity in the mammalian brain. *Nat. Rev. Neurosci.*, 10, 647–658. **Pontos-chave.**
14. Kasthuri, N. et al. (2015). Saturated reconstruction of a volume of neocortex. *Cell*, 162(3), 648–661. **Resumo e notícia.**
15. Kramár, E. A. et al. (2012). Synaptic evidence for the efficacy of spaced learning. *PNAS*, 109(13), 5121–5126. **Resumo e trechos.**
16. Kwon, H.-B., Sabatini, B. L. (2011). Glutamate induces de novo growth of functional spines in developing cortex. *Nature*, 474, 100–104. **Resumo.**
17. Pfister, J.-P., Gerstner, W. (2006). Triplets of spikes in a model of spike timing-dependent plasticity. *J. Neurosci.*, 26(38), 9673–9682. **Trechos.**
18. Sharma, J., Angelucci, A., Sur, M. (2000). Induction of visual orientation modules in auditory cortex. *Nature*, 404, 841–847. **Resumo.**
19. Sjöström, P. J., Turrigiano, G. G., Nelson, S. B. (2001). Rate, timing, and cooperativity jointly determine cortical synaptic plasticity. *Neuron*, 32, 1149–1164. **Resumo e trechos.**
20. StatPearls: Neuroanatomy, Auditory Pathway (NCBI Bookshelf NBK532311). **Trechos.**
21. Tervaniemi, M., Hugdahl, K. (2003). Lateralization of auditory-cortex functions. *Brain Res. Rev.*, 43(3), 231–246. **Resumo.**
22. Trachtenberg, J. T. et al. (2002). Long-term in vivo imaging of experience-dependent synaptic plasticity in adult cortex. *Nature*, 420, 788–794. **Trechos; proporções por fonte secundária.**
23. von Melchner, L., Pallas, S. L., Sur, M. (2000). Visual behaviour mediated by retinal projections directed to the auditory pathway. *Nature*, 404, 871–876. **Resumo.**
24. Yagishita, S. et al. (2014). A critical time window for dopamine actions on the structural plasticity of dendritic spines. *Science*, 345, 1616–1620. **Resumo.**
25. Zatorre, R. J., Belin, P., Penhune, V. B. (2002). Structure and function of auditory cortex: music and speech. *Trends Cogn. Sci.*, 6(1), 37–46. **Resumo.**

Revisão com tabela de protocolos (PMC3589711): **trechos**; autores e título a verificar.

**Citados de memória, não verificados:** Licklider (1951); Edelman (1987); Baldwin (1896); Waddington (anos 1950); Litovsky et al. (1999), efeito de precedência; Rayleigh (1907), teoria duplex; Brown e Duda (1998), modelo de cabeça. **Herdados da V0.15:** ver 4.2.10.

**Estímulo:** Ashtar Moïra (intérprete). *Toccata et Fugue BWV 565*, gravação em Ogg Vorbis, Wikimedia Commons, domínio público. Ver [gravacao.md](gravacao.md).

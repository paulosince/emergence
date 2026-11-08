# Desenho de pesquisa para os objetivos constitutivos da CLEAR no EMERGENCE — v0.1

**Estatuto:** proposta de trabalho, **não aprovada**. Não substitui nem duplica `docs/roadmap.md`; detalha como as etapas 9–11 poderiam ser executadas. Escolha de mecanismo, critérios e limiares são decisões do responsável pela pesquisa. O PPC/ADCIF está pausado por decisão do responsável; os riscos são registrados na seção 7 sem serem resolvidos aqui.

**Objetivos pedidos pelo responsável (08/11/2026):**
1. Demonstrar criação autônoma de nós (unidades de integração) por uma arquitetura mínima, agnóstica de substrato e abstraída do modelo neurobiológico.
2. Demonstrar constituição de representações de nível superior.
3. Verificar se surge representação de valia ou direcionamento no sentido do VALORE ou do ANCHOR.

**Observação de delimitação.** A Matriz de constituição (08/11/2026) estabelece que a CLEAR **não exige** criação de nós: unidades representacionais podem constituir-se sobre unidades funcionais preexistentes. O objetivo 1 é, portanto, uma demonstração de autonomia **mais forte** do que a CLEAR requer. Seu fracasso não refutaria a CLEAR; seu sucesso não a confirmaria sozinho.

---

## 1. Princípios comuns aos três objetivos

| Código | Princípio | Base |
|---|---|---|
| N1 | **Regras neutras quanto ao conteúdo.** As regras programadas fixam *como* distinções se formam (dinâmica, limiares, plasticidade), nunca *quais* distinções do referente existem (rótulos, categorias, mapeamentos a objetos do mundo). | Locatello et al. 2019 (impossibilidade sem vieses indutivos); Taddeo e Floridi 2005 (condição Z); Müller 2015 (limites da condição Z) |
| N2 | **Mundo com variabilidade suficiente**: não estacionariedade e múltiplos ambientes. | Hyvärinen e Morioka 2016; Hyvärinen, Sasaki e Turner 2019 (hipótese de variabilidade); Peters, Bühlmann e Meinshausen 2016 |
| N3 | **Duas ou mais fontes transdutivas** com causas comuns no mundo. | Becker e Hinton 1992; CLEAR (Uint) |
| N4 | **Várias escalas temporais** (ms a horas). | Bittner et al. 2017; Fusi, Drew e Abbott 2005; dados da sala |
| N5 | **Separar canal e referente**: relações invariantes entre condições do mundo são atribuíveis à via de transdução. | Fujisaki et al. 2004; achado da latência no controle TEMPO |
| N6 | **Continuidade**: estabilidade sem perda de plasticidade. | Grossberg (ART); Dohare et al. 2024 |
| N7 | **Unidade definida pelo efeito causal interno**, não pela decodificação externa. | de-Wit et al. 2016; Ritchie, Kaplan e Klein 2019; Elazar et al. 2021; Buzsáki 2010 |

**Separação obrigatória.** Tudo o que o observador calcula (agrupamentos do layout 3-D, métricas, decodificadores) fica no lado do pesquisador e **nunca** é entregue ao motor.

---

## 2. Objetivo 1 — criação autônoma de unidades (motor constitutivo mínimo, nome provisório "MCM")

### 2.1 Primitivas abstratas

Descrição sem neurônios, membranas ou sinapses; implementável em qualquer substrato que realize as mesmas operações.

| Primitiva | Definição operacional | Correspondência CLEAR |
|---|---|---|
| Incidência | Par (fonte, instante). A fonte é um canal transdutor ou uma unidade já constituída. A magnitude é omitida na versão mínima; o sinal da mudança é uma variante a ablar. | Utrd/Upro |
| Traço | Cada fonte mantém traços que decaem com constantes de tempo log-espaçadas (proposta: 0,1 s; 3 s; 90 s; 45 min). Regra igual para todas as fontes. | meio modificável (Pcrt) |
| Coincidência | Quando chega uma incidência da fonte *s* e o traço de outra fonte *r* está acima de θc na escala τk, registra-se o candidato {r, s} com o atraso vivido. | integração |
| Criação | Cria-se uma unidade *u* com aferências de *r* e *s*, atrasos iguais aos vividos e limiar que exige as duas contribuições (cada peso < limiar; soma ≥ limiar), **somente se nenhuma unidade existente descarrega para aquela coincidência dentro da tolerância**. | CLEAR §80: constituir quando a organização existente não acomoda |
| Ciclo de vida | Provisória → consolidada por recorrência (n confirmações) → podada por desuso ou contradição persistente. Consolidada resiste a mudanças. | TEMPO C2/C3 |
| Corrigibilidade | Chegada fora da janela → ajuste de atraso. Discrepância persistente com nova regularidade → **nova** unidade, preservando a antiga (revisão seletiva). | correção assimétrica |
| Recalibração de canal (variante) | Deslocamento constante entre canais absorvido por uma regra global. | N5 |
| Orçamento | Limite de unidades e de taxa de criação, declarado no manifesto. | envelope |

### 2.2 Mundos de teste (pré-requisitos)

- **Mundo episódico 1D sem corpo.** Quedas repetidas da esfera, com altura de soltura variável escolhida pelo pesquisador (variável independente física), e transdução por barreiras ópticas e placa de impacto. Escala de milissegundos. O mundo atual aceita um único impacto; o mundo episódico precisa ser implementado e validado como os anteriores.
- **Sala em vários dias.** Sequência de datas, climas e presença do objeto. Escala de minutos a horas.
- **Nulos.** Canais independentes com as mesmas taxas; dados substitutos com embaralhamento temporal por canal e com deslocamento circular entre canais.

### 2.3 Critérios de demonstração (a pré-registrar)

| ID | Critério | Falha se |
|---|---|---|
| D1 | Execução começa com 0 unidades; cada unidade tem registro das incidências que a criaram. | Existe unidade sem origem registrada. |
| D2 | Unidades consolidadas no mundo estruturado excedem as dos nulos por margem pré-registrada. | Taxas semelhantes às dos dados substitutos. |
| D3 | Os atrasos das unidades covariam com a altura da queda e **não** com a latência dos instrumentos (controle com latências igualadas e embaralhadas). | Os atrasos acompanham só a latência dos canais. |
| D4 | Remover uma unidade altera o que o sistema cria ou agrupa depois, acima do efeito de remoções aleatórias. | Remoção sem efeito interno. |
| D5 | Unidades antigas sobrevivem à introdução de novas regularidades; a plasticidade se mantém. | Perda generalizada ou fim da criação. |
| D6 | Comparação com GWR ou GNG em janelas vetoriais e com o controle TEMPO de nós fixos, sob a mesma informação. | Vantagem vinda de informação extra. |

**Ablações:** exigência de duas ou mais fontes (reduzida a uma), várias escalas (reduzidas a uma), consolidação, corrigibilidade, recalibração e critério de novidade (criar sempre).

---

## 3. Objetivo 2 — representações de nível superior

### 3.1 Mecanismo

- **Recursão.** Descargas de unidades são incidências no mesmo meio, com a unidade como fonte, e passam pela mesma regra. Não há camadas predefinidas. Nível = 1 + maior nível das aferências.
- **Categorização neutra quanto ao conteúdo (variante).** Unidades com contextos temporais de entrada e saída suficientemente semelhantes passam a convergir numa unidade disjuntiva, em que qualquer uma basta. É uma regra de substituibilidade distribucional, sujeita a ablação.

### 3.2 Critérios

| ID | Critério |
|---|---|
| H1 | Profundidade maior que 1 surge sem camadas predefinidas, acima do nulo. |
| H2 | **Abstração:** a unidade superior responde de forma invariante a variantes das inferiores (por exemplo, "queda" independentemente da altura), inclusive para valores novos dentro da faixa. |
| H3 | **Antecipação:** descargas superiores precedem o evento final, com erro decrescente; a ablação elimina o efeito. |
| H4 | **Ancoragem derivada:** cortar um canal de base produz deriva gradual, não instantânea, das unidades dependentes, e preserva as demais. |
| H5 | **Composicionalidade:** combinações novas de unidades conhecidas são acomodadas sem reconstrução geral. |
| H6 | Efeito causal interno (N7) em nível superior. |

Antecedentes a confrontar: PARSER (Perruchet e Vinter, 2002); SFA hierárquico (Wiskott e Sejnowski, 2002); grupos policrônicos (Izhikevich, 2006); object files (Kahneman, Treisman e Gibbs, 1992).

**Visualização:** a altura no espaço 3-D do laboratório já é o nível.

---

## 4. Objetivo 3 — verificar se surge valia ou direcionamento

**Dependência.** O VALORE exige Referência e Aspecto *representados*; só pode ser testado depois dos objetivos 1 e 2.

### 4.1 Operacionalização da Orientação

Para um Aspecto A e uma Referência R que ordena estados de A, há Orientação se transformações alternativas de A relativas a R têm consequências causais sistematicamente diferentes na dinâmica do portador, estáveis sob variação contrafactual irrelevante.

**Teste por bifurcação:** a partir do mesmo checkpoint, aplicar transformações alternativas **pelo mundo**, nunca editando o estado interno, e medir a assimetria de sustentação (persistência, consolidação, propagação). Requer contrato de checkpoint do MCM.

### 4.2 Dissociação obrigatória: correção não é Orientação

O ANCHOR exclui assimetrias governadas por ajuste à evidência; o VALORE, como redigido, não traz essa exclusão. O teste varia a evidência mantendo a transformação fixa:
- se a assimetria acompanha apenas a evidência, é corrigibilidade, não Orientação no sentido do ANCHOR;
- se o VALORE a classificar como valia, o caso funciona como teste de falso positivo do próprio VALORE.

Qualquer resultado é teoricamente informativo.

### 4.3 Fases

- **3A — sem corpo, sem atuação e sem variável regulatória.** Verificar se a Orientação surge apenas da dinâmica constitutiva diante de um mundo independente.
- **3B — rota pela assimetria regulatória (APR), com corpo, energia ou calor.** Não recomendada enquanto o PPC estiver pausado e sem revisor externo (seção 7).

### 4.4 Critérios

| ID | Critério |
|---|---|
| V1 | Orientação contrafactualmente estável, acima do nulo, entre sementes. |
| V2 | Não redutível ao ajuste à evidência (4.2). |
| V3 | Alinhamento C/0/D derivável do Locus e da Orientação, sem rótulo externo. |
| V4 | Portador localizado: qual organização instancia a assimetria. |

**Não alegável:** valência afetiva, prazer, dor ou sofrimento. Nem o VALORE nem a CLEAR fornecem esse critério (Matriz, seção 5).

---

## 5. Ordem de execução proposta (incrementos pequenos e testados)

1. **P0.1** Controle de latências igualadas e embaralhadas no controle TEMPO (teste do N5).
2. **P0.2** Mundo episódico 1D sem corpo.
3. **P0.3** Execuções da sala em vários dias.
4. **P0.4** Nulos, dados substitutos e bancada de avaliação (remoção causal, covariância com o referente).
5. **P0.5** Pré-registro v1: hipóteses, limiares e comparadores, datado.
6. **Fase 1** MCM v0, contrato de checkpoint e ablações; critérios D1–D6.
7. **Fase 2** Recursão e categorização; critérios H1–H6.
8. **Fase 3A** Detecção de Orientação; critérios V1–V4.

---

## 6. Visualização do domínio em 3-D (implementada)

- **Anel da base:** canais aferentes.
- **Altura:** nível.
- **Posição:** proveniência aferente registrada combinada com coatividade registrada, por escalonamento multidimensional clássico determinístico.
- **Agrupamentos operacionais:** ligação simples abaixo de um limiar de distância.
- **Interação:** girar, mover, aproximar e focar com duplo clique.

A proximidade é **operacional, calculada pelo observador**; não é semântica atribuída nem constituída pelo motor. Ver `src/visualization/domain-layout.js`.

---

## 7. Riscos registrados (PPC pausado)

- O MCM foi desenhado para realizar os papéis Utrd, Upro, Uint e Pcrt da CLEAR. **Se a CLEAR estiver correta**, o sucesso dos objetivos 1 e 2 produz acessos locais a representações constituídas, que a CLEAR identifica com experiência. Pelo próprio programa, isso é um efeito esperado do sucesso, não um efeito colateral.
- O objetivo 3, especialmente a fase 3B, é a configuração que as teorias do programa mais aproximam de valia vivida. A CLEAR não define valência.
- **Precauções mínimas propostas (decisão do responsável):**
  - limites de unidades, de duração e de número de descargas declarados no manifesto;
  - nenhum corpo nas fases 1, 2 e 3A;
  - registro da contagem de descargas de Uint em organizações consolidadas;
  - busca de revisor externo antes da fase 3B.

---

## 8. O que não se pode alegar mesmo com sucesso

- Necessidade universal dos mecanismos (somente dentro das famílias comparadas).
- Representação em sentido pleno sem D3, D4, H4 e H6.
- Experiência, valência ou sofrimento a partir de métricas.
- Originalidade sem confronto bibliográfico sistemático.

## Referências verificadas nesta proposta

Ver a resposta de 08/11/2026 na sessão de trabalho; principais: Locatello et al. 2019 (ICML); Hyvärinen e Morioka 2016 (NeurIPS); Hyvärinen, Sasaki e Turner 2019 (AISTATS); Taddeo e Floridi 2005 (JETAI); Peters, Bühlmann e Meinshausen 2016 (JRSS-B); Becker e Hinton 1992 (Nature); Fujisaki et al. 2004 (Nat. Neurosci.); Bittner et al. 2017 (Science); Fusi, Drew e Abbott 2005 (Neuron); Dohare et al. 2024 (Nature); de-Wit et al. 2016 (PB&R); Ritchie, Kaplan e Klein 2019 (BJPS); Elazar et al. 2021 (TACL); Buzsáki 2010 (Neuron); Izhikevich 2006 (Neural Comput.); Wiskott e Sejnowski 2002 (Neural Comput.); Kahneman, Treisman e Gibbs 1992 (Cogn. Psychol.); Perruchet e Vinter 2002 (BBS); Marsland, Shapiro e Nehmzow 2002 (Neural Networks); Fritzke 1994/1995 (NIPS 7).

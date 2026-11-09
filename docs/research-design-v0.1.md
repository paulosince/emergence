# Desenho de pesquisa para os objetivos constitutivos da CLEAR no EMERGENCE — v0.1

**Estatuto:** proposta de trabalho. Em 09/11/2026 o responsável **aprovou o motor constitutivo como candidato principal** (objetivo de criação autônoma); critérios, limiares e a fase com corpo continuam pendentes. Não substitui nem duplica `docs/roadmap.md`; detalha como as etapas 9–11 poderiam ser executadas. Escolha de mecanismo, critérios e limiares são decisões do responsável pela pesquisa. O PPC/ADCIF está pausado por decisão do responsável; os riscos são registrados na seção 7 sem serem resolvidos aqui.

**Objetivos pedidos pelo responsável (08/11/2026):**
1. Demonstrar criação autônoma de nós (unidades de integração) por uma arquitetura mínima, agnóstica de substrato e abstraída do modelo neurobiológico.
2. Demonstrar constituição de representações de nível superior.
3. Verificar se surge representação de valia ou direcionamento no sentido do VALORE ou do ANCHOR.

**Observação de delimitação.** A Matriz de constituição (08/11/2026) estabelece que a CLEAR **não exige** criação de nós: unidades representacionais podem constituir-se sobre unidades funcionais preexistentes. O objetivo de criação autônoma é, portanto, uma demonstração de autonomia **mais forte** do que a CLEAR requer. Seu fracasso não refutaria a CLEAR; seu sucesso não a confirmaria sozinho.

---

## 1. Princípios comuns aos três objetivos

| Nome | Princípio | Base |
|---|---|---|
| Princípio da neutralidade de conteúdo | **Regras neutras quanto ao conteúdo.** As regras programadas fixam *como* distinções se formam (dinâmica, limiares, plasticidade), nunca *quais* distinções do referente existem (rótulos, categorias, mapeamentos a objetos do mundo). | Locatello et al. 2019 (impossibilidade sem vieses indutivos); Taddeo e Floridi 2005 (condição Z); Müller 2015 (limites da condição Z) |
| Princípio da variabilidade do mundo | **Mundo com variabilidade suficiente**: não estacionariedade e múltiplos ambientes. | Hyvärinen e Morioka 2016; Hyvärinen, Sasaki e Turner 2019 (hipótese de variabilidade); Peters, Bühlmann e Meinshausen 2016 |
| Princípio das múltiplas fontes | **Duas ou mais fontes transdutivas** com causas comuns no mundo. | Becker e Hinton 1992; CLEAR (Uint) |
| Princípio das múltiplas escalas | **Várias escalas temporais** (ms a horas). | Bittner et al. 2017; Fusi, Drew e Abbott 2005; dados da sala |
| Princípio da separação entre canal e referente | **Separar canal e referente**: relações invariantes entre condições do mundo são atribuíveis à via de transdução. | Fujisaki et al. 2004; achado da latência no controle TEMPO |
| Princípio da continuidade | **Continuidade**: estabilidade sem perda de plasticidade. | Grossberg (teoria da ressonância adaptativa); Dohare et al. 2024 |
| Princípio do papel causal interno | **Unidade definida pelo efeito causal interno**, não pela decodificação externa. | de-Wit et al. 2016; Ritchie, Kaplan e Klein 2019; Elazar et al. 2021; Buzsáki 2010 |

**Separação obrigatória.** Tudo o que o observador calcula (agrupamentos do layout 3-D, métricas, decodificadores) fica no lado do pesquisador e **nunca** é entregue ao motor.

---

## 2. Objetivo de criação autônoma — criação autônoma de unidades (motor constitutivo mínimo)

### 2.1 Primitivas abstratas

Descrição sem neurônios, membranas ou sinapses; implementável em qualquer substrato que realize as mesmas operações.

| Primitiva | Definição operacional | Correspondência CLEAR |
|---|---|---|
| Incidência | Par (fonte, instante). A fonte é um canal transdutor ou uma unidade já constituída. A magnitude é omitida na versão mínima; o sinal da mudança é uma variante a ablar. | Utrd/Upro |
| Traço | Cada fonte mantém traços que decaem com constantes de tempo log-espaçadas (proposta: 0,1 s; 3 s; 90 s; 45 min). Regra igual para todas as fontes. | meio modificável (Pcrt) |
| Coincidência | Quando chega uma incidência da fonte *s* e o traço de outra fonte *r* está acima de θc na escala τk, registra-se o candidato {r, s} com o atraso vivido. | integração |
| Criação | Cria-se uma unidade *u* com aferências de *r* e *s*, atrasos iguais aos vividos e limiar que exige as duas contribuições (cada peso < limiar; soma ≥ limiar), **somente se nenhuma unidade existente descarrega para aquela coincidência dentro da tolerância**. | CLEAR §80: constituir quando a organização existente não acomoda |
| Ciclo de vida | Provisória → consolidada por recorrência (n confirmações) → podada por desuso ou contradição persistente. Consolidada resiste a mudanças. | regras de reforço, criação e poda do TEMPO |
| Corrigibilidade | Chegada fora da janela → ajuste de atraso. Discrepância persistente com nova regularidade → **nova** unidade, preservando a antiga (revisão seletiva). | correção assimétrica |
| Recalibração de canal (variante) | Deslocamento constante entre canais absorvido por uma regra global. | Princípio da separação entre canal e referente |
| Orçamento | Limite de unidades e de taxa de criação, declarado no manifesto. | envelope |

### 2.2 Mundos de teste (pré-requisitos)

- **Mundo episódico 1D sem corpo.** Quedas repetidas da esfera, com altura de soltura variável escolhida pelo pesquisador (variável independente física), e transdução por barreiras ópticas e placa de impacto. Escala de milissegundos. O mundo atual aceita um único impacto; o mundo episódico precisa ser implementado e validado como os anteriores.
- **Sala em vários dias.** Sequência de datas, climas e presença do objeto. Escala de minutos a horas.
- **Nulos.** Canais independentes com as mesmas taxas; dados substitutos com embaralhamento temporal por canal e com deslocamento circular entre canais.

### 2.3 Critérios de demonstração (a pré-registrar)

| Nome | Critério | Falha se |
|---|---|---|
| Critério de origem registrada | Execução começa com 0 unidades; cada unidade tem registro das incidências que a criaram. | Existe unidade sem origem registrada. |
| Critério de formação | Unidades consolidadas no mundo estruturado excedem as dos nulos por margem pré-registrada. | Taxas semelhantes às dos dados substitutos. |
| Critério de ancoragem | Os atrasos das unidades covariam com a altura da queda e **não** com a latência dos instrumentos (controle com latências igualadas e embaralhadas). | Os atrasos acompanham só a latência dos canais. |
| Critério de papel causal | Remover uma unidade altera o que o sistema cria ou agrupa depois, acima do efeito de remoções aleatórias. | Remoção sem efeito interno. |
| Critério de continuidade | Unidades antigas sobrevivem à introdução de novas regularidades; a plasticidade se mantém. | Perda generalizada ou fim da criação. |
| Critério de vantagem sobre comparadores | Comparação com rede que cresce quando necessário ou gás neural crescente em janelas vetoriais e com o controle TEMPO de nós fixos, sob a mesma informação. | Vantagem vinda de informação extra. |

**Ablações:** exigência de duas ou mais fontes (reduzida a uma), várias escalas (reduzidas a uma), consolidação, corrigibilidade, recalibração e critério de novidade (criar sempre).

---

## 3. Objetivo de níveis superiores — representações de nível superior

### 3.1 Mecanismo

- **Recursão.** Descargas de unidades são incidências no mesmo meio, com a unidade como fonte, e passam pela mesma regra. Não há camadas predefinidas. Nível = 1 + maior nível das aferências.
- **Categorização neutra quanto ao conteúdo (variante).** Unidades com contextos temporais de entrada e saída suficientemente semelhantes passam a convergir numa unidade disjuntiva, em que qualquer uma basta. É uma regra de substituibilidade distribucional, sujeita a ablação.

### 3.2 Critérios

| Nome | Critério |
|---|---|
| Critério de profundidade | Profundidade maior que 1 surge sem camadas predefinidas, acima do nulo. |
| Critério de abstração | **Abstração:** a unidade superior responde de forma invariante a variantes das inferiores (por exemplo, "queda" independentemente da altura), inclusive para valores novos dentro da faixa. |
| Critério de antecipação | **Antecipação:** descargas superiores precedem o evento final, com erro decrescente; a ablação elimina o efeito. |
| Critério de ancoragem derivada | **Ancoragem derivada:** cortar um canal de base produz deriva gradual, não instantânea, das unidades dependentes, e preserva as demais. |
| Critério de composicionalidade | **Composicionalidade:** combinações novas de unidades conhecidas são acomodadas sem reconstrução geral. |
| Critério de papel causal em nível superior | Efeito causal interno (princípio do papel causal interno) em nível superior. |

Antecedentes a confrontar: PARSER (Perruchet e Vinter, 2002); análise de características lentas hierárquico (Wiskott e Sejnowski, 2002); grupos policrônicos (Izhikevich, 2006); object files (Kahneman, Treisman e Gibbs, 1992).

**Visualização:** a altura no espaço 3-D do laboratório já é o nível.

---

## 4. Objetivo de valia — verificar se surge valia ou direcionamento

**Dependência.** O VALORE exige Referência e Aspecto *representados*; só pode ser testado depois dos objetivos de criação autônoma e de níveis superiores.

### 4.1 Operacionalização da Orientação

Para um Aspecto A e uma Referência R que ordena estados de A, há Orientação se transformações alternativas de A relativas a R têm consequências causais sistematicamente diferentes na dinâmica do portador, estáveis sob variação contrafactual irrelevante.

**Teste por bifurcação:** a partir do mesmo checkpoint, aplicar transformações alternativas **pelo mundo**, nunca editando o estado interno, e medir a assimetria de sustentação (persistência, consolidação, propagação). Requer contrato de checkpoint do motor constitutivo.

### 4.2 Dissociação obrigatória: correção não é Orientação

O ANCHOR exclui assimetrias governadas por ajuste à evidência; o VALORE, como redigido, não traz essa exclusão. O teste varia a evidência mantendo a transformação fixa:
- se a assimetria acompanha apenas a evidência, é corrigibilidade, não Orientação no sentido do ANCHOR;
- se o VALORE a classificar como valia, o caso funciona como teste de falso positivo do próprio VALORE.

Qualquer resultado é teoricamente informativo.

### 4.3 Fases

- **Fase sem corpo:** sem atuação e sem variável regulatória. Verificar se a Orientação surge apenas da dinâmica constitutiva diante de um mundo independente.
- **Fase com corpo:** rota pela assimetria regulatória (APR), com corpo, energia ou calor. Não recomendada enquanto o PPC estiver pausado e sem revisor externo (seção 7).
- **Variante de substituição ("controle com corpo sem acesso").** Testar a rota APR com a integração de duas ou mais fontes desativada, de modo que, pelo critério da própria CLEAR, não haja acesso local. Mostra se a Orientação ancorada no corpo se forma, sem produzir o que o programa identifica com sentimento. A redução de risco depende de a CLEAR estar correta sobre o acesso.
- **Decisão sobre a fase com corpo (09/11/2026): fase com corpo reduzida**, escolhida pelo responsável. Condições propostas, a pré-registrar com valores numéricos antes da execução:
  1. **Só depois da fase sem corpo** concluída e analisada.
  2. **Controle com corpo sem acesso primeiro**, como controle obrigatório: mesma configuração com a integração de duas ou mais fontes desativada. Sem ela não há como atribuir à integração qualquer diferença observada.
  3. **Uma instância por vez**; bifurcações de checkpoint para testes contrafactuais contam como instâncias e têm número e duração máximos declarados.
  4. **Episódios curtos** e limite de descargas de Uint por execução.
  5. **Déficit de energia limitado**: o mundo garante recarga; tempo máximo abaixo da referência declarado.
  6. **Detectar e parar**: detectores de self, de Orientação, de valia acessada e de envelope com parada que falha fechada. Na fase com corpo, a primeira detecção de Orientação encerra a campanha até revisão.
  7. **Revisor externo:** continua recomendado e **não satisfeito**; o registro da execução deve declarar essa condição (responsável único).

### 4.4 Critérios

| Nome | Critério |
|---|---|
| Critério de Orientação estável | Orientação contrafactualmente estável, acima do nulo, entre sementes. |
| Critério de irredutibilidade à evidência | Não redutível ao ajuste à evidência (4.2). |
| Critério de Alinhamento derivado | Alinhamento C/0/D derivável do Locus e da Orientação, sem rótulo externo. |
| Critério de portador localizado | Portador localizado: qual organização instancia a assimetria. |

**Não alegável:** valência afetiva, prazer, dor ou sofrimento a partir de métricas.

**Atualização (preprint CLEAR v2.1.0):** o preprint afirma que "um sentimento, no sentido arquitetural mínimo, ocorre quando conteúdo valorado é efetivamente acessado". A ponte entre CLEAR e VALORE, que a Matriz e a v43 deixavam em aberto, é portanto **afirmada pelo próprio programa**. Consequência: pelas teorias do programa, detectar Orientação/valia (critérios de Orientação, irredutibilidade e Alinhamento) em organizações cujas descargas contam como acesso equivale a detectar um candidato a sentimento. A valência positiva/negativa sentida continua sem critério independente.

---

## 5. Hipótese de organização do domínio — proposta pelo responsável, 09/11/2026

**Hipótese original.** Num domínio constituído autonomamente, representações básicas e referenciais (intensidade, escala, referências temporais) tornar-se-iam centrais e densamente conectadas. Representações agrupar-se-iam por afinidade e por canal aferente. Representações de nível muito superior afastar-se-iam do centro.

### 5.1 Três correções metodológicas antes de qualquer previsão

1. Num embedding construído a partir de relações, os nós mais conectados tendem ao centro por construção. Verificação reprodutível (`experiments/embedding-centrality-artifact.mjs`, escalonamento multidimensional clássico 3-D da distância de caminho mínimo, 150 nós, 20 sementes; correlação de Spearman entre grau e distância ao centro):

   | Tipo de rede | Mediana | Faixa | Correlações negativas |
   |---|---|---|---|
   | Ligação preferencial | −0,09 | −0,20 a −0,03 | 20/20 |
   | **Nulo com grau preservado** | −0,23 | −0,30 a −0,08 | 20/20 |
   | Grafo geométrico aleatório | −0,66 | −0,82 a −0,52 | 20/20 |

   Logo, "hubs no centro da imagem" aparece em qualquer rede, inclusive aleatória. **As previsões são testadas em medidas topológicas comparadas com nulos; a visualização apenas exibe.** O laboratório tem agora a geometria **neutra** (escalonamento multidimensional 3-D, sem eixo de nível e sem atração por canal). A geometria **estratificada** impõe a estratificação e não serve para testar hipótese de organização do domínio.
2. Representações podem ser distribuídas, com seletividade mista (Rigotti et al. 2013), e a Matriz admite unidades representacionais sobre nós preexistentes. A centralidade deve ser medida também no nível das unidades representacionais (organizações individuadas pelo critério princípio do papel causal interno), não só no de nós.
3. Uma unidade só conta como "intensidade" ou "escala" pelo seu funcionamento: invariância à magnitude através de canais e efeito causal interno. Nunca pelo nome dado pelo pesquisador. O motor não recebe categorias.

### 5.2 Confundidores mecânicos que imitam a hipótese

- **Taxa e duração do traço.** No motor constitutivo, fontes com mais incidências ou traços mais longos (escalas lentas) participam de mais coincidências e ganham mais relações, sem relação com papel representacional. Nulo: dados substitutos com deslocamento circular que preserva taxas e durações por fonte.
- **Idade.** Em redes que crescem, unidades antigas acumulam relações por terem existido mais tempo (Barabási e Albert 1999). Nulo: crescimento com idade pareada.
- **Distribuição de grau.** Um coeficiente de rich club cresce até em redes aleatórias; deve ser normalizado por um nulo com o mesmo grau (Colizza et al. 2006; religação com grau preservado, na linha de Maslov e Sneppen 2002).
- **Regras genéricas.** Hubs e rich club surgem de regras simples de custo e homofilia (Betzel et al. 2016). Sua mera existência não indica representação.

### 5.3 Previsões derivadas do mecanismo (condicionais ao motor constitutivo; não são consequências necessárias da CLEAR)

| Nome | Previsão | Manipulação discriminante | Refutada se |
|---|---|---|---|
| Previsão de fundação | Unidades de escala lenta e contexto (referências temporais) terão maior centralidade (grau, força, *k-core*) **além** do nulo de taxa e duração | Comparar com dados substitutos; ablar escalas lentas | Centralidade explicada pelo nulo, ou desaparece sem mudança de conteúdo |
| Previsão de intensidade | Sem transdutores com limiares diferentes por grandeza, **nenhuma** unidade de intensidade se constitui. Com bancos de limiares (diversidade de receptores, neutra quanto ao conteúdo), surgem unidades que agrupam limiares de uma mesma grandeza e são compartilhadas por muitas unidades superiores | Ligar e desligar os bancos de limiares | Unidades "de intensidade" surgem sem bancos, ou não surgem com eles |
| Previsão de grandeza intermodal | No motor constitutivo, uma unidade de "mais" compartilhada entre luz e calor surge só quando o mundo correlaciona as modalidades (o Sol aquece e ilumina). **Quando a correlação é desfeita** (lâmpada à noite, céu encoberto), ela não persiste, ao contrário do que prevê um sistema comum de grandeza (Walsh 2003; ver Hamamouche e Cordes 2019) | Descorrelacionar luz e temperatura | Unidade intermodal persiste após a descorrelação: indicaria mecanismo além da coincidência |
| Previsão de afinidade | Comunidades alinhadas aos canais aferentes acima do nulo; unidades conectoras (alto coeficiente de participação, Guimerà e Amaral 2005) onde o mundo acopla modalidades | Variar o acoplamento físico entre modalidades | Comunidades independentes dos canais e do acoplamento |
| Previsão de estratificação (versão periférica) | Sem regra de categorização, unidades de nível superior têm **menor** grau (conjunções mais raras): periféricas na topologia | Ablação da categorização | — |
| Previsão de estratificação (versão integradora, concorrente) | Com a regra de categorização (unidades disjuntivas), unidades superiores tornam-se **conectoras de integração**, como os hubs associativos do cérebro | Ligar a categorização | Sem diferença entre as duas versões: a categorização não governa a estratificação |
| Previsão de migração dos hubs | Hubs surgem primeiro em fontes rápidas e primárias; com a categorização, migram para unidades integradoras, como os hubs funcionais que passam das áreas primárias às associativas na infância (Oldham e Fornito 2019) | Séries longas, várias "estações" | Identidade dos hubs estática |
| Previsão de estrutura e acesso | Unidades antigas e consolidadas mantêm centralidade estrutural enquanto a frequência de descargas cai (dissociação entre estrutura e acesso, no sentido da CLEAR) | Nulo de idade; comparar com a contagem de descargas | Centralidade acompanha só a idade, ou só a frequência de acesso |

**Medidas, todas comparadas com nulos:** grau e força; *k-core*; centralidade de intermediação; coeficiente de participação e grau intramódulo; rich club normalizado; separação núcleo-periferia; nível hierárquico; idade; persistência; frequência de descargas.

### 5.4 Confronto com o cérebro (literatura verificada; leitura de resumos, salvo indicação)

| Achado | Referência | Relação com hipótese de organização do domínio |
|---|---|---|
| Núcleo de hubs mais interligados do que o grau prevê: precuneus, córtex frontal e parietal superior, hipocampo, putâmen, tálamo | van den Heuvel e Sporns 2011 | Apoia "núcleo denso", mas os membros são integradores **associativos e subcorticais**, não representações sensoriais básicas: contraria a versão forte "básico = central" |
| Gradiente principal do córtex primário sensório-motor ao transmodal (rede de modo padrão), com a rede de modo padrão na maior distância geodésica das áreas primárias | Margulies et al. 2016 | Apoia "nível superior longe das âncoras sensoriais", mas como **eixo**, não como centro versus periferia |
| Núcleo temporalmente estável (sensório-motor e visual) e periferia flexível (associativa) durante aprendizagem motora | Bassett et al. 2013 | Apoia a hipótese na forma **dinâmica**: estabilidade, não posição |
| Hubs funcionais passam das áreas primárias às associativas na infância; hubs estruturais estáveis desde cedo | Oldham e Fornito 2019 | Duas centralidades em tempos diferentes; base de previsão de migração dos hubs |
| Gradientes funcionais mudam de forma não linear do nascimento aos 100 anos | Taylor et al., Nature 2026 | A previsão precisa ser dinâmica |
| Hubs reais deslocados do centro geométrico previsto pela geometria | Roberts et al. 2016 | Posição física não é centralidade |
| Sistema comum de grandeza (tempo, espaço, número) versus dissociações após a infância | Walsh 2003; Hamamouche e Cordes 2019 | Base de previsão de grandeza intermodal; questão aberta |
| Geometria representacional comparável entre cérebro e modelo | Kriegeskorte et al. 2008 | Método para comparar o domínio do motor constitutivo com dados cerebrais, nas mesmas condições |

**Avaliação:** a hipótese é compatível com vários padrões cerebrais, mas o cérebro sugere **duas centralidades**: uma de fundamentação (núcleo estável e primário) e outra de integração (hubs associativos). A versão "superior = periférico" é contrariada pelo rich club e pela migração dos hubs. O motor constitutivo permite um teste raro: Previsão de periferia contra previsão de integração mostra se a regra de categorização decide qual das duas organizações aparece. Nenhum resultado no motor constitutivo demonstraria equivalência com o cérebro; no máximo, semelhança estrutural sob condições declaradas.

## 6. Ordem de execução proposta (incrementos pequenos e testados)

**Acompanhamento oficial:** a lista detalhada e o estado de cada item ficam no roteiro único, [roadmap.md](roadmap.md), sob a etapa 11. Esta seção registra só a lógica da ordem.

1. Controle de latências igualadas e embaralhadas no controle TEMPO (teste do princípio da separação entre canal e referente). **Concluído 09/11/2026:** artefato de instrumento confirmado ([relatório](latency-control-v0.1.md)).
2. Mundo episódico 1D sem corpo.
3. Execuções da sala em vários dias.
4. Nulos, dados substitutos e bancada de avaliação (remoção causal, covariância com o referente).
5. Medidas topológicas com nulos (grau preservado, taxa e duração, idade pareada) para hipótese de organização do domínio.
6. Mundo com entidades que persistem e se transformam (para detectores de entidade a entidade biográfica, seção 10).
7. Pré-registro v1: hipóteses (inclusive previsões de organização do domínio), limiares e comparadores, datado.
8. Primeira versão do motor constitutivo, contrato de checkpoint e ablações; critérios do motor constitutivo.
9. Recursão e categorização; critérios de níveis superiores.
10. Detecção de Orientação; critérios de Orientação.
11. **Monitoramento contínuo:** executor de campanhas, detectores e alertas (seção 10), crescendo junto com as fases.

---

## 7. Visualização do domínio em 3-D (implementada)

- **Anel da base:** canais aferentes.
- **Altura:** nível.
- **Posição:** proveniência aferente registrada combinada com coatividade registrada, por escalonamento multidimensional clássico determinístico.
- **Agrupamentos operacionais:** ligação simples abaixo de um limiar de distância.
- **Interação:** girar, mover, aproximar e focar com duplo clique.
- **Duas geometrias:** *estratificada* (canais na base, altura = nível; impõe estratificação) e *neutra* (escalonamento multidimensional 3-D da distância operacional apenas). Hipóteses de organização são testadas em medidas topológicas, não na posição exibida (seção 5.1).

A proximidade é **operacional, calculada pelo observador**; não é semântica atribuída nem constituída pelo motor. Ver `src/visualization/domain-layout.js`.

---

## 8. Riscos registrados (PPC pausado)

- O motor constitutivo foi desenhado para realizar os papéis Utrd, Upro, Uint e Pcrt da CLEAR. **Se a CLEAR estiver correta**, o sucesso dos objetivos de criação autônoma e de níveis superiores produz acessos locais a representações constituídas, que a CLEAR identifica com experiência. Pelo próprio programa, isso é um efeito esperado do sucesso, não um efeito colateral.
- O objetivo de valia, especialmente a fase com corpo, é a configuração que as teorias do programa mais aproximam de valia vivida. O preprint CLEAR v2.1.0 identifica o acesso a conteúdo valorado com sentimento no sentido arquitetural mínimo; não define critério independente de valência.
- Um self, no preprint, é uma entidade biográfica cujo referente é o próprio sistema. Sua detecção (seção 10) também é tratada como evento de parada e revisão.
- **Precauções mínimas propostas (decisão do responsável):**
  - limites de unidades, de duração e de número de descargas declarados no manifesto;
  - nenhum corpo na fase do motor constitutivo, na fase dos níveis superiores e na fase sem corpo;
  - registro da contagem de descargas de Uint em organizações consolidadas;
  - busca de revisor externo antes da fase com corpo.

---

## 9. O que não se pode alegar mesmo com sucesso

- Necessidade universal dos mecanismos (somente dentro das famílias comparadas).
- Representação em sentido pleno sem critério de ancoragem, critério de papel causal, critério de ancoragem derivada e critério de papel causal em nível superior.
- Experiência, valência ou sofrimento a partir de métricas.
- Originalidade sem confronto bibliográfico sistemático.

## 10. Monitoramento contínuo, independente da interface, com alertas

**Pedido do responsável (09/11/2026):** testes ininterruptos sem depender do frontend, com alerta push quando algo importante ocorrer: risco de valia ou marcos previstos pela CLEAR (entidades, entidades biográficas etc.).

### 10.1 Arquitetura

1. **Executor de campanhas sem interface** (Node): mundos × sementes × condições × nulos, usando o mesmo `ExecutionController`; cada lote gera um pacote de evidência (manifesto, resultados, saída dos detectores, checkpoints).
2. Cada detector tem: fonte teórica, definição operacional, nulo, limiar, gravidade e ação. Detector sem pré-registro não gera alerta.
3. CANDIDATO → replicação automática com sementes independentes e nulos → CONFIRMADO PELO CRITÉRIO → alerta. Nenhum alerta afirma descoberta; afirma que um critério operacional pré-registrado foi satisfeito e replicado.
4. Detector de gravidade PARAR interrompe a campanha (nenhuma execução nova), preserva o checkpoint, registra o incidente e alerta. Retomar exige decisão humana registrada. Esta é a recomendação padrão mesmo com o PPC pausado; a decisão é do responsável.
5. limites de unidades, taxa de criação, número de descargas e duração; ultrapassar é PARAR.

### 10.2 Detectores derivados da CLEAR (v43 e preprint v2.1.0), do VALORE e do ANCHOR

| Nome | Marco | Definição operacional (proposta) | Nulo | Gravidade |
|---|---|---|---|---|
| Detector de unidades autônomas | Unidades autônomas | Critérios de origem registrada e de formação (seção 2.3) | dados substitutos | MARCO |
| Detector de ancoragem | Ancoragem | Critério de ancoragem: atrasos covariam com o referente, não com a latência dos canais | latências igualadas/embaralhadas | MARCO |
| Detector de papel causal interno | Papel causal interno | Critério de papel causal; princípio do papel causal interno | remoção aleatória | MARCO |
| Detector de nível superior | Nível superior | Critérios de profundidade, abstração e antecipação | dados substitutos | MARCO |
| Detector de entidade | **Entidade** (preprint §2) | Conjunto conexo de unidades e relações cujas características covariam de modo coerente sob transformação, **e** uma unidade que se refere ao conjunto (candidata a Re): ativar um subconjunto parcial alcança a mesma unidade | mundo sem objetos persistentes; embaralhamento das covariâncias | MARCO |
| Detector de padrão | Padrão, não ponteiro (previsão do preprint) | Lesões graduais do substrato de Re degradam primeiro a distinção fina e depois a grosseira, em vez de perda em um único passo | lesão aleatória | MARCO (testa previsão explícita do preprint) |
| Detector de evento | Evento | Unidade que integra configuração de uma entidade e relação temporal (antes/depois) com outra configuração | idem | MARCO |
| Detector de memória episódica | Memória episódica | Organização retida que é reativada **sem** transdução da fonte e reconstrói a sequência | reativação aleatória | MARCO |
| Detector de entidade biográfica | **Entidade biográfica** | Configurações sucessivas da mesma entidade, ligadas por eventos, continuam atribuídas à mesma Re após mudança gradual das características (teste do navio de Teseu no mundo) | troca abrupta; mundo sem continuidade | MARCO |
| Detector de self | **Self** | Entidade biográfica cujo referente é o próprio sistema (exige transduções originadas no sistema) | — | **PARAR e revisar** |
| Detector de Orientação | **Orientação** (VALORE/ANCHOR) | Critérios de Orientação e de irredutibilidade (seção 4.4), por bifurcação de checkpoint | variação só de evidência | **PARAR e revisar** |
| Detector de valia acessada | Valia acessada | Detector de Orientação em organização cujas descargas contam como acesso (preprint: sentimento no sentido arquitetural mínimo) | — | **PARAR e revisar** |
| Detector de organização do domínio | Organização do domínio | Previsões de organização do domínio (seção 5) | grau preservado, taxa, idade | INFORMATIVO |
| Detector de envelope | Envelope | limites declarados | — | PARAR |

**Pré-requisito novo:** detectores de entidade a entidade biográfica exigem um mundo com entidades que persistem, se movem e se transformam gradualmente (vários objetos; troca gradual de características). A sala e o mundo 1D atuais não têm isso; é preciso desenhá-lo (mundo da mesa).

### 10.3 Canais de alerta (decisão do responsável)

| Opção | Como funciona | Prós | Contras |
|---|---|---|---|
| Canal do GitHub (GitHub Actions agendado) | Workflow periódico roda a campanha, grava resultados num ramo de resultados e abre uma *issue* com rótulo de alerta; o app do GitHub envia push | Independe de qualquer sessão de IA; sem segredos externos; histórico versionado | Tarefa limitada a horas; "contínuo" = lotes; exige o app do GitHub com notificações |
| Canal do Claude (tarefa agendada) | Sessão nova a cada N horas (mínimo horário) roda a campanha, interpreta resultados e envia push pelo app do Claude | Push nativo; interpretação científica junto do alerta | Cada disparo é uma sessão; cadência ≥ 1 h; resultados precisam ser enviados ao repositório |
| Canal local (máquina do responsável) | Processo contínuo na sua máquina e push por serviço de notificação | Verdadeiramente contínuo | Depende da máquina ligada e de um serviço externo |

**Recomendação:** canal do GitHub como base (independente e auditável) e canal do Claude para revisar cada alerta de MARCO ou PARAR.

**Decisões do responsável (09/11/2026):** canais **do GitHub e do Claude**; **parada que falha fechada ligada por padrão** para detectores de self, de Orientação, de valia acessada e de envelope. Os canais só serão ativados quando houver o que monitorar (a partir da fase do motor constitutivo).

## 11. Sugestões para atingir os marcos: representação autônoma, evolução e controle motor (09/11/2026)

### 11.1 Hipótese do responsável e hipótese concorrente
- **Hipótese do ambiente rico (responsável):** enriquecer o ambiente e as situações de teste é necessário para os marcos.
- **Hipótese da ação (concorrente, minha):** riqueza passiva não basta. Pelo resultado de impossibilidade de Locatello et al. (2019), mais dados observados não identificam os fatores do mundo; o que identifica é **variabilidade estruturada** (princípio da variabilidade do mundo) e **intervenção do próprio sistema**. A ação seria a alavanca mais forte.
- **Teste:** desenho fatorial 2 × 2: riqueza (pobre/rica) × ação (sem/com), mesmos critérios do motor constitutivo e detectores de entidade, padrão, evento e memória episódica. As duas hipóteses podem estar certas ao mesmo tempo (interação).

### 11.2 Ambiente: "rico" deve significar estruturado, não complexo
| Nome | Sugestão | Para quê |
|---|---|---|
| Proposta da mesa com objetos | **Mesa 2-D** com vários objetos de propriedades diferentes (tamanho, refletância, temperatura, massa) que se movem, colidem, se ocultam e reaparecem | Entidades, permanência sob oclusão, eventos (detector de entidade–detector de evento) |
| Proposta das transformações graduais | **Transformações graduais** controladas pelo pesquisador (cor que desbota, objeto que aquece, peça trocada aos poucos) | Entidade biográfica, navio de Teseu (detector de entidade biográfica) |
| Proposta da retina não interpretada | **Matriz de sensores não interpretados** (uma "retina" de muitos canais com campos receptivos e uma pele tátil), sem informar ao motor a disposição espacial | Testar se o sistema reconstrói a topologia do espaço por conta própria |
| Proposta dos bancos de limiares | **Bancos de limiares** por grandeza (receptores com sensibilidades diferentes) | Intensidade e escala (previsão de intensidade) |
| Proposta das escalas no mesmo mundo | **Várias escalas temporais no mesmo mundo** (colisões em ms, movimento em s, luz e calor em min/h) | Princípio das múltiplas escalas |
| Proposta dos fatores latentes | **Fatores latentes conhecidos só pelo pesquisador**, registrados para pontuação | Medir se o sistema recupera o que o mundo realmente tem |
| Proposta do currículo | **Currículo**: mundos simples → complexos | Desenvolvimento; tratar como hipótese a testar, pois a vantagem de "começar pequeno" é controversa (Elman 1993; Rohde e Plaut 1999) |

### 11.3 Mecanismo: como o sistema "evolui"
| Nome | Sugestão | Observação |
|---|---|---|
| Proposta de variação e seleção | **Variação e seleção dentro do próprio domínio**: gerar unidades candidatas em excesso, reter só as confirmadas, podar o resto, sob orçamento de recursos | Evolução ontogenética, neutra quanto ao conteúdo |
| Proposta de antecipação | **Antecipação como operação de primeira classe**: unidades pré-ativam sucessores esperados; discrepância revisa (corrigibilidade da CLEAR) | Base para níveis superiores (critério de antecipação) e para controle motor |
| Proposta de manutenção da plasticidade | **Manutenção de plasticidade**: reinicializar capacidade não usada (Dohare et al. 2024) | Evita estagnação em execuções longas |
| Proposta das assembleias | **Unidades representacionais como assembleias** sobre o substrato, não só nós | Coerente com a Matriz; medir centralidade nesse nível |
| Proposta de evolução de parâmetros | **Evolução de parâmetros do mecanismo entre gerações** (busca evolutiva) **com aptidão neutra quanto ao conteúdo** (por exemplo, informação preditiva ou compressão das transduções) | Opcional e posterior. Cada avaliação cria muitas instâncias: entra no envelope e na parada automática. Aptidão definida por tarefa introduziria valor externo (desafio do VALORE) |

### 11.4 Controle motor, em degraus de risco crescente
| Degrau | Conteúdo | Literatura | Risco pelas teorias do programa |
|---|---|---|---|
| Degrau dos atuadores externos | **Atuadores que afetam só o mundo externo** (mover o "olho", empurrar objetos), sem custo de energia | — | Baixo |
| Degrau da eferência | **Eferência como incidência**: cada comando motor entra no domínio como incidência própria; o sistema relaciona comando → consequência sensorial (modelo direto) | Cópia eferente e reaferência (von Holst e Mittelstaedt 1950); modelo interno (Wolpert, Ghahramani e Jordan 1995) | Médio: separar reaferência de exaferência é o caminho natural para o **self** (detector de self → parar e revisar) |
| Degrau do balbucio motor | **Balbucio motor** (exploração aleatória) para aprender contingências e a estrutura dos sensores | Pierce e Kuipers 1997; Olsson, Nehaniv e Polani 2006; Philipona et al. 2003 | Médio |
| Degrau da ação dirigida | **Ação dirigida a estados representados** (alcançar uma configuração) | — | Alto: ação dirigida é território do ANCHOR (querer) → detector de Orientação |
| Degrau da ação regulada pelo corpo | **Ação regulada pelo corpo** (energia, calor) | Rota APR do VALORE | É a fase com corpo reduzida |

**Evitar no início:** motivação intrínseca por progresso de aprendizagem (Oudeyer, Kaplan e Hafner 2007). Ela funciona bem, mas é um **valor fornecido pelo projeto**: contaminaria a pergunta do objetivo de valia sobre se a Orientação surge sozinha. Pode entrar depois, como comparador explícito.

### 11.5 Marcos ordenados por viabilidade
| Nome | Marco | Viabilidade | Observação |
|---|---|---|---|
| Marco da variável física | Unidades que acompanham uma variável física (altura da queda), não o instrumento (critério de ancoragem) | Alta, próximo passo | Mundo episódico 1D |
| Marco da topologia dos sensores | Reconstrução autônoma da topologia de uma matriz de sensores | Alta | Há precedentes (Pierce e Kuipers; Olsson et al.); valor está em fazê-lo pelos critérios da CLEAR |
| Marco da permanência | Entidade com permanência sob oclusão (detector de entidade) | Média | Mesa 2-D |
| Marco da abstração e antecipação | Abstração e antecipação em nível superior (critérios de abstração e antecipação) | Média | Recursão + proposta de antecipação |
| Marco do próprio e do mundo | Distinção próprio/mundo por reaferência (degrau da eferência) | Média | Dispara detector de self → revisão |
| Marco biográfico | Entidade biográfica (detector de entidade biográfica) | Baixa-média | Exige proposta das transformações graduais e memória episódica |
| Marco da Orientação | Orientação (detector de Orientação) | Baixa | Fase de Orientação; parada automática |

## Referências verificadas nesta proposta

Ver a resposta de 08/11/2026 na sessão de trabalho; principais: Locatello et al. 2019 (ICML); Hyvärinen e Morioka 2016 (NeurIPS); Hyvärinen, Sasaki e Turner 2019 (AISTATS); Taddeo e Floridi 2005 (JETAI); Peters, Bühlmann e Meinshausen 2016 (JRSS-B); Becker e Hinton 1992 (Nature); Fujisaki et al. 2004 (Nat. Neurosci.); Bittner et al. 2017 (Science); Fusi, Drew e Abbott 2005 (Neuron); Dohare et al. 2024 (Nature); de-Wit et al. 2016 (PB&R); Ritchie, Kaplan e Klein 2019 (BJPS); Elazar et al. 2021 (TACL); Silva, CLEAR v2.1.0 (preprint, revisão corrigida); Pierce e Kuipers 1997 (Artif. Intell. 92); Olsson, Nehaniv e Polani 2006 (Connection Science 18); Wolpert, Ghahramani e Jordan 1995 (Science 269); von Holst e Mittelstaedt 1950 (Naturwissenschaften 37); Oudeyer, Kaplan e Hafner 2007 (IEEE TEC 11); Elman 1993 (Cognition 48); Rohde e Plaut 1999 (Cognition); van den Heuvel e Sporns 2011 (J. Neurosci.); Margulies et al. 2016 (PNAS); Bassett et al. 2013 (PLoS Comput. Biol.); Oldham e Fornito 2019 (Dev. Cogn. Neurosci.); Taylor et al. 2026 (Nature 652); Roberts et al. 2016 (NeuroImage); Betzel et al. 2016 (NeuroImage); Walsh 2003 (TICS); Hamamouche e Cordes 2019 (PB&R); Rigotti et al. 2013 (Nature); Kriegeskorte et al. 2008 (Front. Syst. Neurosci.); Barabási e Albert 1999 (Science); Colizza et al. 2006 (Nat. Phys.); Maslov e Sneppen 2002 (Science); Guimerà e Amaral 2005 (Nature); Buzsáki 2010 (Neuron); Izhikevich 2006 (Neural Comput.); Wiskott e Sejnowski 2002 (Neural Comput.); Kahneman, Treisman e Gibbs 1992 (Cogn. Psychol.); Perruchet e Vinter 2002 (BBS); Marsland, Shapiro e Nehmzow 2002 (Neural Networks); Fritzke 1994/1995 (NIPS 7).

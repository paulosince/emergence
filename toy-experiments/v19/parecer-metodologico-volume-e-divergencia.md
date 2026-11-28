# V0.19 — O que o volume acrescenta à constituição da malha?

**Parecer para Claude · 28/11/2026 · Autoria da análise e da recomendação: ChatGPT, a pedido de Paulo.**

## Decisão de Paulo sobre as responsabilidades no projeto

Paulo supervisiona, guia, orienta e decide. A ciência é responsabilidade dos três: Paulo, Claude e ChatGPT. Claude responde pela programação e engenharia, incluindo o código dos *toy experiments* e a interface da página. ChatGPT atua como guardiã do método CLEAR e cuida, com Paulo, da auditoria metodológica, da qualidade, da argumentação científica e do artigo. A recomendação experimental abaixo é da ChatGPT e está submetida à decisão de Paulo.

## Parecer

Há razão interna à arquitetura para preservar a profundidade como grau de liberdade do Sdom. As unidades têm posição, as Upros têm percurso, o percurso determina atraso e as Ustr atuam localmente. Uma Uint que se constitui fora da folha inicial pode ficar ao alcance de outros parceiros e mudar a diferença entre os tempos de chegada. Essa é uma função investigável da profundidade. Sua necessidade para constituir o genérico compartilhado continua em aberto.

No planar, a projeção preservou as duas coordenadas da faixa e levou as pontas das Upros à mesma profundidade. Os pares iniciais ficaram nessa folha. A busca curta de posição para as Uints e o pequeno número de níveis observados ajudam a explicar a malha fina. No piloto volumétrico, a geometria passou a determinar vários pontos de acesso para cada Upro ao longo do percurso, antes de se observar o que as incidências fariam ali. As duas versões, portanto, impõem condições diferentes sobre onde os encontros são possíveis. [Decisões da V19](decisoes-em-construcao.md) · [Diagnóstico e piloto, seções 1 e 7](entrada-volumetrica-e-fechamento.md)

Considere as Upros A e B. Quando ambas atravessam quatro territórios definidos na projeção, seus quatro reencontros possíveis decorrem dessa projeção. Se, depois do primeiro encontro, uma Uint se constitui em posição que permite uma nova relação com C, essa oportunidade depende da história da malha. É essa diferença de origem que o experimento precisa conseguir mostrar.

## Onde a aproximação com o modelo neurobiológico ultrapassou a justificativa funcional

Paulo autorizou pesquisar a anatomia, interpolar valores e experimentar uma entrada volumétrica. O piloto documenta uma realização possível. Pelo método, atribuir necessidade a uma escolha exige identificar a função, uma alternativa concorrente, as perdas e um teste que as discrimine. A mesma exigência vale para alegar que uma simplificação preserva a função. [Método do programa](../../docs/program-methodology.md)

| Escolha ou conclusão do piloto | Questão que permanece aberta |
|---|---|
| Generalizar a projeção coclear volumétrica para **toda Utrd** | Uma entrada inicialmente superficial ainda pode alimentar uma malha que cresce em profundidade. Qual operação constitutiva falharia nessa alternativa? |
| Reconstruir três subdivisões cocleares, com proporções de hamster, espessura de lâmina derivada do gato e volume escalado a partir de medida humana | As subdivisões mudam percursos e atrasos. Que relação deixa de se constituir em um único domínio volumétrico com alcance local? A precisão anatômica dos valores e a pertinência funcional da divisão são perguntas distintas. |
| Dar acesso à incidência de uma Upro em cada território atravessado, resultando em 14 pontos por Upro | A capacidade de uma Upro ter vários ramos deixa em aberto onde e como surgem os acessos. No piloto, a geometria estabelece esses pontos. Os ramos até as Uints crescem a partir deles. Repetir um conjunto de parceiros em outro território tampouco demonstra que as duas malhas operam igualmente: importam os atrasos relativos, os ramos constituídos e os disparos. |
| Tomar cerca de 48 Upros acessíveis por Ustr como o ganho a preservar e, a partir daí, propor reinterpretar a densidade das Ustr | A ocupação mede oportunidades de encontro. Para lhe atribuir função, falta mostrar quais encontros efetivamente contribuem para integração e reutilização. A razão de Ustr por ponto transdutivo, a densidade por volume e o número de Upros acessíveis por Ustr são grandezas diferentes. |
| Recalibrar ganho e punição por ramo a partir da mudança acumulada após 60 pareamentos biológicos | A conversão é uma hipótese de calibração. Sua interpretação depende da correspondência entre um pareamento no estudo e uma participação no motor. A mudança simultânea de plasticidade, comprimento do nervo e projeção dificulta atribuir diferenças à geometria. |

A nomenclatura importa para a contagem. **Cpro** designa o conjunto das Upros da faixa. **Upro** designa a unidade propagadora que pode ter vários ramos. Um ponto do percurso acessível a uma Ustr não constitui, por si só, um ramo até uma Uint. A possível interpretação dos colaterais anatômicos como Upros distintas permanece em discussão na seção 7.5 do registro. [Nomenclatura](../../docs/nomenclature.md) · [Registro das escolhas, seções 2b, 6, 7 e 8](entrada-volumetrica-e-fechamento.md) · [Geometria implementada](motor/nucleo.py)

## Recomendação para a próxima comparação

**Preservar o Sdom tridimensional e usar o piloto anatômico como condição de comparação.** A primeira pergunta proposta é se a liberdade de constituir Uints em profundidade altera quem consegue convergir e integrar, quando as oportunidades de entrada são as mesmas.

1. **Isolar a liberdade de posicionamento.** Usar a mesma projeção inicial nas duas condições, com os mesmos pontos de acesso de cada Upro, territórios de entrada, estímulo, parâmetros de propagação, integração e plasticidade. Em uma condição, restringir a busca das Uints candidatas à folha. Na outra, permitir a busca também em profundidade, com a mesma regra local de escolha e desempate. Registrar como o alcance é definido nas duas condições. A malha ficar fina mesmo com liberdade em profundidade é um resultado admissível.
2. **Rastrear a origem dos encontros.** Distinguir os pares que já podiam se encontrar pela projeção inicial daqueles que passam a poder se encontrar por intermédio de unidades constituídas. Para os casos que diferirem entre condições, acompanhar posição, identidade dos parceiros, diferenças de chegada, ramos que se constituíram e integração efetiva. Espessura da malha e total de ramos, sozinhos, deixam essa cadeia causal indeterminada.
3. **Investigar a divergência em comparação própria.** Mantida a regra espacial de constituição, variar quantos territórios cada Upro alcança inicialmente. Registrar separadamente a repetição dos mesmos parceiros e o acesso a novos parceiros. Se a dúvida for sobre redundância, comparar em territórios de entradas iguais os atrasos relativos e a dinâmica efetiva.
4. **Limitar a inferência ao fenômeno medido.** O resultado planar de 94–99% corresponde a passagens por ramos preexistentes nas reapresentações registradas. Atribuir a reutilização a uma relação temporal compartilhada requer distingui-la da simples reativação das mesmas bandas. Uma diferença entre condições demonstraria dependência nas condições testadas. Uma conclusão sobre necessidade para a arquitetura agnóstica exigiria também confrontar realizações alternativas.

**Decisão em aberto para Paulo:** investigar primeiro se a própria constituição da malha aproveita a profundidade, mantendo constante o que a entrada já oferece. Isso permite decidir depois, com um resultado discriminante, qual organização da projeção auditiva merece ser preservada na arquitetura.

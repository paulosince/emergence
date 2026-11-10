# Limites do domínio representacional (Sdom) — texto-guia do responsável

Recebido em 10/11/2026 (16h45) como guia para a revisão da arquitetura. Texto do responsável, reproduzido sem alterações abaixo da linha. **Não é texto canônico da CLEAR** (o próprio texto diz "para avaliação"); serve de guia.

**Precedência (responsável, 10/11/2026, 17h00):** o texto abaixo foi feito pelo ChatGPT a partir das anotações do responsável e pode ter interpretado algo mal. **O que o responsável diz diretamente prevalece** sobre este texto. Correções já feitas: ver [revisão da arquitetura](architecture-review-v0.md), seção 0, "Definições diretas do responsável".

---

CLEAR — Os limites do domínio representacional (Sdom)

1. O problema fundamental: onde começa e onde termina um domínio representacional?

Uma das consequências mais importantes da evolução recente da CLEAR é que os limites de um domínio representacional não podem ser determinados antecipadamente pelos limites anatômicos, celulares ou mesmo pelos limites convencionais de um sistema nervoso.

Isso não significa, entretanto, que qualquer estrutura que participe do funcionamento de um organismo pertença ao seu domínio representacional.

A distinção é fundamental.

O cérebro, por exemplo, contém neurônios, astrócitos, oligodendrócitos, micróglia, vasos sanguíneos, moléculas sinalizadoras e inúmeras outras estruturas que participam de sua organização e funcionamento. Algumas transmitem sinais, outras regulam a transmissão, outras modificam as condições metabólicas e outras participam da manutenção e reorganização das estruturas.

Nenhuma dessas funções, isoladamente, demonstra que a estrutura que a realiza seja constitutiva de um domínio representacional.

Por outro lado, também não existe fundamento, na arquitetura abstrata da CLEAR, para excluir uma estrutura simplesmente porque ela não é um neurônio.

A questão correta deixa de ser:

Quais estruturas biológicas são capazes de representar?

E passa a ser:

Quais organizações efetivamente constituem representações e quais estruturas participam dessa constituição?

Essa mudança permite investigar a participação das células gliais, do sistema nervoso entérico e até do sistema imunológico sem presumir que sejam representacionais, mas também sem excluí-los por definição.

Para estabelecer esses limites, precisamos partir daquilo que a CLEAR entende por representação.

2. A tríade constitutiva da representação

Na formulação mais recente que recuperamos, a representação não é definida por uma unidade anatômica, um padrão de atividade isolado, um sinal informativo ou uma estrutura que um observador externo consiga interpretar.

Ela exige a realização conjunta de três condições constitutivas:

1. Organização especificadora de conteúdo

Diferenciação, integração e organização efetiva de relações

2. Fundamentação transdutiva

Vinculação efetiva entre a organização e aquilo a que ela se refere

3. Determinação autônoma

Constituição das diferenciações e relações pelo próprio sistema

Representação constituída em Sdom

2.1. Organização especificadora de conteúdo

Uma representação precisa possuir uma organização efetiva que especifique aquilo que representa.

Considere um sistema exposto a diferenças de intensidade luminosa.

Um sensor pode produzir uma variação elétrica proporcional à intensidade da luz. Essa correspondência, por si só, não constitui uma representação de luminosidade.

É necessário que as diferenças aferidas participem da constituição de uma organização capaz de diferenciá-las e estabelecer relações entre elas.

Por exemplo, o sistema pode constituir distinções entre intensidades, relações de precedência entre ocorrências ou regularidades de variação.

Essas relações precisam existir operacionalmente, e não apenas como valores armazenados acompanhados de rótulos que um programador interpreta.

Aqui reside uma distinção central:

Uma diferença física que transporta informação não é necessariamente uma diferença representada.

A organização especificadora deve determinar diferenças de conteúdo para o próprio sistema.

Isso não exige linguagem, símbolos convencionais, conceitos humanos ou reconhecimento consciente no sentido psicológico habitual.

Também não exige que toda representação seja uma unidade discreta ou previamente individualizada. A revisão recente da CLEAR abandonou a exigência de uma UR como unidade arquitetural universal.

2.2. Fundamentação transdutiva

Uma organização não se torna representação simplesmente porque apresenta uma estrutura semelhante à de algum fenômeno.

É preciso estabelecer como suas diferenças se vinculam efetivamente àquilo que representam.

Na CLEAR, essa vinculação é fundamentada transdutivamente.

A transdução permite que diferenças de um domínio físico sejam convertidas em incidências que participam da organização de Sdom.

Entretanto, transdução não é sinônimo de representação.

Um receptor pode transformar pressão em uma alteração elétrica. Uma molécula pode desencadear uma cascata de sinalização. Um sensor pode converter temperatura em frequência.

Esses processos estabelecem possibilidades de vinculação, mas não demonstram, isoladamente, que o sistema constituiu representações de pressão, moléculas ou temperatura.

A fundamentação precisa participar das condições que tornam o conteúdo determinado e passível de correção por diferenças provenientes do referente.

O referente pode estar fora do organismo, dentro do organismo mas fora de Sdom, ou ser uma organização já constituída em Sdom que se torna objeto de novas relações representacionais.

Nesse último caso, a possibilidade de representações derivadas não elimina a necessidade de uma fundamentação que não seja circular.

2.3. Determinação autônoma

O terceiro requisito impede que confundamos a interpretação realizada por um observador com uma representação constituída pelo sistema.

Imagine que um pesquisador atribua os seguintes significados a três estados elétricos:

* Estado A: presença de alimento.
* Estado B: ausência de alimento.
* Estado C: aproximação do alimento.

Se essas associações existem somente na descrição do pesquisador ou em uma tabela de interpretação externa, não demonstramos que o sistema representa alimento, ausência ou aproximação.

Para a CLEAR, a organização precisa constituir suas próprias diferenciações e relações, mediante suas operações efetivas.

Isso não significa que o sistema precise criar espontaneamente seus componentes físicos, suas leis de funcionamento ou todos os mecanismos que tornam a representação possível.

Autonomia constitutiva não equivale a independência física absoluta.

Significa que a determinação do conteúdo não pode depender exclusivamente de uma atribuição semântica externa.

Esse requisito será especialmente importante quando examinarmos sistemas imunológicos e gliais, porque ambos apresentam diferenciação, adaptação e memória funcional, mas essas propriedades não demonstram automaticamente determinação representacional autônoma.

3. O que constitui o limite de Sdom?

A fronteira de Sdom é funcional e constitutiva, não uma membrana física nem uma delimitação anatômica.

É necessário distinguir pelo menos quatro situações.

Situação	Relação com Sdom
Estrutura que constitui diretamente a organização representacional	Integra Sdom enquanto participa dessa constituição
Estrutura que fornece diferenças transduzidas	Pode permanecer fora de Sdom como fonte aferente
Estrutura que regula as condições de funcionamento	Não integra necessariamente Sdom
Organização que constitui representações próprias	Pode caracterizar outro Sdom, cuja relação com o primeiro precisa ser investigada

Essa classificação é conceitual. Ainda precisamos demonstrar critérios operacionais suficientemente precisos para distinguir as situações em sistemas biológicos concretos.

A fronteira não coincide necessariamente com a origem da informação

Considere um receptor sensorial periférico que converte pressão em sinais transmitidos ao sistema nervoso central.

O receptor pode fornecer a fundamentação transdutiva necessária para determinada representação sem integrar a organização que especifica seu conteúdo.

Da mesma maneira, uma estrutura externa pode modificar as condições de funcionamento de Sdom sem se tornar parte dele.

Mas existe uma possibilidade adicional: a própria organização transdutora pode participar da especificação do conteúdo, em vez de simplesmente fornecer aferências.

Nesse caso, não podemos excluí-la antecipadamente.

O ponto decisivo é identificar onde e por quais operações as diferenças são constituídas como conteúdo representacional, e não simplesmente por onde passam os sinais.

A fronteira também não coincide com toda a cadeia de dependências

Se uma representação depende de oxigenação, circulação sanguínea, metabolismo energético e temperatura adequada, isso não torna automaticamente o sistema circulatório, os pulmões ou os mecanismos de termorregulação partes de Sdom.

A dependência funcional é mais ampla que a participação constitutiva.

Para uma estrutura integrar Sdom, precisamos demonstrar algo mais específico: sua atividade deve participar das operações pelas quais o domínio determina e organiza conteúdo representacional.

A dificuldade científica é distinguir essa participação constitutiva de uma condição que apenas possibilita, sustenta ou modifica tais operações.

Isso impede duas conclusões igualmente precipitadas:

* Considerar que toda estrutura necessária ao funcionamento de Sdom pertence a ele.
* Considerar que somente estruturas que tradicionalmente chamamos de neurais podem integrá-lo.

4. A formação inicial de Sdom: o problema da não circularidade

Este é um dos pontos mais delicados da CLEAR.

Se afirmamos que uma representação exige determinação autônoma por Sdom, mas também que Sdom somente existe quando há organização representacional, encontramos uma circularidade aparente:

* Para existir representação, precisamos de Sdom.
* Para existir Sdom, precisamos de representação.

A solução não pode ser simplesmente pressupor um domínio representacional rudimentar. Isso transferiria o problema para uma etapa anterior.

A distinção necessária é entre os mecanismos capazes de constituir um domínio representacional e o domínio representacional já constituído.

4.1. Antes da primeira representação

Consideremos um sistema físico inicial , ainda não representacional.

Ele pode possuir receptores, mecanismos de transdução, elementos integradores, propriedades de persistência e regras físicas de reorganização.

Nada disso precisa representar alguma coisa.

Uma diferença ambiental pode produzir uma alteração em um transdutor. Essa alteração pode alcançar componentes internos. As propriedades desses componentes podem produzir diferenciações, integrações e modificações persistentes.

O processo de constituição, que anteriormente identificamos por Pcrt, deve poder operar sem depender de representações preexistentes.

Sistema físico inicial

Sem domínio representacional constituído

Diferenças físicas e transdução

Incidências e processos constitutivos

Diferenciação, integração, persistência e reorganização

Organização funcional emergente

Ainda não necessariamente representacional

Primeira satisfação conjunta da tríade

Organização especificadora + fundamentação transdutiva + determinação autônoma

Constituição inicial de Sdom

O diagrama representa uma sequência lógica candidata, não uma sequência temporal já demonstrada experimentalmente.

Na formulação arquitetural anterior, a primeira organização UI–UT marcava o nascimento de Sdom. Com a revisão da tríade, precisamos ser mais rigorosos: uma organização UI–UT pode ser necessária para uma implementação específica sem que sua simples existência seja suficiente para constituir Sdom.

A primeira organização representacional deve satisfazer a tríade. Antes disso, podemos ter uma organização precursora.

4.2. A autonomia não pode ser exigida antes de sua própria constituição

Existe uma distinção entre autonomia constitutiva e autonomia operacional de um domínio já estabelecido.

Os mecanismos físicos iniciais não precisam ser autônomos no mesmo sentido em que o domínio representacional constituído o será.

Eles precisam permitir que surja uma organização cuja determinação de conteúdo seja realizada internamente, sem que esse conteúdo já esteja fornecido por uma representação anterior ou por uma interpretação externa.

Isso preserva a possibilidade de formação inicial sem circularidade.

Entretanto, ainda há uma dificuldade importante: a formação espontânea de uma organização diferenciada não demonstra que ela passou a representar.

Precisamos estabelecer em que momento a diferenciação física adquire especificação de conteúdo, fundamentação e determinação autônoma.

Sem esse critério, a solução apenas deslocaria a circularidade para a definição de organização representacional.

4.3. A fronteira inicial não precisa ser a fronteira definitiva

Outra consequência é que Sdom não precisa nascer com todos os seus componentes futuros.

Ele pode constituir-se inicialmente sobre uma organização pequena e, posteriormente, incorporar novas unidades, relações e mecanismos.

Mas essa incorporação precisa ser examinada.

Uma estrutura pode passar a participar da constituição de conteúdo sem que isso implique que ela tenha pertencido a Sdom desde o início.

Inversamente, uma estrutura anteriormente constitutiva pode perder essa função.

Portanto, a fronteira pode ser historicamente variável.

Isso não significa que toda mudança de conectividade altere os limites de Sdom. A alteração precisa atingir as operações constitutivas de conteúdo.

5. Células gliais: componentes de Sdom, reguladoras ou domínios próprios?

Nossa investigação anterior sobre astrócitos encontrou uma dificuldade recorrente: demonstrar participação ativa no processamento neural não é o mesmo que demonstrar constituição representacional.

A literatura documenta sinalização intracelular por cálcio, integração de múltiplas entradas sinápticas, regulação da transmissão e participação em plasticidade. PubMed +1

Esses resultados tornam inadequado tratar os astrócitos como elementos meramente passivos.

Mas não resolvem a questão que interessa à CLEAR.

Podemos distinguir três hipóteses.

Hipótese G1 — Regulação externa a Sdom

Os astrócitos modificam condições sob as quais as organizações neuronais constituem e realizam representações.

Por exemplo, alterações astrogliais podem modificar a disponibilidade de neurotransmissores, a excitabilidade local ou a probabilidade de transmissão sináptica.

Nessa hipótese, os astrócitos podem ser indispensáveis para o funcionamento normal de determinado circuito, mas não necessariamente participam da especificação de conteúdo.

A organização representacional continua sendo constituída em outro conjunto de componentes.

Hipótese G2 — Participação constitutiva em um Sdom compartilhado

Aqui, a atividade astroglial não se limita a regular o funcionamento neuronal.

Considere um astrócito que recebe diferenças de múltiplas regiões sinápticas, integra essas diferenças segundo sua organização espacial e temporal e produz respostas diferenciadas que participam da constituição de relações representacionais.

Se essas operações forem parte da própria especificação de conteúdo, não apenas de sua regulação, teremos uma possibilidade de integração glioneuronal em Sdom.

A fronteira funcional atravessaria diferentes tipos celulares.

Isso é compatível com a arquitetura abstrata da CLEAR, mas sua ocorrência precisa ser demonstrada.

Hipótese G3 — Domínio representacional glial próprio

A hipótese mais forte seria a existência de uma organização glial que satisfizesse independentemente a tríade.

Ela precisaria constituir diferenciações e relações próprias, fundamentadas transdutivamente, com determinação autônoma de conteúdo.

O fato de ondas de cálcio se propagarem, apresentarem organização espacial ou persistirem não basta para demonstrar isso.

A investigação astroglial anterior, que examinou nove critérios, não estabeleceu representação própria, um segundo Sdom ou metarrepresentação.

Conclusão provisória: a CLEAR admite G1, G2 e G3 como possibilidades conceituais, mas a evidência discutida até agora não permite selecionar G2 ou G3 como fatos demonstrados.

6. O sistema nervoso entérico: um domínio separado ou parte de um domínio mais amplo?

O sistema nervoso entérico introduz uma dificuldade diferente.

Ele possui circuitos capazes de realizar operações locais, integrar sinais e organizar respostas motoras e secretórias sem depender de comandos contínuos do sistema nervoso central.

Mas autonomia fisiológica não equivale necessariamente à autonomia representacional exigida pela CLEAR.

Precisamos distinguir três possibilidades.

E1 — Sistema funcional não representacional

O sistema entérico pode executar transformações aferentes e respostas organizadas sem constituir conteúdo representacional no sentido da tríade.

Reflexos complexos, integração local e adaptação não são demonstrações suficientes de representação.

E2 — Sdom entérico próprio

É possível investigar se certas organizações entéricas constituem representações próprias de condições internas, sequências temporais ou relações entre eventos fisiológicos.

O referente pode estar no próprio organismo, desde que seja distinguível do domínio que o representa.

Isso é importante: a CLEAR não exige que o referente seja externo ao corpo, mas que a relação entre referente e representação não seja estabelecida circularmente.

Se o sistema entérico constituir conteúdo próprio e satisfizer a tríade, poderíamos reconhecer um Sdom entérico.

E3 — Participação em um Sdom distribuído

A terceira hipótese é que organizações entéricas e centrais participem de um domínio representacional mais abrangente.

Entretanto, a comunicação entre ambos não demonstra que pertençam ao mesmo domínio.

O sistema nervoso central pode representar condições entéricas por meio de aferências provenientes de um sistema funcionalmente distinto.

Mesmo que o sistema entérico possua representações próprias, isso não significa que elas sejam automaticamente compartilhadas com o sistema central.

Para demonstrar um Sdom comum, precisaríamos identificar operações constitutivas de conteúdo que atravessassem ambos.

A mera transmissão de sinais entre eles seria insuficiente.

7. O sistema imunológico: diferenciação, memória e representação

O sistema imunológico talvez seja o caso que mais exige cuidado conceitual.

Ele apresenta reconhecimento molecular, discriminação de condições, memória imunológica, respostas diferenciadas e alterações persistentes decorrentes de exposições anteriores.

Essas propriedades são biologicamente relevantes, mas não devemos converter automaticamente o vocabulário de reconhecimento imunológico em representação no sentido da CLEAR.

I1 — Discriminação molecular sem representação

Uma célula imunológica pode responder diferentemente à presença de determinadas moléculas.

Um receptor molecular pode apresentar seletividade extremamente elevada.

Essa seletividade, contudo, pode ser explicada inteiramente pelas propriedades físico-químicas das interações.

A existência de uma correspondência seletiva entre molécula e resposta não demonstra que a célula constituiu uma representação daquela molécula.

I2 — Organização imunológica representacional

Uma hipótese mais forte seria que determinadas organizações imunológicas constituíssem relações próprias entre ocorrências, persistências, diferenças e regularidades.

Nesse caso, precisaríamos identificar:

* Qual organização especifica o conteúdo.
* Qual referente fundamenta transdutivamente esse conteúdo.
* Quais operações constituem autonomamente as diferenciações e relações.
* Como distinguir a representação de uma simples alteração persistente da resposta imunológica.

A memória imunológica, isoladamente, não resolve essas questões.

Persistência de uma modificação não é necessariamente persistência de uma representação.

I3 — Participação imunológica em Sdom neural

Existe ainda a possibilidade de estruturas imunológicas participarem das condições de constituição ou reorganização de representações neurais.

Mas, novamente, devemos separar regulação de participação constitutiva.

Uma célula imunológica pode modificar a organização de um circuito neural sem integrar o domínio representacional constituído por esse circuito.

Por outro lado, se suas operações integrarem a própria especificação de conteúdo, sua exclusão antecipada seria injustificada.

O desafio da CLEAR não é demonstrar que o sistema imunológico representa. É determinar quais evidências seriam necessárias para reconhecer ou rejeitar essa possibilidade.

8. Um problema ainda mais profundo: como distinguir um Sdom de vários?

As três investigações anteriores revelam uma dificuldade comum.

Mesmo que encontremos duas organizações que satisfaçam a tríade, não poderemos concluir imediatamente que elas pertencem ao mesmo domínio representacional.

Considere duas organizações, A e B.

Cada uma constitui suas próprias diferenciações e relações, com fundamentação transdutiva e determinação autônoma.

Elas também trocam sinais.

Existem pelo menos três interpretações possíveis:

Domínios separados

Comunicação sem constituição compartilhada

Domínio compartilhado

Operações constitutivas atravessam A e B

Sistema composto por múltiplos Sdom

Coexistência e coordenação sem fusão representacional

A terceira interpretação é especialmente importante: um organismo pode conter múltiplos domínios representacionais sem que exista necessariamente um domínio único que englobe todos eles.

Também não podemos inferir que a integração fisiológica entre dois sistemas implique integração de seus conteúdos representacionais.

O teste da fronteira

Uma proposta de investigação seria examinar se a separação entre A e B preserva duas organizações representacionais distintas ou se destrói operações constitutivas de conteúdo que dependem de ambas.

Mas esse teste exige cuidado.

Se interrompermos a comunicação entre duas estruturas e uma delas deixar de funcionar, isso pode ocorrer porque perdeu energia, regulação, aferência ou condições de estabilidade.

Não demonstra, por si só, que ambas constituíam um único Sdom.

Precisaríamos identificar quais relações de conteúdo deixaram de ser constituídas, e não apenas quais funções foram prejudicadas.

9. Uma matriz para investigar os limites de Sdom

A partir da tríade, podemos organizar os candidatos sem pressupor suas conclusões.

Candidato	Organização diferenciadora	Fundamentação transdutiva	Determinação representacional autônoma	Estatuto na CLEAR
Circuitos neuronais	Candidata	Candidata	A demonstrar segundo a tríade	Candidatos principais
Redes astrogliais	Evidências de diferenciação e integração	Vias de sinalização identificáveis	Não demonstrada como representação	Em aberto
Sistema nervoso entérico	Circuitos locais organizados	Aferências viscerais	A demonstrar	Em aberto
Sistema imunológico	Discriminação e memória funcional	Reconhecimento molecular	A demonstrar	Em aberto
Sistema glioneuronal integrado	Organização conjunta possível	Múltiplas vias aferentes	A demonstrar	Em aberto

A tabela não afirma que os circuitos neuronais já satisfazem empiricamente todos os requisitos da CLEAR. Tampouco equipara a força das evidências disponíveis para os diferentes sistemas.

Ela indica o que precisa ser investigado.

10. O problema da individuação do domínio

Há ainda uma questão que considero não resolvida pelas formulações recuperadas.

A tríade estabelece condições para a constituição de representações, mas não está demonstrado que, sozinha, seja suficiente para individuar os limites de um domínio representacional inteiro.

Essa diferença é importante.

Podemos reconhecer organizações que constituem representações sem saber se pertencem ao mesmo Sdom.

Duas representações podem compartilhar transdutores, mecanismos de regulação, componentes físicos e até relações operacionais, sem que isso determine automaticamente a identidade de seu domínio.

Precisamos distinguir:

* A constituição de uma representação.
* A pertença dessa representação a determinado Sdom.
* A individuação de um Sdom em relação a outro.
* A possibilidade de integração, separação ou reorganização de domínios.

A questão torna-se particularmente relevante quando consideramos um organismo com múltiplos sistemas de sinalização, processamento e adaptação.

Não basta demonstrar que todos participam do funcionamento do organismo. Também não basta encontrar conexões entre eles.

É necessário determinar se suas organizações constituem conteúdos em um mesmo domínio ou se constituem conteúdos distintos, eventualmente relacionados por novas transduções.

11. Implicações para a consciência na CLEAR

A revisão recente da CLEAR também exige que não confundamos constituição representacional com acesso.

Uma representação constituída pode persistir sem estar sendo efetivamente realizada em uma trajetória atual de acesso.

A formulação mais recente abandonou a exigência de percurso completo de uma UR e passou a tratar o acesso como realização efetiva de conteúdo representacional na dinâmica presente de Sdom.

Consequentemente, identificar a existência de uma representação e identificar sua ocorrência consciente são problemas relacionados, mas distintos.

Isso tem implicações importantes para os candidatos biológicos examinados.

Mesmo que demonstrássemos a existência de um Sdom entérico ou imunológico, ainda precisaríamos investigar suas ocorrências de acesso segundo os critérios da CLEAR.

Não seria legítimo concluir que o organismo possui uma consciência única abrangendo todos esses domínios.

Também não seria legítimo concluir, sem investigação, que um domínio representacional próprio é apenas uma extensão inconsciente do domínio cerebral.

A identidade proposta pela CLEAR entre acesso representacional efetivo e ocorrência consciente torna essas possibilidades especialmente relevantes, mas a teoria não fornece, por si só, evidência empírica de consciência em células gliais, circuitos entéricos ou sistemas imunológicos.

12. Formulação consolidada proposta

A partir das discussões recuperadas, proponho a seguinte formulação para avaliação, sem tratá-la ainda como texto canônico:

Na CLEAR, um domínio representacional (Sdom) é uma organização funcional historicamente constituída na qual diferenças e relações adquirem conteúdo representacional mediante a satisfação conjunta de três condições: organização especificadora de conteúdo, fundamentação transdutiva e determinação autônoma.Seus limites não são definidos pela anatomia, pelo tipo celular, pela continuidade física ou pela totalidade das estruturas necessárias à sua manutenção. São determinados pela extensão da organização que efetivamente participa da constituição de conteúdo representacional.Estruturas que fornecem aferências, energia, regulação ou condições de funcionamento não integram necessariamente Sdom. Sua inclusão exige demonstrar participação constitutiva nas operações que especificam e determinam conteúdo.O domínio não precisa preexistir às primeiras representações. Mecanismos físicos não representacionais podem produzir organizações precursoras que, ao satisfazerem inicialmente a tríade, constituem o primeiro Sdom. A constituição inicial não pode pressupor representações, objetivos, valores ou relações semânticas previamente disponíveis.Um organismo pode, em princípio, conter um ou múltiplos domínios representacionais, inclusive organizações que atravessem diferentes tipos celulares ou sistemas fisiológicos. A existência de comunicação, regulação recíproca ou dependência funcional entre estruturas não demonstra, isoladamente, pertença ao mesmo domínio.Assim, células gliais, sistemas nervosos periféricos e organizações imunológicas não são incluídos nem excluídos antecipadamente. Sua classificação depende da demonstração de que constituem representações próprias, participam da constituição de representações compartilhadas ou apenas fornecem condições para a atividade representacional de outros sistemas.

13. As questões que permanecem abertas

Vejo três problemas que merecem investigação específica antes de consolidarmos essa formulação.

Primeiro: o critério constitutivo de pertença. Precisamos determinar como distinguir operacionalmente uma estrutura que participa da especificação de conteúdo de outra que apenas altera as condições em que essa especificação ocorre. A distinção verbal é clara, mas ainda não temos um teste geral demonstrado.

Segundo: a individuação de Sdom. Mesmo com a tríade satisfeita, precisamos demonstrar o que torna duas organizações partes de um domínio, em vez de dois domínios que se comunicam. Esse problema não deve ser resolvido simplesmente pela conectividade ou pela dependência mútua.

Terceiro: o primeiro conteúdo. A formação não circular de Sdom exige mais do que produzir organização a partir de processos físicos. Precisamos demonstrar quando e por que essa organização passa a especificar algo como conteúdo, sem pressupor a representação que pretendemos explicar.

Este último problema conecta diretamente a investigação dos limites de Sdom aos experimentos de constituição autônoma que estamos desenvolvendo.

Minha avaliação é que a tríade fornece um fundamento para investigar a pertença a Sdom, mas ainda não demonstra, por si só, um critério necessário e suficiente para individuar suas fronteiras. Essa é uma lacuna teórica concreta, não uma razão para abandonar a definição funcional.

A consequência mais importante é que não devemos decidir antecipadamente se o domínio representacional humano termina nos neurônios, no encéfalo, no sistema nervoso ou em alguma fronteira mais ampla. Precisamos derivar essa fronteira das operações constitutivas efetivamente demonstradas.

Nota de fundamentação: a exposição conceitual recupera nossas formulações anteriores da CLEAR e acrescenta distinções analíticas explicitamente propostas aqui. A consulta bibliográfica pontual sobre astrócitos foi usada apenas para contextualização empírica, não para importar uma solução externa à arquitetura. Não foi realizada uma revisão bibliográfica abrangente dos sistemas entérico e imunológico.
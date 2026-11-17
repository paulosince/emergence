# V0.17 — Correções das dissonâncias não justificadas (propostas)

**Pedido do responsável (17/11/2026):** toda dissonância não justificada deve ser refeita respeitando o método sobre o mecanismo NB; propor correções e perguntar onde houver dúvida sobre o impacto no modelo geral.
**Base:** [levantamento das dissonâncias](dissonancias-nb.md). **Redação:** assistente (Claude). **Estatuto:** PROPOSTAS; nada aprovado.
**Método aplicado a cada uma:** (1) mecanismo NB, com fonte e nível de leitura; (2) mínimo funcional; (3) abstração agnóstica; (4) perdas declaradas; (5) dúvida sobre o impacto no modelo geral.
**Classificação:** justificadas (ficam): **4** (sem atividade antes do mundo, decisão de escopo) e **10** (sem segundo nível, decisão de escopo). Em investigação (não se corrige agora): **5** (o que o mundo seleciona). Não justificadas (corrigir): **1, 2, 3, 6, 7, 8, 9**.

---

## Correção 1 — da soma fixa para um recurso local que se esgota e se repõe
1. **NB:** sinapses vizinhas competem por um estoque local de receptores que circula em segundos a minutos; isso produz normalização **aproximada**, não exata (Triesch, Vo e Hafner 2018, modelo; resumo e trechos). Cada sinapse tem um teto; não há lei de soma exata (investigação da divisão da força).
2. **Mínimo:** fortalecer consome um recurso local finito; o recurso volta com o tempo.
3. **Abstração:** cada lado de cada Uint tem um **recurso** R (começa cheio). Um acerto fortalece o ramo na proporção do recurso disponível (ganho × R/R_cheio) e consome o que deu. R se repõe com uma constante de tempo. Cada ramo tem teto de 1,0. **Não há soma imposta.**
4. **Perdas:** a biologia distingue receptores, sítios de ancoragem e recursos pré-sinápticos; aqui é um número só.
5. **Dúvida (pergunta 1):** não há número biológico para o tamanho de R nem para o tempo de reposição; os de Triesch são de modelo. Impacto no modelo geral: o recurso vira uma propriedade de **todo** lado de **toda** Uint, em qualquer sentido (som, visão...).

## Correção 2 — da divisão para a eliminação competitiva
1. **NB:** no desenvolvimento, perdedores são **retirados**. No cálice de Held, cada célula começa com ~9 entradas e fica com 1 em ~3 dias, em dois terços das células (Holcomb et al. 2013; integral via extração). A poda depende de atividade.
2. **Mínimo:** uma entrada muito mais fraca que a vencedora, por tempo suficiente, sai.
3. **Abstração:** num mesmo lado de uma Uint, um ramo cuja força fique abaixo de uma **fração** da força do ramo mais forte desse lado, por um **tempo** contínuo, é retirado (não estável, claro). A poda por desuso continua.
4. **Perdas:** o mecanismo molecular da eliminação (sinais de punição, micróglia) não é modelado.
5. **Dúvida (pergunta 2):** a fração e o tempo não têm número biológico direto; os 3 dias do cálice precisam ser comprimidos como o resto do tempo do ensaio. Impacto geral: introduz competição **relativa** (depende do vencedor) em todo lugar da malha.

## Correção 3 — sobreposição de exuberância e seleção
1. **NB:** a exuberância vem antes e a seleção a segue, em fases que duram dias.
2. **Mínimo:** a criação de candidatos deve diminuir à medida que a seleção avança.
3. **Abstração proposta: nenhuma regra nova.** A Pcrt já recebe só incidências sem integração (decisão de 17/11): quando as Uints começarem a disparar, o insumo cai e a criação cai sozinha. O que impede isso hoje é que as Uints não disparam — o que as correções 1, 2 e 8 atacam.
4. **Perdas:** nenhuma nova.
5. **Sem pergunta:** reavaliar depois do ensaio das outras correções. Se a diluição continuar, voltar aqui.

## Correção 6 — inibição: de outra unidade, e amadurecendo junto com a excitação
1. **NB:** na MSO, a inibição vem de outros núcleos (MNTB, LNTB), é glicinérgica, com força comparável à excitação; em adultos chega antes; em jovens chega tarde e longa; ela se refina **com a experiência** (Kapfer et al. 2002; Magnusson et al. 2005; resumos). A excitação também é lenta no jovem: os EPSPs encurtam e a constante de tempo da membrana chega a ~0,3 ms em ~3 semanas no gerbil (via investigação da divisão da força; resumo e trechos). As duas amadurecem juntas.
2. **Mínimo:** (a) inibição por uma unidade intermediária, com força própria; (b) excitação e inibição começam **jovens** e amadurecem **juntas**.
3. **Abstração:** retomar a versão fiel (unidade inibitória intermediária, já especificada em 16/11), acrescentando que a **constante de tempo da Uint** também começa longa e amadurece junto com a inibição, pela mesma regra.
4. **Perdas:** maturação por programa genético e por experiência fica reduzida a uma regra só.
5. **Dúvida (pergunta 3):** amadurece com quê — com os **acertos** da Uint (como na versão fiel), com o **tempo** (desenvolvimento), ou com os dois? E com que valores iniciais da excitação jovem (não temos o número da constante de tempo inicial)? Impacto geral: toda Uint passa a ter uma **idade funcional**, o que vale para todos os sentidos.

## Correção 7 — regra e ganho importados do córtex
1. **NB:** não achamos medida de plasticidade dependente do tempo de disparo no tronco auditivo; o refinamento ali passa pela inibição, pela liberação pré-sináptica e pela poda (investigações de competição e de divisão da força).
2. **Mínimo:** não importar a janela cortical; a competição deve vir de mecanismos com apoio no circuito (correções 1, 2 e 6).
3. **Abstração:** retirar definitivamente a regra ligada ao disparo (já fora do último ensaio). O **ganho por acerto** continua o mesmo, mas fica **marcado como sem base NB** até haver pesquisa.
4. **Perdas:** nenhuma em relação ao NB; ganho sem fundamento continua sendo uma lacuna declarada.
5. **Sem pergunta agora;** pedido de pesquisa sobre ganho em sinapses de alta taxa fica na fila.

## Correção 8 — Uint com dois compartimentos e soma não linear
1. **NB:** na MSO, as entradas de cada orelha chegam a **dendritos diferentes** (Mackenbach e Borst 2023, resumo). Canais Kv1 estreitam a janela de coincidência (Mathews et al. 2010, resumo). Contatos distribuídos e canais ativos estreitam e aumentam o EPSP (Callan et al. 2021, modelo sobre anatomia medida). Perto do limiar, o efeito da despolarização é não linear (Artola, Bröcher e Singer 1990; Golding, Staff e Spruston 2002; resumos) — e a hipótese do responsável (17/11) é de integração não linear.
2. **Mínimo:** cada orelha soma no seu compartimento; o corpo combina os compartimentos de forma não linear, de modo que **poucas entradas fortes e coincidentes valham mais que muitas fracas**.
3. **Abstração:** cada lado da Uint tem a sua soma (com o seu recurso, correção 1); a contribuição de cada lado ao corpo passa por uma função que cresce mais que linearmente; o disparo depende da combinação dos dois lados.
4. **Perdas:** geometria dendrítica, tipos de canais, propagação.
5. **Dúvida (pergunta 4):** a forma da não linearidade não tem número direto na literatura lida. Impacto geral: muda a Uint de todos os sentidos; é a mudança mais estrutural da lista.

## Correção 9 — medidas de população
- **Sem dúvida:** passar a medir a sintonia como população (quantas Uints sintonizadas, em que diferença, com que espalhamento), além das classes. Só medida; não muda o modelo.

---

## Decisões do responsável (17/11)
- **1:** aprovada; mapear tamanho e reposição do recurso.
- **2:** aprovada; mapear fração e tempo.
- **6:** maturação pelos **acertos da Uint**; a recorrência reforça e o decaimento derruba (a maturação pode regredir).
- **8:** pesquisa feita ([integração na Uint](investigacao-integracao-uint.md)); a proposta foi **revista**: soma linear dos dois lados e saída probabilística expansiva no lugar do limiar duro.
- **Alvo:** ver a linha de 17/11 em decisões em construção.

## Pergunta 5 — o alvo da V0.17 (dissonância 5)
A V0.17 pede ao mundo que selecione **atrasos**. A evidência de mamífero sugere que os atrasos podem vir antes de ouvir e que o mundo selecionaria a **fase**, pela inibição. A correção 6 aproxima as duas leituras, mas a escolha do que o ensaio testa é do responsável: manter o alvo, trocar, ou esperar a pesquisa.

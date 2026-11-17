# V0.17 — Onde estamos em dissonância com o modelo neurobiológico, e o preço provável

**Pedido do responsável:** 17/11/2026, depois do ensaio da estrutura com várias cabeças (grave 1/10).
**Redação:** assistente (Claude). **Estatuto:** levantamento para revisão; as hipóteses de preço são **nossas** e não estão testadas.
**Critério da metodologia:** divergir do NB só com simplificação agnóstica **justificada** (mecanismo entendido, equivalência proposta, perdas declaradas). Para cada item: o que o NB faz, o que fazemos, se a divergência foi **justificada** ou não, o preço provável e como testar.
**Fontes:** as investigações desta versão ([escala](investigacao-escala.md), [pré-audição](investigacao-pre-audicao.md), [competição](investigacao-competicao.md), [divisão da força](investigacao-divisao-forca.md), [subdivisões do colateral](investigacao-arborizacao-terminal.md), [inibição](investigacao-inibicao-lateral.md)); o nível de leitura de cada fonte está nelas.

---

## 1. Soma fixa da força
- **NB:** não há lei que conserve exatamente a soma da força de um axônio nem de um neurônio. Há tetos por sinapse, recursos locais que competem de forma aproximada (pré e pós-sinápticos) e normalização que **emerge** da dinâmica.
- **Nós:** soma exata e imposta — antes por Upro (1,0), agora por lado de cada Uint (1,0).
- **Justificada?** Não. Foi uma escolha de engenharia para conter a explosão (16/11), sem equivalência proposta.
- **Preço provável:** com muitos candidatos igualmente bons, a soma fixa se reparte entre eles e ninguém fica forte o bastante para fazer a Uint disparar. A divisão apenas **mudou de lugar** quando a soma mudou de lugar (Upro → Uint).
- **Teste:** sem soma fixa, só com teto por ramo, medir se há explosão de força e se surge um vencedor.

## 2. O freio é uma divisão, não uma eliminação
- **NB:** na competição do desenvolvimento, os perdedores são **eliminados** (o cálice de Held vai de ~9 entradas a 1 em ~3 dias; poda de colaterais).
- **Nós:** o perdedor perde fração da força, mas continua ocupando parte do estoque; só some por **desuso** (600 s sem acerto). Um ramo da região certa, que acerta de vez em quando, nunca some.
- **Justificada?** Não discutida.
- **Preço provável:** os empatados convivem indefinidamente e mantêm a força dividida.
- **Teste:** eliminação competitiva (o ramo mais fraco de um mesmo lado da Uint, abaixo de uma fração do mais forte por um tempo, é retirado).

## 3. Exuberância e seleção ao mesmo tempo, em minutos
- **NB:** a exuberância de entradas e a seleção ocorrem em dias, em fases (muito antes de ouvir; refinamento depois); a consolidação leva horas a dias.
- **Nós:** tudo acontece em 5 episódios de 10 s espaçados por 3 min; Upros novas entram enquanto as velhas ainda são selecionadas.
- **Justificada?** Em parte: comprimir o tempo é necessário para rodar. Mas não discutimos o que se perde ao **sobrepor** as fases.
- **Preço provável:** diluição contínua — cada candidato novo entra no estoque e divide a força antes de a seleção anterior terminar.
- **Teste:** separar fases (exuberância, depois só seleção e poda, sem brotar).

## 4. Sem atividade própria antes do mundo
- **NB:** antes de ouvir, a cóclea gera surtos espontâneos que fazem os neurônios do tronco **disparar**; isso refina mapas e conduz a competição (cálice de Held, MNTB→LSO).
- **Nós:** nada antes do Bach (decisão de 17/11: a fase de atividade própria fica para depois da V0.17).
- **Justificada?** Sim, como decisão de escopo, mas sem medir o preço.
- **Preço provável:** sem disparo, a competição dependente do disparo não age; é o "ovo e a galinha" que vimos duas vezes.
- **Teste:** já registrado como hipótese para depois da V0.17; pode ser antecipado se os outros itens não bastarem.

## 5. O que o mundo seleciona: atrasos ou fase?
- **NB:** na ave, linhas de atraso formam um mapa; no mamífero, os padrões de atraso dos axônios **não explicam** de forma simples a sintonia (Karino et al. 2011), as diferenças de condução entre colaterais aparecem **antes** de ouvir (Seidl e Rubel 2016), e a sintonia amadurece **com** o som junto com o refinamento da inibição (Seidl e Grothe 2005; Kapfer et al. 2002).
- **Nós:** o mundo seleciona **atrasos** grandes, por exuberância de Upros a ±10%.
- **Justificada?** Era a hipótese da V0.17; a evidência de mamífero agora a enfraquece (hipótese registrada em 17/11, a investigar).
- **Preço provável:** pedimos ao mundo que selecione algo que, no mamífero, talvez venha dado; e a regra ±10% cria quase-duplicatas que empatam.
- **Teste:** depende da pesquisa da hipótese "fase pela inibição".

## 6. Inibição simplificada e maturidades descasadas
- **NB:** a inibição vem de outra unidade (MNTB/LNTB), glicinérgica, com força e tempo próprios; em adultos chega antes da excitação; em jovens chega tarde e longa; ela **amadurece com a experiência**. Excitação e inibição amadurecem juntas.
- **Nós:** plano B — a inibição vem da mesma chegada, com a mesma força × 0,5, uma janela depois, sem amadurecer; e a excitação já é "adulta" (0,30 ms) desde o início.
- **Justificada?** O plano B foi declarado como divergência; a versão fiel falhou justamente pelo descasamento (inibição jovem com excitação adulta).
- **Preço provável:** perdemos o papel da inibição como **seletora** (afiar e deslocar a sintonia) e criamos um regime que não existe na biologia (adulto num lado, jovem no outro).
- **Teste:** excitação e inibição com a mesma fase de maturação (opção já registrada em 16/11 como pendente).

## 7. Regra de competição e ganho importados
- **NB:** não achamos medida de plasticidade dependente do tempo de disparo na MSO, LSO ou núcleo coclear; o refinamento ali envolve inibição, liberação pré-sináptica, cinética e mielina. Sinapses auditivas lidam com centenas de disparos por segundo com depressão de curto prazo e homeostase.
- **Nós:** a janela e o 1,05 vêm do córtex (Song et al. 2000); o ganho por acerto é fixo, igual no grave e no agudo (6× mais eventos).
- **Justificada?** Não para o tronco auditivo.
- **Preço provável:** o agudo colapsou com a regra do disparo e fica no acaso sem ela; o mesmo ganho por evento produz dinâmicas muito diferentes conforme a densidade.
- **Teste:** depende de pesquisa; não temos número biológico para importar.

## 8. Uint como soma linear simples
- **NB:** o neurônio da MSO tem **dois dendritos, um por orelha**, com estoques locais; canais ativos (Kv1) estreitam a janela; há não linearidades (eventos dendríticos; limiares que dependem da despolarização).
- **Nós:** uma soma única com decaimento exponencial, limiar fixo, sem dendritos (o estoque por lado é o único traço dos dois dendritos).
- **Justificada?** Em parte (simplificação agnóstica razoável), mas sem perdas declaradas.
- **Preço provável:** a não linearidade faria poucos contatos fortes e coincidentes valerem mais que muitos fracos — exatamente o que nos falta para desempatar. Com soma linear, 13 ramos de 0,08 valem o mesmo que 1 de 1,0.
- **Teste:** soma não linear (por exemplo, um termo que favorece entradas fortes e coincidentes), com fonte.

## 9. Medida por um par mais forte
- **NB:** a diferença entre as orelhas é lida por **populações** de neurônios.
- **Nós:** o classificador olhou um par por Uint (antes) e Uints isoladas (agora).
- **Justificada?** Medida, não mecanismo; mas já nos enganou uma vez (o 8/10 frágil).
- **Preço provável:** ler mal resultados (falsos sucessos ou falsos fracassos).
- **Teste:** medidas de população (quantas Uints, com que sintonia), já em parte incluídas.

## 10. Sem segundo nível
- **NB:** há inibição lateral entre neurônios e reativação (repetição) que consolida.
- **Nós:** adiados para depois (decisões de 16/11).
- **Justificada?** Sim, por escopo e parcimônia.
- **Preço provável:** nenhum mecanismo de "um vence entre Uints"; nenhuma consolidação fora dos episódios.
- **Teste:** só quando o primeiro nível funcionar.

---

## Leitura de conjunto (hipótese nossa)
Os itens **1, 2, 3 e 8** se reforçam: **soma fixa + divisão sem eliminação + exuberância contínua + soma linear** produzem exatamente o empate que vemos. Os itens **4 e 7** explicam por que o desempate pelo disparo não age. O item **5** questiona se estamos pedindo ao mundo a coisa certa.

# Auditoria: o motor constitutivo segue a CLEAR?

**Data:** 09/11/2026. **Pedido do responsável:** depois do resultado negativo da primeira rodada, verificar se houve **erro de implementação** (o motor não faz o que a CLEAR diz) e não de teoria.

**Fontes relidas:** Matriz de constituição (08/11/2026, texto integral) e preprint CLEAR v2.1.0 (seções 1, 2 e 4: transdução, modulação e síntese, relações e ligações, entidades, regulação, contexto ativo, preparação, acesso). Citações em inglês são do preprint.

## Resultado: sim, há divergências de implementação, e duas explicam diretamente os negativos

| Nº | O que a CLEAR diz | O que o motor faz | Gravidade | Explica qual negativo |
|---|---|---|---|---|
| 1 | **"Afferent transduction reaches before it creates."** Em geral, a transdução **alcança** uma representação que já existe. Se a correspondência precisa de atualização, a ocasião é **modulação** ("the alteration of one or more properties of something that already exists": a cor do copo muda com a luz, a barba cresce, e o objeto persiste). Só quando nada corresponde, a ocasião é **síntese** de representação nova. | Cada atraso novo, fora de 5% de tolerância, cria **uma unidade nova**. Uma queda de outra altura é o **mesmo evento com uma propriedade diferente**, mas o motor a trata como algo novo. Não existe modulação de propriedade. | **Alta** | Ancoragem e reativação: a "queda" se fragmenta em dezenas de unidades por faixa de atraso; nenhuma representa a queda com a altura como propriedade modulada |
| 2 | Ligações são **"strengthened through recurrent participation, weakened through disuse"**. A contribuição estrutural da regulação é a força acumulada pela **participação recorrente**. | A relação só se fortalece (sobe de nível) com o **portão de novidade aberto**. Num mundo familiar não há novidade e nada se fortalece. | **Alta** | Maturação: no mundo fixo, a surpresa fica em 0,64; o mundo aleatório amadurece mais que o fixo (ordem invertida) |
| 3 | A regulação tem três contribuições: transitória (contexto ativo e preparação), estrutural (força das ligações) e **ampla**: "participation conditions may shift across wide regions… raising or lowering the threshold for those regions as a whole". | O modulador de novidade age **só sobre a plasticidade** (abrir o portão). Não muda **limiares de participação** (acesso). | Média | Não é causa direta; tira do motor uma das três contribuições de regulação |
| 4 | **Surpresa:** "may occur when a transduced input favors a representation that the **current context had strongly inhibited**". O contexto ativo **excita** as relacionadas e **inibe** as incompatíveis. | Surpresa = disparo sem preparação (falta de excitação). Não há **inibição pelo contexto**; a única inibição é a competição dentro do par. | Média | Contribui para uma surpresa pouco informativa |
| 5 | **Contexto ativo:** o que acabou de ser acessado prepara (excita) estruturas **ligadas**, ao longo das ligações existentes, numa vizinhança. | A preparação vem só da primeira aferente da **própria** unidade. Não se propaga a outras unidades ligadas. | Média | Limita a preparação do campo à escala de um par |
| 6 | "Afferent transduction is **constant**." As chegadas contínuas **mantêm** as representações (correspondência mantida, não restabelecida). | Só **mudanças** de medida são eventos; chegadas sem mudança são descartadas. A manutenção vem das descargas. | Baixa a média | Simplificação nossa (neutralidade quanto ao conteúdo), não declarada como divergência da CLEAR |
| 7 | Entidade = conjunto conectado com **invariância através da transformação**; a representação da entidade é um **padrão comprimido** (não um ponteiro). | O nível 2 cria unidades de **conjunção de pares** de descargas. | Fora da fase atual | Relevante para a fase dos níveis superiores |
| 8 | Domínio representacional exige **confiança revisável** por confronto com a transdução. | Existe enfraquecimento por contradição, mas não há **confiança** por representação. | Baixa | Parcialmente coberto |

**O que está conforme:**
- integração de pelo menos duas fontes distintas com limiar (unidade integradora);
- unidades novas por relações entre elementos existentes (recrutamento; Matriz 2.3);
- distinção entre preparação, projeção e previsão;
- regras programáveis com distinções não fixadas pelo projetista;
- poda.

## O erro também alcança os controles
O **oráculo** que calibrou os critérios também cria **uma unidade por faixa de atraso**: ele sintetiza por valor. Os critérios foram calibrados num regime que a CLEAR não descreve. Com a divergência 1 corrigida, a calibração precisa ser revista. Um oráculo conforme à CLEAR teria **uma** representação da queda com a altura como propriedade modulada.

## Classificação
- **Erros de implementação** (o motor contradiz a CLEAR): 1, 2, 4 e 5. São estes que precisam ser corrigidos antes de uma segunda rodada.
- **Lacunas** (a CLEAR descreve, o motor ainda não tem): 3, 7 e 8.
- **Simplificação nossa a declarar:** 6.
- **Teoria:** nada no resultado negativo refuta a CLEAR, porque o motor testado não realizava o que ela descreve nos pontos 1 e 2.

## Adendo (09/11/2026): número de aferências da Uint
- **CLEAR v43 (linha 73):** a Uint produz um resultado determinado por incidências de **pelo menos duas fontes distintas**. Correção do responsável: "ao menos duas, não necessariamente duas".
- **Motor atual:** toda unidade tem **exatamente duas** aferências (primeira e segunda), com pesos fixos. É uma restrição de implementação, não da teoria.
- **Neurobiologia:** um neurônio recebe de centenas a milhares de sinapses (ordem de grandeza; confiança moderada, varia muito por tipo celular).
- **Classificação:** erro de implementação (restrição não declarada). Também obriga a criar uma unidade nova para cada par, o que reforça o erro 1 (criar em vez de alcançar).
- **Correção a desenhar:** a Uint soma as contribuições (magnitude × efeito) de **n ≥ 2** aferências de fontes distintas; duas aferências da mesma fonte não satisfazem a condição.

# Metodologia do programa CLEAR

**Origem:** definição do responsável em 09/11/2026. **Aplicação operacional atualizada:** 12/11/2026. Aplica-se ao programa CLEAR, TEMPO, EMERGENCE, VALORE, ANCHOR e SIEVE.

## Núcleo do método (preservado)
1. **Investigar o substrato neurobiológico (NB)**, não exclusivamente humano, para determinar como os fenômenos e transformações investigados ocorrem efetivamente.
2. **Determinar os mínimos constitutivos e funcionais**, distinguindo funções e condições necessárias das particularidades materiais do NB.
3. **Derivar uma arquitetura agnóstica de substrato** que preserve as funções justificadas, sem escolher antecipadamente soluções computacionais convenientes.
4. **Deduzir consequências e confrontar empiricamente** a arquitetura com os fenômenos investigados.

O objetivo não é procurar semelhanças entre uma arquitetura previamente escolhida e o cérebro. A arquitetura deve ser derivada da investigação.

## Procedimento operacional de aplicação
1. **Delimitar o fenômeno** e as fronteiras da explicação, incluindo condições anteriores à constituição para evitar circularidade.
2. **Investigar o NB** por bibliografia verificável: estruturas, processos de desenvolvimento, transformações, condições e evidências diretas; não pressupor que um mecanismo observado em sistema maduro explique sua constituição inicial.
3. **Reconstruir causalmente** como cada mecanismo produz seus efeitos; distinguir evidência, inferência e especulação. Não aceitar “influência causal” como explicação sem operação específica.
4. **Identificar mínimos funcionais e constitutivos** e hipóteses concorrentes. Distinguir possibilidade, suficiência e necessidade; buscar contraexemplos.
5. **Abstrair para o agnosticismo de substrato** somente com rastreabilidade de cada propriedade original, equivalência funcional argumentada, condições, perdas e exceções; sem substituir mecanismos por atributos declarativos (“sem JSON explicativo”).
6. **Deduzir previsões** positivas, negativas, limites e resultados capazes de refutar hipóteses concorrentes.
7. **Confrontar experimentalmente** com controles, perturbações, ablações e generalização, preservando resultados negativos.

### Independência e bibliografia
A formulação independente de problemas e hipóteses antecede a confrontação bibliográfica. A pesquisa de literatura não autoriza incorporar automaticamente mecanismos de outros autores; refinamento informado requer decisão explícita. Registrar separadamente hipótese do responsável, dedução do assistente, proposta nova e contribuição bibliográfica. Não reivindicar originalidade sem confronto. Se a literatura não resolver a constituição, registrar lacuna, não promover hipótese a fato.

## Sentido rigoroso da minimalidade funcional (esclarecimento de 12/11/2026)
O critério de **mínimos constitutivos e funcionais** decorre da complexidade extraordinária do substrato neurobiológico: mimetizar indiscriminadamente toda sua riqueza é impraticável e obscurece quais operações são responsáveis pelo fenômeno. **Minimalidade funcional não é minimalidade computacional, econômica, estrutural ou de esforço de implementação.** A prioridade é demonstrar constituição autônoma efetiva, mesmo que a arquitetura experimental seja computacionalmente custosa, extensa ou pouco eficiente.

- **Preservar antes de simplificar:** não eliminar processos, graus de liberdade, relações, transformações ou condições de desenvolvimento apenas porque complicam a implementação. Exigir rastreamento das funções preservadas, perdas, condições e contraexemplos.
- **Não mimetizar por mimetizar:** não transportar integralmente particularidades materiais neurobiológicas sem demonstrar sua pertinência funcional; tampouco excluir propriedades ainda candidatas a necessárias por conveniência.
- **Distinguir estatutos:** uma realização suficiente não prova minimalidade, nem necessidade de todos os seus elementos. A busca de mínimos é uma investigação com hipóteses concorrentes, não um resultado pressuposto.
- **Objetivo constitutivo:** demonstrar, caso seja possível, a criação autônoma de Uint e Upro por regras determinísticas, relacionais e transdutoras efetivamente operacionais, sem identidades, destinos, agrupamentos ou funções constitutivas pré-programados. Regras determinísticas não equivalem a resultados constitutivos predeterminados.
- **Não circularidade e explicação:** propagação, plasticidade, dependência histórica, integração, não linearidade e sensibilidade a ablações não bastam isoladamente para demonstrar constituição. Critérios de individuação e origem devem ser operacionalmente justificados; não transformar rótulos de observação em mecanismos.
- **Prioridade de avaliação:** sucesso constitutivo demonstrado prevalece sobre eficiência. Comparar custos e buscar otimização apenas depois, e sem sacrificar propriedades necessárias ou ainda não refutadas.

### Consequência para o EMERGENCE
A topologia potencial fixa com condutâncias ajustáveis da V0.12 é uma escolha experimental parcial, **não** uma equivalência demonstrada à capacidade de constituir relações. A linearidade das sondagens com condutâncias congeladas não é critério de existência ou impossibilidade de Uint; não linearidade tampouco é prova de Uint. Avaliar constituição separadamente de transmissão e resposta conjunta. Não declarar insuficiência universal do mecanismo com base apenas em testes negativos ou incompletos.

## Regra de divergência e simplificação
Divergir da implementação NB como simplificação agnóstica exige (a) mecanismo NB entendido e fonte; (b) função preservada e demonstração ou argumento explícito de equivalência, condições e limites; (c) perdas e exceções declaradas; (d) teste que discrimine as perdas. Simplificações não demonstradas permanecem hipóteses. Controles experimentais e decisões de segurança são identificados separadamente e não alegados como equivalências.

Toda nova regra registra: mecanismo de origem e fonte; necessidade funcional; alternativa concorrente; abstração proposta; equivalência; perdas; teste de refutação; aprovação e estado de implementação.

## Ciclo obrigatório de cada experimento
**I. Pré-experimento → II. Experimento → III. Resultados.** Não fundir as etapas nem alterar retrospectivamente previsões para coincidir com dados.

### I. Pré-experimento (PDF obrigatório antes de implementar)
1. Erros identificados na versão anterior: separar erros demonstrados, limitações e lacunas.
2. Hipóteses corretivas: problema visado, alternativas e possíveis perdas.
3. Hipóteses a validar: hipótese nula, hipóteses concorrentes e observações discriminantes.
4. Aplicação integral do método: fenômeno; investigação NB com bibliografia; reconstrução causal; mínimos; abstração; previsões; limites e refutações. Apresentar **resultados da investigação e da literatura**, nunca resultados experimentais futuros.
5. Hipóteses de trabalho e previsão de alcance: mecanismos candidatos, justificação, o que se pretende implementar, o que se pode testar e o que se poderia demonstrar; critérios de êxito parcial, falha e interrupção.

O PDF é congelado antes da etapa II; decisões ainda não fundamentadas ficam abertas. Um diagnóstico inicial pode preceder o PDF, mas não é pré-registro final.

### II. Experimento
Implementar apenas mecanismos aprovados; preservar versões anteriores; registrar parâmetros, sementes, código, ambiente, controles, intervenções e desvios. Alterações constitutivas após o congelamento exigem versão ou adendo identificado como exploratório.

### III. Resultados
Publicar dados brutos, medidas, controles, testes adversariais, divergências, limitações e interpretação, com confronto explícito com cada previsão. Separar estrutura, função, representação e constituição autônoma. Não declarar validação empírica inexistente.

## Regra de não circularidade
Não programar a identidade, a função integradora, os destinos ou os percursos que o experimento pretende demonstrar como autonomamente constituídos. A identificação retrospectiva por observador externo não equivale à constituição pelo sistema.

## Referências internas
- [Revisão de divergências](neurobiological-divergence-review-v0.1.md)
- [Inventário de regras](mesh-rules-v0.1.md)
- [Série toy-experiments](../toy-experiments/README.md)

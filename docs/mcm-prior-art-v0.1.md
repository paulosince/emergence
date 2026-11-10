# investigação dos precedentes do motor — Precedentes do motor constitutivo mínimo — v0.1

**Data:** 09/11/2026 · **Estado:** levantamento por resumos e registros bibliográficos; nenhum texto completo lido nesta etapa. Não é revisão sistemática.

## Pergunta
O desenho do motor constitutivo (seção 2 de `research-design-v0.1.md`) já existe na literatura, no todo ou em partes? Quais ideias reaproveitar, quais comparadores usar e o que **não** reivindicar como novo?

## Ingredientes do motor constitutivo e precedentes encontrados
| Ingrediente do motor constitutivo | Precedentes | Situação |
|---|---|---|
| **Criar unidade quando a organização existente não acomoda a entrada** (novidade) | Rede que cresce quando necessário: cresce quando nenhum nó casa suficientemente a entrada (Marsland, Shapiro e Nehmzow 2002); teoria da ressonância adaptativa: nova categoria quando nenhum protótipo passa no teste de vigilância (Carpenter e Grossberg); rede incremental auto-organizada (Furao e Hasegawa 2006); memória temporal hierárquica cria segmentos e sinapses novos quando a entrada não foi prevista (Hawkins e Ahmad 2016); recrutamento de neurônios ociosos com STDP (Roy 2016, visto só como citação) | **Bem estabelecido**: não é novo |
| **Unidade formada por elementos que co-ocorrem; esquecimento por decaimento e interferência** | PARSER (Perruchet e Vinter 1998); TRACX, reconhecimento de chunks (French, Addyman e Mareschal 2011) | Bem estabelecido, em sequências discretas e sem tempo físico |
| **Recursão: saídas de unidades viram entradas para unidades de nível superior** | Chunks de chunks (PARSER/TRACX); hierarquia de superfícies temporais, em que cada atribuição a um centróide gera um evento para a camada seguinte (Lagorce et al. 2017); camadas de rede gama que cresce quando necessário (Parisi et al. 2017) | Estabelecido. No hierarquia de superfícies temporais, a vizinhança espacial é dada pelo projeto e o número de centróides é fixo |
| **Atrasos vividos como conteúdo; coincidência temporal** | Seleção de atrasos (Gerstner et al. 1996); policronia (Izhikevich 2006); TEMPO | Estabelecido |
| **Contexto temporal em redes que crescem** | Mapa auto-organizado com fusão de contexto e gás neural com fusão de contexto (Strickert e Hammer 2005); mapa auto-organizado recursivo (Voegtlin 2002); gás neural crescente com fusão de contexto (Andreakis et al. 2009); rede gama que cresce quando necessário | Estabelecido, mas o tempo entra como **vetor de contexto**, não como atraso constitutivo de relação |
| **Traços em várias escalas temporais** | Modelo em cascata (Fusi, Drew e Abbott 2005); plasticidade de escala comportamental (Bittner et al. 2017) | Estabelecido como mecanismo sináptico |
| **Antecipação/predição local** | Estado preditivo por despolarização no memória temporal hierárquica; crescimento guiado por predição no rede gama que cresce quando necessário | Estabelecido |

## Conclusão
- **Cada ingrediente tem precedente.** O motor constitutivo não deve reivindicar novidade por criar unidades por novidade, formar chunks, usar recursão, atrasos ou traços multiescala.
- **Não encontrei a combinação:** unidades criadas por coincidência temporal de duas ou mais fontes **distintas**, com o **atraso vivido como conteúdo constitutivo**, recursão pela **mesma** regra, traços multiescala e avaliação pelos critérios da CLEAR (ancoragem no referente contra o instrumento, papel causal interno). Não encontrar não significa que não exista.
- **A contribuição mais defensável** tende a estar no **quadro de avaliação** (critério de ancoragem, princípio da separação entre canal e referente, princípio do papel causal interno, nulos), não no mecanismo.

## Consequências para primitivas do motor (primeira versão do motor constitutivo)
1. **Limiar de novidade parametrizado como a vigilância do teoria da ressonância adaptativa** e com contador de habituação como no rede que cresce quando necessário, para controlar a taxa de criação.
2. **Ciclo de vida como no PARSER**: decaimento e interferência; esquecimento é poda.
3. **Antecipação como no memória temporal hierárquica**: estado de "esperado" antes da chegada; chegada não antecipada pode criar unidade.
4. **Recursão por eventos como no hierarquia de superfícies temporais**, **sem** a vizinhança espacial dada pelo projeto (condição princípio da neutralidade de conteúdo).
5. **Unidades sobre substrato fixo como na policronia**: variante a manter (proposta das assembleias).

## Comparadores propostos para campanha do motor
| Comparador | Por quê | Implementação |
|---|---|---|
| Controle TEMPO de nós fixos | Já existe; linha de base temporotopológica | Existente |
| Rede que cresce quando necessário | Criação por novidade sem tempo | A implementar em JS |
| Rede gama que cresce quando necessário ou gás neural crescente com fusão de contexto | Criação por novidade **com** contexto temporal | A implementar |
| PARSER adaptado a fluxos de eventos discretizados | Chunking e recursão sem tempo físico | A implementar |

**Limite deste levantamento:** só resumos e registros; detalhes de algoritmos (limiares, regras de atualização) precisam ser conferidos nos textos completos **durante a implementação** de cada comparador.

## Referências (registros conferidos)
Marsland, Shapiro e Nehmzow 2002 (Neural Networks 15); Furao e Hasegawa 2006 (Neural Networks 19); Carpenter e Grossberg (teoria da ressonância adaptativa; Scholarpedia); Hawkins e Ahmad 2016 (Front. Neural Circuits 10:23); Perruchet e Vinter 1998 (J. Mem. Lang. 39); French, Addyman e Mareschal 2011 (Psychol. Rev. 118); Lagorce et al. 2017 (IEEE TPAMI 39); Parisi, Tani, Weber e Wermter 2017 (Neural Networks 96); Strickert e Hammer 2005 (Neurocomputing 64); Voegtlin 2002 (Neural Networks 15); Andreakis, Hoyningen-Huene e Beetz 2009 (WSOM, LNCS 5629); Gerstner et al. 1996 (Nature); Izhikevich 2006 (Neural Comput. 18); Fusi, Drew e Abbott 2005 (Neuron 45); Bittner et al. 2017 (Science 357).

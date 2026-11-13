# HCMT — reformulação conceitual e matemática para V0.16

**Hipótese original:** Paulo Rogério da Silva. **Formalização candidata:** assistente GPT-6. **Data:** 2026-11-13. **Estatuto:** proposta para crítica, não decisão arquitetural nem validação.

## Correções conceituais

- X/Y/Z e as folhas do desenho inicial eram instrumentos de visualização, não dimensões físicas obrigatórias nem camadas materiais.
- A HCMT pode ser funcionalmente multidimensional: relações entre canais, posições, instantes, atrasos de propagação, intensidades, frequências e transformações.
- Propriedade operacional, coordenada de visualização e dimensão matemática independente são conceitos distintos.
- A organização temporotopológica transdutiva pode ser **determinística e pré-especificada**. A autonomia representacional de níveis superiores não é exigência da V0.16.
- A organização pode ser emaranhada, sem eixos ortogonais nem folhas anatômicas.
- Uma organização de incidências não é automaticamente uma representação segundo a tríade CLEAR.

## Hipótese reconstruída

Incidências originadas pela transdução podem ser integradas em organizações temporotopológicas que preservam e combinam relações entre canais, posições, sucessões, intervalos, intensidades e propriedades de propagação. A organização pode ser funcionalmente multidimensional sem geometria física fixa. A V0.16 testa mecanismos operacionais explícitos de discriminação de relações, e não autonomia representacional.

## Formalização candidata — NÃO atribuída ao pesquisador

Sejam C os canais transdutores, S as posições dos receptores, E os eventos transduzidos e G=(V,A) um grafo dirigido de unidades e conexões.

**Evento:** e_i=(c_i,s_i,t_i,a_i,q_i), onde c é canal, s posição, t instante, a magnitude e q propriedades adicionais mensuráveis. A quantidade de fibras recrutadas n_i é outra variável, não necessariamente igual à intensidade a_i.

**Transdução:** E=T(u; θ_T), com estímulo físico u, parâmetros θ_T congelados antes do teste e transformação T determinística candidata.

**Conexão:** cada aresta a=(v,w) possui atraso d_a≥0, peso g_a e operador causal K_a. Uma emissão no instante t gera contribuição z_a(t')=g_a K_a(t'−t−d_a), com K_a(τ)=0 para τ<0. A escolha de K_a é parte do modelo, não uma lei biológica estabelecida.

**Integração:** H_w(t)=F_w({z_a(t):a termina em w},h_w(t)). F_w deve explicitar soma, saturação, normalização, inibição, substituição ou conservação de contribuições e a condição de disparo.

**Relações:** R(E,G) contém Δt, Δs, associações entre canais, trajetórias, multiplicidade de contatos e intensidades. Não se presume independência nem ortogonalidade dessas famílias.

**Identidade:** distinguir origem o, incidência e, trajetória p e contato k. A mesma incidência propagada por múltiplos caminhos não equivale automaticamente a eventos independentes. Incidências sucessivas da mesma origem são eventos distintos.

## Lacunas a decidir antes do congelamento

1. Domínios físicos e codificação de magnitude, intensidade e recrutamento de fibras.
2. Família de operadores K_a e regras de atraso.
3. Regra de integração F_w e seu comportamento diante de múltiplos contatos.
4. Critérios observáveis para diferenciar relações entre canais, posição e tempo sem rótulos externos.
5. Definição e identificabilidade de dimensões independentes, se isso for necessário à previsão experimental.

## Confronto bibliográfico — leitura crítica

**Auditivo:** células polvo, integração binaural, convergência de frequências e sintonia a atrasos mostram mecanismos distintos. **Visual:** retinotopia, ON/OFF, disparidade e direção combinam relações espaciais e temporais. **Tátil/eletrorrecepção:** múltiplos pontos receptores e discriminação de sequências. **Vestibular:** canais semicirculares, órgãos otolíticos e transformações de referencial. Esses achados motivam testes; não demonstram uma geometria universal ou a constituição representacional.

O dossiê do Claude (34 p., fornecido pelo pesquisador) é fonte secundária de confronto nesta revisão. Os números e as interpretações específicas não foram rechecados integralmente contra todos os artigos primários.

## V0.16 — ensaios discriminantes

- **T0:** rastrear identidade de incidência, trajetória e contato, inclusive em reconvergência.
- **T1:** duas vias periódicas, atrasos controlados, defasagens incompatíveis e jitter; medir seletividade e saturação.
- **T2:** comparar um evento por muitos caminhos, muitos eventos da mesma origem e eventos de origens diferentes.
- **T3:** estimar densidade de pares, candidatos, entregas e unidades antes de fixar limites.
- **T4:** manter fase controlada no ensaio principal e variar fase em condição separada.
- **T5:** manipular ITD, faixa, intensidade e intervalo separadamente.
- **T6:** controles adversariais por permutação de canais, atrasos e relações espaciais.
- **T7:** reapresentação com variações, distinguindo reutilização de proliferação e lookup externo.
- **T8:** auditar fila de eventos, precisão temporal, invariância de IDs e custo; executar testes mínimos antes de congelar.

**Critérios:** previsão pré-registrada; controles negativos; discriminação seletiva; ausência de saturação espúria; crescimento controlado; reprodutibilidade. Falha local não refuta automaticamente a hipótese geral.

## Rastreabilidade

- Hipotese_HCMT_V015(1).pdf — formulação e desenhos originais, 4 p.
- EMERGENCE-V0.16-dossie-HCMT.pdf — dossiê bibliográfico do Claude, 34 p., 13/11/2026.
- Conversa de 13/11/2026 — correções sobre autonomia, folhas, geometria e dimensionalidade.
- Repositório `paulosince/emergence/toy-experiments/v15` — implementação e resultados da V0.15.

**Bibliografia prioritária identificada no dossiê:** Oertel et al. (2000); Golding & Oertel (2012); Peña & Konishi (2000); Knudsen (2002); Wenstrup & Portfors (2011); Baumann et al. (2011, 2015); Kim et al. (2014); Kremkow et al. (2016); Jörntell et al. (2014); Estebanez et al. (2016); Della Santina et al. (2005). Metadados completos e estado de leitura no capítulo 12 do dossiê do Claude.

**Nota:** esta formalização não modifica a implementação e aguarda aprovação do pesquisador.

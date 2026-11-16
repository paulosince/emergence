# V0.17 — decisões em construção (não é pré-registro)

**Responsável:** Paulo Rogério da Silva. **Registro:** Claude (Opus 5.5), conversa de 15–16/11/2026.
**Estatuto:** decisões e orientações acumuladas na conversa, para não se perderem entre sessões. Não substitui o pré-experimento, que será redigido e congelado antes de qualquer código.

## Objetivo
- A V0.16 "nasceu podre": as três condições produziam o mesmo resultado porque a diferença testada não chegava às Utrd (análise de 15/11/2026).
- A V0.17 testa a **matemática multidimensional transdutiva** (HCMT): não só X tempo e Z localização, mas **múltiplas dimensões onde há convergências**.

## Decisões do responsável
| Tema | Decisão | Data |
|---|---|---|
| Origem, para a regra da Uint | É a **Upro**, não a Utrd. Muita coisa pode ser integrada a partir da mesma Utrd | 15/11 |
| Transdução e percurso | A transdução só produz incidências. A Utrd entrega todas as incidências a todas as suas Upros; cada Upro as percorre no seu tempo e aplica seu efeito. Tempos coordenados somam e disparam a Uint; não coordenados expiram ou inibem. Só alguns caminhos chegam ao acesso | 15/11 |
| Insumo da Pcrt | O que não encontrou representação: incidências que expiraram sem integração; caminhos favorecidos que não dispararam. Num Sdom virgem, tudo é insumo | 15/11 |
| O laço da Pcrt | Fixa uma incidência e testa todas as outras; depois avança ("como um while") | 15/11 |
| Até onde vão "as outras" | Orientação aceita ("bate lindamente"): as incidências com **rastro vivo**; a comparação precisa ocorre na hora ou quando a **repetição interna** reapresenta o material. Não é decisão de mecanismo nem de números | 15/11 |
| Coordenação dos tempos | Por **exuberância**: várias candidatas com atrasos diferentes; o uso seleciona | 16/11 |
| O que conta como recorrência | A **mesma candidata que acerta de novo** | 16/11 |
| Construção | Gradual: a coincidência não gera estrutura pronta de uma vez; ela vai sendo construída conforme se repete | 16/11 |
| Faixa de partida (aceita) | **Crescer:** 10–100 acertos, em segundos a minutos. **Estabilizar:** acertos em episódios espaçados, da ordem de 1 h, inclusive pela repetição interna. **Sumir:** candidata que não acerta desaparece em 1–4 dias | 16/11 |
| Ramos | Nome **ramo** aprovado; pré-teste separado executado ([pre-v17-ramos](../pre-v17-ramos/results.md)). Na V0.17, a regra de distinção por emissão entra como **subteste com e sem** (16/11) | 15–16/11 |
| Ambiguidade Δ/2, Δ/3 | Esperada; resolve-se com reforço/decaimento e inibição | 15/11 |
| Um algoritmo para todos os sentidos (ponderação 5, parte 1) | A especialização biológica dos sentidos foi imposta pelo meio ao longo da evolução darwiniana; aqui ainda se constrói o que se consolida. **Dado:** as regras da Pcrt, as Utrd de cada sentido e as propriedades físicas das fibras. **Construído:** a janela efetiva e os atrasos que ficam. **Quem seleciona:** o mundo do robô. Consequência: o estímulo precisa conter as relações que se quer ver emergir, e elas precisam chegar às Utrd | 16/11 |

| Exuberância sem explosão (ponderação 5, parte 2) | **Combinação** das três: (1) a fibra define a faixa de atrasos que cada sentido oferece; (2) começa com poucas candidatas, espaçadas proporcionalmente (mais próximas nos atrasos curtos, mais afastadas nos longos); (3) novas candidatas brotam perto das que quase acertaram, com passo também proporcional. Esperado: o mesmo algoritmo termina fino no som e largo na visão, sem cobrir tudo de saída. "Quase-acerto" é descrição, não termo aprovado | 16/11 |
| Modalidade da V0.17 | **Som** (retoma a decisão de 13/11; a V0.15 serve de base e de fracasso conhecido para comparação) | 16/11 |
| Ramos em Uint diferentes | **Subteste dentro da V0.17**, com e sem a possibilidade de uma Upro ter ramos terminando em Uint diferentes (aresta com várias pontas). **Princípio:** traz complexidade; se funcionar sem, melhor; se fizer falta, usa-se | 16/11 |
| Cenário (descrição do responsável) | Sala de cerca de 2 × 2 m, 3 m de altura, a mesma janela; um minuto de música de domínio público (ideia inicial: peça de órgão "meio sinistra"; instrumento ainda em discussão), com trovão e chuva surgindo no meio; o robô com as medidas já especificadas. **A localização estéreo é central**, para avaliar as convergências e a separação de entidades sonoras | 16/11 |
| Alto-falantes | **Nas paredes** (não no teto). Motivo: no teto, a diferença de chegada entre os microfones (10 cm) cairia para ~0,10–0,14 ms, abaixo da janela da Uint de 0,21 ms (conta do assistente) | 16/11 |
| Diferença de nível entre os ouvidos | **Acrescentar** (sombra da cabeça), como segunda pista espacial | 16/11 |
| Janela da Uint | **Pode ficar mais estreita** que a da V0.15 (0,21 ms). Valor a propor na especificação, a partir das diferenças de chegada entre os alto-falantes | 16/11 |
| Cenário (descrição do responsável) | Sala de 2 × 2 m e 3 m de altura, com a mesma janela; robô com as medidas já especificadas; um minuto de música (Tocata e Fuga em Ré menor, de Bach, em órgão; escolha do instrumento ainda em avaliação), com trovão e chuva surgindo no meio; a localização estéreo é central, para avaliar as convergências e a separação de entidades sonoras | 16/11 |
| Alto-falantes e pistas espaciais | Alto-falantes **nas paredes** (não no teto, onde a diferença de chegada ficaria abaixo da janela da Uint); acrescentar a **diferença de nível entre os ouvidos** (sombra da cabeça); a janela da Uint **pode ficar mais estreita** | 16/11 |
| Faixas e emissão da Utrd | Cóclea já especificada para o robô: **64 faixas na escala ERB, de ~50 Hz a 8 kHz**. Abaixo de um limite (proposta: 2,4 kHz, como na V0.15) a Utrd emite **no ciclo**; acima, acompanha o **envelope**. 2 × 64 × 3 = **384 vias** | 16/11 |
| Duração da música | **Peça completa** da Tocata e Fuga em Ré menor (em vez de um minuto), em órgão: a variação (momentos cheios e vazios) pode ser a riqueza necessária | 16/11 |
| Tempestade | **Retirados** o trovão e a chuva da V0.17; ficam para outro experimento | 16/11 |
| Fonte sonora | **Uma fonte só, sem nada artificial** (as vozes do órgão não são distribuídas). Testes mais complexos ficam para outros experimentos: "já temos muito a observar aqui" | 16/11 |
| Alto-falantes e posição do robô | **Dois alto-falantes em pontas opostas da sala, tocando o mesmo sinal** (como um aparelho estéreo tocando música mono). Robô **deslocado**, mais perto de uma das fontes, e **de lado** para elas. Exemplo calculado (assistente): a 0,6 m e 1,4 m; a cópia próxima chega ~2,3 ms antes e ~7 dB mais forte, com diferenças de chegada opostas (±0,29 ms). Posições exatas a fixar no pré-experimento | 16/11 |
| Reflexões da sala | **Subexperimentos da V0.17 para os três casos:** (a) sem reflexões; (b) só as primeiras reflexões (paredes, chão e teto, uma batida cada); (c) reverberação completa | 16/11 |
| O que passa entre versões | O que passa adiante é o que vem codificado para construir, não o que foi construído: **parâmetros**. Os experimentos fazem o papel da evolução; o que prevalece nos testes entra adaptado na versão seguinte. **Salvaguarda:** entre versões só passam parâmetros, nunca estrutura consolidada (malhas, atrasos escolhidos, Uint); cada parâmetro que passa leva o registro do teste que o fez prevalecer | 16/11 |

## Em aberto
Rascunho do [pré-experimento](pre-experimento.md) (v0.1, 16/11) aguardando revisão; decisões D1–D13 na seção 6 dele.

## Fontes
Evidências e estado de leitura em [innovation-tracking, seções 11 e 12](../../docs/innovation-tracking.md).

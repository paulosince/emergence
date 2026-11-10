# Controles dos mecanismos do motor v2 — relatório exploratório (10/11/2026)

**Exploratório, não pré-registrado.** Serve para verificar se cada mecanismo faz o que diz antes do pré-registro v2. Script: `experiments/v2-controls.js` (resultado completo em `results/v2-controls-exploratory.json`, fora do controle de versão). Mundo de quedas, 200 episódios (600 s), substrato de 10.000 elementos, sementes 1–5. Valores = médias das 5 sementes (o mundo fixo e o de ciclo são idênticos entre sementes; a semente muda o substrato; o aleatório muda o mundo).

| Execução | Uint | Descargas | Taxa de surpresa | Surpresa 1º/5º quinto | Criadas 1º/5º quinto | Ganho médio | Coatividade* |
|---|---|---|---|---|---|---|---|
| Fixo, completo | 12 | 2350 | 0 | 0 / 0 | 12 / 0 | 0,755 | 0,675 |
| Fixo, sem fortalecimento | 11 | 1759 | 0 | 0 / 0 | 11 / 0 | 0,527 | 0,628 |
| Fixo, sem incidência tardia | 13 | 2554 | 0,076 | 0,070 / 0,077 | 13 / 0 | 0,870 | 0,835 |
| Fixo, sem inibição | 20 | 5313 | 0,074 | 0,072 / 0,074 | 20 / 0 | 0,649 | 0,887 |
| Fixo, sem portão | 356 | 9962 | 0,563 | 0,289 / 0,663 | 181 / 23 | 0,640 | 0,131 |
| Ciclo, completo | 27 | 3889 | 0,085 | 0,056 / 0,053 | 21 / 0 | 0,746 | 0,529 |
| Aleatório, completo | 29 | 2860 | 0,075 | 0,042 / 0,093 | 13,2 / 5,2 | 0,701 | 0,362 |
| Fixo embaralhado, completo | 315 | 12736 | 0,206 | 0,220 / 0,200 | 79 / 50,4 | 0,734 | 0,161 |

\* fração média das Uint que descarregam em cada janela de 3 s (um episódio).

## O que funcionou como esperado
1. **Ajustar antes de criar:** nos mundos estruturados (fixo, ciclo) a criação para (0 no último quinto); no aleatório continua (5,2) e no embaralhado muito mais (50,4). Controles positivo e negativo coerentes.
2. **Fortalecimento por confirmação:** sem ele o ganho médio fica em 0,53 (abaixo do inicial 0,6, pela depressão tardia); com ele, 0,76.
3. **Inibição entre concorrentes:** sem ela, 67% mais Uint, 2,3 vezes mais descargas, coatividade 0,89 contra 0,68 e surpresas aparecem (0,074).
4. **Incidência tardia:** sem ela, aparecem surpresas (0,076) e a coatividade sobe para 0,84; o ajuste de atraso por incidência tardia contribui para o refinamento.
5. **Portão de novidade:** sem ele, explosão (356 Uint) e surpresa crescente (0,29 → 0,66). É essencial.
6. **Surpresa e estrutura:** fixo 0 < aleatório 0,075 e ciclo 0,085 < embaralhado 0,206.

## Problemas encontrados
1. **A surpresa no mundo fixo é zero desde o início.** A maturação (surpresa que diminui com o tempo) não pode ser observada nesse mundo. Causa provável: a inferência de contar como favorecimento as incidências emitidas antes da janela, junto com Upro como linhas de atraso, faz toda Uint de intervalo ser "esperada" por construção; só padrões quase simultâneos podem surpreender. **Decisão do responsável necessária.**
2. **Ciclo com surpresa maior que o aleatório** (0,085 contra 0,075), contra a ordem esperada; e no aleatório a surpresa sobe do primeiro para o último quinto.
3. **Coatividade alta no mundo fixo** (68% das Uint por episódio): a representação não é esparsa.
4. Nada disso foi calibrado; os parâmetros são os declarados.

## Investigação: ciclo com surpresa maior que o aleatório (10/11/2026)
Análise do mundo de ciclo (semente 1): as surpresas se concentram em poucas Uint e têm duas causas.
1. **Uma Upro sozinha atinge o limiar.** O fortalecimento por confirmação leva o ganho até 1; com efeito +1, uma única incidência contribui 1 = limiar. Uint ajustadas a uma altura recebem incidências tardias nas outras alturas (depressão), e quando a sua altura volta disparam por uma aferência forte só, com favorecimento baixo: conta como surpresa. Na neurobiologia, uma única sinapse em geral não basta para levar o neurônio ao limiar (conhecimento geral, confiança alta na ordem de grandeza; fonte não relida).
2. **O esperado não se propaga.** Uint cujas aferências chegam quase juntas (por exemplo, um canal e a Uint que esse mesmo canal acabou de disparar) nunca têm favorecimento emitido antes da janela, então disparam como surpresa todas as vezes, mesmo sendo regularidades aprendidas.

**Correções candidatas (opções exploratórias, padrões inalterados):** `uproMaxGain` = 0,9 (nenhuma Upro sozinha atinge o limiar) e `expectationPropagates` = true (a incidência emitida por uma Uint que descarregou de forma esperada conta como favorecimento).

| Mundo (médias de 5 sementes) | Surpresa, padrão | Surpresa, com as duas correções | 1º/5º quinto (corrigido) | Criadas 1º/5º (corrigido) |
|---|---|---|---|---|
| Fixo | 0 | 0,011 | 0,011 / 0,013 | 10 / 0 |
| Ciclo | 0,085 | 0,007 | 0,016 / 0,001 | 24 / 0 |
| Aleatório | 0,075 | 0,124 (0,038–0,319 por semente) | 0,064 / 0,127 | 15 / 2,6 |
| Fixo embaralhado | 0,206 | 0,251 | 0,287 / 0,241 | 82,8 / 81,8 |

Com as correções, os mundos estruturados ficam muito abaixo do aleatório e do embaralhado, e o ciclo mostra queda da surpresa ao longo do tempo. Fixo (0,011) e ciclo (0,007) ficam praticamente empatados, com o fixo um pouco acima.

**Limitação encontrada:** nos mundos fixo e de ciclo o resultado é idêntico entre sementes, porque a semente só muda o substrato e a dinâmica da versão 2 não depende dele. Na prática, esses mundos têm uma réplica só. Para replicar de verdade, a semente precisa variar também o mundo (por exemplo, ruído dos sensores).

## Decisões do responsável (10/11/2026)
1. Ganho máximo da Upro: "menos ainda, imagino" (abaixo de 0,9). Valor a definir junto com o número de aferências por Uint, porque com ganho máximo g é preciso mais de 1/g aferências coincidentes para atingir o limiar.
2. Propagação do esperado: **aprovada**.
3. Semente variando também o mundo (ruído dos sensores): **aprovada**.
4. Discussão aberta: as "experiências" do ambiente podem estar pobres demais.

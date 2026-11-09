# mundo de quedas — Mundo episódico 1D sem corpo — v0.1

**Data:** 09/11/2026 · **Código:** `src/world/episodic-drops.js`, `src/sensory/episodic-drop-scenario.js` · **Testes:** `tests/episodic-drops.test.js` · **Experimento:** `experiments/episodic-drops.js`

## O que é
Quedas repetidas da mesma esfera rígida sobre um plano fixo, com **altura de soltura escolhida pelo pesquisador** em cada episódio (lista explícita ou sorteio uniforme numa faixa declarada, com semente declarada). Cada episódio:
1. reposicionamento instantâneo pelo pesquisador (intervenção externa; não é movimento físico, logo não há trajetória de subida a ser transduzida);
2. sustentação até a soltura (`holdMs`);
3. queda livre até o impacto;
4. repouso: restituição 0 neste mundo, portanto um único impacto por episódio, dentro do domínio de validade do modelo de um impacto.

**Não reescreve a física:** cada episódio é o modelo analítico já validado (`createReleaseControlledWorld`) deslocado no tempo. A altura é a variável física independente que um motor constitutivo teria de acompanhar (critério de ancoragem). Fica no lado do pesquisador e nunca é entregue ao motor.

**Transdução:** as mesmas barreiras ópticas (0,70 m e 0,30 m) e a mesma placa de força do mundo de uma queda.

## Validação (7 testes)
- Estados costurados idênticos ao modelo de uma queda no tempo local.
- Todos os episódios aprovados pelo verificador independente de invariantes físicos (mais de 100 verificações cada).
- Eventos de reposicionamento, soltura e impacto por episódio, em ordem, com impacto no instante analítico (início + sustentação + √(2h/g)) e repouso após o impacto.
- Limites que falham fechados: episódio curto demais, cronograma vazio, tempo fora do domínio.
- Cronograma de alturas determinístico pela semente; as incidências entregues contêm só canal, instantes, identificador e medida, nunca a altura.
- **A variável física está presente na transdução:** com amostragem de 1 ms, o intervalo entre as barreiras diminui estritamente com a altura.
- Execução pelo controlador real com pausa e retomada, idêntica à contínua.

## Observação preliminar: controle TEMPO de nós fixos (não pré-registrada; prévia de bancada de avaliação)
40 episódios, alturas de 0,8 a 2,0 m, amostragem de 1 ms, sementes 1 a 4.

| Medida | Resultado |
|---|---|
| Spearman entre altura e intervalo vivido s0→s1 | −0,996 a −0,999 |
| Spearman entre intervalo vivido e latência da relação s0→s1 do TEMPO | −0,00 a 0,39 |
| Latência da relação s0→s1 | Estaciona perto de 80 ms após o primeiro episódio (faixa vivida de cerca de 75 a 170 ms) |

**Leitura provável (a confirmar por ablação):** a consolidação torna a relação resistente a mudanças, e a janela de coatividade de 120 ms ignora os intervalos das quedas mais baixas. O TEMPO converge para **uma** latência e não representa a **variação** da variável do mundo. Para o critério de ancoragem, o motor constitutivo precisa de algo diferente de uma única relação ajustável: por exemplo, várias unidades para regimes diferentes, ou uma relação cuja latência acompanhe o referente.

## Limites
Um único objeto, eixo vertical, restituição 0, reposicionamento instantâneo, sensores sem ruído, sem corpo e sem ação do sistema.

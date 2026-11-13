# V0.15 — Execução diagnóstica da especificação congelada

**Data:** 13/11/2026. **Estado:** diagnóstico. **Não é a campanha** e não substitui a Etapa III. Código: `src/` (commit deste registro). Calibração: `calibration.json`. Resumos por execução: `results/raw/`.

## O que foi executado

| Condição | Sequência | Sementes | Resultado |
|---|---|---|---|
| Principal (especificação congelada) | S1 | 1–10 | **10 de 10 interrompidas** pelo limite de 5.000 Uint, entre 0,63 e 0,71 s (a 1ª apresentação de A começa em 0,50 s) |
| Principal | S6 | 1 | Interrompida pelo mesmo limite em 0,62 s |
| K8a (silêncio absoluto) | — | 1 | 0 incidências, 0 Uint |
| K8b (só ruído de fundo) | — | 1 | 0 incidências, 0 Uint |
| K11 (regra D17 desligada) | S1 | 1 | Interrompida pelo mesmo limite em 2,24 s |

Testes automáticos da auditoria (`test/audit.test.js`): **9 de 9 passaram**. Entre eles: as factories recusam chamada sem trilha; o registro precursor não guarda referência a Uint ou Upro; os atrasos das candidatas não dependem do intervalo vivido; uma origem sozinha não dispara a Uint (D17); determinismo; invariância à troca de identificadores (K6); a mesma estrutura sem observador (K7).

## O que aconteceu (mecanismo)

1. A primeira Uint nasce cerca de 12 ms depois do início do som, como previsto (5 encontros recorrentes).
2. **Durante a seleção, a Uint dispara no limite da refratariedade.** Medida na semente 1: as 148 Uint criadas antes de 0,52 s disparam em média **977 vezes por segundo** entre 0,55 e 0,60 s, praticamente o teto de 1.000 por segundo imposto pela refratariedade de 1 ms.
3. **Causa:** as 16 candidatas de cada via cobrem 3 ms, mas as vias emitem a cada 1 a 5 ms. As chegadas de emissões **sucessivas** da mesma via se intercalam. Pela regra D17a, vale sempre a chegada mais recente de cada origem. Assim, quase toda chegada de uma via encontra uma chegada da outra a menos de 0,2 ms, e a Uint dispara. O rastreamento da primeira Uint mostra disparos que juntam incidências de **ciclos diferentes** (por exemplo, a emissão de uma via em 512,40 ms com a da outra em 513,36 ms).
4. **Consequência para a Pcrt:** a acomodação exige que as duas incidências do par **pela mesma regra da Pcrt** (as mais recentes, até 3 ms) tenham participado **do mesmo disparo**. Como a Uint junta incidências de ciclos diferentes, esses pares frequentemente não se encontram no mesmo disparo. Só 52,6% dos pares foram acomodados na semente 1, até 0,60 s. Os outros acumulam recorrência e geram **novas Uint para o mesmo par de vias**: até 15 Uint para o mesmo par em 150 ms.
5. O limite de 5.000 Uint (D12) é alcançado ainda na 1ª apresentação de A.

## Leitura

- **Pelos critérios congelados (D12), as execuções terminam em "interrupção".**
- Não há erro de código identificado: o comportamento decorre da combinação congelada de candidatas que cobrem 3 ms (D5a), da chegada mais recente substituindo a anterior (D17a), da acomodação pelo mesmo disparo (HC5) e de sinais periódicos com período menor que 3 ms. A interpretação de que não há erro de código é do assistente e depende de revisão.
- **O que este diagnóstico mostra:** a seleção "tudo ou nada" (fica toda candidata creditada ao menos uma vez) **não seleciona** com entradas periódicas cujo período é menor que o alcance das candidatas. Em Gerstner et al. (1996, resumo), a seleção é gradual (regra hebbiana ao longo do desenvolvimento), não tudo ou nada. Isso não foi verificado no texto integral.
- **O que este diagnóstico não mostra:** nada sobre reacesso, seletividade ou representação. Essas perguntas não chegaram a ser testadas.

## Próximo passo

Decisão do responsável sobre um adendo exploratório (V0.15.1) ou o encerramento da V0.15 com este resultado. Nenhuma alteração constitutiva foi feita.

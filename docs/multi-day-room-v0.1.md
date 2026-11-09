# P0.3 — Sala em vários dias — v0.1

**Data:** 09/11/2026 · **Código:** `src/room/multi-day-room.js`, `src/room/multi-day-room-scenario.js` · **Testes:** `tests/multi-day-room.test.js`

## O que é
A mesma sala ao longo de dias civis **consecutivos**. Cada dia é o modelo de um dia já validado (`createRoomWorld`), com clima (céu aberto ou encoberto) e presença do objeto definidos por dia: lista explícita ou sorteio com semente declarada. Os mesmos seis transdutores da sala. Atende ao requisito N2 (variabilidade estruturada): as datas variam a geometria solar; o clima e o objeto variam por dia.

## Continuidade
| Grandeza | Na meia-noite | Como |
|---|---|---|
| Temperatura interna | **Contínua** (igualdade exata nos testes) | Cada dia começa na temperatura final do anterior |
| Lâmpada | **Contínua** | Decidida pela irradiância externa; só o primeiro dia registra o estado inicial |
| Temperatura e irradiância externas | **Salto quando o preset de clima muda** (ex.: 13,46 → 14,59 °C de céu aberto para encoberto) | Limite declarado do modelo: equivale a uma frente meteorológica instantânea à meia-noite. Sem mudança de preset, salto zero |
| Objeto opaco | Inserido ou removido **à meia-noite**, como intervenção do pesquisador registrada | — |

**Atenção para análises futuras:** os saltos de forçante externa coincidem com a meia-noite e podem ser constituídos por um motor como um "evento". Isso deve ser tratado como propriedade do modelo, não do mundo real, e controlado (por exemplo, com cronogramas sem mudança de preset).

## Validação (6 testes)
- Cada dia é idêntico ao modelo de um dia com a temperatura inicial transportada (temperatura, lâmpada, irradiância no piso).
- Temperatura interna e lâmpada contínuas em todas as meias-noites.
- Salto de forçante externa somente quando o preset muda; zero caso contrário.
- Eventos: mudanças de clima e intervenções no objeto à meia-noite, em ordem; um único estado inicial da lâmpada; tempo fora do domínio falha fechado.
- Cronograma determinístico pela semente; datas consecutivas, inclusive na virada de ano.
- Incidências entregues contêm só canal, instantes, identificador e medida; execução com pausa idêntica à contínua.

## Limites
Clima sintético periódico por dia, sem transições graduais entre presets; geometria estática; sem som, chuva ou vento; um único objeto que só muda à meia-noite.

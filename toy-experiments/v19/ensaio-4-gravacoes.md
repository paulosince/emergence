# V0.19 — Ensaio exploratório: 4 gravações completas no mesmo Sdom (registro)

**Data:** 27/11/2026. **Pedido do responsável:** "testar o que acontece com as 4 obras completas", com botões por apresentação; "o Sdom não pode zerar a cada apresentação".
**Sequência [R]:** Alciatore (183,6 s) → Baiocchi (191,3 s) → Kolodin (228,0 s) → Coleman (195,6 s), com 1 min de silêncio entre elas. As duas primeiras formam e as duas últimas voltam (desenho de 21–22/11).
**Código:** `motor/sessoes.py` (execução retomável), `motor/resumo_sessoes.py`, `motor/exportar_sessoes.py`. Página: botões "Instante zero" e "1–4".
**Natureza:** ensaio exploratório. As escolhas provisórias do motor (`piloto-10s.md`) continuam valendo e o registro prévio não foi congelado, então **não é o teste da V0.19**.
**Marcas:** [M] medido; [A] leitura do assistente.

## Execução [M]
- Tempo de máquina: ~1h35 por ouvido, um ouvido por núcleo. A borda é calculada em blocos e consumida na hora.
- **Memória:** dois processos foram mortos por falta de memória e retomados do estado salvo, com blocos menores. A retomada foi conferida antes, num teste curto: resultados idênticos com e sem pausa. O tamanho do bloco muda só a memória (a continuidade da borda é a da V0.18, com 0,5 s de aquecimento dos filtros).

## Por apresentação [M]

| Ouvido | Apresentação | Uints novas | Ramos novos | Disparos | Disparos de Uints que já existiam | Uints antigas que dispararam | Participações de ramos antigos | Incidências que integraram |
|---|---|---|---|---|---|---|---|---|
| E | 1 Alciatore | 46.485 | 300.580 | 862.860 | — | — | — | 0,86% |
| E | 2 Baiocchi | 5.996 | 61.786 | 882.652 | 99,87% | 16.012 de 46.485 | 99,2% | 0,79% |
| E | 3 Kolodin | 2.623 | 25.273 | 1.205.220 | 100,00% | 15.624 de 52.481 | 99,0% | 1,41% |
| E | 4 Coleman | 1.992 | 13.548 | 758.286 | 100,00% | 13.586 de 55.104 | 99,6% | 0,90% |
| D | 1 Alciatore | 45.270 | 293.037 | 782.562 | — | — | — | 0,88% |
| D | 2 Baiocchi | 6.082 | 59.794 | 951.240 | 99,89% | 15.285 de 45.270 | 98,8% | 1,01% |
| D | 3 Kolodin | 2.835 | 24.379 | 1.394.180 | 100,00% | 14.855 de 51.352 | 98,7% | 1,95% |
| D | 4 Coleman | 1.511 | 11.897 | 827.987 | 99,96% | 12.672 de 54.187 | 99,7% | 1,15% |

## Leitura [A] (a discutir; não é critério nem decisão)
1. **A criação cai a cada volta:** 46 mil Uints novas na primeira, 6 mil na segunda, 2,6 mil na terceira e 2 mil na quarta. A criação continua ligada, mas quase não acha par novo.
2. **O que integra passa quase todo pela malha antiga:** a partir da segunda gravação, ~99,9% dos disparos vêm de Uints que já existiam e ~99% das participações são de ramos antigos.
3. **A volta usa só uma parte da malha:** em cada apresentação, só ~25–33% das Uints antigas disparam. Elas não são as mesmas a cada vez; isso fica para medir.
4. **Mas quase tudo continua fracassando:** só ~1–2% das incidências integram. **Se "em sua maioria" for medido sobre as incidências, não se cumpre. Se for medido sobre o que integra, cumpre-se com folga.** A definição da medida é decisão do responsável.
5. **O risco já levantado continua:** com alcance só local, a malha espelha muito do espectro. Parte da reutilização sai quase por construção, porque as mesmas bandas acendem. A Chaconne, no mesmo Sdom, é o que vai mostrar quanto é genérico (compartilhado) e quanto é específico.
6. **A força dos ramos cai** (há mais punições que promoções; ver o piloto). Isso pode explicar a integração baixa e precisa ser acompanhado.

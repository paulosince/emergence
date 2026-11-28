# V0.19 — Ensaio com o nervo: 4 gravações completas no mesmo Sdom (registro)

**Data:** 27/11/2026. **Sequência [R]:** Alciatore → Baiocchi → Kolodin → Coleman, completas, com 1 min de silêncio entre elas, no mesmo Sdom.
**O que mudou em relação ao ensaio anterior [R]:**
- o nervo são as Upros que nascem nos pontos transdutivos (agrupadas no Cpro de cada faixa); cada uma cresce 790 cubos (15,8 mm) até a zona de entrada do núcleo, 1 cubo a cada ~12 reacessos do ponto;
- a velocidade é a basal (~53 ms);
- há Ustr na cóclea e na zona de entrada;
- as Uints só nascem no núcleo.

**Natureza:** ensaio exploratório. As escolhas provisórias do motor continuam valendo (`piloto-10s.md`).
**Código:** `motor/sdom.py`, `motor/sessoes.py`, `motor/resumo_sessoes.py`, `motor/exportar_sessoes.py`. Página: "Gravação do ensaio".

## Por apresentação [M]

| Ouvido | Apresentação | Upros do nervo que chegaram ao núcleo (acumulado, de 21.731) | Uints novas | Ramos novos | Disparos | Disparos de Uints antigas | Uints antigas que dispararam | Participações de ramos antigos | Incidências que integraram | Expiraram no ponto (Upro crescendo) |
|---|---|---|---|---|---|---|---|---|---|---|
| E | 1 Alciatore | 8.970 | 23.388 | 157.052 | 280.161 | — | — | — | 0,28% | 55,6% |
| E | 2 Baiocchi | 11.256 | 13.072 | 120.536 | 1.235.647 | 89,6% | 11.384 de 23.388 | 87,5% | 1,09% | 5,0% |
| E | 3 Kolodin | 11.848 | 6.534 | 54.364 | 1.807.932 | 99,5% | 15.986 de 36.460 | 98,2% | 2,12% | 1,8% |
| E | 4 Coleman | 12.319 | 3.608 | 27.131 | 1.054.215 | 99,0% | 15.258 de 42.994 | 98,1% | 1,28% | 1,9% |
| D | 1 Alciatore | 7.494 | 19.350 | 127.017 | 202.492 | — | — | — | 0,22% | 54,6% |
| D | 2 Baiocchi | 9.518 | 11.396 | 102.808 | 1.158.337 | 91,0% | 9.641 de 19.350 | 88,6% | 1,18% | 6,5% |
| D | 3 Kolodin | 10.209 | 6.378 | 50.932 | 1.675.966 | 99,3% | 13.757 de 30.746 | 97,9% | 2,37% | 3,0% |
| D | 4 Coleman | 10.735 | 3.336 | 24.332 | 977.112 | 99,0% | 12.872 de 37.124 | 98,4% | 1,39% | 2,2% |

## Leitura [A] (a discutir; não é critério nem decisão)
1. **Primeiro cresce o nervo; depois nasce a malha.** As primeiras Upros chegam ao núcleo por volta de 60 s da primeira gravação, e só então nascem Uints. Na primeira gravação, mais da metade das incidências expirou no próprio ponto.
2. **Metade das Upros não chegou ao núcleo em ~13 min de música:** 12.319 de 21.731 no ouvido E e 10.735 no D. Os pontos pouco reacessados (colunas de baixa sensibilidade, bandas pouco usadas pela Gymnopédie) não completam os ~9.500 reacessos.
3. **A criação continua por mais tempo do que no ensaio sem nervo:** 13 mil Uints novas na 2ª e 6,5 mil na 3ª, contra 6 mil e 2,6 mil antes. Upros que chegam tarde abrem pares novos.
4. **O que integra passa quase todo pela malha antiga:** ~89–91% na 2ª e ~99% na 3ª e na 4ª. Como no ensaio anterior, só ~1–2% das incidências integram.
5. **O nervo não muda quem coincide com quem** (o atraso é igual para todas as Upros). O que muda é **quando** cada parte do Sdom começa a se formar: depende de quanto aquele ponto foi usado.

## "Em sua maioria", medido pelas malhas percorridas [M, 27–28/11]

Rodado de novo, com a mesma malha (o motor é determinístico), só para contar as chegadas por ramo em cada apresentação (`motor/medida_maioria.py`). A medida é a fração das passagens de incidências por ramos que já funcionavam antes daquela apresentação.

| Ouvido | Baiocchi | Kolodin | Coleman |
|---|---|---|---|
| E | 93,9% | 98,1% | 99,3% |
| D | 94,5% | 97,9% | 99,2% |

Com o limiar de 2/3 [R, 28/11], a volta passa com folga. As que não integraram pararam quase todas **numa Uint sem integrar**. Ressalva: o desenho planar tende a espelhar o espectro, e a separação entre genérico e específico ainda não foi medida. Tabela completa e o que veio depois (a entrada volumétrica) em `entrada-volumetrica-e-fechamento.md`.

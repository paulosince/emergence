# V0.18 — Bateria de testes da transdução (proposta, a aprovar)

**Data:** 19/11/2026. **Pedido do responsável:** "antes de partirmos para a construção do Sdom, testemos ainda mais a transdução. Tons puros, tons separados por tempo, tom e semitom, voz… Delimite os testes, consiga as trilhas para testarmos (ou as crie, se puder) e me apresente sua sugestão."

**Dado × criado:** igual ao teste de 10 s. Dados: robô parado, Utrd auditiva (microfone + cóclea) e pontos transdutivos. Criado: nada.

**Marcas:** [R] responsável; [L] literatura (com grau de leitura); [A] proposta do assistente, a aprovar.

## 1. O que a bateria responde (e o que não responde)

- **Responde a prova necessária [A]:** quais diferenças do mundo continuam distinguíveis nas incidências, e com que resolução, comparada à humana. Quem mede é um observador externo, fora do robô, com acesso a todas as incidências: se nem ele separa duas condições, o Sdom também não separará.
- **Não responde a prova suficiente:** se o Sdom consegue formar relações com essas incidências. Essa só vem quando houver Sdom.
- **Cuidado com o determinismo [A]:** a borda é determinística. Sem variação nenhuma, qualquer diferença mínima no som daria incidências diferentes, e o observador "acertaria" tudo. Por isso cada condição é repetida 5 vezes com pequenas variações do próprio mundo: **±0,5 dB, ±0,5° e fase inicial ao acaso**. Duas condições só contam como separáveis se a diferença entre elas for maior que a variação entre repetições da mesma condição.

## 2. Os sete grupos (trilhas já geradas)

Trilhas em [estimulos/bateria/](estimulos/bateria/), geradas por [gerar_bateria.py](estimulos/bateria/gerar_bateria.py) (sinal de uma fonte, em pascal, com o nível no ponto da cabeça; a posição da fonte vai no [catálogo](estimulos/bateria/catalogo.json)). Total: **505 s de som, 727 trechos**.

| Grupo | Estímulos | O que mede | Referência humana |
|---|---|---|---|
| 1. Tons puros | 125, 250, 500, 1.000, 2.000, 4.000 e 8.000 Hz × 30, 50, 70 e 85 dB SPL; 300 ms, 5 repetições | Mapa de resposta (quais faixas e pontos acendem); reprodutibilidade | — |
| 2. Intensidade fina | 1 e 4 kHz, base de 40 e 70 dB, acréscimos de 0; 0,5; 1; 2; 3 e 6 dB | Menor diferença de volume separável | ~1 dB (Jesteadt, Wier e Green 1977; **de memória**, a conferir) |
| 3. Tom e semitom | Pares referência → comparação em 250, 1.000 e 4.000 Hz: +0,2%, +0,5%, +1%, semitom, tom, quinta, oitava (60 dB) | Menor diferença de frequência separável; relações harmônicas | ~0,2–0,5% perto de 1 kHz (Wier, Jesteadt e Green 1977; **de memória**, a conferir) |
| 4. Separação no tempo | (a) pausa de 0, 1, 2, 3, 5, 10 e 20 ms no meio de ruído e de tom de 1 kHz; (b) dois tons (500 e 2.000 Hz) com inícios separados por 0, 2, 5, 10, 20 e 40 ms, nas duas ordens; (c) pulsos de 1 kHz a 2, 5, 10, 20 e 50 por segundo | Menor pausa detectável; inícios distintos e ordem; ritmo | Pausa: ~2–3 ms em ruído largo; ordem: ~17–20 ms (Hirsh 1959); fusão em ~2 ms |
| 5. Direção | Ruído e tom de 500 Hz a 0, 1, 2, 5, 10, 20, 45 e 90° (1 m) | Menor diferença de direção separável | Diferença de chegada: ~10 µs perto de 1 kHz; nenhuma em tons acima de ~1,4–1,5 kHz (Brughera, Dunai e Hartmann 2013; resumo) |
| 6. Voz | Vogais sintéticas /a/, /i/, /u/ com frequência fundamental de 120 e 220 Hz (formantes de Peterson e Barney 1952, **de memória**); dois trechos de 10 s de leitura em português (LibriVox, domínio público) | Vogais distintas; fala real (ritmo, sílabas, altura) | — |
| 7. Duas fontes | 500 Hz à esquerda (30°) e 600 Hz à direita (−30°), juntos | Duas fontes no mesmo instante, em lugares diferentes | — |

**Trechos de voz:** Machado de Assis, *Papéis Avulsos*, "Advertência" (de 20 a 30 s), e Artur Azevedo, "A filha do patrão" (*Coleção LibriVox de Contos Brasileiros 001*, de 30 a 40 s). Leitores voluntários do LibriVox; MP3 de 64 kbit/s e 22 kHz (perdas de compressão declaradas). Fontes em [estimulos/README.md](estimulos/README.md).

## 3. O que o observador mede, por grupo [A]

1. **Reprodutibilidade:** semelhança entre as incidências das 5 repetições: quais pontos acendem e quando (janelas de 1 ms) e a variação dos instantes.
2. **Distância entre condições:** a mesma medida entre condições diferentes, comparada com a variação entre repetições. Resultado: **separável ou não**, e a **menor diferença separável** em cada dimensão (dB, %, ms, graus).
3. **Duas leituras separadas:** **onde** (quais pontos e faixas acendem) e **quando** (instantes, incluindo o travamento de fase). Assim se vê se a informação está no lugar, no tempo ou nos dois.
4. **Comparação com a régua humana:** razão entre a nossa menor diferença separável e a humana.
5. **Custo:** incidências por segundo em cada grupo.

## 4. O que a cena precisa ganhar para rodar a bateria

- **Fonte virtual em qualquer direção** (hoje só há os dois alto-falantes fixos): a mesma cabeça esférica, com a fonte a 1 m no plano dos ouvidos. Usada em todos os grupos (direção da repetição ≈ 0°, salvo no grupo 5 e no 7).
- **Duas fontes ao mesmo tempo** em posições diferentes (grupo 7).

## 5. O que fica de fora (declarado)

Sala com eco, ruído de fundo, distância e altura da fonte, fontes em movimento, e o efeito de um som sobre o seguinte (mascaramento para a frente: a borda não tem a adaptação em lei de potência de Bruce, Erfani e Zilany 2018).

## 6. Decisões para o responsável

1. Aprovar ou ajustar os grupos, os níveis e as 5 repetições.
2. Aprovar a forma de variação entre repetições (±0,5 dB, ±0,5°, fase ao acaso).
3. Definir, para cada grupo, o que é "suficiente" (ex.: até 2×, 5× ou 10× a resolução humana; ou "separa sim/não").
4. Confirmar a leitura integral das referências humanas antes de fechar os números de comparação.

## Fontes desta proposta (grau de leitura)

- Brughera, A., Dunai, L., e Hartmann, W. M. (2013). Human interaural time difference thresholds for sine tones: the high-frequency limit. *J. Acoust. Soc. Am.* 133(5), 2839–2855. https://doi.org/10.1121/1.4795778 — **resumo e introdução** (busca): limiar mínimo ~10 µs perto de 1 kHz (Klumpp e Eady 1956; Zwislocki e Feldman 1956); sem detecção acima de ~1,4–1,5 kHz.
- Hirsh, I. J. (1959). Auditory perception of temporal order. *J. Acoust. Soc. Am.* 31, 759–767 — **fontes secundárias** (ordem em ~17–20 ms; fusão em ~2 ms).
- Pausa em ruído largo, 2–3 ms (Plomp 1964; Green 1985) — **fontes secundárias**.
- Wier, Jesteadt e Green (1977), *J. Acoust. Soc. Am.* 61, 178–184; Jesteadt, Wier e Green (1977), *J. Acoust. Soc. Am.* 61, 169–177, https://doi.org/10.1121/1.381278 — **resumos**; os valores da tabela são **de memória**.
- Peterson, G. E., e Barney, H. L. (1952). Control methods used in a study of the vowels. *J. Acoust. Soc. Am.* 24, 175–184 — **de memória** (formantes).

## 7. Rodada (19/11/2026, com a proposta, a pedido do responsável: "rodar agora com a proposta")

Borda atual (sensibilidade por área, atenuação para som forte a 70 dB, janela de carregamento que se alonga). Código: [borda/rodar_bateria.py](borda/rodar_bateria.py). A cena ganhou a fonte virtual em qualquer direção e duas fontes ao mesmo tempo; a cóclea processa em pedaços de 10 s com continuidade exata (diferença para o processamento inteiro: ~10⁻¹⁷).

| Grupo | Duração | Incidências (esq. / dir.) [M] | Atenuação máx. |
|---|---|---|---|
| 1. Tons puros | 84 s | 12,2 M / 12,2 M | 10,4 dB (tons de 85 dB) |
| 2. Intensidade | 72 s | 10,8 M / 10,8 M | 3,5 dB |
| 3. Tom e semitom | 126 s | 16,8 M / 16,8 M | 0 |
| 4. Tempo | 126 s | 52,2 M / 52,2 M | 0 |
| 5. Direção | 48 s | 23,8 M / 21,1 M | 0 |
| 6. Voz | 42 s | 27,9 M / 27,9 M | 0,9 dB |
| 7. Duas fontes | 7,5 s | 2,4 M / 2,5 M | 0 |

Na página do Pages, cada grupo virou um botão, com a lista de condições para pular direto ao trecho. Na bateria não há o zoom de incidências individuais (só até 16 colunas por faixa). As incidências completas ficam em `borda/bateria/` (não versionadas). **Ainda não há medidas do observador**: são o próximo passo, depois dos critérios de "suficiente" do responsável.

## 8. Primeiras medidas do observador (19/11/2026; descritivas)

Código: [borda/observador_bateria.py](borda/observador_bateria.py); números: [borda/observador-bateria.json](borda/observador-bateria.json). Critério provisório do assistente: duas condições "separam" quando a diferença entre as médias passa de 2 desvios-padrão das repetições (ou, no padrão de pontos, quando a menor distância entre condições passa da maior distância entre repetições). Ouvido esquerdo, salvo na direção.

| Medida [M] | Resultado | Régua humana |
|---|---|---|
| Direção, ruído | separa **1°** de 0° (8,0 ± 2,6 µs contra 1,1 ± 1,6 µs) | ~1° (ângulo mínimo audível; ~10 µs) |
| Direção, tom de 500 Hz | separa **2°**; 1° não (4,6 ± 3,3 µs) | idem |
| Escala da diferença de chegada | ~1,5× a de Woodworth em todos os ângulos (ex.: 90°: 455 µs contra 375 µs) | coerente com a física de uma esfera em baixas frequências (de memória: ~3a/c·senθ; a conferir) |
| Frequência pelo lugar (quais pontos acendem) | **semitom** separa em 250, 1.000 e 4.000 Hz; **1%** separa em 1.000 e 4.000 Hz (por pouco); 0,5% e 0,2% não | ~0,2–0,5% perto de 1 kHz (de memória) |
| Frequência pelo tempo (período das incidências) | **inconclusivo**: o estimador do assistente mostra um viés sistemático de −2,5% a −3,6% ainda não explicado | — |
| Pausa em ruído | **3 ms** detectável (queda de 36% das incidências na janela); 1–2 ms não | 2–3 ms |
| Pausa em tom de 1 kHz | a pausa aparece como **rajada** na volta do som (mais incidências, não menos); a medida de queda não serve para tons | — |

**Limites:** a borda é determinística e a única variação é a do mundo (±0,5 dB, ±0,5°, fase); com ruído interno, as resoluções seriam piores. Intensidade, ordem dos inícios, ritmo, vogais, fala e duas fontes ainda não medidos.

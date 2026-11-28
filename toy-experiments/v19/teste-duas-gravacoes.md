# V0.19 — Teste de duas gravações nos três braços (60 s cada)

Teste para observação pedido por Paulo em 28/11:
- "os três" braços;
- "2 gravações da Gymnopédie, 60s cada";
- "Mantém o silêncio. Quais da gym… tanto faz";
- "Crie uma opção de cálculo contínuo e vejamos o que acontece, mas com opção de voltar para a anterior facilmente".

Não é a rodada "pra valer" e não testa a previsão registrada: as gravações são curtas e o desenho da rodada principal ainda não foi fechado. Os números estão **sem leitura**; a leitura fica com Paulo e Clara.

Marcas: [R] decisão do responsável · [M] medido nesta execução · [E] escolha de engenharia (Claudia).

## 1. O que rodou

- **Braços:**
  - faixa 790;
  - faixa 263;
  - compacta 263 (espiral virada, face a 50 cubos, grade 3 × 3 × 3).
  - A regra B vale nos três.
- **Sequência no mesmo Sdom:**
  - Alciatore, 0–60 s;
  - 60 s de silêncio;
  - Baiocchi, 0–60 s.
  - Ouvido esquerdo. As gravações foram escolha minha [E] (a primeira e a segunda do ensaio de 4 gravações).
- **Entrada contínua [R]** (`V19_BORDA=continua` no `teste_c.py`):
  - o som de cada apresentação é lido e passado pela cabeça e pelo microfone de uma vez;
  - a cóclea processa em pedaços guardando o estado dos filtros (`coclea.CocleaContinua`, a mesma da bateria da V0.18).
  - **Para voltar à forma anterior:** `V19_BORDA=blocos`, ou nada, porque é o padrão.
  - Conferido [M]: no modo contínuo, pedaços de 5 s e de 20 s dão as mesmas Uints, ramos e pares. Só os instantes diferem, em até 10⁻¹⁵ s (arredondamento).
  - Limitação: o modo contínuo não retoma de estado salvo. Se a execução parar, ela recomeça do início.

## 2. Contagens [M]

| | Faixa 790 | Faixa 263 | Compacta 263 |
|---|---|---|---|
| Uints novas · Alciatore | 1.345 | 12.782 | 11.997 |
| Uints novas · Baiocchi | 10.531 | 22.715 | 11.824 |
| Ramos novos · Alciatore / Baiocchi | 7.512 / 70.133 | 105.881 / 140.570 | 120.301 / 71.817 |
| Pares · que reutilizaram uma Uint | 14.657 · 2.766 | 60.159 · 24.427 | 40.422 · 16.557 |
| Disparos (total) | 77.573 | 876.003 | 433.777 |
| **Passagens por ramos que já existiam antes da Baiocchi** | **21,6%** | **95,0%** | **94,4%** |

A medida é a mesma do ensaio (`medida_maioria.py` [R 27/11]): das passagens de incidências por ramos durante a Baiocchi, a fração por ramos que já funcionavam antes dela começar.

Fato mecânico, não leitura: com o nervo de 790 cubos, as Upros ainda estavam crescendo. Aos 60 s da Alciatore, só 1.167 de 21.731 estavam prontas, então a maior parte da malha da faixa 790 nasceu durante a Baiocchi.

## 3. Registro por afastamento entre bandas, até o fim [M]

Pares entre chegadas que dividem um território: **disponíveis** · **com as duas Upros prontas** · **que coincidiram**.

| Afastamento | Faixa 790 | Faixa 263 | Compacta 263 |
|---|---|---|---|
| 0 | 31.318 · 7.385 · 7.380 | 31.318 · 13.762 · 13.758 | 7.711 · 3.147 · 3.146 |
| 1 | 670 · 146 · 146 | 670 · 267 · 267 | 19.322 · 9.045 · 9.033 |
| 2 | — | — | 6.469 · 2.974 · 2.950 |
| 3 | — | — | 289 · 92 · 92 |
| 4 | — | — | 3 · 0 · 0 |

## 4. Engenharia

- A faixa 790 foi morta uma vez por falta de memória: rodou em paralelo com o cálculo do som para a página. Foi refeita sozinha, do início.
- Tempo de máquina: compacta 263, 676 s; faixa 263, 700 s; faixa 790, 453 s.
- **Página:** estudo "Duas gravações · três braços". Exportação com um arquivo por braço (`visual/teste-d-<braço>.bin`), para o celular carregar só o braço aberto.
- **Som na página [R 28/11]:** "O microfone sumiu / E a fonte do som também… Não deveriam ter saído".
  - Nos estudos dos braços voltaram os alto-falantes, as ondas, os microfones e os fios.
  - Os pontos transdutivos do braço (faixa ou espiral) acendem com as incidências do ouvido E, calculadas como a entrada do motor no modo contínuo (`motor/som_visual.py`, quadros de 10 ms).
  - No teste de 60 s (modo blocos), essa luz vem do cálculo contínuo, que difere pouco do usado pelo motor naquele teste.
  - Na compacta, os fios vão do microfone ao centro de cada banda na espiral.
  - No silêncio entre gravações, tudo apaga.
  - Ainda sem áudio tocando nesses estudos.

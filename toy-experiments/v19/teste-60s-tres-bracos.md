# V0.19 — Teste de 60 s dos três braços (faixa 790, faixa 263, compacta 263)

Registro do teste para observação autorizado por Paulo em 28/11 ("Autorizo"; "Os três"; "Ouvido E, Alciatore 0–60 s"). Não é a rodada "pra valer" e não testa previsão registrada: não há previsão para este contraste (Paulo e Clara). Este texto descreve o que rodou e o que foi contado, **sem leitura**. A leitura fica com Paulo e Clara.

Marcas: [R] decisão do responsável · [M] medido nesta execução · [E] escolha de engenharia (Claudia), revisável.

## 1. O que rodou

- **Estímulo:** Gymnopédie n.º 1 (Alciatore), 0–60 s, ouvido esquerdo, blocos de borda de 20 s. Mesmo estado inicial nos três braços.
- **Regra B nos três [R]:** a Uint candidata nasce na superfície de entrada ou mais para dentro da cabeça, na caixa de busca do teste A × B.
- **O resto é o do ensaio planar:** coincidência, criação, crescimento de 1 cubo por ~12 coincidências, ganho de 0,0065 e punição de 1/60.

| Braço | Nervo (cubos) | Reacessos para a Upro ficar pronta | Chegadas | Ustr da entrada |
|---|---|---|---|---|
| Faixa 790 | 790 | 9.480 | plano atrás das pontas, mesmo (y, z) da origem | 5.552 (blocos 2 × 2; 4 Upros por Ustr) |
| Faixa 263 | 263 | 3.156 | idem | 5.552 |
| Compacta 263 | 263 | 3.156 | meia-esfera R = 44, face plana a 120 cubos da base da espiral (`coordenadas.compacta`) | 6.739 (grade 3 × 3 × 3; ~3,2 por Ustr) [R] |

**Arquivos (todos novos; `sdom_ab.py`, `teste_ab.py` e o motor histórico não mudaram):**
- `motor/sdom_c.py` e `motor/teste_c.py`: motor e executor.
  - O nervo é parâmetro.
  - Na compacta, a Uint nova vai para a Ustr de centro mais próximo; empate → menor índice.
  - A regra B usa a face plana na compacta e o plano atrás das pontas na faixa.
- `motor/medida_afastamento.py`: o registro por afastamento entre bandas.
- `motor/exportar_c.py`: a exportação para a página.

## 2. Conferências de engenharia [M]

- **Regressão:** a faixa 790, rodada com blocos de 5 s (como o teste B), repete **exatamente** o teste B nos primeiros 60 s: mesmas Uints, posições, instantes, pares e marcas do nervo.
- **Territórios 3D da compacta:** no teste de fumaça, todas as Uints ficaram a até 1,73 cubo (√3) da Ustr mais próxima, e nenhuma fora da meia-esfera ou atrás da face.
- **Comprimento do nervo na página:** nas 21.731 Upros da compacta, o comprimento da curva desenhada é igual ao comprimento de condução (263 cubos), com erro abaixo de 0,01%.

### 2.1. Achado lateral: o tamanho do bloco muda o resultado

O comentário dos executores diz "bloco só muda a memória, não o resultado". **Isso não vale.**
- Com blocos de 20 s, a faixa 790 se afasta do teste B (blocos de 5 s) a partir de 10,0 s, que é uma fronteira de bloco do teste B.
- A diferença começa nas marcas de crescimento do nervo, ou seja, nos próprios eventos de entrada.
- Causa provável [E, não conferida]: a borda recalcula os filtros a cada bloco com 0,5 s de aquecimento, em vez de continuar o estado exato.
- Efeito aqui: pequeno (1.345 × 1.343 Uints aos 60 s).
- **Os três braços usaram o mesmo bloco (20 s) e recebem exatamente os mesmos eventos**: as marcas do nervo são idênticas nos dois braços de 263. A comparação entre eles não é afetada.
- **Para a rodada "pra valer", é preciso fixar e declarar o bloco, ou tornar a borda contínua.** Fica para Paulo decidir.

## 3. Contagens aos 60 s [M]

| | Faixa 790 | Faixa 263 | Compacta 263 |
|---|---|---|---|
| Upros do nervo prontas (de 21.731) | 1.167 | 8.275 | 8.275 |
| Primeira Upro pronta | ~54 s | ~19,4 s | ~19,4 s |
| Uints candidatas | 1.345 | 12.785 | 11.996 |
| — para dentro da folha/face (regra B) | 930 | 8.514 | 11.573 |
| Ramos · que chegaram à Uint | 7.512 · 6.846 | 105.884 · 88.189 | 120.308 · 72.451 |
| Pares (primeira coincidência) · que reutilizaram uma Uint | 1.386 · 41 | 14.994 · 2.205 | 16.159 · 4.154 |
| Uints que dispararam · disparos | 0 · 0 | 2.963 · 22.023 | 1.653 · 10.259 |
| Tempo de máquina | 170 s | 317 s | 295 s |

Os dois braços de 263 recebem os mesmos eventos e têm as mesmas Upros prontas nos mesmos instantes. Entre eles, só mudam as chegadas, os territórios e a densidade de Ustr. A diferença de densidade foi declarada como parte do efeito conjunto [R 28/11].

## 4. Registro por afastamento entre bandas [M]

Pares entre chegadas que dividem um território: **disponíveis** (geometria) · **com as duas Upros prontas** até 60 s · **que coincidiram** (o motor criou a Uint).

| Afastamento | Faixa 790 | Faixa 263 | Compacta 263 |
|---|---|---|---|
| 0 | 31.318 · 1.380 · 1.359 | 31.318 · 11.225 · 11.221 | 7.711 · 2.749 · 2.747 |
| 1 | 670 · 29 · 27 | 670 · 227 · 227 | 19.322 · 7.703 · 7.676 |
| 2 | — | — | 6.469 · 2.466 · 2.434 |
| 3 | — | — | 289 · 69 · 69 |
| 4 | — | — | 3 · 0 · 0 |

Observação de método, sem leitura: nos três braços, **quase todo par com as duas Upros prontas coincidiu** (≥ 98%). Neste trecho, a contagem "coincidiram" acompanha "ambas prontas" e pode separar pouco os braços. Talvez seja melhor contar também as coincidências repetidas do mesmo par, ou o que acontece depois da Uint (ramos que chegam, disparos). Isso fica para Clara e Paulo.

## 5. Visualização [R 28/11: "Todos 'orgânicos', se possível"]

- **Nervo:** nos três braços, cada Upro do nervo é uma curva cujo **comprimento desenhado é o comprimento de condução** do motor.
  - Na faixa, a curva é quase reta: a reta já tem 790 ou 263 cubos, e a curva mínima acrescenta menos de 1%.
  - Na compacta, a reta vai de 20 a 204 cubos, e a curva se alonga até 263.
  - O caminho é desenho: o motor guarda comprimento e atraso, não trajeto.
  - O crescimento aparece em décimos, pelas marcas que o motor registra.
- **Origens:** faixa nas faixas e espiral aberta na compacta. A espiral é geometria do instante zero (`coordenadas.espiral`); o motor não usa a posição da origem.
- **Ustr:** só as que o motor usa (zona de entrada). As camadas do menu ⋯ valem para as do braço aberto.
- **Página:** estudo "Faixa × compacta · três braços", com o botão "Braço" no player e as vistas "Entrada do braço" e "Nervo do braço".
- A página foi conferida só por sintaxe (`node --check`), porque não há navegador neste ambiente. A curva do nervo foi conferida à parte, em node, com os dados exportados.

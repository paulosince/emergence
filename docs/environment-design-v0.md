# Ambiente do robô — desenho v0 (discussão)

Data: 10/11/2026. Situação: em discussão.

## Proposta do responsável (10/11/2026)
- Sala nivelada, com janela; sol e ambiente do lado de fora.
- Objetos no chão: peças de Lego, bolinhas.
- Um ratinho que aparece de vez em quando.

## O que já existe e pode ser reaproveitado (mundo da sala, src/room)
Sala de 6 × 4 × 2,8 m; janela ao norte de 2 m de largura, peitoril a 0,9 m, 1,3 m de altura, transmitância 0,7; porta fechada; caixa opaca de 0,5 × 0,5 × 0,9 m; geometria solar analítica para a latitude de Guarulhos; clima; balanço térmico de uma zona; mancha de sol no piso; lâmpada. Seria usado como forçante de luz e temperatura da nova simulação (a física do robô e dos objetos vai para o MuJoCo).

## Pontos levantados
- Com os olhos a ~37 cm e o peitoril a 0,9 m, o robô não vê o lado de fora na horizontal: vê o céu ao inclinar a cabeça e a mancha de sol no chão.
- Escala: a sala tem ~15 vezes a altura do robô.
- Peça de Lego 2 × 4: ~32 × 16 × 11 mm, ~2–3 g; bolinha de pingue-pongue: 40 mm, ~2,7 g (conhecimento geral). A mão de 5 cm com 3 dedos consegue pegar as duas.
- O rato é um agente com dinâmica própria (andar, parar, fugir, chiar, corpo quente): precisa de modelo de comportamento e de decisão sobre se ele reage ao robô.

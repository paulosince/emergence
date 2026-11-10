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

## Decisões do responsável (10/11/2026)
1. Janela **mais baixa** (o robô deve ver o lado de fora).
2. Sala **menor**.
3. Objetos **configuráveis**, pré-configurados com 3 ou 4.
4. Rato: **reage ao robô, explora, provoca; aparece toda noite procurando comida; mexe nos objetos**.
5. Lâmpada **acende ao escurecer e apaga às 22h00**.
6. **Sem recolocar** objetos.

## Valores propostos para confirmar (nossos)
- Sala 3,0 × 2,5 × 2,5 m; janela com peitoril a 0,20 m, 1,2 m de largura × 1,5 m de altura, fechada (som de fora atenuado).
- Objetos padrão: 2 peças de Lego 2 × 4 de cores diferentes, 1 bolinha de pingue-pongue, 1 bolinha de borracha maciça (~30 mm, ~15 g).
- Rato (valores de conhecimento geral, confiança moderada): corpo ~8 cm sem a cauda, ~20 g, 37 °C; chiados audíveis de poucos kHz (as vocalizações ultrassônicas ficam acima do que microfones a 48 kHz registram); entra por um buraco no rodapé após as 22h00; comportamento em estados (explorar, farejar comida, aproximar-se do robô parado, fugir do robô em movimento, empurrar objetos).

## Decisões do responsável (10/11/2026, continuação)
1. **Comida:** alguém (invisível, fora da sala) empurra um pedaço de queijo por uma fresta da porta, **sempre ao anoitecer**.
2. **Luz de fora à noite:** a **lua**.
3. **Sono do robô:** (a) o ciclo do robô segue a luz e o rato aparece no começo da noite, antes de o robô dormir; e (b) estímulos fortes durante o sono podem acordá-lo (despertar sensorial).

## Consequências e notas (nossas)
- O robô não tem olfato: o queijo é para ele um objeto que aparece, é tocado, visto e some (comido). O rato o encontra pelo cheiro (modelo interno do rato).
- Lua: precisa de um modelo de fase (ciclo sinódico de ~29,53 dias) e posição; luz de lua cheia é da ordem de décimos de lux, contra dezenas de milhares de lux do sol (ordens de grandeza de conhecimento geral; confiança moderada).
- O rato chega às 22h00 (lâmpada apaga); o sono do robô precisa começar depois disso pelo arrastamento do relógio à luz.
- Despertar sensorial: no motor, incidências de magnitude acima de um limiar atravessam o bloqueio do sono e empurram o interruptor para a vigília (paralelo: sistemas de despertar e interruptor biestável, Saper et al. 2001, já usado no motor). A desenhar.

## Passo 2 implementado: sala no MuJoCo (10/11/2026)
Arquivos: `src/robot/world/room.js` (paredes, janela, porta, buraco, objetos, queijo), `src/robot/world/sky.js` (sol, lua, lâmpada), `src/robot/world/robot-world.js` (robô + sala + céu; evento do queijo), `tests/robot-world.test.js`.
- **Sala** de 3,0 m (norte–sul) × 2,5 m (leste–oeste) × 2,5 m, paredes de 10 cm. Robô no centro, de frente para o norte.
- **Janela baixa** na parede norte: peitoril a 0,20 m, 1,2 × 1,5 m, vidro (colide, quase transparente). A linha de visão horizontal à altura dos olhos (0,37 m) passa pela janela.
- **Porta** na parede oeste, 0,8 × 2,0 m, fechada, com **fresta de 1 cm** embaixo. **Buraco do rato** de 4 × 3 cm no rodapé da parede leste.
- **Objetos padrão** em posições semeadas, longe do robô: 2 peças tipo Lego 2 × 4 (vermelha e azul, 2,5 g), bolinha de pingue-pongue (40 mm, 2,7 g), bolinha maciça de borracha (30 mm, 15 g). Lista configurável.
- **Queijo:** pedaço de 3 × 2 × 0,8 cm (mais fino que a fresta) empurrado por baixo da porta ao anoitecer, uma vez por dia; termina dentro da sala (testado).
- **Céu:** sol pela geometria solar já existente (latitude de Guarulhos); **lua** com fase pela lunação média (29,53 dias, a partir de uma lua nova de referência em 06/01/2000 18h14 UTC, **a verificar**) e posição aproximada pelo caminho do sol atrasado pela fase (perda declarada: sem declinação própria da lua); **lâmpada** acende ao pôr do sol e apaga às 22h. Iluminâncias de ordem de grandeza declaradas (sol 110.000 lux no zênite, lua cheia 0,25 lux, lâmpada 300 lux), sem fonte.
- Ainda não: imagem das câmeras (passo 3), temperatura do ar e das superfícies, o rato (passo 5), o lado de fora visível além do chão.

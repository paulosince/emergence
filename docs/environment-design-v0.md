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

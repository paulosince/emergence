# Interface de exploração da V19 — proposta para aprovação de Paulo

Claudinha, reorganize a página como um álbum de testes. A referência é a experiência de escolher uma faixa, explorar a capa durante a reprodução e acompanhar a letra sincronizada. Aqui a capa é a cena 3D existente e a letra é o diário do motor.

## Composição no celular, de cima para baixo

| Região | Conteúdo e comportamento |
|---|---|
| Cabeçalho | Voltar à lista de testes · V19 |
| Capa | Cena 3D interativa em destaque. Giro e zoom funcionam durante a reprodução e a pausa. Ações de vista lateral e escala ficam no menu da cena. |
| Card da hipótese | Título do teste, condição e pergunta científica. Para A/B, usar “Permitir profundidade muda quais Uints chegam a integrar?” e explicar em uma frase a condição selecionada. |
| Transporte | Uma barra de tempo com tempo decorrido e duração. Um único botão central alterna reproduzir e pausar. |
| Diário | Acontecimento atual destacado, anterior e seguinte discretos. Tocar em um acontecimento com horário registrado leva ao instante correspondente. O diário pode ser recolhido. |
| Outros testes | Lista com título, duração e uma ação de play por card. A faixa ativa indica reprodução ou pausa. |

No desktop, colocar capa e transporte à esquerda e diário à direita, com a lista abaixo. No celular, preservar a largura da cena e a rolagem vertical da página fora da cena.

## Faixas e estados

Mostrar Folha fixa e Profundidade local como duas faixas de um mesmo estudo, ambas com 1:30. Oferecer troca de condição no mesmo instante preservando câmera, zoom e estado de reprodução. Escolher outro estudo abre seu card e sua hipótese. Todos os botões operam o mesmo player e só uma faixa roda por vez. Quando a rodada principal tiver dados disponíveis, destacá-la acima dos pilotos. Até lá, identificá-la como planejada, sem play.

Ao carregar, mostrar o estado do carregamento. Em caso de falha, oferecer nova tentativa. Ao terminar, oferecer repetir. Velocidade, vistas e snapshot ficam em ações secundárias. Usar controles acessíveis por teclado, nomes de ação em português e alvos confortáveis no iPhone.

## Fidelidade científica e revisão

Usar tempos e posições exportados pelo motor. Distinguir nascimento de Uint candidata, chegada de ramo e primeiro disparo. Quando o diário agrupar eventos, rotular o intervalo e a contagem. Preservar a proporção física dos eixos, inclusive quando B parecer plana. Antes da aprovação visual, apresentar o mesmo instante em A e B e demonstrar no iPhone reprodução, pausa, rotação, troca de condição e salto pelo diário.

Estado: proposta de design da Clara para revisão de Paulo. Escopo: interface e reprodução dos registros existentes.
# V0.19 — Proposta de coordenadas da entrada auditiva

**Para Claudia, de Clara, para supervisão de Paulo · 28/11/2026.** Documento de desenho. A geometria abaixo é candidata a um novo piloto. O pré-registro A/B descreve o piloto anterior. A rodada principal aguarda decisão de Paulo.

## Pergunta de Paulo

Podemos compactar a entrada auditiva e preservar a ordem grave–agudo, dando às bandas intermediárias acesso ao interior de um volume? A consequência investigável é se muda quem pode coincidir, quem efetivamente coincide e quais Uints chegam a integrar. A associação especial com fala humana é uma hipótese de Paulo. Satie permite investigar a geometria e a música apresentada. Uma inferência específica sobre fala exigiria outro ensaio.

## Três conjuntos de coordenadas por ouvido

1. **Origem na Utrd.** Proposta de Clara: dispor a faixa existente em espiral tridimensional aberta, com base e ápice separados. Manter identificação de banda, frequência, posição na faixa, sensibilidade e resposta temporal da V18. A posição na espiral deriva da ordem já existente. A espiral organiza a origem e não determina por translação o destino.
2. **Chegada das Upros.** Reservar um volume compacto por ouvido, junto à entrada do feixe no Sdom. A geometria candidata é uma meia-esfera preenchível voltada para o interior da cabeça. A orientação para dentro define o eixo normal à face plana. Para a tonotopia, usar um segundo eixo, tangente à face plana, atravessando o volume de um lado ao outro. Espelhar a geometria entre os ouvidos, preservando os mesmos identificadores de banda. As bandas graves ficam em direção a um extremo lateral, as agudas ao extremo oposto e as intermediárias têm acesso à parte interna. Ordenar pela frequência ao longo desse eixo. As seções transversais são regiões de chegada e podem conter pontos em profundidades diferentes. Documentar como os pontos de cada banda são distribuídos na seção. Não concentrar toda uma banda em um único ponto. Preservar um ponto de chegada por Upro de entrada neste contraste.
3. **Territórios e constituição.** Distribuir os centros das Ustr pela região receptora segundo uma regra declarada, com territórios exclusivos e sem comunicação entre Ustr. Atribuir cada chegada a uma Ustr por uma regra espacial determinística. Fixar o tratamento das bordas, ocupação e empates. O agrupamento inicial das Ustr e a projeção possível das Upros são dados do modelo. As Upros de entrada crescem sob a regra vigente. As posições das Uints resultam dos acontecimentos e da regra de constituição. Usar a meia-esfera para especificar a entrada; uma barreira que confine todas as futuras Uints a ela seria hipótese adicional.

## O que Claudia precisa explicitar antes do piloto

Apresentar a parametrização em cubos: centro de cada região, orientação dos eixos, raio, passo e altura da espiral, espaçamento entre cortes de frequência, distribuição dentro de cada corte e número de Ustr. Declarar se “meio da faixa” significa o centro da sequência das 64 bandas da V18 ou uma frequência escolhida em Hz. Minha proposta inicial é usar a ordem existente das bandas. Uma densidade especial para a fala requer decisão própria. Perto das extremidades, os cortes têm menos espaço: verificar capacidade para os pontos efetivos de cada banda, colisões por arredondamento e concentração involuntária. Levar as escolhas numéricas e suas consequências a Paulo para revisão.

**Percurso e atraso.** O comprimento anterior de 790 cubos corresponde ao trajeto da Upro de entrada. Paulo sugeriu cerca de um terço; 263 cubos é um valor candidato. Especificar se será comprimento de percurso comum, valor de referência ou distância até o centro da região. Para cada Upro, guardar origem, chegada, comprimento que o motor usa, atraso e reacessos até completar o crescimento. Um percurso físico deve comportar a distância entre suas pontas. Se os comprimentos variarem entre bandas, quantificar a dispersão dos atrasos relativos. À velocidade basal atual, cinco cubos de diferença correspondem a cerca de 0,33 ms, comparáveis à janela de coincidência de 0,3 ms. O encurtamento também reduz os reacessos necessários para completar o percurso.

## Auditoria geométrica antes do som

- Mostrar, com escala comum e vista lateral, a Utrd, os destinos potenciais e as Ustr iniciais. Distinguir destinos potenciais das Upros já crescidas. Durante o piloto, distinguir esses elementos das Uints realmente constituídas.
- Entregar uma matriz banda × banda. Para cada par, contar os territórios aos quais chegam Upros de ambas. Na diagonal, exigir duas Upros distintas da mesma banda para contar uma oportunidade de par. Entregar também o número de pares distintos possíveis por par de bandas. Identificar extremos que se tornaram vizinhos, vazios e eventuais concentrações.
- Por banda, informar número de pontos de origem, Upros previstas, Ustr acessíveis, parceiros distintos e distribuição de comprimentos e atrasos. Mostrar também parceiros por Upro: bandas com mais pontos na V18 podem produzir maiores totais só por essa razão.
- Comparar a matriz da projeção em faixa com a matriz compacta. A proximidade entre voltas na Utrd, por si só, não autoriza coincidência: a oportunidade depende da chegada ao mesmo território no Sdom. O centro da meia-esfera pode ter mais direções disponíveis sem apresentar menor distância entre vizinhos. Medir ambos separadamente.

## Contraste e interpretação

Para separar encurtamento de reorganização da entrada, proposta para decisão de Paulo: faixa histórica a 790 cubos, mesma faixa a 263 e projeção compacta com percurso controlado em torno da referência de 263. Usar a mesma regra de posicionamento das Uints em todos os braços comparados; declarar qual variante histórica serve de controle. Manter estímulo, estado inicial, plasticidade e regra territorial comparáveis. Se a projeção compacta mudar também a distribuição dos atrasos ou o momento em que as Upros ficam prontas, descrever o resultado como efeito conjunto. Isolar especificamente a forma da Utrd exigiria um contraste adicional com destinos e tempos idênticos.

Acompanhar a sequência de oportunidades geométricas, coincidências observadas, ramos funcionais e integração efetiva. Uma malha que já parece compacta antes da primeira incidência demonstra compactação da entrada. Para atribuir organização à história do Sdom, rastrear as relações constituídas depois e sua reutilização na reapresentação. A auditoria inicial precede a revisão de Paulo e a autorização de um novo piloto.

## Rastreabilidade

- [Motor do piloto histórico](motor/teste_ab.py) e [pré-registro folha × profundidade](preregistro-folha-x-profundidade.md).
- [Potrusil et al., 2020](https://pubmed.ncbi.nlm.nih.gov/32535276/) — trajetórias reconstruídas de feixes do nervo coclear humano.
- [Muniak et al., 2013](https://pubmed.ncbi.nlm.nih.gov/23047723/) — projeção tonotópica e lâminas de isofrequência no núcleo coclear de camundongos. Fundamenta a distinção entre mapa de origem e mapa de chegada. A meia-esfera e o eixo com bandas intermediárias no interior são hipóteses de desenho do robô.

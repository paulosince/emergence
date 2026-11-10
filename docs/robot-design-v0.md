# Robô (sistema) — desenho v0 (discussão)

Data: 10/11/2026. Situação: **em discussão; nada implementado.**

## Decisão do responsável (10/11/2026)
"Vamos refazer tudo. Preservaremos apenas o domínio representacional." Mundos, sensores e cenários atuais deixam de ser a base; o motor (domínio) é preservado.

## Proposta do responsável
- Corpo: uma "caixa" com dois pneus laterais; o equilíbrio é mantido por **reflexo**.
- Braços com três dedos.
- Pescoço; a cabeça são duas câmeras; microfones dos lados, como ouvidos.

## Crítica e pontos em aberto
Ver a conversa de 10/11/2026; os pontos aprovados serão registrados aqui.

## Decisões do responsável (10/11/2026)
1. **Dimensões:** 40 cm de altura total; caixa cúbica de 25 cm; braços proporcionais; pneus de 15 cm de diâmetro e 5 cm de largura.
2. **Reflexos:** o domínio **recebe as incidências dos reflexos** (o que corrigem e quanto esforço fazem), não só as consequências.
3. **Origem dos movimentos nesta fase:** reflexos primitivos e movimentos espontâneos por marca-passos.
4. **Sensores:** câmeras e microfones comuns; na audição, um **mecanismo de cóclea em hardware** (banco de faixas de frequência) entre o microfone e as Utrd.

## Consequências geométricas (cálculo nosso, a confirmar)
- Eixo das rodas a 7,5 cm do chão. A caixa de 25 cm não pode ficar centrada no eixo (iria 5 cm abaixo do chão). Com 2,5 cm de vão livre, a caixa vai de 2,5 a 27,5 cm, e o eixo fica 5 cm acima da base: o centro de massa fica acima do eixo, o que é um pêndulo invertido, coerente com o equilíbrio por reflexo.
- Sobram 12,5 cm para pescoço e cabeça: câmeras entre ~35 e 38 cm do chão.
- Escala: uma mesa comum (~75 cm) fica muito acima dos olhos; o robô veria só o tampo por baixo e as pernas. O mundo precisa ser desenhado nessa escala.
- Proposta de braços: ombros no topo lateral da caixa (~25 cm), braço 12 cm + antebraço 12 cm + mão 5 cm (~29 cm), para alcançar o chão à frente das rodas e um pouco acima da cabeça.
- Microfones nas laterais da cabeça: com 10 cm entre eles, a maior diferença de tempo entre os ouvidos é ~0,29 ms (0,10 m ÷ 343 m/s).

## Geometria aprovada (10/11/2026)
Caixa de 2,5 a 27,5 cm do chão, eixo 5 cm acima da base; câmeras a ~35–38 cm; braço 12 cm + antebraço 12 cm + mão 5 cm, ombros no topo lateral da caixa.

## Pesquisa de mercado para o robô físico (10/11/2026; resumos de páginas de busca, preços a confirmar com os vendedores)
**Visão (câmera comum):** módulos baratos como o OV2640 (usado com ESP32) capturam em escala de cinza a 160 × 120 (QQVGA), documentado no driver CircuitPython e nas amostras do esp32-camera; resoluções menores saem por média de blocos em software, à maneira da convergência retina → células ganglionares. Câmera de eventos existe (iniVation DVXplorer Micro, € 2.400 na tarifa acadêmica; DVXplorer, € 3.900 comercial), adiada por escolha do responsável.
**Audição (cóclea):** a cóclea de silício existiu como protótipo (Dynamic Audio Sensor, vendido em protótipo pela inilabs; versão binaural com 64 faixas por ouvido, IEEE JSSC 51(11), 2016), mas não encontramos produto à venda hoje. Caminho prático: microfone + microcontrolador com banco de filtros gamatone (4ª ordem, faixas pela escala ERB, modelo de Patterson) — por exemplo Teensy (biblioteca de áudio com instruções DSP); não há objeto gamatone pronto, teria de ser escrito.
**Riqueza com 32–64 faixas:** reconhecimento de fala quase perfeito com só 3–4 faixas em silêncio (Shannon et al. 1995, *Science* 270, 303–304; resumo lido); ouvintes normais usam até ~20 canais em tarefas difíceis (artigo de 2010, citação secundária). 64 faixas por ouvido = o mesmo número da cóclea de silício binaural.
**Pele:**
- Pontas dos dedos: XELA uSkin (taxels magnéticos de 3 eixos, força normal e tangencial; patches de 4 a 24 taxels; preço só sob consulta) ou sensores por imagem (DIGIT, desenho aberto, US$ 300 em 2021 pela GelSight; GelSight Mini).
- Palma, braços e caixa: matrizes de FSR (Interlink; precisão típica de ±10–25%; Loomia vende matrizes para superfícies curvas) ou matriz caseira de Velostat entre linhas e colunas de cobre (barata; exige correção de diafonia e calibração; projetos abertos como RSkin).

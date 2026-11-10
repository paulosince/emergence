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

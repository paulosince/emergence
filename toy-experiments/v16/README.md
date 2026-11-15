# EMERGENCE V0.16 — implementação experimental inicial

**Estado:** código publicado; **execução, testes e validação empírica não confirmados nesta sessão**.
**Escopo:** transdução visual discreta, recrutamento de vias já fornecidas, propagação 3D com atraso físico, integração por coincidência e rastreabilidade. Não investiga constituição autônoma do Sdom, representação ou consciência.

## Execução

Requer Node.js com suporte a módulos ESM e `node:test`.

- `node --test toy-experiments/v16/engine.test.mjs`
- `node toy-experiments/v16/run.mjs`

O programa imprime resumos de três condições: caule presente, ausente e deslocado. **Nenhum resultado foi antecipado ou inserido no código.** Se não houver disparos, registrar zero; não ajustar automaticamente parâmetros para produzir disparos.

## Fronteiras e decisões

- As câmeras são duas projeções geométricas simplificadas da mesma cena; 60 amostras por segundo por câmera. Não são imagens de câmeras físicas, nem modelo fotométrico validado.
- As Utrd recebem apenas intensidades numéricas por pixel; rótulos de objeto não entram no motor.
- Uma Utrd pode ter vários limiares; cada limiar possui uma Upro específica já fornecida. A quantidade de Upros recrutadas pode crescer com intensidade, sem ganho individual artificial.
- Cada emissão percorre **todas as Upros elegíveis da origem**. Para Utrd, “elegível” significa o limiar físico que emitiu, não escolha por destino. Uma Uint emite por todas as saídas.
- Cada Upro tem comprimento euclidiano e velocidade; o atraso é distância/velocidade. Alterações de velocidade valem para **emissões futuras**.
- Uma Uint integra no máximo uma chegada recente por origem; exige ao menos duas origens distintas e soma >= limiar.
- A malha inicial de demonstração é **exógena, aleatória com semente fixa, independente da cena**. Não deve ser chamada de estrutura emergente. A distribuição das Uint é aleatória e não uma predição HCMT.
- A emissão implementada é por cruzamento ascendente de limiar; uma alternativa sustentada está disponível no motor, mas **somente reavalia emissões quando chegam amostras**. Não equivale a um oscilador temporal contínuo.
- A janela retangular é uma escolha candidata. Confiança=1 e modulação=1 no runner; não há aprendizado, poda, estabilidade ou mecanismo de Pcrt.
- Não há folhas HCMT materiais. Para examiná-las, derivar posteriormente visões temporais dos logs de chegada/disparo, sem acrescentar eventos à dinâmica.

## Limitações relevantes antes de interpretar resultados

1. **Topologia aleatória:** com apenas quatro origens por Uint e janelas estreitas, ausência de coincidência é plausível e não refuta a hipótese geral.
2. **Amostragem visual:** uma cena estática com emissão por transição produz atividade inicial, não 60 pulsos por segundo. Não inventar atividade sustentada.
3. **Física simplificada:** esfera e cilindro não reproduzem a fotometria, oclusões complexas, retina, câmera real ou variações de luz.
4. **Geometria de Utrd:** posições na malha são coordenadas experimentais de canais, não posições anatômicas.
5. **Refratariedade:** definida por Uint; não há refratariedade das vias Utrd nesta versão.
6. **Soma e janela:** a contribuição permanece constante dentro da janela. Não se alegue equivalência com integração exponencial.
7. **Validação:** testes automatizados foram escritos, mas a execução não foi verificada nesta sessão.
8. **Hipótese:** nenhuma assinatura geométrica específica do Sdom é garantida por este contrato; observar seletividade e dependência de atrasos, não silhueta da maçã.

## Auditoria de não substituição

Buscar no código quaisquer rotinas que: (a) leiam `stem` ou outras etiquetas dentro do motor; (b) criem Uint/Upro em função de um evento esperado; (c) alterem atrasos para favorecer coincidências; (d) adicionem disparos na visualização sem evento correspondente; (e) usem índices para reconhecer um estímulo. A presença de qualquer uma invalida a condição principal.

O repositório TEMPO permanece fora do escopo e não foi alterado.

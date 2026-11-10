# Robô experimental — especificação v1 (simulação)

Data: 10/11/2026. Base: CLEAR Robotics V0.7 (outra conversa; revisão em [robot-spec-v0.7-review.md](robot-spec-v0.7-review.md)) + decisões desta sessão. **Diretrizes do responsável (10/11/2026):** ignorar custos por ora; só simulação nesta etapa; considerar o que o experimento precisa, sem concessões; o robô precisa poder se tocar. Nos conflitos da revisão, valem as decisões desta sessão.

Situação: **aprovada com as decisões de 10/11/2026 (seção 7)**. Itens marcados [Decisão] esperam o responsável.

## 1. Fronteiras (da V0.7, mantidas)
Sistema físico S (corpo, ambiente, reflexos, proteções) · Utrd · processos constitutivos (Pcrt) · Sdom. Começa sem nenhuma representação; o Sdom não é um objeto criado de antemão (v43 L77). Sem semântica injetada; identificadores opacos para o domínio; nomes de modalidade só na documentação.

## 2. Corpo
- Altura total 40 cm; tronco cúbico de 25 cm (2,5–27,5 cm do chão); rodas de 15 cm × 5 cm, eixo 5 cm acima da base; sem apoio permanente; contenção externa disponível na simulação.
- **Braços (alcance para tocar o próprio corpo):** ombro com 3 eixos (flexão, abdução, rotação), cotovelo 1, punho 2; braço 12 cm, antebraço 12 cm, mão 5 cm. Requisito verificável: as pontas dos dedos de cada mão alcançam as faces frontal, lateral do mesmo lado e superior do tronco, a outra mão e o rosto.
- **Mãos:** 3 dedos, cada um com 2 falanges acopladas por tendão; um atuador por dedo com tambor duplo e tendões antagonistas (V0.7).
- **Pescoço:** guinada e arfagem. [Decisão] rolagem.
- **Olhos:** duas câmeras em tubos. [Decisão] movimento próprio dos olhos (convergência e sacadas), como na biologia, ou câmeras fixas na cabeça (V0.7).
- Atuadores: 2 rodas + 2 × (3 + 1 + 2) braços + 6 dedos + 2 pescoço = **22** (+1 rolagem do pescoço, +2 a 4 nos olhos, conforme as decisões).

## 3. Canais sensoriais (o que o experimento precisa)
| Sentido | Especificação | Origem |
|---|---|---|
| Visão | 2 câmeras, 320 × 240, cor, 30 Hz; granularidade das Utrd configurável (ex.: campos receptivos por blocos 4 × 4 → 80 × 60 por olho); emissão só acima de variação mínima, magnitude proporcional à variação | V0.7 + revisão |
| Audição | 2 microfones sincronizados no mesmo conversor, 48 kHz; cóclea de 64 faixas por ouvido (gamatone de 4ª ordem, escala ERB); uma Utrd por faixa | decisões da sessão |
| Tato | pele no corpo inteiro: pontas dos dedos densas (espaçamento ~2–3 mm), falanges e palmas (~5–8 mm), braços (~15–20 mm), tronco em todas as faces e cabeça (~20–30 mm); pressão graduada; leitura nula, ausente e sensor com defeito distintas | revisão (limites do corpo) |
| Propriocepção | por articulação: ângulo, velocidade, comando aplicado, corrente/torque; por tendão: tensão | V0.7 |
| Vestíbulo | IMU de 6 eixos (aceleração e velocidade angular) | V0.7 |
| Interocepção | tensão, corrente e carga da bateria; temperatura dos motores e da eletrônica | V0.7 + sessão |
| Eferência | comandos de cada fonte (reflexos, movimentos espontâneos, mecanismos experimentais) como incidências para o domínio | decisão da sessão |
[Decisão] tato térmico e de vibração; nocicepção (a V0.7, R-10, exclui dor como objetivo; sentir não é o mesmo que ser penalizado).

## 4. Movimento nesta fase (decisão da sessão)
- **R1 equilíbrio:** entradas inclinação, velocidade angular e velocidade das rodas (calculadas dentro de S, não entregues ao domínio como aferência pronta); suas saídas viram incidências para o domínio.
- **Reflexos primitivos:** preensão (toque na palma → flexão dos dedos); retirada (pressão forte → recuo do membro). [Decisão] orientação (som ou toque → virar a cabeça).
- **Movimentos espontâneos:** marca-passos por grupo de atuadores (paralelo: movimentos espontâneos gerais do bebê; fonte a buscar).
- **Proteções** R2–R4 (corrente, limite articular, perda de comunicação), fora do experimento.
- Via do domínio para os atuadores: **em aberto**.

## 5. Simulação
- Física: MuJoCo (articulações, contatos, tendões e sensores de toque nativos); ligações oficiais em JavaScript/WebAssembly (`@mujoco/mujoco`, em desenvolvimento). A verificar: acesso a tendões e sensores pelas ligações JS; determinismo para o checkpoint.
- Som: fora do MuJoCo; propagação com atraso e atenuação até cada microfone, a partir de fontes no mundo e de contatos.
- Interface única para simulado e físico (V0.7, R-02).

## 6. Requisitos e testes
R-01 a R-12 e T01–T12 da V0.7, mantidos, mais: T13 toque em si mesmo (alcance e contato registrado pelas duas peles).

## 7. Decisões do responsável (10/11/2026)
1. **Olhos com movimento próprio** (convergência e sacadas): 2 eixos por olho (guinada e arfagem) = 4 atuadores.
2. **Rolagem do pescoço:** sim (+1 atuador).
3. **Pele com temperatura e vibração**, além da pressão.
4. **Nocicepção entra** como sensação (receptores de limiar alto, mecânicos e térmicos); não é objetivo nem penalidade (R-10 mantido).
5. **Reflexo de orientação entra** (som ou toque → virar cabeça e olhos).
6. **Via do domínio para os atuadores fica em aberto** nesta fase; os movimentos vêm de reflexos e marca-passos.

**Total de atuadores: 27** (2 rodas + 12 braços + 6 dedos + 3 pescoço + 4 olhos).

## 8. Verificação do MuJoCo em JavaScript (10/11/2026)
Pacote oficial `@mujoco/mujoco` 4.0.0 (Node, linha única de execução). Teste mínimo: caixa de 1 kg caindo num plano, braço articulado, tendão espacial; sensores de toque, comprimento de tendão, acelerômetro e giroscópio. Resultados: o sensor de toque lê 0 antes do contato e 9,81 N com a caixa em repouso (peso de 1 kg); o comprimento do tendão é lido; **duas execuções idênticas dão leituras idênticas** (determinismo dentro do mesmo ambiente; entre máquinas e navegadores ainda não verificado). A renderização das câmeras não foi testada (provável caminho: three.js no navegador).

## 9. Passo 1 implementado: corpo no MuJoCo (10/11/2026)
Arquivos: `src/robot/body/robot-model.js` (gera o modelo MJCF a partir dos parâmetros), `src/robot/body/simulation.js` (simulação, reflexo R1, acesso por nome), `tests/robot-body.test.js`.
- **27 atuadores**, **814 taxels** de pressão (tronco em 5 faces, cabeça, braços, antebraços, palmas, falanges e pontas dos dedos), IMU, posição e velocidade de todas as articulações, comprimento e tensão de cada tendão dos dedos, esforço das rodas; 897 sensores no total. Duas câmeras e dois pontos de microfone posicionados (leitura de imagem e som: passo 3).
- **Mudança de geometria (nossa, a confirmar):** eixo das rodas 2,5 cm à frente do centro do tronco, sob o centro de massa da postura neutra (braços à frente). Com o eixo centrado, o centro de massa ficava 2,75 cm à frente e o robô só "ficava de pé" apoiando a caixa no chão.
- **Reflexo R1:** torque comum nas rodas = 12 × inclinação + 3 × velocidade de inclinação + 0,8 × velocidade das rodas + 0,3 × deslocamento das rodas (ganhos de busca em grade, sem fonte). Em 60 s com um empurrão de 3 N por 50 ms: só as rodas tocam o chão, deslocamento máximo 0,23 m, inclinação final −0,08 rad (inclinação de equilíbrio). **Frágil:** só 1 de 72 combinações de ganhos passou em 60 s; precisa de calibração melhor.
- **Controle:** sem R1, o robô cai (a caixa toca o chão).
- **T13 autotoque:** com a mão direita, toques na frente, na lateral direita e no topo do tronco registrados ao mesmo tempo pela pele do tronco e pela da mão, sem cair. O rosto ainda não foi alcançado na simulação dinâmica; a outra mão não foi testada.
- **Determinismo:** execuções repetidas dão leituras idênticas.
- **Custo:** 60 s simulados em ~3,4 s de processamento (passo de 2 ms), ~18 vezes mais rápido que o tempo real, sem câmeras e sem som.

## 10. Decisões de 10/11/2026 e mudanças (passo 1, continuação)
1. **Eixo à frente: aprovado.**
2. **Reflexo de equilíbrio é só reflexo** (responsável: "não uma sustentação da posição ereta; o robô é quem tem que aprender a se sustentar"). R1 passa a ser **fásico**: quando a velocidade angular do tronco passa de 0,3 rad/s, um torque breve nas rodas oposto a ela (resposta de endireitamento de tipo vestibular; ganho e limiar declarados). Medido: o robô cai com e sem o reflexo; com o reflexo, cai mais devagar (0,83 s contra 0,69 s até 0,35 rad, ganho 0,6). O controlador postural completo fica só como **controle de engenharia**, nunca nos experimentos.
3. **Apoio removível (andador):** dois apoios deslizantes, à frente e atrás, que mantêm o corpo de pé sem controlador. Opção do modelo, desligada por padrão. Quando usar é decisão em aberto (ver conversa).
4. **Autotoque aprimorado:** posturas encontradas por amostragem com contato; confirmados com física e pele: mão direita no tronco, mão direita na cabeça e as duas mãos entre si. Para isso a pele dos dedos passou a cobrir todos os lados das falanges e a ponta (taxels: 814 → 844). Observado durante os movimentos: dedos encostam nos olhos e braços nas rodas.

## 11. Rodinhas de treino (decisão de 10/11/2026) e correções
- **Responsável:** "Rodinhas. Se ele não aprende a ficar em pé acaba sempre apoiado na da frente ou na de trás." Duas rodinhas esféricas livres (2 cm de raio), à frente e atrás do tronco, posicionadas para tocar o chão **só quando a inclinação passa de 0,15 rad** (~8,6°) em torno do eixo. Fazem parte do robô (padrão ligado). Sem equilíbrio aprendido, o corpo fica apoiado numa delas (medido: inclinação −0,148 rad em repouso).
- **Erro corrigido:** o sensor de orientação usado para medir a inclinação estava no referencial de inércia do corpo, não no do tronco; as medidas de inclinação anteriores (inclusive a busca de ganhos e os tempos de queda da seção 10) estavam distorcidas. A inclinação agora vem da orientação do tronco; tempos refeitos abaixo.
- **Geometria ajustada (nossa):** ombros a 10,5 cm à frente do centro (os braços pendentes encostavam nas rodas) e eixo a 3,5 cm à frente do centro, sob o novo centro de massa da postura neutra (3,48 cm).
- **Perturbação física:** força horizontal aleatória pequena no tronco (desvio-padrão 0,05 N, correlação de 0,2 s, semeada), representando irregularidades de qualquer piso e corpo reais; sem ela, um equilíbrio instável nunca é deixado na simulação.
- **R1 fásico, refeito (sem rodinhas, até 0,14 rad, 3 sementes):** sem reflexo, 0,66–0,73 s; com reflexo (ganho 0,6), 0,76–0,88 s; com ganho 2,5, 1,66–2,01 s. O reflexo retarda a queda e não sustenta a postura.
- **Controle de engenharia** (nunca nos experimentos): ganhos refeitos com a inclinação correta; 15 de 192 combinações estáveis em 20 s; com ele as rodinhas quase não tocam o chão.

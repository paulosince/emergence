# P0.6 — Mundo com entidades: mesa 2-D — v0.1

**Data:** 09/11/2026 · **Código:** `src/world/tabletop.js`, `src/world/tabletop-verifier.js`, `src/sensory/tabletop-sensors.js`, `src/sensory/tabletop-scenario.js` · **Testes:** `tests/tabletop.test.js` · **Resumo:** `npm run experiment:tabletop`

## Mundo
- Mesa de 1,0 × 0,6 m com discos rígidos (padrão: 3) de raio, massa (∝ r²), refletância e temperatura distintos.
- **Física por eventos exatos:** colisões disco-disco e disco-borda calculadas no instante analítico, elásticas; movimento uniforme entre eventos.
- **Anteparo opaco** na faixa x ∈ [0,45; 0,60] m: esconde os discos da luz e do infravermelho, **não** do tato.
- **Intervenções do pesquisador:** repouso (todos param), lançamento (velocidades explícitas ou sorteadas com semente), teletransporte (recusado se sobrepuser outro disco), mudança abrupta de característica e deriva gradual em passos iguais.
- **Protocolo `standard-v1` (300 s), cobrindo os requisitos do I2:** dois repousos de 15 s; deriva de refletância do disco 0 em 10 passos (navio de Teseu); troca de refletância do disco 1 **enquanto totalmente escondido** (instante escolhido por simulação-piloto); teletransporte do disco 2 para um ponto livre (violação de continuidade espaço-temporal).

## Sensores não interpretados (84 canais)
| Tipo | Canais | Observação |
|---|---|---|
| Retina de luz | 60 (grade 10 × 6) | Cobertura por 4 × 4 pontos por célula; células sob o anteparo veem só o anteparo |
| Tato | 15 (grade 5 × 3) | Pressão por área coberta; **não é ocultado** pelo anteparo |
| Térmico | 9 (3 sensores × banco de 3 limiares) | Campo receptivo gaussiano; canais binários aninhados por limiar |

**Identidades opacas:** cada canal recebe um nome aleatório (`k` + 6 hexadecimais), embaralhado por semente declarada. Nome e ordem não revelam modalidade nem posição; o mapa canal → geometria fica só com o pesquisador. É a condição para testar a reconstrução autônoma da topologia (marco T2).

## Validação (7 testes)
- **Verificador independente** (não reutiliza as fórmulas de colisão): dentro da mesa, sem interpenetração, energia constante entre intervenções, momento conservado nas colisões disco-disco e concordância com integração numérica de passo pequeno até o primeiro evento. Protocolo padrão: **aprovado em mais de 200 mil verificações**. **Detecta defeitos injetados** (deriva de energia e interpenetração).
- Protocolo: 2 repousos, 10 passos monótonos de deriva, troca com o disco totalmente escondido, salto espaço-temporal maior que 5 cm sem sobreposição; sobreposição inicial recusada.
- **Repousos silenciosos:** nenhuma incidência enquanto todos os discos estão parados.
- **Anteparo:** células da retina sob o anteparo não mudam; células táteis sob o anteparo **mudam** enquanto um disco está escondido.
- Bancos de limiares aninhados.
- Canais opacos, únicos e dependentes da semente; incidências sem modalidade nem geometria.
- Determinismo e identidade sob o controlador real com pausas.

## Números do protocolo padrão
363 colisões; 24.631 incidências em 300 s (retina 17.308; tato 6.323; térmico 1.000); 17 intervenções; execução completa em menos de 1 s.

## Limites
- Discos, sem rotação nem atrito; colisões perfeitamente elásticas.
- Retina por amostragem de pontos, não radiometria.
- O infravermelho é bloqueado pelo centro do disco sob o anteparo, não pela área.
- Sem ação do sistema (prevista em C1–C3).
- O tato vê através do anteparo, o que **facilita** a permanência do objeto por via multimodal. Os testes de E1(c) devem ser rodados com e sem tato.

# EMERGENCE — Controles científicos e validação adversarial (v0.1)

**Etapa 5: protocolo de instrumentação, não teoria de constituição representacional.**

## Finalidade e hipóteses

Um resultado reproduzível pode reproduzir o mesmo defeito do simulador. Portanto, avaliamos separadamente: **mundo físico**, **transdução/transporte** e **ingestão pelo motor diagnóstico**. Os instrumentos desta etapa operam sobre o mundo idealizado de uma esfera rígida por plano 1D, aceleração constante e no máximo uma colisão por esfera. Não estabelecem validade geral para objetos reais, acústica, visão ou fisiologia.

## Três auditorias independentes

| Fronteira | Referência operacional | Defeitos cobertos | Limitação |
| --- | --- | --- | --- |
| Física | Integrador numérico independente do solucionador analítico e invariantes mecânicos | Instantes de impacto, eventos e quantidades físicas adulterados | Não comprova adequação da idealização a materiais reais |
| Transdução | Auditoria de amostra, incidência e entrega com tempos, IDs e valores | Amostras/entregas ausentes, duplicadas, retrodatadas, corrompidas; rótulo físico vazado | Não prova constituição representacional |
| Motor diagnóstico | Contagem de recepções, histórico de ingestões e estado final do controle sem aprendizagem | Perda de incidências e adulteração de eventos internos do controle | Não demonstra correção de futuros algoritmos constitutivos |

O método numérico de verificação integra velocidade/posição em passos finitos com atualização pelo ponto médio e interpolação local da primeira travessia. Não invoca o solucionador de raiz quadrática do simulador; no protocolo padrão, usa passo **1 ms** e tolerância **0,01 ms**. Testes com diferentes passos verificam convergência. Ambos os métodos ainda compartilham as mesmas hipóteses físicas básicas, portanto a concordância é limitada à idealização declarada.

## Matriz versionada de 13 controles

| ID | Variação intencional | Questão do teste |
| --- | --- | --- |
| single-baseline-v1 | Nenhuma | Referência com três sensores |
| upper-beam-aliasing-v1 | Período óptico s0: 10 → 100 ms | Fenômeno real pode ser perdido por subamostragem |
| upper-beam-phase-shift-v1 | Fase s0: 0 → 50 ms, comparado ao anterior | Com a mesma frequência, outra fase capta o fenômeno |
| upper-beam-noise-v1 | Ruído numérico só em s0 | Outros fluxos sensoriais permanecem idênticos |
| mechanical-quantization-v1 | Quantum mecânico: 0,5 N·s | Precisão muda, não o impulso físico |
| upper-beam-position-v1 | Altura s0: 0,70 → 0,45 m | Observação muda, trajetória não |
| mechanical-delay-v1 | Latência s2: 4 → 25 ms | Instante observado difere do instante entregue |
| no-sensors-v1 | Desliga todas as modalidades | Física continua sem incidências |
| inelastic-collision-v1 | Restituição: 0,5 → 0 | Ressalto desaparece por mecanismo físico |
| zero-gravity-v1 | Gravidade: 9,81 → 0 m/s² | Não há queda ou colisão após soltura do repouso |
| delayed-release-v1 | Soltura: 0 → 100 ms | Intervenção física externa, não rótulo sensorial |
| dual-noninteracting-coincident-v1 | Dois mundos 1D e soltura B ajustada | Dois impactos sem interação na mesma janela |
| dual-noninteracting-staggered-v1 | Ante o anterior, soltura B em 0 ms | Separa colisões mantendo os mundos e mecanismos |

O último par contém **duas instâncias físicas independentes quanto à dinâmica**, sobre planos distintos. A coincidência é obtida por coordenação temporal do experimentador, que é uma condição exógena compartilhada. Não afirmamos independência causal absoluta; apenas **ausência de interação física implementada entre as instâncias**. A versão simultânea produz dois impactos no mesmo intervalo de observação, demonstrando que sincronia, por si só, não implica interação física ou identidade de causa.

Os IDs e as condições são registros fixos de protocolo. Os controles de 1 variável mantêm as demais condições relevantes iguais, e o par especial de dois mundos é comparado apenas entre suas duas condições.

## Contraexemplos e erros deliberados

A suíte injeta mudanças falsas nos tempos de impacto, nos eventos, na posição, na velocidade e no impulso. Também adultera IDs, horários e valores de incidências, remove eventos registrados, acrescenta rótulos causais indevidos às incidências e falsifica contagens e eventos de ingestão do controle diagnóstico. Cada falha precisa ser **detectada** pelo auditor correspondente.

Os testes também preservam equivalência da física em ablações sensoriais e detectam perda de uma passagem visual por amostragem; com período de 100 ms, mudar somente a fase pode recuperar a observação.

**Atenção ao ruído:** a perturbação é inserida após o acoplamento como ruído numérico da leitura. Ela pode gerar valores fora da faixa física da transmissão luminosa normalizada. Esse teste avalia o transporte e a independência do fluxo pseudoaleatório, não uma eletrônica ou óptica realista.

Cada mundo, inclusive cada uma das duas instâncias do controle de coincidência, passa por uma **auditoria física efetiva**. Evitamos declarações vazias de aprovação quando nenhum verificador foi executado.

## Fronteiras informacionais

1. Os mundos geram estados e eventos verdadeiros.
2. Sensores se acoplam a grandezas físicas e produzem medidas amostradas.
3. O motor diagnóstico recebe apenas as incidências: valores, IDs e tempos.
4. Os auditores e o manifesto do **pesquisador** conhecem a origem física, as condições e os registros para comparação.
5. Nenhuma verdade causal ou metadado dos objetos é entregue como incidência ao motor.

O motor diagnóstico **não aprende**. Não se deduz constituição, reconhecimento, representação ou suficiência da arquitetura a partir de testes instrumentais.

## Reprodução

~~~sh
npm test
npm run test:scientific-controls
npm run experiment:controls
npm run experiment:controls:json > scientific-controls.json
npm run experiment:controls:coincident
npm run experiment:controls:staggered
node experiments/scientific-controls.js --condition=upper-beam-aliasing-v1
~~~

O relatório inclui ID versionado, software e revisão Git (quando disponível), sementes, cenário, incidências, rastros e resultados dos auditores. Persistência com checkpoints, ZIP autocontido e replay equivalentes ainda pertencem ao item 7.

## Estatuto epistemológico e limites

**Verificado por testes:** reprodutibilidade sob condições declaradas e detecção de defeitos especificados. **Inferência:** os controles reduzem riscos conhecidos de confundir física, percepção instrumental e ingestão. **Não demonstrado:** ausência de todos os defeitos possíveis, física de ambientes complexos, interocepção, validade de modalidades ricas, constituição representacional ou independência de toda causa exógena. A originalidade científica dessa arquitetura não foi estabelecida por este estágio.

O projeto TEMPO original não foi modificado.

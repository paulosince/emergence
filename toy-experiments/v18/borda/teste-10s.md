# V0.18 — Teste de 10 s de Bach na borda auditiva (registro)

**Data:** 19/11/2026. **Trecho:** 0 a 10 s da gravação (abertura da Tocata). **Código:** [rodar_teste.py](rodar_teste.py), [conferencias.py](conferencias.py), [preparar_visual.py](preparar_visual.py). **Calibração usada:** [calibracao.md](calibracao.md). **Interface:** "Cóclea em luz — Bach 10 s" (artefato; fonte em [visual/index.html](visual/index.html)).

## Dado × criado
- **Dado:** robô parado, Utrd auditiva (microfone + cóclea) de cada ouvido, pontos transdutivos de cada Cpro (21.731 por ouvido).
- **Criado:** nada. As colunas mostram os pontos transdutivos que **seriam** Upros e quais receberiam incidências.

## Volume de incidências [M]
- **~31 milhões de incidências repassadas por ouvido em 10 s** (esquerdo 31,1 M; direito 30,5 M), média de ~143 por segundo por ponto transdutivo.
- Arquivo de eventos completo: ~600 MB (não versionado; regenerável com `rodar_teste.py 0 10`, ~80 s).

## Conferências do observador (descritivas; critérios de "suficiente" a definir pelo responsável)

| Conferência | Medida | Resultado [M] |
|---|---|---|
| 1. Diferença de chegada | Pico da correlação cruzada dos trens esquerdo × direito, por faixa até 1,2 kHz | Esquerdo sempre primeiro; atraso do direito de **0,25 a 0,56 ms** (esperado pela cabeça esférica, só a parte de Woodworth: 0,35 ms). O sinal oposto do alto-falante distante **não aparece** (o próximo domina). Parte do excesso pode vir de o ouvido mais forte completar o acumulador antes (latência dependente do volume): **a separar** |
| 2. Diferença de volume | Pontos ativos esquerdo − direito (janelas de 50 ms) | Esquerdo aciona mais, crescendo com a frequência: até **+16 pontos por faixa** acima de 5 kHz (de ~200–300) |
| 3. Notas e ritmo | Correlação de postos entre a energia da faixa no espectro da gravação e os pontos ativos | **0,32 a 0,95**; maioria entre 0,7 e 0,9; mais baixa em algumas faixas de 2,5–3,5 kHz |
| 4. Ataques | Pico (0–20 ms) / sustentado (50–100 ms) do total de incidências nos 3 ataques detectados | **1,03 a 1,07**: o ataque aparece como degrau, quase sem rajada |
| 5. Perdas | Por faixa | Janela de refratariedade barra **0,6%** das emissões; **~80% dos pontos ativos** o tempo todo acima de ~300 Hz (saturação por recrutamento); magnitude média **0,27** (reserva de efeito das Upros esgotada pelo uso contínuo); janela de fase: ganho da oscilação de −1,9 dB perto de 1 kHz até −35 dB a 8 kHz |

Números completos: [conferencias-0-10-conferencias.json](conferencias-0-10-conferencias.json); figura: [conferencias-0-10-conferencias.png](conferencias-0-10-conferencias.png).

## O que se vê na interface
- **Zoom de pontos (200 Hz):** a cada ciclo da onda (5 ms), uma **varredura** atravessa os pontos transdutivos: os mais sensíveis completam o acumulador primeiro, os de limiar mais alto um pouco depois. É a regra de emissão funcionando em fase.
- **Visão geral:** a peça está quase toda "acesa"; as mudanças de trecho (1,75 s e 5,4 s) aparecem como degraus.

## Leitura provisória do assistente (a discutir; não é decisão)
1. A transdução carrega tempo (fase nos graves, diferença de chegada) e **qual faixa** está ativa. O que se perde é a **gradação de intensidade** e o **ataque**, porque a 85 dB de pico quase todos os pontos ficam acima do limiar e sem adaptação.
2. As duas causas ligadas a escolhas abertas: (a) a reserva da Utrd não reproduz a adaptação rápida nem a curta (ver calibração); (b) a reserva de efeito das Upros cai para ~0,27 em uso contínuo, o que apaga diferenças de magnitude.

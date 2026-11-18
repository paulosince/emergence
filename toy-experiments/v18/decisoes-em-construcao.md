# V0.18 — Decisões em construção

**Responsável:** Paulo Rogério da Silva (conduz a V0.18). **Redação:** assistente (Claude).
**Regra desta versão:** todo registro começa declarando **o que é dado** e **o que é criado**, e confere isso contra a pergunta vigente de constituição ([regras de 11/11](../../docs/regras-cientificas-e-continuidade-2026-11-11.md), seção 4). Lição do [encerramento da V0.17](../v17/encerramento-v17.md).

## O que é dado e o que é criado (estado atual)

| Dado (pronto, hardware pré-configurado) | Criado dinamicamente (a definir como) |
|---|---|
| Robô (corpo, sentidos, reflexos), conforme [especificação v1](../../docs/robot-spec-v1.md), com as mudanças abaixo | **Tudo da cabeça para dentro** |
| Utrd auditiva: microfone + cóclea (uma por ouvido) | |

## Decisões

| Tema | Decisão do responsável | Data |
|---|---|---|
| Nocicepção | **Fora por ora** (não será trabalhada ainda) | 18/11 |
| Equilíbrio | O robô "baixa a suspensão" e fica com **as 4 rodas no chão**, estável. **Equilíbrio não será trabalhado agora** | 18/11 |
| O que é a Utrd | "O elemento físico que realiza a transformação dos sinais sensoriais em incidências." Na audição, **a Utrd é o conjunto microfone + cóclea**; não há "uma Utrd por faixa" (substitui a especificação de 10/11). Hardware 100% pré-configurado, "sem que isso fira a autonomia do sistema" | 18/11 |
| Cóclea | Hardware que **divide o sinal do microfone em 64 faixas** | 18/11 |
| Intensidade e criação | A **faixa** define a fibra que o som atinge; os **decibéis** definem quais **Upros** daquela fibra propagam as incidências (cada Upro tem o seu limiar). **Upros são criadas dinamicamente**; a fibra passa a existir quando há Upro naquela faixa. As mais sensíveis a sons baixos tendem a ser criadas primeiro; as sensíveis só a sons muito altos podem nunca ser criadas | 18/11 |
| Fibras por faixa | **Uma fibra por faixa** (64 por ouvido) | 18/11 |
| Capacidade por fibra | **Proposta do responsável, em avaliação:** até 240 Upros por fibra (2 por decibel, 120 dB). Comparação NB: ~550 neurônios por 1/64 da cóclea humana (conta do assistente, confiança média) | 18/11 |
| Limiares das Upros | **Vagas fixas** (dadas pelo hardware): cada Upro nasce numa vaga de limiar já definida, de baixo para cima. **Não** nasce "onde o som cair". A distribuição das vagas **não deve ser linear**: mais vagas nos níveis em que há mais fibras na biologia (forma a definir) | 18/11 |
| Nome da fibra | "Se o nome está invertido, está ruim. Upro é Unidade Propagadora." Na biologia, cada "fibra do nervo" corresponde à Upro; a fibra do nosso modelo corresponde ao conjunto de neurônios de um lugar da cóclea. **Sugestão do responsável, a confirmar:** "Conjunto propagador (Cpro)" | 18/11 |

## Pendências (primeiro objetivo: do microfone à cóclea)
1. Intensidade: forma da distribuição não linear das vagas e sua extensão (até ~80 dB acima do limiar da faixa, ou 120 dB?); referência dos decibéis por faixa; nome Cpro. Ler Liberman 1978 (texto integral) para os limiares por grupo.
2. Referência biológica (espécie ou escala).
3. Antes da cóclea: microfones, cabeça, ouvido externo e médio.
4. Faixa de frequências e escala das 64 faixas.
5. Resolução temporal (amostragem, acompanhamento de fase, refratário, taxa máxima).
6. Atividade espontânea e adaptação.
7. Máximo de Upros por fibra.

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
| Forma das vagas | **B: convolução** dos limiares das fibras biológicas com a faixa de crescimento de cada fibra ("Eu já sabia"). Parâmetros da primeira conta a aprovar ([investigação](investigacao-limiares-fibras.md)) | 18/11 |
| Referência biológica | **"Sempre que tivermos o exemplo humano, seguimos por ele. Quando não, adaptamos."** Dado não humano entra declarado como adaptação, com a espécie | 18/11 |
| Capacidade por fibra | **Segue o perfil humano** de fibras por célula ciliada interna ao longo da cóclea (mais Upros no meio), em vez de 240 fixo. Escala a definir | 18/11 |
| Zero de cada faixa | Limiar de audição humano (ISO 2003): **usar os pontos disponíveis (250 Hz a 8 kHz) e interpolar**, com a perda declarada | 18/11 |
| Cóclea (hardware) | **Mantida a especificação já decidida em 16/11 (V0.17):** 64 faixas na escala ERB, de ~50 Hz a 8 kHz (~0,5 ERB entre faixas); microfones a 48 kHz. Consequência: limiar humano interpolado de 250 Hz a 8 kHz e **extrapolado** de 50 a 250 Hz (perda declarada) | 18/11 |
| Escala da capacidade | **Números biológicos** humanos por faixa (não 240) | 18/11 |
| Ouvido externo | **Por ora, não modelado à parte**: o reforço do canal fica embutido no zero de cada faixa (o limiar ISO 389-7 é de campo livre). "É um refinamento detalhado" | 18/11 |
| Próximo passo | **Transdução em incidências**, testada com Bach em "força total", para avaliar se as incidências são descritivas o bastante para o Sdom criar caminhos (entendimento a confirmar) | 18/11 |
| Teste da transdução | Bach **completo e sem atenuação de intensidade** ("fraco onde é fraco, forte onde é forte"); **mesma cena da V0.17** (sala 2 × 2 × 3 m, dois alto-falantes, a gravação da Tocata e Fuga, robô parado); as peças que faltam na transdução (resolução temporal, atividade espontânea, adaptação) são **definidas antes** de rodar. Quais Upros existem no teste: **pendente**, após as ponderações | 18/11 |
| O que existe no teste | "Esse primeiro experimento não cria Sdom. Apenas entra nele." Nada é criado; as vagas aparecem como cordas que **seriam** Upros, e mostra-se quais receberiam incidências | 18/11 |
| Efeito na saída da Utrd | **Excitatório** (como o nervo auditivo, glutamatérgico) | 18/11 |
| Volume da sala | Trecho mais forte de Bach = **85 dB SPL** no ouvido do robô; o resto proporcional, sem compressão | 18/11 |
| Interface de visualização | O inverso dos vídeos de piano: embaixo, as 64 faixas; de cada faixa sobem colunas (Upros possíveis); **a luz é a incidência transitando pela Upro** (a velocidade de propagação pode aparecer); a intensidade é a "poeira luminosa" que sobe no ataque da nota; zoom no estilo dos quadros de atividade; verde neon = excitatório, vermelho = inibitório. Criatividade livre ao assistente | 18/11 |
| Atraso das Upros | **Por ora, igual para todas.** Depois, será a distância dividida pela velocidade, "com ou sem mielina" | 18/11 |
| Pausa depois do disparo | **Valores humanos** (implante coclear): pausa absoluta ~0,39 ms e recuperação gradual com constante ~0,43 ms | 18/11 |
| Acaso no disparo | **Determinístico** (acima do limiar, dispara sempre que a pausa permitir) | 18/11 |
| Atividade espontânea | **Sem espontânea por ora** | 18/11 |
| Fase e "salva" | **Aprovado:** (1) cada Upro recebe, uma vez, um **tempo de recuperação próprio**, sorteado numa faixa em torno do valor humano (ideia do responsável: "latência de refratariedade"); o disparo continua determinístico, e o acaso fica numa propriedade anatômica fixa; (2) um **suavizador fixo dentro da Utrd** (a "lâmpada lenta" da célula ciliada) faz a fase se perder gradualmente nos agudos. Valores a buscar. Latência fixa por Upro: opcional, não adotada | 18/11 |
| Nome da fibra | "Se o nome está invertido, está ruim. Upro é Unidade Propagadora." Na biologia, cada "fibra do nervo" corresponde à Upro; a fibra do nosso modelo corresponde ao conjunto de neurônios de um lugar da cóclea. **Sugestão do responsável, a confirmar:** "Conjunto propagador (Cpro)" | 18/11 |

## Pendências (primeiro objetivo: do microfone à cóclea)
1. Intensidade: forma da distribuição não linear das vagas e sua extensão (até ~80 dB acima do limiar da faixa, ou 120 dB?); referência dos decibéis por faixa; nome Cpro. Ler Liberman 1978 (texto integral) para os limiares por grupo.
3. Antes da cóclea: microfones, cabeça, ouvido externo e médio.
4. Faixa de frequências e escala das 64 faixas.
5. Resolução temporal (amostragem, acompanhamento de fase, refratário, taxa máxima).
6. Atividade espontânea e adaptação.
7. Máximo de Upros por fibra.

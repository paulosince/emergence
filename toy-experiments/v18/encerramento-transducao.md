# V0.18 — Fechamento da transdução auditiva

**Data:** 20/11/2026. **Decisão do responsável:** "Fechar a transdução e ir ao Sdom." Os três testes da extensão passaram nos critérios dele.

## Dado × criado

- **Dado:** robô parado e a Utrd auditiva de cada ouvido (microfone + cóclea, hardware 100% pré-configurado). A Utrd tem 64 faixas e os pontos transdutivos de cada Cpro (21.731 por ouvido).
- **Criado:** **nada**. Os testes só "entraram" no Sdom: mostram as incidências que as Upros receberiam, se existissem.

## A borda como ficou

| Parte | Especificação | Origem |
|---|---|---|
| Cena | Sala sem reflexão; cabeça esférica de 10 cm (Brown e Duda); fonte em qualquer direção; pico das obras a 85 dB SPL | [R] + [L] |
| Cóclea | 64 faixas gamatone de 4ª ordem (ERB), 50 Hz a 8 kHz; retificação de meia onda; janela de fase (2ª ordem, 1,2 kHz); **sem compressão** | [R] + [L] |
| Atenuação para som forte | A partir de 70 dB SPL, até 20 dB nos graves, ~10 dB em 2 kHz, zero acima de 4 kHz; subida de 50 ms, descida de 200 ms | [R] limiar; [A] formato (a aprovar) |
| Pontos transdutivos | Zero da ISO 389-7 interpolado; capacidade pelo perfil de Wu e colegas (2019); limiares pela convolução; **sensibilidade por área: +20 / +10 / 0 dB** (sensível / intermediária / som forte) | [R] + [L] |
| Emissão da Utrd | Acumula o excesso saturado × (reserva disponível / capacidade); emite ao completar a unidade, se houver ponto de liberação carregado | [R] regra; [A] saturação |
| Reserva de efeito da Utrd | 4 pontos de liberação; **janela de carregamento que se alonga com o uso** (base 14 ms, +0,4 ms por reposição, volta em 60 ms); janela de dispersão de 100 ms | [R] + [L] Bruce, Erfani e Zilany (2018), texto integral |
| Upro | Janela de refratariedade de 0,39 ms ± 50%; reserva de efeito (g) com carregamento de 25 ms e dispersão de 2 s; janela de propagação igual para todas | [R] + [L] |
| Cálculo | Por eventos, com fórmula fechada e instante registrado (ideia do responsável); testes de código "por eventos = passo a passo" passam | [R] |

Detalhes: [especificação](especificacao-transducao.md), [decisões](decisoes-em-construcao.md), [calibração](borda/calibracao.md).

## O que os testes mostraram (prova necessária) [M]

| Teste | Resultado | Régua humana | Critério do responsável |
|---|---|---|---|
| Direção | 1° (ruído); 2° (tom de 500 Hz) | ~1° | — |
| Frequência pelo lugar | semitom em toda parte; 1% em 1 e 4 kHz | ~0,2–0,5% (a confirmar) | — |
| Frequência pelo tempo | fase das incidências dá a frequência certa (250 e 1.000 Hz) | — | — |
| Pausa em ruído | 3 ms | 2–3 ms | — |
| **Intensidade** | 0,5–1 dB em tons; 2 dB em ruído a 85 dB | ~0,5–1,2 dB | **até 2 dB: passa** |
| **Ordem dos inícios** | ordem sempre certa a partir de 2–7 ms | ~20 ms | **a partir de 20 ms: passa** |
| **Duas fontes** | duas direções em 100% das apresentações separadas; nunca no mesmo lugar | 89,5% / 12,5% | **detectar duas fontes: passa** |

Fontes e graus de leitura: [régua humana](regua-humana.md). Registros: [bateria](bateria-de-testes.md), [plano de extensão](plano-extensao-testes.md).

## Ressalvas que seguem com a borda

1. **Determinismo:** a borda não tem ruído interno. Os números acima são o teto do que as incidências guardam, não o que um sistema com ruído leria.
2. **Volume de incidências:** ~1–2 milhões por segundo por ouvido em música. Pelo princípio de custo do responsável, a Pcrt não pode varrer tudo.
3. **Área sensível satura** em som forte; nessa situação a informação de volume fica nas áreas intermediária e de som forte.
4. **Intervalos nos graves ~2,4% maiores** que múltiplos do período (efeito da reserva na fase). A literatura indica a mesma direção no nervo auditivo; falta comparar o tamanho.
5. **Sem a adaptação em lei de potência:** a adaptação curta é fraca e falta o efeito de um som sobre o seguinte.
6. **Não medido:** fontes mais próximas que ±30°; separação do conteúdo de cada fonte; fontes no mesmo lugar por outras pistas.
7. **Escolhas do assistente ainda sem aprovação explícita:** o formato da atenuação para som forte; a saturação da emissão (0,1); o tamanho do compartimento lento do g (M_g = 1).

## Pendências de leitura

PDFs listados em [régua humana](regua-humana.md), mais o estudo do alargamento da oitava (para o tamanho do efeito nos graves).

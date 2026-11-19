# V0.18 — Calibração da borda auditiva (registro)

**Data:** 19/11/2026. **Feita antes de qualquer execução com Bach**, só com tons constantes (especificação, seção 6). Script: [calibrar.py](calibrar.py); números completos: [calibracao.json](calibracao.json). Testes de código: [test_motor.py](test_motor.py) (todos passam).

**Dado × criado:** nada é criado aqui. Só a Utrd (hardware) e o comportamento que **cada ponto transdutivo teria** se tivesse uma Upro.

**Marcas:** [R] responsável; [L] literatura; [A] escolha do assistente, **a aprovar**; [M] medido no código (confiança alta: é a conta do próprio modelo).

## Escolhas de implementação declaradas [A]

| Item | Escolha | Por quê |
|---|---|---|
| Filtros da cóclea | Resposta ao impulso gamatone de 4ª ordem (Patterson), calculada direto (filtro FIR causal), ganho 1 na frequência central | A versão recursiva de alta ordem do scipy fica numericamente instável nos graves a 48 kHz (saída explode; verificado) |
| Nível do sinal de comando | Normalizado para que um tom na frequência central dê pico igual à sua amplitude (Pa) | Assim o limiar de cada ponto (dB SPL de um tom) compara direto com o sinal |
| Calibração do volume | Trecho mais forte da peça inteira = janela RMS de 125 ms no microfone mais forte = 85 dB SPL | Interpretação de "pico 85 dB SPL"; 125 ms é a média "rápida" de medidor de nível |
| Áreas de intensidade | Pela posição no Cpro: 61% mais sensíveis = área 1; 23% = área 2; 16% = área 3 | Simplificação (a convolução mistura os grupos) |
| Reserva (dois lugares) | Compartimento rápido que se recarrega do lento (janela de carregamento); lento se recarrega de fora (janela de dispersão). Linear, com fórmula fechada | "Mesmo mecanismo em dois lugares" [R]; forma linear para permitir o cálculo por eventos |
| Tamanho do lento no *g* | M_g = 1 (igual ao rápido), **provisório** | Sem dado para este número |

## Resultados

| Alvo | Valor calibrado | Conferência [M] |
|---|---|---|
| **Unidade do acumulador:** ponto logo acima do limiar emite 1 vez por ciclo nos graves | Unidade = 0,9 × excesso relativo de um ciclo do ponto mais sensível da faixa de 117 Hz, com tom a +1 dB do limiar | **1,03** emissão por ciclo a +1 dB; 1,45 a +3 dB; 1,54 a +6 e +10 dB; 1,63 a +20 dB (aí já é o teto da reserva, ~190/s) |
| **Teto sustentado ~200/s** (Utrd, áreas 1 e 2) | Reserva lenta M = **422** pontos de liberação (janela de carregamento 16,5 ms; dispersão 100 ms) | **200/s** de 0,5 a 1 s (tom de 4,09 kHz, +40 dB) |
| Área de som forte (carregamento 40 ms) | — | **84/s** sustentado (alvo ~100/s; dentro de 40–190/s de Liberman 1978) |
| **Queda de ~35–40% do *g* a 100/s** | Fração gasta por repasse f = **0,0110** | *g* = 0,90 depois de 20 incidências; **0,62 depois de 100 (1 s)**; 0,31 depois de 1.000 (10 s) |

## O que **não** foi reproduzido (importante)

1. **Tempo rápido (~5 ms) e tempo curto (~100 ms) da adaptação da Utrd: não aparecem.** Com o teto em 200/s, a reserva lenta precisa ficar quase cheia (M grande), e aí ela quase não esvazia: a taxa vai de ~267/s (5–20 ms) a 200/s (de 20 ms em diante) e fica plana. O tempo de ~100 ms some.
2. **O "ataque" de 4 emissões quase não passa.** Como o disparo é determinístico e a unidade do acumulador é pequena, os 4 pontos de liberação cheios saem quase juntos, dentro da janela de refratariedade da Upro; 3 das 4 incidências são bloqueadas. Taxa medida de 0 a 2 ms: 500/s (uma incidência).
3. **Conflito de números:** com 4 pontos de liberação e 16,5 ms, o teto teórico é ~212/s com a reserva cheia. Para haver adaptação forte (início de ~1.000/s caindo para ~200/s, como nas fibras reais), o modelo precisaria de um início muito acima do teto, o que esta forma determinística não dá.
4. ***g* da Upro:** a queda de 38% só se completa em ~1 s (100 incidências), porque o compartimento lento (2 s) pesa muito com M_g = 1. No bulbo de Held a queda costuma aparecer em poucas incidências (de memória, **a conferir**).

**Decisões em aberto (do responsável):** aceitar assim (o ataque fica representado pelo recrutamento de muitos pontos ao mesmo tempo), ou mudar a forma da reserva da Utrd para dar o início forte. O teste de 10 s de Bach mostra o efeito prático.

## Contagem "sem reserva"
Cada vez que o acumulador completa a unidade com a reserva vazia, conta-se uma tentativa barrada. Como a unidade é pequena, esse número é grande e depende da unidade; serve para comparar faixas entre si, não como número absoluto.

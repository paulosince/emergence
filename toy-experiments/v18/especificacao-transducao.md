# V0.18 — Especificação da transdução auditiva (rascunho para aprovação)

**Data:** 18/11/2026. **Responsável:** Paulo Rogério da Silva. **Redação:** assistente (Claude).
**Estado:** rascunho. Nada é implementado antes da aprovação do responsável. Decisões de origem: [decisões em construção](decisoes-em-construcao.md). Termos: [nomenclatura](../../docs/nomenclature.md).
**Marcas:** [R] decisão do responsável; [L] literatura (fonte e grau de leitura na [investigação](investigacao-limiares-fibras.md)); [A] proposta do assistente, **a aprovar**.

## 0. Pergunta do experimento
O primeiro experimento da V0.18 **não cria Sdom, apenas entra nele** [R]. A pergunta é: o algoritmo de transdução entrega **incidências descritivas e refinadas o bastante** para que o Sdom, depois, possa criar caminhos?

## 1. O que é dado e o que é criado

| Dado (hardware pronto) | Criado | Neste experimento |
|---|---|---|
| Robô (especificação v1, com 4 rodas no chão, sem dor) [R] | Tudo da cabeça para dentro [R] | **Nada é criado.** Os túneis transdutivos aparecem como colunas que **seriam** Upros, e mostra-se quais receberiam incidências [R] |
| Utrd auditiva = microfone + cóclea, uma por ouvido [R] | | |
| Túneis transdutivos de cada Cpro (posições de limiar) [R] | Upros (no futuro, pela Pcrt) | |

## 2. Cena [R]
- Sala de 2 × 2 × 3 m da V0.17, dois alto-falantes, robô parado, **sem reflexões** (por ora).
- Gravação: Tocata e Fuga em Ré menor, BWV 565 (Ashtar Moïra, domínio público; `../v17/estimulo/Toccata_et_Fugue_BWV565.ogg`, 44,1 kHz, reamostrada para 48 kHz), estéreo como vier, canal esquerdo no alto-falante mais próximo (V0.17).
- **Sem atenuação de intensidade**: o trecho mais forte mede **85 dB SPL** no ouvido do robô, e o resto fica proporcional, sem compressão.
- Cabeça: modelo **esférico** de 10 cm (Brown & Duda, como na V0.17), como aproximação declarada da caixa de 8 × 10 × 9 cm.
- Primeiro rodaremos um **teste de 10 s**; depois, a peça inteira.

## 3. Utrd: microfone + cóclea (hardware)

| Elemento | Especificação | Origem |
|---|---|---|
| Microfones | 2, sincronizados, 48 kHz | [R] (especificação v1) |
| Ouvido externo | Não modelado à parte; o reforço do canal fica embutido no zero de cada faixa | [R] |
| Cóclea | 64 faixas, filtros gamatone de 4ª ordem, escala ERB, de 50 Hz a 8 kHz (~0,5 ERB entre centros). Filtros **lineares**: perda declarada (o filtro biológico alarga com o volume) | [R] + [L] |
| Zero de cada faixa | Limiar humano em campo livre (ISO 389-7:2005, via GB/T 4854.7-2008), interpolado em log da frequência (ex.: 50 Hz 44,0; 1 kHz 2,4; 3,15 kHz −6,0; 8 kHz 12,6 dB SPL) | [R] + [L] |
| Retificação | A célula só responde a um lado da onda: retificação de meia onda antes da janela de fase | [L] (padrão dos modelos); **[A] a confirmar** |
| Janela de fase | Filtro de 2ª ordem com canto em 1,2 kHz, ajustado aos pontos de gato e gerbil (fase constante abaixo de ~1 kHz, insignificante acima de 4–5 kHz; queda de 40 dB por década) | [R] + [L] (adaptação; sem dado humano) |
| Efeito das incidências | Excitatório | [R] (nervo auditivo glutamatérgico) |
| Atividade espontânea | Nenhuma, por ora | [R] |
| Disparo | Determinístico; o acaso só entra em propriedades anatômicas fixas, sorteadas uma vez (semente registrada) | [R] |

## 4. Cpro e túneis transdutivos
- **Um Cpro por faixa** (64 por ouvido) [R].
- **Capacidade de cada Cpro (quantos túneis):** fibras por célula ciliada interna (Wu et al. 2019, grupo abaixo de 60 anos) × células por mm (Wu et al. 2019) × comprimento da faixa na cóclea (Greenwood, 35 mm). Resultado: **199 a 445 túneis por Cpro**, pico perto de ~730 Hz, **21.731 por ouvido** [R] + [L]. Abaixo de 170 Hz, sem dado: valor mantido (artefato declarado).
- **Limiar de cada túnel:** distribuição em **convolução** dos limiares das fibras biológicas (grupos de Liberman 1978: 61% / 23% / 16%) com a faixa de crescimento de cada fibra (30 / 30 / 50 dB), contada a partir do zero da faixa [R] + [L] (adaptação, gato).
- **Áreas de intensidade transdutiva:** os três grupos de túneis (sensível, intermediária, som forte) [R].
- Tabela das 64 faixas: [tabela-faixas.csv](tabela-faixas.csv); figura: [tabela-faixas.png](tabela-faixas.png).

## 5. Quem faz o quê na borda [R]

**A Utrd decide quando e para quais Upros sai uma incidência:**
1. O som de cada faixa passa pela retificação e pela janela de fase.
2. A Utrd compara esse sinal com o limiar de cada túnel transdutivo.
3. Usa a **reserva de efeito da Utrd** daquele túnel. **Com a reserva vazia, não emite.**

**A Upro (o túnel que receberia) recebe e repassa, modificando:**
- **Janela de refratariedade** própria (só bloqueia): 0,39 ms ± 50%, sorteada uma vez por túnel. Uma incidência que chega com a janela aberta **não passa**.
- **Reserva de efeito** da Upro: multiplica a magnitude. Com a reserva baixa, repassa **fraco**; reabastecida, **normal**.
- **Janela de propagação** igual para todas (por ora).

**Combinação [R]:** janela de refratariedade aberta → não dispara, mesmo com a reserva cheia; janela fechada e reserva baixa → dispara fraco; janela fechada e reserva reabastecida → disparo normal.

## 6. Reservas e janelas (números aprovados)

| Onde | Elemento | Valor | Origem |
|---|---|---|---|
| Utrd (por túnel) | Reserva de efeito | 4 pontos de liberação | [L] Bruce, Erfani & Zilany 2018 |
| Utrd | Janela de carregamento (rápida) | ~16,5 ms por ponto (dá ~240/s sustentado) | [L] idem |
| Utrd | Janela de dispersão (lenta) | ~100 ms (gato 73–116 ms; gerbil 115 ms); tamanho da reserva lenta **calibrado** para reproduzir o tempo rápido (~5 ms), o lento (~100 ms) e o teto (~200/s) | [L] + calibração |
| Utrd | Área de intensidade de som forte | Janela de carregamento de ~40 ms (~100/s; dentro de 40–190/s de Liberman 1978) | [R] + suposição |
| Upro | Reserva de efeito | Começa em 1; cada incidência gasta uma fração, **calibrada** para ~35–40% de queda a 100/s | [L] camundongo adulto (bulbo de Held) |
| Upro | Janela de reabastecimento de efeito | Carregamento ~25 ms; dispersão ~2 s | [L] idem |
| Upro | Janela de refratariedade | 0,39 ms ± 50% (sorteada) | [L] humano (implante coclear) |

**Calibrações:** feitas só na borda, com sons de teste (tom constante), **antes** de qualquer execução com Bach, e registradas com o resultado.

## 7. A regra de emissão da Utrd: um ponto a aprovar [A]
Com disparo determinístico, falta dizer **em que instante** a Utrd emite enquanto o sinal está acima do limiar:
- Se emitir **só quando o sinal cruza o limiar subindo**, nos graves sai uma incidência por ciclo, em fase (certo). Mas nos agudos o sinal, já sem fase, fica acima do limiar sem cruzar: só haveria emissão no ataque e silêncio no sustentado (errado; as fibras reais sustentam ~200/s).
- Se emitir **sempre que estiver acima e a reserva permitir**, nos agudos fica certo, mas nos graves sairiam várias emissões por ciclo (errado).
- **Proposta:** a Utrd **acumula o quanto o sinal passou do limiar** e emite quando o acumulado completa uma unidade. Depois de emitir, zera o acumulado e respeita a reserva de efeito. Nos graves, isso dá cerca de uma emissão por ciclo, perto do topo da onda (em fase). Nos agudos, dá emissões regulares no sustentado, num ritmo que cresce com o volume e é limitado pela reserva. É a forma determinística do que a sinapse da célula ciliada faz. O tamanho da "unidade" é **calibrado** para que um túnel logo acima do seu limiar emita uma vez por ciclo nos graves.

## 8. Precisão do tempo [R]
O instante de cada incidência é calculado **entre as medidas** do microfone (interpolando o cruzamento), e não arredondado para a grade de ~21 µs.

## 9. Conferências do observador (fixadas antes de rodar) [R]
São feitas **fora do robô** e não alteram nada.
1. **Diferença de chegada:** nas faixas graves, os instantes das incidências esquerda e direita mostram os ~0,46 ms do alto-falante próximo (e o sinal oposto para o distante)?
2. **Diferença de volume:** nos agudos, o ouvido mais perto aciona mais túneis?
3. **Notas e ritmo:** as faixas certas acendem nos momentos certos (comparação com o espectro da gravação)?
4. **Ataques:** o início das notas aparece como rajada separável do sustentado?
5. **Perdas:** quanta informação se perde, e por quê. Conta-se, por faixa: incidências bloqueadas pela janela de refratariedade; emissões que não saíram por reserva vazia; perda de fase acima da janela de fase; túneis saturados.

**Critérios de "suficiente"** (o que conta como sim ou não em cada conferência): **a definir com o responsável** antes de rodar.

## 10. Engenharia [A]
- Cálculo **por eventos**, com o estado de cada túnel atualizado só quando há incidência, por fórmula fechada a partir do instante anterior (ideia do responsável). Só o som (64 filtros × 2 ouvidos a 48 kHz) roda amostra por amostra.
- Testes de código: o cálculo por eventos dá o mesmo resultado do passo a passo; as calibrações batem com os alvos; cada regra da seção 5 tem um teste.
- Interface: embaixo, as 64 faixas; colunas por túnel; a luz é a incidência subindo pela Upro (verde neon = excitatório); a força (magnitude) no brilho; a "poeira" no ataque; zoom; **player com pausa e barra de tempo** [R]. Primeiro o teste de 10 s.

## 11. Perdas declaradas
Ouvido externo embutido no zero; filtros lineares; sem atividade espontânea; disparo determinístico (sem o acaso da sinapse); trecho de refratariedade "com dificuldade" omitido; cabeça esférica; sem reflexões; dados de animais onde não há humanos (limiares por grupo, crescimento, janela de fase, reservas); capacidade abaixo de 170 Hz sem dado.

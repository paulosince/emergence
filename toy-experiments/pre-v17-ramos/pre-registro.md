# Pré-teste de ramos (separado da V0.17) — pré-registro

**Responsável:** Paulo Rogério da Silva. **Redação:** Claude (Opus 5.5), a partir da conversa de 15/11/2026.
**Estatuto:** pré-registro **congelado antes de qualquer código** (15/11/2026). Pré-teste separado, não é a V0.17.

## 1. Questão

A regra da Uint para chegadas da **mesma origem** (a mesma Upro) deve ser única, ou esconde duas situações diferentes?

1. **A mesma emissão** chegando por vários ramos, quase juntos: mesmo conteúdo; parece servir só para somar.
2. **Emissões diferentes** da mesma Upro, em instantes diferentes, chegando juntas por atrasos diferentes: relação de um canal com o próprio passado.

Motivação na literatura (leitura de resumos e trechos, não integral): um mesmo axônio faz vários contatos no mesmo dendrito (Kasthuri et al., 2015, *Cell* 162:648–661; Bloss et al., 2018, *Nat Neurosci* 21:353–363). Modelos sugerem que contatos múltiplos com filtragem diferente ampliam a capacidade de padrões espaço-temporais (Beniaguev et al., preprint 2022). Ideia correlata antiga, citada de memória: autocorrelação de Licklider (1951) para altura do som.

## 2. Termos

- **Ramo** (nome aprovado pelo responsável em 15/11/2026): cada ponto de chegada de uma Upro na Uint, com atraso próprio. Uma Upro pode ter vários ramos na mesma Uint.
- **Origem** = a Upro (não a Utrd), conforme o responsável em 15/11/2026.

## 3. O que é dado e o que se observa

Tudo é estrutura **dada e declarada**: Utrd, Upro, ramos, atrasos, Uint. Não há Pcrt, aprendizado, poda nem constituição. Este pré-teste examina **apenas a regra de integração** da Uint. Não testa representação nem a HCMT.

## 4. Regras comparadas

Em ambas: cada chegada contribui com magnitude 1 durante uma janela retangular; a Uint dispara quando, dentro da janela, a **soma** ≥ limiar **e** há pelo menos **duas contribuições distintas**; ao disparar, a Uint limpa as contribuições e entra em refratariedade.

- **Regra A (atual):** contribuições são distintas só se vêm de **Upros diferentes**.
- **Regra B (proposta):** contribuições são distintas se vêm de **emissões diferentes** (mesma Upro ou não). A mesma emissão chegando por vários ramos **soma**, mas conta como **uma**.

## 5. Parâmetros (escolha do assistente, congelados)

| Parâmetro | Valor |
|---|---|
| Janela da Uint | 0,25 ms (retangular) |
| Limiar da Uint | 1,5 |
| Magnitude por ramo | 1 |
| Refratariedade da Uint | 1 ms |
| Trem base | 20 pulsos, período 5 ms |
| Ramos padrão (C2–C5) | atrasos 2,0 ms e 7,0 ms (diferença Δ = 5 ms) |

## 6. Condições e previsões

Coincidência na regra B: o pulso *n* pelo ramo longo (t_n + 7) encontra o pulso *n+k* pelo ramo curto (t_{n+k} + 2) quando |t_{n+k} − t_n − 5| ≤ 0,25.

| Cond. | Descrição | Previsão A | Previsão B |
|---|---|---|---|
| C1 | 3 ramos, atrasos 2,00 / 2,05 / 2,10 ms, trem base | 0 disparos | 0 disparos (soma chega a 3, mas só uma emissão) |
| C2 | Ramos 2 / 7 ms, trem base | 0 | **19** (cada pulso com o seguinte) |
| C3 | Ramos 2 / 7 ms; período de 1,50 a 8,00 ms, passo 0,05 (131 valores) | 0 em todos | Dispara **se e só se** existe k ∈ {1,…,19} com \|k·P − 5\| ≤ 0,25; nesse caso, 20 − k disparos. Inclui as respostas em Δ/2 e Δ/3 (propriedade prevista, não defeito) |
| C4a | Um pulso só | 0 | 0 |
| C4b | Trem aleatório: intervalos = 1 ms + exponencial de média 4 ms (média 5 ms, sem dois pulsos a menos de 1 ms); 20 pulsos; 500 sementes | 0 | Disparos por acaso; esperado ~0,1 por pulso (estimativa analítica, confiança média) |
| C4c | Duas Utrd, uma Upro cada, um ramo cada; pulsos simultâneos. (i) atrasos 2 / 2 ms; (ii) atrasos 2 / 3 ms | (i) 20; (ii) 0 | Idêntico a A |
| C5 | Trem base com jitter gaussiano por pulso, dp 0,05 / 0,1 / 0,2 / 0,4 ms; 200 sementes | 0 | Só medida; queda esperada com o jitter, sem critério |

## 7. Critérios de sucesso da regra B (todos necessários)

- **S1:** C1 com 0 disparos em A e em B.
- **S2:** C2 com A = 0 e B = 19.
- **S3:** C3 com B coincidindo com a previsão em **todos** os 131 períodos (o caso é determinístico), e A = 0 em todos.
- **S4:** C4a com 0 em ambas.
- **S5:** disparos por pulso de B no trem periódico (C2) ≥ **3 ×** a média do trem aleatório (C4b). O valor 3 é escolha do assistente; a expectativa analítica é cerca de 10 ×.
- **S6:** C4c idêntico entre A e B.

Falha em qualquer critério: a regra B, tal como especificada, não passa; registrar e auditar se é da regra ou da implementação. Os dados brutos ficam no registro para que outros critérios possam ser aplicados.

## 8. Limitações declaradas

- Toy determinístico; ramos com magnitudes iguais; janela retangular; nenhuma propriedade dendrítica real.
- Os atrasos dos ramos são **dados**. Como a Pcrt criaria ramos com a diferença certa sem calcular o atraso fica em aberto (ponderação 3 da conversa).
- Mostrar que B permite seletividade à própria periodicidade **não** demonstra que o cérebro usa esse mecanismo, nem que ele é necessário.

# V0.17 — Proposta: fibra, Upro e ramo (para decisão do responsável)

**Estado:** PROPOSTA do assistente (Claude), 17/11/2026. Nada aqui está aprovado, salvo o que vem marcado [R].
**Base:** discussão de 17/11; [investigação das subdivisões do colateral](investigacao-arborizacao-terminal.md); [investigação da divisão da força](investigacao-divisao-forca.md) (ChatGPT); [diagnósticos](ensaio-minimo/resultados.md).
**Nomes:** só os já aprovados (fibra, Upro, ramo, Uint, Pcrt). "Colateral", "contato" e "cabeça" aparecem como **descrição**, não como termos.

## 1. A estrutura

| Nível | No modelo | Na biologia (descrição) | Atraso | Força | Estatuto |
|---|---|---|---|---|---|
| Fibra | a origem | o axônio | o tronco comum | — | [R] |
| **Upro** | a aresta | um colateral do axônio | **grande** (0,5–20 ms, a faixa da fibra) | — | [R] |
| **Ramo** | uma cabeça da aresta, chegando a **uma** Uint | uma subdivisão terminal do colateral | **pequeno**, somado ao da Upro: de 0 a ~0,2 ms | **sim**: a força mora no ramo | atraso [R]; o resto [A] |
| Contatos | não existem como elemento | os ~4 contatos coordenados de uma fibra num neurônio | o mesmo do ramo | somados na força do ramo | [A], por parcimônia |

**Proposta 1 [A] — um ponto de chegada por ramo.** Os contatos coordenados de uma subdivisão num mesmo neurônio chegam praticamente juntos e se somam. Então a força do ramo representa essa soma, sem um elemento novo. Se um dia fizer falta, a forma de dois níveis entra como subteste, como fizemos com os ramos em Uint diferentes.

**Proposta 2 [A] — uma Upro tem ramos para várias Uints.** É a "aresta com várias cabeças" (decidida como subteste em 16/11) virando a forma normal: um colateral se abre e alcança vários neurônios de uma faixa do núcleo (40–60% da MSO no gato; Karino et al. 2011).

## 2. Atraso dos ramos
- **[R]** Grande na Upro, pequeno no ramo.
- **Proposta 3 [A] — o pequeno atraso dos ramos é dado, não selecionado pelo mundo.** Na ave, essa diferença (~160 µs ao longo do núcleo laminar) forma o mapa; no gerbil, as diferenças de condução entre colaterais aparecem antes de ouvir (Seidl e Rubel 2016, via ChatGPT). Pelas três camadas, ficaria na camada do que vem **dado** (anatomia), e o mundo selecionaria **quais** ramos e Upros se fortalecem. **Risco:** se esses atrasos forem escolhidos por nós com cuidado demais, viramos nós a desenhar o mapa. Por isso a proposta é que sejam **espalhados sem ordem** (por exemplo, uniformes de 0 a 0,2 ms, com semente), e não um gradiente arrumado.

## 3. Força e competição
- **[R]** Abandonar a soma fixa por Upro; adequar ao modelo NB.
- **Proposta 4 [A] — teto por ramo, sem soma fixa.** Cada ramo tem só um teto individual (como no precedente de Gerstner et al. 1996, segundo a leitura do ChatGPT). A competição deve **emergir** na Uint. Como ela emerge é a parte difícil, e há três candidatas, nenhuma escolhida:
  - (a) a regra ligada ao disparo (já testada; matou o agudo);
  - (b) um estoque do lado da Uint, dividido entre os ramos que chegam a ela (Triesch et al. 2018);
  - (c) as duas, com escalas diferentes.
- **Perigo conhecido:** sem soma fixa e sem competição que funcione, tudo pode crescer até o teto (explosão de força). O ensaio precisa medir isso.

## 4. Exuberância e poda
- **[R]** A exuberância de atrasos acontece em **Upros novas, constituídas pela Pcrt**, com poda depois.
- **Em aberto (precisa de decisão):** com que atraso nasce uma Upro nova, e a partir de quê. A regra anterior ("ao lado de quem quase acertou, 10% acima e abaixo") foi substituída. Opções:
  - (a) mesma ideia, agora no nível da Upro: Upro nova da mesma fibra, com atraso a ±10% de uma Upro cujas Uints tiveram quase-acerto perto de acerto recente;
  - (b) Upro nova com atraso sorteado na faixa da fibra, sempre que houver insumo suficiente para a Pcrt (incidências sem integração);
  - (c) outra.
- **Poda:** a de hoje (Upro e ramo sem uso por muito tempo somem; estáveis ficam), aplicada a Upros e a ramos.

## 5. As cópias da relação
Com várias Uints por par de fibras e ramos de pequeno atraso para cada uma, as cópias (a mesma diferença entre as orelhas por caminhos diferentes) podem cair em **Uints diferentes**, e não disputar a mesma. Isso fica como **previsão**, não como regra.

## 6. O que muda no motor [A]
1. **Estrutura:** a fibra tem Upros (cada uma com atraso grande); cada Upro tem ramos (cada um com Uint de destino, atraso pequeno e força); o ensaio passa de **1 Uint** para **N Uints** por par de fibras (proposta para o ensaio: N = 8).
2. **Dinâmica:** uma incidência desce por cada Upro e por cada ramo dela, e chega a cada Uint de destino no instante + atraso da Upro + atraso do ramo. A Uint, a avaliação do quase-acerto e o disparo continuam por eventos, como agora.
3. **Força:** teto por ramo; sem soma fixa por Upro; a forma da competição conforme a decisão da seção 3.
4. **Pcrt:** passa a constituir Upros novas (seção 4); a "integração" e o insumo continuam como decididos.
5. **Medidas novas:** força por Uint; quantas Uints acabam sintonizadas na relação verdadeira; se as cópias se separam em Uints diferentes; crescimento total da força (risco de explosão).
6. **Custo:** proporcional a incidências × Upros × ramos. Com N = 8 e poucas Upros, deve continuar em segundos (estimativa, confiança média).

## 7. Decisões pedidas ao responsável
1. Proposta 1 (um ponto de chegada por ramo).
2. Proposta 2 (Upro com ramos para várias Uints; N = 8 no ensaio).
3. Proposta 3 (atrasos pequenos dos ramos dados e espalhados sem ordem).
4. Proposta 4 e a forma da competição (a, b ou c).
5. Como nasce uma Upro nova (seção 4: a, b ou c).

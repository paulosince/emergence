# V0.17 — O problema da força dividida: explicação, hipóteses e pedido de pesquisa neurobiológica

**Pedido do responsável:** 17/11/2026, com os ensaios pausados para revisão. Este documento explica o problema, levanta hipóteses e formula um pedido de pesquisa para outro assistente (ChatGPT).
**Redação:** assistente (Claude). **Estatuto:** nada aqui é decisão. As hipóteses são **nossas** (do assistente, salvo indicação), a testar contra a literatura.
**Dados:** [resultados do ensaio mínimo](ensaio-minimo/resultados.md), seções de 17/11/2026.

---

## 1. O problema, explicado

### 1.1 O ensaio
- Duas vias de entrada (uma por orelha), cada uma com a sua **Upro**, chegam a **uma Uint**.
- Cada Upro tem **ramos**: cada ramo é um caminho com um atraso próprio (de 0,5 a 20 ms). Uma incidência que entra na Upro desce por **todos** os ramos e chega à Uint uma vez por ramo.
- O mundo do ensaio tem uma relação verdadeira: o mesmo som chega à orelha B **0,458 ms** depois da orelha A. Um par de ramos (um de A, um de B) "acerta" quando a **diferença** dos seus atrasos compensa isso: atraso de A − atraso de B ≈ 0,458 ms.
- Começa com 6 ramos por Upro, força 0,15 cada. Quando há coincidência e a soma na Uint chega ao favorecimento (0,3), os ramos que coincidiram se fortalecem. Ramos novos brotam ao lado dos que **quase acertaram** (Uint chegou a 75% do limiar sem disparar), mas só perto de um acerto recente. A Uint **dispara** quando a soma chega a 1,5.
- A **força total de cada Upro é conservada** (soma 1,0): se um ramo ganha, os outros da mesma Upro perdem.

### 1.2 O que acontece (medido, 10 sementes, notas graves)
1. **O sistema acha a relação.** No fim, de 70% a 100% da força de cada Upro (mediana ~100%) está em ramos cuja diferença de atraso cai a até uma janela (0,21 ms) da relação verdadeira. Isso vale em **10 de 10** sementes. Confiança alta (medido; um par de vias, pulsos ideais).
2. **Mas a força fica dividida** entre 4 e 9 ramos por Upro, cada um com ~0,20–0,38. Sem brotamento, um ramo só fica com ~1,0. A divisão tem **duas formas**:
   - **Vizinhos colados:** ramos com atrasos muito próximos (0,2–0,4 ms de espalhamento), todos "certos" dentro da janela. Chegam quase juntos, mas não exatamente.
   - **Cópias da mesma relação em atrasos diferentes:** a relação é uma **diferença**, então o par (~0,5 ms; ~0,05 ms) e o par (~5,0 ms; ~4,55 ms) são igualmente certos. Mas chegam com milissegundos de distância e não se somam (espalhamento de 3,6–4,6 ms em 5 das 10 sementes).
3. **Por isso a Uint quase não dispara.** O pico da soma para um pulso isolado fica em **0,81–1,25**, abaixo do limiar 1,5 em 10 de 10. Se a mesma força estivesse num só par, passaria do limiar em 6 de 10.
4. **A competição clássica não consegue agir.** Testamos a regra ligada ao disparo (Song, Miller e Abbott 2000: chegou antes do disparo, fortalece; depois, enfraquece). Como a Uint quase não dispara, a regra quase não age. A classificação de "seleção" subiu de 4 para 8 de 10, mas por desempate do classificador: a força continuou dividida. É um ovo e a galinha: **o desempate precisa do disparo, e o disparo precisa do desempate.**
5. **No agudo** (notas com período de 0,6–0,9 ms, chegadas ~6× mais densas), a regra ligada ao disparo **mata a força**. Cada disparo enfraquece todas as chegadas dos 1,5 ms seguintes, e com pulsos densos isso atinge quase tudo. A conservação só corta o que passa de 1,0 e não repõe o que falta. Resultado: colapso em 10 de 10.
6. **Com uma nota repetida para sempre** (período fixo), um par errado (*aliasing*, que acerta por coincidência periódica) fica com toda a força e a Uint dispara ~2.000 vezes. Sem variação no mundo, o sistema prende o acaso.

### 1.3 Por que isso importa para a teoria
- Achar a região certa não basta. Para um sinal **percorrer um caminho específico** na malha, é preciso um **mínimo de determinismo** (formulação do responsável): a relação constituída tem de fazer a Uint disparar de forma confiável.
- Hoje temos **seleção** (a força vai para o lugar certo) sem **determinação** (nenhum caminho domina o bastante para integrar).
- Na biologia, a MSO resolve coincidências com precisão de microssegundos. Alguma coisa ali faz o que nos falta.

---

## 2. Hipóteses (nossas, a testar)

**Hipótese da conservação do lado errado.** A competição por recursos acontece **no lado pós-sináptico** (sinapses vizinhas num mesmo dendrito dividem um estoque local de receptores; Triesch, Vo e Hafner 2018, lido em resumo). Não do lado do axônio, que dividiria uma "força total" entre os seus contatos. Se for assim, a nossa conservação por Upro estaria errada, e os ramos de **Upros diferentes** que chegam à mesma Uint competiriam entre si.

**Hipótese da região como forma da relação.** Um mesmo axônio faz vários contatos no mesmo dendrito (mediana de 4 na MSO do gerbil jovem; Callan et al. 2021, via a investigação de escala). Talvez a divisão entre vizinhos colados **não seja defeito**: os contatos se somariam. O problema estaria na **integração da Uint**: ela não soma contatos que chegam com 0,2–0,4 ms de diferença. Na biologia, a integração dendrítica, a localização dos contatos e a velocidade das correntes definiriam isso.

**Hipótese das cópias em neurônios diferentes.** Pares de atrasos diferentes que codificam a mesma diferença ficam, na biologia, em **neurônios diferentes** (uma população), não no mesmo. Então as cópias seriam trabalho da constituição (Pcrt: uma Uint por cópia), não de competição dentro de uma Uint.

**Hipótese da partida não hebbiana.** A competição pelo disparo só funciona se existir antes uma fase que **concentre** força o bastante para haver disparos. Na biologia, isso poderia vir de escala sináptica, plasticidade heterossináptica, atividade espontânea antes da audição (o cálice de Held fica com uma entrada só antes de ouvir) ou poda de axônios. O que concentra, e por qual regra, antes de existir disparo?

**Hipótese das regras próprias do tronco auditivo.** As regras clássicas (dependência do tempo de disparo, com janelas de ~20 ms) vêm do córtex e do hipocampo. No tronco auditivo, com entradas de centenas de disparos por segundo e precisão de microssegundos, a plasticidade pode ser **outra**: maturação da inibição, ajuste da mielina, poda estrutural, cinética dos receptores. Aplicar a regra cortical ao agudo seria o erro.

**Hipótese do ganho proporcional à taxa.** Com 6× mais eventos no agudo, um ganho fixo por evento soma 6× mais mudança. A biologia teria normalização pela taxa (por exemplo, um limiar de plasticidade que desliza com a atividade média, como na regra BCM) para que a densidade não mate nem infle a força.

**Hipótese do ajuste do atraso em vez do brotamento.** Em vez de brotar vizinhos e escolher, a biologia ajustaria o **atraso do próprio caminho** (mielina; Fields; Pajevic et al. 2014), aproximando chegadas até coincidirem. Isso eliminaria vizinhos, mas usaria a direção do erro, o que hoje a nossa regra proíbe.

---

## 3. Pedido de pesquisa (para o ChatGPT)

### 3.1 Contexto que você precisa ler antes
No repositório `paulosince/emergence`, ramo `claude/pre-v17-ramos`, ler: este documento; `toy-experiments/v17/guia-para-continuar-v17.md` (atualização de 17/11); `toy-experiments/v17/ensaio-minimo/resultados.md` (seções de 17/11); `toy-experiments/v17/investigacao-competicao.md`; `toy-experiments/v17/investigacao-escala.md` (a sua investigação anterior, para não repetir).

### 3.2 Perguntas (por hipótese; busque também evidência **contrária** a cada uma)

1. **Conservação do lado errado.**
   - (a) Na biologia, a competição entre sinapses é limitada por recursos **pré-sinápticos** (do axônio), **pós-sinápticos** (do dendrito ou do neurônio), ou ambos? Com que evidência?
   - (b) Existe conservação ou normalização da força total **por axônio** entre os seus contatos? E **por neurônio** ou por segmento de dendrito?
   - (c) O que se sabe disso na MSO, na LSO, no núcleo coclear ou no núcleo laminar da coruja?
2. **Região como forma.**
   - (a) Quantos contatos um mesmo axônio faz num neurônio da MSO, em que posições, e com que diferença de tempo de chegada entre eles?
   - (b) Qual é a janela de integração efetiva da MSO para entradas do mesmo lado (não só entre as orelhas)? Valores em adultos e jovens.
   - (c) Contatos múltiplos do mesmo axônio são podados até sobrar um, ou permanecem?
3. **Cópias em neurônios diferentes.**
   - (a) Na MSO e no núcleo laminar, diferentes pares de atrasos que codificam a mesma diferença entre orelhas ficam em neurônios diferentes?
   - (b) Há evidência de neurônios que recebem várias "cópias" e de competição entre elas?
   - (c) Como a população se distribui (mapa de atrasos na coruja; codificação por canais largos nos mamíferos)?
4. **Partida não hebbiana.**
   - (a) Que mecanismos concentram força em poucas entradas **antes** de haver disparo pós-sináptico confiável: escala sináptica, plasticidade heterossináptica, atividade espontânea, poda?
   - (b) O que se sabe disso na via auditiva, especialmente na MSO e no cálice de Held?
   - (c) Escalas de tempo.
5. **Regras do tronco auditivo.**
   - (a) Há medidas de plasticidade dependente do tempo de disparo em sinapses da MSO, da LSO ou do núcleo coclear (janelas, sinal, magnitude)?
   - (b) Se não houver, quais mecanismos de refinamento estão documentados ali (inibição, receptores, mielina, poda)?
   - (c) O que acontece com a plasticidade quando a entrada tem centenas de disparos por segundo?
6. **Ganho proporcional à taxa.**
   - (a) Evidência de que a quantidade de mudança sináptica é normalizada pela taxa de atividade (limiar deslizante, metaplasticidade) em sistemas de alta taxa.
   - (b) Valores, espécie e região.
7. **Ajuste do atraso.**
   - (a) Evidência experimental (não só modelos) de ajuste da mielina ou do diâmetro do axônio na via auditiva para sincronizar chegadas (por exemplo, axônios contralaterais para a MSO).
   - (b) O ajuste usa o tempo de chegada (direção do erro) ou só a quantidade de atividade?
8. **Precedente principal.** Ler o **texto integral** de Gerstner, Kempter, van Hemmen e Wagner (1996), *A neuronal learning rule for sub-millisecond temporal coding*, Nature 383:76–78 (PDF em acesso aberto em infoscience.epfl.ch, registro 97773). Descrever a regra: janela, normalização, se o neurônio precisa disparar, como evita a divisão entre atrasos vizinhos e entre cópias, e como lida com a taxa alta. Fazer o mesmo, se possível, com Kempter, Gerstner e van Hemmen (1999), *Hebbian learning and spiking neurons*, e com trabalhos posteriores do grupo sobre a MSO (por exemplo Leibold e van Hemmen 2005, Physical Review Letters).

### 3.3 Regras (valem mais que o volume)
- **Texto integral sempre que possível.** Para cada fonte: título, autores, ano, link real, nível de leitura (integral, resumo e trechos, só resumo), o que sustenta e a confiança.
- **Nunca invente fonte, número ou autor.** Se não achou, diga que não achou. Se não conseguir ler textos, diga logo.
- Separe sempre: **literatura**, **inferência sua** e **proposta nossa**. Diferencie espécie, idade (jovem/adulto), região e tipo celular, e diga a confiança de cada número.
- **Não crie nomes de termos da teoria;** sugira e pergunte. Cite hipóteses e critérios por nome, não por código.
- **Não decida nada;** proponha com recomendação. Nenhuma regra do motor muda por causa desta pesquisa.

### 3.4 Entrega
- Documento novo num ramo separado a partir de `claude/pre-v17-ramos` (por exemplo `investigacao-divisao-forca`), no estilo das investigações anteriores: pergunta, achados por hipótese (a favor e contra), leitura integral, o que muda para o modelo, opções para o responsável, matriz de fontes.
- Uma seção em `docs/innovation-tracking.md` (o que existe, o que seria novo, o que falta para alegar).
- Não toque nos motores nem em `resultados.md`. Pare ao fim e apresente o resumo.

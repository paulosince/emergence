# V0.19 — Do plano ao volume: ponderações, pesquisa, testes e a decisão em aberto (registro de 27–28/11/2026)

**Escrito por:** Claude, a pedido do responsável (Paulo Rogério da Silva): "Registre essa sua resposta, as ponderações, os testes, tudo, até aqui, no repositório. Vou pedir ajuda" (28/11, 07:10).
**Marcas:** [R] responsável; [L] literatura; [A] proposta ou inferência do assistente; [M] medido.
**Ramo:** `claude/v19`. Nada aqui foi validado como concluído: **as escolhas [A] esperam decisão do responsável**.

---

## 0. Para quem for ajudar: onde estamos, em uma página

1. **A V0.19 rodou "pra valer" no desenho planar** (zona de entrada do núcleo como uma folha de um cubo de espessura). A previsão principal passou com folga: na volta da obra, **94–99% das passagens de incidências foram por ramos que já existiam** (limiar decidido: 2/3) (seção 5).
2. **O responsável apontou o problema de forma:** "No cérebro, tudo é organizado em clusters. Volumes. Nada é plano." O assistente concordou que errou na tradução de "local" e no achatamento do núcleo (seções 1 e 2).
3. **O responsável decidiu mudar para a entrada volumétrica e fechar o escopo**, com números humanos (interpolados quando não há número humano) (seção 4).
4. **O motor volumétrico foi implementado e pilotado.** Ele é fiel à divergência do modelo neurobiológico (~14 terminações por fibra), mas custa **~95 s de máquina por segundo de som**. O planar custava ~6. A rodada completa levaria **~41 h** em 2 núcleos, com risco de memória (seção 7).
5. **A questão em aberto (para discutir):** a divergência, na V0.19, gera cópias quase iguais da mesma malha. O ganho real do volume é o **território na escala da lâmina** (~48 fibras por Ustr, contra ~4 no planar). Há uma tensão com a regra das Ustr "~1 por 4 pontos" [R]. **A pergunta ao responsável** é se essa regra pode ser relida como **densidade no volume**, o que permitiria uma terminação por fibra com território de lâmina (seção 8).

**Arquivos de código novos:** `motor/nucleo.py` (geometria), `motor/sdom_vol.py` (motor) e `motor/sessoes_vol.py` (execução). `motor/medida_maioria.py` faz a medida. O motor planar (`sdom.py`, `sessoes.py`) fica intacto, como histórico.

---

## 1. Ponderação 1/3: por que o plano importa

O texto abaixo é o que foi enviado ao responsável em 27/11.

**A pergunta do responsável:** "Apesar de constituirmos um espaço tridimensional, apesar do meu direcionamento de camadas em folhas no eixo yz interligadas no eixo x… porque ainda temos um plano?"

**Medida [M] (ensaio com o nervo, ouvido E):** as 46.602 Uints ficam entre **1 e 10 cubos** atrás das pontas das fibras (20 a 200 µm), quase todas entre 1 e 7. A faixa tem 27,8 mm de comprimento, então a malha é uma lâmina fina.

**Os quatro motivos [A]**, todos vindos das regras e não do espaço:
1. **A borda é uma folha.** O nervo a leva 790 cubos em x, preservando y e z. A zona de entrada vira outra folha, paralela.
2. **Alcance só local.** O território é de 2 × 2 pontos.
3. **"Cubo livre mais próximo"**, com a busca limitada pelo assistente a 3 cubos para dentro. Cada nível novo fica só 1–3 cubos mais fundo.
4. **Poucos níveis.** Houve segundo nível (41 mil ramos saem de Uints), mas pouco além disso.

**A segunda pergunta do responsável:** "No cérebro, tudo é organizado em clusters. Volumes. Nada é plano. E, até onde sei, pouquíssimo aprofunda muito a partir da transdução sem se organizar em grupo de volume antes. Por que isso importa? O que erramos? (Se erramos)"

**Ponderação 1/3 [A]: importa, pelas nossas próprias regras.** O atraso é distância ÷ velocidade, e quem coincide com quem depende de onde as coisas estão. A forma do espaço decide o que pode se constituir. Numa lâmina fina e só local, quatro coisas ficam limitadas:
1. **A convergência.** Foi escrito: "uma célula do núcleo coclear recebe de 2 a 12 fibras, e as octopus recebem dezenas". **Esse número foi dado de memória e não foi conferido.** Aqui, cada Uint recebe de um par vizinho. Com uma Upro jovem valendo 1/4,6 do limiar, quase nenhuma Uint junta entradas suficientes. Inferência: é provável que isso explique boa parte do "só 1–2% integram".
2. **O genérico compartilhado** precisa de lugares onde muitas fontes chegam juntas. Numa lâmina de pares vizinhos, a malha tende a espelhar o espectro.
3. **A diversidade de atrasos.** Todos os caminhos têm de 1 a 7 cubos.
4. **As glias.** No cérebro, os territórios dos astrócitos são volumes que ladrilham o espaço. Aqui, são blocos quase planos.

## 2. Ponderação 2/3: o que erramos

1. **Traduzi "local" na escala errada.** O modelo neurobiológico dizia "as primeiras estações são locais e tonotópicas". O assistente levou isso para 2 × 2 cubos (40 µm). No cérebro, local é **dentro de uma lâmina de mesma frequência que atravessa um núcleo com volume**, na escala de centenas de µm (conferido depois; seção 3).
2. **Achatamos o núcleo.** A faixa tem um cubo de espessura, e a zona de entrada copiou essa forma.
3. **A regra do cubo mais próximo e a busca de 3 cubos** decidiram a posição pela distância, não pela organização.
4. **Por trás dos três:** tratamos o espaço como um recipiente de distâncias, e não como organização. **Perdemos a organização em volumes sem declarar a perda.** Pelo método, esse é o erro.

**O que não erramos:** a ordem tonotópica, o tempo (atraso = distância ÷ velocidade) e o nervo como Upro que cresce.

## 2b. A cóclea planificada: é um erro? Precisa mudar?

**A pergunta do responsável:** "Quero que reflita se a cóclea planificada é um erro, se tem impacto, se não ser planificada faz diferença e se isso (aqui é o grande ponto) precisa ser mudado para uma arquitetura agnóstica de substrato."

**Resposta [A]:**
- **Para a arquitetura, não é um erro.** A cóclea é a Utrd (fronteira), não o Sdom. A geometria dela só chega ao Sdom por três caminhos: de onde partem as fibras, o comprimento das fibras (iguais para todas no motor) e a vizinhança (com o nervo, as coincidências acontecem no núcleo). Enrolar a faixa **não muda nenhum número do motor**. Confiança alta: é consequência direta das regras.
- **No cérebro**, a espiral serve principalmente para caber no osso. Foi citada **de memória, sem conferir**, uma hipótese de ajuda na mecânica dos graves. O nervo reorganiza as fibras: preserva a **ordem**, não a forma.
- **Para a arquitetura agnóstica de substrato:** a forma do receptor é detalhe de substrato. O que importa garantir é a **ordem das dimensões do transdutor** (tonotopia, retinotopia, somatotopia). **O que precisa mudar é a entrada no Sdom**, que não deve copiar a geometria da faixa.
- **Regra geral proposta [A], a discutir:** *toda Utrd entra no Sdom por uma região com volume, organizada pelas dimensões do transdutor e com alcance na escala das lâminas.* É isso que torna possíveis a convergência, os grupos e o genérico compartilhado, que são propriedades do domínio, e não do receptor.

**Resposta do responsável:** "Perfeito. Pesquise e proponha."

## 3. Ponderação 3/3: o que o modelo neurobiológico diz e a proposta

**O que foi encontrado [L]:**
- **Bifurcação.** Cada fibra se bifurca ao entrar no núcleo coclear. O ramo ascendente vai ao AVCN; o descendente atravessa o PVCN e termina no DCN (verbete de capítulo, Springer, resumo). No gato, 16% dos ramos descendentes marcados não chegaram ao DCN (Fekete et al., citado no mesmo resumo).
- **Lâminas em volume.** Camundongo CBA/J: cada injeção produziu uma folha contínua de fibras marcadas, e o mapa de frequência é volumétrico; volume do núcleo de 0,523–0,687 mm³, média 0,611 (Muniak et al. 2013, *J Comp Neurol* 521:1510; resumo e trechos).
- **Espessura das lâminas no gato:** 223 µm (AVCN), 205 µm (PVCN) e 188 µm (DCN), medidas como a distância que contém 90% da marcação. A injeção cobria ~400 µm da cóclea (~70 células ciliadas internas), entre 1,5 e 6,5 mm da base (Leake et al. 2006, *J Comp Neurol* 497:13; trechos do texto integral). Lâminas pareadas de injeções duplas ficaram a 0,78 / 0,40 / 0,73 mm (controles).
- **Terminações em manchas.** No núcleo magnocelular das aves, as terminações de cada axônio formam faixas alongadas, paralelas às faixas de mesma frequência, com manchas (resumo).
- **Terminações espalhadas.** As colaterais de fibras de baixa taxa espontânea se espalham pelo núcleo numa zona fina (legenda de figura, PMC2504762). As terminações pequenas são 94% de todas, em fibras do gato marcadas uma a uma (Rouiller et al., resumo).
- **Somas no núcleo coclear do camundongo:** ~18–25 µm, ≈ 1 cubo (já registrado em 27/11).

**Proposta enviada [A]** (as cinco partes):
1. A cóclea continua plana, como simplificação declarada.
2. A zona de entrada vira um núcleo com volume: cada banda vira uma lâmina de ~10 cubos.
3. A fibra se bifurca ao chegar e deixa terminações ao longo do caminho.
4. As Ustr ladrilham o volume.
5. A convergência surge onde terminações de fibras diferentes se cruzam.

## 4. Decisões do responsável (27–28/11)

| Tema | Decisão | Data |
|---|---|---|
| Mudar para o volume e fechar o escopo [R] | "Vamos mudar e já fechar o escopo da versão com todas as decisões, previsões e PDF para rodar pra valer a V19. Faça as interpolações a partir dos números de camundongos para humanos, se não tiver os números de humanos" | 27/11 (23:36, Paris) |
| Limiar de "em sua maioria" [R] | **Pelo menos 2/3** das passagens de incidências, na volta (Kolodin e Coleman), por ramos que já existiam antes daquela apresentação | 28/11 |
| Escolhas provisórias do motor [R] | **"Confira aplicando o método."** Conferência na seção 6 | 28/11 |
| Previsão para a Chaconne [R] | **"Generaliza, abstrai, reutiliza. E constitui novo no que é específico."** Ainda falta escrever a forma operacional (seção 9) | 28/11 |
| Custo do volume [R] | **"Vamos discutir"**, diante das opções da seção 7 | 28/11 |

## 5. Teste: a medida "em sua maioria" no desenho planar (linha de base) [M]

É o ensaio com o nervo (790 cubos), rodado de novo só para medir. A malha é a mesma, porque o motor é determinístico. As 4 gravações completas no mesmo Sdom, com 1 min de silêncio entre elas. Código: `motor/sdom.py`, `motor/sessoes.py`, `motor/medida_maioria.py`.

**A medida:** passagens de incidências por ramos (cada chegada por um ramo conta uma) que foram por ramos que já funcionavam antes daquela apresentação.

| Ouvido | Apresentação | Passagens por ramos antigos | Integraram (das que desceram por ramos) | Pararam numa Uint sem integrar | Pararam sem ramo adiante | Pararam no ponto (fibra crescendo) |
|---|---|---|---|---|---|---|
| E | 1 Alciatore | — (não havia malha) | 0,63% | 91.546.287 | 1.280.464 | 116.942.336 |
| E | 2 Baiocchi | **93,9%** | 1,15% | 192.445.463 | 1.085.116 | 10.337.525 |
| E | 3 Kolodin | **98,1%** | 2,17% | 158.876.397 | 538.321 | 3.055.956 |
| E | 4 Coleman | **99,3%** | 1,31% | 157.148.076 | 365.366 | 3.084.423 |
| D | 1 Alciatore | — | 0,50% | 84.362.216 | 1.094.184 | 103.113.556 |
| D | 2 Baiocchi | **94,5%** | 1,27% | 156.290.299 | 912.898 | 11.037.695 |
| D | 3 Kolodin | **97,9%** | 2,45% | 128.892.938 | 462.515 | 4.053.810 |
| D | 4 Coleman | **99,2%** | 1,42% | 132.885.546 | 309.600 | 3.102.725 |

**Leitura [A]:**
1. Pelo limiar de 2/3 [R], a volta (Kolodin e Coleman) **passa com folga** nos dois ouvidos, no desenho planar.
2. Quase todas as que não integraram **pararam numa Uint sem integrar**. Poucas ficaram sem ramo adiante.
3. **Cuidado:** como o desenho planar deixa a malha espelhar o espectro (ponderação 1/3), parte da reutilização pode ser só "acenderam as mesmas bandas". É a exigência de 27/11 de separar o genérico do específico, que ainda não foi medida.
4. A execução do ouvido E foi interrompida por um reinício do ambiente e retomada do estado salvo. Já se tinha conferido antes que a retomada dá resultado idêntico.

## 6. Conferência das escolhas provisórias pelo método [L/A] (a validar)

| Escolha | Antes (provisório) | O que o modelo neurobiológico diz | Proposta |
|---|---|---|---|
| Ganho por participação | +0,0065 (≈ 2,0% da força inicial) | Bi e Poo 1998 (texto integral): 60 pareamentos a 1 Hz dão **+48,4 ± 9,9%** (LTP, n = 14). A LTP só aparece em sinapses fracas (< ~500 pA) e diminui com a força inicial | **+0,81% da força inicial por participação** (0,484/60 × 0,326 ≈ 0,0026), aditivo. Era ~2,5× forte demais |
| Punição por chegada tardia | 1/60 da própria força | Mesmo estudo: **−18,0 ± 3,2%** em 60 pareamentos (LTD, n = 12), sem dependência da força inicial | **1/300 da própria força** ((1 − 1/300)^60 ≈ 0,82), multiplicativo. Era ~5× forte demais |
| Janela de punição | 34 ms [R, pacote] | Depressão para disparos até ~20 ms antes do início do EPSP; quase nada além de ~40 ms | Mantida (dentro da faixa) |
| Forma da janela de integração | 1 até 0,3 ms; 0,5 de 0,3 a 0,9 ms | mEPSCs de células em arbusto, octopus, estreladas T e tuberculoventrais: decaimento de **0,35–0,40 ms** (Gardner et al. 1999, *J Neurosci* 19:8721; resumo). O EPSP dura mais que a corrente | Mantida, com confiança baixa. Uma exponencial com τ ≈ 0,37 ms valeria ~0,44 aos 0,3 ms |
| Janela de coincidência da Ustr | 0,3 ms | Deriva do pacote aprovado (componente rápida) | Mantida |
| Busca da Uint candidata | até 3 cubos | Células em arbusto têm dendritos curtos, em forma de arbusto (Tolbert e Morest 1982; Wu e Oertel 1984; resumos). **Não foi achado o número** do campo dendrítico | Mantida em 3 cubos (60 µm), agora em 3D. Confiança baixa |
| Uint já existente no cubo | reutiliza | Convergência de várias fibras numa célula (bulbos terminais; Spirou et al. 2023 mede razões de convergência, número não lido) | Mantida (um soma por cubo) |
| Teto de variantes por par | 8 | Sem base direta | Mantido, declarado |

**No motor volumétrico** (`sdom_vol.py`) já estão o ganho e a punição propostos. O motor planar não foi alterado.

## 7. Teste: o motor volumétrico e o piloto de custo [M]

### 7.1 Números humanos e interpolações [L/A]

| Grandeza | Valor usado | Base | Confiança |
|---|---|---|---|
| Nervo coclear humano | **26 mm = 1.300 cubos** (~87 ms à velocidade basal; 15.600 reacessos para crescer) | Canal auditivo interno de "pouco menos de 1 cm" (Musiek, texto de divulgação) ou 10–17 mm (Bergström, citado em J Anat 2004; resumo). Trecho cisternal: 16,48 ± 1,78 mm (10 nervos, cadáver; Springer 2012, resumo). Um texto de divulgação dá ~22 mm | média-baixa (soma de partes de estudos diferentes) |
| Fibras do nervo humano | ~33.700 (0–10 anos); o robô tem 21.731 (V0.18, não muda) | Makary et al. 2011, *JARO* 12:711 (resumo) | alta para o número humano |
| Volume do núcleo coclear humano | ~29 mm³ (adultos de 25–36 mm³ por década) → escalado pelas fibras do robô: **18,7 mm³** | Sharma et al. 2014, estereologia, 41 núcleos (tabela do PDF). **Conflito:** só o VCN adulto deu 5,43 mm³ noutro estudo (1981, resumo) | baixa |
| Núcleo coclear do gato | 21,2 mm³ (18,5–23,6) | Leake et al. 2008, *JARO* (trecho) | alta |
| Divisão AVCN : PVCN : DCN | 43 : 20 : 36% | Hamster, sem as regiões granulares (PMC4470322, tabela). Proporção humana não encontrada; no humano, o DCN é "relativamente grande" (Moore e Osen 1979, resumo) | baixa |
| Espessura da lâmina | **10 cubos (200 µm)** | Gato: 188–223 µm para ~1,6% da cóclea. Uma banda do robô = 1/64 ≈ 1,56% da faixa. Escala linear pelo volume, (18,7/21,2)^(1/3) ≈ 0,96 | baixa-média |
| Lados das lâminas (x = sensibilidade, z = ramo) | AVCN 40, PVCN 27, DCN 36 cubos | √(volume da subdivisão ÷ (64 × 10)) | derivado |
| Ustr da zona de entrada | ladrilhos de 8 × 7 × 8 cubos: 5.796 por ouvido (~1 por 3,7 pontos) | Regra [R] ~1 por 4 pontos | derivado |

Pedido do responsável: interpolar do camundongo. **Não foi achada a espessura das lâminas no camundongo.** Por isso a base é o gato, mais o volume humano.

### 7.2 Geometria implementada [A] (`motor/nucleo.py`)
- y = eixo tonotópico (64 lâminas de 10 cubos); x = sensibilidade (16 colunas da V0.18 espalhadas pela largura da lâmina); z = eixo dos ramos.
- A fibra chega à zona de bifurcação (z = 0). O ramo ascendente atravessa o AVCN (z > 0); o descendente atravessa o PVCN e segue até o DCN (z < 0).
- **Uma terminação em cada território (ladrilho) que o ramo atravessa.** Equivalência proposta: dentro de um território, várias terminações da mesma fibra são uma só para a Ustr. Resultado: **14 terminações por fibra, 304.234 por ouvido**.
- O atraso de cada terminação é o do nervo mais o do ramo (|z| + desvio em x, em cubos, à velocidade basal).
- A Uint candidata nasce no cubo livre mais próximo do par, **em 3D** (raio de 3 cubos), e as terminações não ocupam cubo. O território da Uint é o ladrilho que contém o cubo.
- A Ustr compara cada incidência que não integrou com as recentes do território (anel de 128 por território), com a mesma regra: só o último registro de cada membro, janela de 0,3 ms.
- **Perdas declaradas [A]:** as lâminas são planas e paralelas (no cérebro, ondulam); as bordas entre subdivisões são retas; a proporção é do hamster; os 16% de fibras sem ramo ao DCN não estão no motor.

**Membros por território [M]:** mediana 50 terminações, p95 95, máximo 180. No planar eram ~4 pontos. **Cada território vê ~48 fibras.**

### 7.3 Piloto de custo [M]
- **Condição:** ouvido D, Alciatore, até 15 s. Fibra encurtada **só para o ensaio de custo**: 600 reacessos para chegar ao núcleo (`V19_TRTESTE=600`, com outro cache), para que o núcleo ficasse ativo cedo. Os outros números são os da seção 6.
- **Aos 10 s:** 104.764 Uints, 2.599.410 ramos e 2.837.037 disparos, em 310 s de máquina. **Aos 15 s:** 104.764 Uints, 2.904.975 ramos e 9.988.290 disparos, em 786 s.
- **Custo:** ~60 s de máquina por segundo de som entre 5 e 10 s, e **~95 s/s entre 10 e 15 s**, com o núcleo cheio. O planar fazia ~5,7 s/s.
- **Estimativa:** Gymnopédie ×4 (~13 min) + Chaconne (750 s) ≈ 26 min de som → ~41 h nos 2 núcleos da máquina, com os ouvidos em paralelo. Os ramos passariam a capacidade (4 milhões) e a memória (7 GB no total) ficaria em risco.
- **Por que o custo explode [A]:** fibras vizinhas na cóclea correm lado a lado na lâmina. Em cada território atravessado, a fibra reencontra as mesmas vizinhas, e o motor monta ~14 vezes a mesma malha em lugares diferentes. Com ~48 fibras por território, os pares possíveis por território passam de ~6 para ~1.100.

### 7.4 As opções levadas ao responsável
1. **Volume completo, em etapas:** Gymnopédie ×4 primeiro (~21 h, dá a previsão principal), depois a Chaconne (~20 h), retomando do estado salvo.
2. **Uma terminação por subdivisão** (3 por fibra): ~1/5 do custo. Perda: dentro de cada subdivisão, as terminações formam uma folha.
3. **Divergência como perda declarada** (1 terminação por fibra): custo perto do planar. Pela regra atual das Ustr, o "local" volta a ~4 fibras.
4. **Outra máquina:** preparar para rodar com mais núcleos e memória.

**Resposta [R]:** "Vamos discutir."

## 8. A resposta do assistente para a discussão (28/11) e a pergunta em aberto

> **Por que o custo explode.** No cérebro, a fibra do nervo é uma linha dentro da lâmina e deixa terminações ao longo do caminho. Isso é a divergência: uma fibra fala com muitas células. Fibras vizinhas na cóclea correm lado a lado na lâmina, então, em cada território que a fibra atravessa, ela reencontra as mesmas vizinhas. Com ~14 terminações por fibra, o motor monta ~14 vezes a mesma malha em lugares diferentes. Como hoje todas as Uints têm um só conjunto de números [R], essas cópias fazem quase a mesma coisa; só mudam de lugar e de atraso.
>
> **O que de fato muda em relação ao planar: o território.** No planar, cada Ustr via ~4 pontos (o bloco 2×2). No volume, cada uma vê ~48 fibras: o "local" na escala da lâmina, que era o erro da ponderação 2/3. Esse é o ganho que importa. As cópias pela divergência são, na V0.19, mais custo do que informação. Isso muda quando as subdivisões tiverem tipos de célula diferentes (arbusto, estrelada, polvo).
>
> **A tensão.** A densidade de Ustr decidida (~1 por 4 pontos) só dá territórios de ~48 fibras se o volume estiver cheio de terminações, ou seja, com a divergência. Com uma terminação por fibra, a mesma densidade encolhe o território de volta para ~4 fibras. Existe um caminho do meio: **uma terminação por fibra, com território na escala da lâmina**. Para isso, a regra "1 Ustr por 4 pontos" precisaria ser relida como densidade **no volume** (Ustr por volume de tecido), e não por ponto. Quem decide essa releitura é o responsável.
>
> **Limitação prática.** No ambiente do assistente, um processo só continua rodando enquanto a sessão está ativa. Rodadas de ~2 dias são possíveis, mas frágeis.

**Pergunta em aberto ao responsável:** a releitura da densidade das Ustr (por volume de tecido em vez de por ponto) é aceitável?

**Observações para a discussão [A]:**
- A regra [R] de 23/11 veio de Halassa et al. 2007 (córtex de camundongo): ~1 astrócito por ~4 **neurônios**. No núcleo coclear humano há ~91–212 mil neurônios para ~33,7 mil fibras, ou 3–6 neurônios por fibra. Ler a regra por neurônios, e não por pontos, também mudaria a densidade. Essa leitura é do assistente e ainda não foi conferida.
- O desenho planar teve ~2,1 Uints por fibra (46 mil para 21,7 mil), perto da razão neurônio/fibra do núcleo humano. O piloto volumétrico chegou a ~4,8 Uints por fibra em 15 s, com fibras encurtadas.
- Com uma terminação por fibra e território de lâmina, cada território veria ~48 fibras numa fatia do volume. O custo esperado é de algumas vezes o planar (estimativa, não medida).

## 9. O que falta para fechar o escopo e rodar pra valer

1. **Decisão do responsável sobre a seção 8** (forma do volume e densidade das Ustr) e validação dos números da seção 6 e da tabela 7.1.
2. **Forma operacional da previsão da Chaconne [R: "Generaliza, abstrai, reutiliza. E constitui novo no que é específico"].** Proposta a validar [A]:
   - (a) a Chaconne também passa por ramos antigos numa fração alta;
   - (b) ela cria mais Uints novas que as gravações de volta da Gymnopédie;
   - (c) é preciso dizer **o que** foi reutilizado e o que nasceu novo, por banda e por nível. É a medida que separa o genérico do específico, que falta construir.
3. **Documento de escopo com previsões congeladas e PDF**, depois das decisões acima.
4. **Rodada pra valer:** Gymnopédie (Alciatore → Baiocchi para aprender; Kolodin → Coleman para voltar) e depois a Chaconne no mesmo Sdom, com a medida da seção 5.

## 10. Como rodar (para quem for ajudar)

```
cd toy-experiments/v19/motor
# planar (histórico): sessoes.py; volumétrico: sessoes_vol.py (saídas com prefixo V19_PREFIXO, padrão "vol")
G="../estimulos/satie-gymnopedie1-alciatore.ogg ../estimulos/satie-gymnopedie1-baiocchi.mp3 ../estimulos/satie-gymnopedie1-kolodin.m4a ../estimulos/satie-gymnopedie1-coleman.mp3 ../estimulos/bach-chaconne-goldstein.ogg"
V19_BLOCO=5 V19_CAP=1000000 V19_MAXP=1500000 V19_MAXU=400000 V19_MAXR=4000000 python3 sessoes_vol.py dir $G
python3 medida_maioria.py esq dir        # planar; volumétrico: V19_PREFIXO=vol python3 medida_maioria.py esq dir
```
- **Requisitos:** Python 3, numba, ffmpeg/ffprobe, e o código da V0.18 em `toy-experiments/v18/borda`, que só é importado e nunca alterado.
- **Retomável:** o estado é salvo a cada 300 s em `dados/<prefixo>-estado-<ouvido>.pkl`. Os dados (`motor/dados/`) não vão para o repositório.
- **Memória:** com dois processos, o planar já tinha batido o limite com capacidades maiores. Os tetos acima são os que funcionaram.

# V0.19 — Regra de criação da malha (RASCUNHO)

**Estado:** RASCUNHO para revisão do responsável. Nada aqui está aprovado como conjunto; cada item traz a sua origem.
**Redação:** assistente (Claude), 23/11/2026, a partir de [decisoes-em-construcao.md](decisoes-em-construcao.md) e das investigações da V0.19.
**Marcas:** [R] decidido pelo responsável (com data); [L] literatura; [A] proposta do assistente, a aprovar; [V17]/[V18] regra herdada e aceita naquelas versões.

---

## 1. O que existe no instante zero

| Existe no início | Origem |
|---|---|
| O robô e a sala (cena da V0.18) | [R] 18/11 |
| A borda: Utrd auditivas (microfone + cóclea, 64 faixas, 21.731 pontos transdutivos por ouvido), **intacta** | [R] 22/11 |
| O espaço 3D do Sdom, com coordenadas | [R] 22/11 |
| As glias iniciais (Ustr) perto das Utrd: **proporcionais à capacidade de cada Cpro, ~1 por 4 pontos transdutivos** (~5.430 por ouvido) | [R] 22–23/11 |
| As regras (o que antes se chamava Pcrt), executadas localmente pelas glias | [R] 22/11; [A] redação |

**Não existe no início:** nenhuma Upro, nenhum ramo, nenhuma Uint, nenhum Cpro (o Cpro passa a existir quando há Upro na faixa [V18]). **Conferência obrigatória antes de rodar:** contar as unidades no instante zero; qualquer unidade representacional presente é violação (erro que encerrou a V0.17).

## 2. Princípios que valem para tudo

1. **Determinística em tudo**; a variação vem só do mundo [R 20/11].
2. **Custo local:** nenhum processo varre a malha; cada glia só olha o próprio território [R 22/11]. A borda gera ~1–2 milhões de incidências por segundo por ouvido em música [V18]: tudo tem de caber nisso.
3. **A V0.18 não muda**; tudo o que vem depois é extensão [R 22/11].
4. **Nomes:** só os aprovados (`docs/nomenclature.md`).

## 3. O ciclo de uma incidência

1. A Utrd entrega cada incidência a todas as Upros que saem do ponto transdutivo [V17/V18]. Efeito na saída da Utrd: excitatório [V18].
2. A incidência percorre a Upro (janela de propagação; atraso = distância ÷ velocidade [V18 18/11]) e, pelos ramos, chega às Uints. **A Upro adiciona o efeito à incidência; todos os ramos da mesma Upro entregam o mesmo efeito** [R 22/11].
3. Na Uint, integra se chegar dentro da janela e passar do limiar; senão, expira [V17].
4. **Fracasso** = incidência que expirou sem integrar, ou caminho favorecido que não disparou [V17]. No começo, sem Upro nenhuma, **toda incidência é fracasso**.

## 4. Ustr — o "CRUD" de estrutura [R 23/11]

**Regra aprovada:** janela permissiva + avaliação por território + marca e remoção, com a atividade protegendo da poda.

1. **Registro [A]:** cada Ustr guarda, no seu território, o rastro dos fracassos (onde, quando, de qual ponto transdutivo). Esse registro já é uma representação do que o Sdom faz [R 23/11: parte do Sdom, reforçando seu papel representacional].
2. **Comparação, "cubo mágico" [A, sobre a visão do responsável da V0.17]:** a Ustr compara os fracassos com rastro ainda vivo no território, fixando um e testando os outros ("while que fixa uma variável" [V17]). Testa as diferenças possíveis: **entre faixas**, **entre ouvidos**, **entre momentos**.
3. **Criação na janela permissiva [A]:** onde fracassos coincidem de novo, a Ustr cria **candidatas** — Upros nos pontos transdutivos (das mais sensíveis primeiro [V18]), com ramos para uma Uint candidata posta perto das fontes [R 09/11]. **Exuberância** de atrasos: faixa limitada pela fibra, candidatas espaçadas proporcionalmente, brotamento perto dos quase-acertos [V17]. Sem calcular o atraso: o uso seleciona [V17].
4. **Crescimento e estabilização [V17, faixa de partida]:** crescer com 10–100 acertos em segundos a minutos; estabilizar com acertos em episódios espaçados (~1 h).
5. **Marca e remoção [R 23/11]:** a candidata que não acerta é marcada; a atividade tira a marca; a marcada que continua sem acertar é removida (sumir em 1–4 dias sem acerto [V17]).
6. **Multiplicação [R 22/11]:** quando a carga do território passa da capacidade, a Ustr se divide; a nova se integra à rede local.

## 5. O tipo, o nível e o tempo

1. **O tipo sai do que convergiu** [R 22/11]. Proposta [A]: o tipo é a diferença em que a coincidência se repetiu (entre faixas, entre ouvidos, entre momentos, ou combinações). É uma propriedade da relação constituída, não um rótulo dado antes.
2. **Mesmo tipo, mesma organização** [R 22/11]: a nova relação entra na organização desse tipo, e não numa nova "à frente". Num sistema dinâmico, é isso que cria laços.
3. **Muda-se de nível quando muda o tipo** [R 22/11]. Não há camadas predefinidas nem número de nível no mecanismo [A]: o nível é lido depois.
4. **O "temporo" não é constitutivo de toda relação** [R 22/11]. Proposta de redação [A, em reflexão do responsável]: o tempo é sempre **condição** (as incidências precisam chegar dentro da janela); é **conteúdo** só quando a diferença entre momentos é o que a relação representa (o tipo "entre momentos").
5. Topologia básica [R 22/11, em reflexão]: convergência, divergência e alças, com o efeito como ingrediente.

## 6. Utad — ajuste da condução [R 23/11]

**Regra aprovada:** excesso inicial, estabilização pelo uso e janela que se fecha (base: Hines et al. 2015).

1. [A] Sobre as Upros novas do território, a Utad aplica ajustes de velocidade em excesso; os que acompanham integração (incidências que fizeram a Uint disparar) se estabilizam; os demais se desfazem.
2. [A] Depois de uma janela, a Upro não recebe ajustes novos (o fechamento não depende de atividade, como no modelo neurobiológico).

## 7. Espaço e posicionamento

1. Unidades novas nascem **perto das fontes aferentes** (economia de fiação) [R 09/11].
2. Atraso = distância ÷ velocidade [V18 18/11]; a Utad muda a velocidade.
3. [A] Relações do mesmo tipo ficam agrupadas na região da sua organização. **A regra de posicionamento (proximidade, agrupamento em região) ainda será estudada** [R 22/11].

## 8. Condições a comparar

- **Com e sem relações entre as Ustr** [R 23/11].
- Cada estrutura marcada com a **sessão em que nasceu**, para medir quanto a reapresentação passa pelo que já existia [A].

## 9. Em aberto (a decidir pelo responsável)

1. ~~Há Utad no instante zero?~~ **Decidido (23/11): sim, na mesma proporção das Ustr.**
2. ~~Destino da Upro~~ **Decidido (23/11): pode nascer sem destino; proximidade, com possibilidade de união entre diferentes Utrd.**
3. Como nasce a inibição (Upro com efeito inibitório): quando e por quê?
4. ~~Carga~~ **Decidido (23/11): número de fracassos registrados por tempo.** Falta a capacidade (o limite).
5. A posição 3D dos pontos transdutivos (hardware da borda) e a regra de posicionamento.
6. O critério de "em sua maioria".
7. O "cubo mágico" (item 4.2 e 5.1): **a repensar (23/11)** — era central; o modelo agora é paralelo, local e regional. A redação do tempo (item 5.4) segue em reflexão.
8. Simplificações a declarar: construção determinística; astrócito e micróglia juntos na Ustr; constante glial adaptada do córtex de camundongo; efeito por Upro (ramos de uma Upro com o mesmo efeito).

# V0.19 — Continuidade para outro assistente (ChatGPT)

> **Desatualizado (27/11/2026).** O estado vigente está em [estado-e-orientacoes.md](estado-e-orientacoes.md). Este arquivo fica como registro de 21/11.

**Data:** 21/11/2026. **Escrito por:** Claude, a pedido do responsável (Paulo Rogério da Silva), para outro assistente continuar a V0.19 sem perder decisões nem repetir erros.
**Leia inteiro antes de responder qualquer coisa.** Depois, leia nesta ordem:

1. `CONTINUITY.md` (raiz do repositório) — regras inegociáveis do programa.
2. `docs/program-methodology.md` e `docs/nomenclature.md` — método e nomes oficiais.
3. `toy-experiments/v18/encerramento-transducao.md` — a borda (transdução) que a V0.19 recebe pronta, com as ressalvas.
4. `toy-experiments/v19/decisoes-em-construcao.md` — decisões e pendências da V0.19 (versão de 21/11; ver "Estado do repositório" abaixo).
5. `toy-experiments/v17/decisoes-em-construcao.md` (ramo `claude/pre-v17-ramos`) — regras da Pcrt aceitas na V0.17, que continuam como orientação.

Repositório: `paulosince/emergence`. Ramo da versão: `claude/v19`.

---

## 1. Quem decide e como falar com o responsável

- **O leme é do responsável.** Decisões científicas (mecanismo, critérios, limiares, equivalências, nomes) são dele. O assistente **propõe com recomendação, não decide**, e registra.
- **Nunca criar nomes de termos por conta própria.** Use os nomes oficiais (seção 3). Se faltar um nome, **pergunte** qual é o oficial; não invente sinônimo, nem "provisório".
- **Nunca inventar fontes nem números.** Para cada fonte, dizer se leu **resumo** ou **texto integral**. Para cada número, dizer **a confiança**. Se não souber, dizer que não sabe.
- **Marcar a origem de cada regra:** [R] responsável; [L] literatura (com grau de leitura); [A] proposta do assistente, a aprovar; [M] medido.
- **Se não estiver claro, perguntar** — não inferir.
- **Formato das perguntas e ponderações:** até 5 → todas de uma vez; acima de 5 → uma por uma. Perguntas **estruturadas, com opções** para escolher. Ao pedir um artigo para ele baixar, mandar a referência completa (autores, ano, título, revista, volume, páginas, DOI).
- **Tom:** português, linguagem simples, com cuidado e gentileza. Se ele fizer uma piada ou digressão, responder a ela brevemente antes de voltar ao assunto.
- **Organização:** tudo de um toy-experiment fica na pasta da versão (`toy-experiments/v19/`). Interfaces vão para o GitHub Pages do repositório (`v19/index.html` na `main`), não como artefato.

## 2. O que é a V0.19

**Objetivo [R], palavras do responsável:** "transdução representacional fundamentada" — a transdução das **incidências da borda da V0.18** em **temporotopologia**, de modo que a **reapresentação do mesmo estímulo seja percorrida, em sua maioria, pela temporotopologia previamente vinculada àquele sinal**.

**Dado × criado:**
- **Dado:** o robô (como na V0.18) e as Utrd auditivas — microfone + cóclea + pontos transdutivos, com a borda fechada na V0.18.
- **Criado:** **tudo "da cabeça para dentro"**, a partir das incidências: Upro, Uint, a malha. **Nada disso pode vir pronto.**

> **Erro que encerrou a V0.17 (não repetir):** as Uints (8) eram dadas desde o início. O responsável: "isso mata tudo". Qualquer unidade, ligação ou estrutura do Sdom que exista antes das incidências é violação. Antes de propor qualquer código, confira: o que existe no instante zero? Só robô e Utrd.

## 3. Nomes oficiais (usar exatamente estes)

- **Sdom** — domínio representacional do sistema. Fronteira funcional, não anatômica. Sem nenhuma representação não há domínio; há sistema (com predisposição a criá-lo).
- **Utrd** — "elemento físico que transforma sinais sensoriais em incidências". Na audição: microfone + cóclea (64 faixas). Não está dentro nem fora do Sdom: é parte da fronteira.
- **Upro** — **Unidade Propagadora**. Recebe e repassa, modificando conforme suas características; **não integra como a Uint**. Parte necessariamente da Utrd ou de outra unidade; não há Utrd ligada diretamente a uma Uint.
- **Cpro** — Conjunto propagador (a fibra; na audição, uma por faixa). Passa a existir quando há Upro na faixa.
- **Uint** — unidade que integra. Hipóteses **a testar, não regras**: "integra pelo menos duas Upro aferentes"; "a Upro tem destino efetivo"; a ordem de constituição Uint/Upro.
- **Ramo** — cada ponto de chegada de uma Upro numa Uint, com atraso próprio (uma Upro pode ter vários ramos). Atraso grande na Upro, pequeno no ramo.
- **Pcrt** — o processo que cria estrutura (ver seção 5).
- **Incidência**; **incidência integrada** = a que fez a Uint disparar (a que só promoveu favorecimento ajudou, mas **não** foi integrada).
- **Quase-acerto** — uma **Uint** (nó já constituído) que chega bem perto do limiar sem ultrapassá-lo. **Não** é relação entre incidências.
- **Efeito** — excitação e inibição em conjunto.
- Dinâmica das unidades: **janela de refratariedade**, **janela de reabastecimento de efeito** (com **janela de carregamento**, rápida, e **janela de dispersão**, lenta), **reserva de efeito**, **janela de propagação**, **velocidade de propagação**.
- Borda: **ponto transdutivo** (não "túnel"), **área de intensidade transdutiva**, **janela de fase** (não "suavizador").
- **"Trajeto" não é termo do responsável.** Não use. Também não invente "caminho vinculado", "trilha", "engrama do sinal" etc. como termos: descreva com palavras comuns ou pergunte o nome.

## 4. Decisões da V0.19 (todas do responsável)

| Tema | Decisão | Data |
|---|---|---|
| Abertura | V0.19 aberta; a V0.18 terminou com a transdução fechada | 20/11 |
| Objetivo | Transdução representacional fundamentada (seção 2) | 20/11 |
| Determinística ou estocástica | **Determinística em tudo.** A variação vem **só do mundo** | 20/11 |
| Ruído real | Usar execuções **ao vivo** de obras em domínio público, e sons que "brincam" com a localização | 20/11 |
| Sessões | **Duas sessões de aprendizado e duas sessões que devem usar a malha já criada, em sua maioria** | 20/11 |
| Variação entre apresentações | **A mesma obra em gravações diferentes** (ideal: 3 ou 4 gravações da mesma obra) | 21/11 |
| Fonte em movimento | Aprovada, "se dá pra fazer direito" (plano na seção 7) | 21/11 |
| Pcrt nas sessões de uso | **Ligada** | 21/11 |

**Por que determinística (base registrada):** no modelo neurobiológico as peças são estocásticas (liberação sináptica com probabilidade limitada e variável), mas o caminho percorrido é reprodutível quando o estímulo é rico em transientes (Mainen e Sejnowski 1995, Science 268:1503–1506, doi:10.1126/science.7770778 — lido por extração do PDF; in vitro). A construção (espinhas novas, deriva de representação) é estocástica no modelo neurobiológico; por isso a pendência 3 abaixo.

## 5. Regras da Pcrt que continuam valendo como orientação (da V0.17, aceitas pelo responsável)

- **Transdução só transforma sinais em incidências.** A Utrd, como a Uint, entrega **todas** as incidências a **todas** as suas Upro; só os caminhos com tempos coordenados integram; os demais expiram ou chegam inibidores.
- **A Pcrt trabalha só sobre o que não encontrou representação** (incidências que expiraram sem integração; caminhos favorecidos que não dispararam). Num Sdom virgem, tudo é insumo.
- Ela cria **comparando as incidências convolucionalmente**, "como um while que fixa uma variável, testa todas as outras e avança". O "todas as outras" são as incidências com rastro ainda vivo (orientação, não decisão de mecanismo).
- **Coordena os tempos por exuberância:** cria candidatas com atrasos diferentes, **sem calcular o atraso**, e o uso seleciona. Exuberância escolhida: faixa de atrasos limitada pela fibra + candidatas espaçadas proporcionalmente + brotamento perto dos quase-acertos.
- **Recorrência** = a mesma candidata acertar de novo. Estrutura é construída **aos poucos**, nunca pronta numa coincidência.
- **Faixa de partida (orientação, não números fixos):** crescer com 10–100 acertos em segundos a minutos; estabilizar com acertos em episódios espaçados (~1 h, inclusive por repetição interna); sumir em 1–4 dias se não acerta.
- **Princípio de custo:** a Pcrt **não pode varrer ramos** (no modelo neurobiológico seriam trilhões); limita-se às incidências, que têm teto físico. A borda produz **~1–2 milhões de incidências por segundo por ouvido em música** — qualquer algoritmo tem de caber nisso.
- Hipótese glial do responsável: avaliação **local, distribuída e curta**, nos pontos da malha, em vez de um processo central que varre tudo.
- **Um algoritmo para todos os sentidos** é a aposta; resultados diferentes vêm das fibras e sensores.

## 6. Cuidados que o assistente anterior levantou (não ignorar)

1. **Armadilha do determinismo:** a borda não tem ruído interno (ressalva 1 da V0.18). Com borda e Sdom determinísticos, **o mesmo arquivo tocado duas vezes do mesmo jeito percorre o mesmo caminho por construção** — o teste não pode falhar e não prova nada. Por isso a variação vem de **gravações diferentes**. Repetir a mesma gravação só vale se a cena variar algo entre as apresentações (e o responsável escolheu gravações diferentes).
2. **Andamento:** gravações diferentes da mesma obra variam muito no tempo (ex.: Sonata ao Luar, 1.º mov.: 5 min 36 s com Paul Pitman; 7 min 53 s com Juan Felipe Arjona — ~40%). Uma malha de tempos coordenados pode não reconhecer outro andamento. Se falhar, não significa que a malha esteja errada (inferência do assistente, a avaliar com o responsável).
3. **Controle de especificidade** (proposto, não decidido): uma gravação da mesma obra deixada fora do aprendizado testa **generalização** (deveria ser percorrida pela malha, em sua maioria); uma **obra diferente** testa **especificidade** (não deveria). São testes diferentes — ver pergunta aberta 2.
4. **Gravações binaurais / "8D" não servem:** já trazem os ouvidos de outra cabeça; o robô tem a própria (cabeça esférica de Brown e Duda). A gravação do Pateta que o responsável lembrou é da Disney (protegida): não usar.
5. **Direitos:** obra em domínio público não basta; **a gravação** também precisa ser livre (domínio público ou licença livre). Conferir a licença na página de cada arquivo antes de usar. Gravações antigas famosas (Bernstein 1963, Walter 1956) no Internet Archive/IMSLP **não** têm licença livre clara: fora.
6. **Download:** o servidor do Wikimedia recusou downloads do ambiente do assistente (erro 429); o responsável baixa os arquivos. Registrar cada gravação em `toy-experiments/v19/estimulos/README.md` (obra, intérprete, licença, URL), como na V0.18.
7. **"Em sua maioria"** ainda não tem critério numérico. **Não fixe um número**; o responsável decide (pendência 8).

## 7. Fonte em movimento — plano para "fazer direito" [A, aprovado em princípio]

A cena da V0.18 (`toy-experiments/v18/borda/cena.py`) só tem fontes **paradas**: `ouvidos()` usa um azimute fixo por fonte, a sombra da cabeça (`sombra`, filtro de 1.ª ordem de Brown e Duda) e o atraso de Woodworth (`woodworth`, `atrasar`). Para mover a fonte:

1. Posição da fonte como função do tempo; **atraso até cada ouvido calculado amostra a amostra**, com interpolação fracionária. O Doppler aparece sozinho — **não programar Doppler à parte**.
2. **Sombra da cabeça atualizada em blocos curtos** (ordem de 1 ms; valor a declarar), com transição suave entre blocos, para não haver estalos.
3. Atenuação por distância (1/r) contínua.
4. **Validação obrigatória antes de usar:** (a) fonte "em movimento" parada num ângulo = resultado idêntico (ou com diferença desprezível declarada) ao da fonte fixa atual; (b) diferença de chegada entre ouvidos acompanha Woodworth ao longo do percurso; (c) nenhum estalo no espectro; (d) nível calibrado pela mesma regra (trecho mais forte = 85 dB SPL).
5. Código novo vai em `toy-experiments/v19/` (não alterar a borda fechada da V0.18; importar dela).

## 8. Perguntas abertas ao responsável (fazer exatamente estas, com opções)

1. **Qual obra?** (a) Sonata ao Luar, 1.º movimento — 3 ou 4 gravações (recomendação do assistente); (b) Sinfonia n.º 5, 1.º movimento — só 2 gravações livres achadas; (c) as duas.
2. **O "nunca ouvido" das sessões de uso:** (a) só uma gravação da mesma obra deixada fora do aprendizado; (b) essa gravação + uma obra diferente (recomendação).
3. **A voz que diz "aqui":** (a) recortada de uma leitura do LibriVox (domínio público); (b) gravada pelo responsável.
4. **O percurso da voz:** (a) esquerda → direita, na frente do robô, em passo de caminhada; (b) dando a volta no robô; (c) ida e volta, parando nas pontas.

**Gravações candidatas** (só páginas de arquivo lidas; licença a conferir):
- Sinfonia n.º 5, 1.º mov.: Orquestra Sinfônica de Fulda/Simon Schindler (gravado em 2002, 7 min 16 s, EFF Open Audio License); Skidmore College Orchestra (Musopen, domínio público).
- Sonata ao Luar, 1.º mov.: Paul Pitman (Musopen, domínio público, 5 min 36 s); Juan Felipe Arjona (Creative Commons Attribution 2.5, 7 min 53 s); Bernd Krueger (**MIDI tocado num piano digital**, não execução humana; CC BY-SA 2.0 DE); German Kitkin (IMSLP, licença a ver).

## 9. Pendências da V0.19 (de `decisoes-em-construcao.md`)

1. Como começar o Sdom (decisão do responsável).
2. Enriquecer os testes da V0.18 com variação do mundo — direção dada; falta escolher a obra.
3. **Declarar a simplificação agnóstica** da construção determinística (regra 1 da metodologia: mecanismo entendido, equivalência proposta, perdas declaradas). Perda possível [A]: viés da grade de atrasos das candidatas da Pcrt.
4. Direitos das gravações (seção 6, item 5).
5. Fonte em movimento (seção 7).
6. O que conta como "nunca ouvido" (pergunta 2).
7. Candidatas por obra (seção 8).
8. Critério de "em sua maioria" (a definir pelo responsável, depois do desenho dos testes).

## 10. Ressalvas herdadas da borda da V0.18 (não esquecer)

Sem ruído interno; ~1–2 milhões de incidências/s por ouvido em música; área sensível satura em som forte; intervalos nos graves ~2,4% maiores que múltiplos do período; sem adaptação em lei de potência; não medido: fontes a menos de ±30°, separação do conteúdo de cada fonte; escolhas do assistente ainda sem aprovação explícita: formato da atenuação para som forte, saturação da emissão (0,1), compartimento lento do g (M_g = 1). Detalhes em `toy-experiments/v18/encerramento-transducao.md`.

## 11. O que NÃO fazer (lista curta)

- Não criar nada do Sdom antes das incidências (erro da V0.17).
- Não inventar termos, fontes, números ou licenças.
- Não decidir pelo responsável; não marcar nada como concluído sem a validação dele.
- Não pôr ruído interno no Sdom (decisão: determinística em tudo).
- Não usar a mesma gravação idêntica como "reapresentação" sem variação.
- Não usar gravações binaurais, "8D" ou protegidas.
- Não fazer a Pcrt varrer ramos ou a malha inteira.
- Não alterar a borda fechada da V0.18 nem o repositório TEMPO (`paulosince/temporotopological-relations`, só leitura).
- Não usar a V0.17/V0.18 como restrição onde o responsável redesenhou ("o que passou passou"), salvo onde ele as retomou (seção 5).
- Teoria: a CLEAR atual é a **v43** (em revisão; dá o norte, não é a última palavra). O preprint v2.1.0 está desatualizado. Em dúvida, perguntar.

## Estado do repositório (21/11/2026)

O envio para o GitHub foi **bloqueado** na sessão do Claude. **Não estão no repositório:** este arquivo e a versão de 21/11 de `toy-experiments/v19/decisoes-em-construcao.md` (o responsável tem as duas). O último commit do ramo `claude/v19` no GitHub é "V0.19 aberta (registro inicial de decisões)". Antes de continuar, o responsável deve subir os dois arquivos para `toy-experiments/v19/`.

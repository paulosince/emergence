# V0.19 — Decisões em construção

**Aberta em 20/11/2026** pelo responsável: "V18 fechou. Ela só vai até aqui. Iniciamos a V19." O leme é do responsável.

## O que é dado e o que é criado (estado atual)

| | O quê | Origem |
|---|---|---|
| **Dado** | Robô (como na V0.18) e as Utrd auditivas: microfone + cóclea + pontos transdutivos, com a borda fechada na V0.18 ([encerramento](../v18/encerramento-transducao.md)) | V0.18 |
| **Criado** | Tudo "da cabeça para dentro": o Sdom, a partir das incidências | a definir |

**Ressalvas herdadas da V0.18:** ver [encerramento da transdução](../v18/encerramento-transducao.md), seção "Ressalvas que seguem com a borda".

## Decisões

| Tema | Decisão | Data |
|---|---|---|
| Abertura | V0.19 aberta; a V0.18 terminou com a transdução fechada | 20/11 |
| Objetivo [R] | **Transdução representacional fundamentada:** transdução das incidências da borda da V0.18 em temporotopologia, de modo que a reapresentação do mesmo estímulo seja percorrida, em sua maioria, pela temporotopologia previamente vinculada àquele sinal | 20/11 |
| Determinística ou estocástica [R] | **Determinística em tudo.** A variação vem só do mundo; os testes da V0.18 serão enriquecidos para isso | 20/11 |
| Estímulos: ruído real [R] | Procurar execuções **ao vivo** de obras em domínio público, para trazer o ruído real; e sons que "brincam" com a localização (fonte que fala e corre de um lado para o outro) | 20/11 |
| Sessões [R] | **Duas sessões de aprendizado e duas sessões que devem usar a malha já criada, em sua maioria** | 20/11 |
| Variação entre apresentações [R] | **A mesma obra em gravações diferentes** (ideal: 3 ou 4 gravações da mesma obra) | 21/11 |
| Fonte em movimento [R] | Aprovada, "se dá pra fazer direito" | 21/11 |
| Pcrt nas sessões de uso [R] | **Ligada** | 21/11 |
| Obra [R] | Uma obra com **pelo menos 4 gravações diferentes: 2 para aprendizado e 2 para conferir a reutilização da malha** | 22/11 |
| Som da fonte em movimento [R] | **Sintético e contínuo**, para que a mudança seja só a posição de chegada | 22/11 |
| Percurso [R] | **Contínuo de um ponto a outro, sem saltos, sem "aparecer do nada"** | 22/11 |
| Construção da malha: níveis [R] | **Níveis de organização, do mais genérico (e portanto mais reutilizável) ao mais específico; e um nível específico para "episódio"** | 22/11 |
| Construção da malha: multidimensional [R] | **"A ideia é uma organização multidimensional"**; a imagem de rede em camadas só serviu para lembrar do desenho dele (folhas 2D em camadas 3D, hipótese HCMT da V0.15) | 22/11 |
| Níveis [R] | **Correção (22/11):** o "sim" do responsável foi à proposição (níveis que surgem, sem camadas predefinidas, do genérico ao específico), **não à fórmula estrita** "nível = 1 + maior nível das entradas", que foi sugestão do assistente. Se o nível entra ou não na regra de criação está em aberto | 22/11 |
| Níveis: o que são [R] | "Os níveis têm sua função. Só não são marcos em pedra. **Muda-se de nível quando muda-se o tipo de convergência, de representação de relação utilizada.** Usa-se uma hierarquia lateral, ou em um plano (leia-se multidimensional), quando as relações são de um tipo equivalente naquele nível." (entendimento do assistente a confirmar) | 22/11 |
| Obra escolhida [R] | **Gymnopédie n.º 1** (Satie) | 22/11 |
| Malha topológica [R, em reflexão] | Antes da questão temporal, a malha teria basicamente **convergência, divergência e feedback (alças)**, que, conforme os níveis de profundidade, formam outros tipos de relação | 22/11 |
| Efeito na malha [R] | **O efeito (excitação ou inibição) entra como ingrediente, mas é adicionado às incidências pelas "arestas" (Upro)** | 22/11 |
| Direções das ligações [R] | Pode haver **lateral, descendente e ascendente**. Por ora, falar de **alças** no genérico; se for preciso distinguir, ver o que faz sentido no nosso caso | 22/11 |
| Efeito por Upro [R] | **Cada Upro pode ter o seu efeito** (Upros da mesma unidade podem ter efeitos diferentes) | 22/11 |
| Onde fica o efeito [R] | **Na incidência.** A Upro modifica a incidência; a incidência é uma abstração sem correspondente direto no modelo neurobiológico | 22/11 |
| Efeito nos ramos [R] | **Todos os ramos da mesma Upro entregam o mesmo efeito** (o ramo não modifica o efeito da incidência) | 22/11 |
| Onde fica o efeito [R] | **Na incidência** — "uma abstração para a qual não vai encontrar algo direto na NB"; a Upro adiciona o efeito à incidência | 22/11 |
| Construção da malha: tempo [R] | **O "temporo" não é constitutivo de toda relação.** Isso tem de ficar claro na regra de criação da malha | 22/11 |

## Base da decisão sobre o determinismo [L]

- Elementos estocásticos no modelo neurobiológico: a liberação sináptica tem probabilidade limitada e variável entre sinapses do mesmo axônio (Branco, Staras, Darcy e Goda 2008; Branco e Staras 2009; **resumos**).
- Caminho reprodutível com estímulo rico: com corrente constante, desvio de 0,62 ms no primeiro disparo e 31 ms no último; com corrente flutuante, quase 100% de confiabilidade e desvio abaixo de 1 ms nos melhores blocos, 1–2 ms na maioria; os autores atribuem a variabilidade à falta de transientes, não a ruído interno (Mainen e Sejnowski 1995, Science 268:1503–1506, doi:10.1126/science.7770778; **texto integral por extração do PDF**; in vitro, sem tratar da falha sináptica).
- Audição: sinapses do tronco encefálico com baixa taxa de falha e precisão fina; a convergência deixa as células após o bulbo de Held mais precisas que cada fibra de entrada (**resumos**).
- Construção estocástica no modelo neurobiológico: espinhas novas quase todas passageiras (anotação de referência em Holtmaat e Svoboda 2009, Nat Rev Neurosci 10:647–658); deriva de representação ao longo de semanas, preservando a estrutura de contexto (Ziv e colegas 2013; Keinath e colegas 2022; **resumos**).
- Reprodutibilidade não decidiu: aleatoriedade com semente declarada seria igualmente reproduzível.

## Pendências

1. Como começar o Sdom (a decidir pelo responsável).
2. **Enriquecer os testes da V0.18 com variação do mundo** [R]: direção dada (gravações diferentes da mesma obra + fonte em movimento; 2 + 2 sessões; Pcrt ligada). Falta escolher a obra. Motivo: com borda e Sdom determinísticos, o mesmo estímulo idêntico percorreria o mesmo caminho por construção, e o teste não poderia falhar. A bateria da V0.18 já usava ±0,5 dB, ±0,5° e fase inicial ao acaso.
3. **Declarar a simplificação agnóstica** da construção determinística (regra 1 da metodologia): no modelo neurobiológico a construção é estocástica. Mecanismo, equivalência e perdas a escrever com o responsável. Perda possível, inferência do assistente [A]: viés da grade de atrasos das candidatas da Pcrt (o que fica entre elas só se alcança pelo brotamento).
4. **Gravações ao vivo: direitos da gravação** [A]: a obra em domínio público não basta; a gravação precisa estar em domínio público ou com licença livre. Candidatas encontradas (só páginas de arquivo lidas, licença a conferir uma a uma): gravações ao vivo do Musopen (domínio público); Banda dos Fuzileiros Navais dos EUA, Sinfonia n.º 1 de Beethoven ao vivo (27/01/2019, domínio público); Orquestra Sinfônica de Fulda, Sinfonia n.º 5 de Beethoven (EFF Open Audio License).
5. **Localização em movimento** [A]: gravações binaurais ou "8D" já trazem os ouvidos de outra cabeça, e o robô tem a própria; proposta: criar o efeito na cena (fonte que se move na sala do robô). A cena da V0.18 só tem fontes paradas; a fonte em movimento precisa ser acrescentada. A gravação do Pateta é da Disney (protegida) e não pode entrar no repositório público.
6. **Sessões de uso** [A]: as 2 gravações de conferência testam **generalização**; falta decidir se entra também uma **obra diferente** como controle de **especificidade** (não deveria ser percorrida pela malha em sua maioria).
7. **Candidatas por obra** [A] (só páginas de arquivo lidas; licenças a conferir): Sinfonia n.º 5, 1.º movimento — Orquestra Sinfônica de Fulda/Schindler (2002, EFF Open Audio License) e Skidmore College Orchestra (Musopen, domínio público); Sonata ao Luar, 1.º movimento — Paul Pitman (Musopen, domínio público), Juan Felipe Arjona (CC BY 2.5), Bernd Krueger (MIDI tocado em piano digital, CC BY-SA 2.0 DE) e German Kitkin (IMSLP, licença a ver). Gravações antigas (Bernstein 1963, Walter 1956) aparecem no Internet Archive/IMSLP, mas sem licença livre clara: fora.
9. **Obra com 4 gravações** [A]: candidata nova — Gymnopédie n.º 1 (Satie): Robin Alciatore (Musopen, domínio público; já em `v18/estimulos`, 3 min 4 s), Kevin MacLeod (CC BY 3.0, 3 min 7 s), "Gymnopedie No. 1..ogg" no Commons (3 min 25 s, licença a ver), Gregor Quendel (CC BY-NC 4.0, sobre arranjo de Hiroshi Munekawa). Andamentos próximos entre si, ao contrário da Sonata ao Luar (5 min 36 s × 7 min 53 s). Só páginas lidas.
10. **Som sintético da fonte em movimento** [A]: qual sinal (ruído de banda larga, tom harmônico ou tom puro) e quais pontos de partida e chegada. Notas: tom puro localiza mal; o Doppler (~0,4% a 1,4 m/s, ordem de grandeza) e a mudança de nível com a distância fazem parte da física do mundo, não do sinal.
11. **Níveis e tempo na regra de criação** [A]: ponderações em 22/11 (níveis precisam surgir, não vir desenhados; tempo como condição × tempo como conteúdo; o nível de episódio pede crescimento de uma só vez, em tensão com "estrutura construída aos poucos"). A decidir pelo responsável.
12. **Retomar a investigação da V0.16** [A]: o dossiê HCMT (`v16/dossie-hcmt.md`) já achou que "folhas" por instante não aparecem no modelo neurobiológico, que o tempo aparece como eixo de mapa ou janela de integração, que o tempo fino vira taxa e lugar acima do tronco encefálico, e que há mapas com dois eixos independentes. E a regra aprovada em `docs/mesh-rules-v0.1.md`: "nível = 1 + maior nível das entradas; sem camadas predefinidas". A confirmar se valem para a V0.19.
13. Em reflexão pelo responsável (22/11): se o tipo de convergência sai do que convergiu (HCMT original) e se a regra de criação separa o tempo como condição do tempo como conteúdo.
14. **Efeito por Upro e o princípio de Dale** [L/A, revisto em 22/11]: a redação anterior exagerava a divergência. O princípio de Dale fala só do lado de quem envia (mesma ação química em todas as sinapses; "um neurônio, um neurotransmissor" é leitura errada); co-liberação é comum e há segregação de neurotransmissores entre terminais. E o sinal do efeito depende do **receptor de quem recebe**: acetilcolina excita o músculo esquelético e desacelera o coração; o glutamato conserva o sinal nas bipolares OFF e o inverte nas ON (receptor mGluR6). Logo, efeito diferente por aresta tem apoio no modelo neurobiológico se o efeito ficar no ponto de chegada. Decidido (22/11): o efeito fica **na incidência**, adicionado pela Upro. A declarar [A]: equivalência — Upro + chegada fazem o papel da sinapse (neurotransmissor + receptor); perda candidata — todos os ramos da mesma Upro recebem o mesmo efeito, enquanto no modelo neurobiológico o mesmo axônio pode excitar um alvo e inibir outro, conforme o receptor de cada alvo. (fontes: verbete e livros-texto/resumos; não textos originais)
15. **Nível e alças** [A]: com "nível = 1 + maior nível das entradas", uma alça (A→B→A) faria o nível subir sem fim. Proposta: o nível é fixado na constituição, pelas entradas que constituíram a unidade; ligações laterais e descendentes criadas depois não o mudam. A decidir.

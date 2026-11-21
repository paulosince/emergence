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
6. **Sessões de uso** [A]: o que conta como "nunca ouvido" (gravação da mesma obra deixada fora do aprendizado, obra diferente, ou as duas) — a confirmar com o responsável.
7. **Candidatas por obra** [A] (só páginas de arquivo lidas; licenças a conferir): Sinfonia n.º 5, 1.º movimento — Orquestra Sinfônica de Fulda/Schindler (2002, EFF Open Audio License) e Skidmore College Orchestra (Musopen, domínio público); Sonata ao Luar, 1.º movimento — Paul Pitman (Musopen, domínio público), Juan Felipe Arjona (CC BY 2.5), Bernd Krueger (MIDI tocado em piano digital, CC BY-SA 2.0 DE) e German Kitkin (IMSLP, licença a ver). Gravações antigas (Bernstein 1963, Walter 1956) aparecem no Internet Archive/IMSLP, mas sem licença livre clara: fora.

# Interface de observação ("observatório") — v0 (discussão)

Data: 10/11/2026. Situação: concepção do responsável registrada; arquitetura em discussão; nada implementado.

## Concepção do responsável (10/11/2026)
- Como uma central de **câmeras online**: muitas visões, ao mesmo tempo ou não, escolhidas pelo usuário; a sala vista de diferentes câmeras.
- O **experimento roda ininterruptamente**; a interface mostra só a **gravação**. Sem "executar": selecionar visões; selecionar métricas; data, hora, play, pause, avançar e retroceder.
- **Trilhas como num editor de vídeo:** camada por camada, com métricas, legendas, áudio, animações; algumas trilhas exibem logs com valores e informações; seleção de canais (visual, auditivo etc.).
- **Painel do domínio representacional:** mapa tridimensional com disparos; surgimento e modificação de nós; surgimento e modificação de arestas; surgimento e modificação de outras unidades (marca-passos, gliais etc.); dispersão de neuromoduladores, com seleção do neuromodulador.
- **Mapa com seleção do que se vê (10/11/2026, 15h41):** o usuário dá play e escolhe o que o mapa mostra, em qualquer combinação. Exemplos do responsável: só o surgimento de novos nós; novos nós e arestas; novos nós, arestas e disparos; só a difusão de neuromoduladores, um de cada vez (só acetilcolina, só noradrenalina etc.).
  - **Decisão (15h45):** a interface tem **dois tipos de visualização**: (1) **câmeras**, várias ao mesmo tempo (topo, lado, a que segue o robô, olhos do robô); (2) **mapa interativo do domínio representacional**, com os filtros dentro dele.
  - **Tudo é gravado em trilhas individualizadas**; o mapa mostra cada coisa de forma independente, sem recalcular.
  - **Tudo está sempre no mapa; o filtro controla a opacidade.** O que não está selecionado fica com opacidade reduzida, para dar contexto; **o quão transparente fica é parametrizável**, assim como o quão opaco fica cada filtro selecionado.
  - A confirmar: (b) mais de um neuromodulador ao mesmo tempo (cores diferentes) ou só um; (c) a seleção pode mudar durante a reprodução, sem pausar.
  - Consequência (proposta nossa): cada tipo de evento gravado separadamente e marcado por categoria, para filtrar sem recalcular. Hoje o motor tem um único modulador (novidade); acetilcolina e noradrenalina como moduladores separados ainda não existem.

## Consequências de arquitetura (propostas nossas)
1. **Separar execução e visualização:** um processo contínuo roda robô, sala e domínio e grava; a interface só lê a gravação.
2. **Gravar estado, não vídeo:** poses de todos os corpos (robô, objetos, rato) e estado do céu; as câmeras são desenhadas na hora da reprodução, de qualquer ponto de vista, inclusive câmeras escolhidas depois da gravação. Os olhos do robô são redesenhados do mesmo jeito.
3. **Quadros-chave + eventos (como vídeo):** checkpoints periódicos completos do domínio e do mundo (o contrato de checkpoint já existe) e, entre eles, o fluxo de eventos (descargas, constituições, modificações, liberações, reflexos, comandos, eventos do mundo). Avançar e retroceder = carregar o quadro-chave anterior e aplicar os eventos.
4. **Trilhas:** cada tipo de evento ou métrica vira uma trilha na linha do tempo (sentidos por modalidade, comandos motores, reflexos, surpresas, constituições, concentração de cada modulador, sono e vigília, queijo, rato, lâmpada, logs).
5. **Áudio:** gravar as fontes de som (instante, posição, espectro) ou as envoltórias das faixas da cóclea; sintetizar na reprodução.
6. **Mapa do domínio:** posições constitutivas reais; brilho de atividade no estilo da página do TEMPO (reimplementado, com atribuição; o TEMPO não é alterado); zoom revela Uint, Upro excitatórias e inibitórias, Utrd agrupadas por sentido.

## O que ainda não existe no motor (para o mapa mostrar)
- **Unidades gliais:** não existem no motor v2.
- **Dispersão espacial de neuromoduladores:** o campo de difusão está implementado (`src/space/diffusion.js`), mas o motor usa a concentração uniforme equivalente; há um único modulador (novidade).
- Marca-passos: existem (novidade, relógio, propriedade marca-passo das Uint no sono).

## Decisões do responsável (10/11/2026)
1. **O experimento roda no computador do responsável** (Node, contínuo), por custo. A interface lê a gravação (servida pelo próprio computador ou por armazenamento a definir).
2. **Câmeras fixas aprovadas:** dois cantos altos, uma vista de cima, os dois olhos do robô e uma câmera que acompanha o robô.
3. **Difusão espacial dos neuromoduladores: aprovada** (o motor deixa de usar a concentração uniforme equivalente). **Glias:** discutir junto com a revisão da arquitetura atual.

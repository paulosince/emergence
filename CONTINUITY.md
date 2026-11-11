# Guia de continuidade do EMERGENCE (para qualquer assistente)

Leia **inteiro** antes de mudar qualquer coisa. Atualizado em 10/11/2026 (fim da sessão longa de 09–10/11/2026; o responsável vai continuar num projeto novo).

## 1. Regras inegociáveis
1. **Metodologia** ([docs/program-methodology.md](docs/program-methodology.md)): o modelo é o neurobiológico (não só humano); divergir só com simplificação agnóstica de substrato **justificada** (mecanismo entendido, equivalência proposta, perdas declaradas).
2. **Decisões científicas são do responsável** (mecanismo, critérios, limiares, equivalências). Propor com recomendação; **não decidir**; registrar.
3. **Nunca inventar fontes nem números.** Dizer se leu resumo ou texto integral e a confiança de cada número.
4. **Nomes, não códigos** ([docs/nomenclature.md](docs/nomenclature.md)); indicar se cada regra vem da literatura ou é proposta/inferência nossa.
5. **Não alterar o repositório TEMPO** (paulosince/temporotopological-relations); só leitura.
6. **Versões da CLEAR** ([docs/program-methodology.md](docs/program-methodology.md), 10/11/2026): a **v43** é a última, mas está em revisão pelo responsável: **dá o norte, não é a última palavra**. O **preprint v2.1.0** serve só para as previsões do que o domínio deve formar de forma autônoma (entidades biográficas, self como mais um tipo de entidade), com ressalvas. Em dúvida, **perguntar ao responsável**. O estudo é sobre **consciência** (CLEAR); querer, valia etc. são ramos e instrumentos.
7. Não marcar item do roteiro como concluído sem evidência e validação do responsável.
8. **Limites do Sdom:** seguir o [texto-guia do responsável](docs/sdom-boundaries-guide.md): fronteira funcional e constitutiva (tríade); nada incluído nem excluído por antecipação; existir unidades não é existir Sdom.
9. Separação observador × motor: nada calculado pelo pesquisador entra no motor; identificadores dos canais opacos; nenhuma semântica injetada (robô: R-01 a R-12 de [docs/robot-spec-v0.7-review.md](docs/robot-spec-v0.7-review.md)).
10. A cada proposta ou precedente novo, atualizar [docs/innovation-tracking.md](docs/innovation-tracking.md).
11. Git: ramo `claude/zealous-hawking-sdw2w8`; commit e push a cada passo. O responsável autorizou integrar ao `main` por pull request quando pede para publicar.
12. Preferências do responsável: responder em português; dizer quando não sabe; não inventar; dar a confiança dos números; perguntar quando não estiver claro; não deixar digressões sem resposta.

## 2. Mudança de rumo de 10/11/2026
- A campanha pré-registrada da rodada 1 (motor v1, mundos simples) deu **negativo**; a auditoria contra a v43 atribuiu a maior parte a **erros de implementação** ([docs/clear-v43-reconciliation-v0.1.md](docs/clear-v43-reconciliation-v0.1.md)).
- **"Vamos refazer tudo. Preservaremos apenas o domínio representacional."** Os mundos antigos (quedas, mesa, sala antiga, corpo de um eixo) deixam de ser a base. O novo experimento é um **robô simulado** numa sala.
- O roteiro de 32 passos ([docs/roadmap.md](docs/roadmap.md)) foi feito para os mundos antigos e **será substituído** (9 de 32 itens estavam concluídos).

- **Esclarecimento do responsável (10/11/2026, 21h16):** "Estamos redesenhando tudo. O que fizemos até aqui foram primeiros ensaios, tentativas." O robô e a "fase do motor" (com seu envelope, pré-registro e decisões de fase) são **ensaios anteriores**. O desenho atual pode ser mais uma tentativa ou a própria experiência; ainda não dá para dizer. **"O que passou passou":** não usar decisões de fases anteriores como restrição do redesenho. Elas servem só de registro histórico, salvo quando o responsável as retomar.

## 3. Decisões científicas desta sessão (detalhes nos documentos)
- **Efeito** = excitação e inibição; acrescentado à incidência pelas unidades (todas podem, nenhuma precisa); **soma** limitada a −1…+1; **magnitude** 0–1, **multiplicativa**, pode ampliar; incidências **só nascem de transdução ou de marca-passos**; qualquer unidade pode ter a propriedade marca-passo. [docs/effects-v0.1.md](docs/effects-v0.1.md)
- **Uint**: pelo menos duas aferências; "fontes distintas" = Upro diferentes (mesma origem vale). Confirmação **fortalece**. Ajustar antes de criar (v43 L81–82).
- **Surpresa** = descarga de unidade **não esperada**; esperada = favorecida (≥ 0,2 do limiar) por contribuições emitidas antes da janela de acomodação, contando as **em trânsito** e as vindas de unidades que descarregaram de forma esperada (propagação do esperado). **Maturação** v2 = queda das constituições novas + ordem da surpresa pela aleatoriedade do mundo.
- **Sono**: estados ativos da população (oscilação lenta), todas as Uint com o mesmo impulso; seleção emergente; ganho maior nas Upro entre Uint (acetilcolina baixa); despertar por estímulo forte.
- **Via eferente** ([docs/efferent-path-v0.md](docs/efferent-path-v0.md)): a saída do domínio é uma representação criada a partir do representado pelos movimentos reflexos; **uso inverso da via** por Upro recíprocas; Utrd motora; via final comum soma reflexo e domínio, e o domínio **pode inibir** o reflexo; exploração nasce da relação acontecimento → consequência quando a dinâmica interna gera candidatos a acesso; espasmos no sono: sim.
- **Janela exploratória** (antes "orientação exploratória transitória"): capacidade inicial declarada; age no domínio baixando por um tempo o limiar das representações ligadas a movimento, pelo sistema modulador com liberação localizada; evocação **uniforme** para todos os reflexos; não é Orientação no sentido de ANCHOR. [docs/oet-hypothesis-analysis-v0.md](docs/oet-hypothesis-analysis-v0.md). ANCHOR: manuscrito **cego** (não citar publicamente).
- **Difusão espacial dos neuromoduladores: aprovada.** Glias: discutir na revisão da arquitetura.

## 4. Robô e ambiente (decisões em [docs/robot-spec-v1.md](docs/robot-spec-v1.md) e [docs/environment-design-v0.md](docs/environment-design-v0.md))
- Só simulação por enquanto; custos ignorados; "o que o experimento precisa, sem concessões"; **o robô precisa poder se tocar**.
- 40 cm; tronco cúbico de 25 cm; rodas de 15 × 5 cm, eixo 3,5 cm à frente do centro (sob o centro de massa); **rodinhas de treino** que só tocam o chão além de 0,15 rad; ombro 3 eixos, cotovelo, punho 2; mãos de 3 dedos com 2 falanges e tendões; pescoço guinada/arfagem/rolagem; **olhos móveis** com câmeras; ouvidos com **cóclea** (64 faixas, 48 kHz); pele no corpo inteiro (pressão, temperatura, vibração, **nocicepção**); propriocepção, vestíbulo, interocepção; **27 atuadores**.
- **Reflexo de equilíbrio só fásico** ("o robô é quem tem que aprender a se sustentar"); reflexos primitivos (preensão, retirada, **orientação**); movimentos espontâneos por marca-passos no corpo; o domínio recebe as incidências dos reflexos.
- Sala 3,0 × 2,5 × 2,5 m; **janela baixa** (peitoril 0,2 m) com **árvore e céu** lá fora; porta com fresta (queijo empurrado **ao anoitecer**); buraco do rato; objetos configuráveis (2 peças tipo Lego, pingue-pongue, bolinha de borracha); sem recolocar; lâmpada acende ao pôr do sol e apaga às 22h; **lua** à noite; **rato** aparece toda noite (depois das 22h), procura comida, explora, provoca, foge do robô em movimento, mexe nos objetos; o ciclo do robô segue a luz e ele pode acordar por estímulo forte.
- **Visão: 80 × 60 por olho a 30 Hz**, com otimizações (mancha de sol geométrica em vez de raios de sombra).

## 5. Estado do código (testes: `npm install && npm test`, 293 passando em 10/11/2026)
- Motor v2: `src/engines/constitutive/engine-v2.js`, `parameters-v2.js`; opções exploratórias `uproMaxGain` (o responsável quer **abaixo de 0,9**; valor a fixar com o número de aferências) e `expectationPropagates` (**aprovada**, ainda desligada por padrão). Motor v1 preservado (registro da rodada 1).
- Robô: `src/robot/body/robot-model.js` (MJCF), `src/robot/body/simulation.js` (MuJoCo, `@mujoco/mujoco` 4.0.0; R1 fásico; perturbação física semeada).
- Sala e céu: `src/robot/world/room.js`, `sky.js`, `robot-world.js`.
- Visão: `src/robot/senses/vision.js` (raios no MuJoCo), `png.js` (prévias em `docs/images/`).
- Controles exploratórios do v2: `experiments/v2-controls.js`, relatório [docs/v2-controls-exploratory-report.md](docs/v2-controls-exploratory-report.md).
- Interface pública antiga (motor nos mundos antigos): https://paulosince.github.io/emergence/constitutive.html. Página de apresentação privada para o gerente: https://claude.ai/artifact/9NYYj8ydu9a5BaqKonm6QD.

## 5b. Revisão da arquitetura (em andamento desde 10/11/2026, 15h47)
Registro em [docs/architecture-review-v0.md](docs/architecture-review-v0.md). Decidido até agora: limites do Sdom (sem representação não há Sdom; Utrd é fronteira; [texto-guia](docs/sdom-boundaries-guide.md) com precedência das falas diretas do responsável); Upro só existe com destino e nasce das transduções; regra de formação comum (hebbiana), especialização na Utrd e nos parâmetros de janela; dois caminhos de formação (terceiro fator com algumas repetições; recorrência espaçada), marca acumulada com limiar (caminho com terceiro fator fecha em 10%); janela de cada modulador por modulador e por local definido pelo canal; [metodologia](docs/program-methodology.md): arquitetura herdada não se entrega pronta. Pesquisa de [aprendizado diferido](docs/deferred-learning-v0.md) (10/11, noite): decidido mesma regra com fonte interna de coatividade, refratário vale para reativações, reativação no repouso e no sono; pergunta 2 virou hipótese H5, confirmada (compressão surge do encadeamento; reexecução segue a ordem na velocidade da ativação; intervalos guardados nas relações, recuperáveis com controle); pergunta 5: uma malha com dois ritmos, observando se surge região de plasticidade rápida. Pendente: pesquisar o mecanismo de controle que "segura" o andamento. Noite de 10/11: **Upro e Uint fechadas** (especificações nas seções 2.15 e 3.16 da revisão); novos termos aprovados (velocidade de propagação, ação sob modulação, marca de consolidação, nível de consolidação, janela de integração); regra "incidências só surgem de transdução" (marca-passos são Utrd endógenas). Manhã de 11/11: **cinco moduladores** (acetilcolina, noradrenalina, dopamina, serotonina, adenosina; nomes biológicos como exceção declarada); um modulador por Uint moduladora, com a exceção noradrenalina + dopamina; conteúdo × extra conteúdo da Uint moduladora vai a um **seletor de experiência com dois gêmeos no mesmo espaço, um vendo o outro** ([moduladores](docs/modulator-release-v0.md), seção 6). **Pendentes:** posição das Uint moduladoras e quando usá-las; detalhar a liberação de moduladores pelas Uint; implementar C1 e as mudanças da revisão no motor; decisão sobre os destinos da Utrd eferente (a) e ligação fixa × formada (b); consequências 2 a 5 dos limites (teste da determinação autônoma etc.); depois Upro, Uint, marca-passos, moduladores e glias.

## 6. Próximos passos (plano aprovado; ordem atual)
1. **Revisar a arquitetura atual** com o responsável (inclui as **glias**).
2. Passo 3 — sentidos: visão a 80 × 60 com otimizações; **audição** (fontes de som, propagação aos 2 microfones, cóclea gamatone de 64 faixas); pele com temperatura, vibração e nocicepção; interocepção (bateria, temperaturas); **camada de transdução** (Utrd que emitem só na variação, magnitude pela variação, identificadores opacos).
3. Passo 4 — reflexos primitivos e movimentos espontâneos; comandos como incidências.
4. Passo 5 — rato e queijo (comportamento do rato; chiados).
5. Passo 6 — ligação com o domínio: via inversa, Utrd motora, via final comum, despertar sensorial, difusão espacial dos moduladores; depois a janela exploratória (E0, E1, E2 e controles pareados).
6. **Interface de observação** ([docs/observatory-interface-v0.md](docs/observatory-interface-v0.md)): o experimento roda **continuamente no computador do responsável** e grava estado (poses, eventos, quadros-chave); a interface só reproduz a gravação, com várias câmeras (dois cantos altos, vista de cima, olhos do robô, câmera que acompanha), mapa 3D do domínio (disparos, nós, arestas, outras unidades, dispersão de cada neuromodulador), trilhas como num editor de vídeo, logs, data/hora, play/pause/avançar/retroceder.
7. Novo roteiro, pré-registro v2 (mantendo o negativo da rodada 1), calibração, campanha.

## 7. Questões em aberto
- Ganho máximo da Upro (abaixo de 0,9) junto com o número de aferências por Uint.
- Gravação: tamanho por dia (estimativa de centenas de MB a alguns GB, confiança baixa; medir) e de onde a interface lê.
- Leitura a confirmar: exploração antes de existirem relações vem só de reflexos e movimentos espontâneos do corpo.
- Data de referência da lua nova (06/01/2000 18h14 UTC, de memória) a verificar.
- Alerta de ANCHOR: homeostase representacional (bateria, temperatura) seria "querer mínimo"; prever nos critérios.

## 8. Armadilhas técnicas encontradas
- MuJoCo JS: `d.contact` devolve **uma cópia**; chamar `.delete()` no vetor e em cada contato, senão a memória do WebAssembly esgota. Buffers de saída: `new mj.IntBuffer(n)`, `.GetView()`, `.delete()`.
- `framequat` com `objtype="body"` dá o referencial de **inércia**; usar `xbody` (erro já corrigido; medidas antigas de inclinação estavam distorcidas).
- A simulação dos mundos antigos leva ~85 s por mundo; o motor roda em menos de 2 s.
- Latência dos instrumentos imita estrutura do mundo; sementes independentes para cada fluxo aleatório; contar unidades não mede formação.

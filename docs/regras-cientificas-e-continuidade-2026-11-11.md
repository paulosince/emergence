# EMERGENCE — Regras científicas, escopo e continuidade (11/11/2026)

**Estado:** registro de decisões e diretrizes expressas pelo responsável nesta conversa; **não** é aprovação de novos mecanismos técnicos.  
**Precedência:** complementa `CONTINUITY.md`, `docs/program-methodology.md` e `docs/decisions-log.md`. Em conflito, **não resolver silenciosamente**: confrontar a decisão mais recente, seu escopo e a confirmação do responsável.  
**Finalidade:** permitir continuidade rigorosa entre conversas, pesquisadores e assistentes, sem depender de memória conversacional.

## 1. Objeto e hierarquia dos trabalhos

1. **A finalidade científica é testar hipóteses da CLEAR**, inclusive procurando refutá-las. EMERGENCE é o **modelo experimental principal**, destinado a execução continuada na máquina do responsável, não uma coleção de toy models.
2. **Toy models são instrumentos subsidiários e ocasionais**, somente quando uma dúvida específica não puder ser resolvida com confiança adequada por raciocínio e literatura. Cada toy model deve explicitar pergunta, hipótese, controles, resultado e limites; não pode se tornar objetivo autônomo nem ditar a arquitetura do modelo principal.
3. O sistema completo deve permitir observação do desenvolvimento do Sdom e sua interação com ambiente e corpo, conforme especificações existentes. **Execução contínua** e **campanhas controladas reproduzíveis** são regimes distintos e complementares.
4. O repositório **TEMPO permanece congelado e somente leitura**. Toda ampliação ocorre em `emergence`; não modificar TEMPO nem seu histórico.
5. As decisões científicas e alterações de escopo pertencem ao responsável. Assistentes propõem, investigam e registram, mas **não promovem hipóteses a regras aprovadas**.

## 2. Método científico obrigatório

1. **Investigação independente → confrontação bibliográfica → refinamento informado**, sem avançar entre fases sem autorização. Reconhecer que modelos de linguagem não garantem independência absoluta da literatura aprendida.
2. **Diferenciar origem e estatuto** de cada afirmação: decisão do responsável; hipótese do responsável; dedução/proposta do assistente; resultado da literatura; observação experimental; convenção de implementação; parâmetro exploratório.
3. **Não confundir possibilidade, suficiência e necessidade**; não reivindicar originalidade sem busca de anterioridade adequada; distinguir fonte primária lida integralmente, resumo e referência secundária.
4. **Buscar contraexemplos ativamente**, incluindo condições-limite, entradas indistinguíveis, variação de tempos, saturação, competição, ausência de estímulos, reinício e falhas de acesso.
5. **Não simplificar sem demonstrar equivalência funcional**: mecanismo original, funções preservadas, condições, perdas, exceções e testes de ablação/comparação. Seguir `docs/program-methodology.md`.
6. **Sem JSON explicativo**: um atributo ou rótulo não substitui um processo operacional. Propriedades, relações e distinções causais precisam existir no mecanismo executável, não só em metadados interpretados.
7. **Não confundir codificação, recuperação, utilização e representação**. O nascimento de Uint/Upro ou aprendizagem adaptativa não demonstra por si só representação; avaliar a tríade da CLEAR (organização especificadora, fundamentação transdutiva e determinação autônoma), incluindo a constituição inicial sem circularidade.
8. **Não programar para confirmar a teoria**. O instrumento deve tornar observáveis os fracassos; preservar resultados negativos e hipóteses concorrentes.
9. Não introduzir jargão ou mecanismos alheios às decisões sem **explicar origem, função, motivação, alternativas e estatuto**; priorizar Utrd, Upro, Uint, Pcrt, incidência, confiança, estabilidade, consolidação e terceiro fator.
10. Não transformar automaticamente literatura neurobiológica em exigência arquitetural; confrontar e documentar antes de incorporar.

## 3. Garantias exigidas do instrumento

- **Rastreabilidade:** toda regra executável aponta para decisão/hipótese/referência, versão, justificativa e teste.
- **Auditabilidade:** reconstruir quais incidências, origens, tempos, estados e operações produziram constituição, modificação, descarga e eliminação de cada estrutura; registros devem permitir verificação, não apenas declarações narrativas do motor.
- **Reprodutibilidade:** conservar versão/commit, parâmetros, condições iniciais, sementes e fluxos aleatórios separados, entradas ambientais, intervenções e cronologia. Em execuções determinísticas, repetir condições deve repetir resultados.
- **Testabilidade e falseabilidade:** critérios observáveis de êxito, fracasso e parada definidos **antes** da campanha confirmatória; controles positivos/negativos, ablações e testes adversariais.
- **Integridade:** dados brutos, resultados negativos, execuções interrompidas, desvios e mudanças de parâmetros devem ser preservados; não reinterpretar exploração retrospectivamente como teste pré-registrado.
- **Separação motor/observador:** métricas e interpretações não realimentam o motor sem hipótese e mecanismo explícitos. Identificadores de canais são opacos; não injetar categorias, objetos ou representações pré-definidas.
- **Relógio científico independente da renderização**; observatório deve ler registros/checkpoints sem determinar a dinâmica interna.
- **Controle de recursos e segurança:** limites de execução, armazenamento e envelope experimental; parada que falha fechada; checar riscos antes de execuções prolongadas.
- **Três níveis distintos de evidência:** (1) correção do código, (2) comportamento funcional sob testes, (3) satisfação da teoria representacional. Passar em um nível não valida os demais.
- **Resultados reproduzíveis, não apenas capturas de tela:** publicar ou preservar protocolos, scripts, versões, logs suficientes, análises e critérios de exclusão.
- **Gestão de mudanças:** parâmetros exploratórios não se tornam pré-registrados; campanhas congelam versão e protocolo; correções posteriores produzem nova versão, preservando resultados anteriores.

## 4. Escopo científico imediato — constituição inicial

**Pergunta vigente:** quais operações mínimas da **Pcrt** permitem que incidências provenientes das **Utrd na borda** constituam autonomamente as **primeiras Upro e Uint**, sem pressupor o Sdom, a Uint de destino ou relações já existentes?

Condições de partida do experimento conceitual:
- Utrd operacionais na borda, recebendo estímulos físicos e produzindo incidências;
- **zero Upro e zero Uint constituídas inicialmente**;
- Pcrt como predisposição constitutiva pré-representacional, com operações a investigar e justificar;
- Upro possui origem e destino efetivos: **não existem arestas para lugar nenhum**;
- primeira Uint e pelo menos **duas Upro diferentes convergentes** são constituídas conjuntamente; duas Upro podem partir da mesma Utrd;
- coincidência de chegada não equivale automaticamente à simultaneidade de emissão: considerar tempos de propagação;
- investigar entradas isoladas, coincidências, repetições, indistinguibilidade, diferenças de atraso e condições adversariais;
- distinguir explicitamente **constituição** de **seleção, reforço, maturação e consolidação posteriores**.

**Lacuna aberta prioritária:** como a Pcrt detecta/retém condições constitutivas antes da existência de relações e unidades, sem circularidade? Candidatos anteriores (detecção direta, condição precursora transitória, constituição exploratória seguida de seleção) são **hipóteses**, não escolhas aprovadas.

**Não investigar nesta etapa**, salvo dependência funcional demonstrada: dinâmica de confiança, estabilidade, consolidação, marca transitória, neuromodulação, difusão, sono, poda e aprendizagem de relações já existentes. É permitido definir estado inicial mínimo estritamente necessário para uma nova Upro operar, sem estudar sua evolução.

## 5. Decisões arquiteturais recentes trazidas da discussão com Claude

Estas decisões foram relatadas pelo responsável nesta conversa e devem ser reconciliadas com os documentos de código anteriores antes de qualquer alteração:

- **Intensidade física:** representada pelo **número de Upro recrutadas** por vias de diferentes limiares na Utrd; distinguir via potencial, via efetivamente constituída e via ativada. Não pré-criar Upro para faixas ainda não experimentadas.
- **Magnitude na fronteira transdutória:** fixa; após passagem pela Upro, **magnitude = confiança × modulação**. O **ganho independente foi retirado** desta formulação recente. Verificar conflito com a especificação anterior `m' = min(1, m × g)` em `docs/effects-v0.1.md` e no motor v2; **não reconciliar por suposição**.
- **Confiança da Upro:** propriedade aprendida de relação, pode nascer elevada conforme evidência inicial; aumenta por confirmações, diminui por contradições verificáveis (lapidada), **não decai pela mera ausência de contato**.
- **Estabilidade da Upro:** é **a própria marca de consolidação**, não uma marca intrínseca adicional; cresce com recorrência espaçada, mecanismos de consolidação, reserva e reativação pertinentes; sofre decaimento basal mais rápido quando baixa e mais lento quando alta.
- **Consolidação:** `C = confiança × estabilidade`; classes efêmera, estável e consolidada; **`C = 0` implica poda**. Necessário especificar matematicamente extinção em tempo finito, caso a dinâmica escolhida seja assintótica; não inventar limiar de poda como se já aprovado.
- **Uint jovem:** limiar de integração inicialmente menor, aumentando com maturação. Propriedades intrínsecas da Uint além disso ainda exigem decisão.
- **Frequência física → incidências:** em aberto (sincronização temporal, vias diferentes, limitações de banda).
- **Topologia física → organização das Upro:** em aberto quanto ao mecanismo; proximidade pode favorecer sem impor cópia topográfica; não fixar grades/linhas/colunas como representação pronta.
- **Adaptação das Utrd:** em aberto.
- **Frequência de incidências:** propriedade de uma sequência, não atributo intrínseco de uma incidência isolada.
- **Confirmação/contradição:** precisam de definição operacional sem avaliador onisciente e sem confundir inibição, atraso, indisponibilidade ou falha de acesso com refutação.

**Atenção à temporalidade:** estes itens são posteriores a documentos do repositório datados de 09–10/11; não significa que estejam implementados, nem que todos os contratos antigos tenham sido formalmente revogados. Registrar divergências e pedir decisão quando necessário.

## 6. Neuromodulação: parte do programa, mas fora do foco imediato

- Já há hipótese arquitetural de **dispersão espacial** dos neuromoduladores, liberados por **Uint moduladoras** constituídas segundo regras gerais. Os cinco em discussão: **acetilcolina, noradrenalina, dopamina, serotonina e adenosina**.
- Difusão **não foi inventada pelos toy models** e já possui documentação no repositório (ver `docs/spatial-diffusion-v0.1.md`, `docs/modulatory-units-v0.1.md` e `docs/neuromodulation-v0.1.md`).
- **Terceiro fator** é um mecanismo modulatório que pode favorecer consolidação; não é automaticamente uma marca de elegibilidade, nem o próprio processo de difusão.
- Não introduzir campos ou marcas de elegibilidade como se fossem decisões aprovadas. Se houver necessidade de memória temporal para modulação tardia, demonstrá-la e comparar alternativas; não deslocar uma variável para outro lugar e alegar redução de complexidade.
- **Toy models V1–V4** discutidos nesta conversa trataram confiança/estabilidade/marca/captura seletiva; são **explorações laterais**, não validação da constituição inicial, não definem arquitetura canônica e não justificam mudanças sem aprovação. Resultados de testes de software não equivalem a validação científica.

## 7. Projeto completo e estado do repositório

Consultar **antes de agir**:
1. `CONTINUITY.md` — guia operacional e estado do projeto, inclusive histórico negativo e reorientação para robô simulado.
2. `docs/program-methodology.md` — método de aproximação neurobiológica e simplificações agnósticas.
3. `docs/decisions-log.md` — decisões históricas.
4. `docs/nomenclature.md` — terminologia.
5. `docs/robot-spec-v1.md`, `docs/environment-design-v0.md`, `docs/observatory-interface-v0.md` — corpo, ambiente e observatório.
6. `docs/preregistration-v1.md` e `docs/campaign-motor-phase-report-1.md` — preservar campanha negativa, sem reescrever história.
7. `docs/innovation-tracking.md` — anterioridade e rastreamento de inovação.
8. Código e testes atuais — **documentação não substitui verificação da implementação**.

Diretrizes técnicas históricas: JavaScript Vanilla + ESM, persistência local, execução contínua, observatório separado, exportação e registros científicos. O repositório já registra também Node.js, MuJoCo e um robô simulado; **não presumir que a descrição anterior da sala ou a primeira geração dos mundos seja o desenho vigente**.

## 8. Protocolo obrigatório para uma nova conversa

1. Ler `CONTINUITY.md`, este documento, metodologia e decisões; depois os documentos especializados do tópico.
2. Identificar **qual documento e versão estão vigentes**, o que foi implementado, o que foi aprovado mas não implementado, e o que é hipótese.
3. Resumir a pergunta científica atual e **o escopo estrito** antes de propor implementação ou toy model.
4. Verificar conflitos entre decisões de datas diferentes e não resolvê-los silenciosamente.
5. Para cada proposta nova: mecanismo efetivo, origem (responsável/literatura/assistente), alternativas, contraexemplos, critérios de teste e impacto na arquitetura.
6. Para código: preservar versões anteriores, registrar commit, parâmetros, sementes, protocolos e resultados; não alegar testes executados sem evidência.
7. Registrar decisões novas e atualizar o guia de continuidade e rastreamento de inovação, conforme aplicável.
8. Se houver lacuna essencial, perguntar ao responsável **antes de preencher com conveniência de implementação**.

## 9. Registro dos erros metodológicos corrigidos nesta conversa

- **Erro:** sequência de toy models de consolidação tratada como objetivo principal. **Correção:** toy models são subsidiários; EMERGENCE é o experimento principal contínuo.
- **Erro:** introduzir difusão e elegibilidade local como se fossem mecanismos novos ou necessários para a constituição inicial. **Correção:** difusão de neuromoduladores já estava postulada, mas **não pertence ao problema imediato**; elegibilidade local foi proposta experimental não aprovada.
- **Erro:** tratar comportamento de um toy model como prova de necessidade de variável adicional. **Correção:** falha de implementação candidata não demonstra impossibilidade de todas as alternativas.
- **Erro:** omitir explicação e origem de novos termos. **Correção:** manter terminologia do responsável e identificar qualquer introdução conceitual.
- **Erro a evitar:** usar um campo ou estado descritivo para esconder mecanismo não explicado; ou afirmar que dois mecanismos são equivalentes sem testar preservação de funções.

---

**Regra final:** precisão, auditabilidade, reprodutibilidade, testabilidade e possibilidade de refutação têm precedência sobre conveniência, elegância, velocidade de implementação e resultados aparentemente favoráveis. Em caso de insuficiência de evidência, manter a questão aberta.

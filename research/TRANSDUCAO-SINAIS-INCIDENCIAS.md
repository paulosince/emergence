# Transdução de sinais em incidências — consolidação e auditoria adversarial

**Data:** 12/11/2026. **Versão:** candidata 0.1. **Estado:** decisões do pesquisador consolidadas; testes adversariais lógicos realizados; contratos adicionais propostos pelo assistente **não aprovados**. Nenhuma validação empírica ou implementação alegada.

**Escopo:** fronteira Utrd → incidência, antes da constituição representacional. Não alterar arquivos históricos V1/V2 nem o TEMPO congelado. Documentos relacionados: [ARQUITETURA-UNIDADES.md](ARQUITETURA-UNIDADES.md) e [ROTEIRO-MECANISMOS-LACUNAS.md](ROTEIRO-MECANISMOS-LACUNAS.md).

## Etapa 1 — Decisões consolidadas

| Classe | Propriedade | Decisão do pesquisador | Limite |
|---|---|---|---|
| Escalar | Intensidade | Mínimo zero, máximo físico da Utrd, resolução da Utrd; recrutamento cumulativo de fibras; magnitude fixa da incidência na borda | Número exato depende de definir nível/intervalo e fronteira de fibra |
| Escalar-temporal | Frequência | Dentro da faixa: incidências acompanham oscilações detectáveis; acima: perde-se acompanhamento temporal, podendo restar resposta sustentada; adaptação conforme modalidade | Não supor detector universal de saturação |
| Temporal | Duração | Emissão enquanto fenômeno permanece detectável | Adaptação pode suprimir resposta |
| Temporal | Intervalo | Ausência de emissão durante interrupção detectada; tempo entre incidências | Silêncio também pode decorrer de adaptação |
| Temporal | Fase | Diferenças nos instantes de emissão entre Utrd | Limitada por latências/resolução |
| Temporal | Ritmo, sequência, recorrência | Organização temporal de incidências, sem codificação específica | Reconhecimento ocorre depois |
| Orientacional | Direção, sentido, orientação | Não codificados na transdução; dinâmica posterior | Exige aferências adequadas para ser inferível |
| Distribucional | Localização, extensão | Distribuição física das Utrd ativadas; sem coordenadas semânticas nas incidências | Geometria e identidade física precisam persistir |
| Distribucional | Padrões, gradientes | Distribuição de Utrd e intensidade/recrutamento | Não garante reconhecimento |
| Composicional | Simultaneidade | Instantes efetivos, sem compensação artificial de latência | Simultaneidade física pode não ser preservada |
| Composicional | Combinação de sinais | Cada Utrd transduz independentemente; composição posterior no Sdom | Não introduzir composição representacional na borda |
| Transversal | Polaridade | Vias físicas distintas para polaridades opostas; recrutamento cumulativo por via | Definir grandezas em que polaridade é aplicável |
| Transversal | Referência | Utrd opera em sua própria faixa; comparação e referencial são constituídos depois | Não presumir referencial absoluto representado |
| Transversal | Persistência | Coberta por duração | Resposta pode adaptar |
| Transversal | Resolução | Limite físico por grandeza e por Utrd, sem mecanismo abstrato extra | Parâmetros específicos por modalidade |

**Status:** princípios funcionais aprovados em conversa. Não confundir com contrato operacional exaustivo.

## Etapa 2 — Auditoria adversarial

### A1 — Fibra não pode ser silenciosamente igualada a Upro

**Condição inicial aprovada:** Utrd operacionais, zero Upro, zero Uint. **Contraexemplo:** estímulo não nulo precisa recrutar 3 fibras, mas não existe Upro. Se fibra = Upro, a transdução é impossível antes da primeira constituição.

**Conclusão lógica:** ou as fibras transdutórias são saídas físicas pré-representacionais distintas de Upro, ou é preciso outro mecanismo constitutivo anterior. A distinção **não** autoriza inventar Upro predefinidas. **Em aberto para decisão.**

### A2 — Máximo e resolução exigem convenção explícita de estados

Se a faixa [0,M] tem cinco **intervalos**, existem seis pontos de fronteira; se existem cinco **níveis positivos distinguíveis**, o estado zero pode perfazer um sexto estado. A afirmação «cinco níveis = cinco fibras» é coerente para código cumulativo com cinco níveis positivos, mas não define por si os limiares, nem arredondamento, nem histerese.

**Caso adversarial:** x exatamente em um limiar; ruído em torno dele provoca liga/desliga frequente. Definir regra de borda e considerar histerese como **candidata**, não pressuposto.

### A3 — Saturação e perda de informação

Acima de M, diferentes intensidades podem recrutar o mesmo máximo de fibras. Acima da resolução temporal, frequências físicas diferentes podem gerar sequências indistinguíveis ou respostas sustentadas. **Não** inferir valor real a partir da saturação; distinguir saturação de intensidade, perda de acompanhamento temporal e adaptação.

### A4 — Persistência, intervalo e silêncio

Um estímulo constante pode produzir incidências inicialmente e depois nenhuma, devido a adaptação. Assim, o Sdom não pode interpretar todo silêncio como término de estímulo. **A regra aprovada é «enquanto detectável», não «enquanto fisicamente presente».** Não acrescentar marcador artificial de presença.

### A5 — Latência e fase

Duas Utrd com latências distintas podem emitir em instantes diferentes diante de estímulos fisicamente simultâneos; frequências altas podem produzir aliasing ou perda de sincronização. Decisão aprovada: não compensar artificialmente; registrar que a transdução preserva tempos **efetivos**, não simultaneidade física garantida.

### A6 — Distribuição espacial sem mapa pré-programado

Ativação espacial preserva diferenças físicas somente se identidade e localização das Utrd forem operacionalmente estáveis. A existência de padrão físico não demonstra constituição de representação espacial. O Sdom não recebe rótulos «esquerda», «posição» ou «direção» como significado pronto.

### A7 — Uma Utrd por vez versus várias fibras

A serialidade de operações transdutórias não proíbe necessariamente emissão conjunta em várias saídas ao término de uma operação; porém exige contrato claro para eventos concorrentes, tempo de sensibilização, ocupação e recuperação. Não definir arbitrariamente sincronismo ideal.

### A8 — Polaridade e escala

Vias distintas funcionam quando a grandeza física comporta oposição de sinais; não pressupor que toda grandeza seja bipolar. O ponto de referência físico (zero) e o sentido de cada via devem existir na constituição do sensor, não em descrição interpretativa.

### A9 — Propriedades físicas não necessariamente preservadas

Diferentes fenômenos podem produzir incidências indistinguíveis: posição dentro de um mesmo campo receptor, intensidade dentro do mesmo nível, eventos abaixo do limiar, frequências acima do limite. Não confundir **possibilidade de distinguir** com **garantia de distinção**.

## Etapa 3 — Contrato operacional mínimo candidato (assistente, não aprovado)

**C1.** Uma Utrd possui interface física real, faixa operacional por grandeza, resolução, latência e limites de atividade; nenhum valor de grandeza é apresentado ao Sdom como significado.

**C2.** Para intensidade, uma Utrd pode possuir N saídas físicas pré-representacionais, com limiares ordenados; para cada entrada detectável, ativa-se cumulativamente o subconjunto de saídas cujos limiares são atingidos. Zero pode corresponder a nenhuma saída ativa. **Pendente:** aprovação explícita da distinção «saída/fibra física» versus «Upro constituída», limiares exatos e estado zero.

**C3.** Uma incidência de borda possui evento de origem operacional, instante efetivo e magnitude fixa. A identidade da saída física é operacional, não um rótulo semântico. **Pendente:** conciliação com efeito excitador/inibidor e forma de acesso pré-Upro pela Pcrt.

**C4.** Uma Utrd emite incidências sucessivas para ocorrências/oscilações que consegue detectar e acompanhar; não gera números de frequência, fase, duração ou ritmo. A frequência de emissão é limitada por sua dinâmica física.

**C5.** Acima da faixa de acompanhamento, a resposta pode perder sincronização e, conforme modalidade, tornar-se sustentada ou adaptar-se. Não impor adenosina nem sinal universal de saturação.

**C6.** Enquanto um estímulo permanece detectável, pode haver emissão; quando deixa de ser detectável, pode cessar. A ausência de emissão não é prova de ausência física.

**C7.** Múltiplas Utrd e vias de polaridade preservam diversidade de origens e tempos efetivos; não há compensação global de latência, cálculo prévio de direção, mapa representacional ou integração multimodal na borda.

**C8.** A primeira constituição de Upro/Uint deve ocorrer por Pcrt sem assumir Upro já existentes. O contrato físico de fibras deve ser compatível com esse requisito.

### Matriz mínima de testes a implementar após aprovação

| ID | Cenário | Verificação |
|---|---|---|
| T01 | Entrada zero | Nenhuma fibra recrutada, se adotado zero silencioso |
| T02 | Entrada em cada limiar | Quantidade cumulativa correta |
| T03 | Entrada entre limiares | Sem nível fictício |
| T04 | Entrada acima do máximo | Saturação sem extrapolação |
| T05 | Ruído em torno do limiar | Identificar instabilidade; não presumir histerese |
| T06 | Frequência acompanhável | Intervalos de emissão compatíveis com latência/resolução |
| T07 | Frequência acima do limite | Não atribuir fidelidade temporal inexistente |
| T08 | Estímulo sustentado com adaptação | Não inferir ausência física por silêncio |
| T09 | Duas Utrd com latências diferentes | Sem correção artificial da simultaneidade |
| T10 | Polaridades opostas | Ativação de vias apropriadas sem codificação semântica |
| T11 | Distribuição espacial | Preservar origens físicas sem mapa representacional |
| T12 | Inicialização com zero Upro/Uint | Pcrt consegue observar condições de borda sem relações ocultas; se não, teste falha |
| T13 | Duas entradas distintas com mesma saída | Registrar colisão informacional e limites da resolução |
| T14 | Emissões simultâneas de fibras da mesma Utrd | Verificar coerência com serialidade e latência |

## Resultado e decisões pendentes

**Consolidado:** 14 propriedades/grupos de propriedades; nenhuma exige representação semântica prévia na Utrd.

**Quatro pontos constitutivos a fechar:** (1) natureza física da fibra versus Upro; (2) estados/limiares e limites de intensidade; (3) forma operacional de atividade sustentada e adaptação por modalidade; (4) contrato de tempo/latência e fidelidade efetiva.

**Questões secundárias:** polaridade em modalidades unipolares, instabilidade de limiar, serialidade versus saídas simultâneas, efeito excitatório/inibitório histórico.

**Não concluído:** prova de suficiência para toda transdução, validação empírica, constituição de representações, Pcrt e mecanismos de modulação. Não avançar para implementação automática.

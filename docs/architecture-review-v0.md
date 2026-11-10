# Revisão da arquitetura atual — v0 (em andamento)

Iniciada em 10/11/2026 com o responsável. Passamos unidade por unidade: o que o motor v2 faz hoje (`src/engines/constitutive/engine-v2.js`) e o que o responsável define. Nada implementado ainda.

## 0. Limites do domínio representacional (leitura nossa, 10/11/2026, aguardando conferência do responsável)
Fontes conferidas: v43 (trechos pela busca do projeto), [especificação do robô v1](robot-spec-v1.md), [revisão da v0.7](robot-spec-v0.7-review.md) e as definições do responsável nas discussões do Sdom.
1. **Critério funcional:** o Sdom existe onde a organização sustenta relações representacionais (transformação computacional + ancoragem transdutiva + determinação autônoma). Não é um lugar do substrato nem um recipiente criado de antemão; a primeira representação o inaugura (v43 L77).
2. **Dentro:** as representações constituídas e suas relações; a malha temporotopológica, com Uint como nós e Upro como arestas.
3. **Na fronteira, fora da malha:** a Utrd, nos dois sentidos.
4. **Fora (sistema S):** corpo, mundo, reflexos, proteções, marca-passos do corpo, relógio, sistema modulador; também as fontes endógenas (dentro do sistema, fora do domínio).
5. **Substrato ≠ domínio:** os elementos livres não são domínio; o vazio inicial é do domínio, não do substrato.
6. **Dúvidas abertas:** (i) os processos (Pcrt, plasticidade, modulação) estão dentro do domínio ou fora, agindo sobre ele? (ii) toda Uint constituída já é domínio, ou só quando participa de uma relação representacional (a v43 diz que unidades individuais não especificam conteúdo)? (iii) o sistema modulador fica em S?

## 1. Utrd (unidade de transdução)

### Definição do responsável (10/11/2026, 15h52)
- O que se usa aqui é **transdução representacional**, não qualquer transdução física.
- A Utrd faz a intermediação entre **tudo o que está fora do domínio representacional** e o domínio, nos dois sentidos:
  - **aferente:** sinais **exógenos** (de fora do sistema) ou **endógenos** (de dentro do sistema, mas de fora do domínio) → domínio;
  - **eferente:** domínio → dentro do sistema (endógeno). A eferência só chega até dentro do sistema; as consequências no mundo dependem dos atuadores.
- A Utrd promove toda transformação necessária: na aferência, sinais elétricos, mecânicos, de temperatura etc. viram **incidências**; na eferência, incidência vira sinal no **canal atuador adequado**.

### Conferência com a teoria
- CLEAR v43 (trechos lidos pela busca do projeto): a Utrd "realizes the conversion between media"; rotas aferentes exógenas e endógenas até o Sdom (Figura 1). **Compatível.**
- Nos trechos da v43 lidos, a figura mostra só rotas aferentes; o sentido eferente vem da definição do responsável. (O preprint v2.1.0 não serve de referência para a arquitetura; ver [metodologia](program-methodology.md), versões da CLEAR.)
- A v43 dá o norte, mas está em revisão pelo responsável; "compatível" aqui não é veredito.

### O motor v2 hoje (diferenças)
1. A Utrd não é uma unidade: é só um identificador de canal; a conversão acontece fora do motor.
2. Só existe o sentido aferente; não há Utrd eferente.
3. A conversão é mínima: emite magnitude 1 e efeito 0 quando a medida muda (a decisão de 10/11 é magnitude pela variação).
4. Não há fontes endógenas (interocepção) ainda.

### Hipóteses da Utrd eferente (o responsável pediu o método completo, 10/11/2026, 16h02)
- **(a)** A Utrd eferente leva só aos atuadores, ou também a outros sistemas internos fora do domínio (por exemplo, o sistema modulador)?
- **(b)** A ligação Utrd eferente → canal atuador é fixa, dada pelo corpo, ou também se forma?

Leitura que a pesquisa assumiu: "domínio ≈ córtex". **Corrigida em 10/11/2026 (16h12), a pedido do responsável:** a fronteira do Sdom é **funcional, não anatômica** (v43: "operational distinctions, not anatomical ones"; o Sdom existe onde as organizações sustentam relações representacionais, e a primeira representação o inaugura). Um neurônio cortical sem representação constituída não é domínio; uma estrutura fora do córtex pode participar. A lista dos destinos (motoneurônios, núcleos moduladores, autônomo, receptores) continua fora do domínio por não sustentar relações representacionais, não por estar fora do córtex. Ver seção 0.

#### Literatura — hipótese (a): para onde vai a eferência
1. **Músculos, por circuitos espinhais e do tronco.** A via corticoespinal raramente comanda o motoneurônio sozinha: o controle motor resulta da rede inteira, não de um comando do cérebro para a medula; ligações diretas córtex → motoneurônio existem em primatas e servem sobretudo à destreza das mãos (Lemon 2008, *Annu. Rev. Neurosci.* 31:195–218; **texto integral**, lido por ferramenta de resumo).
2. **Os próprios sentidos.** A via corticoespinal tem projeção ao corno dorsal em todos os mamíferos e é fonte importante de **inibição pré-sináptica das fibras sensoriais**, o que poderia remover a retroaferência previsível durante o movimento (Lemon 2008, p. 201). O córtex auditivo chega à cóclea pelo sistema olivococlear, que é a via final e obrigatória para modular a membrana basilar e o nervo auditivo (Terreros e Delano 2015, *Front. Syst. Neurosci.* 9:134; trechos do texto integral). Os motoneurônios gama ajustam a sensibilidade dos fusos musculares; no gato há controle independente claro, no ser humano o efeito independente é modesto (Prochazka 2015, *J. Anat.* 227:167–177, e revisões citadas; **resumos e trechos**).
3. **Sistema autônomo e endócrino.** Por vírus da raiva transneuronal em macacos *Cebus*, 63% dos neurônios corticais que influenciam a medula da adrenal estão na rede motora (todas as áreas motoras frontais) e quase 25% no pré-frontal medial; as áreas motoras agem pela medula espinhal e formação reticular, as pré-frontais mediais por hipotálamo, substância cinzenta periaquedutal e formação reticular. Os autores concluem que os comandos viscerais saem das mesmas áreas que preparam e geram o movimento, mas o estudo **não** mostra que os mesmos neurônios façam as duas coisas (Dum, Levinthal e Strick 2016, *PNAS* 113(35):9922–9927, PMC5024624; **texto integral**, lido por ferramenta de resumo; confiança alta nos percentuais).
4. **Núcleos moduladores.** O pré-frontal é uma das poucas entradas corticais do locus coeruleus (noradrenalina), em relação recíproca (Ramos e Arnsten 2007, *Pharmacol. Ther.* 113:523–536, citando Arnsten e Goldman-Rakic 1984, *Brain Res.* 306:9–18; **revisão lida em trechos; o artigo de 1984 não foi lido**). O locus coeruleus, por sua vez, faz sinapse com os neurônios olivococleares (Delano, revisão da Universidade do Chile; trechos).
5. **Uma via, várias funções.** "A single neuroanatomical pathway can mediate many different functions": a via corticoespinal participa do controle da entrada aferente, do bloqueio de reflexos, da excitação e inibição de motoneurônios, do controle autônomo, da plasticidade e de efeitos tróficos (Lemon 2008, p. 201).

**Conclusão (a):** o modelo neurobiológico **não sustenta** "só atuadores". A eferência do córtex chega a quatro classes de destino fora dele: (i) atuadores, quase sempre por circuitos intermediários (reflexos, via final comum); (ii) os próprios sentidos (ganho e bloqueio da entrada); (iii) sistema autônomo e endócrino; (iv) núcleos moduladores.

#### Literatura — hipótese (b): fixa ou formada
1. **Motoneurônio → músculo: dada pelo corpo.** Uma rede de fatores de transcrição Hox estabelece a identidade de cada grupo de motoneurônios e o músculo-alvo; sem o cofator FoxP1, os axônios escolhem trajetos e músculos ao acaso (Dasen et al. 2005, *Cell* 123:477–491; Dasen et al. 2008, *Cell* 134:304–316; Dasen e Jessell 2009; **resumos**). Depois do nascimento há **poda dependente de atividade** da inervação múltipla de cada fibra (em roedores, nas três primeiras semanas), que refina quantos axônios ficam, não qual músculo (Lee, PMC7144835, ano não conferido; **resumo e introdução**). Nota para a discussão das glias: as células de Schwann terminais participam dessa poda (Lee, Thompson e Harlow, PMC5732880; **resumo**).
2. **Córtex → medula: formada pela atividade e pela experiência.** A via corticoespinal é o último sistema motor a se desenvolver; os sistemas do tronco já estão bem desenvolvidos ao nascer. O refinamento (eliminação de terminações transitórias e crescimento para novos alvos) é dirigido pela atividade do córtex motor e pela experiência motora do membro: no gato, silenciar o córtex (semanas 3 a 7) ou impedir o uso do membro deixa conexões alteradas de forma duradoura; os terminais **competem**, os mais ativos ganham espaço, e os perdedores "do not catch up" (Martin 2005, *The Neuroscientist* 11(2):161–173; **texto integral**, lido por ferramenta de resumo; confiança média nas semanas). A organização topográfica básica do mapa motor não mudou com treino, e ganhos do treino se desfizeram em cerca de 4 meses (mesma fonte).
3. **O córtex motor começa como estrutura sensorial.** Em ratos, M1 primeiro codifica os movimentos produzidos pelo próprio corpo, sobretudo os espasmos do sono ativo; a estimulação de M1 só passa a produzir movimento por volta de P25–P35 (dado citado pelos autores, com divergência na literatura); antes disso os movimentos dependem do tronco, como o núcleo rubro. Os autores **propõem, sem testar**, que esse mapa sensorial sirva de referência para dirigir a saída motora ao alvo eferente correto (Glanz, Dooley, Sokoloff e Blumberg 2021, *J. Neurosci.* 41(32):6905–6918; **texto integral**, lido por ferramenta de resumo).
4. **Espasmos treinam os mapas.** Revisão: espasmos mioclônicos do sono ativo ajudam a desenvolver e manter mapas sensório-motores (Tiriac, Sokoloff e Blumberg 2015, PMC4334153; **resumo e introdução**). Precedente em robôs: espasmos imitados num modelo musculoesquelético levam à auto-organização do circuito básico (Blumberg, Marques e Iida 2013, *Current Biology*; **resumo**).

**Conclusão (b):** são **duas ligações diferentes**. A ligação final (motoneurônio → músculo) é **dada pelo corpo**, com poda que só refina. A ligação de cima (córtex → circuitos motores) **forma-se pela atividade e pela experiência**, com competição, e o córtex motor primeiro representa o movimento produzido pelo corpo e só depois passa a produzi-lo. Isso bate com a decisão de 10/11 sobre a via eferente ("representação criada a partir do representado pelos movimentos reflexos").

### Proposta mínima agnóstica de substrato (proposta nossa; aguardando decisão)
**(a) Destinos da Utrd eferente**
| Destino | Recomendação | Motivo | Perda declarada se ficar fora |
|---|---|---|---|
| Atuadores, pela via final comum (soma com o reflexo; pode inibir o reflexo) | **Entra já** | Sem ela não há movimento a partir do domínio; já decidido em [via eferente](efferent-path-v0.md) | — |
| Sistema modulador | **Entra já** | O sistema modulador está fora do domínio; hoje o motor liga a surpresa ao marca-passo da novidade por dentro, sem Utrd. Com a difusão espacial aprovada, o caminho domínio → moduladores precisa ser explícito | — |
| Sentidos (ganho e bloqueio da entrada) | **Depois** | Útil, mas não necessário para os primeiros testes; o robô pode começar com ganho fixo; os movimentos dos olhos já são atuadores | Sem cancelamento periférico da retroaferência; o cancelamento fica só pela expectativa (descarga corolária) dentro do domínio. Teste: comparar com e sem ganho eferente quando entrar |
| Autônomo e interocepção (bateria, temperatura) | **Depois, com alerta** | O robô não tem atuador autônomo hoje; ligar o domínio à própria homeostase toca o alerta de ANCHOR ("querer mínimo") | Sem regulação do próprio corpo pelo domínio; registrar no pré-registro |

**(b) Fixa ou formada**
1. **Utrd eferente → canal atuador: fixa, dada pelo corpo.** Uma Utrd eferente por canal atuador, com identificador opaco, definida pela especificação do robô (equivalente ao par motoneurônio-músculo). Perda declarada: sem poda da inervação redundante. Ela só refina força e não muda o alvo, então a perda parece pequena; testável comparando com ganhos de saída plásticos.
2. **Domínio → Utrd eferente: formada pela experiência**, pelos mesmos processos do domínio (Pcrt, fortalecimento por confirmação, inibição entre concorrentes), nascendo do movimento já representado (via inversa por Upro recíprocas, já decidida). Antes disso, só reflexos e movimentos espontâneos do corpo.
3. **A decidir:** período crítico imposto (como as semanas 3 a 7 no gato) ou emergente da consolidação. Recomendação: **não impor**; deixar emergir e medir.

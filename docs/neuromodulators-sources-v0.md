# Neuromoduladores e quem os libera — tabela-guia v0

Data: 10/11/2026. Pedido do responsável: listar os neuromoduladores que podem ser necessários à consciência e dizer, no modelo neurobiológico, quem os libera (neurônios, glias, glândulas). Serve de guia para decidir se as unidades de liberação ficam dentro ou fora do Sdom (objeção de 17h56 na [revisão da arquitetura](architecture-review-v0.md)). **Nada decidido.**

Fonte principal: Brown, Basheer, McKenna, Strecker e McCarley (2012), *Control of sleep and wakefulness*, *Physiol. Rev.* 92:1087–1187, PMC3621793 — **texto integral, lido por ferramenta de resumo (só o primeiro trecho de ~14% do texto)**; as linhas de adenosina e MCH ficaram incompletas nesse trecho.

| Neuromodulador | Quem libera | Onde | Papel em vigília e ativação cortical | Lesão ou retirada de um só sistema | Fonte (o que foi lido) | Confiança |
|---|---|---|---|---|---|---|
| Acetilcolina | **Neurônios** | Prosencéfalo basal (núcleo basal, septo medial e banda diagonal); tronco (tegmento laterodorsal e pedunculopontino) | Ritmos rápidos e ativação cortical; mais ativa na vigília e no sono REM | Mudanças relativamente pequenas na vigília; "considerável redundância" | Brown et al. 2012 | média-alta |
| Noradrenalina | **Neurônios** | Locus coeruleus | Mais ativa na vigília; sobe com estresse; suprime o REM | Mudanças pequenas na quantidade de vigília | Brown et al. 2012 | média-alta |
| Serotonina (central) | **Neurônios** | Núcleos da rafe dorsal e mediana | Vigília quieta; silencia no REM | Lesão da rafe dorsal sem efeito nas quantidades de sono e vigília | Brown et al. 2012 | média-alta |
| Serotonina (periférica) | **Células enterocromafins** do intestino (células epiteliais, não neurônios) | Mucosa intestinal | Motilidade e reflexos intestinais; ~90% da serotonina do corpo | Não atravessa a barreira hematoencefálica: reservatórios central e periférico separados | revisão PMC8350061 (trecho); StatPearls NBK560856 (trecho) | média-alta |
| Histamina | **Neurônios** | Núcleo tuberomamilar (hipotálamo posterior) | Vigília; excita a maioria dos núcleos de alerta; alerta ligado a estresse e perigo | Efeitos relativamente pequenos no total de vigília em 24 h | Brown et al. 2012 | média-alta |
| Dopamina | **Neurônios** | Área tegmental ventral; substância cinzenta periaquedutal ventral; substância negra | Os agentes de vigília mais potentes agem por aqui | **Exceção:** lesão na periaquedutal ventral reduziu a vigília em mais de 20% | Brown et al. 2012 | média-alta |
| Orexina (hipocretina) | **Neurônios** | Hipotálamo lateral e perifornical | Consolida a vigília; suprime o REM | Vigília total inalterada, mas **fragmentada**; perda em humanos causa narcolepsia com cataplexia | Brown et al. 2012 | média-alta |
| Adenosina | **Astrócitos** (via ATP liberado e convertido) e também outras fontes | Difusa | Fator homeostático de sono: inibe os sistemas de vigília (receptor A1) | Bloquear a liberação dos astrócitos reduziu o acúmulo da pressão de sono | Halassa et al. 2009, *Neuron* 61:213–219 (resumo e trechos); Brown et al. 2012 | média |
| Hormônio concentrador de melanina (MCH) | **Neurônios** | Hipotálamo | Ativos sobretudo durante o sono | Retirada reduziu sono NREM e REM | Brown et al. 2012 (trecho incompleto) | média |
| Gliotransmissores (glutamato, D-serina, ATP) | **Astrócitos** (em debate) | Local | Possível ajuste da transmissão e da plasticidade | **Controverso** em condições fisiológicas | Fiacco e McCarthy 2018 × Savtchouk e Volterra 2018, *J. Neurosci.* 38:3–25 (resumos e trechos) | — (controvérsia) |
| Adrenalina e noradrenalina sanguíneas | **Glândula** (medula da adrenal) | Periferia | Resposta rápida ao estresse; o córtex influencia a medula da adrenal por vias de vários neurônios | Passagem pela barreira hematoencefálica: **não conferida** | Dum, Levinthal e Strick 2016 (lido nesta sessão) | média (origem); baixa (barreira) |
| Melatonina | **Glândula** (pineal) | — | Ritmo circadiano | — | conhecimento geral, **sem fonte relida** | baixa |
| Cortisol | **Glândula** (córtex da adrenal) | — | Eixo do estresse; ritmo diário | — | conhecimento geral, **sem fonte relida** | baixa |

## Achados que pesam na investigação
1. **Nenhum sistema isolado é indispensável à vigília.** A revisão conclui que nenhum deles "appears to be absolutely essential" (Brown et al. 2012). Lesões combinadas de três populações (orexina, colinérgicas do prosencéfalo basal e locus coeruleus) não mudaram o total diário de vigília em ratos (Blanco-Centurion, Gerashchenko e Shiromani 2007, *J. Neurosci.* 27:14041–14048; resumo).
2. **O que derrubou a vigília foram lesões grandes, não de um modulador:** lesões grandes do prosencéfalo basal ou do complexo parabraquial-precoeruleus deixaram os animais sem resposta e com EEG lento abaixo de 1 Hz, enquanto lesões extensas do tálamo tiveram pouco efeito (Fuller et al. 2011, *J. Comp. Neurol.* 519:933–956; resumo).
3. **Vigília não é consciência:** o estado vegetativo mostra vigília sem consciência (Mashour, Orser e Avidan 2011, *Anesthesiology*; trecho). Moduladores parecem necessários para o **nível** de consciência em conjunto, com redundância, e não suficientes para o **conteúdo**.
4. **Quem libera:** na tabela, os moduladores centrais clássicos vêm de **neurônios** que integram entradas; a adenosina tem forte componente **astrocitário**; as **glândulas** liberam no sangue e quase sempre ficam do outro lado da barreira hematoencefálica.

## Leitura para o desenho (proposta nossa, a decidir)
- A hipótese "um conjunto de moduladores é necessário à consciência" ganha uma forma mais precisa: **o conjunto, com redundância, é necessário ao nível; nenhum isolado é**. Isso sugere testar ablações combinadas, não só de um modulador.
- Para a questão dentro × fora do Sdom: os liberadores centrais são **neurônios integradores**, o que combina com a alternativa de tratar a liberação como **propriedade de unidade** (como a propriedade marca-passo), deixando a pertença ao Sdom para o critério da tríade.
- As glândulas e as fontes periféricas ficam em S (fora), alcançadas por Utrd; as glias (adenosina) entram na discussão G1, G2, G3 do [texto-guia](sdom-boundaries-guide.md).

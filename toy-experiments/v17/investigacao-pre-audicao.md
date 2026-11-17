# V0.17 — Investigação: estrutura que se forma antes de ouvir

**Pedido do responsável:** 17/11/2026 ("investigar agora"), depois que a investigação de escala (ChatGPT) apontou que há estrutura auditiva formada antes do início da audição, o que desafia a ideia de que tudo é selecionado pelo som.
**Redação:** assistente (Claude). **Estatuto:** primeira passada; nada aqui é decisão.
**Legenda:** [L] literatura (com o que foi lido); [A] inferência ou proposta do assistente; [R] decisão do responsável.
**Como foi lido:** pelo WebFetch, que entrega uma **extração feita por um modelo auxiliar**, não o texto cru. "Integral" quer dizer que o extrator relatou ter visto o texto completo. Várias páginas do PMC bloquearam com reCAPTCHA; nesses casos ficou só o resumo ou o trecho da busca.

## 1. Pergunta

Na biologia, quanto da estrutura da via auditiva (a) já vem dado, (b) é refinado por atividade gerada pelo próprio sistema antes de haver som, e (c) só se forma com a experiência do mundo? E o que isso diz para a decisão "o mundo seleciona" da V0.17?

## 2. Achados

### 2.1 Há uma fase com atividade própria, antes do som [L]
- O início da audição em roedores: camundongo P10–12, rato P11–13, gerbil P12 (Wang e Bergles 2015, revisão; integral via extração).
- Antes disso, a cóclea gera **atividade espontânea em surtos**: as células ciliadas internas disparam, e células de suporte (órgão de Kölliker) liberam ATP. Há debate sobre qual é o gatilho principal (mesma fonte).
- O ATP é liberado em pontos e ativa **grupos de células ciliadas vizinhas** ao mesmo tempo (mesma fonte). A revisão sugere que essa sincronia entre vizinhas ajudaria a afinar a tonotopia por plasticidade do tipo Hebb, mas chama esses papéis de "largamente especulativos".
- Um trabalho posterior descreve a atividade antes da audição como **parecida com a futura resposta a tons puros**, e relata que interrompê-la deixa a sintonia em frequência mais larga depois (Kersbergen et al. 2022; **só o trecho da busca**, a página bloqueou; confiança baixa).

### 2.2 O que essa fase faz [L]
- **Afinação do mapa tonotópico:** num camundongo sem a inibição colinérgica das células ciliadas (nocaute α9), o **padrão temporal** da atividade espontânea muda sem mudar o nível; o mapa inibitório MNTB→LSO não se afina (falham o fortalecimento, o silenciamento e a poda dos axônios) (Clause et al. 2014; **resumo**).
- **Cálice de Held: exuberância, competição e poda antes de ouvir.** Em camundongos, no dia P2 cada célula-alvo recebe em média **9,3 ± 6** entradas (a maioria entre 5 e 12); em cerca de dois terços das células a competição termina com **uma entrada só em até 3 dias**; tudo antes do início da audição (Holcomb et al. 2013; integral via extração; os autores dizem que as estimativas de competição são mínimas e que a amostragem de 24 h pode perder etapas). O artigo **não testa** diretamente se o processo independe do som; propõe que a passagem para surtos vindos da cóclea seja o gatilho.
- **Sobrevivência e maturação:** sem a entrada da cóclea antes da audição, neurônios do gânglio espiral e do núcleo coclear ventral morrem; depois da audição, não (Wang e Bergles 2015). Isso indica um período crítico **anterior** à experiência.

### 2.3 Nem tudo depende disso [L]
- Algumas linhagens de camundongos surdos congênitos têm tonotopia que "parece normal" (Wang e Bergles 2015). A fiação inicial depende de moléculas de orientação de axônios; a atividade espontânea refina (Ceriani e Marcotti 2026, revisão; **trecho da busca**).

### 2.4 O que só se forma com o som — e é o alvo da V0.17 [L]
- **A sintonia de diferença de tempo entre os ouvidos amadurece depois do início da audição.** Gerbils criados em ruído branco vindo de todas as direções, num período logo após o início da audição, ficam com sintonia de **filhote** (como 3 dias após o início); a mesma exposição em adultos não tem esse efeito (Seidl e Grothe 2005; **resumo**).
- **A inibição da MSO é refinada pela experiência:** os contatos inibitórios passam a ficar no corpo da célula depois da audição, e isso **depende da experiência**; não acontece em mamíferos que não usam diferença de tempo para localizar (Kapfer et al. 2002; **resumo**). Com ruído omnidirecional, as mudanças de maturação da inibição não acontecem (Magnusson et al. 2005; **resumo**).

## 3. O que isso diz para o modelo [A]

1. **Três camadas, não duas.** (a) **Dado:** orientação de axônios, tonotopia grosseira (no EMERGENCE: anatomia, parâmetros, a vizinhança ±2 já decidida). (b) **Atividade própria do sensor, antes do mundo:** refina o dado, com exuberância, competição e poda (cálice de Held). (c) **Selecionado pelo mundo:** o que depende da experiência.
2. **A V0.17 mira justamente a camada (c).** A relação binaural de tempo, na biologia, é uma das que **precisam** do mundo (Seidl e Grothe 2005; Kapfer 2002). Então a evidência não contradiz o teste da V0.17; ela o localiza. O que ela corrige é a frase genérica "tudo é selecionado pelo mundo".
3. **A vizinhança dada pela anatomia (decisão de 16/11) fica mais bem fundamentada:** é o tipo de estrutura que, na biologia, vem antes do som.
4. **Exuberância guiada antes do mundo?** O cálice mostra exuberância e poda **guiadas por atividade própria**. Uma possibilidade, a decidir, seria uma fase anterior ao Bach em que as Utrd emitem surtos próprios, correlacionados entre vizinhas. Cuidados: (i) não sei se a atividade espontânea das duas cócleas tem alguma relação de tempo entre si; se não tiver, essa fase não daria nada à relação binaural (não verifiquei); (ii) seria um mecanismo novo, que precisa de pré-registro.
5. **Ligação com o problema de partida** (força inicial 0,15, sem quase-acertos no começo): uma fase de atividade própria **poderia** levar as forças a outro ponto antes do mundo. É especulação minha, que não deve ser usada como remendo.

## 4. Perguntas ao responsável
- A distinção em três camadas (dado; atividade própria antes do mundo; selecionado pelo mundo) serve para a teoria e para o modelo?
- Vale investigar mais a fundo a camada (b) agora (por exemplo, se há correlação entre as duas cócleas antes da audição, e o padrão temporal dos surtos), ou isso fica para depois da V0.17?

## 5. Fontes (estado de leitura)

| Fonte | Link | Leitura | Sustenta |
|---|---|---|---|
| Wang, H. C. e Bergles, D. E. (2015). *Spontaneous activity in the developing auditory system.* Cell Tissue Res. | https://core.ac.uk/download/357392181.pdf | integral, via extração | 2.1, 2.2 (sobrevivência), 2.3; idades de início da audição |
| Holcomb, P. S. et al. (2013). *Synaptic inputs compete during rapid formation of the calyx of Held.* J Neurosci 33:12954. | https://pmc.ncbi.nlm.nih.gov/articles/PMC3735879 | integral via extração (referências cortadas; há uma correção publicada, não vista) | 2.2 (cálice) |
| Clause, A. et al. (2014). *The precise temporal pattern of prehearing spontaneous activity is necessary for tonotopic map refinement.* Neuron. | https://peeref.com/works/13920902 (resumo) | resumo | 2.2 (padrão temporal) |
| Kersbergen, C. J. et al. (2022). (correlação antes da audição; TMEM16A) | https://pmc.ncbi.nlm.nih.gov/articles/PMC9730452 | só o trecho da busca (página bloqueada) | 2.1, último item; confiança baixa |
| Ceriani, F. e Marcotti, W. (2026). *Spontaneous Calcium Signalling in the Developing Mammalian Cochlea.* JARO. | https://link.springer.com/10.1007/s10162-026-01035-1 | trecho da busca | 2.3 |
| Seidl, A. H. e Grothe, B. (2005). *Development of sound localization mechanisms in the Mongolian gerbil is shaped by early acoustic experience.* J Neurophysiol 94:1028. | https://scilit.com/publications/5bc880ea458e01f89e98f81003645fed | resumo | 2.4 |
| Kapfer, C. et al. (2002). *Experience-dependent refinement of inhibitory inputs to auditory coincidence-detector neurons.* Nat Neurosci 5:247. | https://doi.org/10.1038/nn810 | resumo | 2.4 |
| Magnusson, A. K., Kapfer, C., Grothe, B. e Koch, U. (2005). *Maturation of glycinergic inhibition in the gerbil medial superior olive after hearing onset.* J Physiol 568:497. | https://pmc.ncbi.nlm.nih.gov/articles/PMC1474742 | resumo (já citada antes no programa) | 2.4 |

**Não lido e não usado:** a revisão Kennedy 2012 e outros trabalhos sobre purinergia apareceram na busca, mas não foram abertos.

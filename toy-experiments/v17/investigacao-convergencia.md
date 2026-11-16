# V0.17 — Quais vias convergem? (problema 1: explosão por combinações)

**Pedido do responsável (16/11/2026):** investigar antes de decidir quais pares a Pcrt compara.
**Problema:** hoje "testar todas as outras" abrange as 384 vias (~73.000 pares). Projeção do ensaio mínimo (parte 3, confiança baixa): bastam ~7.000 pares com Uint para passar de 1.000.000 de ramos (D18).

## 1. Hipóteses (assistente, escritas antes da busca)

1. A convergência entre orelhas acontece na **mesma faixa** dos dois lados, ou em faixas muito próximas.
2. Dentro de uma orelha, cada célula recebe de **poucas fibras de frequência parecida**; convergência larga só em células especializadas ou mais acima.
3. **Quais regiões se ligam** é dado pelo desenvolvimento; **quais atrasos e pesos ficam** é construído; o casamento de frequência entre orelhas se **refina** com a experiência.

## 2. O que a literatura diz

| # | Achado | Fonte (estado) | Hipótese |
|---|---|---|---|
| 1 | Na oliva do gerbil, as frequências características das duas orelhas de uma mesma célula diferem em média −8 ± 115 Hz (até 400 Hz, a maioria muito menor); as melhores frequências dos dois lados correlacionam com r = 0,95. O descasamento não explica a melhor diferença de chegada: "axonal delays dominate ITD tuning" | Plauška, van der Heijden e Borst, 2017, *J. Neurosci.* 37:7278–7289 (**texto integral**; n inconsistente no artigo: 83 ou 78) | 1 confirmada |
| 2 | Na coruja, as entradas esquerda e direita do detector diferem de −87 a +121 Hz (8 neurônios, 3–8,5 kHz); inclinação 0,97, r² = 0,99. Os autores concluem que as entradas "are matched for frequency selectivity" | Fischer e Peña, 2009, *Biol. Cybern.* (**texto integral**; amostra pequena) | 1 confirmada (mais justo que no gerbil) |
| 3 | No córtex auditivo do camundongo, as melhores frequências das duas orelhas diferem ~0,25 oitava **já no início da audição**; perda auditiva leve em P12 dobra a diferença (0,27 → 0,59 oitava); em P16 ou P20, não | Polley, Thompson e Guo, 2013, *Nat. Commun.* 4:2547 (**texto integral**) | 3 **corrigida**: o casamento é dado no início e **mantido** pela experiência, não construído por ela |
| 4 | No núcleo coclear: células "bushy" esféricas recebem poucas fibras (≤ 3, quase sempre 2, em camundongo; 1–4 em gato); globulares ≥ 4 (~5 em camundongo; ~20 em gato, de 9 a 69); estreladas T ~6,5; **células polvo > 60**, que sinalizam transientes de banda larga | Cao e Oertel, 2010, *J. Neurophysiol.* (**só resumo**; página bloqueada); Spirou et al., 2005, *Neuroscience* 136:843–863 (**resumo**); revisão em PMC6934273 (**trecho**) | 2 confirmada, com a exceção prevista (polvo) |

## 3. Princípio (dedução do assistente)

- **Entre orelhas:** convergência na mesma faixa, com tolerância de ~0,1–0,3 oitava conforme a espécie.
- **Dentro de uma orelha:** a maioria das células recebe de poucas fibras vizinhas em frequência; existe um tipo (polvo) que junta muitas faixas.
- **Dado × construído:** quais faixas se encontram é **dado** (presente no início da audição) e **mantido** pela experiência; o atraso que fica é construído (axônios, não cóclea, na população).

## 4. Tradução proposta para o Sdom (assistente; decisão do responsável)

**Vizinhança de comparação como dado anatômico** (mesma categoria das fibras e das Utrd): a Pcrt só compara incidências de vias cujas **projeções** caem perto uma da outra.
- Concretamente: cada via projeta para um ponto de um mapa tonotópico comum; a Pcrt compara só o que cai dentro de um raio. Isso conversa com as coordenadas constitutivas: as Uint nascem perto das fontes.
- **Largura entre orelhas:** ~0,25 oitava ≈ ±2–3 faixas das 64 (conta do assistente: 64 faixas ERB entre 50 Hz e 8 kHz ≈ 0,5 ERB por faixa; 0,25 oitava ≈ 1,2 ERB a 500 Hz e 1,6 ERB a 2 kHz).
- **Dentro da orelha:** faixas vizinhas, ±2, e os 3 limiares da mesma faixa.
- **Convergência larga (tipo polvo):** fora da V0.17.

**Contas (assistente, confiança baixa):**
- Entre orelhas: 64 faixas × 3 × 3 fibras × 5 faixas ≈ 2.900 pares.
- Dentro das orelhas: ≈ 2.300.
- Total ≈ 5.000–6.000 pares, contra ~73.000 (cerca de 12 vezes menos).
- Com a mediana de 39–49 ramos por par observada no ensaio da inibição (grave, D25), algo como 200.000–300.000 ramos, abaixo do limite de 1.000.000. Com os 148 ramos da projeção antiga, ficaria perto do limite.

## 5. Bibliografia

1. Plauška, A., van der Heijden, M., Borst, J. G. G. (2017). A test of the stereausis hypothesis for sound localization in mammals. *J. Neurosci.*, 37(30), 7278–7289. **Texto integral.**
2. Fischer, B. J., Peña, J. L. (2009). Bilateral matching of frequency tuning in neural cross-correlators of the owl. *Biol. Cybern.* **Texto integral.**
3. Polley, D. B., Thompson, J. H., Guo, W. (2013). Brief hearing loss disrupts binaural integration during two early critical periods of auditory cortex development. *Nat. Commun.*, 4, 2547. **Texto integral.**
4. Cao, X.-J., Oertel, D. (2010). Auditory nerve fibers excite targets through synapses that vary in convergence, strength, and short-term plasticity. *J. Neurophysiol.* **Só resumo.**
5. Spirou, G. A. et al. (2005). Convergence of auditory-nerve fiber projections onto globular bushy cells. *Neuroscience*, 136(3), 843–863. **Resumo.**

## 6. Estamos estourando? Comparação com o cérebro humano (16/11/2026, pedido do responsável)

**Números de referência (fonte; estado):**
- Encéfalo humano: 86,1 ± 8,1 bilhões de neurônios (Azevedo et al., 2009, *J. Comp. Neurol.* 513:532–541; resumo); córtex cerebral ~16 bilhões (19%).
- Sinapses do neocórtex: ~0,15 × 10^15 (Pakkenberg et al., 2003, *Exp. Gerontol.* 38:95–99; resumo); ~7.000 por neurônio neocortical (Drachman, 2005, citando Pakkenberg; via BioNumbers).
- Fibras do nervo auditivo (células do gânglio espiral) por orelha: 33.679 ± 3.439 (0–10 anos) e 30.273 ± 3.879 (21–30 anos) (Makary et al., 2011, *JARO* 12:711–717; texto integral, tabela).
- Oliva superior medial humana: 3.891 neurônios; lateral: 1.980 (tabela de *Brain Struct. Funct.* 213:489–497, 2009; método e lado não informados na página lida; autoria a verificar).
- Densidade de sinapses no córtex auditivo humano atinge o máximo perto dos 3 meses de vida e depois é podada (Huttenlocher e Dabholkar, 1997, *J. Comp. Neurol.* 387:167–178; resumo).
- **Não obtidos:** número de neurônios do núcleo coclear e do córtex auditivo primário humanos (páginas bloqueadas ou sem o número).

**Contas (assistente; confiança baixa a moderada):**
- **Escala absoluta:** nossas 384 vias equivalem a ~1/160 das ~60.000 fibras das duas orelhas; o limite de 1 milhão de ramos é ~10^8 vezes menor que as sinapses do neocórtex. Em termos absolutos, não há estouro biológico algum.
- **Escala relativa, no primeiro estágio de comparação:** a oliva medial humana tem ~0,13 neurônio por fibra do nervo auditivo (3.891 / 30.273, supondo contagem de um lado). Para 192 vias por orelha, o equivalente seria ~25 unidades por lado. Nossa projeção (~5.500 pares, se cada um gerar uma Uint) daria ~14 Uint **por via**, ou seja, ~100 vezes mais unidades por entrada que a oliva medial. A comparação superestima o excesso, porque nossas Uint também fazem o papel de células do núcleo coclear (dentro de cada orelha), que são mais numerosas e cuja contagem humana não obtive.
- **Superprodução:** a biologia também produz em excesso e poda (pico de sinapses aos 3 meses no córtex auditivo). Exuberância seguida de poda é fiel; o que não é fiel é **manter** muitas unidades por entrada.

**Leitura (assistente):** o "estouro" é sobretudo do **nosso orçamento de computação**, não da biologia. Mas, por entrada, a V0.17 tende a criar muito mais unidades no primeiro estágio do que o tronco cerebral humano tem; a seleção e a poda precisam reduzir isso, e é uma medida a acompanhar (unidades sobreviventes por via).

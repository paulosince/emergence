# V0.17 — Revisão neurobiológica da inibição lateral (antes do ensaio)

**Pedido do responsável (16/11/2026):** "Revise o mecanismo NB antes" do ensaio de inibição lateral.
**Regra em revisão (D22, aprovada em 16/11):** "a Uint que acerta inibe, com −0,5, as outras Uint que recebem da mesma Upro". A inibição pré-alimentada (D22, mesma decisão) entra aqui só onde a literatura a toca.
**Estado de leitura:** a seção 2 foi feita por resumos; a seção 2b, pelo texto integral das fontes mais relevantes (ver o "como foi lido" ali). Autoria marcada "a verificar" quando não confirmada.

## 1. Hipóteses, escritas antes da busca (assistente)

1. **Intermediária:** uma célula excitatória não inibe a vizinha diretamente; passa por uma célula inibitória, o que acrescenta atraso e muda quem é inibido.
2. **Alvo:** quem é inibido é definido por vizinhança ou por entradas em comum, não por "receber da mesma fibra".
3. **Tempo:** a inibição tem atraso (~1 ms) e duração (vários ms); nossa janela é de 0,21 ms.
4. **Plasticidade:** as ligações inibitórias também se ajustam com a experiência.
5. **Audição:** no tronco auditivo, a inibição participa da própria detecção das diferenças de chegada.

## 2. O que a literatura diz

| # | Achado | Fonte (estado) | Hipótese |
|---|---|---|---|
| 1 | Em redes de competição, a célula excitatória mais estimulada suprime as outras **pela célula inibitória compartilhada** (inibição de dois passos); no extremo, só uma fica ativa ("o vencedor leva tudo") | Artigo de revisão no repositório edoc da Universidade de Basel (autoria e título a verificar; trecho) | 1 confirmada |
| 2 | O princípio de Dale: a maioria dos neurônios é só excitatória ou só inibitória; modelos com inibição direta entre células excitatórias o violam. Há exceções (coliberação) | Artigo em PMC3403226 (resumo; autoria, ano e periódico a verificar); revisões em arXiv (trechos) | 1, com ressalva: o programa já admite efeito com sinal por Upro e coliberação ([efeitos v0.1](../../docs/effects-v0.1.md)) |
| 3 | **Dois tipos, dois tempos.** Pré-alimentada: recrutada pelas mesmas entradas que excitam as células inibidas. De retorno: recrutada pelas próprias células que depois recebem a inibição, e por isso **começa mais tarde** | Artigo em PMC7176419 (autoria a verificar; trecho) | 2 e 3: a nossa regra lateral é um híbrido (disparada pelo vencedor, como a de retorno; dirigida a quem tem entrada em comum, como a pré-alimentada) |
| 4 | No hipocampo (CA1), a inibição de retorno começou **mais de 3 ms depois** do pico da excitação | Artigo em PMC2269280 (autoria a verificar; resumo) | 3 confirmada |
| 5 | No detector de diferenças de chegada dos mamíferos (oliva superior medial), a inibição pré-alimentada **chega antes** da excitação direta; ela estreita a janela de coincidência, mas não a desloca | Roberts, Seeman e Golding, 2013, *Neuron* 78(5):923–935 (resumo) | 5 confirmada; diverge da D22 ("uma janela depois") |
| 6 | Da célula inibitória (núcleo medial do corpo trapezoide) até o início da inibição na célula da oliva: **0,55 ms** | Roberts, Seeman e Golding, 2014, *Front. Neural Circuits* 8:49 (resumo). Confiança alta no número (medido, n = 4) | 3 |
| 7 | Bloquear a inibição **desloca** a preferência por diferença de chegada; inibição precisa seria essencial | Brand et al., 2002, *Nature* 417:543–547; Pecka et al., 2008, *J. Neurosci.* 28:6914–6925 (resumos) | 5. **Controverso:** outros registros concluem que a preferência é determinada pelo tempo das entradas excitatórias (resumo de congresso, IUPS 2013; autoria a verificar) |
| 8 | A inibição desloca o pico da excitação conforme o momento em que chega, e com isso o momento de melhor coincidência | Myoga et al., 2014, *Nat. Commun.* 5:3790 (resumo) | 5 |
| 9 | Plasticidade nas sinapses inibitórias equilibra excitação e inibição, conforme a experiência | Vogels et al., 2011, *Science* 334:1569–1573 (resumo) | 4 confirmada; nosso −0,5 é fixo |
| 10 | Inibição de dois passos **com plasticidade** faz as células excitatórias aprenderem traços **diferentes** entre si | arXiv 1812.11581 (resumo; autoria a verificar) | 4; é precedente direto do que o ensaio quer ver |
| 11 | Disparos sem correlação geram competição; **disparos sincronizados impedem** a competição do tipo "vencedor leva tudo" | Lumer, 2000, *Neural Comput.* (resumo) | Nova: o som da peça sincroniza as vias; risco para o ensaio |
| 12 | Na coruja, a ambiguidade de fase (o *aliasing* do nosso ensaio) é resolvida pela **convergência de várias faixas de frequência** numa célula de banda larga; a inibição **aumenta** a diferença entre o pico verdadeiro e os falsos | Peña e Konishi, 2000, *PNAS* 97:11787–11792 (resumo) | Nova: a solução biológica do *aliasing* é principalmente convergência entre faixas, com inibição como reforço |

## 2b. Leitura do texto integral (16/11/2026, a pedido do responsável)

**Como foi lido:** pelo leitor de páginas da web, que entrega uma extração detalhada do texto integral feita por um modelo auxiliar (métodos, números, conclusões, limitações), não o texto bruto. Números conferidos entre fontes quando possível. **Não acessíveis:** Roberts et al., 2013 (página bloqueada por verificação de navegador; números vêm do resumo e das citações em Roberts et al., 2014 e Myoga et al., 2014); Vogels et al., 2011 (o PDF falhou; só resumo e o código de exemplo do coautor no simulador Brian); Lumer, 2000 (só resumo).

### Inibição de retorno (lateral) e pré-alimentada no hipocampo — Karnup e Stelzer, 1999, *J. Physiol.* 516:485–504 (texto integral)
- Fatias de cobaia, CA1, registros pareados célula piramidal–interneurônio.
- **Pré-alimentada:** começa **durante a subida** da excitação (13 de 17 pares; 31 de 37 comparações).
- **De retorno:** o caminho de dois passos mais curto somou **4,4 ms**, a média **8,3 ms**; incluindo o tempo até a piramidal disparar, média de **29,4 ms** (11 a 99,8 ms). Os inícios "não ocorreram durante a subida", mas **mais de 3 ms após o pico** da excitação.
- **Duração:** meia-largura da inibição unitária de **24,6 a 55,5 ms**.
- Conclusão dos autores: a inibição de retorno **não afeta a subida nem o pico** da excitação que a provocou.
- Limites declarados: tempos montados por soma de componentes, não medidos de ponta a ponta; dados de retorno vêm sobretudo de um par; fatias a 30–32 °C. Confiança moderada nos números absolutos; alta na ordem (pré-alimentada cedo, de retorno tarde).

### Inibição no detector de diferenças de chegada (oliva superior medial)
- **Roberts, Seeman e Golding, 2014**, *Front. Neural Circuits* 8:49 (texto integral): da célula inibitória do núcleo medial do corpo trapezoide até a inibição começar na célula da oliva, **0,55 ms** no resumo e **0,58 ± 0,04 ms** nos resultados (5 pares; os autores divergem entre si); oscilação de 0,04 ms. As inibições dos dois lados chegam com latência parecida (1,69 e 1,73 ms após estimular o nervo). Citando o estudo de 2013, a inibição chega **0,32 a 0,38 ms antes** da excitação. Inibição evocada: subida 0,94 ms, decaimento 4,3 ms (animais jovens, P15–22). A célula inibitória aguenta trens de 600–800 Hz.
- **Myoga et al., 2014**, *Nat. Commun.* 5:3790 (texto integral): em fatias de adulto, com condutâncias injetadas, o **momento** da inibição desloca o melhor momento de coincidência **nos dois sentidos**: inibição contralateral 0,2 ms depois → −163 µs; 0,4 ms antes → +71 µs; 0,1 ms antes → sem desvio. Com inibição dos dois lados, até cerca de **220 µs**. Com a inibição 0,2 ms antes, não desloca, mas **estreita** a janela (meia-largura de 467 para 387 µs). Decaimento da inibição ≈ 1,5 ms; da excitação ≈ 0,3 ms. Os autores conciliam com Roberts 2013 (que não viu desvio): aquele estudo testou só ≈ −0,3 ms, em animais jovens. Limite declarado: **os tempos reais in vivo são desconhecidos**; os técnicas atuais não separam excitação e inibição in vivo.
- **Pecka et al., 2008**, *J. Neurosci.* 28:6914–6925 (texto integral): in vivo, bloquear a inibição desloca a melhor diferença de fase em **0,13 ± 0,08 ciclo** (6 células); aplicar glicina tônica, 0,10 ± 0,10 ciclo (11 células). Modelo: a inibição chega "algumas centenas de microssegundos" antes da excitação. Limites declarados: poucas células; o curso da inibição **não foi medido**, foi inferido.
- **Leitura de conjunto:** no detector auditivo, a inibição relevante é **pré-alimentada**, vinda de **outra unidade** (a célula inibitória), com atraso próprio, e **chega antes** da excitação. O seu **tempo de chegada** é um parâmetro que ajusta qual coincidência é a melhor e estreita a janela. Se ela desloca ou só estreita é **controverso** e depende desse tempo.

### Ambiguidade de fase (o *aliasing*) — Peña e Konishi, 2000, *PNAS* 97:11787–11792 (texto integral)
- 59 neurônios em 14 corujas, registro intracelular.
- A célula soma várias faixas de frequência sintonizadas na mesma diferença de chegada: os picos verdadeiros se alinham entre faixas, os falsos não. A soma é **sublinear**.
- No potencial de membrana, a diferença entre pico verdadeiro e falsos é **pequena**; nos disparos, **muito maior**, por causa do **limiar não linear**.
- **Inibição:** evidência **qualitativa** de que suprime mais os picos falsos; **fonte não identificada**, e não se sabe se é lateral.

### Competição "vencedor leva tudo" — Muir e Cook, 2014, *Neural Comput.* 26:1624–1666 (texto integral)
- A competição acontece pela célula inibitória **compartilhada**; exige que o acoplamento inibitório mútuo seja **maior** que o excitatório; o "vencedor único" só ocorre numa faixa de diferenças de entrada.
- Na anatomia do córtex, os neurônios inibitórios têm **alcance lateral limitado**; a competição esperada é de **vizinhança curta**, mais plausível dentro da coluna. Atrasos não foram analisados.

### Inibição de dois passos com plasticidade — Seung, 2019, arXiv 1812.11581 (texto integral)
- Células excitatórias recebem a entrada; células inibitórias recebem das excitatórias e as inibem; **não há ligação direta** entre excitatórias.
- A inibição é **anti-hebbiana** (atividade correlacionada fortalece a inibição) e leva as excitatórias a aprenderem **traços diferentes**; a descorrelação é **incompleta** e melhora com mais células inibitórias. A entrada tem competição heterossináptica (semelhante à nossa competição pela força total).
- Limites: modelo de taxas (sem disparos nem tempo fino), só dígitos manuscritos; derivação aproximada.

### Plasticidade inibitória — Vogels et al., 2011 (só resumo e código do coautor)
- O código de exemplo usa uma regra com constante de 20 ms e uma **taxa-alvo** (3 Hz): a inibição cresce até a célula ficar perto dessa taxa. **Não lido no artigo**; não usar como número do artigo.

## 3. Confronto com a regra aprovada (dedução do assistente, revista após a leitura integral)

1. **Ligação entre Uint.** Confirmado em todos os modelos lidos: a competição lateral passa por uma unidade inibitória **ligada** às excitatórias (Muir e Cook; Seung). No Sdom, é uma relação entre Uint, o segundo nível adiado.
2. **Tempo da lateral.** A de retorno começa **milissegundos** depois e dura **dezenas** de ms (hipocampo). Ela não pode impedir a coincidência que a provocou; age sobre as **seguintes**. Num som com ciclos de milissegundos, isso inibiria muitos ciclos seguidos.
3. **Pré-alimentada.** No detector auditivo, ela vem de **outra unidade**, com atraso próprio, e chega **antes** da excitação (≈ 0,3 ms). A D22 a põe **uma janela depois**. O tempo dela **ajusta** a melhor coincidência (desloca ou estreita), o que a torna parte do cálculo temporal, não só um freio.
4. **Força fixa.** Nos modelos que fazem unidades se diferenciarem, a inibição é **plástica** (Seung).
5. **Aliasing.** Resolvido sobretudo por **convergência entre faixas + limiar não linear**; a inibição é reforço de fonte desconhecida (Peña e Konishi).
6. **Contradição interna:** a seção 4.1 do pré-experimento lista "inibição" como fora desta versão; a D22 a inclui.

## 4. Caminhos (para o responsável decidir)

- **(a) Manter a lateral como simplificação declarada:** efeito direto, sem unidade intermediária, com atraso e duração de retorno; perdas declaradas (itens 1, 2, 4).
- **(b) Ficar só com a pré-alimentada nesta versão** (não exige ligação entre Uint) e revisar o seu tempo pela oliva (chegando antes, ou com o tempo constituído pela própria Pcrt).
- **(c) Adiar a inibição lateral para a versão com segundo nível**, pela mesma razão da repetição; a competição entre ramos e a convergência entre faixas ficam como os mecanismos de seleção da V0.17.

## 5. Bibliografia desta revisão (só resumos ou trechos)

1. Brand, A., Behrend, O., Marquardt, T., McAlpine, D., Grothe, B. (2002). Precise inhibition is essential for microsecond interaural time difference coding. *Nature*, 417, 543–547. **Resumo.**
2. PMC3403226. Inhibitory interneurons enable sparse code formation in a spiking circuit model of V1. **Resumo; autoria, ano e periódico a verificar.**
3. Lumer, E. D. (2000). Effects of spike timing on winner-take-all competition in model cortical circuits. *Neural Computation*. **Resumo.**
4. Myoga, M. H., Lehnert, S., Leibold, C., Felmy, F., Grothe, B. (2014). Glycinergic inhibition tunes coincidence detection in the auditory brainstem. *Nat. Commun.*, 5, 3790. **Resumo.**
5. Pecka, M., Brand, A., Behrend, O., Grothe, B. (2008). Interaural time difference processing in the mammalian medial superior olive: the role of glycinergic inhibition. *J. Neurosci.*, 28(27), 6914–6925. **Resumo.**
6. Peña, J. L., Konishi, M. (2000). Cellular mechanisms for resolving phase ambiguity in the owl's inferior colliculus. *PNAS*, 97(22), 11787–11792. **Resumo.**
7. Roberts, M. T., Seeman, S. C., Golding, N. L. (2013). A mechanistic understanding of the role of feedforward inhibition in the mammalian sound localization circuitry. *Neuron*, 78(5), 923–935. **Resumo.**
8. Roberts, M. T., Seeman, S. C., Golding, N. L. (2014). The relative contributions of MNTB and LNTB neurons to inhibition in the medial superior olive assessed through single and paired recordings. *Front. Neural Circuits*, 8, 49. **Resumo.**
9. Vogels, T. P., Sprekeler, H., Zenke, F., Clopath, C., Gerstner, W. (2011). Inhibitory plasticity balances excitation and inhibition in sensory pathways and memory networks. *Science*, 334, 1569–1573. **Resumo.**
10. arXiv 1812.11581. Unsupervised learning by a nonlinear network with Hebbian excitatory and anti-Hebbian inhibitory neurons. **Resumo; autoria a verificar.**
11. PMC2269280 (inibição de retorno em CA1, início > 3 ms após o pico da excitação). **Resumo; autoria e título a verificar.**
12. PMC7176419 (latência entre excitação e inibição; pré-alimentada × de retorno). **Trecho; autoria e título a verificar.**
13. Revisão sobre "vencedor leva tudo" e inibição em córtex colunar, edoc Universidade de Basel. **Trecho; autoria e título a verificar.**
14. Karnup, S., Stelzer, A. (1999). Temporal overlap of excitatory and inhibitory afferent input in guinea-pig CA1 pyramidal cells. *J. Physiol.*, 516(2), 485–504. **Texto integral** (é a fonte PMC2269280 acima).
15. Muir, D. R., Cook, M. (2014). Anatomical constraints on lateral competition in columnar cortical architectures. *Neural Computation*, 26, 1624–1666. **Texto integral** (é a revisão do repositório de Basel acima; número do fascículo a verificar).
16. Seung, H. S. (2019). Unsupervised learning by a nonlinear network with Hebbian excitatory and anti-Hebbian inhibitory neurons. arXiv 1812.11581. **Texto integral** (item 10 acima).
17. Leituras integrais também de: Myoga et al. 2014 (item 4), Pecka et al. 2008 (item 5), Peña e Konishi 2000 (item 6), Roberts et al. 2014 (item 8). Sem texto integral: Roberts et al. 2013 (item 7), Vogels et al. 2011 (item 9), Lumer 2000 (item 3).

## 6. A inibição nasce fraca e cresce? (16/11/2026, antes de desenhar o caminho 2)

**Hipótese do assistente, testada antes do desenho:** na biologia, a inibição nasce fraca e cresce com a experiência (base: modelos de Seung, 2019, e Vogels et al., 2011). **Refutada pelos dados de desenvolvimento lidos.**

- **Dorrn et al., 2010**, *Nature* 465:932–936 (texto integral; córtex auditivo primário de rato, registro in vivo): logo após o início da audição, excitação e inibição são **igualmente fortes** (razão E:I de 1,3 ± 0,2 em P12–P21 e 1,2 ± 0,2 em adultos, sem diferença). O que muda com a experiência é a **seletividade**: a inibição começa **mal sintonizada** (σ 7,7 contra 4,9 da excitação) e só fica co-sintonizada por volta de P25–P30 (correlação E–I de 0,37 para 0,71). Estimulação padronizada de 3–5 min muda o equilíbrio nos jovens, não nos adultos. Os autores propõem que o equilíbrio é um processo **de rede**, não de sinapses isoladas. Limites: anestesia com cetamina; parte sem cegamento.
- **Magnusson et al., 2005**, *J. Physiol.* 568:497–512 (texto integral; oliva superior medial de gerbil, fatias): após o início da audição, a inibição fica **mais rápida** (decaimento de 4,0 para 2,0 ms; meia-largura do potencial de 11,8 para 3,1 ms) e a condutância total **cai** (23,7 para 11,4 nS), com menos entradas inferidas. Em animais criados com ruído omnidirecional, a condutância fica alta (28,8 nS): a experiência espacial **poda** a inibição. Limites: número de entradas inferido, não contado; a cinética in vitro é mais lenta que a necessária in vivo.
- **Kapfer et al., 2002**, *Nat. Neurosci.* 5:247–253 (**só resumo**): o refinamento espacial das entradas inibitórias da oliva depende da experiência e não ocorre em mamíferos que não usam diferenças de chegada.

**Princípio que emerge (dedução do assistente):** a inibição começa **forte, ampla e lenta**; a experiência a torna **seletiva, rápida e mais enxuta**. É o contrário de "nascer fraca e crescer". E ela não pertence à ligação recém-nascida: na oliva vem de outra célula; no córtex, o equilíbrio se faz na rede.

**Consequência para o caminho 2:** como formulado ("nasce fraca e cresce com a consolidação da própria ligação"), seria uma divergência **sem apoio** nos dados de desenvolvimento, só em modelos. A versão fiel exigiria inibição **da Uint como um todo** (vinda de uma unidade intermediária alimentada pelas mesmas entradas), ampla e lenta no início, refinada pela experiência.

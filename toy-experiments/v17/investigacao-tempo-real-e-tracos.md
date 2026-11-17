# V0.17 — Investigação: tempo real, rastros que somem e o custo quando entrarem outros sentidos

**Pergunta do responsável (17/11/2026):** o processamento já passa muito do tempo real com um sentido só. No cérebro, o aprendizado também acontece depois do evento, mas os rastros vão sumindo e o cérebro os abandona em favor do que vem de novo. Como isso funciona, e para onde vai o custo quando entrarem outros sentidos?
**Redação:** assistente (Claude). **Leitura:** trechos de busca e resumos, salvo indicação; nada aqui é decisão.

## 1. Duas coisas diferentes [A]
- **O cérebro não fica atrasado em relação ao mundo.** Ele processa em paralelo, no ritmo do mundo. O que não é aproveitado dentro de certas janelas é perdido.
- **O nosso atraso é do computador**, não do modelo: ele simula em série uma física que, na biologia, acontece em paralelo. São problemas diferentes, com soluções diferentes.

## 2. As janelas da biologia [L]
| Rastro | Quanto dura | Fonte e leitura |
|---|---|---|
| Memória sensorial auditiva (ecoica) | estimativas de ~1 s a ~10 s; muitas vezes citada como até ~4 s; é passiva e independente da atenção | verbetes e revisão (Frontiers in Psychology 2016); trechos |
| Rastro de elegibilidade na sinapse (marca que espera um terceiro fator, como dopamina) | da ordem de **1 s** (estriado); segundos no hipocampo e no córtex | Gerstner et al. 2018 (revisão); Yagishita et al. 2014 e trabalhos posteriores; trechos |
| Marca sináptica (que captura as proteínas da consolidação) | **menos de 3 h**; some se não houver captura | Frey e Morris 1997; trechos |
| Reativação offline (sono, pausas) | sequências da vigília reaparecem, em escala de tempo **comprimida**, durante o sono de ondas lentas | Nádasdy et al. 1999 (Buzsáki); revisões recentes; trechos |

**Leitura:** a intuição do responsável está certa. Cada camada guarda por um tempo limitado; o que não é capturado pela camada seguinte se perde. A consolidação de longo prazo acontece em parte **offline**, em períodos sem entrada nova.

## 3. Como o cérebro mantém o custo limitado [L]
- **Pouca atividade ao mesmo tempo:** o custo de um disparo é alto, e isso limita, possivelmente a menos de 1%, os neurônios do córtex substancialmente ativos ao mesmo tempo (Lennie 2003; resumo).
- **O repetido e previsível é atenuado:** a adaptação específica ao estímulo reduz a resposta a sons repetidos, já no mesencéfalo (colículo inferior); ela diminui o fluxo de informação quando o estímulo não varia e aumenta a sensibilidade à mudança (Malmierca et al. 2014; Pérez-González et al. 2009 / revisões; trechos).
- **O custo de aprender vem antes; o de reconhecer é baixo.** (Inferência a partir dos itens acima e dos nossos dados, seção 4.)

## 4. O que os nossos dados já mostram [C]
- No motor com as correções 1, 2 e 8, o **insumo da Pcrt cai a zero no 3º episódio**: o que já foi aprendido é integrado e não gera construção nova. O custo de constituir para sozinho.
- O custo que fica é o da **dinâmica**: incidências × destinos (ramos). Ele não cai sozinho.

## 5. Para onde vai o custo com vários sentidos [A]
1. **Cresce com as incidências de todos os sentidos × os ramos que cada uma alcança.** Sem mais nada, com N sentidos o custo é ~N vezes o de um (ou mais, se houver ligações entre sentidos).
2. **O que o reduziria, com apoio na biologia:**
   - **adaptação ao repetido** (ainda não existe no nosso modelo): incidências previsíveis passam a gerar menos chegadas;
   - **atividade esparsa**: só uma pequena parte da malha ativa ao mesmo tempo;
   - **rastros com prazo**: o que não foi aproveitado dentro da janela sai do cálculo (já temos parcialmente);
   - **consolidação offline** (a repetição interna, adiada): parte do trabalho vai para os períodos sem entrada.
3. **O que o reduziria na engenharia:** a vizinhança anatômica já divide a malha em pedaços que quase não conversam; cada pedaço (e cada sentido) pode rodar num núcleo diferente. Isso aproveita máquinas com muitos núcleos.
4. **O que não sabemos:** quanto cada um desses itens reduz, no nosso modelo. **Medida proposta:** o custo por segundo de som simulado ao longo do aprendizado (deve cair quando a Pcrt para) e com 1, 2 e 4 canais, antes de qualquer promessa.

## 6. Fontes (trechos ou resumos, salvo indicação)
- Gerstner, W., Lehmann, M., Liakoni, V., Corneil, D. e Brea, J. (2018). *Eligibility traces and plasticity on behavioral time scales.* Front Neural Circuits 12:53. https://pmc.ncbi.nlm.nih.gov/articles/PMC6079224
- Yamaguchi, K. et al. (2022). *A behavioural correlate of the synaptic eligibility trace in the nucleus accumbens.* Sci Rep 12:1921. https://www.nature.com/articles/s41598-022-05637-6.pdf
- Frey, U. e Morris, R. G. M. (1997). *Synaptic tagging and long-term potentiation.* Nature 385:533–536. https://ideas.repec.org/a/nat/nature/v385y1997i6616d10.1038_385533a0.html
- Nádasdy, Z., Hirase, H., Czurkó, A., Csicsvari, J. e Buzsáki, G. (1999). *Replay and time compression of recurring spike sequences in the hippocampus.* J Neurosci 19:9497. https://www.jneurosci.org/content/jneuro/19/21/9497.full.pdf
- Lennie, P. (2003). *The cost of cortical computation.* Curr Biol 13:493–497. https://www2.bcs.rochester.edu/sites/plennie/pdfs/Lennie03a.pdf
- Malmierca, M. S. et al. (2014). *Neuronal adaptation, novelty detection and regularity encoding in audition.* Front Syst Neurosci 8:111. https://www.frontiersin.org/articles/10.3389/fnsys.2014.00111/full
- *Stimulus-specific adaptation in the inferior colliculus of the anesthetized rat* (2009). J Neurosci 29:5483. https://pmc.ncbi.nlm.nih.gov/articles/PMC2715893
- Memória ecoica: verbete e revisão em Frontiers in Psychology (2016), https://www.frontiersin.org/articles/10.3389/fpsyg.2016.01892/pdf

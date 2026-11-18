# V0.17 — Investigação: três peças NB para a inibição da MSO funcionar no agudo

**Pedido do responsável (18/11):** "Pesquisar as três": (1) limite de disparo por fibra (refratário, pular ciclos); (2) depressão de curto prazo acima de 500 Hz; (3) tradução da força para o potencial da Uint. Cada peça vira mecanismo próprio, um por vez.
**Contexto:** sem o plano B, o agudo não colapsa, mas fica difuso (sintonia larga). A inibição da MSO deve estreitar a janela, mas, como está no motor, ela se soma a ~8 no agudo ([investigação da inibição](investigacao-inibicao-mso.md)).
**Redação:** assistente (Claude), 18/11/2026.
**Legenda:** [L] literatura; [I] inferência; [A] proposta (a aprovar).

## 1. Limite de disparo por fibra [L]
| Achado | Fonte e leitura | Confiança |
|---|---|---|
| Em frequências altas, um axônio da cóclea dá **no máximo 1 disparo por ciclo** e **não consegue disparar em todo ciclo**; a 5 kHz, menos de 100 disparos/s (1 a cada 50 ciclos) | artigo de Lewis & Henry, 1995 (*Hear Res*, PDF do autor; trechos; autoria pelo nome do arquivo, a conferir) | alta |
| Neurônios são limitados a **algumas centenas de disparos por segundo** pelo refratário. Ao contrário das fibras do nervo, alguns neurônios do núcleo coclear disparam em **todo ciclo** de tons graves ("cerca de piquete"); as células esféricas têm travamento de fase melhorado | Joris & Smith 2008 ("The volley theory and the spherical cell puzzle"; resumo no PMC) | alta |
| Refratário absoluto de uma fibra do nervo: **~0,33 ms**; recuperação com constante de **~0,41 ms** (gato, estímulo elétrico). Em humanos com implante: 0,39 ms e 0,43 ms | "Response properties of the refractory auditory nerve fiber", *JARO* 2001 (resumo; autoria não conferida); estudo de ECAP (resumo) | média (estímulo elétrico, não som) |
| No gerbil, o travamento de fase melhora nos axônios do corpo trapezoide e no MNTB abaixo de 1 kHz, mas menos que no gato | Karino et al. 2017 (resumo) | média |

**Leitura [I]:** a fibra real pula ciclos em frequência alta. A taxa sustentada fica em centenas por segundo, e a população cobre cada ciclo. Hoje cada fibra nossa dispara em **todo** ciclo do mundo (~1.300/s no agudo).

**Proposta [A]:**
- Cada fibra tem um **refratário** (absoluto 0,4 ms; relativo com recuperação de ~0,4 ms).
- Cada fibra tem uma **chance por ciclo** de responder ao mundo (o acaso físico do sensor), ajustada para uma taxa sustentada de centenas por segundo.
- **Número a buscar ou mapear:** a taxa das células esféricas a 1–1,5 kHz no gerbil. Não li um valor direto; para mapear, 150 e 300/s.
- Isso vale para as fibras **excitatórias e inibitórias**.
- [I] **Faz sentido com 8 fibras por ouvido** (passo 3). Com uma fibra só, que hoje representa uma população, limitar a taxa dela tira do mundo os ciclos que a população cobriria.

## 2. Depressão de curto prazo [L]
| Achado | Fonte e leitura | Confiança |
|---|---|---|
| Em trens, os IPSPs na MSO **não mostram depressão significativa até acima de 500 Hz** (P15–20, fatia com a via inteira) | Roberts et al. 2013, legenda da Figura 7 (texto integral, PDF do responsável) | alta |
| Em fatia de adulto (estímulo elétrico), excitação e inibição da MSO deprimem ~70% acima de 200 Hz; depois de 15 pulsos a 200 Hz, ambas ficam em **~26%**; recuperam 84–87% em 5 s | Couchman et al. 2010 (texto integral) | alta, com a ressalva do método |
| In vivo, a atividade espontânea alta mantém algumas sinapses auditivas em **depressão crônica**; a profundidade em regime converge para o mesmo valor em cada frequência | estudo do calyx de Held sob atividade in vivo, *J Neurophysiol* 2007 (resumo; primeiro autor não conferido); Hennig et al. 2008 (modelo do calyx, resumo) | média |

**Leitura [I]:** as duas fontes divergem; idade e método diferem. Com o limite por fibra (centenas por segundo por fibra), a taxa **em cada sinapse** fica abaixo de 500 Hz. Pelo dado mais próximo do natural (Roberts), a depressão seria pequena. A depressão talvez não seja necessária no primeiro passo.

**Proposta [A]:** deixar a depressão como mecanismo **seguinte**, a entrar só se o limite por fibra não bastar.

## 3. Tradução da força para o potencial [L + I]
- **Excitação:** uma fibra dá ~1/3 do necessário para disparar (2,5 nA por fibra; ~8 nA para o disparo; Couchman 2010). Em unidades da Uint (limiar 1,5): **~0,5 por fibra**.
- **Inibição, em fatia:** 0–100 nS dão 0–10 mV de hiperpolarização (Roberts 2013); uma fibra tem ~58 nS (Couchman 2010), o que dá **~5–6 mV no pico**, da ordem do EPSP de uma fibra.
- **Inibição, in vivo:** sem evidência de inibição bem cronometrada deslocando a sintonia (van der Heijden et al. 2013, anestesiado), e com contribuição de "curto-circuito" relativamente pequena (Mackenbach & Borst 2023). [I] In vivo, o efeito líquido da inibição parece **menor** que o das fatias.
- **Proposta [A]:** inibição por fibra **mapeada** entre 0,1 e 0,5 no pico, partindo do valor in vivo, menor.
- Conta de verificação [I]: com o limite por fibra (~250/s), 5 fibras inibitórias por Uint, 3 ms de duração e força 0,5 no pico, a inibição contínua fica em ~1,6 (contra ~8 hoje). Com 0,2, fica em ~0,6.

## 4. Ordem proposta [A]
1. **Limite por fibra** (refratário + chance por ciclo), junto com as **8 fibras por ouvido** do passo 3, que já está no motor. São inseparáveis: a fibra individual só faz sentido com refratário, e o refratário só faz sentido com fibra individual.
2. **Inibição da MSO** (caminho próprio, rampa + platô, 0,3 ms antes da Upro mais curta), com força mapeada.
3. **Depressão**, só se necessário.

## 5. Fontes
- [Lewis & Henry 1995 (PDF do autor)](https://people.eecs.berkeley.edu/~lewis/LewisHenry1995B.pdf) — trechos.
- [Joris & Smith 2008 (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC2486254) — resumo (página bloqueada).
- [JARO 2001, refratário da fibra do nervo](https://iro.uiowa.edu/esploro/outputs/journalArticle/Response-Properties-of-the-Refractory-Auditory/9984383910002771) — resumo.
- [ECAP: refratário do nervo estimulado](https://bvbvf1.bib-bvb.de/vufind/PrimoRecord/cdi_proquest_miscellaneous_68971943) — resumo.
- [Karino et al. 2017](https://researchportal.be/en/node/3895993) — resumo.
- [Roberts et al. 2013, Figura 7 (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC3690812/figure/F7) — legenda; texto integral pelo PDF do responsável.
- [Hennig et al. 2008 (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC2538789) — resumo.
- Couchman et al. 2010; van der Heijden et al. 2013; Mackenbach & Borst 2023 — já lidos.

---

## 6. A punição da quase-sincronia: forma NB da depressão ligada ao tempo (18/11)
**Contexto:** com 8 fibras, a punição (−1,05 × DF por chegada que cai de 1 a 3 janelas depois de um favorecimento) derruba tudo. Sem ela, nenhum colapso ([resultados](ensaio-minimo/resultados.md)).

| Achado [L] | Fonte e leitura | Confiança |
|---|---|---|
| Disparo pós-sináptico até 20 ms depois da ativação pré-sináptica → potenciação; disparo antes → depressão. **Potenciação significativa só em sinapses inicialmente fracas**; a depressão **não depende** da força inicial (em termos relativos). Janela da depressão ~34 ± 13 ms; da potenciação, ~17 ± 9 ms (hipocampo em cultura) | Bi & Poo 1998, *J Neurosci* 18:10464 (resumo e trechos) | alta |
| Modelo com essas observações (potenciação menor para sinapses fortes; depressão proporcional à força) gera distribuição de pesos **estável**; nele, a competição é fraca | van Rossum, Bi & Turrigiano 2000, *J Neurosci* 20:8812 (resumo) | alta |
| Depressão **aditiva** (fixa, independente da força) dá competição forte, mas é **instável** e precisa de limites duros; depressão **multiplicativa** dá estabilidade | Gilson & Fukai 2011, *PLoS ONE* 6:e25339 (resumo) | alta |
| Plasticidade heterossináptica **equilibrada**: potenciação e depressão se compensam, e a entrada total da célula se preserva | *J Neurosci* 2016, 36:8842 (PDF do laboratório de Volgushev; trecho; autoria a conferir) | média |

**Leitura [I]:**
- A nossa punição é **aditiva** (valor fixo por chegada), o tipo instável.
- Ela é disparada pelo **favorecimento**, não pelo **disparo** da Uint; na biologia, a depressão ligada ao tempo é disparada pelo **disparo pós-sináptico** que vem antes da chegada.
- E, enquanto o fortalecimento é limitado pelo estoque do lado, a punição não tem limite nenhum.

**Opções [A]:**
1. **Retirar a punição.** A eliminação por participação, que já está no modelo, faz o papel de tirar os ramos errados.
2. **Trocar pela forma NB:** depressão **depois do disparo** da Uint (não do favorecimento), **proporcional à força** do ramo (multiplicativa), na janela de 1–3 janelas. Opcional: a força perdida **volta ao estoque** do lado (conservação, como na heterossináptica equilibrada), com evidência indireta.

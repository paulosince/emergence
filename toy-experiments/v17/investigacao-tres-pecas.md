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

---

## 7. Força por fibra e estoque por lado (pedido de 18/11: "Força por fibra antes")

**O problema:** com 8 fibras que pulam ciclos, o agudo quase não dispara (250–950 disparos no último episódio, somando as 8 Uints).

**O que já está lido [L]:**
- **Força de uma fibra na MSO adulta:** ~37 nS, ou 2,5 nA. O disparo precisa de ~8 nA, ou seja, de **~3 fibras coincidentes** (2–4 por dendrito). Cada célula recebe pelo menos 4–8 fibras excitatórias; a condutância excitatória total fica em ~180–200 nS (Couchman et al. 2010, texto integral).
- **A força de uma fibra cresce depois de ouvir:** −1,07 nA em P11, −1,54 nA em P14, −1,89 nA em P17 (Franzen et al. 2020, texto integral). No adulto, ~2,5 nA. No início da audição, cada fibra tem **~0,43** da força adulta.
- **No tálamo**, as entradas que sobram se fortalecem ~50× (Chen & Regehr 2000, resumo).

**Como o modelo faz hoje [C]:**
- cada ramo começa com 0,15 e pode chegar a 1,0. **Dois ramos fortes, um de cada lado, bastam para disparar**, ao contrário da MSO;
- o estoque de cada lado (RC = 1,0, reposto com τ = 60 s) dá ~1,0 de crescimento no primeiro episódio e ~0,18 por episódio depois. Ele é dividido entre todos os ramos do lado (12–24 com 8 fibras, incluindo os de atraso errado).

**Conta [I]:**
- com cada fibra disparando ~1 a cada 5 ciclos no agudo, a chance de ~3 das ~6 fibras de uma Uint dispararem no mesmo ciclo é da ordem de 5–10%. Isso dá **dezenas a ~100 disparos por segundo**, perto do que a MSO faz;
- mas isso só funciona se cada fibra certa tiver ~0,5 (1/3 do limiar), ou seja, ~1,0–2,0 por lado nas fibras certas;
- hoje o estoque mal chega a isso no começo e se divide entre ramos certos e errados.

**Propostas [A]:**
1. **Teto por fibra:** a soma das forças dos ramos de **uma mesma fibra** numa Uint fica limitada a **0,5** (1/3 do limiar), no lugar do teto de 1,0 por ramo [L: Couchman 2010]. Uma fibra sozinha nunca dispara a Uint, como na MSO.
2. **Estoque por lado proporcional às fibras:** RC do lado = **0,5 × número de fibras** que alcançam aquele lado da Uint (2–4 fibras → 1,0–2,0). Evidência só indireta: mais entradas, mais terminais e recursos locais. Confiança baixa.
3. **Força inicial por fibra:** ~0,43 do teto (≈ 0,2 por fibra, início da audição; Franzen 2020), **dividida entre os ramos** daquela fibra na Uint (≈ 0,036 por ramo, com 6 ramos). Hoje são 0,15 por ramo, ou 0,9 por fibra.

## 8. O jovem: força por fibra contra o limiar, e janela de soma (pedido de 18/11: "Pesquise e meça")

| Achado [L] | Fonte e leitura | Confiança |
|---|---|---|
| Fibras ativadas ao mesmo tempo necessárias para a MSO disparar: **4,62 no jovem** (P9/10, antes do início da audição) e **3,27 no maduro** (~P73), em repouso, no início do estímulo | Kladisios, Fischer & Felmy 2020, *Front Cell Neurosci* 14:592213 (texto integral, lido por ferramenta de resumo até ~2/3 da página) | média-alta |
| Corrente de uma fibra: **0,7 nA** (P9/10) → **1,88 nA** (maduro). Reobase: **0,49 → 4,78 nA** | idem | média-alta |
| Com atividade contínua (depressão sináptica), o maduro precisa de "cerca de quatro a **dez**" fibras; os autores chamam dez de estimativa **mínima** | idem (Discussão) | média |
| Janela de soma temporal: **1,64 ms em P14 → 0,87 ms em P21**. A meia-largura do EPSP vai de 0,78 para ~0,55 ms. O estreitamento vem da corrente de potássio de baixo limiar | Scott, Mathews & Golding 2005, *J Neurosci* 25:7887 (texto integral, lido por ferramenta de resumo) | média-alta |
| Entre P14 e P28–30, o limiar de corrente sobe ~3× e a resistência de entrada cai ~3× | idem | média |

**Leitura [I]:**
1. A hipótese "no jovem a fibra é mais forte em relação ao limiar" **não** se sustenta: é o contrário. No jovem, uma fibra vale ~1/4,6 do limiar; no maduro, ~1/3,3. O nosso teto (0,5 de 1,5 = 1/3) corresponde ao **maduro**.
2. O que o jovem tem a mais é **janela**: a soma temporal é ~2× mais longa em P14 do que em P21. Nossa janela retangular de 0,30 ms não é diretamente comparável com essa "janela de soma" (as medidas são diferentes), então a comparação tem confiança baixa.
3. **Tensão na literatura:** com atividade contínua, o maduro precisa de ~10 fibras ao mesmo tempo, mas a convergência mínima estimada é de 2–4 por lado (Couchman 2010). Ou chegam mais fibras do que o mínimo funcional, ou as fibras reais disparam mais juntas. O nosso alcance (2–4 por lado) usa o **mínimo**, não a convergência anatômica, que não li.
4. A medida mostra uma falta de ~25% nos melhores momentos (seção de resultados de 18/11). Pistas NB para fechar essa falta, sem nada decidido: **janela mais longa no jovem** (maturação, apoiada em Scott 2005) ou **convergência maior** (a pesquisar).

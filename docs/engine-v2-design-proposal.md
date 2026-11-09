# Proposta de desenho do motor, versão 2 (para aprovação)

Data: 09/11/2026. Situação: **implementado em `src/engines/constitutive/engine-v2.js`** (versão 1 preservada). D1–D4 adotadas **provisoriamente** com as sugestões abaixo depois de o responsável responder "prossiga" sem objeção; revisáveis. Nada calibrado nem pré-registrado. Junta as decisões do responsável ([effects-v0.1.md](effects-v0.1.md), [clear-v43-reconciliation-v0.1.md](clear-v43-reconciliation-v0.1.md), adendo da [auditoria](clear-implementation-audit-v0.1.md)) e preenche o que falta com propostas nossas, marcadas como tal. Referências: conferidas em 09/11/2026 quanto à existência e ao achado principal, **por resumo** (não texto integral): Isaacson e Scanziani 2011, *Neuron* 72(2), 231–243; Vogels et al. 2011, *Science* 334, 1569–1573; Bi e Poo 1998, *J. Neurosci.* 18(24), 10464–10472 (janela de ~20 ms; potenciação se a entrada precede a descarga, depressão se a segue); Fields 2015, *Nat. Rev. Neurosci.* 16(12), 756–767; Buzsáki 2015, *Hippocampus* 25(10), 1073–1188 (ondas originadas no sistema recorrente de CA3); Pouille e Scanziani 2001, *Science* 293, 1159–1163 (inibição pré-alimentada limita a janela de integração a menos de 2 ms). As marcas "de memória" no texto abaixo ficam superadas por esta lista.

Legenda da origem de cada regra: **[CLEAR v43]** texto da teoria · **[Resp.]** decisão do responsável · **[Lit.]** literatura neurobiológica · **[Nossa]** proposta ou inferência nossa.

## 1. Entidades
| Entidade | Propriedades | Origem |
|---|---|---|
| **Incidência** | origem, instante, magnitude m ∈ [0, 1], efeito e ∈ [−1, +1] | [CLEAR v43] incidência; [Resp.] magnitude e efeito |
| **Utrd** (canal) | emite incidência quando a medida varia; pode acrescentar efeito e ganho; posição | [CLEAR v43] L185; [Resp.] |
| **Upro** (passa a ser entidade) | origem, destino, atraso, ganho g ≥ 0, efeito acrescentado Δe, favorecimento | [CLEAR v43] L71, L74, L131; [Resp.] |
| **Uint** | n ≥ 2 aferências por Upro diferentes; limiar 1; constante de disponibilidade τ; pode acrescentar efeito e ganho (papel de receptor); refratário; Upro de saída | [CLEAR v43] L73; [Resp.] |
| **Propriedade marca-passo** | impulso intrínseco; qualquer unidade pode tê-la | [Resp.]; [Lit.] Häusser e Clark 1997; Bevan e Wilson 1999 |
| **Elementos do substrato** | mantidos (alocação por excitabilidade) | [Nossa]; [Lit.] Rashid 2016 |
| **Fonte de novidade, modulador, receptor, relógio** | mantidos | já aprovados |

## 2. Dinâmica das incidências
1. **Origem:** só Utrd e unidades com propriedade marca-passo criam incidência. [Resp.]
2. **Ao passar por uma unidade:** e ← limite[−1, 1](e + Δe); m ← min(1, m × g). Unidade sem Δe e g = 1 não altera. [Resp.]
3. **Na Uint:** cada incidência contribui m × e × exp(−(t − chegada)/τ); a Uint descarrega quando a soma ≥ 1. [Resp.] soma; [Nossa] núcleo exponencial (já usado no motor atual).
4. **Emissão da Uint:** incidência de magnitude 1 (descarga tudo ou nada); o que chega ao destino depende das Upro de saída. [Nossa]; [Lit.] potencial de ação tudo ou nada, liberação regulada na sinapse. Respeita "pode ampliar" e "nunca a partir de zero".
5. **Efeito inicial:** a incidência nasce com e = 0; o efeito é o que as unidades acrescentam. [Nossa], a partir de [Resp.] "efeito adicionado pelas unidades". **Decisão pedida (D1).**

## 3. Preparação do campo representacional relacional
Sem mecanismo separado: com n ≥ 2 aferências e disponibilidade τ, as contribuições abaixo do limiar que chegam às Uint relacionadas aos nós acessados **são** a preparação; com efeitos negativos, há também desfavorecimento. [Resp.] definição; [CLEAR v43] L95, L107; [Nossa] equivalência.

## 4. Inibição pelo contexto (como os efeitos negativos se constituem)
A v43 e o responsável definem o que é o efeito, não como os efeitos negativos surgem. Proposta:
- **Inibição de retorno estrutural [Nossa; Lit.]:** quando a Pcrt constitui uma Uint, constitui também Upro com Δe negativo dela para as Uint que compartilham suas aferências (concorrentes). O acesso a uma representação desfavorece as concorrentes. Paralelo: inibição de retorno e lateral por interneurônios (Isaacson e Scanziani 2011, de memória).
- **Plasticidade inibitória [Lit.], fase seguinte:** ajuste das Upro negativas para equilibrar excitação e inibição (Vogels et al. 2011, *Science*, de memória). Fica fora da primeira versão.
- **Substitui** a "inibição lateral" atual (vence a mais preparada do par, no máximo 8 por evento).
- **Decisão pedida (D2).**

## 5. Ajustar antes de criar
- **Acomodação [CLEAR v43] L81–82:** quando incidências ativas convergem para uma Uint existente com descompasso de atraso dentro de uma tolerância, ajusta-se o atraso da Upro em direção ao intervalo observado (e o ganho, pela seção 6). Paralelo: mielinização dependente de atividade (Fields 2015, de memória; confiança moderada).
- **Constituição:** só quando nenhuma Uint existente recebe pelo menos duas das Upro ativas dentro da tolerância. A nova Uint recebe **todas** as Upro ativas no intervalo, não só duas.
- Tolerância e taxa de ajuste: parâmetros novos, a calibrar. **Decisão pedida (D3).**

## 6. Fortalecimento e enfraquecimento
- **Por confirmação [Resp.] (b); [CLEAR v43] L82:** a Upro cuja incidência contribuiu para uma descarga aumenta o favorecimento (ganho g), com limite.
- **Por incidência tardia [CLEAR v43] L81:** a Upro cuja incidência chegou depois da descarga diminui o ganho e ajusta o atraso. Paralelo: plasticidade dependente do tempo do disparo (Bi e Poo 1998, de memória).
- **Papel do modulador:** multiplica a taxa desses ajustes (regra de três fatores, Gerstner et al. 2018, já usada) e continua decidindo alocação e consolidação.
- **Cascata, decaimento e poda:** mantidos, agora aplicados à Upro.

## 7. Sono
- A reativação deixa de inventar atividade: no sono, uma parte das Uint passa a ter a propriedade marca-passo ativa; as incidências propagam pelas Upro; o fortalecimento é só o da seção 6. [Resp.] regra da origem; [Lit.] ondas agudas do hipocampo, geradas intrinsecamente (Buzsáki 2015, de memória). Quais e quantas unidades: **decisão pedida (D4).**
- Renormalização ×0,8 mantida.

## 8. Surpresa (previsão da CLEAR, preprint L415)
Medida proposta [Nossa]: descarga de uma Uint provocada por incidência transduzida quando a soma das contribuições de contexto sobre ela, logo antes, era **negativa**. Distingue "desfavorecida pelo contexto" de "apenas não preparada". Depende da confirmação de que a previsão continua valendo (pergunta em aberto).

## 9. O que sai e o que fica
- **Sai:** unidade com exatamente duas aferências; pesos fixos 0,3–0,95 e 0,8; uma unidade por atraso; reativação sem incidência; "surpresa = 1 − preparação".
- **Fica:** substrato, alocação, novidade, receptor, relógio, cascata, checkpoint, monitor, interface.

## 10. Perdas declaradas
Ver [effects-v0.1.md](effects-v0.1.md), seção 5 (inibição por desvio de corrente, dependência de voltagem e cursos temporais por sinal ficam fora). Acrescenta-se: emissão tudo ou nada (sem codificação na forma do disparo); inibição de retorno estrutural sem interneurônios explícitos.

## 11. Depois da aprovação
Implementar → controles positivos e negativos de cada mecanismo → pré-registro versão 2 (mantendo o negativo da rodada 1) → calibração → campanha.

## 12. Implementação (09/11/2026)
- Arquivos: `src/engines/constitutive/engine-v2.js`, `src/engines/constitutive/parameters-v2.js`, `tests/constitutive-engine-v2.test.js` (9 testes: contrato; delay lines e acomodação; uma aferência não basta; fortalecimento por confirmação; incidência tardia enfraquece e encurta o atraso; Upro inibitórias e surpresa; nenhuma incidência sem fonte; checkpoint exato; sono só por descarga intrínseca). Suíte completa: 277 de 277.
- `node scripts/run-constitutive.mjs --engine=v2 --world=...` roda a versão 2.
- Escolhas de implementação [Nossa], a declarar no pré-registro v2: a Uint constituída recebe a origem do evento e até 3 outras da mesma escala de traço; ganho inicial 0,6 (duas coincidências bastam, de qualquer subconjunto das aferências: completamento parcial); disponibilidade τ = 2,5 × tolerância; o ajuste por convergência falha move os dois atrasos pela metade; a renormalização do sono age na força da Uint, não no ganho das Upro; a incerteza esperada passa a ser a média de surpresas (no sentido novo) por descarga.
- Execução de fumaça (120 s, semente 1, sem calibração; **não interpretar**): mundo de altura fixa, 14 Uint, 440 descargas, 148 surpresas, 158 Upro inibitórias; mundo aleatório, 23 Uint, 244 descargas, 65 surpresas, 416 Upro inibitórias.

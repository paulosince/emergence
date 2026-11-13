---
title: "EMERGENCE V0.15 — Resultados (Etapa III)"
subtitle: "Criação e utilização da representação transduzida — som"
author: "Responsável: Paulo Rogério da Silva · Execução e redação: assistente (Claude)"
date: "13/11/2026 — V0.15 encerrada por decisão do responsável"
lang: pt-BR
---

# Resumo

- **Desfecho pelo critério pré-registrado (D12): interrupção.** Todas as execuções da condição principal atingiram o limite de 5.000 Uint ainda na **primeira** apresentação do primeiro bloco, entre 0,62 e 0,71 s (o som começa em 0,50 s).
- **As perguntas principais não chegaram a ser testadas.** Reacesso, seletividade e dependência dos atrasos (H1 contra H3/H4) ficaram sem teste, porque nenhuma execução chegou ao bloco de teste.
- **Dois achados exploratórios**, não pré-registrados, explicam a falha e orientam a próxima versão:
  1. com 16 candidatas de peso cheio na mesma Uint e a chegada mais recente substituindo a anterior (D17a), a Uint perde a detecção de coincidência sob entrada periódica: dispara no teto da refratariedade e credita as candidatas quase por igual;
  2. com fases sorteadas por apresentação, **o intervalo entre faixas (eixo Y) muda a cada repetição do mesmo som**, enquanto **o intervalo entre sensores (eixo Z) fica estável e igual à diferença de chegada da fonte**.
- O responsável decidiu **encerrar a V0.15** com este resultado e redesenhar (13/11/2026).

# 1. O que foi executado

Código: `src/` neste diretório. Especificação: [congelada](experiment-spec.md) (versão 1.0). Calibração: `calibration.json`. Resumos por execução: `results/raw/`. Scripts de análise: `analysis/`. Desvios: [deviations.md](deviations.md).

| Condição | Sequência | Sementes | Resultado |
|---|---|---|---|
| Principal | S1 | 1–10 | 10 de 10 interrompidas (5.000 Uint) entre 0,63 e 0,71 s |
| Principal | S2, S3, S4, S5 | 1 | Interrompidas em 0,655 s. Idênticas a S1, semente 1, como esperado: o primeiro bloco é o mesmo |
| Principal | S6 (B primeiro) | 1 | Interrompida em 0,62 s |
| K8a, silêncio absoluto | — | 1 | 0 incidências, 0 Uint |
| K8b, só ruído de fundo | — | 1 | 0 incidências, 0 Uint |
| K11, regra D17 desligada | S1 | 1 | Interrompida em 2,24 s |

**Não executados**, porque dependiam de execuções principais completas: K1 (lookup), K2 (relógio; precisa das contagens da execução principal), K3, K4 e K5 (intervenções no bloco de teste), K9 (ruído de banda larga), K10 e a condição de segundo nível (D14).

**Auditoria:** 9 de 9 testes automáticos passaram (`test/audit.test.js`). As factories recusam chamadas sem trilha. O registro precursor não guarda referência a Uint nem a Upro. Os atrasos das candidatas não dependem do intervalo vivido. Uma origem sozinha não dispara a Uint (D17). Há determinismo, invariância à troca de identificadores (K6) e a mesma estrutura sem observador (K7, em execução curta). **Ordem:** as primeiras execuções diagnósticas foram feitas antes de os testes estarem escritos (desvio 5).

# 2. Confronto com as previsões

| Previsão | Resultado | Estatuto |
|---|---|---|
| P1: A cria Uint pela Pcrt, com trilha completa | **Confirmada em parte.** A primeira Uint nasce cerca de 12 ms após o início do som, depois de 5 encontros recorrentes, com trilha até as incidências. Mas a criação não para (ver achado 1) | Observado |
| P2: reacesso na reapresentação, com pouca recriação | **Não testada** (interrupção) | — |
| P3: seletividade A contra B | **Não testada** | — |
| P4: Uint binaurais com diferença de atraso próxima da diferença de chegada | **Não testada** como previsto. O intervalo vivido Z ficou estável em 0,292 ms, frente a 0,2915 ms de diferença de chegada (achado 2) | Exploratório |
| P5: Uint entre canais ligando harmônicos de A | **Não testada.** O achado 2 indica que, com fases sorteadas, essas Uint não seriam reacessáveis | Exploratório |
| N1: silêncio não cria nada | **Confirmada** (K8a e K8b) | Observado |
| N2–N3: K3, K4 e K2 derrubam o reacesso | **Não testadas** | — |
| N4: K6 não muda nada | **Confirmada** em execução curta (teste automático) | Observado |

# 3. Achado 1 — a Uint com candidatas perde a detecção de coincidência

**Observação (semente 1, `analysis/firing_rate.mjs`):** as 148 Uint criadas antes de 0,52 s disparam em média **977 vezes por segundo** entre 0,55 e 0,60 s. O teto imposto pela refratariedade de 1 ms é de 1.000 por segundo. Só **52,6%** dos pares avaliados pela Pcrt foram acomodados até 0,60 s. No mesmo par de vias, chegaram a ser criadas **15 Uint** em 150 ms.

**Mecanismo reconstruído (dedução do assistente, sustentada pelo rastreamento em `results-diagnostic.md`):**

1. As 16 candidatas de cada via cobrem 0,5 a 3,5 ms, mas as vias emitem a cada 1 a 5 ms. As chegadas de emissões **sucessivas** da mesma via se intercalam.
2. Pela D17a, vale a chegada mais recente de cada origem. Então, quase toda chegada de uma via encontra uma chegada da outra a menos de 0,2 ms (o degrau), dentro da janela de 0,21 ms, e a Uint dispara.
3. Os disparos juntam incidências de **ciclos diferentes**. Os pares que a Pcrt avalia (as emissões mais recentes de cada via, até 3 ms) frequentemente não aparecem no mesmo disparo. A Pcrt conclui que não houve acomodação e constitui de novo.

**Análise complementar (`analysis/credit.mjs`):** o crédito por candidata, durante a seleção, sai **espalhado quase por igual** entre as 16 candidatas de cada via. Na primeira Uint: `9 17 11 9 10 8 9 4 3 2 3 7 4 3 3 4` e `10 13 7 7 9 10 6 4 5 5 4 8 4 4 4 6`. Por isso, uma seleção **gradual** (ficar com as mais creditadas) também não escolheria o intervalo certo. Essa análise levou o responsável a não seguir com a V0.15.1.

**Leitura:** num conjunto de candidatas de peso cheio que convergem na mesma Uint, a regra "por origem, a mais recente substitui" torna cada origem praticamente **sempre presente** depois de cada emissão. A coincidência deixa de ser rara e perde valor informativo. Em Gerstner et al. (1996, **só o resumo**), a seleção ocorre com muitas entradas de pesos graduados ao longo do desenvolvimento, não com candidatas de peso cheio e limiar baixo. A comparação detalhada exige ler o texto integral.

# 4. Achado 2 — na escala de fase, Y não é estável; Z é

**Observação (semente 1, `analysis/phase.mjs`, sem a Pcrt, só registro das emissões):** média do intervalo vivido em quatro apresentações de A.

| Par de vias | Apres. 1 | Apres. 2 | Apres. 3 | Apres. 4 |
|---|---|---|---|---|
| Y: E 189 Hz → E 378 Hz | 1,433 ms | 1,676 ms | 2,675 ms | 0,393 ms |
| Y: E 378 Hz → E 600 Hz | 1,767 ms | 1,326 ms | 1,175 ms | 1,833 ms |
| Z: E 378 Hz → D 378 Hz | **0,292 ms** | **0,292 ms** | **0,292 ms** | **0,292 ms** |

A diferença de chegada da fonte em −30° é 0,20 × sen 30° / 343 ≈ **0,2915 ms**.

**Leitura:**

- **Causa:** a especificação sorteia a fase de cada componente a cada apresentação (HC7). A defasagem entre faixas depende da fase relativa entre harmônicos. Entre os dois sensores, a defasagem depende só da geometria.
- **Consequência:** relações Y medidas no cruzamento de cada ciclo **não são propriedade estável do som**. Qualquer Pcrt que as constitua nessa escala recria Uint a cada apresentação, com qualquer regra de atraso.
- **Relação com a literatura** (a confrontar formalmente): a percepção de altura é em grande parte insensível à fase entre harmônicos. O modelo de Shamma e Klein (2000) obtém relações harmônicas estáveis pela **retificação**, que gera, dentro de cada canal, componentes nos múltiplos da frequência. Não usa o instante de cruzamento de cada ciclo.
- **Para Z, o resultado é encorajador:** a Utrd estrita entrega, sem nenhum cálculo binaural, intervalos que reproduzem a diferença de chegada com precisão de microssegundos.

# 5. Estatuto (três níveis)

| Nível | Situação |
|---|---|
| L1 transmissão | Transdução e propagação operam: emissões no ciclo e entregas com atraso medidas |
| L2 constituição | Criação autônoma com trilha ocorreu, mas descontrolada. Não há organização estável a avaliar |
| L3 representação | Não testado |

# 6. Lições para a próxima versão (hipóteses, não decisões)

1. **Candidatas na mesma Uint são incompatíveis com detecção de coincidência sob entrada periódica**, com peso cheio e "a mais recente substitui". Alternativas a investigar: uma Uint por diferença de atraso (fileira de detectores, como em Carr e Konishi, 1990), com o custo de densidade; pesos graduados com limiar que exija coincidência (como em Gerstner et al., 1996); ou o atraso por deslocamento, já recusado na D5.
2. **Densidade:** a Pcrt constituiu Uint para quase todo par de vias coativas (1.555 pares distintos em 150 ms, com 42 vias ativas). Mesmo com a coincidência funcionando, um som harmônico geraria da ordem de mil Uint de primeiro nível. É preciso decidir se isso é aceitável ou se a constituição deve ser mais seletiva.
3. **Escala de Y:** relações entre faixas talvez precisem de uma escala ou propriedade estável (periodicidade, envelope), não do cruzamento de cada ciclo.
4. **Z está pronto para ser testado isoladamente**, por exemplo com estímulos de uma só faixa ou com fases fixas. Mas restringir a Pcrt a pares Z seria programar o resultado. A restrição teria de vir do estímulo, não da regra.
5. **No pré-experimento, simular o mecanismo com um caso mínimo antes de congelar** (um par de vias, sinal periódico). Os dois achados teriam aparecido em minutos. Essa falha do pré-experimento é do assistente.

# 7. Limitações

- Achados exploratórios com uma semente (o achado 1 se repetiu nas 10 sementes de S1 como interrupção; as medidas detalhadas são da semente 1).
- Análise e interpretação do assistente, sem revisão independente.
- Gerstner et al. (1996) e Carr e Konishi (1990) foram lidos só pelo resumo.

# Calibração dos limiares do pré-registro v1

**Data:** 09/11/2026. **Script:** `experiments/calibrate-thresholds.js` (10 sementes, quedas episódicas, 40 episódios, amostragem de 1 ms, 2.000 permutações, 30 substitutos por deslocamento circular). **Dados:** [run-1-defective.txt](calibration/run-1-defective.txt), [run-2.json](calibration/run-2.json). Tempo de execução: ~19,5 min por rodada.

**Regra de validade:** um critério só é válido se o controle positivo **passa** e os controles negativos **falham**. Um critério em que um negativo passa (ou o positivo falha) não discrimina e não pode decidir uma hipótese.

| Controle | Papel | O que é |
|---|---|---|
| `oracle` | positivo | Recebe do projetista o par de canais (impacto − soltura) e cria uma unidade por intervalo vivido (tolerância 5 ms) |
| `oracle-random` | negativo | Mesma estrutura, mas atrasos aleatórios em fluxo de semente independente |
| `tempo` | negativo | Controle TEMPO de nós fixos (relações por latência, controle de latências) |

## Rodada 1 (defeituosa)
Revelou cinco defeitos do **desenho**, não do motor: (1) o negativo aleatório compartilhava a semente do cronograma de alturas (ρ ≈ 0,99 espúrio); (2) critério de formação contava unidades brutas, que os substitutos produzem em maior número; (3) salvaguarda da altura fixa confundia tendência temporal com altura; (4) salvaguarda das latências igualadas "passava" para o TEMPO sem efeito algum; (5) 1.000 permutações não atingem o primeiro degrau de Holm. Os quatro primeiros foram corrigidos em código (commit `d012ee7`) e o quinto no pré-registro (`7bca545`).

## Rodada 2 (corrigida)
| Critério | oracle (deve passar) | oracle-random (deve falhar) | tempo (deve falhar) | Válido? |
|---|---|---|---|---|
| Critério de ancoragem na altura | **passa** 10/10; \|ρ\| 0,97–0,99; p = 0,0005 | **falha** 0/10; \|ρ\| ≤ 0,21 | **falha** 0/10; \|ρ\| ≤ 0,55 | **Sim** |
| Grade do critério de ancoragem na altura (ρ 0,3–0,9 × 6–10 sementes) | passa em todas as 35 células | falha em todas | falha em todas | **Robusto**: a decisão não depende do limiar escolhido |
| Salvaguarda da altura fixa | passa 10/10 | passa 9/10 | passa 8/10 | Salvaguarda, não discriminador (ver abaixo) |
| Salvaguarda das latências igualadas | passa (retém 100%) | não aplicável (critério de ancoragem na altura falhou) | não aplicável | **Sim** |
| Critério de formação (consolidadas ≥ 3) | **falha** 6/10 | falha 0/10 | **passa** 9/10 (2 × nulo 0) | **Não — invertido** |
| Critério de continuidade | passa (persiste 100%, taxa 22%) | **passa** (100%, 19%) | falha (taxa 0) | **Não discrimina** |

### Leitura
- **Critério de ancoragem na altura, salvaguarda das latências igualadas: validados.** O limiar 0,6 fica bem longe dos dois lados (positivo ≥ 0,97; pior negativo 0,55, numa semente). O resultado é o mesmo em toda a grade, então a escolha exata do limiar quase não importa neste mundo.
- **Salvaguarda da altura fixa: só derruba, não sustenta.** Por construção, os negativos não têm covariância com pseudo-alturas e passam. Salvaguarda da altura fixa só serve para **derrubar** um falso critério de ancoragem na altura; não pode ser usado como evidência a favor. Isso está coerente com a seção 7 do pré-registro ("hipótese de ancoragem refutada se … salvaguarda da altura fixa indicar artefato").
- **Critério de formação: inválido como está.** Duas causas, ambas conceituais:
  1. o **TEMPO passa** porque as relações dele são estrutura real das latências dos instrumentos, que os substitutos destroem. Critério de formação detecta "estrutura acima do substituto", e o artefato de latência (controle de latências) é estrutura. Separar mundo de instrumento é papel da salvaguarda das latências igualadas, não de critério de formação;
  2. o **oráculo falha** porque representa fielmente 40 alturas distintas: cada intervalo cai em seu próprio bin e poucos chegam a 3 descargas. Contar unidades reutilizadas penaliza justamente a representação fiel de uma variável contínua. Nos substitutos, os intervalos aleatórios produzem quantidade parecida de bins reutilizados (exemplo semente 1: 3 reais × máximo nulo 5).
  Confiança nessa leitura: média-alta (conferida no código do oráculo; não testei variações).
- **Critério de continuidade: não discrimina.** Persistência e taxa de criação são satisfeitas por um sistema que cria unidades ao acaso. Ele mede **continuidade**, não ancoragem; pode continuar como critério da hipótese de continuidade, mas não diz nada sobre a hipótese de formação ou a de ancoragem e precisa ser lido junto com critério de ancoragem na altura.

## Decisões pendentes (do responsável)
1. **Critério de formação:** opções, em ordem de preferência minha:
   - **opção da informação:** trocar contagem por **informação**: informação mútua entre a unidade que dispara e a altura do episódio, real × substitutos. O oráculo deveria passar e o TEMPO falhar (o TEMPO não acompanha a altura);
   - **opção condicional:** manter o critério de formação **apenas condicional à salvaguarda das latências igualadas** (estrutura acima do substituto **e** que sobrevive à igualação de latências);
   - **opção da retirada:** retirar o critério de formação e deixar a hipótese de formação apoiada no critério de ancoragem na altura + critério de papel causal.
   Qualquer opção exige nova rodada de calibração de critério de formação (~20 min).
2. **Critério de continuidade:** aceitar como critério só da hipótese de continuidade, com nota de que não discrimina ancoragem; ou acrescentar exigência de que as unidades persistentes **mantenham** critério de ancoragem na altura após a mudança de faixa.
3. **Critério de papel causal e critério de vantagem sobre comparadores** não foram calibrados (exigem o motor constitutivo e os comparadores). Ficam marcados como não calibrados.

## Teste da opção da retirada: retirar critério de formação e apoiar hipótese de formação no critério de ancoragem na altura + critério de papel causal
**Script:** `experiments/calibrate-option-c.js` (~15 s; 10 sementes). **Dados:** [option-c.json](calibration/option-c.json). Novo controle negativo `oracle-create-always`: acompanha a altura, mas nunca reutiliza unidade (é a ablação "criar sempre", que critério de formação deveria pegar). Remoção no início do episódio 20 de 40; alvos = até 10 unidades consolidadas (≥ 3 descargas) mais antigas; 30 remoções aleatórias entre as unidades existentes. **Desfecho provisório de critério de papel causal** (operacionalização minha, não aprovada): descargas depois da remoção atribuídas a unidades constituídas antes dela.

| Controle | Critério de ancoragem na altura | Critério de papel causal | A opção da retirada apoia a hipótese de formação? | Esperado |
|---|---|---|---|---|
| oracle | passa 10/10 | **falha 0/10** | não | sim |
| oracle-random | falha | falha 0/10 | não | não |
| oracle-create-always | **passa 10/10** | falha (0 consolidadas) | não | não |
| tempo | — | não testável (sem `ablate`) | — | — |

### Leitura
1. **A opção da retirada, como está, não funciona:** o controle positivo falha no critério de papel causal.
2. **Por que critério de papel causal falha no oráculo:** (i) com alturas sorteadas independentemente, uma unidade antiga não tem mais futuro que uma qualquer; (ii) o oráculo tem só 7–10 unidades, então o máximo de 30 remoções aleatórias é praticamente a unidade mais usada de todas, e o alvo teria de superá-la. Critério de papel causal com nulo "unidades aleatórias do mesmo sistema" testa se **algumas unidades importam mais que outras**, não se as unidades têm papel causal. Confiança: média-alta.
3. **Achado que vale para qualquer opção:** o controle "criar sempre" **passa no critério de ancoragem na altura** em 10/10 sementes. Critério de ancoragem na altura mede ancoragem, não formação. Retirar critério de formação sem um critério de papel causal que funcione deixaria a ablação "criar sempre" sem detector.
4. **Consequência para a opção da informação:** informação mútua entre unidade e altura também precisa ser calibrada contra "criar sempre": com uma unidade nova por episódio, a identidade da unidade "informa" tudo trivialmente. A medida teria de ser validada fora da amostra (unidades formadas numa metade, avaliadas na outra).

### Opções para critério de papel causal (decisão do responsável)
- **nulo entre sistemas:**: comparar o efeito da remoção com o mesmo procedimento no controle "criar sempre" (efeito ≈ 0);
- **nulo de remoção de traço equivalente:**: remover incidências da mesma quantidade em vez de uma unidade;
- **nulo atual com mundo estruturado:** manter o nulo atual, mas exigir mundos com estrutura temporal (unidades antigas com futuro previsível), o que as quedas i.i.d. não têm.

## Critérios de engrama: critério de reativação específica, critério de perda de função específica, critério de persistência e retorno
**Base:** [investigação de engramas](engram-criteria-v0.1.md). **Código:** `src/research/criteria/engram.js`, `experiments/calibrate-engram.js` (10 sementes, 2.000 permutações, 30 remoções aleatórias; ~20 min com o TEMPO). **Dados:** [engram.json](calibration/engram.json) (rodada completa) e [engram-d4s-fix.txt](calibration/engram-d4s-fix.txt) (critério de perda de função específica depois da correção abaixo).

| Critério | oracle (deve passar) | oracle-random | create-always | tempo | Válido? |
|---|---|---|---|---|---|
| Critério de reativação específica (observado/acaso) | **passa 10/10** (0,65–0,85 / 0,11–0,25) | falha 0/10 (≤ 0,15 / ~0,08) | falha 0/10 (0 / 0) | falha 0/10 (1 / 1: a mesma relação para toda altura) | **Sim** |
| Critério de perda de função específica | **passa 10/10**; 100% das unidades-alvo acima do nulo; especificidade 1,0 | não aplicável (critério de reativação específica falhou); sem a condição, passaria em 6/10 | falha (nenhum alvo) | não testável (sem `ablate`) | **Sim, condicionado a critério de reativação específica** |
| Critério de persistência e retorno (persistência, dormência, ecforia) | **passa 10/10** (ecforia 0,73–0,93 / 0,12–0,20) | falha 0/10 | falha 0/10 (ecforia 0) | falha 0/10 (taxa de criação 0; ecforia 1 / 1) | **Sim** |
| Grade de ganho mínimo 0,1–0,4 (critério de reativação específica e critério de persistência e retorno) | passa em todas | falha em todas | falha em todas | falha em todas | **Robusto** |

### Defeito encontrado e corrigido (critério de perda de função específica, rodada 1)
Na primeira rodada, o oráculo falhou no critério de perda de função específica (6/10) por especificidade entre 0,82 e 0,90. Causa: depois de remover uma unidade, o oráculo cria uma substituta, e **todas as unidades criadas depois recebem outro número de identificação**. Episódios respondidos por unidades novas pareciam "alterados" sem que nada funcional tivesse mudado. Correção, alinhada à leitura de Han et al. (2009), em que o controle de especificidade é a preservação de **outras memórias já formadas**: a especificidade conta só episódios recuperados por outras unidades que já existiam na codificação. Depois da correção, especificidade 1,0 em todas as sementes. Confiança no diagnóstico: alta (a especificidade foi exatamente a 1 com a mudança, sem outra alteração).

### Achado
O controle aleatório **passa no critério de perda de função específica em 6/10 sementes quando a condição é retirada**: as unidades dele têm papel causal (removê-las muda a resposta), mas não têm conteúdo. Isso confirma a sequência da área: primeiro mostrar o engrama (reativação específica), depois a necessidade. Necessidade sem conteúdo não é representação.

### Limites
- TEMPO não declara `ablate`, então critério de perda de função específica não pôde ser testado nele; ele já falha no critério de reativação específica e critério de persistência e retorno.
- O "responder" do TEMPO é a relação 0→1 mais forte no fim do episódio (ele não emite eventos de unidade); a leitura é aproximada.
- Os controles são deliberadamente simples. A calibração mostra que os critérios **separam** os casos previstos; não garante que separem casos mais sutis, como um motor que forme unidades por canal e não por conteúdo.

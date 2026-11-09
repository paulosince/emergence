# Calibração dos limiares do pré-registro v1

**Data:** 09/11/2026. **Script:** `experiments/calibrate-thresholds.js` (10 sementes, quedas episódicas, 40 episódios, amostragem de 1 ms, 2.000 permutações, 30 substitutos por deslocamento circular). **Dados:** [run-1-defective.txt](calibration/run-1-defective.txt), [run-2.json](calibration/run-2.json). Tempo de execução: ~19,5 min por rodada.

**Regra de validade:** um critério só é válido se o controle positivo **passa** e os controles negativos **falham**. Um critério em que um negativo passa (ou o positivo falha) não discrimina e não pode decidir uma hipótese.

| Controle | Papel | O que é |
|---|---|---|
| `oracle` | positivo | Recebe do projetista o par de canais (impacto − soltura) e cria uma unidade por intervalo vivido (tolerância 5 ms) |
| `oracle-random` | negativo | Mesma estrutura, mas atrasos aleatórios em fluxo de semente independente |
| `tempo` | negativo | Controle TEMPO de nós fixos (relações por latência, P0.1) |

## Rodada 1 (defeituosa)
Revelou cinco defeitos do **desenho**, não do motor: (1) o negativo aleatório compartilhava a semente do cronograma de alturas (ρ ≈ 0,99 espúrio); (2) D2 contava unidades brutas, que os substitutos produzem em maior número; (3) D3b confundia tendência temporal com altura; (4) D3c "passava" para o TEMPO sem efeito algum; (5) 1.000 permutações não atingem o primeiro degrau de Holm. Os quatro primeiros foram corrigidos em código (commit `d012ee7`) e o quinto no pré-registro (`7bca545`).

## Rodada 2 (corrigida)
| Critério | oracle (deve passar) | oracle-random (deve falhar) | tempo (deve falhar) | Válido? |
|---|---|---|---|---|
| D3a | **passa** 10/10; \|ρ\| 0,97–0,99; p = 0,0005 | **falha** 0/10; \|ρ\| ≤ 0,21 | **falha** 0/10; \|ρ\| ≤ 0,55 | **Sim** |
| Grade D3a (ρ 0,3–0,9 × 6–10 sementes) | passa em todas as 35 células | falha em todas | falha em todas | **Robusto**: a decisão não depende do limiar escolhido |
| D3b | passa 10/10 | passa 9/10 | passa 8/10 | Salvaguarda, não discriminador (ver abaixo) |
| D3c | passa (retém 100%) | não aplicável (D3a falhou) | não aplicável | **Sim** |
| D2 (consolidadas ≥ 3) | **falha** 6/10 | falha 0/10 | **passa** 9/10 (2 × nulo 0) | **Não — invertido** |
| D5 | passa (persiste 100%, taxa 22%) | **passa** (100%, 19%) | falha (taxa 0) | **Não discrimina** |

### Leitura
- **D3a, D3c: validados.** O limiar 0,6 fica bem longe dos dois lados (positivo ≥ 0,97; pior negativo 0,55, numa semente). O resultado é o mesmo em toda a grade, então a escolha exata do limiar quase não importa neste mundo.
- **D3b: salvaguarda.** Por construção, os negativos não têm covariância com pseudo-alturas e passam. D3b só serve para **derrubar** um falso D3a; não pode ser usado como evidência a favor. Isso está coerente com a seção 7 do pré-registro ("H2 refutada se … D3b indicar artefato").
- **D2: inválido como está.** Duas causas, ambas conceituais:
  1. o **TEMPO passa** porque as relações dele são estrutura real das latências dos instrumentos, que os substitutos destroem. D2 detecta "estrutura acima do substituto", e o artefato de latência (P0.1) é estrutura. Separar mundo de instrumento é papel de D3c, não de D2;
  2. o **oráculo falha** porque representa fielmente 40 alturas distintas: cada intervalo cai em seu próprio bin e poucos chegam a 3 descargas. Contar unidades reutilizadas penaliza justamente a representação fiel de uma variável contínua. Nos substitutos, os intervalos aleatórios produzem quantidade parecida de bins reutilizados (exemplo semente 1: 3 reais × máximo nulo 5).
  Confiança nessa leitura: média-alta (conferida no código do oráculo; não testei variações).
- **D5: não discrimina.** Persistência e taxa de criação são satisfeitas por um sistema que cria unidades ao acaso. D5 mede **continuidade**, não ancoragem; pode continuar como critério de H4, mas não diz nada sobre H1/H2 e precisa ser lido junto com D3a.

## Decisões pendentes (do responsável)
1. **D2:** opções, em ordem de preferência minha:
   - (a) trocar contagem por **informação**: informação mútua entre a unidade que dispara e a altura do episódio, real × substitutos. O oráculo deveria passar e o TEMPO falhar (o TEMPO não acompanha a altura);
   - (b) manter D2 como **critério de formação apenas condicional a D3c** (estrutura acima do substituto **e** que sobrevive à igualação de latências);
   - (c) retirar D2 e deixar H1 apoiada em D3a + D4.
   Qualquer opção exige nova rodada de calibração de D2 (~20 min).
2. **D5:** aceitar como critério só de H4 (continuidade), com nota de que não discrimina ancoragem; ou acrescentar exigência de que as unidades persistentes **mantenham** D3a após a mudança de faixa.
3. **D4 e D6** não foram calibrados (exigem o MCM e os comparadores). Ficam marcados como não calibrados.

## Teste da opção (c): retirar D2 e apoiar H1 em D3a + D4
**Script:** `experiments/calibrate-option-c.js` (~15 s; 10 sementes). **Dados:** [option-c.json](calibration/option-c.json). Novo controle negativo `oracle-create-always`: acompanha a altura, mas nunca reutiliza unidade (é a ablação "criar sempre", que D2 deveria pegar). Remoção no início do episódio 20 de 40; alvos = até 10 unidades consolidadas (≥ 3 descargas) mais antigas; 30 remoções aleatórias entre as unidades existentes. **Desfecho provisório de D4** (operacionalização minha, não aprovada): descargas depois da remoção atribuídas a unidades constituídas antes dela.

| Controle | D3a | D4 | (c) apoia H1? | Esperado |
|---|---|---|---|---|
| oracle | passa 10/10 | **falha 0/10** | não | sim |
| oracle-random | falha | falha 0/10 | não | não |
| oracle-create-always | **passa 10/10** | falha (0 consolidadas) | não | não |
| tempo | — | não testável (sem `ablate`) | — | — |

### Leitura
1. **A opção (c), como está, não funciona:** o controle positivo falha em D4.
2. **Por que D4 falha no oráculo:** (i) com alturas sorteadas independentemente, uma unidade antiga não tem mais futuro que uma qualquer; (ii) o oráculo tem só 7–10 unidades, então o máximo de 30 remoções aleatórias é praticamente a unidade mais usada de todas, e o alvo teria de superá-la. D4 com nulo "unidades aleatórias do mesmo sistema" testa se **algumas unidades importam mais que outras**, não se as unidades têm papel causal. Confiança: média-alta.
3. **Achado que vale para qualquer opção:** o controle "criar sempre" **passa em D3a** em 10/10 sementes. D3a mede ancoragem, não formação. Retirar D2 sem um D4 que funcione deixaria a ablação "criar sempre" sem detector.
4. **Consequência para a opção (a):** informação mútua entre unidade e altura também precisa ser calibrada contra "criar sempre": com uma unidade nova por episódio, a identidade da unidade "informa" tudo trivialmente. A medida teria de ser validada fora da amostra (unidades formadas numa metade, avaliadas na outra).

### Opções para D4 (decisão do responsável)
- (d1) nulo **entre sistemas**: comparar o efeito da remoção com o mesmo procedimento no controle "criar sempre" (efeito ≈ 0);
- (d2) nulo de **remoção de traço equivalente**: remover incidências da mesma quantidade em vez de uma unidade;
- (d3) manter o nulo atual, mas exigir mundos com estrutura temporal (unidades antigas com futuro previsível), o que as quedas i.i.d. não têm.

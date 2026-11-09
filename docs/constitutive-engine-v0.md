# Motor constitutivo, primeira versão: diário de implementação

## Incremento 1: substrato finito e recrutamento (09/11/2026)
**Código:** `src/engines/constitutive/engine.js`; testes em `tests/constitutive-engine.test.js` (5 testes); desempenho em `experiments/constitutive-benchmark.js` ([resultado](calibration/constitutive-benchmark-increment1.json)).

**O que faz:**
- **Eventos:** um evento é uma **mudança** da medida de um canal; o motor não interpreta valores.
- **Traços:** cada fonte tem traços em quatro escalas (0,1 s; 3 s; 90 s; 45 min).
- **Coincidência por par de fontes distintas:** se uma unidade existente acomoda o atraso vivido (tolerância de 5% ou 2 ms), ela descarrega; senão, e se o traço da outra fonte estiver acima do limiar, uma unidade nova é **recrutada**.
- **Recrutamento:** a partir de um substrato finito de elementos em 3D, perto das fontes (economia de fiação), escolhendo os **mais excitáveis**. A excitabilidade combina:
  - uma base;
  - uma flutuação lenta, constante por blocos de 12 h;
  - um reforço que decai em 6 h depois de cada alocação.
- **Registro de origem:** cada unidade guarda os elementos, os aferentes e a incidência que a causou.

**Testes:**
- começa sem unidades;
- o mesmo atraso faz descarregar, sem criar unidade nova;
- outro atraso cria unidade nova;
- o substrato se esgota e o recrutamento falha;
- memórias com 1 h de intervalo compartilham ≥ 80% dos elementos; com 72 h, ≤ 50% (Rashid et al., 2016);
- a remoção libera os elementos.

**Desempenho** (replay de fluxos gravados; só o tempo do motor):

| Fluxo | Incidências | Substrato | Execução | Unidades | Elementos ocupados |
|---|---|---|---|---|---|
| Quedas, 40 episódios | 243 | 1.000 / 10.000 / 100.000 | 4–7 ms | 36 | 12 |
| Mesa, 120 s, 84 canais | 12.049 | 1.000 | 5,8 s | **200.815** | 420 |
| Mesa, 120 s | 12.049 | 10.000 | 8,0 s | 200.815 | 2.547 |
| Mesa, 120 s | 12.049 | 100.000 | 13,3 s | 200.815 | 7.869 |

**Leitura:**
1. **O tamanho do substrato não é o gargalo.** Construir 100.000 elementos leva cerca de 0,15 s, e a execução cresce pouco com o tamanho.
2. **Achado principal:** num mundo rico, o incremento 1 **cria unidades para quase toda coincidência**: mais de 200 mil em 120 s, cerca de 1.700 por segundo. Isso violaria o envelope (50 por segundo) e se aproxima do controle "criar sempre". **Era esperado:** ainda faltam o portão modulador (criar só com sinal de novidade dentro da janela de elegibilidade), o decaimento e a poda em cascata, a inibição lateral e a capacidade por elemento. É evidência de que esses mecanismos **não são opcionais** num mundo com muitos canais e atrasos contínuos.
3. **Capacidade por elemento:** hoje um elemento pode pertencer a um número ilimitado de unidades (200 mil unidades sobre 420 elementos no substrato de 1.000). É irrealista; entra como limite no próximo incremento.
4. **Nenhum critério foi avaliado:** isso só ocorre depois da aprovação do pré-registro revisado.

## Incremento 2: portão de três fatores, estabilidade em cascata e capacidade (09/11/2026)
**Código:** mesmo motor (opções `gating` e `cascade`; desligadas, reproduzem o incremento 1 como ablação); testes em `tests/constitutive-engine.test.js` (8) e `tests/rhythm.test.js` (salva); medição em `experiments/constitutive-increment2.js` ([resultado](calibration/constitutive-increment2.json)).

**O que faz:**
- **Marca de elegibilidade:** a coincidência deixa uma marca, válida por 2 s.
- **Fonte de novidade:** é um **marca-passo**, com disparo tônico de cerca de 0,7 Hz e um impulso intrínseco. A novidade ("nada acomodou") provoca uma **salva fásica**. O marca-passo agora reinicia por subtração, então uma entrada grande gera uma salva.
- **Concentração do modulador:** um disparo isolado (15 nM) fica abaixo da meia-eficácia do receptor (20 nM); uma salva a ultrapassa.
  - **Equivalência declarada:** com densidade uniforme de sítios de liberação, a integral do núcleo de difusão dá concentração espacialmente uniforme (conservação de massa). Sítios explícitos ficam como variante.
- **Dessensibilização:** o receptor se dessensibiliza com a exposição média.
- **Recrutamento só com portão aberto**, dentro da janela de elegibilidade.
- **Alocação competitiva e esparsa:** no máximo 4 alocações por abertura do portão, para as coincidências mais recentes.
- **Intervalo mínimo entre salvas** de 0,5 s (**proposta minha, sem fonte verificada**).
- **Estabilidade em cascata:** a força decai com constante de 10 min × 4^nível. A reativação renova a força e deixa uma marca; o nível sobe se o portão abrir dentro da janela. A poda ocorre abaixo de 0,05.
- **Capacidade:** no máximo 20 unidades por elemento.

**Resultado** (substrato de 10.000 elementos):

| Fluxo | Criadas | Por segundo | Consolidadas (nível ≥ 1) | Liberações | Execução |
|---|---|---|---|---|---|
| Quedas, 40 episódios | 43 | 0,4 | 17 | 112 | 20 ms |
| Mesa, 120 s | 960 | **8** | **894** | 719 | 0,46 s |

Sem portão (incremento 1), a mesa dava cerca de 1.700 por segundo.

**Leitura honesta:**
1. A taxa na mesa (8 por segundo) está **dentro do envelope**, mas é fixada **pelos parâmetros declarados**: 4 alocações a cada 0,5 s. Não emerge do mundo.
2. **A consolidação não é seletiva na mesa:** 93% das unidades sobem de nível, porque a novidade é constante num mundo novo e o portão fica quase sempre aberto. Falta o que torna a novidade seletiva:
   - **surpresa** por falha da espera (antecipação, incremento 3);
   - **habituação**: a novidade cair com a familiaridade;
   - **inibição lateral**.
3. Uma tentativa anterior, sem competição na alocação, mostrou que o portão global sozinho não reduz a criação: cada salva convertia todas as marcas pendentes. A competição é necessária.
4. Os parâmetros do modulador (quantidade por disparo, meia-eficácia, intervalo entre salvas) **não têm fonte**. Precisam ser declarados no pré-registro ou calibrados.

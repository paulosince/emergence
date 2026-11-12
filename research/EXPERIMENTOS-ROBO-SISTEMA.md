# Experimentos, robô, sistema e continuidade — terceira geração

**Versão:** 11/11/2026. **Estatuto:** decisões históricas verificadas nos documentos do repositório e requisitos desta conversa; distinguir proposta de implementação e medição. Fontes: [continuidade](../CONTINUITY.md), [robô v1](../docs/robot-spec-v1.md), [ambiente](../docs/environment-design-v0.md), [método](../docs/program-methodology.md).

## 1. Natureza do programa

**[D]** EMERGENCE é o **modelo completo de pesquisa**, executado continuamente no computador do responsável. Toy models são auxiliares para dúvidas delimitadas e **não** constituem a finalidade nem a arquitetura do programa. A terceira geração é **reescrita nova**: arquivos V1 e V2 ficam em seus lugares, preservados como histórico. Não há migração.

**[D]** O TEMPO original é somente leitura; a pesquisa de EMERGENCE é independente no repositório próprio.

## 2. Robô simulado — decisões documentadas

- [D] **Simulação primeiro** (MuJoCo no código histórico); sem exigir construção física agora.
- [D] Corpo com **tronco cúbico**, locomoção em **duas rodas laterais** e **rodinhas auxiliares** que tocam o solo apenas quando a inclinação ultrapassa ~0,15 rad; equilíbrio sustentado deve ser aprendido, não programado.
- [D] Corpo de referência histórico de **40 cm**, tronco de **25 cm**, rodas **15 × 5 cm**, eixo deslocado **3,5 cm**; medidas são do desenho de 10/11, não imposição eterna da terceira geração.
- [D] Dois braços, ombros/cotovelos/punhos, **três dedos individualizados por mão**, com tendões; pescoço com movimentos próprios; cabeça e **olhos móveis**, duas câmeras; dois ouvidos lateralizados.
- [D] Capacidade de **autotoque**: mãos no próprio corpo, na cabeça e entre si.
- [D] Pele distribuída com pressão, temperatura, vibração e nocicepção; propriocepção, sistema vestibular e interocepção; sensores internos de estado corporal.
- [D] Reflexos motores **mínimos**, incluindo reflexo fásico de equilíbrio; **não** fornecer controlador postural permanente nos experimentos. Reflexos de preensão, retirada e orientação em investigação.
- [D] Movimentos espontâneos podem ser produzidos por marca-passos corporais; a via eferente do domínio deverá aprender a partir dos efeitos sensoriais dos reflexos.
- [D] A janela exploratória evocada por reflexos é uma hipótese de facilitação transitória, **não fabricação de querer** nem Orientação já constituída.
- [A] Contratos finais de atuadores, sensores, unidades transdutivas, parâmetros de simulação e segurança precisam ser revalidados para a reescrita.

## 3. Sala e ambiente — decisões documentadas

- [D] Sala de referência **3,0 × 2,5 × 2,5 m**, com janela baixa (peitoril 0,20 m), porta, fresta, buraco do rato, iluminação solar e lunar.
- [D] Lâmpada acende ao anoitecer e apaga às **22h**; ciclo dia/noite; estímulos luminosos, térmicos e sonoros.
- [D] Objetos configuráveis: peças tipo Lego, bola de pingue-pongue e bola de borracha; **não recolocar automaticamente** objetos.
- [D] Queijo é empurrado por baixo da porta **ao anoitecer**; rato aparece à noite, procura comida, explora, reage ao robô, mexe em objetos e pode vocalizar.
- [D] O robô pode despertar diante de estímulos fortes; estados de sono/vigília e seus mecanismos devem ser investigados e controlados.
- [D] Visão de referência: **80 × 60 por olho a 30 Hz**, com otimizações declaradas. Audição candidata: duas entradas e cóclea com **64 faixas a 48 kHz**.
- [A] Fidedignidade, simplificações ópticas/acústicas, clima, tempos e desempenho exigem validação, sem apresentar valores exploratórios como medições científicas gerais.

## 4. Regras de engenharia científica

1. Toda execução registra ID, objetivo, versão/commit, condições iniciais, parâmetros, sementes, fluxos aleatórios, relógio, entradas, intervenções, eventos e critérios de parada.
2. Separar **exploração contínua** de **campanha controlada pré-registrada**; não converter observação retrospectiva em confirmação.
3. Preservar dados brutos, resultados negativos, interrupções, mudanças de parâmetro e versões de algoritmos.
4. Auditoria de cada constituição de Upro/Uint: incidências, fontes, tempos, estados, operação Pcrt e resultado.
5. Separar correção computacional, suficiência funcional e validade representacional.
6. Controles positivos/negativos, ablações, contraexemplos, comparadores e testes de determinismo.
7. Motor, ambiente, sensores, observatório e análise desacoplados; nenhum rótulo semântico do observador entra no motor.
8. O relógio científico independe do renderizador; armazenamento, checkpoints e parada que falha fechada são requisitos de segurança e reprodutibilidade.
9. Sem novas regras ou simplificações sem origem, justificativa, equivalência, perdas e aprovação do responsável.
10. Toda execução que altere condições com possível preocupação ética segue o PPC/ADCIF antes de começar.

## 5. Campanhas e histórico

- **V1:** campanha pré-registrada negativa; preservar pré-registro e relatório em `docs/`.
- **V2:** motor exploratório posterior; resultados não são confirmação.
- **Terceira geração:** construir novos arquivos, contratos e testes, sem importar automaticamente V1/V2.
- **Foco atual:** a constituição **inicial** das primeiras Upro/Uint a partir de Utrd, pela Pcrt, sem Sdom preexistente. Confiança, consolidação, difusão, sono e outros mecanismos pertencem ao plano completo, mas não são o teste imediato.

## 6. Continuidade entre conversas

Ler, nesta ordem: [mapa de gerações](../PROJECT_GENERATIONS.md), [regras científicas](../docs/regras-cientificas-e-continuidade-2026-11-11.md), [arquitetura](ARQUITETURA-UNIDADES.md), [interface](INTERFACE-OBSERVATORIO.md), este documento, [PPC/ADCIF](PPC-ADCIF.md), [metodologia](../docs/program-methodology.md) e histórico relevante.

**Em aberto:** forma definitiva de execução ininterrupta e reinício após falha, políticas de armazenamento, retenção, auditoria, reprodutibilidade física, simulação de tempo, campanhas e envelopes de segurança. Não alegar implementação nem teste sem evidência verificável.

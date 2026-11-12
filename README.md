# EMERGENCE

> **Organização das três gerações:** consulte [PROJECT_GENERATIONS.md](PROJECT_GENERATIONS.md) antes de interpretar motores, protocolos ou resultados. A reescrita atual está em [research/](research/README.md); as tentativas v1 e v2 estão classificadas em [archive/](archive/README.md). **Os arquivos legados não serão migrados**; a terceira geração cria arquivos novos.

**Modelo experimental de relações emergentes, entidades ancoradas, constituição e evolução de redes**

Investigação experimental, dentro do programa CLEAR, de como um sistema pode constituir por si mesmo unidades, relações temporotopológicas e organizações derivadas a partir de incidências sensoriais, sem que essas distinções sejam programadas uma a uma.

> **Situação da pesquisa (novembro de 2026):** trabalho em andamento. Nada aqui demonstra ainda constituição autônoma de representações. A primeira campanha pré-registrada do motor constitutivo deu resultado **negativo**; o motor foi revisto (versão 2, exploratória, não pré-registrada) e o ambiente experimental está sendo refeito com um robô simulado.

## Interfaces no navegador

- [Motor constitutivo, parâmetros abertos](https://paulosince.github.io/emergence/constitutive.html): executa os motores (versão 2 por padrão; versão 1 para consulta da primeira campanha) em mundos simples de quedas e de mesa, com todos os parâmetros editáveis e as unidades nas coordenadas do próprio motor. Mudar qualquer valor torna a execução exploratória.
- [Sala Experimental](https://paulosince.github.io/emergence/): ambiente de 24 h com sol, janela, lâmpada e balanço térmico (primeira geração de mundos).
- [Projeção da sala em planta](https://paulosince.github.io/emergence/room.html) e [corpo físico mínimo de um eixo](https://paulosince.github.io/emergence/body.html) (primeira geração).

O robô simulado (MuJoCo) ainda não tem interface.

## Pergunta de pesquisa

Em que condições funcionais e informacionais um sistema constitui unidades, relações com tempos de percurso operacionais e organizações derivadas de constituições anteriores, sem pré-programar individualmente as distinções resultantes? A implementação não presume a resposta.

## Método

- **Modelo de referência:** o neurobiológico (não exclusivamente humano). Dele se extraem heurísticas e algoritmos, que são simplificados rumo a uma arquitetura agnóstica de substrato. Divergir só com simplificação justificada: mecanismo entendido, equivalência proposta e perdas declaradas. Ver [metodologia do programa](docs/program-methodology.md).
- **Três etapas obrigatórias:** pré-experimento (PDF com método NB completo, hipóteses, bibliografia e previsões), experimento (execução e desvios) e resultados (confronto adversarial). Ver [metodologia](docs/program-methodology.md) e [série toy-experiments](toy-experiments/README.md).
- **Pré-registro** com controles positivos e negativos, desvios registrados e parada que falha fechada.
- **Integridade:** nenhuma categoria ou representação pronta é entregue ao motor; identificadores dos canais são opacos; um nó guardado numa estrutura de dados não é, por si, uma representação demonstrada; cada regra indica se vem da literatura ou é proposta nossa.

## Onde estamos

1. **Motor constitutivo, versão 1** e **campanha pré-registrada** (rodada 1): negativa nos quatro critérios. Ver [pré-registro](docs/preregistration-v1.md) e [relatório](docs/campaign-motor-phase-report-1.md).
2. **Auditoria contra a CLEAR v43:** a maior parte do negativo veio de erros de implementação, não da teoria. Ver [reconferência](docs/clear-v43-reconciliation-v0.1.md).
3. **Motor constitutivo, versão 2** (exploratório): propagação como entidade, efeitos excitatórios e inibitórios somados, magnitude multiplicativa, ajustar antes de criar, fortalecimento por confirmação, inibição entre concorrentes, surpresa como disparo de unidade não esperada, sono por estados ativos da população. Ver [desenho](docs/engine-v2-design-proposal.md), [efeitos](docs/effects-v0.1.md) e [controles exploratórios](docs/v2-controls-exploratory-report.md).
4. **Robô simulado (em construção):** 40 cm, tronco cúbico, duas rodas com rodinhas de treino, braços que alcançam o próprio corpo, mãos de três dedos com tendões, pescoço, olhos móveis com câmeras, ouvidos com cóclea e pele no corpo inteiro. O equilíbrio é aprendido, não programado: há só um reflexo. Corpo já simulado; sala, sentidos, reflexos, um rato e a ligação com o domínio vêm a seguir. Ver [especificação do robô](docs/robot-spec-v1.md) e [ambiente](docs/environment-design-v0.md).

Decisões e vocabulário: [registro de decisões](docs/decisions-log.md), [nomenclatura](docs/nomenclature.md), [parâmetros](docs/parameters.md).

## Como executar

Requer **Node.js 20+**; módulos ES nativos, sem empacotador.

```sh
npm install
npm test                                            # todas as suítes
node scripts/run-constitutive.mjs --engine=v2 --world=quedas   # motor v2 num mundo de quedas
node scripts/run-constitutive.mjs --list            # parâmetros, valores, situação e fonte
node experiments/v2-controls.js                     # controles exploratórios do motor v2
```

## Estrutura

```text
src/engines/constitutive/  motores constitutivos (versão 1 e versão 2) e parâmetros
src/robot/body/            robô simulado (modelo MuJoCo, reflexo, rodinhas)
src/rhythm/  src/space/    marca-passos e relógio; espaço constitutivo e difusão
src/research/              critérios, estatística, reprodução de incidências
src/world/ src/sensory/ src/room/ src/body/   mundos da primeira geração
experiments/  scripts/     protocolos executáveis
tests/                     testes
docs/                      método, decisões, desenhos, relatórios
vendor/tempo/              cópia preservada do TEMPO (referência)
```

## TEMPO e procedência

[TEMPO](https://github.com/paulosince/temporotopological-relations) é a referência científica, **somente leitura**: este trabalho não altera seus arquivos, ramos ou histórico. A revisão fixada é [`206611e`](https://github.com/paulosince/temporotopological-relations/commit/206611ec5e453fa66a78ad3f5f1650c5892d0b6d); `vendor/tempo/` é uma cópia sem alterações, com atribuição. Ver [procedência](docs/provenance.md).

## Licença

MIT. Ver [LICENSE](LICENSE).

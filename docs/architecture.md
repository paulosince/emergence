# Architecture and contracts — foundation 0.1

## Boundaries

```text
Environment simulator -> transducer -> incidence stream
                                            |
                                            v
                                    experiment runner
                                            |
                          +-----------------+------------------+
                          |                                    |
                  TEMPO reference adapter                  Candidate engine(s)
                  (fixed initial nodes)                   (future research)
                          |                                    |
                          +-----------------+------------------+
                                            |
                                    observation/events
                                            |
                                 independent recorder
                                            |
                        +-------------------+-------------------+
                        |                                       |
                    IndexedDB (planned)                  CSV export (planned)
                        |
               read-only UI projection (planned)
```

Important: the environment's hidden ground truth must be accessible only to the **evaluator**, never to the learning engine.

## Preserved reference boundary

`vendor/tempo/core/` is a literal pinned copy. The adapter `src/tempo/reference-runner.js` uses public exports from `Net`, `makeRng` and TEMPO protocols without changing upstream semantics. The baseline is only about **relations among pre-existing nodes**. It **does not** constitute units.

## Planned engine contract (not an algorithm)

An experimental engine will expose operations with explicit responsibilities:
- `ingest(incidence)`: accept a time-identified transduced incidence.
- `advanceTo(simulatedTimeMs)`: process changes through a simulated timestamp.
- `snapshot()`: return an observation-only snapshot of structure and dynamic state.
- `drainEvents()`: expose the causal/operational event history since the last read.

No contract dictates **how** units are formed, whether organization is layered, or how learning rules work. Competing engines can implement the same experimental interface. Contract verification lives in `src/contracts/`.

The classic TEMPO baseline is deliberately **not** represented as a conforming incidence-driven engine until an adapter can specify how incidences enter it without covertly pre-labeling units.

## Timing contract

Distinguish:
1. physical time in the simulated environment,
2. sensor sampling and observation time,
3. arrival time of the transduced incidence,
4. propagation and traversal time as implemented by the engine,
5. browser frame time (never used to decide causal experimental events).

A visual packet traveling along an edge will reflect recorded traversal rather than determine it.

## Separation of responsibilities

- `vendor/tempo/`: frozen empirical reference.
- `src/contracts/`: schemas and validation, without learning rules.
- `src/tempo/`: reference invocation and result extraction.
- `src/research/`: canonical scientific metadata/CSV, never engine rules.
- `experiments/`: experiment protocols and reproducible execution.
- `tests/`: reference/golden and integration tests.
- Later: `src/sensory/`, `src/constitution/`, `src/runtime/`, `src/visualization/`, `src/persistence/`.

## Non-goals of foundation phase

No assertion that a learned cluster is a representation; no implementation of derived representations; no universal minimality proof; no IndexedDB or fMRI renderer yet. Those are subsequent, testable milestones.

## Implemented Phase 1 modules

~~~text
TraceEnvironment (hidden from the engine)
  └─ NumericTransducer (sample, quantify, delay)
      └─ EventScheduler (time + insertion order)
          └─ runExperiment
              ├─ trace + manifest (researcher side)
              └─ experiment engine (receives incidences only)
                  ├─ DiagnosticEngine (non-learning)
                  └─ TempoFixedNodesControl (predefined units)
~~~

The scheduler reuses TEMPO's unchanged EventHeap instead of reimplementing a heap. The control reuses unchanged Net and makeRng. There are no DOM, IndexedDB or network dependencies in the experimental runtime.

The engine interface can support future competing algorithms. Its existence **does not** prescribe any particular solution to sensor individuation or derived representation.

TEMPO's internal queue and the external sensor queue are separate; events from inside TEMPO can be collected after their effective event time. Phase 1 records both event time and collection time. See [Phase 1 protocol](phase1-protocol.md).

## Implemented item 3 — Physical world as independent research truth

~~~text
Experimenter condition: HOLD -> RELEASE
            |
            v
release-control.js (external constraint and intervention event)
            |
            v
vertical-impact.js (analytical gravity/contact/one-impact dynamics)
            |
            +----> stateAt(t): clearance, velocity, force, energy
            +----> eventsThrough(t): physical impact with timing and impulse
            |
            v
trajectory-verifier.js (independent invariants for researcher ONLY)
~~~

The physical truth is deliberately **not connected** to an incidence stream yet. Item 4 will implement sensory coupling to physical observables without passing object identity or world metadata to the learning engine. The current synthetic scalar transducers from item 2 remain as separate transport controls.

The model and its domain, limitations and validation methods are documented in [world-physics-v0.1.md](world-physics-v0.1.md).

## Etapa 4 — transdução de um mesmo mundo por modalidades independentes

~~~text
World analítico (verdade física; acessível ao pesquisador)
      |                              |
      v                              v
barreira óptica                 colisão calculada
(geometria da esfera)           (impulso normal)
      |                              |
transmissão de luz              placa: integral por janela
      |                              |
      +----------+-------------------+
                 |
            transdutores numéricos
          (tempo, quantum, ruído, latência)
                 |
          incidências sem rótulo causal
                 |
        motor experimental diagnóstico
                 |
           nenhum aprendizado
~~~

O acoplamento fica isolado em src/sensory/world-signals.js, enquanto src/sensory/world-scenario.js define quais modalidades e canais existem em cada experimento. Reutilizamos o mesmo executor e transdutores da Etapa 1; não duplicamos o motor temporal. São permitidos zero canais e validação do horizonte físico mesmo sem incidências.

A especificação física completa fica no manifesto **do pesquisador**, não no objeto entregue ao domínio experimental.

[Protocolo de transdução v0.1](world-sensing-v0.1.md).

## Etapa 5 — validação independente do instrumento

~~~text
Mundo 1D A             Mundo 1D B (somente controles de duas fontes)
   |                               |
Acoplamento A                  Acoplamento B
   |                               |
   +----- relógio temporal --------+
                 |
         transdutores separados
                 |
             incidências
                 |
       motor diagnóstico sem aprender

Pesquisador (sem acesso ao motor):
- auditor numérico da colisão por mundo;
- auditor de amostra → incidência → entrega;
- auditor de entrega → ingestão diagnóstica;
- manifesto com cada condição e origem física.
~~~

A simultaneidade no cenário duplo resulta de intervenção temporal do pesquisador. Os modelos físicos não trocam forças, objetos ou estados. O instrumento reconhece explicitamente o limite dessa noção de independência.

Ver [controles científicos v0.1](scientific-controls-v0.1.md).

## Etapa 6 — atuação, estado interno e acoplamentos multimodais

~~~text
Comando externo do pesquisador: ELEVAR, depois SOLTAR
                           |
                           v
          Trajetória e força motora de 1 eixo
                |                       |
         Mundo externo              Corpo interno
       esfera e contato        capacitor, corrente, calor
                |                       |
         sensores ópticos          potenciômetro
           e mecânicos         tensão, corrente, termômetro
                |                       |
                +---------+-------------+
                          |
                 incidências numéricas
                          |
               motor diagnóstico (0 unidades)
                          |
           inspetor visual só de leitura (beta)
~~~

O mundo é um sistema físico compartilhado no código, não um conjunto de sequências sensoriais arbitrárias. As equações, os limites e os testes adversariais estão em [body-world-v0.1.md](body-world-v0.1.md). A interface inicial apenas inspeciona estados e rastros reais; a representação dinâmica de uma malha constituída continua pendente.


## Etapa 7 — continuidade de estado real

~~~text
Mundo + sensores → relógio e fila → motor diagnóstico
         |              |                  |
      estado físico   eventos e RNGs     estado interno
         +--------------+------------------+
                        |
            checkpoint real versionado
                        |
               IndexedDB / ZIP
                        |
             restaurar → continuar
                        |
             comparação integral

Operação diferente: histórico gravado → visualização sem reexecutar.
~~~

Na Sala Experimental, o mundo é uma função determinística de condições e tempo. O checkpoint armazena as condições e o estado físico calculado, verificado ao restaurar. Mundo com memória mutável exigirá outro contrato de serialização; TEMPO com nós fixos não ganhou retomada nesta etapa. [Protocolo](replication-v0.1.md).

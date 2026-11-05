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

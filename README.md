# EMERGENCE

**Experimental Model of Emergent Relations, Grounded Entities, Network Constitution and Evolution**

Experimental investigation of autonomous temporotopological constitution, from sensory incidences to emergent units, relations, and derived structures.

> **Research status:** initial engineering baseline, **not** a demonstration of autonomous unit formation, grounding, or derived representations.

## Research question

Under which functional and informational conditions can a system constitute units, temporotopological relations with operational traversal times, and organizations derived from earlier constitutions—without individually preprogramming the resulting distinctions?

The experiment will test that question; its answer is not assumed in the implementation.

## Repositories and provenance

- **EMERGENCE** — this independent research codebase, licensed under the repository's LICENSE.
- [**TEMPO**](https://github.com/paulosince/temporotopological-relations) — **read-only scientific reference**. Its files, branches and history must not be modified by EMERGENCE work.
- The pinned TEMPO source revision is [`206611ec5e453fa66a78ad3f5f1650c5892d0b6d`](https://github.com/paulosince/temporotopological-relations/commit/206611ec5e453fa66a78ad3f5f1650c5892d0b6d).
- `vendor/tempo/` is an unchanged, attributed snapshot of its core, original experimental scripts, tests and outputs. See [source provenance](docs/provenance.md).

TEMPO has **fixed, pre-existing nodes** and initially **no links**. Its local rules create and modify directed relations, their weights and two latency segments. This is not yet autonomous constitution of nodes or representational content.

## Run without build tools

Requires **Node.js 20+** to execute tests; the research runtime uses native ES modules and does not require a bundler.

```sh
npm test                       # upstream TEMPO regression + EMERGENCE regression
npm run test:tempo            # the original TEMPO tests, unchanged
npm run baseline              # one reproducible TEMPO baseline case (JSON stdout)
```

## Architecture (foundation)

```text
vendor/tempo/     frozen local copies of source and results for comparison
src/tempo/        adapters that invoke the preserved reference
src/contracts/    neutral input and experiment interfaces, no algorithmic claims
src/research/     provenance and CSV serialization
experiments/      reproducible executable research protocols
tests/            integration, golden-result and contract tests
docs/             provenance, boundaries and programming roadmap
```

The planned simulator, sensory transducers, unit constitution, derived constitution, IndexedDB storage and fMRI-style visualization will be added as separate modules after the reference is reproduced. See [architecture and contracts](docs/architecture.md) and [roadmap](docs/roadmap.md).

## Scientific integrity

- No predetermined representation or category is to be passed as ground truth to the learning engine.
- Provenance, deterministic seeds and operational events must be auditable.
- A node/edge stored in a data structure is not by itself a demonstrated representation.
- Scientific reference source and empirical results remain distinguishable from new hypotheses.

## Phase 1: deterministic sensory runtime

Implemented in EMERGENCE:

- **src/runtime/**: independent simulation clock, TEMPO-heap-backed event scheduler, independently seeded sensor streams and experimental runner.
- **src/sensory/**: numerical signal environment, configurable scalar transducer and A/B/C reference scenario (100/37/11 ms).
- **src/engines/**: diagnostic non-learning control and explicit fixed-node TEMPO control (not emergent units).
- **experiments/phase1-inputs.js**: reproducible command-line experiment, full JSON output and preliminary CSV exports.
- **tests/runtime.test.js** and **tests/sensory.test.js**: order, timing, reproducibility, boundaries, transport, regression and controls.

~~~sh
npm run experiment:phase1
npm run experiment:phase1:json
npm run experiment:phase1:csv
npm run experiment:phase1:trace
npm run experiment:phase1:tempo
~~~

In the initial 220-ms simulated interval, 30 numerical samples are taken, 29 incidences arrive by the cutoff, and one is still in transit at 222 ms. The diagnostic control forms **zero new units**. See the [Phase 1 scientific protocol](docs/phase1-protocol.md).

**Not yet implemented:** autonomous unit constitution, derived representation, IndexedDB, complete import/export and interactive fMRI-style visualization.

## Step 3 — controlled analytic world (separate from learning)

A fixed plane and one rigid sphere are simulated in **one spatial dimension**.
Gravity, contact and an optional single idealized collision are defined by analytical
mechanics. This stage emits world states and physical events **only to the researcher**;
no sensory transducer or learning engine receives the true world state.

~~~sh
npm run experiment:world1d
npm run experiment:world1d:json > world-run.json
npm run experiment:world1d:csv > world-states.csv
npm run experiment:world1d:events > world-events.csv
~~~

The independent invariant verifier checks piecewise energy conservation, gravitational
acceleration, geometry, impulse and restitution. Fault-injection tests ensure known
errors are detected. Rebounds are supported up to—but **not including**—the second
impact; the model rejects execution outside its declared scope.

See [analytic world model and limitations](docs/world-physics-v0.1.md).

## Etapa 4 — acoplamento sensorial físico e modalidades selecionáveis

O mundo 1D de queda e impacto agora alimenta sensores por mecanismos físicos explícitos. Existem duas barreiras ópticas que medem transmissão luminosa geométrica e uma placa de contato que integra o impulso mecânico em janelas temporais. **Não representam visão complexa, audição, interocepção ou aprendizagem.**

~~~sh
npm run experiment:world-senses
npm run experiment:world-senses:json > physical-sensing.json
npm run experiment:world-senses:csv > incidences.csv
npm run experiment:world-senses:trace > event-trace.csv
npm run experiment:world-senses:optical
npm run experiment:world-senses:mechanical
npm run experiment:world-senses:none
~~~

Modificações de modalidade, período de amostragem, posição das barreiras, quantização ou latência alteram as incidências sem alterar a dinâmica física. O cenário padrão produz 11 incidências, incluindo alterações ópticas durante a descida e o ressalto.

[Modelo e critérios científicos da transdução](docs/world-sensing-v0.1.md).

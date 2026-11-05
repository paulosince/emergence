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

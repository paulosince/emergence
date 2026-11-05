# TEMPO reference provenance

TEMPO original repository: https://github.com/paulosince/temporotopological-relations

Pinned source revision: `206611ec5e453fa66a78ad3f5f1650c5892d0b6d` (2026-11-04).
Read-only upstream: **never push, commit, branch or edit in the TEMPO repository**.

The files below were copied into `vendor/tempo/` without content changes.
Blob SHA values come from GitHub at the pinned revision.

| Relative file | Original Git blob SHA |
| --- | --- |
| `core/net.js` | `6e98c0f105b7fc976461367db5dc5e3fb3dfe0e2` |
| `core/heap.js` | `9d129f4855141fdec445fa709d9a5876a48c342f` |
| `core/rng.js` | `9649d0ef35c38ac9347ab456c80c5207ed2f43ed` |
| `core/protocols.js` | `da8b7edf54128928ef41f9b708fef9d5c9dc885c` |
| `tests/core.test.js` | `3f7ad31980b97a7884bf590ec28dcddac5ee4248` |
| `experiments/predictions.js` | `6a4937f219a4a1737cac13f732d0a7bb4ff184f4` |
| `experiments/p1-chains.js` | `468c268c0520236f5baec44b1524ef0ab4f0cb9f` |
| `results/predictions.json` | `07742e00bc342c3058abd4117f38f516de1fcc71` |
| `results/p1-chains.json` | `599d70fc4c29af61ef501e822451f9040fb171c6` |

A checked-in copy is **not a new implementation**. Source code in `vendor/tempo/` is treated as frozen reference. Research changes and experiments belong outside this directory.

Reference results stored in `vendor/tempo/results/` are published outputs of the original project, not new EMERGENCE results. Fresh executions must identify their configuration and software revision.

The original core has:
- `net.js`: `Net(N, K, mode, eta, rng, params)`, fixed node count N, empty link set initially; event-driven directed graph; weight, `ta`, `td`; local plasticity, creation, pruning, consolidation.
- `heap.js`: deterministic ordering by `(time, sequence)`.
- `rng.js`: seeded pseudo-random source (mulberry32, uniform/normal/Poisson).
- `protocols.js`: training, probes for the five-item test, reverse-order and persistence experiments.
- `experiments/`: P1–P5 scripts; do not claim their reported results are independently replicated until verified.

## Executable scripts

The original `vendor/tempo/experiments/` scripts are preserved verbatim for audit, but running them directly writes result files under the frozen vendored snapshot. Use the new research runners outside `vendor/` for fresh executions instead; original scripts should be inspected, not used as the canonical way to record new EMERGENCE results.

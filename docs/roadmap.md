# Incremental research implementation plan

Only development in **paulosince/emergence**. TEMPO is read-only.

## Phase 0 — foundation (this commit)
- [x] Inspect `emergence` and pin TEMPO revision
- [x] Record source modules, dependencies and limitations
- [x] Copy reference source unchanged, including original tests and published outputs
- [x] Define experimental boundaries and contracts
- [x] Create baseline invocation, golden-result tests and CI
- [x] Verify the CI workflow green on GitHub ([run 42056023091](https://github.com/paulosince/emergence/actions/runs/42056023091))

## Phase 1 — experimental runtime
- [x] Simulated clock and stable time/sequence event ordering
- [x] Synthetic scalar sensory environment and transducers with explicit information boundaries (physical modalities remain future work)
- [x] Operational engine contract with diagnostic and fixed-node TEMPO controls (unit-formation candidates remain future work)
- [x] Deterministic seeds, run manifests, observable event traces

## Phase 2 — persistence and replication
- [ ] IndexedDB schema migrations, records, checkpoints and resumable state
- [ ] CSV event/structure/metric outputs with units and provenance
- [ ] ZIP exports + validation, independent replay versus re-execution
- [ ] Cross-browser and checkpoint determinism tests

## Phase 3 — visualization
- [ ] Zoom/pan fMRI-style network view, directed edges and ms labels
- [ ] Node shapes (new, developing, consolidated, pruning-candidate)
- [ ] Weight-scaled edge thickness and time-faithful traveling pulses
- [ ] Accessible rich legends and structural inspector
- [ ] Rendering never mutates research state

## Phase 4 — experimental constitution
- [ ] Candidate mechanisms for individuating units from transduced incidences
- [ ] TEMPO relation constitution with evolving units, preserving regressions
- [ ] Ablation and comparison to existing methods
- [ ] Identification limits and counterexample tests

## Phase 5 — derived constitution
- [ ] Tests whether constituted structures contribute causally to further structures
- [ ] Distinguish mere clustering, symbolic grouping and effective derived constitution
- [ ] Record successful and failed conditions, statistical robustness

All completed phase results must be reproducible from recorded data, code revision and inputs.

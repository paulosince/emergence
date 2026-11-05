
# Phase 1 — deterministic incidence pipeline

**Status:** implemented engineering foundation, not a demonstration of autonomous unit formation, representational grounding or scientific necessity/sufficiency.

## Scientific boundary

The evaluator specifies physical signal traces and sensor parameters. The research engine receives *only incidences*, through ingest(), each with these fields:

| Field | Operational meaning |
| --- | --- |
| incidenceId | Identifier of a transduction occurrence, not an object identity |
| transducerId | Afferent channel identifier, not a semantic label |
| measurement | Numeric scalar measurement |
| observedAtMs | Time at which the environment was sampled |
| arrivedAtMs | Time at which the incidence became available to the engine |

The physical environment and its full trace remain available in the **researcher-only manifest** and are never passed to the engine. The engine can advance its simulated time without receiving the environment itself.

The current laboratory signals are piecewise-constant scalar traces, **not physiological models** of audition, vision or touch. No environmental object categories, entity identities or correct representations are provided to the engine.

## The initial scenario

**Scenario identifier:** phase1-synthetic-scalar-v1. Run seed: 42. Window: 0–220 simulated milliseconds, inclusive.

| Sensor | Signal channel | Sampling period | Delivery delay | Physical signal changes |
| --- | --- | ---: | ---: | --- |
| A | x | 100 ms | 4 ms | 55, 150 ms |
| B | y | 37 ms | 7 ms | 61, 170 ms |
| C | z | 11 ms | 2 ms | 33, 121 ms |

There is no quantization or noise, and each sample emits an incidence.

**Expected observations:** A takes 3 samples (0, 100, 200 ms); B takes 6 (0, 37, 74, 111, 148, 185 ms); C takes 21 (0 through 220 ms). There are 30 samples and emitted incidences; 29 arrive by 220 ms. The last C incidence is observed at 220 ms and becomes available at 222 ms, so it remains pending.

## Timing, trace and reproducibility

1. The runtime advances a monotonic simulated clock, never a browser clock.
2. Scheduled events use the pinned TEMPO min-heap ordered by simulated time and insertion sequence.
3. The engine processes previously scheduled internal events through the current time before each external sample or delivery.
4. Sensor ticks are calculated from phase + sampleIndex × period, avoiding cumulative addition drift.
5. When an emitted incidence is delivered, its record precedes the engine response in the collected trace.
6. An internal TEMPO event may occur before the moment it is collected by the outer runtime. Such records include both **timeMs (actual internal event time)** and **recordedAtMs (collection time)**. The trace field **order** represents collection order, not necessarily chronological event time.
7. Emitted sensor samples and delivered incidences have the same incidenceId for causal tracing.
8. Unrelated sensor streams use separately derived seeded random sequences. Adding a sensor cannot alter another sensor's Gaussian noise sequence.

The transducer supports sample interval, phase, delivery delay, optional measurement quantum, optional Gaussian noise and two policies: **all samples** or **changes exceeding minDelta from the last emitted value**. These are sensor parameters, not emergent learned properties.

## Control engines

**DiagnosticEngine:** accepts numerical incidences and records receipt; creates no units and no relations.

**TempoFixedNodesControl:** activates pre-existing TEMPO nodes via an explicit sensor-to-node mapping. It ignores measurement magnitude by design and declares this in its metadata. It is **not evidence** of autonomous unit formation. Its purpose is to verify connection to the preserved TEMPO mechanisms.

Both use an operational interface: ingest(), advanceTo(), snapshot(), drainEvents(). The interface prescribes no algorithms for emerging units, relations or higher-order structures.

## Executing reproducible tests and smoke experiments

Node.js >=20, no installation or build tools required.

~~~sh
npm test
npm run experiment:phase1
npm run experiment:phase1:json > run.json
npm run experiment:phase1:csv > incidences.csv
npm run experiment:phase1:trace > trace.csv
npm run experiment:phase1:tempo
~~~

The CSV outputs are **preliminary**, not yet the complete versioned ZIP package with import, checkpoints and manifest validation. For the full recorded trace and research configuration, use the JSON output.

## How to replicate

Check out the exact EMERGENCE revision; run tests; execute the same scenario and seed; compare manifest, incidence list, trace and final state. Change any parameter only as a separate experimental run. Use the fixed-node TEMPO control only under its documented assumptions. Do not infer semantic representation from graph structure or predictivity alone.

## Limitations of Phase 1

- Batch synchronous processing; no pause/resume or checkpoint.
- Synthetic scalar inputs, not a validated multimodal physical simulator.
- No hypotheses about individuation have been implemented.
- No IndexedDB or fMRI-like visual interface yet.
- No full schema-validated research archive yet.

## Software provenance

The JSON manifest records the TEMPO reference commit, the EMERGENCE version and an optional EMERGENCE Git revision. The command-line runner obtains the revision from GITHUB_SHA when set or from the locally checked-out Git commit. If the user executes a source ZIP without Git metadata, the revision is **null** rather than an invented commit.

The fixed-node TEMPO control manifest also records nodeCount, seed, K, mode, eta and the explicit channel-to-node mapping. Reproducibility requires keeping the **software revision, seed and control parameters** together with the environmental signal description and sensor settings.

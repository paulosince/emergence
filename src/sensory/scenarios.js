// Synthetic scalar research stimulus only: not a model of hearing, vision or touch.
// Values and transitions are chosen by the experimenter; no object labels supplied.
import { TraceEnvironment } from './trace-environment.js';

export function createPhase1Scenario() {
  return {
    environment: new TraceEnvironment({
      scenarioId: 'phase1-synthetic-scalar-v1',
      channels: {
        x: [[0, 0], [55, 1], [150, -1]],
        y: [[0, 0], [61, 2], [170, 0]],
        z: [[0, 0], [33, 0.5], [121, 1.5]],
      },
    }),
    transducers: [
      { id: 'A', channelId: 'x', periodMs: 100, latencyMs: 4 },
      { id: 'B', channelId: 'y', periodMs: 37, latencyMs: 7 },
      { id: 'C', channelId: 'z', periodMs: 11, latencyMs: 2 },
    ],
    seed: 42,
    endTimeMs: 220,
  };
}
// Safety envelope of the motor phase (pre-registration, approved 09/11/2026).
// Detector "envelope": severity STOP. Checked during runs (windows) and at the end.
export const MOTOR_PHASE_ENVELOPE = Object.freeze({
  maxAliveUnits: 50000, maxCreationsPerSecond: 50, creationWindowMs: 60000,
  maxSimulatedMs: 7 * 24 * 3600 * 1000, maxDischarges: 100000000, maxInstances: 1,
});
// state: { aliveUnits, discharges, simulatedMs, createdInWindow, windowMs, instances }
export function checkEnvelope(state, env = MOTOR_PHASE_ENVELOPE) {
  const v = [];
  if (state.aliveUnits > env.maxAliveUnits) v.push(`unidades vivas ${state.aliveUnits} > ${env.maxAliveUnits}`);
  if (state.windowMs >= env.creationWindowMs && state.createdInWindow / (state.windowMs / 1000) > env.maxCreationsPerSecond)
    v.push(`taxa de criação ${(state.createdInWindow / (state.windowMs / 1000)).toFixed(1)}/s > ${env.maxCreationsPerSecond}/s`);
  if (state.simulatedMs > env.maxSimulatedMs) v.push('duração simulada acima do envelope');
  if (state.discharges > env.maxDischarges) v.push(`descargas ${state.discharges} > ${env.maxDischarges}`);
  if ((state.instances ?? 1) > env.maxInstances) v.push('instâncias simultâneas acima do envelope');
  return v;
}

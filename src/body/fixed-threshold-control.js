// NONLEARNING fixed control law. This is an explicit experimental comparator,
// not autonomous representational action: a hard-coded voltage threshold
// determines whether a pre-specified lift is executed at its start time.
import { createActuatedWorld } from './actuated-world.js';

export function createFixedThresholdBodyWorld({
  thresholdVoltageV = 9.95,
  worldOptions = {},
} = {}) {
  if (!Number.isFinite(thresholdVoltageV) || thresholdVoltageV <= 0 ||
      thresholdVoltageV > 10000) {
    throw new RangeError('Fixed controller threshold must be finite and positive');
  }
  if (!worldOptions || typeof worldOptions !== 'object' ||
      Array.isArray(worldOptions)) {
    throw new TypeError('worldOptions must be a parameter record');
  }

  // The controller operates on a sampled *physical* initial capacitor
  // voltage, not an interpretation or an experimenter-selected outcome.
  const prospective = createActuatedWorld(worldOptions);
  const p = prospective.describe().bodyParameters;
  const measuredVoltageV = prospective.bodyStateAt(0).capacitorVoltageV;
  const permitted = measuredVoltageV >= thresholdVoltageV;
  const physical = permitted ? prospective
    : createActuatedWorld({ ...worldOptions, liftHeightM: 0 });
  const decisionAtMs = p.startAtMs;

  const decisionEvent = Object.freeze({
    eventId: 'fixed-voltage-decision-1',
    type: 'control.fixed-voltage-threshold',
    timeMs: decisionAtMs,
    controlOrigin: 'programmed-fixed-rule',
    measuredVoltageV,
    thresholdVoltageV,
    action: permitted ? 'lift' : 'hold',
  });

  function eventsThrough(timeMs) {
    const events = physical.eventsThrough(timeMs); // validates horizon
    return Object.freeze(events.map(event =>
      event.type === 'intervention.motor-command' ? decisionEvent
      : event.type === 'intervention.release'
        ? Object.freeze({ ...event, imposedBy: 'programmed-fixed-rule' })
        : event));
  }
  function describe() {
    const description = physical.describe();
    return Object.freeze({
      ...description,
      intervention: Object.freeze({
        ...description.intervention,
        controller: 'programmed-fixed-voltage-threshold-v1',
        autonomouslyInitiated: false,
        measuredVoltageV,
        thresholdVoltageV,
        requestedLiftHeightM: p.liftHeightM,
        permittedLift: permitted,
      }),
    });
  }

  return Object.freeze({
    stateAt: timeMs => physical.stateAt(timeMs),
    bodyStateAt: timeMs => physical.bodyStateAt(timeMs),
    eventsThrough, describe,
  });
}
// Bounded, analytically solvable one-axis body/world coupling.
// Externally scheduled motor lifts one rigid sphere, then releases it.
// Capacitor discharge and motor heat follow mechanical work; no autonomy
// or physiology is claimed.
import { createVerticalImpactWorld } from '../world/vertical-impact.js';

export const ACTUATED_WORLD_ID = 'analytic-actuated-sphere-plane';
export const ACTUATED_WORLD_VERSION = '0.1.0';

function inRange(name, value, lower, upper, strictLower = false) {
  if (!Number.isFinite(value) ||
      (strictLower ? value <= lower : value < lower) || value > upper) {
    throw new RangeError(name + ' outside supported bounded physical range');
  }
}

export function createActuatedWorld({
  initialClearanceM = 1,
  liftHeightM = 0.2,
  startAtMs = 100,
  liftDurationMs = 800,
  gravityMps2 = 9.81,
  massKg = 1,
  radiusM = 0.05,
  restitution = 0.5,
  motorEfficiency = 0.8,
  initialCapacitorEnergyJ = 100,
  capacitanceF = 2,
  initialTemperatureK = 295,
  thermalCapacityJPerK = 20,
} = {}) {
  inRange('initialClearanceM', initialClearanceM, 0, 1000);
  inRange('liftHeightM', liftHeightM, 0, 5);
  inRange('startAtMs', startAtMs, 0, 1e7);
  inRange('liftDurationMs', liftDurationMs, 10, 1e6, true);
  inRange('gravityMps2', gravityMps2, 0, 100);
  inRange('massKg', massKg, 0, 1000, true);
  inRange('radiusM', radiusM, 0, 100, true);
  inRange('restitution', restitution, 0, 1);
  inRange('motorEfficiency', motorEfficiency, 0, 1, true);
  inRange('initialCapacitorEnergyJ', initialCapacitorEnergyJ, 0, 1e8, true);
  inRange('capacitanceF', capacitanceF, 0, 1e6, true);
  inRange('initialTemperatureK', initialTemperatureK, 0, 1e4, true);
  inRange('thermalCapacityJPerK', thermalCapacityJPerK, 0, 1e7, true);

  const durationS = liftDurationMs / 1000;
  const releaseAtMs = startAtMs + liftDurationMs;
  if (releaseAtMs > 1e12) throw new RangeError('Release exceeds simulation time');
  // With a unilateral upward-contact actuator, motor force must not reverse.
  const decelerationBound = 6 * liftHeightM / (durationS * durationS);
  if (liftHeightM > 0 && gravityMps2 + 1e-12 < decelerationBound) {
    throw new RangeError('Lift requires a tensile/gripping actuator outside declared contact model');
  }
  const totalMechanicalWorkJ = massKg * gravityMps2 * liftHeightM;
  const totalElectricalCostJ = totalMechanicalWorkJ / motorEfficiency;
  if (totalElectricalCostJ >= initialCapacitorEnergyJ) {
    throw new RangeError('Capacitor has insufficient energy for prescribed lift');
  }

  const dynamics = createVerticalImpactWorld({
    clearanceM: initialClearanceM + liftHeightM,
    initialVelocityMps: 0, gravityMps2, massKg, radiusM, restitution,
  });
  const physicalDescription = dynamics.describe();
  const parameters = Object.freeze({
    initialClearanceM, liftHeightM, startAtMs, liftDurationMs,
    gravityMps2, massKg, radiusM, restitution, motorEfficiency,
    initialCapacitorEnergyJ, capacitanceF, initialTemperatureK,
    thermalCapacityJPerK,
  });

  function checkTime(timeMs) {
    if (!Number.isFinite(timeMs) || timeMs < 0 || timeMs > 1e12) {
      throw new RangeError('timeMs outside supported range');
    }
    if (timeMs >= releaseAtMs) dynamics.stateAt(timeMs - releaseAtMs);
  }
  function bodyStateAt(timeMs) {
    checkTime(timeMs);
    const engaged = timeMs >= startAtMs && timeMs < releaseAtMs;
    const completed = timeMs >= releaseAtMs;
    let extension = 0, speed = 0, acceleration = 0;
    if (engaged) {
      const u = (timeMs - startAtMs) / liftDurationMs;
      extension = liftHeightM * (3 * u * u - 2 * u * u * u);
      speed = (liftHeightM / durationS) * (6 * u - 6 * u * u);
      acceleration = (liftHeightM / (durationS * durationS)) * (6 - 12 * u);
    } else if (completed) {
      extension = liftHeightM;
    }
    // The integral of F.dy for F=m(g+a) is mg*extension + delta-K.
    // It is nondecreasing when F>=0 and the lift is upward.
    const mechanicalWorkJ = massKg * gravityMps2 * extension +
      0.5 * massKg * speed * speed;
    const electricalEnergyUsedJ = mechanicalWorkJ / motorEfficiency;
    const capacitorEnergyJ = initialCapacitorEnergyJ - electricalEnergyUsedJ;
    const heatGeneratedJ = electricalEnergyUsedJ - mechanicalWorkJ;
    if (!Number.isFinite(capacitorEnergyJ) || capacitorEnergyJ <= 0) {
      throw new RangeError('Nonphysical energy state');
    }
    const capacitorVoltageV = Math.sqrt(2 * capacitorEnergyJ / capacitanceF);
    const motorForceN = engaged ? massKg * (gravityMps2 + acceleration) : 0;
    const motorMechanicalPowerW = engaged ? motorForceN * speed : 0;
    const electricalPowerW = motorMechanicalPowerW / motorEfficiency;
    const motorCurrentA = electricalPowerW / capacitorVoltageV;
    return Object.freeze({
      timeMs,
      phase: engaged ? 'lifting' : completed ? 'locked-after-release' : 'locked-before-lift',
      jointExtensionM: extension,
      jointVelocityMps: speed,
      jointAccelerationMps2: acceleration,
      motorForceN,
      motorMechanicalPowerW,
      electricalPowerW,
      motorCurrentA,
      mechanicalWorkJ,
      electricalEnergyUsedJ,
      capacitorEnergyJ,
      capacitorVoltageV,
      heatGeneratedJ,
      internalTemperatureK: initialTemperatureK +
        heatGeneratedJ / thermalCapacityJPerK,
    });
  }

  function stateAt(timeMs) {
    checkTime(timeMs);
    if (timeMs >= releaseAtMs) {
      return Object.freeze({
        ...dynamics.stateAt(timeMs - releaseAtMs),
        timeMs, supportForceN: 0,
      });
    }
    const body = bodyStateAt(timeMs);
    const clearanceM = initialClearanceM + body.jointExtensionM;
    const lifting = body.phase === 'lifting';
    return Object.freeze({
      timeMs, phase: lifting ? 'actuated-lift' : 'held',
      clearanceM, centerHeightM: clearanceM + radiusM,
      verticalVelocityMps: body.jointVelocityMps,
      verticalAccelerationMps2: body.jointAccelerationMps2,
      normalForceN: 0,
      supportForceN: lifting ? body.motorForceN : massKg * gravityMps2,
      kineticEnergyJ: 0.5 * massKg * body.jointVelocityMps ** 2,
      potentialEnergyJ: massKg * gravityMps2 * clearanceM,
    });
  }

  const actionEvent = Object.freeze({
    type: 'intervention.motor-command',
    eventId: 'motor-command-1',
    timeMs: startAtMs, imposedBy: 'experimenter',
  });
  const releaseEvent = Object.freeze({
    type: 'intervention.release',
    eventId: 'motor-release-1',
    timeMs: releaseAtMs, imposedBy: 'experimenter',
  });

  function eventsThrough(timeMs) {
    checkTime(timeMs);
    return Object.freeze([
      ...(timeMs >= startAtMs ? [actionEvent] : []),
      ...(timeMs >= releaseAtMs ? [releaseEvent] : []),
      ...(timeMs >= releaseAtMs
        ? dynamics.eventsThrough(timeMs - releaseAtMs).map(event =>
          Object.freeze({ ...event, timeMs: event.timeMs + releaseAtMs }))
        : []),
    ]);
  }

  function describe() {
    return Object.freeze({
      modelId: ACTUATED_WORLD_ID,
      modelVersion: ACTUATED_WORLD_VERSION,
      coordinate: 'upwards-positive',
      parameters: physicalDescription.parameters,
      bodyParameters: parameters,
      intervention: Object.freeze({
        controller: 'experimenter', autonomouslyInitiated: false,
        startAtMs, liftDurationMs, releaseAtMs,
      }),
      impactTimeMs: physicalDescription.impactTimeMs === null ? null
        : releaseAtMs + physicalDescription.impactTimeMs,
      secondImpactTimeMs: physicalDescription.secondImpactTimeMs === null ? null
        : releaseAtMs + physicalDescription.secondImpactTimeMs,
      modelScope: 'one-axis smoothstep lift, ideal capacitor, no regeneration, single collision',
    });
  }

  return Object.freeze({ describe, stateAt, bodyStateAt, eventsThrough });
}
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createFixedThresholdBodyWorld } from '../src/body/fixed-threshold-control.js';
import { createBodyScenario } from '../src/body/body-scenario.js';
import { createActuatedWorld } from '../src/body/actuated-world.js';
import { auditBodyEnergy } from '../src/research/body-energy-audit.js';
import { auditFirstImpact } from '../src/research/numeric-fall-oracle.js';
import { runExperiment } from '../src/runtime/experiment-runner.js';
import { DiagnosticEngine } from '../src/engines/diagnostic-engine.js';

test('fixed controller applies an OPERATIONAL voltage test to allow a lift', () => {
  const rule = createFixedThresholdBodyWorld({ thresholdVoltageV: 9.95 });
  const info = rule.describe();
  assert.equal(info.intervention.controller,
    'programmed-fixed-voltage-threshold-v1');
  assert.equal(info.intervention.autonomouslyInitiated, false);
  assert.equal(info.intervention.permittedLift, true);
  assert.equal(info.intervention.measuredVoltageV, 10);
  assert.ok(rule.bodyStateAt(500).jointExtensionM > 0);
  assert.ok(rule.bodyStateAt(900).capacitorEnergyJ < 100);
  const decision = rule.eventsThrough(100)[0];
  assert.equal(decision.type, 'control.fixed-voltage-threshold');
  assert.equal(decision.controlOrigin, 'programmed-fixed-rule');
  assert.equal(decision.action, 'lift');
  assert.equal(auditBodyEnergy(rule).passed, true);
  assert.equal(auditFirstImpact(rule).passed, true);
});

test('raising threshold inhibits action, without changing the intended command time', () => {
  const allowed = createFixedThresholdBodyWorld({ thresholdVoltageV: 9.95 });
  const blocked = createFixedThresholdBodyWorld({ thresholdVoltageV: 10.05 });
  assert.equal(blocked.describe().intervention.permittedLift, false);
  assert.equal(blocked.eventsThrough(100)[0].action, 'hold');
  assert.equal(blocked.describe().intervention.releaseAtMs,
    allowed.describe().intervention.releaseAtMs);
  assert.equal(blocked.bodyStateAt(900).jointExtensionM, 0);
  assert.equal(blocked.bodyStateAt(900).capacitorEnergyJ, 100);
  assert.equal(blocked.bodyStateAt(900).internalTemperatureK, 295);
  assert.ok(blocked.describe().impactTimeMs < allowed.describe().impactTimeMs);
  assert.equal(auditBodyEnergy(blocked).passed, true);
  assert.equal(auditFirstImpact(blocked).passed, true);
});

test('fixed gate can suppress a requested lift even with insufficient capacitor energy', () => {
  const blocked = createFixedThresholdBodyWorld({
    thresholdVoltageV: 9.95,
    worldOptions: { initialCapacitorEnergyJ: 1, liftHeightM: 0.2 },
  });
  assert.equal(blocked.describe().intervention.permittedLift, false);
  assert.equal(blocked.bodyStateAt(900).capacitorEnergyJ, 1);
  assert.equal(blocked.bodyStateAt(900).mechanicalWorkJ, 0);
});

test('a fixed-rule comparator and a researcher command are not treated as autonomous', () => {
  const external = createActuatedWorld();
  const fixed = createFixedThresholdBodyWorld({ thresholdVoltageV: 9.95 });
  assert.equal(external.eventsThrough(100)[0].imposedBy, 'experimenter');
  assert.equal(fixed.eventsThrough(100)[0].controlOrigin,
    'programmed-fixed-rule');
  assert.equal(fixed.describe().intervention.autonomouslyInitiated, false);
  assert.equal(external.describe().intervention.autonomouslyInitiated, false);
  assert.deepEqual(fixed.stateAt(500), external.stateAt(500));
});

test('selecting fixed control changes physical outcomes but never incidence schema', () => {
  const common = { modalities: ['interoceptive', 'proprioceptive'] };
  const high = runExperiment({
    ...createBodyScenario({
      ...common, controlMode: 'fixed-voltage-gate',
      thresholdVoltageV: 9.95,
    }),
    engine: new DiagnosticEngine(),
  });
  const low = runExperiment({
    ...createBodyScenario({
      ...common, controlMode: 'fixed-voltage-gate',
      thresholdVoltageV: 10.05,
    }),
    engine: new DiagnosticEngine(),
  });
  assert.equal(high.manifest.environment.world.intervention.permittedLift, true);
  assert.equal(low.manifest.environment.world.intervention.permittedLift, false);
  assert.ok(high.incidences.some(x => x.transducerId === 's6' &&
    x.measurement > 0));
  assert.ok(low.incidences.every(x =>
    x.transducerId !== 's6' || x.measurement === 0));
  assert.ok(high.incidences.every(x =>
    Object.keys(x).every(k => [
      'incidenceId', 'transducerId', 'observedAtMs', 'arrivedAtMs', 'measurement',
    ].includes(k))));
});

test('fixed control parameters reject unsupported or invalid controls', () => {
  assert.throws(() => createFixedThresholdBodyWorld({ thresholdVoltageV: -1 }),
    RangeError);
  assert.throws(() => createBodyScenario({ controlMode: 'autonomous' }),
    /control mode/);
  assert.throws(() => createFixedThresholdBodyWorld({
    thresholdVoltageV: 9.95,
    worldOptions: { liftHeightM: -1 },
  }), RangeError);
});

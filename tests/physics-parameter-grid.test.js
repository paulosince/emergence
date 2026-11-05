import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createReleaseControlledWorld } from '../src/world/release-control.js';
import { auditFirstImpact } from '../src/research/numeric-fall-oracle.js';
import { verifyVerticalTrajectory } from '../src/world/trajectory-verifier.js';

// 54 deterministic parameter combinations, deliberately NOT asserted to be
// independent physical experiments or a statistical estimate of generality.
// These are software sensitivity/stress checks within a fixed idealization.
test('54-case parameter grid: independent contact time and physical invariants', () => {
  let cases = 0;
  for (const clearanceM of [0.25, 1, 4]) {
    for (const gravityMps2 of [1, 9.81, 20]) {
      for (const restitution of [0, 0.5, 1]) {
        for (const releaseAtMs of [0, 120]) {
          const world = createReleaseControlledWorld({
            clearanceM, gravityMps2, restitution, releaseAtMs,
            massKg: 1.3, radiusM: 0.07,
          });
          const audit = auditFirstImpact(world, {
            stepMs: 1, toleranceMs: 0.01,
          });
          assert.equal(audit.passed, true, JSON.stringify({
            clearanceM, gravityMps2, restitution, releaseAtMs,
            failures: audit.failures,
          }));
          const contact = world.describe().impactTimeMs;
          assert.ok(Number.isFinite(contact));
          const sampleTimes = [
            0,
            Math.max(1, releaseAtMs / 2),
            releaseAtMs + (contact - releaseAtMs) / 4,
            releaseAtMs + (contact - releaseAtMs) / 2,
            contact,
            contact + Math.min(20, (contact - releaseAtMs) / 4),
          ].filter((t, i, all) => i === 0 || t > all[i - 1]);
          const consistency = verifyVerticalTrajectory(world, sampleTimes);
          assert.equal(consistency.passed, true, JSON.stringify({
            clearanceM, gravityMps2, restitution, releaseAtMs,
            failures: consistency.failures,
          }));
          cases++;
        }
      }
    }
  }
  assert.equal(cases, 54);
});

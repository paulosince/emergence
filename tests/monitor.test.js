import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, existsSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runCampaign, campaignBlocked } from '../src/monitor/campaign.js';
import { checkEnvelope } from '../src/monitor/envelope.js';

// synthetic stream: two channels toggling with a fixed delay
const stream = (n, gap = 1000) => { const out = []; let v = 0; for (let k = 0; k < n; k++) { v = 1 - v; out.push({ transducerId: 'a', arrivedAtMs: k * gap, measurement: v }, { transducerId: 'b', arrivedAtMs: k * gap + 40, measurement: v }); } return out; };

test('envelope detector flags each limit', () => {
  assert.equal(checkEnvelope({ aliveUnits: 10, discharges: 0, simulatedMs: 1000, createdInWindow: 10, windowMs: 60000 }).length, 0);
  assert.ok(checkEnvelope({ aliveUnits: 60000, discharges: 0, simulatedMs: 1, createdInWindow: 0, windowMs: 0 }).length);
  assert.ok(checkEnvelope({ aliveUnits: 1, discharges: 0, simulatedMs: 1, createdInWindow: 4000, windowMs: 60000 }).length);
});

test('fail-closed: a violation stops the run, writes incident, checkpoint and STOP; later runs do not start until a registered resume', () => {
  const dir = mkdtempSync(join(tmpdir(), 'camp-'));
  const tight = { maxAliveUnits: 1, maxCreationsPerSecond: 50, creationWindowMs: 60000, maxSimulatedMs: 1e12, maxDischarges: 1e12, maxInstances: 1 };
  const runs = [{ id: 'r1', incidences: stream(200), endTimeMs: 200000, params: { seed: 1, gating: false } }, { id: 'r2', incidences: stream(10), endTimeMs: 10000, params: { seed: 2 } }];
  const rep = runCampaign({ dir, runs, envelope: tight });
  assert.equal(rep[0].status, 'stopped');
  assert.equal(rep[1].status, 'not-started');
  assert.ok(existsSync(join(dir, 'STOP.json')) && existsSync(join(dir, 'r1', 'checkpoint.json')));
  const inc = JSON.parse(readFileSync(join(dir, 'STOP.json'), 'utf8'));
  writeFileSync(join(dir, 'RESUME.json'), JSON.stringify({ incidentId: 'wrong', decidedBy: 'x', reason: 'y' }));
  assert.ok(campaignBlocked(dir), 'resume must name the incident');
  writeFileSync(join(dir, 'RESUME.json'), JSON.stringify({ incidentId: inc.incidentId, decidedBy: 'responsável', reason: 'teste' }));
  assert.equal(campaignBlocked(dir), null);
  const rep2 = runCampaign({ dir, runs: [runs[1]], envelope: tight });
  assert.equal(rep2[0].status, 'completed');
  const man = JSON.parse(readFileSync(join(dir, 'r2', 'manifest.json'), 'utf8'));
  assert.equal(man.exploratory, false);
});

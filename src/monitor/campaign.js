// Headless campaign runner with fail-closed stop (research design, section
// "monitoramento contínuo"; decisions A+B, fail-closed). Node only.
//   * A STOP file in the campaign directory blocks every new run until a
//     human-registered resume decision exists (RESUME file naming the incident).
//   * During each run the envelope detector is checked on 60 s windows; a
//     violation stops the run, writes the incident, a checkpoint and the STOP file.
//   * Every run writes an evidence package: manifest (parameters, seeds,
//     exploratory flag, code version if given), results, detector outputs.
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ConstitutiveEngine } from '../engines/constitutive/engine.js';
import { checkOverrides } from '../engines/constitutive/parameters.js';
import { checkEnvelope, MOTOR_PHASE_ENVELOPE } from './envelope.js';

export function campaignBlocked(dir) {
  const stop = join(dir, 'STOP.json');
  if (!existsSync(stop)) return null;
  const incident = JSON.parse(readFileSync(stop, 'utf8'));
  const resume = join(dir, 'RESUME.json');
  if (existsSync(resume)) {
    const r = JSON.parse(readFileSync(resume, 'utf8'));
    if (r.incidentId === incident.incidentId && typeof r.decidedBy === 'string' && typeof r.reason === 'string') return null;
  }
  return incident;
}

// runs: [{ id, incidences (sorted), endTimeMs, params }]
export function runCampaign({ dir, runs, envelope = MOTOR_PHASE_ENVELOPE, codeVersion = null, now = () => new Date().toISOString() }) {
  mkdirSync(dir, { recursive: true });
  const report = [];
  for (const run of runs) {
    const blocked = campaignBlocked(dir);
    if (blocked) { report.push({ id: run.id, status: 'not-started', reason: 'STOP ativo: ' + blocked.incidentId }); continue; }
    const check = checkOverrides(run.params ?? {});
    const engine = new ConstitutiveEngine(run.params ?? {});
    const counts = { created: 0, discharges: 0, windowStart: 0, createdInWindow: 0 };
    let incident = null;
    for (const i of run.incidences) {
      if (i.arrivedAtMs > run.endTimeMs) break;
      engine.advanceTo(i.arrivedAtMs); engine.ingest(i); engine.advanceTo(i.arrivedAtMs);
      for (const ev of engine.drainEvents()) {
        if (ev.type === 'unit.created') { counts.created++; counts.createdInWindow++; }
        else if (ev.type === 'unit.discharge') counts.discharges++;
      }
      const windowMs = i.arrivedAtMs - counts.windowStart;
      if (windowMs >= envelope.creationWindowMs) {
        const v = checkEnvelope({ aliveUnits: engine.snapshot().units.length, discharges: counts.discharges, simulatedMs: i.arrivedAtMs,
          createdInWindow: counts.createdInWindow, windowMs, instances: 1 }, envelope);
        if (v.length) {
          incident = { incidentId: `${run.id}@${i.arrivedAtMs}`, runId: run.id, timeMs: i.arrivedAtMs, detector: 'envelope', severity: 'PARAR', violations: v, at: now() };
          break;
        }
        counts.windowStart = i.arrivedAtMs; counts.createdInWindow = 0;
      }
    }
    const runDir = join(dir, run.id); mkdirSync(runDir, { recursive: true });
    const snap = engine.snapshot();
    const origin = snap.units.every(u => Array.isArray(u.elements) && u.elements.length && u.origin?.cause);
    writeFileSync(join(runDir, 'manifest.json'), JSON.stringify({ id: run.id, at: now(), codeVersion, envelope, params: engine.describe().parameters,
      changedFromPreregistration: check.changed, exploratory: check.exploratory, endTimeMs: run.endTimeMs, incidences: run.incidences.length }, null, 2));
    const result = { id: run.id, status: incident ? 'stopped' : 'completed', created: counts.created, aliveUnits: snap.units.length, discharges: counts.discharges,
      detectors: { envelope: incident ? 'PARAR' : 'ok', origemRegistrada: origin ? 'ok' : 'FALHA' } };
    writeFileSync(join(runDir, 'result.json'), JSON.stringify(result, null, 2));
    if (incident) {
      engine.drainEvents();
      writeFileSync(join(runDir, 'checkpoint.json'), JSON.stringify(engine.checkpoint()));
      writeFileSync(join(dir, 'STOP.json'), JSON.stringify(incident, null, 2));
    }
    report.push(result);
  }
  writeFileSync(join(dir, 'campaign-report.json'), JSON.stringify(report, null, 2));
  return report;
}

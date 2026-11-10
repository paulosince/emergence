// Operational execution control for ONE experiment run.
//
// This module distinguishes real execution of the engine from any visual
// playback of its history. Every command acts on the ExperimentSession that
// owns the scheduler, clock, transducers and engine: while the run is
// PAUSED, no scheduled event is processed and the engine receives nothing.
//
// It is deliberately NOT a governance layer. Authorization, classification
// and containment policies (PPC/ADCIF) are outside this module and are not
// implemented here; nothing in this file should be labelled "containment".
// Commands that are invalid for the current state fail closed (throw) and
// are recorded in the control log together with the rejection.
//
// No DOM, storage, files or wall clock: callers that need civil time must
// record it themselves, outside the scientific state.
import { ExperimentSession } from './experiment-session.js';

export const EXECUTION_STATES = Object.freeze({
  PREPARED: 'prepared',
  RUNNING: 'running',
  PAUSED: 'paused',
  COMPLETED: 'completed',
});
const S = EXECUTION_STATES;

export class ExecutionStateError extends Error {
  constructor(message, { command, state }) {
    super(message);
    this.name = 'ExecutionStateError';
    this.command = command;
    this.state = state;
  }
}

export class ExecutionController {
  #session;
  #state = S.PREPARED;
  #log = [];
  #result = null;

  // `configuration` is exactly what ExperimentSession accepts; the engine
  // instance must be fresh and is owned by this controller from now on.
  constructor(configuration) {
    this.#session = new ExperimentSession(configuration);
  }

  get state() { return this.#state; }
  get endTimeMs() { return this.#session.endTimeMs; }
  get executedThroughMs() { return this.#session.executedThroughMs; }

  #record(command, accepted, before, detail = null) {
    const p = this.#session.progress();
    this.#log.push(Object.freeze({
      order: this.#log.length + 1,
      command,
      accepted,
      stateBefore: before,
      stateAfter: this.#state,
      executedThroughMs: p.executedThroughMs,
      processedEvents: p.processedEvents,
      detail,
    }));
  }

  #reject(command, message) {
    this.#record(command, false, this.#state, { reason: message });
    throw new ExecutionStateError(message, { command, state: this.#state });
  }

  #require(command, allowed) {
    if (!allowed.includes(this.#state)) {
      this.#reject(command, `Command "${command}" is not valid while ${this.#state}`);
    }
  }

  start() {
    this.#require('start', [S.PREPARED]);
    const before = this.#state;
    this.#state = S.RUNNING;
    this.#record('start', true, before);
    return this;
  }

  // Operational pause: no further events are processed until resume().
  pause(reason = null) {
    this.#require('pause', [S.RUNNING]);
    const before = this.#state;
    this.#state = S.PAUSED;
    this.#record('pause', true, before, reason === null ? null : { reason: String(reason) });
    return this;
  }

  resume() {
    this.#require('resume', [S.PAUSED]);
    const before = this.#state;
    this.#state = S.RUNNING;
    this.#record('resume', true, before);
    return this;
  }

  // Execute every scheduled event through `timeMs` (inclusive), clamped to
  // the run horizon. Allowed ONLY while running.
  advanceTo(timeMs) {
    this.#require('advance', [S.RUNNING]);
    if (!Number.isFinite(timeMs) || timeMs < this.executedThroughMs) {
      this.#reject('advance', 'Target time is invalid or earlier than executed time');
    }
    const target = Math.min(timeMs, this.endTimeMs);
    const before = this.#session.progress().processedEvents;
    this.#session.advanceThrough(target);
    const processed = this.#session.progress().processedEvents - before;
    // Advance commands are frequent; log them compactly with their effect.
    this.#record('advance', true, this.#state, { targetMs: target, processed });
    if (target >= this.endTimeMs) this.#complete();
    return this;
  }

  advanceBy(durationMs) {
    this.#require('advance', [S.RUNNING]);
    if (!Number.isFinite(durationMs) || durationMs <= 0) {
      this.#reject('advance', 'Advance duration must be positive and finite');
    }
    return this.advanceTo(this.executedThroughMs + durationMs);
  }

  // Execute the remainder of the run. Allowed only while running.
  runToEnd() { return this.advanceTo(this.endTimeMs); }

  #complete() {
    const before = this.#state;
    this.#result = this.#session.finish();
    this.#state = S.COMPLETED;
    this.#record('complete', true, before);
  }

  // Final scientific result, available only after real completion.
  result() {
    if (this.#state !== S.COMPLETED) {
      throw new ExecutionStateError('Run has not completed', {
        command: 'result', state: this.#state,
      });
    }
    return structuredClone(this.#result);
  }

  // Read-only observation of the executed portion. Never advances anything.
  // `fromTrace` (optional) also returns the run trace from that index:
  // sensor samples, deliveries and engine events with their own times.
  observe(fromIncidence = 0, fromTrace = null) {
    const view = {
      state: this.#state,
      progress: this.#session.progress(),
      incidences: this.#session.incidencesFrom(fromIncidence),
    };
    if (fromTrace !== null) view.trace = this.#session.traceFrom(fromTrace);
    return view;
  }
  engineSnapshot() { return this.#session.engineSnapshot(); }
  manifest() { return this.#session.manifest(); }
  controlLog() { return this.#log.map(entry => structuredClone(entry)); }
}

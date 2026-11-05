// Verifies only an operational interface; does not assert representational content.
export function assertExperimentEngine(engine) {
  if (engine === null || typeof engine !== 'object') {
    throw new TypeError('Experiment engine must be an object');
  }
  for (const method of ['ingest', 'advanceTo', 'snapshot', 'drainEvents']) {
    if (typeof engine[method] !== 'function') {
      throw new TypeError('Experiment engine must implement ' + method + '()');
    }
  }
  return engine;
}

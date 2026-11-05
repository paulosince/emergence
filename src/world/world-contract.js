// Minimal research contract: physical truth remains on the evaluator side.
// Does not specify any perception or representation mechanism.
export function assertPhysicalWorld(world) {
  if (!world || typeof world !== 'object') {
    throw new TypeError('Physical world must be an object');
  }
  for (const method of ['describe', 'stateAt', 'eventsThrough']) {
    if (typeof world[method] !== 'function') {
      throw new TypeError('Physical world must implement ' + method + '()');
    }
  }
  return world;
}
// Reuse the pinned TEMPO heap: events are ordered by time and insertion sequence.
// No wall clock, timer, asynchronous race or browser scheduling affects this order.
import { EventHeap } from '../../vendor/tempo/core/heap.js';

export class EventScheduler {
  #heap = new EventHeap();
  #sequence = 0;
  #nowMs = 0;

  get size() { return this.#heap.size; }
  peekTime() { return this.#heap.peekTime(); }

  schedule(timeMs, kind, payload = null) {
    if (!Number.isFinite(timeMs) || timeMs < 0 || timeMs < this.#nowMs) {
      throw new RangeError('Cannot schedule a nonfinite or past event');
    }
    if (typeof kind !== 'string' || !kind) throw new TypeError('Event kind is required');
    const event = Object.freeze({
      timeMs, sequence: ++this.#sequence, kind, payload,
    });
    this.#heap.push({ t: timeMs, seq: event.sequence, event });
    return event.sequence;
  }

  next() {
    if (!this.#heap.size) return null;
    const item = this.#heap.pop();
    this.#nowMs = item.t;
    return item.event;
  }
}
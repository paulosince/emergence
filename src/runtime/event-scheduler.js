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

  snapshot() {
    return structuredClone({
      sequence:this.#sequence,nowMs:this.#nowMs,
      events:this.#heap.a.map(item=>item.event),
    });
  }

  restore(snapshot) {
    if (!snapshot || !Number.isInteger(snapshot.sequence) ||
        snapshot.sequence<0 ||
        !Number.isFinite(snapshot.nowMs) || snapshot.nowMs<0 ||
        !Array.isArray(snapshot.events)) {
      throw new RangeError('Invalid scheduler checkpoint');
    }
    const sequenceSet=new Set();
    for(const event of snapshot.events) {
      if(!event || !Number.isFinite(event.timeMs) ||
         event.timeMs<snapshot.nowMs ||
         !Number.isInteger(event.sequence) ||
         event.sequence<1 || event.sequence>snapshot.sequence ||
         sequenceSet.has(event.sequence) ||
         !['sample','deliver'].includes(event.kind)) {
        throw new RangeError('Invalid or duplicated scheduler event');
      }
      sequenceSet.add(event.sequence);
    }
    const heap=new EventHeap();
    for(const event of snapshot.events) {
      heap.push({t:event.timeMs,seq:event.sequence,
        event:Object.freeze(structuredClone(event))});
    }
    this.#heap=heap;
    this.#sequence=snapshot.sequence;
    this.#nowMs=snapshot.nowMs;
  }

  next() {
    if (!this.#heap.size) return null;
    const item = this.#heap.pop();
    this.#nowMs = item.t;
    return item.event;
  }
}
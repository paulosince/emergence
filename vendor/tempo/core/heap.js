// Minimal binary min-heap of events ordered by (time, sequence number).

export class EventHeap {
  constructor() { this.a = []; }
  get size() { return this.a.length; }
  peekTime() { return this.a.length ? this.a[0].t : Infinity; }
  less(x, y) { return x.t < y.t || (x.t === y.t && x.seq < y.seq); }
  push(ev) {
    const a = this.a; a.push(ev);
    let i = a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (!this.less(a[i], a[p])) break;
      [a[i], a[p]] = [a[p], a[i]]; i = p;
    }
  }
  pop() {
    const a = this.a, top = a[0], last = a.pop();
    if (a.length) {
      a[0] = last;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1, r = l + 1;
        let m = i;
        if (l < a.length && this.less(a[l], a[m])) m = l;
        if (r < a.length && this.less(a[r], a[m])) m = r;
        if (m === i) break;
        [a[i], a[m]] = [a[m], a[i]]; i = m;
      }
    }
    return top;
  }
  clear() { this.a = []; }
}

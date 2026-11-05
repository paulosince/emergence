// Seeded random number generator (mulberry32) with the few distributions TEMPO needs.
// Same seed -> same sequence, in Node and in the browser.

export function makeRng(seed = 0) {
  let a = (Math.imul(seed + 1, 2654435761) >>> 0) || 0x9e3779b9;
  const random = () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const uniform = (lo, hi) => lo + (hi - lo) * random();
  const normal = () => {
    let u = 0;
    while (u === 0) u = random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * random());
  };
  const poisson = (lam) => {
    const L = Math.exp(-lam);
    let k = 0, p = 1;
    do { k++; p *= random(); } while (p > L);
    return k - 1;
  };
  return { random, uniform, normal, poisson };
}

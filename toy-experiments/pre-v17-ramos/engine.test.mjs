// node --test toy-experiments/pre-v17-ramos/engine.test.mjs
// Testes do motor, independentes das previsões do pré-registro.
import test from "node:test";
import assert from "node:assert/strict";
import { Engine } from "./engine.mjs";

function build(rule, ramos) {
  const e = new Engine({ rule });
  e.utrd("t"); e.uint("j");
  e.upro({ id: "p", from: "t", to: "j", ramos: ramos.map(delay => ({ delay })) });
  return e;
}

test("cada ramo entrega a emissão no seu atraso", () => {
  const e = build("B", [1, 3]); e.pulse("t", 10); e.run();
  const arr = e.log.filter(x => x.kind === "arrival");
  assert.deepEqual(arr.map(x => x.time), [11, 13]);
  assert.equal(new Set(arr.map(x => x.emission)).size, 1);
});
test("mesma emissão por dois ramos soma, mas é uma só contribuição distinta (A e B)", () => {
  for (const rule of ["A", "B"]) {
    const e = build(rule, [1, 1.1]); e.pulse("t", 0); e.run();
    const last = e.log.filter(x => x.kind === "arrival").at(-1);
    assert.equal(last.sum, 2); assert.equal(last.distinct, 1);
    assert.equal(e.fires().length, 0);
  }
});
test("emissões diferentes da mesma Upro: A não distingue, B distingue", () => {
  for (const [rule, fires] of [["A", 0], ["B", 1]]) {
    const e = build(rule, [1, 6]); e.pulse("t", 0); e.pulse("t", 5); e.run();
    assert.equal(e.fires().length, fires);
  }
});
test("contribuição expira fora da janela", () => {
  const e = build("B", [1, 6]); e.pulse("t", 0); e.pulse("t", 5.3); e.run();
  assert.equal(e.fires().length, 0);
});
test("refratariedade impede disparo dentro de 1 ms", () => {
  const e = new Engine({ rule: "A" });
  for (const id of ["a", "b", "c"]) e.utrd(id);
  e.uint("j");
  e.upro({ id: "pa", from: "a", to: "j", ramos: [{ delay: 1 }] });
  e.upro({ id: "pb", from: "b", to: "j", ramos: [{ delay: 1 }] });
  e.upro({ id: "pc", from: "c", to: "j", ramos: [{ delay: 1 }] });
  e.pulse("a", 0); e.pulse("b", 0); e.pulse("a", 0.5); e.pulse("c", 0.5); e.run();
  assert.equal(e.fires().length, 1);
});
test("disparo registra quem contribuiu (rastreabilidade)", () => {
  const e = build("B", [1, 6]); e.pulse("t", 0); e.pulse("t", 5); e.run();
  const f = e.fires()[0];
  assert.deepEqual(f.contributors.map(c => [c.ramo, c.emission]).sort(), [[0, 2], [1, 1]]);
});
test("determinismo", () => {
  const go = () => { const e = build("B", [2, 7]); [0, 5, 10].forEach(t => e.pulse("t", t)); return e.run(); };
  assert.deepEqual(go(), go());
});
test("errata: duas Upros da mesma Utrd, mesmo pulso, são origens distintas em A e B", () => {
  for (const rule of ["A", "B"]) {
    const e = new Engine({ rule });
    e.utrd("t"); e.uint("j");
    e.upro({ id: "p1", from: "t", to: "j", ramos: [{ delay: 1 }] });
    e.upro({ id: "p2", from: "t", to: "j", ramos: [{ delay: 1.1 }] });
    e.pulse("t", 0); e.run();
    assert.equal(e.fires().length, 1);
  }
});

// Dependency-free behavioral smoke test with a minimal DOM test double.
// Tests actual browser app JS and scientific modules, but NOT visual rendering.
import assert from 'node:assert/strict';

class FakeElement {
  constructor(id = '') {
    this.id = id;
    this.textContent = '';
    this.value = '';
    this.checked = false;
    this.children = [];
    this.attributes = new Map();
    this.listeners = new Map();
    this.classList = { toggle: () => {} };
  }
  addEventListener(name, callback) {
    this.listeners.set(name, callback);
  }
  trigger(name) {
    const callback = this.listeners.get(name);
    if (!callback) throw new Error('No event handler for ' + this.id + '.' + name);
    callback();
  }
  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }
  replaceChildren(...items) {
    this.children = [...items];
  }
  append(...items) {
    this.children.push(...items);
  }
}
const elements = new Map();
const byId = id => {
  if (!elements.has(id)) elements.set(id, new FakeElement(id));
  return elements.get(id);
};
const checks = ['optical', 'mechanical', 'proprioceptive', 'interoceptive']
  .map(value => {
    const element = new FakeElement(value);
    element.value = value;
    element.checked = true;
    return element;
  });
byId('actionMode').value = 'lift';
byId('timeRange').value = '0';

globalThis.document = {
  getElementById: byId,
  querySelectorAll: selector => {
    assert.equal(selector, '[data-modality]');
    return checks;
  },
  createElement: tag => new FakeElement(tag),
  addEventListener() {},
};
await import('../app/inspector.js');
assert.match(byId('runStatus').textContent, /Simulação íntegra/);
assert.match(byId('runStatus').textContent, /incidências/);
assert.equal(byId('receivedValue').textContent, '0');
assert.equal(byId('incidenceCount').textContent, '0 até agora');

// Re-render a real intermediate physical state and actual sensor deliveries.
byId('timeRange').value = '1500';
byId('timeRange').trigger('input');
assert.ok(Number(byId('receivedValue').textContent) > 0);
assert.ok(byId('incidenceList').children.length > 0);
assert.match(byId('jointValue').textContent, /20 cm/);
assert.ok(byId('physicalEvents').children.length >= 3);
assert.match(byId('heightValue').textContent, / m$/);

// Alter the real physical intervention; the idle actuator consumes no energy.
byId('actionMode').value = 'passive';
byId('actionMode').trigger('change');
byId('timeRange').value = '1000';
byId('timeRange').trigger('input');
assert.equal(byId('jointValue').textContent, '0 cm');
assert.equal(byId('energyValue').textContent, '100 J');
assert.equal(byId('currentValue').textContent, '0 A');

// Ablation must remove all sensory deliveries, but not physical events.
for (const checkbox of checks) checkbox.checked = false;
checks[0].trigger('change');
byId('timeRange').value = '1500';
byId('timeRange').trigger('input');
assert.equal(byId('receivedValue').textContent, '0');
assert.ok(byId('physicalEvents').children.length >= 3);
assert.match(byId('runStatus').textContent, /0 incidências/);

console.log('EMERGENCE DOM behavioral inspector smoke passed; visual layout not assessed');

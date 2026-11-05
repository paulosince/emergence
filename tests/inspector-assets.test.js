import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const js = readFileSync(new URL('../app/inspector.js', import.meta.url), 'utf8');
test('browser inspector contains operational controls and real science kernel imports', () => {
  assert.ok(html.includes('<script type="module" src="./app/inspector.js"></script>'));
  assert.ok(html.includes('id="timeRange"'));
  assert.ok(html.includes('data-modality'));
  assert.ok(html.includes('id="incidenceList"'));
  assert.ok(html.includes('id="physicalEvents"'));
  assert.ok(js.includes("import { createBodyScenario }"));
  assert.ok(js.includes("import { runExperiment }"));
  assert.ok(js.includes("import { DiagnosticEngine }"));
  assert.ok(!js.includes('Math.random('));
  assert.ok(!js.includes('generateFakeIncidence'));
  assert.ok(existsSync(new URL('../app/inspector.css', import.meta.url)));
});
test('inspector documentation is present before publishing a clickable interface', () => {
  assert.ok(existsSync(new URL('../docs/body-world-v0.1.md', import.meta.url)));
});

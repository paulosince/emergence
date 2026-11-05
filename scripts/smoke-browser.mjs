// Real Chromium smoke test of the static research inspector (no dependencies).
// It serves this repository locally so ES modules obey same-origin rules.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn, spawnSync } from 'node:child_process';

const root = resolve(fileURLToPath(new URL('../', import.meta.url)));
const extensions = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
};
const server = createServer(async (request, response) => {
  try {
    const route = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const file = resolve(root, '.' + (route === '/' ? '/index.html' : route));
    if (!(file === root || file.startsWith(root + sep))) {
      response.writeHead(403).end('Forbidden');
      return;
    }
    const data = await readFile(file);
    response.writeHead(200, {
      'Content-Type': extensions[extname(file)] ?? 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    response.end(data);
  } catch {
    response.writeHead(404).end('Not found');
  }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const url = 'http://127.0.0.1:' + server.address().port + '/';
let browser;
for (const candidate of ['google-chrome', 'google-chrome-stable',
  'chromium', 'chromium-browser']) {
  if (spawnSync('which', [candidate], { encoding: 'utf8' }).status === 0) {
    browser = candidate;
    break;
  }
}
if (!browser) {
  server.close();
  throw new Error('Real browser smoke test requires Chrome/Chromium on CI runner');
}
let stdout = '', stderr = '';
const child = spawn(browser, [
  '--headless', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage',
  '--disable-background-networking', '--no-first-run', '--no-default-browser-check',
  '--virtual-time-budget=4000', '--dump-dom', url,
], { stdio: ['ignore', 'pipe', 'pipe'] });
child.stdout.setEncoding('utf8');
child.stderr.setEncoding('utf8');
child.stdout.on('data', chunk => { stdout += chunk; });
child.stderr.on('data', chunk => { stderr += chunk; });
const outcome = await new Promise((resolveOutcome, reject) => {
  const timeout = setTimeout(() => {
    child.kill('SIGKILL');
    reject(new Error('Browser smoke test timed out'));
  }, 25000);
  child.on('error', error => {
    clearTimeout(timeout);
    reject(error);
  });
  child.on('close', code => {
    clearTimeout(timeout);
    resolveOutcome(code);
  });
}).finally(() => server.close());
if (outcome !== 0 ||
    !/<span id="runStatus">Simulação íntegra/.test(stdout) ||
    !/<span id="incidenceCount">0 até agora<\/span>/.test(stdout) ||
    !/Uma ação, vários sinais/.test(stdout) ||
    /Erro experimental:/.test(stdout)) {
  throw new Error('Browser did not execute the real simulation: ' +
    JSON.stringify({ outcome, hasStatus: stdout.includes('Simulação íntegra'),
      stderr: stderr.slice(-2500), bodyEnd: stdout.slice(-1200) }));
}
console.log('Real Chrome inspector smoke test passed at ' + url);

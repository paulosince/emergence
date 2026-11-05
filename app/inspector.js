// Browser-only, read-only visualization of recorded experimental quantities.
// Display clock never drives the physical model; all trajectories and
// transduction histories are evaluated by the deterministic experiment runner.
import { createBodyScenario } from '../src/body/body-scenario.js';
import { runExperiment } from '../src/runtime/experiment-runner.js';
import { DiagnosticEngine } from '../src/engines/diagnostic-engine.js';

const byId = id => document.getElementById(id);
const modalities = document.querySelectorAll('[data-modality]');
const timeline = byId('timeRange');
const play = byId('playBtn');
const step = byId('stepBtn');
const human = n => new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 3,
}).format(n);
const sensorNames = {
  s0: 'Barreira superior',
  s1: 'Barreira inferior',
  s2: 'Placa mecânica',
  s3: 'Posição articular',
  s4: 'Tensão interna',
  s5: 'Temperatura interna',
  s6: 'Corrente do motor',
};
const typeNames = {
  'intervention.motor-command': 'Comando externo: elevar',
  'intervention.release': 'Soltura programada',
  'control.fixed-voltage-threshold': 'Regra fixa: tensão permite ou inibe elevação',
  'collision.impact': 'Colisão física calculada',
  'contact.initial': 'Contato inicial',
};

let scene = null;
let result = null;
let displayTimeMs = 0;
let playback = null;
const svg = {
  sphere: byId('sphere'), arm: byId('arm'), label: byId('sphereLabel'),
  upper: byId('beamUpper'), lower: byId('beamLower'),
};

function text(id, value) { byId(id).textContent = value; }
function stopPlayback() {
  if (playback !== null) clearInterval(playback);
  playback = null;
  play.textContent = 'Reproduzir';
}
function setVisualTime(timeMs) {
  if (!scene) return;
  displayTimeMs = Math.min(Math.max(0, timeMs), scene.endTimeMs);
  timeline.value = String(displayTimeMs);
  text('timeOutput', human(displayTimeMs) + ' ms');
  const physical = scene.world.stateAt(displayTimeMs);
  const body = scene.world.bodyStateAt(displayTimeMs);
  const params = scene.world.describe().bodyParameters;

  text('heightValue', human(physical.clearanceM) + ' m');
  text('velocityValue', human(physical.verticalVelocityMps) + ' m/s');
  text('impactValue', human(scene.world.describe().impactTimeMs) + ' ms');
  text('jointValue', human(body.jointExtensionM * 100) + ' cm');
  text('voltageValue', human(body.capacitorVoltageV) + ' V');
  text('temperatureValue', human(body.internalTemperatureK) + ' K');
  text('currentValue', human(body.motorCurrentA) + ' A');
  text('energyValue', human(body.capacitorEnergyJ) + ' J');
  text('heatValue', human(body.heatGeneratedJ) + ' J');

  const phase = {
    'locked-before-lift': 'Corpo sustentando a esfera: comando ainda não iniciado.',
    'lifting': 'Motor ativo: movimento, consumo elétrico e aquecimento ocorrem juntos.',
    'locked-after-release': 'Esfera solta: atuador permanece travado, sem corrente.',
  };
  text('bodyPhase', phase[body.phase] ?? body.phase);

  const y = 258 - physical.centerHeightM * 150;
  svg.sphere.setAttribute('cy', String(y));
  svg.label.setAttribute('y', String(Math.max(16, y - 14)));
  // The gripper supports the sphere before release and opens at detachment.
  const gripperTop = 258 -
    (params.initialClearanceM + body.jointExtensionM) * 150 + 3;
  svg.arm.setAttribute('y', String(gripperTop));
  svg.arm.setAttribute('visibility', displayTimeMs >=
    scene.world.describe().intervention.releaseAtMs ? 'hidden' : 'visible');

  const active = new Set(scene.transducers.map(s => s.id));
  for (const [id, beam, beamHeight] of [
    ['s0', svg.upper, 0.7], ['s1', svg.lower, 0.3],
  ]) {
    beam.setAttribute('d', 'M52 ' + (258 - beamHeight * 150) +
      ' H398');
    beam.setAttribute('visibility', active.has(id) ? 'visible' : 'hidden');
    const blocked = Math.abs(physical.centerHeightM - beamHeight) <=
      params.radiusM;
    beam.classList.toggle('blocked', blocked);
  }

  const arrived = result.incidences
    .filter(i => i.arrivedAtMs <= displayTimeMs);
  text('incidenceCount', arrived.length + ' até agora');
  text('receivedValue', String(arrived.length));
  const incidents = byId('incidenceList');
  incidents.replaceChildren();
  for (const i of arrived.slice(-9).reverse()) {
    const row = document.createElement('li');
    const channel = document.createElement('span');
    channel.textContent = (sensorNames[i.transducerId] ?? i.transducerId) +
      ' · ' + human(i.measurement);
    const timestamp = document.createElement('span');
    timestamp.textContent = human(i.arrivedAtMs) + ' ms';
    row.append(channel, timestamp);
    incidents.append(row);
  }
  if (!arrived.length) {
    const li = document.createElement('li');
    li.textContent = 'Nenhuma incidência entregue neste instante.';
    incidents.append(li);
  }

  const events = byId('physicalEvents');
  events.replaceChildren();
  for (const e of scene.world.eventsThrough(displayTimeMs).slice(-6).reverse()) {
    const row = document.createElement('li');
    const label = document.createElement('span');
    label.textContent = typeNames[e.type] || e.type;
    const stamp = document.createElement('span');
    stamp.textContent = human(e.timeMs) + ' ms';
    row.append(label, stamp);
    events.append(row);
  }
  if (!events.children.length) {
    const li = document.createElement('li');
    li.textContent = 'Sem acontecimentos físicos registrados até aqui.';
    events.append(li);
  }
}

function startCondition() {
  stopPlayback();
  try {
    const enabled = [...modalities]
      .filter(input => input.checked).map(input => input.value);
    const mode = byId('actionMode').value;
    const height = mode === 'passive' ? 0 : 0.2;
    scene = createBodyScenario({
      modalities: enabled,
      worldOptions: { liftHeightM: height },
      controlMode: mode.startsWith('fixed-')
        ? 'fixed-voltage-gate' : 'experimenter',
      thresholdVoltageV: mode === 'fixed-block' ? 10.05 : 9.95,
    });
    result = runExperiment({
      ...scene, engine: new DiagnosticEngine(),
    });
    timeline.max = String(scene.endTimeMs);
    text('runStatus', 'Simulação íntegra · ' +
      result.summary.deliveredCount + ' incidências');
    setVisualTime(0);
  } catch (error) {
    text('runStatus', 'Erro experimental: ' + error.message);
    // Do not mask a failed experiment with an illustrative fallback.
    throw error;
  }
}

play.addEventListener('click', () => {
  if (playback !== null) { stopPlayback(); return; }
  if (displayTimeMs >= scene.endTimeMs) setVisualTime(0);
  play.textContent = 'Pausar';
  playback = setInterval(() => {
    setVisualTime(displayTimeMs + 20);
    if (displayTimeMs >= scene.endTimeMs) stopPlayback();
  }, 40);
});
step.addEventListener('click', () => {
  stopPlayback();
  setVisualTime(displayTimeMs + 10);
});
timeline.addEventListener('input', () => {
  stopPlayback();
  setVisualTime(Number(timeline.value));
});
for (const input of modalities) input.addEventListener('change', startCondition);
byId('actionMode').addEventListener('change', startCondition);
byId('exportBtn').addEventListener('click', () => {
  if (!result) return;
  const exportable = {
    instrument: 'EMERGENCE experimental browser inspector v0',
    disclaimer: 'Researcher-only physical truth; no autonomous representation',
    ...result,
  };
  const blob = new Blob([JSON.stringify(exportable, null, 2)],
    { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'emergence-body-experiment.json';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 500);
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) stopPlayback();
});
startCondition();

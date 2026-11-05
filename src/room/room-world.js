// Controlled naturalistic world: a persistent room independent of any learner.
// Analytic sun geometry, aperture occlusion, a physical light-sensor controller,
// and a 1-zone thermal energy balance. Researcher-only world truth.
// All quantities are computed; there is no schedule of fabricated incidences.
import { DAY_MS, describeSolarDay, solarAt } from './solar.js';
import { createWeatherForcing } from './weather.js';
import { ROOM_GEOMETRY_V1, floorReceivesDirectSun,
  sunPatchOnFloor } from './geometry.js';

export const ROOM_MODEL_ID = 'naturalistic-room-thermal-optical-v1';
const STEP_MS = 60000; // Temperature integration and controller sampling resolution.

function bounded(name, value, low, high, strict = false) {
  if (!Number.isFinite(value) ||
      (strict ? value <= low : value < low) || value > high) {
    throw new RangeError(name + ' outside physical domain');
  }
}

export function createRoomWorld({
  date = '2026-06-21',
  latitudeDeg = -23.45,
  longitudeDeg = -46.52,
  utcOffsetHours = -3,
  weatherPreset = 'clear',
  weatherSeries = null,
  weatherSource = null,
  initialIndoorTemperatureC = 17,
  heatCapacityJPerK = 3_000_000,
  envelopeConductanceWPerK = 120,
  lampElectricalPowerW = 12,
  lampVisibleRadiantFraction = 0.25,
  lampOnThresholdWm2 = 12,
  lampOffThresholdWm2 = 18,
} = {}) {
  const day = describeSolarDay({ date, latitudeDeg, longitudeDeg, utcOffsetHours });
  const weather = createWeatherForcing({
    preset: weatherPreset, series: weatherSeries, source: weatherSource,
  });
  for (const [key,x,a,b,strict] of [
    ['initialIndoorTemperatureC', initialIndoorTemperatureC, -60, 80, false],
    ['heatCapacityJPerK', heatCapacityJPerK, 1000, 1e9, true],
    ['envelopeConductanceWPerK', envelopeConductanceWPerK, 0, 1e5, true],
    ['lampElectricalPowerW', lampElectricalPowerW, 0, 1e4, false],
    ['lampVisibleRadiantFraction', lampVisibleRadiantFraction, 0, 1, false],
    ['lampOnThresholdWm2', lampOnThresholdWm2, 0, 200, false],
    ['lampOffThresholdWm2', lampOffThresholdWm2, 0, 200, false],
  ]) bounded(key,x,a,b,strict);
  if (lampOffThresholdWm2 <= lampOnThresholdWm2)
    throw new RangeError('Lamp hysteresis must have off-threshold greater than on-threshold');

  const geometry = ROOM_GEOMETRY_V1;
  const floorArea = geometry.widthM * geometry.depthM;
  const apertureArea = geometry.window.widthM * geometry.window.heightM;
  const opticalTransfer = geometry.window.transmittance;

  function skyAt(timeMs) {
    const sun = solarAt(timeMs, day);
    const atmosphere = weather.at(timeMs);
    const positiveUp = Math.max(0, sun.up);
    const directNormalWm2 = 850 * (positiveUp ** 0.25) *
      ((1 - atmosphere.cloudCover) ** 2);
    const diffuseHorizontalWm2 = 120 * Math.sqrt(positiveUp) *
      (0.55 + 0.45 * atmosphere.cloudCover);
    const outdoorIrradianceWm2 =
      directNormalWm2 * positiveUp + diffuseHorizontalWm2;
    const northWindowIncidence = Math.max(0, sun.north);
    const transmittedDirectPowerW =
      directNormalWm2 * northWindowIncidence * apertureArea * opticalTransfer;
    const transmittedDiffusePowerW =
      diffuseHorizontalWm2 * 0.5 * apertureArea * opticalTransfer;
    return {
      sun, atmosphere, directNormalWm2, diffuseHorizontalWm2,
      outdoorIrradianceWm2,
      transmittedDirectPowerW, transmittedDiffusePowerW,
      // First reflected approximation: 12% of the transmitted direct flux
      // is spread uniformly over the floor. The remaining fate is NOT simulated.
      indirectFloorIrradianceWm2:
        (0.12 * transmittedDirectPowerW + transmittedDiffusePowerW) /
        floorArea,
      incomingWindowPowerW:
        transmittedDirectPowerW + transmittedDiffusePowerW,
    };
  }

  // Schmitt-style photocell: decisions happen because external irradiation
  // crosses a threshold, never at a hard-coded 06:00/18:00.
  const transitions = [];
  let lamp = skyAt(0).outdoorIrradianceWm2 < lampOffThresholdWm2;
  const initiallyOn = lamp;
  for (let t = STEP_MS; t <= DAY_MS; t += STEP_MS) {
    const irradiance = skyAt(t).outdoorIrradianceWm2;
    const threshold = lamp ? lampOffThresholdWm2 : lampOnThresholdWm2;
    const switches = lamp ? irradiance >= threshold : irradiance <= threshold;
    if (!switches) continue;
    let lower = t - STEP_MS, upper = t;
    const lowerIrradiance = skyAt(lower).outdoorIrradianceWm2;
    const isIncreasing = lamp;
    // If the bracket is not monotonic, fall back to the minute boundary.
    if ((isIncreasing && lowerIrradiance < threshold) ||
        (!isIncreasing && lowerIrradiance > threshold)) {
      for (let i=0; i<24; i++) {
        const mid=(lower+upper)/2;
        const midIrradiance=skyAt(mid).outdoorIrradianceWm2;
        if (isIncreasing ? midIrradiance >= threshold :
          midIrradiance <= threshold) upper=mid;
        else lower=mid;
      }
    }
    lamp = !lamp;
    transitions.push(Object.freeze({
      type:'lamp.toggle',timeMs:upper, stateOn:lamp,
      eventId:'lamp-toggle-'+transitions.length,
      control:'exterior-irradiance-photocell',
    }));
  }

  function lampAt(timeMs) {
    let on = initiallyOn;
    for (const t of transitions) {
      if (t.timeMs > timeMs) break;
      on=t.stateOn;
    }
    return on;
  }

  // Thermal energy balance: C*dT/dt = UA*(Tout - Tin) + absorbed
  // window solar flux + lamp electrical heat. Fixed 60s integration cells
  // eliminate dependence on querying order, samples or GUI frame rate.
  const temperatureGrid = [initialIndoorTemperatureC];
  function forcingAt(t) {
    const sky = skyAt(t);
    const lampOn=lampAt(t);
    const absorbedSolarPowerW=0.6 * sky.incomingWindowPowerW;
    const lampHeatW=lampOn ? lampElectricalPowerW : 0;
    return {
      externalTemperatureC: sky.atmosphere.temperatureC,
      absorbedSolarPowerW, lampHeatW,
    };
  }
  function thermalAdvance(startC, midMs, dtSeconds) {
    const forcing=forcingAt(midMs);
    const totalHeatInput=forcing.absorbedSolarPowerW+forcing.lampHeatW;
    const equilibriumC=forcing.externalTemperatureC +
      totalHeatInput/envelopeConductanceWPerK;
    const rate=envelopeConductanceWPerK/heatCapacityJPerK;
    return equilibriumC+(startC-equilibriumC)*Math.exp(-rate*dtSeconds);
  }
  for (let t=0; t<DAY_MS; t+=STEP_MS) {
    temperatureGrid.push(thermalAdvance(
      temperatureGrid.at(-1), t+STEP_MS/2, STEP_MS/1000));
  }
  function indoorTemperatureAt(timeMs) {
    const index=Math.min(Math.floor(timeMs/STEP_MS),
      temperatureGrid.length-1);
    const remainingMs=timeMs-index*STEP_MS;
    if (!remainingMs) return temperatureGrid[index];
    return thermalAdvance(temperatureGrid[index],
      index*STEP_MS+remainingMs/2, remainingMs/1000);
  }

  const events = Object.freeze([
    Object.freeze({type:'lamp.initial',timeMs:0,stateOn:initiallyOn,
      eventId:'lamp-initial', control:'exterior-irradiance-photocell'}),
    ...transitions,
  ]);

  function checkTime(t) {
    if (!Number.isFinite(t) || t<0 || t>DAY_MS)
      throw new RangeError('timeMs must be within this civil day');
  }
  function stateAt(timeMs) {
    checkTime(timeMs);
    const sky=skyAt(timeMs);
    const lampOn=lampAt(timeMs);
    const patch=sunPatchOnFloor(sky.sun,geometry);
    const temperatureC=indoorTemperatureAt(timeMs);
    return Object.freeze({
      timeMs,
      sun: sky.sun,
      weather: sky.atmosphere,
      lighting: Object.freeze({
        lampOn,
        lampElectricalPowerW: lampOn ? lampElectricalPowerW : 0,
        lampFloorIrradianceWm2: lampOn ?
          lampElectricalPowerW*lampVisibleRadiantFraction/floorArea : 0,
        outdoorIrradianceWm2:sky.outdoorIrradianceWm2,
        directNormalWm2:sky.directNormalWm2,
        diffuseHorizontalWm2:sky.diffuseHorizontalWm2,
        transmittedDirectPowerW:sky.transmittedDirectPowerW,
        transmittedDiffusePowerW:sky.transmittedDiffusePowerW,
        indirectFloorIrradianceWm2:sky.indirectFloorIrradianceWm2,
        sunlightFloorPolygon:patch,
      }),
      thermal: Object.freeze({
        outdoorTemperatureC:sky.atmosphere.temperatureC,
        indoorTemperatureC:temperatureC,
        absorbedSolarPowerW:0.6*sky.incomingWindowPowerW,
        lampHeatW:lampOn ? lampElectricalPowerW : 0,
        conductivePowerIntoRoomW:envelopeConductanceWPerK *
          (sky.atmosphere.temperatureC-temperatureC),
      }),
    });
  }
  function floorIrradianceAt(timeMs,eastM,northM) {
    checkTime(timeMs);
    const sky=skyAt(timeMs);
    const direct=floorReceivesDirectSun(eastM,northM,sky.sun,geometry)
      ? sky.directNormalWm2*Math.max(0,sky.sun.up)*opticalTransfer : 0;
    const lampIrradiance=lampAt(timeMs) ?
      lampElectricalPowerW*lampVisibleRadiantFraction/floorArea : 0;
    return direct+sky.indirectFloorIrradianceWm2+lampIrradiance;
  }
  function eventsThrough(timeMs) {
    checkTime(timeMs);
    return Object.freeze(events.filter(e=>e.timeMs<=timeMs));
  }
  function describe() {
    return Object.freeze({
      modelId:ROOM_MODEL_ID,version:'0.1.0',
      date:day.date,solarDay:day,
      geometry, weather:weather.describe(),
      initialIndoorTemperatureC,heatCapacityJPerK,
      envelopeConductanceWPerK,lampElectricalPowerW,
      lampVisibleRadiantFraction,
      lampOnThresholdWm2,lampOffThresholdWm2,
      thermalIntegrationStepMs:STEP_MS,
      validity:'one 24h civil day, static room geometry, no wind/sound/rain',
      provenance:'room environmental truth is researcher-only',
    });
  }
  return Object.freeze({stateAt,eventsThrough,describe,floorIrradianceAt});
}
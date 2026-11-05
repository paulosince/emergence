// Operational transduction from a persistent room to independent numeric channels.
// No human-readable cause, geometry, date, weather record, or light-switch
// state is part of the incidence delivered to an experimental engine.
export class RoomSensorEnvironment {
  #world;
  #couplings;
  constructor({world,couplings=[]}) {
    if (!world || typeof world.stateAt !== 'function' ||
        typeof world.floorIrradianceAt !== 'function' ||
        typeof world.describe !== 'function') {
      throw new TypeError('Room sensors require an operational physical world');
    }
    if (!Array.isArray(couplings)) throw new TypeError('Couplings must be an array');
    this.#world=world;
    this.#couplings=new Map();
    for (const c of couplings) {
      if (!c || typeof c.channelId !== 'string' || !c.channelId ||
          this.#couplings.has(c.channelId)) throw new RangeError('Distinct physical channel IDs required');
      if (!['floor-radiometer','outdoor-radiometer',
        'indoor-temperature-voltage','outdoor-temperature-voltage',
        'lamp-current'].includes(c.type)) {
        throw new RangeError('Unknown physical transduction coupling');
      }
      if (c.type==='floor-radiometer') {
        const geom=world.describe().geometry;
        if (!Number.isFinite(c.eastM) || !Number.isFinite(c.northM) ||
          Math.abs(c.eastM)>geom.widthM/2 || Math.abs(c.northM)>geom.depthM/2)
          throw new RangeError('Floor radiometer must be located inside room');
      }
      this.#couplings.set(c.channelId,Object.freeze({
        channelId:c.channelId,type:c.type,
        ...(c.type==='floor-radiometer'?
          {eastM:c.eastM,northM:c.northM}:{}),
        unit:['floor-radiometer','outdoor-radiometer'].includes(c.type)
          ? 'W/m²' : c.type==='lamp-current' ? 'A' : 'V',
      }));
    }
  }
  readAt(channelId,timeMs) {
    const c=this.#couplings.get(channelId);
    if (!c) throw new RangeError('Unknown physical channel');
    if (c.type==='floor-radiometer') {
      return this.#world.floorIrradianceAt(timeMs,c.eastM,c.northM);
    }
    const state=this.#world.stateAt(timeMs);
    switch(c.type) {
      case 'outdoor-radiometer': return state.lighting.outdoorIrradianceWm2;
      case 'indoor-temperature-voltage':
        return 0.01*(273.15+state.thermal.indoorTemperatureC);
      case 'outdoor-temperature-voltage':
        return 0.01*(273.15+state.thermal.outdoorTemperatureC);
      case 'lamp-current':
        return state.lighting.lampElectricalPowerW/120; // 120V ideal AC supply.
    }
    throw new RangeError('Unknown coupling');
  }
  validateTransducers(sensors) {
    for(const sensor of sensors) {
      if(!this.#couplings.has(sensor.config.channelId))
        throw new RangeError('Sensor missing physical coupling');
    }
  }
  validateHorizon(t) {this.#world.stateAt(t);}
  specification() {
    return {
      model:'room-environmental-transductions-v1',
      world:this.#world.describe(), // researcher-only
      couplings:[...this.#couplings.values()].map(c=>({...c})),
      sensorSemantics:'no world truth is delivered through engine incidence',
    };
  }
}
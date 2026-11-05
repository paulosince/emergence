// Local apparent solar geometry approximation, WITHOUT external ephemeris.
// Solar hour is LOCAL SOLAR TIME, not a civil clock hour. Equation of time,
// atmospheric refraction, terrain and timezone corrections are not included.
// The day-of-year approximation is sufficiently bounded for the sunlit-room
// control; it is NOT a precise sunrise/sunset service.
const RAD=Math.PI/180;
export function approximateSun({latitudeDeg,dayOfYear,solarHour}) {
  if(!Number.isFinite(latitudeDeg)||latitudeDeg<-66||latitudeDeg>66||
     !Number.isInteger(dayOfYear)||dayOfYear<1||dayOfYear>365||
     !Number.isFinite(solarHour)||solarHour<0||solarHour>24) {
    throw new RangeError('Sun geometry requires valid latitude, nonleap day and solar hour');
  }
  const phi=latitudeDeg*RAD;
  const declinationRad=Math.asin(Math.sin(23.44*RAD)*
    Math.sin(2*Math.PI*(dayOfYear-80)/365.2422));
  const hourAngle=(solarHour-12)*15*RAD;
  const east=-Math.cos(declinationRad)*Math.sin(hourAngle);
  const north=Math.cos(phi)*Math.sin(declinationRad)-
    Math.sin(phi)*Math.cos(declinationRad)*Math.cos(hourAngle);
  const up=Math.sin(phi)*Math.sin(declinationRad)+
    Math.cos(phi)*Math.cos(declinationRad)*Math.cos(hourAngle);
  const length=Math.hypot(east,north,up);
  const sun={
    east:east/length,north:north/length,up:up/length,
    altitudeDeg:Math.asin(Math.max(-1,Math.min(1,up/length)))/RAD,
    azimuthDeg:(Math.atan2(east,north)/RAD+360)%360,
    declinationDeg:declinationRad/RAD,solarHour,
    aboveHorizon:up>0,
  };
  return Object.freeze(sun);
}

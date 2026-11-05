// Geometry in metres, east=x, north=y, up=z. Window lies on NORTH wall.
export const ROOM_GEOMETRY_V1 = Object.freeze({
  widthM: 6, depthM: 4, heightM: 2.8,
  window: Object.freeze({
    wall: 'north', centerEastM: 0,
    widthM: 2, sillM: 0.9, heightM: 1.3,
    transmittance: 0.7,
  }),
  door: Object.freeze({
    wall: 'west', centerNorthM: -0.6,
    widthM: 0.9, heightM: 2.1, closed: true,
  }),
});

export function clipFloorPolygon(polygon, geom) {
  const regions = [
    [p => p.x >= -geom.widthM/2, (a,b) =>
      atX(a,b,-geom.widthM/2)],
    [p => p.x <= geom.widthM/2, (a,b) =>
      atX(a,b,geom.widthM/2)],
    [p => p.y >= -geom.depthM/2, (a,b) =>
      atY(a,b,-geom.depthM/2)],
    [p => p.y <= geom.depthM/2, (a,b) =>
      atY(a,b,geom.depthM/2)],
  ];
  let result = polygon;
  for (const [inside, intersect] of regions) {
    const input = result;
    result = [];
    for (let i = 0; i < input.length; i++) {
      const curr = input[i], prev = input[(i + input.length-1)%input.length];
      const p = inside(prev), q = inside(curr);
      if (p && q) result.push(curr);
      else if (p && !q) result.push(intersect(prev,curr));
      else if (!p && q) result.push(intersect(prev,curr), curr);
    }
  }
  return result;
}
function atX(a,b,x) {
  const t = (x-a.x)/(b.x-a.x);
  return {x, y:a.y+t*(b.y-a.y)};
}
function atY(a,b,y) {
  const t = (y-a.y)/(b.y-a.y);
  return {x:a.x+t*(b.x-a.x), y};
}

export function sunPatchOnFloor(sun, geom) {
  if (sun.up <= 1e-9 || sun.north <= 1e-9) return Object.freeze([]);
  const w=geom.window, y=geom.depthM/2;
  const points=[
    {x:w.centerEastM-w.widthM/2,z:w.sillM},
    {x:w.centerEastM+w.widthM/2,z:w.sillM},
    {x:w.centerEastM+w.widthM/2,z:w.sillM+w.heightM},
    {x:w.centerEastM-w.widthM/2,z:w.sillM+w.heightM},
  ].map(p => ({
    x:p.x-p.z*sun.east/sun.up,
    y:y-p.z*sun.north/sun.up,
  }));
  return Object.freeze(clipFloorPolygon(points,geom)
    .map(p=>Object.freeze(p)));
}

export function floorReceivesDirectSun(x, y, sun, geom) {
  if (!Number.isFinite(x)||!Number.isFinite(y)) throw new RangeError('Invalid location');
  if (Math.abs(x)>geom.widthM/2||Math.abs(y)>geom.depthM/2)
    throw new RangeError('Sampling location outside room');
  if (sun.up <= 0 || sun.north <= 0) return false;
  const wallY=geom.depthM/2;
  const travel=(wallY-y)/sun.north;
  if (travel < 0) return false;
  const atWallX=x+travel*sun.east;
  const atWallZ=travel*sun.up;
  const w=geom.window;
  return Math.abs(atWallX-w.centerEastM) <= w.widthM/2 &&
    atWallZ>=w.sillM && atWallZ<=w.sillM+w.heightM;
}
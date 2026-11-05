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
  opaqueObject: Object.freeze({
    id: 'stationary-box', type: 'axis-aligned-opaque-box',
    centerEastM: 0, centerNorthM: 0.7,
    widthM: 0.5, depthM: 0.5, heightM: 0.9,
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

// Ray from a point on the floor TOWARDS the sun, until it reaches the
// north aperture. It is shadowed iff this physical ray hits the opaque box.
// Slab intersection is evaluated in 3D, not guessed from image positions.
export function boxBlocksWindowRay(x,y,sun,geom) {
  if(sun.up<=0 || sun.north<=0) return false;
  const box=geom.opaqueObject;
  if(!box) return false;
  const tWindow=(geom.depthM/2-y)/sun.north;
  if(tWindow<=0) return false;
  let tNear=0,tFar=tWindow;
  const slabs=[
    [x,sun.east,box.centerEastM-box.widthM/2,
      box.centerEastM+box.widthM/2],
    [y,sun.north,box.centerNorthM-box.depthM/2,
      box.centerNorthM+box.depthM/2],
    [0,sun.up,0,box.heightM],
  ];
  for(const [start,direction,min,max] of slabs) {
    if(Math.abs(direction)<1e-12) {
      if(start<min || start>max) return false;
      continue;
    }
    let a=(min-start)/direction,b=(max-start)/direction;
    if(a>b) [a,b]=[b,a];
    tNear=Math.max(tNear,a);
    tFar=Math.min(tFar,b);
    if(tNear>tFar) return false;
  }
  return tFar>=0 && tNear<tWindow;
}

function cross(a,b,c) {
  return (b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);
}
function convexHull(points) {
  const sorted=[...points].sort((a,b)=>a.x-b.x||a.y-b.y);
  const lower=[],upper=[];
  for(const point of sorted) {
    while(lower.length>=2 &&
      cross(lower.at(-2),lower.at(-1),point)<=0) lower.pop();
    lower.push(point);
  }
  for(let i=sorted.length-1;i>=0;i--) {
    const point=sorted[i];
    while(upper.length>=2 &&
      cross(upper.at(-2),upper.at(-1),point)<=0) upper.pop();
    upper.push(point);
  }
  return [...lower.slice(0,-1),...upper.slice(0,-1)];
}
function convexOverlap(subject,clip) {
  if(subject.length<3 || clip.length<3) return [];
  let poly=subject;
  const area=clip.reduce((sum,p,i)=>{
    const next=clip[(i+1)%clip.length];
    return sum+p.x*next.y-next.x*p.y;
  },0);
  const sign=area>=0?1:-1;
  for(let j=0;j<clip.length;j++) {
    const a=clip[j],b=clip[(j+1)%clip.length];
    const prevPoly=poly;poly=[];
    if(!prevPoly.length) break;
    for(let i=0;i<prevPoly.length;i++) {
      const p=prevPoly[(i+prevPoly.length-1)%prevPoly.length];
      const q=prevPoly[i];
      const cp=sign*cross(a,b,p),cq=sign*cross(a,b,q);
      if(cp>=0 && cq>=0) poly.push(q);
      else if(cp>=0 && cq<0) poly.push(intersection(p,q,cp,cq));
      else if(cp<0 && cq>=0) poly.push(intersection(p,q,cp,cq),q);
    }
  }
  return poly;
}
function intersection(p,q,cp,cq) {
  const t=cp/(cp-cq);
  return {x:p.x+t*(q.x-p.x),y:p.y+t*(q.y-p.y)};
}

// The shadow is a convex projection of the opaque BOX onto the floor,
// intersected with the sunlight patch entering through the window.
export function boxShadowOnFloor(sun,geom) {
  const patch=sunPatchOnFloor(sun,geom);
  const box=geom.opaqueObject;
  if(!box || patch.length<3 || sun.up<=0) return Object.freeze([]);
  const points=[];
  for(const x of [box.centerEastM-box.widthM/2,
    box.centerEastM+box.widthM/2]) {
    for(const y of [box.centerNorthM-box.depthM/2,
      box.centerNorthM+box.depthM/2]) {
      points.push({x,y});
      points.push({x:x-box.heightM*sun.east/sun.up,
        y:y-box.heightM*sun.north/sun.up});
    }
  }
  const polygon=convexOverlap(patch,convexHull(points));
  return Object.freeze(polygon.map(p=>Object.freeze(p)));
}
// Exact planar projection/occlusion for a deliberately bounded room geometry.
// Coordinates: x=east, y=north, z=up (metres). Sun vector points TOWARD sun.
// Floor polygons are observer truth. Rendering must not affect these calculations.
const EPS = 1e-11;
export function polygonArea(points) {
  if (points.length < 3) return 0;
  let area = 0;
  for (let i=0;i<points.length;i++) {
    const a=points[i],b=points[(i+1)%points.length];
    area += a.x*b.y - a.y*b.x;
  }
  return Math.abs(area)*0.5;
}
export function pointInPolygon(point, polygon) {
  if (!polygon.length) return false;
  let inside = false;
  for (let i=0,j=polygon.length-1;i<polygon.length;j=i++) {
    const a=polygon[i], b=polygon[j];
    if ((a.y>point.y)!==(b.y>point.y) &&
      point.x<(b.x-a.x)*(point.y-a.y)/(b.y-a.y)+a.x) inside=!inside;
  }
  return inside;
}
export function convexHull(points) {
  if(points.length<=2) return [...points];
  const sorted=[...points].sort((a,b)=>a.x-b.x||a.y-b.y);
  const cross=(o,a,b)=>(a.x-o.x)*(b.y-o.y)-(a.y-o.y)*(b.x-o.x);
  const lower=[], upper=[];
  for(const p of sorted) {
    while(lower.length>1 && cross(lower.at(-2),lower.at(-1),p)<=0)lower.pop();
    lower.push(p);
  }
  for(const p of [...sorted].reverse()) {
    while(upper.length>1 && cross(upper.at(-2),upper.at(-1),p)<=0)upper.pop();
    upper.push(p);
  }
  lower.pop(); upper.pop();
  return lower.concat(upper);
}
export function clipToFloor(polygon,{widthM,depthM}) {
  if (!polygon.length)return [];
  const hw=widthM/2,hd=depthM/2;
  const limits=[
    {inside:p=>p.x>=-hw-EPS,intersect:(a,b)=>interpolate(a,b,(-hw-a.x)/(b.x-a.x))},
    {inside:p=>p.x<=hw+EPS,intersect:(a,b)=>interpolate(a,b,(hw-a.x)/(b.x-a.x))},
    {inside:p=>p.y>=-hd-EPS,intersect:(a,b)=>interpolate(a,b,(-hd-a.y)/(b.y-a.y))},
    {inside:p=>p.y<=hd+EPS,intersect:(a,b)=>interpolate(a,b,(hd-a.y)/(b.y-a.y))},
  ];
  let result=polygon;
  for(const edge of limits) {
    const input=result;result=[];
    for(let i=0;i<input.length;i++){
      const a=input[i],b=input[(i+1)%input.length];
      const ai=edge.inside(a),bi=edge.inside(b);
      if(ai&&bi)result.push(b);
      else if(ai&&!bi)result.push(edge.intersect(a,b));
      else if(!ai&&bi)result.push(edge.intersect(a,b),b);
    }
  }
  return result;
}
function interpolate(a,b,t) {
  return {x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t};
}
export function sunPatchOnFloor(sun,room) {
  // Model window is on north-facing wall y=+depth/2; no other aperture.
  // Rays are rejected if sun is behind/below the wall or below horizon.
  if(sun.up<=EPS||sun.north<=EPS)return [];
  const wy=room.depthM/2, k=sun.north/sun.up;
  const corners=[
    {x:-room.windowWidthM/2,z:room.windowSillM},
    {x: room.windowWidthM/2,z:room.windowSillM},
    {x: room.windowWidthM/2,z:room.windowTopM},
    {x:-room.windowWidthM/2,z:room.windowTopM},
  ];
  return clipToFloor(corners.map(p=>({
    x:p.x-p.z*sun.east/sun.up,
    y:wy-p.z*k,
  })),room);
}
export function boxShadowOnFloor(sun,room) {
  if(sun.up<=EPS)return [];
  const x0=room.boxX-room.boxWidthM/2,x1=room.boxX+room.boxWidthM/2;
  const y0=room.boxY-room.boxDepthM/2,y1=room.boxY+room.boxDepthM/2;
  const points=[];
  for(const z of [0,room.boxHeightM])for(const x of [x0,x1])for(const y of [y0,y1]){
    points.push({x:x-z*sun.east/sun.up,y:y-z*sun.north/sun.up});
  }
  return clipToFloor(convexHull(points),room);
}

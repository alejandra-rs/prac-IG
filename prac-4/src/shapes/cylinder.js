const SEGMENTS = 16;

const BACK_CENTER = 2 * (SEGMENTS + 1);
const FRONT_CENTER = BACK_CENTER + 1;

export function createCylinder() {
  const vertices = [];
  for (let end = 0; end <= 1; end++) {
    for (let i = 0; i <= SEGMENTS; i++) vertices.push(...cylinderPoint(end, i));
  }
  vertices.push(0, 0, 0);
  vertices.push(1, 0, 0);

  const faces = [];
  for (let i = 0; i < SEGMENTS; i++) {
    faces.push(pointIndex(0, i), pointIndex(1, i), pointIndex(0, i + 1));
    faces.push(pointIndex(0, i + 1), pointIndex(1, i), pointIndex(1, i + 1));
    faces.push(BACK_CENTER, pointIndex(0, i), pointIndex(0, i + 1));
    faces.push(FRONT_CENTER, pointIndex(1, i), pointIndex(1, i + 1));
  }
  
  return { vertices: new Float32Array(vertices), faces: new Uint16Array(faces) };
}

function cylinderPoint(end, i) {
    const angle = (i / SEGMENTS) * 2 * Math.PI;
    return [end, 0.5 * Math.cos(angle), 0.5 * Math.sin(angle)];
  }
  
function pointIndex(end, i) {
    return end * (SEGMENTS + 1) + i;
}
  
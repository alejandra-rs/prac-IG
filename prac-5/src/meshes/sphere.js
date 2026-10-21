const LAT_BANDS = 12;
const LON_BANDS = 16;

export function createSphere() {
  const vertices = createSphereVertices();
  return {
    vertices: vertices,
    normals: vertices,
    faces: createSphereFaces(),
  };
}

function spherePoint(row, col) {
  const lat = (row / LAT_BANDS) * Math.PI;
  const lon = (col / LON_BANDS) * 2 * Math.PI;
  return [Math.sin(lat) * Math.cos(lon), Math.cos(lat), Math.sin(lat) * Math.sin(lon)];
}

function pointIndex(row, col) {
  return row * (LON_BANDS + 1) + col;
}

function createSphereVertices() {
  const vertices = [];
  for (let row = 0; row <= LAT_BANDS; row++) {
    for (let col = 0; col <= LON_BANDS; col++) {
      vertices.push(...spherePoint(row, col));
    }
  }
  return new Float32Array(vertices);
}

function createSphereFaces() {
  const faces = [];
  for (let row = 0; row < LAT_BANDS; row++) {
    for (let col = 0; col < LON_BANDS; col++) {
      faces.push(pointIndex(row, col), pointIndex(row + 1, col), pointIndex(row + 1, col + 1));
      faces.push(pointIndex(row, col), pointIndex(row, col + 1), pointIndex(row + 1, col + 1));
    }
  }
  return new Uint16Array(faces);
}

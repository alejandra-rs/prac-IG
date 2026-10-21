const LAT_BANDS = 12;
const LON_BANDS = 16;

export function createSphere() {
  return {
    vertices: createSphereVertices(),
    faces: createSphereFaces(),
    edges: createSphereEdges(),};
}

function spherePoint(row, col) {
  const lat = (row / LAT_BANDS) * Math.PI;
  const lon = (col / LON_BANDS) * 2 * Math.PI;
  return [
    0.5 * Math.sin(lat) * Math.cos(lon),
    0.5 * Math.cos(lat),
    0.5 * Math.sin(lat) * Math.sin(lon),
  ];
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
      faces.push(pointIndex(row, col), 
                 pointIndex(row + 1, col), 
                 pointIndex(row + 1, col + 1));
      faces.push(pointIndex(row, col), 
                 pointIndex(row, col + 1), 
                 pointIndex(row + 1, col + 1));
    }
  }
  return new Uint16Array(faces);
}

function createSphereEdges() {
  const edges = [];
  for (let row = 0; row < LAT_BANDS; row++) {
    for (let col = 0; col < LON_BANDS; col++) {
      edges.push(pointIndex(row, col), pointIndex(row + 1, col));
    }
  }
  return new Uint16Array(edges);
}
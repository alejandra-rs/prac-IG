const SEGMENTS = 16;
const STACKS = 8;

export function createCone() {
  const vertices = []; const normals = []; const faces = [];

  for (let row = 0; row <= STACKS; row++) {
    const y = row / STACKS;
    const radius = 1 - y;
    for (let col = 0; col <= SEGMENTS; col++) {
      const point = circlePoint(col);
      vertices.push(radius * point[0], y, radius * point[1]);
      normals.push(point[0], 1, point[1]);
    }
  }

  for (let row = 0; row < STACKS; row++) {
    for (let col = 0; col < SEGMENTS; col++) {
      faces.push(pointIndex(row, col), pointIndex(row + 1, col), pointIndex(row + 1, col + 1));
      faces.push(pointIndex(row, col), pointIndex(row, col + 1), pointIndex(row + 1, col + 1));
    }
  }

  addCircleCover(vertices, normals, faces);

  return {
    vertices: new Float32Array(vertices),
    normals: new Float32Array(normals),
    faces: new Uint16Array(faces),
  };
}

function addCircleCover(vertices, normals, faces) {
  const center = vertices.length / 3;
  vertices.push(0, 0, 0);
  normals.push(0, -1, 0);
  for (let i = 0; i <= SEGMENTS; i++) {
    const [x, z] = circlePoint(i);
    vertices.push(x, 0, z);
    normals.push(0, -1, 0);
  }
  for (let i = 0; i < SEGMENTS; i++)
    faces.push(center, center + 1 + i, center + 2 + i);
}

function circlePoint(i) {
  const angle = (i / SEGMENTS) * 2 * Math.PI;
  return [Math.cos(angle), Math.sin(angle)];
}

function pointIndex(row, col) {
  return row * (SEGMENTS + 1) + col;
}

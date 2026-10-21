const SEGMENTS = 16;

export function createCylinder() {
  const vertices = []; const normals = []; const faces = [];

  for (let end = 0; end <= 1; end++) {
    for (let i = 0; i <= SEGMENTS; i++) {
      const point = circlePoint(i);
      vertices.push(end, point[0], point[1]);
      normals.push(0, point[0], point[1]);
    }
  }

  for (let i = 0; i < SEGMENTS; i++) {
    faces.push(i, SEGMENTS + i + 1, i + 1);
    faces.push(i + 1, SEGMENTS + i + 1, SEGMENTS + i + 2);
  }

  addCircleCover(vertices, normals, faces, 0, -1);
  addCircleCover(vertices, normals, faces, 1, 1);

  return {
    vertices: new Float32Array(vertices),
    normals: new Float32Array(normals),
    faces: new Uint16Array(faces),
  };
}

function addCircleCover(vertices, normals, faces, x, normalX) {
  const center = vertices.length / 3;
  vertices.push(x, 0, 0);
  normals.push(normalX, 0, 0);
  for (let i = 0; i <= SEGMENTS; i++) {
    const [y, z] = circlePoint(i);
    vertices.push(x, y, z);
    normals.push(normalX, 0, 0);
  }
  for (let i = 0; i < SEGMENTS; i++)
    faces.push(center, center + 1 + i, center + 2 + i);
}

function circlePoint(i) {
  const angle = (i / SEGMENTS) * 2 * Math.PI;
  return [Math.cos(angle), Math.sin(angle)];
}

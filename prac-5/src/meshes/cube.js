const SIDES = [
  { direction: [0, 0, 1],  corners: [[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]] },
  { direction: [0, 0, -1], corners: [[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0]] },
  { direction: [0, 1, 0],  corners: [[0, 1, 0], [1, 1, 0], [1, 1, 1], [0, 1, 1]] },
  { direction: [0, -1, 0], corners: [[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]] },
  { direction: [1, 0, 0],  corners: [[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]] },
  { direction: [-1, 0, 0], corners: [[0, 0, 0], [0, 1, 0], [0, 1, 1], [0, 0, 1]] },
];

export function createCube() {
  const vertices = [], normals = [], faces = [];
  for (const side of SIDES) {
    const firstCornerIdx = vertices.length / 3;
    for (const corner of side.corners) {
      vertices.push(...corner);
      normals.push(...side.direction);
    }
    faces.push(firstCornerIdx, firstCornerIdx + 1, firstCornerIdx + 2, firstCornerIdx, firstCornerIdx + 2, firstCornerIdx + 3);
  }
  return {
    vertices: new Float32Array(vertices),
    normals: new Float32Array(normals),
    faces: new Uint16Array(faces),
  };
}
export const cubeVertices = new Float32Array([
  0, 0, 0,  1, 0, 0,  1, 1, 0,  0, 1, 0,
  0, 0, 1,  1, 0, 1,  1, 1, 1,  0, 1, 1,
]);

export const cubeEdgeIndices = new Uint16Array([
  0, 1,  1, 2,  2, 3,  3, 0,
  4, 5,  5, 6,  6, 7,  7, 4,
  0, 4,  1, 5,  2, 6,  3, 7,
]);

export const cubeFaceIndices = new Uint16Array([
  1, 0, 3,  1, 3, 2,
  4, 5, 6,  4, 6, 7,
  7, 6, 2,  7, 2, 3,
  0, 1, 5,  0, 5, 4,
  5, 1, 2,  5, 2, 6,
  0, 4, 7,  0, 7, 3,
]);

const CIRCLE_SEGMENTS = 96;

export function createCircleVertices() {
  const vertices = new Float32Array(CIRCLE_SEGMENTS * 3);
  for (let i = 0; i < CIRCLE_SEGMENTS; i++) {
    const angle = (i * 2 * Math.PI) / CIRCLE_SEGMENTS;
    vertices[3 * i] = Math.cos(angle);
    vertices[3 * i + 1] = Math.sin(angle);
    vertices[3 * i + 2] = 0;
  }
  return vertices;
}

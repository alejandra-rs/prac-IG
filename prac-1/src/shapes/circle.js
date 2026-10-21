const SEGMENTS = 32;
const circleVertices = new Float32Array((SEGMENTS + 2) * 2);

export function drawCircle(gl, colorLocation, center, radius, aspect, color) {
  const radiusX = radius / aspect;

  circleVertices[0] = center[0];
  circleVertices[1] = center[1];

  for (var i = 1; i <= SEGMENTS + 1; i++) {
    const angle = (i / SEGMENTS) * 2 * Math.PI;
    circleVertices[2 * i] = center[0] + radiusX * Math.cos(angle);
    circleVertices[2 * i + 1] = center[1] + radius * Math.sin(angle);
  }

  gl.bufferData(gl.ARRAY_BUFFER, circleVertices, gl.DYNAMIC_DRAW);
  gl.uniform4fv(colorLocation, color);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, SEGMENTS + 2);
}

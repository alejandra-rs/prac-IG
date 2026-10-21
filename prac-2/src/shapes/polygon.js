const IDENTITY = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);

let matrixLocation = null;

export function buildM(angle, aspect, offsetX, offsetY) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return new Float32Array([
    cos / aspect,
    sin,
    0,
    -sin / aspect,
    cos,
    0,
    offsetX,
    offsetY,
    1,
  ]);
}

export function drawPolygon(
  gl,
  colorLocation,
  vertices,
  color,
  matrix = IDENTITY
) {
  if (!matrixLocation)
    matrixLocation = gl.getUniformLocation(
      gl.getParameter(gl.CURRENT_PROGRAM),
      "uMatrix"
    );
  gl.uniformMatrix3fv(matrixLocation, false, matrix);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
  gl.uniform4fv(colorLocation, color);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, vertices.length / 2);
}

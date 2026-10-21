const squareVertices = new Float32Array([
  -0.5, 0.5, 0.5, 0.5, -0.5, -0.5, -0.5, -0.5, 0.5, 0.5, 0.5, -0.5,
]);

export function drawSquare(gl) {
  gl.bufferData(gl.ARRAY_BUFFER, squareVertices, gl.STATIC_DRAW);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

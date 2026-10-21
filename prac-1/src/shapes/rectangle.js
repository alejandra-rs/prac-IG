const rectVertices = new Float32Array(12);

export function drawRectangle(gl, colorLocation, coords, width, height, color) {
  var x1 = coords[0];
  var x2 = coords[0] + width;
  var y1 = coords[1];
  var y2 = coords[1] + height;

  rectVertices[0] = x1;
  rectVertices[1] = y1;
  rectVertices[2] = x2;
  rectVertices[3] = y1;
  rectVertices[4] = x1;
  rectVertices[5] = y2;
  rectVertices[6] = x1;
  rectVertices[7] = y2;
  rectVertices[8] = x2;
  rectVertices[9] = y1;
  rectVertices[10] = x2;
  rectVertices[11] = y2;

  gl.bufferData(gl.ARRAY_BUFFER, rectVertices, gl.STATIC_DRAW);

  gl.uniform4fv(colorLocation, color);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

import { celestialBodies } from "./objects";
import { resetTransforms, renderBody } from "./render";

export function createWebGLContext(canvasId) {
  const canvas = document.getElementById(canvasId);
  const gl = canvas.getContext("webgl2", { antialias: true });
  if (!gl) console.error("WebGL 2 not supported!");
  return { gl, canvas };
}

export function createProgramFrom(gl, vertSource, fragSource) {
  const vertShader = compileShader(gl, gl.VERTEX_SHADER, vertSource);
  const fragShader = compileShader(gl, gl.FRAGMENT_SHADER, fragSource);

  const program = gl.createProgram();
  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

export function setupAttributes(gl, program, attribName, size, data) {
  const vertexArray = gl.createVertexArray();
  gl.bindVertexArray(vertexArray);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  const location = gl.getAttribLocation(program, attribName);
  gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(location);

  gl.bindVertexArray(null);
  return { vertexArray, count: data.length / size };
}

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.log("shader error: " + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function render(gl, colorLocation, modelMatrixLoc, canvas, meshes) {
  gl.clearColor(0.1, 0.1, 0.2, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.viewport(0, 0, canvas.width, canvas.height);
  const aspect = canvas.width / canvas.height;

  resetTransforms(aspect);
  celestialBodies.forEach((b) =>
    renderBody(gl, colorLocation, modelMatrixLoc, meshes, b)
  );

  window.requestAnimationFrame(() =>
    render(gl, colorLocation, modelMatrixLoc, canvas, meshes)
  );
}

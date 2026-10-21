import { fog } from "./config.js";
import { setupCamera } from "./render/core.js";
import { renderScene } from "./render/renderScene.js";
import { updatePlayer } from "./player.js";
import { setupLights } from "./render/lights.js";

const MAX_DT = 0.05;
let lastTime = performance.now();

export function createWebGLContext(canvasId) {
  const canvas = document.getElementById(canvasId);
  const gl = canvas.getContext("webgl2", { antialias: true });
  if (!gl) console.error("WebGL2 not supported");
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

export function setupMesh(gl, program, vertices, normals, faces) {
  const vertexArray = gl.createVertexArray();
  gl.bindVertexArray(vertexArray);

  setupAttribute(gl, program, "aCoordinates", vertices);
  setupAttribute(gl, program, "aVertexNormals", normals);

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, faces, gl.STATIC_DRAW);

  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  return {
    vertexArray,
    count: faces.length,
    indexType: faces instanceof Uint32Array ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT,
  };
}

function setupAttribute(gl, program, attribName, data) {
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  const location = gl.getAttribLocation(program, attribName);
  gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(location)
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

export function render(gl, canvas, meshes, uniforms, now = performance.now()) {
  const dt = Math.min((now - lastTime) / 1000, MAX_DT);
  lastTime = now;

  updatePlayer(dt);

  gl.clearColor(...fog.color, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.viewport(0, 0, canvas.width, canvas.height);

  setupCamera(gl, uniforms, canvas.width / canvas.height);
  setupLights(gl, uniforms);
  renderScene(gl, uniforms, meshes);

  window.requestAnimationFrame((time) => render(gl, canvas, meshes, uniforms, time));
}
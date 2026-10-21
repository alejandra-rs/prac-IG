import { drawCircle } from "./shapes/circle.js";

const BASE_GRAVITY = -0.0018;
const RESTITUTION = 0.75;
const FLOOR_Y = -0.8;
const RADIUS = 0.1;

export function createWebGLContext(canvasId) {
  const canvas = document.getElementById(canvasId);
  const gl = canvas.getContext("webgl2");
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

export function setupAttributes(gl, program, attribName, size) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

  const location = gl.getAttribLocation(program, attribName);
  gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(location);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  return buffer;
}

export function render(gl, colorLocation, canvas, vertexBuffer, planets) {
  gl.clearColor(0.1, 0.1, 0.2, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.viewport(0, 0, canvas.width, canvas.height);
  const aspect = canvas.width / canvas.height;

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  for (const planet of planets) {
    planet.vy += BASE_GRAVITY * planet.relativeG;
    planet.y += planet.vy;

    if (planet.y < FLOOR_Y) {
      planet.y = FLOOR_Y;
      planet.vy = -planet.vy * RESTITUTION;
    }

    drawCircle(
      gl,
      colorLocation,
      [planet.x, planet.y],
      RADIUS,
      aspect,
      planet.color
    );
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  window.requestAnimationFrame(() =>
    render(gl, colorLocation, canvas, vertexBuffer, planets)
  );
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

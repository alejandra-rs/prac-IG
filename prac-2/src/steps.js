import { moveCollector, moveBall, drawPegs, moveCanyon } from "./render.js";
import { hasBalls } from "./objects.js";
import { hasSpecialPegs } from "./pegs.js";

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

export function render(
  timeStamp,
  lastTimestamp,
  gl,
  colorLocation,
  canvas,
  vertexBuffer,
  onGameEnd
) {
  if (!hasBalls() || !hasSpecialPegs()) {
    document.getElementById("endMessage").textContent = hasBalls()
      ? "Bien jugado!"
      : "Inténtalo de nuevo";
    document.getElementById("endScreen").classList.remove("hidden");
    onGameEnd();
    return;
  }

  gl.clearColor(0.9, 0.95, 1, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.viewport(0, 0, canvas.width, canvas.height);
  const aspect = canvas.width / canvas.height;
  const deltaTime = (timeStamp - lastTimestamp) / 1000;

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  moveCollector(gl, colorLocation, aspect, deltaTime);
  moveBall(gl, colorLocation, aspect, deltaTime);
  moveCanyon(gl, colorLocation, aspect, deltaTime);
  drawPegs(gl, colorLocation, aspect);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  window.requestAnimationFrame((nextTimeStamp) =>
    render(
      nextTimeStamp,
      timeStamp,
      gl,
      colorLocation,
      canvas,
      vertexBuffer,
      onGameEnd
    )
  );
}

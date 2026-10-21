import { COLORS, player } from "./config.js";
import { setupCamera, renderCave } from "./render/core.js";
import { renderCoins } from "./render/renderCoins.js";
import { renderPufferfish } from "./render/renderPufferfish.js";
import { updatePlayer } from "./entities/player.js";
import { updateCoins, score, N_COINS } from "./entities/coin.js";
import { updatePufferfish } from "./entities/pufferfish.js";
import { updateTorpedoes } from "./entities/torpedoes.js";
import { renderTorpedoes } from "./render/renderTorpedoes.js";

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

export function setupAttributes(gl, program, attribName, size, data, indices) {
  const vertexArray = gl.createVertexArray();
  gl.bindVertexArray(vertexArray);

  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  const location = gl.getAttribLocation(program, attribName);
  gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(location);

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  return {
    vertexArray,
    count: indices.length,
    indexType: indices instanceof Uint32Array ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT,
  };
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
  if (score >= N_COINS || player.lives <= 0) {
    showEndScreen();
    return;
  }
  const dt = Math.min((now - lastTime) / 1000, MAX_DT);
  lastTime = now;

  updatePlayer(dt);
  updateCoins();
  updatePufferfish(dt);
  updateTorpedoes(dt);
  document.getElementById("score").textContent = `${score} / ${N_COINS}`;
  document.getElementById("lives").innerHTML = '<span class="life"></span>'.repeat(player.lives);

  gl.clearColor(...COLORS.background);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.viewport(0, 0, canvas.width, canvas.height);

  setupCamera(gl, uniforms, canvas.width / canvas.height);
  renderCave(gl, uniforms, meshes);
  renderCoins(gl, uniforms, meshes);
  renderPufferfish(gl, uniforms, meshes);
  renderTorpedoes(gl, uniforms, meshes);

  window.requestAnimationFrame((time) => render(gl, canvas, meshes, uniforms, time));
}

function showEndScreen() {
  document.getElementById("endTitle").textContent = score >= N_COINS ? "¡HAS GANADO!" : "GAME OVER";
  document.getElementById("endText").textContent = `Monedas: ${score} / ${N_COINS}`;
  document.getElementById("endScreen").classList.remove("hidden");
}
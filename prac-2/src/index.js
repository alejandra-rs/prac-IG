import { vertexShaderSource, fragmentShaderSource } from "./shaders.js";
import {
  createWebGLContext,
  createProgramFrom,
  setupAttributes,
  render,
} from "./steps.js";
import { getBallsLeft, TOTAL_BALLS, resetGame } from "./objects.js";
import { resetPegs } from "./pegs.js";
import {
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onLaunchRequested,
} from "./interaction.js";

let gameRunning = true;

function onGameEnd() {
  gameRunning = false;
}

function init() {
  const { gl, canvas } = createWebGLContext("my_Canvas");

  canvas.addEventListener("touchstart", onTouchStart, { passive: false });
  canvas.addEventListener("touchmove", onTouchMove, { passive: false });
  canvas.addEventListener("touchend", onTouchEnd, { passive: false });

  const shaderProgram = createProgramFrom(
    gl,
    vertexShaderSource,
    fragmentShaderSource
  );
  gl.useProgram(shaderProgram);

  const vertexBuffer = setupAttributes(gl, shaderProgram, "aCoordinates", 2);
  const colorLocation = gl.getUniformLocation(shaderProgram, "uColor");

  render(0, 0, gl, colorLocation, canvas, vertexBuffer, onGameEnd);

  document.getElementById("replayButton").addEventListener("click", () => {
    if (gameRunning) return;
    gameRunning = true;

    resetGame();
    resetPegs();
    document.getElementById("endScreen").classList.add("hidden");
    render(
      performance.now(),
      performance.now(),
      gl,
      colorLocation,
      canvas,
      vertexBuffer,
      onGameEnd
    );
  });

  document
    .getElementById("launchButton")
    .addEventListener("click", onLaunchRequested);
}

init();

document.getElementById("ballsLeft").textContent = getBallsLeft();
document.getElementById("totalBalls").textContent = TOTAL_BALLS;

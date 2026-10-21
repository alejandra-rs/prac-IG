import { vertexShaderSource, fragmentShaderSource } from "./shaders.js";
import {
  createWebGLContext,
  createProgramFrom,
  setupAttributes,
  render,
} from "./presteps.js";
import { PLANETS } from "./planets.js";
import { resetPlanets, buildLegend } from "./pagecontent.js";

function init() {
  const { gl, canvas } = createWebGLContext("my_Canvas");

  const shaderProgram = createProgramFrom(
    gl,
    vertexShaderSource,
    fragmentShaderSource
  );
  gl.useProgram(shaderProgram);

  const vertexBuffer = setupAttributes(gl, shaderProgram, "aCoordinates", 2);
  const colorLocation = gl.getUniformLocation(shaderProgram, "uColor");

  render(gl, colorLocation, canvas, vertexBuffer, PLANETS);

  document
    .getElementById("resetButton")
    .addEventListener("click", () => resetPlanets(PLANETS));
  buildLegend(PLANETS);
}

init();

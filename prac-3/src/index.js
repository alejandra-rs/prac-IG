import { vertexShaderSource, fragmentShaderSource } from "./shaders.js";
import {
  createWebGLContext,
  createProgramFrom,
  setupAttributes,
  render,
} from "./steps.js";
import { createGUI } from "./interaction.js";
import { createSphereVertices } from "./shapes/sphere.js";
import { createCircleVertices } from "./shapes/circle.js";

function init() {
  const { gl, canvas } = createWebGLContext("my_Canvas");
  createGUI(canvas);

  const shaderProgram = createProgramFrom(gl, vertexShaderSource, fragmentShaderSource);
  gl.useProgram(shaderProgram);
  gl.enable(gl.DEPTH_TEST);

  const sphereArray = setupAttributes(gl, shaderProgram, "aCoordinates", 3, createSphereVertices());
  const circleArray = setupAttributes(gl, shaderProgram, "aCoordinates", 3, createCircleVertices());

  const colorLocation = gl.getUniformLocation(shaderProgram, "uColor");
  const modelMatrixLoc = gl.getUniformLocation(shaderProgram, "uModelMatrix");

  render(gl, colorLocation, modelMatrixLoc, canvas, {
    sphere: sphereArray,
    circle: circleArray,
  });
}

init();

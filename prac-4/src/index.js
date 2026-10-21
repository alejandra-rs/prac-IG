import { vertexShaderSource, fragmentShaderSource } from "./shaders.js";
import {
  createWebGLContext,
  createProgramFrom,
  setupAttributes,
  render,
} from "./steps.js";
import { addEventListeners } from "./interaction.js";
import { createCaveMesh } from "./shapes/caveMesh.js";
import { createSphere } from "./shapes/sphere.js"
import { cubeVertices, cubeFaceIndices } from "./shapes/cube.js";
import { createCylinder } from "./shapes/cylinder.js";

function init() {
  const { gl, canvas } = createWebGLContext("my_Canvas");
  addEventListeners();

  const shaderProgram = createProgramFrom(gl, vertexShaderSource, fragmentShaderSource);
  gl.useProgram(shaderProgram);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.POLYGON_OFFSET_FILL);
  gl.polygonOffset(1, 1);

  const cave = createCaveMesh();
  const sphere = createSphere();
  const cylinder = createCylinder();
  
  const meshes = {
    caveFaces: setupAttributes(gl, shaderProgram, "aCoordinates", 3, cave.vertices, cave.faces),
    caveEdges: setupAttributes(gl, shaderProgram, "aCoordinates", 3, cave.vertices, cave.edges),
    sphereFaces: setupAttributes(gl, shaderProgram, "aCoordinates", 3, sphere.vertices, sphere.faces),
    sphereEdges: setupAttributes(gl, shaderProgram, "aCoordinates", 3, sphere.vertices, sphere.edges),
    cubeFaces: setupAttributes(gl, shaderProgram, "aCoordinates", 3, cubeVertices, cubeFaceIndices),
    cylinderFaces: setupAttributes(gl, shaderProgram, "aCoordinates", 3, cylinder.vertices, cylinder.faces),
  };

  const uniforms = {
    color: gl.getUniformLocation(shaderProgram, "uColor"),
    model: gl.getUniformLocation(shaderProgram, "uModelMatrix"),
    view: gl.getUniformLocation(shaderProgram, "uViewMatrix"),
    fogColor: gl.getUniformLocation(shaderProgram, "uFogColor"),
    fogDistance: gl.getUniformLocation(shaderProgram, "uFogDistance"),
  };

  render(gl, canvas, meshes, uniforms);
}

init();

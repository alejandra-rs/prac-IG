import { createWebGLContext, createProgramFrom, setupMesh, render } from "./steps.js";
import { addEventListeners } from "./interaction.js";
import { createSphere } from "./meshes/sphere.js"
import { createCylinder } from "./meshes/cylinder.js";
import { createCube } from "./meshes/cube.js";
import { createCone } from "./meshes/cone.js";
import { createTent } from "./meshes/tent.js";
import { vertexShaderSource } from "./shaders/vertexShader.js";
import { fragmentShaderSource } from "./shaders/fragmentShader.js";
import { createGUI } from "./gui.js"

function init() {
  const { gl, canvas } = createWebGLContext("my_Canvas");
  addEventListeners();

  const shaderProgram = createProgramFrom(gl, vertexShaderSource, fragmentShaderSource);
  gl.useProgram(shaderProgram);
  gl.enable(gl.DEPTH_TEST);

  const sphere = createSphere();
  const cylinder = createCylinder();
  const cube = createCube();
  const cone = createCone();
  const tent = createTent();

  const meshes = {
    sphere: setupMesh(gl, shaderProgram, sphere.vertices, sphere.normals, sphere.faces),
    cylinder: setupMesh(gl, shaderProgram, cylinder.vertices, cylinder.normals, cylinder.faces),
    cube: setupMesh(gl, shaderProgram, cube.vertices, cube.normals, cube.faces),
    cone: setupMesh(gl, shaderProgram, cone.vertices, cone.normals, cone.faces),
    tent: setupMesh(gl, shaderProgram, tent.vertices, tent.normals, tent.faces)
  };

  const location = (name) => gl.getUniformLocation(shaderProgram, name);
  const uniforms = {
    model: location("uModelMatrix"),
    view: location("uViewMatrix"),
    normal: location("uNormalMatrix"),
    ambientWeight: location("uAmbientWeight"),
    diffuseWeight: location("uDiffuseWeight"),
    specularWeight: location("uSpecularWeight"),
    shininessScale: location("uShininessScale"),
    ambient: location("uAmbientMaterial"),
    diffuse: location("uDiffuseMaterial"),
    specular: location("uSpecularMaterial"),
    shininess: location("uShininess"),
    lightPositions: location("uLightPositions"),
    lightColors: location("uLightColors"),
    moonDirection: location("uMoonDirection"),
    moonColor: location("uMoonColor"),
    torchColor: location("uTorchColor"),
    torchInner: location("uTorchInner"),
    torchOuter: location("uTorchOuter"),
    attenuation: location("uAttenuation"),
    fogColor: location("uFogColor"),
    fogDistance: location("uFogDistance"),
  };

  createGUI();
  render(gl, canvas, meshes, uniforms);
}

init();

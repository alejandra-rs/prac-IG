import { mat4 } from "gl-matrix";
import { glPushMatrix, glPopMatrix, modelMatrix, drawMesh } from "./core.js";
import { MATERIALS } from "../config.js";

export const POST = { height: 0.5, radius: 0.03 };
const BULB = { radius: 0.08 };

export function renderLamp(gl, uniforms, meshes) {
  renderPost(gl, uniforms, meshes);
  renderBulb(gl, uniforms, meshes);
}

function renderPost(gl, uniforms, meshes) {
  glPushMatrix();
  mat4.rotateZ(modelMatrix, modelMatrix, Math.PI / 2);
  mat4.scale(modelMatrix, modelMatrix, [POST.height, POST.radius, POST.radius]);
  drawMesh(gl, uniforms, meshes.cylinder, MATERIALS.metal);
  glPopMatrix();
}

function renderBulb(gl, uniforms, meshes) {
  glPushMatrix();
  mat4.translate(modelMatrix, modelMatrix, [0, POST.height + 0.9 * BULB.radius, 0]);
  mat4.scale(modelMatrix, modelMatrix, [BULB.radius, BULB.radius, BULB.radius]);
  drawMesh(gl, uniforms, meshes.sphere, MATERIALS.lightBulb);
  glPopMatrix();
}

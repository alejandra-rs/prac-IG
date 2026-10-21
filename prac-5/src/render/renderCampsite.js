import { mat4 } from "gl-matrix";
import { TENT, LOG, FIRE, POT } from "../world/campsite.js";
import { glPushMatrix, glPopMatrix, modelMatrix, drawMesh } from "./core.js";
import { MATERIALS } from "../config.js";

const N_FIRE_STONES = 10;
const FIRE_STICK = { length: 0.5, radius: 0.05 };
const FLAME = { radius: 0.16, height: 0.45 };
const POT_HANDLE = { length: 0.015, radius: 0.06 }

export function renderTent(gl, uniforms, meshes) {
  glPushMatrix();
    mat4.translate(modelMatrix, modelMatrix, [0, 0.02, 0]);
    mat4.scale(modelMatrix, modelMatrix, [TENT.halfWidth, TENT.height, TENT.length]);
    drawMesh(gl, uniforms, meshes.tent, MATERIALS.canvas);
  glPopMatrix();
}

export function renderLog(gl, uniforms, meshes) {
  glPushMatrix();
    mat4.translate(modelMatrix, modelMatrix, [0, LOG.radius, 0]);
    mat4.scale(modelMatrix, modelMatrix, [LOG.length, LOG.radius, LOG.radius]);
    mat4.translate(modelMatrix, modelMatrix, [-0.5, 0, 0]);
    drawMesh(gl, uniforms, meshes.cylinder, MATERIALS.wood);
  glPopMatrix();
}

export function renderFire(gl, uniforms, meshes) {
  renderStones(gl, uniforms, meshes);
  renderSticks(gl, uniforms, meshes);
  renderFlame(gl, uniforms, meshes);
}

function renderStones(gl, uniforms, meshes) {
  const stonesRadius = FIRE.radius * 0.9;
  for (let i = 0; i < N_FIRE_STONES; i++) {
    const angle = (i / N_FIRE_STONES) * 2 * Math.PI;
    glPushMatrix();
      mat4.translate(modelMatrix, modelMatrix, [stonesRadius * Math.cos(angle), 0.03, stonesRadius * Math.sin(angle)]);
      mat4.scale(modelMatrix, modelMatrix, [0.08, 0.06, 0.08]);
      drawMesh(gl, uniforms, meshes.sphere, MATERIALS.stone);
    glPopMatrix();
  }
}

function renderSticks(gl, uniforms, meshes) {
  for (const angle of [Math.PI / 4, -Math.PI / 4]) {
    glPushMatrix();
      mat4.rotateY(modelMatrix, modelMatrix, angle);
      mat4.translate(modelMatrix, modelMatrix, [0, FIRE_STICK.radius, 0]);
      mat4.scale(modelMatrix, modelMatrix, [FIRE_STICK.length, FIRE_STICK.radius, FIRE_STICK.radius]);
      mat4.translate(modelMatrix, modelMatrix, [-0.5, 0, 0]);
      drawMesh(gl, uniforms, meshes.cylinder, MATERIALS.wood);
    glPopMatrix();
  }
}

function renderFlame(gl, uniforms, meshes) {
  glPushMatrix();
    mat4.translate(modelMatrix, modelMatrix, [0, FIRE_STICK.radius, 0]);
    mat4.scale(modelMatrix, modelMatrix, [FLAME.radius, FLAME.height, FLAME.radius]);
    drawMesh(gl, uniforms, meshes.cone, MATERIALS.flame);
  glPopMatrix();
}

export function renderPot(gl, uniforms, meshes) {
  renderPotBody(gl, uniforms, meshes);
  renderHandle(gl, uniforms, meshes);
  glPushMatrix();
    mat4.rotateY(modelMatrix, modelMatrix, Math.PI);
    renderHandle(gl, uniforms, meshes);
  glPopMatrix();
}

function renderPotBody(gl, uniforms, meshes) {
  glPushMatrix();
    mat4.rotateZ(modelMatrix, modelMatrix, Math.PI / 2);
    mat4.scale(modelMatrix, modelMatrix, [POT.height, POT.radius, POT.radius]);
    drawMesh(gl, uniforms, meshes.cylinder, MATERIALS.metal);
  glPopMatrix();
}

function renderHandle(gl, uniforms, meshes) {
  glPushMatrix();
    mat4.rotateZ(modelMatrix, modelMatrix, Math.PI / 2);
    mat4.translate(modelMatrix, modelMatrix, [POT.height - 0.05, POT.height * 0.8 - POT_HANDLE.radius, 0]);
    mat4.scale(modelMatrix, modelMatrix, [POT_HANDLE.length, POT_HANDLE.radius, POT_HANDLE.radius]);
    drawMesh(gl, uniforms, meshes.cylinder, MATERIALS.metal);
  glPopMatrix();
}
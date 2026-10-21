import { mat4 } from "gl-matrix";
import { COLORS } from "../config.js";
import { pufferfish } from "../entities/pufferfish.js";
import { glPushMatrix, glPopMatrix, modelMatrix, drawMesh } from "./core.js";

const SPIKE_LENGTH = 0.15;
const SPIKE_WIDTH = 0.03;
const SPIKE_ROWS = [-60, -30, 0, 30, 60];
const SPIKES_PER_ROW = 12;
const FISH_EYE_SIZE = 0.2;
const FISH_EYE_POS = [0.4, 0.15, 0.2]

export function renderPufferfish(gl, uniforms, meshes) {
  for (const fish of pufferfish) {
      glPushMatrix();
        mat4.translate(modelMatrix, modelMatrix, fish.position);
        mat4.rotateY(modelMatrix, modelMatrix, fish.angle);
        mat4.scale(modelMatrix, modelMatrix, [fish.size, fish.size, fish.size]);
        drawMesh(gl, uniforms, meshes.sphereFaces, gl.TRIANGLES, COLORS.fishBody);
        renderSpikes(gl, uniforms, meshes);
        renderEye(gl, uniforms, meshes, -1);
        renderEye(gl, uniforms, meshes, 1);
      glPopMatrix();
    }
}

function renderSpikes(gl, uniforms, meshes) {
  for (const angle of SPIKE_ROWS) {
    for (let i = 0; i < SPIKES_PER_ROW; i++) {
      renderSpike(gl, uniforms, meshes, (360 / SPIKES_PER_ROW) * i, angle);
    }
  }
  renderSpike(gl, uniforms, meshes, 0, 90);
  renderSpike(gl, uniforms, meshes, 0, -90);
}

function renderSpike(gl, uniforms, meshes, row, angle) {
  glPushMatrix();
    mat4.rotateY(modelMatrix, modelMatrix, row * Math.PI / 180);
    mat4.rotateZ(modelMatrix, modelMatrix, angle * Math.PI / 180);
    mat4.translate(modelMatrix, modelMatrix, [0.45, 0, 0]);
    mat4.scale(modelMatrix, modelMatrix, [SPIKE_LENGTH, SPIKE_WIDTH, SPIKE_WIDTH]);
    mat4.translate(modelMatrix, modelMatrix, [0, -0.5, -0.5]);
    drawMesh(gl, uniforms, meshes.cubeFaces, gl.TRIANGLES, COLORS.fishSpikes);
  glPopMatrix();
}

function renderEye(gl, uniforms, meshes, side) {
  glPushMatrix();
    mat4.translate(modelMatrix, modelMatrix, [FISH_EYE_POS[0], FISH_EYE_POS[1], FISH_EYE_POS[2] * side]);
    mat4.scale(modelMatrix, modelMatrix, [FISH_EYE_SIZE, FISH_EYE_SIZE, FISH_EYE_SIZE]);
    mat4.translate(modelMatrix, modelMatrix, [0.4, 0, 0]);
    mat4.scale(modelMatrix, modelMatrix, [0.5, 0.5, 0.5]);
    drawMesh(gl, uniforms, meshes.sphereFaces, gl.TRIANGLES, COLORS.fishEyes);
  glPopMatrix();
}
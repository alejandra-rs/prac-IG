import { mat4 } from "gl-matrix";
import { MATERIALS } from "../config.js";
import { glPushMatrix, glPopMatrix, modelMatrix, drawMesh } from "./core.js";
import { findCells, translateToCoords } from "../world/world.js";
import { CELL } from "../world/map.js";
import { renderTree } from "./renderTree.js";
import { renderLamp } from "./renderLamp.js";
import { ENTITIES } from "../world/entities.js";
import { renderFire, renderTent, renderLog, renderPot } from "./renderCampsite.js";

const MAP_SIZE = 25;

const DRAW = {
  tree: renderTree,
  lamp: renderLamp,
  fire: renderFire,
  tent: renderTent,
  log: renderLog,
  pot: renderPot,
};

export function renderScene(gl, uniforms, meshes) {
  renderGround(gl, uniforms, meshes);
  renderTiles(gl, uniforms, meshes, CELL.PATH, MATERIALS.dirt);
  renderTiles(gl, uniforms, meshes, CELL.CAMP, MATERIALS.dirt);
  renderEntities(gl, uniforms, meshes);
}

function renderGround(gl, uniforms, meshes) {
  glPushMatrix();
    mat4.translate(modelMatrix, modelMatrix, [-MAP_SIZE / 2, -0.1, -MAP_SIZE / 2,]);
    mat4.scale(modelMatrix, modelMatrix, [MAP_SIZE, 0.1, MAP_SIZE]);
    drawMesh(gl, uniforms, meshes.cube, MATERIALS.grass);
  glPopMatrix();
}

function renderTiles(gl, uniforms, meshes, type, material) {
  for (const cell of findCells(type)) {
    const coords = translateToCoords(...cell);
    glPushMatrix();
      mat4.translate(modelMatrix, modelMatrix, [coords[0] - 0.5, 0, coords[2] - 0.5]);
      mat4.scale(modelMatrix, modelMatrix, [1, 0.01, 1]);
      drawMesh(gl, uniforms, meshes.cube, material);
    glPopMatrix();
  }
}

export function renderEntities(gl, uniforms, meshes) {
  for (const entity of ENTITIES) {
    glPushMatrix();
      mat4.translate(modelMatrix, modelMatrix, [entity.x, 0, entity.z]);
      mat4.rotateY(modelMatrix, modelMatrix, entity.angle);
      mat4.scale(modelMatrix, modelMatrix, entity.scale);
      DRAW[entity.type](gl, uniforms, meshes);
    glPopMatrix();
  }
}

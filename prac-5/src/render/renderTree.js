import { mat4 } from "gl-matrix";
import { glPushMatrix, glPopMatrix, modelMatrix, drawMesh } from "./core";
import { MATERIALS } from "../config";

const TRUNK = { height: 0.6, radius: 0.1 };

const LEAF_LAYERS = [
  { y: 0.4, radius: 0.5, height: 0.7 },
  { y: 0.8, radius: 0.4, height: 0.6 },
  { y: 1.15, radius: 0.28, height: 0.5 },
];

export function renderTree(gl, uniforms, meshes) {
  renderTrunk(gl, uniforms, meshes);
  for (const layer of LEAF_LAYERS) renderLeafLayer(gl, uniforms, meshes, layer);
}

function renderTrunk(gl, uniforms, meshes) {
  glPushMatrix();
    mat4.rotateZ(modelMatrix, modelMatrix, Math.PI / 2);
    mat4.scale(modelMatrix, modelMatrix, [TRUNK.height, TRUNK.radius, TRUNK.radius]);
    drawMesh(gl, uniforms, meshes.cylinder, MATERIALS.wood);
  glPopMatrix();
}

function renderLeafLayer(gl, uniforms, meshes, layer) {
  glPushMatrix();
    mat4.translate(modelMatrix, modelMatrix, [0, layer.y, 0]);
    mat4.scale(modelMatrix, modelMatrix, [layer.radius, layer.height, layer.radius]);
    drawMesh(gl, uniforms, meshes.cone, MATERIALS.leaves);
  glPopMatrix();
}

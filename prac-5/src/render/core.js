import { mat3, mat4, vec3 } from "gl-matrix";
import { camera, fog, player } from "../config.js";
import { playerToWorldSystem } from "../player.js";

export const modelMatrix = mat4.create();
export const viewMatrix = mat4.create();
export const matrixStack = [];
const normalMatrix = mat3.create();

export function setupCamera(gl, uniforms, aspect) {
  mat4.perspective(viewMatrix, camera.fov, aspect, camera.near, camera.far);
  gl.uniformMatrix4fv(uniforms.view, false, viewMatrix);
  gl.uniform3fv(uniforms.fogColor, fog.color);
  gl.uniform1f(uniforms.fogDistance, fog.distance);

  mat4.lookAt(modelMatrix, 
              player.position, 
              vec3.add(vec3.create(), player.position, playerToWorldSystem([0, 0, -1])), 
              playerToWorldSystem([0, 1, 0]));
}

export function drawMesh(gl, uniforms, mesh, material) {
  gl.uniformMatrix4fv(uniforms.model, false, modelMatrix);

  mat3.normalFromMat4(normalMatrix, modelMatrix);
  gl.uniformMatrix3fv(uniforms.normal, false, normalMatrix);

  setMaterial(gl, uniforms, material);

  gl.bindVertexArray(mesh.vertexArray);
  gl.drawElements(gl.TRIANGLES, mesh.count, mesh.indexType, 0);
  gl.bindVertexArray(null);
}

function setMaterial(gl, uniforms, material) {
  gl.uniform3fv(uniforms.ambient, material.ambient);
  gl.uniform3fv(uniforms.diffuse, material.diffuse);
  gl.uniform3fv(uniforms.specular, material.specular);
  gl.uniform1f(uniforms.shininess, material.shininess);
}

export function glPushMatrix() {
  matrixStack.push(mat4.clone(modelMatrix));
}

export function glPopMatrix() {
  mat4.copy(modelMatrix, matrixStack.pop());
}

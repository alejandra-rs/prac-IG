import { mat4, vec3 } from "gl-matrix";
import { camera, fog, player, COLORS } from "../config.js";
import { playerToWorldSystem } from "../entities/player.js";

export const modelMatrix = mat4.create();
export const viewMatrix = mat4.create();
export const matrixStack = [];

export function drawMesh(gl, uniforms, mesh, mode, color) {
    gl.uniformMatrix4fv(uniforms.model, false, modelMatrix);
    gl.uniform4fv(uniforms.color, color);
  
    gl.bindVertexArray(mesh.vertexArray);
    gl.drawElements(mode, mesh.count, mesh.indexType, 0);
    gl.bindVertexArray(null);
}

export function glPushMatrix() {
    matrixStack.push(mat4.clone(modelMatrix));
  }
  
export function glPopMatrix() {
    mat4.copy(modelMatrix, matrixStack.pop());
}

export function setupCamera(gl, uniforms, aspect) {
    mat4.perspective(viewMatrix, camera.fov, aspect, camera.near, camera.far);
    gl.uniformMatrix4fv(uniforms.view, false, viewMatrix);
    gl.uniform3fv(uniforms.fogColor, fog.color);
    gl.uniform1f(uniforms.fogDistance, fog.distance);
  
    const eye = player.position;
    const center = vec3.add(vec3.create(), eye, playerToWorldSystem([0, 0, -1]));
    const up = playerToWorldSystem([0, 1, 0]);
    mat4.lookAt(modelMatrix, eye, center, up);
}
  
export function renderCave(gl, uniforms, meshes) {
    drawMesh(gl, uniforms, meshes.caveFaces, gl.TRIANGLES, COLORS.rock);
    drawMesh(gl, uniforms, meshes.caveEdges, gl.LINES, COLORS.edges);
}

  
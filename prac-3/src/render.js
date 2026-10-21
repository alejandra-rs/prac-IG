import { mat4, vec3 } from "gl-matrix";
import { settings } from "./objects.js";

const ORBIT_COLOR = [0.3, 0.3, 0.5, 1];

const modelMatrix = mat4.create();
const matrixStack = [];

const followPosition = vec3.create();
const inverseView = mat4.create();

export function resetTransforms(aspect) {
  if (settings.follow === "Ninguno") vec3.set(followPosition, 0, 0, 0);

  mat4.ortho(modelMatrix, -aspect, aspect, -1, 1, -10, 10);
  mat4.scale(modelMatrix, modelMatrix, [1 + settings.zoom, 1 + settings.zoom, 1 + settings.zoom]);
  mat4.translate(modelMatrix, modelMatrix, [settings.translateX, settings.translateY, 0]);

  mat4.rotateX(modelMatrix, modelMatrix, (settings.rotateX / 180) * Math.PI);
  mat4.rotateY(modelMatrix, modelMatrix, (settings.rotateY / 180) * Math.PI);
  mat4.rotateZ(modelMatrix, modelMatrix, (settings.rotateZ / 180) * Math.PI);

  mat4.translate(modelMatrix, modelMatrix, [-followPosition[0], -followPosition[1], -followPosition[2]]);

  mat4.invert(inverseView, modelMatrix);
}

export function renderBody(gl, colorLocation, modelMatrixLoc, meshes, body) {
  glPushMatrix();
    rotateToOrbitPlane(body);
    drawOrbit(gl, colorLocation, modelMatrixLoc, meshes, body);
    moveBody(body);  
    if (body.name === settings.follow) savePosition();
    mat4.rotateX(modelMatrix, modelMatrix, body.tilt);
    
    body.moons.forEach((m) => renderBody(gl, colorLocation, modelMatrixLoc, meshes, m));
    
    spinBody(body);
    drawBody(gl, colorLocation, modelMatrixLoc, meshes, body);
  glPopMatrix();
}

function rotateToOrbitPlane(body) {
  mat4.rotateZ(modelMatrix, modelMatrix, body.tiltDirection);
  mat4.rotateX(modelMatrix, modelMatrix, body.inclination);
}

function drawOrbit(gl, colorLocation, modelMatrixLoc, meshes, body) {
  if (body.name === "Sol") return;
  glPushMatrix();
    circleToOrbit(modelMatrix, body);
    drawMesh(gl, colorLocation, modelMatrixLoc, meshes.circle, gl.LINE_LOOP, ORBIT_COLOR);
  glPopMatrix();
}

function moveBody(body) {
  body.angle += body.angleIncrement;
  mat4.translate(modelMatrix, modelMatrix, positionOnOrbit(body));
}

function positionOnOrbit(body) {
  const orbit = mat4.create();
  circleToOrbit(orbit, body);
  mat4.rotateZ(orbit, orbit, body.angle);

  return vec3.transformMat4(vec3.create(), [1, 0, 0], orbit);
}

function savePosition() {
  mat4.getTranslation(followPosition, modelMatrix);
  vec3.transformMat4(followPosition, followPosition, inverseView);
}

function spinBody(body) {
  body.spin += body.spinSpeed;
  mat4.rotateZ(modelMatrix, modelMatrix, body.spin);
}

function drawBody(gl, colorLocation, modelMatrixLoc, meshes, body) {
  mat4.scale(modelMatrix, modelMatrix, [body.width, body.height, body.width]);
  drawMesh(gl, colorLocation, modelMatrixLoc, meshes.sphere, gl.TRIANGLES, body.color);
}

function circleToOrbit(matrix, body) {
  mat4.translate(matrix, matrix, [-body.c, 0, 0]);
  mat4.scale(matrix, matrix, [body.a, body.b, 1]);
}

function drawMesh(gl, colorLocation, modelMatrixLoc, mesh, mode, color) {
  gl.uniformMatrix4fv(modelMatrixLoc, false, modelMatrix);
  gl.uniform4fv(colorLocation, color);
  gl.bindVertexArray(mesh.vertexArray);
  gl.drawArrays(mode, 0, mesh.count);
  gl.bindVertexArray(null);
}

function glPushMatrix() {
  const matrix = mat4.create();
  mat4.copy(matrix, modelMatrix);
  matrixStack.push(matrix);
}

function glPopMatrix() {
  mat4.copy(modelMatrix, matrixStack.pop());
}

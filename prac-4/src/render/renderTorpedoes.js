import { mat4 } from "gl-matrix";
import { torpedoes } from "../entities/torpedoes.js";
import { COLORS } from "../config.js";
import { glPushMatrix, glPopMatrix, modelMatrix, drawMesh } from "./core.js";

const TORPEDO_LENGTH = 0.5;
const TORPEDO_WIDTH = 0.2;

export function renderTorpedoes(gl, uniforms, meshes) {
    for (const torpedo of torpedoes) {
        const [x, y, z] = torpedo.direction;
        glPushMatrix();
            mat4.translate(modelMatrix, modelMatrix, torpedo.position);
            mat4.rotateY(modelMatrix, modelMatrix, Math.atan2(-z, x));
            mat4.rotateZ(modelMatrix, modelMatrix, Math.asin(y)); 
            renderTorpedoBody(gl, uniforms, meshes);
            renderTorpedoTip(gl, uniforms, meshes);
        glPopMatrix();
    }
}

function renderTorpedoBody(gl, uniforms, meshes) {
    glPushMatrix();
        mat4.translate(modelMatrix, modelMatrix, [-TORPEDO_LENGTH / 2, 0, 0]);
        mat4.scale(modelMatrix, modelMatrix, [TORPEDO_LENGTH, TORPEDO_WIDTH, TORPEDO_WIDTH]);
        drawMesh(gl, uniforms, meshes.cylinderFaces, gl.TRIANGLES, COLORS.torpedo);
    glPopMatrix();
}

function renderTorpedoTip(gl, uniforms, meshes) {
    glPushMatrix();
        mat4.translate(modelMatrix, modelMatrix, [TORPEDO_LENGTH / 2, 0, 0]);
        mat4.scale(modelMatrix, modelMatrix, [TORPEDO_WIDTH, TORPEDO_WIDTH, TORPEDO_WIDTH]);
        drawMesh(gl, uniforms, meshes.sphereFaces, gl.TRIANGLES, COLORS.torpedoTip)
    glPopMatrix();
}
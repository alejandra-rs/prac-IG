import { mat4 } from "gl-matrix";
import { coins } from "../entities/coin.js";
import { COLORS } from "../config.js";
import { glPushMatrix, glPopMatrix, modelMatrix, drawMesh } from "./core.js";

const COIN_SIZE = 0.4;
const SPIN = 2;
const FLOAT_HEIGHT = 0.15;
const FLOAT_SPEED = 2;

export function renderCoins(gl, uniforms, meshes) {
  const time = performance.now() / 1000;

  for (const coin of coins) {
    if (!coin.collected) {
      glPushMatrix();
        mat4.translate(modelMatrix, modelMatrix, coin.position);
        mat4.translate(modelMatrix, modelMatrix, [0, Math.sin(time * FLOAT_SPEED) * FLOAT_HEIGHT, 0]);
        mat4.rotateY(modelMatrix, modelMatrix, time * SPIN);
        mat4.scale(modelMatrix, modelMatrix, [COIN_SIZE, COIN_SIZE, COIN_SIZE]);
        drawMesh(gl, uniforms, meshes.sphereFaces, gl.TRIANGLES, COLORS.coin);
        drawMesh(gl, uniforms, meshes.sphereEdges, gl.LINES, COLORS.coinEdges);
      glPopMatrix();
    }
  }
}
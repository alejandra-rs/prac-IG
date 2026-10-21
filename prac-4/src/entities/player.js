import { getViewDirection, getMoveDirection, getDriftDirection } from "../interaction.js";
import { player } from "../config.js";
import { mat4, vec3 } from "gl-matrix";
import { translateToCell, isWall } from "../world/cave.js";

const leftRightView = mat4.create();
export const PLAYER_SIZE = 0.3;

const ACCELERATION = 12;
const FRICTION = 3;
const DRIFT_TURN_SPEED = 2.5;
const DRIFT_GRIP = 0.2;

export function playerToWorldSystem(direction) {
  return vec3.transformMat4(vec3.create(), direction, player.orientation);
}

export function updatePlayer(dt) {
  updatePlayerView(dt);
  updatePlayerPosition(dt);
}

function updatePlayerView(dt) {
  const view = getViewDirection();
  const angle = player.viewSpeed * dt;
  const speedFactor =Math.min(1, vec3.length(player.speed) / 3);

  mat4.rotateX(player.orientation, player.orientation, view[0] * angle);
  turnSideways(view[1] * angle);
  turnSideways(getDriftDirection() * DRIFT_TURN_SPEED * speedFactor * dt);
}

function turnSideways(angle) {
  const upsideDown = playerToWorldSystem([0, 1, 0])[1] < 0;
  mat4.fromYRotation(leftRightView, upsideDown ? -angle : angle);
  mat4.multiply(player.orientation, leftRightView, player.orientation);
}

function updatePlayerPosition(dt) {
  const grip = getDriftDirection() !== 0 ? DRIFT_GRIP : 1;
  const movement = playerToWorldSystem(getMoveDirection());
  vec3.scaleAndAdd(player.speed, player.speed, movement, ACCELERATION * grip * dt);
  vec3.scale(player.speed, player.speed, Math.max(0, 1 - FRICTION * grip * dt));
  movePlayer(vec3.scale(vec3.create(), player.speed, dt));
}

function movePlayer(movement) {
  for (let i = 0; i < 3; i++) {
    if (noCollisions(movement, i)) player.position[i] += movement[i];
    else player.speed[i] = 0;
  }
}

function noCollisions(movement, axisIdx) {
  const nextPos = vec3.clone(player.position);
  nextPos[axisIdx] += movement[axisIdx] + Math.sign(movement[axisIdx]) * PLAYER_SIZE;
  return !isWall(...translateToCell(...nextPos));
}
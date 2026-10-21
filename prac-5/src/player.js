import { getViewDirection, getMoveDirection } from "./interaction.js";
import { player } from "./config.js";
import { mat4, vec3 } from "gl-matrix";
import { isInsideMap } from "./world/world.js";
import { collides } from "./world/collisions.js";

const leftRightView = mat4.create();

const PLAYER_SIZE = 0.3;
const MAX_LOOK = 0.95;

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

  lookUpDown(view[0] * angle);
  turnSideways(view[1] * angle);
}

function lookUpDown(angle) {
  mat4.rotateX(player.orientation, player.orientation, angle);
  if (Math.abs(playerToWorldSystem([0, 0, -1])[1]) > MAX_LOOK) {
    mat4.rotateX(player.orientation, player.orientation, -angle);
  }
}

function turnSideways(angle) {
  mat4.fromYRotation(leftRightView, angle);
  mat4.multiply(player.orientation, leftRightView, player.orientation);
}

function updatePlayerPosition(dt) {
  const moveDirection = getMoveDirection();
  const movement = playerToWorldSystem(moveDirection);
  movement[1] = 0;

  if (vec3.length(movement) > 0) {
    vec3.normalize(movement, movement);
    vec3.scale(movement, movement, player.speed * dt);
  }

  movePlayer(movement);
}

function movePlayer(movement) {
  for (const i of [0, 2]) {
    if (noCollisions(movement, i)) player.position[i] += movement[i];
  }
}

function noCollisions(movement, axisIdx) {
  const nextPos = vec3.clone(player.position);
  nextPos[axisIdx] += movement[axisIdx];
  return (
    isInsideMap(nextPos[0], nextPos[2]) && !collides(nextPos[0], nextPos[2], PLAYER_SIZE)
  );
}

import { translateToCoords, getNWaterCells, isWall, translateToCell } from "../world/cave.js";
import { vec3 } from "gl-matrix";
import { player } from "../config.js";
import { ROUGHNESS } from "../shapes/caveMesh.js";
import { PLAYER_SIZE } from "./player.js";

const N_FISH = 20;
const STEP = 0.25;
export const FISH_RADIUS = 0.6;

const FISH_SIZE = 0.45;
const INFLATED_FISH_SIZE = 0.9;
const DISTANCE_TO_INFLATE = 8;
const INFLATE_SPEED = 4;

const CHASE_SPEED = 1.6;

export const pufferfish = placeFish();

export function updatePufferfish(dt) {
  for (const fish of pufferfish) {
    const playerClose = playerIsClose(fish);
    inflate(fish, playerClose, dt);
    if (playerClose) chasePlayer(fish, dt);
    handleFishCollisions(fish); pushOutOfWalls(fish);
    if (killsPlayer(fish)) killAndRespawn(fish);
  }
}

function playerIsClose(fish) {
  return vec3.distance(fish.position, player.position) < DISTANCE_TO_INFLATE &&
         canSeePlayer(fish);
}

function inflate(fish, seesPlayer, dt) {
  const targetSize = seesPlayer ? INFLATED_FISH_SIZE : FISH_SIZE;
  fish.size += (targetSize - fish.size) * Math.min(1, INFLATE_SPEED * dt);
}

function chasePlayer(fish, dt) {
  const direction = normalizedVectorOfDistance(fish);
  fish.angle = Math.atan2(-direction[2], direction[0]);
  vec3.scaleAndAdd(fish.position, fish.position, direction, CHASE_SPEED * dt);
}

function pushOutOfWalls(fish) {
  const [level, row, col] = translateToCell(...fish.position);
  for (let l = level - 1; l <= level + 1; l++) {
    for (let r = row - 1; r <= row + 1; r++) {
      for (let c = col - 1; c <= col + 1; c++) {
        if (isWall(l, r, c)) pushOutOfCell(fish, l, r, c);
      }
    }
  }
}

function handleFishCollisions(fish) {
  for (const other of pufferfish) {
    if (other === fish) continue;

    const separation = vec3.subtract(vec3.create(), fish.position, other.position);
    const distance = vec3.length(separation);
    const minDistance = (fish.size + other.size) * FISH_RADIUS;

    if (distance === 0 || distance >= minDistance) continue;
    vec3.scaleAndAdd(fish.position, fish.position, separation, (minDistance - distance) / distance / 2);
  }
}

function pushOutOfCell(fish, level, row, col) {
  const closest = closestPointInCell(fish.position, level, row, col);
  const separation = vec3.subtract(vec3.create(), fish.position, closest);
  const distance = vec3.length(separation);
  const radius = getRadius(fish);

  if (distance === 0 || distance >= radius) return;
  vec3.scaleAndAdd(fish.position, fish.position, separation, (radius - distance) / distance);
}

function closestPointInCell(point, level, row, col) {
  const centre = translateToCoords(level, row, col);
  const closest = vec3.create();
  for (let axis = 0; axis < 3; axis++) {
    closest[axis] = Math.min(Math.max(point[axis], centre[axis] - 0.5), centre[axis] + 0.5);
  }
  return closest;
}

function getRadius(fish) {
  return fish.size * FISH_RADIUS + ROUGHNESS;
}

function canSeePlayer(fish) {
  const distance = vec3.distance(fish.position, player.position);
  const step = vec3.scale(vec3.create(), normalizedVectorOfDistance(fish), STEP);
  const point = vec3.clone(fish.position);

  for (let walked = 0; walked < distance; walked += STEP) {
    vec3.add(point, point, step);
    if (isWall(...translateToCell(...point))) return false;
  }
  return true;
}

function normalizedVectorOfDistance(fish) {
  const direction = vec3.subtract(vec3.create(), player.position, fish.position);
  return vec3.normalize(direction, direction);
}

function killsPlayer(fish) {
  return vec3.distance(fish.position, player.position) < fish.size * FISH_RADIUS + PLAYER_SIZE;
}

function killAndRespawn(fish) {
  if (player.lives > 0) player.lives--;
  fish.position = vec3.clone(fish.spawn);
  fish.size = FISH_SIZE;
}

function placeFish() {
  const fish = [];
  for (const cell of getNWaterCells(N_FISH)) {
    const spawn = translateToCoords(...cell);
    fish.push({ spawn: spawn, position: vec3.clone(spawn), size: FISH_SIZE, angle: 0 });
  }
  return fish;
}
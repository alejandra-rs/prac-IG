import { findCells, translateToCoords } from "./world.js";
import { CELL } from "./map.js";
import { CAMPSITE_ENTITIES } from "./campsite.js";

export const ENTITIES = [
  ...findCells(CELL.TREE).map(treeEntity),
  ...findCells(CELL.LAMP).map((cell) => entity("lamp", translateToCoords(...cell))),
  ...CAMPSITE_ENTITIES,
];

function entity(type, coords, angle = 0, scale = [1, 1, 1]) {
  return { type, x: coords[0], z: coords[2], angle, scale };
}

function treeEntity(cell) {
  const width = randomBetween(0.85, 1.15);
  const height = randomBetween(0.8, 1.4);
  return entity("tree", translateToCoords(...cell), 0, [width, height, width]);
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

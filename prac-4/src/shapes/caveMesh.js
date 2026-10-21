import { CELL } from "../world/map.js";
import { isWall, findCells, translateToCoords } from "../world/cave.js";

export const ROUGHNESS = 0.15;

const SIDES = [
  { direction: [0, 0, 1],  corners: [[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]] },
  { direction: [0, 0, -1], corners: [[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0]] },
  { direction: [0, 1, 0],  corners: [[0, 1, 0], [1, 1, 0], [1, 1, 1], [0, 1, 1]] },
  { direction: [0, -1, 0], corners: [[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]] },
  { direction: [1, 0, 0],  corners: [[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]] },
  { direction: [-1, 0, 0], corners: [[0, 0, 0], [0, 1, 0], [0, 1, 1], [0, 0, 1]] },
];

const vertices = [];
const faces = [];
const edges = [];
const cornerIndices = new Map();

export function createCaveMesh() {
  for (const cell of waterCells()) addWallsAround(cell);
  return { vertices: new Float32Array(vertices), 
           faces: new Uint32Array(faces), 
           edges: new Uint32Array(edges),
  };
}

function waterCells() {
  return [...findCells(CELL.WATER), ...findCells(CELL.START)];
}

function addWallsAround(cell) {
  for (const side of SIDES) {
    if (touchesRock(cell, side)) addSquare(cell, side);
  }
}

function touchesRock(cell, side) {
  const [dl, dr, dc] = side.direction;
  return isWall(cell[0] + dl, cell[1] + dr, cell[2] + dc);
}

function addSquare(cell, side) {
  const [a, b, c, d] = side.corners.map((offset) =>
    getCorner([cell[0] + offset[0], cell[1] + offset[1], cell[2] + offset[2]])
  );
  faces.push(a, b, c, a, c, d);
  edges.push(a, b, b, c, c, d, d, a);
}

function getCorner(corner) {
  const key = corner.join(",");
  if (!cornerIndices.has(key)) {
    cornerIndices.set(key, vertices.length / 3);
    vertices.push(...cornerPosition(corner));
  }
  return cornerIndices.get(key);
}

function cornerPosition(corner) {
  const centre = translateToCoords(...corner);
  return centre.map((value) => value - 0.5 + randomOffset());
}

function randomOffset() {
  return (Math.random() - 0.5) * 2 * ROUGHNESS;
}
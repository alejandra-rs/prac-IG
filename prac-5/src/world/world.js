import { MAP, CELL } from "./map.js";

const N_ROWS = MAP.length;
const N_COLS = MAP[0].length;

export function getCell(row, col) {
  if (!isCellInsideMap(row, col)) return CELL.TREE;
  return MAP[row][col];
}

function isCellInsideMap(row, col) {
  return row >= 0 && col >= 0 && row < N_ROWS && col < N_COLS;
}

export function isInsideMap(x, z) {
  return isCellInsideMap(...translateToCell(x, z));
}

export function findCells(type) {
  const foundCells = [];
  for (let row = 0; row < N_ROWS; row++) {
    for (let col = 0; col < N_COLS; col++) {
      if (getCell(row, col) === type) foundCells.push([row, col]);
    }
  }
  return foundCells;
}

export function translateToCoords(row, col) {
  return [col - N_COLS / 2 + 0.5, 0, row - N_ROWS / 2 + 0.5];
}

export function translateToCell(x, z) {
  return [Math.floor(z + N_ROWS / 2), Math.floor(x + N_COLS / 2)];
}

export const start = translateToCoords(...findCells(CELL.START)[0]);

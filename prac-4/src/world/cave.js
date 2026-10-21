import { MAP, CELL } from "./map.js";

const N_LEVELS = MAP.length;
const N_ROWS = MAP[0].length;
const N_COLS = MAP[0][0].length;

export function getCell(level, row, col) {
    if (!(level >= 0 && row >= 0 && col >= 0 &&
        level < N_LEVELS && row < N_ROWS && col < N_COLS)) {
            return CELL.WALL;
    }
    return MAP[level][row][col];
}

export function isWall(level, row, col) {
    return getCell(level, row, col) === CELL.WALL;
}

export function findCells(type) {
    const foundCells = [];
    for (let level = 0; level < N_LEVELS; level++) {
        for (let row = 0; row < N_ROWS; row++){
            for (let col = 0; col < N_COLS; col++) {
                if (getCell(level, row, col) === type) foundCells.push([level, row, col]);
            }
        }
    }
    return foundCells;
}

export function translateToCoords(level, row, col) {
    return [col - N_COLS / 2 + 0.5, level + 0.5, row - N_ROWS / 2 + 0.5];
}

export function translateToCell(x, y, z) {
    return [Math.floor(y), Math.floor(z + N_ROWS / 2), Math.floor(x + N_COLS / 2)];
}

export const start = translateToCoords(...findCells(CELL.START)[0])
const water = findCells(CELL.WATER)

export function getNWaterCells(n) {
    return water.sort(() => Math.random() - 0.5).splice(0, n);
}
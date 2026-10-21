import { vec3 } from "gl-matrix";
import { player } from "../config.js";
import { translateToCoords, getNWaterCells } from "../world/cave.js"

export const N_COINS = 10;
export let score = 0;

const PICKUP_DISTANCE = 0.7;

export const coins = placeCoins();

export function updateCoins() {
    for (const coin of coins) {
        if (!coin.collected && playerCollects(coin)) {
            coin.collected = true;
            score++;
        }
    }
}

function placeCoins() {
    const coins = [];
    for (const cell of getNWaterCells(N_COINS)) {
        coins.push({ position: translateToCoords(...cell), collected: false })
    }
    return coins;
}

function playerCollects(coin) {
    return vec3.distance(coin.position, player.position) < PICKUP_DISTANCE;
}
import { vec3 } from "gl-matrix";
import { player } from "../config.js";
import { fireTorpedoPressed } from "../interaction.js";
import { isWall, translateToCell } from "../world/cave.js";
import { playerToWorldSystem } from "./player.js";
import { pufferfish, FISH_RADIUS } from "./pufferfish.js";

const TORPEDO_SPEED = 6;
export const torpedoes = [];

export function updateTorpedoes(dt) {
    if (fireTorpedoPressed()) fireTorpedo();
    for (const torpedo of torpedoes) moveTorpedo(torpedo, dt);
    removeUsedTorpedoes();
}  

function fireTorpedo() {
    torpedoes.push({
      position: vec3.clone(player.position),
      direction: playerToWorldSystem([0, 0, -1]),
    });
}

function moveTorpedo(torpedo, dt) {
    vec3.scaleAndAdd(torpedo.position, torpedo.position, torpedo.direction, TORPEDO_SPEED * dt);
}

function removeUsedTorpedoes() {
    for (let i = torpedoes.length - 1; i >= 0; i--) {
      if (hitsWall(torpedoes[i]) || hitsFish(torpedoes[i])) torpedoes.splice(i, 1);
    }
}

function hitsWall(torpedo) {
    return isWall(...translateToCell(...torpedo.position));
}
  
function hitsFish(torpedo) {
    for (let i = 0; i < pufferfish.length; i++) {
    const fish = pufferfish[i];
    if (vec3.distance(torpedo.position, fish.position) < fish.size * FISH_RADIUS) {
      pufferfish.splice(i, 1);
      return true;
    }
  }
    return false;
}
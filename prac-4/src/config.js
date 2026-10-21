import { mat4, vec3 } from "gl-matrix";
import { start } from "./world/cave.js"

export const camera = {
  fov: 70 / 180 * Math.PI,
  near: 0.05,
  far: 12,
};

export const fog = {
  distance: 10,
  color: [0.1, 0.2, 0.4],
};

export const player = {
  position: vec3.clone(start),
  orientation: mat4.fromYRotation(mat4.create(), -Math.PI / 2),
  speed: vec3.create(),
  viewSpeed: 3.25,
  lives: 3
};

export const COLORS = {
  background: [...fog.color, 1],
  rock: [0.55, 0.48, 0.42, 1],
  edges: [0.2, 0.16, 0.13, 1],
  coin: [1, 0.85, 0.2, 1],
  coinEdges: [0.6, 0.45, 0, 1],
  fishBody: [0.95, 0.6, 0.2, 1],
  fishSpikes: [0.85, 0.3, 0.1, 1],
  fishEyes: [0, 0, 0, 1],
  torpedo: [0.3, 0.3, 0.3, 1],
  torpedoTip: [1, 0.5, 0.5, 1]
};
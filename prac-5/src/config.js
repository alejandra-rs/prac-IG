import { mat4, vec3 } from "gl-matrix";
import { start } from "./world/world.js";

const EYE_HEIGHT = 0.6;

export const phong = {
  ambient: 1,
  diffuse: 1,
  specular: 1,
  shininessScale: 1,
};

export const attenuation = { factor: 0.1 };

export const camera = {
  fov: (50 / 180) * Math.PI,
  near: 0.05,
  far: 30,
};

export const fog = {
  distance: 25,
  color: [0.05, 0.05, 0.1],
};

export const player = {
  position: vec3.fromValues(start[0], EYE_HEIGHT, start[2]),
  orientation: mat4.create(),
  speed: 3,
  viewSpeed: 1.75,
};

export const moon = {
  on: true,
  direction: [-0.4, 1, -0.3],
  color: [0.15, 0.17, 0.3],
};

export const torch = {
  on: false,
  color: [3.5, 3.4, 3.0],
  innerAngle: 12,
  outerAngle: 20,
};

export const MATERIALS = {
  grass: {
    ambient: [0.02, 0.05, 0.02],
    diffuse: [0.15, 0.35, 0.12],
    specular: [0, 0, 0],
    shininess: 1,
  },
  dirt: {
    ambient: [0.05, 0.04, 0.02],
    diffuse: [0.45, 0.33, 0.2],
    specular: [0.05, 0.05, 0.05],
    shininess: 4,
  },
  wood: {
    ambient: [0.03, 0.02, 0.01],
    diffuse: [0.45, 0.3, 0.17],
    specular: [0.05, 0.05, 0.05],
    shininess: 3,
  },
  leaves: {
    ambient: [0.01, 0.04, 0.02],
    diffuse: [0.1, 0.4, 0.18],
    specular: [0.2, 0.3, 0.2],
    shininess: 12,
  },
  lightBulb: {
    ambient: [1, 1, 0.8],
    diffuse: [0, 0, 0],
    specular: [0, 0, 0],
    shininess: 1,
  },
  metal: {
    ambient: [0.02, 0.02, 0.02],
    diffuse: [0.2, 0.2, 0.22],
    specular: [1, 1, 1],
    shininess: 32,
  },
  stone: {
    ambient: [0.03, 0.03, 0.03],
    diffuse: [0.4, 0.4, 0.42],
    specular: [0.08, 0.08, 0.08],
    shininess: 8,
  },
  canvas: {
    ambient: [0.05, 0.02, 0.0],
    diffuse: [0.75, 0.35, 0.1],
    specular: [0.1, 0.1, 0.1],
    shininess: 5,
  },
  flame: {
    ambient: [1, 0.45, 0.05],
    diffuse: [0, 0, 0],
    specular: [0, 0, 0],
    shininess: 1,
  },
};

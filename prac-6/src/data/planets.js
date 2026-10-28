import { MathUtils } from "three";
import sunTexture from "../textures/sun.jpg";
import mercuryTexture from "../textures/mercury.jpg";
import venusTexture from "../textures/venus.jpg";
import earthTexture from "../textures/earth.jpg";
import earthBumpMapTexture from "../textures/earth_bump_map.jpg";
import cloudsTexture from "../textures/clouds.jpg";
import moonTexture from "../textures/moon.jpg";
import marsTexture from "../textures/mars.jpg";
import phobosTexture from "../textures/phobos.jpg";
import deimosTexture from "../textures/deimos.jpg";
import jupiterTexture from "../textures/jupiter.jpg";
import ioTexture from "../textures/io.jpg";
import europaTexture from "../textures/europa.jpg";
import ganymedeTexture from "../textures/ganymede.jpg";
import saturnTexture from "../textures/saturn.jpg";
import titanTexture from "../textures/titan.jpg";
import uranusTexture from "../textures/uranus.jpg";
import titaniaTexture from "../textures/titania.jpg";
import neptuneTexture from "../textures/neptune.jpg";
import tritonTexture from "../textures/triton.jpg";
import saturnRing from "../textures/saturn_ring.png";

export const sun = {
  name: "Sol",
  texture: sunTexture,
  lightColor: "#ffeeaa",
  size: 1.4,
  tilt: MathUtils.degToRad(7.25),
  spin: 0.002,
};

export const planets = [
  {
    name: "Mercurio",
    texture: mercuryTexture,
    bumpScale: 0.3,
    size: 0.3,
    distance: 3,
    speed: 0.04,
    eccentricity: 0.206,
    tilt: MathUtils.degToRad(0.03),
    spin: 0.001,
    moons: [],
  },
  {
    name: "Venus",
    texture: venusTexture,
    bumpScale: 0.05,
    size: 0.45,
    distance: 5,
    speed: 0.03,
    eccentricity: 0.007,
    tilt: MathUtils.degToRad(177.4),
    spin: 0.0003,
    moons: [],
  },
  {
    name: "La Tierra",
    texture: earthTexture,
    bumpScale: 2,
    bumpMap: earthBumpMapTexture,
    atmosphere: cloudsTexture,
    size: 0.5,
    distance: 7,
    speed: 0.02,
    eccentricity: 0.017,
    tilt: MathUtils.degToRad(23.44),
    spin: 0.05,
    moons: [
      { name: "Luna", texture: moonTexture, bumpScale: 0.3, size: 0.18, distance: 1.2, speed: 0.03, inclination: MathUtils.degToRad(-18.3) },
    ],
  },
  {
    name: "Marte",
    texture: marsTexture,
    bumpScale: 0.05,
    size: 0.4,
    distance: 9,
    speed: 0.015,
    eccentricity: 0.093,
    tilt: MathUtils.degToRad(25.19),
    spin: 0.048,
    moons: [
      { name: "Fobos", texture: phobosTexture, bumpScale: 0.3, size: 0.12, distance: 0.7, speed: 0.05, inclination: MathUtils.degToRad(1.1) },
      { name: "Deimos", texture: deimosTexture, bumpScale: 0.3, size: 0.1, distance: 1, speed: 0.03, inclination: MathUtils.degToRad(1.8) },
    ],
  },
  {
    name: "Júpiter",
    texture: jupiterTexture,
    bumpScale: 0,
    size: 0.8,
    distance: 14,
    speed: 0.01,
    eccentricity: 0.049,
    tilt: MathUtils.degToRad(3.13),
    spin: 0.12,
    moons: [
      { name: "Ío", texture: ioTexture, bumpScale: 0.3, size: 0.15, distance: 1.2, speed: 0.05, inclination: MathUtils.degToRad(0.05) },
      { name: "Europa", texture: europaTexture, bumpScale: 0.05, size: 0.14, distance: 1.5, speed: 0.04, inclination: MathUtils.degToRad(0.47) },
      { name: "Ganímedes", texture: ganymedeTexture, bumpScale: 0.3, size: 0.18, distance: 1.9, speed: 0.03, inclination: MathUtils.degToRad(0.2) },
    ],
  },
  {
    name: "Saturno",
    texture: saturnTexture,
    bumpScale: 0,
    ring: saturnRing,
    size: 0.7,
    distance: 19,
    speed: 0.008,
    eccentricity: 0.057,
    tilt: MathUtils.degToRad(26.73),
    spin: 0.11,
    moons: [
      { name: "Titán", texture: titanTexture, bumpScale: 0.05, size: 0.16, distance: 2.4, speed: 0.03, inclination: MathUtils.degToRad(0.35) },
    ],
  },
  {
    name: "Urano",
    texture: uranusTexture,
    bumpScale: 0,
    size: 0.55,
    distance: 25,
    speed: 0.006,
    eccentricity: 0.046,
    tilt: MathUtils.degToRad(97.77),
    spin: 0.07,
    moons: [
      { name: "Titania", texture: titaniaTexture, bumpScale: 0.3, size: 0.13, distance: 1.1, speed: 0.03, inclination: MathUtils.degToRad(0.1) },
    ],
  },
  {
    name: "Neptuno",
    texture: neptuneTexture,
    bumpScale: 0,
    size: 0.55,
    distance: 31,
    speed: 0.005,
    eccentricity: 0.01,
    tilt: MathUtils.degToRad(28.32),
    spin: 0.075,
    moons: [
      { name: "Tritón", texture: tritonTexture, bumpScale: 0.3, size: 0.14, distance: 1.1, speed: 0.03, inclination: MathUtils.degToRad(157) },
    ],
  },
];

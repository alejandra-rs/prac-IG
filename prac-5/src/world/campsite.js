import { translateToCoords } from "./world.js";

export const TENT = { halfWidth: 0.45, height: 0.6, length: 0.9 };
export const LOG = { length: 0.8, radius: 0.1 };
export const FIRE = { radius: 0.4 };
export const POT = { radius: 0.15, height: 0.25 };

const TENTS = { count: 6, distance: 3, turn: Math.PI };
const LOGS = { count: 3, distance: 1.4, turn: 0 };
const POT_DISTANCE = 0.6;

const CAMPSITES = [
  { center: translateToCoords(5, 19), entrance: -Math.PI / 2 },
  { center: translateToCoords(19, 5), entrance: Math.PI },
];

export const CAMPSITE_ENTITIES = CAMPSITES.flatMap(campEntities);

function campEntities(camp) {
  return [
    placeAroundFire("fire", camp.center, 0, 0),
    placeAroundFire("pot", camp.center, POT_DISTANCE, camp.entrance + (2 * Math.PI) / 3),
    ...placeInCircle("tent", camp, TENTS),
    ...placeInCircle("log", camp, LOGS),
  ];
}

function placeInCircle(type, camp, circle) {
  const entities = [];
  for (let i = 0; i < circle.count; i++) {
    const angle = camp.entrance + ((i + 0.5) / circle.count) * 2 * Math.PI;
    entities.push(placeAroundFire(type, camp.center, circle.distance, angle, circle.turn));
  }
  return entities;
}

function placeAroundFire(type, center, distance, angle, turn = 0) {
  return {
    type,
    x: center[0] + distance * Math.sin(angle),
    z: center[2] + distance * Math.cos(angle),
    angle: angle + turn,
    scale: [1, 1, 1],
  };
}
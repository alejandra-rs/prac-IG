import * as THREE from "three";
import { latLonToVector3 } from "./terrain.js";

const SHIP_SPEED = 0.05;
const TURN_RATE = 3;
const STEP_RADIANS = THREE.MathUtils.degToRad(1);
const SEA_LIFT = 1.002;
const DOCK_DISTANCE = 0.03;
const CORNER_RADIANS = THREE.MathUtils.degToRad(1.5);
const CORNER_STEPS = 6;
const ROUTE_STYLE = { color: "#5f9fc9", dashSize: 0.008, gapSize: 0.014, transparent: true, opacity: 0.45 };

export function createShipRoutes(routes, globe, shipModel) {
  let ships = routes.map((route, i) => createShip(route, globe.size * SEA_LIFT, shipModel, i / routes.length));
  let group = new THREE.Group();
  ships.forEach(ship => group.add(ship.line, ship.model));
  return { group, ships };
}

export function moveShips(ships, delta) {
  ships.forEach(ship => {
    let travelled = (ship.travelled + SHIP_SPEED * delta) % ship.voyage;
    sail(ship, travelled < ship.travelled ? 1 : 1 - Math.exp(-TURN_RATE * delta), travelled);
  });
}

function createShip(route, radius, model, phase) {
  let path = densify(roundCorners(route.path.map(([lat, lon]) => latLonToVector3(lat, lon, radius))));
  let distances = cumulativeDistances(path);
  let ship = { route, path, distances, voyage: distances[distances.length - 1] - 2 * DOCK_DISTANCE, model: model.clone(),
               line: new THREE.Line(new THREE.BufferGeometry().setFromPoints(path), new THREE.LineDashedMaterial(ROUTE_STYLE)).computeLineDistances() };
  sail(ship, 1, ship.voyage * phase);
  return ship;
}

function sail(ship, turn, travelled) {
  ship.travelled = travelled;
  let distance = DOCK_DISTANCE + travelled;
  let i = Math.max(1, ship.distances.findIndex(d => d >= distance));
  let from = ship.path[i - 1], to = ship.path[i];
  let progress = (distance - ship.distances[i - 1]) / (ship.distances[i] - ship.distances[i - 1] || 1);
  ship.model.position.lerpVectors(from, to, progress);
  ship.model.quaternion.slerp(facing(ship.model.position, to.clone().sub(from)), turn);
}

function facing(position, forward) {
  let up = position.clone().normalize();
  let right = new THREE.Vector3().crossVectors(up, forward).normalize();
  let ahead = new THREE.Vector3().crossVectors(right, up);
  return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(right, up, ahead));
}

function cumulativeDistances(points) {
  let total = 0;
  return points.map((point, i) => total += i && point.distanceTo(points[i - 1]));
}

function roundCorners(points) {
  return points.flatMap((corner, i) => {
    if (i === 0 || i === points.length - 1) return [corner];
    let before = toward(corner, points[i - 1]), after = toward(corner, points[i + 1]);
    return Array.from({ length: CORNER_STEPS + 1 }, (_, k) => bezier(before, corner, after, k / CORNER_STEPS));
  });
}

function toward(corner, neighbour) {
  return corner.clone().lerp(neighbour, Math.min(0.5, CORNER_RADIANS / corner.angleTo(neighbour))).setLength(corner.length());
}

function bezier(start, control, end, t) {
  return start.clone().multiplyScalar((1 - t) ** 2).addScaledVector(control, 2 * (1 - t) * t).addScaledVector(end, t * t).setLength(control.length());
}

function densify(points) {
  return points.flatMap((point, i) => i === 0 ? [point] : arcPoints(points[i - 1], point));
}

function arcPoints(start, end) {
  let steps = Math.max(1, Math.ceil(start.angleTo(end) / STEP_RADIANS));
  return Array.from({ length: steps }, (_, i) => start.clone().lerp(end, (i + 1) / steps).setLength(start.length()));
}

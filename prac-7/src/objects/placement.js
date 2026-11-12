import * as THREE from "three";

const SEARCH_STEP_DEGREES = 0.2;
const NEARBY_DEGREES = 1.5;
const SEARCH_LIMIT_DEGREES = 10;
const DIRECTIONS = 16;

export function moveOntoLand(spots, isLand) {
  let settled = spots.filter(isLand);
  spots.filter(spot => !isLand(spot)).forEach(spot => {
    let neighbours = settled.filter(other => degreesApart(spot, other) < SEARCH_LIMIT_DEGREES + spot.radius + other.radius);
    let isFree = candidate => neighbours.every(other => degreesApart(candidate, other) >= spot.radius + other.radius);
    let fits = candidate => isFree(candidate) && [candidate, ...ring(candidate, spot.radius)].every(isLand);
    Object.assign(spot, nearest(spot, fits, NEARBY_DEGREES) || nearest(spot, candidate => isLand(candidate) && isFree(candidate), NEARBY_DEGREES)
                                                            || nearest(spot, isLand, SEARCH_LIMIT_DEGREES));
    settled.push(spot);
  });
  return spots;
}

function nearest(spot, isWanted, limit) {
  for (let distance = SEARCH_STEP_DEGREES; distance <= limit; distance += SEARCH_STEP_DEGREES) {
    let found = ring(spot, distance).find(isWanted);
    if (found) return found;
  }
}

function ring({ lat, lon }, distance) {
  let lonStretch = 1 / Math.max(Math.cos(THREE.MathUtils.degToRad(lat)), 0.1);
  return Array.from({ length: DIRECTIONS }, (_, i) => {
    let angle = 2 * Math.PI * i / DIRECTIONS;
    return { lat: lat + distance * Math.sin(angle), lon: lon + distance * Math.cos(angle) * lonStretch };
  });
}

function degreesApart(a, b) {
  return Math.hypot(a.lat - b.lat, (THREE.MathUtils.euclideanModulo(a.lon - b.lon + 180, 360) - 180) * Math.cos(THREE.MathUtils.degToRad(a.lat)));
}

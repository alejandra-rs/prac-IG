import { planets, sun } from "../data/planets.js";
import { isPaused } from "../game.js";
import { isRocketView } from "../views.js";
import { openCloseup } from "./closeup.js";

const nearDistance = 3;
let nearBody;

export function setupProximity() {
  document.getElementById("nearPlanetButton").addEventListener("click", _ => openCloseup(nearBody));
}

export function updateProximity(rocket, bodies) {
  nearBody = isPaused() && isRocketView() ? findNearPlanet(rocket, bodies) : null;
  document.getElementById("nearPlanetPrompt").classList.toggle("hidden", !nearBody);
  if (nearBody) document.getElementById("nearPlanetText").textContent = approachingText(nearBody);
}

function approachingText(body) {
  if (body === sun) return "¡Te estás acercando al Sol!";
  return "¡Te estás acercando a " + body.name + "!";
}

function findNearPlanet(rocket, bodies) {
  let closest = null, closestDistance = nearDistance;
  bodies.forEach(p => {
    let distance = rocket.position.distanceTo(p.position) - p.userData.size;
    if (distance < closestDistance) {
      closest = p;
      closestDistance = distance;
    }
  });
  if (!closest) return null;
  return [sun, ...planets].find(p => p.name === closest.userData.name);
}

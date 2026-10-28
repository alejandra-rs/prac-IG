import * as THREE from "three";
import { planets } from "../data/planets.js";
import { dashedMaterial, getState } from "../game.js";

let draggedPlanet, camera, planetObjects, orbitObjects;
let raycaster = new THREE.Raycaster();
let floor = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
let mouse = new THREE.Vector2();
let mouseProjection = new THREE.Vector3();

let placedCount = 0;

export function createTray() {
  let trayDiv = document.getElementById("tray");
  [...planets].sort((a, b) => Math.random() - 0.5).forEach(p => {
    let planetButton = document.createElement("BUTTON");
    planetButton.classList.add("trayButton");
    planetButton.style.backgroundImage = "url(" + p.texture + ")"
    planetButton.title = p.name;
    planetButton.addEventListener("pointerdown", e => startDrag(planetButton, p, e));
    trayDiv.append(planetButton)
  });
}

export function setLearnEvents(cam, planObj, orbObj) {
  camera = cam;
  planetObjects = planObj;
  orbitObjects = orbObj;
  window.addEventListener("pointermove", moveGhost);
  window.addEventListener("pointerup", dropPlanet);
  window.addEventListener("click", removePlanet);
  document.getElementById("learnRestartButton").addEventListener("click", resetLearn);
}

export function resetLearn() {
  setProgress(0);
  document.querySelectorAll(".trayButton").forEach(e => e.classList.remove("pickedUp"));
  planetObjects.forEach(p => p.visible = false);
  orbitObjects.forEach(o => o.material = dashedMaterial);
}

function startDrag(planetButton, planet, event) {
  draggedPlanet = planet;
  let ghost = document.getElementById("dragGhost");
  ghost.style.backgroundImage = "url(" + planet.texture + ")";
  ghost.classList.remove("hidden");
  planetButton.classList.add("pickedUp");
  moveGhost(event);
}

function moveGhost(event) {
  if (!draggedPlanet) return;
  let ghost = document.getElementById("dragGhost");
  ghost.style.left = event.clientX + "px";
  ghost.style.top = event.clientY + "px";
}

function dropPlanet(event) {
  if (!draggedPlanet) return;
  document.getElementById("dragGhost").classList.add("hidden");
  matchDrag(findNearestPlanet(event));
  draggedPlanet = null;
}

function removePlanet(event) {
  if (getState() !== "learn" || event.target.tagName !== "CANVAS") return;
  let i = findClickedPlanet(event);
  if (i !== -1) setPlaced(i, false);
}

function castRay(event) {
  mouse.x = event.clientX / window.innerWidth * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
}

function findNearestPlanet(event) {
  castRay(event);
  if (!raycaster.ray.intersectPlane(floor, mouseProjection)) return null;

  let minDist = 1.5, minPlanet = null;
  planets.forEach(p => {
    let dist = Math.abs(mouseProjection.length() - p.distance);
    if (dist < minDist) {
      minDist = dist;
      minPlanet = p;
    }
  });
  return minPlanet;
}

function findClickedPlanet(event) {
  castRay(event);
  let hits = raycaster.intersectObjects(planetObjects.filter(p => p.visible), true);
  if (hits.length === 0) return -1;
  return planetObjects.indexOf(findPlanetGroup(hits[0].object));
}

function findPlanetGroup(object) {
  while (!planetObjects.includes(object)) object = object.parent;
  return object;
}

function matchDrag(planetMatch) {
  if (planetMatch === draggedPlanet) {
    let i = planets.indexOf(draggedPlanet);
    moveToDropPoint(planetObjects[i]);
    setPlaced(i, true);
    return;
  }
  if (planetMatch) showMessage("¡Oh, no! Esa no es la órbita de " + draggedPlanet.name + ", es la órbita de " + planetMatch.name);
  getTrayButton(draggedPlanet).classList.remove("pickedUp");
}

function setPlaced(i, placed) {
  planetObjects[i].visible = placed;
  orbitObjects[i].material = placed ? orbitObjects[i].userData.material : dashedMaterial;
  getTrayButton(planets[i]).classList.toggle("pickedUp", placed);
  setProgress(placedCount + (placed ? 1 : -1));
}

function getTrayButton(planet) {
  return document.querySelector("#tray [title='" + planet.name + "']");
}

function setProgress(count) {
  placedCount = count;
  document.getElementById("learnProgress").textContent = placedCount + " / " + planets.length;
  document.getElementById("learnComplete").classList.toggle("hidden", placedCount !== planets.length);
}

function moveToDropPoint(planetGroup) {
  let data = planetGroup.userData;
  let currentAngle = Math.atan2(planetGroup.position.z / data.yScale, planetGroup.position.x - data.xOffset);
  let dropAngle = Math.atan2(mouseProjection.z / data.yScale, mouseProjection.x - data.xOffset);
  data.angleOffset += dropAngle - currentAngle;
}

function showMessage(text) {
  let message = document.getElementById("learnMessage");
  message.textContent = text;
  message.classList.remove("hidden");
  setTimeout(() => message.classList.add("hidden"), 2500);
}

import * as THREE from "three";
import { planets, sun } from "../data/planets.js";
import { createPlanet, createStar, createStarryBackground } from "../objects/scene.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
import { setMode, isPaused, setPaused } from "../game.js";
import { getActiveView, setView } from "../views.js";
import { setupFactCard, showFacts } from "./factCard.js";

let closeupScene = new THREE.Scene();
let closeupCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let closeupControls, tiltControls;
let closeupPlanet, savedView, savedPaused, moonsOn, spinOn=true, tiltOn;
let closeupTime = 0;

export function createPlanetPicker() {
  let picker = document.getElementById("planetPickerPanel");
  [sun, ...planets].forEach(p => {
    let pickerButton = document.createElement("BUTTON");
    pickerButton.classList.add("trayButton", "pickerButton");
    pickerButton.style.backgroundImage = "url(" + p.texture + ")"
    pickerButton.title = p.name;
    pickerButton.addEventListener("click", _ => openCloseup(p));
    picker.append(pickerButton);
  });
  document.getElementById("planetPickerButton").addEventListener("click", togglePicker);
}

export function setupCloseup(renderer) {
  closeupScene.add(createStarryBackground());
  closeupScene.add(new THREE.HemisphereLight("#6688cc", "#111122", 0.2));
  closeupScene.add(createDirectionalLight())

  closeupControls = new OrbitControls(closeupCamera, renderer.domElement);
  closeupControls.enablePan = false;
  closeupControls.enabled = false;
  createTiltControls(renderer);

  document.getElementById("closeupExploreButton").addEventListener("click", closeCloseup);
  document.getElementById("closeupMoonsButton").addEventListener("click", toggleMoons);
  document.getElementById("closeupSpinButton").addEventListener("click", toggleSpin);
  document.getElementById("closeupTiltButton").addEventListener("click", toggleTilt);
  setupFactCard();
}

function createTiltControls(renderer) {
  tiltControls = new TransformControls(closeupCamera, renderer.domElement);
  tiltControls.setMode("rotate");
  tiltControls.addEventListener("dragging-changed", e => closeupControls.enabled = !e.value);
  closeupScene.add(tiltControls);
}

export function getCloseupCamera() {
  return closeupCamera;
}

export function renderCloseup(renderer, delta) {
  if (spinOn) closeupPlanet.userData.mesh.rotateY(delta * 0.05);
  closeupTime += delta * 5;
  closeupPlanet.userData.moonPivots.forEach(p => p.rotation.y = closeupTime * p.userData.speed);
  renderer.render(closeupScene, closeupCamera);
}

export function openCloseup(planet) {
  saveExploreState();
  buildCloseupPlanet(planet);
  setupCloseupCamera(planet);
  setMode("closeup");
  closeupControls.enabled = true;
  showCloseupInfo(planet);
}

function createDirectionalLight() {
  let directionalLight = new THREE.DirectionalLight("#fff4e0", 2);
  directionalLight.position.set(5, 2, 3);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.set(2048, 2048);
  directionalLight.shadow.bias = -0.0005;
  directionalLight.shadow.camera.left = -3;
  directionalLight.shadow.camera.right = 3;
  directionalLight.shadow.camera.top = 3;
  directionalLight.shadow.camera.bottom = -3;
  return directionalLight;
}

function togglePicker() {
  document.getElementById("planetPickerPanel").classList.toggle("hidden");
}

function toggleMoons() {
  moonsOn = !moonsOn;
  closeupPlanet.userData.moonPivots.forEach(pivot => pivot.visible = moonsOn);
}

function toggleSpin() {
  spinOn = !spinOn;
}

function toggleTilt() {
  tiltOn = !tiltOn;
  if (tiltOn) tiltControls.attach(closeupPlanet);
  else tiltControls.detach();
}

function resetTilt() {
  tiltOn = false;
  tiltControls.detach();
}


function saveExploreState() {
  savedView = getActiveView();
  savedPaused = isPaused();
}

function buildCloseupPlanet(planet) {
  resetTilt();
  if (closeupPlanet) closeupScene.remove(closeupPlanet);
  closeupPlanet = planet === sun ? createCloseupStar() : createPlanet(planet, 128, 64);
  closeupScene.add(closeupPlanet);
  moonsOn = false;
  closeupPlanet.userData.moonPivots.forEach(pivot => pivot.visible = false);
  addShadows(closeupPlanet);
}

function createCloseupStar() {
  let star = createStar(sun, 128, 64);
  let starGroup = new THREE.Group();
  starGroup.add(star);
  starGroup.userData = { mesh: star, moonPivots: [] };
  return starGroup;
}

function showCloseupInfo(planet) {
  document.getElementById("closeupTitle").textContent = planet.name;
  showFacts(planet.name);
  document.getElementById("closeupMoonsButton").classList.toggle("hidden", !planet.moons || planet.moons.length === 0);
  document.getElementById("planetPickerPanel").classList.add("hidden");
}

function closeCloseup() {
  closeupControls.enabled = false;
  resetTilt();
  setMode("explore");
  setView(savedView);
  setPaused(savedPaused);
}

function addShadows(closeupPlanet) {
  closeupPlanet.traverse(child => {
    if (!child.isMesh) return;
    child.receiveShadow = true;
    child.castShadow = !child.material.alphaMap;
  })
}

function setupCloseupCamera(planet) {
  closeupCamera.position.set(0, 0, planet.size * 4);
  closeupControls.target.set(0, 0, 0);
  closeupControls.minDistance = planet.size * 1.5;
  closeupControls.maxDistance = planet.size * 8;
  closeupControls.update();
}

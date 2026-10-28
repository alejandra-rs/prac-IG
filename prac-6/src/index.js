import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { createStarryBackground, createStar, createPlanet, createOrbit } from "./objects/scene.js";
import { createRocket, createRocketCameras, createRocketControls, createRocketMarker, moveRocketMarker, isRocketMoving } from "./objects/rocket.js";
import { moveParticles } from "./objects/particles.js";
import { planets, sun } from "./data/planets.js";
import { setGameEvents, setMode, isPaused, getState, getSpeed } from "./game.js";
import { createTray, setLearnEvents } from "./modes/learn.js";
import { getActiveCamera, getMinimapCamera, isRocketView, setViews } from "./views.js";
import { createMainBelt, createKuiperBelt } from "./objects/asteroids.js";
import { createPlanetPicker, renderCloseup, setupCloseup, getCloseupCamera } from "./modes/closeup.js";
import { setupStart, renderStart, getStartRocket, isLaunching, getStartCamera } from "./modes/start.js";
import { setupProximity, updateProximity } from "./modes/proximity.js";
import { handleRocketCollisions } from "./objects/collisions.js";
import { updateEngineSound } from "./objects/sounds.js";

let camera, scene = new THREE.Scene();
let renderer = new THREE.WebGLRenderer(), labelRenderer = new CSS2DRenderer();
let starObject, planetObjects = [], orbitObjects = [];
let clock = new THREE.Clock();
let accglobal = 20, elapsedTime = 0;
let rocket, controls, rocketControls, rocketCameras, rocketMarker;

function init() {
  createRenderer();
  createSolarSystem();
  addRocket();
  setupModes();
}

function createRenderer() {
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 20, 30);

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);
  
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.domElement.id = "labels"
  document.body.appendChild(labelRenderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
}

function createSolarSystem() {
  scene.add(createStarryBackground());
  scene.add(new THREE.AmbientLight("#bbbbff", 0.15))

  starObject = createStar(sun);
  scene.add(starObject)

  planets.forEach(planet => {
    let planetObject = createPlanet(planet);
    let orbitObject = createOrbit(planetObject.userData.dist, planetObject.userData.yScale, planetObject.userData.xOffset)
    scene.add(planetObject);
    scene.add(orbitObject)
    planetObjects.push(planetObject);
    orbitObjects.push(orbitObject);
  });

  scene.add(createMainBelt());
  scene.add(createKuiperBelt());
}

function addRocket() {
  rocket = createRocket();
  rocket.position.set(9, 2, 0);
  scene.add(rocket);
  rocketControls = createRocketControls(rocket, renderer.domElement);
  rocketCameras = createRocketCameras(rocket);
  rocketMarker = createRocketMarker();
  scene.add(rocketMarker);
}

function setupModes() {
  setGameEvents(controls, planetObjects, orbitObjects);
  setLearnEvents(camera, planetObjects, orbitObjects);
  setViews(camera, rocketCameras, rocket, controls);
  setupCloseup(renderer);
  setupStart(renderer);
  setMode("start");
  createTray();
  createPlanetPicker();
  setupProximity();
  window.addEventListener("resize", resize);
}

function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
  [camera, rocketCameras.firstPerson, rocketCameras.thirdPerson, getCloseupCamera(), getStartCamera()].forEach(resizeCamera);
}

function resizeCamera(cam) {
  cam.aspect = window.innerWidth / window.innerHeight;
  cam.updateProjectionMatrix();
}

function animationLoop() {
  let delta = clock.getDelta();
  requestAnimationFrame(animationLoop);
  renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
  if (getState() === "start") updateStart(delta);
  else if (getState() === "closeup") updateCloseup(delta);
  else updateSolarSystem(delta);
}

function updateStart(delta) {
  let startRocket = getStartRocket();
  moveParticles(startRocket.userData.particles, delta, isLaunching(), startRocket.position.y - 0.45);
  updateEngineSound(isLaunching());
  renderStart(renderer, delta);
}

function updateCloseup(delta) {
  updateEngineSound(false);
  renderCloseup(renderer, delta);
}

function updateSolarSystem(delta) {
  let timestamp = isPaused() ? 0 : delta * accglobal * getSpeed();
  elapsedTime += timestamp;
  starObject.rotateY(starObject.userData.spin * timestamp * 3);
  movePlanets(timestamp);
  moveRocket(delta);
  renderSolarSystem();
}

function movePlanets(timestamp) {
  for (let planet of planetObjects) {
    let angle = elapsedTime * planet.userData.speed + planet.userData.angleOffset;
    planet.position.x = Math.cos(angle) * planet.userData.dist + planet.userData.xOffset;
    planet.position.z = Math.sin(angle) * planet.userData.dist * planet.userData.yScale;
    planet.userData.mesh.rotateY(planet.userData.spin * timestamp * 3);
    planet.userData.label.visible = planet.visible;
    for (let moon of planet.userData.moonPivots) {
      moon.rotation.y = elapsedTime * moon.userData.speed;
    }
  }
}

function moveRocket(delta) {
  let bodies = [starObject, ...planetObjects];
  if (isRocketView()) rocketControls.update(delta);
  handleRocketCollisions(rocket, bodies);
  updateProximity(rocket, bodies);
  let moving = isRocketMoving(rocket);
  moveParticles(rocket.userData.particles, delta, moving);
  updateEngineSound(moving);
  moveRocketMarker(rocketMarker, rocket);
}

function renderSolarSystem() {
  renderer.render(scene, getActiveCamera());
  labelRenderer.render(scene, getActiveCamera());
  if (isRocketView()) renderMinimap();
}

function renderMinimap() {
  renderer.setScissorTest(true);
  renderer.setViewport(window.innerWidth - 216, 16, 200, 200);
  renderer.setScissor(window.innerWidth - 216, 16, 200, 200);
  renderer.render(scene, getMinimapCamera());
  renderer.setScissorTest(false);
}

init();
animationLoop();

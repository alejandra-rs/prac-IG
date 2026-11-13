import * as THREE from "three";
import * as TWEEN from "three/examples/jsm/libs/tween.module.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { createStarryBackground, createDayGlobe, createNightGlobe } from "./objects/globes.js";
import { createPlasticLayer, resizePlastic } from "./objects/plastic.js";
import { addPlasticSources } from "./objects/plasticSources.js";
import { moveShips } from "./objects/shipRoutes.js";
import { areLightsOff, prepareIntro, playIntro, setupSourcesPanel, setupLightSwitch, setupPlasticPanel } from "./panels.js";
import { hideInfo, setupInfoCard, showCentredInfo } from "./infoCard.js";
import { followShip, isShipCameraOn, leaveShip, setupShipCamera, updateShipCamera } from "./shipCamera.js";
import { earth, plasticLayers } from "./data.js";

let renderer = new THREE.WebGLRenderer({ antialias: true });
let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);
let controls = new OrbitControls(camera, renderer.domElement);
let dayScene = new THREE.Scene(), nightScene = new THREE.Scene();
let clock = new THREE.Clock(), ships = [], clickable = [];

function init() {
  prepareIntro();
  document.body.appendChild(renderer.domElement);
  setupCamera();
  createScenes();
  setupInterface();
  THREE.DefaultLoadingManager.onLoad = () => {
    playIntro(camera);
    renderer.setAnimationLoop(animationLoop);
  };
}

function setupCamera() {
  camera.position.set(0, 0, earth.size * 6);
  Object.assign(controls, { enableDamping: true, enablePan: false, minDistance: earth.size * 1.3, maxDistance: earth.size * 6, autoRotate: true, autoRotateSpeed: 0.2 });
  controls.addEventListener("start", () => controls.autoRotate = false);
  setupShipCamera(camera, controls);
}

function createScenes() {
  let sunLight = new THREE.DirectionalLight("#fff4e0", 2);
  sunLight.position.set(2, 1, 1);
  camera.add(sunLight);
  let plasticPoints = plasticLayers.map(layer => createPlasticLayer(layer, earth));
  dayScene.add(createStarryBackground(), new THREE.AmbientLight("#bbbbff", 0.3), camera, createDayGlobe(earth));
  nightScene.add(createStarryBackground(), createNightGlobe(earth), ...plasticPoints);
  setupPlasticPanel(plasticPoints);
  addPlasticSources(dayScene, earth).then(sources => {
    ({ ships, clickable } = sources);
    setupSourcesPanel(sources.models);
    setupInfoCard(camera, clickable, model => model && model.userData.info.kind === "route" ? followShip(model) : leaveShip());
  });
}

function setupInterface() {
  let leave = () => { hideInfo(); leaveShip(); };
  setupLightSwitch(leave);
  window.addEventListener("keydown", event => event.key === "Escape" && leave());
  window.addEventListener("resize", resize);
  resize();
}

function resize() {
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  resizePlastic(window.innerHeight, window.devicePixelRatio);
}

function animationLoop() {
  TWEEN.update();
  moveShips(ships, clock.getDelta());
  isShipCameraOn() ? updateShipCamera() : controls.update();
  if (!areLightsOff() && !isShipCameraOn()) showCentredInfo(camera, clickable);
  renderer.render(areLightsOff() ? nightScene : dayScene, camera);
}

init();

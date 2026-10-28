import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { createStarryBackground } from "../objects/scene";
import { createRocket } from "../objects/rocket";
import { setMode } from "../game";
import { startEngineSound, playCountdown } from "../objects/sounds";

const countdownSeconds = 5;
let startScene = new THREE.Scene();
let startCamera, startControls, startRocket;
let launching = false, launchSpeed = 0, launchTime = 0;

export function setupStart(renderer) {
  startScene.add(createStarryBackground());
  startScene.add(new THREE.AmbientLight("#334466", 0.3));
  startScene.add(createLaunchPad());
  addSpotLight(1, 1, 1);
  startRocket = createLaunchingRocket();
  startScene.add(startRocket);
  createStartCamera(renderer);
  document.getElementById("startButton").addEventListener("click", startCountdown);
}

export function renderStart(renderer, delta) {
  if (launching) {
    launchSpeed += delta * 2;
    startRocket.position.y += launchSpeed * delta;
    launchTime += delta;
  }
  if (launchTime > 2) finishLaunch();
  renderer.render(startScene, startCamera);
}

export function getStartCamera() {
  return startCamera;
}

export function getStartRocket() {
  return startRocket;
}

export function isLaunching() {
  return launching;
}

function startCountdown() {
  document.getElementById("startButton").classList.add("hidden");
  startEngineSound();
  playCountdown(countdownSeconds, () => setTimeout(_ => launching = true, countdownSeconds * 1000));
}

function finishLaunch() {
  launching = false;
  startControls.enabled = false;
  setMode("menu");
}

function createLaunchPad() {
  let pad = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.1, 32), new THREE.MeshStandardMaterial({ color: "#777777" }));
  pad.position.y = 0.1;
  pad.castShadow = true;
  pad.receiveShadow = true;
  return pad;
}

function addSpotLight(x, y, z) {
  let spotLight = new THREE.SpotLight("#fff2cc", 1);
  spotLight.position.set(x, y, z);
  spotLight.angle = Math.PI / 5;
  spotLight.penumbra = 0.5;
  spotLight.target.position.set(0, 0.4, 0);
  spotLight.castShadow = true;
  startScene.add(spotLight, spotLight.target);
}

function createLaunchingRocket() {
  let rocket = createRocket();
  rocket.rotation.x = Math.PI / 2;
  rocket.position.y = 0.4;
  return rocket;
}

function createStartCamera(renderer) {
  startCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);
  startCamera.position.set(1.2, 0.6, 2.5);
  startControls = new OrbitControls(startCamera, renderer.domElement);
  startControls.target.set(0, 0.7, 0);
  startControls.enablePan = false;
  startControls.update();
}

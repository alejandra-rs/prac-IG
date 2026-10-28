import * as THREE from "three";
import { getState } from "./game";
import { showHelp } from "./help";

let activeView = "general";
let namesOn = true;
let generalCamera, rocketCameras, rocketGroup, orbitControls;
let minimapCamera = createMinimapCamera();

export function setViews(camera, cameras, rocket, controls) {
  generalCamera = camera;
  rocketCameras = cameras;
  rocketGroup = rocket;
  orbitControls = controls;
  document.getElementById("generalViewButton").addEventListener("click", _ => setView("general"));
  document.getElementById("thirdPersonViewButton").addEventListener("click", _ => setView("thirdPerson"));
  document.getElementById("firstPersonViewButton").addEventListener("click", _ => setView("firstPerson"));
  document.getElementById("namesButton").addEventListener("click", toggleNames);
}

export function applyNames(state) {
  document.getElementById("labels").classList.toggle("namesOff", state === "explore" && !namesOn);
}

export function setView(name) {
  activeView = name;
  orbitControls.enabled = name === "general";
  rocketGroup.visible = name === "thirdPerson";
  document.getElementById("minimapFrame").classList.toggle("hidden", name === "general");
  markActiveButton(name);
  if (getState() === "explore") showHelp(name);
}

export function getActiveCamera() {
  return activeView === "general" ? generalCamera : rocketCameras[activeView];
}

export function getActiveView() {
  return activeView;
}

export function isRocketView() {
  return activeView !== "general";
}

export function getMinimapCamera() {
  return minimapCamera;
}

function toggleNames() {
  namesOn = !namesOn;
  applyNames("explore");
  let icon = namesOn ? "fa-eye-slash" : "fa-eye";
  let text = namesOn ? "Ocultar nombres" : "Mostrar nombres";
  document.getElementById("namesButton").innerHTML = "<i class='fa-solid " + icon + "'></i> " + text;
}

function createMinimapCamera() {
  let camera = new THREE.OrthographicCamera(-35, 35, 35, -35, 0.1, 1000);
  camera.position.set(0, 100, 0);
  camera.up.set(0, 0, -1);
  camera.lookAt(0, 0, 0);
  camera.layers.enable(1);
  return camera;
}

function markActiveButton(name) {
  document.querySelectorAll("#explore nav button").forEach(b => b.classList.remove("active"));
  document.getElementById(name + "ViewButton").classList.add("active");
}

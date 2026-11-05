import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { createStarryBackground, createGlobe } from "./objects/scene.js";
import { earth } from "./data/earth.js";

let camera, controls, scene = new THREE.Scene();
let renderer = new THREE.WebGLRenderer({ antialias: true });

function init() {
  createRenderer();
  createWorld();
  window.addEventListener("resize", resize);
}

function createRenderer() {
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, earth.size * 4);

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = earth.size * 1.3;
  controls.maxDistance = earth.size * 6;
}

function createWorld() {
  scene.add(createStarryBackground());
  scene.add(new THREE.AmbientLight("#bbbbff", 0.3));
  let sunLight = new THREE.DirectionalLight("#fff4e0", 2);
  sunLight.position.set(5, 2, 3);
  scene.add(sunLight);
  scene.add(createGlobe(earth));
}

function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

function animationLoop() {
  requestAnimationFrame(animationLoop);
  controls.update();
  renderer.render(scene, camera);
}

init();
animationLoop();

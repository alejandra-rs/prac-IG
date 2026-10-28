import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import rocketUrl from "../models/rocket.glb";
import { FlyControls } from "three/examples/jsm/controls/FlyControls.js";
import { createParticles } from "./particles";

let lastPosition = new THREE.Vector3();

export function createRocket() {
  const rocketGroup = new THREE.Group();

  new GLTFLoader().load(rocketUrl, gltf => {
    let model = gltf.scene;
    transformRocket(model);
    rocketGroup.add(model);
    convertToPhong(model);
  });

  let particles = createParticles();
  particles.position.set(0, 0, 0.3);
  rocketGroup.userData.particles = particles;
  rocketGroup.add(particles)

  return rocketGroup;
}

export function isRocketMoving(rocketGroup) {
  let moving = rocketGroup.position.distanceTo(lastPosition) > 0;
  lastPosition.copy(rocketGroup.position);
  return moving;
}

export function createRocketControls(rocketGroup, domElement) {
  let controls = new FlyControls(rocketGroup, domElement);
  controls.movementSpeed = 1;
  controls.rollSpeed = 0.5;
  controls.dragToLook = true;
  return controls;
}

export function createRocketCameras(rocketGroup) {
  let firstPerson = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  firstPerson.position.set(0, 0, -0.3);
  rocketGroup.add(firstPerson);
  
  let thirdPerson = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  thirdPerson.position.set(0, 1, 1.5);
  rocketGroup.add(thirdPerson);
  thirdPerson.lookAt(rocketGroup.position);
  
  return {firstPerson, thirdPerson}
}

export function createRocketMarker() {
  let geometry = new THREE.CircleGeometry(1.2, 32);
  geometry.rotateX(-Math.PI / 2);
  let marker = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: "#ffdd00" }));
  marker.layers.set(1);
  return marker;
}

export function moveRocketMarker(marker, rocketGroup) {
  marker.position.set(rocketGroup.position.x, 5, rocketGroup.position.z);
}

function transformRocket(model) {
  let center = new THREE.Vector3();
  model.rotation.x = - Math.PI / 2;
  model.scale.set(0.03, 0.03, 0.03);
  new THREE.Box3().setFromObject(model).getCenter(center);
  model.position.sub(center);
}

function convertToPhong(model) {
  model.traverse(child => {
    if (child.isMesh) {
      child.material = new THREE.MeshPhongMaterial({
        color: child.material.color, transparent: child.material.transparent, 
        opacity: child.material.opacity, shininess: 80, specular: "#fafafa",
      })
      child.castShadow = true;
    }
  })
}


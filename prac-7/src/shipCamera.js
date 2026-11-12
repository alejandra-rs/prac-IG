import * as THREE from "three";
import * as TWEEN from "three/examples/jsm/libs/tween.module.js";

const BEHIND_SHIP = new THREE.Vector3(0, 0.018, -0.07);
const AHEAD_OF_SHIP = new THREE.Vector3(0, 0.006, 0.06);
const ORBIT_UP = new THREE.Vector3(0, 1, 0);
const ORBIT_DISTANCE = 2.5;
const FLIGHT_MILLISECONDS = 2500;
const DOCK_JUMP = 0.2;

let camera, controls, ship = null, flight = null;

export const isShipCameraOn = () => flight !== null;

export function setupShipCamera(cam, orbitControls) {
  camera = cam;
  controls = orbitControls;
}

export function followShip(model) {
  ship = model;
  controls.enabled = false;
  flyTo(() => ({ position: ship.localToWorld(BEHIND_SHIP.clone()), target: ship.localToWorld(AHEAD_OF_SHIP.clone()), up: ship.position.clone().normalize() }));
}

export function leaveShip() {
  if (!ship) return;
  ship = null;
  let orbit = { position: camera.position.clone().setLength(ORBIT_DISTANCE), target: controls.target, up: ORBIT_UP };
  flyTo(() => orbit).onComplete(() => {
    flight = null;
    controls.enabled = true;
  });
}

export function updateShipCamera() {
  let goal = flight.goal();
  if (ship && flight.progress === 1 && goal.position.distanceTo(camera.position) > DOCK_JUMP) return leaveShip();
  camera.position.lerpVectors(flight.start.position, goal.position, flight.progress);
  camera.up.lerpVectors(flight.start.up, goal.up, flight.progress).normalize();
  camera.lookAt(flight.target.lerpVectors(flight.start.target, goal.target, flight.progress));
}

function flyTo(goal) {
  if (flight) flight.tween.stop();
  let target = flight ? flight.target : controls.target.clone();
  flight = { start: { position: camera.position.clone(), up: camera.up.clone(), target: target.clone() }, goal, target, progress: 0 };
  return flight.tween = new TWEEN.Tween(flight).to({ progress: 1 }, FLIGHT_MILLISECONDS).easing(TWEEN.Easing.Cubic.InOut).start();
}

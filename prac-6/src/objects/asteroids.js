import * as THREE from "three";

export function createMainBelt() {
  return createBelt(10.9, 11.4, 1500, 0.06);
}

export function createKuiperBelt() {
  return createBelt(33, 38, 3000, 0.1);
}

function createBelt(innerRadius, outerRadius, count, rockSize) {
  let geometry = new THREE.IcosahedronGeometry(rockSize, 0);
  let material = new THREE.MeshStandardMaterial({ color: "#29241f", flatShading: true });
  let belt = new THREE.InstancedMesh(geometry, material, count);
  let helper = new THREE.Object3D();

  for (let i = 0; i < count; i++) {
    placeRock(helper, innerRadius, outerRadius);
    belt.setMatrixAt(i, helper.matrix);
  }

  return belt;
}

function placeRock(helper, innerRadius, outerRadius) {
  let angle = Math.random() * Math.PI * 2;
  let radius = innerRadius + Math.random() * (outerRadius - innerRadius);
  helper.position.set(Math.cos(angle) * radius, (Math.random() - 0.5) * 0.4, Math.sin(angle) * radius);
  helper.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
  helper.scale.set(0.5 + Math.random(), 0.5 + Math.random(), 0.5 + Math.random());
  helper.updateMatrix();
}

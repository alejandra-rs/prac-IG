import * as THREE from "three";
import stars from "../textures/stars.jpg";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";


const textureLoader = new THREE.TextureLoader();
const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x999999 });
const textureCache = {};

export function createStarryBackground() {
  return new THREE.Mesh(new THREE.SphereGeometry(500, 64, 32), 
                        new THREE.MeshBasicMaterial({ map: loadTexture(stars), side: THREE.BackSide }));
}

export function createStar(star, widthSegments=32, heightSegments=16) {
  let starMesh = createMesh(star, widthSegments, heightSegments, THREE.MeshBasicMaterial);
  starMesh.add(new THREE.PointLight(star.lightColor, 2, 0, 0))
  starMesh.rotation.z = star.tilt;
  starMesh.userData.spin = star.spin;
  starMesh.userData.size = star.size;
  starMesh.userData.name = star.name;
  return starMesh;
}

export function createPlanet(planet, widthSegments=32, heightSegments=16) {
  let planetMesh = createMesh(planet, widthSegments, heightSegments);
  addBump(planetMesh, planet);
  addExtraGeometry(planetMesh, planet, widthSegments, heightSegments);

  planetMesh.rotation.z = planet.tilt;

  const planetGroup = new THREE.Group();
  planetGroup.add(planetMesh)

  planetGroup.userData = { name: planet.name, dist: planet.distance, speed: planet.speed, spin: planet.spin,
                           size: planet.size, yScale: Math.sqrt(1 - planet.eccentricity * planet.eccentricity),
                           xOffset: -planet.distance * planet.eccentricity, angleOffset: 0,
                           mesh: planetMesh, moonPivots: [], label: createLabel(planet)};
  planetGroup.add(planetGroup.userData.label);

  let moonPlane = new THREE.Object3D();
  moonPlane.rotation.z = planet.tilt;
  planetGroup.add(moonPlane);

  planet.moons.forEach(m => {
    let moon = createMoon(m);
    moonPlane.add(moon);
    planetGroup.userData.moonPivots.push(moon);
  });

  return planetGroup;
}

function createMoon(moon) {
  let moonMesh = createMesh(moon, 10, 10);
  addBump(moonMesh, moon);
  moonMesh.position.x = moon.distance;

  let pivot = new THREE.Object3D();
  pivot.rotation.x = moon.inclination;
  pivot.userData.speed = moon.speed;
  pivot.add(moonMesh);
  pivot.add(createOrbit(moon.distance, 1))

  return pivot;
}

export function createOrbit(radius, yScale, xOffset = 0) {
  let curve = new THREE.EllipseCurve(xOffset, 0, radius, radius * yScale);
  let orbit = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(100)), orbitMaterial);
  
  orbit.userData.material = orbitMaterial;
  orbit.geometry.rotateX(Math.PI / 2);
  orbit.computeLineDistances();
  return orbit;
}

function createLabel(planet) {
  let div = document.createElement("div");
  div.className = "planetLabel";
  div.textContent = planet.name;

  let label = new CSS2DObject(div);
  label.position.set(0, planet.size + 0.4, 0);
  return label;
}

function addBump(mesh, body) {
  mesh.material.bumpMap = body.bumpMap ? loadTexture(body.bumpMap, false) : mesh.material.map;
  mesh.material.bumpScale = body.bumpScale;
}

function addExtraGeometry(planetMesh, planet, widthSegments, heightSegments) {
  if (planet.atmosphere) planetMesh.add(createAtmosphere(planet, widthSegments, heightSegments))
  if (planet.ring) planetMesh.add(createRing(planet))
}

function createAtmosphere(planet, widthSegments, heightSegments) {
  let atmosphere = new THREE.Mesh(new THREE.SphereGeometry(planet.size * 1.02, widthSegments, heightSegments),
                                  new THREE.MeshStandardMaterial({ alphaMap: loadTexture(planet.atmosphere), color: "#ffffff", transparent: true }))
  atmosphere.onBeforeRender = () => atmosphere.rotateY(-0.002);
  return atmosphere; 
}

function createRing(planet) {
  let inner = planet.size * 1.2
  let outer = planet.size * 2.3;
  const geometry = new THREE.RingGeometry(inner, outer, 64);
  let pos = geometry.attributes.position;
  let v3 = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++){
      v3.fromBufferAttribute(pos, i);
      geometry.attributes.uv.setXY(i, (v3.length() - inner) / (outer - inner), 1);
  }
  geometry.rotateX(Math.PI / 2);
  return new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ map: loadTexture(planet.ring), transparent: true, side: THREE.DoubleSide }))
}

function createMesh(object, widthSegments, heightSegments, material = THREE.MeshStandardMaterial) {
    return new THREE.Mesh(new THREE.SphereGeometry(object.size, widthSegments, heightSegments), 
                          new material({ map: loadTexture(object.texture) }));
}

function loadTexture(textureUrl, isColor = true) {
    if (textureCache[textureUrl]) return textureCache[textureUrl];
    const texture = textureLoader.load(textureUrl);
    if (isColor) texture.colorSpace = THREE.SRGBColorSpace;
    textureCache[textureUrl] = texture;
    return texture;
}
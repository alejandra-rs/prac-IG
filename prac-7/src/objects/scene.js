import * as THREE from "three";
import stars from "../textures/stars.jpg";

const textureLoader = new THREE.TextureLoader();
const textureCache = {};

export function createStarryBackground() {
  return new THREE.Mesh(new THREE.SphereGeometry(500, 64, 32),
                        new THREE.MeshBasicMaterial({ map: loadTexture(stars), side: THREE.BackSide }));
}

export function createGlobe(globe, widthSegments = 512, heightSegments = 256) {
  let globeMesh = createMesh(globe, widthSegments, heightSegments);
  addBump(globeMesh, globe);
  addDisplacement(globeMesh, globe);
  if (globe.atmosphere) globeMesh.add(createAtmosphere(globe, 128, 64));
  return globeMesh;
}

function addBump(mesh, body) {
  mesh.material.bumpMap = body.bumpMap ? loadTexture(body.bumpMap, false) : mesh.material.map;
  mesh.material.bumpScale = body.bumpScale;
}

function addDisplacement(mesh, body) {
  mesh.material.displacementMap = loadTexture(body.bumpMap, false);
  mesh.material.displacementScale = body.size * body.displacementScale;
}

export function getMaxRadius(globe) {
  return globe.size * (1 + (globe.displacementScale || 0));
}

function createAtmosphere(globe, widthSegments, heightSegments) {
  let atmosphere = new THREE.Mesh(new THREE.SphereGeometry(getMaxRadius(globe) + globe.size * 0.005, widthSegments, heightSegments),
                                  new THREE.MeshStandardMaterial({ alphaMap: loadTexture(globe.atmosphere), color: "#ffffff", transparent: true, depthWrite: false }));
  atmosphere.onBeforeRender = () => atmosphere.rotateY(-0.0005);
  return atmosphere;
}

function createMesh(object, widthSegments, heightSegments, material = THREE.MeshStandardMaterial) {
  return new THREE.Mesh(new THREE.SphereGeometry(object.size, widthSegments, heightSegments),
                        new material({ map: loadTexture(object.texture) }));
}

export function loadTexture(textureUrl, isColor = true) {
  if (textureCache[textureUrl]) return textureCache[textureUrl];
  const texture = textureLoader.load(textureUrl);
  if (isColor) texture.colorSpace = THREE.SRGBColorSpace;
  textureCache[textureUrl] = texture;
  return texture;
}

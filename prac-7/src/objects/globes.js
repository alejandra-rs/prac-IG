import * as THREE from "three";
import stars from "../textures/stars.jpg";
import { loadTerrain } from "./terrain.js";

const GLOW_COLOR = new THREE.Color("#3d80aa");
const GLOW_SCALE = 1.15;
const CLOUD_SPIN = -0.0005;
const textureLoader = new THREE.TextureLoader();

const GLOW_VERTEX_SHADER = `
  varying vec3 vNormal;
  varying vec3 vToCamera;

  void main() {
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vToCamera = normalize(-viewPosition.xyz);
    gl_Position = projectionMatrix * viewPosition;
  }
`;

const GLOW_FRAGMENT_SHADER = `
  uniform vec3 glowColor;
  varying vec3 vNormal;
  varying vec3 vToCamera;

  void main() {
    float rim = clamp(-dot(normalize(vNormal), normalize(vToCamera)) * 2.0, 0.0, 1.0);
    gl_FragColor = vec4(glowColor * pow(rim, 3.0), 1.0);
  }
`;

export function createStarryBackground() {
  return new THREE.Mesh(new THREE.SphereGeometry(500, 64, 32), new THREE.MeshBasicMaterial({ map: loadTexture(stars), side: THREE.BackSide }));
}

export function createDayGlobe(globe) {
  let material = new THREE.MeshStandardMaterial({ map: loadTexture(globe.texture), bumpScale: globe.bumpScale });
  return createGlobe(globe, material, ["bumpMap", "displacementMap"]).add(createClouds(globe));
}

export function createNightGlobe(globe) {
  let material = new THREE.MeshLambertMaterial({ color: "black", emissive: "white", emissiveMap: loadTexture(globe.nightTexture) });
  return createGlobe(globe, material, ["displacementMap"]).add(createGlow(globe));
}

function createGlobe(globe, material, reliefMaps) {
  material.displacementScale = globe.size * globe.displacementScale;
  loadTerrain(globe).then(terrain => {
    reliefMaps.forEach(map => material[map] = terrain.texture);
    material.needsUpdate = true;
  });
  return new THREE.Mesh(new THREE.SphereGeometry(globe.size, 512, 256), material);
}

function createClouds(globe) {
  let clouds = new THREE.Mesh(new THREE.SphereGeometry(globe.size * 1.05, 128, 64),
                              new THREE.MeshStandardMaterial({ alphaMap: loadTexture(globe.atmosphere), transparent: true, depthWrite: false }));
  clouds.onBeforeRender = () => clouds.rotateY(CLOUD_SPIN);
  return clouds;
}

function createGlow(globe) {
  return new THREE.Mesh(new THREE.SphereGeometry(globe.size * GLOW_SCALE, 64, 32),
                        new THREE.ShaderMaterial({ uniforms: { glowColor: { value: GLOW_COLOR } },
                                                   vertexShader: GLOW_VERTEX_SHADER, fragmentShader: GLOW_FRAGMENT_SHADER,
                                                   side: THREE.BackSide, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false }));
}

function loadTexture(url) {
  let texture = textureLoader.load(url);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

import * as THREE from "three";
import { latLonToVector3 } from "./terrain.js";
import { maxStockScale } from "../data.js";

const RADIUS_ABOVE_SURFACE = 1.01;
const SCATTER_RADIUS = 0.012;
const DOT_SIZE = 0.012;
const MIN_PIXELS = 1.5;
const MAX_PIXELS = 7;
const sharedUniforms = { uStockScale: { value: 1 }, uHalfHeight: { value: 1 }, uPixelRatio: { value: 1 } };

const VERTEX_SHADER = `
  uniform float uStockScale;
  uniform float uHalfHeight;
  uniform float uPixelRatio;
  attribute float aAppearsAt;

  void main() {
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uPixelRatio * clamp(${DOT_SIZE} * projectionMatrix[1][1] * uHalfHeight / -viewPosition.z, ${MIN_PIXELS.toFixed(1)}, ${MAX_PIXELS.toFixed(1)});
    gl_Position = aAppearsAt < uStockScale ? projectionMatrix * viewPosition : vec4(2.0, 2.0, 2.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  uniform vec3 uColor;

  void main() {
    float glow = 1.0 - smoothstep(0.0, 0.5, length(gl_PointCoord - 0.5));
    gl_FragColor = vec4(uColor * pow(glow, 1.6), 1.0);
  }
`;

export function createPlasticLayer(layer, globe) {
  let dots = dotsAroundSamples(layer, globe.size * RADIUS_ABOVE_SURFACE);
  let geometry = new THREE.BufferGeometry().setFromPoints(dots.map(dot => dot.position));
  geometry.setAttribute("aAppearsAt", new THREE.Float32BufferAttribute(dots.map(dot => dot.appearsAt), 1));
  return Object.assign(new THREE.Points(geometry, createMaterial(layer.color)), { name: layer.id });
}

export function showPlasticStock(stockScale) {
  sharedUniforms.uStockScale.value = stockScale;
}

export function resizePlastic(height, pixelRatio) {
  sharedUniforms.uHalfHeight.value = height / 2;
  sharedUniforms.uPixelRatio.value = pixelRatio;
}

function dotsAroundSamples(layer, radius) {
  return layer.points.flatMap(sample => {
    let center = latLonToVector3(sample[0], sample[1], radius), count = layer.dotsPerSquare(sample);
    return Array.from({ length: Math.ceil(count * maxStockScale) }, (_, i) => ({ appearsAt: i / count, position: randomNear(center, i / count) }));
  });
}

function randomNear(center, appearsAt) {
  let distance = SCATTER_RADIUS * Math.sqrt(Math.max(1, appearsAt)) * Math.sqrt(-2 * Math.log(1 - Math.random()));
  return new THREE.Vector3().randomDirection().multiplyScalar(distance).add(center).setLength(center.length());
}

function createMaterial(color) {
  return new THREE.ShaderMaterial({ uniforms: { uColor: { value: new THREE.Color(color).convertLinearToSRGB() }, ...sharedUniforms },
                                    vertexShader: VERTEX_SHADER, fragmentShader: FRAGMENT_SHADER,
                                    blending: THREE.AdditiveBlending, transparent: true, depthWrite: false });
}

import * as THREE from "three";

const BLUR_RADIUS = 4;
const BLUR_PASSES = 3;
const UP = new THREE.Vector3(0, 1, 0);

let terrain = null;

export function latLonToVector3(lat, lon, radius, target = new THREE.Vector3()) {
  let phi = THREE.MathUtils.degToRad(lon + 180), theta = THREE.MathUtils.degToRad(90 - lat);
  return target.set(-radius * Math.cos(phi) * Math.sin(theta), radius * Math.cos(theta), radius * Math.sin(phi) * Math.sin(theta));
}

export function loadTerrain(globe) {
  return terrain = terrain || new THREE.ImageLoader().loadAsync(globe.bumpMap).then(image => createTerrain(image, globe));
}

function createTerrain(image, globe) {
  let raw = southFirstHeights(image), heights = blurred(raw, image.width);
  let isLand = spot => raw[pixelIndex(spot, image)] > 0;
  return {
    texture: heightTexture(heights, image),
    place: (object, spot) => placeOnSurface(object, spot, globe.size * (1 + globe.displacementScale * heights[pixelIndex(spot, image)])),
    isLand,
  };
}

function blurred(heights, width) {
  for (let pass = 0; pass < BLUR_PASSES; pass++) heights = blur(blur(heights, 1), width);
  return heights;
}

function southFirstHeights(image) {
  let context = Object.assign(document.createElement("canvas"), { width: image.width, height: image.height }).getContext("2d");
  context.setTransform(1, 0, 0, -1, 0, image.height);
  context.drawImage(image, 0, 0);
  return Float32Array.from(context.getImageData(0, 0, image.width, image.height).data.filter((_, i) => i % 4 === 0), red => red / 255);
}

function blur(values, step) {
  return values.map((value, i) => {
    let sum = 0;
    for (let k = -BLUR_RADIUS; k <= BLUR_RADIUS; k++) sum += values[i + k * step] === undefined ? value : values[i + k * step];
    return sum / (2 * BLUR_RADIUS + 1);
  });
}

function heightTexture(heights, { width, height }) {
  let texture = new THREE.DataTexture(Uint16Array.from(heights, THREE.DataUtils.toHalfFloat), width, height, THREE.RedFormat, THREE.HalfFloatType);
  texture.magFilter = texture.minFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

function pixelIndex({ lat, lon }, { width, height }) {
  let row = THREE.MathUtils.clamp(Math.floor((lat + 90) / 180 * height), 0, height - 1);
  let column = Math.floor(THREE.MathUtils.euclideanModulo(lon + 180, 360) / 360 * width) % width;
  return row * width + column;
}

function placeOnSurface(object, { lat, lon }, radius) {
  latLonToVector3(lat, lon, radius, object.position);
  object.quaternion.setFromUnitVectors(UP, object.position.clone().normalize());
  return object;
}

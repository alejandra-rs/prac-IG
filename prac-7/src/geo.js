import * as THREE from "three";

export function latLonToVector3(lat, lon, radius, target = new THREE.Vector3()) {
  let phi = THREE.MathUtils.degToRad(lon + 180);
  let theta = THREE.MathUtils.degToRad(90 - lat);
  return target.set(-radius * Math.cos(phi) * Math.sin(theta),
                    radius * Math.cos(theta),
                    radius * Math.sin(phi) * Math.sin(theta));
}

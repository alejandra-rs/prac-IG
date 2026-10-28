import * as THREE from "three";

const particlesMaterial = new THREE.PointsMaterial({ color: "#ffaa33", size: 0.05, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
const maxLife = 0.5;

export function createParticles(n_particles=200) {
  let particlesGeometry = new THREE.BufferGeometry();
  particlesGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n_particles * 3), 3));
  let particles = new THREE.Points(particlesGeometry, particlesMaterial);
  particles.userData.lives = createLives(n_particles);
  return particles;
}

export function moveParticles(particles, delta, on=true, maxDistance=Infinity) {
  particles.visible = on;
  if (!on) return;
  let lives = particles.userData.lives;
  let positions = particles.geometry.attributes.position.array;
  for (let i = 0; i < lives.length; i++) {
    let position = positions.subarray(i * 3, i * 3 + 3);
    lives[i] += delta;
    if (lives[i] > maxLife) {
      lives[i] = 0;
      position.fill(0);
    }
    else moveParticle(position, delta, maxDistance);
  }
  particles.geometry.attributes.position.needsUpdate = true;
}

function createLives(n_particles) {
  let lives = new Float32Array(n_particles);
  for (let i = 0; i < n_particles; i++) lives[i] = Math.random() * maxLife;
  return lives;
}

function moveParticle(position, delta, maxDistance) {
  position[0] += (Math.random() - 0.5) * delta;
  position[1] += (Math.random() - 0.5) * delta;
  position[2] = Math.min(position[2] + delta * 2, maxDistance);
}

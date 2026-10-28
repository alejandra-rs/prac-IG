const rocketRadius = 0.5;

export function handleRocketCollisions(rocket, bodies) {
  bodies.forEach(b => {
    let minDist = b.userData.size + rocketRadius;
    let offset = rocket.position.clone().sub(b.position);
    if (offset.length() < minDist) rocket.position.copy(b.position).add(offset.setLength(minDist));
  });
}

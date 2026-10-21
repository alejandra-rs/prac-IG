import { vec3 } from "gl-matrix";
import { ENTITIES } from "./entities.js";
import { TENT, LOG, FIRE, POT } from "./campsite.js";

const COLLISION_SHAPES = {
  tree: { type: "circle", radius: 0.3 },
  lamp: { type: "circle", radius: 0.03 },
  fire: { type: "circle", radius: FIRE.radius },
  tent: { type: "rectangle", halfWidth: TENT.halfWidth, halfLength: TENT.length / 2,},
  log: { type: "rectangle", halfWidth: LOG.length / 2, halfLength: LOG.radius },
  pot: { type: "circle", radius: POT.radius },
};

const HITBOXES = ENTITIES.filter((e) => COLLISION_SHAPES[e.type])
                         .map((e) => ({...e, shape: COLLISION_SHAPES[e.type],}));

export function collides(x, z, radius) {
  return HITBOXES.some((hitbox) => playerCollidesWith(hitbox, x, z, radius));
}

function playerCollidesWith(hitbox, x, z, radius) {
  if (hitbox.shape.type === "circle") return collidesWithCircle(hitbox, x, z, radius);
  return collidesWithRectangle(hitbox, x, z, radius);
}

function collidesWithCircle(hitbox, x, z, radius) {
  const hitboxRadius = hitbox.shape.radius * hitbox.scale[0];
  return (vec3.distance([x, 0, z], [hitbox.x, 0, hitbox.z]) < hitboxRadius + radius);
}

function collidesWithRectangle(hitbox, x, z, radius) {
  const hitboxCoords = worldToHitboxSystem(hitbox, x, z);
  const halfWidth = hitbox.shape.halfWidth * hitbox.scale[0];
  const halfLength = hitbox.shape.halfLength * hitbox.scale[2];
  const xClosest = Math.max(-halfWidth, Math.min(halfWidth, hitboxCoords[0]));
  const zClosest = Math.max(-halfLength, Math.min(halfLength, hitboxCoords[2]));
  
  return vec3.distance([hitboxCoords[0], 0, hitboxCoords[2]], [xClosest, 0, zClosest]) < radius;
}

function worldToHitboxSystem(hitbox, x, z) {
  const centre = [hitbox.x, 0, hitbox.z];
  const point = vec3.rotateY(vec3.create(), [x, 0, z], centre, -hitbox.angle);
  return [point[0] - centre[0], 0, point[2] - centre[2]];
}

import { vec4 } from "gl-matrix";
import { ENTITIES } from "../world/entities.js";
import { POST } from "./renderLamp.js";
import { modelMatrix } from "./core.js";
import { moon, torch, attenuation, phong } from "../config.js";

export const LIGHT_SOURCES = {
  fire: { on: true, height: 0.3, color: [2.0, 1.0, 0.3] },
  lamp: { on: true, height: POST.height, color: [1.0, 0.9, 0.6] },
};

export const LIGHTS = ENTITIES.filter((e) => LIGHT_SOURCES[e.type])
                              .map(lightFromEntity);

function lightFromEntity(entity) {
  const source = LIGHT_SOURCES[entity.type];
  return { position: [entity.x, source.height, entity.z], source };
}

export function setupLights(gl, uniforms) {
  gl.uniform1f(uniforms.ambientWeight, phong.ambient);
  gl.uniform1f(uniforms.diffuseWeight, phong.diffuse);
  gl.uniform1f(uniforms.specularWeight, phong.specular);
  gl.uniform1f(uniforms.shininessScale, phong.shininessScale);

  gl.uniform3fv(uniforms.lightPositions, LIGHTS.flatMap(l => worldToPlayerSystem(l.position, 1)));
  gl.uniform3fv(uniforms.lightColors, LIGHTS.flatMap(l => lightColor(l.source)));
  
  gl.uniform1f(uniforms.attenuation, attenuation.factor);

  gl.uniform3fv(uniforms.moonDirection, worldToPlayerSystem(moon.direction, 0));
  gl.uniform3fv(uniforms.moonColor, lightColor(moon));

  gl.uniform3fv(uniforms.torchColor, lightColor(torch));
  gl.uniform1f(uniforms.torchInner, Math.cos((torch.innerAngle * Math.PI) / 180));
  gl.uniform1f(uniforms.torchOuter, Math.cos((torch.outerAngle * Math.PI) / 180));
}

function lightColor(light) {
  return light.on ? light.color : [0, 0, 0];
}

function worldToPlayerSystem([x, y, z], h) {
  const result = vec4.transformMat4(vec4.create(), [x, y, z, h], modelMatrix);
  return [result[0], result[1], result[2]];
}
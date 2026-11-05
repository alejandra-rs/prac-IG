import earthTexture from "../textures/earth.jpg";
import earthBumpMapTexture from "../textures/earth_bump_map.jpg";
import cloudsTexture from "../textures/clouds.jpg";

export const earth = {
  name: "Tierra",
  texture: earthTexture,
  bumpMap: earthBumpMapTexture,
  bumpScale: 2,
  displacementScale: 0.04,
  atmosphere: cloudsTexture,
  size: 1,
};

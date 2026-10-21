import { drawPolygon, buildM } from "./polygon.js";

const trapezoidVertices = new Float32Array(8);

export function drawTrapezoid(gl, colorLocation, canyon, aspect) {
  trapezoidVertices.set([
    -canyon.bottomWidth / 2,
    0,
    canyon.bottomWidth / 2,
    0,
    canyon.topWidth / 2,
    -canyon.height,
    -canyon.topWidth / 2,
    -canyon.height,
  ]);

  drawPolygon(
    gl,
    colorLocation,
    trapezoidVertices,
    canyon.color,
    buildM(canyon.tiltAngle, aspect, canyon.x, canyon.y)
  );
}

import { drawPolygon } from "./polygon.js";

const CIRCLE_SEGMENTS = 32;

const circleVertices = new Float32Array((CIRCLE_SEGMENTS + 2) * 2);

export function drawCircle(gl, colorLocation, circle, aspect) {
  const radiusX = circle.radius / aspect;
  const startAngle = circle.startAngle || 0;
  const sweep = (circle.endAngle || 2 * Math.PI) - startAngle;

  circleVertices[0] = circle.x;
  circleVertices[1] = circle.y;

  for (let i = 1; i <= CIRCLE_SEGMENTS + 1; i++) {
    const angle = startAngle + ((i - 1) / CIRCLE_SEGMENTS) * sweep;
    circleVertices[2 * i] = circle.x + radiusX * Math.cos(angle);
    circleVertices[2 * i + 1] = circle.y + circle.radius * Math.sin(angle);
  }

  drawPolygon(gl, colorLocation, circleVertices, circle.color);
}

import { drawPolygon } from "./polygon.js";

const rectVertices = new Float32Array(8);

export function drawRectangle(gl, colorLocation, rect, aspect) {
  const widthX = rect.width / aspect;

  rectVertices.set([
    rect.x,
    rect.y,
    rect.x + widthX,
    rect.y,
    rect.x + widthX,
    rect.y + rect.height,
    rect.x,
    rect.y + rect.height,
  ]);
  drawPolygon(gl, colorLocation, rectVertices, rect.color);
}

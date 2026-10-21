import { drawCircle } from "./shapes/circle.js";
import { drawRectangle } from "./shapes/rectangle.js";
import { drawTrapezoid } from "./shapes/trapezoid.js";

import { ball, collector, canyon, LAUNCH_SPEED, resetBall } from "./objects.js";
import { pegs } from "./pegs.js";

const GRAVITY = 1;
const RESTITUTION = 0.9;
const MAX_TILT = Math.PI / 2 - 0.3;

export function moveCanyon(gl, colorLocation, aspect, deltaTime) {
  canyon.tiltAngle += canyon.tiltSpeed * deltaTime;
  canyon.tiltAngle = Math.max(-MAX_TILT, Math.min(MAX_TILT, canyon.tiltAngle));
  drawCanyon(gl, colorLocation, aspect);
}

export function moveCollector(gl, colorLocation, aspect, deltaTime) {
  collector.x += collector.speedX * deltaTime;
  if (collector.x <= -1 && collector.speedX < 0) collector.speedX *= -1;
  if (collector.x + collector.width / aspect >= 1 && collector.speedX > 0)
    collector.speedX *= -1;
  drawRectangle(gl, colorLocation, collector, aspect);
}

export function moveBall(gl, colorLocation, aspect, deltaTime) {
  if (!ball.launched) {
    if (ball.launchRequested) {
      ball.launched = true;
      ball.launchRequested = false;
      ball.speedX = (LAUNCH_SPEED * Math.sin(canyon.tiltAngle)) / aspect;
      ball.speedY = -LAUNCH_SPEED * Math.cos(canyon.tiltAngle);
    } else {
      ball.x = canyon.x + (canyon.height * Math.sin(canyon.tiltAngle)) / aspect;
      ball.y = canyon.y - canyon.height * Math.cos(canyon.tiltAngle);
    }
  } else {
    ball.speedY -= GRAVITY * deltaTime;
    ball.x += ball.speedX * deltaTime;
    ball.y += ball.speedY * deltaTime;

    checkPegCollisions(aspect);
    checkBorderCollisions(aspect);
    checkCollectorCollisions(aspect);
  }

  drawCircle(gl, colorLocation, ball, aspect);
}

export function drawPegs(gl, colorLocation, aspect) {
  for (const peg of pegs) {
    if (!peg.popped) drawCircle(gl, colorLocation, peg, aspect);
  }
}

function drawCanyon(gl, colorLocation, aspect) {
  drawTrapezoid(gl, colorLocation, canyon, aspect);

  drawCircle(
    gl,
    colorLocation,
    {
      x: canyon.x,
      y: canyon.y,
      radius: canyon.radius,
      startAngle: Math.PI,
      endAngle: 2 * Math.PI,
      color: canyon.color,
    },
    aspect
  );
}

function checkBorderCollisions(aspect) {
  if (ball.y + ball.radius >= 1 && ball.speedY > 0) ball.speedY *= -RESTITUTION;
  if (
    (ball.x - ball.radius / aspect <= -1 && ball.speedX < 0) ||
    (ball.x + ball.radius / aspect >= 1 && ball.speedX > 0)
  ) {
    ball.speedX *= -RESTITUTION;
  }
  if (ball.y - ball.radius <= -1) resetBall(0);
}

function checkCollectorCollisions(aspect) {
  const closestX = Math.max(
    collector.x,
    Math.min(ball.x, collector.x + collector.width / aspect)
  );
  const closestY = Math.max(
    collector.y,
    Math.min(ball.y, collector.y + collector.height)
  );

  if (distance(ball, { x: closestX, y: closestY }, aspect) < ball.radius) {
    resetBall(1);
  }
}

function checkPegCollisions(aspect) {
  for (const peg of pegs) {
    const dist = distance(ball, peg, aspect);
    if (!peg.popped && dist < ball.radius + peg.radius) {
      const nx = ((ball.x - peg.x) * aspect) / dist;
      const ny = (ball.y - peg.y) / dist;

      const overlap = ball.radius + peg.radius - dist;
      ball.x += (nx / aspect) * overlap;
      ball.y += ny * overlap;

      const dot = 2 * (ball.speedX * aspect * nx + ball.speedY * ny);
      ball.speedX -= (dot * nx) / aspect;
      ball.speedY -= dot * ny;

      peg.popped = true;
      break;
    }
  }
}

function distance(point1, point2, aspect = 1) {
  const dx = (point1.x - point2.x) * aspect;
  const dy = point1.y - point2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

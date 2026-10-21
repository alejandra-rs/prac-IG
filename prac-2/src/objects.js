export const TOTAL_BALLS = 5;
let ballsLeft = TOTAL_BALLS;

const INITIAL_BALL = {
  x: 0,
  y: 0.7,
  radius: 0.03,
  color: [0.6, 0.6, 0.6, 1],
  speedX: 0,
  speedY: 0,
  launched: false,
  launchRequested: false,
};

const INITIAL_COLLECTOR = {
  x: -0.2,
  y: -0.98,
  width: 0.7,
  height: 0.1,
  color: [0.3, 0.3, 0.3, 1],
  speedX: 0.75,
};

const INITIAL_CANYON = {
  x: 0,
  y: 1,
  radius: 0.15,
  bottomWidth: 0.2,
  topWidth: 0.1,
  height: 0.3,
  tiltAngle: 0,
  tiltSpeed: 0,
  color: [0.2, 0.2, 0.2, 1],
};

export const LAUNCH_SPEED = 2;

export const ball = { ...INITIAL_BALL };
export const collector = { ...INITIAL_COLLECTOR };
export const canyon = { ...INITIAL_CANYON };

export function resetGame() {
  ballsLeft = TOTAL_BALLS;
  document.getElementById("ballsLeft").textContent = ballsLeft;
  Object.assign(ball, INITIAL_BALL);
  Object.assign(collector, INITIAL_COLLECTOR);
  Object.assign(canyon, INITIAL_CANYON);
}

export function getBallsLeft() {
  return ballsLeft;
}

export function hasBalls() {
  return ballsLeft > 0;
}

export function resetBall(bonus) {
  ballsLeft += bonus - 1;
  document.getElementById("ballsLeft").textContent = ballsLeft;
  Object.assign(ball, INITIAL_BALL);
}

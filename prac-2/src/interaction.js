import { canyon, ball } from "./objects.js";

var prevTouchX;

document.onkeydown = onKeyDown;
document.onkeyup = onKeyUp;

function onKeyDown(key) {
  switch (key.keyCode) {
    case 32:
      if (!ball.launched) ball.launchRequested = true;
      break;
    case 37:
      canyon.tiltSpeed = -1.5;
      break;
    case 39:
      canyon.tiltSpeed = 1.5;
      break;
  }
}

function onKeyUp(key) {
  if (key.keyCode === 37 || key.keyCode === 39) canyon.tiltSpeed = 0;
}

export function onTouchStart(e) {
  e.preventDefault();
  prevTouchX = parseInt(e.changedTouches[0].clientX);
}

export function onTouchMove(e) {
  e.preventDefault();
  const touchX = parseInt(e.changedTouches[0].clientX);
  const difX = touchX - prevTouchX;
  canyon.tiltSpeed = 0.5 * difX;
  prevTouchX = touchX;
}

export function onTouchEnd(e) {
  e.preventDefault();
  canyon.tiltSpeed = 0;
}

export function onLaunchRequested(e) {
  e.preventDefault();
  if (!ball.launched) ball.launchRequested = true;
}

import { torch } from "./config";

const MOVE_KEYS = {
  KeyW: [0, 0, -1],
  KeyS: [0, 0, 1],
  KeyA: [-1, 0, 0],
  KeyD: [1, 0, 0],
};

const VIEW_KEYS = {
  ArrowUp: [1, 0],
  ArrowDown: [-1, 0],
  ArrowLeft: [0, 1],
  ArrowRight: [0, -1],
};

const keysDown = new Set();

export function addEventListeners() {
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", (e) => keysDown.delete(e.code));
}

function onKeyDown(e) {
  if (e.code === 'KeyF' && !e.repeat) torch.on = !torch.on;
  if (!(e.code in MOVE_KEYS || e.code in VIEW_KEYS)) return;
  e.preventDefault();
  keysDown.add(e.code);
}

export function getMoveDirection() {
  const total = [0, 0, 0];
  for (const code of keysDown) {
    if (MOVE_KEYS[code]) MOVE_KEYS[code].forEach((val, i) => (total[i] += val));
  }
  return total;
}

export function getViewDirection() {
  const total = [0, 0];
  for (const code of keysDown) {
    if (VIEW_KEYS[code]) VIEW_KEYS[code].forEach((val, i) => (total[i] += val));
  }
  return total;
}

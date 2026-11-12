import * as THREE from "three";
import { areLightsOff } from "./panels.js";
import { countryName, formatNumber } from "./data.js";

const CARD_TEXT = {
  takeout: info => [info.place, `${formatNumber(info.items)} envases de comida rápida, sobre todo de ${info.brand}`],
  route: info => [`${countryName(info.from)} → ${countryName(info.to)}`, `${formatNumber(info.tonnes)} toneladas de residuos plásticos al año`],
  plant: info => [`${info.rank}. ${info.name}`, `Capacidad de ${formatNumber(info.capacity)} kt de etileno/año`],
};

const DRAG_PIXELS = 5;
const CLICK_PIXELS = 16;
const ZOOM_INFO_DISTANCE = 1.8;
const ZOOM_INFO_ALIGNMENT = Math.cos(THREE.MathUtils.degToRad(8));
const card = document.getElementById("infoCard");

let pressedAt = null, shown = null, pinned = false;

export function setupInfoCard(camera, models, onClick) {
  window.addEventListener("pointerdown", event => pressedAt = event);
  window.addEventListener("pointermove", event => document.body.style.cursor = modelAt(event, camera, models) ? "pointer" : "");
  window.addEventListener("click", event => {
    if (Math.hypot(event.clientX - pressedAt.clientX, event.clientY - pressedAt.clientY) > DRAG_PIXELS || !isOnGlobe(event)) return;
    let model = modelAt(event, camera, models);
    model ? showInfo(model, true) : hideInfo();
    onClick(model);
  });
  card.querySelector("button").addEventListener("click", () => { hideInfo(); onClick(null); });
}

export function showCentredInfo(camera, models) {
  if (pinned) return;
  let view = camera.position.clone().normalize(), alignment = model => model.position.clone().normalize().dot(view);
  let centred = models.reduce((best, model) => alignment(model) > alignment(best) ? model : best, models[0]);
  camera.position.length() < ZOOM_INFO_DISTANCE && centred && alignment(centred) > ZOOM_INFO_ALIGNMENT ? showInfo(centred, false) : hideInfo();
}

export function hideInfo() {
  shown = null;
  pinned = false;
  card.hidden = true;
}

function showInfo(model, pin) {
  pinned = pin;
  if (model === shown) return;
  shown = model;
  let [title, summary] = CARD_TEXT[model.userData.info.kind](model.userData.info);
  card.querySelector("h3").textContent = title;
  card.querySelector(".summary").textContent = summary;
  card.hidden = false;
}

function isOnGlobe(event) {
  return event.target.tagName === "CANVAS" && !areLightsOff();
}

function modelAt(event, camera, models) {
  if (!isOnGlobe(event)) return null;
  let pixelsAway = model => {
    let spot = model.position.clone().project(camera);
    return Math.hypot((spot.x + 1) / 2 * window.innerWidth - event.clientX, (1 - spot.y) / 2 * window.innerHeight - event.clientY);
  };
  let facing = models.filter(model => model.position.dot(camera.position) > model.position.lengthSq());
  let nearest = facing.reduce((best, model) => !best || pixelsAway(model) < pixelsAway(best) ? model : best, null);
  return nearest && pixelsAway(nearest) < CLICK_PIXELS ? nearest : null;
}

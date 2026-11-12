import * as THREE from "three";
import * as TWEEN from "three/examples/jsm/libs/tween.module.js";
import { plasticLayers, takeoutBrands, wasteRoutes, ethylenePlants, firstYear, lastYear, lastEstimatedYear, stockInYear, isProjected, stockScale, countryName, formatNumber } from "./data.js";
import { showPlasticStock } from "./objects/plastic.js";

const INTRO_MILLISECONDS = 9000;
const INTRO_END_DISTANCE = 3.2;
const YEAR_MILLISECONDS = 150;
const TOP_SHOWN = 3;
const THUMBNAIL_SIZE = 128;
const THUMBNAIL_VIEW = new THREE.Vector3(1, 0.7, 1.2).normalize();
const slider = document.getElementById("timeline");
const playButton = document.getElementById("timelinePlay");

let lightsOff = true, introZoom = null, playTimer = null;

export const areLightsOff = () => lightsOff;

export function playIntro(camera) {
  document.body.classList.remove("loading");
  introZoom = new TWEEN.Tween({ distance: camera.position.length() }).to({ distance: INTRO_END_DISTANCE }, INTRO_MILLISECONDS)
    .easing(TWEEN.Easing.Quadratic.Out).onUpdate(({ distance }) => camera.position.setLength(distance)).onComplete(endIntro).start();
  window.addEventListener("pointerdown", endIntro, { once: true });
  window.addEventListener("keydown", endIntro, { once: true });
}

export function setupLightSwitch(onToggle) {
  document.getElementById("lightSwitch").addEventListener("click", () => {
    lightsOff = !lightsOff;
    document.body.classList.toggle("night", lightsOff);
    onToggle();
  });
}

export function setupSourcesPanel(models) {
  let renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setSize(THUMBNAIL_SIZE, THUMBNAIL_SIZE);
  Object.entries(models).forEach(([kind, model]) => document.getElementById("legend-" + kind).src = thumbnail(renderer, model));
  renderer.dispose();
  fillList("takeoutTop", takeoutBrands);
  fillList("plantsTop", ethylenePlants.map(plant => plant.name));
  fillList("routesTop", wasteRoutes.map(route => `${countryName(route.from)} → ${countryName(route.to)}`));
}

export function setupPlasticPanel(layerPoints) {
  plasticLayers.forEach(layer => document.documentElement.style.setProperty("--" + layer.id, layer.color));
  layerPoints.forEach(points => document.getElementById("layer-" + points.name).addEventListener("change", event => points.visible = event.target.checked));
  Object.assign(slider, { min: firstYear, max: lastYear, value: lastEstimatedYear });
  slider.addEventListener("input", () => { setPlaying(false); showYear(); });
  playButton.addEventListener("click", () => setPlaying(!playTimer));
  showYear();
}

function endIntro() {
  introZoom.stop();
  document.body.classList.remove("intro");
}

function showYear() {
  let year = Number(slider.value);
  document.getElementById("timelineYear").textContent = year;
  document.getElementById("timelineStock").textContent = `${formatNumber(stockInYear(year))} Mt`;
  document.getElementById("timelineBox").classList.toggle("projected", isProjected(year));
  showPlasticStock(stockScale(year));
}

function setPlaying(playing) {
  if (playing && slider.value === slider.max) slider.value = slider.min;
  clearInterval(playTimer);
  playTimer = playing ? setInterval(nextYear, YEAR_MILLISECONDS) : null;
  playButton.firstElementChild.className = playing ? "fa-solid fa-pause" : "fa-solid fa-play";
}

function nextYear() {
  slider.stepUp();
  showYear();
  if (slider.value === slider.max) setPlaying(false);
}

function fillList(id, lines) {
  document.getElementById(id).replaceChildren(...lines.slice(0, TOP_SHOWN).map(line => Object.assign(document.createElement("li"), { textContent: line })));
}

function thumbnail(renderer, model) {
  let light = new THREE.DirectionalLight("#fff4e0", 2);
  light.position.set(1, 2, 1.5);
  let scene = new THREE.Scene().add(new THREE.AmbientLight("#ffffff", 1.2), light, model.clone());
  let box = new THREE.Box3().setFromObject(scene);
  let center = box.getCenter(new THREE.Vector3()), radius = box.getBoundingSphere(new THREE.Sphere()).radius;
  let camera = new THREE.PerspectiveCamera(30, 1, radius / 100, radius * 100);
  camera.position.copy(center).addScaledVector(THUMBNAIL_VIEW, radius / Math.sin(THREE.MathUtils.degToRad(15)));
  camera.lookAt(center);
  renderer.render(scene, camera);
  return renderer.domElement.toDataURL();
}

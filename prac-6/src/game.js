import * as THREE from "three"
import { resetLearn } from "./modes/learn";
import { setView, applyNames } from "./views";
import { showHelp } from "./help";
import learnImage from "./img/learn.jpg";
import exploreImage from "./img/explore.jpg";

let state = "start";
let paused = false;
let speed = 1;
const states = ["start", "menu", "explore", "learn", "closeup"]

let camControls, planets, orbits;

export const dashedMaterial = new THREE.LineDashedMaterial({ color: 0x999999, dashSize: 0.5, gapSize: 0.3 })

export function getState() {
  return state;
}

export function setMode(newState) {
  let solarSystemMode = ["learn", "explore"].includes(newState);
  setState(newState);
  states.forEach(s => document.getElementById(s).classList.toggle("hidden", s !== newState));
  setView("general");
  camControls.enabled = solarSystemMode;
  showPlanets(newState !== "learn");
  dashOrbits(newState === "learn");
  showLabels(solarSystemMode);
  applyNames(newState);
  if (newState !== "explore") showHelp(newState);
}

export function setGameEvents(controls, planetObjects, orbitObjects) {
  camControls = controls;
  planets = planetObjects;
  orbits = orbitObjects;
  document.getElementById("menuLearnButton").style.backgroundImage = "url(" + learnImage + ")";
  document.getElementById("menuExploreButton").style.backgroundImage = "url(" + exploreImage + ")";
  document.getElementById("menuLearnButton").addEventListener("click", _ => { setMode("learn"); resetLearn(); })
  document.getElementById("menuExploreButton").addEventListener("click", _ => setMode("explore"))
  document.getElementById("exploreMenuButton").addEventListener("click", _ => setMode("menu"))
  document.getElementById("learnMenuButton").addEventListener("click", _ => setMode("menu"))
  document.getElementById("pauseButton").addEventListener("click", _ => setPaused(!paused));
  document.getElementById("speedSlider").addEventListener("input", changeSpeed);
}

function changeSpeed(event) {
  speed = Number(event.target.value);
  document.getElementById("speedValue").textContent = "x" + speed.toFixed(1);
}

export function getSpeed() {
  return speed;
}

export function isPaused() {
  return paused;
}

export function setPaused(value) {
  paused = value;
  let icon = paused ? "fa-play" : "fa-pause";
  let text = paused ? "Seguir" : "Pausa";
  document.getElementById("pauseButton").innerHTML = "<i class='fa-solid " + icon + "'></i> " + text;
}

function setState(newState) {
  state = newState;
  setPaused(false);
  document.getElementById("planetPickerPanel").classList.add("hidden")
}

function showPlanets(visibility) {
  planets.forEach(p => p.visible = visibility);
}

function dashOrbits(dashed) {
  orbits.forEach(o => o.material = dashed ? dashedMaterial : o.userData.material);
}

function showLabels(visibility) {
  document.getElementById("labels").classList.toggle("hidden", !visibility);
}
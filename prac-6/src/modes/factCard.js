import { planetFacts } from "../data/planetFacts.js";

let currentFacts = [], factIndex = 0;

export function setupFactCard() {
  document.getElementById("nextFactButton").addEventListener("click", nextFact);
}

export function showFacts(planetName) {
  let facts = planetFacts[planetName];
  document.getElementById("factDay").textContent = dayText(facts.dayLength);
  document.getElementById("factYear").textContent = yearText(facts.yearLength);
  document.getElementById("factYear").parentElement.classList.toggle("hidden", facts.yearLength === undefined);
  document.getElementById("factSize").textContent = sizeText(facts.diameter);
  document.getElementById("factMoons").textContent = moonsText(facts.moons);
  document.getElementById("factMoons").parentElement.classList.toggle("hidden", facts.moons === undefined);
  currentFacts = facts.funFacts;
  factIndex = 0;
  showFunFact();
}

function nextFact() {
  factIndex = (factIndex + 1) % currentFacts.length;
  showFunFact();
}

function showFunFact() {
  document.getElementById("funFact").textContent = currentFacts[factIndex];
}

function dayText(days) {
  if (days < 2) return "Un día dura " + Math.round(days * 24) + " horas";
  return "Un día dura como " + Math.round(days) + " días en la Tierra";
}

function yearText(days) {
  if (days < 730) return "Un año dura " + Math.round(days) + " días de la Tierra";
  return "Un año dura " + Math.round(days / 365).toLocaleString("es-ES") + " años de la Tierra";
}

function sizeText(diameter) {
  if (diameter === 1) return "Mide unos 12.700 km de lado a lado";
  if (Math.abs(diameter - 1) < 0.1) return "Es casi igual de grande que la Tierra";
  if (diameter > 1) return "Caben " + Math.round(diameter) + " Tierras de lado a lado";
  return "La Tierra es " + Math.round(1 / diameter) + " veces más grande";
}

function moonsText(moons) {
  if (moons === 0) return "No tiene lunas";
  if (moons === 1) return "Tiene 1 luna";
  return "Tiene " + moons + " lunas";
}

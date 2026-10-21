import { START_Y } from "./planets.js";

export function resetPlanets(planets) {
  for (const planet of planets) {
    planet.y = START_Y;
    planet.vy = 0;
  }
}

export function buildLegend(planets) {
  const legend = document.getElementById("legend");
  for (const planet of planets) {
    const item = document.createElement("div");
    item.className = "legend-item";

    const dot = document.createElement("span");
    dot.className = "legend-dot";
    const [r, g, b] = planet.color.map((c) => Math.round(c * 255));
    dot.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

    item.appendChild(dot);
    item.appendChild(document.createTextNode(planet.name));
    legend.appendChild(item);
  }
}

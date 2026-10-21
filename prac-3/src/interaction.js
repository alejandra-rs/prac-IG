import * as dat from "dat.gui";
import { settings, celestialBodies } from "./objects";


export function createGUI(canvas) {
  const layout = document.createElement("div");
  layout.className = "layout";
  canvas.parentNode.insertBefore(layout, canvas);

  const gui = document.createElement("div");
  gui.id = "gui-container";
  [moveGUI(), rotateGUI(), followGUI()].forEach((panel) => addPanelToGUI(panel, gui));

  layout.append(canvas, gui);
}

function moveGUI() {
  const moveGui = new dat.GUI({ autoPlace: false });
  moveGui.add(settings, "translateX", -1.0, 1.0, 0.01).name("Trasladar X");
  moveGui.add(settings, "translateY", -1.0, 1.0, 0.01).name("Trasladar Y");
  moveGui.add(settings, "zoom", 0, 10, 0.5).name("Zoom");
  return moveGui;
}

function rotateGUI() {
  const rotateGui = new dat.GUI({ autoPlace: false });
  rotateGui.add(settings, "rotateX", -180, 180).name("Rotar X");
  rotateGui.add(settings, "rotateY", -180, 180).name("Rotar Y");
  rotateGui.add(settings, "rotateZ", -180, 180).name("Rotar Z");
  return rotateGui;
}

function followGUI() {
  const names = [];
  const collect = (body) => {
    names.push(body.name);
    body.moons.forEach(collect);
  };
  const followGui = new dat.GUI({ autoPlace: false });
  
  celestialBodies.forEach(collect);
  followGui.add(settings, "follow", ["Ninguno", ...names]).name("Seguir a...");
  return followGui;
}

function addPanelToGUI(panel, gui) {
  const cell = document.createElement("div");
  cell.className = "gui-cell";
  cell.append(panel.domElement);
  gui.append(cell);  
}
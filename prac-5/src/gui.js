import * as dat from "dat.gui";
import { phong, attenuation, moon, torch } from "./config.js";
import { LIGHT_SOURCES } from "./render/lights.js";

export function createGUI() {
  const gui = new dat.GUI({ autoPlace: false, width: 360 });
  document.getElementById("gui").appendChild(gui.domElement);

  const phongFolder = gui.addFolder("Phong");
  phongFolder.add(phong, "ambient", 0, 1).name("% Luz ambiente");
  phongFolder.add(phong, "diffuse", 0, 1).name("% Luz difusa");
  phongFolder.add(phong, "specular", 0, 1).name("% Luz especular");
  phongFolder.add(phong, "shininessScale", 0.1, 4).name("Shininess");

  const pointFolder = gui.addFolder("Lámparas y hogueras");
  pointFolder.add(attenuation, "factor", 0.01, 2).name("Atenuación de luces");
  pointFolder.add(LIGHT_SOURCES.lamp, "on").name("Lámparas");
  pointFolder.add(LIGHT_SOURCES.fire, "on").name("Fuego");

  const moonFolder = gui.addFolder("Luna");
  moonFolder.add(moon, "on").name("Habilitar");
  moonFolder.add(moon.direction, 0, -1, 1).name("Dirección X");
  moonFolder.add(moon.direction, 1, 0.05, 1).name("Dirección Y");
  moonFolder.add(moon.direction, 2, -1, 1).name("Dirección Z");

  const torchFolder = gui.addFolder("Linterna");
  torchFolder.add(torch, "innerAngle", 1, 45).name("Ángulo interno (luz 100%)");
  torchFolder.add(torch, "outerAngle", 1, 60).name("Ángulo externo (atenuada)");
}
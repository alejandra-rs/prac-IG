import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { sourceModels, takeout, wasteRoutes, ethylenePlants, logShare } from "../data.js";
import { createShipRoutes } from "./shipRoutes.js";
import { moveOntoLand } from "./placement.js";
import { loadTerrain } from "./terrain.js";

const SMALLEST_SCALE = 0.35;
const FOOTPRINT = { takeout: 0.5, plant: 0.15 };
const loader = new GLTFLoader();

export async function addPlasticSources(scene, globe) {
  let [terrain, takeoutModel, shipModel, plantModel] = await Promise.all([loadTerrain(globe), ...Object.values(sourceModels).map(loadModel)]);
  let models = { takeout: takeoutModel, ship: shipModel, plant: plantModel };
  let items = moveOntoLand([...sourceItems("takeout", takeout, place => place.items), ...sourceItems("plant", ethylenePlants, plant => plant.capacity)], terrain.isLand);
  let placed = items.map(item => withInfo(terrain.place(models[item.info.kind].clone(), item), item.info));
  placed.forEach((model, i) => model.scale.setScalar(items[i].scale));
  let routes = createShipRoutes(wasteRoutes, globe, shipModel);
  routes.ships.forEach(ship => withInfo(ship.model, { kind: "route", ...ship.route }));
  scene.add(...placed, routes.group);
  return { ships: routes.ships, clickable: [...placed, ...routes.ships.map(ship => ship.model)], models };
}

function sourceItems(kind, places, amount) {
  let amounts = places.map(amount);
  return places.map((place, i) => {
    let scale = SMALLEST_SCALE + (1 - SMALLEST_SCALE) * logShare(amounts[i], amounts);
    return { lat: place.lat, lon: place.lon, scale, radius: THREE.MathUtils.radToDeg(sourceModels[kind].size * scale * FOOTPRINT[kind]), info: { kind, rank: i + 1, ...place } };
  });
}

function withInfo(model, info) {
  model.userData.info = info;
  return model;
}

async function loadModel({ url, size }) {
  return new THREE.Group().add(fitToSize((await loader.loadAsync(url)).scene, size));
}

function fitToSize(scene, size) {
  let box = new THREE.Box3().setFromObject(scene);
  let dimensions = box.getSize(new THREE.Vector3()), center = box.getCenter(new THREE.Vector3());
  let scale = size / Math.max(dimensions.x, dimensions.y, dimensions.z);
  scene.scale.setScalar(scale);
  scene.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale);
  return scene;
}

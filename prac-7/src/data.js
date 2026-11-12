import data from "../data/processed/data.json";
import earthTexture from "./textures/earth.jpg";
import earthNightTexture from "./textures/earth_night.png";
import earthBumpMap from "./textures/earth_bump_map.jpg";
import cloudsTexture from "./textures/clouds.jpg";
import hamburgerModel from "./models/hamburger__food_big-hamburger.glb";
import shipModel from "./models/low_poly_cargo_ship.glb";
import factoryModel from "./models/low_poly_factory.glb";

const FOUND_HERE_DOTS = 8;
const { stockByYear, firstProjectedYear } = data.oceanStock;
const years = Object.keys(stockByYear).map(Number);
const countryNames = new Intl.DisplayNames(["es"], { type: "region" });

export const { takeout, takeoutBrands, wasteRoutes, ethylene: ethylenePlants } = data;

export const earth = { texture: earthTexture, nightTexture: earthNightTexture, bumpMap: earthBumpMap, atmosphere: cloudsTexture,
                       size: 1, bumpScale: 0.5, displacementScale: 0.06 };

export const sourceModels = {
  takeout: { url: hamburgerModel, size: 0.045 },
  ship: { url: shipModel, size: 0.04 },
  plant: { url: factoryModel, size: 0.06 },
};

export const plasticLayers = [
  { id: "surface", points: data.surface, color: "#97d5fb", dotsPerSquare: ([, , concentrationClass]) => 3 + 3 * concentrationClass },
  { id: "midwater", points: data.midwater, color: "#3d80aa", dotsPerSquare: () => FOUND_HERE_DOTS },
  { id: "deep", points: data.deep, color: "#184663", dotsPerSquare: () => FOUND_HERE_DOTS },
];

export const firstYear = Math.min(...years);
export const lastYear = Math.max(...years);
export const lastEstimatedYear = firstProjectedYear - 1;
export const stockInYear = year => stockByYear[year];
export const isProjected = year => year > lastEstimatedYear;
export const stockScale = year => stockInYear(year) / stockInYear(lastEstimatedYear);
export const maxStockScale = stockScale(lastYear);

export const countryName = place => countryNames.of(place.code);
export const logShare = (value, values) => Math.log(value / Math.min(...values)) / Math.log(Math.max(...values) / Math.min(...values));
export const formatNumber = value => value.toLocaleString("es-ES");

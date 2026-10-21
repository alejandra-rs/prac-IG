export const START_Y = 0.9;

const PLANET_DATA = [
  { name: "Mercurio", relativeG: 0.378, color: [0.65, 0.6, 0.55, 1] },
  { name: "Venus", relativeG: 0.905, color: [1, 0.75, 0.46, 1] },
  { name: "Tierra", relativeG: 1.0, color: [0.3, 0.65, 0.95, 1] },
  { name: "Luna", relativeG: 0.166, color: [0.9, 0.9, 0.8, 1] },
  { name: "Marte", relativeG: 0.378, color: [0.82, 0.3, 0.27, 1] },
  { name: "Júpiter", relativeG: 2.528, color: [0.61, 0.4, 0.1, 1] },
  { name: "Saturno", relativeG: 1.065, color: [0.92, 0.92, 0.6, 1] },
  { name: "Urano", relativeG: 0.886, color: [0.55, 0.85, 0.9, 1] },
  { name: "Neptuno", relativeG: 1.138, color: [0.35, 0.45, 0.95, 1] },
];

export const PLANETS = PLANET_DATA.map((planet, i) => ({
  ...planet,
  x: -0.8 + i * (1.6 / (PLANET_DATA.length - 1)),
  y: START_Y,
  vy: 0,
}));

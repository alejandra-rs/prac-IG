const ORBIT_START = 0.2;
const ORBIT_STEP = 0.11;
const DEFAULT_MOON_SPEED = 0.03;
const deg = (d) => (d * Math.PI) / 180;


export const settings = {
  translateX: 0.0,
  translateY: 0.0,
  zoom: 0.0,
  rotateX: 0.0,
  rotateY: 0.0,
  rotateZ: 0.0,
  follow: "Ninguno",
};

const BODIES_DATA = [
  { name: "Sol", size: 0.14, tilt: 7.25, spin: 0.002, color: [1, 0.85, 0.2, 1] },
  { name: "Mercurio", size: 0.03, speed: 0.04, eccentricity: 0.206,
    inclination: 7.0, tiltDirection: 48.3, tilt: 0.03, spin: 0.001,
    color: [0.65, 0.6, 0.55, 1] },
  { name: "Venus", size: 0.045, speed: 0.03, eccentricity: 0.007,
    inclination: 3.39, tiltDirection: 76.7, tilt: 177.4, spin: 0.0003,
    color: [1, 0.75, 0.46, 1] },
  { name: "Tierra", size: 0.05, speed: 0.02, eccentricity: 0.017,
    inclination: 0, tiltDirection: 0, tilt: 23.44, spin: 0.05,
    color: [0.3, 0.65, 0.95, 1],
    moons: [
      { name: "Luna", size: 0.018, eccentricity: 0.055, inclination: -18.3, color: [0.9, 0.9, 0.8, 1] },
    ],
  },
  { name: "Marte", size: 0.04, speed: 0.015, eccentricity: 0.093,
    inclination: 1.85, tiltDirection: 49.6, tilt: 25.19, spin: 0.048,
    color: [0.82, 0.3, 0.27, 1],
    moons: [
      { name: "Fobos", size: 0.012, speed: 0.05, inclination: 1.1, color: [0.6, 0.55, 0.5, 1] },
      { name: "Deimos", size: 0.01, inclination: 1.8, color: [0.7, 0.65, 0.6, 1] },
    ],
  },
  { name: "Júpiter", size: 0.08, speed: 0.01, eccentricity: 0.049,
    inclination: 1.3, tiltDirection: 100.5, tilt: 3.13, spin: 0.12,
    color: [0.61, 0.4, 0.1, 1],
    moons: [
      { name: "Ío", size: 0.015, speed: 0.05, inclination: 0.05, color: [0.95, 0.85, 0.3, 1] },
      { name: "Europa", size: 0.014, speed: 0.04, inclination: 0.47, color: [0.85, 0.8, 0.7, 1] },
      { name: "Ganímedes", size: 0.018, inclination: 0.2, color: [0.6, 0.6, 0.6, 1] },
    ],
  },
  { name: "Saturno", size: 0.07, speed: 0.008, eccentricity: 0.057,
    inclination: 2.49, tiltDirection: 113.7, tilt: 26.73, spin: 0.11,
    color: [0.92, 0.92, 0.6, 1],
    moons: [
      { name: "Titán", size: 0.016, eccentricity: 0.029, inclination: 0.35, color: [0.9, 0.7, 0.35, 1] },
    ],
  },
  { name: "Urano", size: 0.055, speed: 0.006, eccentricity: 0.046,
    inclination: 0.77, tiltDirection: 74.0, tilt: 97.77, spin: 0.07,
    color: [0.55, 0.85, 0.9, 1],
    moons: [
      { name: "Titania", size: 0.013, inclination: 0.1, color: [0.75, 0.75, 0.8, 1] },
    ],
  },
  { name: "Neptuno", size: 0.055, speed: 0.005, eccentricity: 0.01,
    inclination: 1.77, tiltDirection: 131.8, tilt: 28.32, spin: 0.075,
    color: [0.35, 0.45, 0.95, 1],
    moons: [
      { name: "Tritón", size: 0.014, inclination: 157, color: [0.8, 0.85, 0.9, 1] },
    ],
  },
];

function makeBody(data, orbitRadius) {
  const angle = orbitRadius ? Math.random() * 2 * Math.PI : 0;
  const angleIncrement = orbitRadius
    ? data.speed !== undefined
      ? data.speed
      : DEFAULT_MOON_SPEED
    : 0;
  const locked = data.spin === undefined;
  const e = data.eccentricity || 0;

  return {
    name: data.name,
    color: data.color,
    a: orbitRadius,
    b: orbitRadius * Math.sqrt(1 - e * e),
    c: orbitRadius * e,
    width: data.size,
    height: data.size,
    angle,
    angleIncrement,
    inclination: deg(data.inclination || 0),
    tiltDirection: deg(data.tiltDirection || 0),
    tilt: deg(data.tilt || 0),
    spin: locked ? angle : 0,
    spinSpeed: locked ? angleIncrement : data.spin,
    moons: (data.moons || []).map((m, j) =>
      makeBody(m, data.size / 2 + 0.02 + j * 0.015)
    ),
  };
}

export const celestialBodies = BODIES_DATA.map((body, i) =>
  makeBody(body, i === 0 ? 0 : ORBIT_START + (i - 1) * ORBIT_STEP)
);

const latitude = (i, bands) => (i * Math.PI) / bands;
const longitude = (j, bands) => (j * 2 * Math.PI) / bands;

function spherePoint(lat, lon) {
  return [
    0.5 * Math.sin(lat) * Math.cos(lon),
    0.5 * Math.sin(lat) * Math.sin(lon),
    0.5 * Math.cos(lat),
  ];
}

export function createSphereVertices(latBands = 16, lonBands = 24) {
  const vertices = [];
  for (let i = 0; i < latBands; i++) {
    const top = latitude(i, latBands);
    const bottom = latitude(i + 1, latBands);
    for (let j = 0; j < lonBands; j++) {
      const left = longitude(j, lonBands);
      const right = longitude(j + 1, lonBands);

      const a = spherePoint(top, left);
      const b = spherePoint(bottom, left);
      const c = spherePoint(top, right);
      const d = spherePoint(bottom, right);

      vertices.push(...a, ...b, ...c);
      vertices.push(...b, ...d, ...c);
    }
  }
  return new Float32Array(vertices);
}

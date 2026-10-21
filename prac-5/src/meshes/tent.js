const SIDES = [
    { normal: [1, 1, 0],  corners: [[1, 0, 0.5], [1, 0, -0.5], [0, 1, -0.5], [0, 1, 0.5]] },
    { normal: [-1, 1, 0], corners: [[-1, 0, -0.5], [-1, 0, 0.5], [0, 1, 0.5], [0, 1, -0.5]] },
    { normal: [0, 1, 0],  corners: [[-1, 0, 0.5], [1, 0, 0.5], [1, 0, -0.5], [-1, 0, -0.5]] },
    { normal: [0, 0, -1], corners: [[1, 0, -0.5], [-1, 0, -0.5], [0, 1, -0.5]] },
    { normal: [0, 0, 1],  corners: [[-1, 0, 0.5], [-0.5, 0, 0.5], [0, 1, 0.5]] },
    { normal: [0, 0, 1],  corners: [[0.5, 0, 0.5], [1, 0, 0.5], [0, 1, 0.5]] }, 
  ];
  
  export function createTent() {
    const vertices = [], normals = [], faces = [];
    for (const side of SIDES) {
      const firstCornerIdx = vertices.length / 3;
      for (const corner of side.corners) {
        vertices.push(...corner);
        normals.push(...side.normal);
      }
      faces.push(firstCornerIdx, firstCornerIdx + 1, firstCornerIdx + 2);
      if (side.corners.length === 4) faces.push(firstCornerIdx, firstCornerIdx + 2, firstCornerIdx + 3);
    }
    return {
      vertices: new Float32Array(vertices),
      normals: new Float32Array(normals),
      faces: new Uint16Array(faces),
    };
  }
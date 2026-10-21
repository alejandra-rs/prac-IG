export const vertexShaderSource = `#version 300 es
    precision mediump float;

    in vec2 aCoordinates;
    uniform mat3 uMatrix;

    void main(void) {
        vec3 transformed = uMatrix * vec3(aCoordinates, 1.0);
        gl_Position = vec4(transformed.xy, 0.0, 1.0);
    }
`;

export const fragmentShaderSource = `#version 300 es
    precision mediump float;

    out vec4 fragColor;
    uniform vec4 uColor;

    void main(void) {
        fragColor = uColor;
    }
`;

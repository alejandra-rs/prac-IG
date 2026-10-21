export const vertexShaderSource = `#version 300 es
    precision mediump float;

    in vec2 aCoordinates;

    void main(void) {
        gl_Position = vec4(aCoordinates, 0, 1);
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

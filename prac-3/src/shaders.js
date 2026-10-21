export const vertexShaderSource = `#version 300 es
    precision mediump float;

    in vec3 aCoordinates;
    uniform mat4 uModelMatrix;
    out vec3 vLocal;

    void main(void) {
        vLocal = aCoordinates;
        gl_Position = uModelMatrix * vec4(aCoordinates, 1.0);
    }
`;

export const fragmentShaderSource = `#version 300 es
    precision mediump float;

    in vec3 vLocal;
    out vec4 fragColor;
    uniform vec4 uColor;

    void main(void) {
        float stripe = step(0.0, sin(atan(vLocal.y, vLocal.x) * 4.0));
        fragColor = vec4(mix(uColor.rgb * 0.5, uColor.rgb, stripe), 1.0);
    }
`;

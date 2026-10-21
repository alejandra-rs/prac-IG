export const vertexShaderSource = `#version 300 es
    precision mediump float;

    in vec3 aCoordinates;
    uniform mat4 uModelMatrix;
    uniform mat4 uViewMatrix;
    out float vDistance;

    void main(void) {
        vec4 position = uModelMatrix * vec4(aCoordinates, 1.0);
        vDistance = length(position.xyz);
        gl_Position = uViewMatrix * position;
    }
`;

export const fragmentShaderSource = `#version 300 es
    precision mediump float;

    in float vDistance;
    out vec4 fragColor;
    uniform vec4 uColor;
    uniform vec3 uFogColor;
    uniform float uFogDistance;

    void main(void) {
        float fog = clamp(vDistance / uFogDistance, 0.0, 1.0);
        fragColor = vec4(mix(uColor.rgb, uFogColor, fog), 1.0);
    }
`;
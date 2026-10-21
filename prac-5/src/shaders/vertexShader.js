export const vertexShaderSource = `#version 300 es
precision mediump float;

in vec3 aCoordinates;
in vec3 aVertexNormals;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat3 uNormalMatrix;

out vec3 vNormal;
out vec3 vPosition;

void main(void) {
    vec4 vertex = uModelMatrix * vec4(aCoordinates, 1.0);
    gl_Position = uViewMatrix * vertex;

    vNormal = uNormalMatrix * aVertexNormals;
    vPosition = vertex.xyz;
}
`;

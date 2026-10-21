import { LIGHTS } from "../render/lights.js";

export const fragmentShaderSource = `#version 300 es
precision mediump float;

in vec3 vNormal;
in vec3 vPosition;
out vec4 fragColor;

uniform float uAmbientWeight;
uniform float uDiffuseWeight;
uniform float uSpecularWeight;
uniform float uShininessScale;

uniform vec3 uAmbientMaterial;
uniform vec3 uDiffuseMaterial;
uniform vec3 uSpecularMaterial;
uniform float uShininess;
uniform float uAttenuation;

uniform vec3 uLightPositions[${LIGHTS.length}];
uniform vec3 uLightColors[${LIGHTS.length}];

uniform vec3 uMoonDirection;
uniform vec3 uMoonColor;

uniform vec3 uTorchColor;
uniform float uTorchInner;
uniform float uTorchOuter;

uniform vec3 uFogColor;
uniform float uFogDistance;

float attenuation(float d) {
    return 1.0 / (1.0 + uAttenuation * (d + d * d));
}

vec3 phong(vec3 N, vec3 L, vec3 V, vec3 lightColor) {
    float NL = max(dot(N, L), 0.0);
    vec3 Idif = uDiffuseWeight * max(NL, 0.0) * uDiffuseMaterial;

    vec3 Ispec = vec3(0, 0, 0);
    if (NL > 0.0) {
        vec3 R = 2.0 * N * NL - L;
        float specular = pow(max(dot(R, V), 0.0), uShininess * uShininessScale);
        Ispec = uSpecularWeight * specular * uSpecularMaterial;
    }
    return (Idif + Ispec) * lightColor;
}

vec3 torch(vec3 N, vec3 V) {
    vec3 L = normalize(-vPosition);

    float angle = dot(-L, vec3(0, 0, -1));
    float spot = clamp((angle - uTorchOuter) / (uTorchInner - uTorchOuter), 0.0, 1.0);

    return spot * attenuation(length(vPosition)) * phong(N, L, V, uTorchColor);
}

void main(void) {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(-vPosition);
    if (dot(N, V) < 0.0) N = -N;
    vec3 Iamb = uAmbientWeight * uAmbientMaterial;

    vec3 Ilights = vec3(0, 0, 0);
    for (int i = 0; i < ${LIGHTS.length}; i++) {
        vec3 lightDirection = uLightPositions[i] - vPosition; 
        vec3 L = normalize(lightDirection);
        Ilights += attenuation(length(lightDirection)) * phong(N, L, V, uLightColors[i]);
    }
    vec3 Imoon = phong(N, normalize(uMoonDirection), V, uMoonColor);
    vec3 Itorch = torch(N, V);
    vec3 color = min(Iamb + Imoon + Ilights + Itorch, vec3(1, 1, 1));

    float fog = clamp(length(vPosition) / uFogDistance, 0.0, 1.0);
    fragColor = vec4(mix(color, uFogColor, fog), 1.0);
}
`;
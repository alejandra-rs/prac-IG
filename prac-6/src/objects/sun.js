import * as THREE from "three";

const CORONA_EXTENT = 1.25;
const clock = new THREE.Clock();
const time = { value: 0 };

const NOISE = `
  uniform float uTime;

  float random(vec3 p) {
    return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453123);
  }

  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    vec3 u = f * f * (3. - 2. * f);
    float bottom = mix(mix(random(i), random(i + vec3(1, 0, 0)), u.x),
                       mix(random(i + vec3(0, 1, 0)), random(i + vec3(1, 1, 0)), u.x), u.y);
    float top = mix(mix(random(i + vec3(0, 0, 1)), random(i + vec3(1, 0, 1)), u.x),
                    mix(random(i + vec3(0, 1, 1)), random(i + vec3(1, 1, 1)), u.x), u.y);
    return mix(bottom, top, u.z);
  }

  float fbm(vec3 p) {
    float value = 0.;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p *= 2.;
      amplitude *= 0.5;
    }
    return value;
  }
`;

const SURFACE_VERTEX_SHADER = `
  varying vec2 vUv;
  varying vec3 vLocal;
  varying vec3 vNormal;

  void main() {
    vUv = uv;
    vLocal = normalize(position);
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
  }
`;

const SURFACE_FRAGMENT_SHADER = `
  uniform sampler2D uMap;
  varying vec2 vUv;
  varying vec3 vLocal;
  varying vec3 vNormal;

  ${NOISE}

  void main() {
    vec3 p = vLocal * 6. + vec3(0., uTime * 0.05, 0.);
    float w = fbm(p + 1.5 * fbm(p));

    vec3 color = texture2D(uMap, vUv).rgb * (0.6 + 0.8 * w);
    color = mix(color, vec3(1., 0.95, 0.75), smoothstep(0.6, 0.8, w));
    color *= mix(0.4, 1., vNormal.z);

    gl_FragColor = vec4(color, 1);
    #include <encodings_fragment>
  }
`;

const CORONA_VERTEX_SHADER = `
  varying vec2 vPlane;

  void main() {
    vPlane = position.xy;
    gl_Position = projectionMatrix * (modelViewMatrix * vec4(0, 0, 0, 1) + vec4(position.xy, 0, 0));
  }
`;

const CORONA_FRAGMENT_SHADER = `
  uniform float uRadius;
  varying vec2 vPlane;

  ${NOISE}

  void main() {
    float r = length(vPlane) / uRadius;

    vec3 p = vec3(vPlane / uRadius * 3., uTime * 0.1);
    float w = fbm(p + 2. * fbm(p + vec3(0., 0., uTime * 0.1)));
    float rays = pow(w, 3.);
    float edge = 1. + ${(CORONA_EXTENT - 1).toFixed(3)} * smoothstep(0.1, 0.5, w);
    float mask = smoothstep(0., 0.3, edge - r);
    float glow = exp(-(r - 1.) * 2.) * (0.3 + 3. * rays) * smoothstep(0.97, 1., r) * mask;

    gl_FragColor = vec4(vec3(1, 0.6, 0.05) * glow, 1.);
    #include <encodings_fragment>
  }
`;

export function addSunShaders(sun, radius) {
  sun.material = new THREE.ShaderMaterial({ uniforms: { uMap: { value: sun.material.map }, uTime: time },
                                            vertexShader: SURFACE_VERTEX_SHADER, fragmentShader: SURFACE_FRAGMENT_SHADER });
  sun.onBeforeRender = () => time.value = clock.getElapsedTime();
  sun.add(createCorona(radius));
}

function createCorona(radius) {
  let size = 2 * radius * CORONA_EXTENT;
  return new THREE.Mesh(new THREE.PlaneGeometry(size, size),
                        new THREE.ShaderMaterial({ uniforms: { uRadius: { value: radius }, uTime: time },
                                                   vertexShader: CORONA_VERTEX_SHADER, fragmentShader: CORONA_FRAGMENT_SHADER,
                                                   blending: THREE.AdditiveBlending, transparent: true, depthWrite: false }));
}

// Author: Alejandra Rodríguez Silva
// Title: Mar de Nubes

#ifdef GL_ES
precision highp float;
#endif

// Número de capas de nubes
#define N_LAYERS 4

// Parámetros base de la capa delantera (escala, velocidad, relieve)
#define CLOUD_SCALE 6.8
#define CLOUD_SPEED 0.1
#define CLOUD_RELIEF 0.4

// Intensidad del domain warping
#define WARP 1.1

// Suavidad del borde de las nubes
#define EDGE_SOFTNESS 0.15

// Efecto del ratón sobre las nubes (radio de acción + cambio en la profundidad)
#define MOUSE_RADIUS 20.
#define MOUSE_DIP 0.3

// Parámetros de entrada (resolución de ventana, posición del ratón y tiempo)
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// Colores del cielo y de las nubes
vec3 skyTop      = vec3(0.729, 0.628, 0.980);
vec3 skyBottom   = vec3(0.980, 0.704, 0.358);
vec3 cloudLight  = vec3(1.000, 0.900, 0.875);
vec3 cloudShadow = vec3(0.610, 0.479, 0.526);

// Función generadora de números aleatorios
float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233)))* 43758.5453123);
}

// Función generadora de ruido (value noise)
float noise (in vec2 st) {
    // Uso de tiles para generar ruido - celda (i) + posición en su interior (f)
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Número aleatorio en cada esquina del tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Interpolación suave entre puntos con Cubic Hermite Curve
    vec2 u = f*f*(3.0-2.0*f);
    
    // Interpolación bilineal entre las 4 esquinas para generar el valor del ruido
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

// Función generadora de ruido fractal (fractional Brownian motion)
float fbm(vec2 p) {
    // Valores iniciales de ruido y amplitud
    float value = 0.;
    float amplitude = .5;
    
    // Cálculo del ruido en 6 octavas
    for (int i = 0; i < 6; i++) {
        // Actualización del valor de ruido según la amplitud de la octava
        value += amplitude * (noise(p));
        // Duplica la frecuencia para la siguiente octava (detalles más finos)
        p *= 2.;
        // Actualización de la nueva amplitud para la siguiente octava (detalles menos importantes)
        amplitude *= .5;
    }
    return value;
}

void main() {
    // Normalizar las coordenadas en base al aspect ratio
    vec2 st = gl_FragCoord.xy / u_resolution.y;
    // Cálculo del vector posición ratón -> píxel, usado para los cálculos de la distorsión
    vec2 dv = st - u_mouse / u_resolution.y;
    
    // Color inicial: cielo (degradado)
    vec3 sky = mix(skyBottom, skyTop, clamp(st.y - 0.2, 0., 1.));
    vec3 canvasColor = sky;
    
    // Efecto del ratón sobre el mar de nubes (gaussiano alrededor del cursor)
    float f = exp(-dot(dv, dv) * MOUSE_RADIUS);
    
    for (int k = 0; k < N_LAYERS; k++) {
        // Profundidad de la capa (proporcional respecto al número total de capas)
        float z = (float(k) + 1.) / float(N_LAYERS);
        
        // Parámetros de la capa según su profundidad
        float base  = 0.1 + 0.4 * (1. - z);				// Altura (más lejana = más alta)
        float scale = CLOUD_SCALE * (2. - z);						// Escala (más lejana = nubes + pequeñas)
        float speed = CLOUD_SPEED * z;								// Velocidad de movimiento (más lejana = más lenta)
        vec2 offset = vec2(0., random(vec2(float(k))) * 123.);		// Offset aleatorio para que las capas tengan formas distintas 

        // Posición de la coordenada en el mapa de ruido
        vec2 p = st * scale + vec2(speed * u_time, 0.) + offset;
        // Cálculo del valor del ruido en esa posición
        float w = fbm(p + WARP * fbm(p));

        // Profundidad de un píxel dentro de su capa
        float depth = (base + CLOUD_RELIEF * w) - st.y - (z * f * MOUSE_DIP);
        // Opacidad de la capa de nubes sobre el cielo
        float mask = smoothstep(0., EDGE_SOFTNESS, depth);

        // Calcular el color de la capa de nubes en función de los parámetros computados
        vec3 cloudColor = mix(cloudLight, cloudShadow, smoothstep(0.05, 0.3, depth)) * (.45 + .7 * w);
        cloudColor = mix(cloudColor, sky, 0.55 - 0.45 * z);

        // Actualizar el color de los píxeles tras añadir la nueva capa de nubes
        canvasColor = mix(canvasColor, cloudColor, mask);
    }

    gl_FragColor = vec4(canvasColor, 1.);
}

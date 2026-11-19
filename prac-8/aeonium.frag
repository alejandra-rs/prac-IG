// Author: Alejandra Rodríguez Silva
// Title: Aeonium

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

// Número de hojas y ángulo de separación entre ellas: Fibonacci + ángulo áureo
#define N_LEAVES 89
#define GOLDEN_ANG 2.39996

// Parámetros de entrada (resolución de ventana y tiempo)
uniform vec2 u_resolution;
uniform float u_time;

// Colores para formar cada roseta
vec3 colorA = vec3(0.011,0.625,0.097);
vec3 colorAShadow = vec3(0.004,0.220,0.034);
vec3 colorB = vec3(1.000,0.520,0.246);
vec3 rimColor = vec3(0.620, 0.100, 0.160);
vec3 backgroundColor = vec3(0.150, 0.050, 0.050);

// Función de rotación 2D dado un ángulo, usada para hacer girar las suculentas
mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

void main() {
    // Normalizar las coordenadas en base al aspect ratio
    vec2 st = (2. * gl_FragCoord.xy - u_resolution) / u_resolution.y, q;
    vec3 canvasColor = backgroundColor, leafColor, tipColor;
    float theta, d, age, L;

    // Patrón - repetición de rosetas (brick pattern)
    st *= 1.5;                               // Zoom (aproximadamente 3 plantas verticalmente)
    st.x += step(1., mod(st.y, 2.)) * 0.5;   // Desplazamiento de media celda en las filas impares
    st = fract(st) * 2. - 1.;                // Normalización dentro de cada celda

    // Construcción de cada suculenta, hoja por hoja, empezando por la más antigua
    for (int i = N_LEAVES - 1; i >= 0; i--) {
        // Ángulo de colocación y edad de la hoja
        theta = float(i) * GOLDEN_ANG;
        age = float(i) / float(N_LEAVES);
        
        // Tamaño del "semi-eje" de la hoja (similar a elipse), creciente con la edad
        L = (0.05 + 0.25 * pow(age, 0.4)) * 1.5;
        // Oscilación del tamaño de las hojas con el tiempo
        L *= 1. + 0.05 * sin(u_time);
        
        // Rotación de la hoja al ángulo calculado (considerando la rotación introducida por el tiempo)
        q = rotate2d(theta + 0.2 * u_time) * st;
        // Mover la hoja hacia fuera, para ubicar su punta interior en el centro de la planta
        q.x -= L;
        
        // Normalizar la longitud de la hoja, de [-L, L] a [0, 1]
        float u = clamp((q.x + L) / (2. * L), 0., 1.);
        // Convertir la elipse para darle forma de hoja
        d = clamp(length(q / vec2(L, L * 0.5 * pow(sin(PI * pow(u, 0.85)), 0.35))), 0., 1.);
        
        // El color de las puntas de la hoja depende de la edad (más vieja = puntas naranjas)
        tipColor = mix(colorA, colorB, age);
        // Degradado de la base a la punta, a lo largo de la hoja
        leafColor = mix(colorA, tipColor, u);
        // Borde rojo y contorno oscuro para separar las hojas 
        leafColor = mix(leafColor, rimColor, smoothstep(0.6, 1., d));
        leafColor = mix(leafColor, colorAShadow, smoothstep(0.9, 1., d));
        // Oscurecer las hojas más viejas para dar efecto de profundidad
        leafColor *= clamp(1.3 - age, 0.7, 1.);
        
        // Actualizar el color de los píxeles tras añadir la nueva hoja
        canvasColor = mix(leafColor, canvasColor, smoothstep(0.95,1., d));
    }

    gl_FragColor = vec4(canvasColor,1.0);
}

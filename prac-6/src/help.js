const rocketControls = "W / S: avanzar y retroceder\nA / D: ir a la izquierda y a la derecha\nR / F: subir y bajar\nQ / E: girar el cohete\nFlechas / arrastrar el ratón: mirar alrededor\n\nPausa y acércate a un cuerpo para verlo de cerca.";
const generalExploreHelp = "Elige un cuerpo en «Ver de cerca» para verlo de cerca.\nPuedes mostrar o esconder los nombres haciendo clic en el botón.\nPausa o reanuda la simulación y cambia su velocidad.";

const helpTexts = {
  learn: "Construye el Sistema Solar arrastrando cada planeta desde la bandeja hasta su órbita.\nHaz clic en un planeta ya colocado para devolverlo a la bandeja.",
  general: "Arrastra con el ratón para girar la cámara.\nUsa la rueda para acercarte o alejarte.\n" + generalExploreHelp,
  thirdPerson: rocketControls + "\n" + generalExploreHelp,
  firstPerson: rocketControls + "\n" + generalExploreHelp,
  closeup: "Arrastra con el ratón para girar el cuerpo.\nUsa la rueda para acercarte o alejarte.\nPulsa 'Giro' o 'Lunas' para activar o desactivar el giro del cuerpo y mostrar o esconder sus lunas.\nPulsa 'Inclinar' y arrastra los anillos de colores para inclinar el cuerpo.\nDescubre datos curiosos pulsando 'Otro dato'."
};

export function showHelp(key) {
  let text = helpTexts[key];
  document.getElementById("help").classList.toggle("hidden", !text);
  if (text) document.getElementById("helpText").textContent = text;
}

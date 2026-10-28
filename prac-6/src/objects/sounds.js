import * as THREE from "three";
import engineUrl from "../sounds/rocketEngine.mp3";
import countdownUrl from "../sounds/countdown.mp3";

const maxVolume = 0.4;
let listener, engineSound;

export function startEngineSound() {
  engineSound = new THREE.Audio(getListener());
  new THREE.AudioLoader().load(engineUrl, buffer => {
    engineSound.setBuffer(buffer);
    engineSound.setLoop(true);
    engineSound.setVolume(0);
    engineSound.play();
  });
}

export function updateEngineSound(on) {
  if (!engineSound || !engineSound.isPlaying) return;
  let volume = engineSound.getVolume();
  let target = on ? maxVolume : 0;
  engineSound.setVolume(volume + (target - volume) * 0.1);
}

export function playCountdown(seconds, onStart) {
  let countdown = new THREE.Audio(getListener());
  new THREE.AudioLoader().load(countdownUrl, buffer => {
    countdown.setBuffer(buffer);
    countdown.offset = buffer.duration - seconds;
    countdown.play();
    onStart();
  });
}

function getListener() {
  if (!listener) listener = new THREE.AudioListener();
  return listener;
}

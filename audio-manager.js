import { audioConfig } from "./data/audio.js";

// OWNER: feature/fusion-hall-audio
// Audio starts only after the visitor presses Enter, avoiding browser autoplay blocks.
export function initAudio({ enterButton, soundButton }) {
  if (!audioConfig.src) {
    soundButton.addEventListener("click", () => soundButton.classList.toggle("active"));
    return;
  }

  const audio = new Audio(audioConfig.src);
  audio.loop = audioConfig.loop;
  audio.volume = audioConfig.volume;
  let enabled = true;

  enterButton.addEventListener("click", () => {
    if (enabled) audio.play().catch(() => {});
  });

  soundButton.addEventListener("click", () => {
    enabled = !enabled;
    soundButton.classList.toggle("active", enabled);
    if (enabled) audio.play().catch(() => {});
    else audio.pause();
  });
}

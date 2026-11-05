import { audioConfig } from "./data/audio.js";

// OWNER: feature/fusion-hall-audio
// Audio starts only after the visitor presses Enter, avoiding browser autoplay blocks.
export function initAudio({ enterButton, soundButton }) {
  if (!audioConfig.src) {
    soundButton.disabled = true;
    soundButton.setAttribute("aria-pressed", "false");
    return;
  }

  const audio = new Audio(audioConfig.src);
  audio.loop = audioConfig.loop;
  audio.volume = audioConfig.volume;
  audio.preload = audioConfig.preload;
  let enabled = true;
  let visitorEntered = false;
  let playRequest = null;

  const updateButton = () => {
    const playing = enabled && !audio.paused;
    soundButton.classList.toggle("active", playing);
    soundButton.setAttribute("aria-pressed", String(playing));
    soundButton.setAttribute("aria-label", playing ? "Tắt âm thanh" : "Bật âm thanh");
  };

  const play = async () => {
    if (!enabled || playRequest) return playRequest;
    playRequest = audio.play();
    try {
      await playRequest;
    } catch (error) {
      console.warn("Không thể phát nhạc nền:", error);
    } finally {
      playRequest = null;
      updateButton();
    }
  };

  updateButton();

  enterButton.addEventListener("click", () => {
    visitorEntered = true;
    play();
  });

  soundButton.addEventListener("click", () => {
    enabled = audio.paused;
    if (enabled && visitorEntered) play();
    else audio.pause();
    updateButton();
  });

  audio.addEventListener("play", updateButton);
  audio.addEventListener("pause", updateButton);
  audio.addEventListener("error", () => {
    enabled = false;
    soundButton.title = "Không tải được nhạc nền";
    updateButton();
  });
}

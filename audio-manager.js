import { audioConfig } from "./data/audio.js";

// Creates exactly two reusable audio elements for the whole page. Phase changes
// are idempotent, so repeated timer updates can never restart or overlap tracks.
export function initAudio({ soundButton, AudioConstructor = Audio }) {
  const tracks = {
    flute: new AudioConstructor(audioConfig.flute.src),
    dramatic: new AudioConstructor(audioConfig.dramatic.src)
  };

  for (const [name, audio] of Object.entries(tracks)) {
    audio.loop = false;
    audio.volume = audioConfig[name].volume;
    audio.preload = audioConfig.preload;
  }

  let enabled = true;
  let phase = "idle";
  const completed = { flute: false, dramatic: false };
  const playRequests = { flute: null, dramatic: null };

  const activeTrack = () => tracks[phase] ?? null;

  const updateButton = () => {
    soundButton.classList.toggle("active", enabled);
    soundButton.setAttribute("aria-pressed", String(enabled));
    soundButton.setAttribute("aria-label", enabled ? "Tắt âm thanh" : "Bật âm thanh");
  };

  const pauseAll = except => {
    for (const [name, audio] of Object.entries(tracks)) {
      if (name !== except) audio.pause();
    }
  };

  const playCurrent = async () => {
    const audio = activeTrack();
    if (!enabled || !audio || completed[phase] || playRequests[phase]) return;
    pauseAll(phase);
    if (!audio.paused) return;

    const requestedPhase = phase;
    playRequests[requestedPhase] = audio.play();
    try {
      await playRequests[requestedPhase];
    } catch (error) {
      console.warn(`Không thể phát nhạc ${requestedPhase}:`, error);
    } finally {
      playRequests[requestedPhase] = null;
      updateButton();
    }
  };

  const resetTrack = audio => {
    audio.pause();
    audio.currentTime = 0;
  };

  const startTour = () => {
    resetTrack(tracks.flute);
    resetTrack(tracks.dramatic);
    completed.flute = false;
    completed.dramatic = false;
    phase = "flute";
    playCurrent();
  };

  const enterFinalMinute = () => {
    if (phase === "dramatic" || phase === "ended") return;
    tracks.flute.pause();
    resetTrack(tracks.dramatic);
    phase = "dramatic";
    playCurrent();
  };

  const endTour = () => {
    phase = "ended";
    pauseAll();
    updateButton();
  };

  soundButton.addEventListener("click", () => {
    enabled = !enabled;
    if (enabled) playCurrent();
    else pauseAll();
    updateButton();
  });

  for (const [name, audio] of Object.entries(tracks)) {
    audio.addEventListener("ended", () => {
      completed[name] = true;
      updateButton();
    });
    audio.addEventListener("error", () => {
      completed[name] = true;
      soundButton.title = `Không tải được nhạc ${name}`;
      updateButton();
    });
  }

  updateButton();
  return { startTour, enterFinalMinute, endTour };
}

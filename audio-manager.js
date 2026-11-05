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

  // Browsers should never start museum audio without a deliberate user action.
  let enabled = false;
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

  const resetTrack = name => {
    const audio = tracks[name];
    audio.pause();
    audio.currentTime = 0;
    audio.volume = audioConfig[name].volume;
  };

  const startTour = () => {
    resetTrack("flute");
    resetTrack("dramatic");
    completed.flute = false;
    completed.dramatic = false;
    phase = "flute";
    playCurrent();
  };

  const enterFinalMinute = () => {
    if (phase === "dramatic" || phase === "ended") return;
    tracks.flute.pause();
    resetTrack("dramatic");
    phase = "dramatic";
    playCurrent();
  };

  const endTour = () => {
    enabled = false;
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

  // Fade the opening ambience smoothly instead of cutting it off at the end.
  tracks.flute.addEventListener("timeupdate", () => {
    const audio = tracks.flute;
    const fadeOutSeconds = audioConfig.flute.fadeOutSeconds ?? 8;
    if (!Number.isFinite(audio.duration) || audio.duration <= 0 || fadeOutSeconds <= 0) return;
    const remainingSeconds = Math.max(0, audio.duration - audio.currentTime);
    const fadeRatio = Math.min(1, remainingSeconds / fadeOutSeconds);
    audio.volume = audioConfig.flute.volume * fadeRatio;
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

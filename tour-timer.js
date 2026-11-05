export const TOUR_DURATION_SECONDS = 5 * 60;
export const FINAL_MINUTE_SECONDS = 60;

export function formatTourTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

// One deadline is the shared source of truth for both the visible countdown and
// audio phase changes. Injected clock/timer functions keep the behavior testable.
export function initTourTimer({
  timerElement,
  onFinalMinute,
  onEnd,
  now = () => performance.now(),
  setIntervalFn = setInterval,
  clearIntervalFn = clearInterval
}) {
  let deadline = null;
  let intervalId = null;
  let remainingSeconds = TOUR_DURATION_SECONDS;
  let finalMinuteStarted = false;

  const render = () => {
    timerElement.textContent = formatTourTime(remainingSeconds);
    timerElement.parentElement?.classList.toggle(
      "final-minute",
      remainingSeconds > 0 && remainingSeconds <= FINAL_MINUTE_SECONDS
    );
  };

  const stopInterval = () => {
    if (intervalId !== null) clearIntervalFn(intervalId);
    intervalId = null;
  };

  const update = () => {
    if (deadline === null) return;
    remainingSeconds = Math.max(0, Math.ceil((deadline - now()) / 1000));
    render();

    if (remainingSeconds === 0) {
      stopInterval();
      deadline = null;
      onEnd();
      return;
    }

    if (!finalMinuteStarted && remainingSeconds <= FINAL_MINUTE_SECONDS) {
      finalMinuteStarted = true;
      onFinalMinute();
    }
  };

  const start = () => {
    stopInterval();
    remainingSeconds = TOUR_DURATION_SECONDS;
    finalMinuteStarted = false;
    deadline = now() + TOUR_DURATION_SECONDS * 1000;
    render();
    intervalId = setIntervalFn(update, 200);
  };

  render();
  return {
    start,
    update,
    stop: () => {
      stopInterval();
      deadline = null;
    },
    getRemainingSeconds: () => remainingSeconds
  };
}

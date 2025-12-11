// Global click sound utility
export const playClickSound = () => {
  const globalMuted = localStorage.getItem('gameSoundMuted') === 'true';
  if (globalMuted) return;

  try {
    const audio = new Audio('/click.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  } catch {
    // Ignore playback errors
  }
};

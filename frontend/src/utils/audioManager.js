// Audio Manager utility for handling game music and sound effects

class AudioManager {
  constructor() {
    this.backgroundMusic = null;
    this.isMuted = false;
    this.isInitialized = false;
    this.userInteracted = false;
  }

  // Call this on first user interaction to enable audio
  enableAudioOnInteraction() {
    this.userInteracted = true;
  }

  // Initialize the background music
  initBackgroundMusic(audioPath) {
      this.loadPreferences();
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
      this.backgroundMusic.src = '';
    }

    this.backgroundMusic = new Audio();
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.3; // Set volume to 30%
    this.backgroundMusic.preload = 'auto';
    
    // Use fetch to load the audio and create a blob URL
    fetch(audioPath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch audio: ${response.status}`);
        }
        return response.blob();
      })
      .then(blob => {
        const blobUrl = URL.createObjectURL(blob);
        this.backgroundMusic.src = blobUrl;
        this.backgroundMusic.load();
        console.log('Audio loaded successfully via blob URL');
      })
      .catch(error => {
        console.error('Error loading audio via fetch:', error);
        // Fallback to direct src assignment
        this.backgroundMusic.src = audioPath;
        this.backgroundMusic.load();
        console.log('Fallback: Audio loading directly from path');
      });
    
    this.isInitialized = true;
    console.log('Audio initialization started for path:', audioPath);
  }

  // Play the background music
  playBackgroundMusic() {
    if (!this.backgroundMusic || !this.isInitialized) {
      console.warn('Background music not initialized');
      return;
    }

    const muted = this.isMuted;

    if (!muted) {
      // Check if audio has loaded
      if (this.backgroundMusic.readyState < 2) {
        console.warn('Audio not ready to play yet, readyState:', this.backgroundMusic.readyState);
        // Wait for the audio to be loadable
        const playWhenReady = () => {
          if (this.backgroundMusic.readyState >= 2) {
            this.backgroundMusic.removeEventListener('canplay', playWhenReady);
            this.backgroundMusic.play().catch(err => {
              console.warn('Could not play after loading:', err.message);
            });
          }
        };
        this.backgroundMusic.addEventListener('canplay', playWhenReady);
        return;
      }

      const playPromise = this.backgroundMusic.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Music started playing');
          })
          .catch(error => {
            console.warn('Could not play background music:', error.message);
          });
      }
    }
  }

  // Stop the background music
  stopBackgroundMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
    }
  }

  // Pause the background music
  pauseBackgroundMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
    }
  }

  // Resume the background music
  resumeBackgroundMusic() {
    if (this.backgroundMusic && !this.isMuted) {
      const playPromise = this.backgroundMusic.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Music resumed');
          })
          .catch(error => {
            console.warn('Could not resume background music:', error.message);
          });
      }
    }
  }

  // Toggle music on/off
  toggleMusic() {
    this.isMuted = !this.isMuted;

    if (this.isMuted) {
      this.pauseBackgroundMusic();
    } else {
      this.resumeBackgroundMusic();
    }

    // Save preference to localStorage
    localStorage.setItem('gameMusicMuted', this.isMuted);
    return this.isMuted;
  }

  // Set mute state explicitly
  setMute(muted) {
    this.isMuted = muted;

    if (this.isMuted) {
      this.pauseBackgroundMusic();
    } else {
      this.resumeBackgroundMusic();
    }

    localStorage.setItem('gameMusicMuted', this.isMuted);
  }

  // Get current mute state
  isMusicMuted() {
    return this.isMuted;
  }

  // Load saved preferences from localStorage
  loadPreferences() {
    const savedMuted = localStorage.getItem('gameMusicMuted');
    if (savedMuted !== null) {
      this.isMuted = savedMuted === 'true';
    }
  }

  // Play a sound effect
  playSoundEffect(audioPath, volume = 0.3) {
    const globalMuted = localStorage.getItem('gameSoundMuted') === 'true';
    if (globalMuted) return;
    try {
      const sound = new Audio(audioPath);
      sound.volume = volume;
      sound.play().catch(error => {
        console.warn('Could not play sound effect:', error);
      });
    } catch (error) {
      console.warn('Error creating sound effect:', error);
    }
  }
}

// Create a singleton instance
const audioManager = new AudioManager();

export default audioManager;

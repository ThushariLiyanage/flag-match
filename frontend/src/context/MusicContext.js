import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [isMusicMuted, setIsMusicMuted] = useState(false);
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const audioRef = useRef(null);

  // Initialize audio on component mount
  useEffect(() => {
    // Load saved preference
    const savedMuted = localStorage.getItem('gameMusicMuted');
    if (savedMuted !== null) {
      setIsMusicMuted(savedMuted === 'true');
    }

    const savedSoundMuted = localStorage.getItem('gameSoundMuted');
    if (savedSoundMuted !== null) {
      setIsSoundMuted(savedSoundMuted === 'true');
    }

    // Create audio element
    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0.3;
    audio.preload = 'auto';

    // Fetch and set up blob URL to avoid cache issues
    fetch('/indie-game-soundtrack-251864.mp3')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch audio: ${response.status}`);
        }
        return response.blob();
      })
      .then(blob => {
        const blobUrl = URL.createObjectURL(blob);
        audio.src = blobUrl;
        console.log('Background music loaded successfully');
      })
      .catch(error => {
        console.error('Error loading audio:', error);
        // Fallback to direct path
        audio.src = '/indie-game-soundtrack-251864.mp3';
      });

    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  // Play or pause music based on its own muted state
  useEffect(() => {
    if (!audioRef.current) return;

    const effectiveMuted = isMusicMuted;

    // Wait for audio to be ready before playing
    const handleCanPlay = () => {
      if (!effectiveMuted && audioRef.current.paused) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('Music playing');
            })
            .catch(error => {
              console.warn('Could not play music:', error.message);
            });
        }
      }
    };

    if (effectiveMuted) {
      audioRef.current.pause();
    } else if (audioRef.current.readyState >= 2) {
      // Audio play immediately
      handleCanPlay();
    } else {
      // Wait for audio to be ready
      audioRef.current.addEventListener('canplay', handleCanPlay, { once: true });
    }

    // Save preference
    localStorage.setItem('gameMusicMuted', isMusicMuted);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('canplay', handleCanPlay);
      }
    };
  }, [isMusicMuted]);

  // Persist sound mute state
  useEffect(() => {
    localStorage.setItem('gameSoundMuted', isSoundMuted);
  }, [isSoundMuted]);

  // Toggle music
  const toggleMusic = () => {
    setIsMusicMuted(prev => !prev);
  };

  const toggleSound = () => {
    setIsSoundMuted(prev => {
      const next = !prev;
      // Muting all sounds also mutes music; unmuting restores music
      setIsMusicMuted(next);
      return next;
    });
  };

  return (
    <MusicContext.Provider value={{ isMusicMuted, toggleMusic, isSoundMuted, toggleSound }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within MusicProvider');
  }
  return context;
};

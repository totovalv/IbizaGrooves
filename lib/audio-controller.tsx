'use client';

import { createContext, useContext, useRef, useState, useCallback } from 'react';
import { Howl } from 'howler';

interface AudioControllerValue {
  activePlayer: 'radio' | 'mix' | null;
  currentMixId: string | null;
  playRadio: (streamUrl: string, onError?: () => void) => void;
  playMix: (mixId: string, audioUrl: string, onError?: () => void) => void;
  pause: () => void;
}

const AudioControllerContext = createContext<AudioControllerValue | null>(null);

export function AudioControllerProvider({ children }: { children: React.ReactNode }) {
  const [activePlayer, setActivePlayer] = useState<'radio' | 'mix' | null>(null);
  const [currentMixId, setCurrentMixId] = useState<string | null>(null);
  const radioHowl = useRef<Howl | null>(null);
  const mixHowl = useRef<Howl | null>(null);

  const stopAll = useCallback(() => {
    radioHowl.current?.stop();
    mixHowl.current?.stop();
  }, []);

  const playRadio = useCallback((streamUrl: string, onError?: () => void) => {
    stopAll();
    radioHowl.current = new Howl({
      src: [streamUrl],
      html5: true,
      format: ['mp3'],
      onloaderror: onError,
      onplayerror: onError,
    });
    radioHowl.current.play();
    setActivePlayer('radio');
    setCurrentMixId(null);
  }, [stopAll]);

  const playMix = useCallback((mixId: string, audioUrl: string, onError?: () => void) => {
    stopAll();
    mixHowl.current = new Howl({
      src: [audioUrl],
      html5: true,
      format: ['mp3'],
      onloaderror: onError,
    });
    mixHowl.current.play();
    setActivePlayer('mix');
    setCurrentMixId(mixId);
  }, [stopAll]);

  const pause = useCallback(() => {
    radioHowl.current?.pause();
    mixHowl.current?.pause();
    setActivePlayer(null);
  }, []);

  return (
    <AudioControllerContext.Provider value={{ activePlayer, currentMixId, playRadio, playMix, pause }}>
      {children}
    </AudioControllerContext.Provider>
  );
}

export function useAudioController() {
  const ctx = useContext(AudioControllerContext);
  if (!ctx) throw new Error('useAudioController must be used within AudioControllerProvider');
  return ctx;
}

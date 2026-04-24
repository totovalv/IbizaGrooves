'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAudioController } from '@/lib/audio-controller';

export interface Mix {
  id: string;
  title: string;
  slug: string;
  artistId: string;
  audioUrl: string;
  artworkUrl?: string | null;
  duration?: number | null;
  tracklist?: string | null;
  playCount: number;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  artist?: { name: string };
}

interface MixPlayerProps {
  mixes: Mix[];
  initialMixId?: string;
}

export function clampIndex(current: number, delta: number, length: number): number {
  if (length === 0) return 0;
  const next = current + delta;
  return Math.max(0, Math.min(length - 1, next));
}

export default function MixPlayer({ mixes, initialMixId }: MixPlayerProps) {
  const { activePlayer, currentMixId, playMix, pause } = useAudioController();

  const initialIndex = initialMixId
    ? Math.max(0, mixes.findIndex((m) => m.id === initialMixId))
    : 0;

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [erroredMixIds, setErroredMixIds] = useState<Set<string>>(new Set());
  const [seekValue, setSeekValue] = useState(0);
  const seekIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isPlaying = activePlayer === 'mix';
  const currentMix = mixes[currentIndex] ?? null;
  const isCurrentMixPlaying = isPlaying && currentMixId === currentMix?.id;

  useEffect(() => {
    if (isCurrentMixPlaying) {
      seekIntervalRef.current = setInterval(() => {
        // Seek polling logic
      }, 500);
    } else {
      if (seekIntervalRef.current) {
        clearInterval(seekIntervalRef.current);
        seekIntervalRef.current = null;
      }
      if (!isCurrentMixPlaying) setSeekValue(0);
    }
    return () => {
      if (seekIntervalRef.current) clearInterval(seekIntervalRef.current);
    };
  }, [isCurrentMixPlaying]);

  const handlePlay = useCallback(
    (mix: Mix) => {
      if (erroredMixIds.has(mix.id)) return;
      playMix(mix.id, mix.audioUrl, () => {
        setErroredMixIds((prev) => new Set(prev).add(mix.id));
      });
      setSeekValue(0);
    },
    [playMix, erroredMixIds]
  );

  const handlePause = useCallback(() => {
    pause();
  }, [pause]);

  const nextMix = useCallback(() => {
    setCurrentIndex((idx) => clampIndex(idx, 1, mixes.length));
  }, [mixes.length]);

  const prevMix = useCallback(() => {
    setCurrentIndex((idx) => clampIndex(idx, -1, mixes.length));
  }, [mixes.length]);

  const handleSeekChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSeekValue(Number(e.target.value));
    },
    []
  );

  if (mixes.length === 0) {
    return (
      <div className="text-gray-400 text-xs uppercase tracking-widest font-bold py-12 text-center">No mixes available.</div>
    );
  }

  return (
    <div className="bg-white rounded-[2rem] p-6 md:p-10 text-gray-900 shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-black/5">
      {/* Current Mix Info */}
      <div className="flex flex-col md:flex-row items-center gap-10 mb-12">
        <div className="w-56 h-56 bg-orange-100 rounded-[3rem] flex items-center justify-center shadow-xl group relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-rose-500 opacity-20 group-hover:opacity-40 transition-opacity" />
           <span className="text-7xl font-black italic text-orange-500/20 select-none">MIX</span>
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <p className="text-orange-500 text-xs font-black uppercase tracking-[0.4em] mb-3">Now Playing</p>
          <h3 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic mb-3">
            {currentMix?.title ?? 'Select a Mix'}
          </h3>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">
            {currentMix?.artist?.name ?? 'IbizaGrooves Artist'}
          </p>
        </div>
      </div>

      {/* Controls & Progress */}
      <div className="space-y-8">
        <div className="flex items-center gap-6">
          <span className="text-[10px] font-black text-gray-400 w-10 text-right">{seekValue}s</span>
          <input
            type="range"
            min={0}
            max={currentMix?.duration ?? 100}
            value={seekValue}
            onChange={handleSeekChange}
            aria-label="Seek"
            className="flex-1 accent-orange-500 h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer"
          />
          <span className="text-[10px] font-black text-gray-400 w-10">
            {currentMix?.duration != null ? `${currentMix.duration}s` : '—'}
          </span>
        </div>

        <div className="flex items-center justify-center gap-10">
          <button
            onClick={prevMix}
            disabled={currentIndex === 0}
            className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-50 hover:bg-orange-500 hover:text-white transition-all disabled:opacity-20 border border-black/5"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
          </button>

          <button
            onClick={() => isCurrentMixPlaying ? handlePause() : handlePlay(currentMix!)}
            className="w-24 h-24 flex items-center justify-center rounded-full bg-orange-500 text-white hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-orange-500/40"
          >
            {isCurrentMixPlaying ? (
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            ) : (
              <svg className="w-10 h-10 translate-x-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>

          <button
            onClick={nextMix}
            disabled={currentIndex === mixes.length - 1}
            className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-50 hover:bg-orange-500 hover:text-white transition-all disabled:opacity-20 border border-black/5"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M16 18h2V6h-2zM6 18l8.5-6L6 6z"/></svg>
          </button>
        </div>
      </div>

      {/* Playlist */}
      <div className="mt-16">
        <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-300 mb-8 border-b border-gray-50 pb-6">Up Next</h4>
        <ul className="space-y-3 max-h-72 overflow-y-auto custom-scrollbar pr-4">
          {mixes.map((mix, idx) => {
            const isActive = idx === currentIndex;
            const isThisPlaying = isPlaying && currentMixId === mix.id;

            return (
              <li
                key={mix.id}
                onClick={() => setCurrentIndex(idx)}
                className={`group flex items-center gap-6 p-5 rounded-[2rem] cursor-pointer transition-all ${
                  isActive ? 'bg-orange-50 border border-orange-100 shadow-sm' : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs ${isActive ? 'bg-orange-500 text-white shadow-lg' : 'bg-gray-100 text-gray-400 group-hover:bg-white group-hover:shadow-md transition-all'}`}>
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-lg font-black tracking-tight truncate ${isActive ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-900'}`}>{mix.title}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{mix.artist?.name || 'Ibiza Artist'}</p>
                </div>
                {isThisPlaying && (
                  <div className="flex gap-1.5 items-end h-4 pr-2">
                    <div className="w-1.5 bg-orange-500 animate-[bounce_1s_infinite_0ms] rounded-full" />
                    <div className="w-1.5 bg-orange-500 animate-[bounce_1s_infinite_200ms] rounded-full" />
                    <div className="w-1.5 bg-orange-500 animate-[bounce_1s_infinite_400ms] rounded-full" />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}



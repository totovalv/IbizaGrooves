'use client';

import { useState } from 'react';
import { useAudioController } from '@/lib/audio-controller';

interface LiveRadioPlayerProps {
  streamUrl: string;
  stationName: string;
}

export default function LiveRadioPlayer({ streamUrl, stationName }: LiveRadioPlayerProps) {
  const { activePlayer, playRadio, pause } = useAudioController();
  const [streamError, setStreamError] = useState(false);

  const isPlaying = activePlayer === 'radio';

  const handleToggle = () => {
    if (isPlaying) {
      pause();
    } else {
      setStreamError(false);
      playRadio(streamUrl, () => setStreamError(true));
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-gray-900 p-6 text-white shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-orange-400">
            Live Radio
          </p>
          <h2 className="text-lg font-bold">{stationName}</h2>
        </div>

        <button
          onClick={handleToggle}
          aria-label={isPlaying ? `Pause ${stationName}` : `Play ${stationName}`}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 transition hover:bg-orange-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
        >
          {isPlaying ? (
            /* Pause icon */
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            /* Play icon */
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      </div>

      {streamError && (
        <div
          role="alert"
          className="rounded-lg bg-red-900/60 px-4 py-2 text-sm text-red-200"
        >
          Stream currently unavailable. Please try again later.
        </div>
      )}
    </div>
  );
}

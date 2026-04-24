// Feature: ibiza-grooves-web-app, Property 3: Audio controller mutual exclusion
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import * as fc from 'fast-check';
import React from 'react';
import { AudioControllerProvider, useAudioController } from './audio-controller';

// Mock Howler so no real audio is attempted in jsdom
vi.mock('howler', () => {
  class Howl {
    play = vi.fn();
    stop = vi.fn();
    pause = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(_options: unknown) {}
  }
  return { Howl };
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AudioControllerProvider>{children}</AudioControllerProvider>
);

describe('useAudioController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('throws when used outside provider', () => {
    expect(() => renderHook(() => useAudioController())).toThrow(
      'useAudioController must be used within AudioControllerProvider'
    );
  });

  it('starts with activePlayer null and currentMixId null', () => {
    const { result } = renderHook(() => useAudioController(), { wrapper });
    expect(result.current.activePlayer).toBeNull();
    expect(result.current.currentMixId).toBeNull();
  });

  it('sets activePlayer to radio after playRadio', () => {
    const { result } = renderHook(() => useAudioController(), { wrapper });
    act(() => result.current.playRadio('https://stream.example.com/live'));
    expect(result.current.activePlayer).toBe('radio');
    expect(result.current.currentMixId).toBeNull();
  });

  it('sets activePlayer to mix and currentMixId after playMix', () => {
    const { result } = renderHook(() => useAudioController(), { wrapper });
    act(() => result.current.playMix('mix-1', 'https://cdn.example.com/mix1.mp3'));
    expect(result.current.activePlayer).toBe('mix');
    expect(result.current.currentMixId).toBe('mix-1');
  });

  it('sets activePlayer to null after pause', () => {
    const { result } = renderHook(() => useAudioController(), { wrapper });
    act(() => result.current.playRadio('https://stream.example.com/live'));
    act(() => result.current.pause());
    expect(result.current.activePlayer).toBeNull();
  });

  /**
   * Property 3: Audio controller mutual exclusion
   * Validates: Requirements 2.3, 3.3, 4.1, 4.2
   *
   * For any sequence of playRadio / playMix calls, after each call completes,
   * activePlayer equals exactly the most recently started player — never both
   * 'radio' and 'mix' simultaneously.
   */
  it('Property 3: mutual exclusion — activePlayer matches most recent play call', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.oneof(
            fc.constant('radio' as const),
            fc.record({
              type: fc.constant('mix' as const),
              id: fc.string({ minLength: 1 }),
              url: fc.webUrl(),
            })
          ),
          { minLength: 1 }
        ),
        (sequence) => {
          const { result } = renderHook(() => useAudioController(), { wrapper });

          let expectedPlayer: 'radio' | 'mix' | null = null;
          let expectedMixId: string | null = null;

          for (const action of sequence) {
            if (action === 'radio') {
              act(() => result.current.playRadio('https://stream.example.com/live'));
              expectedPlayer = 'radio';
              expectedMixId = null;
            } else {
              act(() => result.current.playMix(action.id, action.url));
              expectedPlayer = 'mix';
              expectedMixId = action.id;
            }

            // After each call: activePlayer must equal the most recently started player
            expect(result.current.activePlayer).toBe(expectedPlayer);
            // activePlayer must never be both 'radio' and 'mix' — it's a single value
            expect(['radio', 'mix', null]).toContain(result.current.activePlayer);

            if (expectedPlayer === 'mix') {
              expect(result.current.currentMixId).toBe(expectedMixId);
            } else {
              expect(result.current.currentMixId).toBeNull();
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

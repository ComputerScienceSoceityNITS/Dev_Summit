import React from 'react';
import { ASSET_PATHS, HERO_CONTENT } from '../data/eventContent';
import { AlertCircle, Play } from 'lucide-react';

interface FullscreenLoaderProps {
  loadedCount: number;
  totalFrames: number;
  failedCount: number;
  isReady: boolean;
  isBuffered?: boolean;
  onProceedAnyway?: () => void;
}

/**
 * Full-screen Loading State
 * - Opaque full-screen covering entire viewport
 * - Supplied poster as loader background
 * - Supplied Transformers logo prominently displayed with glowing pulse
 * - Clean progress bar and percentage without internal frame counts
 */
export const FullscreenLoader: React.FC<FullscreenLoaderProps> = ({
  loadedCount,
  totalFrames,
  failedCount,
  isReady,
  isBuffered = false,
  onProceedAnyway,
}) => {
  const percentage = Math.min(100, Math.round((loadedCount / totalFrames) * 100));

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading transformation experience"
      className="fixed inset-0 z-50 bg-[#030712] overflow-hidden flex flex-col items-center justify-center p-4 sm:p-6 select-none animate-in fade-in duration-200"
    >
      {/* Background: Supplied Poster Image with dark tint */}
      <div className="absolute inset-0 z-0">
        <img
          src={ASSET_PATHS.heroPoster}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover opacity-20 filter blur-sm scale-105"
        />
        <div className="absolute inset-0 bg-[#030712]/85 backdrop-blur-md" />
        <div className="absolute inset-0 cyber-grid-bg opacity-30" />
      </div>

      {/* Foreground Content Card */}
      <div className="relative z-10 max-w-md w-full flex flex-col items-center text-center p-8 rounded-2xl bg-[#060c20]/95 border border-cyan-400/40 shadow-[0_0_60px_rgba(0,240,255,0.25)] backdrop-blur-2xl">
        
        {/* Supplied Transformers Logo Container with Energy Ring & Pulse */}
        <div className="relative w-36 h-36 md:w-44 md:h-44 flex items-center justify-center mb-6">
          {/* Outer Rotating Energy Ring */}
          <div
            className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-400/60 animate-spin-slow pointer-events-none"
            style={{ animationDuration: '10s' }}
            aria-hidden="true"
          />
          {/* Inner Glowing Arc Ring */}
          <div
            className="absolute -inset-2 rounded-full border-2 border-t-cyan-300 border-r-transparent border-b-sky-500 border-l-transparent animate-spin-reverse-slow opacity-90 shadow-[0_0_20px_rgba(0,240,255,0.7)]"
            style={{ animationDuration: '6s' }}
            aria-hidden="true"
          />
          {/* Subtle Outer Pulse Glow */}
          <div
            className="absolute -inset-4 rounded-full bg-cyan-500/15 animate-ping opacity-30"
            style={{ animationDuration: '2.5s' }}
            aria-hidden="true"
          />

          {/* Centered Transformers Logo */}
          <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-xl bg-black border border-cyan-500/50 flex items-center justify-center overflow-hidden shadow-[0_0_25px_rgba(0,240,255,0.6)]">
            <img
              src={ASSET_PATHS.transformersLoaderLogo}
              alt="Transformers Autobot insignia"
              className="w-full h-full object-contain blend-screen filter drop-shadow-[0_0_15px_rgba(0,240,255,0.9)] animate-pulse"
              style={{ animationDuration: '2s' }}
            />
          </div>
        </div>

        {/* Status Callout */}
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-heading text-xs tracking-[0.25em] font-bold text-cyan-300 uppercase">
            {HERO_CONTENT.loaderLabel}
          </span>
        </div>

        {/* Clean Heading without internal frame counts */}
        <h2 className="font-heading text-xl sm:text-2xl font-black text-white uppercase tracking-wider mb-4 text-glow-cyan">
          ASSEMBLING THE EXPERIENCE
        </h2>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-black/90 rounded-full overflow-hidden border border-cyan-500/40 p-[1.5px] mb-3 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-white rounded-full transition-all duration-150 shadow-[0_0_10px_rgba(0,240,255,0.9)]"
            style={{ width: `${Math.max(5, percentage)}%` }}
          />
        </div>

        {/* Progress Percentage Display */}
        <div className="flex items-center justify-between w-full font-mono text-xs text-slate-400">
          <span className="text-cyan-400 font-bold">{percentage}% INITIALIZED</span>
          <span className="text-slate-500 font-mono">
            {isBuffered ? 'BUFFER OPTIMAL' : 'SYNCHRONIZING'}
          </span>
        </div>

        {/* Graceful Error Handling Message */}
        {failedCount > 0 && (
          <div className="mt-4 p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-xs text-red-200 flex items-start gap-2 text-left">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>
              Synchronizing with nearest cached assets to guarantee smooth playback.
            </span>
          </div>
        )}

        {/* Instant Launch Button if buffered and user wants to play immediately */}
        {isBuffered && !isReady && onProceedAnyway && (
          <button
            type="button"
            onClick={onProceedAnyway}
            className="mt-6 w-full cyber-clip py-3 bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-black font-heading font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>Launch Transformation Experience</span>
          </button>
        )}

      </div>
    </div>
  );
};

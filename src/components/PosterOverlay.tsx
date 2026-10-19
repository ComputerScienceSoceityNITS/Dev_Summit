import React, { useEffect } from 'react';
import { ASSET_PATHS } from '../data/eventContent';
import { X, Play } from 'lucide-react';

interface PosterOverlayProps {
  onClose: () => void;
  subtitle?: string;
}

/**
 * Full-screen Poster Overlay
 * - Shows the supplied poster (hero-poster.png) responsively without stretching/cropping
 * - Visible close button (×) in upper-right corner
 * - Dismissing starts the transformation experience
 */
export const PosterOverlay: React.FC<PosterOverlayProps> = ({
  onClose,
  subtitle = 'Click × to close and initiate transformation',
}) => {
  // Listen for Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Event Poster Overlay"
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-between p-4 sm:p-6 md:p-8 overflow-hidden animate-in fade-in duration-300"
    >
      {/* Upper-Right Visible Close Button (×) */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close poster and start transformation"
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-60 w-12 h-12 rounded-full bg-slate-900/90 border-2 border-cyan-400 text-cyan-300 hover:text-white hover:bg-cyan-500/20 hover:border-cyan-300 flex items-center justify-center transition-all duration-200 shadow-[0_0_20px_rgba(0,240,255,0.5)] focus-visible:ring-2 focus-visible:ring-cyan-300 outline-none cursor-pointer"
        title="Close poster and start transformation (Esc)"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Top Banner Notice */}
      <div className="pt-2 text-center">
        <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-bold px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30">
          OFFICIAL SUMMIT POSTER
        </span>
      </div>

      {/* Center Poster Image: Responsively Sized without stretching or cropping */}
      <div className="relative my-auto max-h-[82vh] max-w-[92vw] flex items-center justify-center">
        <img
          src={ASSET_PATHS.heroPoster}
          alt="Dev Summit Cybertron Edition Official Event Poster"
          className="max-h-[80vh] max-w-[90vw] w-auto h-auto object-contain rounded-xl shadow-[0_0_60px_rgba(0,240,255,0.3)] border border-cyan-500/40"
        />
      </div>

      {/* Bottom Dismiss Bar / CTA */}
      <div className="pb-2 flex flex-col sm:flex-row items-center gap-3">
        <button
          type="button"
          onClick={onClose}
          className="cyber-clip px-7 py-3 bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-black font-heading font-black text-xs tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center gap-2 cursor-pointer"
        >
          <span>Start Transformation</span>
          <Play className="w-3.5 h-3.5 fill-black" />
        </button>
        <span className="font-mono text-xs text-slate-400">
          {subtitle}
        </span>
      </div>
    </div>
  );
};

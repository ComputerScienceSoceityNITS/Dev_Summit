import React, { useState, useEffect } from 'react';
import { HERO_CONTENT, EVENT_METADATA, ASSET_PATHS } from '../data/eventContent';
import { Image as ImageIcon, Menu, X, Sparkles, Shield, ChevronRight } from 'lucide-react';

interface CleanNavbarProps {
  onOpenTopic: (topic: string) => void;
  onOpenPoster: () => void;
}

export const CleanNavbar: React.FC<CleanNavbarProps> = ({
  onOpenTopic,
  onOpenPoster,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Close mobile drawer when resizing back to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogoClick = () => {
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTopicClick = (topic: string) => {
    setIsMobileMenuOpen(false);
    onOpenTopic(topic);
  };

  const handlePosterClick = () => {
    setIsMobileMenuOpen(false);
    onOpenPoster();
  };

  return (
    <header
      role="banner"
      className="fixed top-0 left-0 right-0 z-40 bg-[#030712]/92 backdrop-blur-xl border-b border-cyan-500/25 py-2.5 sm:py-3 px-4 sm:px-8 shadow-[0_4px_25px_rgba(0,0,0,0.8)]"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {/* Wordmark with Supplied Transformers Loader Logo (Clicking returns to top) */}
        <button
          type="button"
          onClick={handleLogoClick}
          className="flex items-center gap-2.5 sm:gap-3 text-left group cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 outline-none rounded"
          title="Return to start"
        >
          {/* Transformers Loader Logo in Upper-Left Corner */}
          <div className="relative w-8 h-8 rounded-lg bg-black border border-cyan-400/50 p-1 flex items-center justify-center overflow-hidden group-hover:border-cyan-300 group-hover:shadow-[0_0_15px_rgba(0,240,255,0.8)] transition-all">
            <img
              src={ASSET_PATHS.transformersLoaderLogo}
              alt="Transformers emblem"
              className="w-full h-full object-contain blend-screen filter drop-shadow-[0_0_6px_rgba(0,240,255,0.85)]"
            />
          </div>

          <span className="font-heading font-black text-sm sm:text-base md:text-lg text-white tracking-wider group-hover:text-cyan-300 transition-colors">
            {HERO_CONTENT.eventName}
            <span className="text-cyan-400 font-light text-xs sm:text-sm ml-1">// {EVENT_METADATA.year}</span>
          </span>
        </button>

        {/* --- DESKTOP HORIZONTAL NAVBAR (Hidden on mobile < 768px) --- */}
        <nav aria-label="Desktop Navigation" className="hidden md:flex items-center space-x-1 lg:space-x-2 text-xs font-heading font-bold uppercase tracking-wider">
          <button
            type="button"
            onClick={() => handleTopicClick('About')}
            className="px-2.5 py-1.5 text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 rounded transition-colors cursor-pointer"
          >
            About
          </button>
          
          <button
            type="button"
            onClick={() => handleTopicClick('Events')}
            className="px-2.5 py-1.5 text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 rounded transition-colors cursor-pointer"
          >
            Events
          </button>
          
          <button
            type="button"
            onClick={() => handleTopicClick('Speakers')}
            className="px-2.5 py-1.5 text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 rounded transition-colors cursor-pointer"
          >
            Speakers
          </button>

          <button
            type="button"
            onClick={handlePosterClick}
            className="px-2.5 py-1.5 text-cyan-400 hover:text-white hover:bg-cyan-500/15 rounded transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Poster</span>
          </button>

          <button
            type="button"
            onClick={() => handleTopicClick('Register')}
            className="ml-1.5 cyber-clip px-4 py-2 bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-black font-extrabold text-xs tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)] cursor-pointer"
          >
            Register
          </button>
        </nav>

        {/* --- MOBILE COMPACT HEADER ACTIONS (Visible on mobile < 768px) --- */}
        <div className="flex md:hidden items-center gap-2">
          {/* Quick Poster Icon Button */}
          <button
            type="button"
            onClick={handlePosterClick}
            aria-label="View poster"
            className="p-2 rounded-lg bg-slate-900 border border-cyan-500/30 text-cyan-400 hover:text-white hover:border-cyan-300 transition-colors cursor-pointer"
            title="View Poster"
          >
            <ImageIcon className="w-4 h-4" />
          </button>

          {/* Cyber Hamburger Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileMenuOpen}
            className="p-2 rounded-lg bg-slate-900 border border-cyan-500/40 text-cyan-300 hover:text-white hover:bg-cyan-500/20 hover:border-cyan-300 transition-all shadow-[0_0_12px_rgba(0,240,255,0.25)] cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-300 outline-none"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* --- MOBILE VERTICAL SLIDE-OUT NAVIGATION BAR (DRAWER) --- */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <div
            className="fixed inset-0 top-[53px] bg-black/70 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Vertical Bar Panel */}
          <aside
            aria-label="Mobile Navigation Menu"
            className="fixed top-[53px] right-0 bottom-0 w-72 sm:w-80 bg-[#030712]/98 border-l border-cyan-500/30 backdrop-blur-2xl z-50 p-6 flex flex-col justify-between shadow-[-10px_0_35px_rgba(0,0,0,0.9)] animate-in slide-in-from-right duration-300 md:hidden overflow-y-auto"
          >
            {/* Top Brand & Category Tag */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20 mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="font-heading text-xs font-bold tracking-widest text-cyan-300 uppercase">
                    AUTOBOT TERMINAL
                  </span>
                </div>
                <span className="font-mono text-[10px] text-slate-500 uppercase">
                  v2026.1
                </span>
              </div>

              {/* Vertical Stack of Navigation Buttons */}
              <nav className="flex flex-col space-y-2.5 font-heading text-sm font-bold uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => handleTopicClick('About')}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-200 hover:text-cyan-300 hover:border-cyan-500/40 hover:bg-cyan-950/40 transition-all text-left cursor-pointer"
                >
                  <span>About Summit</span>
                  <ChevronRight className="w-4 h-4 text-cyan-500" />
                </button>

                <button
                  type="button"
                  onClick={() => handleTopicClick('Events')}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-200 hover:text-cyan-300 hover:border-cyan-500/40 hover:bg-cyan-950/40 transition-all text-left cursor-pointer"
                >
                  <span>Technical Tracks</span>
                  <ChevronRight className="w-4 h-4 text-cyan-500" />
                </button>

                <button
                  type="button"
                  onClick={() => handleTopicClick('Speakers')}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-200 hover:text-cyan-300 hover:border-cyan-500/40 hover:bg-cyan-950/40 transition-all text-left cursor-pointer"
                >
                  <span>Featured Speakers</span>
                  <ChevronRight className="w-4 h-4 text-cyan-500" />
                </button>

                <button
                  type="button"
                  onClick={handlePosterClick}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 hover:text-white hover:border-cyan-300 transition-all text-left cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-cyan-400" />
                    <span>View Event Poster</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-cyan-400" />
                </button>
              </nav>
            </div>

            {/* Bottom Actions inside Vertical Bar */}
            <div className="pt-6 border-t border-slate-800/80 space-y-3">
              <button
                type="button"
                onClick={() => handleTopicClick('Register')}
                className="w-full cyber-clip py-3.5 bg-gradient-to-r from-cyan-500 via-sky-400 to-cyan-500 hover:from-cyan-400 hover:to-sky-300 text-black font-heading font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Register for VIP Access</span>
              </button>

              <div className="text-center font-mono text-[10px] text-slate-500">
                Google Developer Groups • {EVENT_METADATA.year}
              </div>
            </div>

          </aside>
        </>
      )}

    </header>
  );
};

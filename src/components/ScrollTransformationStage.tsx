import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { HERO_CONTENT, EVENT_METADATA } from '../data/eventContent';
import { CleanNavbar } from './CleanNavbar';
import { Image as ImageIcon, RotateCcw, ChevronDown, Play, Pause, Cpu } from 'lucide-react';

interface ScrollTransformationStageProps {
  getFrame: (index: number) => HTMLImageElement | null;
  totalFrames: number;
  onOpenPoster: () => void;
  onOpenTopic: (topic: string) => void;
}

/**
 * High-Quality Scroll-Driven Transformation Stage
 * - Linked scroll progress across 400vh container to transformation sequence
 * - requestAnimationFrame batched updates for silky 60/120 FPS rendering
 * - High-DPI 2D canvas with high-quality bicubic smoothing
 * - Fully functional 24 FPS Autoplay with programmatic scroll lock
 * - Absolute overlay positioning so Opening Screen and Final Screen never push each other or get cut off
 * - Full DEV SUMMIT 2026 COMING SOON reveal at scroll > 0.70
 * - Clean UI: No internal frame numbers or '240 frames' mentioned
 * - Persistent, accessible navigation bar
 */
export const ScrollTransformationStage: React.FC<ScrollTransformationStageProps> = ({
  getFrame,
  totalFrames,
  onOpenPoster,
  onOpenTopic,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [currentFrame, setCurrentFrame] = useState<number>(1);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const targetFrameRef = useRef<number>(1);
  const currentDrawnFrameRef = useRef<number>(1);
  const rafIdRef = useRef<number | null>(null);
  const autoplayRafIdRef = useRef<number | null>(null);

  // Flags to prevent programmatic scroll from canceling autoplay
  const isAutoplayingRef = useRef<boolean>(false);
  const isProgrammaticScrollRef = useRef<boolean>(false);

  // High-Quality Canvas Draw Routine
  const drawFrame = useCallback((frameNumber: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const clientWidth = canvas.clientWidth;
    const clientHeight = canvas.clientHeight;
    if (clientWidth === 0 || clientHeight === 0) return;

    // High-DPI support: cap at 2 for optimal GPU performance
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const targetW = Math.round(clientWidth * dpr);
    const targetH = Math.round(clientHeight * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    // Maximum image rendering quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const img = getFrame(frameNumber);
    if (img && img.complete && img.naturalWidth > 0) {
      const imgW = img.naturalWidth;
      const imgH = img.naturalHeight;

      // Responsive cover scaling preserving 16:9 aspect ratio centered
      const scale = Math.max(clientWidth / imgW, clientHeight / imgH);
      const drawW = imgW * scale;
      const drawH = imgH * scale;
      const offsetX = (clientWidth - drawW) / 2;
      const offsetY = (clientHeight - drawH) / 2;

      ctx.clearRect(0, 0, clientWidth, clientHeight);
      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
      currentDrawnFrameRef.current = frameNumber;
    }

    ctx.restore();
  }, [getFrame]);

  // Stop Autoplay helper
  const stopAutoplay = useCallback(() => {
    isAutoplayingRef.current = false;
    setIsPlaying(false);
    if (autoplayRafIdRef.current !== null) {
      cancelAnimationFrame(autoplayRafIdRef.current);
      autoplayRafIdRef.current = null;
    }
  }, []);

  // Scroll Progress Calculator using requestAnimationFrame
  const handleScroll = useCallback(() => {
    // If scroll was triggered by our own autoplay, ignore user-cancel logic
    if (isProgrammaticScrollRef.current) {
      isProgrammaticScrollRef.current = false;
      return;
    }

    // If user actually scrolled with mouse/touch/wheel, stop autoplay
    if (isAutoplayingRef.current) {
      stopAutoplay();
    }

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const windowH = window.innerHeight;
    const maxScroll = rect.height - windowH;

    if (maxScroll <= 0) return;

    const scrolled = -rect.top;
    const rawProgress = Math.max(0, Math.min(1, scrolled / maxScroll));

    // Map 0 -> frame 1, 1 -> frame totalFrames
    const frameIndex = Math.min(
      totalFrames,
      Math.max(1, Math.round(1 + rawProgress * (totalFrames - 1)))
    );

    targetFrameRef.current = frameIndex;
    setScrollProgress(rawProgress);
    setCurrentFrame(frameIndex);

    // Trigger RAF draw
    if (rafIdRef.current === null) {
      rafIdRef.current = requestAnimationFrame(() => {
        drawFrame(targetFrameRef.current);
        rafIdRef.current = null;
      });
    }
  }, [totalFrames, drawFrame, stopAutoplay]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    // Initial draw
    drawFrame(1);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
      if (autoplayRafIdRef.current !== null) cancelAnimationFrame(autoplayRafIdRef.current);
    };
  }, [handleScroll, drawFrame]);

  // Fully Functional 24 FPS Autoplay / Pause Toggle
  const togglePlay = () => {
    if (isAutoplayingRef.current) {
      stopAutoplay();
    } else {
      // If already at or near end, restart from frame 1
      if (targetFrameRef.current >= totalFrames) {
        targetFrameRef.current = 1;
        setCurrentFrame(1);
        setScrollProgress(0);
        drawFrame(1);
        if (containerRef.current) {
          isProgrammaticScrollRef.current = true;
          window.scrollTo({ top: containerRef.current.offsetTop, behavior: 'instant' });
        }
      }

      isAutoplayingRef.current = true;
      setIsPlaying(true);

      const frameDuration = 1000 / 24; // 24 FPS = 41.667ms per frame
      let lastTime = performance.now();

      const runAutoplay = (now: number) => {
        if (!isAutoplayingRef.current) return;

        const elapsed = now - lastTime;
        if (elapsed >= frameDuration) {
          lastTime = now - (elapsed % frameDuration);

          const nextFrame = targetFrameRef.current + 1;

          if (nextFrame > totalFrames) {
            targetFrameRef.current = totalFrames;
            drawFrame(totalFrames);
            setCurrentFrame(totalFrames);
            setScrollProgress(1);
            stopAutoplay();
            return;
          }

          targetFrameRef.current = nextFrame;
          const nextProgress = (nextFrame - 1) / (totalFrames - 1);

          drawFrame(nextFrame);
          setCurrentFrame(nextFrame);
          setScrollProgress(nextProgress);

          // Sync page scroll position with programmatic flag
          const container = containerRef.current;
          if (container) {
            const windowH = window.innerHeight;
            const totalDist = container.offsetHeight - windowH;
            const targetY = container.offsetTop + nextProgress * totalDist;
            isProgrammaticScrollRef.current = true;
            window.scrollTo({ top: targetY, behavior: 'instant' });
          }
        }

        autoplayRafIdRef.current = requestAnimationFrame(runAutoplay);
      };

      autoplayRafIdRef.current = requestAnimationFrame(runAutoplay);
    }
  };

  // Replay from start
  const handleReplay = () => {
    stopAutoplay();

    if (containerRef.current) {
      isProgrammaticScrollRef.current = true;
      window.scrollTo({ top: containerRef.current.offsetTop, behavior: 'smooth' });
    }
    targetFrameRef.current = 1;
    drawFrame(1);
    setCurrentFrame(1);
    setScrollProgress(0);
  };

  // Transformation Phase Info
  const phaseInfo = useMemo(() => {
    if (currentFrame < 60) {
      return { step: 'PHASE 01 // SCANNING MATRIX', name: 'INITIALIZATION' };
    } else if (currentFrame < 130) {
      return { step: 'PHASE 02 // CHASSIS RECONFIGURATION', name: 'TRANSFORMATION' };
    } else if (currentFrame < 190) {
      return { step: 'PHASE 03 // QUANTUM COUPLING', name: 'NEURAL ASSEMBLY' };
    } else {
      return { step: 'PHASE 04 // PRIME DIRECTIVE ACHIEVED', name: 'COMPLETE' };
    }
  }, [currentFrame]);

  // State checks based on scroll progress
  const isStart = scrollProgress < 0.15;
  const isEnd = scrollProgress > 0.70;

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#030712]"
      style={{ height: '400vh' }}
    >
      {/* Sticky Full-Viewport Stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between">
        
        {/* Full-Screen High-DPI 2D Canvas */}
        <canvas
          ref={canvasRef}
          aria-label="Interactive scroll-driven transformation sequence"
          className="absolute inset-0 w-full h-full block object-cover z-0"
          style={{ width: '100vw', height: '100vh' }}
        />

        {/* Ambient Dark Gradient Vignette for Text Readability */}
        <div
          className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#030712] via-[#030712]/30 to-[#030712]/75 z-10"
          aria-hidden="true"
        />

        {/* Clean Navbar - Always Pinned at Top */}
        <CleanNavbar
          onOpenTopic={onOpenTopic}
          onOpenPoster={onOpenPoster}
        />

        {/* --- SCENARIO A: OPENING MINIMAL SCREEN (Centered Absolutely) --- */}
        <div
          className={`absolute inset-0 z-20 flex flex-col items-center justify-center px-4 pt-16 pb-24 text-center transition-all duration-500 pointer-events-none ${
            isStart ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <div className={`max-w-2xl mx-auto flex flex-col items-center ${isStart ? 'pointer-events-auto' : 'pointer-events-none'}`}>
            {/* Autobot Callout */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-400/40 backdrop-blur-md mb-5 shadow-[0_0_20px_rgba(0,240,255,0.3)]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="font-heading text-xs tracking-[0.25em] font-semibold text-cyan-300 uppercase">
                {HERO_CONTENT.callout}
              </span>
            </div>

            {/* DEV SUMMIT Title */}
            <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-white uppercase text-glow-cyan drop-shadow-2xl">
              {HERO_CONTENT.eventName} 2026
            </h1>

            {/* Motto */}
            <p className="font-tech text-lg sm:text-xl md:text-2xl font-bold tracking-[0.2em] text-[#ff4b26] text-glow-orange mt-2 uppercase">
              {HERO_CONTENT.themeMotto}
            </p>

            <p className="mt-2 text-xs sm:text-sm font-mono text-slate-300 max-w-lg mx-auto uppercase">
              {HERO_CONTENT.tagline} • {EVENT_METADATA.edition}
            </p>

            {/* Action Buttons at Opening */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={onOpenPoster}
                className="cyber-clip px-7 py-3 bg-gradient-to-r from-cyan-500 via-sky-400 to-cyan-500 hover:from-cyan-400 hover:to-sky-300 text-black font-heading font-black text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:shadow-[0_0_40px_rgba(0,240,255,0.8)] focus-visible:ring-2 focus-visible:ring-cyan-300 outline-none flex items-center gap-2.5 cursor-pointer"
              >
                <ImageIcon className="w-4 h-4 text-black" />
                <span>View Event Poster</span>
              </button>

              <button
                type="button"
                onClick={togglePlay}
                className="cyber-clip px-6 py-3 bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 font-heading font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 backdrop-blur-md focus-visible:ring-2 focus-visible:ring-cyan-300 outline-none flex items-center gap-2 cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4 text-cyan-400" /> : <Play className="w-4 h-4 text-cyan-400" />}
                <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
              </button>
            </div>

            {/* Scroll Cue */}
            <div className="mt-8 flex flex-col items-center text-cyan-400 animate-pulse">
              <span className="font-heading text-xs tracking-widest font-bold uppercase mb-1">
                SCROLL DOWN TO TRANSFORM
              </span>
              <ChevronDown className="w-5 h-5 animate-bounce" />
            </div>
          </div>
        </div>

        {/* --- SCENARIO B: FINAL SCREEN (Centered Absolutely - Completely Visible) --- */}
        <div
          className={`absolute inset-0 z-20 flex flex-col items-center justify-center px-4 pt-16 pb-24 text-center transition-all duration-500 pointer-events-none ${
            isEnd ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <div className={`max-w-2xl mx-auto flex flex-col items-center ${isEnd ? 'pointer-events-auto' : 'pointer-events-none'}`}>
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-400/40 backdrop-blur-md mb-4 shadow-[0_0_20px_rgba(0,240,255,0.3)]">
              <span className="w-2 h-2 rounded-full bg-[#ff4b26] animate-pulse" />
              <span className="font-heading text-xs tracking-[0.25em] font-semibold text-cyan-300 uppercase">
                TITAN PROTOCOL ONLINE
              </span>
            </div>

            {/* Final Title: DEV SUMMIT 2026 */}
            <h2 className="font-heading text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-white uppercase text-glow-cyan drop-shadow-2xl">
              {HERO_CONTENT.eventName} 2026
            </h2>

            {/* COMING SOON beneath it */}
            <div className="mt-2 font-heading text-3xl sm:text-4xl md:text-5xl font-black tracking-widest text-[#ff4b26] text-glow-orange uppercase">
              COMING SOON
            </div>

            <p className="mt-3 font-tech text-base sm:text-lg md:text-xl font-bold tracking-[0.2em] text-cyan-300 uppercase">
              {HERO_CONTENT.themeMotto}
            </p>

            <p className="mt-2 text-xs sm:text-sm font-mono text-slate-300 max-w-lg mx-auto">
              The premier developer summit celebrating adaptive engineering and foundational intelligence.
            </p>

            {/* Action Buttons: Replay & View Poster */}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleReplay}
                className="cyber-clip px-7 py-3 bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-black font-heading font-black text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:shadow-[0_0_40px_rgba(0,240,255,0.8)] focus-visible:ring-2 focus-visible:ring-cyan-300 outline-none active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Replay Transformation</span>
              </button>

              <button
                type="button"
                onClick={onOpenPoster}
                className="cyber-clip px-6 py-3 bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 font-heading font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 backdrop-blur-md focus-visible:ring-2 focus-visible:ring-cyan-300 outline-none flex items-center gap-2 cursor-pointer"
              >
                <ImageIcon className="w-4 h-4 text-cyan-400" />
                <span>View Event Poster</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom HUD Bar: Telemetry, Progress, and Controls */}
        <div className="relative z-30 w-full max-w-6xl mx-auto px-4 pb-4 pt-2 pointer-events-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-black/80 border border-cyan-500/25 backdrop-blur-xl shadow-2xl">
            
            {/* HUD Left: Phase Indicator */}
            <div className="flex items-center gap-2 font-mono text-xs">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-300 font-bold">{phaseInfo.step}</span>
            </div>

            {/* HUD Center: Interactive Progress Scrubber */}
            <div className="w-full sm:w-72 flex flex-col items-center space-y-1">
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-cyan-500/30 p-[1px]">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-sky-300 rounded-full transition-all duration-75 shadow-[0_0_8px_rgba(0,240,255,0.8)]"
                  style={{ width: `${Math.round(scrollProgress * 100)}%` }}
                />
              </div>
              <div className="flex justify-between w-full font-mono text-[10px] text-slate-400">
                <span>TRANSFORMATION PROGRESS</span>
                <span className="text-cyan-400 font-bold">{Math.round(scrollProgress * 100)}%</span>
              </div>
            </div>

            {/* HUD Right: Status Badge & Play / Pause Controls */}
            <div className="flex items-center gap-3">
              <div className="font-mono text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-slate-300 font-bold tracking-wider uppercase">
                  {phaseInfo.name}
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={isPlaying ? 'Pause' : 'Autoplay'}
                  className="p-1.5 text-cyan-300 hover:text-white hover:bg-cyan-500/20 rounded transition-colors cursor-pointer"
                  title={isPlaying ? 'Pause' : 'Autoplay'}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5 text-cyan-400" /> : <Play className="w-3.5 h-3.5 text-cyan-300" />}
                </button>
                <button
                  type="button"
                  onClick={handleReplay}
                  aria-label="Reset to start"
                  className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/20 rounded transition-colors cursor-pointer"
                  title="Reset to Start"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

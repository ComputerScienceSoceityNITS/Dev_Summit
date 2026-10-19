import { useEffect, useRef, useState, useCallback } from 'react';
import { ASSET_PATHS } from '../data/eventContent';

interface UseTransformationSequenceReturn {
  loadedCount: number;
  totalFrames: number;
  isReady: boolean;
  isBuffered: boolean;
  failedCount: number;
  getFrame: (index: number) => HTMLImageElement | null;
  startPreloading: () => void;
}

// Global cache so loaded frames persist across component mounts and HMR refreshes
const globalFramesCache = new Map<number, HTMLImageElement>();
let globalPoster: HTMLImageElement | null = null;
let isPreloadingInitiated = false;

// 36 frames = 1.5 seconds of 24 FPS animation buffer
const MIN_BUFFER_FRAMES = 36;

export function useTransformationSequence(totalFrames: number = ASSET_PATHS.totalFrames): UseTransformationSequenceReturn {
  const [loadedCount, setLoadedCount] = useState<number>(() => globalFramesCache.size);
  const [failedCount, setFailedCount] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(() => globalFramesCache.size >= totalFrames);
  const [isBuffered, setIsBuffered] = useState<boolean>(() => globalFramesCache.size >= MIN_BUFFER_FRAMES);

  const isCancelledRef = useRef<boolean>(false);

  // Preload poster image immediately
  useEffect(() => {
    if (!globalPoster) {
      const poster = new Image();
      poster.onload = () => {
        globalPoster = poster;
      };
      poster.src = ASSET_PATHS.heroPoster;
    }
  }, []);

  const getFrame = useCallback((index: number): HTMLImageElement | null => {
    // 1. Direct hit in global cache
    const cached = globalFramesCache.get(index);
    if (cached && cached.complete && cached.naturalWidth > 0) {
      return cached;
    }

    // 2. Search outwards for nearest available cached frame
    for (let distance = 1; distance <= totalFrames; distance++) {
      const lower = index - distance;
      if (lower >= 1) {
        const lowerImg = globalFramesCache.get(lower);
        if (lowerImg && lowerImg.complete && lowerImg.naturalWidth > 0) {
          return lowerImg;
        }
      }
      const higher = index + distance;
      if (higher <= totalFrames) {
        const higherImg = globalFramesCache.get(higher);
        if (higherImg && higherImg.complete && higherImg.naturalWidth > 0) {
          return higherImg;
        }
      }
    }

    // 3. Fallback to poster
    return globalPoster;
  }, [totalFrames]);

  const startPreloading = useCallback(() => {
    if (isPreloadingInitiated && globalFramesCache.size >= totalFrames) {
      setLoadedCount(totalFrames);
      setIsReady(true);
      setIsBuffered(true);
      return;
    }

    isPreloadingInitiated = true;
    isCancelledRef.current = false;

    let inFlight = 0;
    const maxConcurrency = 8;
    let nextIndex = 1;
    let failed = 0;
    let lastStateUpdate = 0;

    const pump = () => {
      if (isCancelledRef.current) return;

      while (inFlight < maxConcurrency && nextIndex <= totalFrames) {
        const frameNumber = nextIndex++;

        // If already cached, count and continue
        if (globalFramesCache.has(frameNumber)) {
          if (globalFramesCache.size >= MIN_BUFFER_FRAMES) setIsBuffered(true);
          if (globalFramesCache.size >= totalFrames) {
            setLoadedCount(totalFrames);
            setIsReady(true);
            setIsBuffered(true);
          }
          continue;
        }

        inFlight++;
        const img = new Image();
        let handled = false;

        const handleDone = (success: boolean) => {
          if (handled || isCancelledRef.current) return;
          handled = true;
          inFlight--;

          if (success) {
            globalFramesCache.set(frameNumber, img);
          } else {
            failed++;
          }

          const currentCount = globalFramesCache.size;

          if (currentCount >= MIN_BUFFER_FRAMES) {
            setIsBuffered(true);
          }

          // Throttle React state updates
          const now = performance.now();
          if (now - lastStateUpdate > 40 || currentCount + failed >= totalFrames) {
            lastStateUpdate = now;
            setLoadedCount(currentCount);
            if (failed > 0) setFailedCount(failed);
          }

          if (currentCount + failed >= totalFrames) {
            setLoadedCount(currentCount);
            setIsReady(true);
            setIsBuffered(true);
          } else {
            pump();
          }
        };

        // CRITICAL: Attach onload and onerror BEFORE setting src
        img.onload = () => handleDone(true);
        img.onerror = () => handleDone(false);

        // Assign src
        img.src = ASSET_PATHS.frameTemplate(frameNumber);

        // Synchronous cache hit check
        if (img.complete && img.naturalWidth > 0) {
          handleDone(true);
        }
      }
    };

    pump();
  }, [totalFrames]);

  useEffect(() => {
    startPreloading();
    return () => {
      isCancelledRef.current = true;
    };
  }, [startPreloading]);

  return {
    loadedCount,
    totalFrames,
    isReady,
    isBuffered,
    failedCount,
    getFrame,
    startPreloading,
  };
}

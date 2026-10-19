import React, { useState } from 'react';
import { useTransformationSequence } from '../hooks/useTransformationSequence';
import { PosterOverlay } from '../components/PosterOverlay';
import { FullscreenLoader } from '../components/FullscreenLoader';
import { ScrollTransformationStage } from '../components/ScrollTransformationStage';
import { ComingSoonModal } from '../components/ComingSoonModal';

export const App: React.FC = () => {
  const [isPosterOpen, setIsPosterOpen] = useState<boolean>(false);
  const [activeModalTopic, setActiveModalTopic] = useState<string | null>(null);

  // Preloader hook for all 240 transformation frames
  const {
    loadedCount,
    totalFrames,
    isReady,
    isBuffered,
    failedCount,
    getFrame,
  } = useTransformationSequence();

  const handleOpenPoster = () => {
    setIsPosterOpen(true);
  };

  const handleClosePoster = () => {
    setIsPosterOpen(false);
  };

  const handleOpenModal = (topic: string) => {
    setActiveModalTopic(topic);
  };

  const handleCloseModal = () => {
    setActiveModalTopic(null);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#030712] text-slate-100">
      {/* 1. Full-screen Loading State (Displayed while initial frames buffer) */}
      {!isBuffered && (
        <FullscreenLoader
          loadedCount={loadedCount}
          totalFrames={totalFrames}
          failedCount={failedCount}
          isReady={isReady}
          isBuffered={isBuffered}
        />
      )}

      {/* 2. Primary Scroll-Driven Transformation Stage */}
      <ScrollTransformationStage
        getFrame={getFrame}
        totalFrames={totalFrames}
        onOpenPoster={handleOpenPoster}
        onOpenTopic={handleOpenModal}
      />

      {/* 3. Full-screen Poster Overlay (Triggered by button or navbar) */}
      {isPosterOpen && (
        <PosterOverlay
          onClose={handleClosePoster}
          subtitle="Click × to return to the transformation experience"
        />
      )}

      {/* 4. Modal for Coming Soon Navigation Links */}
      <ComingSoonModal
        topic={activeModalTopic || ''}
        isOpen={Boolean(activeModalTopic)}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default App;

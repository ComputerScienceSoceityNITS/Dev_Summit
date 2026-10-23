import { useEffect, useRef, useState } from "react";
import BackgroundVideo from "../components/homepage/BackgroundVideo.jsx";
import EventFacts from "../components/homepage/EventFacts.jsx";
import HeroSection from "../components/homepage/HeroSection.jsx";
import Header from "../components/homepage/Header.jsx";
import "./HomePage.css";

function HomePage() {
  const videoRef = useRef(null);
  const [isPaused, setIsPaused] = useState(true);
  const [videoError, setVideoError] = useState("");

  useEffect(() => {
    const video = videoRef.current;
    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    function syncMotionPreference() {
      if (motionPreference.matches) {
        video.pause();
        return;
      }

      video.play().catch(() => {
        setVideoError("Video autoplay is unavailable. Use play to start it.");
      });
    }

    syncMotionPreference();
    motionPreference.addEventListener("change", syncMotionPreference);

    return () => {
      motionPreference.removeEventListener("change", syncMotionPreference);
    };
  }, []);

  function toggleVideo() {
    const video = videoRef.current;
    setVideoError("");

    if (video.paused) {
      video.play().catch(() => {
        setVideoError("Video playback failed. Please try again.");
      });
    } else {
      video.pause();
    }
  }

  return (
    <div className="devfest-page">
      <BackgroundVideo
        videoRef={videoRef}
        onPlay={() => setIsPaused(false)}
        onPause={() => setIsPaused(true)}
        onError={() =>
          setVideoError("The background video could not be loaded.")
        }
      />
      <Header />
      <main className="devfest-main">
        <HeroSection
          isPaused={isPaused}
          videoError={videoError}
          onToggleVideo={toggleVideo}
        />
        <EventFacts />
      </main>
    </div>
  );
}

export default HomePage;

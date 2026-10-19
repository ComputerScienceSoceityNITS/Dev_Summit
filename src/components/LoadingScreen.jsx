import introVideo from "../assets/loading-screen-bg-video.mp4";
import "./LoadingScreen.css";

function LoadingScreen({ progress, onProgress, onComplete }) {
  return (
    <section className="loading-screen" aria-label="Loading">
      <video
        className="loading-screen__video"
        src={introVideo}
        autoPlay
        muted
        playsInline
        preload="auto"
        onTimeUpdate={onProgress}
        onEnded={onComplete}
        aria-hidden="true"
      />
      <div
        className="loading-screen__progress"
        role="progressbar"
        aria-label="Intro video progress"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={progress}
      >
        <span
          className="loading-screen__progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </section>
  );
}

export default LoadingScreen;

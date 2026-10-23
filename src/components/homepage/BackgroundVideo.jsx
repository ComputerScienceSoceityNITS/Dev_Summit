import summitVideo from "../../assets/loading-screen-bg-video.mp4";

function BackgroundVideo({ videoRef, onPlay, onPause, onError }) {
  return (
    <div className="devfest-background" aria-hidden="true">
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="auto"
        onPlay={onPlay}
        onPause={onPause}
        onError={onError}
      >
        <source src={summitVideo} type="video/mp4" />
      </video>
    </div>
  );
}

export default BackgroundVideo;

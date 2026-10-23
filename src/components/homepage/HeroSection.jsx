function HeroSection({ isPaused, videoError, onToggleVideo }) {
  return (
    <section className="devfest-hero" aria-labelledby="devfest-title">
      <h1 id="devfest-title">DEV SUMMIT 2026</h1>
      <div className="devfest-coming-soon" role="status">
        <span>COLLABORATION OF CSS x IEEE</span>
      </div>
      <p className="devfest-tagline">CODE. CREATE. TRANSFORM.</p>
      <p className="devfest-subtitle">
        Build the future <span aria-hidden="true">•</span> Cybertron Edition
      </p>
      <div className="devfest-actions">
        <a
          className="devfest-button devfest-button--solid"
          href="#"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="9" cy="9" r="1.6" />
            <path d="m21 15-5-5L5 21" />
          </svg>
          VIEW EVENT POSTER
        </a>
        <button
          className="devfest-button devfest-button--ghost"
          type="button"
          aria-pressed={isPaused}
          onClick={onToggleVideo}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            {isPaused ? (
              <path d="m6 4 14 8-14 8z" />
            ) : (
              <path d="M6 4v16M18 4v16" />
            )}
          </svg>
          {isPaused ? "PLAY VIDEO" : "PAUSE VIDEO"}
        </button>
      </div>
      <p className="devfest-video-error" aria-live="polite">
        {videoError}
      </p>
    </section>
  );
}

export default HeroSection;

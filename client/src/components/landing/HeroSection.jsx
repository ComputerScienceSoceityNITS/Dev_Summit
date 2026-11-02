import { LOGO_DIRECTORY, WHATSAPP_COMMUNITY_URL } from "./landingData.js";

export default function HeroSection() {
  return (
    <section className="hero" id="home">
      <video
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/assets/hero-poster.jpg"
        aria-hidden="true"
      >
        <source src="/assets/hero-bg.mp4" type="video/mp4" />
      </video>
      <div className="hero-overlay" />
      <div className="hero-content">
        <div className="eyebrow">
          <span className="pulse" /> COMPUTER SCIENCE SOCIETY, NIT SILCHAR
          PRESENTS <span className="eyebrow-line" />
        </div>
        <p className="hero-kicker">
          IDEAS COLLIDE. THE FUTURE TAKES SHAPE.
        </p>
        <h1>
          DEV<span className="title-outline">SUMMIT</span>
          <em>2026</em>
        </h1>
        <div className="hero-bottom">
          <div>
            <span className="phase-chip">
              PHASE 01 / THREE DAYS OF BUILDING
            </span>
            <p className="hero-description">
              A hands-on journey through code, systems and intelligent
              technology. Learn together. Build boldly. Make an impact.
            </p>
          </div>
          <div className="date-stamp">
            <span>EVENT DATES</span>
            <strong>04—06</strong>
            <b>NOVEMBER 2026</b>
          </div>
        </div>
        <div className="hero-cta">
          {/* Registration temporarily paused - WhatsApp community link active */}
          {/* <a className="reg-btn" href="#/register">
            Register now ↗
          </a> */}
          <a
            className="reg-btn"
            href={WHATSAPP_COMMUNITY_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            JOIN NOW ↗
          </a>
          <a className="reg-btn ghost" href="#/timeline">
            View timeline
          </a>
        </div>
        <div className="hero-partners">
          <span className="partner-label">
            ORGANISED BY COMPUTER SCIENCE SOCIETY, NIT SILCHAR
          </span>
          <div className="logo-row">
            <img
              className="plogo"
              src={LOGO_DIRECTORY + "css.png"}
              alt="Computer Science Society, NIT Silchar"
            />
          </div>
        </div>
      </div>
      <div className="hero-index">
        NITS / DEV SUMMIT 2026 <span>26° 45' N · 94° 12' E</span>
      </div>
    </section>
  );
}

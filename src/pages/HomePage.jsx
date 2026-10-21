import optimusPrime from "../assets/trans-1-cutout.png";
import bumblebee from "../assets/trans-2-cutout.png";
import summitLogo from "../assets/dev-summit-logo-cutout.png";
import "./HomePage.css";

const announcement = "COMING SOON";

function HomePage() {
  function moveRipple(event) {
    if (event.pointerType !== "mouse") return;

    event.currentTarget.classList.add("home-page--pointer-inside");
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--pointer-x", `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty("--pointer-y", `${event.clientY - bounds.top}px`);
  }

  function clearRipple(event) {
    event.currentTarget.classList.remove("home-page--pointer-inside");
  }

  return (
    <section
      className="home-page"
      onPointerMove={moveRipple}
      onPointerLeave={clearRipple}
      aria-label="Dev Summit 2026 coming soon"
    >
      <span className="home-page__kicker">DEV SUMMIT <span>/ 2026</span></span>

      <img
        className="home-page__character home-page__character--left"
        src={optimusPrime}
        alt=""
        aria-hidden="true"
      />
      <img
        className="home-page__character home-page__character--right"
        src={bumblebee}
        alt=""
        aria-hidden="true"
      />

      <div className="home-page__hero">
        <div className="home-page__logo-wrap">
          <span className="home-page__impact" aria-hidden="true" />
          <img className="home-page__logo" src={summitLogo} alt="Dev Summit 2026" />
        </div>
        <h1 className="home-page__title" aria-label={announcement}>
          {Array.from(announcement, (letter, index) => (
            <span
              className="home-page__letter"
              key={`${letter}-${index}`}
              aria-hidden="true"
              style={{ "--letter-index": index }}
            >
              {letter === " " ? "\u00a0" : letter}
            </span>
          ))}
        </h1>
        <p className="home-page__tagline">Ideas collide. The future takes shape.</p>
      </div>

      <span className="home-page__status"><span /> SOMETHING BIG IS ON THE HORIZON</span>
      <span className="home-page__coordinates" aria-hidden="true">BUILD / CONNECT / INSPIRE</span>
    </section>
  );
}

export default HomePage;

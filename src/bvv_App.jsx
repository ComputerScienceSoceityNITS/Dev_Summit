import { useState, useCallback } from "react";
import Loader from "./bvv_Loader.jsx";
import "./styles.css";

const days = [
  {
    day: "DAY 01",
    date: "04 NOV",
    title: "Build the foundation",
    items: [
      "Distinguished Lecture (DL) Talk in collaboration with IEEE",
      "Introduction to HTML and CSS",
    ],
  },
  {
    day: "DAY 02",
    date: "05 NOV",
    title: "Code your first ideas",
    items: [
      "Basic overview of JavaScript and React.js",
      "Introduction to Linux scripting",
      "Git and GitHub fundamentals",
    ],
  },
  {
    day: "DAY 03",
    date: "06 NOV",
    title: "Create impact",
    items: [
      "Morning · Outreach event at a nearby SEBA-affiliated school",
      "Later session · Machine Learning (ML) workshop",
    ],
  },
  {
    day: "DAY 04",
    date: "07 NOV",
    title: "Connect & celebrate",
    items: ["Closing ceremony", "Felicitation and concluding activities"],
  },
];
const wings = [
  {
    code: "ML",
    name: "Machine Learning Wing of CSS",
    detail:
      "Explore data, intelligent systems and the ideas powering modern AI.",
    num: "01",
  },
  {
    code: "DEV",
    name: "Development Wing of CSS",
    detail:
      "Turn ideas into working experiences with web technologies and developer tools.",
    num: "02",
  },
];
const outcomes = [
  "Build a strong foundation in web development",
  "Understand the tools developers use every day",
  "Get an introduction to Linux, Git and GitHub",
  "Explore machine learning through a practical workshop",
  "Connect with peers, mentors and the tech community",
];

const L = "/assets/logos/";
function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const done = useCallback(() => setLoading(false), []);
  return (
    <main>
      {loading && <Loader onDone={done} />}
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
        <nav className="nav">
          <a className="brand" href="#home" aria-label="Dev Summit home">
            <span className="brand-mark">
              D<span>/</span>S
            </span>
            <span className="brand-copy">
              DEV SUMMIT<small>2026 · PHASE 01</small>
            </span>
          </a>
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            {menuOpen ? "CLOSE −" : "MENU +"}
          </button>
          <div className={`nav-links ${menuOpen ? "open" : ""}`}>
            <a href="#timeline" onClick={() => setMenuOpen(false)}>
              Timeline
            </a>
            <a href="#wings" onClick={() => setMenuOpen(false)}>
              Wings
            </a>
            <a href="#workshops" onClick={() => setMenuOpen(false)}>
              Workshops
            </a>
            <a href="#partners" onClick={() => setMenuOpen(false)}>
              Partners
            </a>
            <a
              className="nav-cta"
              href="#timeline"
              onClick={() => setMenuOpen(false)}
            >
              Explore Phase 1 ↗
            </a>
          </div>
        </nav>
        <div className="hero-content">
          <div className="eyebrow">
            <span className="pulse" /> CSS × IEEE PRESENT{" "}
            <span className="eyebrow-line" />
          </div>
          <p className="hero-kicker">IDEAS COLLIDE. THE FUTURE TAKES SHAPE.</p>
          <h1>
            DEV<span className="title-outline">SUMMIT</span>
            <em>2026</em>
          </h1>
          <div className="hero-bottom">
            <div>
              <span className="phase-chip">
                PHASE 01 / FOUR DAYS OF BUILDING
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
          <div className="hero-partners">
            <span className="partner-label">IN COLLABORATION WITH</span>
            <div className="logo-row">
              <img
                className="plogo"
                src={L + "css.png"}
                alt="Computer Science Society, NIT Silchar"
              />
              <span className="partner-x">×</span>
              <img
                className="plogo ieee-mono"
                src={L + "ieee-silchar.png"}
                alt="IEEE Silchar Subsection"
              />
            </div>
          </div>
        </div>
        <div className="hero-index">
          NITS / DEV SUMMIT 2026 <span>26° 45' N · 94° 12' E</span>
        </div>
      </section>

      <section className="intro section-pad" id="overview">
        <div className="section-label">
          <span>01</span> / EVENT OVERVIEW
        </div>
        <div className="intro-grid">
          <h2>
            Four days.
            <br />
            <span>One big leap.</span>
          </h2>
          <div className="intro-copy">
            <p className="lead">
              Dev Summit 2026, in collaboration with IEEE, is a four-day event
              designed to bring technology closer to curious minds.
            </p>
            <p>
              Phase 1 runs from <strong>4 November to 6 November 2026</strong>,
              featuring a distinguished lecture, development workshops, a school
              outreach initiative and a closing ceremony. The next phase will
              take place in the following semester.
            </p>
            <div className="inline-tags">
              <span>LEARN</span>
              <span>BUILD</span>
              <span>CONNECT</span>
              <span>CONTRIBUTE</span>
            </div>
          </div>
        </div>
      </section>

      <section className="timeline section-pad" id="timeline">
        <div className="section-head">
          <div>
            <div className="section-label">
              <span>02</span> / THE ROADMAP
            </div>
            <h2>
              Phase 1 <span>timeline</span>
            </h2>
          </div>
          <p>
            Four days of ideas moving
            <br />
            from learning to impact.
          </p>
        </div>
        <div className="timeline-list">
          {days.map((item, i) => (
            <article className="timeline-item" key={item.day}>
              <div className="timeline-date">
                <span>{item.day}</span>
                <strong>{item.date}</strong>
              </div>
              <div className="timeline-marker">
                <i>{String(i + 1).padStart(2, "0")}</i>
              </div>
              <div className="timeline-content">
                <div className="timeline-top">
                  <h3>{item.title}</h3>
                  <span>
                    {i === 2
                      ? "OUTREACH + ML"
                      : i === 0
                        ? "KEYNOTE + WEB"
                        : i === 1
                          ? "DEV TOOLS"
                          : "WRAP-UP"}
                  </span>
                </div>
                <ul>
                  {item.items.map((x, j) => (
                    <li key={j}>{x}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="wings section-pad" id="wings">
        <div className="section-label">
          <span>03</span> / THE PEOPLE & THE PRACTICE
        </div>
        <div className="section-head wings-head">
          <h2>
            Two wings.
            <br />
            <span>Infinite possibilities.</span>
          </h2>
          <p>
            Pick up new skills, work through challenges and discover the kind of
            technology you want to create.
          </p>
        </div>
        <div className="wing-grid">
          {wings.map((w) => (
            <article className="wing-card" key={w.code}>
              <div className="wing-card-top">
                <span>CSS / WING {w.num}</span>
                <span className="wing-badge">
                  <img src={L + "css.png"} alt="Computer Science Society" />
                </span>
              </div>
              <div className="wing-code">{w.code}</div>
              <h3>{w.name}</h3>
              <p>{w.detail}</p>
              <div className="wing-card-bottom">
                <span>DEV SUMMIT 2026</span>
                <span>PHASE 01</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="workshops section-pad" id="workshops">
        <div className="section-label">
          <span>04</span> / WHY JOIN
        </div>
        <div className="workshop-grid">
          <div>
            <h2>
              Don’t just
              <br />
              <span>watch tech.</span>
              <br />
              Get hands-on.
            </h2>
            <p className="workshop-desc">
              Whether you’re writing your first line of HTML or exploring how
              models learn, Phase 1 gives you a practical place to start.
            </p>
            <a className="outline-button" href="#timeline">
              VIEW THE SCHEDULE <span>↗</span>
            </a>
          </div>
          <div className="benefits">
            <article>
              <span>01</span>
              <div>
                <h3>Learn by doing</h3>
                <p>
                  Build foundational skills in HTML, CSS and JavaScript with
                  guided sessions.
                </p>
              </div>
            </article>
            <article>
              <span>02</span>
              <div>
                <h3>Meet your tools</h3>
                <p>
                  Get comfortable with React, Linux scripting, Git and GitHub
                  workflows.
                </p>
              </div>
            </article>
            <article>
              <span>03</span>
              <div>
                <h3>Think beyond code</h3>
                <p>
                  Explore machine learning and take technology into the
                  community through outreach.
                </p>
              </div>
            </article>
            <article>
              <span>04</span>
              <div>
                <h3>Find your people</h3>
                <p>
                  Learn alongside fellow students, share ideas and grow your
                  network.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="outcomes section-pad">
        <div className="outcomes-title">
          <div className="section-label">
            <span>05</span> / TAKE IT WITH YOU
          </div>
          <h2>
            Leave with
            <br />
            <span>momentum.</span>
          </h2>
          <p>
            By the end of Phase 1, you’ll have a clearer path into the tech
            ecosystem and a toolkit to keep learning.
          </p>
        </div>
        <div className="outcomes-list">
          {outcomes.map((o, i) => (
            <div className="outcome-row" key={o}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <p>{o}</p>
              <b>↗</b>
            </div>
          ))}
        </div>
      </section>

      <section className="partners section-pad" id="partners">
        <div className="section-label">
          <span>06</span> / IN COLLABORATION WITH IEEE
        </div>
        <div className="partner-grid">
          {[
            ["ieee.svg", "IEEE"],
            ["ieee-silchar.png", "IEEE Silchar Subsection"],
            ["ieee-kolkata.png", "IEEE Kolkata Section"],
            ["ieee-cs.svg", "IEEE Computer Society"],
          ].map(([f, n]) => (
            <figure className="partner-card" key={f}>
              <img src={L + f} alt={n} loading="lazy" />
              <figcaption>{n}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="brand-mark">
              D<span>/</span>S
            </div>
            <div>
              <strong>DEV SUMMIT 2026</strong>
              <p>PHASE 01 · 04—06 NOVEMBER</p>
            </div>
            <img className="inst-logo" src={L + "nits.png"} alt="NIT Silchar" />
          </div>
          <a href="#home" className="back-top">
            BACK TO TOP ↑
          </a>
        </div>
        <div className="footer-logos">
          <img src={L + "css.png"} alt="Computer Science Society" />
          <img
            className="ieee-mono"
            src={L + "ieee-silchar.png"}
            alt="IEEE Silchar Subsection"
          />
        </div>
        <div className="footer-bottom">
          <span>CSS × IEEE · IN COLLABORATION</span>
          <span>BUILD / CONNECT / INSPIRE</span>
          <span>© 2026 DEV SUMMIT</span>
        </div>
      </footer>
    </main>
  );
}
export default App;

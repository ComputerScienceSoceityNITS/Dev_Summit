import { LOGO_DIRECTORY, wings } from "./landingData.js";

export default function WingsSection() {
  return (
    <section className="wings section-pad full" id="wings">
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
          Pick up new skills, work through challenges and discover the kind
          of technology you want to create.
        </p>
      </div>
      <div className="wing-grid">
        {wings.map((w) => (
          <article className="wing-card" key={w.code}>
            <div className="wing-card-top">
              <span>CSS / WING {w.num}</span>
              <span className="wing-badge">
                <img src={LOGO_DIRECTORY + "css.png"} alt="Computer Science Society" />
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
  );
}

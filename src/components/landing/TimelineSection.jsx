import { days } from "./landingData.js";

export default function TimelineSection({ listRef }) {
  return (
    <section className="timeline section-pad full" id="timeline">
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
      <div className="timeline-list" ref={listRef}>
        <div className="timeline-track">
          <i />
        </div>
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
                <span>{item.tag}</span>
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
  );
}

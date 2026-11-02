import { outcomes } from "./landingData.js";

export default function OutcomesSection() {
  return (
    <section className="outcomes section-pad full" id="outcomes">
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
  );
}

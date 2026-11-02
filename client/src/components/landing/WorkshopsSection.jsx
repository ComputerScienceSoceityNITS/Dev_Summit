export default function WorkshopsSection() {
  return (
    <section className="workshops section-pad full" id="workshops">
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
          <a className="outline-button" href="#/timeline">
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
                Scrape data, train a model, tune it and deploy it with
                Streamlit.
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
  );
}

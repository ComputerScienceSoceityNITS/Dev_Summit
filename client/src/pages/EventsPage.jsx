import { useEffect, useState } from "react";
import { api, fmtRange } from "../lib.js";

export default function EventsPage() {
  const [events, setEvents] = useState(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let live = true;
    api
      .events()
      .then((d) => live && setEvents(d.events))
      .catch(() => live && setFailed(true));
    return () => {
      live = false;
    };
  }, []);
  return (
    <section className="events-page section-pad full" id="events">
      <div className="section-label">
        <span>06</span> / EVENTS
      </div>
      <div className="section-head">
        <h2>
          Upcoming <span>events.</span>
        </h2>
        <p>Pick an event, register in under a minute and get ready to build.</p>
      </div>
      {failed ? (
        <p className="ev-note">
          We couldn’t load events right now. Please refresh the page.
        </p>
      ) : !events ? (
        <p className="ev-note">Loading events…</p>
      ) : events.length === 0 ? (
        <p className="ev-note">
          No events have been announced yet. Check back soon.
        </p>
      ) : (
        <div className="ev-grid">
          {events.map((e) => (
            <article className="ev-card" key={e.id}>
              <div className="ev-date">{fmtRange(e.startDate, e.endDate)}</div>
              <h3>{e.title}</h3>
              {e.description && <p>{e.description}</p>}
              <div className="ev-meta">
                {e.venue && <span>{e.venue}</span>}
                <span>
                  {e.spotsLeft == null
                    ? "Open to all"
                    : e.full
                      ? "Event full"
                      : e.spotsLeft + " seats left"}
                </span>
              </div>
              {e.open ? (
                <a className="reg-btn" href={"#/register/" + e.id}>
                  Register ↗
                </a>
              ) : (
                <span className="ev-closed">
                  {e.full ? "Event full" : "Registration closed"}
                </span>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}


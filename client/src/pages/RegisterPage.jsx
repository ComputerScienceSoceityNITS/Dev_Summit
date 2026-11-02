import { useEffect, useState } from "react";
import { api, fmtLong, fmtRange } from "../lib.js";

const experience = [
  "No experience",
  "Web development",
  "Machine learning (ML)",
  "Both Web and ML",
];
export default function RegisterPage({ eventId }) {
  const [events, setEvents] = useState(null);
  const [loadErr, setLoadErr] = useState(false);
  const [f, setF] = useState({
    eventId: eventId || "",
    name: "",
    scholarId: "",
    phone: "",
    experience: "",
    details: "",
    department: "",
  });
  const [st, setSt] = useState("idle");
  const [err, setErr] = useState("");
  useEffect(() => {
    let live = true;
    api
      .events()
      .then((d) => {
        if (!live) return;
        setEvents(d.events);
        setF((p) =>
          p.eventId && d.events.some((e) => e.id === p.eventId)
            ? p
            : { ...p, eventId: (d.events.find((e) => e.open) || {}).id || "" },
        );
      })
      .catch(() => {
        if (live) setLoadErr(true);
      });
    return () => {
      live = false;
    };
  }, []);
  const ev = events && events.find((e) => e.id === f.eventId);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    setSt("sending");
    setErr("");
    const { eventId: id, ...rest } = f;
    try {
      await api.register(id, {
        ...rest,
        details: f.experience === "No experience" ? "" : f.details,
      });
      setSt("done");
    } catch (x) {
      setErr(x.message);
      setSt("error");
    }
  };
  const info = (
    <div className="reg-info">
      <div className="section-label">
        <span>→</span> / REGISTRATION
      </div>
      <h2>
        Reserve
        <br />
        <span>your seat.</span>
      </h2>
      {ev ? (
        <>
          <p>{ev.description || ev.title}</p>
          <ul>
            <li>{fmtRange(ev.startDate, ev.endDate)}</li>
            {ev.venue && <li>{ev.venue}</li>}
            <li>
              {ev.spotsLeft == null
                ? "Open to all students"
                : ev.spotsLeft + " seats left"}
            </li>
          </ul>
        </>
      ) : (
        <p>
          Register to take part in Dev Summit 2026. Open to students who want to
          learn, build and connect.
        </p>
      )}
    </div>
  );
  if (loadErr || (events && events.length === 0))
    return (
      <section className="register section-pad full">
        {info}
        <div className="reg-card reg-done">
          <h3>{loadErr ? "Can’t load events" : "No events yet"}</h3>
          <p>
            {loadErr
              ? "We couldn’t reach the server. Please refresh the page or try again in a moment."
              : "Registration will open soon. Check back shortly."}
          </p>
        </div>
      </section>
    );
  if (!events)
    return (
      <section className="register section-pad full">
        {info}
        <div className="reg-card reg-done">
          <p>Loading…</p>
        </div>
      </section>
    );
  return (
    <section className="register section-pad full">
      {info}
      {st === "done" ? (
        <div className="reg-card reg-done">
          <h3>You’re registered.</h3>
          <p>
            Thanks, {f.name.split(" ")[0] || "there"}! Your registration for{" "}
            {ev ? ev.title : "the event"} is confirmed for Scholar ID{" "}
            <strong>{f.scholarId}</strong>. See you on{" "}
            {ev ? fmtLong(ev.startDate) : "the day"}.
          </p>
          <a className="reg-btn" href="#/timeline">
            View the schedule
          </a>
        </div>
      ) : (
        <form className="reg-card" onSubmit={submit}>
          <div className="reg-grid">
            <label className="wide">
              <span>Event</span>
              <select required value={f.eventId} onChange={set("eventId")}>
                {events.map((x) => (
                  <option key={x.id} value={x.id} disabled={!x.open}>
                    {x.title}
                    {x.open
                      ? ""
                      : x.full
                        ? " (full)"
                        : " (registration closed)"}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Name</span>
              <input
                required
                type="text"
                autoComplete="name"
                value={f.name}
                onChange={set("name")}
              />
            </label>
            <label>
              <span>Scholar ID</span>
              <input
                required
                type="text"
                value={f.scholarId}
                onChange={set("scholarId")}
              />
            </label>
            <label>
              <span>Phone number</span>
              <input
                required
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                pattern="[0-9+\- ]{10,15}"
                title="Enter a valid phone number"
                value={f.phone}
                onChange={set("phone")}
              />
            </label>
            <label>
              <span>Experience in Web / ML</span>
              <select
                required
                value={f.experience}
                onChange={set("experience")}
              >
                <option value="">Select…</option>
                {experience.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            {f.experience && f.experience !== "No experience" && (
              <label className="wide">
                <span>
                  Tell us about your{" "}
                  {f.experience === "Both Web and ML"
                    ? "Web and ML"
                    : f.experience === "Machine learning (ML)"
                      ? "ML"
                      : "Web"}{" "}
                  experience
                </span>
                <textarea
                  rows="4"
                  maxLength={500}
                  value={f.details}
                  onChange={set("details")}
                  placeholder="Projects, courses, tools or languages you have worked with…"
                />
              </label>
            )}
            <label className="wide">
              <span>Department</span>
              <input
                required
                type="text"
                value={f.department}
                onChange={set("department")}
              />
            </label>
          </div>
          {st === "error" && (
            <p className="reg-err">
              {err || "Something went wrong. Please try again."}
            </p>
          )}
          <button
            className="reg-btn"
            type="submit"
            disabled={st === "sending" || !ev || !ev.open}
          >
            {st === "sending" ? "Submitting…" : "Register for this event"}
          </button>
        </form>
      )}
    </section>
  );
}


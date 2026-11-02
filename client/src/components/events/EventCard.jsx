function formatEventDate(value) {
  if (!value) return "";

  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T00:00:00`)
    : new Date(value);

  return Number.isNaN(parsed.getTime())
    ? value
    : parsed.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
}

export default function EventCard({
  event,
  user,
  authLoading,
  managing,
  registering,
  registered,
  onRegister,
  onDelete,
  onViewRegistrations,
  onExportRegistrations,
}) {
  const isOpen = event.registrationStatus === "open";
  const eventId = event._id;
  const statusLabel = event.registrationStatus || "status unavailable";

  return (
    <article className="ev-card" key={eventId}>
      <div className="ev-date">
        {formatEventDate(event.date) || "DATE TO BE ANNOUNCED"}
      </div>
      <h3>{event.title}</h3>
      {event.description && <p>{event.description}</p>}
      <div className="ev-meta">
        <span>{event.wing}</span>
        {event.time && <span>{event.time}</span>}
        {event.venue && <span>{event.venue}</span>}
        <span className={`ev-status ${isOpen ? "open" : ""}`}>
          {statusLabel}
        </span>
      </div>
      {isOpen && user ? (
        <button
          className="reg-btn"
          type="button"
          disabled={registering || registered || authLoading}
          onClick={() => onRegister(event)}
        >
          {registering
            ? "Registering…"
            : registered
              ? "Registered ✓"
              : "Register ↗"}
        </button>
      ) : isOpen ? (
        <a className="reg-btn" href={`#/register/${eventId}`}>
          Register ↗
        </a>
      ) : (
        <button className="reg-btn" type="button" disabled>
          Register ↗
        </button>
      )}
      {managing && (
        <div className="ev-admin-actions">
          <button
            className="adm-btn"
            type="button"
            onClick={() => onViewRegistrations(event)}
          >
            View registrations
          </button>
          <button
            className="adm-btn"
            type="button"
            onClick={() => onExportRegistrations(event)}
          >
            Export CSV
          </button>
          <button
            className="adm-btn danger-outline"
            type="button"
            onClick={() => onDelete(event)}
          >
            Delete event
          </button>
        </div>
      )}
    </article>
  );
}

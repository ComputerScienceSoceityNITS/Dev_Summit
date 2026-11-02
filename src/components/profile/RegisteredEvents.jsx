import { formatEventDate } from "../../utils/formatters.js";

function RegisteredEventCard({ registration }) {
  const { event } = registration;

  return (
    <article className="profile-event">
      <div className="profile-event-date">
        {formatEventDate(event.date) || "DATE TO BE ANNOUNCED"}
      </div>
      <h4>{event.title}</h4>
      {event.description && <p>{event.description}</p>}
      <div className="profile-event-meta">
        {event.wing && <span>{event.wing}</span>}
        {event.time && <span>{event.time}</span>}
        {event.venue && <span>{event.venue}</span>}
      </div>
    </article>
  );
}

export default function RegisteredEvents({
  error,
  loading,
  onRetry,
  registrations,
}) {
  return (
    <section
      className="profile-panel"
      aria-labelledby="registered-events-title"
    >
      <div className="profile-panel-heading">
        <h3 id="registered-events-title">Your registered events</h3>
        <span>{registrations.length}</span>
      </div>

      {loading ? (
        <p className="profile-message" role="status">
          Loading your registrations…
        </p>
      ) : error ? (
        <p className="profile-message" role="alert">
          {error}{" "}
          <button className="adm-link" type="button" onClick={onRetry}>
            Retry
          </button>
        </p>
      ) : registrations.length === 0 ? (
        <p className="profile-message">
          You haven’t registered for any events yet.{" "}
          <a href="#/events">Explore events</a>
        </p>
      ) : (
        <div className="profile-event-list">
          {registrations.map((registration) => (
            <RegisteredEventCard
              key={registration.id}
              registration={registration}
            />
          ))}
        </div>
      )}
    </section>
  );
}

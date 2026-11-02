export default function RegisterInfo({
  event,
  eventError,
  isRegisteringForEvent,
}) {
  return (
    <div className="reg-info">
      <div className="section-label">
        <span>→</span> / {isRegisteringForEvent ? "EVENT REGISTRATION" : "SIGN IN"}
      </div>
      <h2>
        {isRegisteringForEvent ? (
          <>
            Reserve
            <br />
            <span>your seat.</span>
          </>
        ) : (
          <>
            Sign in to
            <br />
            <span>Dev Summit.</span>
          </>
        )}
      </h2>
      {event ? (
        <>
          <p>{event.description || event.title}</p>
          <ul>
            <li>{event.title}</li>
            {event.date && <li>{event.date}</li>}
            {event.time && <li>{event.time}</li>}
            {event.venue && <li>{event.venue}</li>}
          </ul>
        </>
      ) : (
        <p>
          Continue securely with your Google account to access your profile and
          register for Dev Summit events.
        </p>
      )}
      {eventError && <p className="reg-err">{eventError}</p>}
    </div>
  );
}

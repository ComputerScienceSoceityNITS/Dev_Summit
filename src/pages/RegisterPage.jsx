import GoogleSignInButton from "../components/register/GoogleSignInButton.jsx";
import RegisterInfo from "../components/register/RegisterInfo.jsx";
import RegisterStatus from "../components/register/RegisterStatus.jsx";
import useRegisterPage from "../hooks/useRegisterPage.js";

export default function RegisterPage({ eventId }) {
  const {
    authLoading,
    busy,
    error,
    event,
    eventError,
    handleGoogleCredential,
    message,
    user,
    retryRegistration,
  } = useRegisterPage(eventId);

  const isRegisteringForEvent = Boolean(eventId);

  return (
    <section className="register section-pad full">
      <RegisterInfo
        event={event}
        eventError={eventError}
        isRegisteringForEvent={isRegisteringForEvent}
      />

      {authLoading || (isRegisteringForEvent && user && busy) ? (
        <RegisterStatus
          message={
            isRegisteringForEvent
              ? "Registering your account…"
              : "Checking your account…"
          }
        />
      ) : message ? (
        <RegisterStatus
          title={isRegisteringForEvent ? "You’re in." : "Welcome."}
          message={message}
          actionHref="#/events"
          actionLabel="Explore events"
        />
      ) : user && isRegisteringForEvent ? (
        <RegisterStatus
          title="Registration incomplete."
          error={error}
          actionLabel={busy ? "Registering…" : "Try registration again"}
          actionDisabled={busy || event?.registrationStatus !== "open"}
          onAction={retryRegistration}
        />
      ) : user ? (
        <RegisterStatus
          title="You’re signed in."
          message={
            <>
              Signed in as <strong>{user.email}</strong>. You can now register
              for events with one click.
            </>
          }
          actionHref="#/events"
          actionLabel="Explore events"
        />
      ) : (
        <div className="reg-card google-signin-card">
          <div className="google-signin-heading">
            <span className="section-label">SECURE ACCOUNT ACCESS</span>
            <h3>One account. Every event.</h3>
            <p>
              Use your verified NIT Silchar Google account to sign in or create
              your Dev Summit profile.
            </p>
          </div>
          <GoogleSignInButton
            disabled={busy}
            onCredential={handleGoogleCredential}
          />
          {error && (
            <p className="reg-err" role="alert">
              {error}
            </p>
          )}
          {eventId && (
            <p className="google-signin-footnote">
              Continue with Google to reserve your place in this event.
            </p>
          )}
        </div>
      )}
    </section>
  );
}

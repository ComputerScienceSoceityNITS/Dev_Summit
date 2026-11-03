import { useState } from "react";
import GoogleSignInButton from "../components/register/GoogleSignInButton.jsx";
import RegisterInfo from "../components/register/RegisterInfo.jsx";
import RegisterStatus from "../components/register/RegisterStatus.jsx";
import useRegisterPage from "../hooks/useRegisterPage.js";
import { WHATSAPP_COMMUNITY_URL } from "../components/landing/landingData.js";

export default function RegisterPage({ eventId }) {
  const [hasJoinedCommunity, setHasJoinedCommunity] = useState(false);
  const [stepError, setStepError] = useState("");

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

  const handleJoinClick = () => {
    setHasJoinedCommunity(true);
    setStepError("");
  };

  const handleCredentialAttempt = (credential) => {
    if (isRegisteringForEvent && !hasJoinedCommunity) {
      setStepError(
        "Please join the WhatsApp community first to proceed with event registration.",
      );
      return;
    }
    setStepError("");
    handleGoogleCredential(credential);
  };

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
          secondaryActionHref={isRegisteringForEvent ? WHATSAPP_COMMUNITY_URL : undefined}
          secondaryActionLabel={isRegisteringForEvent ? "Community group ↗" : undefined}
          secondaryActionExternal={true}
        />
      ) : user && isRegisteringForEvent ? (
        <RegisterStatus
          title="Registration incomplete."
          error={error}
          actionLabel={busy ? "Registering…" : "Try registration again"}
          actionDisabled={busy || event?.registrationStatus !== "open"}
          onAction={retryRegistration}
          secondaryActionHref={WHATSAPP_COMMUNITY_URL}
          secondaryActionLabel="Join community ↗"
          secondaryActionExternal={true}
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

          {isRegisteringForEvent && (
            <div className="reg-mandatory-box">
              <div className="reg-mandatory-title">Step 1 - Join Community</div>
              <a
                className={`reg-btn reg-join-btn ${hasJoinedCommunity ? "joined" : ""}`}
                href={WHATSAPP_COMMUNITY_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleJoinClick}
              >
                {hasJoinedCommunity ? "Joined community ✓" : "Join WhatsApp Community ↗"}
              </a>
              <label className="reg-mandatory-check">
                <input
                  type="checkbox"
                  checked={hasJoinedCommunity}
                  onChange={(e) => {
                    setHasJoinedCommunity(e.target.checked);
                    if (e.target.checked) setStepError("");
                  }}
                />
                <span>I have joined the Dev Summit WhatsApp community (Required)</span>
              </label>
            </div>
          )}

          <div style={{ marginTop: isRegisteringForEvent ? "24px" : "0" }}>
            {isRegisteringForEvent && (
              <div
                style={{
                  fontSize: "12px",
                  fontFamily: "'DM Mono', monospace",
                  letterSpacing: "1px",
                  fontWeight: 700,
                  color: "#687386",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                }}
              >
                Step 2 - Verify Account & Register
              </div>
            )}
            <GoogleSignInButton
              disabled={busy}
              onCredential={handleCredentialAttempt}
            />
          </div>

          {(stepError || error) && (
            <p className="reg-err" role="alert">
              {stepError || error}
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

import { useState } from "react";
import GoogleSignInButton from "../components/register/GoogleSignInButton.jsx";
import RegisterInfo from "../components/register/RegisterInfo.jsx";
import RegisterStatus from "../components/register/RegisterStatus.jsx";
import useRegisterPage from "../hooks/useRegisterPage.js";
import { WHATSAPP_COMMUNITY_URL } from "../components/landing/landingData.js";

export default function RegisterPage({ eventId }) {
  const [hasJoinedCommunity, setHasJoinedCommunity] = useState(false);
  const [scholarId, setScholarId] = useState("");
  const [stepError, setStepError] = useState("");

  const {
    authLoading,
    busy,
    error,
    event,
    eventError,
    handleGoogleCredential,
    message,
    registerForSelectedEvent,
    retryRegistration,
    user,
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
    if (!scholarId.trim()) {
      setStepError("Please enter your Scholar ID to proceed.");
      return;
    }
    setStepError("");
    handleGoogleCredential(credential, scholarId.trim());
  };

  const handleLoggedInRegister = (e) => {
    e.preventDefault();
    const effectiveScholarId = scholarId.trim() || user?.scholarId;
    if (!effectiveScholarId) {
      setStepError("Please enter your Scholar ID to complete registration.");
      return;
    }
    setStepError("");
    registerForSelectedEvent(effectiveScholarId).catch((err) => {
      setStepError(err.message);
    });
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
      ) : user && isRegisteringForEvent && !user.scholarId ? (
        <div className="reg-card google-signin-card">
          <div className="google-signin-heading">
            <span className="section-label">ONE LAST STEP</span>
            <h3>Enter Your Scholar ID</h3>
            <p>
              Signed in as <strong>{user.email}</strong>. Please provide your Scholar ID to complete registration for {event?.title || "this event"}.
            </p>
          </div>
          <form onSubmit={handleLoggedInRegister} style={{ marginTop: "20px" }}>
            <div className="reg-scholar-box">
              <label htmlFor="scholarId-input-logged" className="reg-scholar-label">
                Scholar ID <span>*</span>
              </label>
              <input
                id="scholarId-input-logged"
                type="text"
                className="reg-scholar-input"
                placeholder="e.g. 2312001"
                value={scholarId}
                onChange={(e) => {
                  setScholarId(e.target.value);
                  if (e.target.value.trim()) setStepError("");
                }}
                disabled={busy}
                autoFocus
              />
            </div>
            {(stepError || error) && (
              <p className="reg-err" role="alert">
                {stepError || error}
              </p>
            )}
            <button
              className="reg-btn"
              type="submit"
              disabled={busy || !scholarId.trim() || event?.registrationStatus !== "open"}
              style={{ marginTop: "20px" }}
            >
              {busy ? "Registering…" : "Confirm Event Registration ↗"}
            </button>
          </form>
        </div>
      ) : user && isRegisteringForEvent ? (
        <RegisterStatus
          title="Registration incomplete."
          error={error}
          actionLabel={busy ? "Registering…" : "Try registration again"}
          actionDisabled={busy || event?.registrationStatus !== "open"}
          onAction={() => retryRegistration(user.scholarId)}
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

          <div className="reg-scholar-box">
            <label htmlFor="scholarId-input" className="reg-scholar-label">
              {isRegisteringForEvent ? "Step 2 - Scholar ID" : "Scholar ID"} <span>*</span>
            </label>
            <input
              id="scholarId-input"
              type="text"
              className="reg-scholar-input"
              placeholder="e.g. 2312001"
              value={scholarId}
              onChange={(e) => {
                setScholarId(e.target.value);
                if (e.target.value.trim()) setStepError("");
              }}
              disabled={busy}
            />
          </div>

          <div style={{ marginTop: "24px" }}>
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
              {isRegisteringForEvent ? "Step 3 - Verify Account & Register" : "Sign In With Institute Account"}
            </div>
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

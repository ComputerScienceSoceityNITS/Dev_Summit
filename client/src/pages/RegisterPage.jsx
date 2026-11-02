import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../services/api.js";

const initialForm = {
  name: "",
  email: "",
  password: "",
  scholarId: "",
};

export default function RegisterPage({ eventId }) {
  const { user, loading: authLoading, signIn } = useAuth();
  const [mode, setMode] = useState("signup");
  const [form, setForm] = useState(initialForm);
  const [event, setEvent] = useState(null);
  const [eventError, setEventError] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const attemptedEventRef = useRef("");

  useEffect(() => {
    if (!eventId) return undefined;

    let active = true;
    api
      .events()
      .then(({ events }) => {
        if (active) {
          setEvent(events.find((item) => item._id === eventId) || null);
        }
      })
      .catch((requestError) => {
        if (active) setEventError(requestError.message);
      });

    return () => {
      active = false;
    };
  }, [eventId]);

  useEffect(() => {
    if (
      authLoading ||
      !user ||
      !eventId ||
      attemptedEventRef.current === eventId
    ) {
      return;
    }

    attemptedEventRef.current = eventId;
    setBusy(true);
    setError("");

    api
      .registerForEvent(eventId)
      .then(() =>
        setMessage(`You’re registered for ${event?.title || "the event"}.`),
      )
      .catch((requestError) => setError(requestError.message))
      .finally(() => setBusy(false));
  }, [authLoading, eventId, event?.title, user]);

  const updateField = (field) => (changeEvent) => {
    setForm((current) => ({ ...current, [field]: changeEvent.target.value }));
  };

  const submit = async (submitEvent) => {
    submitEvent.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");

    try {
      const result =
        mode === "signup"
          ? await api.signup(form)
          : await api.login({
              email: form.email,
              password: form.password,
            });

      signIn(result.user);

      if (eventId) {
        attemptedEventRef.current = eventId;
        await api.registerForEvent(eventId);
        setMessage(`You’re registered for ${event?.title || "the event"}.`);
      } else {
        setMessage(
          mode === "signup"
            ? "Your account has been created."
            : "You’re signed in.",
        );
      }
    } catch (requestError) {
      setError(
        requestError.message ||
          requestError.errors?.[0]?.message ||
          "Unable to complete your request. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  const selectMode = (nextMode) => {
    setMode(nextMode);
    setError("");
    setMessage("");
  };

  const info = (
    <div className="reg-info">
      <div className="section-label">
        <span>→</span> / {eventId ? "EVENT REGISTRATION" : "YOUR ACCOUNT"}
      </div>
      <h2>
        {eventId ? (
          <>
            Reserve
            <br />
            <span>your seat.</span>
          </>
        ) : (
          <>
            Join the
            <br />
            <span>summit.</span>
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
          Create an account to register for Dev Summit events. New accounts
          start with the standard user role.
        </p>
      )}
      {eventError && <p className="reg-err">{eventError}</p>}
    </div>
  );

  if (authLoading || (eventId && user && busy)) {
    return (
      <section className="register section-pad full">
        {info}
        <div className="reg-card reg-done">
          <p>
            {eventId ? "Registering your account…" : "Checking your account…"}
          </p>
        </div>
      </section>
    );
  }

  if (message) {
    return (
      <section className="register section-pad full">
        {info}
        <div className="reg-card reg-done">
          <h3>{eventId ? "You’re in." : "Welcome."}</h3>
          <p>{message}</p>
          <a className="reg-btn" href="#/events">
            Explore events
          </a>
        </div>
      </section>
    );
  }

  if (user && eventId) {
    return (
      <section className="register section-pad full">
        {info}
        <div className="reg-card reg-done">
          <h3>Registration incomplete.</h3>
          {error && (
            <p className="reg-err" role="alert">
              {error}
            </p>
          )}
          <button
            className="reg-btn"
            type="button"
            disabled={busy || event?.registrationStatus !== "open"}
            onClick={async () => {
              setBusy(true);
              setError("");
              try {
                await api.registerForEvent(eventId);
                setMessage(
                  `You’re registered for ${event?.title || "the event"}.`,
                );
              } catch (requestError) {
                setError(requestError.message);
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? "Registering…" : "Try registration again"}
          </button>
        </div>
      </section>
    );
  }

  if (user) {
    return (
      <section className="register section-pad full">
        {info}
        <div className="reg-card reg-done">
          <h3>You’re signed in.</h3>
          <p>
            Signed in as <strong>{user.email}</strong>. You can now register for
            events with one click.
          </p>
          <a className="reg-btn" href="#/events">
            Explore events
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="register section-pad full">
      {info}
      <form className="reg-card" onSubmit={submit}>
        <div className="reg-grid">
          {mode === "signup" && (
            <>
              <label className="wide">
                <span>Name</span>
                <input
                  required
                  type="text"
                  autoComplete="name"
                  minLength={2}
                  maxLength={100}
                  value={form.name}
                  onChange={updateField("name")}
                />
              </label>
              <label className="wide">
                <span>Scholar ID</span>
                <input
                  required
                  type="text"
                  autoComplete="off"
                  value={form.scholarId}
                  onChange={updateField("scholarId")}
                />
              </label>
            </>
          )}
          <label className="wide">
            <span>Email address</span>
            <input
              required
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={updateField("email")}
            />
          </label>
          <label className="wide">
            <span>Password</span>
            <input
              required
              type="password"
              autoComplete={
                mode === "signup" ? "new-password" : "current-password"
              }
              minLength={6}
              value={form.password}
              onChange={updateField("password")}
            />
          </label>
        </div>
        {error && (
          <p className="reg-err" role="alert">
            {error}
          </p>
        )}
        <button className="reg-btn" type="submit" disabled={busy}>
          {busy
            ? mode === "signup"
              ? "Creating account…"
              : "Signing in…"
            : mode === "signup"
              ? eventId
                ? "Create account & register"
                : "Create account"
              : eventId
                ? "Sign in & register"
                : "Sign in"}
        </button>
        <p className="reg-switch">
          {mode === "signup"
            ? "Already have an account?"
            : "New to Dev Summit?"}{" "}
          <button
            type="button"
            onClick={() => selectMode(mode === "signup" ? "login" : "signup")}
          >
            {mode === "signup" ? "Sign in" : "Create an account"}
          </button>
        </p>
      </form>
    </section>
  );
}

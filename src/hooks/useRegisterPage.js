import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../services/api.js";

export default function useRegisterPage(eventId) {
  const { user, loading: authLoading, signIn, refreshUser } = useAuth();
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

  const registerForSelectedEvent = useCallback(async (customScholarId) => {
    try {
      await api.registerForEvent(eventId, customScholarId);
      if (customScholarId && refreshUser) {
        await refreshUser().catch(() => {});
      }
      setMessage(`You’re registered for ${event?.title || "the event"}.`);
    } catch (requestError) {
      if (requestError.status === 409) {
        setMessage(requestError.message);
        return;
      }
      throw requestError;
    }
  }, [event?.title, eventId, refreshUser]);

  useEffect(() => {
    if (
      authLoading ||
      !user ||
      !eventId ||
      attemptedEventRef.current === eventId
    ) {
      return;
    }

    // If signed-in user does not yet have a scholar ID, do not auto-register.
    // Prompt for scholar ID first.
    if (!user.scholarId) {
      return;
    }

    attemptedEventRef.current = eventId;
    setBusy(true);
    setError("");

    registerForSelectedEvent()
      .catch((requestError) => setError(requestError.message))
      .finally(() => setBusy(false));
  }, [authLoading, eventId, registerForSelectedEvent, user]);

  const handleGoogleCredential = useCallback(
    async (credential, scholarId) => {
      setBusy(true);
      setError("");
      setMessage("");

      try {
        const result = await api.googleSignIn(credential);
        let currentUser = result.user;

        // If a scholar ID was provided and the user account doesn't have one, update it
        if (scholarId && (!currentUser.scholarId || !currentUser.scholarId.trim())) {
          try {
            const updated = await api.updateProfile({ scholarId });
            currentUser = updated.user;
          } catch {
            // Non-blocking if registration API also accepts scholarId
          }
        }

        signIn(currentUser);

        if (eventId) {
          attemptedEventRef.current = eventId;
          await registerForSelectedEvent(scholarId);
        } else {
          setMessage("You’re signed in with Google.");
        }
      } catch (requestError) {
        setError(
          requestError.message ||
            "Unable to sign in with Google. Please try again.",
        );
      } finally {
        setBusy(false);
      }
    },
    [eventId, registerForSelectedEvent, signIn],
  );

  const retryRegistration = async (scholarId) => {
    setBusy(true);
    setError("");

    try {
      await registerForSelectedEvent(scholarId);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  return {
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
  };
}

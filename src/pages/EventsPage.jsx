import { useCallback, useEffect, useState } from "react";
import EventCard from "../components/events/EventCard.jsx";
import useEventManagement from "../hooks/useEventManagement.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../services/api.js";

export default function EventsPage() {
  const { user, loading: authLoading, refreshUser } = useAuth();
  const [events, setEvents] = useState(null);
  const [loadingError, setLoadingError] = useState("");
  const [actionError, setActionError] = useState("");
  const [notice, setNotice] = useState("");
  const [registeringId, setRegisteringId] = useState("");
  const [registeredIds, setRegisteredIds] = useState(() => new Set());
  const [exportingId, setExportingId] = useState("");
  const [managing, setManaging] = useState(false);

  const loadEvents = useCallback(async () => {
    setLoadingError("");
    try {
      const { events: eventList } = await api.events();
      setEvents(eventList);
    } catch (requestError) {
      setLoadingError(requestError.message);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  useEffect(() => {
    let active = true;

    if (!user) {
      setRegisteredIds(new Set());
      return () => {
        active = false;
      };
    }

    api
      .myRegistrations()
      .then(({ registrations }) => {
        if (active) {
          setRegisteredIds(
            new Set(registrations.map((registration) => registration.event.id)),
          );
        }
      })
      .catch((requestError) => {
        if (active) setActionError(requestError.message);
      });

    return () => {
      active = false;
    };
  }, [user]);

  useEffect(() => {
    if (user?.role !== "admin") setManaging(false);
  }, [user]);

  const handleAdminError = useCallback(
    async (requestError) => {
      setActionError(requestError.message);
      if (requestError.status === 401 || requestError.status === 403) {
        try {
          await refreshUser();
        } catch {
          // The original admin action error remains visible in the Events section.
        }
      }
    },
    [refreshUser],
  );

  const handleRegistration = async (event) => {
    setRegisteringId(event._id);
    setActionError("");
    setNotice("");

    try {
      await api.registerForEvent(event._id);
      setRegisteredIds((current) => new Set(current).add(event._id));
      setNotice(`You’re registered for ${event.title}.`);
    } catch (requestError) {
      if (requestError.status === 409) {
        setRegisteredIds((current) => new Set(current).add(event._id));
        setNotice(requestError.message);
      } else {
        setActionError(requestError.message);
      }
      if (requestError.status === 401 || requestError.status === 403) {
        try {
          await refreshUser();
        } catch {
          // The registration error remains visible to the user.
        }
      }
    } finally {
      setRegisteringId("");
    }
  };

  const handleCreated = (event) => {
    setEvents((current) =>
      [...(current || []), event].sort((a, b) =>
        (a.date || "").localeCompare(b.date || ""),
      ),
    );
    setNotice("Event created.");
    setActionError("");
  };

  const handleDeleted = (event) => {
    setEvents((current) =>
      (current || []).filter((item) => item._id !== event._id),
    );
    setNotice("Event and its registrations deleted.");
    setActionError("");
  };

  const management = useEventManagement({
    onCreated: handleCreated,
    onDeleted: handleDeleted,
    onError: handleAdminError,
    onExporting: setExportingId,
  });

  const isAdmin = user?.role === "admin";
  const showManagement = isAdmin && managing;

  return (
    <section className="events-page section-pad full" id="events">
      <div className="section-label">
        <span>06</span> / EVENTS
      </div>
      <div className="section-head">
        <h2>
          Upcoming <span>events.</span>
        </h2>
        <p>Explore upcoming sessions and join the Dev Summit WhatsApp community to participate.</p>
      </div>

      {isAdmin && (
        <div className="ev-admin-toolbar">
          <button
            className="reg-btn"
            type="button"
            onClick={() => setManaging((current) => !current)}
          >
            {showManagement ? "Close event controls" : "Manage events"}
          </button>
          {showManagement && (
            <button
              className="adm-btn solid"
              type="button"
              onClick={management.onAddEvent}
            >
              + Add event
            </button>
          )}
        </div>
      )}

      {actionError && (
        <p className="ev-note" role="alert">
          {actionError}
        </p>
      )}
      {notice && (
        <p className="ev-note" role="status">
          {notice}
        </p>
      )}

      {loadingError ? (
        <p className="ev-note" role="alert">
          {loadingError}{" "}
          <button className="adm-link" type="button" onClick={loadEvents}>
            Retry
          </button>
        </p>
      ) : events === null ? (
        <p className="ev-note">Loading events…</p>
      ) : events.length === 0 ? (
        <p className="ev-note">No events have been announced yet. Check back soon.</p>
      ) : (
        <div className="ev-grid">
          {events.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              user={user}
              authLoading={authLoading}
              managing={showManagement}
              registering={registeringId === event._id}
              registered={registeredIds.has(event._id)}
              onRegister={handleRegistration}
              onDelete={management.onDeleteEvent}
              onViewRegistrations={management.onViewRegistrations}
              onExportRegistrations={management.onExportRegistrations}
            />
          ))}
        </div>
      )}

      {exportingId && (
        <p className="ev-note" role="status">
          Preparing registrations CSV…
        </p>
      )}
      {management.modal}
    </section>
  );
}

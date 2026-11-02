import { useEffect, useState } from "react";
import { wings } from "../components/landing/landingData.js";
import { api } from "../services/api.js";
import { fmtStamp } from "../utils/formatters.js";
import "../admin.css";

const initialEvent = {
  title: "",
  description: "",
  wing: wings[0].name,
  date: "",
  time: "",
  venue: "",
  registrationStatus: "open",
};

function Modal({ title, onClose, children }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="adm-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="adm-modal" role="dialog" aria-modal="true" aria-label={title}>
        <header>
          <h3>{title}</h3>
          <button
            className="adm-x"
            type="button"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </header>
        {children}
      </div>
    </div>
  );
}

function EventForm({ onClose, onCreated, onError }) {
  const [form, setForm] = useState(initialEvent);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      const { event: createdEvent } = await api.createEvent(form);
      onCreated(createdEvent);
      onClose();
    } catch (requestError) {
      setError(requestError.message);
      if (requestError.status === 401 || requestError.status === 403) {
        onError(requestError);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal title="Add event" onClose={onClose}>
      <form onSubmit={submit}>
        <div className="adm-form">
          <label className="adm-field wide">
            <span>Event title</span>
            <input
              required
              maxLength={120}
              value={form.title}
              onChange={updateField("title")}
            />
          </label>
          <label className="adm-field wide">
            <span>Description</span>
            <textarea
              required
              rows="4"
              maxLength={1000}
              value={form.description}
              onChange={updateField("description")}
            />
          </label>
          <label className="adm-field">
            <span>Wing</span>
            <select required value={form.wing} onChange={updateField("wing")}>
              {wings.map((wing) => (
                <option key={wing.code} value={wing.name}>
                  {wing.name}
                </option>
              ))}
            </select>
          </label>
          <label className="adm-field">
            <span>Date</span>
            <input
              type="date"
              value={form.date}
              onChange={updateField("date")}
            />
          </label>
          <label className="adm-field">
            <span>Time</span>
            <input
              type="time"
              value={form.time}
              onChange={updateField("time")}
            />
          </label>
          <label className="adm-field">
            <span>Venue</span>
            <input
              maxLength={120}
              value={form.venue}
              onChange={updateField("venue")}
            />
          </label>
          <label className="adm-field wide">
            <span>Registration status</span>
            <select
              value={form.registrationStatus}
              onChange={updateField("registrationStatus")}
            >
              <option value="upcoming">Upcoming</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </label>
        </div>
        {error && (
          <p className="adm-err" role="alert">
            {error}
          </p>
        )}
        <footer>
          <button
            className="adm-btn"
            type="button"
            onClick={onClose}
            disabled={busy}
          >
            Cancel
          </button>
          <button className="adm-btn solid" type="submit" disabled={busy}>
            {busy ? "Creating…" : "Create event"}
          </button>
        </footer>
      </form>
    </Modal>
  );
}

function DeleteConfirmation({ event, onClose, onDeleted, onError }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const remove = async () => {
    setBusy(true);
    setError("");

    try {
      await api.deleteEvent(event._id);
      onDeleted(event);
      onClose();
    } catch (requestError) {
      setError(requestError.message);
      if (requestError.status === 401 || requestError.status === 403) {
        onError(requestError);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal title="Delete event" onClose={onClose}>
      <div className="adm-danger">
        <p>
          Delete <strong>“{event.title}”</strong>? This also deletes its event
          registrations. This action cannot be undone.
        </p>
        {error && (
          <p className="adm-err" role="alert">
            {error}
          </p>
        )}
        <div>
          <button
            className="adm-btn"
            type="button"
            onClick={onClose}
            disabled={busy}
          >
            Keep event
          </button>
          <button
            className="adm-btn danger"
            type="button"
            onClick={remove}
            disabled={busy}
          >
            {busy ? "Deleting…" : "Delete event"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

function RegistrationsModal({ event, onClose, onError }) {
  const [registrations, setRegistrations] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    api
      .registrations(event._id)
      .then(({ registrations: items }) => {
        if (active) setRegistrations(items);
      })
      .catch((requestError) => {
        if (!active) return;
        setError(requestError.message);
        if (requestError.status === 401 || requestError.status === 403) {
          onError(requestError);
        }
      });

    return () => {
      active = false;
    };
  }, [event._id, onError]);

  return (
    <Modal title={`Registrations · ${event.title}`} onClose={onClose}>
      {error ? (
        <p className="adm-err" role="alert">
          {error}
        </p>
      ) : registrations === null ? (
        <p className="adm-muted">Loading registrations…</p>
      ) : registrations.length === 0 ? (
        <div className="adm-empty">
          <strong>No registrations yet</strong>
        </div>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Scholar ID</th>
                <th>Status</th>
                <th>Registered</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((registration) => (
                <tr key={registration._id}>
                  <td>{registration.user?.name || "—"}</td>
                  <td>{registration.user?.email || "—"}</td>
                  <td className="mono">{registration.user?.scholarId || "—"}</td>
                  <td>{registration.status}</td>
                  <td className="mono">{fmtStamp(registration.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <footer>
        <button className="adm-btn solid" type="button" onClick={onClose}>
          Close
        </button>
      </footer>
    </Modal>
  );
}

export default function useEventManagement({
  onCreated,
  onDeleted,
  onError,
  onExporting,
}) {
  const [modal, setModal] = useState(null);
  const closeModal = () => setModal(null);

  const exportCsv = async (event) => {
    onExporting(event._id);
    try {
      const file = await api.exportRegistrations(event._id);
      const url = URL.createObjectURL(file);
      const anchor = document.createElement("a");
      const slug =
        event.title
          .replace(/[^\w]+/g, "-")
          .replace(/^-|-$/g, "")
          .toLowerCase() || "event";

      anchor.href = url;
      anchor.download = `${slug}-registrations.csv`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 0);
    } catch (requestError) {
      onError(requestError);
    } finally {
      onExporting("");
    }
  };

  return {
    onAddEvent: () => setModal({ type: "create" }),
    onDeleteEvent: (event) => setModal({ type: "delete", event }),
    onViewRegistrations: (event) =>
      setModal({ type: "registrations", event }),
    onExportRegistrations: exportCsv,
    modal: modal && (
      <>
        {modal.type === "create" && (
          <EventForm
            onClose={closeModal}
            onCreated={onCreated}
            onError={onError}
          />
        )}
        {modal.type === "delete" && (
          <DeleteConfirmation
            event={modal.event}
            onClose={closeModal}
            onDeleted={onDeleted}
            onError={onError}
          />
        )}
        {modal.type === "registrations" && (
          <RegistrationsModal
            event={modal.event}
            onClose={closeModal}
            onError={onError}
          />
        )}
      </>
    ),
  };
}

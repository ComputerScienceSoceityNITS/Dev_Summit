// Small API client shared by the public site and the admin dashboard.
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function call(path, { method = "GET", body, token, blob } = {}) {
  let response;

  try {
    response = await fetch("/api" + path, {
      method,
      headers: {
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: "Bearer " + token } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      "Cannot reach the server. Please check your connection and try again.",
      0,
    );
  }

  if (blob && response.ok) return response.blob();

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(
      data.error || "Something went wrong. Please try again.",
      response.status,
    );
  }

  return data;
}

export const api = {
  events: () => call("/events"),
  register: (id, body) =>
    call(`/events/${id}/register`, { method: "POST", body }),
  login: (username, password) =>
    call("/admin/login", {
      method: "POST",
      body: { username, password },
    }),
  adminEvents: (token) => call("/admin/events", { token }),
  createEvent: (token, body) =>
    call("/admin/events", { method: "POST", body, token }),
  updateEvent: (token, id, body) =>
    call(`/admin/events/${id}`, { method: "PUT", body, token }),
  deleteEvent: (token, id) =>
    call(`/admin/events/${id}`, { method: "DELETE", token }),
  registrations: (token, id) =>
    call(`/admin/events/${id}/registrations`, { token }),
  registrationsCsv: (token, id) =>
    call(`/admin/events/${id}/registrations.csv`, { token, blob: true }),
};

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request(path, { method = "GET", body, responseType } = {}) {
  let response;

  try {
    response = await fetch(`/api${path}`, {
      method,
      credentials: "include",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      "Cannot reach the server. Please check your connection and try again.",
      0,
    );
  }

  if (responseType === "blob" && response.ok) {
    return response.blob();
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new ApiError(
      "The server returned an invalid response.",
      response.status,
    );
  }

  if (!response.ok) {
    const validationMessage = Array.isArray(payload?.errors)
      ? payload.errors.find((error) => error?.message)?.message
      : undefined;
    throw new ApiError(
      validationMessage ||
        (payload && payload.message) ||
        "Something went wrong. Please try again.",
      response.status,
    );
  }

  if (!payload || !Object.prototype.hasOwnProperty.call(payload, "data")) {
    throw new ApiError(
      "The server returned an invalid response.",
      response.status,
    );
  }

  return payload.data;
}

export const api = {
  events: () => request("/events"),
  signup: (body) => request("/auth/signup", { method: "POST", body }),
  login: (body) => request("/auth/login", { method: "POST", body }),
  googleSignIn: (credential) =>
    request("/auth/google", {
      method: "POST",
      body: { credential },
    }),
  me: () => request("/auth/me"),
  logout: () => request("/auth/logout", { method: "POST" }),
  registerForEvent: (eventId) =>
    request("/registrations/register", {
      method: "POST",
      body: { eventId },
    }),
  myRegistrations: () => request("/registrations/mine"),
  createEvent: (body) => request("/events", { method: "POST", body }),
  deleteEvent: (eventId) => request(`/events/${eventId}`, { method: "DELETE" }),
  registrations: (eventId) =>
    request(`/admin/registrations?eventId=${encodeURIComponent(eventId)}`),
  exportRegistrations: (eventId) =>
    request(
      `/admin/registrations/export?eventId=${encodeURIComponent(eventId)}`,
      { responseType: "blob" },
    ),
};

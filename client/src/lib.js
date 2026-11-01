// Small API client + formatters shared by the public site and the admin dashboard.
export class ApiError extends Error {
  constructor(message, status) { super(message); this.status = status }
}

async function call(path, { method = 'GET', body, token, blob } = {}) {
  let res
  try {
    res = await fetch('/api' + path, {
      method,
      headers: { ...(body ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: 'Bearer ' + token } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError('Cannot reach the server. Please check your connection and try again.', 0)
  }
  if (blob && res.ok) return res.blob()
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new ApiError(data.error || 'Something went wrong. Please try again.', res.status)
  return data
}

export const api = {
  events: () => call('/events'),
  register: (id, body) => call(`/events/${id}/register`, { method: 'POST', body }),
  login: (username, password) => call('/admin/login', { method: 'POST', body: { username, password } }),
  adminEvents: t => call('/admin/events', { token: t }),
  createEvent: (t, body) => call('/admin/events', { method: 'POST', body, token: t }),
  updateEvent: (t, id, body) => call(`/admin/events/${id}`, { method: 'PUT', body, token: t }),
  deleteEvent: (t, id) => call(`/admin/events/${id}`, { method: 'DELETE', token: t }),
  registrations: (t, id) => call(`/admin/events/${id}/registrations`, { token: t }),
  registrationsCsv: (t, id) => call(`/admin/events/${id}/registrations.csv`, { token: t, blob: true }),
}

const d = s => new Date(s + 'T00:00:00')
export const fmtDate = s => (s ? d(s).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '')
export const fmtLong = s => (s ? d(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '')
export const fmtRange = (a, b) => (b && b !== a ? `${fmtDate(a)} – ${fmtDate(b)}` : fmtDate(a))
export const fmtStamp = iso => new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

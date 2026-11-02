import { useState, useEffect, useMemo, useCallback } from 'react'
import { api, fmtRange, fmtStamp } from './lib.js'
import './admin.css'

const TOKEN_KEY = 'ds26-admin-token'

/* ---------- small pieces ---------- */
function Pill({ e }) {
  const s = e.status === 'closed' ? ['closed', 'Closed'] : e.full ? ['full', 'Full'] : ['open', 'Open']
  return <span className={'adm-pill ' + s[0]}>{s[1]}</span>
}
function Capacity({ e }) {
  if (e.capacity == null) return <div className="adm-cap"><strong>{e.registrations}</strong><small>No seat limit</small></div>
  const pct = Math.min(100, Math.round((e.registrations / e.capacity) * 100))
  return <div className="adm-cap"><strong>{e.registrations}<em> / {e.capacity}</em></strong><div className="adm-bar" aria-hidden="true"><i style={{ width: pct + '%' }} /></div></div>
}
function Modal({ title, onClose, children, wide }) {
  useEffect(() => {
    const k = ev => { if (ev.key === 'Escape') onClose() }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [onClose])
  return <div className="adm-overlay" onMouseDown={ev => { if (ev.target === ev.currentTarget) onClose() }}>
    <div className={'adm-modal' + (wide ? ' wide' : '')} role="dialog" aria-modal="true" aria-label={title}>
      <header><h3>{title}</h3><button className="adm-x" onClick={onClose} aria-label="Close">×</button></header>
      {children}
    </div>
  </div>
}

/* ---------- login ---------- */
function Login({ onLogin }) {
  const [user, setUser] = useState('')
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async e => {
    e.preventDefault(); setBusy(true); setErr('')
    try { const { token } = await api.login(user, pw); onLogin(token) }
    catch (x) { setErr(x.message); setBusy(false) }
  }
  return <section className="adm adm-login">
    <form className="adm-login-card" onSubmit={submit}>
      <div className="section-label"><span>→</span> / ADMIN</div>
      <h2>Organiser<br /><span>sign in.</span></h2>
      <p>Manage events and review registrations for Dev Summit.</p>
      <label className="adm-field"><span>Username</span><input type="text" autoFocus autoComplete="username" required value={user} onChange={e => setUser(e.target.value)} /></label>
      <label className="adm-field"><span>Password</span><input type="password" autoComplete="current-password" required value={pw} onChange={e => setPw(e.target.value)} /></label>
      {err && <p className="adm-err" role="alert">{err}</p>}
      <button className="reg-btn" type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
    </form>
  </section>
}

/* ---------- add / edit event ---------- */
function EventForm({ token, event, onClose, onSaved, onDeleted, onAuthFail }) {
  const editing = !!event
  const [f, setF] = useState(() => ({
    title: event ? event.title : '',
    description: event ? event.description : '',
    startDate: event ? event.startDate : '',
    endDate: event && event.endDate !== event.startDate ? event.endDate : '',
    venue: event ? event.venue : '',
    capacity: event && event.capacity != null ? event.capacity : '',
    status: event ? event.status : 'open',
  }))
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [confirming, setConfirming] = useState(false)
  const set = k => e => setF({ ...f, [k]: e.target.value })
  const remove = async () => {
    setBusy(true); setErr('')
    try { await api.deleteEvent(token, event.id); onDeleted(event) }
    catch (x) {
      if (x.status === 401) onAuthFail()
      else { setErr(x.message); setBusy(false); setConfirming(false) }
    }
  }
  const submit = async e => {
    e.preventDefault(); setBusy(true); setErr('')
    try {
      const r = editing ? await api.updateEvent(token, event.id, f) : await api.createEvent(token, f)
      onSaved(r.event, editing)
    } catch (x) {
      if (x.status === 401) onAuthFail()
      else { setErr(x.message); setBusy(false) }
    }
  }
  return <Modal title={editing ? 'Edit event' : 'Add event'} onClose={onClose}>
    <form onSubmit={submit}>
      <div className="adm-form">
        <label className="adm-field wide"><span>Event title</span><input required maxLength={120} value={f.title} onChange={set('title')} placeholder="e.g. Linux Scripting Workshop" /></label>
        <label className="adm-field wide"><span>Description</span><textarea rows="4" maxLength={1000} value={f.description} onChange={set('description')} placeholder="What will participants learn or do?" /></label>
        <label className="adm-field"><span>Start date</span><input required type="date" value={f.startDate} onChange={set('startDate')} /></label>
        <label className="adm-field"><span>End date <small>(optional)</small></span><input type="date" min={f.startDate || undefined} value={f.endDate} onChange={set('endDate')} /></label>
        <label className="adm-field"><span>Venue</span><input maxLength={120} value={f.venue} onChange={set('venue')} placeholder="e.g. Computer Centre, NIT Silchar" /></label>
        <label className="adm-field"><span>Seat limit <small>(optional)</small></span><input type="number" min="1" step="1" value={f.capacity} onChange={set('capacity')} placeholder="Unlimited" /></label>
        <label className="adm-field wide"><span>Registration status</span>
          <select value={f.status} onChange={set('status')}><option value="open">Open — accepting registrations</option><option value="closed">Closed — not accepting registrations</option></select>
        </label>
      </div>
      {err && <p className="adm-err" role="alert">{err}</p>}
      {confirming ? <div className="adm-danger" role="alert">
        <p><strong>Delete “{event.title}”?</strong> {event.registrations > 0 ? `This also permanently removes its ${event.registrations} registration${event.registrations === 1 ? '' : 's'}.` : 'This cannot be undone.'}</p>
        <div><button type="button" className="adm-btn" onClick={() => setConfirming(false)} disabled={busy}>Keep event</button><button type="button" className="adm-btn danger" onClick={remove} disabled={busy}>{busy ? 'Deleting…' : 'Yes, delete'}</button></div>
      </div> :
      <footer>
        {editing && <button type="button" className="adm-btn danger-outline" onClick={() => setConfirming(true)} disabled={busy}>Delete event</button>}
        <span className="adm-spacer" />
        <button type="button" className="adm-btn" onClick={onClose}>Cancel</button><button type="submit" className="adm-btn solid" disabled={busy}>{busy ? 'Saving…' : editing ? 'Save changes' : 'Create event'}</button>
      </footer>}
    </form>
  </Modal>
}

/* ---------- registrations for one event ---------- */
function Responses({ token, eventId, onBack, onAuthFail }) {
  const [data, setData] = useState(null)
  const [err, setErr] = useState('')
  const [q, setQ] = useState('')
  const [exp, setExp] = useState('all')
  const [open, setOpen] = useState(null)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    let live = true
    api.registrations(token, eventId)
      .then(d => { if (live) setData(d) })
      .catch(x => { if (x.status === 401) onAuthFail(); else if (live) setErr(x.message) })
    return () => { live = false }
  }, [token, eventId, onAuthFail])

  const rows = data ? data.registrations : []
  const breakdown = useMemo(() => {
    const m = {}
    rows.forEach(r => { m[r.experience] = (m[r.experience] || 0) + 1 })
    return Object.entries(m)
  }, [rows])
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    return rows.filter(r => (exp === 'all' || r.experience === exp) &&
      (!s || [r.name, r.scholarId, r.phone, r.department, r.details].some(v => v.toLowerCase().includes(s))))
  }, [rows, q, exp])

  const exportCsv = async () => {
    setExporting(true)
    try {
      const blob = await api.registrationsCsv(token, eventId)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      const slug = data.event.title.replace(/[^\w]+/g, '-').replace(/^-|-$/g, '').toLowerCase() || 'registrations'
      a.href = url; a.download = slug + '-registrations.csv'
      document.body.appendChild(a); a.click(); a.remove()
      URL.revokeObjectURL(url)
    } catch (x) {
      if (x.status === 401) onAuthFail(); else setErr(x.message)
    } finally { setExporting(false) }
  }

  if (!data) return <section className="adm">
    <button className="adm-back" onClick={onBack}>← All events</button>
    {err ? <p className="adm-err" role="alert">{err}</p> : <p className="adm-muted">Loading registrations…</p>}
  </section>

  const ev = data.event
  return <section className="adm">
    <button className="adm-back" onClick={onBack}>← All events</button>
    <div className="adm-top">
      <div>
        <div className="section-label"><span>→</span> / REGISTRATIONS</div>
        <h2 className="adm-title">{ev.title}</h2>
        <p className="adm-sub">{fmtRange(ev.startDate, ev.endDate)}{ev.venue ? ' · ' + ev.venue : ''} <Pill e={ev} /></p>
      </div>
      <div className="adm-actions"><button className="reg-btn ghost" onClick={exportCsv} disabled={exporting || !rows.length}>{exporting ? 'Preparing…' : 'Export CSV ↓'}</button></div>
    </div>

    <div className="adm-stats">
      <div><span>Total registrations</span><strong>{ev.registrations}</strong></div>
      <div><span>Seat limit</span><strong>{ev.capacity == null ? 'None' : ev.capacity}</strong></div>
      <div><span>Seats left</span><strong>{ev.spotsLeft == null ? '—' : ev.spotsLeft}</strong></div>
      <div><span>Latest registration</span><strong className="sm">{rows.length ? fmtStamp(rows[0].createdAt) : '—'}</strong></div>
    </div>

    {breakdown.length > 0 && <div className="adm-chips" aria-label="Experience breakdown">{breakdown.map(([k, n]) => <span key={k}><b>{n}</b> {k}</span>)}</div>}

    <div className="adm-toolbar">
      <input type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search name, Scholar ID, phone or department…" aria-label="Search registrations" />
      <select value={exp} onChange={e => setExp(e.target.value)} aria-label="Filter by experience"><option value="all">All experience levels</option>{breakdown.map(([k]) => <option key={k} value={k}>{k}</option>)}</select>
      <span className="adm-count">{filtered.length} of {rows.length}</span>
    </div>
    {err && <p className="adm-err" role="alert">{err}</p>}

    {rows.length === 0 ? <div className="adm-empty"><strong>No registrations yet</strong><p>Responses will appear here as soon as people register for this event.</p></div> :
      filtered.length === 0 ? <div className="adm-empty"><strong>No matches</strong><p>Try a different search or filter.</p></div> :
        <div className="adm-table-wrap"><table className="adm-table">
          <thead><tr><th>#</th><th>Name</th><th>Scholar ID</th><th>Phone</th><th>Department</th><th>Experience</th><th>Registered</th><th className="r">Response</th></tr></thead>
          <tbody>{filtered.map((r, i) => <tr key={r.id}>
            <td className="mono">{String(i + 1).padStart(2, '0')}</td>
            <td><strong>{r.name}</strong></td>
            <td className="mono">{r.scholarId}</td>
            <td className="mono">{r.phone}</td>
            <td>{r.department}</td>
            <td>{r.experience}</td>
            <td className="mono">{fmtStamp(r.createdAt)}</td>
            <td className="r"><button className="adm-btn" onClick={() => setOpen(r)}>View</button></td>
          </tr>)}</tbody>
        </table></div>}

    {open && <Modal title="Registration response" onClose={() => setOpen(null)}>
      <dl className="adm-detail">
        <div><dt>Name</dt><dd>{open.name}</dd></div>
        <div><dt>Scholar ID</dt><dd className="mono">{open.scholarId}</dd></div>
        <div><dt>Phone number</dt><dd className="mono">{open.phone}</dd></div>
        <div><dt>Department</dt><dd>{open.department}</dd></div>
        <div><dt>Experience in Web / ML</dt><dd>{open.experience}</dd></div>
        <div><dt>Registered on</dt><dd>{fmtStamp(open.createdAt)}</dd></div>
        <div className="wide"><dt>Experience details</dt><dd className="pre">{open.details || 'Not provided'}</dd></div>
      </dl>
      <footer><button className="adm-btn solid" onClick={() => setOpen(null)}>Close</button></footer>
    </Modal>}
  </section>
}

/* ---------- dashboard ---------- */
function Dashboard({ token, onLogout }) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modal, setModal] = useState(null) // { event } — event undefined = add
  const [viewId, setViewId] = useState(null)
  const [toast, setToast] = useState('')

  const load = useCallback(async () => {
    try { setError(''); const d = await api.adminEvents(token); setEvents(d.events) }
    catch (x) { if (x.status === 401) onLogout(); else setError(x.message) }
    finally { setLoading(false) }
  }, [token, onLogout])
  useEffect(() => { load() }, [load])
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 3200)
    return () => clearTimeout(t)
  }, [toast])

  const closeModal = useCallback(() => setModal(null), [])
  const saved = (ev, editing) => { setModal(null); setToast(editing ? 'Event updated.' : 'Event created.'); load() }
  const deleted = () => { setModal(null); setToast('Event deleted.'); load() }

  if (viewId) return <Responses token={token} eventId={viewId} onBack={() => { setViewId(null); load() }} onAuthFail={onLogout} />

  const total = events.reduce((n, e) => n + e.registrations, 0)
  const openCount = events.filter(e => e.open).length
  return <section className="adm">
    <div className="adm-top">
      <div><div className="section-label"><span>→</span> / ADMIN</div><h2 className="adm-title">Events <span>dashboard</span></h2></div>
      <div className="adm-actions">
        <button className="reg-btn" onClick={() => setModal({})}>+ Add event</button>
        <button className="reg-btn ghost" onClick={onLogout}>Sign out</button>
      </div>
    </div>

    <div className="adm-stats three">
      <div><span>Total events</span><strong>{events.length}</strong></div>
      <div><span>Open for registration</span><strong>{openCount}</strong></div>
      <div><span>Total registrations</span><strong>{total}</strong></div>
    </div>

    {error && <p className="adm-err" role="alert">{error} <button className="adm-link" onClick={load}>Retry</button></p>}
    {loading ? <p className="adm-muted">Loading events…</p> : events.length === 0 ? <div className="adm-empty"><strong>No events yet</strong><p>Create your first event to start collecting registrations.</p><button className="reg-btn" onClick={() => setModal({})}>+ Add event</button></div> :
      <div className="adm-table-wrap"><table className="adm-table">
        <thead><tr><th>Event</th><th>Dates</th><th>Registrations</th><th>Status</th><th className="r">Actions</th></tr></thead>
        <tbody>{events.map(e => <tr key={e.id}>
          <td><strong>{e.title}</strong><small>{e.venue || 'Venue to be announced'}</small></td>
          <td>{fmtRange(e.startDate, e.endDate)}</td>
          <td><Capacity e={e} /></td>
          <td><Pill e={e} /></td>
          <td className="r"><div className="adm-row-actions">
            <button className="adm-btn solid" onClick={() => setViewId(e.id)}>View responses</button>
            <button className="adm-btn" onClick={() => setModal({ event: e })}>Edit</button>
          </div></td>
        </tr>)}</tbody>
      </table></div>}

    {modal && <EventForm token={token} event={modal.event} onClose={closeModal} onSaved={saved} onDeleted={deleted} onAuthFail={onLogout} />}
    {toast && <div className="adm-toast" role="status">{toast}</div>}
  </section>
}

/* ---------- entry ---------- */
export default function Admin() {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY) || '')
  const logout = useCallback(() => { sessionStorage.removeItem(TOKEN_KEY); setToken('') }, [])
  if (!token) return <Login onLogin={t => { sessionStorage.setItem(TOKEN_KEY, t); setToken(t) }} />
  return <Dashboard token={token} onLogout={logout} />
}

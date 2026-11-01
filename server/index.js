// Dev Summit 2026 — API server (no external dependencies, Node 18+)
// Storage: a single JSON file at server/data/db.json
// Run:     set ADMIN_USERNAME and ADMIN_PASSWORD (in a .env file or the environment), then: node server/index.js
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Minimal .env loader (so Windows users don't need to set variables by hand). Real environment variables win.
try {
  for (const line of fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/)
    if (m && !line.trim().startsWith('#') && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^(["'])(.*)\1$/, '$2')
  }
} catch { /* no .env file — fine */ }
const PORT = Number(process.env.PORT) || 8787
const PROD = process.env.NODE_ENV === 'production'
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data')
const DB_FILE = path.join(DATA_DIR, 'db.json')
const DIST = path.join(__dirname, '..', 'dist')
const SESSION_MS = 8 * 60 * 60 * 1000

let ADMIN_USERNAME = process.env.ADMIN_USERNAME
let ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
  if (PROD) { console.error('ADMIN_USERNAME and ADMIN_PASSWORD must both be set when NODE_ENV=production.'); process.exit(1) }
  ADMIN_USERNAME = ADMIN_USERNAME || 'admin'
  ADMIN_PASSWORD = ADMIN_PASSWORD || 'devsummit-admin'
  console.warn('\n  ⚠  ADMIN_USERNAME / ADMIN_PASSWORD not fully set — using development defaults where missing\n     (username "admin", password "devsummit-admin"). Set both in a .env file before deploying.\n')
}
const SECRET = process.env.TOKEN_SECRET || crypto.randomBytes(32).toString('hex')

/* ---------- storage ---------- */
const EXPERIENCE = ['No experience', 'Web development', 'Machine learning (ML)', 'Both Web and ML']
const seed = () => ({
  events: [{
    id: 'dev-summit-2026',
    title: 'Dev Summit 2026 — Phase 1',
    description: 'Register to take part in Dev Summit 2026 Phase 1, from 4 to 6 November. Open to students who want to learn, build and connect.',
    startDate: '2026-11-04', endDate: '2026-11-06', venue: 'NIT Silchar',
    capacity: null, status: 'open',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  }],
  registrations: [],
})
function load() {
  fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(DB_FILE)) { const d = seed(); fs.writeFileSync(DB_FILE, JSON.stringify(d, null, 2)); return d }
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'))
}
const db = load()
function save() {
  const tmp = DB_FILE + '.tmp'
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2))
  fs.renameSync(tmp, DB_FILE) // atomic replace
}

/* ---------- helpers ---------- */
class HttpError extends Error { constructor(status, message) { super(message); this.status = status } }
const send = (res, status, body, headers = {}) => {
  const isStr = typeof body === 'string'
  res.writeHead(status, {
    'Content-Type': isStr ? 'text/plain; charset=utf-8' : 'application/json; charset=utf-8',
    'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...headers,
  })
  res.end(isStr ? body : JSON.stringify(body))
}
const readBody = req => new Promise((resolve, reject) => {
  let size = 0; const chunks = []
  req.on('data', c => { size += c.length; if (size > 100_000) { reject(new HttpError(413, 'Request too large.')); req.destroy() } else chunks.push(c) })
  req.on('end', () => { try { resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {}) } catch { reject(new HttpError(400, 'Invalid JSON.')) } })
  req.on('error', reject)
})
const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const isDate = s => /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s + 'T00:00:00Z'))

/* ---------- auth ---------- */
const b64 = o => Buffer.from(o).toString('base64url')
const sign = p => crypto.createHmac('sha256', SECRET).update(p).digest('base64url')
const makeToken = () => { const p = b64(JSON.stringify({ exp: Date.now() + SESSION_MS })); return p + '.' + sign(p) }
function verifyToken(t) {
  const [p, s] = String(t || '').split('.')
  if (!p || !s) return false
  const a = Buffer.from(s), b = Buffer.from(sign(p))
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false
  try { return JSON.parse(Buffer.from(p, 'base64url').toString()).exp > Date.now() } catch { return false }
}
const requireAdmin = req => {
  const h = req.headers.authorization || ''
  if (!h.startsWith('Bearer ') || !verifyToken(h.slice(7))) throw new HttpError(401, 'Please sign in again.')
}
const attempts = new Map() // ip -> { n, reset }
function throttleLogin(ip) {
  const now = Date.now(); let a = attempts.get(ip)
  if (!a || a.reset < now) a = { n: 0, reset: now + 15 * 60 * 1000 }
  a.n++; attempts.set(ip, a)
  if (a.n > 10) throw new HttpError(429, 'Too many attempts. Try again in 15 minutes.')
}
const safeEqual = (a, b) => {
  const ha = crypto.createHash('sha256').update(a).digest(), hb = crypto.createHash('sha256').update(b).digest()
  return crypto.timingSafeEqual(ha, hb)
}

/* ---------- domain ---------- */
const countFor = id => db.registrations.filter(r => r.eventId === id).length
function present(e) {
  const registrations = countFor(e.id)
  const full = e.capacity != null && registrations >= e.capacity
  return { ...e, registrations, full, spotsLeft: e.capacity == null ? null : Math.max(0, e.capacity - registrations), open: e.status === 'open' && !full }
}
function validateEvent(b, existingId) {
  const e = {
    title: str(b.title, 120), description: str(b.description, 1000), venue: str(b.venue, 120),
    startDate: str(b.startDate, 10), endDate: str(b.endDate, 10),
    status: b.status === 'closed' ? 'closed' : 'open', capacity: null,
  }
  if (e.title.length < 3) throw new HttpError(400, 'Event title must be at least 3 characters.')
  if (!isDate(e.startDate)) throw new HttpError(400, 'Please choose a valid start date.')
  if (e.endDate && !isDate(e.endDate)) throw new HttpError(400, 'Please choose a valid end date.')
  if (e.endDate && e.endDate < e.startDate) throw new HttpError(400, 'End date cannot be before the start date.')
  if (!e.endDate) e.endDate = e.startDate
  if (b.capacity !== '' && b.capacity != null) {
    const c = Number(b.capacity)
    if (!Number.isInteger(c) || c < 1 || c > 100000) throw new HttpError(400, 'Capacity must be a whole number of 1 or more (or leave it empty for unlimited).')
    if (existingId && c < countFor(existingId)) throw new HttpError(400, `Capacity cannot be below the ${countFor(existingId)} registrations already received.`)
    e.capacity = c
  }
  return e
}
function validateRegistration(b) {
  const r = {
    name: str(b.name, 100), scholarId: str(b.scholarId, 30), phone: str(b.phone, 20),
    experience: str(b.experience, 40), details: str(b.details, 500), department: str(b.department, 100),
  }
  if (r.name.length < 2) throw new HttpError(400, 'Please enter your name.')
  if (r.scholarId.length < 3) throw new HttpError(400, 'Please enter a valid Scholar ID.')
  if (!/^[0-9+\- ]{10,15}$/.test(r.phone)) throw new HttpError(400, 'Please enter a valid phone number.')
  if (!EXPERIENCE.includes(r.experience)) throw new HttpError(400, 'Please select your experience.')
  if (r.department.length < 2) throw new HttpError(400, 'Please enter your department.')
  if (r.experience === 'No experience') r.details = ''
  return r
}
const csvCell = v => { let s = String(v ?? ''); if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; return '"' + s.replace(/"/g, '""') + '"' }

/* ---------- routes ---------- */
async function api(req, res, url) {
  const m = req.method, p = url.pathname
  let x

  if (m === 'GET' && p === '/api/events') {
    const events = [...db.events].sort((a, b) => a.startDate.localeCompare(b.startDate)).map(e => {
      const { registrations, ...pub } = present(e); return { ...pub, registrations }
    })
    return send(res, 200, { events })
  }
  if (m === 'POST' && (x = p.match(/^\/api\/events\/([\w-]+)\/register$/))) {
    const ev = db.events.find(e => e.id === x[1])
    if (!ev) throw new HttpError(404, 'Event not found.')
    const pe = present(ev)
    if (ev.status !== 'open') throw new HttpError(409, 'Registration for this event is closed.')
    if (pe.full) throw new HttpError(409, 'This event is full.')
    const r = validateRegistration(await readBody(req))
    if (db.registrations.some(q => q.eventId === ev.id && q.scholarId.toLowerCase() === r.scholarId.toLowerCase()))
      throw new HttpError(409, 'This Scholar ID is already registered for the event.')
    db.registrations.push({ id: crypto.randomUUID(), eventId: ev.id, ...r, createdAt: new Date().toISOString() })
    save()
    return send(res, 201, { ok: true })
  }

  if (m === 'POST' && p === '/api/admin/login') {
    throttleLogin(req.socket.remoteAddress || 'x')
    const b = await readBody(req)
    const userOk = typeof b.username === 'string' && safeEqual(b.username.trim(), ADMIN_USERNAME)
    const passOk = typeof b.password === 'string' && safeEqual(b.password, ADMIN_PASSWORD)
    if (!(userOk && passOk)) throw new HttpError(401, 'Incorrect username or password.')
    attempts.delete(req.socket.remoteAddress || 'x')
    return send(res, 200, { token: makeToken(), expiresIn: SESSION_MS })
  }

  if (p.startsWith('/api/admin/')) {
    requireAdmin(req)
    if (m === 'GET' && p === '/api/admin/events')
      return send(res, 200, { events: [...db.events].sort((a, b) => b.startDate.localeCompare(a.startDate)).map(present) })
    if (m === 'POST' && p === '/api/admin/events') {
      const e = validateEvent(await readBody(req))
      const now = new Date().toISOString()
      const ev = { id: crypto.randomUUID().slice(0, 8), ...e, createdAt: now, updatedAt: now }
      db.events.push(ev); save()
      return send(res, 201, { event: present(ev) })
    }
    if ((x = p.match(/^\/api\/admin\/events\/([\w-]+)$/)) && m === 'PUT') {
      const ev = db.events.find(e => e.id === x[1])
      if (!ev) throw new HttpError(404, 'Event not found.')
      Object.assign(ev, validateEvent(await readBody(req), ev.id), { updatedAt: new Date().toISOString() })
      save()
      return send(res, 200, { event: present(ev) })
    }
    if ((x = p.match(/^\/api\/admin\/events\/([\w-]+)$/)) && m === 'DELETE') {
      const i = db.events.findIndex(e => e.id === x[1])
      if (i < 0) throw new HttpError(404, 'Event not found.')
      const removed = db.registrations.filter(r => r.eventId === x[1]).length
      db.events.splice(i, 1)
      db.registrations = db.registrations.filter(r => r.eventId !== x[1])
      save()
      return send(res, 200, { ok: true, removedRegistrations: removed })
    }
    if ((x = p.match(/^\/api\/admin\/events\/([\w-]+)\/registrations(\.csv)?$/)) && m === 'GET') {
      const ev = db.events.find(e => e.id === x[1])
      if (!ev) throw new HttpError(404, 'Event not found.')
      const rows = db.registrations.filter(r => r.eventId === ev.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      if (x[2]) {
        const head = ['Name', 'Scholar ID', 'Phone', 'Department', 'Experience', 'Experience details', 'Registered at']
        const csv = [head, ...rows.map(r => [r.name, r.scholarId, r.phone, r.department, r.experience, r.details, r.createdAt])].map(l => l.map(csvCell).join(',')).join('\r\n')
        const fname = ev.title.replace(/[^\w]+/g, '-').replace(/^-|-$/g, '').toLowerCase() || 'registrations'
        return send(res, 200, '\ufeff' + csv, { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="${fname}-registrations.csv"` })
      }
      return send(res, 200, { event: present(ev), registrations: rows })
    }
  }
  throw new HttpError(404, 'Not found.')
}

/* ---------- static (production build) ---------- */
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.mp4': 'video/mp4', '.svg': 'image/svg+xml', '.json': 'application/json', '.ico': 'image/x-icon' }
function serveStatic(req, res, url) {
  if (!fs.existsSync(DIST)) return send(res, 404, 'Frontend not built. Run "npm run build" (or use "npm run dev" for development).')
  let file = path.normalize(path.join(DIST, decodeURIComponent(url.pathname)))
  if (!file.startsWith(DIST)) return send(res, 403, 'Forbidden')
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(DIST, 'index.html')
  const type = MIME[path.extname(file)] || 'application/octet-stream'
  const cache = file.includes(path.sep + 'assets' + path.sep) && /-[\w-]{8}\./.test(file) ? 'public, max-age=31536000, immutable' : 'no-cache'
  const stat = fs.statSync(file)
  const range = /bytes=(\d*)-(\d*)/.exec(req.headers.range || '') // video seeking
  if (range && type === 'video/mp4') {
    const start = range[1] ? Number(range[1]) : 0, end = range[2] ? Number(range[2]) : stat.size - 1
    res.writeHead(206, { 'Content-Type': type, 'Content-Range': `bytes ${start}-${end}/${stat.size}`, 'Accept-Ranges': 'bytes', 'Content-Length': end - start + 1 })
    return fs.createReadStream(file, { start, end }).pipe(res)
  }
  res.writeHead(200, { 'Content-Type': type, 'Content-Length': stat.size, 'Cache-Control': cache, 'Accept-Ranges': 'bytes', 'X-Content-Type-Options': 'nosniff' })
  fs.createReadStream(file).pipe(res)
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost')
  try {
    if (url.pathname.startsWith('/api/')) await api(req, res, url)
    else if (req.method === 'GET' || req.method === 'HEAD') serveStatic(req, res, url)
    else throw new HttpError(405, 'Method not allowed.')
  } catch (err) {
    if (!(err instanceof HttpError)) console.error(err)
    if (!res.headersSent) send(res, err.status || 500, { error: err instanceof HttpError ? err.message : 'Something went wrong.' })
  }
}).listen(PORT, () => console.log(`Dev Summit server running on http://localhost:${PORT}`))

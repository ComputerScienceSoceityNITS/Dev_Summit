import { useState, useCallback, useEffect, useRef } from 'react'
import Loader from './Loader.jsx'
import Admin from './Admin.jsx'
import { api, fmtRange, fmtLong } from './lib.js'
import './styles.css'

const days = [
  { day: 'DAY 01', date: '04 NOV', title: 'Build the foundation', tag: 'WEB BASICS', items: ['Opening ceremony', 'Introduction to HTML and CSS', 'JavaScript Part 1'] },
  { day: 'DAY 02', date: '05 NOV', title: 'Code your first ideas', tag: 'DEV TOOLS', items: ['JavaScript Part 2 (Async JavaScript) and React.js overview', 'Introduction to Linux scripting', 'Git and GitHub fundamentals'] },
  { day: 'DAY 03', date: '06 NOV', title: 'From data to deployment', tag: 'DATA + ML', items: ['Web Scraping, EDA, ML Model, Hyperparameter Tuning, Basic Deployment (Streamlit)'] },
]
const wings = [
  { code: 'ML', name: 'Machine Learning Wing of CSS', detail: 'Explore data, intelligent systems and the ideas powering modern AI.', num: '01' },
  { code: 'DEV', name: 'Development Wing of CSS', detail: 'Turn ideas into working experiences with web technologies and developer tools.', num: '02' },
]
const outcomes = ['Build a strong foundation in web development', 'Understand the tools developers use every day', 'Get an introduction to Linux, Git and GitHub', 'Explore machine learning through a practical workshop', 'Connect with peers, mentors and the tech community']

const L = '/assets/logos/'
function useTimelineProgress(ref, page) {
  useEffect(() => {
    const list = ref.current
    if (!list) return
    const dots = [...list.querySelectorAll('.timeline-marker i')]
    const items = [...list.querySelectorAll('.timeline-item')]
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    const update = () => {
      raf = 0
      const top = list.getBoundingClientRect().top
      const c = dots.map(d => { const r = d.getBoundingClientRect(); return r.top - top + r.height / 2 })
      const y = reduce ? Infinity : window.innerHeight * 0.6 - top
      list.style.setProperty('--tl-top', c[0] + 'px')
      list.style.setProperty('--tl-len', c[c.length - 1] - c[0] + 'px')
      list.style.setProperty('--tl-fill', Math.max(0, Math.min(y, c[c.length - 1]) - c[0]) + 'px')
      items.forEach((el, i) => el.classList.toggle('on', y >= c[i]))
    }
    const req = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', req, { passive: true })
    window.addEventListener('resize', req)
    return () => { window.removeEventListener('scroll', req); window.removeEventListener('resize', req); cancelAnimationFrame(raf) }
  }, [page])
}

const nav = [['overview','Overview'],['timeline','Timeline'],['wings','Wings'],['workshops','Workshops'],['outcomes','Outcomes'],['events','Events']]
const valid = ['home', ...nav.map(n => n[0]), 'register', 'admin']
const parse = () => { const [p, q] = location.hash.replace(/^#\/?/, '').split('/'); return { page: valid.includes(p) ? p : 'home', param: q || '' } }

const experience = ['No experience', 'Web development', 'Machine learning (ML)', 'Both Web and ML']
function Register({ eventId }) {
  const [events, setEvents] = useState(null)
  const [loadErr, setLoadErr] = useState(false)
  const [f, setF] = useState({ eventId: eventId || '', name:'', scholarId:'', phone:'', experience:'', details:'', department:'' })
  const [st, setSt] = useState('idle')
  const [err, setErr] = useState('')
  useEffect(() => {
    let live = true
    api.events().then(d => {
      if (!live) return
      setEvents(d.events)
      setF(p => p.eventId && d.events.some(e => e.id === p.eventId) ? p : { ...p, eventId: (d.events.find(e => e.open) || {}).id || '' })
    }).catch(() => { if (live) setLoadErr(true) })
    return () => { live = false }
  }, [])
  const ev = events && events.find(e => e.id === f.eventId)
  const set = k => e => setF({ ...f, [k]: e.target.value })
  const submit = async e => {
    e.preventDefault(); setSt('sending'); setErr('')
    const { eventId: id, ...rest } = f
    try { await api.register(id, { ...rest, details: f.experience === 'No experience' ? '' : f.details }); setSt('done') }
    catch (x) { setErr(x.message); setSt('error') }
  }
  const info = <div className="reg-info"><div className="section-label"><span>→</span> / REGISTRATION</div><h2>Reserve<br/><span>your seat.</span></h2>
    {ev ? <><p>{ev.description || ev.title}</p><ul><li>{fmtRange(ev.startDate, ev.endDate)}</li>{ev.venue && <li>{ev.venue}</li>}<li>{ev.spotsLeft == null ? 'Open to all students' : ev.spotsLeft + ' seats left'}</li></ul></> :
    <p>Register to take part in Dev Summit 2026. Open to students who want to learn, build and connect.</p>}</div>
  if (loadErr || (events && events.length === 0)) return <section className="register section-pad full">{info}<div className="reg-card reg-done"><h3>{loadErr ? 'Can’t load events' : 'No events yet'}</h3><p>{loadErr ? 'We couldn’t reach the server. Please refresh the page or try again in a moment.' : 'Registration will open soon. Check back shortly.'}</p></div></section>
  if (!events) return <section className="register section-pad full">{info}<div className="reg-card reg-done"><p>Loading…</p></div></section>
  return <section className="register section-pad full">
    {info}
    {st === 'done' ? <div className="reg-card reg-done"><h3>You’re registered.</h3><p>Thanks, {f.name.split(' ')[0] || 'there'}! Your registration for {ev ? ev.title : 'the event'} is confirmed for Scholar ID <strong>{f.scholarId}</strong>. See you on {ev ? fmtLong(ev.startDate) : 'the day'}.</p><a className="reg-btn" href="#/timeline">View the schedule</a></div> :
    <form className="reg-card" onSubmit={submit}>
      <div className="reg-grid">
        <label className="wide"><span>Event</span><select required value={f.eventId} onChange={set('eventId')}>{events.map(x => <option key={x.id} value={x.id} disabled={!x.open}>{x.title}{x.open ? '' : x.full ? ' (full)' : ' (registration closed)'}</option>)}</select></label>
        <label><span>Name</span><input required type="text" autoComplete="name" value={f.name} onChange={set('name')} /></label>
        <label><span>Scholar ID</span><input required type="text" value={f.scholarId} onChange={set('scholarId')} /></label>
        <label><span>Phone number</span><input required type="tel" inputMode="tel" autoComplete="tel" pattern="[0-9+\- ]{10,15}" title="Enter a valid phone number" value={f.phone} onChange={set('phone')} /></label>
        <label><span>Experience in Web / ML</span><select required value={f.experience} onChange={set('experience')}><option value="">Select…</option>{experience.map(x => <option key={x}>{x}</option>)}</select></label>
        {f.experience && f.experience !== 'No experience' && <label className="wide"><span>Tell us about your {f.experience === 'Both Web and ML' ? 'Web and ML' : f.experience === 'Machine learning (ML)' ? 'ML' : 'Web'} experience</span><textarea rows="4" maxLength={500} value={f.details} onChange={set('details')} placeholder="Projects, courses, tools or languages you have worked with…" /></label>}
        <label className="wide"><span>Department</span><input required type="text" value={f.department} onChange={set('department')} /></label>
      </div>
      {st === 'error' && <p className="reg-err">{err || 'Something went wrong. Please try again.'}</p>}
      <button className="reg-btn" type="submit" disabled={st === 'sending' || !ev || !ev.open}>{st === 'sending' ? 'Submitting…' : 'Register for this event'}</button>
    </form>}
  </section>
}

function EventsPage() {
  const [events, setEvents] = useState(null)
  const [failed, setFailed] = useState(false)
  useEffect(() => { let live = true; api.events().then(d => live && setEvents(d.events)).catch(() => live && setFailed(true)); return () => { live = false } }, [])
  return <section className="events-page section-pad full" id="events">
    <div className="section-label"><span>06</span> / EVENTS</div>
    <div className="section-head"><h2>Upcoming <span>events.</span></h2><p>Pick an event, register in under a minute and get ready to build.</p></div>
    {failed ? <p className="ev-note">We couldn’t load events right now. Please refresh the page.</p> : !events ? <p className="ev-note">Loading events…</p> : events.length === 0 ? <p className="ev-note">No events have been announced yet. Check back soon.</p> :
    <div className="ev-grid">{events.map(e => <article className="ev-card" key={e.id}>
      <div className="ev-date">{fmtRange(e.startDate, e.endDate)}</div>
      <h3>{e.title}</h3>
      {e.description && <p>{e.description}</p>}
      <div className="ev-meta">{e.venue && <span>{e.venue}</span>}<span>{e.spotsLeft == null ? 'Open to all' : e.full ? 'Event full' : e.spotsLeft + ' seats left'}</span></div>
      {e.open ? <a className="reg-btn" href={'#/register/' + e.id}>Register ↗</a> : <span className="ev-closed">{e.full ? 'Event full' : 'Registration closed'}</span>}
    </article>)}</div>}
  </section>
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [route, setRoute] = useState(parse)
  const page = route.page
  const done = useCallback(() => setLoading(false), [])
  const listRef = useRef(null)
  useTimelineProgress(listRef, page)
  useEffect(() => { const f = () => { setRoute(parse()); window.scrollTo(0, 0) }; window.addEventListener('hashchange', f); return () => window.removeEventListener('hashchange', f) }, [])
  return <main>
    {loading && <Loader onDone={done} />}
    <header className="nav">
      <a className="brand" href="#home" aria-label="Dev Summit home"><span className="brand-mark">D<span>/</span>S</span><span className="brand-copy">DEV SUMMIT<small>2026 · PHASE 01</small></span></a>
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation" aria-expanded={menuOpen}>{menuOpen ? 'CLOSE −' : 'MENU +'}</button>
      <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>{nav.map(([k, t]) => <a key={k} href={'#/' + k} className={page === k ? 'active' : ''} onClick={() => setMenuOpen(false)}>{t}</a>)}<a className="nav-cta" href="#/register" onClick={() => setMenuOpen(false)}>Register ↗</a></nav>
    </header>
    {page === 'home' && <section className="hero" id="home">
      <video className="hero-video" autoPlay muted loop playsInline preload="auto" poster="/assets/hero-poster.jpg" aria-hidden="true">
        <source src="/assets/hero-bg.mp4" type="video/mp4" />
      </video>
      <div className="hero-overlay" />
            <div className="hero-content">
        <div className="eyebrow"><span className="pulse" /> COMPUTER SCIENCE SOCIETY, NIT SILCHAR PRESENTS <span className="eyebrow-line" /></div>
        <p className="hero-kicker">IDEAS COLLIDE. THE FUTURE TAKES SHAPE.</p>
        <h1>DEV<span className="title-outline">SUMMIT</span><em>2026</em></h1>
        <div className="hero-bottom">
          <div><span className="phase-chip">PHASE 01 / THREE DAYS OF BUILDING</span><p className="hero-description">A hands-on journey through code, systems and intelligent technology. Learn together. Build boldly. Make an impact.</p></div>
          <div className="date-stamp"><span>EVENT DATES</span><strong>04—06</strong><b>NOVEMBER 2026</b></div>
        </div>
        <div className="hero-cta"><a className="reg-btn" href="#/register">Register now ↗</a><a className="reg-btn ghost" href="#/timeline">View timeline</a></div>
        <div className="hero-partners"><span className="partner-label">ORGANISED BY COMPUTER SCIENCE SOCIETY, NIT SILCHAR</span><div className="logo-row"><img className="plogo" src={L+'css.png'} alt="Computer Science Society, NIT Silchar" /></div></div>
      </div>
      <div className="hero-index">NITS / DEV SUMMIT 2026 <span>26° 45' N · 94° 12' E</span></div>
    </section>}
    {page === 'overview' && <section className="intro section-pad full" id="overview">
      <div className="section-label"><span>01</span> / EVENT OVERVIEW</div>
      <div className="intro-grid"><h2>Three days.<br/><span>One big leap.</span></h2><div className="intro-copy"><p className="lead">Dev Summit 2026 is a three-day event by the Computer Science Society, NIT Silchar, designed to bring technology closer to curious minds.</p><p>Phase 1 runs from <strong>4 November to 6 November 2026</strong>, featuring an opening ceremony, web and developer-tool workshops, and a hands-on data science and machine learning session. The next phase will take place in the following semester.</p><div className="inline-tags"><span>LEARN</span><span>BUILD</span><span>CONNECT</span><span>CONTRIBUTE</span></div></div></div>
    </section>}
    {page === 'timeline' && <section className="timeline section-pad full" id="timeline">
      <div className="section-head"><div><div className="section-label"><span>02</span> / THE ROADMAP</div><h2>Phase 1 <span>timeline</span></h2></div><p>Four days of ideas moving<br/>from learning to impact.</p></div>
      <div className="timeline-list" ref={listRef}><div className="timeline-track"><i /></div>{days.map((item, i) => <article className="timeline-item" key={item.day}><div className="timeline-date"><span>{item.day}</span><strong>{item.date}</strong></div><div className="timeline-marker"><i>{String(i+1).padStart(2,'0')}</i></div><div className="timeline-content"><div className="timeline-top"><h3>{item.title}</h3><span>{item.tag}</span></div><ul>{item.items.map((x, j) => <li key={j}>{x}</li>)}</ul></div></article>)}</div>
    </section>}
    {page === 'wings' && <section className="wings section-pad full" id="wings">
      <div className="section-label"><span>03</span> / THE PEOPLE & THE PRACTICE</div><div className="section-head wings-head"><h2>Two wings.<br/><span>Infinite possibilities.</span></h2><p>Pick up new skills, work through challenges and discover the kind of technology you want to create.</p></div>
      <div className="wing-grid">{wings.map(w => <article className="wing-card" key={w.code}><div className="wing-card-top"><span>CSS / WING {w.num}</span><span className="wing-badge"><img src={L+'css.png'} alt="Computer Science Society" /></span></div><div className="wing-code">{w.code}</div><h3>{w.name}</h3><p>{w.detail}</p><div className="wing-card-bottom"><span>DEV SUMMIT 2026</span><span>PHASE 01</span></div></article>)}</div>
    </section>}
    {page === 'workshops' && <section className="workshops section-pad full" id="workshops">
      <div className="section-label"><span>04</span> / WHY JOIN</div><div className="workshop-grid"><div><h2>Don’t just<br/><span>watch tech.</span><br/>Get hands-on.</h2><p className="workshop-desc">Whether you’re writing your first line of HTML or exploring how models learn, Phase 1 gives you a practical place to start.</p><a className="outline-button" href="#/timeline">VIEW THE SCHEDULE <span>↗</span></a></div><div className="benefits"><article><span>01</span><div><h3>Learn by doing</h3><p>Build foundational skills in HTML, CSS and JavaScript with guided sessions.</p></div></article><article><span>02</span><div><h3>Meet your tools</h3><p>Get comfortable with React, Linux scripting, Git and GitHub workflows.</p></div></article><article><span>03</span><div><h3>Think beyond code</h3><p>Scrape data, train a model, tune it and deploy it with Streamlit.</p></div></article><article><span>04</span><div><h3>Find your people</h3><p>Learn alongside fellow students, share ideas and grow your network.</p></div></article></div></div>
    </section>}
    {page === 'outcomes' && <section className="outcomes section-pad full">
      <div className="outcomes-title"><div className="section-label"><span>05</span> / TAKE IT WITH YOU</div><h2>Leave with<br/><span>momentum.</span></h2><p>By the end of Phase 1, you’ll have a clearer path into the tech ecosystem and a toolkit to keep learning.</p></div>
      <div className="outcomes-list">{outcomes.map((o,i)=><div className="outcome-row" key={o}><span>{String(i+1).padStart(2,'0')}</span><p>{o}</p><b>↗</b></div>)}</div>
    </section>}
    {page === 'events' && <EventsPage />}
    {page === 'register' && <Register key={route.param} eventId={route.param} />}
    {page === 'admin' && <Admin />}
    <footer className="footer"><div className="footer-top"><div className="footer-brand"><div className="brand-mark">D<span>/</span>S</div><div><strong>DEV SUMMIT 2026</strong><p>PHASE 01 · 04—06 NOVEMBER</p></div></div><a href="#/home" className="back-top">BACK TO TOP ↑</a></div><div className="footer-logos"><img src={L+'css.png'} alt="Computer Science Society" /></div><div className="footer-bottom"><span>ORGANISED BY COMPUTER SCIENCE SOCIETY, NIT SILCHAR</span><span>BUILD / CONNECT / INSPIRE</span><span>© 2026 DEV SUMMIT</span><a href="#/admin" className="footer-admin">ADMIN</a></div></footer>
  </main>
}
export default App

import {
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import Loader from "./Loader.jsx";
import Admin from "./Admin.jsx";
import LandingPage from "./components/landing/LandingPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import useTimelineProgress from "./hooks/useTimelineProgress.js";
import "./styles.css";

const L = "/assets/logos/";

const nav = [
  ["overview", "Overview"],
  ["timeline", "Timeline"],
  ["wings", "Wings"],
  ["workshops", "Workshops"],
  ["outcomes", "Outcomes"],
  ["events", "Events"],
];
const sections = nav.map((n) => n[0]);
// Landing sections (#/overview, #/timeline, ...) are all part of the single scrolling 'home' page; only register and admin are separate routes.
const parse = (h = location.hash) => {
  const [p, q] = h.replace(/^#\/?/, "").split("/");
  return p === "register" || p === "admin"
    ? { page: p, section: "", param: q || "" }
    : { page: "home", section: sections.includes(p) ? p : "", param: "" };
};
const jumpTo = (top) => {
  try {
    window.scrollTo({ top, left: 0, behavior: "instant" });
  } catch {
    window.scrollTo(0, top);
  }
};
const sectionTop = (k) => {
  const el = document.getElementById(k || "home");
  return el ? Math.max(0, el.getBoundingClientRect().top + window.scrollY) : 0;
};

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [route, setRoute] = useState(parse);
  const page = route.page;
  const [active, setActive] = useState("");
  const routeRef = useRef(route);
  routeRef.current = route;
  const holdRef = useRef(0);
  const spyRef = useRef(null);
  // After the loader, re-align a deep link (e.g. #/events) in case fonts/images shifted the layout while it was covered.
  const done = useCallback(() => {
    setLoading(false);
    const r = routeRef.current;
    if (r.page === "home" && r.section) jumpTo(sectionTop(r.section));
  }, []);
  const listRef = useRef(null);
  const prevPage = useRef(null);
  useTimelineProgress(listRef, page);
  // While a nav-triggered smooth scroll is in flight, keep the clicked item highlighted instead of flickering through every section on the way.
  const hold = () => {
    clearTimeout(holdRef.current);
    holdRef.current = setTimeout(() => {
      holdRef.current = 0;
      spyRef.current && spyRef.current();
    }, 250);
  };
  useEffect(() => {
    const f = () => setRoute(parse());
    window.addEventListener("hashchange", f);
    return () => window.removeEventListener("hashchange", f);
  }, []);
  // Route change: register/admin open at the top; landing sections scroll into view (smoothly when already on the landing page, instantly when arriving from another route).
  useLayoutEffect(() => {
    const from = prevPage.current;
    prevPage.current = page;
    if (page !== "home") {
      setActive("");
      jumpTo(0);
      return;
    }
    const top = sectionTop(route.section);
    setActive(route.section);
    if (from === "home") {
      hold();
      window.scrollTo({ top, left: 0, behavior: "auto" });
    } else jumpTo(top);
  }, [route]);
  // Scroll-spy: highlight the nav item for the section on screen and keep the URL hash in step with it.
  useEffect(() => {
    if (page !== "home") return;
    let raf = 0;
    const compute = () => {
      raf = 0;
      const line = window.innerHeight * 0.35;
      let cur = "";
      for (const k of sections) {
        const el = document.getElementById(k);
        if (el && el.getBoundingClientRect().top <= line) cur = k;
      }
      setActive(cur);
      const now = parse();
      if (now.page === "home" && now.section !== cur)
        history.replaceState(
          null,
          "",
          cur ? "#/" + cur : location.pathname + location.search,
        );
    };
    const req = () => {
      if (holdRef.current) hold();
      else if (!raf) raf = requestAnimationFrame(compute);
    };
    spyRef.current = compute;
    compute();
    window.addEventListener("scroll", req, { passive: true });
    window.addEventListener("resize", req);
    return () => {
      window.removeEventListener("scroll", req);
      window.removeEventListener("resize", req);
      cancelAnimationFrame(raf);
      clearTimeout(holdRef.current);
      holdRef.current = 0;
      spyRef.current = null;
    };
  }, [page]);
  // Clicking a link to the section that is already in the URL fires no hashchange, so scroll to it directly.
  const onMainClick = (e) => {
    if (
      e.defaultPrevented ||
      e.button ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      page !== "home"
    )
      return;
    const a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute("href");
    const t = parse(href);
    if (href !== location.hash || t.page !== "home") return;
    e.preventDefault();
    setActive(t.section);
    hold();
    window.scrollTo({ top: sectionTop(t.section), left: 0, behavior: "auto" });
  };
  const landing = page === "home";
  return (
    <main onClick={onMainClick}>
      {loading && <Loader onDone={done} />}
      <header className="nav">
        <a className="brand" href="#home" aria-label="Dev Summit home">
          <span className="brand-mark">
            D<span>/</span>S
          </span>
          <span className="brand-copy">
            DEV SUMMIT<small>2026 · PHASE 01</small>
          </span>
        </a>
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          {menuOpen ? "CLOSE −" : "MENU +"}
        </button>
        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          {nav.map(([k, t]) => (
            <a
              key={k}
              href={"#/" + k}
              className={landing && active === k ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              {t}
            </a>
          ))}
          <a
            className="nav-cta"
            href="#/register"
            onClick={() => setMenuOpen(false)}
          >
            Register ↗
          </a>
        </nav>
      </header>
      {landing && <LandingPage listRef={listRef} />}
      {page === "register" && (
        <RegisterPage key={route.param} eventId={route.param} />
      )}
      {page === "admin" && <Admin />}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="brand-mark">
              D<span>/</span>S
            </div>
            <div>
              <strong>DEV SUMMIT 2026</strong>
              <p>PHASE 01 · 04—06 NOVEMBER</p>
            </div>
          </div>
          <a href="#/home" className="back-top">
            BACK TO TOP ↑
          </a>
        </div>
        <div className="footer-logos">
          <img src={L + "css.png"} alt="Computer Science Society" />
        </div>
        <div className="footer-bottom">
          <span>ORGANISED BY COMPUTER SCIENCE SOCIETY, NIT SILCHAR</span>
          <span>BUILD / CONNECT / INSPIRE</span>
          <span>© 2026 DEV SUMMIT</span>
          <a href="#/admin" className="footer-admin">
            ADMIN
          </a>
        </div>
      </footer>
    </main>
  );
}
export default App;

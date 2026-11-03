import { NAV_ITEMS } from "../../utils/navigation.js";

export default function SiteHeader({
  active,
  isLandingPage,
  user,
  menuOpen,
  onMenuToggle,
  onNavigate,
}) {
  return (
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
        onClick={onMenuToggle}
        aria-label="Toggle navigation"
        aria-expanded={menuOpen}
      >
        {menuOpen ? "CLOSE −" : "MENU +"}
      </button>
      <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
        {NAV_ITEMS.map(([section, title]) => (
          <a
            key={section}
            href={"#/" + section}
            className={
              isLandingPage && active === section ? "active" : ""
            }
            onClick={onNavigate}
          >
            {title}
          </a>
        ))}
        <a
          className="nav-cta"
          href={user ? "#/profile" : "#/register"}
          onClick={onNavigate}
        >
          {user ? "Profile ↗" : "Register ↗"}
        </a>
      </nav>
    </header>
  );
}

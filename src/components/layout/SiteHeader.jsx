import { NAV_ITEMS } from "../../utils/navigation.js";
import { WHATSAPP_COMMUNITY_URL } from "../landing/landingData.js";

export default function SiteHeader({
  active,
  isLandingPage,
  user,
  menuOpen,
  onMenuToggle,
  onNavigate,
  onSignOut,
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
        {/* Registration button commented out - replaced with Join Now */}
        {/* {!user ? (
          <a className="nav-cta" href="#/register" onClick={onNavigate}>
            Register ↗
          </a>
        ) : (
          <>
            <a className="nav-cta" href="#/events" onClick={onNavigate}>
              {user.name}
            </a>
            <button
              className="nav-account"
              onClick={() => {
                onNavigate();
                onSignOut();
              }}
              type="button"
            >
              Sign out
            </button>
          </>
        )} */}
        <a
          className="nav-cta"
          href={WHATSAPP_COMMUNITY_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onNavigate}
        >
          JOIN NOW ↗
        </a>
      </nav>
    </header>
  );
}

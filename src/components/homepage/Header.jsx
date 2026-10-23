import summitLogo from "../../assets/dev-summit-logo-cutout.png";

function Header() {
  return (
    <header className="devfest-header">
      <div className="devfest-header__bar">
        <a className="devfest-brand" href="#" aria-label="DEV SUMMIT 2026 home">
          <img
            className="devfest-brand__logo"
            src={summitLogo}
            alt="DEV SUMMIT 2026"
          />
        </a>

        <nav className="devfest-nav" aria-label="Main">
          <a href="#">About</a>
          <a href="#">Events</a>
          <a href="#">Speakers</a>
          <a href="#">Poster</a>
          <a className="devfest-button devfest-button--solid" href="#">
            REGISTER
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Header;

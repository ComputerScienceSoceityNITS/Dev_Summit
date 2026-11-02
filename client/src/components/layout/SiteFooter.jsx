import { LOGO_DIRECTORY } from "../landing/landingData.js";

export default function SiteFooter() {
  return (
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
        <img
          src={LOGO_DIRECTORY + "css.png"}
          alt="Computer Science Society"
        />
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
  );
}

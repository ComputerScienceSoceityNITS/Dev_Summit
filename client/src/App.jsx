import { useState } from "react";
import Loader from "./components/common/Loader.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import LandingPage from "./components/landing/LandingPage.jsx";
import SiteFooter from "./components/layout/SiteFooter.jsx";
import SiteHeader from "./components/layout/SiteHeader.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import useAppNavigation from "./hooks/useAppNavigation.js";
import "./styles.css";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const {
    active,
    finishLoading,
    handleMainClick,
    isLandingPage,
    listRef,
    loading,
    page,
    route,
  } = useAppNavigation();

  return (
    <main onClick={handleMainClick}>
      {loading && <Loader onDone={finishLoading} />}
      <SiteHeader
        active={active}
        isLandingPage={isLandingPage}
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen(!menuOpen)}
        onNavigate={() => setMenuOpen(false)}
      />
      {isLandingPage && <LandingPage listRef={listRef} />}
      {page === "register" && (
        <RegisterPage key={route.param} eventId={route.param} />
      )}
      {page === "admin" && <AdminPage />}
      <SiteFooter />
    </main>
  );
}

export default App;

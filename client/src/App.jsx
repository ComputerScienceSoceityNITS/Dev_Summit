import { useState } from "react";
import Loader from "./components/common/Loader.jsx";
import LandingPage from "./components/landing/LandingPage.jsx";
import SiteFooter from "./components/layout/SiteFooter.jsx";
import SiteHeader from "./components/layout/SiteHeader.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import useAppNavigation from "./hooks/useAppNavigation.js";
import { useAuth } from "./context/AuthContext.jsx";
import "./styles.css";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [signOutError, setSignOutError] = useState("");
  const { user, error: authError, signOut } = useAuth();
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

  const handleSignOut = async () => {
    setSignOutError("");
    try {
      await signOut();
    } catch (error) {
      setSignOutError(error.message);
    }
  };

  return (
    <main onClick={handleMainClick}>
      {loading && <Loader onDone={finishLoading} />}
      <SiteHeader
        active={active}
        isLandingPage={isLandingPage}
        user={user}
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen(!menuOpen)}
        onNavigate={() => setMenuOpen(false)}
        onSignOut={handleSignOut}
      />
      {(authError || signOutError) && (
        <p className="ev-note" role="alert">
          {signOutError || `Account status is unavailable: ${authError}`}
        </p>
      )}
      {isLandingPage && <LandingPage listRef={listRef} />}
      {page === "register" && (
        <RegisterPage key={route.param} eventId={route.param} />
      )}
      <SiteFooter />
    </main>
  );
}

export default App;

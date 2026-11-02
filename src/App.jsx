import { useState } from "react";
import Loader from "./components/common/Loader.jsx";
import LandingPage from "./components/landing/LandingPage.jsx";
import SiteFooter from "./components/layout/SiteFooter.jsx";
import SiteHeader from "./components/layout/SiteHeader.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import useAppNavigation from "./hooks/useAppNavigation.js";
import { useAuth } from "./context/AuthContext.jsx";
import "./styles.css";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [signOutError, setSignOutError] = useState("");
  const {
    user,
    loading: authLoading,
    error: authError,
    signOut,
  } = useAuth();
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
      window.location.hash = "#home";
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
      />
      {(authError || signOutError) && (
        <p className="ev-note" role="alert">
          {signOutError || `Account status is unavailable: ${authError}`}
        </p>
      )}
      {isLandingPage && <LandingPage listRef={listRef} user={user} />}
      {page === "register" && (
        <RegisterPage key={route.param} eventId={route.param} />
      )}
      {page === "profile" && (
        <ProfilePage
          authLoading={authLoading}
          user={user}
          onSignOut={handleSignOut}
        />
      )}
      <SiteFooter />
    </main>
  );
}

export default App;

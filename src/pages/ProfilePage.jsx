import { useState } from "react";
import ProfileDetails from "../components/profile/ProfileDetails.jsx";
import RegisteredEvents from "../components/profile/RegisteredEvents.jsx";
import useProfilePage from "../hooks/useProfilePage.js";

export default function ProfilePage({ authLoading, user, onSignOut }) {
  const { error, loadRegistrations, loading, registrations } = useProfilePage({
    authLoading,
    user,
  });
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    await onSignOut();
    setSigningOut(false);
  };

  return (
    <section className="profile-page section-pad full">
      <div className="profile-header">
        <div>
          <div className="section-label">
            <span>→</span> / YOUR PROFILE
          </div>
          <h2>
            Your <span>profile.</span>
          </h2>
        </div>
        {user && (
          <button
            className="reg-btn"
            type="button"
            disabled={signingOut}
            onClick={handleSignOut}
          >
            {signingOut ? "Signing out…" : "Log out"}
          </button>
        )}
      </div>

      {authLoading ? (
        <p className="profile-message" role="status">
          Checking your account…
        </p>
      ) : user ? (
        <div className="profile-content">
          <ProfileDetails user={user} />
          <RegisteredEvents
            error={error}
            loading={loading}
            onRetry={loadRegistrations}
            registrations={registrations}
          />
        </div>
      ) : (
        <div className="profile-panel profile-signed-out">
          <h3>You’re signed out.</h3>
          <p>Sign in to view your account details and registered events.</p>
          <a className="reg-btn" href="#/register">
            Sign in or register
          </a>
        </div>
      )}
    </section>
  );
}

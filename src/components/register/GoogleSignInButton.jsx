import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";

const GOOGLE_CLIENT_ID_PATTERN =
  /^\d+-[A-Za-z0-9_-]+\.apps\.googleusercontent\.com$/;

export default function GoogleSignInButton({ disabled, onCredential }) {
  const [error, setError] = useState("");
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const hasValidClientId = GOOGLE_CLIENT_ID_PATTERN.test(clientId || "");

  if (!hasValidClientId) {
    return (
      <p className="google-signin-note" role="alert">
        Google sign-in isn’t configured. Replace the sample value for
        {" "}
        <code>VITE_GOOGLE_CLIENT_ID</code> in the frontend{" "}
        <code>.env</code> file with your Google OAuth Web client ID, then
        restart the frontend.
      </p>
    );
  }

  return (
    <div className={`google-signin ${disabled ? "is-disabled" : ""}`}>
      {disabled && <span className="google-signin-busy">Signing in…</span>}
      <GoogleLogin
        onSuccess={({ credential }) => {
          if (credential) {
            setError("");
            onCredential(credential);
          } else {
            setError("Google did not return a sign-in credential.");
          }
        }}
        onError={() => {
          setError("Google sign-in failed or was cancelled. Please try again.");
        }}
        theme="outline"
        size="large"
        shape="pill"
        text="continue_with"
        logo_alignment="left"
        width="320"
        auto_select={false}
        useOneTap={false}
      />
      {error && (
        <p className="google-signin-note" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api, setAuthToken } from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshUser = useCallback(async () => {
    try {
      const { user: currentUser } = await api.me();
      setUser(currentUser);
      setError("");
      return currentUser;
    } catch (requestError) {
      if (requestError.status === 401) {
        setUser(null);
        setError("");
        return null;
      }

      setError(requestError.message);
      throw requestError;
    }
  }, []);

  useEffect(() => {
    let active = true;

    api
      .me()
      .then(({ user: currentUser }) => {
        if (active) setUser(currentUser);
      })
      .catch((requestError) => {
        if (active && requestError.status !== 401) {
          setError(requestError.message);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const signIn = useCallback((signedInUser) => {
    setUser(signedInUser);
    setError("");
  }, []);

  const signOut = useCallback(async () => {
    try {
      await api.logout();
      setAuthToken("");
      setUser(null);
      setError("");
    } catch (requestError) {
      if (requestError.status === 401) {
        setAuthToken("");
        setUser(null);
        setError("");
        return;
      }
      throw requestError;
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      signIn,
      signOut,
      refreshUser,
    }),
    [user, loading, error, signIn, signOut, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return context;
}
